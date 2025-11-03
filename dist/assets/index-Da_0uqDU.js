import{initializeApp as he}from"https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";import{getAuth as fe,GoogleAuthProvider as pe,signInWithPopup as ve,signOut as xe,onAuthStateChanged as be}from"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";import{getFirestore as we,doc as S,Timestamp as p,getDoc as P,setDoc as ee,query as R,collection as I,where as x,getDocs as Q,updateDoc as te,orderBy as ye,limit as ke,addDoc as Ee}from"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";import{getDatabase as Ce}from"https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function o(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(n){if(n.ep)return;n.ep=!0;const s=o(n);fetch(n.href,s)}})();function $(e,t="info",o=3e3){const r=oe(),n=ze(e,t);return r.appendChild(n),setTimeout(()=>n.classList.add("show"),10),o>0&&setTimeout(()=>{U(n)},o),n}function oe(){let e=document.getElementById("toast-container");return e||(e=document.createElement("div"),e.id="toast-container",e.className="fixed top-4 right-4 z-50 flex flex-col gap-3",document.body.appendChild(e)),e}function ze(e,t){const o=document.createElement("div");o.className=`toast toast-${t} transform translate-x-full transition-all duration-300`;const r=re(t);return o.innerHTML=`
        <div class="flex items-center gap-3 bg-white rounded-lg shadow-lg border-l-4 ${r.borderColor} p-4 min-w-[320px] max-w-md">
            <div class="flex-shrink-0">
                ${r.icon}
            </div>
            <div class="flex-1">
                <p class="text-sm font-medium text-slate-900">${e}</p>
            </div>
            <button class="toast-close flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `,o.querySelector(".toast-close").addEventListener("click",()=>U(o)),o}function re(e){const t={success:{borderColor:"border-green-500",icon:`<div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
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
            </div>`}};return t[e]||t.info}function U(e){e.classList.remove("show"),e.classList.add("translate-x-full"),setTimeout(()=>{e.remove();const t=document.getElementById("toast-container");t&&t.children.length===0&&t.remove()},300)}const E={success:(e,t)=>$(e,"success",t),error:(e,t)=>$(e,"error",t),warning:(e,t)=>$(e,"warning",t),info:(e,t)=>$(e,"info",t)};function O(e){const t=oe(),o=document.createElement("div");return o.className="toast toast-loading transform translate-x-full transition-all duration-300",o.setAttribute("data-loading","true"),o.innerHTML=`
        <div class="flex items-center gap-3 bg-white rounded-lg shadow-lg border-l-4 border-indigo-500 p-4 min-w-[320px] max-w-md">
            <div class="flex-shrink-0">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
            <div class="flex-1">
                <p class="text-sm font-medium text-slate-900">${e}</p>
            </div>
        </div>
    `,t.appendChild(o),setTimeout(()=>o.classList.add("show"),10),o}function C(e,t,o="success"){if(!e||!e.getAttribute("data-loading"))return;const r=re(o),n=e.classList.contains("show");e.className=`toast toast-${o} transform transition-all duration-300${n?" show":""}`,e.innerHTML=`
        <div class="flex items-center gap-3 bg-white rounded-lg shadow-lg border-l-4 ${r.borderColor} p-4 min-w-[320px] max-w-md">
            <div class="flex-shrink-0">
                ${r.icon}
            </div>
            <div class="flex-1">
                <p class="text-sm font-medium text-slate-900">${t}</p>
            </div>
            <button class="toast-close flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `,e.removeAttribute("data-loading"),e.querySelector(".toast-close").addEventListener("click",()=>U(e)),setTimeout(()=>U(e),3e3)}if(typeof document<"u"){const e=document.createElement("style");e.textContent=`
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
    `,document.head.appendChild(e)}const k=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"||window.location.hostname==="192.168.1.1"||window.location.port==="3200",F={log:(...e)=>{k&&console.log(...e)},error:(...e)=>{console.error(...e)},warn:(...e)=>{k&&console.warn(...e)},info:(...e)=>{k&&console.info(...e)},group:(...e)=>{k&&console.group(...e)},groupEnd:()=>{k&&console.groupEnd()},table:(...e)=>{k&&console.table(...e)}};console.log(k?"🔧 Mode développement - Logs activés":"🚀 Mode production - Logs désactivés (sauf erreurs)");const ne={apiKey:"AIzaSyD8w7Em_xdMGplscfGLrnM72vmm4z5ZTr0",authDomain:"avantage-quizz.firebaseapp.com",databaseURL:"https://avantage-quizz-default-rtdb.firebaseio.com",projectId:"avantage-quizz",storageBucket:"avantage-quizz.firebasestorage.app",messagingSenderId:"919472910099",appId:"1:919472910099:web:e17d4c1cdc7a04c6cab4e6"},H=he(ne),L=fe(H),f=we(H);Ce(H);F.log("✅ Firebase initialisé avec succès");F.log("📊 Projet:",ne.projectId);F.log("🔐 Services: Authentication, Firestore, Realtime Database");const w={users:"users",quizResults:"quizResults",monthlyProgress:"monthlyProgress",questions:"questions"};async function Me(e){try{const t=S(f,w.users,e.uid),o={uid:e.uid,email:e.email,displayName:e.displayName,photoURL:e.photoURL,lastLogin:p.now(),updatedAt:p.now()};return(await P(t)).exists()||(o.createdAt=p.now(),o.totalQuizzes=0,o.averageScore=0,o.currentStreak=0,o.longestStreak=0,o.role="user",console.log("👤 Création du profil utilisateur:",e.email)),await ee(t,o,{merge:!0}),console.log("✅ Profil utilisateur sauvegardé"),o}catch(t){throw console.error("❌ Erreur création utilisateur:",t),t}}async function Be(e){try{const t=S(f,w.users,e),o=await P(t);return o.exists()?o.data():null}catch(t){throw console.error("❌ Erreur récupération profil:",t),t}}async function Le(e){try{const t=L.currentUser;if(!t)throw new Error("Utilisateur non connecté");const o={userId:t.uid,userEmail:t.email,moduleId:e.moduleId,moduleName:e.moduleName,score:e.score,correctAnswers:e.correctAnswers,totalQuestions:e.totalQuestions,timeElapsed:e.timeElapsed,answers:e.answers,date:p.now(),month:e.month||new Date().toLocaleDateString("fr-FR",{month:"long",year:"numeric"})},r=await Ee(I(f,w.quizResults),o);return console.log("✅ Résultat de quiz sauvegardé:",r.id),await Se(t.uid,e.score),await qe(t.uid,e.month,e.score),r.id}catch(t){throw console.error("❌ Erreur sauvegarde résultat:",t),t}}async function Ae(e,t=50){try{const o=R(I(f,w.quizResults),x("userId","==",e),ye("date","desc"),ke(t)),r=await Q(o),n=[];return r.forEach(s=>{n.push({id:s.id,...s.data()})}),console.log(`📊 ${n.length} résultats chargés`),n}catch(o){throw console.error("❌ Erreur récupération résultats:",o),o}}async function qe(e,t,o){try{const r=S(f,w.monthlyProgress,`${e}_${t}`),n={userId:e,month:t,score:o,completed:!0,completedAt:p.now(),updatedAt:p.now()};await ee(r,n,{merge:!0}),console.log("✅ Progression mensuelle mise à jour")}catch(r){throw console.error("❌ Erreur mise à jour progression:",r),r}}async function Ie(e,t=new Date().getFullYear()){try{const o=R(I(f,w.monthlyProgress),x("userId","==",e)),r=await Q(o),n={};return r.forEach(s=>{const i=s.data();n[i.month]=i}),console.log("📅 Progression annuelle chargée"),n}catch(o){throw console.error("❌ Erreur récupération progression:",o),o}}async function Se(e,t){try{const o=S(f,w.users,e),r=await P(o);if(r.exists()){const n=r.data(),s=(n.totalQuizzes||0)+1,a=((n.averageScore||0)*(s-1)+t)/s;await te(o,{totalQuizzes:s,averageScore:Math.round(a),lastQuizDate:p.now(),updatedAt:p.now()}),console.log("📊 Statistiques mises à jour")}}catch(o){throw console.error("❌ Erreur mise à jour statistiques:",o),o}}async function $e(e){try{const t=await Ae(e,12);let o=0;const r=new Set;for(const a of t)a.score>=60&&r.add(a.month);const n=Array.from(r).sort().reverse();for(let a=0;a<n.length&&(o++,a<n.length-1);a++);const s=S(f,w.users,e),i=await P(s);if(i.exists()){const a=i.data(),l=Math.max(o,a.longestStreak||0);await te(s,{currentStreak:o,longestStreak:l,updatedAt:p.now()}),console.log(`🔥 Série mise à jour: ${o} mois`)}return o}catch(t){throw console.error("❌ Erreur mise à jour série:",t),t}}const se=new pe;se.setCustomParameters({prompt:"select_account"});async function ie(){try{console.log("🔐 Tentative de connexion Google...");const t=(await ve(L,se)).user;return console.log("✅ Authentification réussie:",t.displayName),console.log("📧 Email:",t.email),await Me(t),t}catch(e){console.error("❌ Erreur de connexion:",e);let t="Erreur lors de la connexion. Veuillez réessayer.";throw e.code==="auth/popup-closed-by-user"?t="Connexion annulée. Veuillez réessayer.":e.code==="auth/popup-blocked"?t="Pop-up bloquée. Autorisez les pop-ups pour ce site.":e.code==="auth/unauthorized-domain"&&(t="Domaine non autorisé. Configurez Firebase Authentication."),alert(t),e}}async function Te(){try{const e=L.currentUser?.displayName||"Utilisateur";await xe(L),console.log("✅ Déconnexion réussie:",e)}catch(e){throw console.error("❌ Erreur de déconnexion:",e),e}}function De(e){return be(L,t=>{t?console.log("👤 Utilisateur connecté:",t.email):console.log("👤 Aucun utilisateur connecté"),e(t)})}function je(){return L.currentUser}async function ae(e){if(!e)return;if(e.role==="admin"){const o=document.getElementById("nav-admin-item");o&&o.classList.remove("hidden");const r=document.getElementById("admin-badge-nav");r&&r.classList.remove("hidden"),console.log("Admin UI elements shown")}}async function Re(){try{console.log("🎭 Activation du mode démo...");const e={uid:"demo-user-"+Date.now(),email:"demo@avantage-quizz.local",displayName:"Utilisateur Démo",photoURL:null,isDemo:!0,role:"admin",createdAt:new Date().toISOString()};return localStorage.setItem("demoUser",JSON.stringify(e)),localStorage.setItem("authMode","demo"),console.log("✅ Mode démo activé:",e.displayName),console.log("📧 Email:",e.email),console.log("👑 Rôle:",e.role),e}catch(e){throw console.error("❌ Erreur activation mode démo:",e),e}}function Qe(){localStorage.removeItem("demoUser"),localStorage.removeItem("authMode"),console.log("✅ Mode démo désactivé")}function z(){return localStorage.getItem("authMode")==="demo"}function Ue(){try{const e=localStorage.getItem("demoUser");return e?JSON.parse(e):null}catch(e){return console.error("❌ Erreur lecture utilisateur démo:",e),null}}function _(){return z()?Ue():je()}console.log("Initialisation de la page d accueil...");document.addEventListener("DOMContentLoaded",Pe);function Pe(){console.log("📄 DOM chargé - configuration des boutons...");const e=document.getElementById("google-signin-btn");e?(e.addEventListener("click",Ve),console.log("✅ Bouton Google configuré")):console.warn("⚠️ Bouton Google non trouvé");const t=document.getElementById("demo-mode-btn");t?(t.addEventListener("click",Ne),console.log("✅ Bouton Mode Démo configuré")):console.warn("⚠️ Bouton Mode Démo non trouvé")}async function Ve(){console.log("🔐 Clic sur connexion Google...");const e=O("Connexion en cours...");try{const t=await ie();C(e,`Bienvenue ${t.displayName} !`,"success"),setTimeout(()=>{window.location.reload()},800)}catch(t){console.error("❌ Erreur connexion Google:",t);let o="Erreur lors de la connexion";t.code==="auth/popup-closed-by-user"?o="Connexion annulée":t.code==="auth/popup-blocked"?o="Pop-up bloquée. Autorisez les pop-ups.":t.code==="auth/unauthorized-domain"?o="Domaine non autorisé dans Firebase":t.code==="auth/network-request-failed"&&(o="Erreur réseau. Vérifiez votre connexion."),C(e,o,"error")}}async function Ne(){console.log("🎭 Clic sur Mode Démo...");const e=O("Activation du mode démo...");try{const t=await Re();console.log("✅ Mode démo activé:",t),C(e,"Mode démo activé ! Rechargement...","success"),setTimeout(()=>{window.location.reload()},500)}catch(t){console.error("❌ Erreur activation mode démo:",t),C(e,"error","Impossible d'activer le mode démo")}}function Oe(){const e=document.createElement("canvas");e.style.position="fixed",e.style.top="0",e.style.left="0",e.style.width="100%",e.style.height="100%",e.style.pointerEvents="none",e.style.zIndex="9999",document.body.appendChild(e);const t=e.getContext("2d");e.width=window.innerWidth,e.height=window.innerHeight;const o=[],r=["#FF6B6B","#4ECDC4","#45B7D1","#FFA07A","#98D8C8","#F7DC6F","#BB8FCE","#85C1E2"];for(let s=0;s<150;s++)o.push({x:Math.random()*e.width,y:e.height+Math.random()*100,size:Math.random()*8+4,speedY:-(Math.random()*3+3),speedX:Math.random()*6-3,color:r[Math.floor(Math.random()*r.length)],rotation:Math.random()*360,rotationSpeed:Math.random()*10-5,gravity:.15,opacity:1});function n(){t.clearRect(0,0,e.width,e.height);let s=0;o.forEach((i,a)=>{i.speedY+=i.gravity,i.y+=i.speedY,i.x+=i.speedX,i.rotation+=i.rotationSpeed,i.y>e.height-100&&(i.opacity-=.02),i.opacity>0&&i.y<e.height+50&&(s++,t.save(),t.translate(i.x,i.y),t.rotate(i.rotation*Math.PI/180),t.globalAlpha=i.opacity,t.fillStyle=i.color,t.fillRect(-i.size/2,-i.size/2,i.size,i.size),t.restore())}),s>0?requestAnimationFrame(n):e.remove()}n()}const Fe={auto:{name:"AT-AVE-AVEX",color:"indigo",label:"Auto"},loisir:{name:"VTT, Motoneige, etc.",color:"cyan",label:"Loisir"},vr:{name:"Véhicules Récréatifs",color:"orange",label:"VR"},tracteur:{name:"Équipement Agricole",color:"green",label:"Tracteur"}};let d=null,b=0,u=[],G=null,T=null,Y=null,N=0,D=!1,j=0,Z=null,A=null,q=null;const J={indigo:{bg:"bg-indigo-600",text:"text-indigo-600",border:"border-indigo-600"},cyan:{bg:"bg-cyan-600",text:"text-cyan-600",border:"border-cyan-600"},orange:{bg:"bg-orange-600",text:"text-orange-600",border:"border-orange-600"},green:{bg:"bg-green-600",text:"text-green-600",border:"border-green-600"}};async function He(e,t,o){console.log(`📥 Chargement des questions: module=${e}, mois=${t}, année=${o}`);const r=n=>{const s=n.data();return{id:n.id,question:s.question,options:s.options.map((i,a)=>({id:String.fromCharCode(65+a),text:i,correct:a===s.correctAnswer})),explanation:s.explanation||"Pas d'explication disponible",reference:s.reference||"",tags:s.tags||[]}};if(z()){console.log("📝 Mode démo : Chargement des questions simulées pour le quiz...");const s=localStorage.getItem("avantage-quizz-demo-questions");let i=[];if(s)try{const a=JSON.parse(s);console.log(`💾 ${a.length} questions chargées depuis localStorage`),i=a.map(l=>({id:l.id,question:l.question,options:l.options.map((y,c)=>({id:String.fromCharCode(65+c),text:y,correct:c===l.correctAnswer})),explanation:l.explanation||"Pas d'explication disponible",reference:l.reference||"",tags:l.tags||[]})),i=i.filter(l=>{const y=!e||a.find(g=>g.id===l.id)?.module===e,c=!t||a.find(g=>g.id===l.id)?.month===t;return y&&c})}catch{console.warn("⚠️ Erreur lecture localStorage, utilisation questions par défaut")}return i.length===0&&(console.log("📦 Utilisation questions par défaut (aucune en localStorage)"),i=[{id:"demo-1",question:"Quelle est la vitesse maximale autorisée sur une autoroute au Québec ?",options:[{id:"A",text:"100 km/h",correct:!1},{id:"B",text:"110 km/h",correct:!1},{id:"C",text:"120 km/h",correct:!1},{id:"D",text:"100 km/h (conditions normales)",correct:!0}],explanation:"La vitesse maximale sur autoroute au Québec est de 100 km/h, sauf indication contraire.",reference:"Code de la sécurité routière du Québec",tags:["vitesse","autoroute"]},{id:"demo-2",question:"À quelle distance minimale devez-vous vous arrêter derrière un autobus scolaire dont les feux clignotent ?",options:[{id:"A",text:"3 mètres",correct:!1},{id:"B",text:"5 mètres",correct:!0},{id:"C",text:"10 mètres",correct:!1},{id:"D",text:"15 mètres",correct:!1}],explanation:"Vous devez vous arrêter à au moins 5 mètres d'un autobus scolaire.",reference:"Article 460 CSR",tags:["autobus","sécurité"]},{id:"demo-3",question:"Quel est le taux d'alcoolémie maximal pour conduire au Québec ?",options:[{id:"A",text:"0.05",correct:!1},{id:"B",text:"0.08",correct:!0},{id:"C",text:"0.10",correct:!1},{id:"D",text:"0.00",correct:!1}],explanation:"Le taux maximal est de 0.08 pour conducteurs expérimentés.",reference:"Code criminel du Canada",tags:["alcool","sécurité"]},{id:"demo-4",question:"Combien de points d'inaptitude entraîne un excès de vitesse de 30 km/h ?",options:[{id:"A",text:"2 points",correct:!1},{id:"B",text:"3 points",correct:!0},{id:"C",text:"4 points",correct:!1},{id:"D",text:"5 points",correct:!1}],explanation:"Un excès de 21 à 30 km/h entraîne 3 points.",reference:"SAAQ",tags:["vitesse","points"]},{id:"demo-5",question:"Quelle est la distance de sécurité recommandée entre véhicules ?",options:[{id:"A",text:"1 seconde",correct:!1},{id:"B",text:"2 secondes",correct:!0},{id:"C",text:"3 secondes",correct:!1},{id:"D",text:"5 secondes",correct:!1}],explanation:"La règle des 2 secondes est recommandée.",reference:"Guide SAAQ",tags:["distance","sécurité"]}]),console.log(`✅ ${i.length} questions démo chargées pour le quiz`),i}try{let n=R(I(f,"questions"),x("module","==",e),x("month","==",t),x("year","==",o)),s=await Q(n);if(!s.empty){const c=[];return s.forEach(g=>c.push(r(g))),console.log(`✅ ${c.length} questions (mois numérique)`),c}const a=["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"][t-1],l=a.charAt(0).toUpperCase()+a.slice(1).toLowerCase();let y=R(I(f,"questions"),x("module","==",e),x("month","==",l),x("year","==",o));if(s=await Q(y),!s.empty){const c=[];return s.forEach(g=>c.push(r(g))),console.log(`✅ ${c.length} questions (mois texte)`),c}return console.warn("⚠️ Aucune question trouvée pour ces critères (numérique/texte)"),[]}catch(n){throw console.error("❌ Erreur lors du chargement des questions:",n),n}}async function _e(e,t,o){try{const r=await fetch("/test-questions-valides.json");if(!r.ok)return[];const n=await r.json(),i=["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"][t-1];return n.filter(l=>l.module===e&&l.year===o&&(l.month===i||l.month===t)).map((l,y)=>({id:`demo-${e}-${y}`,question:l.question,options:l.options.map((c,g)=>({id:String.fromCharCode(65+g),text:c,correct:g===l.correctAnswer})),explanation:l.explanation||"Pas d'explication disponible",reference:l.reference||"",tags:l.tags||[]}))}catch(r){return console.warn("Demo questions fallback error:",r),[]}}async function le(e){const t=Fe[e];if(!t){console.error("Module de quiz non trouvé:",e),E.error("Module non trouvé. Veuillez réessayer.");return}const o=O(`Chargement du quiz ${t.label}...`);Ge(t.label);try{const r=new Date,n=["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"],s=r.getMonth()+1;A=n[s-1],q=r.getFullYear(),Z=e;try{window.__QUIZ_ACTIVE=!0}catch{}let i=await He(e,s,q);if(i.length===0&&z()&&(console.log("ℹ️ Mode Démo: chargement des questions locales de test"),i=await _e(e,s,q)),i.length===0){C(o,"Aucune question disponible","error"),E.error(`Aucune question trouvée pour ${t.label} en ${A} ${q}.

Contactez l'administrateur.`,5e3);return}d={name:`Quiz ${t.label} - ${A.charAt(0).toUpperCase()+A.slice(1)}`,module:t.name,color:t.color,questions:i},b=0,u=[],G=Date.now(),Y=Date.now(),N=0,Ye(),ce(),tt(),W(),C(o,`${i.length} questions chargées !`,"success")}catch(r){console.error("❌ Erreur lors du démarrage du quiz:",r),C(o,"Erreur de chargement","error"),E.error("Erreur lors du chargement du quiz. Veuillez réessayer.",4e3)}}function Ge(e){const t=de();t.innerHTML=`
        <div class="min-h-screen flex items-center justify-center">
            <div class="text-center">
                <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-6"></div>
                <h2 class="text-2xl font-bold text-slate-900 mb-2">Chargement du quiz ${e}</h2>
                <p class="text-slate-600">Récupération des questions...</p>
            </div>
        </div>
    `,t.classList.remove("view-hidden")}function Ye(){document.getElementById("dashboard-view")?.classList.add("view-hidden"),document.getElementById("module-selection-view")?.classList.add("view-hidden"),document.getElementById("login-view")?.classList.add("view-hidden"),de().classList.remove("view-hidden")}function de(){let e=document.getElementById("quiz-view");return e||(e=document.createElement("div"),e.id="quiz-view",document.querySelector("main").appendChild(e)),e}function ce(){const e=d.questions[b],t=document.getElementById("quiz-view"),o=J[d.color];t.innerHTML=`
        <!-- En-tête du quiz -->
        <div class="bg-white border-b border-gray-200 shadow-sm">
            <div class="max-w-5xl mx-auto px-6 py-4">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-xl font-bold text-slate-900">${d.name}</h1>
                        <p class="text-sm text-slate-500">Question ${b+1} sur ${d.questions.length}</p>
                    </div>
                    <div class="flex items-center gap-6">
                        <button id="focus-mode-btn" class="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                            Focus
                        </button>
                        <button id="pause-btn" class="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Pause
                        </button>
                        <div class="flex items-center gap-2">
                            <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span id="quiz-score" class="text-sm font-bold text-indigo-600">Score: 0%</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span id="quiz-timer" class="text-sm font-medium text-slate-600">0:00</span>
                        </div>
                        <button id="quit-quiz-btn" class="text-sm font-medium text-slate-600 hover:text-slate-900">
                            Quitter
                        </button>
                    </div>
                </div>
                
                <!-- Barre de progression -->
                <div class="mt-4 w-full bg-gray-200 rounded-full h-2">
                    <div class="${o.bg} h-2 rounded-full transition-all duration-300" style="width: ${(b+1)/d.questions.length*100}%"></div>
                </div>
            </div>
        </div>

        <!-- Contenu de la question -->
        <div class="max-w-5xl mx-auto px-6 py-8">
            <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                
                <!-- En-tête de question -->
                <div class="px-8 py-6 bg-gradient-to-r from-slate-50 to-white border-b border-gray-100">
                    <div class="mb-4">
                        <span class="text-sm font-medium ${o.text}">Question ${b+1} sur ${d.questions.length}</span>
                    </div>
                    
                    <h2 class="text-2xl font-bold text-slate-900 leading-relaxed">
                        ${e.question}
                    </h2>
                    
                    <!-- Tags -->
                    ${e.tags&&e.tags.length>0?`
                        <div class="flex flex-wrap gap-2 mt-4">
                            ${e.tags.map(r=>`
                                <span class="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                                    ${r}
                                </span>
                            `).join("")}
                        </div>
                    `:""}
                </div>

                <!-- Options de réponse -->
                <div class="p-8">
                    <div class="space-y-3">
                        ${e.options.map(r=>`
                            <button data-option-id="${r.id}" 
                                    class="option-button w-full text-left px-6 py-5 rounded-xl border-2 border-gray-200 hover:border-${d.color}-400 hover:bg-${d.color}-50 transition-all duration-200 group">
                                <div class="flex items-center gap-4">
                                    <div class="flex-shrink-0 w-10 h-10 rounded-lg ${o.bg} bg-opacity-10 flex items-center justify-center group-hover:bg-opacity-20 transition-colors">
                                        <span class="text-lg font-bold ${o.text}">${r.id}</span>
                                    </div>
                                    <span class="text-lg text-slate-700 group-hover:text-slate-900 font-medium">
                                        ${r.text}
                                    </span>
                                </div>
                            </button>
                        `).join("")}
                    </div>
                </div>

                <!-- Zone d'explication (cachée initialement) -->
                <div id="explanation-area" class="hidden px-8 py-6 bg-slate-50 border-t border-gray-200">
                    <!-- Sera rempli après la réponse -->
                </div>

                <!-- Bouton suivant (caché initialement) -->
                <div id="next-button-area" class="hidden px-8 py-6 border-t border-gray-200">
                    <div class="flex justify-between items-center">
                        <p class="text-sm text-slate-500">Question suivante dans quelques secondes...</p>
                        <button id="next-question-btn" class="${o.bg} text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center gap-2">
                            Question suivante
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `,Ze(),W()}function Ze(){document.querySelectorAll(".option-button").forEach(e=>{e.addEventListener("click",()=>Je(e.dataset.optionId))}),document.getElementById("next-question-btn")?.addEventListener("click",Ke),document.getElementById("quit-quiz-btn")?.addEventListener("click",()=>{confirm("Voulez-vous vraiment quitter le quiz ? Votre progression sera perdue.")&&me()}),document.getElementById("focus-mode-btn")?.addEventListener("click",ot),document.getElementById("pause-btn")?.addEventListener("click",rt)}function Je(e){const t=d.questions[b],o=t.options.find(n=>n.id===e),r=Math.floor((Date.now()-Y)/1e3);u.push({questionId:t.id,question:t.question,selectedAnswer:e,correctAnswer:t.options.find(n=>n.correct).id,isCorrect:o.correct,timeSpent:r}),o.correct?N++:N=0,document.querySelectorAll(".option-button").forEach(n=>{n.disabled=!0,n.classList.remove("hover:border-indigo-400","hover:bg-indigo-50")}),We(e,o.correct,t),W(),setTimeout(()=>{document.getElementById("next-button-area")?.classList.remove("hidden")},1e3)}function We(e,t,o){J[d.color];const r=o.options.find(s=>s.correct);document.querySelectorAll(".option-button").forEach(s=>{const i=s.dataset.optionId;i===r.id?(s.classList.add("border-green-500","bg-green-50"),s.classList.remove("border-gray-200")):i===e&&!t&&(s.classList.add("border-red-500","bg-red-50"),s.classList.remove("border-gray-200"))});const n=document.getElementById("explanation-area");n&&(n.innerHTML=`
            <div class="flex items-start gap-4">
                ${t?'<div class="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center"><svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div>':'<div class="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center"><svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></div>'}
                <div class="flex-1">
                    <h3 class="text-lg font-bold ${t?"text-green-700":"text-red-700"} mb-2">
                        ${t?"✅ Bonne réponse !":"❌ Réponse incorrecte"}
                    </h3>
                    <p class="text-slate-700 mb-2"><strong>Explication :</strong> ${o.explanation}</p>
                    ${o.reference?`<p class="text-sm text-slate-500"><strong>Référence :</strong> ${o.reference}</p>`:""}
                </div>
            </div>
        `,n.classList.remove("hidden"))}function Ke(){Y=Date.now(),b++,b<d.questions.length?ce():Xe()}function Xe(){ue();try{window.__QUIZ_ACTIVE=!1}catch{}const e=Math.round(u.filter(i=>i.isCorrect).length/u.length*100),t=Math.floor((Date.now()-G)/1e3),o=Math.floor(t/60),r=t%60;et(e,t);const n=J[d.color],s=document.getElementById("quiz-view");s.innerHTML=`
        <div class="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-12 px-4">
            <div class="max-w-4xl mx-auto">
                <!-- Carte de résultat principale -->
                <div class="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
                    <!-- Header avec score -->
                    <div class="bg-gradient-to-r from-${d.color}-500 to-${d.color}-700 px-8 py-12 text-center text-white">
                        <h1 class="text-4xl font-bold mb-4">Quiz Terminé ! 🎉</h1>
                        <div class="text-8xl font-bold mb-4">${e}%</div>
                        <p class="text-xl opacity-90">${u.filter(i=>i.isCorrect).length} / ${u.length} bonnes réponses</p>
                        <p class="text-lg opacity-75 mt-2">Temps total : ${o}:${r.toString().padStart(2,"0")}</p>
                    </div>
                    
                    <!-- Message de feedback -->
                    <div class="px-8 py-8 text-center border-b border-gray-200">
                        ${e>=90?'<h2 class="text-3xl font-bold text-green-600 mb-2">🏆 Excellent !</h2><p class="text-slate-600 text-lg">Performance exceptionnelle ! Vous maîtrisez parfaitement ce module.</p>':e>=75?'<h2 class="text-3xl font-bold text-blue-600 mb-2">👏 Très bien !</h2><p class="text-slate-600 text-lg">Bon travail ! Quelques révisions et vous serez au top.</p>':e>=60?`<h2 class="text-3xl font-bold text-yellow-600 mb-2">📚 Pas mal !</h2><p class="text-slate-600 text-lg">C'est un bon début. Continuez à réviser pour améliorer votre score.</p>`:'<h2 class="text-3xl font-bold text-red-600 mb-2">💪 Continuez !</h2><p class="text-slate-600 text-lg">Ne vous découragez pas. Révisez les points faibles et réessayez !</p>'}
                    </div>
                    
                    <!-- Détails des réponses -->
                    <div class="px-8 py-6">
                        <h3 class="text-xl font-bold text-slate-900 mb-4">Détails de vos réponses :</h3>
                        <div class="space-y-3 max-h-96 overflow-y-auto">
                            ${u.map((i,a)=>`
                                <div class="flex items-center justify-between p-4 rounded-lg ${i.isCorrect?"bg-green-50":"bg-red-50"}">
                                    <div class="flex items-center gap-3 flex-1">
                                        <span class="${i.isCorrect?"text-green-600":"text-red-600"} text-2xl">
                                            ${i.isCorrect?"✅":"❌"}
                                        </span>
                                        <div class="flex-1">
                                            <p class="font-medium text-slate-900">Question ${a+1}</p>
                                            <p class="text-sm text-slate-600">${i.question}</p>
                                            ${i.isCorrect?"":`<p class="text-xs text-slate-500 mt-1">Votre réponse : ${i.selectedAnswer} | Correcte : ${i.correctAnswer}</p>`}
                                        </div>
                                    </div>
                                    <span class="text-sm text-slate-500">${i.timeSpent}s</span>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                    
                    <!-- Boutons d'action -->
                    <div class="px-8 py-6 flex gap-4">
                        <button id="retry-quiz-btn" class="flex-1 ${n.bg} text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all">
                            Refaire le quiz
                        </button>
                        <button id="return-dashboard-btn" class="flex-1 border-2 border-gray-300 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-all">
                            Retour au tableau de bord
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `,e>=80&&setTimeout(()=>Oe(),500),document.getElementById("retry-quiz-btn")?.addEventListener("click",()=>{le(Z)}),document.getElementById("return-dashboard-btn")?.addEventListener("click",me)}async function et(e,t){try{const o=_();if(!o){console.log("Aucun utilisateur - résultat non sauvegardé");return}if(z()){console.log("Mode démo - résultat non sauvegardé dans Firestore"),E.info("Mode Démo : les résultats ne sont pas sauvegardés");return}await Le(o.uid,{module:Z,month:A,year:q,score:e,totalQuestions:d.questions.length,correctAnswers:u.filter(r=>r.isCorrect).length,timeSpent:t,answers:u,completedAt:new Date}),console.log("✅ Résultat sauvegardé dans Firestore")}catch(o){console.error("❌ Erreur lors de la sauvegarde:",o)}}function tt(){T=setInterval(()=>{if(!D){const e=Math.floor((Date.now()-G-j)/1e3),t=Math.floor(e/60),o=e%60,r=document.getElementById("quiz-timer");r&&(r.textContent=`${t}:${o.toString().padStart(2,"0")}`)}},1e3)}function ue(){T&&(clearInterval(T),T=null)}function W(){if(u.length===0)return;const e=Math.round(u.filter(o=>o.isCorrect).length/u.length*100),t=document.getElementById("quiz-score");t&&(t.textContent=`Score: ${e}%`)}function ot(){document.body.classList.toggle("focus-mode")}function rt(){D=!D;const e=document.getElementById("pause-btn");D?(j+=Date.now(),e.innerHTML='<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Reprendre',E.warning('Quiz en pause. Cliquez sur "Reprendre" pour continuer.',3e3)):(j=Date.now()-j,e.innerHTML='<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Pause',E.success("Quiz repris !",2e3))}function me(){ue();try{window.__QUIZ_ACTIVE=!1}catch{}document.getElementById("quiz-view")?.classList.add("view-hidden"),document.getElementById("dashboard-view")?.classList.remove("view-hidden"),document.querySelectorAll(".nav-link").forEach(e=>{e.classList.remove("bg-indigo-800","text-indigo-100"),e.classList.add("text-indigo-300")}),document.getElementById("nav-dashboard")?.classList.add("bg-indigo-800","text-indigo-100"),E.info("Retour au tableau de bord",2e3),setTimeout(()=>window.location.reload(),500)}const M=10,nt=["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];let v=nt.map(e=>({name:e,score:null}));const V={login:document.getElementById("login-view"),dashboard:document.getElementById("dashboard-view"),moduleSelection:document.getElementById("module-selection-view")},m={modulesGrid:document.getElementById("modules-grid"),annualProgressBar:document.getElementById("annual-progress-bar"),annualProgressText:document.getElementById("annual-progress-text"),moduleSelectionTitle:document.getElementById("module-selection-title"),welcomeMessage:document.getElementById("welcome-message"),userAvatar:document.getElementById("user-avatar"),userName:document.getElementById("user-name"),googleSigninBtn:document.getElementById("google-signin-btn"),signoutLink:document.getElementById("signout-link")};function h(e){Object.values(V).forEach(t=>{t&&t.classList.add("view-hidden")}),V[e]?V[e].classList.remove("view-hidden"):console.error("❌ Vue non trouvée:",e)}function B(e){document.querySelectorAll(".nav-link").forEach(o=>{o.classList.remove("bg-indigo-800","text-indigo-100"),o.classList.add("text-indigo-300")});const t=document.getElementById(e);t&&(t.classList.add("bg-indigo-800","text-indigo-100"),t.classList.remove("text-indigo-300"))}function st(e){const o=108*Math.PI,r=o-e/100*o;let n="text-green-600";return e<80&&(n="text-yellow-500"),e<60&&(n="text-red-600"),`
        <svg class="w-32 h-32" viewBox="0 0 120 120">
            <circle class="text-gray-200" stroke-width="12" stroke="currentColor" fill="transparent" r="54" cx="60" cy="60" />
            <circle
                class="progress-circle ${n} transition-all duration-500"
                stroke-width="12"
                stroke-dasharray="${o}"
                stroke-dashoffset="${r}"
                stroke-linecap="round"
                stroke="currentColor"
                fill="transparent"
                r="54"
                cx="60"
                cy="60"
                transform="rotate(-90 60 60)"
                style="stroke-dashoffset: 283;"
            />
            <text x="50%" y="50%" text-anchor="middle" dy=".3em" class="text-3xl font-bold fill-current text-slate-800">
                ${e}%
            </text>
        </svg>
    `}function it(e,t){return`
        <div class="card-hover relative bg-gradient-to-br ${(n=>n>=90?{bg:"from-green-500 to-emerald-600",ring:"ring-green-500/20",text:"text-green-700",icon:"text-green-600"}:n>=75?{bg:"from-blue-500 to-indigo-600",ring:"ring-blue-500/20",text:"text-blue-700",icon:"text-blue-600"}:n>=60?{bg:"from-orange-500 to-amber-600",ring:"ring-orange-500/20",text:"text-orange-700",icon:"text-orange-600"}:{bg:"from-slate-400 to-slate-600",ring:"ring-slate-500/20",text:"text-slate-700",icon:"text-slate-600"})(t).bg} p-6 rounded-2xl shadow-xl border border-white/20 flex flex-col items-center cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
            <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                <svg class="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-4 drop-shadow-lg">${e}</h3>
            ${st(t)}
            <span class="mt-4 text-sm font-semibold text-white/90 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">Score: ${t}%</span>
            <a href="#" class="mt-3 text-sm font-medium text-white hover:text-white/80 underline decoration-2 underline-offset-4 opacity-0 group-hover:opacity-100 transition-opacity">Voir les détails →</a>
        </div>
    `}function at(e){return`
        <div class="relative bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 p-6 rounded-2xl border-2 border-slate-300 flex flex-col items-center justify-center min-h-[260px] shadow-lg overflow-hidden">
            <!-- Effet de texture -->
            <div class="absolute inset-0 opacity-5" style="background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,.05) 10px, rgba(0,0,0,.05) 20px);"></div>
            
            <!-- Badge verrouillé -->
            <div class="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                🔒 VERROUILLÉ
            </div>
            
            <!-- Cadenas rouge avec effet 3D -->
            <div class="relative mb-4">
                <div class="absolute inset-0 bg-red-600 rounded-full blur-xl opacity-30 animate-pulse"></div>
                <div class="relative bg-gradient-to-br from-red-500 to-red-700 p-4 rounded-2xl shadow-2xl transform hover:rotate-6 transition-transform">
                    <svg class="h-10 w-10 text-white drop-shadow-lg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
            </div>
            
            <h3 class="text-xl font-bold text-slate-700 mb-2">${e}</h3>
            <div class="flex items-center gap-2 text-sm text-slate-500 bg-white/60 px-3 py-1.5 rounded-full backdrop-blur-sm">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span class="font-medium">Disponible le 1er du mois</span>
            </div>
        </div>
    `}function lt(e){return`
        <div class="card-hover relative bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 p-6 rounded-2xl shadow-lg border-2 border-amber-300 flex flex-col items-center justify-center min-h-[260px] cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-orange-400 group overflow-hidden">
            <!-- Effet lumineux -->
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <!-- Badge à compléter -->
            <div class="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
                À COMPLÉTER
            </div>
            
            <!-- Icône horloge avec animation -->
            <div class="relative mb-4">
                <div class="absolute inset-0 bg-orange-500 rounded-full blur-xl opacity-20"></div>
                <div class="relative bg-gradient-to-br from-orange-400 to-amber-600 p-4 rounded-2xl shadow-lg">
                    <svg class="h-10 w-10 text-white animate-pulse" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            </div>
            
            <h3 class="text-xl font-bold text-amber-900 mb-2">${e}</h3>
            <span class="text-sm text-amber-700 text-center font-medium mb-3">Mois manqué - Rattrapez-le !</span>
            
            <!-- Barre de progression stylée -->
            <div class="mt-3 w-full bg-amber-200 rounded-full h-3 shadow-inner overflow-hidden">
                <div class="bg-gradient-to-r from-orange-400 to-amber-500 h-3 rounded-full relative overflow-hidden" style="width: 0%">
                    <div class="absolute inset-0 bg-white/30 animate-pulse"></div>
                </div>
            </div>
            <span class="mt-2 text-xs text-amber-600 font-semibold">0% complété</span>
            
            <!-- Bouton au hover -->
            <button class="mt-4 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all">
                Compléter maintenant
            </button>
        </div>
    `}function dt(e){return`
        <div class="card-hover relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-6 rounded-2xl shadow-2xl border-2 border-white/30 flex flex-col items-center justify-center min-h-[260px] ring-4 ring-purple-500/30 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-3xl group overflow-hidden">
            <!-- Effet de brillance animé -->
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            
            <!-- Particules flottantes -->
            <div class="absolute inset-0 overflow-hidden">
                <div class="absolute w-2 h-2 bg-white/40 rounded-full top-10 left-10 animate-ping"></div>
                <div class="absolute w-2 h-2 bg-white/40 rounded-full top-20 right-20 animate-ping" style="animation-delay: 0.5s;"></div>
                <div class="absolute w-2 h-2 bg-white/40 rounded-full bottom-10 left-20 animate-ping" style="animation-delay: 1s;"></div>
            </div>
            
            <!-- Badge ACTIF avec animation -->
            <span class="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-bounce z-10">
                ⚡ ACTIF
            </span>
            
            <!-- Icône stylo avec effet glow -->
            <div class="relative mb-4 z-10">
                <div class="absolute inset-0 bg-white rounded-full blur-2xl opacity-50 animate-pulse"></div>
                <div class="relative bg-white/20 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-white/30">
                    <svg class="h-12 w-12 text-white drop-shadow-2xl" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </div>
            </div>
            
            <h3 class="text-2xl font-black text-white mb-2 drop-shadow-lg z-10">${e}</h3>
            <p class="text-white/90 text-sm font-medium mb-4 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm z-10">🎯 Prêt à être complété</p>
            
            <!-- Bouton CTA avec effet premium -->
            <button class="start-quiz-button relative w-full bg-white text-purple-600 font-bold px-6 py-3 rounded-xl shadow-2xl hover:shadow-3xl transition-all transform hover:-translate-y-1 group/btn z-10 overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                <span class="relative flex items-center justify-center gap-2">
                    Démarrer le quiz
                    <svg class="h-5 w-5 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </span>
            </button>
        </div>
    `}function ct(){let e=0;for(let t=M-1;t>=0&&(v[t].score!==null&&v[t].score>=60);t--)e++;return e}async function ut(){try{const e=_();if(!e){console.log("ℹ️ Aucun utilisateur - pas de données à charger");return}if(z()){console.log("ℹ️ Mode démo - affichage des données simulées");return}console.log("📊 Chargement des données du dashboard...");const t=await Be(e.uid);t&&await ae(t);const o=await Ie(e.uid);v=v.map((s,i)=>{const a=`${s.name} ${new Date().getFullYear()}`;return o[a]?{name:s.name,score:o[a].score}:s});const r=await $e(e.uid),n=document.getElementById("streak-count");n&&(n.textContent=r),console.log("✅ Données du dashboard chargées")}catch(e){console.error("❌ Erreur chargement données:",e)}}async function K(){if(!m.modulesGrid){console.error("❌ L'élément 'modules-grid' est introuvable.");return}await ut(),m.modulesGrid.innerHTML="";let e=0;v.forEach((s,i)=>{let a="";i<M?s.score!==null?(a=it(s.name,s.score),e++):a=lt(s.name):i===M?a=dt(s.name):a=at(s.name),m.modulesGrid.innerHTML+=a});const t=e/12*100;m.annualProgressBar.style.width=`${t}%`,m.annualProgressText.textContent=`${e}/12`;const o=ct(),r=document.getElementById("streak-count");r&&(r.textContent=o);const n=document.getElementById("streak-badge");n&&o===0&&(n.style.display="none"),ft(),setTimeout(()=>{mt(),gt(),ht()},500)}function mt(){const e=document.getElementById("skills-radar-chart");e&&new Chart(e,{type:"radar",data:{labels:["Procédures","Garanties","Documentation","Inspection","Entretien","Réglementation"],datasets:[{label:"Vos Compétences",data:[92,88,85,90,87,94],backgroundColor:"rgba(99, 102, 241, 0.2)",borderColor:"rgb(99, 102, 241)",borderWidth:2,pointBackgroundColor:"rgb(99, 102, 241)",pointBorderColor:"#fff",pointHoverBackgroundColor:"#fff",pointHoverBorderColor:"rgb(99, 102, 241)"}]},options:{responsive:!0,maintainAspectRatio:!0,scales:{r:{beginAtZero:!0,max:100,ticks:{stepSize:20}}},plugins:{legend:{display:!1}}}})}function gt(){const e=document.getElementById("scores-trend-chart");if(!e)return;const t=v.filter((o,r)=>r<M);new Chart(e,{type:"line",data:{labels:t.map(o=>o.name),datasets:[{label:"Score (%)",data:t.map(o=>o.score),backgroundColor:"rgba(99, 102, 241, 0.1)",borderColor:"rgb(99, 102, 241)",borderWidth:3,fill:!0,tension:.4,pointRadius:5,pointHoverRadius:7,pointBackgroundColor:"rgb(99, 102, 241)",pointBorderColor:"#fff",pointBorderWidth:2}]},options:{responsive:!0,maintainAspectRatio:!0,scales:{y:{beginAtZero:!0,max:100,ticks:{callback:function(o){return o+"%"}}}},plugins:{legend:{display:!1},tooltip:{callbacks:{label:function(o){return"Score: "+o.parsed.y+"%"}}}}}})}function ht(){const e=document.getElementById("activity-heatmap");if(!e)return;const t=52,o=7;let r='<div class="flex gap-1">';for(let n=0;n<t;n++){r+='<div class="flex flex-col gap-1">';for(let s=0;s<o;s++){const i=n*o+s;let a=0;i%30<28&&(a=Math.floor(Math.random()*4)+1),r+=`<div class="w-3 h-3 rounded-sm ${["bg-slate-100","bg-green-200","bg-green-400","bg-green-600","bg-green-800"][a]}" title="Activité"></div>`}r+="</div>"}r+="</div>",e.innerHTML=r}function ft(){document.querySelectorAll(".start-quiz-button").forEach(e=>{e.addEventListener("click",t=>{t.preventDefault();const o=v[M].name;m.moduleSelectionTitle.textContent=`Quiz de ${o}`,h("moduleSelection")})}),document.querySelectorAll(".back-to-dashboard").forEach(e=>{e.addEventListener("click",t=>{t.preventDefault(),h("dashboard"),B("nav-dashboard")})}),document.querySelectorAll(".module-card").forEach(e=>{e.addEventListener("click",t=>{t.preventDefault();const o=e.getAttribute("data-module");console.log("🎯 Module sélectionné:",o),le(o)})}),document.getElementById("nav-dashboard")?.addEventListener("click",e=>{e.preventDefault(),h("dashboard"),B("nav-dashboard")}),document.getElementById("nav-quiz")?.addEventListener("click",e=>{e.preventDefault();const t=v[M].name;m.moduleSelectionTitle.textContent=`Quiz de ${t}`,h("moduleSelection"),B("nav-quiz")}),document.getElementById("nav-results")?.addEventListener("click",e=>{const t=e.currentTarget;window.__QUIZ_ACTIVE?(e.preventDefault(),confirm("Un quiz est en cours. Voulez-vous vraiment quitter ?")&&t&&t.href&&(window.location.href=t.href)):console.log("Navigation vers Résultats...")}),document.getElementById("nav-resources")?.addEventListener("click",e=>{const t=e.currentTarget;window.__QUIZ_ACTIVE?(e.preventDefault(),confirm("Un quiz est en cours. Voulez-vous vraiment quitter ?")&&t&&t.href&&(window.location.href=t.href)):console.log("Navigation vers Ressources...")})}function X(e){if(e){m.userName.textContent=e.displayName||"Utilisateur",m.userAvatar.src=e.photoURL||"https://placehold.co/100x100/667eea/e0e7ff?text="+(e.displayName?.[0]||"U");const t=e.displayName?.split(" ")[0]||"Utilisateur";m.welcomeMessage.textContent=`Bonjour ${t}, prêt à relever votre défi de ${v[M].name} ?`}}function pt(){const e=localStorage.getItem("theme")||"light";document.documentElement.classList.toggle("dark",e==="dark"),ge(e)}function ge(e){const t=document.getElementById("theme-icon-sun"),o=document.getElementById("theme-icon-moon"),r=document.getElementById("theme-text");e==="dark"?(t?.classList.remove("hidden"),o?.classList.add("hidden"),r&&(r.textContent="Mode Clair")):(t?.classList.add("hidden"),o?.classList.remove("hidden"),r&&(r.textContent="Mode Sombre"))}function vt(){const t=(document.documentElement.classList.contains("dark")?"dark":"light")==="dark"?"light":"dark";document.documentElement.classList.toggle("dark"),localStorage.setItem("theme",t),ge(t)}document.addEventListener("DOMContentLoaded",()=>{if(console.log("🚀 Initialisation de QuizPro..."),pt(),document.getElementById("theme-toggle")?.addEventListener("click",vt),m.googleSigninBtn?.addEventListener("click",ie),m.signoutLink?.addEventListener("click",t=>{t.preventDefault(),confirm("Voulez-vous vraiment vous déconnecter ?")&&(z()?(Qe(),h("login"),B("nav-dashboard")):Te())}),z()){console.log("🎨 MODE DÉMO ACTIF - Chargement du dashboard...");const t=_();if(t){X(t);try{ae(t)}catch{}h("dashboard"),B("nav-dashboard"),K()}else console.error("❌ Mode démo actif mais pas d'utilisateur trouvé"),h("login")}else h("login"),De(t=>{t?(console.log("✅ Utilisateur connecté:",t.displayName),X(t),h("dashboard"),B("nav-dashboard"),K()):(console.log("👤 Aucun utilisateur connecté"),h("login"))});console.log("✅ QuizPro initialisé avec succès")});
//# sourceMappingURL=index-Da_0uqDU.js.map
