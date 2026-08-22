const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, 'src/content/posts');
const authorsDir = path.join(__dirname, 'public/images/authors');
const outputFile = path.join(__dirname, 'src/data/posts.json');

console.log("Checking posts directory:", postsDir);

if (!fs.existsSync(postsDir)) {
  console.error("Posts directory does not exist!");
  process.exit(1);
}

const authorImageFiles = fs.existsSync(authorsDir) ? fs.readdirSync(authorsDir) : [];

function getAuthorImage(slug) {
  const authorPart = slug.split('_')[0]; // e.g. "alain-de-botton"

  function normalize(str) {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');
  }

  const normAuthor = normalize(authorPart);

  for (const file of authorImageFiles) {
    const nameWithoutExt = file.replace(/\.(jpg|jpeg|png|webp|jpg\.jpeg)$/i, '');
    const normFile = normalize(nameWithoutExt);

    // 1. Direct or normalized match
    if (normAuthor === normFile) {
      return `/images/authors/${file}`;
    }
    // 2. Substring match
    if (normFile.includes(normAuthor) || normAuthor.includes(normFile)) {
      return `/images/authors/${file}`;
    }
    // 3. Prefix match (for slight spelling variations like friedrich-nietzsche vs friedrich-nietze)
    if (normAuthor.length >= 5 && normFile.length >= 5) {
      if (normAuthor.slice(0, 7) === normFile.slice(0, 7)) {
        return `/images/authors/${file}`;
      }
    }
  }
  return null;
}

const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
const posts = [];

files.forEach((file, index) => {
  const filePath = path.join(postsDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Extract YAML front-matter and content
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (match) {
    const yamlBlock = match[1];
    const bodyText = match[2].trim();
    
    // Parse metadata key-values
    const metadata = {};
    yamlBlock.split('\n').forEach(line => {
      const colIndex = line.indexOf(':');
      if (colIndex !== -1) {
        const key = line.substring(0, colIndex).trim();
        let value = line.substring(colIndex + 1).trim();
        metadata[key] = value;
      }
    });
    
    // 1. Slug & ID: Always strictly use markdown filename without .md (e.g., 'han-kang_human-acts')
    const slug = file.replace(/\.md$/i, '').trim();
    const id = slug;
    
    // Extract & normalize category string (remove surrounding quotes/spaces)
    let category = metadata.category || '시대의 거장들';
    category = category.replace(/^["']|["']$/g, '').trim();

    // Map variations of markdown categories into exact application mapping names
    if (category === '역사, 인문학' || category === '음악, 역사') {
      category = '음악, 역사';
    } else if (category === '문학, 시' || category === '문학/시' || category === '문학') {
      category = '문학, 시';
    } else if (category === '철학, 사상' || category === '철학/사상' || category === '철학') {
      category = '철학, 사상';
    } else if (category === '현대 에세이, 삶' || category === '에세이' || category === '현대 에세이') {
      category = '현대 에세이, 삶';
    } else if (category === '시대의 거장들' || category === '세기의 거장들' || category === '거장들') {
      category = '시대의 거장들';
    } else {
      category = '시대의 거장들';
    }
    
    // Auto-match author image if available, else assign fallback category banner
    const authorImg = getAuthorImage(slug);
    const imageFromMeta = metadata.image ? metadata.image.replace(/^["']|["']$/g, '').trim() : null;
    let coverImage = imageFromMeta || authorImg;
    if (!coverImage) {
      coverImage = '/images/hero_library.png';
      if (category === '철학, 사상') coverImage = '/images/cat_philosophy.png';
      else if (category === '문학, 시') coverImage = '/images/cat_poetry.png';
      else if (category === '음악, 역사') coverImage = '/images/cat_history.png';
      else if (category === '현대 에세이, 삶') coverImage = '/images/cat_essay.png';
      else if (category === '시대의 거장들') coverImage = '/images/cat_masters.png';
    }

    const date = metadata.date || `2026-07-${String(Math.max(1, 30 - index)).padStart(2, '0')}`;
    const author = metadata.author || (category === '시대의 거장들' ? '거장 편집부' : '인문학 편집부');

    posts.push({
      id: id,
      slug: slug,
      category: category,
      title: metadata.title || '제목 없음',
      author: author,
      date: date,
      coverImage: coverImage,
      excerpt: metadata.summary || metadata.excerpt || '',
      summary: metadata.summary || metadata.excerpt || '',
      keywords: metadata.keywords || '',
      bodyText: bodyText
    });
  }
});

// Write to posts.json
fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2), 'utf-8');
console.log(`Successfully generated ${posts.length} posts inside ${outputFile}`);
