const fs=require('fs'),path=require('path');
const root=process.argv[2], out=process.argv[3];
const str=(s,k)=>{const m=s.match(new RegExp('\\b'+k+':\\s*(["\'`])((?:\\\\.|(?!\\1).)*)\\1'));return m?m[2].replace(/\\(.)/g,'$1'):null};
const block=(s,k)=>{const m=s.match(new RegExp('^\\t'+k+':\\s*\\{([\\s\\S]*?)\\n\\t\\}','m'));return m?m[1]:null};
const sets=[],cards=[],rar={};
for(const serie of fs.readdirSync(root)){
  const sd=path.join(root,serie); if(!fs.statSync(sd).isDirectory()) continue;

  const st=fs.readFileSync(sd+'.ts','utf8'); const sn=block(st,'name')||'';
  const serieName=str(sn,'fr')||str(sn,'en')||serie;
  for(const f of fs.readdirSync(sd)){
    if(!f.endsWith('.ts')) continue;
    const t=fs.readFileSync(path.join(sd,f),'utf8');
    const nb=block(t,'name')||''; const fr=str(nb,'fr'); const en=str(nb,'en');
    let rd=t.match(/releaseDate:\s*["']([\d-]+)["']/); if(!rd){const b=block(t,'releaseDate'); if(b){rd=[0,str(b,'fr')||str(b,'en')]}}
    const dir=path.join(sd,f.slice(0,-3)); if(!fs.existsSync(dir)) continue;
    const si=sets.length; let n=0;
    for(const cf of fs.readdirSync(dir)){
      if(!cf.endsWith('.ts')) continue;
      const c=fs.readFileSync(path.join(dir,cf),'utf8');
      if(str(c,'category')!=='Pokemon') continue;
      const cn=block(c,'name')||''; const cfr=str(cn,'fr'); if(!cfr) continue;
      const rarity=str(c,'rarity')||'None'; rar[rarity]=(rar[rarity]||0)+1;
      const dm=c.match(/dexId:\s*\[([\d,\s]*)\]/); const dex=dm?dm[1].split(',').map(x=>+x.trim()).filter(Boolean):[];
      const hm=c.match(/^\thp:\s*(\d+)/m); const tm=c.match(/^\ttypes:\s*\[([\s\S]*?)\]/m);
      const types=tm?[...tm[1].matchAll(/["'](\w+)["']/g)].map(x=>x[1]):[];
      cards.push({n:cfr,s:si,l:cf.slice(0,-3),d:dex,h:hm?+hm[1]:0,t:types,r:rarity,g:str(c,'stage')||'?',i:str(c,'illustrator')||''}); n++;
    }
    sets.push({n:fr||en,fr:!!fr,se:serieName,d:rd?rd[1]:null,c:n,id:str(t,'id')});
  }
}
fs.writeFileSync(out,JSON.stringify({sets,cards}));
console.log(cards.length,sets.filter(s=>s.c).length,rar);
console.log(sets.filter(s=>s.c&&!s.d).map(s=>s.n));
