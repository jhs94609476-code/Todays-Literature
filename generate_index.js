const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, 'src/content/posts');
const outputFile = path.join(__dirname, 'posts-index.md');

// 정확한 작가 / 인물 매핑
const authorMapping = {
  'alain-de-botton_status-anxiety.md': '알랭 드 보통',
  'albert-camus_l-etranger.md': '알베르 카뮈',
  'alexandre-dumas_count-of-monte-cristo.md': '알렉상드르 뒤마',
  'andy-weir_martian.md': '앤디 위어',
  'arthur-schopenhauer_wisdom.md': '아르투어 쇼펜하우어',
  'baek-seok_natasha-white-donkey.md': '백석',
  'baruch-spinoza_ethica.md': '바뤼흐 스피노자',
  'bernard-werber_ants.md': '베르나르 베르베르',
  'bob-dylan_knockin-on-heavens-door.md': '밥 딜런',
  'cho-se-hui_dwarf-ball.md': '조세희',
  'emily-bronte_wuthering-heights.md': '에밀리 브론테',
  'epicurus_ataraxia.md': '에피쿠로스',
  'erich-fromm_to-have-or-to-be.md': '에리히 프롬',
  'ernest-hemingway_old-man-and-sea.md': '어니스트 헤밍웨이',
  'f-scott-fitzgerald_great-gatsby.md': 'F. 스콧 피츠제럴드',
  'franz-kafka_metamorphosis.md': '프란츠 카프카',
  'friedrich-nietzsche_thus-spoke-zarathustra.md': '프리드리히 니체',
  'fyodor-dostoevsky_crime-and-punishment.md': '표도르 도스토옙스키',
  'george-orwell_1984.md': '조지 오웰',
  'george-orwell_animal-farm.md': '조지 오웰',
  'han-kang_human-acts.md': '한강',
  'han-kang_vegetarian.md': '한강',
  'hannah-arendt_banality-of-evil.md': '한나 아렌트',
  'henrik-ibsen_a-dolls-house.md': '헨릭 입센',
  'henry-david-thoreau_walden.md': '헨리 데이비드 소로',
  'hermann-hesse_demian.md': '헤르만 헤세',
  'hermann-hesse_siddhartha.md': '헤르만 헤세',
  'jared-diamond_guns-germs-steel.md': '재레드 다이아몬드',
  'jean-paul-sartre_nausea.md': '장 폴 사르트르',
  'johann-wolfgang-von-goethe_faust.md': '요한 볼프강 폰 괴테',
  'karl-marx_das-kapital.md': '카를 마르크스',
  'kim-su-young_grass.md': '김수영',
  'kim-young-ha_memoir-of-a-murderer.md': '김영하',
  'laozi_taoteching.md': '노자',
  'lee-cheong-jun_your-paradise.md': '이청준',
  'leo-tolstoy_short-stories.md': '레프 톨스토이',
  'march-for-the-beloved.md': '백기완 / 김종률',
  'marcus-aurelius_meditations.md': '마르쿠스 아우렐리우스',
  'michael-sandel_justice.md': '마이클 샌델',
  'michel-de-montaigne_essays.md': '미셸 드 몽테뉴',
  'milan-kundera_unbearable-lightness.md': '밀란 쿤데라',
  'niccolo-machiavelli_prince.md': '니콜로 마키아벨리',
  'park-kyung-ni_land.md': '박경리',
  'paulo-coelho_alchemist.md': '파울로 코엘료',
  'plato_republic.md': '플라톤',
  'rene-descartes_discourse-on-method.md': '르네 데카르트',
  'ruth-defries_civilization-and-food.md': '루스 디프리스',
  'sigmund-freud_interpretation-of-dreams.md': '지그문트 프로이트',
  'somerset-maugham_moon-and-sixpence.md': '서머싯 몸',
  'stephen-king_green-mile.md': '스티븐 킹',
  'viktor-frankl_search-for-meaning.md': '빅터 프랭클',
  'walter-benjamin_work-of-art.md': '발터 벤야민',
  'yi-sang_the-wings.md': '이상',
  'yun-dong-ju_prelude.md': '윤동주',
  'yuval-noah-harari_sapiens.md': '유발 하라리',
  'zhuangzi_zhuangzi-dream.md': '장자'
};

const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md')).sort();

const posts = [];

files.forEach(file => {
  const filePath = path.join(postsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const metadata = {};
  if (match) {
    match[1].split('\n').forEach(line => {
      const col = line.indexOf(':');
      if (col !== -1) {
        const key = line.substring(0, col).trim();
        const val = line.substring(col + 1).trim();
        metadata[key] = val;
      }
    });
  }

  let title = (metadata.title || '').replace(/^['"]|['"]$/g, '').trim();
  let category = (metadata.category || '').replace(/^['"]|['"]$/g, '').trim();
  let author = authorMapping[file] || (metadata.author || '').replace(/^['"]|['"]$/g, '').trim();

  // Clean title: replace pipes with dashes to avoid breaking markdown tables
  title = title.replace(/\|/g, '-');

  posts.push({
    file,
    category,
    author,
    title
  });
});

// 카테고리 우선순위 정렬 후 파일명 가나다순 정렬
const categoryOrder = {
  '문학, 시': 1,
  '철학, 사상': 2,
  '현대 에세이, 삶': 3,
  '음악, 역사': 4,
  '시대의 거장들': 5
};

posts.sort((a, b) => {
  const orderA = categoryOrder[a.category] || 99;
  const orderB = categoryOrder[b.category] || 99;
  if (orderA !== orderB) return orderA - orderB;
  return a.file.localeCompare(b.file);
});

// Markdown content generation
let md = `# 포스팅 마스터 인덱스 (Posts Master Index)\n\n`;
md += `> 총 **${posts.length}편**의 인문학·문학·철학·에세이 포스트가 수록되어 있습니다.\n`;
md += `> 마지막 업데이트: ${new Date().toISOString().split('T')[0]}\n\n`;

md += `### 카테고리별 통계\n`;
const stats = {};
posts.forEach(p => {
  stats[p.category] = (stats[p.category] || 0) + 1;
});
Object.keys(stats).forEach(cat => {
  md += `- **${cat}**: ${stats[cat]}편\n`;
});
md += `\n---\n\n`;

md += `## 전체 포스팅 목록\n\n`;
md += `| 번호 | 카테고리 | 작가 / 인물 | 글 제목 | 마크다운 파일명 |\n`;
md += `| :---: | :--- | :--- | :--- | :--- |\n`;

posts.forEach((post, index) => {
  const num = index + 1;
  md += `| ${num} | ${post.category} | ${post.author} | ${post.title} | \`${post.file}\` |\n`;
});

fs.writeFileSync(outputFile, md, 'utf8');
console.log(`Successfully generated ${outputFile} with ${posts.length} posts.`);
