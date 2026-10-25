"use strict";
const KEY="dpml-registre-v1",TODAY=new Date().toISOString().slice(0,10);
const TONES=["#6b5b3e","#3f5f55","#7a4a3a","#4a5568","#5b4b6b","#6a6a3a"];
const SEED=[
["DM-2026-0001","k7Xp29Qa4mRt","KOFFI","Ama","Laboratoire Exemple A","valide","2026-03-02","2027-03-01"],
["DM-2026-0002","Wb3nZ8vLq0Ys","AGBODJAN","Kossi","Laboratoire Exemple A","valide","2026-03-15","2027-03-14"],
["DM-2026-0003","hT5rE1cNj7Uo","MENSAH","Afi","Pharma Test B","valide","2026-05-02","2027-05-01"],
["DM-2026-0004","Pq9dA6sXk2Vm","TCHALLA","Yao","Pharma Test B","suspendue","2026-02-10","2027-02-09"],
["DM-2026-0005","uJ4gF0yBw8Lz","ADJOVI","Elom","Santé Plus C","valide","2026-07-20","2027-07-19"],
["DM-2025-0006","Mz2vC7oKt5Hn","SOGBO","Mawuli","Santé Plus C","revoquee","2025-11-05","2026-11-04"],
["DM-2025-0007","Ee6sR3xDp1Qa","LAWSON","Akouvi","Laboratoire Exemple D","valide","2025-06-01","2026-05-31"],
["DM-2026-0008","Ny8bL4tGw9Ji","DOSSEH","Komi","Laboratoire Exemple D","valide","2026-09-12","2027-09-11"],
["DM-2026-0009","Ba1kS5hVq6Ox","AMEGAH","Essi","Pharma Test B","attente","2026-10-20","2027-10-19"],
["DM-2026-0010","Gc0wT2mPe3Zr","BADJI","Yawo","Santé Plus C","valide","2026-08-08","2027-08-07"]
].map(a=>({n:a[0],t:a[1],nom:a[2],pre:a[3],ent:a[4],st:a[5],d1:a[6],d2:a[7],ph:""}));
const LBL={valide:"Valide",attente:"En attente",suspendue:"Suspendue",expiree:"Expirée",revoquee:"Révoquée"};
let S=load(),F={q:"",s:"tous"},me=S.del[0].n;
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fd=d=>d.split("-").reverse().join("/");
const stamp=()=>new Date().toLocaleString("fr-FR",{dateStyle:"short",timeStyle:"short"});
function load(){try{const x=JSON.parse(localStorage.getItem(KEY));if(x&&x.v===1)return x}catch(e){}return{v:1,del:JSON.parse(JSON.stringify(SEED)),log:[],scans:0}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function status(d){return d.st==="valide"&&d.d2<TODAY?"expiree":d.st}
function audit(t){S.log.unshift({d:stamp(),t});S.log=S.log.slice(0,60);save()}
function base(){return location.origin+location.pathname}
function qr(d){const q=qrcode(0,"M");q.addData(base()+"#/verif/"+d.t);q.make();return q.createSvgTag(4,0)}
function photo(d,cls){const i=(d.nom[0]+d.pre[0]).toUpperCase(),c=TONES[S.del.indexOf(d)%TONES.length];
 return d.ph?`<img class="photo ${cls||""}" src="${d.ph}" alt="Photo de ${esc(d.pre+" "+d.nom)}">`:`<div class="photo ${cls||""}" style="background:${c}" role="img" aria-label="Photo non fournie">${esc(i)}</div>`}
const chip=d=>{const s=status(d);return `<span class="st ${s}">${LBL[s]}</span>`};

function verdict(d){
 if(!d)return `<div class="verdict inconnue"><div class="band"></div><div class="in"><div class="w">Carte inconnue</div><p>Ce code ne correspond à aucune carte du registre officiel. Ne pas accepter ce document et signaler la situation à la DPML.</p></div></div>`;
 const s=status(d),msg={valide:"Comparer la photo avec la personne présente.",attente:"Dossier non encore validé : carte non utilisable.",suspendue:"Carte provisoirement suspendue : le titulaire n’est pas autorisé.",expiree:"Date de validité dépassée : le titulaire n’est pas autorisé.",revoquee:"Carte retirée du registre : le titulaire n’est pas autorisé."}[s];
 return `<div class="verdict ${s}"><div class="band"></div><div class="in"><div class="w">${s==="valide"?"Carte valide":"Carte "+LBL[s].toLowerCase()}</div><p style="margin:6px 0 0">${msg}</p></div></div>
 <section class="sheet"><div class="fiche">${photo(d)}<dl><dt>Titulaire</dt><dd>${esc(d.nom)} ${esc(d.pre)}</dd><dt>Fonction</dt><dd>Délégué médical</dd><dt>Entreprise</dt><dd>${esc(d.ent)}</dd><dt>N° de carte</dt><dd class="mono">${esc(d.n)}</dd><dt>Délivrée le</dt><dd>${fd(d.d1)}</dd><dt>Valable jusqu’au</dt><dd>${fd(d.d2)}</dd></dl></div>
 <p class="lede" style="margin:14px 0 0;font-size:13px">Statut lu dans le registre de la DPML le ${stamp()}. Seules les données nécessaires à la vérification sont affichées.</p></section>`}

const V={
verif(arg){
 if(arg){const d=S.del.find(x=>x.t===arg);return verdict(d)+`<a class="btn ghost noprint" href="#/verif">← Nouvelle vérification</a>`}
 return `<h2>Vérifier une carte de délégué médical</h2><p class="lede">Scannez le QR code de la carte avec l’appareil photo du téléphone, ou saisissez le numéro imprimé sur la carte.</p>
 <form class="sheet bar" data-f="num"><div><label for="num">Numéro de carte</label><input id="num" placeholder="DM-2026-0001" autocomplete="off" autocapitalize="characters" required></div><button>Vérifier</button></form>
 <div class="sheet"><h3>Démonstration : simuler un scan</h3><div class="scroll"><table><tr><th>Titulaire</th><th class="hide-s">Entreprise</th><th>Statut</th><th></th></tr>
 ${S.del.map(d=>`<tr><td>${esc(d.nom)} ${esc(d.pre)}<br><span class="mono">${esc(d.n)}</span></td><td class="hide-s">${esc(d.ent)}</td><td>${chip(d)}</td><td><a class="btn ghost sm" href="#/verif/${d.t}">Scanner</a></td></tr>`).join("")}
 <tr><td colspan="3">Code absent du registre (fausse carte)</td><td><a class="btn ghost sm" href="#/verif/ZZ-inconnu">Scanner</a></td></tr></table></div></div>`},
delegue(){
 const d=S.del.find(x=>x.n===me)||S.del[0];
 return `<h2>Espace délégué</h2><p class="lede">Chaque délégué consulte et imprime sa carte, et signale une perte ou demande un renouvellement.</p>
 <div class="note noprint">Démonstration : choisissez le compte à simuler. En production, la connexion se fait par identifiant personnel et code de confirmation.</div>
 <div class="noprint" style="max-width:340px;margin-bottom:16px"><label for="who">Compte simulé</label><select id="who" data-f="who">${S.del.map(x=>`<option value="${x.n}" ${x.n===d.n?"selected":""}>${esc(x.nom)} ${esc(x.pre)}</option>`).join("")}</select></div>
 <div class="idcard"><div class="fl"></div><div class="hd">République togolaise · Ministère de la Santé<b>DPML · Carte de délégué médical</b></div>
 <div class="bd">${photo(d)}<div class="tx"><div class="nm">${esc(d.nom)}<br>${esc(d.pre)}</div><div class="sub">${esc(d.ent)}</div><div class="no mono">${esc(d.n)}</div><div class="sub">Valable jusqu’au ${fd(d.d2)}</div></div><div class="qr">${qr(d)}Vérifier en ligne</div></div>
 <div class="ft"><span>Statut réel : voir le registre</span><span>${esc(base().replace(/^https?:\/\//,"").slice(0,34))}</span></div></div>
 <p class="noprint">Statut actuel : ${chip(d)}</p>
 <p class="noprint bar" style="margin-top:12px"><button data-a="print">Imprimer la carte</button><button class="ghost" data-a="renew" data-n="${d.n}">Demander le renouvellement</button><button class="ghost danger" data-a="lost" data-n="${d.n}">Signaler une perte ou un vol</button></p>`},
admin(){
 const c=s=>S.del.filter(d=>status(d)===s).length,q=F.q.toLowerCase();
 const L=S.del.filter(d=>(F.s==="tous"||status(d)===F.s)&&(d.nom+" "+d.pre+" "+d.n+" "+d.ent).toLowerCase().includes(q));
 const btn=(a,n,t,k)=>`<button class="sm ${k||"ghost"}" data-a="${a}" data-n="${n}">${t}</button> `;
 return `<h2>Espace DPML</h2><p class="lede">Gestion du registre : dossiers, émission, suspension, révocation et traçabilité.</p>
 <div class="note">Accès réservé aux agents habilités (authentification renforcée en production).</div>
 <div class="kpis"><div class="kpi"><b>${S.del.length}</b><span>Délégués enregistrés</span></div><div class="kpi"><b>${c("valide")}</b><span>Cartes valides</span></div><div class="kpi"><b>${c("attente")}</b><span>Dossiers en attente</span></div><div class="kpi"><b>${c("suspendue")+c("expiree")+c("revoquee")}</b><span>Suspendues, expirées, révoquées</span></div><div class="kpi"><b>${S.scans}</b><span>Vérifications QR</span></div></div>
 <section class="sheet"><div class="bar" style="margin-bottom:12px"><div><label for="q">Recherche</label><input id="q" data-f="q" value="${esc(F.q)}" placeholder="Nom, numéro, entreprise"></div><div style="max-width:190px"><label for="s">Statut</label><select id="s" data-f="s">${["tous",...Object.keys(LBL)].map(k=>`<option value="${k}" ${k===F.s?"selected":""}>${k==="tous"?"Tous":LBL[k]}</option>`).join("")}</select></div><button data-a="new">Nouveau délégué</button><button class="ghost" data-a="csv">Exporter CSV</button></div>
 <div class="scroll"><table><tr><th></th><th>Titulaire</th><th class="hide-s">Entreprise</th><th>Expire</th><th>Statut</th><th>Actions</th></tr>
 ${L.length?L.map(d=>{const s=status(d);return `<tr><td>${photo(d,"s")}</td><td>${esc(d.nom)} ${esc(d.pre)}<br><span class="mono">${esc(d.n)}</span></td><td class="hide-s">${esc(d.ent)}</td><td>${fd(d.d2)}</td><td>${chip(d)}</td><td>
 ${s==="attente"?btn("ok",d.n,"Valider","")+btn("rev",d.n,"Rejeter","danger"):""}${s==="valide"?btn("sus",d.n,"Suspendre"):""}${s==="suspendue"?btn("ok",d.n,"Réactiver",""):""}${s==="expiree"?btn("renew",d.n,"Renouveler"):""}${s==="valide"||s==="suspendue"?btn("rev",d.n,"Révoquer","danger"):""}<a class="btn ghost sm" href="#/verif/${d.t}">Voir</a></td></tr>`}).join(""):`<tr><td colspan="6" class="empty">Aucun résultat.</td></tr>`}</table></div></section>
 <section class="sheet"><h3>Journal d’audit</h3><div class="log">${S.log.length?S.log.map(l=>`<div><time>${l.d}</time>${esc(l.t)}</div>`).join(""):'<div class="empty">Aucune opération enregistrée.</div>'}</div>
 <p style="margin:12px 0 0"><button class="ghost sm" data-a="reset">Réinitialiser la démonstration</button></p></section>`}
};
function route(scan){
 const [,p="verif",arg=""]=location.hash.split("/");
 const k=V[p]?p:"verif";
 if(scan&&k==="verif"&&arg){S.scans++;const d=S.del.find(x=>x.t===arg);audit("Vérification QR : "+(d?d.n:"code inconnu"))}
  document.querySelectorAll("nav.tabs a[data-k]").forEach(a=>{if(a.dataset.k===k)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current")});
 $("#app").innerHTML=V[k](arg);scrollTo(0,0)
}
function ask(m){const r=prompt(m);return r&&r.trim()?r.trim():null}
function set(n,st,why){const d=S.del.find(x=>x.n===n);d.st=st;audit(`${d.n} (${d.nom}) → ${LBL[st]}${why?" · motif : "+why:""}`)}
function renew(n){const d=S.del.find(x=>x.n===n),y=+TODAY.slice(0,4)+1;d.d1=TODAY;d.d2=y+TODAY.slice(4);d.st="valide";audit(`${d.n} renouvelée jusqu’au ${fd(d.d2)}`)}
function rnd(){const a=new Uint8Array(9);crypto.getRandomValues(a);return Array.from(a,x=>"abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789"[x%56]).join("")}
function csv(){const r=[["Numéro","Nom","Prénoms","Entreprise","Délivrée","Expire","Statut"],...S.del.map(d=>[d.n,d.nom,d.pre,d.ent,d.d1,d.d2,LBL[status(d)]])];
 const b=new Blob(["\ufeff"+r.map(x=>x.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(";")).join("\n")],{type:"text/csv"}),a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="registre-delegues-"+TODAY+".csv";a.click()}
function resize(file){return new Promise(ok=>{if(!file)return ok("");const i=new Image;i.onload=()=>{const c=document.createElement("canvas"),k=Math.min(1,240/Math.max(i.width,i.height));c.width=i.width*k;c.height=i.height*k;c.getContext("2d").drawImage(i,0,0,c.width,c.height);ok(c.toDataURL("image/jpeg",.78))};i.onerror=()=>ok("");i.src=URL.createObjectURL(file)})}
const A={
 print:()=>print(),csv,
 new:()=>$("#dlg").showModal(),
 ok:n=>{set(n,"valide");route()},
 sus:n=>{const m=ask("Motif de la suspension (obligatoire) :");if(m){set(n,"suspendue",m);route()}},
 rev:n=>{const m=ask("Motif (obligatoire) :");if(m){set(n,"revoquee",m);route()}},
 renew:n=>{if(location.hash.startsWith("#/delegue")){audit(n+" : demande de renouvellement déposée");alert("Votre demande de renouvellement a été transmise à la DPML.")}else{renew(n);route()}},
 lost:n=>{if(confirm("Confirmer la perte ou le vol ? La carte sera suspendue immédiatement.")){set(n,"suspendue","perte ou vol signalé par le titulaire");alert("Carte suspendue. Contactez la DPML pour obtenir un duplicata.");route()}},
 reset:()=>{if(confirm("Rétablir les 10 délégués de démonstration ?")){S={v:1,del:JSON.parse(JSON.stringify(SEED)),log:[],scans:0};save();route()}}
};
document.addEventListener("click",e=>{const b=e.target.closest("[data-a]");if(!b)return;const f=A[b.dataset.a];if(f){f(b.dataset.n);save()}});
document.addEventListener("input",e=>{const t=e.target;if(t.dataset.f==="q"){F.q=t.value;const p=t.selectionStart;route();const n=$("#q");n.focus();n.setSelectionRange(p,p)}});
document.addEventListener("change",e=>{const t=e.target;if(t.dataset.f==="s"){F.s=t.value;route()}if(t.dataset.f==="who"){me=t.value;route()}});
document.addEventListener("submit",async e=>{const f=e.target;if(f.dataset.f==="num"){e.preventDefault();const v=$("#num").value.trim().toUpperCase(),d=S.del.find(x=>x.n===v);location.hash="#/verif/"+(d?d.t:"ZZ-inconnu")}
 if(f.id==="nf"){e.preventDefault();const g=n=>f.elements[n].value.trim(),ph=await resize(f.elements.ph.files[0]),y=TODAY.slice(0,4),
 k=S.del.filter(x=>x.n.startsWith("DM-"+y)).length+1,n="DM-"+y+"-"+String(k).padStart(4,"0");
 S.del.push({n,t:rnd(),nom:g("nom").toUpperCase(),pre:g("pre"),ent:g("ent"),st:"attente",d1:TODAY,d2:(+y+1)+TODAY.slice(4),ph});
 audit(n+" : dossier enregistré (en attente de validation)");f.reset();$("#dlg").close();route()}});
$("#dlg").addEventListener("click",e=>{if(e.target.dataset.close!==undefined)$("#dlg").close()});
addEventListener("hashchange",()=>route(true));
$("#ents").innerHTML=[...new Set(SEED.map(d=>d.ent))].map(x=>`<option value="${x}">`).join("");
route(true);
