import{o as le,e as re,y,d as X,t as v,c as de}from"./auth-VsLOkEMq.js";import{s as Z,b as ie,f as ce,d as me}from"./skeleton-DRQ05dn4.js";import{query as J,collection as K,where as _,orderBy as ee,getDocs as te}from"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";import"https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";import"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";import"https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";let f=[],d=[],E=1;const z=10;let Q=null,q=null;const k={auto:"AT-AVE-AVEX",loisir:"VTT, Motoneige, etc.",vr:"Véhicules Récréatifs",tracteur:"Équipement Agricole"},ue={auto:"#6366f1",loisir:"#06b6d4",vr:"#f97316",tracteur:"#22c55e"};document.addEventListener("DOMContentLoaded",async()=>{le(async t=>{if(!t){window.location.href="/index.html";return}pe(t);const n=await re(t.uid);n&&n.role==="admin"&&(document.getElementById("nav-admin-item")?.classList.remove("hidden"),document.getElementById("admin-badge-nav")?.classList.remove("hidden")),await ge(t.uid)}),document.getElementById("logout-btn")?.addEventListener("click",se),document.getElementById("signout-link")?.addEventListener("click",se),document.getElementById("filter-module")?.addEventListener("change",$),document.getElementById("filter-period")?.addEventListener("change",$),document.getElementById("filter-sort")?.addEventListener("change",$),document.getElementById("reset-filters-btn")?.addEventListener("click",Ce),document.getElementById("prev-page-btn")?.addEventListener("click",()=>ne(-1)),document.getElementById("next-page-btn")?.addEventListener("click",()=>ne(1)),document.getElementById("export-results-btn")?.addEventListener("click",we);const e=document.getElementById("results-list");e&&!e.dataset.eventsBound&&(e.addEventListener("click",ye),e.dataset.eventsBound="true")});function pe(e){document.getElementById("user-name")&&(document.getElementById("user-name").textContent=e.displayName||e.email),document.getElementById("user-photo")&&(document.getElementById("user-photo").src=e.photoURL||`https://ui-avatars.com/api/?name=${encodeURIComponent(e.displayName||e.email)}`),document.getElementById("user-display-name")&&(document.getElementById("user-display-name").textContent=e.displayName||e.email),document.getElementById("user-avatar")&&(document.getElementById("user-avatar").src=e.photoURL||`https://ui-avatars.com/api/?name=${encodeURIComponent(e.displayName||e.email)}`)}async function ge(e){y.info("📥 Chargement des résultats pour:",e);try{const t=document.getElementById("global-stats"),n=document.getElementById("results-list"),o=document.getElementById("progress-chart-container");t&&Z("global-stats",ie(4)),n&&Z("results-list",ce(5)),o&&(o.innerHTML=me());let s=J(K(X,"quizResults"),_("userId","==",e),ee("completedAt","desc")),l=await te(s);l.empty&&(s=J(K(X,"quizResults"),_("userId","==",e),ee("date","desc")),l=await te(s)),f=[],l.forEach(a=>{const r=a.data();let u=null;if(r.completedAt&&typeof r.completedAt.toDate=="function")u=r.completedAt.toDate();else if(r.date&&typeof r.date.toDate=="function")u=r.date.toDate();else if(r.date&&typeof r.date=="string"){const i=new Date(r.date);isNaN(i.getTime())||(u=i)}f.push({id:a.id,...r,completedAt:u})}),y.info(`✅ ${f.length} résultats chargés`),f.length===0?P():(d=[...f],oe())}catch(t){y.error("❌ Erreur lors du chargement des résultats:",t),t.code==="permission-denied"?v.error("Permissions insuffisantes pour consulter vos résultats. Contactez un administrateur."):v.error("Erreur lors du chargement des résultats"),P()}}function oe(){if(d.length===0){document.getElementById("results-container")?.classList.add("hidden"),P();return}document.getElementById("no-results")?.classList.add("hidden"),fe(),he(),ae(),document.getElementById("results-loading")?.classList.add("hidden"),document.getElementById("results-container")?.classList.remove("hidden")}function fe(){const e=document.getElementById("global-stats"),t=d.length,n=t>0?Math.round(d.reduce((a,r)=>a+r.score,0)/t):0,o=d.reduce((a,r)=>a+r.totalQuestions,0);d.reduce((a,r)=>a+r.correctAnswers,0);const s=d.reduce((a,r)=>a+(r.timeSpent||0),0),l=t>0?Math.round(s/t):0;e.innerHTML=`
        <div class="bg-white rounded-xl shadow-md p-6 fade-in">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <div>
                    <p class="text-sm text-slate-500">Quiz complétés</p>
                    <p class="text-3xl font-bold text-slate-900">${t}</p>
                </div>
            </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-md p-6 fade-in">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                    </svg>
                </div>
                <div>
                    <p class="text-sm text-slate-500">Score moyen</p>
                    <p class="text-3xl font-bold text-slate-900">${n}%</p>
                </div>
            </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-md p-6 fade-in">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                </div>
                <div>
                    <p class="text-sm text-slate-500">Questions répondues</p>
                    <p class="text-3xl font-bold text-slate-900">${o}</p>
                </div>
            </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-md p-6 fade-in">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                    <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <div>
                    <p class="text-sm text-slate-500">Temps moyen</p>
                    <p class="text-3xl font-bold text-slate-900">${U(l)}</p>
                </div>
            </div>
        </div>
    `}function he(){xe(),ve()}function xe(){const e=document.getElementById("progress-chart");if(!e)return;const t=[...d].reverse().slice(-10),n=t.map((s,l)=>{const a=s.completedAt;return a?`${a.getDate()}/${a.getMonth()+1}`:`Quiz ${l+1}`}),o=t.map(s=>s.score);Q&&Q.destroy(),Q=new Chart(e,{type:"line",data:{labels:n,datasets:[{label:"Score (%)",data:o,borderColor:"#6366f1",backgroundColor:"rgba(99, 102, 241, 0.1)",tension:.4,fill:!0,pointRadius:5,pointHoverRadius:7}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{y:{beginAtZero:!0,max:100,ticks:{callback:s=>s+"%"}}}}})}function ve(){const e=document.getElementById("module-chart");if(!e)return;const t={};d.forEach(l=>{t[l.module]=(t[l.module]||0)+1});const n=Object.keys(t).map(l=>k[l]||l),o=Object.values(t),s=Object.keys(t).map(l=>ue[l]||"#6366f1");q&&q.destroy(),q=new Chart(e,{type:"doughnut",data:{labels:n,datasets:[{data:o,backgroundColor:s,borderWidth:2,borderColor:"#ffffff"}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"bottom"}}}})}function ae(){const e=document.getElementById("results-list");if(!e)return;const t=(E-1)*z,n=t+z,o=d.slice(t,n);if(o.length===0){e.replaceChildren();return}const s=document.createDocumentFragment();o.forEach(l=>{s.appendChild(be(l))}),e.replaceChildren(s),Ee()}function be(e){const t=document.createElement("article");t.className="p-6 hover:bg-slate-50 transition-colors",t.dataset.resultId=e.id;const n=e.completedAt instanceof Date?e.completedAt:null,o=n?`${n.getDate().toString().padStart(2,"0")}/${(n.getMonth()+1).toString().padStart(2,"0")}/${n.getFullYear()} à ${n.getHours().toString().padStart(2,"0")}:${n.getMinutes().toString().padStart(2,"0")}`:"Date inconnue",s=e.score>=80?"text-green-600":e.score>=60?"text-yellow-600":"text-red-600",l=b(k[e.module]||e.module||"Module"),a=e.month?String(e.month).trim():"",r=e.year?String(e.year).trim():"",u=b([a,r].filter(Boolean).join(" ").trim()),i=Number.isFinite(e.score)?e.score:0,h=Number.isFinite(e.correctAnswers)?e.correctAnswers:0,C=Number.isFinite(e.totalQuestions)?e.totalQuestions:0,w=b(`${i}%`),B=b(`${h}/${C}`),g=b(U(e.timeSpent||0)),I=b(o);return t.innerHTML=`
        <div class="flex items-center justify-between">
            <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                    <h3 class="text-lg font-bold text-slate-900">${l}</h3>
                    <span class="px-3 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-full">
                        ${u}
                    </span>
                </div>
                <p class="text-sm text-slate-500">${I}</p>
            </div>
            <div class="flex items-center gap-6">
                <div class="text-center">
                    <p class="text-sm text-slate-500 mb-1">Score</p>
                    <p class="${s} text-3xl font-bold">${w}</p>
                </div>
                <div class="text-center">
                    <p class="text-sm text-slate-500 mb-1">Réponses</p>
                    <p class="text-slate-700 font-semibold">${B}</p>
                </div>
                <div class="text-center">
                    <p class="text-sm text-slate-500 mb-1">Temps</p>
                    <p class="text-slate-700 font-semibold">${g}</p>
                </div>
                <button class="result-details-btn px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium" data-result-id="${e.id}">
                    Détails
                </button>
            </div>
        </div>
    `,t}function ye(e){const t=e.target.closest(".result-details-btn");if(!t)return;const{resultId:n}=t.dataset;n&&Be(n)}function Ee(){const e=Math.ceil(d.length/z),t=document.getElementById("page-info");t&&(t.textContent=`Page ${E} sur ${e||1}`);const n=document.getElementById("prev-page-btn"),o=document.getElementById("next-page-btn");n&&(n.disabled=E===1),o&&(o.disabled=E===e||e===0)}function ne(e){E+=e,ae(),window.scrollTo({top:0,behavior:"smooth"})}function $(){const e=document.getElementById("filter-module").value,t=document.getElementById("filter-period").value,n=document.getElementById("filter-sort").value;if(d=e?f.filter(o=>o.module===e):[...f],t!=="all"){const o=new Date,s=new Date;t==="week"?s.setDate(o.getDate()-7):t==="month"?s.setDate(o.getDate()-30):t==="year"&&(s.setFullYear(o.getFullYear()),s.setMonth(0),s.setDate(1)),d=d.filter(l=>l.completedAt>=s)}d.sort((o,s)=>n==="date-desc"?s.completedAt-o.completedAt:n==="date-asc"?o.completedAt-s.completedAt:n==="score-desc"?s.score-o.score:n==="score-asc"?o.score-s.score:0),E=1,oe()}function Ce(){document.getElementById("filter-module").value="",document.getElementById("filter-period").value="all",document.getElementById("filter-sort").value="date-desc",$()}function we(){if(d.length===0){v.warning("Aucun résultat à exporter");return}const e=v.showLoadingToast("Génération du fichier CSV...");try{const t=["Date","Module","Mois","Année","Score (%)","Bonnes réponses","Total questions","Temps (s)"],n=d.map(a=>[a.completedAt?a.completedAt.toLocaleString("fr-FR"):"N/A",k[a.module]||a.module,a.month,a.year,a.score,a.correctAnswers,a.totalQuestions,a.timeSpent||0]),o=[t,...n].map(a=>a.join(",")).join(`
`),s=new Blob([o],{type:"text/csv;charset=utf-8;"}),l=document.createElement("a");l.href=URL.createObjectURL(s),l.download=`mes-resultats-${new Date().toISOString().split("T")[0]}.csv`,l.click(),v.updateLoadingToast(e,"Export CSV réussi !","success"),y.info("✅ Export CSV réussi")}catch(t){v.updateLoadingToast(e,"Erreur d'export","error"),v.error("Erreur lors de l'export CSV",4e3),y.error("❌ Erreur export CSV:",t)}}function Be(e){const t=f.find(c=>c.id===e);if(!t)return;const n=k[t.module]||t.module||"Module",o=[t.month,t.year].filter(Boolean).join(" "),s=Number.isFinite(t.score)?t.score:0,l=Number.isFinite(t.correctAnswers)?t.correctAnswers:0,a=Number.isFinite(t.totalQuestions)?t.totalQuestions:0,r=U(t.timeSpent||0),u=Array.isArray(t.answers)?t.answers:[],i=document.createElement("div");i.className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4";const h=document.createElement("div");h.className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col",i.appendChild(h);const C=document.createElement("div");C.className="px-8 py-6 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white";const w=document.createElement("h2");w.className="text-2xl font-bold",w.textContent="Détails du quiz";const B=document.createElement("p");B.className="text-indigo-100 mt-1",B.textContent=o?`${n} - ${o}`:n,C.append(w,B),h.appendChild(C);const g=document.createElement("div");g.className="p-8",h.appendChild(g);const I=document.createElement("div");I.className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8",g.appendChild(I);const D=(c,N,m="")=>{const S=document.createElement("div");S.className="text-center p-4 bg-slate-50 rounded-lg";const x=document.createElement("p");x.className="text-sm text-slate-500 mb-1",x.textContent=c;const p=document.createElement("p");return p.className=`text-3xl font-bold ${m}`.trim(),p.textContent=N,S.append(x,p),S};if(I.append(D("Score",`${s}%`,"text-indigo-600"),D("Bonnes réponses",`${l}/${a}`,"text-slate-900"),D("Temps total",r,"text-slate-900")),u.length>0){const c=document.createElement("h3");c.className="text-xl font-bold text-slate-900 mb-4",c.textContent="Réponses détaillées",g.appendChild(c);const N=document.createElement("div");N.className="space-y-3 max-h-96 overflow-y-auto",g.appendChild(N),u.forEach((m,S)=>{const x=document.createElement("div");x.className=`p-4 rounded-lg border ${m.isCorrect?"bg-green-50 border-green-200":"bg-red-50 border-red-200"}`;const p=document.createElement("div");p.className="flex items-start gap-3",x.appendChild(p);const T=document.createElement("span");T.className="text-2xl",T.textContent=m.isCorrect?"✅":"❌",p.appendChild(T);const A=document.createElement("div");A.className="flex-1",p.appendChild(A);const M=document.createElement("p");M.className="font-semibold text-slate-900 mb-1",M.textContent=`Question ${S+1}`,A.appendChild(M);const j=document.createElement("p");if(j.className="text-sm text-slate-700 mb-2",j.textContent=m.question||"Question indisponible",A.appendChild(j),!m.isCorrect){const V=document.createElement("div");V.className="text-xs text-slate-600 space-y-1";const O=document.createElement("p"),G=document.createElement("strong");G.textContent="Votre réponse :",O.append(G,document.createTextNode(` ${m.selectedAnswer||"N/A"}`));const Y=document.createElement("p"),W=document.createElement("strong");W.textContent="Bonne réponse :",Y.append(W,document.createTextNode(` ${m.correctAnswer||"N/A"}`)),V.append(O,Y),A.appendChild(V)}const F=document.createElement("span");F.className="text-sm text-slate-500",F.textContent=`${Number.isFinite(m.timeSpent)?m.timeSpent:0}s`,p.appendChild(F),N.appendChild(x)})}else{const c=document.createElement("p");c.className="text-slate-500 text-center py-8",c.textContent="Détails des réponses non disponibles",g.appendChild(c)}const R=document.createElement("div");R.className="px-8 py-6 bg-slate-50 border-t border-gray-200 flex justify-end";const L=document.createElement("button");L.id="close-modal-btn",L.className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium",L.textContent="Fermer",R.appendChild(L),h.appendChild(R),document.body.appendChild(i);const H=()=>{i.parentNode&&i.parentNode.removeChild(i)};L.addEventListener("click",H),i.addEventListener("click",c=>{c.target===i&&H()})}function P(){document.getElementById("results-loading")?.classList.add("hidden"),document.getElementById("no-results")?.classList.remove("hidden"),document.getElementById("results-container")?.classList.add("hidden")}function U(e){const t=Math.floor(e/60),n=e%60;return`${t}:${n.toString().padStart(2,"0")}`}function b(e){return e==null?"":String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}async function se(){try{await de(),window.location.href="/"}catch(e){y.error("Erreur lors de la déconnexion:",e)}}
//# sourceMappingURL=results-CWcvERvh.js.map
