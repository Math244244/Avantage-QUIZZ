import{i as I,m as C,o as k,d as S,t as c,f as L}from"./auth-BBQLVo24.js";import{s as h,b as A,f as R,d as M}from"./skeleton-DRQ05dn4.js";import{query as D,collection as T,where as j,orderBy as V,getDocs as U}from"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";import"https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";import"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";import"https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";let i=[],d=[],m=1;const v=10;let g=null,f=null;const p={auto:"AT-AVE-AVEX",loisir:"VTT, Motoneige, etc.",vr:"Véhicules Récréatifs",tracteur:"Équipement Agricole"},F={auto:"#6366f1",loisir:"#06b6d4",vr:"#f97316",tracteur:"#22c55e"};document.addEventListener("DOMContentLoaded",async()=>{if(I()){const e=C();if(e){b(e),e.role==="admin"&&(document.getElementById("nav-admin-item")?.classList.remove("hidden"),document.getElementById("admin-badge-nav")?.classList.remove("hidden")),await y(e.uid||"demo-user");return}}k(async e=>{if(!e){window.location.href="/login.html";return}b(e),await y(e.uid)}),document.getElementById("logout-btn")?.addEventListener("click",E),document.getElementById("signout-link")?.addEventListener("click",E),document.getElementById("filter-module")?.addEventListener("change",u),document.getElementById("filter-period")?.addEventListener("change",u),document.getElementById("filter-sort")?.addEventListener("change",u),document.getElementById("reset-filters-btn")?.addEventListener("click",H),document.getElementById("prev-page-btn")?.addEventListener("click",()=>w(-1)),document.getElementById("next-page-btn")?.addEventListener("click",()=>w(1)),document.getElementById("export-results-btn")?.addEventListener("click",O)});function b(e){document.getElementById("user-name")&&(document.getElementById("user-name").textContent=e.displayName||e.email),document.getElementById("user-photo")&&(document.getElementById("user-photo").src=e.photoURL||`https://ui-avatars.com/api/?name=${encodeURIComponent(e.displayName||e.email)}`),document.getElementById("user-display-name")&&(document.getElementById("user-display-name").textContent=e.displayName||e.email),document.getElementById("user-avatar")&&(document.getElementById("user-avatar").src=e.photoURL||`https://ui-avatars.com/api/?name=${encodeURIComponent(e.displayName||e.email)}`)}async function y(e){console.log("📥 Chargement des résultats pour:",e);try{const t=document.getElementById("global-stats"),l=document.getElementById("results-list"),o=document.getElementById("progress-chart-container");t&&h("global-stats",A(4)),l&&h("results-list",R(5)),o&&(o.innerHTML=M());const s=D(T(S,"quizResults"),j("userId","==",e),V("completedAt","desc")),a=await U(s);i=[],a.forEach(n=>{i.push({id:n.id,...n.data(),completedAt:n.data().completedAt?.toDate()})}),console.log(`✅ ${i.length} résultats chargés`),i.length===0?Y():(d=[...i],B())}catch(t){console.error("❌ Erreur lors du chargement des résultats:",t),c.error("Erreur lors du chargement des résultats"),document.getElementById("results-loading")?.classList.add("hidden")}}function B(){Q(),q(),$(),document.getElementById("results-loading")?.classList.add("hidden"),document.getElementById("results-container")?.classList.remove("hidden")}function Q(){const e=document.getElementById("global-stats"),t=d.length,l=t>0?Math.round(d.reduce((n,r)=>n+r.score,0)/t):0,o=d.reduce((n,r)=>n+r.totalQuestions,0);d.reduce((n,r)=>n+r.correctAnswers,0);const s=d.reduce((n,r)=>n+(r.timeSpent||0),0),a=t>0?Math.round(s/t):0;e.innerHTML=`
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
                    <p class="text-3xl font-bold text-slate-900">${l}%</p>
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
                    <p class="text-3xl font-bold text-slate-900">${x(a)}</p>
                </div>
            </div>
        </div>
    `}function q(){z(),N()}function z(){const e=document.getElementById("progress-chart");if(!e)return;const t=[...d].reverse().slice(-10),l=t.map((s,a)=>{const n=s.completedAt;return n?`${n.getDate()}/${n.getMonth()+1}`:`Quiz ${a+1}`}),o=t.map(s=>s.score);g&&g.destroy(),g=new Chart(e,{type:"line",data:{labels:l,datasets:[{label:"Score (%)",data:o,borderColor:"#6366f1",backgroundColor:"rgba(99, 102, 241, 0.1)",tension:.4,fill:!0,pointRadius:5,pointHoverRadius:7}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{y:{beginAtZero:!0,max:100,ticks:{callback:s=>s+"%"}}}}})}function N(){const e=document.getElementById("module-chart");if(!e)return;const t={};d.forEach(a=>{t[a.module]=(t[a.module]||0)+1});const l=Object.keys(t).map(a=>p[a]||a),o=Object.values(t),s=Object.keys(t).map(a=>F[a]||"#6366f1");f&&f.destroy(),f=new Chart(e,{type:"doughnut",data:{labels:l,datasets:[{data:o,backgroundColor:s,borderWidth:2,borderColor:"#ffffff"}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"bottom"}}}})}function $(){const e=document.getElementById("results-list"),t=(m-1)*v,l=t+v,o=d.slice(t,l);e.innerHTML=o.map(s=>{const a=s.completedAt,n=a?`${a.getDate().toString().padStart(2,"0")}/${(a.getMonth()+1).toString().padStart(2,"0")}/${a.getFullYear()} à ${a.getHours().toString().padStart(2,"0")}:${a.getMinutes().toString().padStart(2,"0")}`:"Date inconnue",r=s.score>=80?"text-green-600":s.score>=60?"text-yellow-600":"text-red-600";return s.score>=80||s.score>=60,`
            <div class="p-6 hover:bg-slate-50 transition-colors">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <div class="flex items-center gap-3 mb-2">
                            <h3 class="text-lg font-bold text-slate-900">${p[s.module]||s.module}</h3>
                            <span class="px-3 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-full">
                                ${s.month} ${s.year}
                            </span>
                        </div>
                        <p class="text-sm text-slate-500">${n}</p>
                    </div>
                    
                    <div class="flex items-center gap-6">
                        <div class="text-center">
                            <p class="text-sm text-slate-500 mb-1">Score</p>
                            <p class="${r} text-3xl font-bold">${s.score}%</p>
                        </div>
                        
                        <div class="text-center">
                            <p class="text-sm text-slate-500 mb-1">Réponses</p>
                            <p class="text-slate-700 font-semibold">${s.correctAnswers}/${s.totalQuestions}</p>
                        </div>
                        
                        <div class="text-center">
                            <p class="text-sm text-slate-500 mb-1">Temps</p>
                            <p class="text-slate-700 font-semibold">${x(s.timeSpent||0)}</p>
                        </div>
                        
                        <button onclick="viewResultDetails('${s.id}')" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                            Détails
                        </button>
                    </div>
                </div>
            </div>
        `}).join(""),P()}function P(){const e=Math.ceil(d.length/v);document.getElementById("page-info").textContent=`Page ${m} sur ${e}`,document.getElementById("prev-page-btn").disabled=m===1,document.getElementById("next-page-btn").disabled=m===e}function w(e){m+=e,$(),window.scrollTo({top:0,behavior:"smooth"})}function u(){const e=document.getElementById("filter-module").value,t=document.getElementById("filter-period").value,l=document.getElementById("filter-sort").value;if(d=e?i.filter(o=>o.module===e):[...i],t!=="all"){const o=new Date,s=new Date;t==="week"?s.setDate(o.getDate()-7):t==="month"?s.setDate(o.getDate()-30):t==="year"&&(s.setFullYear(o.getFullYear()),s.setMonth(0),s.setDate(1)),d=d.filter(a=>a.completedAt>=s)}d.sort((o,s)=>l==="date-desc"?s.completedAt-o.completedAt:l==="date-asc"?o.completedAt-s.completedAt:l==="score-desc"?s.score-o.score:l==="score-asc"?o.score-s.score:0),m=1,B()}function H(){document.getElementById("filter-module").value="",document.getElementById("filter-period").value="all",document.getElementById("filter-sort").value="date-desc",u()}function O(){if(d.length===0){c.warning("Aucun résultat à exporter");return}const e=c.showLoadingToast("Génération du fichier CSV...");try{const t=["Date","Module","Mois","Année","Score (%)","Bonnes réponses","Total questions","Temps (s)"],l=d.map(n=>[n.completedAt?n.completedAt.toLocaleString("fr-FR"):"N/A",p[n.module]||n.module,n.month,n.year,n.score,n.correctAnswers,n.totalQuestions,n.timeSpent||0]),o=[t,...l].map(n=>n.join(",")).join(`
`),s=new Blob([o],{type:"text/csv;charset=utf-8;"}),a=document.createElement("a");a.href=URL.createObjectURL(s),a.download=`mes-resultats-${new Date().toISOString().split("T")[0]}.csv`,a.click(),c.updateLoadingToast(e,"Export CSV réussi !","success"),console.log("✅ Export CSV réussi")}catch(t){c.updateLoadingToast(e,"Erreur d'export","error"),c.error("Erreur lors de l'export CSV",4e3),console.error("❌ Erreur export CSV:",t)}}window.viewResultDetails=function(e){const t=i.find(o=>o.id===e);if(!t)return;const l=document.createElement("div");l.className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",l.innerHTML=`
        <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div class="px-8 py-6 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
                <h2 class="text-2xl font-bold">Détails du quiz</h2>
                <p class="text-indigo-100 mt-1">${p[t.module]||t.module} - ${t.month} ${t.year}</p>
            </div>
            
            <div class="p-8">
                <div class="grid grid-cols-3 gap-6 mb-8">
                    <div class="text-center p-4 bg-slate-50 rounded-lg">
                        <p class="text-sm text-slate-500 mb-1">Score</p>
                        <p class="text-3xl font-bold text-indigo-600">${t.score}%</p>
                    </div>
                    <div class="text-center p-4 bg-slate-50 rounded-lg">
                        <p class="text-sm text-slate-500 mb-1">Bonnes réponses</p>
                        <p class="text-3xl font-bold text-slate-900">${t.correctAnswers}/${t.totalQuestions}</p>
                    </div>
                    <div class="text-center p-4 bg-slate-50 rounded-lg">
                        <p class="text-sm text-slate-500 mb-1">Temps total</p>
                        <p class="text-3xl font-bold text-slate-900">${x(t.timeSpent||0)}</p>
                    </div>
                </div>
                
                ${t.answers&&t.answers.length>0?`
                    <h3 class="text-xl font-bold text-slate-900 mb-4">Réponses détaillées</h3>
                    <div class="space-y-3 max-h-96 overflow-y-auto">
                        ${t.answers.map((o,s)=>`
                            <div class="p-4 rounded-lg ${o.isCorrect?"bg-green-50 border border-green-200":"bg-red-50 border border-red-200"}">
                                <div class="flex items-start gap-3">
                                    <span class="text-2xl">${o.isCorrect?"✅":"❌"}</span>
                                    <div class="flex-1">
                                        <p class="font-semibold text-slate-900 mb-1">Question ${s+1}</p>
                                        <p class="text-sm text-slate-700 mb-2">${o.question}</p>
                                        ${o.isCorrect?"":`
                                            <div class="text-xs text-slate-600">
                                                <p><strong>Votre réponse :</strong> ${o.selectedAnswer}</p>
                                                <p><strong>Bonne réponse :</strong> ${o.correctAnswer}</p>
                                            </div>
                                        `}
                                    </div>
                                    <span class="text-sm text-slate-500">${o.timeSpent}s</span>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                `:'<p class="text-slate-500 text-center py-8">Détails des réponses non disponibles</p>'}
            </div>
            
            <div class="px-8 py-6 bg-slate-50 border-t border-gray-200 flex justify-end">
                <button id="close-modal-btn" class="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium">
                    Fermer
                </button>
            </div>
        </div>
    `,document.body.appendChild(l),l.querySelector("#close-modal-btn").addEventListener("click",()=>{document.body.removeChild(l)}),l.addEventListener("click",o=>{o.target===l&&document.body.removeChild(l)})};function Y(){document.getElementById("results-loading")?.classList.add("hidden"),document.getElementById("no-results")?.classList.remove("hidden")}function x(e){const t=Math.floor(e/60),l=e%60;return`${t}:${l.toString().padStart(2,"0")}`}async function E(){try{await L(),window.location.href="/"}catch(e){console.error("Erreur lors de la déconnexion:",e)}}
//# sourceMappingURL=results-Dpi0vM-o.js.map
