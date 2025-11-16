import{o as j,d as g,c as T,f as z,t as s,e as l,h as D,j as V}from"./admin-BqW1z8Wp.js";import{getDocs as I,query as C,collection as v,where as L,orderBy as U,addDoc as N,deleteDoc as q,doc as H}from"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";import{j as $}from"./services-CfagOv0X.js";const i={noQuestions:`
        <svg class="w-32 h-32 mx-auto mb-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
            </path>
            <circle cx="12" cy="12" r="1.5" fill="currentColor" opacity="0.3"/>
        </svg>
    `,noResults:`
        <svg class="w-32 h-32 mx-auto mb-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
            </path>
            <line x1="6" y1="15" x2="6" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
            <line x1="12" y1="11" x2="12" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
            <line x1="18" y1="7" x2="18" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
        </svg>
    `,noResources:`
        <svg class="w-32 h-32 mx-auto mb-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253">
            </path>
            <circle cx="7" cy="10" r="1" fill="currentColor" opacity="0.3"/>
            <circle cx="17" cy="10" r="1" fill="currentColor" opacity="0.3"/>
        </svg>
    `,noUsers:`
        <svg class="w-32 h-32 mx-auto mb-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
            </path>
        </svg>
    `,noNotifications:`
        <svg class="w-32 h-32 mx-auto mb-6 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9">
            </path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M9.5 9.5l5 5m0-5l-5 5" opacity="0.3">
            </path>
        </svg>
    `,error:`
        <svg class="w-32 h-32 mx-auto mb-6 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">
            </path>
            <circle cx="12" cy="15" r="1" fill="currentColor"/>
        </svg>
    `,loading:`
        <svg class="w-32 h-32 mx-auto mb-6 text-ap-red-primary animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
            </path>
        </svg>
    `,noSearchResults:`
        <svg class="w-32 h-32 mx-auto mb-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z">
            </path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M9 9l6 6m0-6l-6 6" opacity="0.3">
            </path>
        </svg>
    `},F={noQuestions:{title:"Aucune question créée",description:"Commencez par créer votre première question ou importez un fichier JSON",illustration:i.noQuestions,action:{text:"➕ Créer une question",show:!0}},noResults:{title:"Aucun quiz complété",description:"Commencez votre premier quiz pour voir vos résultats ici",illustration:i.noResults,action:{text:"🎯 Commencer un quiz",show:!0,href:"index.html"}},noResources:{title:"Aucune ressource disponible",description:"Les documents et ressources seront ajoutés prochainement",illustration:i.noResources,action:{show:!1}},noUsers:{title:"Aucun utilisateur trouvé",description:"Créez votre premier utilisateur pour commencer",illustration:i.noUsers,action:{text:"👤 Créer un utilisateur",show:!0}},noNotifications:{title:"Aucune notification",description:"Vous êtes à jour ! Aucune nouvelle notification pour le moment.",illustration:i.noNotifications,action:{show:!1}},error:{title:"Une erreur est survenue",description:"Impossible de charger les données. Veuillez réessayer.",illustration:i.error,action:{text:"🔄 Réessayer",show:!0}},noSearchResults:{title:"Aucun résultat trouvé",description:"Essayez avec d'autres mots-clés ou filtres",illustration:i.noSearchResults,action:{text:"🔍 Réinitialiser les filtres",show:!0}},loading:{title:"Chargement en cours...",description:"Veuillez patienter pendant le chargement des données",illustration:i.loading,action:{show:!1}}};function S(e,t={}){const o=F[e];if(!o)return console.error(`Type d'état vide inconnu: ${e}`),"";const n=t.title||o.title,r=t.description||o.description,c=t.illustration||o.illustration,a=t.action!==void 0?t.action:o.action;return`
        <div class="empty-state text-center py-16 px-6">
            ${c}
            <h3 class="text-2xl font-bold text-slate-700 mb-3">
                ${n}
            </h3>
            <p class="text-slate-500 mb-6 max-w-md mx-auto">
                ${r}
            </p>
            ${a.show?`
                <button 
                    class="empty-state-action px-6 py-3 bg-ap-red-primary text-white rounded-lg font-medium hover:bg-ap-red-dark transition-all hover:shadow-lg hover:-translate-y-0.5"
                    ${a.href?`onclick="window.location.href='${a.href}'"`:""}
                >
                    ${a.text}
                </button>
            `:""}
        </div>
    `}function x(e,t,o={}){const n=document.getElementById(e);if(!n){console.error(`Conteneur non trouvé: ${e}`);return}n.innerHTML=S(t,o);const r=n.querySelector(".empty-state");r&&(r.style.opacity="0",r.style.transform="translateY(20px)",setTimeout(()=>{r.style.transition="all 400ms ease-out",r.style.opacity="1",r.style.transform="translateY(0)"},10))}function M(e,t=null){const o=`retry-btn-${Math.random().toString(36).substr(2,9)}`,n=`
        <div class="empty-state text-center py-16 px-6">
            ${i.error}
            <h3 class="text-2xl font-bold text-red-600 mb-3">
                Une erreur est survenue
            </h3>
            <p class="text-slate-600 mb-6 max-w-md mx-auto">
                ${e}
            </p>
            ${t?`
                <button 
                    id="${o}"
                    class="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                    🔄 Réessayer
                </button>
            `:""}
        </div>
    `;return t&&setTimeout(()=>{const r=document.getElementById(o);r&&r.addEventListener("click",t)},10),n}function O(e,t,o=null){const n=document.getElementById(e);if(!n){console.error(`Conteneur non trouvé: ${e}`);return}n.innerHTML=M(t,o)}function Q(){document.querySelectorAll("[data-empty-state-type]").forEach(t=>{const o=t.dataset.emptyStateType,n=t.id||`empty-${Math.random().toString(36).substr(2,9)}`;t.id=n,x(n,o)})}typeof window<"u"&&window.addEventListener("DOMContentLoaded",()=>{Q()});typeof window<"u"&&(window.EmptyStates={create:S,show:x,createError:M,showError:O,illustrations:i});let d=[],m=[],p=!1;const Y={guides:{name:"Guides",icon:"📖",color:"blue"},manuels:{name:"Manuels",icon:"📋",color:"green"},reglements:{name:"Règlements",icon:"🛡️",color:"orange"},formulaires:{name:"Formulaires",icon:"📝",color:"red"},videos:{name:"Vidéos",icon:"🎥",color:"red"}},_={tous:"Tous les modules",auto:"AT-AVE-AVEX",loisir:"VTT, Motoneige, etc.",vr:"Véhicules Récréatifs",tracteur:"Équipement Agricole"};document.addEventListener("DOMContentLoaded",async()=>{j(async e=>{if(!e){window.location.href="/index.html";return}G(e),await J(e.uid),await w()}),document.getElementById("logout-btn")?.addEventListener("click",b),document.getElementById("signout-link")?.addEventListener("click",b),document.getElementById("search-input")?.addEventListener("input",h),document.getElementById("filter-category")?.addEventListener("change",h),document.getElementById("filter-module")?.addEventListener("change",h),document.getElementById("reset-filters-btn")?.addEventListener("click",K),document.getElementById("upload-btn")?.addEventListener("click",P),document.getElementById("cancel-upload-btn")?.addEventListener("click",R),document.getElementById("upload-form")?.addEventListener("submit",W)});function G(e){document.getElementById("user-name")&&(document.getElementById("user-name").textContent=e.displayName||e.email),document.getElementById("user-photo")&&(document.getElementById("user-photo").src=e.photoURL||`https://ui-avatars.com/api/?name=${encodeURIComponent(e.displayName||e.email)}`),document.getElementById("user-display-name")&&(document.getElementById("user-display-name").textContent=e.displayName||e.email),document.getElementById("user-avatar")&&(document.getElementById("user-avatar").src=e.photoURL||`https://ui-avatars.com/api/?name=${encodeURIComponent(e.displayName||e.email)}`)}async function J(e){try{const t=await I(C(v(g,"users"),L("uid","==",e)));t.empty||(p=t.docs[0].data().role==="admin",p&&(document.getElementById("admin-section")?.classList.remove("hidden"),document.getElementById("nav-admin-item")?.classList.remove("hidden"),document.getElementById("admin-badge-nav")?.classList.remove("hidden")))}catch(t){console.error("Erreur lors de la vérification du rôle:",t)}}async function w(){console.log("📥 Chargement des ressources...");try{document.getElementById("resources-container")&&T("resources-container",z(6));const t=await $(),o=C(v(g,"resources"),L("clientId","==",t),U("createdAt","desc")),n=await I(o);d=[],n.forEach(r=>{d.push({id:r.id,...r.data(),createdAt:r.data().createdAt?.toDate()})}),console.log(`✅ ${d.length} ressources chargées`),d.length===0?f():(m=[...d],E()),document.getElementById("resources-loading")?.classList.add("hidden")}catch(e){console.error("❌ Erreur lors du chargement des ressources:",e),s.error("Erreur lors du chargement des ressources"),f(),document.getElementById("resources-loading")?.classList.add("hidden")}}function X(){const e=document.getElementById("resources-container");e&&(e.classList.contains("grid")||(e.className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"))}function E(){const e=document.getElementById("resources-container");if(m.length===0){f();return}X(),e.classList.remove("hidden"),document.getElementById("no-resources")?.classList.add("hidden"),e.innerHTML=m.map(t=>{const o=Y[t.category]||{name:t.category,icon:"📄",color:"gray"},n=t.createdAt?new Date(t.createdAt).toLocaleDateString("fr-FR"):"Date inconnue",r=l(t.title||""),c=l(t.description||"Aucune description"),a=l(o.name),u=l(_[t.module]||t.module||""),y=l(n),A=l(t.id),k=l(t.url||"#"),B=t.downloads?l(String(t.downloads)):"";return`
            <div class="file-card bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden fade-in">
                <div class="p-6">
                    <div class="flex items-start justify-between mb-4">
                        <div class="file-icon text-4xl">${o.icon}</div>
                        ${p?`
                            <button onclick="deleteResource('${A}')" class="text-red-600 hover:text-red-800 transition-colors">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                            </button>
                        `:""}
                    </div>
                    
                    <h3 class="text-lg font-bold text-slate-900 mb-2">${r}</h3>
                    <p class="text-sm text-slate-600 mb-4 line-clamp-2">${c}</p>
                    
                    <div class="flex flex-wrap gap-2 mb-4">
                        <span class="px-3 py-1 bg-${o.color}-100 text-${o.color}-700 text-xs font-medium rounded-full">
                            ${a}
                        </span>
                        <span class="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                            ${u}
                        </span>
                    </div>
                    
                    <div class="flex items-center justify-between text-xs text-slate-500 mb-4">
                        <span>📅 ${y}</span>
                        ${B?`<span>⬇️ ${B} téléchargements</span>`:""}
                    </div>
                    
                    <div class="flex gap-2">
                        <a href="${k}" target="_blank" rel="noopener noreferrer" 
                           class="flex-1 bg-ap-red-primary text-white px-4 py-2 rounded-lg hover:bg-ap-red-dark transition-colors font-medium text-center text-sm">
                            📥 Télécharger
                        </a>
                        <a href="${k}" target="_blank" rel="noopener noreferrer" 
                           class="px-4 py-2 border-2 border-ap-red-primary text-ap-red-primary rounded-lg hover:bg-ap-red-50 transition-colors font-medium text-center text-sm">
                            👁️
                        </a>
                    </div>
                </div>
            </div>
        `}).join("")}function h(){const e=document.getElementById("search-input").value.toLowerCase(),t=document.getElementById("filter-category").value,o=document.getElementById("filter-module").value;m=d.filter(n=>{const r=!e||n.title.toLowerCase().includes(e)||n.description&&n.description.toLowerCase().includes(e),c=!t||n.category===t,a=!o||n.module===o;return r&&c&&a}),E()}function K(){document.getElementById("search-input").value="",document.getElementById("filter-category").value="",document.getElementById("filter-module").value="",m=[...d],E()}window.filterByCategory=function(e){document.getElementById("filter-category").value=e,h()};function P(){document.getElementById("upload-modal")?.classList.remove("hidden")}function R(){document.getElementById("upload-modal")?.classList.add("hidden"),document.getElementById("upload-form")?.reset()}async function W(e){if(e.preventDefault(),!p){s.error("Accès refusé : vous devez être administrateur");return}const t=document.getElementById("doc-title").value,o=document.getElementById("doc-description").value,n=document.getElementById("doc-category").value,r=document.getElementById("doc-module").value,c=document.getElementById("doc-url").value;if(!t||!n||!r||!c){s.error("Veuillez remplir tous les champs obligatoires");return}const a=s.showLoadingToast("Ajout du document...");try{console.log("📤 Ajout d'une nouvelle ressource...");const u=D(),y=await $();await N(v(g,"resources"),{title:t,description:o,category:n,module:r,url:c,clientId:y,downloads:0,createdAt:new Date,createdBy:u.uid}),console.log("✅ Ressource ajoutée avec succès"),s.updateLoadingToast(a,"Document ajouté avec succès !","success"),R(),await w()}catch(u){console.error("❌ Erreur lors de l'ajout de la ressource:",u),s.updateLoadingToast(a,"Erreur d'ajout","error"),s.error("Erreur lors de l'ajout du document",4e3)}}window.deleteResource=async function(e){if(!p){s.error("Accès refusé");return}if(!confirm("Voulez-vous vraiment supprimer ce document ?")){s.info("Suppression annulée",2e3);return}const t=s.showLoadingToast("Suppression du document...");try{console.log("🗑️ Suppression de la ressource:",e),await q(H(g,"resources",e)),console.log("✅ Ressource supprimée"),s.updateLoadingToast(t,"Document supprimé avec succès !","success"),await w()}catch(o){console.error("❌ Erreur lors de la suppression:",o),s.updateLoadingToast(t,"Erreur de suppression","error"),s.error("Erreur lors de la suppression",4e3)}};function f(){document.getElementById("resources-loading")?.classList.add("hidden"),document.getElementById("no-resources")?.classList.add("hidden");const e=document.getElementById("resources-container");e&&(e.classList.remove("hidden"),x("resources-container","noResources"))}async function b(){try{await V(),window.location.href="/"}catch(e){console.error("Erreur lors de la déconnexion:",e)}}export{x as s};
//# sourceMappingURL=resources-BZUIUhVE.js.map
