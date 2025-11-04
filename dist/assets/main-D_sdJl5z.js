import{s as L,a as _,u as x,b as X,t as b,i as E,d as V,g as I,c as ee,e as te,f as oe,h as O,o as ne,j as re,k as se,l as ie}from"./auth-BBQLVo24.js";/* empty css               */import{query as P,collection as R,where as k,getDocs as H}from"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";import"https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";import"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";import"https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";console.log("Initialisation de la page d accueil...");document.addEventListener("DOMContentLoaded",ae);function ae(){console.log("📄 DOM chargé - configuration des boutons...");const e=document.getElementById("google-signin-btn");e?(e.addEventListener("click",le),console.log("✅ Bouton Google configuré")):console.warn("⚠️ Bouton Google non trouvé");const t=document.getElementById("demo-mode-btn");t?(t.addEventListener("click",de),console.log("✅ Bouton Mode Démo configuré")):console.warn("⚠️ Bouton Mode Démo non trouvé")}async function le(){console.log("🔐 Clic sur connexion Google...");const e=L("Connexion en cours...");try{const t=await _();x(e,`Bienvenue ${t.displayName} !`,"success"),setTimeout(()=>{window.location.reload()},800)}catch(t){console.error("❌ Erreur connexion Google:",t);let o="Erreur lors de la connexion";t.code==="auth/popup-closed-by-user"?o="Connexion annulée":t.code==="auth/popup-blocked"?o="Pop-up bloquée. Autorisez les pop-ups.":t.code==="auth/unauthorized-domain"?o="Domaine non autorisé dans Firebase":t.code==="auth/network-request-failed"&&(o="Erreur réseau. Vérifiez votre connexion."),x(e,o,"error")}}async function de(){console.log("🎭 Clic sur Mode Démo...");const e=L("Activation du mode démo...");try{const t=await X();console.log("✅ Mode démo activé:",t),x(e,"Mode démo activé ! Rechargement...","success"),setTimeout(()=>{window.location.reload()},500)}catch(t){console.error("❌ Erreur activation mode démo:",t),x(e,"error","Impossible d'activer le mode démo")}}function ce(){const e=document.createElement("canvas");e.style.position="fixed",e.style.top="0",e.style.left="0",e.style.width="100%",e.style.height="100%",e.style.pointerEvents="none",e.style.zIndex="9999",document.body.appendChild(e);const t=e.getContext("2d");e.width=window.innerWidth,e.height=window.innerHeight;const o=[],n=["#FF6B6B","#4ECDC4","#45B7D1","#FFA07A","#98D8C8","#F7DC6F","#BB8FCE","#85C1E2"];for(let i=0;i<150;i++)o.push({x:Math.random()*e.width,y:e.height+Math.random()*100,size:Math.random()*8+4,speedY:-(Math.random()*3+3),speedX:Math.random()*6-3,color:n[Math.floor(Math.random()*n.length)],rotation:Math.random()*360,rotationSpeed:Math.random()*10-5,gravity:.15,opacity:1});function s(){t.clearRect(0,0,e.width,e.height);let i=0;o.forEach((r,a)=>{r.speedY+=r.gravity,r.y+=r.speedY,r.x+=r.speedX,r.rotation+=r.rotationSpeed,r.y>e.height-100&&(r.opacity-=.02),r.opacity>0&&r.y<e.height+50&&(i++,t.save(),t.translate(r.x,r.y),t.rotate(r.rotation*Math.PI/180),t.globalAlpha=r.opacity,t.fillStyle=r.color,t.fillRect(-r.size/2,-r.size/2,r.size,r.size),t.restore())}),i>0?requestAnimationFrame(s):e.remove()}s()}const ue={auto:{name:"AT-AVE-AVEX",color:"indigo",label:"Auto"},loisir:{name:"VTT, Motoneige, etc.",color:"cyan",label:"Loisir"},vr:{name:"Véhicules Récréatifs",color:"orange",label:"VR"},tracteur:{name:"Équipement Agricole",color:"green",label:"Tracteur"}};let d=null,f=0,u=[],S=null,q=null,T=null,A=0,M=!1,z=0,D=null,C=null,B=null;const j={indigo:{bg:"bg-indigo-600",text:"text-indigo-600",border:"border-indigo-600"},cyan:{bg:"bg-cyan-600",text:"text-cyan-600",border:"border-cyan-600"},orange:{bg:"bg-orange-600",text:"text-orange-600",border:"border-orange-600"},green:{bg:"bg-green-600",text:"text-green-600",border:"border-green-600"}};async function me(e,t,o){console.log(`📥 Chargement des questions: module=${e}, mois=${t}, année=${o}`);const n=s=>{const i=s.data();return{id:s.id,question:i.question,options:i.options.map((r,a)=>({id:String.fromCharCode(65+a),text:r,correct:a===i.correctAnswer})),explanation:i.explanation||"Pas d'explication disponible",reference:i.reference||"",tags:i.tags||[]}};if(E()){console.log("📝 Mode démo : Chargement des questions simulées pour le quiz...");const i=localStorage.getItem("avantage-quizz-demo-questions");let r=[];if(i)try{const a=JSON.parse(i);console.log(`💾 ${a.length} questions chargées depuis localStorage`),r=a.map(l=>({id:l.id,question:l.question,options:l.options.map((v,c)=>({id:String.fromCharCode(65+c),text:v,correct:c===l.correctAnswer})),explanation:l.explanation||"Pas d'explication disponible",reference:l.reference||"",tags:l.tags||[]})),r=r.filter(l=>{const v=!e||a.find(g=>g.id===l.id)?.module===e,c=!t||a.find(g=>g.id===l.id)?.month===t;return v&&c})}catch{console.warn("⚠️ Erreur lecture localStorage, utilisation questions par défaut")}return r.length===0&&(console.log("📦 Utilisation questions par défaut (aucune en localStorage)"),r=[{id:"demo-1",question:"Quelle est la vitesse maximale autorisée sur une autoroute au Québec ?",options:[{id:"A",text:"100 km/h",correct:!1},{id:"B",text:"110 km/h",correct:!1},{id:"C",text:"120 km/h",correct:!1},{id:"D",text:"100 km/h (conditions normales)",correct:!0}],explanation:"La vitesse maximale sur autoroute au Québec est de 100 km/h, sauf indication contraire.",reference:"Code de la sécurité routière du Québec",tags:["vitesse","autoroute"]},{id:"demo-2",question:"À quelle distance minimale devez-vous vous arrêter derrière un autobus scolaire dont les feux clignotent ?",options:[{id:"A",text:"3 mètres",correct:!1},{id:"B",text:"5 mètres",correct:!0},{id:"C",text:"10 mètres",correct:!1},{id:"D",text:"15 mètres",correct:!1}],explanation:"Vous devez vous arrêter à au moins 5 mètres d'un autobus scolaire.",reference:"Article 460 CSR",tags:["autobus","sécurité"]},{id:"demo-3",question:"Quel est le taux d'alcoolémie maximal pour conduire au Québec ?",options:[{id:"A",text:"0.05",correct:!1},{id:"B",text:"0.08",correct:!0},{id:"C",text:"0.10",correct:!1},{id:"D",text:"0.00",correct:!1}],explanation:"Le taux maximal est de 0.08 pour conducteurs expérimentés.",reference:"Code criminel du Canada",tags:["alcool","sécurité"]},{id:"demo-4",question:"Combien de points d'inaptitude entraîne un excès de vitesse de 30 km/h ?",options:[{id:"A",text:"2 points",correct:!1},{id:"B",text:"3 points",correct:!0},{id:"C",text:"4 points",correct:!1},{id:"D",text:"5 points",correct:!1}],explanation:"Un excès de 21 à 30 km/h entraîne 3 points.",reference:"SAAQ",tags:["vitesse","points"]},{id:"demo-5",question:"Quelle est la distance de sécurité recommandée entre véhicules ?",options:[{id:"A",text:"1 seconde",correct:!1},{id:"B",text:"2 secondes",correct:!0},{id:"C",text:"3 secondes",correct:!1},{id:"D",text:"5 secondes",correct:!1}],explanation:"La règle des 2 secondes est recommandée.",reference:"Guide SAAQ",tags:["distance","sécurité"]}]),console.log(`✅ ${r.length} questions démo chargées pour le quiz`),r}try{let s=P(R(V,"questions"),k("module","==",e),k("month","==",t),k("year","==",o)),i=await H(s);if(!i.empty){const c=[];return i.forEach(g=>c.push(n(g))),console.log(`✅ ${c.length} questions (mois numérique)`),c}const a=["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"][t-1],l=a.charAt(0).toUpperCase()+a.slice(1).toLowerCase();let v=P(R(V,"questions"),k("module","==",e),k("month","==",l),k("year","==",o));if(i=await H(v),!i.empty){const c=[];return i.forEach(g=>c.push(n(g))),console.log(`✅ ${c.length} questions (mois texte)`),c}return console.warn("⚠️ Aucune question trouvée pour ces critères (numérique/texte)"),[]}catch(s){throw console.error("❌ Erreur lors du chargement des questions:",s),s}}async function ge(e,t,o){try{const n=await fetch("/test-questions-valides.json");if(!n.ok)return[];const s=await n.json(),r=["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"][t-1];return s.filter(l=>l.module===e&&l.year===o&&(l.month===r||l.month===t)).map((l,v)=>({id:`demo-${e}-${v}`,question:l.question,options:l.options.map((c,g)=>({id:String.fromCharCode(65+g),text:c,correct:g===l.correctAnswer})),explanation:l.explanation||"Pas d'explication disponible",reference:l.reference||"",tags:l.tags||[]}))}catch(n){return console.warn("Demo questions fallback error:",n),[]}}async function G(e){const t=ue[e];if(!t){console.error("Module de quiz non trouvé:",e),b.error("Module non trouvé. Veuillez réessayer.");return}const o=L(`Chargement du quiz ${t.label}...`);he(t.label);try{const n=new Date,s=["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"],i=n.getMonth()+1;C=s[i-1],B=n.getFullYear(),D=e;try{window.__QUIZ_ACTIVE=!0}catch{}let r=await me(e,i,B);if(r.length===0&&E()&&(console.log("ℹ️ Mode Démo: chargement des questions locales de test"),r=await ge(e,i,B)),r.length===0){x(o,"Aucune question disponible","error"),b.error(`Aucune question trouvée pour ${t.label} en ${C} ${B}.

Contactez l'administrateur.`,5e3);return}d={name:`Quiz ${t.label} - ${C.charAt(0).toUpperCase()+C.slice(1)}`,module:t.name,color:t.color,questions:r},f=0,u=[],S=Date.now(),T=Date.now(),A=0,pe(),Z(),ke(),Q(),x(o,`${r.length} questions chargées !`,"success")}catch(n){console.error("❌ Erreur lors du démarrage du quiz:",n),x(o,"Erreur de chargement","error"),b.error("Erreur lors du chargement du quiz. Veuillez réessayer.",4e3)}}function he(e){const t=Y();t.innerHTML=`
        <div class="min-h-screen flex items-center justify-center">
            <div class="text-center">
                <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-6"></div>
                <h2 class="text-2xl font-bold text-slate-900 mb-2">Chargement du quiz ${e}</h2>
                <p class="text-slate-600">Récupération des questions...</p>
            </div>
        </div>
    `,t.classList.remove("view-hidden")}function pe(){document.getElementById("dashboard-view")?.classList.add("view-hidden"),document.getElementById("module-selection-view")?.classList.add("view-hidden"),document.getElementById("login-view")?.classList.add("view-hidden"),Y().classList.remove("view-hidden")}function Y(){let e=document.getElementById("quiz-view");return e||(e=document.createElement("div"),e.id="quiz-view",document.querySelector("main").appendChild(e)),e}function Z(){const e=d.questions[f],t=document.getElementById("quiz-view"),o=j[d.color];t.innerHTML=`
        <!-- En-tête du quiz -->
        <div class="bg-white border-b border-gray-200 shadow-sm">
            <div class="max-w-5xl mx-auto px-6 py-4">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-xl font-bold text-slate-900">${d.name}</h1>
                        <p class="text-sm text-slate-500">Question ${f+1} sur ${d.questions.length}</p>
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
                    <div class="${o.bg} h-2 rounded-full transition-all duration-300" style="width: ${(f+1)/d.questions.length*100}%"></div>
                </div>
            </div>
        </div>

        <!-- Contenu de la question -->
        <div class="max-w-5xl mx-auto px-6 py-8">
            <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                
                <!-- En-tête de question -->
                <div class="px-8 py-6 bg-gradient-to-r from-slate-50 to-white border-b border-gray-100">
                    <div class="mb-4">
                        <span class="text-sm font-medium ${o.text}">Question ${f+1} sur ${d.questions.length}</span>
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
                                    class="option-button w-full text-left px-6 py-5 rounded-xl border-2 border-gray-200 hover:border-${d.color}-400 hover:bg-${d.color}-50 transition-all duration-200 group">
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
    `,fe(),Q()}function fe(){document.querySelectorAll(".option-button").forEach(e=>{e.addEventListener("click",()=>ve(e.dataset.optionId))}),document.getElementById("next-question-btn")?.addEventListener("click",be),document.getElementById("quit-quiz-btn")?.addEventListener("click",()=>{confirm("Voulez-vous vraiment quitter le quiz ? Votre progression sera perdue.")&&J()}),document.getElementById("focus-mode-btn")?.addEventListener("click",Ee),document.getElementById("pause-btn")?.addEventListener("click",Ce)}function ve(e){const t=d.questions[f],o=t.options.find(s=>s.id===e),n=Math.floor((Date.now()-T)/1e3);u.push({questionId:t.id,question:t.question,selectedAnswer:e,correctAnswer:t.options.find(s=>s.correct).id,isCorrect:o.correct,timeSpent:n}),o.correct?A++:A=0,document.querySelectorAll(".option-button").forEach(s=>{s.disabled=!0,s.classList.remove("hover:border-indigo-400","hover:bg-indigo-50")}),xe(e,o.correct,t),Q(),setTimeout(()=>{document.getElementById("next-button-area")?.classList.remove("hidden")},1e3)}function xe(e,t,o){j[d.color];const n=o.options.find(i=>i.correct);document.querySelectorAll(".option-button").forEach(i=>{const r=i.dataset.optionId;r===n.id?(i.classList.add("border-green-500","bg-green-50"),i.classList.remove("border-gray-200")):r===e&&!t&&(i.classList.add("border-red-500","bg-red-50"),i.classList.remove("border-gray-200"))});const s=document.getElementById("explanation-area");s&&(s.innerHTML=`
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
        `,s.classList.remove("hidden"))}function be(){T=Date.now(),f++,f<d.questions.length?Z():we()}function we(){W();try{window.__QUIZ_ACTIVE=!1}catch{}const e=Math.round(u.filter(r=>r.isCorrect).length/u.length*100),t=Math.floor((Date.now()-S)/1e3),o=Math.floor(t/60),n=t%60;ye(e,t);const s=j[d.color],i=document.getElementById("quiz-view");i.innerHTML=`
        <div class="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-12 px-4">
            <div class="max-w-4xl mx-auto">
                <!-- Carte de résultat principale -->
                <div class="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
                    <!-- Header avec score -->
                    <div class="bg-gradient-to-r from-${d.color}-500 to-${d.color}-700 px-8 py-12 text-center text-white">
                        <h1 class="text-4xl font-bold mb-4">Quiz Terminé ! 🎉</h1>
                        <div class="text-8xl font-bold mb-4">${e}%</div>
                        <p class="text-xl opacity-90">${u.filter(r=>r.isCorrect).length} / ${u.length} bonnes réponses</p>
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
                            ${u.map((r,a)=>`
                                <div class="flex items-center justify-between p-4 rounded-lg ${r.isCorrect?"bg-green-50":"bg-red-50"}">
                                    <div class="flex items-center gap-3 flex-1">
                                        <span class="${r.isCorrect?"text-green-600":"text-red-600"} text-2xl">
                                            ${r.isCorrect?"✅":"❌"}
                                        </span>
                                        <div class="flex-1">
                                            <p class="font-medium text-slate-900">Question ${a+1}</p>
                                            <p class="text-sm text-slate-600">${r.question}</p>
                                            ${r.isCorrect?"":`<p class="text-xs text-slate-500 mt-1">Votre réponse : ${r.selectedAnswer} | Correcte : ${r.correctAnswer}</p>`}
                                        </div>
                                    </div>
                                    <span class="text-sm text-slate-500">${r.timeSpent}s</span>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                    
                    <!-- Boutons d'action -->
                    <div class="px-8 py-6 flex gap-4">
                        <button id="retry-quiz-btn" class="flex-1 ${s.bg} text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all">
                            Refaire le quiz
                        </button>
                        <button id="return-dashboard-btn" class="flex-1 border-2 border-gray-300 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-all">
                            Retour au tableau de bord
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `,e>=80&&setTimeout(()=>ce(),500),document.getElementById("retry-quiz-btn")?.addEventListener("click",()=>{G(D)}),document.getElementById("return-dashboard-btn")?.addEventListener("click",J)}async function ye(e,t){try{const o=I();if(!o){console.log("Aucun utilisateur - résultat non sauvegardé");return}if(E()){console.log("Mode démo - résultat non sauvegardé dans Firestore"),b.info("Mode Démo : les résultats ne sont pas sauvegardés");return}await ee(o.uid,{module:D,month:C,year:B,score:e,totalQuestions:d.questions.length,correctAnswers:u.filter(n=>n.isCorrect).length,timeSpent:t,answers:u,completedAt:new Date}),console.log("✅ Résultat sauvegardé dans Firestore")}catch(o){console.error("❌ Erreur lors de la sauvegarde:",o)}}function ke(){q=setInterval(()=>{if(!M){const e=Math.floor((Date.now()-S-z)/1e3),t=Math.floor(e/60),o=e%60,n=document.getElementById("quiz-timer");n&&(n.textContent=`${t}:${o.toString().padStart(2,"0")}`)}},1e3)}function W(){q&&(clearInterval(q),q=null)}function Q(){if(u.length===0)return;const e=Math.round(u.filter(o=>o.isCorrect).length/u.length*100),t=document.getElementById("quiz-score");t&&(t.textContent=`Score: ${e}%`)}function Ee(){document.body.classList.toggle("focus-mode")}function Ce(){M=!M;const e=document.getElementById("pause-btn");M?(z+=Date.now(),e.innerHTML='<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Reprendre',b.warning('Quiz en pause. Cliquez sur "Reprendre" pour continuer.',3e3)):(z=Date.now()-z,e.innerHTML='<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Pause',b.success("Quiz repris !",2e3))}function J(){W();try{window.__QUIZ_ACTIVE=!1}catch{}document.getElementById("quiz-view")?.classList.add("view-hidden"),document.getElementById("dashboard-view")?.classList.remove("view-hidden"),document.querySelectorAll(".nav-link").forEach(e=>{e.classList.remove("bg-indigo-800","text-indigo-100"),e.classList.add("text-indigo-300")}),document.getElementById("nav-dashboard")?.classList.add("bg-indigo-800","text-indigo-100"),b.info("Retour au tableau de bord",2e3),setTimeout(()=>window.location.reload(),500)}const y=10,Be=["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];let p=Be.map(e=>({name:e,score:null}));const $={login:document.getElementById("login-view"),dashboard:document.getElementById("dashboard-view"),moduleSelection:document.getElementById("module-selection-view")},m={modulesGrid:document.getElementById("modules-grid"),annualProgressBar:document.getElementById("annual-progress-bar"),annualProgressText:document.getElementById("annual-progress-text"),moduleSelectionTitle:document.getElementById("module-selection-title"),welcomeMessage:document.getElementById("welcome-message"),userAvatar:document.getElementById("user-avatar"),userName:document.getElementById("user-name"),googleSigninBtn:document.getElementById("google-signin-btn"),signoutLink:document.getElementById("signout-link")};function h(e){Object.values($).forEach(t=>{t&&t.classList.add("view-hidden")}),$[e]?$[e].classList.remove("view-hidden"):console.error("❌ Vue non trouvée:",e)}function w(e){document.querySelectorAll(".nav-link").forEach(o=>{o.classList.remove("bg-indigo-800","text-indigo-100"),o.classList.add("text-indigo-300")});const t=document.getElementById(e);t&&(t.classList.add("bg-indigo-800","text-indigo-100"),t.classList.remove("text-indigo-300"))}function qe(e){const o=108*Math.PI,n=o-e/100*o;let s="text-green-600";return e<80&&(s="text-yellow-500"),e<60&&(s="text-red-600"),`
        <svg class="w-32 h-32" viewBox="0 0 120 120">
            <circle class="text-gray-200" stroke-width="12" stroke="currentColor" fill="transparent" r="54" cx="60" cy="60" />
            <circle
                class="progress-circle ${s} transition-all duration-500"
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
    `}function Me(e,t){const n=(s=>s>=90?{bg:"from-indigo-600 via-indigo-700 to-indigo-800",badge:"bg-emerald-500",badgeText:"Excellent"}:s>=75?{bg:"from-indigo-500 via-indigo-600 to-indigo-700",badge:"bg-blue-500",badgeText:"Très bien"}:s>=60?{bg:"from-indigo-400 via-indigo-500 to-indigo-600",badge:"bg-indigo-400",badgeText:"Bien"}:{bg:"from-slate-400 via-slate-500 to-slate-600",badge:"bg-slate-400",badgeText:"Passable"})(t);return`
        <div class="card-hover relative bg-gradient-to-br ${n.bg} p-6 rounded-2xl shadow-lg hover:shadow-xl border border-white/20 flex flex-col items-center cursor-pointer transform transition-all duration-300 hover:scale-[1.02] group">
            <div class="absolute top-3 right-3 ${n.badge} text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md">
                ${n.badgeText}
            </div>
            <div class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-full">
                <svg class="h-4 w-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-4 drop-shadow-md">${e}</h3>
            ${qe(t)}
            <span class="mt-4 text-sm font-semibold text-white/95 bg-white/15 px-3 py-1.5 rounded-full backdrop-blur-sm">Score: ${t}%</span>
            <a href="#" class="mt-3 text-sm font-medium text-white/90 hover:text-white underline decoration-2 underline-offset-2 opacity-0 group-hover:opacity-100 transition-opacity">Voir détails →</a>
        </div>
    `}function ze(e){return`
        <div class="relative bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 p-6 rounded-2xl border border-slate-300 flex flex-col items-center justify-center min-h-[260px] shadow-sm overflow-hidden">
            <!-- Motif subtil -->
            <div class="absolute inset-0 opacity-[0.03]" style="background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,.1) 10px, rgba(0,0,0,.1) 20px);"></div>
            
            <!-- Badge verrouillé discret -->
            <div class="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold shadow-sm">
                🔒 Verrouillé
            </div>
            
            <!-- Cadenas minimaliste -->
            <div class="relative mb-4">
                <div class="relative bg-white p-3.5 rounded-xl shadow-md border-2 border-red-100">
                    <svg class="h-8 w-8 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
            </div>
            
            <h3 class="text-xl font-bold text-slate-700 mb-2">${e}</h3>
            <div class="flex items-center gap-2 text-sm text-slate-500 bg-white px-3 py-1.5 rounded-lg">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span class="font-medium">Disponible le 1er du mois</span>
            </div>
        </div>
    `}function $e(e){return`
        <div class="card-hover relative bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl shadow-sm hover:shadow-md border border-amber-200 flex flex-col items-center justify-center min-h-[260px] cursor-pointer transform transition-all duration-300 hover:scale-[1.02] group overflow-hidden">
            <!-- Badge à compléter -->
            <div class="absolute top-3 right-3 bg-amber-500 text-white px-2 py-1 rounded-md text-xs font-semibold shadow-sm">
                À compléter
            </div>
            
            <!-- Icône horloge -->
            <div class="relative mb-4">
                <div class="relative bg-white p-3.5 rounded-xl shadow-md border-2 border-amber-100">
                    <svg class="h-8 w-8 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            </div>
            
            <h3 class="text-xl font-bold text-slate-700 mb-2">${e}</h3>
            <span class="text-sm text-amber-600 text-center font-medium mb-3">Mois manqué - Rattrapez-le !</span>
            
            <!-- Barre de progression -->
            <div class="mt-3 w-full bg-amber-100 rounded-full h-2.5 overflow-hidden">
                <div class="bg-gradient-to-r from-amber-400 to-amber-500 h-2.5 rounded-full" style="width: 0%"></div>
            </div>
            <span class="mt-2 text-xs text-amber-600 font-medium">0% complété</span>
            
            <!-- Bouton au hover -->
            <button class="mt-4 opacity-0 group-hover:opacity-100 transition-all bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                Compléter maintenant
            </button>
        </div>
    `}function Ae(e){return`
        <div class="card-hover relative bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 p-6 rounded-2xl shadow-xl hover:shadow-2xl border border-indigo-400/30 flex flex-col items-center justify-center min-h-[260px] ring-2 ring-indigo-400/20 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] group overflow-hidden">
            <!-- Effet de brillance subtil -->
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <!-- Badge ACTIF -->
            <span class="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-md">
                ⚡ Actif
            </span>
            
            <!-- Icône stylo -->
            <div class="relative mb-4">
                <div class="relative bg-white/15 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white/20">
                    <svg class="h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </div>
            </div>
            
            <h3 class="text-2xl font-bold text-white mb-2 drop-shadow-md">${e}</h3>
            <p class="text-white/90 text-sm font-medium mb-4 bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm">🎯 Prêt à être complété</p>
            
            <!-- Bouton CTA -->
            <button class="start-quiz-button w-full bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 group/btn">
                <span class="flex items-center justify-center gap-2">
                    Démarrer le quiz
                    <svg class="h-5 w-5 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </span>
            </button>
        </div>
    `}function Le(){let e=0;for(let t=y-1;t>=0&&(p[t].score!==null&&p[t].score>=60);t--)e++;return e}async function Ie(){try{const e=I();if(!e){console.log("ℹ️ Aucun utilisateur - pas de données à charger");return}if(E()){console.log("ℹ️ Mode démo - affichage des données simulées");return}console.log("📊 Chargement des données du dashboard...");const t=await re(e.uid);t&&await O(t);const o=await se(e.uid);p=p.map((i,r)=>{const a=`${i.name} ${new Date().getFullYear()}`;return o[a]?{name:i.name,score:o[a].score}:i});const n=await ie(e.uid),s=document.getElementById("streak-count");s&&(s.textContent=n),console.log("✅ Données du dashboard chargées")}catch(e){console.error("❌ Erreur chargement données:",e)}}async function U(){if(!m.modulesGrid){console.error("❌ L'élément 'modules-grid' est introuvable.");return}await Ie(),m.modulesGrid.innerHTML="";let e=0;p.forEach((i,r)=>{let a="";r<y?i.score!==null?(a=Me(i.name,i.score),e++):a=$e(i.name):r===y?a=Ae(i.name):a=ze(i.name),m.modulesGrid.innerHTML+=a});const t=e/12*100;m.annualProgressBar.style.width=`${t}%`,m.annualProgressText.textContent=`${e}/12`;const o=Le(),n=document.getElementById("streak-count");n&&(n.textContent=o);const s=document.getElementById("streak-badge");s&&o===0&&(s.style.display="none"),Qe(),setTimeout(()=>{Se(),Te(),De()},500)}function Se(){const e=document.getElementById("skills-radar-chart");e&&new Chart(e,{type:"radar",data:{labels:["Procédures","Garanties","Documentation","Inspection","Entretien","Réglementation"],datasets:[{label:"Vos Compétences",data:[92,88,85,90,87,94],backgroundColor:"rgba(99, 102, 241, 0.2)",borderColor:"rgb(99, 102, 241)",borderWidth:2,pointBackgroundColor:"rgb(99, 102, 241)",pointBorderColor:"#fff",pointHoverBackgroundColor:"#fff",pointHoverBorderColor:"rgb(99, 102, 241)"}]},options:{responsive:!0,maintainAspectRatio:!0,scales:{r:{beginAtZero:!0,max:100,ticks:{stepSize:20}}},plugins:{legend:{display:!1}}}})}function Te(){const e=document.getElementById("scores-trend-chart");if(!e)return;const t=p.filter((o,n)=>n<y);new Chart(e,{type:"line",data:{labels:t.map(o=>o.name),datasets:[{label:"Score (%)",data:t.map(o=>o.score),backgroundColor:"rgba(99, 102, 241, 0.1)",borderColor:"rgb(99, 102, 241)",borderWidth:3,fill:!0,tension:.4,pointRadius:5,pointHoverRadius:7,pointBackgroundColor:"rgb(99, 102, 241)",pointBorderColor:"#fff",pointBorderWidth:2}]},options:{responsive:!0,maintainAspectRatio:!0,scales:{y:{beginAtZero:!0,max:100,ticks:{callback:function(o){return o+"%"}}}},plugins:{legend:{display:!1},tooltip:{callbacks:{label:function(o){return"Score: "+o.parsed.y+"%"}}}}}})}function De(){const e=document.getElementById("activity-heatmap");if(!e)return;const t=52,o=7;let n='<div class="flex gap-1">';for(let s=0;s<t;s++){n+='<div class="flex flex-col gap-1">';for(let i=0;i<o;i++){const r=s*o+i;let a=0;r%30<28&&(a=Math.floor(Math.random()*4)+1),n+=`<div class="w-3 h-3 rounded-sm ${["bg-slate-100","bg-green-200","bg-green-400","bg-green-600","bg-green-800"][a]}" title="Activité"></div>`}n+="</div>"}n+="</div>",e.innerHTML=n}let F=!1;function je(){F||(F=!0,console.log("🔧 Attachement des listeners de navigation (une seule fois)..."),document.getElementById("nav-dashboard")?.addEventListener("click",e=>{e.preventDefault(),h("dashboard"),w("nav-dashboard")}),document.getElementById("nav-quiz")?.addEventListener("click",e=>{e.preventDefault();const t=p[y].name;m.moduleSelectionTitle.textContent=`Quiz de ${t}`,h("moduleSelection"),w("nav-quiz")}),document.getElementById("nav-results")?.addEventListener("click",e=>{e.preventDefault();const t=e.currentTarget;window.__QUIZ_ACTIVE?confirm("Un quiz est en cours. Voulez-vous vraiment quitter ?")&&t&&t.href&&(window.location.href=t.href):t&&t.href&&(window.location.href=t.href)}),document.getElementById("nav-resources")?.addEventListener("click",e=>{e.preventDefault();const t=e.currentTarget;window.__QUIZ_ACTIVE?confirm("Un quiz est en cours. Voulez-vous vraiment quitter ?")&&t&&t.href&&(window.location.href=t.href):t&&t.href&&(window.location.href=t.href)}),console.log("✅ Listeners de navigation attachés"))}function Qe(){document.querySelectorAll(".start-quiz-button").forEach(n=>{const s=n.cloneNode(!0);n.parentNode?.replaceChild(s,n)}),document.querySelectorAll(".start-quiz-button").forEach(n=>{n.addEventListener("click",s=>{s.preventDefault();const i=p[y].name;m.moduleSelectionTitle.textContent=`Quiz de ${i}`,h("moduleSelection"),w("nav-quiz")})}),document.querySelectorAll(".back-to-dashboard").forEach(n=>{const s=n.cloneNode(!0);n.parentNode?.replaceChild(s,n)}),document.querySelectorAll(".back-to-dashboard").forEach(n=>{n.addEventListener("click",s=>{s.preventDefault(),h("dashboard"),w("nav-dashboard")})}),document.querySelectorAll(".module-card").forEach(n=>{const s=n.cloneNode(!0);n.parentNode?.replaceChild(s,n)}),document.querySelectorAll(".module-card").forEach(n=>{n.addEventListener("click",s=>{s.preventDefault();const i=n.getAttribute("data-module");console.log("🎯 Module sélectionné:",i),G(i)})})}function N(e){if(e){m.userName.textContent=e.displayName||"Utilisateur",m.userAvatar.src=e.photoURL||"https://placehold.co/100x100/667eea/e0e7ff?text="+(e.displayName?.[0]||"U");const t=e.displayName?.split(" ")[0]||"Utilisateur";m.welcomeMessage.textContent=`Bonjour ${t}, prêt à relever votre défi de ${p[y].name} ?`}}function Ve(){const e=localStorage.getItem("theme")||"light";document.documentElement.classList.toggle("dark",e==="dark"),K(e)}function K(e){const t=document.getElementById("theme-icon-sun"),o=document.getElementById("theme-icon-moon"),n=document.getElementById("theme-text");e==="dark"?(t?.classList.remove("hidden"),o?.classList.add("hidden"),n&&(n.textContent="Mode Clair")):(t?.classList.add("hidden"),o?.classList.remove("hidden"),n&&(n.textContent="Mode Sombre"))}function Pe(){const t=(document.documentElement.classList.contains("dark")?"dark":"light")==="dark"?"light":"dark";document.documentElement.classList.toggle("dark"),localStorage.setItem("theme",t),K(t)}document.addEventListener("DOMContentLoaded",()=>{if(console.log("🚀 Initialisation de QuizPro..."),Ve(),je(),document.getElementById("theme-toggle")?.addEventListener("click",Pe),m.googleSigninBtn?.addEventListener("click",_),m.signoutLink?.addEventListener("click",t=>{t.preventDefault(),confirm("Voulez-vous vraiment vous déconnecter ?")&&(E()?(te(),h("login"),w("nav-dashboard")):oe())}),E()){console.log("🎨 MODE DÉMO ACTIF - Chargement du dashboard...");const t=I();if(t){N(t);try{O(t)}catch{}h("dashboard"),w("nav-dashboard"),U()}else console.error("❌ Mode démo actif mais pas d'utilisateur trouvé"),h("login")}else h("login"),ne(t=>{t?(console.log("✅ Utilisateur connecté:",t.displayName),N(t),h("dashboard"),w("nav-dashboard"),U()):(console.log("👤 Aucun utilisateur connecté"),h("login"))});console.log("✅ QuizPro initialisé avec succès")});
//# sourceMappingURL=main-D_sdJl5z.js.map
