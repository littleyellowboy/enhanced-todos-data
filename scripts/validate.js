// Valide les bases construites avant publication : structure, bornes, et pas de chute brutale du nombre de cartes.
// Usage : node scripts/validate.js <dossier construit> [dossier publié actuel]
const fs = require('fs'), path = require('path');
const [dir, prev] = process.argv.slice(2);
const read = (d, f) => JSON.parse(fs.readFileSync(path.join(d, f), 'utf8'));
const errs = [], ok = (c, m) => { if (!c) errs.push(m); };
const str = (x, max = 120) => typeof x === 'string' && x.length > 0 && x.length <= max;
const int = (x, a, b) => Number.isInteger(x) && x >= a && x <= b;

const C = read(dir, 'cards.json'), P = read(dir, 'pokedex.json'), X = read(dir, 'connexions.json');
ok(C.schema === 1 && /^\d{4}-\d{2}-\d{2}$/.test(C.built), 'cards : schéma ou date');
for (const k of ['types', 'stages', 'illus', 'series', 'rars']) ok(Array.isArray(C[k]) && C[k].every(x => str(x)), 'cards : ' + k);
ok(C.sets.every(s => Array.isArray(s) && str(s[0]) && int(s[1], 0, C.series.length - 1) && /^\d{4}-\d{2}-\d{2}$/.test(s[2])), 'cards : extensions');
ok(C.tiers.length === C.rars.length && C.tiers.every(t => int(t, 1, 6)), 'cards : niveaux de rareté');
ok(C.badges.length === C.rars.length && C.badges.every(b => ['rain', 'gold', 'vio', 'blue', 'out'].includes(b[0]) && /^[★◆]{1,4}$/.test(b[1])), 'cards : badges');
const tmax = (1 << C.types.length) - 1;
ok(C.cards.every(c => c.length === 9 && str(c[0], 80) && int(c[1], 0, C.sets.length - 1) && typeof c[2] === 'string' && c[2].length <= 20
  && int(c[3], 1, 2000) && int(c[4], 1, 1000) && int(c[5], 0, tmax) && int(c[6], 0, C.rars.length - 1) && int(c[7], 0, C.stages.length - 1) && int(c[8], -1, C.illus.length - 1)), 'cards : cartes');
ok(P.schema === 1 && P.types.every(x => str(x)) && P.list.every(p => str(p[0], 40) && int(p[1], 1, 20) && int(p[2], 1, 5000) && p.slice(3).length >= 1 && p.slice(3).every(t => int(t, 0, P.types.length - 1))), 'pokedex');
ok(X.schema === 1 && X.place.length === P.list.length && X.place.every(v => int(v, 0, 3)) && X.card.length === P.list.length && X.card.every(v => int(v, 0, 127)), 'connexions : données');
ok(X.places.length === 4 && X.places.every(x => str(x)) && X.kinds.every(k => int(k[0], 1, 63) && str(k[1], 30)) && int(X.hp300, 1, 64), 'connexions : libellés');
// Seuils : bases complètes et pas de régression brutale par rapport à la version publiée.
ok(C.cards.length >= 9000 && C.sets.length >= 150 && P.list.length >= 1025, `trop peu de données (${C.cards.length} cartes, ${C.sets.length} extensions, ${P.list.length} Pokémon)`);
if (prev && fs.existsSync(path.join(prev, 'cards.json'))) {
  const O = read(prev, 'cards.json');
  ok(C.cards.length >= O.cards.length * 0.97, `cartes en forte baisse : ${O.cards.length} -> ${C.cards.length}`);
}
if (errs.length) { console.error('Validation : ÉCHEC\n- ' + errs.join('\n- ')); process.exit(1); }
console.log(`Validation : OK (${C.cards.length} cartes, ${C.sets.length} extensions, ${P.list.length} Pokémon)`);
