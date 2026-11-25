// Copie les bases construites dans data/ si leur contenu a changé (la date de construction seule ne compte pas), puis écrit data/manifest.json.
// Usage : node scripts/publish.js <dossier construit> <dossier publié>. Affiche « changed » ou « unchanged ».
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const [src, dst] = process.argv.slice(2);
const FILES = ['cards.json', 'pokedex.json', 'connexions.json'];
const norm = (f, txt) => { const o = JSON.parse(txt); if (f === 'cards.json') delete o.built; return JSON.stringify(o); };
let changed = !fs.existsSync(path.join(dst, 'manifest.json'));
for (const f of FILES) {
  const a = fs.readFileSync(path.join(src, f), 'utf8'), p = path.join(dst, f);
  if (!fs.existsSync(p) || norm(f, fs.readFileSync(p, 'utf8')) !== norm(f, a)) changed = true;
}
if (!changed) { console.log('unchanged'); process.exit(0); }
fs.mkdirSync(dst, { recursive: true });
const files = {};
for (const f of FILES) {
  const buf = fs.readFileSync(path.join(src, f)); fs.writeFileSync(path.join(dst, f), buf);
  files[f] = { sha256: crypto.createHash('sha256').update(buf).digest('hex'), size: buf.length };
}
const C = JSON.parse(fs.readFileSync(path.join(dst, 'cards.json'))), P = JSON.parse(fs.readFileSync(path.join(dst, 'pokedex.json')));
const last = C.sets.slice().sort((a, b) => a[2] < b[2] ? 1 : -1)[0];
fs.writeFileSync(path.join(dst, 'manifest.json'), JSON.stringify({ schema: 1, built: C.built, files,
  counts: { cards: C.cards.length, sets: C.sets.length, species: P.list.length }, latest: { name: last[0], date: last[2] } }, null, 1) + '\n');
console.log('changed');
