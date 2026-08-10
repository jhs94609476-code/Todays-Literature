const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, 'src/content/posts');

// 파일명 일괄 변경 매핑 (작가 풀네임 + 도서 제목 형태: 작가풀네임_도서명.md)
const renameMap = {
  'andy-weir-martian.md': 'andy-weir_martian.md',
  'arendt-banality-of-evil.md': 'hannah-arendt_banality-of-evil.md',
  'aurelius-meditations.md': 'marcus-aurelius_meditations.md',
  'bernard-ants.md': 'bernard-werber_ants.md',
  'camus-l-etranger.md': 'albert-camus_l-etranger.md',
  'coelho-alchemist.md': 'paulo-coelho_alchemist.md',
  'count-of-monte-cristo.md': 'alexandre-dumas_count-of-monte-cristo.md',
  'courage-to-be-disliked.md': 'ruth-defries_civilization-and-food.md',
  'de-botton-status-anxiety.md': 'alain-de-botton_status-anxiety.md',
  'descartes-discourse-on-method.md': 'rene-descartes_discourse-on-method.md',
  'diamond-guns-germs-steel.md': 'jared-diamond_guns-germs-steel.md',
  'dostoevsky-crime-and-punishment.md': 'fyodor-dostoevsky_crime-and-punishment.md',
  'epicurus-ataraxia.md': 'epicurus_ataraxia.md',
  'fromm-to-have-or-to-be.md': 'erich-fromm_to-have-or-to-be.md',
  'george-orwell-1984.md': 'george-orwell_1984.md',
  'goethe-faust.md': 'johann-wolfgang-von-goethe_faust.md',
  'great-gatsby.md': 'f-scott-fitzgerald_great-gatsby.md',
  'green-mile.md': 'stephen-king_green-mile.md',
  'harari-sapiens.md': 'yuval-noah-harari_sapiens.md',
  'hemingway-old-man-and-sea.md': 'ernest-hemingway_old-man-and-sea.md',
  'hesse-demian.md': 'hermann-hesse_demian.md',
  'hesse-siddhartha.md': 'hermann-hesse_siddhartha.md',
  'kafka-metamorphosis.md': 'franz-kafka_metamorphosis.md',
  'laozi-taoteching.md': 'laozi_taoteching.md',
  'machiavelli-prince.md': 'niccolo-machiavelli_prince.md',
  'maugham-moon-and-sixpence.md': 'somerset-maugham_moon-and-sixpence.md',
  'orwell-animal-farm.md': 'george-orwell_animal-farm.md',
  'plato-republic.md': 'plato_republic.md',
  'sandel-justice.md': 'michael-sandel_justice.md',
  'schopenhauer-wisdom.md': 'arthur-schopenhauer_wisdom.md',
  'spinoza-ethica.md': 'baruch-spinoza_ethica.md',
  'thoreau-walden.md': 'henry-david-thoreau_walden.md',
  'thus-spoke-zarathustra.md': 'friedrich-nietzsche_thus-spoke-zarathustra.md',
  'tolstoy-short-stories.md': 'leo-tolstoy_short-stories.md',
  'viktor-frankl-search-for-meaning.md': 'viktor-frankl_search-for-meaning.md',
  'zhuangzi-dream.md': 'zhuangzi_zhuangzi-dream.md'
};

const results = [];

// 1. 쌍따옴표 제거 작업 및 파일명 변경 처리
Object.keys(renameMap).forEach(oldFilename => {
  const oldPath = path.join(postsDir, oldFilename);
  const newFilename = renameMap[oldFilename];
  const newPath = path.join(postsDir, newFilename);

  if (fs.existsSync(oldPath)) {
    let content = fs.readFileSync(oldPath, 'utf8');
    const quoteCountBefore = (content.match(/"/g) || []).length;
    
    // 불필요한 쌍따옴표("") 모두 제거
    const updatedContent = content.replace(/"/g, '');
    const quoteCountAfter = (updatedContent.match(/"/g) || []).length;
    const removedQuotes = quoteCountBefore - quoteCountAfter;

    // 수정된 본문 저장
    fs.writeFileSync(oldPath, updatedContent, 'utf8');

    // 파일명 변경 (Rename)
    if (oldPath !== newPath) {
      fs.renameSync(oldPath, newPath);
    }

    results.push({
      oldName: oldFilename,
      newName: newFilename,
      removedQuotes: removedQuotes
    });
  } else {
    console.warn(`파일을 찾을 수 없음: ${oldFilename}`);
  }
});

console.log('\n=== 마크다운 파일 일괄 수정 완료 작업 리스트 ===\n');
results.forEach((item, index) => {
  console.log(`${index + 1}. ${item.oldName} ➔ ${item.newName} (제거된 쌍따옴표: ${item.removedQuotes}개)`);
});
console.log(`\n총 ${results.length}개 파일 변경 완료.\n`);
