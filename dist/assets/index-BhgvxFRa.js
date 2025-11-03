import{initializeApp as me}from"https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";import{getAuth as ge,GoogleAuthProvider as he,signInWithPopup as fe,signOut as pe,onAuthStateChanged as ve}from"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";import{getFirestore as xe,doc as I,Timestamp as p,getDoc as U,setDoc as K,query as j,collection as q,where as x,getDocs as Q,updateDoc as X,orderBy as be,limit as we,addDoc as ye}from"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";import{getDatabase as ke}from"https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function o(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(r){if(r.ep)return;r.ep=!0;const s=o(r);fetch(r.href,s)}})();function S(e,t="info",o=3e3){const n=ee(),r=Ee(e,t);return n.appendChild(r),setTimeout(()=>r.classList.add("show"),10),o>0&&setTimeout(()=>{R(r)},o),r}function ee(){let e=document.getElementById("toast-container");return e||(e=document.createElement("div"),e.id="toast-container",e.className="fixed top-4 right-4 z-50 flex flex-col gap-3",document.body.appendChild(e)),e}function Ee(e,t){const o=document.createElement("div");o.className=`toast toast-${t} transform translate-x-full transition-all duration-300`;const n=te(t);return o.innerHTML=`
        <div class="flex items-center gap-3 bg-white rounded-lg shadow-lg border-l-4 ${n.borderColor} p-4 min-w-[320px] max-w-md">
            <div class="flex-shrink-0">
                ${n.icon}
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
    `,o.querySelector(".toast-close").addEventListener("click",()=>R(o)),o}function te(e){const t={success:{borderColor:"border-green-500",icon:`<div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
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
            </div>`}};return t[e]||t.info}function R(e){e.classList.remove("show"),e.classList.add("translate-x-full"),setTimeout(()=>{e.remove();const t=document.getElementById("toast-container");t&&t.children.length===0&&t.remove()},300)}const k={success:(e,t)=>S(e,"success",t),error:(e,t)=>S(e,"error",t),warning:(e,t)=>S(e,"warning",t),info:(e,t)=>S(e,"info",t)};function V(e){const t=ee(),o=document.createElement("div");return o.className="toast toast-loading transform translate-x-full transition-all duration-300",o.setAttribute("data-loading","true"),o.innerHTML=`
        <div class="flex items-center gap-3 bg-white rounded-lg shadow-lg border-l-4 border-indigo-500 p-4 min-w-[320px] max-w-md">
            <div class="flex-shrink-0">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
            <div class="flex-1">
                <p class="text-sm font-medium text-slate-900">${e}</p>
            </div>
        </div>
    `,t.appendChild(o),setTimeout(()=>o.classList.add("show"),10),o}function E(e,t,o="success"){if(!e||!e.getAttribute("data-loading"))return;const n=te(o),r=e.classList.contains("show");e.className=`toast toast-${o} transform transition-all duration-300${r?" show":""}`,e.innerHTML=`
        <div class="flex items-center gap-3 bg-white rounded-lg shadow-lg border-l-4 ${n.borderColor} p-4 min-w-[320px] max-w-md">
            <div class="flex-shrink-0">
                ${n.icon}
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
    `,document.head.appendChild(e)}const oe={apiKey:"AIzaSyD8w7Em_xdMGplscfGLrnM72vmm4z5ZTr0",authDomain:"avantage-quizz.firebaseapp.com",databaseURL:"https://avantage-quizz-default-rtdb.firebaseio.com",projectId:"avantage-quizz",storageBucket:"avantage-quizz.firebasestorage.app",messagingSenderId:"919472910099",appId:"1:919472910099:web:e17d4c1cdc7a04c6cab4e6"},O=me(oe),L=ge(O),f=xe(O);ke(O);console.log("✅ Firebase initialisé avec succès");console.log("📊 Projet:",oe.projectId);console.log("🔐 Services: Authentication, Firestore, Realtime Database");const w={users:"users",quizResults:"quizResults",monthlyProgress:"monthlyProgress",questions:"questions"};async function Ce(e){try{const t=I(f,w.users,e.uid),o={uid:e.uid,email:e.email,displayName:e.displayName,photoURL:e.photoURL,lastLogin:p.now(),updatedAt:p.now()};return(await U(t)).exists()||(o.createdAt=p.now(),o.totalQuizzes=0,o.averageScore=0,o.currentStreak=0,o.longestStreak=0,o.role="user",console.log("👤 Création du profil utilisateur:",e.email)),await K(t,o,{merge:!0}),console.log("✅ Profil utilisateur sauvegardé"),o}catch(t){throw console.error("❌ Erreur création utilisateur:",t),t}}async function ze(e){try{const t=I(f,w.users,e),o=await U(t);return o.exists()?o.data():null}catch(t){throw console.error("❌ Erreur récupération profil:",t),t}}async function Me(e){try{const t=L.currentUser;if(!t)throw new Error("Utilisateur non connecté");const o={userId:t.uid,userEmail:t.email,moduleId:e.moduleId,moduleName:e.moduleName,score:e.score,correctAnswers:e.correctAnswers,totalQuestions:e.totalQuestions,timeElapsed:e.timeElapsed,answers:e.answers,date:p.now(),month:e.month||new Date().toLocaleDateString("fr-FR",{month:"long",year:"numeric"})},n=await ye(q(f,w.quizResults),o);return console.log("✅ Résultat de quiz sauvegardé:",n.id),await qe(t.uid,e.score),await Be(t.uid,e.month,e.score),n.id}catch(t){throw console.error("❌ Erreur sauvegarde résultat:",t),t}}async function Le(e,t=50){try{const o=j(q(f,w.quizResults),x("userId","==",e),be("date","desc"),we(t)),n=await Q(o),r=[];return n.forEach(s=>{r.push({id:s.id,...s.data()})}),console.log(`📊 ${r.length} résultats chargés`),r}catch(o){throw console.error("❌ Erreur récupération résultats:",o),o}}async function Be(e,t,o){try{const n=I(f,w.monthlyProgress,`${e}_${t}`),r={userId:e,month:t,score:o,completed:!0,completedAt:p.now(),updatedAt:p.now()};await K(n,r,{merge:!0}),console.log("✅ Progression mensuelle mise à jour")}catch(n){throw console.error("❌ Erreur mise à jour progression:",n),n}}async function Ae(e,t=new Date().getFullYear()){try{const o=j(q(f,w.monthlyProgress),x("userId","==",e)),n=await Q(o),r={};return n.forEach(s=>{const i=s.data();r[i.month]=i}),console.log("📅 Progression annuelle chargée"),r}catch(o){throw console.error("❌ Erreur récupération progression:",o),o}}async function qe(e,t){try{const o=I(f,w.users,e),n=await U(o);if(n.exists()){const r=n.data(),s=(r.totalQuizzes||0)+1,a=((r.averageScore||0)*(s-1)+t)/s;await X(o,{totalQuizzes:s,averageScore:Math.round(a),lastQuizDate:p.now(),updatedAt:p.now()}),console.log("📊 Statistiques mises à jour")}}catch(o){throw console.error("❌ Erreur mise à jour statistiques:",o),o}}async function Ie(e){try{const t=await Le(e,12);let o=0;const n=new Set;for(const a of t)a.score>=60&&n.add(a.month);const r=Array.from(n).sort().reverse();for(let a=0;a<r.length&&(o++,a<r.length-1);a++);const s=I(f,w.users,e),i=await U(s);if(i.exists()){const a=i.data(),l=Math.max(o,a.longestStreak||0);await X(s,{currentStreak:o,longestStreak:l,updatedAt:p.now()}),console.log(`🔥 Série mise à jour: ${o} mois`)}return o}catch(t){throw console.error("❌ Erreur mise à jour série:",t),t}}const ne=new he;ne.setCustomParameters({prompt:"select_account"});async function re(){try{console.log("🔐 Tentative de connexion Google...");const t=(await fe(L,ne)).user;return console.log("✅ Authentification réussie:",t.displayName),console.log("📧 Email:",t.email),await Ce(t),t}catch(e){console.error("❌ Erreur de connexion:",e);let t="Erreur lors de la connexion. Veuillez réessayer.";throw e.code==="auth/popup-closed-by-user"?t="Connexion annulée. Veuillez réessayer.":e.code==="auth/popup-blocked"?t="Pop-up bloquée. Autorisez les pop-ups pour ce site.":e.code==="auth/unauthorized-domain"&&(t="Domaine non autorisé. Configurez Firebase Authentication."),alert(t),e}}async function Se(){try{const e=L.currentUser?.displayName||"Utilisateur";await pe(L),console.log("✅ Déconnexion réussie:",e)}catch(e){throw console.error("❌ Erreur de déconnexion:",e),e}}function $e(e){return ve(L,t=>{t?console.log("👤 Utilisateur connecté:",t.email):console.log("👤 Aucun utilisateur connecté"),e(t)})}function Te(){return L.currentUser}async function se(e){if(!e)return;if(e.role==="admin"){const o=document.getElementById("nav-admin-item");o&&o.classList.remove("hidden");const n=document.getElementById("admin-badge-nav");n&&n.classList.remove("hidden"),console.log("Admin UI elements shown")}}async function De(){try{console.log("🎭 Activation du mode démo...");const e={uid:"demo-user-"+Date.now(),email:"demo@avantage-quizz.local",displayName:"Utilisateur Démo",photoURL:null,isDemo:!0,role:"admin",createdAt:new Date().toISOString()};return localStorage.setItem("demoUser",JSON.stringify(e)),localStorage.setItem("authMode","demo"),console.log("✅ Mode démo activé:",e.displayName),console.log("📧 Email:",e.email),console.log("👑 Rôle:",e.role),e}catch(e){throw console.error("❌ Erreur activation mode démo:",e),e}}function je(){localStorage.removeItem("demoUser"),localStorage.removeItem("authMode"),console.log("✅ Mode démo désactivé")}function C(){return localStorage.getItem("authMode")==="demo"}function Qe(){try{const e=localStorage.getItem("demoUser");return e?JSON.parse(e):null}catch(e){return console.error("❌ Erreur lecture utilisateur démo:",e),null}}function F(){return C()?Qe():Te()}console.log("Initialisation de la page d accueil...");document.addEventListener("DOMContentLoaded",Re);function Re(){console.log("📄 DOM chargé - configuration des boutons...");const e=document.getElementById("google-signin-btn");e?(e.addEventListener("click",Ue),console.log("✅ Bouton Google configuré")):console.warn("⚠️ Bouton Google non trouvé");const t=document.getElementById("demo-mode-btn");t?(t.addEventListener("click",Pe),console.log("✅ Bouton Mode Démo configuré")):console.warn("⚠️ Bouton Mode Démo non trouvé")}async function Ue(){console.log("🔐 Clic sur connexion Google...");const e=V("Connexion en cours...");try{const t=await re();E(e,`Bienvenue ${t.displayName} !`,"success"),setTimeout(()=>{window.location.reload()},800)}catch(t){console.error("❌ Erreur connexion Google:",t);let o="Erreur lors de la connexion";t.code==="auth/popup-closed-by-user"?o="Connexion annulée":t.code==="auth/popup-blocked"?o="Pop-up bloquée. Autorisez les pop-ups.":t.code==="auth/unauthorized-domain"?o="Domaine non autorisé dans Firebase":t.code==="auth/network-request-failed"&&(o="Erreur réseau. Vérifiez votre connexion."),E(e,o,"error")}}async function Pe(){console.log("🎭 Clic sur Mode Démo...");const e=V("Activation du mode démo...");try{const t=await De();console.log("✅ Mode démo activé:",t),E(e,"Mode démo activé ! Rechargement...","success"),setTimeout(()=>{window.location.reload()},500)}catch(t){console.error("❌ Erreur activation mode démo:",t),E(e,"error","Impossible d'activer le mode démo")}}function Ne(){const e=document.createElement("canvas");e.style.position="fixed",e.style.top="0",e.style.left="0",e.style.width="100%",e.style.height="100%",e.style.pointerEvents="none",e.style.zIndex="9999",document.body.appendChild(e);const t=e.getContext("2d");e.width=window.innerWidth,e.height=window.innerHeight;const o=[],n=["#FF6B6B","#4ECDC4","#45B7D1","#FFA07A","#98D8C8","#F7DC6F","#BB8FCE","#85C1E2"];for(let s=0;s<150;s++)o.push({x:Math.random()*e.width,y:e.height+Math.random()*100,size:Math.random()*8+4,speedY:-(Math.random()*3+3),speedX:Math.random()*6-3,color:n[Math.floor(Math.random()*n.length)],rotation:Math.random()*360,rotationSpeed:Math.random()*10-5,gravity:.15,opacity:1});function r(){t.clearRect(0,0,e.width,e.height);let s=0;o.forEach((i,a)=>{i.speedY+=i.gravity,i.y+=i.speedY,i.x+=i.speedX,i.rotation+=i.rotationSpeed,i.y>e.height-100&&(i.opacity-=.02),i.opacity>0&&i.y<e.height+50&&(s++,t.save(),t.translate(i.x,i.y),t.rotate(i.rotation*Math.PI/180),t.globalAlpha=i.opacity,t.fillStyle=i.color,t.fillRect(-i.size/2,-i.size/2,i.size,i.size),t.restore())}),s>0?requestAnimationFrame(r):e.remove()}r()}const Ve={auto:{name:"AT-AVE-AVEX",color:"indigo",label:"Auto"},loisir:{name:"VTT, Motoneige, etc.",color:"cyan",label:"Loisir"},vr:{name:"Véhicules Récréatifs",color:"orange",label:"VR"},tracteur:{name:"Équipement Agricole",color:"green",label:"Tracteur"}};let c=null,b=0,u=[],H=null,$=null,_=null,N=0,T=!1,D=0,G=null,B=null,A=null;const Y={indigo:{bg:"bg-indigo-600",text:"text-indigo-600",border:"border-indigo-600"},cyan:{bg:"bg-cyan-600",text:"text-cyan-600",border:"border-cyan-600"},orange:{bg:"bg-orange-600",text:"text-orange-600",border:"border-orange-600"},green:{bg:"bg-green-600",text:"text-green-600",border:"border-green-600"}};async function Oe(e,t,o){console.log(`📥 Chargement des questions: module=${e}, mois=${t}, année=${o}`);const n=r=>{const s=r.data();return{id:r.id,question:s.question,options:s.options.map((i,a)=>({id:String.fromCharCode(65+a),text:i,correct:a===s.correctAnswer})),explanation:s.explanation||"Pas d'explication disponible",reference:s.reference||"",tags:s.tags||[]}};if(C()){console.log("📝 Mode démo : Chargement des questions simulées pour le quiz...");const s=localStorage.getItem("avantage-quizz-demo-questions");let i=[];if(s)try{const a=JSON.parse(s);console.log(`💾 ${a.length} questions chargées depuis localStorage`),i=a.map(l=>({id:l.id,question:l.question,options:l.options.map((y,d)=>({id:String.fromCharCode(65+d),text:y,correct:d===l.correctAnswer})),explanation:l.explanation||"Pas d'explication disponible",reference:l.reference||"",tags:l.tags||[]})),i=i.filter(l=>{const y=!e||a.find(g=>g.id===l.id)?.module===e,d=!t||a.find(g=>g.id===l.id)?.month===t;return y&&d})}catch{console.warn("⚠️ Erreur lecture localStorage, utilisation questions par défaut")}return i.length===0&&(console.log("📦 Utilisation questions par défaut (aucune en localStorage)"),i=[{id:"demo-1",question:"Quelle est la vitesse maximale autorisée sur une autoroute au Québec ?",options:[{id:"A",text:"100 km/h",correct:!1},{id:"B",text:"110 km/h",correct:!1},{id:"C",text:"120 km/h",correct:!1},{id:"D",text:"100 km/h (conditions normales)",correct:!0}],explanation:"La vitesse maximale sur autoroute au Québec est de 100 km/h, sauf indication contraire.",reference:"Code de la sécurité routière du Québec",tags:["vitesse","autoroute"]},{id:"demo-2",question:"À quelle distance minimale devez-vous vous arrêter derrière un autobus scolaire dont les feux clignotent ?",options:[{id:"A",text:"3 mètres",correct:!1},{id:"B",text:"5 mètres",correct:!0},{id:"C",text:"10 mètres",correct:!1},{id:"D",text:"15 mètres",correct:!1}],explanation:"Vous devez vous arrêter à au moins 5 mètres d'un autobus scolaire.",reference:"Article 460 CSR",tags:["autobus","sécurité"]},{id:"demo-3",question:"Quel est le taux d'alcoolémie maximal pour conduire au Québec ?",options:[{id:"A",text:"0.05",correct:!1},{id:"B",text:"0.08",correct:!0},{id:"C",text:"0.10",correct:!1},{id:"D",text:"0.00",correct:!1}],explanation:"Le taux maximal est de 0.08 pour conducteurs expérimentés.",reference:"Code criminel du Canada",tags:["alcool","sécurité"]},{id:"demo-4",question:"Combien de points d'inaptitude entraîne un excès de vitesse de 30 km/h ?",options:[{id:"A",text:"2 points",correct:!1},{id:"B",text:"3 points",correct:!0},{id:"C",text:"4 points",correct:!1},{id:"D",text:"5 points",correct:!1}],explanation:"Un excès de 21 à 30 km/h entraîne 3 points.",reference:"SAAQ",tags:["vitesse","points"]},{id:"demo-5",question:"Quelle est la distance de sécurité recommandée entre véhicules ?",options:[{id:"A",text:"1 seconde",correct:!1},{id:"B",text:"2 secondes",correct:!0},{id:"C",text:"3 secondes",correct:!1},{id:"D",text:"5 secondes",correct:!1}],explanation:"La règle des 2 secondes est recommandée.",reference:"Guide SAAQ",tags:["distance","sécurité"]}]),console.log(`✅ ${i.length} questions démo chargées pour le quiz`),i}try{let r=j(q(f,"questions"),x("module","==",e),x("month","==",t),x("year","==",o)),s=await Q(r);if(!s.empty){const d=[];return s.forEach(g=>d.push(n(g))),console.log(`✅ ${d.length} questions (mois numérique)`),d}const a=["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"][t-1],l=a.charAt(0).toUpperCase()+a.slice(1).toLowerCase();let y=j(q(f,"questions"),x("module","==",e),x("month","==",l),x("year","==",o));if(s=await Q(y),!s.empty){const d=[];return s.forEach(g=>d.push(n(g))),console.log(`✅ ${d.length} questions (mois texte)`),d}return console.warn("⚠️ Aucune question trouvée pour ces critères (numérique/texte)"),[]}catch(r){throw console.error("❌ Erreur lors du chargement des questions:",r),r}}async function Fe(e,t,o){try{const n=await fetch("/test-questions-valides.json");if(!n.ok)return[];const r=await n.json(),i=["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"][t-1];return r.filter(l=>l.module===e&&l.year===o&&(l.month===i||l.month===t)).map((l,y)=>({id:`demo-${e}-${y}`,question:l.question,options:l.options.map((d,g)=>({id:String.fromCharCode(65+g),text:d,correct:g===l.correctAnswer})),explanation:l.explanation||"Pas d'explication disponible",reference:l.reference||"",tags:l.tags||[]}))}catch(n){return console.warn("Demo questions fallback error:",n),[]}}async function ie(e){const t=Ve[e];if(!t){console.error("Module de quiz non trouvé:",e),k.error("Module non trouvé. Veuillez réessayer.");return}const o=V(`Chargement du quiz ${t.label}...`);He(t.label);try{const n=new Date,r=["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"],s=n.getMonth()+1;B=r[s-1],A=n.getFullYear(),G=e;try{window.__QUIZ_ACTIVE=!0}catch{}let i=await Oe(e,s,A);if(i.length===0&&C()&&(console.log("ℹ️ Mode Démo: chargement des questions locales de test"),i=await Fe(e,s,A)),i.length===0){E(o,"Aucune question disponible","error"),k.error(`Aucune question trouvée pour ${t.label} en ${B} ${A}.

Contactez l'administrateur.`,5e3);return}c={name:`Quiz ${t.label} - ${B.charAt(0).toUpperCase()+B.slice(1)}`,module:t.name,color:t.color,questions:i},b=0,u=[],H=Date.now(),_=Date.now(),N=0,_e(),le(),Xe(),Z(),E(o,`${i.length} questions chargées !`,"success")}catch(n){console.error("❌ Erreur lors du démarrage du quiz:",n),E(o,"Erreur de chargement","error"),k.error("Erreur lors du chargement du quiz. Veuillez réessayer.",4e3)}}function He(e){const t=ae();t.innerHTML=`
        <div class="min-h-screen flex items-center justify-center">
            <div class="text-center">
                <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-6"></div>
                <h2 class="text-2xl font-bold text-slate-900 mb-2">Chargement du quiz ${e}</h2>
                <p class="text-slate-600">Récupération des questions...</p>
            </div>
        </div>
    `,t.classList.remove("view-hidden")}function _e(){document.getElementById("dashboard-view")?.classList.add("view-hidden"),document.getElementById("module-selection-view")?.classList.add("view-hidden"),document.getElementById("login-view")?.classList.add("view-hidden"),ae().classList.remove("view-hidden")}function ae(){let e=document.getElementById("quiz-view");return e||(e=document.createElement("div"),e.id="quiz-view",document.querySelector("main").appendChild(e)),e}function le(){const e=c.questions[b],t=document.getElementById("quiz-view"),o=Y[c.color];t.innerHTML=`
        <!-- En-tête du quiz -->
        <div class="bg-white border-b border-gray-200 shadow-sm">
            <div class="max-w-5xl mx-auto px-6 py-4">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-xl font-bold text-slate-900">${c.name}</h1>
                        <p class="text-sm text-slate-500">Question ${b+1} sur ${c.questions.length}</p>
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
                    <div class="${o.bg} h-2 rounded-full transition-all duration-300" style="width: ${(b+1)/c.questions.length*100}%"></div>
                </div>
            </div>
        </div>

        <!-- Contenu de la question -->
        <div class="max-w-5xl mx-auto px-6 py-8">
            <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                
                <!-- En-tête de question -->
                <div class="px-8 py-6 bg-gradient-to-r from-slate-50 to-white border-b border-gray-100">
                    <div class="mb-4">
                        <span class="text-sm font-medium ${o.text}">Question ${b+1} sur ${c.questions.length}</span>
                    </div>
                    
                    <h2 class="text-2xl font-bold text-slate-900 leading-relaxed">
                        ${e.question}
                    </h2>
                    
                    <!-- Tags -->
                    ${e.tags&&e.tags.length>0?`
                        <div class="flex flex-wrap gap-2 mt-4">
                            ${e.tags.map(n=>`
                                <span class="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                                    ${n}
                                </span>
                            `).join("")}
                        </div>
                    `:""}
                </div>

                <!-- Options de réponse -->
                <div class="p-8">
                    <div class="space-y-3">
                        ${e.options.map(n=>`
                            <button data-option-id="${n.id}" 
                                    class="option-button w-full text-left px-6 py-5 rounded-xl border-2 border-gray-200 hover:border-${c.color}-400 hover:bg-${c.color}-50 transition-all duration-200 group">
                                <div class="flex items-center gap-4">
                                    <div class="flex-shrink-0 w-10 h-10 rounded-lg ${o.bg} bg-opacity-10 flex items-center justify-center group-hover:bg-opacity-20 transition-colors">
                                        <span class="text-lg font-bold ${o.text}">${n.id}</span>
                                    </div>
                                    <span class="text-lg text-slate-700 group-hover:text-slate-900 font-medium">
                                        ${n.text}
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
    `,Ge(),Z()}function Ge(){document.querySelectorAll(".option-button").forEach(e=>{e.addEventListener("click",()=>Ye(e.dataset.optionId))}),document.getElementById("next-question-btn")?.addEventListener("click",Je),document.getElementById("quit-quiz-btn")?.addEventListener("click",()=>{confirm("Voulez-vous vraiment quitter le quiz ? Votre progression sera perdue.")&&de()}),document.getElementById("focus-mode-btn")?.addEventListener("click",et),document.getElementById("pause-btn")?.addEventListener("click",tt)}function Ye(e){const t=c.questions[b],o=t.options.find(r=>r.id===e),n=Math.floor((Date.now()-_)/1e3);u.push({questionId:t.id,question:t.question,selectedAnswer:e,correctAnswer:t.options.find(r=>r.correct).id,isCorrect:o.correct,timeSpent:n}),o.correct?N++:N=0,document.querySelectorAll(".option-button").forEach(r=>{r.disabled=!0,r.classList.remove("hover:border-indigo-400","hover:bg-indigo-50")}),Ze(e,o.correct,t),Z(),setTimeout(()=>{document.getElementById("next-button-area")?.classList.remove("hidden")},1e3)}function Ze(e,t,o){Y[c.color];const n=o.options.find(s=>s.correct);document.querySelectorAll(".option-button").forEach(s=>{const i=s.dataset.optionId;i===n.id?(s.classList.add("border-green-500","bg-green-50"),s.classList.remove("border-gray-200")):i===e&&!t&&(s.classList.add("border-red-500","bg-red-50"),s.classList.remove("border-gray-200"))});const r=document.getElementById("explanation-area");r&&(r.innerHTML=`
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
        `,r.classList.remove("hidden"))}function Je(){_=Date.now(),b++,b<c.questions.length?le():We()}function We(){ce();try{window.__QUIZ_ACTIVE=!1}catch{}const e=Math.round(u.filter(i=>i.isCorrect).length/u.length*100),t=Math.floor((Date.now()-H)/1e3),o=Math.floor(t/60),n=t%60;Ke(e,t);const r=Y[c.color],s=document.getElementById("quiz-view");s.innerHTML=`
        <div class="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-12 px-4">
            <div class="max-w-4xl mx-auto">
                <!-- Carte de résultat principale -->
                <div class="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
                    <!-- Header avec score -->
                    <div class="bg-gradient-to-r from-${c.color}-500 to-${c.color}-700 px-8 py-12 text-center text-white">
                        <h1 class="text-4xl font-bold mb-4">Quiz Terminé ! 🎉</h1>
                        <div class="text-8xl font-bold mb-4">${e}%</div>
                        <p class="text-xl opacity-90">${u.filter(i=>i.isCorrect).length} / ${u.length} bonnes réponses</p>
                        <p class="text-lg opacity-75 mt-2">Temps total : ${o}:${n.toString().padStart(2,"0")}</p>
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
                        <button id="retry-quiz-btn" class="flex-1 ${r.bg} text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all">
                            Refaire le quiz
                        </button>
                        <button id="return-dashboard-btn" class="flex-1 border-2 border-gray-300 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-all">
                            Retour au tableau de bord
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `,e>=80&&setTimeout(()=>Ne(),500),document.getElementById("retry-quiz-btn")?.addEventListener("click",()=>{ie(G)}),document.getElementById("return-dashboard-btn")?.addEventListener("click",de)}async function Ke(e,t){try{const o=F();if(!o){console.log("Aucun utilisateur - résultat non sauvegardé");return}if(C()){console.log("Mode démo - résultat non sauvegardé dans Firestore"),k.info("Mode Démo : les résultats ne sont pas sauvegardés");return}await Me(o.uid,{module:G,month:B,year:A,score:e,totalQuestions:c.questions.length,correctAnswers:u.filter(n=>n.isCorrect).length,timeSpent:t,answers:u,completedAt:new Date}),console.log("✅ Résultat sauvegardé dans Firestore")}catch(o){console.error("❌ Erreur lors de la sauvegarde:",o)}}function Xe(){$=setInterval(()=>{if(!T){const e=Math.floor((Date.now()-H-D)/1e3),t=Math.floor(e/60),o=e%60,n=document.getElementById("quiz-timer");n&&(n.textContent=`${t}:${o.toString().padStart(2,"0")}`)}},1e3)}function ce(){$&&(clearInterval($),$=null)}function Z(){if(u.length===0)return;const e=Math.round(u.filter(o=>o.isCorrect).length/u.length*100),t=document.getElementById("quiz-score");t&&(t.textContent=`Score: ${e}%`)}function et(){document.body.classList.toggle("focus-mode")}function tt(){T=!T;const e=document.getElementById("pause-btn");T?(D+=Date.now(),e.innerHTML='<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Reprendre',k.warning('Quiz en pause. Cliquez sur "Reprendre" pour continuer.',3e3)):(D=Date.now()-D,e.innerHTML='<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Pause',k.success("Quiz repris !",2e3))}function de(){ce();try{window.__QUIZ_ACTIVE=!1}catch{}document.getElementById("quiz-view")?.classList.add("view-hidden"),document.getElementById("dashboard-view")?.classList.remove("view-hidden"),document.querySelectorAll(".nav-link").forEach(e=>{e.classList.remove("bg-indigo-800","text-indigo-100"),e.classList.add("text-indigo-300")}),document.getElementById("nav-dashboard")?.classList.add("bg-indigo-800","text-indigo-100"),k.info("Retour au tableau de bord",2e3),setTimeout(()=>window.location.reload(),500)}const z=10,ot=["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];let v=ot.map(e=>({name:e,score:null}));const P={login:document.getElementById("login-view"),dashboard:document.getElementById("dashboard-view"),moduleSelection:document.getElementById("module-selection-view")},m={modulesGrid:document.getElementById("modules-grid"),annualProgressBar:document.getElementById("annual-progress-bar"),annualProgressText:document.getElementById("annual-progress-text"),moduleSelectionTitle:document.getElementById("module-selection-title"),welcomeMessage:document.getElementById("welcome-message"),userAvatar:document.getElementById("user-avatar"),userName:document.getElementById("user-name"),googleSigninBtn:document.getElementById("google-signin-btn"),signoutLink:document.getElementById("signout-link")};function h(e){Object.values(P).forEach(t=>{t&&t.classList.add("view-hidden")}),P[e]?P[e].classList.remove("view-hidden"):console.error("❌ Vue non trouvée:",e)}function M(e){document.querySelectorAll(".nav-link").forEach(o=>{o.classList.remove("bg-indigo-800","text-indigo-100"),o.classList.add("text-indigo-300")});const t=document.getElementById(e);t&&(t.classList.add("bg-indigo-800","text-indigo-100"),t.classList.remove("text-indigo-300"))}function nt(e){const o=108*Math.PI,n=o-e/100*o;let r="text-green-600";return e<80&&(r="text-yellow-500"),e<60&&(r="text-red-600"),`
        <svg class="w-32 h-32" viewBox="0 0 120 120">
            <circle class="text-gray-200" stroke-width="12" stroke="currentColor" fill="transparent" r="54" cx="60" cy="60" />
            <circle
                class="progress-circle ${r} transition-all duration-500"
                stroke-width="12"
                stroke-dasharray="${o}"
                stroke-dashoffset="${n}"
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
    `}function rt(e,t){return`
        <div class="card-hover bg-white p-5 rounded-xl shadow-lg border border-gray-200 flex flex-col items-center cursor-pointer">
            <h3 class="text-lg font-semibold text-slate-800 mb-3">${e}</h3>
            ${nt(t)}
            <span class="mt-3 text-sm font-medium text-slate-500">Score: ${t}%</span>
            <a href="#" class="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-800">Voir les détails</a>
        </div>
    `}function st(e){return`
        <div class="bg-slate-50 p-5 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center min-h-[260px] opacity-70">
            <svg class="h-12 w-12 text-slate-400 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            <h3 class="text-lg font-semibold text-slate-500">${e}</h3>
            <span class="mt-1 text-sm text-slate-400 text-center">Disponible le 1er du mois</span>
        </div>
    `}function it(e){return`
        <div class="card-hover bg-gradient-to-br from-slate-100 to-slate-200 p-5 rounded-xl shadow-md border border-slate-300 flex flex-col items-center justify-center min-h-[260px] cursor-pointer transition-all duration-300 hover:shadow-lg">
            <svg class="h-12 w-12 text-slate-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="text-lg font-semibold text-slate-700">${e}</h3>
            <span class="mt-2 text-sm text-slate-500 text-center">Pas encore complété</span>
            <div class="mt-3 w-full bg-slate-300 rounded-full h-2">
                <div class="bg-slate-400 h-2 rounded-full" style="width: 0%"></div>
            </div>
            <span class="mt-2 text-xs text-slate-400">0% complété</span>
        </div>
    `}function at(e){return`
        <div class="card-hover relative bg-white p-5 rounded-xl shadow-2xl border-2 border-indigo-500 flex flex-col items-center justify-center min-h-[260px] ring-4 ring-indigo-500/20 cursor-pointer">
            <span class="absolute top-2 right-2 bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">ACTIF</span>
            <svg class="h-12 w-12 text-indigo-600 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            <h3 class="text-xl font-bold text-slate-900">${e}</h3>
            <p class="text-slate-500 text-sm mb-4">Prêt à être complété</p>
            <button class="start-quiz-button w-full bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-all">
                Démarrer le quiz
            </button>
        </div>
    `}function lt(){let e=0;for(let t=z-1;t>=0&&(v[t].score!==null&&v[t].score>=60);t--)e++;return e}async function ct(){try{const e=F();if(!e){console.log("ℹ️ Aucun utilisateur - pas de données à charger");return}if(C()){console.log("ℹ️ Mode démo - affichage des données simulées");return}console.log("📊 Chargement des données du dashboard...");const t=await ze(e.uid);t&&await se(t);const o=await Ae(e.uid);v=v.map((s,i)=>{const a=`${s.name} ${new Date().getFullYear()}`;return o[a]?{name:s.name,score:o[a].score}:s});const n=await Ie(e.uid),r=document.getElementById("streak-count");r&&(r.textContent=n),console.log("✅ Données du dashboard chargées")}catch(e){console.error("❌ Erreur chargement données:",e)}}async function J(){if(!m.modulesGrid){console.error("❌ L'élément 'modules-grid' est introuvable.");return}await ct(),m.modulesGrid.innerHTML="";let e=0;v.forEach((s,i)=>{let a="";i<z?s.score!==null?(a=rt(s.name,s.score),e++):a=it(s.name):i===z?a=at(s.name):a=st(s.name),m.modulesGrid.innerHTML+=a});const t=e/12*100;m.annualProgressBar.style.width=`${t}%`,m.annualProgressText.textContent=`${e}/12`;const o=lt(),n=document.getElementById("streak-count");n&&(n.textContent=o);const r=document.getElementById("streak-badge");r&&o===0&&(r.style.display="none"),gt(),setTimeout(()=>{dt(),ut(),mt()},500)}function dt(){const e=document.getElementById("skills-radar-chart");e&&new Chart(e,{type:"radar",data:{labels:["Procédures","Garanties","Documentation","Inspection","Entretien","Réglementation"],datasets:[{label:"Vos Compétences",data:[92,88,85,90,87,94],backgroundColor:"rgba(99, 102, 241, 0.2)",borderColor:"rgb(99, 102, 241)",borderWidth:2,pointBackgroundColor:"rgb(99, 102, 241)",pointBorderColor:"#fff",pointHoverBackgroundColor:"#fff",pointHoverBorderColor:"rgb(99, 102, 241)"}]},options:{responsive:!0,maintainAspectRatio:!0,scales:{r:{beginAtZero:!0,max:100,ticks:{stepSize:20}}},plugins:{legend:{display:!1}}}})}function ut(){const e=document.getElementById("scores-trend-chart");if(!e)return;const t=v.filter((o,n)=>n<z);new Chart(e,{type:"line",data:{labels:t.map(o=>o.name),datasets:[{label:"Score (%)",data:t.map(o=>o.score),backgroundColor:"rgba(99, 102, 241, 0.1)",borderColor:"rgb(99, 102, 241)",borderWidth:3,fill:!0,tension:.4,pointRadius:5,pointHoverRadius:7,pointBackgroundColor:"rgb(99, 102, 241)",pointBorderColor:"#fff",pointBorderWidth:2}]},options:{responsive:!0,maintainAspectRatio:!0,scales:{y:{beginAtZero:!0,max:100,ticks:{callback:function(o){return o+"%"}}}},plugins:{legend:{display:!1},tooltip:{callbacks:{label:function(o){return"Score: "+o.parsed.y+"%"}}}}}})}function mt(){const e=document.getElementById("activity-heatmap");if(!e)return;const t=52,o=7;let n='<div class="flex gap-1">';for(let r=0;r<t;r++){n+='<div class="flex flex-col gap-1">';for(let s=0;s<o;s++){const i=r*o+s;let a=0;i%30<28&&(a=Math.floor(Math.random()*4)+1),n+=`<div class="w-3 h-3 rounded-sm ${["bg-slate-100","bg-green-200","bg-green-400","bg-green-600","bg-green-800"][a]}" title="Activité"></div>`}n+="</div>"}n+="</div>",e.innerHTML=n}function gt(){document.querySelectorAll(".start-quiz-button").forEach(e=>{e.addEventListener("click",t=>{t.preventDefault();const o=v[z].name;m.moduleSelectionTitle.textContent=`Quiz de ${o}`,h("moduleSelection")})}),document.querySelectorAll(".back-to-dashboard").forEach(e=>{e.addEventListener("click",t=>{t.preventDefault(),h("dashboard"),M("nav-dashboard")})}),document.querySelectorAll(".module-card").forEach(e=>{e.addEventListener("click",t=>{t.preventDefault();const o=e.getAttribute("data-module");console.log("🎯 Module sélectionné:",o),ie(o)})}),document.getElementById("nav-dashboard")?.addEventListener("click",e=>{e.preventDefault(),h("dashboard"),M("nav-dashboard")}),document.getElementById("nav-quiz")?.addEventListener("click",e=>{e.preventDefault();const t=v[z].name;m.moduleSelectionTitle.textContent=`Quiz de ${t}`,h("moduleSelection"),M("nav-quiz")}),document.getElementById("nav-results")?.addEventListener("click",e=>{const t=e.currentTarget;window.__QUIZ_ACTIVE?(e.preventDefault(),confirm("Un quiz est en cours. Voulez-vous vraiment quitter ?")&&t&&t.href&&(window.location.href=t.href)):console.log("Navigation vers Résultats...")}),document.getElementById("nav-resources")?.addEventListener("click",e=>{const t=e.currentTarget;window.__QUIZ_ACTIVE?(e.preventDefault(),confirm("Un quiz est en cours. Voulez-vous vraiment quitter ?")&&t&&t.href&&(window.location.href=t.href)):console.log("Navigation vers Ressources...")})}function W(e){if(e){m.userName.textContent=e.displayName||"Utilisateur",m.userAvatar.src=e.photoURL||"https://placehold.co/100x100/667eea/e0e7ff?text="+(e.displayName?.[0]||"U");const t=e.displayName?.split(" ")[0]||"Utilisateur";m.welcomeMessage.textContent=`Bonjour ${t}, prêt à relever votre défi de ${v[z].name} ?`}}function ht(){const e=localStorage.getItem("theme")||"light";document.documentElement.classList.toggle("dark",e==="dark"),ue(e)}function ue(e){const t=document.getElementById("theme-icon-sun"),o=document.getElementById("theme-icon-moon"),n=document.getElementById("theme-text");e==="dark"?(t?.classList.remove("hidden"),o?.classList.add("hidden"),n&&(n.textContent="Mode Clair")):(t?.classList.add("hidden"),o?.classList.remove("hidden"),n&&(n.textContent="Mode Sombre"))}function ft(){const t=(document.documentElement.classList.contains("dark")?"dark":"light")==="dark"?"light":"dark";document.documentElement.classList.toggle("dark"),localStorage.setItem("theme",t),ue(t)}document.addEventListener("DOMContentLoaded",()=>{if(console.log("🚀 Initialisation de QuizPro..."),ht(),document.getElementById("theme-toggle")?.addEventListener("click",ft),m.googleSigninBtn?.addEventListener("click",re),m.signoutLink?.addEventListener("click",t=>{t.preventDefault(),confirm("Voulez-vous vraiment vous déconnecter ?")&&(C()?(je(),h("login"),M("nav-dashboard")):Se())}),C()){console.log("🎨 MODE DÉMO ACTIF - Chargement du dashboard...");const t=F();if(t){W(t);try{se(t)}catch{}h("dashboard"),M("nav-dashboard"),J()}else console.error("❌ Mode démo actif mais pas d'utilisateur trouvé"),h("login")}else h("login"),$e(t=>{t?(console.log("✅ Utilisateur connecté:",t.displayName),W(t),h("dashboard"),M("nav-dashboard"),J()):(console.log("👤 Aucun utilisateur connecté"),h("login"))});console.log("✅ QuizPro initialisé avec succès")});
//# sourceMappingURL=index-BhgvxFRa.js.map
