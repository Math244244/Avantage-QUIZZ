const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/firestore-service-DZ_z0Auw.js","assets/auth-NyiblVhF.js","assets/auth-BFjCaGVY.css","assets/quiz-service-B8667vFA.js","assets/question-service-9kU7A2uR.js"])))=>i.map(i=>d[i]);
import{B as w,C as ge,r as he,g as ve,e as ne,x as f,h as fe,w as p,f as be,A as m,_ as W,o as R,p as I,z as we}from"./auth-NyiblVhF.js";import{s as U,e as xe,f as ye,a as Ee,d as O,g as Z}from"./skeleton-BmdGa2iR.js";import{query as B,collection as q,where as z,limit as J,getDocs as N,Timestamp as Se,orderBy as ie}from"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";import{g as Ae,a as Le,c as ke,d as Te,i as Ce}from"./question-service-9kU7A2uR.js";import{s as x}from"./state-manager-w7-wWzCS.js";import"https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";import"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";import"https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";class Me{constructor(){this.activeTooltip=null,this.hoverDelay=300,this.hideDelay=100,this.hoverTimer=null,this.hideTimer=null,this.isTouchDevice="ontouchstart"in window,this.init()}init(){console.log("🎯 Initialisation du système de tooltips"),this.createTooltipContainer(),this.initializeTooltips(),this.observeDOM(),console.log("✅ Système de tooltips initialisé")}createTooltipContainer(){let e=document.getElementById("tooltip-container");e||(e=document.createElement("div"),e.id="tooltip-container",e.className="fixed pointer-events-none z-[9999]",document.body.appendChild(e)),this.container=e}initializeTooltips(){const e=document.querySelectorAll("[data-tooltip]");e.forEach(s=>this.attachTooltip(s)),console.log(`📌 ${e.length} tooltips initialisés`)}observeDOM(){new MutationObserver(s=>{s.forEach(o=>{o.addedNodes.forEach(a=>{a.nodeType===1&&(a.hasAttribute&&a.hasAttribute("data-tooltip")&&this.attachTooltip(a),a.querySelectorAll&&a.querySelectorAll("[data-tooltip]").forEach(r=>{this.attachTooltip(r)}))})})}).observe(document.body,{childList:!0,subtree:!0})}attachTooltip(e){e.dataset.tooltipAttached||(e.dataset.tooltipAttached="true",!this.isTouchDevice&&(e.addEventListener("mouseenter",s=>this.handleMouseEnter(s,e)),e.addEventListener("mouseleave",s=>this.handleMouseLeave(s)),e.addEventListener("focus",s=>this.handleFocus(s,e)),e.addEventListener("blur",s=>this.handleBlur(s)),e.setAttribute("aria-describedby",`tooltip-${this.generateId()}`)))}generateId(){return Math.random().toString(36).substring(2,11)}handleMouseEnter(e,s){clearTimeout(this.hideTimer),this.hoverTimer=setTimeout(()=>{this.showTooltip(s)},this.hoverDelay)}handleMouseLeave(e){clearTimeout(this.hoverTimer),this.hideTimer=setTimeout(()=>{this.hideTooltip()},this.hideDelay)}handleFocus(e,s){this.showTooltip(s)}handleBlur(e){this.hideTooltip()}showTooltip(e){const s=e.dataset.tooltip,o=e.dataset.tooltipPosition||"top",a=e.dataset.tooltipTheme||"dark",r=e.dataset.tooltipSize||"medium";if(!s)return;this.hideTooltip();const n=this.createTooltipElement(s,a,r);this.container.appendChild(n),this.activeTooltip=n,this.positionTooltip(n,e,o),setTimeout(()=>{n.classList.remove("opacity-0","scale-95"),n.classList.add("opacity-100","scale-100")},10)}createTooltipElement(e,s,o){const a=document.createElement("div");return a.className=`tooltip absolute opacity-0 scale-95 transform transition-all duration-200 ease-out ${this.getThemeClasses(s)} ${this.getSizeClasses(o)}`,a.innerHTML=`
            <div class="tooltip-content relative">
                ${e}
                <div class="tooltip-arrow absolute w-2 h-2 transform rotate-45 ${this.getArrowClasses(s)}"></div>
            </div>
        `,a}getThemeClasses(e){const s={dark:"bg-slate-900 text-white shadow-lg",light:"bg-white text-slate-900 shadow-lg border border-slate-200",success:"bg-green-600 text-white shadow-lg",error:"bg-red-600 text-white shadow-lg",warning:"bg-orange-600 text-white shadow-lg",info:"bg-blue-600 text-white shadow-lg"};return s[e]||s.dark}getSizeClasses(e){const s={small:"text-xs px-2 py-1 rounded",medium:"text-sm px-3 py-2 rounded-md",large:"text-base px-4 py-3 rounded-lg"};return s[e]||s.medium}getArrowClasses(e){const s={dark:"bg-slate-900",light:"bg-white border-l border-b border-slate-200",success:"bg-green-600",error:"bg-red-600",warning:"bg-orange-600",info:"bg-blue-600"};return s[e]||s.dark}positionTooltip(e,s,o){const a=s.getBoundingClientRect(),r=e.getBoundingClientRect(),n=e.querySelector(".tooltip-arrow"),i=8,d=8,c={top:{top:a.top-r.height-i,left:a.left+a.width/2-r.width/2,arrowTop:r.height-d/2,arrowLeft:r.width/2-d/2,arrowRotate:"rotate(45deg)"},bottom:{top:a.bottom+i,left:a.left+a.width/2-r.width/2,arrowTop:-d/2,arrowLeft:r.width/2-d/2,arrowRotate:"rotate(225deg)"},left:{top:a.top+a.height/2-r.height/2,left:a.left-r.width-i,arrowTop:r.height/2-d/2,arrowLeft:r.width-d/2,arrowRotate:"rotate(135deg)"},right:{top:a.top+a.height/2-r.height/2,left:a.right+i,arrowTop:r.height/2-d/2,arrowLeft:-d/2,arrowRotate:"rotate(315deg)"}};let u=o;const l=c[o];if(l&&(l.top<0||l.top+r.height>window.innerHeight||l.left<0||l.left+r.width>window.innerWidth)){const k=["top","bottom","left","right"];for(const T of k){const C=c[T];if(!(C.top<0||C.top+r.height>window.innerHeight||C.left<0||C.left+r.width>window.innerWidth)){u=T;break}}}const g=c[u]||c.top;e.style.top=`${g.top}px`,e.style.left=`${g.left}px`,n&&(n.style.top=`${g.arrowTop}px`,n.style.left=`${g.arrowLeft}px`,n.style.transform=g.arrowRotate)}hideTooltip(){this.activeTooltip&&(this.activeTooltip.classList.remove("opacity-100","scale-100"),this.activeTooltip.classList.add("opacity-0","scale-95"),setTimeout(()=>{this.activeTooltip&&this.activeTooltip.parentNode&&this.activeTooltip.parentNode.removeChild(this.activeTooltip),this.activeTooltip=null},200))}add(e,s,o={}){e.dataset.tooltip=s,e.dataset.tooltipPosition=o.position||"top",e.dataset.tooltipTheme=o.theme||"dark",e.dataset.tooltipSize=o.size||"medium",this.attachTooltip(e)}remove(e){e.removeAttribute("data-tooltip"),e.removeAttribute("data-tooltip-position"),e.removeAttribute("data-tooltip-theme"),e.removeAttribute("data-tooltip-size"),e.removeAttribute("data-tooltip-attached"),e.removeAttribute("aria-describedby")}update(e,s,o={}){this.remove(e),this.add(e,s,o)}destroy(){this.container&&this.container.parentNode&&this.container.parentNode.removeChild(this.container),clearTimeout(this.hoverTimer),clearTimeout(this.hideTimer),console.log("🗑️ Système de tooltips détruit")}}const De=new Me;window.tooltip=De;async function $e(){return new Promise((t,e)=>{if(w()){const o=ge();if(o&&o.role==="admin"){console.log("✅ Admin autorisé (mode démo):",o.email),t(o);return}else{console.warn("❌ Accès refusé: utilisateur démo non admin"),alert("Accès refusé. Cette page est réservée aux administrateurs."),window.location.href="/index.html",e(new Error("Non autorisé"));return}}const s=he.onAuthStateChanged(async o=>{if(s(),!o){console.warn("❌ Accès refusé: Utilisateur non connecté"),window.location.href="/index.html",e(new Error("Non authentifié"));return}try{const a=await ve(o.uid);if(!a||a.role!=="admin"){console.warn("❌ Accès refusé: Utilisateur non administrateur"),alert("Accès refusé. Cette page est réservée aux administrateurs."),window.location.href="/index.html",e(new Error("Non autorisé"));return}console.log("✅ Admin autorisé:",o.email),t(o)}catch(a){console.error("❌ Erreur vérification admin:",a),window.location.href="/index.html",e(a)}})})}const le="avantage-quizz-demo-questions";function ze(){if(!w())return[];const t=localStorage.getItem(le);if(t)try{return JSON.parse(t).map(s=>({...s,createdAt:new Date(s.createdAt)}))}catch(e){console.warn("⚠️ Erreur lecture questions démo:",e)}return[{id:"1",module:"auto",month:11,year:2025,question:"Quelle est la pression recommandée pour les pneus d'une voiture standard ?",options:["32 PSI","25 PSI","40 PSI","50 PSI"],correctAnswer:0,explanation:"La pression recommandée est généralement de 32 PSI pour un véhicule standard.",createdAt:new Date},{id:"2",module:"auto",month:11,year:2025,question:"À quelle fréquence doit-on changer l'huile moteur ?",options:["Tous les 5000 km","Tous les 10000 km","Tous les 15000 km","Tous les 20000 km"],correctAnswer:1,explanation:"Il est recommandé de changer l'huile tous les 10000 km ou selon les recommandations du fabricant.",createdAt:new Date},{id:"3",module:"loisir",month:11,year:2025,question:"Quel est le poids maximal recommandé pour un bateau remorqué ?",options:["1500 kg","2000 kg","2500 kg","3000 kg"],correctAnswer:2,explanation:"Pour un véhicule standard, 2500 kg est souvent la limite recommandée.",createdAt:new Date},{id:"4",module:"vr",month:10,year:2025,question:"Quelle est la capacité minimale recommandée pour une batterie de VR ?",options:["75 Ah","100 Ah","125 Ah","150 Ah"],correctAnswer:1,explanation:"Une batterie de 100 Ah est le minimum recommandé pour un VR.",createdAt:new Date},{id:"5",module:"tracteur",month:10,year:2025,question:"À quelle profondeur doit-on labourer pour les cultures céréalières ?",options:["10-15 cm","20-25 cm","30-35 cm","40-45 cm"],correctAnswer:1,explanation:"La profondeur idéale est de 20-25 cm pour les céréales.",createdAt:new Date}]}function G(t){w()&&(localStorage.setItem(le,JSON.stringify(t)),console.log("💾 Questions démo sauvegardées:",t.length))}let M=ze();const Ie={total:240,byModule:{auto:85,loisir:62,vr:54,tracteur:39},recent:12};let E=[],y={module:"",month:"",year:new Date().getFullYear()},S=1;const H=20;async function Be(){console.log("Initialisation du gestionnaire de questions"),await D(),await $(),qe()}function qe(){const t=document.getElementById("create-question-form");t&&t.addEventListener("submit",Qe);const e=document.getElementById("json-file-input");e&&e.addEventListener("change",Ue);const s=document.getElementById("browse-json-btn");s&&s.addEventListener("click",()=>e?.click());const o=document.getElementById("filter-module"),a=document.getElementById("filter-month"),r=document.getElementById("filter-year"),n=document.getElementById("search-questions"),i=document.getElementById("questions-list");o&&o.addEventListener("change",V),a&&a.addEventListener("change",V),r&&r.addEventListener("change",V),n&&n.addEventListener("input",Oe),i&&!i.dataset.eventsBound&&(i.addEventListener("click",Ne),i.dataset.eventsBound="true");const d=document.getElementById("prev-page-btn"),c=document.getElementById("next-page-btn");d&&d.addEventListener("click",()=>X(-1)),c&&c.addEventListener("click",()=>X(1))}function Ne(t){const e=t.target.closest(".edit-question-btn, .delete-question-btn");if(!e)return;const s=e.dataset.questionId;if(s){if(e.classList.contains("edit-question-btn")){Re(s);return}e.classList.contains("delete-question-btn")&&Fe(s)}}async function D(){try{if(document.getElementById("questions-list")&&U("questions-list",xe(5)),w()){console.log("📝 Mode démo : Chargement des questions simulées..."),await new Promise(s=>setTimeout(s,500)),E=M.filter(s=>!(y.module&&s.module!==y.module||y.month&&s.month!==parseInt(y.month)||y.year&&s.year!==parseInt(y.year))),console.log(`✅ ${E.length} questions simulées chargées`),P();return}const e={};y.module&&(e.module=y.module),y.month&&(e.month=parseInt(y.month)),y.year&&(e.year=parseInt(y.year)),E=await Ae(e),console.log(`Questions chargees: ${E.length}`),P()}catch(t){console.error("Erreur chargement questions:",t);const e=document.getElementById("questions-list");e&&(e.innerHTML=`
                <div class="text-center py-12 text-red-500">
                    <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p class="text-lg font-medium">Erreur lors du chargement</p>
                    <p class="text-sm">${t.message}</p>
                </div>
            `)}}function P(){const t=document.getElementById("questions-list");if(!t)return;if(E.length===0){const r=document.createElement("div");r.className="text-center py-12 text-slate-500",r.innerHTML=`
            <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p class="text-lg font-medium">Aucune question trouvee</p>
            <p class="text-sm">Creez votre premiere question ou importez un fichier JSON</p>
        `,t.replaceChildren(r);return}const e=(S-1)*H,s=e+H,o=E.slice(e,s),a=document.createDocumentFragment();o.forEach(r=>{a.appendChild(ce(r))}),t.replaceChildren(a),Ve()}function ce(t){const e={auto:"indigo",loisir:"cyan",vr:"orange",tracteur:"green"},s={auto:"🚗",loisir:"🏔️",vr:"🚐",tracteur:"🚜"},o=e[t.module]||"gray",a=s[t.module]||"📝",n=["Jan","Fev","Mar","Avr","Mai","Juin","Juil","Aout","Sep","Oct","Nov","Dec"][t.month-1]||t.month,i=t.createdAt?.seconds?new Date(t.createdAt.seconds*1e3):t.createdAt instanceof Date?t.createdAt:null,d=i?i.toLocaleDateString("fr-FR"):"N/A",c=document.createElement("template");return c.innerHTML=`
        <article class="question-card bg-white rounded-xl shadow-md p-6 mb-4 hover:shadow-lg transition-shadow" data-question-id="${t.id}">
            <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-3">
                    <span class="text-2xl">${a}</span>
                    <div>
                        <span class="inline-block bg-${o}-100 text-${o}-700 text-xs font-semibold px-3 py-1 rounded-full">
                            ${L(t.module.toUpperCase())}
                        </span>
                        <span class="ml-2 text-sm text-slate-500">${L(`${n} ${t.year}`)}</span>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button class="edit-question-btn text-indigo-600 hover:text-indigo-800 p-2 rounded hover:bg-indigo-50 transition" data-question-id="${t.id}" title="Modifier">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                    </button>
                    <button class="delete-question-btn text-red-600 hover:text-red-800 p-2 rounded hover:bg-red-50 transition" data-question-id="${t.id}" title="Supprimer">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <h4 class="text-lg font-semibold text-slate-900 mb-4">${L(t.question)}</h4>
            <div class="space-y-2 mb-4">
                ${t.options.map((u,l)=>`
                    <div class="flex items-start gap-2 text-sm ${l===t.correctAnswer?"font-semibold text-green-700 bg-green-50 p-2 rounded":"text-slate-600"}">
                        <span class="font-bold">${String.fromCharCode(65+l)})</span>
                        <span>${L(u)}</span>
                        ${l===t.correctAnswer?'<svg class="w-5 h-5 text-green-600 ml-auto flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>':""}
                    </div>
                `).join("")}
            </div>
            <div class="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                <p class="text-xs font-semibold text-blue-700 mb-1">💡 Explication</p>
                <p class="text-sm text-blue-900">${L(t.explanation)}</p>
            </div>
            <div class="mt-4 pt-4 border-t border-slate-200 text-xs text-slate-500">
                Creee le: ${L(d)}${t.createdBy?L(` | Par: ${t.createdBy}`):""}
            </div>
        </article>
    `,c.content.firstElementChild}async function Qe(t){t.preventDefault();const e=t.target,s=e.querySelector('[type="submit"]'),o=s.innerHTML;try{s.disabled=!0,s.innerHTML='<svg class="animate-spin h-5 w-5 inline" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Creation...';const a={question:e.querySelector('[name="question"]').value,options:[e.querySelector('[name="option1"]').value,e.querySelector('[name="option2"]').value,e.querySelector('[name="option3"]').value,e.querySelector('[name="option4"]').value],correctAnswer:parseInt(e.querySelector('[name="correctAnswer"]:checked').value),explanation:e.querySelector('[name="explanation"]').value,module:e.querySelector('[name="module"]').value,month:parseInt(e.querySelector('[name="month"]').value),year:parseInt(e.querySelector('[name="year"]').value)};if(w()){console.log("📝 Mode démo : Simulation création question..."),await new Promise(n=>setTimeout(n,500));const r={id:`demo-${Date.now()}`,...a,explanation:a.explanation||"Explication non fournie",createdAt:new Date};M.unshift(r),G(M),Q("✅ Question créée avec succès (mode démo) !"),e.reset(),await D(),await $();return}await ke(a),Q("Question creee avec succes!"),e.reset(),await D(),await $()}catch(a){console.error("Erreur creation question:",a),F("create-question-error",a.message||"Erreur lors de la creation")}finally{s.disabled=!1,s.innerHTML=o}}async function Ue(t){const e=t.target.files[0];if(e)try{_e("json-preview");const s=await e.text(),o=JSON.parse(s);je(o),He(o,e.name)}catch(s){console.error("Erreur lecture JSON:",s),F("json-preview",s.message||"Fichier JSON invalide")}}function je(t){if(!t.module||!t.month||!t.year)throw new Error("Champs obligatoires manquants: module, month, year");if(!Array.isArray(t.questions)||t.questions.length===0)throw new Error("Le fichier doit contenir au moins une question");return t.questions.forEach((e,s)=>{if(!e.question||e.question.length<10)throw new Error(`Question ${s+1}: texte trop court (min 10 caracteres)`);if(!Array.isArray(e.options)||e.options.length!==4)throw new Error(`Question ${s+1}: doit avoir exactement 4 options`);if(e.correctAnswer===void 0||e.correctAnswer<0||e.correctAnswer>3)throw new Error(`Question ${s+1}: correctAnswer invalide (doit etre 0-3)`);if(!e.explanation||e.explanation.length<20)throw new Error(`Question ${s+1}: explication trop courte (min 20 caracteres)`)}),!0}function He(t,e){const s=document.getElementById("json-preview");if(!s)return;const o={auto:"Auto",loisir:"Loisir",vr:"VR",tracteur:"Tracteur"},a=["Janvier","Fevrier","Mars","Avril","Mai","Juin","Juillet","Aout","Septembre","Octobre","Novembre","Decembre"];s.innerHTML=`
        <div class="bg-green-50 border-2 border-green-500 rounded-xl p-6">
            <div class="flex items-start justify-between mb-4">
                <div>
                    <h4 class="text-lg font-bold text-green-900 mb-2">📄 ${e}</h4>
                    <div class="space-y-1 text-sm">
                        <p class="text-green-800">✓ Format valide</p>
                        <p class="text-green-800">✓ ${t.questions.length} question(s) detectee(s)</p>
                        <p class="text-green-800">✓ Module: ${o[t.module]||t.module}</p>
                        <p class="text-green-800">✓ Periode: ${a[t.month-1]} ${t.year}</p>
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
                    ${t.questions.slice(0,5).map((r,n)=>`
                        <li><strong>${n+1}.</strong> ${L(r.question.substring(0,80))}${r.question.length>80?"...":""}</li>
                    `).join("")}
                    ${t.questions.length>5?`<li class="text-slate-500 italic">... et ${t.questions.length-5} autre(s)</li>`:""}
                </ol>
            </div>
            
            <div class="flex gap-3">
                <button id="confirm-import-btn" class="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition">
                    Importer les ${t.questions.length} questions →
                </button>
            </div>
        </div>
    `,document.getElementById("confirm-import-btn")?.addEventListener("click",()=>Pe(t)),document.getElementById("cancel-import-btn")?.addEventListener("click",()=>{s.innerHTML="",document.getElementById("json-file-input").value=""})}async function Pe(t){const e=document.getElementById("json-preview"),s=document.getElementById("confirm-import-btn");try{if(s.disabled=!0,s.innerHTML='<svg class="animate-spin h-5 w-5 inline" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle></svg> Import en cours...',w()){console.log("📝 Mode démo : Simulation import JSON..."),await new Promise(r=>setTimeout(r,1e3));const a=t.questions||[];a.forEach((r,n)=>{M.unshift({id:`demo-imported-${Date.now()}-${n}`,question:r.question,options:r.options,correctAnswer:r.correctAnswer,explanation:r.explanation||"Pas d'explication fournie",module:t.module,month:t.month,year:t.year,createdAt:new Date})}),G(M),Q(`✅ Import terminé (mode démo): ${a.length} questions importées`),e.innerHTML="",document.getElementById("json-file-input").value="",await D(),await $();return}const o=await Ce(t);Q(`Import termine: ${o.success}/${o.total} questions importees`),o.errors.length>0&&console.warn("Erreurs import:",o.errors),e.innerHTML="",document.getElementById("json-file-input").value="",await D(),await $()}catch(o){console.error("Erreur import:",o),F("json-preview",o.message||"Erreur lors de l import")}}function Re(t){E.find(s=>s.id===t)&&alert(`Edition de la question ${t}
A implementer: modal d'edition`)}async function Fe(t){const e=E.find(o=>o.id===t);if(!(!e||!confirm(`Voulez-vous vraiment supprimer cette question?

"${e.question.substring(0,100)}..."

Cette action est irreversible.`)))try{if(w()){console.log("📝 Mode démo : Simulation suppression question..."),await new Promise(a=>setTimeout(a,300));const o=M.findIndex(a=>a.id===t);o>-1&&(M.splice(o,1),G(M)),Q("✅ Question supprimée avec succès (mode démo)"),await D(),await $();return}await Te(t),Q("Question supprimee avec succes"),await D(),await $()}catch(o){console.error("Erreur suppression:",o),F("questions-list",o.message||"Erreur lors de la suppression")}}async function V(t){const e=t.target.id.replace("filter-","");y[e]=t.target.value,S=1,await D()}function Oe(t){const e=t.target.value.toLowerCase();if(!e){P();return}const s=E.filter(r=>r.question.toLowerCase().includes(e)||r.options.some(n=>n.toLowerCase().includes(e))||r.explanation.toLowerCase().includes(e)),o=document.getElementById("questions-list");if(!o)return;if(s.length===0){const r=document.createElement("div");r.className="text-center py-12 text-slate-500",r.innerHTML=`
            <p class="text-lg">Aucun resultat pour "${L(e)}"</p>
        `,o.replaceChildren(r);return}const a=document.createDocumentFragment();s.forEach(r=>{a.appendChild(ce(r))}),o.replaceChildren(a)}function X(t){const e=Math.ceil(E.length/H);S+=t,S<1&&(S=1),S>e&&(S=e),P(),window.scrollTo({top:0,behavior:"smooth"})}function Ve(){const t=Math.ceil(E.length/H),e=document.getElementById("page-info"),s=document.getElementById("prev-page-btn"),o=document.getElementById("next-page-btn");e&&(e.textContent=`Page ${S}/${t||1}`),s&&(s.disabled=S===1),o&&(o.disabled=S===t||t===0)}async function $(){try{if(w()){console.log("📊 Mode démo : Chargement des stats simulées..."),ee(Ie);return}const t=await Le();ee(t)}catch(t){console.error("Erreur chargement stats:",t)}}function ee(t){const e=document.getElementById("questions-stats");if(!e)return;const s={auto:"Auto",loisir:"Loisir",vr:"VR",tracteur:"Tracteur"};e.innerHTML=`
        <div class="bg-white rounded-xl shadow-md p-6">
            <h3 class="text-xl font-bold text-slate-900 mb-4">📊 Statistiques des Questions</h3>
            
            <div class="mb-6">
                <p class="text-3xl font-bold text-indigo-600 mb-1">${t.total}</p>
                <p class="text-sm text-slate-600">questions au total</p>
            </div>
            
            <div class="space-y-3">
                <p class="text-sm font-semibold text-slate-700 mb-2">Par module:</p>
                ${Object.entries(t.byModule).map(([o,a])=>{const r=(a/t.total*100).toFixed(0);return`
                        <div>
                            <div class="flex justify-between text-sm mb-1">
                                <span class="text-slate-700">${s[o]||o}</span>
                                <span class="font-semibold">${a} (${r}%)</span>
                            </div>
                            <div class="bg-slate-200 rounded-full h-2">
                                <div class="bg-indigo-600 rounded-full h-2 transition-all" style="width: ${r}%"></div>
                            </div>
                        </div>
                    `}).join("")}
            </div>
        </div>
    `}function _e(t){const e=document.getElementById(t);e&&(e.innerHTML=`
        <div class="text-center py-12">
            <svg class="animate-spin h-12 w-12 mx-auto text-indigo-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-slate-600 mt-4">Chargement...</p>
        </div>
    `)}function F(t,e){const s=document.getElementById(t);if(!s){alert(`Erreur: ${e}`);return}s.innerHTML=`
        <div class="bg-red-50 border-2 border-red-500 rounded-xl p-6 text-center">
            <svg class="w-12 h-12 mx-auto text-red-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-red-900 font-semibold">${e}</p>
        </div>
    `}function Q(t){const e=document.createElement("div");e.className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-xl z-50 animate-fade-in",e.innerHTML=`
        <div class="flex items-center gap-3">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span class="font-semibold">${t}</span>
        </div>
    `,document.body.appendChild(e),setTimeout(()=>{e.remove()},3e3)}function L(t){const e=document.createElement("div");return e.textContent=t,e.innerHTML}const We=[{id:"1",email:"admin@avantage-quizz.com",displayName:"Administrateur Principal",role:"admin",totalQuizzes:0,averageScore:0,createdAt:new Date("2025-01-15"),lastLogin:new Date},{id:"2",email:"alice.dupont@example.com",displayName:"Alice Dupont",role:"user",totalQuizzes:24,averageScore:92,createdAt:new Date("2025-02-20"),lastLogin:new Date},{id:"3",email:"bob.martin@example.com",displayName:"Bob Martin",role:"user",totalQuizzes:21,averageScore:88,createdAt:new Date("2025-03-10"),lastLogin:new Date(Date.now()-864e5)},{id:"4",email:"claire.bernard@example.com",displayName:"Claire Bernard",role:"user",totalQuizzes:19,averageScore:85,createdAt:new Date("2025-03-25"),lastLogin:new Date(Date.now()-1728e5)},{id:"5",email:"david.dubois@example.com",displayName:"David Dubois",role:"user",totalQuizzes:18,averageScore:83,createdAt:new Date("2025-04-05"),lastLogin:new Date(Date.now()-2592e5)}],Je={total:42,admins:2,regularUsers:40,activeToday:8,activeWeek:23};let v=[],b={role:"",status:"all"},h={lastDoc:null,hasMore:!1,isLoading:!1,pageSize:20};async function Ge(){console.log("Initialisation du gestionnaire utilisateurs"),await K(),await ue(),Ke()}function Ke(){const t=document.getElementById("create-user-form");t&&t.addEventListener("submit",Ye);const e=document.getElementById("generate-password-btn");e&&e.addEventListener("click",Ze);const s=document.getElementById("filter-user-role"),o=document.getElementById("filter-user-status"),a=document.getElementById("search-users");s&&s.addEventListener("change",te),o&&o.addEventListener("change",te),a&&a.addEventListener("input",rt)}async function Ye(t){t.preventDefault();const e=document.getElementById("create-user-error"),s=document.getElementById("create-user-success"),o=document.getElementById("create-user-btn");e.classList.add("hidden"),s.classList.add("hidden");const a=new FormData(t.target),r={displayName:a.get("displayName"),email:a.get("email"),password:a.get("password"),role:a.get("role")};if(!r.displayName||!r.email||!r.password||!r.role){_(e,"Tous les champs sont obligatoires"),p.error("Veuillez remplir tous les champs");return}if(r.password.length<6){_(e,"Le mot de passe doit contenir au moins 6 caractères"),p.error("Mot de passe trop court (minimum 6 caractères)");return}o.disabled=!0,o.textContent="⏳ Création en cours...";const n=p.showLoadingToast("Création de l'utilisateur...");try{throw console.log("Création d'un nouvel utilisateur:",r.email),p.updateLoadingToast(n,"Cloud Function requise","error"),new Error(`⚠️ CLOUD FUNCTION REQUISE: Cette fonctionnalité nécessite une Cloud Function Firebase pour créer des utilisateurs avec mot de passe. Actuellement, seule l'authentification Google est supportée. Pour activer cette fonctionnalité:

1. Activer Email/Password dans Firebase Auth
2. Créer une Cloud Function createUser
3. Déployer la fonction sur Firebase`)}catch(i){console.error("❌ Erreur création utilisateur:",i),_(e,i.message)}finally{o.disabled=!1,o.textContent="➕ Créer l'utilisateur"}}function Ze(){const t="ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$%&";let s="";for(let a=0;a<12;a++)s+=t.charAt(Math.floor(Math.random()*t.length));const o=document.querySelector('input[name="password"]');o&&(o.value=s,o.type="text",navigator.clipboard.writeText(s).then(()=>{p.success("Mot de passe généré et copié ! Sauvegardez-le en lieu sûr.",5e3)}).catch(()=>{p.warning(`Mot de passe généré: ${s}

Copiez-le manuellement.`,7e3)}))}function _(t,e){t.textContent=e,t.classList.remove("hidden"),t.scrollIntoView({behavior:"smooth",block:"nearest"})}async function K(){try{if(document.getElementById("users-list")&&U("users-list",ye(10)),w()){console.log("👥 Mode démo : Chargement des utilisateurs simulés..."),await new Promise(o=>setTimeout(o,500)),v=We.filter(o=>{if(b.role&&o.role!==b.role)return!1;if(b.status!=="all"){const a=new Date;a.setDate(a.getDate()-7);const n=o.lastLogin>a;if(b.status==="active"&&!n||b.status==="inactive"&&n)return!1}return!0}),console.log(`✅ ${v.length} utilisateurs simulés chargés`),j();return}const e={};b.role&&(e.role=b.role),h.lastDoc=null,h.hasMore=!1;const s=await ne(e,h.pageSize,null);if(v=s.users,h.lastDoc=s.lastDoc,h.hasMore=s.hasMore,b.status!=="all"){const o=new Date;o.setDate(o.getDate()-7),v=v.filter(a=>{if(!a.lastLogin)return b.status==="inactive";const n=(a.lastLogin.toDate?a.lastLogin.toDate():new Date(a.lastLogin))>o;return b.status==="active"?n:!n})}console.log(`Utilisateurs charges: ${v.length}`),j(),de()}catch(t){console.error("Erreur chargement utilisateurs:",t);const e=document.getElementById("users-list");if(e){const s=f(t.message);e.innerHTML=`
                <div class="text-center py-12 text-red-500">
                    <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p class="text-lg font-medium">Erreur lors du chargement</p>
                    <p class="text-sm">${s}</p>
                </div>
            `}}}function j(){const t=document.getElementById("users-list");if(t){if(v.length===0){t.innerHTML=`
            <div class="text-center py-12 text-slate-500">
                <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <p class="text-lg font-medium">Aucun utilisateur trouve</p>
            </div>
        `;return}t.innerHTML=v.map(e=>et(e)).join(""),ot()}}async function Xe(){if(!(h.isLoading||!h.hasMore))try{h.isLoading=!0;const t={};b.role&&(t.role=b.role);const e=await ne(t,h.pageSize,h.lastDoc);let s=e.users;if(b.status!=="all"){const o=new Date;o.setDate(o.getDate()-7),s=s.filter(a=>{if(!a.lastLogin)return b.status==="inactive";const n=(a.lastLogin.toDate?a.lastLogin.toDate():new Date(a.lastLogin))>o;return b.status==="active"?n:!n})}v=[...v,...s],h.lastDoc=e.lastDoc,h.hasMore=e.hasMore,j(),de(),console.log(`✅ ${s.length} utilisateurs supplémentaires chargés`)}catch(t){console.error("❌ Erreur chargement utilisateurs supplémentaires:",t),p.error("Erreur lors du chargement des utilisateurs supplémentaires")}finally{h.isLoading=!1}}function de(){const t=document.getElementById("users-pagination-controls");if(t&&t.remove(),!h.hasMore&&v.length<=h.pageSize)return;const e=document.getElementById("users-list");if(!e)return;const s=`
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
                ${v.length} utilisateur${v.length>1?"s":""} affiché${v.length>1?"s":""}
            </span>
        </div>
    `;e.insertAdjacentHTML("beforeend",s);const o=document.getElementById("load-more-users-btn");o&&o.addEventListener("click",Xe)}function et(t){const e=t.role==="admin",s=e?"yellow":"blue",o=e?"🔰":"👤",a=t.lastLogin?t.lastLogin.toDate?t.lastLogin.toDate():new Date(t.lastLogin):null,r=t.createdAt?t.createdAt.toDate?t.createdAt.toDate():new Date(t.createdAt):null,n=a&&new Date-a<10080*60*1e3,i=a?it(a):"Jamais connecte",d=f(t.displayName||"Sans nom"),c=f(t.email||""),u=f(t.displayName||"User"),l=t.photoURL||`https://ui-avatars.com/api/?name=${encodeURIComponent(t.displayName||t.email)}&background=667eea&color=fff&size=128`;return`
        <div class="user-card bg-white rounded-xl shadow-md p-6 mb-4 hover:shadow-lg transition-shadow" data-user-id="${t.uid}">
            <div class="flex items-start gap-4">
                <img src="${l}" alt="${u}" class="w-16 h-16 rounded-full object-cover flex-shrink-0" onerror="this.src='https://ui-avatars.com/api/?name=U&background=667eea&color=fff&size=128'">
                
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-2">
                        <div>
                            <h4 class="text-lg font-bold text-slate-900 truncate">${d}</h4>
                            <p class="text-sm text-slate-600 truncate">${c}</p>
                        </div>
                        <div class="flex gap-2 flex-shrink-0 ml-4">
                            <button class="edit-user-btn text-indigo-600 hover:text-indigo-800 p-2 rounded hover:bg-indigo-50 transition" data-user-id="${t.uid}" data-user-email="${t.email}" data-user-role="${t.role||"user"}" title="Modifier">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-3 mb-3">
                        <span class="inline-flex items-center gap-1 bg-${s}-100 text-${s}-700 text-xs font-semibold px-3 py-1 rounded-full">
                            ${o} ${e?"Admin":"User"}
                        </span>
                        <span class="inline-flex items-center gap-1 ${n?"bg-green-100 text-green-700":"bg-slate-100 text-slate-600"} text-xs px-3 py-1 rounded-full">
                            <span class="w-2 h-2 rounded-full ${n?"bg-green-500":"bg-slate-400"}"></span>
                            ${n?"Actif":"Inactif"}
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
                    
                    ${e?"":tt(t)}
                </div>
            </div>
        </div>
    `}function tt(t){const e=t.totalQuizzes||0,s=t.averageScore||0,o=t.currentStreak||0;return`
        <div class="mt-4 pt-4 border-t border-slate-200 grid grid-cols-3 gap-4 text-center">
            <div>
                <p class="text-2xl font-bold text-indigo-600">${s}%</p>
                <p class="text-xs text-slate-600">Score moyen</p>
            </div>
            <div>
                <p class="text-2xl font-bold text-purple-600">${e}</p>
                <p class="text-xs text-slate-600">Quiz completes</p>
            </div>
            <div>
                <p class="text-2xl font-bold text-orange-600">🔥 ${o}</p>
                <p class="text-xs text-slate-600">Serie active</p>
            </div>
        </div>
    `}function ot(){document.querySelectorAll(".edit-user-btn").forEach(t=>{t.addEventListener("click",e=>{const s=e.currentTarget.dataset.userId,o=e.currentTarget.dataset.userEmail,a=e.currentTarget.dataset.userRole;st(s,o,a)})})}function st(t,e,s){const o=document.createElement("div");o.id="edit-role-modal",o.className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",o.innerHTML=`
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
                <p class="font-semibold text-slate-900">${f(e||"")}</p>
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
    `,document.body.appendChild(o),document.getElementById("close-modal-btn")?.addEventListener("click",()=>o.remove()),document.getElementById("cancel-role-btn")?.addEventListener("click",()=>o.remove()),document.getElementById("save-role-btn")?.addEventListener("click",async()=>{const a=o.querySelector('input[name="role"]:checked')?.value;a&&(await at(t,e,a),o.remove())}),o.addEventListener("click",a=>{a.target===o&&o.remove()})}async function at(t,e,s){const o=document.getElementById("save-role-btn");if(!o)return;const a=o.innerHTML,r=p.showLoadingToast("Mise à jour du rôle...");try{o.disabled=!0,o.innerHTML='<svg class="animate-spin h-5 w-5 inline" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle></svg> Mise a jour...',await be(t,s),p.updateLoadingToast(r,`Rôle mis à jour pour ${e}`,"success"),nt(`Role mis a jour pour ${e}: ${s==="admin"?"Admin":"User"}`),await K(),await ue()}catch(n){console.error("Erreur mise a jour role:",n),p.updateLoadingToast(r,"Erreur de mise à jour","error"),p.error(`Erreur: ${n.message||"Impossible de mettre a jour le role"}`,4e3),o.disabled=!1,o.innerHTML=a}}async function te(t){const e=t.target.id.replace("filter-user-","").replace("-","");b[e]=t.target.value,await K()}function rt(t){const e=t.target.value.toLowerCase();if(!e){j();return}const s=v.filter(r=>r.displayName&&r.displayName.toLowerCase().includes(e)||r.email&&r.email.toLowerCase().includes(e)),o=document.getElementById("users-list");if(!o)return;if(s.length===0){const r=f(e);o.innerHTML=`
            <div class="text-center py-12 text-slate-500">
                <p class="text-lg">Aucun resultat pour "${r}"</p>
            </div>
        `;return}const a=v;v=s,j(),v=a}async function ue(){try{if(w()){console.log("📊 Mode démo : Chargement des stats utilisateurs simulées..."),oe(Je);return}const t=await fe();oe(t)}catch(t){console.error("Erreur chargement stats:",t)}}function oe(t){const e=document.getElementById("users-stats");if(!e)return;const s=t.total>0?Math.round(t.activeLastWeek/t.total*100):0;e.innerHTML=`
        <div class="bg-white rounded-xl shadow-md p-6">
            <h3 class="text-xl font-bold text-slate-900 mb-6">📊 Statistiques Globales</h3>
            
            <div class="grid grid-cols-2 gap-4 mb-6">
                <div class="text-center p-4 bg-indigo-50 rounded-lg">
                    <p class="text-3xl font-bold text-indigo-600 mb-1">${t.total}</p>
                    <p class="text-sm text-indigo-700 font-medium">Utilisateurs</p>
                </div>
                <div class="text-center p-4 bg-yellow-50 rounded-lg">
                    <p class="text-3xl font-bold text-yellow-600 mb-1">${t.admins}</p>
                    <p class="text-sm text-yellow-700 font-medium">Admins</p>
                </div>
            </div>
            
            <div class="space-y-4">
                <div>
                    <div class="flex justify-between text-sm mb-2">
                        <span class="text-slate-700">Actifs (7 derniers jours)</span>
                        <span class="font-semibold">${t.activeLastWeek} (${s}%)</span>
                    </div>
                    <div class="bg-slate-200 rounded-full h-2">
                        <div class="bg-green-500 rounded-full h-2 transition-all" style="width: ${s}%"></div>
                    </div>
                </div>
                
                <div class="pt-4 border-t border-slate-200">
                    <p class="text-sm text-slate-600 mb-1">Score moyen global:</p>
                    <p class="text-2xl font-bold text-purple-600">${t.averageScore}%</p>
                </div>
                
                <div>
                    <p class="text-sm text-slate-600 mb-1">Total quiz completes:</p>
                    <p class="text-2xl font-bold text-indigo-600">${t.totalQuizzes}</p>
                </div>
            </div>
        </div>
    `}function nt(t){const e=document.createElement("div");e.className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-xl z-50 animate-fade-in";const s=f(t);e.innerHTML=`
        <div class="flex items-center gap-3">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span class="font-semibold">${s}</span>
        </div>
    `,document.body.appendChild(e),setTimeout(()=>{e.remove()},3e3)}function it(t){const s=new Date-t,o=Math.floor(s/6e4),a=Math.floor(s/36e5),r=Math.floor(s/864e5);return o<1?"A l instant":o<60?`Il y a ${o} min`:a<24?`Il y a ${a}h`:r===1?"Hier":r<7?`Il y a ${r} jours`:r<30?`Il y a ${Math.floor(r/7)} semaines`:t.toLocaleDateString("fr-FR")}const Y={stats:{totalUsers:42,totalQuizzes:156,totalQuestions:240,totalResources:35,avgScore:78,activeUsersToday:8,activeUsersWeek:23,quizzesToday:12,quizzesWeek:67},topUsers:[{id:"1",email:"alice.dupont@example.com",displayName:"Alice Dupont",totalQuizzes:24,averageScore:92},{id:"2",email:"bob.martin@example.com",displayName:"Bob Martin",totalQuizzes:21,averageScore:88},{id:"3",email:"claire.bernard@example.com",displayName:"Claire Bernard",totalQuizzes:19,averageScore:85},{id:"4",email:"david.dubois@example.com",displayName:"David Dubois",totalQuizzes:18,averageScore:83},{id:"5",email:"emma.petit@example.com",displayName:"Emma Petit",totalQuizzes:16,averageScore:81},{id:"6",email:"francois.roux@example.com",displayName:"François Roux",totalQuizzes:15,averageScore:79},{id:"7",email:"julie.moreau@example.com",displayName:"Julie Moreau",totalQuizzes:14,averageScore:76},{id:"8",email:"lucas.simon@example.com",displayName:"Lucas Simon",totalQuizzes:13,averageScore:74},{id:"9",email:"marie.laurent@example.com",displayName:"Marie Laurent",totalQuizzes:12,averageScore:72},{id:"10",email:"nicolas.michel@example.com",displayName:"Nicolas Michel",totalQuizzes:11,averageScore:70}],recentActivity:[{id:"1",userName:"Alice Dupont",module:"Auto - Novembre",score:95,completedAt:new Date(Date.now()-3e5)},{id:"2",userName:"Emma Petit",module:"Loisir - Novembre",score:90,completedAt:new Date(Date.now()-72e4)},{id:"3",userName:"Bob Martin",module:"VR - Novembre",score:88,completedAt:new Date(Date.now()-138e4)},{id:"4",userName:"Claire Bernard",module:"Auto - Octobre",score:82,completedAt:new Date(Date.now()-27e5)},{id:"5",userName:"David Dubois",module:"Tracteur - Octobre",score:79,completedAt:new Date(Date.now()-36e5)}],moduleStats:[{module:"Auto",questionsCount:85,avgScore:76,completions:67},{module:"Loisir",questionsCount:62,avgScore:81,completions:45},{module:"VR",questionsCount:54,avgScore:73,completions:32},{module:"Tracteur",questionsCount:39,avgScore:79,completions:28}]};x.set("globalStats",{totalUsers:0,totalQuizzes:0,totalQuestions:0,totalResources:0,avgScore:0,activeUsersToday:0,activeUsersWeek:0,quizzesToday:0,quizzesWeek:0});x.set("chartProgress",null);x.set("chartModules",null);x.set("chartActivity",null);async function me(){m.info("📊 Initialisation du dashboard admin avancé"),wt();try{await Promise.all([lt(),ct(),dt(),pe()]),ut(),ft(),p.success("Dashboard chargé avec succès !",3e3)}catch(t){m.error("❌ Erreur chargement dashboard:",t),p.error("Erreur lors du chargement du dashboard",4e3)}}async function lt(){try{let t=x.get("globalStats");if(w()){m.info("📊 Mode démo : Chargement des statistiques simulées..."),t=Y.stats,x.set("globalStats",t),se(),m.info("✅ Statistiques simulées chargées:",t);return}m.info("📈 Chargement des statistiques globales...");const{getUsersStats:e}=await W(async()=>{const{getUsersStats:T}=await import("./firestore-service-DZ_z0Auw.js");return{getUsersStats:T}},__vite__mapDeps([0,1,2,3,4])),{getQuestionsStats:s}=await W(async()=>{const{getQuestionsStats:T}=await import("./firestore-service-DZ_z0Auw.js");return{getQuestionsStats:T}},__vite__mapDeps([0,1,2,3,4])),o=await R(),a=await e();t.totalUsers=a.total||0,t.activeUsersToday=a.activeLastWeek||0,t.activeUsersWeek=a.activeLastWeek||0,t.totalQuizzes=a.totalQuizzes||0,t.avgScore=a.averageScore||0;const r=await s();t.totalQuestions=r.total||0;const n=B(q(I,"resources"),z("clientId","==",o),J(1e3)),i=await N(n);t.totalResources=i.size;const d=new Date;d.setHours(0,0,0,0);const c=new Date;c.setDate(c.getDate()-30);const u=B(q(I,"quizResults"),z("clientId","==",o),z("completedAt",">=",Se.fromDate(c)),ie("completedAt","desc"),J(1e3)),l=await N(u),g=new Date;g.setDate(g.getDate()-7);let A=0,k=0;l.forEach(T=>{const C=T.data().completedAt?.toDate();C&&(C>=d&&A++,C>=g&&k++)}),t.quizzesToday=A,t.quizzesWeek=k,x.set("globalStats",t),se(),m.info("✅ Statistiques globales chargées:",t)}catch(t){throw m.error("❌ Erreur chargement stats globales:",t),t}}async function ct(){try{if(w()){m.info("🏆 Mode démo : Chargement du top 10 simulé..."),ae(Y.topUsers),m.info("✅ Top 10 simulé chargé");return}m.info("🏆 Chargement du top 10 utilisateurs...");const{getLeaderboard:t}=await W(async()=>{const{getLeaderboard:o}=await import("./firestore-service-DZ_z0Auw.js");return{getLeaderboard:o}},__vite__mapDeps([0,1,2,3,4])),e=await t(10),s=e.map((o,a)=>({id:o.uid||`user-${a}`,email:o.email||"",displayName:o.displayName||"Utilisateur",totalQuizzes:o.totalQuizzes||0,averageScore:o.averageScore||0}));ae(s),m.info("✅ Top 10 utilisateurs chargé:",e)}catch(t){throw m.error("❌ Erreur chargement top users:",t),t}}async function dt(){try{if(w()){m.info("📅 Mode démo : Chargement de l'activité simulée..."),re(Y.recentActivity),m.info("✅ Activité simulée chargée");return}m.info("📅 Chargement de l'activité récente...");const t=B(q(I,"quizResults"),ie("completedAt","desc"),J(10)),e=await N(t),s=[];e.forEach(o=>{const a=o.data();s.push({id:o.id,userName:a.userName||"Utilisateur",module:a.module||"Module",score:a.score||0,completedAt:a.completedAt?.toDate()||new Date})}),re(s),m.info("✅ Activité récente chargée:",s)}catch(t){throw m.error("❌ Erreur chargement activité:",t),t}}async function pe(){try{if(w()){m.info("📊 Mode démo : Chargement des stats modules simulées...");const a={Auto:{count:85,totalScore:6460,avgScore:76},Loisir:{count:62,totalScore:5022,avgScore:81},VR:{count:54,totalScore:3942,avgScore:73},Tracteur:{count:39,totalScore:3081,avgScore:79}};return m.info("✅ Stats modules simulées chargées:",a),a}m.info("📊 Chargement des stats par module...");const t=await R(),e=B(q(I,"quizResults"),z("clientId","==",t)),s=await N(e),o={};return s.forEach(a=>{const r=a.data(),n=r.module||"Autre";o[n]||(o[n]={count:0,totalScore:0,avgScore:0}),o[n].count++,o[n].totalScore+=r.score||0}),Object.values(o).forEach(a=>{a.avgScore=Math.round(a.totalScore/a.count)}),m.info("✅ Stats par module chargées:",o),o}catch(t){throw m.error("❌ Erreur chargement stats modules:",t),t}}function se(){const t=document.getElementById("global-stats-cards");if(!t)return;const e=x.get("globalStats");t.innerHTML=`
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
            <h3 class="text-4xl font-black mb-1">${f(String(e.totalUsers))}</h3>
            <p class="text-white/90 text-sm font-medium">Utilisateurs inscrits</p>
            <div class="mt-3 text-xs flex gap-2">
                <span class="bg-white/20 px-2 py-1 rounded backdrop-blur-sm">📅 ${e.activeUsersToday} aujourd'hui</span>
                <span class="bg-white/20 px-2 py-1 rounded backdrop-blur-sm">📆 ${e.activeUsersWeek} cette semaine</span>
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
            <h3 class="text-4xl font-black mb-1">${e.totalQuizzes}</h3>
            <p class="text-white/90 text-sm font-medium">Quiz réalisés</p>
            <div class="mt-3 text-xs flex gap-2">
                <span class="bg-white/20 px-2 py-1 rounded backdrop-blur-sm">📅 ${e.quizzesToday} aujourd'hui</span>
                <span class="bg-white/20 px-2 py-1 rounded backdrop-blur-sm">📆 ${e.quizzesWeek} cette semaine</span>
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
            <h3 class="text-4xl font-black mb-1">${e.avgScore}%</h3>
            <p class="text-white/90 text-sm font-medium">Score moyen global</p>
            <div class="mt-3">
                <div class="bg-white/20 rounded-full h-2.5">
                    <div class="bg-white rounded-full h-2.5 shadow-lg" style="width: ${e.avgScore}%"></div>
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
            <h3 class="text-4xl font-black mb-1">${e.totalQuestions}</h3>
            <p class="text-white/90 text-sm font-medium">Questions disponibles</p>
            <div class="mt-3 text-xs">
                <span class="bg-white/20 px-2 py-1 rounded backdrop-blur-sm">📚 ${e.totalResources} ressources</span>
            </div>
        </div>
    `}function ae(t){const e=document.getElementById("top-users-list");if(!e)return;if(t.length===0){const o=document.createElement("div");o.className="text-center py-8 text-slate-500",o.innerHTML=`
            <svg class="w-12 h-12 mx-auto mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <p class="font-medium">Aucun utilisateur</p>
        `,e.replaceChildren(o);return}const s=document.createDocumentFragment();t.forEach((o,a)=>{const r=a===0?"🥇":a===1?"🥈":a===2?"🥉":`${a+1}.`,n=a===0?"bg-ap-gold-light border-ap-gold":a===1?"bg-slate-50 border-slate-300":a===2?"bg-ap-warning-light border-ap-warning":"bg-white border-slate-200",i=o.userName||o.displayName||o.email||"Utilisateur",d=f(i),c=Number.isFinite(o.totalQuizzes)?o.totalQuizzes:0,u=Number.isFinite(o.avgScore)?o.avgScore:0,l=document.createElement("article");l.className=`flex items-center justify-between p-4 rounded-lg border ${n} hover:shadow-md transition-shadow`,l.innerHTML=`
            <div class="flex items-center gap-4">
                <span class="text-2xl font-bold w-8">${f(r)}</span>
                <div>
                    <h4 class="font-semibold text-slate-900">${d}</h4>
                    <p class="text-sm text-slate-600">${f(`${c} quiz complétés`)}</p>
                </div>
            </div>
            <div class="text-right">
                <div class="text-2xl font-bold text-ap-success">${f(`${u}%`)}</div>
                <div class="text-xs text-slate-500">Score moyen</div>
            </div>
        `,s.appendChild(l)}),e.replaceChildren(s)}function re(t){const e=document.getElementById("recent-activity-list");if(!e)return;if(t.length===0){const o=document.createElement("div");o.className="text-center py-8 text-slate-500",o.innerHTML=`
            <svg class="w-12 h-12 mx-auto mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="font-medium">Aucune activité récente</p>
        `,e.replaceChildren(o);return}const s=document.createDocumentFragment();t.forEach(o=>{const a=xt(o.completedAt),r=f(a),n=o.score>=80?"text-green-600":o.score>=60?"text-yellow-600":"text-red-600",i=o.userName||"Utilisateur",d=f(i),c=f(o.module||"Module"),u=f(`${Number.isFinite(o.score)?o.score:0}%`),l=f(i.charAt(0).toUpperCase()),g=document.createElement("article");g.className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors",g.innerHTML=`
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-ap-red-100 rounded-full flex items-center justify-center">
                    <span class="text-lg font-bold text-ap-red-primary">${l}</span>
                </div>
                <div>
                    <p class="font-medium text-slate-900">${d}</p>
                    <p class="text-sm text-slate-600">${c}</p>
                </div>
            </div>
            <div class="text-right">
                <div class="text-lg font-bold ${n}">${u}</div>
                <div class="text-xs text-slate-500">${r}</div>
            </div>
        `,s.appendChild(g)}),e.replaceChildren(s)}function ut(){mt(),pt(),gt()}async function mt(){const t=document.getElementById("chart-progress");if(t)try{let e,s,o;if(w()){m.info("📈 Mode démo : Création graphique progression simulé..."),e=[],s=[],o=[];for(let n=29;n>=0;n--){const i=new Date;i.setDate(i.getDate()-n),e.push(i.toLocaleDateString("fr-FR",{day:"2-digit",month:"short"})),s.push(Math.floor(Math.random()*15)+5),o.push(Math.floor(Math.random()*20)+70)}}else{const n=new Date;n.setDate(n.getDate()-30);const i=await R(),d=B(q(I,"quizResults"),z("clientId","==",i)),c=await N(d),u={};for(let l=0;l<30;l++){const g=new Date;g.setDate(g.getDate()-l);const A=g.toISOString().split("T")[0];u[A]={count:0,totalScore:0}}c.forEach(l=>{const g=l.data(),A=g.completedAt?.toDate();if(A&&A>=n){const k=A.toISOString().split("T")[0];u[k]&&(u[k].count++,u[k].totalScore+=g.score||0)}}),e=Object.keys(u).reverse().map(l=>new Date(l).toLocaleDateString("fr-FR",{day:"2-digit",month:"short"})),s=Object.values(u).reverse().map(l=>l.count),o=Object.values(u).reverse().map(l=>l.count>0?Math.round(l.totalScore/l.count):0)}const a=x.get("chartProgress");a&&a.destroy();const r=new Chart(t,{type:"line",data:{labels:e,datasets:[{label:"Quiz complétés",data:s,borderColor:"rgb(196, 30, 58)",backgroundColor:"rgba(196, 30, 58, 0.1)",tension:.4,yAxisID:"y",pointBackgroundColor:"rgb(196, 30, 58)",pointBorderColor:"#fff",pointBorderWidth:2},{label:"Score moyen (%)",data:o,borderColor:"rgb(212, 175, 55)",backgroundColor:"rgba(212, 175, 55, 0.1)",tension:.4,yAxisID:"y1",pointBackgroundColor:"rgb(212, 175, 55)",pointBorderColor:"#fff",pointBorderWidth:2}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},scales:{y:{type:"linear",display:!0,position:"left",title:{display:!0,text:"Nombre de quiz"}},y1:{type:"linear",display:!0,position:"right",title:{display:!0,text:"Score moyen (%)"},grid:{drawOnChartArea:!1}}},plugins:{legend:{position:"top"},title:{display:!0,text:"Évolution sur 30 jours"}}}});x.set("chartProgress",r)}catch(e){m.error("❌ Erreur création graphique progression:",e)}}async function pt(){const t=document.getElementById("chart-modules");if(t)try{const e=await pe(),s=Object.keys(e),o=Object.values(e).map(i=>i.count),a=["rgba(196, 30, 58, 0.9)","rgba(212, 175, 55, 0.9)","rgba(40, 167, 69, 0.9)","rgba(255, 159, 67, 0.9)","rgba(139, 20, 41, 0.9)"],r=x.get("chartModules");r&&r.destroy();const n=new Chart(t,{type:"doughnut",data:{labels:s,datasets:[{data:o,backgroundColor:a,borderWidth:2,borderColor:"#fff"}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"bottom"},title:{display:!0,text:"Répartition par module"}}}});x.set("chartModules",n)}catch(e){m.error("❌ Erreur création graphique modules:",e)}}async function gt(){const t=document.getElementById("chart-activity");if(t)try{const e=[],s=[];for(let r=6;r>=0;r--){const n=new Date;n.setDate(n.getDate()-r),e.push(n.toLocaleDateString("fr-FR",{weekday:"short"})),s.push(Math.floor(Math.random()*20)+5)}const o=x.get("chartActivity");o&&o.destroy();const a=new Chart(t,{type:"bar",data:{labels:e,datasets:[{label:"Utilisateurs actifs",data:s,backgroundColor:"rgba(196, 30, 58, 0.8)",borderColor:"rgb(196, 30, 58)",borderWidth:2,borderRadius:4,hoverBackgroundColor:"rgba(196, 30, 58, 1)"}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1},title:{display:!0,text:"Activité des 7 derniers jours"}},scales:{y:{beginAtZero:!0,ticks:{stepSize:5}}}}});x.set("chartActivity",a)}catch(e){m.error("❌ Erreur création graphique activité:",e)}}async function ht(){const t=p.showLoadingToast("Génération du PDF...");try{const{jsPDF:e}=window.jspdf,s=new e;s.setFontSize(20),s.text("Dashboard Admin - QuizPro",20,20),s.setFontSize(10),s.text(`Généré le ${new Date().toLocaleDateString("fr-FR")}`,20,30),s.setFontSize(14),s.text("Statistiques Globales",20,45),s.setFontSize(10);let o=55;s.text(`Total Utilisateurs: ${globalStats.totalUsers}`,25,o),o+=7,s.text(`Total Quiz: ${globalStats.totalQuizzes}`,25,o),o+=7,s.text(`Score Moyen: ${globalStats.avgScore}%`,25,o),o+=7,s.text(`Questions: ${globalStats.totalQuestions}`,25,o),o+=7,s.text(`Ressources: ${globalStats.totalResources}`,25,o),s.save(`dashboard-admin-${new Date().toISOString().split("T")[0]}.pdf`),p.updateLoadingToast(t,"PDF généré avec succès !","success")}catch(e){m.error("❌ Erreur export PDF:",e),p.updateLoadingToast(t,"Erreur d'export PDF","error"),p.error("Erreur: Assurez-vous que jsPDF est chargé",4e3)}}async function vt(){const t=p.showLoadingToast("Génération du CSV...");try{const e=await R(),s=B(q(I,"quizResults"),z("clientId","==",e)),o=await N(s),a=["Date","Utilisateur","Module","Mois","Année","Score (%)","Bonnes réponses","Total questions","Temps (s)"],r=[];o.forEach(c=>{const u=c.data(),l=u.completedAt?.toDate().toLocaleString("fr-FR")||"N/A";r.push([l,u.userName||"Inconnu",u.module||"N/A",u.month||"N/A",u.year||"N/A",u.score||0,u.correctAnswers||0,u.totalQuestions||0,u.timeSpent||0])});const n=[a,...r].map(c=>c.join(",")).join(`
`),i=new Blob([n],{type:"text/csv;charset=utf-8;"}),d=document.createElement("a");d.href=URL.createObjectURL(i),d.download=`dashboard-complet-${new Date().toISOString().split("T")[0]}.csv`,d.click(),p.updateLoadingToast(t,"CSV généré avec succès !","success")}catch(e){m.error("❌ Erreur export CSV:",e),p.updateLoadingToast(t,"Erreur d'export CSV","error"),p.error("Erreur lors de l'export CSV",4e3)}}function ft(){document.getElementById("export-pdf-btn")?.addEventListener("click",ht),document.getElementById("export-csv-btn")?.addEventListener("click",vt),document.getElementById("period-filter")?.addEventListener("change",bt),document.getElementById("refresh-dashboard-btn")?.addEventListener("click",()=>{p.info("Actualisation du dashboard...",2e3),me()})}async function bt(t){const e=t.target.value;p.info(`Filtrage: ${e}`,2e3)}function wt(){document.getElementById("global-stats-cards")&&U("global-stats-cards",Ee(4)),document.getElementById("top-users-list")&&U("top-users-list",Z(10)),document.getElementById("recent-activity-list")&&U("recent-activity-list",Z(8));const o=document.getElementById("progress-chart");o&&(o.innerHTML=O());const a=document.getElementById("modules-chart");a&&(a.innerHTML=O());const r=document.getElementById("activity-chart");r&&(r.innerHTML=O())}function xt(t){const s=new Date-t,o=Math.floor(s/1e3),a=Math.floor(o/60),r=Math.floor(a/60),n=Math.floor(r/24);return n>0?`Il y a ${n}j`:r>0?`Il y a ${r}h`:a>0?`Il y a ${a}min`:"À l'instant"}$e().then(t=>{console.log("Admin authentifié:",t.email),p.success(`Bienvenue ${t.displayName||t.email} !`,3e3);const e=document.getElementById("admin-name"),s=document.getElementById("admin-avatar");e&&(e.textContent=t.displayName||t.email),s&&t.photoURL&&(s.src=t.photoURL),me(),Be(),Ge(),yt()}).catch(t=>{console.error("Erreur authentification admin:",t)});function yt(){const t=document.getElementById("tab-dashboard-btn"),e=document.getElementById("tab-questions-btn"),s=document.getElementById("tab-users-btn"),o=document.getElementById("tab-dashboard"),a=document.getElementById("tab-questions"),r=document.getElementById("tab-users");function n(i,d){[t,e,s].forEach(c=>{c.classList.remove("border-ap-red-primary","text-ap-red-primary"),c.classList.add("border-transparent","text-slate-600"),c.setAttribute("aria-selected","false")}),[o,a,r].forEach(c=>{c.classList.add("tab-hidden")}),i.classList.remove("border-transparent","text-slate-600"),i.classList.add("border-ap-red-primary","text-ap-red-primary"),i.setAttribute("aria-selected","true"),d.classList.remove("tab-hidden")}t.addEventListener("click",()=>n(t,o)),e.addEventListener("click",()=>n(e,a)),s.addEventListener("click",()=>n(s,r))}document.getElementById("signout-link")?.addEventListener("click",t=>{t.preventDefault(),confirm("Voulez-vous vraiment vous déconnecter ?")&&we().then(()=>{window.location.href="/"})});
//# sourceMappingURL=admin-DHWq2NFo.js.map
