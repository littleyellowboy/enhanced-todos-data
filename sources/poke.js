const fs=require('fs');const d=process.argv[2];
const rows=f=>fs.readFileSync(d+'/'+f+'.csv','utf8').trim().split('\n').slice(1).map(l=>l.split(','));
const tn={};for(const r of rows('type_names')) if(r[1]==='5') tn[r[0]]=r[2];
const fr={};for(const r of rows('pokemon_species_names')) if(r[1]==='5') fr[r[0]]=r[2];
const ty={};for(const r of rows('pokemon_types')) (ty[r[0]]=ty[r[0]]||[])[+r[2]-1]=+r[1];
const types=[];const tix=id=>{const n=tn[id];let i=types.indexOf(n);if(i<0){i=types.length;types.push(n)}return i};
const out=[];for(const r of rows('pokemon_species')){const id=r[0];if(!fr[id]||!ty[id])continue;out.push([fr[id],+r[2],+r[4],...ty[id].map(tix)]);}
fs.writeFileSync(process.argv[3],JSON.stringify({schema:1,types,list:out}));console.log(out.length,types,out[24],out[out.length-1]);
