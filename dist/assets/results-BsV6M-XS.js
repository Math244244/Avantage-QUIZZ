import{t as le,g as re,z as w,n as X,v as b,w as f,y as de}from"./auth-BrQP8TVt.js";import{s as Z,a as ie,b as ce,d as me}from"./skeleton-BmdGa2iR.js";import{query as J,collection as K,where as _,orderBy as ee,getDocs as te}from"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";import"https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";import"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";import"https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";let m=[],d=[],y=1;const Q=10;let N=null,S=null;const D={auto:"AT-AVE-AVEX",loisir:"VTT, Motoneige, etc.",vr:"Véhicules Récréatifs",tracteur:"Équipement Agricole"},ue={auto:"#C41E3A",loisir:"#D4AF37",vr:"#FF9F43",tracteur:"#28A745"};document.addEventListener("DOMContentLoaded",async()=>{le(async t=>{if(!t){window.location.href="/index.html";return}pe(t);const n=await re(t.uid);n&&n.role==="admin"&&(document.getElementById("nav-admin-item")?.classList.remove("hidden"),document.getElementById("admin-badge-nav")?.classList.remove("hidden")),await ge(t.uid)}),document.getElementById("logout-btn")?.addEventListener("click",se),document.getElementById("signout-link")?.addEventListener("click",se),document.getElementById("filter-module")?.addEventListener("change",R),document.getElementById("filter-period")?.addEventListener("change",R),document.getElementById("filter-sort")?.addEventListener("change",R),document.getElementById("reset-filters-btn")?.addEventListener("click",Ce),document.getElementById("prev-page-btn")?.addEventListener("click",()=>ne(-1)),document.getElementById("next-page-btn")?.addEventListener("click",()=>ne(1)),document.getElementById("export-results-btn")?.addEventListener("click",we);const e=document.getElementById("results-list");e&&!e.dataset.eventsBound&&(e.addEventListener("click",ye),e.dataset.eventsBound="true")});function pe(e){document.getElementById("user-name")&&(document.getElementById("user-name").textContent=e.displayName||e.email),document.getElementById("user-photo")&&(document.getElementById("user-photo").src=e.photoURL||`https://ui-avatars.com/api/?name=${encodeURIComponent(e.displayName||e.email)}`),document.getElementById("user-display-name")&&(document.getElementById("user-display-name").textContent=e.displayName||e.email),document.getElementById("user-avatar")&&(document.getElementById("user-avatar").src=e.photoURL||`https://ui-avatars.com/api/?name=${encodeURIComponent(e.displayName||e.email)}`)}async function ge(e){w.info("📥 Chargement des résultats pour:",e);try{const t=document.getElementById("global-stats"),n=document.getElementById("results-list"),o=document.getElementById("progress-chart-container");t&&Z("global-stats",ie(4)),n&&Z("results-list",ce(5)),o&&(o.innerHTML=me());let s=J(K(X,"quizResults"),_("userId","==",e),ee("completedAt","desc")),a=await te(s);a.empty&&(s=J(K(X,"quizResults"),_("userId","==",e),ee("date","desc")),a=await te(s)),m=[],a.forEach(l=>{const c=l.data();let i=null;if(c.completedAt&&typeof c.completedAt.toDate=="function")i=c.completedAt.toDate();else if(c.date&&typeof c.date.toDate=="function")i=c.date.toDate();else if(c.date&&typeof c.date=="string"){const r=new Date(c.date);isNaN(r.getTime())||(i=r)}m.push({id:l.id,...c,completedAt:i})}),w.info(`✅ ${m.length} résultats chargés`),m.length===0?P():(d=[...m],oe())}catch(t){w.error("❌ Erreur lors du chargement des résultats:",t),t.code==="permission-denied"?b.error("Permissions insuffisantes pour consulter vos résultats. Contactez un administrateur."):b.error("Erreur lors du chargement des résultats"),P()}}function oe(){if(d.length===0){document.getElementById("results-container")?.classList.add("hidden"),P();return}document.getElementById("no-results")?.classList.add("hidden"),fe(),he(),ae(),document.getElementById("results-loading")?.classList.add("hidden"),document.getElementById("results-container")?.classList.remove("hidden")}function fe(){const e=document.getElementById("global-stats"),t=d.length,n=t>0?Math.round(d.reduce((i,r)=>i+r.score,0)/t):0,o=d.reduce((i,r)=>i+r.totalQuestions,0),s=d.reduce((i,r)=>i+r.correctAnswers,0),a=d.reduce((i,r)=>i+(r.timeSpent||0),0),l=t>0?Math.round(a/t):0,c=f(H(l));e.innerHTML=`
        <div class="stat-card-enhanced animate-fade-in-up">
            <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-xl bg-ap-red-100 flex items-center justify-center">
                    <svg class="w-7 h-7 text-ap-red-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <div>
                    <p class="text-sm text-slate-600 font-semibold mb-1">Quiz complétés</p>
                    <p class="text-4xl font-extrabold text-ap-red-primary">${t}</p>
                </div>
            </div>
        </div>
        
        <div class="stat-card-enhanced animate-fade-in-up">
            <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-xl bg-ap-success-light flex items-center justify-center">
                    <svg class="w-7 h-7 text-ap-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                    </svg>
                </div>
                <div>
                    <p class="text-sm text-slate-600 font-semibold mb-1">Score moyen</p>
                    <p class="text-4xl font-extrabold text-ap-success">${n}%</p>
                </div>
            </div>
        </div>
        
        <div class="stat-card-enhanced animate-fade-in-up">
            <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-xl bg-ap-gold-light flex items-center justify-center">
                    <svg class="w-7 h-7 text-ap-gold-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                </div>
                <div>
                    <p class="text-sm text-slate-600 font-semibold mb-1">Questions répondues</p>
                    <p class="text-4xl font-extrabold text-ap-gold-dark">${s}/${o}</p>
                </div>
            </div>
        </div>
        
        <div class="stat-card-enhanced animate-fade-in-up">
            <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-xl bg-ap-warning-light flex items-center justify-center">
                    <svg class="w-7 h-7 text-ap-warning-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <div>
                    <p class="text-sm text-slate-600 font-semibold mb-1">Temps moyen</p>
                    <p class="text-4xl font-extrabold text-ap-warning-dark">${c}</p>
                </div>
            </div>
        </div>
    `}function he(){xe(),ve()}function xe(){console.log("🎯 updateProgressChart() appelée");const e=document.getElementById("progress-chart");if(console.log("📊 Canvas ctx:",e),console.log("📊 Chart.js disponible?",typeof Chart<"u"),!e){console.error("❌ Canvas #progress-chart introuvable!");return}const t=[...d].reverse().slice(-10);if(console.log("📊 recentResults:",t),t.length===0){console.warn("⚠️ Aucune donnée pour le graphique de progression"),console.log("📊 allResults.length:",m.length),console.log("📊 filteredResults.length:",d.length);const s=e.closest(".bg-white");s&&(s.innerHTML=`
                <div class="p-8 flex flex-col items-center justify-center" style="min-height: 350px;">
                    <div class="w-24 h-24 bg-ap-red-50 rounded-full flex items-center justify-center mb-6">
                        <svg class="w-12 h-12 text-ap-red-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800 mb-3">📈 Évolution des scores</h3>
                    <p class="text-xl font-semibold text-ap-red-primary mb-2">Aucune donnée à afficher</p>
                    <p class="text-slate-600 text-center max-w-md mb-4">
                        ${m.length===0?"Complétez votre premier quiz pour voir votre progression ici!":"Aucun résultat ne correspond aux filtres sélectionnés. Essayez de réinitialiser les filtres."}
                    </p>
                    ${m.length===0?`<a href="/" class="mt-4 px-6 py-3 bg-ap-red-primary text-white rounded-lg hover:bg-ap-red-dark transition-all font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1">
                            Commencer un quiz
                        </a>`:`<button onclick="document.getElementById('reset-filters-btn').click()" class="mt-4 px-6 py-3 bg-ap-red-primary text-white rounded-lg hover:bg-ap-red-dark transition-all font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1">
                            Réinitialiser les filtres
                        </button>`}
                </div>
            `);return}const n=t.map((s,a)=>{const l=s.completedAt;return l?`${l.getDate()}/${l.getMonth()+1}`:`Quiz ${a+1}`}),o=t.map(s=>s.score);console.log("📊 labels:",n),console.log("📊 scores:",o),N&&N.destroy(),N=new Chart(e,{type:"line",data:{labels:n,datasets:[{label:"Score (%)",data:o,borderColor:"#C41E3A",backgroundColor:"rgba(196, 30, 58, 0.1)",tension:.4,fill:!0,pointRadius:5,pointHoverRadius:7,pointBackgroundColor:"#C41E3A",pointBorderColor:"#fff",pointBorderWidth:2}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{y:{beginAtZero:!0,max:100,ticks:{callback:s=>s+"%"}}}}}),console.log("✅ Chart progression créé:",N)}function ve(){console.log("🎯 updateModuleChart() appelée");const e=document.getElementById("module-chart");if(console.log("📊 Canvas module ctx:",e),!e){console.error("❌ Canvas #module-chart introuvable!");return}const t={};if(d.forEach(a=>{t[a.module]=(t[a.module]||0)+1}),console.log("📊 moduleCounts:",t),Object.keys(t).length===0){console.warn("⚠️ Aucune donnée pour le graphique de modules"),console.log("📊 allResults.length:",m.length),console.log("📊 filteredResults.length:",d.length);const a=e.closest(".bg-white");a&&(a.innerHTML=`
                <div class="p-8 flex flex-col items-center justify-center" style="min-height: 350px;">
                    <div class="w-24 h-24 bg-ap-gold-light rounded-full flex items-center justify-center mb-6">
                        <svg class="w-12 h-12 text-ap-gold-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
                        </svg>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800 mb-3">📊 Répartition par module</h3>
                    <p class="text-xl font-semibold text-ap-gold-dark mb-2">Aucune donnée à afficher</p>
                    <p class="text-slate-600 text-center max-w-md mb-4">
                        ${m.length===0?"Complétez des quiz dans différents modules pour voir la répartition!":"Aucun résultat ne correspond aux filtres. Essayez de modifier vos critères."}
                    </p>
                    ${m.length===0?`<a href="/" class="mt-4 px-6 py-3 bg-ap-gradient-gold text-ap-red-dark rounded-lg hover:shadow-lg transition-all font-bold shadow-md transform hover:-translate-y-1">
                            Découvrir les modules
                        </a>`:`<button onclick="document.getElementById('reset-filters-btn').click()" class="mt-4 px-6 py-3 bg-ap-gradient-gold text-ap-red-dark rounded-lg hover:shadow-lg transition-all font-bold shadow-md transform hover:-translate-y-1">
                            Réinitialiser les filtres
                        </button>`}
                </div>
            `);return}const n=Object.keys(t).map(a=>D[a]||a),o=Object.values(t),s=Object.keys(t).map(a=>ue[a]||"#C41E3A");console.log("📊 labels:",n),console.log("📊 data:",o),console.log("📊 colors:",s),S&&S.destroy(),S=new Chart(e,{type:"doughnut",data:{labels:n,datasets:[{data:o,backgroundColor:s,borderWidth:2,borderColor:"#ffffff"}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"bottom"}}}}),console.log("✅ Chart module créé:",S)}function ae(){console.log("🎯 renderResults() appelée");const e=document.getElementById("results-list");if(console.log("📋 Container results-list:",e),!e){console.error("❌ Container #results-list introuvable!");return}const t=(y-1)*Q,n=t+Q,o=d.slice(t,n);if(console.log("📋 Page:",y,"Start:",t,"End:",n),console.log("📋 pageResults:",o),o.length===0){console.warn("⚠️ Aucun résultat à afficher pour cette page"),e.replaceChildren();return}const s=document.createDocumentFragment();o.forEach(a=>{s.appendChild(be(a))}),e.replaceChildren(s),console.log("✅ Résultats rendus:",o.length,"cartes affichées"),Ee()}function be(e){const t=document.createElement("article");t.className="result-card-enhanced",t.dataset.resultId=e.id;const n=e.completedAt instanceof Date?e.completedAt:null,o=n?`${n.getDate().toString().padStart(2,"0")}/${(n.getMonth()+1).toString().padStart(2,"0")}/${n.getFullYear()} à ${n.getHours().toString().padStart(2,"0")}:${n.getMinutes().toString().padStart(2,"0")}`:"Date inconnue",s=e.score>=80?"text-green-600":e.score>=60?"text-yellow-600":"text-red-600",a=f(D[e.module]||e.module||"Module"),l=e.month?String(e.month).trim():"",c=e.year?String(e.year).trim():"",i=f([l,c].filter(Boolean).join(" ").trim()),r=Number.isFinite(e.score)?e.score:0,p=Number.isFinite(e.correctAnswers)?e.correctAnswers:0,E=Number.isFinite(e.totalQuestions)?e.totalQuestions:0,C=f(`${r}%`),k=f(`${p}/${E}`),x=f(H(e.timeSpent||0)),B=f(o);return t.innerHTML=`
        <div class="flex items-center justify-between">
            <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                    <h3 class="text-lg font-bold text-slate-900">${a}</h3>
                    <span class="px-3 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-full">
                        ${i}
                    </span>
                </div>
                <p class="text-sm text-slate-500">${B}</p>
            </div>
            <div class="flex items-center gap-6">
                <div class="text-center">
                    <p class="text-sm text-slate-500 mb-1">Score</p>
                    <p class="${s} text-3xl font-bold">${C}</p>
                </div>
                <div class="text-center">
                    <p class="text-sm text-slate-500 mb-1">Réponses</p>
                    <p class="text-slate-700 font-semibold">${k}</p>
                </div>
                <div class="text-center">
                    <p class="text-sm text-slate-500 mb-1">Temps</p>
                    <p class="text-slate-700 font-semibold">${x}</p>
                </div>
                <button class="result-details-btn px-4 py-2 bg-ap-red-primary text-white rounded-lg hover:bg-ap-red-dark transition-all transform hover:-translate-y-0.5 font-medium shadow-sm hover:shadow-md" data-result-id="${e.id}" aria-label="Voir les détails du quiz ${a} - ${i}">
                    Détails
                </button>
            </div>
        </div>
    `,t}function ye(e){const t=e.target.closest(".result-details-btn");if(!t)return;const{resultId:n}=t.dataset;n&&ke(n)}function Ee(){const e=Math.ceil(d.length/Q),t=document.getElementById("page-info");t&&(t.textContent=`Page ${y} sur ${e||1}`);const n=document.getElementById("prev-page-btn"),o=document.getElementById("next-page-btn");n&&(n.disabled=y===1),o&&(o.disabled=y===e||e===0)}function ne(e){y+=e,ae(),window.scrollTo({top:0,behavior:"smooth"})}function R(){const e=document.getElementById("filter-module").value,t=document.getElementById("filter-period").value,n=document.getElementById("filter-sort").value;if(d=e?m.filter(o=>o.module===e):[...m],t!=="all"){const o=new Date,s=new Date;t==="week"?s.setDate(o.getDate()-7):t==="month"?s.setDate(o.getDate()-30):t==="year"&&(s.setFullYear(o.getFullYear()),s.setMonth(0),s.setDate(1)),d=d.filter(a=>a.completedAt>=s)}d.sort((o,s)=>n==="date-desc"?s.completedAt-o.completedAt:n==="date-asc"?o.completedAt-s.completedAt:n==="score-desc"?s.score-o.score:n==="score-asc"?o.score-s.score:0),y=1,oe()}function Ce(){document.getElementById("filter-module").value="",document.getElementById("filter-period").value="all",document.getElementById("filter-sort").value="date-desc",R()}function we(){if(d.length===0){b.warning("Aucun résultat à exporter");return}const e=b.showLoadingToast("Génération du fichier CSV...");try{const t=["Date","Module","Mois","Année","Score (%)","Bonnes réponses","Total questions","Temps (s)"],n=d.map(l=>[l.completedAt?l.completedAt.toLocaleString("fr-FR"):"N/A",D[l.module]||l.module,l.month,l.year,l.score,l.correctAnswers,l.totalQuestions,l.timeSpent||0]),o=[t,...n].map(l=>l.join(",")).join(`
`),s=new Blob([o],{type:"text/csv;charset=utf-8;"}),a=document.createElement("a");a.href=URL.createObjectURL(s),a.download=`mes-resultats-${new Date().toISOString().split("T")[0]}.csv`,a.click(),b.updateLoadingToast(e,"Export CSV réussi !","success"),w.info("✅ Export CSV réussi")}catch(t){b.updateLoadingToast(e,"Erreur d'export","error"),b.error("Erreur lors de l'export CSV",4e3),w.error("❌ Erreur export CSV:",t)}}function ke(e){const t=m.find(u=>u.id===e);if(!t)return;const n=f(D[t.module]||t.module||"Module"),o=f([t.month,t.year].filter(Boolean).join(" ")),s=Number.isFinite(t.score)?t.score:0,a=Number.isFinite(t.correctAnswers)?t.correctAnswers:0,l=Number.isFinite(t.totalQuestions)?t.totalQuestions:0,c=f(H(t.timeSpent||0)),i=Array.isArray(t.answers)?t.answers:[],r=document.createElement("div");r.className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4";const p=document.createElement("div");p.className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col",p.setAttribute("role","dialog"),p.setAttribute("aria-modal","true"),p.setAttribute("aria-labelledby","modal-title-"+e),r.appendChild(p);const E=document.createElement("div");E.className="px-8 py-6 text-white",E.style.background="var(--ap-gradient-primary)";const C=document.createElement("h2");C.id="modal-title-"+e,C.className="text-2xl font-bold",C.textContent="Détails du quiz";const k=document.createElement("p");k.className="text-white opacity-90 mt-1",k.textContent=o?`${n} - ${o}`:n,E.append(C,k),p.appendChild(E);const x=document.createElement("div");x.className="p-8",p.appendChild(x);const B=document.createElement("div");B.className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8",x.appendChild(B);const M=(u,I,g="")=>{const $=document.createElement("div");$.className="text-center p-4 bg-slate-50 rounded-lg";const v=document.createElement("p");v.className="text-sm text-slate-500 mb-1",v.textContent=u;const h=document.createElement("p");return h.className=`text-3xl font-bold ${g}`.trim(),h.textContent=I,$.append(v,h),$};if(B.append(M("Score",`${s}%`,"text-ap-red-primary"),M("Bonnes réponses",`${a}/${l}`,"text-slate-900"),M("Temps total",c,"text-slate-900")),i.length>0){const u=document.createElement("h3");u.className="text-xl font-bold text-slate-900 mb-4",u.textContent="Réponses détaillées",x.appendChild(u);const I=document.createElement("div");I.className="space-y-3 max-h-96 overflow-y-auto",x.appendChild(I),i.forEach((g,$)=>{const v=document.createElement("div");v.className=`p-4 rounded-lg border ${g.isCorrect?"bg-green-50 border-green-200":"bg-red-50 border-red-200"}`;const h=document.createElement("div");h.className="flex items-start gap-3",v.appendChild(h);const j=document.createElement("span");j.className="text-2xl",j.textContent=g.isCorrect?"✅":"❌",h.appendChild(j);const L=document.createElement("div");L.className="flex-1",h.appendChild(L);const z=document.createElement("p");z.className="font-semibold text-slate-900 mb-1",z.textContent=`Question ${$+1}`,L.appendChild(z);const V=document.createElement("p");if(V.className="text-sm text-slate-700 mb-2",V.textContent=g.question||"Question indisponible",L.appendChild(V),!g.isCorrect){const q=document.createElement("div");q.className="text-xs text-slate-600 space-y-1";const O=document.createElement("p"),G=document.createElement("strong");G.textContent="Votre réponse :",O.append(G,document.createTextNode(` ${g.selectedAnswer||"N/A"}`));const Y=document.createElement("p"),W=document.createElement("strong");W.textContent="Bonne réponse :",Y.append(W,document.createTextNode(` ${g.correctAnswer||"N/A"}`)),q.append(O,Y),L.appendChild(q)}const F=document.createElement("span");F.className="text-sm text-slate-500",F.textContent=`${Number.isFinite(g.timeSpent)?g.timeSpent:0}s`,h.appendChild(F),I.appendChild(v)})}else{const u=document.createElement("p");u.className="text-slate-500 text-center py-8",u.textContent="Détails des réponses non disponibles",x.appendChild(u)}const T=document.createElement("div");T.className="px-8 py-6 bg-slate-50 border-t border-gray-200 flex justify-end";const A=document.createElement("button");A.id="close-modal-btn",A.className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium",A.textContent="Fermer",T.appendChild(A),p.appendChild(T),document.body.appendChild(r);const U=()=>{r.parentNode&&r.parentNode.removeChild(r)};A.addEventListener("click",U),r.addEventListener("click",u=>{u.target===r&&U()})}function P(){document.getElementById("results-loading")?.classList.add("hidden"),document.getElementById("no-results")?.classList.remove("hidden"),document.getElementById("results-container")?.classList.add("hidden")}function H(e){const t=Math.floor(e/60),n=e%60;return`${t}:${n.toString().padStart(2,"0")}`}async function se(){try{await de(),window.location.href="/"}catch(e){w.error("Erreur lors de la déconnexion:",e)}}
//# sourceMappingURL=results-BsV6M-XS.js.map
