import{o as le,l as w,c as Z,k as de,m as ie,n as ce,d as J,t as b,e as f,j as ue}from"./admin-DIKPm6mi.js";import{query as K,collection as _,where as ee,orderBy as te,getDocs as ne}from"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";import{g as me}from"./services-Xx4j0R6D.js";import{s as pe}from"./resources-QLFnHRW1.js";let u=[],d=[],y=1;const Q=10;let N=null,S=null;const M={auto:"AT-AVE-AVEX",loisir:"VTT, Motoneige, etc.",vr:"Véhicules Récréatifs",tracteur:"Équipement Agricole"},ge={auto:"#C41E3A",loisir:"#D4AF37",vr:"#FF9F43",tracteur:"#28A745"};document.addEventListener("DOMContentLoaded",async()=>{le(async t=>{if(!t){window.location.href="/index.html";return}fe(t);const n=await me(t.uid);n&&n.role==="admin"&&(document.getElementById("nav-admin-item")?.classList.remove("hidden"),document.getElementById("admin-badge-nav")?.classList.remove("hidden")),await he(t.uid)}),document.getElementById("logout-btn")?.addEventListener("click",se),document.getElementById("signout-link")?.addEventListener("click",se),document.getElementById("filter-module")?.addEventListener("change",R),document.getElementById("filter-period")?.addEventListener("change",R),document.getElementById("filter-sort")?.addEventListener("change",R),document.getElementById("reset-filters-btn")?.addEventListener("click",Be),document.getElementById("prev-page-btn")?.addEventListener("click",()=>D(-1)),document.getElementById("next-page-btn")?.addEventListener("click",()=>D(1)),document.getElementById("export-results-btn")?.addEventListener("click",ke);const e=document.getElementById("results-list");e&&!e.dataset.eventsBound&&(e.addEventListener("click",re),e.dataset.eventsBound="true")});function fe(e){document.getElementById("user-name")&&(document.getElementById("user-name").textContent=e.displayName||e.email),document.getElementById("user-photo")&&(document.getElementById("user-photo").src=e.photoURL||`https://ui-avatars.com/api/?name=${encodeURIComponent(e.displayName||e.email)}`),document.getElementById("user-display-name")&&(document.getElementById("user-display-name").textContent=e.displayName||e.email),document.getElementById("user-avatar")&&(document.getElementById("user-avatar").src=e.photoURL||`https://ui-avatars.com/api/?name=${encodeURIComponent(e.displayName||e.email)}`)}async function he(e){w.info("📥 Chargement des résultats pour:",e);try{const t=document.getElementById("global-stats"),n=document.getElementById("results-list"),s=document.getElementById("progress-chart-container");t&&Z("global-stats",de(4)),n&&Z("results-list",ie(5)),s&&(s.innerHTML=ce());let o=K(_(J,"quizResults"),ee("userId","==",e),te("completedAt","desc")),a=await ne(o);a.empty&&(o=K(_(J,"quizResults"),ee("userId","==",e),te("date","desc")),a=await ne(o)),u=[],a.forEach(r=>{const c=r.data();let i=null;if(c.completedAt&&typeof c.completedAt.toDate=="function")i=c.completedAt.toDate();else if(c.date&&typeof c.date.toDate=="function")i=c.date.toDate();else if(c.date&&typeof c.date=="string"){const l=new Date(c.date);isNaN(l.getTime())||(i=l)}u.push({id:r.id,...c,completedAt:i})}),w.info(`✅ ${u.length} résultats chargés`),u.length===0?H():(d=[...u],oe())}catch(t){w.error("❌ Erreur lors du chargement des résultats:",t),t.code==="permission-denied"?b.error("Permissions insuffisantes pour consulter vos résultats. Contactez un administrateur."):b.error("Erreur lors du chargement des résultats"),H()}}function xe(){const e=document.getElementById("results-container");if(!e||document.getElementById("results-list"))return;e.innerHTML=`
        <div id="results-list" class="history-list-enhanced">
            <!-- Sera rempli dynamiquement avec classes result-card-enhanced -->
        </div>
        
        <!-- Pagination ENHANCED -->
        <div id="pagination" class="pagination-enhanced">
            <button id="prev-page-btn" class="px-4 py-2 border border-gray-300 rounded-lg text-slate-700 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Précédent
            </button>
            <span id="page-info" class="text-sm text-slate-600">Page 1 sur 1</span>
            <button id="next-page-btn" class="px-4 py-2 border border-gray-300 rounded-lg text-slate-700 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Suivant
            </button>
        </div>
    `;const t=document.getElementById("prev-page-btn"),n=document.getElementById("next-page-btn");t&&!t.dataset.eventsBound&&(t.addEventListener("click",()=>D(-1)),t.dataset.eventsBound="true"),n&&!n.dataset.eventsBound&&(n.addEventListener("click",()=>D(1)),n.dataset.eventsBound="true");const s=document.getElementById("results-list");s&&!s.dataset.eventsBound&&(s.addEventListener("click",re),s.dataset.eventsBound="true")}function oe(){if(d.length===0){H();return}document.getElementById("no-results")?.classList.add("hidden"),xe(),ve(),be(),ae(),document.getElementById("results-loading")?.classList.add("hidden"),document.getElementById("results-container")?.classList.remove("hidden")}function ve(){const e=document.getElementById("global-stats"),t=d.length,n=t>0?Math.round(d.reduce((i,l)=>i+l.score,0)/t):0,s=d.reduce((i,l)=>i+l.totalQuestions,0),o=d.reduce((i,l)=>i+l.correctAnswers,0),a=d.reduce((i,l)=>i+(l.timeSpent||0),0),r=t>0?Math.round(a/t):0,c=f(U(r));e.innerHTML=`
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
                    <p class="text-4xl font-extrabold text-ap-gold-dark">${o}/${s}</p>
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
    `}function be(){ye(),Ee()}function ye(){console.log("🎯 updateProgressChart() appelée");const e=document.getElementById("progress-chart");if(console.log("📊 Canvas ctx:",e),console.log("📊 Chart.js disponible?",typeof Chart<"u"),!e){console.error("❌ Canvas #progress-chart introuvable!");return}const t=[...d].reverse().slice(-10);if(console.log("📊 recentResults:",t),t.length===0){console.warn("⚠️ Aucune donnée pour le graphique de progression"),console.log("📊 allResults.length:",u.length),console.log("📊 filteredResults.length:",d.length);const o=e.closest(".bg-white");o&&(o.innerHTML=`
                <div class="p-8 flex flex-col items-center justify-center" style="min-height: 350px;">
                    <div class="w-24 h-24 bg-ap-red-50 rounded-full flex items-center justify-center mb-6">
                        <svg class="w-12 h-12 text-ap-red-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800 mb-3">📈 Évolution des scores</h3>
                    <p class="text-xl font-semibold text-ap-red-primary mb-2">Aucune donnée à afficher</p>
                    <p class="text-slate-600 text-center max-w-md mb-4">
                        ${u.length===0?"Complétez votre premier quiz pour voir votre progression ici!":"Aucun résultat ne correspond aux filtres sélectionnés. Essayez de réinitialiser les filtres."}
                    </p>
                    ${u.length===0?`<a href="/" class="mt-4 px-6 py-3 bg-ap-red-primary text-white rounded-lg hover:bg-ap-red-dark transition-all font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1">
                            Commencer un quiz
                        </a>`:`<button onclick="document.getElementById('reset-filters-btn').click()" class="mt-4 px-6 py-3 bg-ap-red-primary text-white rounded-lg hover:bg-ap-red-dark transition-all font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1">
                            Réinitialiser les filtres
                        </button>`}
                </div>
            `);return}const n=t.map((o,a)=>{const r=o.completedAt;return r?`${r.getDate()}/${r.getMonth()+1}`:`Quiz ${a+1}`}),s=t.map(o=>o.score);console.log("📊 labels:",n),console.log("📊 scores:",s),N&&N.destroy(),N=new Chart(e,{type:"line",data:{labels:n,datasets:[{label:"Score (%)",data:s,borderColor:"#C41E3A",backgroundColor:"rgba(196, 30, 58, 0.1)",tension:.4,fill:!0,pointRadius:5,pointHoverRadius:7,pointBackgroundColor:"#C41E3A",pointBorderColor:"#fff",pointBorderWidth:2}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{y:{beginAtZero:!0,max:100,ticks:{callback:o=>o+"%"}}}}}),console.log("✅ Chart progression créé:",N)}function Ee(){console.log("🎯 updateModuleChart() appelée");const e=document.getElementById("module-chart");if(console.log("📊 Canvas module ctx:",e),!e){console.error("❌ Canvas #module-chart introuvable!");return}const t={};if(d.forEach(a=>{t[a.module]=(t[a.module]||0)+1}),console.log("📊 moduleCounts:",t),Object.keys(t).length===0){console.warn("⚠️ Aucune donnée pour le graphique de modules"),console.log("📊 allResults.length:",u.length),console.log("📊 filteredResults.length:",d.length);const a=e.closest(".bg-white");a&&(a.innerHTML=`
                <div class="p-8 flex flex-col items-center justify-center" style="min-height: 350px;">
                    <div class="w-24 h-24 bg-ap-gold-light rounded-full flex items-center justify-center mb-6">
                        <svg class="w-12 h-12 text-ap-gold-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
                        </svg>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800 mb-3">📊 Répartition par module</h3>
                    <p class="text-xl font-semibold text-ap-gold-dark mb-2">Aucune donnée à afficher</p>
                    <p class="text-slate-600 text-center max-w-md mb-4">
                        ${u.length===0?"Complétez des quiz dans différents modules pour voir la répartition!":"Aucun résultat ne correspond aux filtres. Essayez de modifier vos critères."}
                    </p>
                    ${u.length===0?`<a href="/" class="mt-4 px-6 py-3 bg-ap-gradient-gold text-ap-red-dark rounded-lg hover:shadow-lg transition-all font-bold shadow-md transform hover:-translate-y-1">
                            Découvrir les modules
                        </a>`:`<button onclick="document.getElementById('reset-filters-btn').click()" class="mt-4 px-6 py-3 bg-ap-gradient-gold text-ap-red-dark rounded-lg hover:shadow-lg transition-all font-bold shadow-md transform hover:-translate-y-1">
                            Réinitialiser les filtres
                        </button>`}
                </div>
            `);return}const n=Object.keys(t).map(a=>M[a]||a),s=Object.values(t),o=Object.keys(t).map(a=>ge[a]||"#C41E3A");console.log("📊 labels:",n),console.log("📊 data:",s),console.log("📊 colors:",o),S&&S.destroy(),S=new Chart(e,{type:"doughnut",data:{labels:n,datasets:[{data:s,backgroundColor:o,borderWidth:2,borderColor:"#ffffff"}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"bottom"}}}}),console.log("✅ Chart module créé:",S)}function ae(){console.log("🎯 renderResults() appelée");const e=document.getElementById("results-list");if(console.log("📋 Container results-list:",e),!e){console.error("❌ Container #results-list introuvable!");return}const t=(y-1)*Q,n=t+Q,s=d.slice(t,n);if(console.log("📋 Page:",y,"Start:",t,"End:",n),console.log("📋 pageResults:",s),s.length===0){console.warn("⚠️ Aucun résultat à afficher pour cette page"),e.replaceChildren();return}const o=document.createDocumentFragment();s.forEach(a=>{o.appendChild(Ce(a))}),e.replaceChildren(o),console.log("✅ Résultats rendus:",s.length,"cartes affichées"),we()}function Ce(e){const t=document.createElement("article");t.className="result-card-enhanced",t.dataset.resultId=e.id;const n=e.completedAt instanceof Date?e.completedAt:null,s=n?`${n.getDate().toString().padStart(2,"0")}/${(n.getMonth()+1).toString().padStart(2,"0")}/${n.getFullYear()} à ${n.getHours().toString().padStart(2,"0")}:${n.getMinutes().toString().padStart(2,"0")}`:"Date inconnue",o=e.score>=80?"text-green-600":e.score>=60?"text-yellow-600":"text-red-600",a=f(M[e.module]||e.module||"Module"),r=e.month?String(e.month).trim():"",c=e.year?String(e.year).trim():"",i=f([r,c].filter(Boolean).join(" ").trim()),l=Number.isFinite(e.score)?e.score:0,p=Number.isFinite(e.correctAnswers)?e.correctAnswers:0,E=Number.isFinite(e.totalQuestions)?e.totalQuestions:0,C=f(`${l}%`),B=f(`${p}/${E}`),x=f(U(e.timeSpent||0)),k=f(s);return t.innerHTML=`
        <div class="flex items-center justify-between">
            <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                    <h3 class="text-lg font-bold text-slate-900">${a}</h3>
                    <span class="px-3 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-full">
                        ${i}
                    </span>
                </div>
                <p class="text-sm text-slate-500">${k}</p>
            </div>
            <div class="flex items-center gap-6">
                <div class="text-center">
                    <p class="text-sm text-slate-500 mb-1">Score</p>
                    <p class="${o} text-3xl font-bold">${C}</p>
                </div>
                <div class="text-center">
                    <p class="text-sm text-slate-500 mb-1">Réponses</p>
                    <p class="text-slate-700 font-semibold">${B}</p>
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
    `,t}function re(e){const t=e.target.closest(".result-details-btn");if(!t)return;const{resultId:n}=t.dataset;n&&Ae(n)}function we(){const e=Math.ceil(d.length/Q),t=document.getElementById("page-info");t&&(t.textContent=`Page ${y} sur ${e||1}`);const n=document.getElementById("prev-page-btn"),s=document.getElementById("next-page-btn");n&&(n.disabled=y===1),s&&(s.disabled=y===e||e===0)}function D(e){y+=e,ae(),window.scrollTo({top:0,behavior:"smooth"})}function R(){const e=document.getElementById("filter-module").value,t=document.getElementById("filter-period").value,n=document.getElementById("filter-sort").value;if(d=e?u.filter(s=>s.module===e):[...u],t!=="all"){const s=new Date,o=new Date;t==="week"?o.setDate(s.getDate()-7):t==="month"?o.setDate(s.getDate()-30):t==="year"&&(o.setFullYear(s.getFullYear()),o.setMonth(0),o.setDate(1)),d=d.filter(a=>a.completedAt>=o)}d.sort((s,o)=>n==="date-desc"?o.completedAt-s.completedAt:n==="date-asc"?s.completedAt-o.completedAt:n==="score-desc"?o.score-s.score:n==="score-asc"?s.score-o.score:0),y=1,oe()}function Be(){document.getElementById("filter-module").value="",document.getElementById("filter-period").value="all",document.getElementById("filter-sort").value="date-desc",R()}function ke(){if(d.length===0){b.warning("Aucun résultat à exporter");return}const e=b.showLoadingToast("Génération du fichier CSV...");try{const t=["Date","Module","Mois","Année","Score (%)","Bonnes réponses","Total questions","Temps (s)"],n=d.map(r=>[r.completedAt?r.completedAt.toLocaleString("fr-FR"):"N/A",M[r.module]||r.module,r.month,r.year,r.score,r.correctAnswers,r.totalQuestions,r.timeSpent||0]),s=[t,...n].map(r=>r.join(",")).join(`
`),o=new Blob([s],{type:"text/csv;charset=utf-8;"}),a=document.createElement("a");a.href=URL.createObjectURL(o),a.download=`mes-resultats-${new Date().toISOString().split("T")[0]}.csv`,a.click(),b.updateLoadingToast(e,"Export CSV réussi !","success"),w.info("✅ Export CSV réussi")}catch(t){b.updateLoadingToast(e,"Erreur d'export","error"),b.error("Erreur lors de l'export CSV",4e3),w.error("❌ Erreur export CSV:",t)}}function Ae(e){const t=u.find(m=>m.id===e);if(!t)return;const n=f(M[t.module]||t.module||"Module"),s=f([t.month,t.year].filter(Boolean).join(" ")),o=Number.isFinite(t.score)?t.score:0,a=Number.isFinite(t.correctAnswers)?t.correctAnswers:0,r=Number.isFinite(t.totalQuestions)?t.totalQuestions:0,c=f(U(t.timeSpent||0)),i=Array.isArray(t.answers)?t.answers:[],l=document.createElement("div");l.className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4";const p=document.createElement("div");p.className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col",p.setAttribute("role","dialog"),p.setAttribute("aria-modal","true"),p.setAttribute("aria-labelledby","modal-title-"+e),l.appendChild(p);const E=document.createElement("div");E.className="px-8 py-6 text-white",E.style.background="var(--ap-gradient-primary)";const C=document.createElement("h2");C.id="modal-title-"+e,C.className="text-2xl font-bold",C.textContent="Détails du quiz";const B=document.createElement("p");B.className="text-white opacity-90 mt-1",B.textContent=s?`${n} - ${s}`:n,E.append(C,B),p.appendChild(E);const x=document.createElement("div");x.className="p-8",p.appendChild(x);const k=document.createElement("div");k.className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8",x.appendChild(k);const T=(m,I,g="")=>{const L=document.createElement("div");L.className="text-center p-4 bg-slate-50 rounded-lg";const v=document.createElement("p");v.className="text-sm text-slate-500 mb-1",v.textContent=m;const h=document.createElement("p");return h.className=`text-3xl font-bold ${g}`.trim(),h.textContent=I,L.append(v,h),L};if(k.append(T("Score",`${o}%`,"text-ap-red-primary"),T("Bonnes réponses",`${a}/${r}`,"text-slate-900"),T("Temps total",c,"text-slate-900")),i.length>0){const m=document.createElement("h3");m.className="text-xl font-bold text-slate-900 mb-4",m.textContent="Réponses détaillées",x.appendChild(m);const I=document.createElement("div");I.className="space-y-3 max-h-96 overflow-y-auto",x.appendChild(I),i.forEach((g,L)=>{const v=document.createElement("div");v.className=`p-4 rounded-lg border ${g.isCorrect?"bg-green-50 border-green-200":"bg-red-50 border-red-200"}`;const h=document.createElement("div");h.className="flex items-start gap-3",v.appendChild(h);const z=document.createElement("span");z.className="text-2xl",z.textContent=g.isCorrect?"✅":"❌",h.appendChild(z);const $=document.createElement("div");$.className="flex-1",h.appendChild($);const V=document.createElement("p");V.className="font-semibold text-slate-900 mb-1",V.textContent=`Question ${L+1}`,$.appendChild(V);const F=document.createElement("p");if(F.className="text-sm text-slate-700 mb-2",F.textContent=g.question||"Question indisponible",$.appendChild(F),!g.isCorrect){const P=document.createElement("div");P.className="text-xs text-slate-600 space-y-1";const G=document.createElement("p"),Y=document.createElement("strong");Y.textContent="Votre réponse :",G.append(Y,document.createTextNode(` ${g.selectedAnswer||"N/A"}`));const W=document.createElement("p"),X=document.createElement("strong");X.textContent="Bonne réponse :",W.append(X,document.createTextNode(` ${g.correctAnswer||"N/A"}`)),P.append(G,W),$.appendChild(P)}const q=document.createElement("span");q.className="text-sm text-slate-500",q.textContent=`${Number.isFinite(g.timeSpent)?g.timeSpent:0}s`,h.appendChild(q),I.appendChild(v)})}else{const m=document.createElement("p");m.className="text-slate-500 text-center py-8",m.textContent="Détails des réponses non disponibles",x.appendChild(m)}const j=document.createElement("div");j.className="px-8 py-6 bg-slate-50 border-t border-gray-200 flex justify-end";const A=document.createElement("button");A.id="close-modal-btn",A.className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium",A.textContent="Fermer",j.appendChild(A),p.appendChild(j),document.body.appendChild(l);const O=()=>{l.parentNode&&l.parentNode.removeChild(l)};A.addEventListener("click",O),l.addEventListener("click",m=>{m.target===l&&O()})}function H(){document.getElementById("results-loading")?.classList.add("hidden"),document.getElementById("no-results")?.classList.add("hidden");const e=document.getElementById("results-container");e&&(e.classList.remove("hidden"),pe("results-container","noResults",{action:{text:"🎯 Commencer un quiz",show:!0,href:"/"}}))}function U(e){const t=Math.floor(e/60),n=e%60;return`${t}:${n.toString().padStart(2,"0")}`}async function se(){try{await ue(),window.location.href="/"}catch(e){w.error("Erreur lors de la déconnexion:",e)}}
//# sourceMappingURL=results-zTErH9Jg.js.map
