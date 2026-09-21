/**
 * sync-sheets.js
 *
 * 구글 스프레드시트 공개 CSV를 가져와 src/content/posts/ 폴더에 .md 파일로 동기화합니다.
 *
 * 사용법:
 *   node scripts/sync-sheets.js
 *
 * 컬럼 구조:
 *   A열 (슬러그): 파일명으로 사용될 영문 슬러그
 *   B열 (카테고리): 카테고리명 (Frontmatter의 category 필드에 우선 적용)
 *   C열 (원고): --- Frontmatter부터 본문 전문
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// ─── 설정 ──────────────────────────────────────────────────────────────────
const SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vStAETGqwhy2ux_FQAzPeS_bPUu_pIk_F7n79vO7LKCgAZ1KYHnqJ37WX5c2Higqtzx8gG6HBq7zouS/pub?gid=1096647995&single=true&output=csv';

const POSTS_DIR = path.join(__dirname, '..', 'src', 'content', 'posts');

// ─── 유틸: HTTP(S) GET → 문자열 반환 ─────────────────────────────────────
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error('HTTP ' + res.statusCode + ': ' + url));
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
      res.on('error', reject);
    }).on('error', reject);
  });
}

// ─── 유틸: RFC 4180 CSV 파서 ──────────────────────────────────────────────
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  let i = 0;

  if (text.charCodeAt(0) === 0xFEFF) {
    text = text.slice(1);
  }

  while (i < text.length) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i += 2;
      } else if (ch === '"') {
        inQuotes = false;
        i++;
      } else {
        field += ch;
        i++;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
        i++;
      } else if (ch === ',') {
        row.push(field);
        field = '';
        i++;
      } else if (ch === '\r' && next === '\n') {
        row.push(field);
        rows.push(row);
        row = [];
        field = '';
        i += 2;
      } else if (ch === '\n') {
        row.push(field);
        rows.push(row);
        row = [];
        field = '';
        i++;
      } else {
        field += ch;
        i++;
      }
    }
  }

  if (field || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

// ─── 유틸: Frontmatter category 필드를 B열 값으로 치환 ───────────────────
function syncCategory(manuscript, categoryFromSheet) {
  const fmMatch = manuscript.match(/^(---\r?\n)([\s\S]*?)(\r?\n---\r?\n)([\s\S]*)$/);
  if (!fmMatch) {
    return manuscript;
  }

  const openDelim  = fmMatch[1];
  let fmBlock      = fmMatch[2];
  const closeDelim = fmMatch[3];
  const body       = fmMatch[4];

  const quotedCategory = '"' + categoryFromSheet + '"';

  if (/^category\s*:/m.test(fmBlock)) {
    fmBlock = fmBlock.replace(/^(category\s*:).*$/m, '$1 ' + quotedCategory);
  } else {
    fmBlock = fmBlock + '\ncategory: ' + quotedCategory;
  }

  return openDelim + fmBlock + closeDelim + body;
}

// ─── 메인 동기화 로직 ─────────────────────────────────────────────────────
async function syncSheets() {
  console.log('━'.repeat(60));
  console.log('Google Sheets CSV 동기화 시작');
  console.log('URL: ' + SHEET_CSV_URL);
  console.log('━'.repeat(60));

  let csvText;
  try {
    csvText = await fetchUrl(SHEET_CSV_URL);
    console.log('CSV 다운로드 완료 (' + (csvText.length / 1024).toFixed(1) + ' KB)');
  } catch (err) {
    console.error('CSV 다운로드 실패:', err.message);
    process.exit(1);
  }

  const rows = parseCSV(csvText);
  if (rows.length < 2) {
    console.error('CSV에 데이터 행이 없습니다.');
    process.exit(1);
  }

  const header   = rows[0];
  const dataRows = rows.slice(1);
  console.log('헤더: [' + header.join(', ') + ']');
  console.log('데이터 행 수: ' + dataRows.length);
  console.log('');

  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
    console.log('포스트 디렉터리 생성: ' + POSTS_DIR);
  }

  let successCount = 0;
  let skippedCount = 0;
  let errorCount   = 0;

  dataRows.forEach((cols, idx) => {
    const rowNum     = idx + 2;
    const slug       = (cols[0] || '').trim();
    const category   = (cols[1] || '').trim();
    const manuscript = (cols[2] || '').trim();

    if (!slug || !manuscript) {
      console.log('[행 ' + rowNum + '] 건너뜀 (슬러그 또는 원고 비어있음)');
      skippedCount++;
      return;
    }

    try {
      const syncedContent = category ? syncCategory(manuscript, category) : manuscript;
      const filePath = path.join(POSTS_DIR, slug + '.md');
      fs.writeFileSync(filePath, syncedContent, 'utf-8');
      console.log('[행 ' + String(rowNum).padStart(3) + '] ' + slug + '.md  카테고리: ' + (category || '(없음)'));
      successCount++;
    } catch (err) {
      console.error('[행 ' + rowNum + '] ' + slug + '.md 저장 실패:', err.message);
      errorCount++;
    }
  });

  console.log('');
  console.log('━'.repeat(60));
  console.log('동기화 완료!');
  console.log('  성공: ' + successCount + '개');
  console.log('  건너뜀: ' + skippedCount + '개');
  if (errorCount > 0) {
    console.log('  오류: ' + errorCount + '개');
  }
  console.log('  저장 위치: ' + POSTS_DIR);
  console.log('━'.repeat(60));

  if (errorCount > 0) {
    process.exit(1);
  }
}

syncSheets().catch((err) => {
  console.error('예상치 못한 오류:', err);
  process.exit(1);
});
