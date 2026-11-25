const fs=require('fs');const d=process.argv[2];
const sp=fs.readFileSync(d+'/pokemon_species.csv','utf8').trim().split('\n').slice(1).map(l=>l.split(','));
const kids={};for(const r of sp) if(r[3]) kids[r[3]]=1;
const place=sp.map(r=>r[3]?(kids[r[0]]?2:3):(kids[r[0]]?1:0)); // 0 n'évolue pas, 1 premier, 2 milieu, 3 dernier
const raw=JSON.parse(fs.readFileSync(process.argv[3]));const card=new Array(sp.length).fill(0);
for(const c of raw.cards){ let f=0;const n=c.n;
  if(/[ -]ex$/i.test(n)) f|=1; if(/[ -]GX$/.test(n)) f|=2; if(/ V$/.test(n)) f|=4; if(/ VMAX$/.test(n)) f|=8; if(/ VSTAR$/.test(n)) f|=16; if(/^(M-|Méga-)/.test(n)) f|=32; if(c.h>=300) f|=64;
  if(f) for(const id of c.d) if(id<=sp.length) card[id-1]|=f; }
// Libellés du jeu Connexions : places dans la famille, sortes de cartes (bits de card), bit « 300 PV ou plus », noms de types du jeu.
const places=["N'évoluent pas",'Premiers de leur famille','Au milieu de leur famille','Dernière évolution'];
const kinds=[[1,'ex'],[2,'GX'],[4,'V'],[8,'VMAX'],[16,'VSTAR'],[32,'Méga-Évolution']];
const gameTypes={'Acier':'Métal'};
fs.writeFileSync(process.argv[4],JSON.stringify({schema:1,place,card,places,kinds,hp300:64,gameTypes}));
console.log(sp.length,sp.every((r,i)=>+r[0]===i+1),card.filter(x=>x&64).length,card.filter(x=>x&32).length);
