// Verifies each post's `image:` front-matter against files in /public and fixes mismatches
// (extension, accents, trailing dots, case). Usage: node scripts/fix-image-paths.js [--dry]
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const postsDir = path.join(root, 'src', 'content', 'posts');
const dry = process.argv.includes('--dry');
const norm = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function resolve(imgPath) {
  const dir = path.join(root, 'public', path.dirname(imgPath));
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir);
  if (files.includes(path.basename(imgPath))) return imgPath;
  const base = path.basename(imgPath).replace(/\.+$/, '');
  const stem = norm(base.replace(/\.(jpe?g|png|webp)$/i, ''));
  const hit = files.find((f) => norm(f) === norm(base)) ||
    files.find((f) => norm(f.replace(/\.[^.]+$/, '')) === stem) ||
    files.find((f) => norm(f).startsWith(stem + '.'));
  return hit ? path.posix.join(path.posix.dirname(imgPath), hit) : null;
}

for (const f of fs.readdirSync(postsDir).filter((x) => x.endsWith('.md'))) {
  const file = path.join(postsDir, f);
  const text = fs.readFileSync(file, 'utf8');
  const m = text.match(/^image:\s*["']?([^"'\r\n]+?)["']?\s*$/m);
  if (!m) { console.log('NO IMAGE', f); continue; }
  const cur = m[1];
  const fixed = resolve(cur);
  if (fixed === cur) continue;
  if (!fixed) { console.log('UNRESOLVED', f, cur); continue; }
  console.log(f, cur, '->', fixed);
  if (!dry) fs.writeFileSync(file, text.replace(m[0], m[0].replace(cur, fixed)), 'utf8');
}
