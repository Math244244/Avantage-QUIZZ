const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/services-8itqxsnU.js","assets/quiz-CIpUSg5N.js"])))=>i.map(i=>d[i]);
import{c as Ae,g as Ce,a as Le,b as Me,d as $e,e as ze,i as De,f as pe,h as Ie,u as Te,s as x,j as _}from"./services-8itqxsnU.js";import{getFirestore as Be,query as q,collection as j,where as B,limit as X,getDocs as N,Timestamp as qe,orderBy as ge}from"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";import{initializeApp as je}from"https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";import{getAuth as Ne,GoogleAuthProvider as Ue,signInWithPopup as Qe,signOut as Pe,onAuthStateChanged as He}from"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";import{getDatabase as Fe}from"https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";function Re(e){if(!e||typeof e!="string")return"";const t=document.createElement("div");return t.textContent=e,t.innerHTML}function v(e){return Re(e)}function F(e,t="info",s=3e3){const o=ve(),n=Oe(e,t);return o.appendChild(n),setTimeout(()=>n.classList.add("show"),10),s>0&&setTimeout(()=>{R(n)},s),n}function ve(){let e=document.getElementById("toast-container");return e||(e=document.createElement("div"),e.id="toast-container",e.className="fixed top-4 right-4 z-50 flex flex-col gap-3",document.body.appendChild(e)),e}function Oe(e,t){const s=document.createElement("div");s.className=`toast toast-${t} transform translate-x-full transition-all duration-300`,t==="error"?(s.setAttribute("role","alert"),s.setAttribute("aria-live","assertive")):(s.setAttribute("role","status"),s.setAttribute("aria-live","polite")),s.setAttribute("aria-atomic","true");const o=he(t);return s.innerHTML=`
        <div class="flex items-center gap-3 bg-white rounded-lg shadow-lg border-l-4 ${o.borderColor} p-4 min-w-[320px] max-w-md">
            <div class="flex-shrink-0">
                ${o.icon}
            </div>
            <div class="flex-1">
                <p class="text-sm font-medium text-slate-900">${v(e)}</p>
            </div>
            <button class="toast-close flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors" aria-label="Fermer la notification">
                <svg aria-hidden="true" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `,s.querySelector(".toast-close").addEventListener("click",()=>R(s)),s}function he(e){const t={success:{borderColor:"border-green-500",icon:`<div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
            </div>`},error:{borderColor:"border-red-500",icon:`<div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </div>`},warning:{borderColor:"border-yellow-500",icon:`<div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
            </div>`},info:{borderColor:"border-blue-500",icon:`<div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </div>`}};return t[e]||t.info}function R(e){e.classList.remove("show"),e.classList.add("translate-x-full"),setTimeout(()=>{e.remove();const t=document.getElementById("toast-container");t&&t.children.length===0&&t.remove()},300)}const p={success:(e,t)=>F(e,"success",t),error:(e,t)=>F(e,"error",t),warning:(e,t)=>F(e,"warning",t),info:(e,t)=>F(e,"info",t)};function Ot(e){const t=ve(),s=document.createElement("div");return s.className="toast toast-loading transform translate-x-full transition-all duration-300",s.setAttribute("data-loading","true"),s.innerHTML=`
        <div class="flex items-center gap-3 bg-white rounded-lg shadow-lg border-l-4 border-indigo-500 p-4 min-w-[320px] max-w-md">
            <div class="flex-shrink-0">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
            <div class="flex-1">
                <p class="text-sm font-medium text-slate-900">${v(e)}</p>
            </div>
        </div>
    `,t.appendChild(s),setTimeout(()=>s.classList.add("show"),10),s}function Vt(e,t,s="success"){if(!e||!e.getAttribute("data-loading"))return;const o=he(s),n=e.classList.contains("show");e.className=`toast toast-${s} transform transition-all duration-300${n?" show":""}`,e.innerHTML=`
        <div class="flex items-center gap-3 bg-white rounded-lg shadow-lg border-l-4 ${o.borderColor} p-4 min-w-[320px] max-w-md">
            <div class="flex-shrink-0">
                ${o.icon}
            </div>
            <div class="flex-1">
                <p class="text-sm font-medium text-slate-900">${v(t)}</p>
            </div>
            <button class="toast-close flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `,e.removeAttribute("data-loading"),e.querySelector(".toast-close").addEventListener("click",()=>R(e)),setTimeout(()=>R(e),3e3)}if(typeof document<"u"){const e=document.createElement("style");e.textContent=`
        .toast.show {
            transform: translateX(0) !important;
        }
        
        @media (max-width: 640px) {
            #toast-container {
                left: 1rem;
                right: 1rem;
                top: 1rem;
            }
            
            .toast > div {
                min-width: auto !important;
                width: 100%;
            }
        }
    `,document.head.appendChild(e)}const z=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"||window.location.hostname==="192.168.1.1"||window.location.port==="3200",u={log:(...e)=>{z&&console.log(...e)},error:(...e)=>{console.error(...e)},warn:(...e)=>{z&&console.warn(...e)},info:(...e)=>{z&&console.info(...e)},group:(...e)=>{z&&console.group(...e)},groupEnd:()=>{z&&console.groupEnd()},table:(...e)=>{z&&console.table(...e)}};console.log(z?"🔧 Mode développement - Logs activés":"🚀 Mode production - Logs désactivés (sauf erreurs)");const fe={apiKey:"AIzaSyD8w7Em_xdMGplscfGLrnM72vmm4z5ZTr0",authDomain:"avantage-quizz.firebaseapp.com",databaseURL:"https://avantage-quizz-default-rtdb.firebaseio.com",projectId:"avantage-quizz",storageBucket:"avantage-quizz.firebasestorage.app",messagingSenderId:"919472910099",appId:"1:919472910099:web:e17d4c1cdc7a04c6cab4e6"},W=je(fe),D=Ne(W),I=Be(W);Fe(W);u.log("✅ Firebase initialisé avec succès");u.log("📊 Projet:",fe.projectId);u.log("🔐 Services: Authentication, Firestore, Realtime Database");const _t=Object.freeze(Object.defineProperty({__proto__:null,app:W,auth:D,db:I},Symbol.toStringTag,{value:"Module"})),Ve="modulepreload",_e=function(e){return"/"+e},ne={},ee=function(t,s,o){let n=Promise.resolve();if(s&&s.length>0){let g=function(d){return Promise.all(d.map(c=>Promise.resolve(c).then(l=>({status:"fulfilled",value:l}),l=>({status:"rejected",reason:l}))))};document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),i=a?.nonce||a?.getAttribute("nonce");n=g(s.map(d=>{if(d=_e(d),d in ne)return;ne[d]=!0;const c=d.endsWith(".css"),l=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${l}`))return;const m=document.createElement("link");if(m.rel=c?"stylesheet":Ve,c||(m.as="script"),m.crossOrigin="",m.href=d,i&&m.setAttribute("nonce",i),document.head.appendChild(m),c)return new Promise((S,C)=>{m.addEventListener("load",S),m.addEventListener("error",()=>C(new Error(`Unable to preload CSS for ${d}`)))})}))}function r(a){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=a,window.dispatchEvent(i),!i.defaultPrevented)throw a}return n.then(a=>{for(const i of a||[])i.status==="rejected"&&r(i.reason);return t().catch(r)})},be=new Ue;be.setCustomParameters({prompt:"select_account"});let G=!1;async function Wt(){if(G)return console.warn("⚠️ Connexion déjà en cours, veuillez patienter..."),null;G=!0;try{console.log("🔐 Tentative de connexion Google...");const t=(await Qe(D,be)).user;return console.log("✅ Authentification réussie:",t.displayName),console.log("📧 Email:",t.email),await Ae(t),t}catch(e){console.error("❌ Erreur de connexion:",e);let t="Erreur lors de la connexion. Veuillez réessayer.";if(e.code==="auth/popup-closed-by-user")t="Connexion annulée. Veuillez réessayer.";else if(e.code==="auth/popup-blocked")t="Pop-up bloquée. Autorisez les pop-ups pour ce site.";else if(e.code==="auth/unauthorized-domain")t="Domaine non autorisé. Configurez Firebase Authentication.";else if(e.code==="auth/cancelled-popup-request")return console.warn("⚠️ Requête de popup annulée (clic multiple)"),null;throw e.code!=="auth/cancelled-popup-request"&&alert(t),e}finally{setTimeout(()=>{G=!1},2e3)}}async function Jt(){try{const e=D.currentUser?.displayName||"Utilisateur";await Pe(D),console.log("✅ Déconnexion réussie:",e)}catch(e){throw console.error("❌ Erreur de déconnexion:",e),e}}function Gt(e){return He(D,t=>{t?console.log("👤 Utilisateur connecté:",t.email):console.log("👤 Aucun utilisateur connecté"),e(t)})}function We(){return D.currentUser}async function Kt(e){if(!e)return;if(e.role==="admin"){const s=document.getElementById("nav-admin-item");s&&s.classList.remove("hidden");const o=document.getElementById("admin-badge-nav");o&&o.classList.remove("hidden"),console.log("Admin UI elements shown")}}function w(){return localStorage.getItem("authMode")==="demo"}function we(){try{const e=localStorage.getItem("demoUser");return e?JSON.parse(e):null}catch(e){return console.error("❌ Erreur lecture utilisateur démo:",e),null}}function Yt(){return w()?we():We()}async function Zt(){return new Promise((e,t)=>{if(w()){const o=we();if(o&&o.role==="admin"){console.log("✅ Admin autorisé (mode démo):",o.email),e(o);return}else{console.warn("❌ Accès refusé: utilisateur démo non admin"),alert("Accès refusé. Cette page est réservée aux administrateurs."),window.location.href="/index.html",t(new Error("Non autorisé"));return}}const s=D.onAuthStateChanged(async o=>{if(s(),!o){console.warn("❌ Accès refusé: Utilisateur non connecté"),window.location.href="/index.html",t(new Error("Non authentifié"));return}try{const n=await Ce(o.uid);if(!n||n.role!=="admin"){console.warn("❌ Accès refusé: Utilisateur non administrateur"),alert("Accès refusé. Cette page est réservée aux administrateurs."),window.location.href="/index.html",t(new Error("Non autorisé"));return}console.log("✅ Admin autorisé:",o.email),e(o)}catch(n){console.error("❌ Erreur vérification admin:",n),window.location.href="/index.html",t(n)}})})}function re(e=5){const t=[];for(let s=0;s<e;s++)t.push(`
            <div class="skeleton-list-item bg-white rounded-lg border border-slate-200 p-4 mb-3 animate-pulse">
                <div class="flex items-center gap-4">
                    <div class="skeleton-circle h-10 w-10 bg-slate-200 rounded-full flex-shrink-0"></div>
                    <div class="flex-1">
                        <div class="skeleton-text h-5 w-3/4 bg-slate-200 rounded mb-2"></div>
                        <div class="skeleton-text h-4 w-1/2 bg-slate-200 rounded"></div>
                    </div>
                    <div class="skeleton-text h-8 w-20 bg-slate-200 rounded"></div>
                </div>
            </div>
        `);return t.join("")}function K(){return`
        <div class="skeleton-chart bg-white rounded-xl shadow-md p-6 animate-pulse">
            <div class="skeleton-text h-6 w-48 bg-slate-200 rounded mb-6"></div>
            <div class="h-64 bg-slate-100 rounded-lg flex items-end justify-around p-4">
                <div class="skeleton-bar w-12 bg-slate-200 rounded-t" style="height: 60%"></div>
                <div class="skeleton-bar w-12 bg-slate-200 rounded-t" style="height: 80%"></div>
                <div class="skeleton-bar w-12 bg-slate-200 rounded-t" style="height: 45%"></div>
                <div class="skeleton-bar w-12 bg-slate-200 rounded-t" style="height: 90%"></div>
                <div class="skeleton-bar w-12 bg-slate-200 rounded-t" style="height: 70%"></div>
                <div class="skeleton-bar w-12 bg-slate-200 rounded-t" style="height: 55%"></div>
            </div>
        </div>
    `}function Je(e=5){const t=[];for(let s=0;s<e;s++)t.push(`
            <div class="skeleton-question bg-white rounded-lg border border-slate-200 p-6 mb-4 animate-pulse">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex-1">
                        <div class="skeleton-text h-5 w-3/4 bg-slate-200 rounded mb-3"></div>
                        <div class="flex gap-2 mb-3">
                            <div class="skeleton-badge h-6 w-20 bg-slate-200 rounded-full"></div>
                            <div class="skeleton-badge h-6 w-24 bg-slate-200 rounded-full"></div>
                            <div class="skeleton-badge h-6 w-16 bg-slate-200 rounded-full"></div>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <div class="skeleton-icon h-8 w-8 bg-slate-200 rounded"></div>
                        <div class="skeleton-icon h-8 w-8 bg-slate-200 rounded"></div>
                    </div>
                </div>
                <div class="space-y-2">
                    <div class="skeleton-text h-4 w-full bg-slate-200 rounded"></div>
                    <div class="skeleton-text h-4 w-full bg-slate-200 rounded"></div>
                    <div class="skeleton-text h-4 w-full bg-slate-200 rounded"></div>
                    <div class="skeleton-text h-4 w-2/3 bg-slate-200 rounded"></div>
                </div>
            </div>
        `);return t.join("")}function Ge(e=10){const t=[];for(let s=0;s<e;s++)t.push(`
            <div class="skeleton-user bg-white rounded-lg border border-slate-200 p-4 mb-3 animate-pulse">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4 flex-1">
                        <div class="skeleton-avatar h-12 w-12 bg-slate-200 rounded-full"></div>
                        <div class="flex-1">
                            <div class="skeleton-text h-5 w-48 bg-slate-200 rounded mb-2"></div>
                            <div class="skeleton-text h-4 w-64 bg-slate-200 rounded"></div>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="skeleton-badge h-6 w-16 bg-slate-200 rounded-full"></div>
                        <div class="skeleton-button h-8 w-20 bg-slate-200 rounded"></div>
                    </div>
                </div>
            </div>
        `);return t.join("")}function Xt(e=5){const t=[];for(let s=0;s<e;s++)t.push(`
            <div class="skeleton-result bg-white rounded-lg border border-slate-200 p-5 mb-3 animate-pulse">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="skeleton-icon h-10 w-10 bg-slate-200 rounded-lg"></div>
                            <div>
                                <div class="skeleton-text h-5 w-48 bg-slate-200 rounded mb-2"></div>
                                <div class="skeleton-text h-4 w-32 bg-slate-200 rounded"></div>
                            </div>
                        </div>
                        <div class="flex gap-4">
                            <div class="skeleton-text h-4 w-24 bg-slate-200 rounded"></div>
                            <div class="skeleton-text h-4 w-32 bg-slate-200 rounded"></div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="skeleton-text h-8 w-16 bg-slate-200 rounded mb-2"></div>
                        <div class="skeleton-text h-4 w-20 bg-slate-200 rounded"></div>
                    </div>
                </div>
            </div>
        `);return t.join("")}function es(e=6){const t=[];for(let s=0;s<e;s++)t.push(`
            <div class="skeleton-resource bg-white rounded-lg border border-slate-200 p-5 hover:shadow-md transition-shadow animate-pulse">
                <div class="flex items-start gap-4">
                    <div class="skeleton-icon h-12 w-12 bg-slate-200 rounded-lg flex-shrink-0"></div>
                    <div class="flex-1">
                        <div class="skeleton-text h-5 w-3/4 bg-slate-200 rounded mb-2"></div>
                        <div class="skeleton-text h-4 w-full bg-slate-200 rounded mb-3"></div>
                        <div class="flex gap-2 mb-3">
                            <div class="skeleton-badge h-5 w-20 bg-slate-200 rounded-full"></div>
                            <div class="skeleton-badge h-5 w-16 bg-slate-200 rounded-full"></div>
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="skeleton-text h-4 w-24 bg-slate-200 rounded"></div>
                            <div class="skeleton-button h-8 w-24 bg-slate-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        `);return t.join("")}function Ke(e=4){const t=[];for(let s=0;s<e;s++)t.push(`
            <div class="skeleton-stats bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl p-6 shadow-lg animate-pulse">
                <div class="flex items-center justify-between mb-4">
                    <div class="skeleton-icon h-12 w-12 bg-white/30 rounded-lg"></div>
                    <div class="skeleton-badge h-6 w-16 bg-white/30 rounded-full"></div>
                </div>
                <div class="skeleton-text h-10 w-24 bg-white/30 rounded mb-2"></div>
                <div class="skeleton-text h-4 w-32 bg-white/30 rounded"></div>
            </div>
        `);return t.join("")}function P(e,t){const s=document.getElementById(e);s&&(s.innerHTML=t)}const xe="avantage-quizz-demo-questions";function Ye(){if(!w())return[];const e=localStorage.getItem(xe);if(e)try{return JSON.parse(e).map(s=>({...s,createdAt:new Date(s.createdAt)}))}catch(t){console.warn("⚠️ Erreur lecture questions démo:",t)}return[{id:"1",module:"auto",month:11,year:2025,question:"Quelle est la pression recommandée pour les pneus d'une voiture standard ?",options:["32 PSI","25 PSI","40 PSI","50 PSI"],correctAnswer:0,explanation:"La pression recommandée est généralement de 32 PSI pour un véhicule standard.",createdAt:new Date},{id:"2",module:"auto",month:11,year:2025,question:"À quelle fréquence doit-on changer l'huile moteur ?",options:["Tous les 5000 km","Tous les 10000 km","Tous les 15000 km","Tous les 20000 km"],correctAnswer:1,explanation:"Il est recommandé de changer l'huile tous les 10000 km ou selon les recommandations du fabricant.",createdAt:new Date},{id:"3",module:"loisir",month:11,year:2025,question:"Quel est le poids maximal recommandé pour un bateau remorqué ?",options:["1500 kg","2000 kg","2500 kg","3000 kg"],correctAnswer:2,explanation:"Pour un véhicule standard, 2500 kg est souvent la limite recommandée.",createdAt:new Date},{id:"4",module:"vr",month:10,year:2025,question:"Quelle est la capacité minimale recommandée pour une batterie de VR ?",options:["75 Ah","100 Ah","125 Ah","150 Ah"],correctAnswer:1,explanation:"Une batterie de 100 Ah est le minimum recommandé pour un VR.",createdAt:new Date},{id:"5",module:"tracteur",month:10,year:2025,question:"À quelle profondeur doit-on labourer pour les cultures céréalières ?",options:["10-15 cm","20-25 cm","30-35 cm","40-45 cm"],correctAnswer:1,explanation:"La profondeur idéale est de 20-25 cm pour les céréales.",createdAt:new Date}]}function te(e){w()&&(localStorage.setItem(xe,JSON.stringify(e)),console.log("💾 Questions démo sauvegardées:",e.length))}let L=Ye();const Ze={total:240,byModule:{auto:85,loisir:62,vr:54,tracteur:39},recent:12};let k=[],y={module:"",month:"",year:new Date().getFullYear()},E=1;const O=20;async function ts(){console.log("Initialisation du gestionnaire de questions"),await M(),await T(),Xe()}function Xe(){const e=document.getElementById("create-question-form");e&&e.addEventListener("submit",tt);const t=document.getElementById("json-file-input");t&&t.addEventListener("change",st);const s=document.getElementById("browse-json-btn");s&&s.addEventListener("click",()=>t?.click());const o=document.getElementById("filter-module"),n=document.getElementById("filter-month"),r=document.getElementById("filter-year"),a=document.getElementById("search-questions"),i=document.getElementById("questions-list");o&&o.addEventListener("change",Y),n&&n.addEventListener("change",Y),r&&r.addEventListener("change",Y),a&&a.addEventListener("input",lt),i&&!i.dataset.eventsBound&&(i.addEventListener("click",et),i.dataset.eventsBound="true");const g=document.getElementById("prev-page-btn"),d=document.getElementById("next-page-btn");g&&g.addEventListener("click",()=>ae(-1)),d&&d.addEventListener("click",()=>ae(1))}function et(e){const t=e.target.closest(".edit-question-btn, .delete-question-btn");if(!t)return;const s=t.dataset.questionId;if(s){if(t.classList.contains("edit-question-btn")){at(s);return}t.classList.contains("delete-question-btn")&&it(s)}}async function M(){try{if(document.getElementById("questions-list")&&P("questions-list",Je(5)),w()){console.log("📝 Mode démo : Chargement des questions simulées..."),await new Promise(s=>setTimeout(s,500)),k=L.filter(s=>!(y.module&&s.module!==y.module||y.month&&s.month!==parseInt(y.month)||y.year&&s.year!==parseInt(y.year))),console.log(`✅ ${k.length} questions simulées chargées`),V();return}const t={};y.module&&(t.module=y.module),y.month&&(t.month=parseInt(y.month)),y.year&&(t.year=parseInt(y.year)),k=await Le(t),console.log(`Questions chargees: ${k.length}`),V()}catch(e){console.error("Erreur chargement questions:",e);const t=document.getElementById("questions-list");t&&(t.innerHTML=`
                <div class="text-center py-12 text-red-500">
                    <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p class="text-lg font-medium">Erreur lors du chargement</p>
                    <p class="text-sm">${e.message}</p>
                </div>
            `)}}function V(){const e=document.getElementById("questions-list");if(!e)return;if(k.length===0){const r=document.createElement("div");r.className="text-center py-12 text-slate-500",r.innerHTML=`
            <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p class="text-lg font-medium">Aucune question trouvee</p>
            <p class="text-sm">Creez votre premiere question ou importez un fichier JSON</p>
        `,e.replaceChildren(r);return}const t=(E-1)*O,s=t+O,o=k.slice(t,s),n=document.createDocumentFragment();o.forEach(r=>{n.appendChild(ye(r))}),e.replaceChildren(n),ct()}function ye(e){const t={auto:"indigo",loisir:"cyan",vr:"orange",tracteur:"green"},s={auto:"🚗",loisir:"🏔️",vr:"🚐",tracteur:"🚜"},o=t[e.module]||"gray",n=s[e.module]||"📝",a=["Jan","Fev","Mar","Avr","Mai","Juin","Juil","Aout","Sep","Oct","Nov","Dec"][e.month-1]||e.month,i=e.createdAt?.seconds?new Date(e.createdAt.seconds*1e3):e.createdAt instanceof Date?e.createdAt:null,g=i?i.toLocaleDateString("fr-FR"):"N/A",d=document.createElement("template");return d.innerHTML=`
        <article class="question-card bg-white rounded-xl shadow-md p-6 mb-4 hover:shadow-lg transition-shadow" data-question-id="${e.id}">
            <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-3">
                    <span class="text-2xl">${n}</span>
                    <div>
                        <span class="inline-block bg-${o}-100 text-${o}-700 text-xs font-semibold px-3 py-1 rounded-full">
                            ${A(e.module.toUpperCase())}
                        </span>
                        <span class="ml-2 text-sm text-slate-500">${A(`${a} ${e.year}`)}</span>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button class="edit-question-btn text-indigo-600 hover:text-indigo-800 p-2 rounded hover:bg-indigo-50 transition" data-question-id="${e.id}" title="Modifier">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                    </button>
                    <button class="delete-question-btn text-red-600 hover:text-red-800 p-2 rounded hover:bg-red-50 transition" data-question-id="${e.id}" title="Supprimer">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <h4 class="text-lg font-semibold text-slate-900 mb-4">${A(e.question)}</h4>
            <div class="space-y-2 mb-4">
                ${e.options.map((c,l)=>`
                    <div class="flex items-start gap-2 text-sm ${l===e.correctAnswer?"font-semibold text-green-700 bg-green-50 p-2 rounded":"text-slate-600"}">
                        <span class="font-bold">${String.fromCharCode(65+l)})</span>
                        <span>${A(c)}</span>
                        ${l===e.correctAnswer?'<svg class="w-5 h-5 text-green-600 ml-auto flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>':""}
                    </div>
                `).join("")}
            </div>
            <div class="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                <p class="text-xs font-semibold text-blue-700 mb-1">💡 Explication</p>
                <p class="text-sm text-blue-900">${A(e.explanation)}</p>
            </div>
            <div class="mt-4 pt-4 border-t border-slate-200 text-xs text-slate-500">
                Creee le: ${A(g)}${e.createdBy?A(` | Par: ${e.createdBy}`):""}
            </div>
        </article>
    `,d.content.firstElementChild}async function tt(e){e.preventDefault();const t=e.target,s=t.querySelector('[type="submit"]'),o=s.innerHTML;try{s.disabled=!0,s.innerHTML='<svg class="animate-spin h-5 w-5 inline" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Creation...';const n={question:t.querySelector('[name="question"]').value,options:[t.querySelector('[name="option1"]').value,t.querySelector('[name="option2"]').value,t.querySelector('[name="option3"]').value,t.querySelector('[name="option4"]').value],correctAnswer:parseInt(t.querySelector('[name="correctAnswer"]:checked').value),explanation:t.querySelector('[name="explanation"]').value,module:t.querySelector('[name="module"]').value,month:parseInt(t.querySelector('[name="month"]').value),year:parseInt(t.querySelector('[name="year"]').value)};if(w()){console.log("📝 Mode démo : Simulation création question..."),await new Promise(a=>setTimeout(a,500));const r={id:`demo-${Date.now()}`,...n,explanation:n.explanation||"Explication non fournie",createdAt:new Date};L.unshift(r),te(L),U("✅ Question créée avec succès (mode démo) !"),t.reset(),await M(),await T();return}await $e(n),U("Question creee avec succes!"),t.reset(),await M(),await T()}catch(n){console.error("Erreur creation question:",n),J("create-question-error",n.message||"Erreur lors de la creation")}finally{s.disabled=!1,s.innerHTML=o}}async function st(e){const t=e.target.files[0];if(t)try{dt("json-preview");const s=await t.text(),o=JSON.parse(s);ot(o),nt(o,t.name)}catch(s){console.error("Erreur lecture JSON:",s),J("json-preview",s.message||"Fichier JSON invalide")}}function ot(e){if(!e.module||!e.month||!e.year)throw new Error("Champs obligatoires manquants: module, month, year");if(!Array.isArray(e.questions)||e.questions.length===0)throw new Error("Le fichier doit contenir au moins une question");return e.questions.forEach((t,s)=>{if(!t.question||t.question.length<10)throw new Error(`Question ${s+1}: texte trop court (min 10 caracteres)`);if(!Array.isArray(t.options)||t.options.length!==4)throw new Error(`Question ${s+1}: doit avoir exactement 4 options`);if(t.correctAnswer===void 0||t.correctAnswer<0||t.correctAnswer>3)throw new Error(`Question ${s+1}: correctAnswer invalide (doit etre 0-3)`);if(!t.explanation||t.explanation.length<20)throw new Error(`Question ${s+1}: explication trop courte (min 20 caracteres)`)}),!0}function nt(e,t){const s=document.getElementById("json-preview");if(!s)return;const o={auto:"Auto",loisir:"Loisir",vr:"VR",tracteur:"Tracteur"},n=["Janvier","Fevrier","Mars","Avril","Mai","Juin","Juillet","Aout","Septembre","Octobre","Novembre","Decembre"];s.innerHTML=`
        <div class="bg-green-50 border-2 border-green-500 rounded-xl p-6">
            <div class="flex items-start justify-between mb-4">
                <div>
                    <h4 class="text-lg font-bold text-green-900 mb-2">📄 ${t}</h4>
                    <div class="space-y-1 text-sm">
                        <p class="text-green-800">✓ Format valide</p>
                        <p class="text-green-800">✓ ${e.questions.length} question(s) detectee(s)</p>
                        <p class="text-green-800">✓ Module: ${o[e.module]||e.module}</p>
                        <p class="text-green-800">✓ Periode: ${n[e.month-1]} ${e.year}</p>
                    </div>
                </div>
                <button id="cancel-import-btn" class="text-slate-500 hover:text-slate-700">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            
            <div class="bg-white rounded-lg p-4 mb-4 max-h-60 overflow-y-auto">
                <p class="font-semibold text-slate-900 mb-2">Apercu des premieres questions:</p>
                <ol class="space-y-2 text-sm text-slate-700">
                    ${e.questions.slice(0,5).map((r,a)=>`
                        <li><strong>${a+1}.</strong> ${A(r.question.substring(0,80))}${r.question.length>80?"...":""}</li>
                    `).join("")}
                    ${e.questions.length>5?`<li class="text-slate-500 italic">... et ${e.questions.length-5} autre(s)</li>`:""}
                </ol>
            </div>
            
            <div class="flex gap-3">
                <button id="confirm-import-btn" class="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition">
                    Importer les ${e.questions.length} questions →
                </button>
            </div>
        </div>
    `,document.getElementById("confirm-import-btn")?.addEventListener("click",()=>rt(e)),document.getElementById("cancel-import-btn")?.addEventListener("click",()=>{s.innerHTML="",document.getElementById("json-file-input").value=""})}async function rt(e){const t=document.getElementById("json-preview"),s=document.getElementById("confirm-import-btn");try{if(s.disabled=!0,s.innerHTML='<svg class="animate-spin h-5 w-5 inline" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle></svg> Import en cours...',w()){console.log("📝 Mode démo : Simulation import JSON..."),await new Promise(r=>setTimeout(r,1e3));const n=e.questions||[];n.forEach((r,a)=>{L.unshift({id:`demo-imported-${Date.now()}-${a}`,question:r.question,options:r.options,correctAnswer:r.correctAnswer,explanation:r.explanation||"Pas d'explication fournie",module:e.module,month:e.month,year:e.year,createdAt:new Date})}),te(L),U(`✅ Import terminé (mode démo): ${n.length} questions importées`),t.innerHTML="",document.getElementById("json-file-input").value="",await M(),await T();return}const o=await De(e);U(`Import termine: ${o.success}/${o.total} questions importees`),o.errors.length>0&&console.warn("Erreurs import:",o.errors),t.innerHTML="",document.getElementById("json-file-input").value="",await M(),await T()}catch(o){console.error("Erreur import:",o),J("json-preview",o.message||"Erreur lors de l import")}}function at(e){k.find(s=>s.id===e)&&alert(`Edition de la question ${e}
A implementer: modal d'edition`)}async function it(e){const t=k.find(o=>o.id===e);if(!(!t||!confirm(`Voulez-vous vraiment supprimer cette question?

"${t.question.substring(0,100)}..."

Cette action est irreversible.`)))try{if(w()){console.log("📝 Mode démo : Simulation suppression question..."),await new Promise(n=>setTimeout(n,300));const o=L.findIndex(n=>n.id===e);o>-1&&(L.splice(o,1),te(L)),U("✅ Question supprimée avec succès (mode démo)"),await M(),await T();return}await ze(e),U("Question supprimee avec succes"),await M(),await T()}catch(o){console.error("Erreur suppression:",o),J("questions-list",o.message||"Erreur lors de la suppression")}}async function Y(e){const t=e.target.id.replace("filter-","");y[t]=e.target.value,E=1,await M()}function lt(e){const t=e.target.value.toLowerCase();if(!t){V();return}const s=k.filter(r=>r.question.toLowerCase().includes(t)||r.options.some(a=>a.toLowerCase().includes(t))||r.explanation.toLowerCase().includes(t)),o=document.getElementById("questions-list");if(!o)return;if(s.length===0){const r=document.createElement("div");r.className="text-center py-12 text-slate-500",r.innerHTML=`
            <p class="text-lg">Aucun resultat pour "${A(t)}"</p>
        `,o.replaceChildren(r);return}const n=document.createDocumentFragment();s.forEach(r=>{n.appendChild(ye(r))}),o.replaceChildren(n)}function ae(e){const t=Math.ceil(k.length/O);E+=e,E<1&&(E=1),E>t&&(E=t),V(),window.scrollTo({top:0,behavior:"smooth"})}function ct(){const e=Math.ceil(k.length/O),t=document.getElementById("page-info"),s=document.getElementById("prev-page-btn"),o=document.getElementById("next-page-btn");t&&(t.textContent=`Page ${E}/${e||1}`),s&&(s.disabled=E===1),o&&(o.disabled=E===e||e===0)}async function T(){try{if(w()){console.log("📊 Mode démo : Chargement des stats simulées..."),ie(Ze);return}const e=await Me();ie(e)}catch(e){console.error("Erreur chargement stats:",e)}}function ie(e){const t=document.getElementById("questions-stats");if(!t)return;const s={auto:"Auto",loisir:"Loisir",vr:"VR",tracteur:"Tracteur"};t.innerHTML=`
        <div class="bg-white rounded-xl shadow-md p-6">
            <h3 class="text-xl font-bold text-slate-900 mb-4">📊 Statistiques des Questions</h3>
            
            <div class="mb-6">
                <p class="text-3xl font-bold text-indigo-600 mb-1">${e.total}</p>
                <p class="text-sm text-slate-600">questions au total</p>
            </div>
            
            <div class="space-y-3">
                <p class="text-sm font-semibold text-slate-700 mb-2">Par module:</p>
                ${Object.entries(e.byModule).map(([o,n])=>{const r=(n/e.total*100).toFixed(0);return`
                        <div>
                            <div class="flex justify-between text-sm mb-1">
                                <span class="text-slate-700">${s[o]||o}</span>
                                <span class="font-semibold">${n} (${r}%)</span>
                            </div>
                            <div class="bg-slate-200 rounded-full h-2">
                                <div class="bg-indigo-600 rounded-full h-2 transition-all" style="width: ${r}%"></div>
                            </div>
                        </div>
                    `}).join("")}
            </div>
        </div>
    `}function dt(e){const t=document.getElementById(e);t&&(t.innerHTML=`
        <div class="text-center py-12">
            <svg class="animate-spin h-12 w-12 mx-auto text-indigo-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-slate-600 mt-4">Chargement...</p>
        </div>
    `)}function J(e,t){const s=document.getElementById(e);if(!s){alert(`Erreur: ${t}`);return}s.innerHTML=`
        <div class="bg-red-50 border-2 border-red-500 rounded-xl p-6 text-center">
            <svg class="w-12 h-12 mx-auto text-red-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-red-900 font-semibold">${t}</p>
        </div>
    `}function U(e){const t=document.createElement("div");t.className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-xl z-50 animate-fade-in",t.innerHTML=`
        <div class="flex items-center gap-3">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span class="font-semibold">${e}</span>
        </div>
    `,document.body.appendChild(t),setTimeout(()=>{t.remove()},3e3)}function A(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}const ut=[{id:"1",email:"admin@avantage-quizz.com",displayName:"Administrateur Principal",role:"admin",totalQuizzes:0,averageScore:0,createdAt:new Date("2025-01-15"),lastLogin:new Date},{id:"2",email:"alice.dupont@example.com",displayName:"Alice Dupont",role:"user",totalQuizzes:24,averageScore:92,createdAt:new Date("2025-02-20"),lastLogin:new Date},{id:"3",email:"bob.martin@example.com",displayName:"Bob Martin",role:"user",totalQuizzes:21,averageScore:88,createdAt:new Date("2025-03-10"),lastLogin:new Date(Date.now()-864e5)},{id:"4",email:"claire.bernard@example.com",displayName:"Claire Bernard",role:"user",totalQuizzes:19,averageScore:85,createdAt:new Date("2025-03-25"),lastLogin:new Date(Date.now()-1728e5)},{id:"5",email:"david.dubois@example.com",displayName:"David Dubois",role:"user",totalQuizzes:18,averageScore:83,createdAt:new Date("2025-04-05"),lastLogin:new Date(Date.now()-2592e5)}],mt={total:42,admins:2,regularUsers:40,activeToday:8,activeWeek:23};let f=[],b={role:"",status:"all"},h={lastDoc:null,hasMore:!1,isLoading:!1,pageSize:20};async function ss(){console.log("Initialisation du gestionnaire utilisateurs"),await se(),await Se(),pt()}function pt(){const e=document.getElementById("create-user-form");e&&e.addEventListener("submit",gt);const t=document.getElementById("generate-password-btn");t&&t.addEventListener("click",vt);const s=document.getElementById("filter-user-role"),o=document.getElementById("filter-user-status"),n=document.getElementById("search-users");s&&s.addEventListener("change",le),o&&o.addEventListener("change",le),n&&n.addEventListener("input",kt)}async function gt(e){e.preventDefault();const t=document.getElementById("create-user-error"),s=document.getElementById("create-user-success"),o=document.getElementById("create-user-btn");t.classList.add("hidden"),s.classList.add("hidden");const n=new FormData(e.target),r={displayName:n.get("displayName"),email:n.get("email"),password:n.get("password"),role:n.get("role")};if(!r.displayName||!r.email||!r.password||!r.role){Z(t,"Tous les champs sont obligatoires"),p.error("Veuillez remplir tous les champs");return}if(r.password.length<6){Z(t,"Le mot de passe doit contenir au moins 6 caractères"),p.error("Mot de passe trop court (minimum 6 caractères)");return}o.disabled=!0,o.textContent="⏳ Création en cours...";const a=p.showLoadingToast("Création de l'utilisateur...");try{throw console.log("Création d'un nouvel utilisateur:",r.email),p.updateLoadingToast(a,"Cloud Function requise","error"),new Error(`⚠️ CLOUD FUNCTION REQUISE: Cette fonctionnalité nécessite une Cloud Function Firebase pour créer des utilisateurs avec mot de passe. Actuellement, seule l'authentification Google est supportée. Pour activer cette fonctionnalité:

1. Activer Email/Password dans Firebase Auth
2. Créer une Cloud Function createUser
3. Déployer la fonction sur Firebase`)}catch(i){console.error("❌ Erreur création utilisateur:",i),Z(t,i.message)}finally{o.disabled=!1,o.textContent="➕ Créer l'utilisateur"}}function vt(){const e="ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$%&";let s="";for(let n=0;n<12;n++)s+=e.charAt(Math.floor(Math.random()*e.length));const o=document.querySelector('input[name="password"]');o&&(o.value=s,o.type="text",navigator.clipboard.writeText(s).then(()=>{p.success("Mot de passe généré et copié ! Sauvegardez-le en lieu sûr.",5e3)}).catch(()=>{p.warning(`Mot de passe généré: ${s}

Copiez-le manuellement.`,7e3)}))}function Z(e,t){e.textContent=t,e.classList.remove("hidden"),e.scrollIntoView({behavior:"smooth",block:"nearest"})}async function se(){try{if(document.getElementById("users-list")&&P("users-list",Ge(10)),w()){console.log("👥 Mode démo : Chargement des utilisateurs simulés..."),await new Promise(o=>setTimeout(o,500)),f=ut.filter(o=>{if(b.role&&o.role!==b.role)return!1;if(b.status!=="all"){const n=new Date;n.setDate(n.getDate()-7);const a=o.lastLogin>n;if(b.status==="active"&&!a||b.status==="inactive"&&a)return!1}return!0}),console.log(`✅ ${f.length} utilisateurs simulés chargés`),H();return}const t={};b.role&&(t.role=b.role),h.lastDoc=null,h.hasMore=!1;const s=await pe(t,h.pageSize,null);if(f=s.users,h.lastDoc=s.lastDoc,h.hasMore=s.hasMore,b.status!=="all"){const o=new Date;o.setDate(o.getDate()-7),f=f.filter(n=>{if(!n.lastLogin)return b.status==="inactive";const a=(n.lastLogin.toDate?n.lastLogin.toDate():new Date(n.lastLogin))>o;return b.status==="active"?a:!a})}console.log(`Utilisateurs charges: ${f.length}`),H(),ke()}catch(e){console.error("Erreur chargement utilisateurs:",e);const t=document.getElementById("users-list");if(t){const s=v(e.message);t.innerHTML=`
                <div class="text-center py-12 text-red-500">
                    <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p class="text-lg font-medium">Erreur lors du chargement</p>
                    <p class="text-sm">${s}</p>
                </div>
            `}}}function H(){const e=document.getElementById("users-list");if(e){if(f.length===0){e.innerHTML=`
            <div class="text-center py-12 text-slate-500">
                <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <p class="text-lg font-medium">Aucun utilisateur trouve</p>
            </div>
        `;return}e.innerHTML=f.map(t=>ft(t)).join(""),wt()}}async function ht(){if(!(h.isLoading||!h.hasMore))try{h.isLoading=!0;const e={};b.role&&(e.role=b.role);const t=await pe(e,h.pageSize,h.lastDoc);let s=t.users;if(b.status!=="all"){const o=new Date;o.setDate(o.getDate()-7),s=s.filter(n=>{if(!n.lastLogin)return b.status==="inactive";const a=(n.lastLogin.toDate?n.lastLogin.toDate():new Date(n.lastLogin))>o;return b.status==="active"?a:!a})}f=[...f,...s],h.lastDoc=t.lastDoc,h.hasMore=t.hasMore,H(),ke(),console.log(`✅ ${s.length} utilisateurs supplémentaires chargés`)}catch(e){console.error("❌ Erreur chargement utilisateurs supplémentaires:",e),p.error("Erreur lors du chargement des utilisateurs supplémentaires")}finally{h.isLoading=!1}}function ke(){const e=document.getElementById("users-pagination-controls");if(e&&e.remove(),!h.hasMore&&f.length<=h.pageSize)return;const t=document.getElementById("users-list");if(!t)return;const s=`
        <div id="users-pagination-controls" class="mt-6 flex justify-center items-center gap-4">
            ${h.hasMore?`
                <button 
                    id="load-more-users-btn" 
                    class="px-6 py-3 bg-ap-red-primary text-white rounded-lg hover:bg-ap-red-dark transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    ${h.isLoading?"disabled":""}
                >
                    ${h.isLoading?`
                        <svg class="animate-spin h-5 w-5 inline mr-2" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Chargement...
                    `:`
                        <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        Charger plus
                    `}
                </button>
            `:""}
            <span class="text-sm text-slate-600">
                ${f.length} utilisateur${f.length>1?"s":""} affiché${f.length>1?"s":""}
            </span>
        </div>
    `;t.insertAdjacentHTML("beforeend",s);const o=document.getElementById("load-more-users-btn");o&&o.addEventListener("click",ht)}function ft(e){const t=e.role==="admin",s=t?"yellow":"blue",o=t?"🔰":"👤",n=e.lastLogin?e.lastLogin.toDate?e.lastLogin.toDate():new Date(e.lastLogin):null,r=e.createdAt?e.createdAt.toDate?e.createdAt.toDate():new Date(e.createdAt):null,a=n&&new Date-n<10080*60*1e3,i=n?Et(n):"Jamais connecte",g=v(e.displayName||"Sans nom"),d=v(e.email||""),c=v(e.displayName||"User"),l=e.photoURL||`https://ui-avatars.com/api/?name=${encodeURIComponent(e.displayName||e.email)}&background=667eea&color=fff&size=128`;return`
        <div class="user-card bg-white rounded-xl shadow-md p-6 mb-4 hover:shadow-lg transition-shadow" data-user-id="${e.uid}">
            <div class="flex items-start gap-4">
                <img src="${l}" alt="${c}" class="w-16 h-16 rounded-full object-cover flex-shrink-0" onerror="this.src='https://ui-avatars.com/api/?name=U&background=667eea&color=fff&size=128'">
                
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-2">
                        <div>
                            <h4 class="text-lg font-bold text-slate-900 truncate">${g}</h4>
                            <p class="text-sm text-slate-600 truncate">${d}</p>
                        </div>
                        <div class="flex gap-2 flex-shrink-0 ml-4">
                            <button class="edit-user-btn text-indigo-600 hover:text-indigo-800 p-2 rounded hover:bg-indigo-50 transition" data-user-id="${e.uid}" data-user-email="${e.email}" data-user-role="${e.role||"user"}" title="Modifier">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-3 mb-3">
                        <span class="inline-flex items-center gap-1 bg-${s}-100 text-${s}-700 text-xs font-semibold px-3 py-1 rounded-full">
                            ${o} ${t?"Admin":"User"}
                        </span>
                        <span class="inline-flex items-center gap-1 ${a?"bg-green-100 text-green-700":"bg-slate-100 text-slate-600"} text-xs px-3 py-1 rounded-full">
                            <span class="w-2 h-2 rounded-full ${a?"bg-green-500":"bg-slate-400"}"></span>
                            ${a?"Actif":"Inactif"}
                        </span>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                            <p class="text-slate-500">Inscrit le:</p>
                            <p class="font-medium text-slate-900">${r?r.toLocaleDateString("fr-FR"):"N/A"}</p>
                        </div>
                        <div>
                            <p class="text-slate-500">Derniere connexion:</p>
                            <p class="font-medium text-slate-900">${i}</p>
                        </div>
                    </div>
                    
                    ${t?"":bt(e)}
                </div>
            </div>
        </div>
    `}function bt(e){const t=e.totalQuizzes||0,s=e.averageScore||0,o=e.currentStreak||0;return`
        <div class="mt-4 pt-4 border-t border-slate-200 grid grid-cols-3 gap-4 text-center">
            <div>
                <p class="text-2xl font-bold text-indigo-600">${s}%</p>
                <p class="text-xs text-slate-600">Score moyen</p>
            </div>
            <div>
                <p class="text-2xl font-bold text-purple-600">${t}</p>
                <p class="text-xs text-slate-600">Quiz completes</p>
            </div>
            <div>
                <p class="text-2xl font-bold text-orange-600">🔥 ${o}</p>
                <p class="text-xs text-slate-600">Serie active</p>
            </div>
        </div>
    `}function wt(){document.querySelectorAll(".edit-user-btn").forEach(e=>{e.addEventListener("click",t=>{const s=t.currentTarget.dataset.userId,o=t.currentTarget.dataset.userEmail,n=t.currentTarget.dataset.userRole;xt(s,o,n)})})}function xt(e,t,s){const o=document.createElement("div");o.id="edit-role-modal",o.className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",o.innerHTML=`
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-2xl font-bold text-slate-900">Modifier le role</h3>
                <button id="close-modal-btn" class="text-slate-400 hover:text-slate-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            
            <div class="mb-6">
                <p class="text-slate-600 mb-1">Utilisateur:</p>
                <p class="font-semibold text-slate-900">${v(t||"")}</p>
            </div>
            
            <div class="mb-6">
                <p class="text-slate-700 font-medium mb-3">Role actuel: <span class="text-indigo-600">${s==="admin"?"Admin":"User"}</span></p>
                
                <p class="text-sm font-semibold text-slate-700 mb-2">Modifier le role:</p>
                <div class="space-y-3">
                    <label class="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-indigo-500 transition ${s!=="admin"?"border-indigo-500 bg-indigo-50":"border-slate-200"}">
                        <input type="radio" name="role" value="user" ${s!=="admin"?"checked":""} class="mt-1">
                        <div>
                            <p class="font-semibold text-slate-900">👤 User (Utilisateur standard)</p>
                            <p class="text-sm text-slate-600">Acces uniquement au tableau de bord et aux quiz</p>
                        </div>
                    </label>
                    
                    <label class="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-yellow-500 transition ${s==="admin"?"border-yellow-500 bg-yellow-50":"border-slate-200"}">
                        <input type="radio" name="role" value="admin" ${s==="admin"?"checked":""} class="mt-1">
                        <div>
                            <p class="font-semibold text-slate-900">🔰 Admin (Administrateur)</p>
                            <p class="text-sm text-slate-600">Acces total: gestion questions et utilisateurs</p>
                        </div>
                    </label>
                </div>
            </div>
            
            <div class="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
                <p class="text-sm text-amber-900">
                    <strong>Attention:</strong> En passant User → Admin, cette personne aura acces a toutes les fonctions d administration.
                </p>
            </div>
            
            <div class="flex gap-3">
                <button id="cancel-role-btn" class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-lg transition">
                    Annuler
                </button>
                <button id="save-role-btn" class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition">
                    Enregistrer
                </button>
            </div>
        </div>
    `,document.body.appendChild(o),document.getElementById("close-modal-btn")?.addEventListener("click",()=>o.remove()),document.getElementById("cancel-role-btn")?.addEventListener("click",()=>o.remove()),document.getElementById("save-role-btn")?.addEventListener("click",async()=>{const n=o.querySelector('input[name="role"]:checked')?.value;n&&(await yt(e,t,n),o.remove())}),o.addEventListener("click",n=>{n.target===o&&o.remove()})}async function yt(e,t,s){const o=document.getElementById("save-role-btn");if(!o)return;const n=o.innerHTML,r=p.showLoadingToast("Mise à jour du rôle...");try{o.disabled=!0,o.innerHTML='<svg class="animate-spin h-5 w-5 inline" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle></svg> Mise a jour...',await Te(e,s),p.updateLoadingToast(r,`Rôle mis à jour pour ${t}`,"success"),St(`Role mis a jour pour ${t}: ${s==="admin"?"Admin":"User"}`),await se(),await Se()}catch(a){console.error("Erreur mise a jour role:",a),p.updateLoadingToast(r,"Erreur de mise à jour","error"),p.error(`Erreur: ${a.message||"Impossible de mettre a jour le role"}`,4e3),o.disabled=!1,o.innerHTML=n}}async function le(e){const t=e.target.id.replace("filter-user-","").replace("-","");b[t]=e.target.value,await se()}function kt(e){const t=e.target.value.toLowerCase();if(!t){H();return}const s=f.filter(r=>r.displayName&&r.displayName.toLowerCase().includes(t)||r.email&&r.email.toLowerCase().includes(t)),o=document.getElementById("users-list");if(!o)return;if(s.length===0){const r=v(t);o.innerHTML=`
            <div class="text-center py-12 text-slate-500">
                <p class="text-lg">Aucun resultat pour "${r}"</p>
            </div>
        `;return}const n=f;f=s,H(),f=n}async function Se(){try{if(w()){console.log("📊 Mode démo : Chargement des stats utilisateurs simulées..."),ce(mt);return}const e=await Ie();ce(e)}catch(e){console.error("Erreur chargement stats:",e)}}function ce(e){const t=document.getElementById("users-stats");if(!t)return;const s=e.total>0?Math.round(e.activeLastWeek/e.total*100):0;t.innerHTML=`
        <div class="bg-white rounded-xl shadow-md p-6">
            <h3 class="text-xl font-bold text-slate-900 mb-6">📊 Statistiques Globales</h3>
            
            <div class="grid grid-cols-2 gap-4 mb-6">
                <div class="text-center p-4 bg-indigo-50 rounded-lg">
                    <p class="text-3xl font-bold text-indigo-600 mb-1">${e.total}</p>
                    <p class="text-sm text-indigo-700 font-medium">Utilisateurs</p>
                </div>
                <div class="text-center p-4 bg-yellow-50 rounded-lg">
                    <p class="text-3xl font-bold text-yellow-600 mb-1">${e.admins}</p>
                    <p class="text-sm text-yellow-700 font-medium">Admins</p>
                </div>
            </div>
            
            <div class="space-y-4">
                <div>
                    <div class="flex justify-between text-sm mb-2">
                        <span class="text-slate-700">Actifs (7 derniers jours)</span>
                        <span class="font-semibold">${e.activeLastWeek} (${s}%)</span>
                    </div>
                    <div class="bg-slate-200 rounded-full h-2">
                        <div class="bg-green-500 rounded-full h-2 transition-all" style="width: ${s}%"></div>
                    </div>
                </div>
                
                <div class="pt-4 border-t border-slate-200">
                    <p class="text-sm text-slate-600 mb-1">Score moyen global:</p>
                    <p class="text-2xl font-bold text-purple-600">${e.averageScore}%</p>
                </div>
                
                <div>
                    <p class="text-sm text-slate-600 mb-1">Total quiz completes:</p>
                    <p class="text-2xl font-bold text-indigo-600">${e.totalQuizzes}</p>
                </div>
            </div>
        </div>
    `}function St(e){const t=document.createElement("div");t.className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-xl z-50 animate-fade-in";const s=v(e);t.innerHTML=`
        <div class="flex items-center gap-3">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span class="font-semibold">${s}</span>
        </div>
    `,document.body.appendChild(t),setTimeout(()=>{t.remove()},3e3)}function Et(e){const s=new Date-e,o=Math.floor(s/6e4),n=Math.floor(s/36e5),r=Math.floor(s/864e5);return o<1?"A l instant":o<60?`Il y a ${o} min`:n<24?`Il y a ${n}h`:r===1?"Hier":r<7?`Il y a ${r} jours`:r<30?`Il y a ${Math.floor(r/7)} semaines`:e.toLocaleDateString("fr-FR")}const oe={stats:{totalUsers:42,totalQuizzes:156,totalQuestions:240,totalResources:35,avgScore:78,activeUsersToday:8,activeUsersWeek:23,quizzesToday:12,quizzesWeek:67},topUsers:[{id:"1",email:"alice.dupont@example.com",displayName:"Alice Dupont",totalQuizzes:24,averageScore:92},{id:"2",email:"bob.martin@example.com",displayName:"Bob Martin",totalQuizzes:21,averageScore:88},{id:"3",email:"claire.bernard@example.com",displayName:"Claire Bernard",totalQuizzes:19,averageScore:85},{id:"4",email:"david.dubois@example.com",displayName:"David Dubois",totalQuizzes:18,averageScore:83},{id:"5",email:"emma.petit@example.com",displayName:"Emma Petit",totalQuizzes:16,averageScore:81},{id:"6",email:"francois.roux@example.com",displayName:"François Roux",totalQuizzes:15,averageScore:79},{id:"7",email:"julie.moreau@example.com",displayName:"Julie Moreau",totalQuizzes:14,averageScore:76},{id:"8",email:"lucas.simon@example.com",displayName:"Lucas Simon",totalQuizzes:13,averageScore:74},{id:"9",email:"marie.laurent@example.com",displayName:"Marie Laurent",totalQuizzes:12,averageScore:72},{id:"10",email:"nicolas.michel@example.com",displayName:"Nicolas Michel",totalQuizzes:11,averageScore:70}],recentActivity:[{id:"1",userName:"Alice Dupont",module:"Auto - Novembre",score:95,completedAt:new Date(Date.now()-3e5)},{id:"2",userName:"Emma Petit",module:"Loisir - Novembre",score:90,completedAt:new Date(Date.now()-72e4)},{id:"3",userName:"Bob Martin",module:"VR - Novembre",score:88,completedAt:new Date(Date.now()-138e4)},{id:"4",userName:"Claire Bernard",module:"Auto - Octobre",score:82,completedAt:new Date(Date.now()-27e5)},{id:"5",userName:"David Dubois",module:"Tracteur - Octobre",score:79,completedAt:new Date(Date.now()-36e5)}],moduleStats:[{module:"Auto",questionsCount:85,avgScore:76,completions:67},{module:"Loisir",questionsCount:62,avgScore:81,completions:45},{module:"VR",questionsCount:54,avgScore:73,completions:32},{module:"Tracteur",questionsCount:39,avgScore:79,completions:28}]};x.set("globalStats",{totalUsers:0,totalQuizzes:0,totalQuestions:0,totalResources:0,avgScore:0,activeUsersToday:0,activeUsersWeek:0,quizzesToday:0,quizzesWeek:0});x.set("chartProgress",null);x.set("chartModules",null);x.set("chartActivity",null);async function At(){u.info("📊 Initialisation du dashboard admin avancé"),Nt();try{await Promise.all([Ct(),Lt(),Mt(),Ee()]),$t(),qt(),p.success("Dashboard chargé avec succès !",3e3)}catch(e){u.error("❌ Erreur chargement dashboard:",e),p.error("Erreur lors du chargement du dashboard",4e3)}}async function Ct(){try{let e=x.get("globalStats");if(w()){u.info("📊 Mode démo : Chargement des statistiques simulées..."),e=oe.stats,x.set("globalStats",e),de(),u.info("✅ Statistiques simulées chargées:",e);return}u.info("📈 Chargement des statistiques globales...");const{getUsersStats:t}=await ee(async()=>{const{getUsersStats:Q}=await import("./services-8itqxsnU.js").then($=>$.r);return{getUsersStats:Q}},__vite__mapDeps([0,1])),{getQuestionsStats:s}=await ee(async()=>{const{getQuestionsStats:Q}=await import("./services-8itqxsnU.js").then($=>$.r);return{getQuestionsStats:Q}},__vite__mapDeps([0,1])),o=await _(),n=await t();e.totalUsers=n.total||0,e.activeUsersToday=n.activeLastWeek||0,e.activeUsersWeek=n.activeLastWeek||0,e.totalQuizzes=n.totalQuizzes||0,e.avgScore=n.averageScore||0;const r=await s();e.totalQuestions=r.total||0;const a=q(j(I,"resources"),B("clientId","==",o),X(1e3)),i=await N(a);e.totalResources=i.size;const g=new Date;g.setHours(0,0,0,0);const d=new Date;d.setDate(d.getDate()-30);const c=q(j(I,"quizResults"),B("clientId","==",o),B("completedAt",">=",qe.fromDate(d)),ge("completedAt","desc"),X(1e3)),l=await N(c),m=new Date;m.setDate(m.getDate()-7);let S=0,C=0;l.forEach(Q=>{const $=Q.data().completedAt?.toDate();$&&($>=g&&S++,$>=m&&C++)}),e.quizzesToday=S,e.quizzesWeek=C,x.set("globalStats",e),de(),u.info("✅ Statistiques globales chargées:",e)}catch(e){throw u.error("❌ Erreur chargement stats globales:",e),e}}async function Lt(){try{if(w()){u.info("🏆 Mode démo : Chargement du top 10 simulé..."),ue(oe.topUsers),u.info("✅ Top 10 simulé chargé");return}u.info("🏆 Chargement du top 10 utilisateurs...");const{getLeaderboard:e}=await ee(async()=>{const{getLeaderboard:o}=await import("./services-8itqxsnU.js").then(n=>n.r);return{getLeaderboard:o}},__vite__mapDeps([0,1])),t=await e(10),s=t.map((o,n)=>({id:o.uid||`user-${n}`,email:o.email||"",displayName:o.displayName||"Utilisateur",totalQuizzes:o.totalQuizzes||0,averageScore:o.averageScore||0}));ue(s),u.info("✅ Top 10 utilisateurs chargé:",t)}catch(e){throw u.error("❌ Erreur chargement top users:",e),e}}async function Mt(){try{if(w()){u.info("📅 Mode démo : Chargement de l'activité simulée..."),me(oe.recentActivity),u.info("✅ Activité simulée chargée");return}u.info("📅 Chargement de l'activité récente...");const e=q(j(I,"quizResults"),ge("completedAt","desc"),X(10)),t=await N(e),s=[];t.forEach(o=>{const n=o.data();s.push({id:o.id,userName:n.userName||"Utilisateur",module:n.module||"Module",score:n.score||0,completedAt:n.completedAt?.toDate()||new Date})}),me(s),u.info("✅ Activité récente chargée:",s)}catch(e){throw u.error("❌ Erreur chargement activité:",e),e}}async function Ee(){try{if(w()){u.info("📊 Mode démo : Chargement des stats modules simulées...");const n={Auto:{count:85,totalScore:6460,avgScore:76},Loisir:{count:62,totalScore:5022,avgScore:81},VR:{count:54,totalScore:3942,avgScore:73},Tracteur:{count:39,totalScore:3081,avgScore:79}};return u.info("✅ Stats modules simulées chargées:",n),n}u.info("📊 Chargement des stats par module...");const e=await _(),t=q(j(I,"quizResults"),B("clientId","==",e)),s=await N(t),o={};return s.forEach(n=>{const r=n.data(),a=r.module||"Autre";o[a]||(o[a]={count:0,totalScore:0,avgScore:0}),o[a].count++,o[a].totalScore+=r.score||0}),Object.values(o).forEach(n=>{n.avgScore=Math.round(n.totalScore/n.count)}),u.info("✅ Stats par module chargées:",o),o}catch(e){throw u.error("❌ Erreur chargement stats modules:",e),e}}function de(){const e=document.getElementById("global-stats-cards");if(!e)return;const t=x.get("globalStats");e.innerHTML=`
        <!-- Total Utilisateurs -->
        <div class="bg-ap-gradient-primary rounded-xl p-6 text-white shadow-ap-lg hover:shadow-ap-xl transition-all">
            <div class="flex items-center justify-between mb-4">
                <div class="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                </div>
                <span class="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">Total</span>
            </div>
            <h3 class="text-4xl font-black mb-1">${v(String(t.totalUsers))}</h3>
            <p class="text-white/90 text-sm font-medium">Utilisateurs inscrits</p>
            <div class="mt-3 text-xs flex gap-2">
                <span class="bg-white/20 px-2 py-1 rounded backdrop-blur-sm">📅 ${t.activeUsersToday} aujourd'hui</span>
                <span class="bg-white/20 px-2 py-1 rounded backdrop-blur-sm">📆 ${t.activeUsersWeek} cette semaine</span>
            </div>
        </div>
        
        <!-- Total Quiz -->
        <div class="bg-ap-gradient-success rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all">
            <div class="flex items-center justify-between mb-4">
                <div class="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                </div>
                <span class="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">Complétés</span>
            </div>
            <h3 class="text-4xl font-black mb-1">${t.totalQuizzes}</h3>
            <p class="text-white/90 text-sm font-medium">Quiz réalisés</p>
            <div class="mt-3 text-xs flex gap-2">
                <span class="bg-white/20 px-2 py-1 rounded backdrop-blur-sm">📅 ${t.quizzesToday} aujourd'hui</span>
                <span class="bg-white/20 px-2 py-1 rounded backdrop-blur-sm">📆 ${t.quizzesWeek} cette semaine</span>
            </div>
        </div>
        
        <!-- Score Moyen -->
        <div class="bg-ap-gradient-silver rounded-xl p-6 text-white shadow-ap-silver-lg hover:shadow-ap-silver transition-all" style="background: linear-gradient(135deg, #4A5568 0%, #2D3748 100%);">
            <div class="flex items-center justify-between mb-4">
                <div class="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                </div>
                <span class="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">Moyenne</span>
            </div>
            <h3 class="text-4xl font-black mb-1">${t.avgScore}%</h3>
            <p class="text-white/90 text-sm font-medium">Score moyen global</p>
            <div class="mt-3">
                <div class="bg-white/20 rounded-full h-2.5">
                    <div class="bg-white rounded-full h-2.5 shadow-lg" style="width: ${t.avgScore}%"></div>
                </div>
            </div>
        </div>
        
        <!-- Total Questions -->
        <div class="bg-ap-gradient-accent rounded-xl p-6 text-white shadow-ap-accent-lg hover:shadow-ap-accent transition-all" style="background: linear-gradient(135deg, #718096 0%, #4A5568 100%);">
            <div class="flex items-center justify-between mb-4">
                <div class="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <span class="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">Base</span>
            </div>
            <h3 class="text-4xl font-black mb-1">${t.totalQuestions}</h3>
            <p class="text-white/90 text-sm font-medium">Questions disponibles</p>
            <div class="mt-3 text-xs">
                <span class="bg-white/20 px-2 py-1 rounded backdrop-blur-sm">📚 ${t.totalResources} ressources</span>
            </div>
        </div>
    `}function ue(e){const t=document.getElementById("top-users-list");if(!t)return;if(e.length===0){const o=document.createElement("div");o.className="text-center py-8 text-slate-500",o.innerHTML=`
            <svg class="w-12 h-12 mx-auto mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <p class="font-medium">Aucun utilisateur</p>
        `,t.replaceChildren(o);return}const s=document.createDocumentFragment();e.forEach((o,n)=>{const r=n===0?"🥇":n===1?"🥈":n===2?"🥉":`${n+1}.`,a=n===0?"bg-ap-gold-light border-ap-gold":n===1?"bg-slate-50 border-slate-300":n===2?"bg-ap-warning-light border-ap-warning":"bg-white border-slate-200",i=o.userName||o.displayName||o.email||"Utilisateur",g=v(i),d=Number.isFinite(o.totalQuizzes)?o.totalQuizzes:0,c=Number.isFinite(o.avgScore)?o.avgScore:0,l=document.createElement("article");l.className=`flex items-center justify-between p-4 rounded-lg border ${a} hover:shadow-md transition-shadow`,l.innerHTML=`
            <div class="flex items-center gap-4">
                <span class="text-2xl font-bold w-8">${v(r)}</span>
                <div>
                    <h4 class="font-semibold text-slate-900">${g}</h4>
                    <p class="text-sm text-slate-600">${v(`${d} quiz complétés`)}</p>
                </div>
            </div>
            <div class="text-right">
                <div class="text-2xl font-bold text-ap-success">${v(`${c}%`)}</div>
                <div class="text-xs text-slate-500">Score moyen</div>
            </div>
        `,s.appendChild(l)}),t.replaceChildren(s)}function me(e){const t=document.getElementById("recent-activity-list");if(!t)return;if(e.length===0){const o=document.createElement("div");o.className="text-center py-8 text-slate-500",o.innerHTML=`
            <svg class="w-12 h-12 mx-auto mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="font-medium">Aucune activité récente</p>
        `,t.replaceChildren(o);return}const s=document.createDocumentFragment();e.forEach(o=>{const n=Ut(o.completedAt),r=v(n),a=o.score>=80?"text-green-600":o.score>=60?"text-yellow-600":"text-red-600",i=o.userName||"Utilisateur",g=v(i),d=v(o.module||"Module"),c=v(`${Number.isFinite(o.score)?o.score:0}%`),l=v(i.charAt(0).toUpperCase()),m=document.createElement("article");m.className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors",m.innerHTML=`
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-ap-red-100 rounded-full flex items-center justify-center">
                    <span class="text-lg font-bold text-ap-red-primary">${l}</span>
                </div>
                <div>
                    <p class="font-medium text-slate-900">${g}</p>
                    <p class="text-sm text-slate-600">${d}</p>
                </div>
            </div>
            <div class="text-right">
                <div class="text-lg font-bold ${a}">${c}</div>
                <div class="text-xs text-slate-500">${r}</div>
            </div>
        `,s.appendChild(m)}),t.replaceChildren(s)}function $t(){zt(),Dt(),It()}async function zt(){const e=document.getElementById("chart-progress");if(e)try{let t,s,o;if(w()){u.info("📈 Mode démo : Création graphique progression simulé..."),t=[],s=[],o=[];for(let a=29;a>=0;a--){const i=new Date;i.setDate(i.getDate()-a),t.push(i.toLocaleDateString("fr-FR",{day:"2-digit",month:"short"})),s.push(Math.floor(Math.random()*15)+5),o.push(Math.floor(Math.random()*20)+70)}}else{const a=new Date;a.setDate(a.getDate()-30);const i=await _(),g=q(j(I,"quizResults"),B("clientId","==",i)),d=await N(g),c={};for(let l=0;l<30;l++){const m=new Date;m.setDate(m.getDate()-l);const S=m.toISOString().split("T")[0];c[S]={count:0,totalScore:0}}d.forEach(l=>{const m=l.data(),S=m.completedAt?.toDate();if(S&&S>=a){const C=S.toISOString().split("T")[0];c[C]&&(c[C].count++,c[C].totalScore+=m.score||0)}}),t=Object.keys(c).reverse().map(l=>new Date(l).toLocaleDateString("fr-FR",{day:"2-digit",month:"short"})),s=Object.values(c).reverse().map(l=>l.count),o=Object.values(c).reverse().map(l=>l.count>0?Math.round(l.totalScore/l.count):0)}const n=x.get("chartProgress");n&&n.destroy();const r=new Chart(e,{type:"line",data:{labels:t,datasets:[{label:"Quiz complétés",data:s,borderColor:"rgb(196, 30, 58)",backgroundColor:"rgba(196, 30, 58, 0.1)",tension:.4,yAxisID:"y",pointBackgroundColor:"rgb(196, 30, 58)",pointBorderColor:"#fff",pointBorderWidth:2},{label:"Score moyen (%)",data:o,borderColor:"rgb(212, 175, 55)",backgroundColor:"rgba(212, 175, 55, 0.1)",tension:.4,yAxisID:"y1",pointBackgroundColor:"rgb(212, 175, 55)",pointBorderColor:"#fff",pointBorderWidth:2}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},scales:{y:{type:"linear",display:!0,position:"left",title:{display:!0,text:"Nombre de quiz"}},y1:{type:"linear",display:!0,position:"right",title:{display:!0,text:"Score moyen (%)"},grid:{drawOnChartArea:!1}}},plugins:{legend:{position:"top"},title:{display:!0,text:"Évolution sur 30 jours"}}}});x.set("chartProgress",r)}catch(t){u.error("❌ Erreur création graphique progression:",t)}}async function Dt(){const e=document.getElementById("chart-modules");if(e)try{const t=await Ee(),s=Object.keys(t),o=Object.values(t).map(i=>i.count),n=["rgba(196, 30, 58, 0.9)","rgba(212, 175, 55, 0.9)","rgba(40, 167, 69, 0.9)","rgba(255, 159, 67, 0.9)","rgba(139, 20, 41, 0.9)"],r=x.get("chartModules");r&&r.destroy();const a=new Chart(e,{type:"doughnut",data:{labels:s,datasets:[{data:o,backgroundColor:n,borderWidth:2,borderColor:"#fff"}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"bottom"},title:{display:!0,text:"Répartition par module"}}}});x.set("chartModules",a)}catch(t){u.error("❌ Erreur création graphique modules:",t)}}async function It(){const e=document.getElementById("chart-activity");if(e)try{const t=[],s=[];for(let r=6;r>=0;r--){const a=new Date;a.setDate(a.getDate()-r),t.push(a.toLocaleDateString("fr-FR",{weekday:"short"})),s.push(Math.floor(Math.random()*20)+5)}const o=x.get("chartActivity");o&&o.destroy();const n=new Chart(e,{type:"bar",data:{labels:t,datasets:[{label:"Utilisateurs actifs",data:s,backgroundColor:"rgba(196, 30, 58, 0.8)",borderColor:"rgb(196, 30, 58)",borderWidth:2,borderRadius:4,hoverBackgroundColor:"rgba(196, 30, 58, 1)"}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1},title:{display:!0,text:"Activité des 7 derniers jours"}},scales:{y:{beginAtZero:!0,ticks:{stepSize:5}}}}});x.set("chartActivity",n)}catch(t){u.error("❌ Erreur création graphique activité:",t)}}async function Tt(){const e=p.showLoadingToast("Génération du PDF...");try{const{jsPDF:t}=window.jspdf,s=new t;s.setFontSize(20),s.text("Dashboard Admin - QuizPro",20,20),s.setFontSize(10),s.text(`Généré le ${new Date().toLocaleDateString("fr-FR")}`,20,30),s.setFontSize(14),s.text("Statistiques Globales",20,45),s.setFontSize(10);let o=55;s.text(`Total Utilisateurs: ${globalStats.totalUsers}`,25,o),o+=7,s.text(`Total Quiz: ${globalStats.totalQuizzes}`,25,o),o+=7,s.text(`Score Moyen: ${globalStats.avgScore}%`,25,o),o+=7,s.text(`Questions: ${globalStats.totalQuestions}`,25,o),o+=7,s.text(`Ressources: ${globalStats.totalResources}`,25,o),s.save(`dashboard-admin-${new Date().toISOString().split("T")[0]}.pdf`),p.updateLoadingToast(e,"PDF généré avec succès !","success")}catch(t){u.error("❌ Erreur export PDF:",t),p.updateLoadingToast(e,"Erreur d'export PDF","error"),p.error("Erreur: Assurez-vous que jsPDF est chargé",4e3)}}async function Bt(){const e=p.showLoadingToast("Génération du CSV...");try{const t=await _(),s=q(j(I,"quizResults"),B("clientId","==",t)),o=await N(s),n=["Date","Utilisateur","Module","Mois","Année","Score (%)","Bonnes réponses","Total questions","Temps (s)"],r=[];o.forEach(d=>{const c=d.data(),l=c.completedAt?.toDate().toLocaleString("fr-FR")||"N/A";r.push([l,c.userName||"Inconnu",c.module||"N/A",c.month||"N/A",c.year||"N/A",c.score||0,c.correctAnswers||0,c.totalQuestions||0,c.timeSpent||0])});const a=[n,...r].map(d=>d.join(",")).join(`
`),i=new Blob([a],{type:"text/csv;charset=utf-8;"}),g=document.createElement("a");g.href=URL.createObjectURL(i),g.download=`dashboard-complet-${new Date().toISOString().split("T")[0]}.csv`,g.click(),p.updateLoadingToast(e,"CSV généré avec succès !","success")}catch(t){u.error("❌ Erreur export CSV:",t),p.updateLoadingToast(e,"Erreur d'export CSV","error"),p.error("Erreur lors de l'export CSV",4e3)}}function qt(){document.getElementById("export-pdf-btn")?.addEventListener("click",Tt),document.getElementById("export-csv-btn")?.addEventListener("click",Bt),document.getElementById("period-filter")?.addEventListener("change",jt),document.getElementById("refresh-dashboard-btn")?.addEventListener("click",()=>{p.info("Actualisation du dashboard...",2e3),At()})}async function jt(e){const t=e.target.value;p.info(`Filtrage: ${t}`,2e3)}function Nt(){document.getElementById("global-stats-cards")&&P("global-stats-cards",Ke(4)),document.getElementById("top-users-list")&&P("top-users-list",re(10)),document.getElementById("recent-activity-list")&&P("recent-activity-list",re(8));const o=document.getElementById("progress-chart");o&&(o.innerHTML=K());const n=document.getElementById("modules-chart");n&&(n.innerHTML=K());const r=document.getElementById("activity-chart");r&&(r.innerHTML=K())}function Ut(e){const s=new Date-e,o=Math.floor(s/1e3),n=Math.floor(o/60),r=Math.floor(n/60),a=Math.floor(r/24);return a>0?`Il y a ${a}j`:r>0?`Il y a ${r}h`:n>0?`Il y a ${n}min`:"À l'instant"}export{ee as _,D as a,W as b,P as c,I as d,v as e,es as f,Yt as g,We as h,w as i,Jt as j,Ke as k,u as l,Xt as m,K as n,Gt as o,Wt as p,Kt as q,Zt as r,Ot as s,p as t,Vt as u,At as v,ts as w,ss as x,_t as y};
//# sourceMappingURL=admin-C2EvoKlF.js.map
