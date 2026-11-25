const fs=require('fs');const raw=JSON.parse(fs.readFileSync(process.argv[2]));
// rareté TCGdex -> [nom dans le jeu, niveau : 3 Rares, 4 Très rares, 5 Ultra-rares]
const R={'Rare':['Rare',3],'Holo Rare':['Rare Holo',3],'Rare Holo':['Rare Holo',3],'Promo':['Promo',3],'Shiny rare':['Rare Chromatique',3],'Pikachu Rare':['Rare Pikachu',3],'Three Diamond':['3 Losanges',3],
'Double rare':['Double Rare',4],'Holo Rare V':['Rare Holo V',4],'Holo Rare VMAX':['Rare Holo VMAX',4],'Holo Rare VSTAR':['Rare Holo VSTAR',4],'Rare Holo LV.X':['Rare Holo LV.X',4],'Rare PRIME':['Rare Prime',4],'LEGEND':['LÉGENDE',4],'Radiant Rare':['Rare Radieuse',4],'Amazing Rare':['Rare Magnifique',4],'Classic Collection':['Collection Classique',4],
'Ultra Rare':['Ultra Rare',4],'Illustration rare':['Illustration Rare',4],'Shiny rare V':['Rare Chromatique V',4],'Shiny rare VMAX':['Rare Chromatique VMAX',4],'Shiny Ultra Rare':['Ultra Rare Chromatique',4],'Mega Attack Rare':['Rare Méga-Attaque',4],'Black White Rare':['Rare Noir Blanc',4],'Four Diamond':['4 Losanges',4],'One Star':['1 Étoile',4],'One Shiny':['1 Chromatique',4],
'Special illustration rare':['Illustration Spéciale Rare',5],'Secret Rare':['Rare Secrète',5],'Hyper rare':['Hyper Rare',5],'Mega Hyper Rare':['Méga Hyper Rare',5],'Futuristic Rare':['Rare Futuriste',5],'RGB Rare':['Rare Arc-en-ciel',5],'Two Star':['2 Étoiles',5],'Three Star':['3 Étoiles',5],'Two Shiny':['2 Chromatiques',5],'Crown':['Couronne',5]};
// Rareté de pokemontcg.io (même vocabulaire que le jeu) -> [nom dans le jeu, niveau]. null = pas une rare : carte exclue.
const PT={'Common':null,'Uncommon':null,'Rare':['Rare',3],'Rare Holo':['Rare Holo',3],'Promo':['Promo',3],'Rare Shiny':['Rare Chromatique',3],'Shiny Rare':['Rare Chromatique',3],'Pikachu Rare':['Rare Pikachu',3],
'Rare Holo EX':['Rare Holo EX',4],'Rare Holo GX':['Rare Holo GX',4],'Rare Holo V':['Rare Holo V',4],'Holo Rare V':['Rare Holo V',4],'Rare Holo VMAX':['Rare Holo VMAX',4],'Holo Rare VMAX':['Rare Holo VMAX',4],'Rare Holo VSTAR':['Rare Holo VSTAR',4],'Holo Rare VSTAR':['Rare Holo VSTAR',4],
'Rare Holo LV.X':['Rare Holo LV.X',4],'Rare Prime':['Rare Prime',4],'Rare Prism Star':['Rare Prisme Étoile',4],'Radiant Rare':['Rare Radieuse',4],'Rare BREAK':['Rare TURBO',4],'Rare ACE':['Rare High-Tech',4],'LEGEND':['LÉGENDE',4],'Double Rare':['Double Rare',4],'Rare Holo ex':['Rare ex',4],
'Classic Collection':['Collection Classique',4],'Illustration Rare':['Illustration Rare',4],'Rare Ultra':['Ultra Rare',4],'Ultra Rare':['Ultra Rare',4],'Shiny Ultra Rare':['Ultra Rare Chromatique',4],'Trainer Gallery Rare Holo':['Rare Galerie',4],'Rare Shiny GX':['Rare Chromatique GX',4],
'Amazing Rare':['Rare Magnifique',4],'Rare Holo Star':['Rare Holo Étoile',4],'Rare Shining':['Rare Brillante',4],'Black White Rare':['Rare Noir Blanc',4],'MEGA_ATTACK_RARE':['Rare Méga-Attaque',4],
'Rare Rainbow':['Rare Arc-en-ciel',5],'Rare Secret':['Rare Secrète',5],'Hyper Rare':['Hyper Rare',5],'Special Illustration Rare':['Illustration Spéciale Rare',5],'Futuristic Rare':['Rare Futuriste',5],'Mega Hyper Rare':['Méga Hyper Rare',5]};
const ptDir=process.argv[4], pt={};
if(ptDir) for(const f of fs.readdirSync(ptDir)){ const m={}; for(const c of JSON.parse(fs.readFileSync(ptDir+'/'+f))) m[c.number]=c.rarity; pt[f.replace('.json','')]=m; }
const IDMAP={'sv10.5w':'rsv10pt5','sv10.5b':'zsv10pt5','swsh10.5':'pgo','hgssp':'hsp','cel25cc':'cel25c','swsh4.5sv':'swsh45sv','swsh12.5gg':'swsh12pt5gg'};
const ptSet=id=>{ if(!id) return null; if(pt[id]) return pt[id]; if(IDMAP[id]) return pt[IDMAP[id]]||null;
  let x=id.replace(/^(sv|me|swsh|sm)0(\d)/,'$1$2'); if(pt[x]) return pt[x];
  for(const y of [x.replace('.5','pt5'),x.replace('.5','5')]) if(pt[y]) return pt[y]; return null; };
const ptRar=(set,l)=>{ const m=ptSet(set.id); if(!m) return undefined; const r=m[l]!==undefined?m[l]:m[l.replace(/^0+/,'')]; return r; };
let viaPt=0,dropPt=0;
const SP=[[/ ex$/,'Rare ex'],[/[ -]EX$/,'Rare Holo EX'],[/[ -]GX$/,'Rare Holo GX'],[/ V$/,'Rare Holo V'],[/ VMAX$/,'Rare Holo VMAX'],[/ VSTAR$/,'Rare Holo VSTAR'],[/NIV\.X/,'Rare Holo LV.X'],[/LÉGENDE/,'LÉGENDE'],[/TURBO/,'Rare TURBO'],[/◇/,'Rare Prisme Étoile'],[/☆|lumineux|^M-/,'Rare spéciale']];
const TY=['Grass','Fire','Water','Lightning','Psychic','Fighting','Darkness','Metal','Fairy','Dragon','Colorless'];
const STG=['Basic','Stage1','Stage2','VMAX','VSTAR','MEGA','BREAK','LEVEL-UP','Baby','RESTORED','?'];
const illus=[],rars=[],tiers=[],series=[],sets=[],smap={},cards=[];let bumped=0,pocket=0,promo=0;
// Stade manquant dans TCGdex : on le déduit des autres cartes du même Pokémon (duos = de base, M- = Méga, TURBO).
const stat={};for(const c of raw.cards){ const k=['Basic','Stage1','Stage2'].indexOf(c.g); if(k<0||c.d.length!==1) continue; (stat[c.d[0]]=stat[c.d[0]]||[0,0,0])[k]++; }
let guessed=0;
const guessStage=c=>{ if(/^(M-|Méga-)/.test(c.n)) return 'MEGA'; if(/TURBO/.test(c.n)) return 'BREAK'; if(c.d.length>1) return 'Basic'; const t=stat[c.d[0]]; if(!t) return '?'; const m=Math.max(...t); return m?['Basic','Stage1','Stage2'][t.indexOf(m)]:'?'; };
for(const c of raw.cards){
  if(c.g==='?'&&c.d.length&&c.h){ const g=guessStage(c); if(g!=='?'){ c.g=g; guessed++; } }
  if(!c.d.length||!c.h) continue;
  const s=raw.sets[c.s]; if(!s.d) continue;
  let lab,lev; const pr=/Pocket/.test(s.se)?undefined:ptRar(s,c.l);
  if(pr!==undefined&&pr in PT){ if(!PT[pr]){ dropPt++; continue; } [lab,lev]=PT[pr]; viaPt++; }
  else { if(!(c.r in R)) continue; [lab,lev]=R[c.r];
    if(lev===3&&c.r!=='Promo'&&!/Pocket/.test(s.se)){ const m=SP.find(x=>x[0].test(c.n)); if(m){lab=m[1];lev=4;bumped++;} } }
  let ri=rars.indexOf(lab); if(ri<0){ri=rars.length;rars.push(lab);tiers.push(lev);}
  if(!(c.s in smap)){let se=series.indexOf(s.se); if(se<0){se=series.length;series.push(s.se)} smap[c.s]=sets.length; sets.push([s.n,se,s.d]);}
  let m=0; for(const t of c.t){const i=TY.indexOf(t); if(i>=0) m|=1<<i;}
  let il=-1; if(c.i){il=illus.indexOf(c.i); if(il<0){il=illus.length;illus.push(c.i)}}
  const sg=STG.indexOf(c.g);
  if(/Pocket/.test(s.se))pocket++; if(lab==='Promo')promo++;
  cards.push([c.n,smap[c.s],c.l,c.d[0],c.h,m,ri,sg<0?10:sg,il]);
}
// Noms affichés (même ordre que TY et STG) et badge de chaque rareté, aux couleurs du jeu.
const types=['Plante','Feu','Eau','Électrique','Psy','Combat','Obscurité','Métal','Fée','Dragon','Incolore'];
const stages=['Base','Niveau 1','Niveau 2','VMAX','VSTAR','Méga','TURBO','NIV.X','Bébé','Restauré','Stade inconnu'];
const RB_RAINBOW=['Hyper Rare','Rare Futuriste','Illustration Spéciale Rare','Rare Arc-en-ciel','Rare Secrète','Ultra Rare Galerie','Méga Hyper Rare','3 Étoiles','Couronne','2 Étoiles','2 Chromatiques'];
const RB_GOLD=['1 Étoile','1 Chromatique','Collection Classique','Illustration Rare','Rare Chromatique V','Rare Chromatique VMAX','Rare Chromatique GX','Rare Galerie','Ultra Rare','Ultra Rare Chromatique','Rare Noir Blanc','Rare Méga-Attaque'];
const badge=(n,lv)=>n==='Promo'?['out','★']:RB_RAINBOW.includes(n)?['rain',/^2 /.test(n)?'★★':'★★★']:RB_GOLD.includes(n)?['gold',/^1 /.test(n)?'★':'★★']
  :n==='4 Losanges'?['vio','◆◆◆◆']:n==='3 Losanges'?['vio','◆◆◆']:lv>=4?['vio','★★']:n==='Rare'?['blue','★']:['vio','★'];
const badges=rars.map((n,i)=>badge(n,tiers[i]));
fs.writeFileSync(process.argv[3],JSON.stringify({schema:1,built:new Date().toISOString().slice(0,10),types,stages,illus,series,sets,rars,tiers,badges,cards}));
console.log('raretés via pokemontcg.io',viaPt,'exclues',dropPt,'stades déduits',guessed,'cards',cards.length,'pocket',pocket,'promo',promo,'bumped',bumped,'sets',sets.length,'illus',illus.length);
