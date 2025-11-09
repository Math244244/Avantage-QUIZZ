import{A as w,B as ue,p as me,g as pe,d as ee,w as v,f as ge,v as m,e as he,z as d,n as k,y as fe}from"./auth-BWu0cJ0L.js";import{s as B,e as ve,f as be,a as we,d as j,g as W}from"./skeleton-BmdGa2iR.js";import{getDocs as C,collection as T,query as te,orderBy as oe,limit as se}from"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";import{g as xe,a as ye,c as Ee,d as Se,i as Ae}from"./question-service-DDjpQRF7.js";import{s as x}from"./state-manager-w7-wWzCS.js";import"https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";import"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";import"https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";class Le{constructor(){this.activeTooltip=null,this.hoverDelay=300,this.hideDelay=100,this.hoverTimer=null,this.hideTimer=null,this.isTouchDevice="ontouchstart"in window,this.init()}init(){console.log("🎯 Initialisation du système de tooltips"),this.createTooltipContainer(),this.initializeTooltips(),this.observeDOM(),console.log("✅ Système de tooltips initialisé")}createTooltipContainer(){let e=document.getElementById("tooltip-container");e||(e=document.createElement("div"),e.id="tooltip-container",e.className="fixed pointer-events-none z-[9999]",document.body.appendChild(e)),this.container=e}initializeTooltips(){const e=document.querySelectorAll("[data-tooltip]");e.forEach(o=>this.attachTooltip(o)),console.log(`📌 ${e.length} tooltips initialisés`)}observeDOM(){new MutationObserver(o=>{o.forEach(s=>{s.addedNodes.forEach(a=>{a.nodeType===1&&(a.hasAttribute&&a.hasAttribute("data-tooltip")&&this.attachTooltip(a),a.querySelectorAll&&a.querySelectorAll("[data-tooltip]").forEach(r=>{this.attachTooltip(r)}))})})}).observe(document.body,{childList:!0,subtree:!0})}attachTooltip(e){e.dataset.tooltipAttached||(e.dataset.tooltipAttached="true",!this.isTouchDevice&&(e.addEventListener("mouseenter",o=>this.handleMouseEnter(o,e)),e.addEventListener("mouseleave",o=>this.handleMouseLeave(o)),e.addEventListener("focus",o=>this.handleFocus(o,e)),e.addEventListener("blur",o=>this.handleBlur(o)),e.setAttribute("aria-describedby",`tooltip-${this.generateId()}`)))}generateId(){return Math.random().toString(36).substring(2,11)}handleMouseEnter(e,o){clearTimeout(this.hideTimer),this.hoverTimer=setTimeout(()=>{this.showTooltip(o)},this.hoverDelay)}handleMouseLeave(e){clearTimeout(this.hoverTimer),this.hideTimer=setTimeout(()=>{this.hideTooltip()},this.hideDelay)}handleFocus(e,o){this.showTooltip(o)}handleBlur(e){this.hideTooltip()}showTooltip(e){const o=e.dataset.tooltip,s=e.dataset.tooltipPosition||"top",a=e.dataset.tooltipTheme||"dark",r=e.dataset.tooltipSize||"medium";if(!o)return;this.hideTooltip();const n=this.createTooltipElement(o,a,r);this.container.appendChild(n),this.activeTooltip=n,this.positionTooltip(n,e,s),setTimeout(()=>{n.classList.remove("opacity-0","scale-95"),n.classList.add("opacity-100","scale-100")},10)}createTooltipElement(e,o,s){const a=document.createElement("div");return a.className=`tooltip absolute opacity-0 scale-95 transform transition-all duration-200 ease-out ${this.getThemeClasses(o)} ${this.getSizeClasses(s)}`,a.innerHTML=`
            <div class="tooltip-content relative">
                ${e}
                <div class="tooltip-arrow absolute w-2 h-2 transform rotate-45 ${this.getArrowClasses(o)}"></div>
            </div>
        `,a}getThemeClasses(e){const o={dark:"bg-slate-900 text-white shadow-lg",light:"bg-white text-slate-900 shadow-lg border border-slate-200",success:"bg-green-600 text-white shadow-lg",error:"bg-red-600 text-white shadow-lg",warning:"bg-orange-600 text-white shadow-lg",info:"bg-blue-600 text-white shadow-lg"};return o[e]||o.dark}getSizeClasses(e){const o={small:"text-xs px-2 py-1 rounded",medium:"text-sm px-3 py-2 rounded-md",large:"text-base px-4 py-3 rounded-lg"};return o[e]||o.medium}getArrowClasses(e){const o={dark:"bg-slate-900",light:"bg-white border-l border-b border-slate-200",success:"bg-green-600",error:"bg-red-600",warning:"bg-orange-600",info:"bg-blue-600"};return o[e]||o.dark}positionTooltip(e,o,s){const a=o.getBoundingClientRect(),r=e.getBoundingClientRect(),n=e.querySelector(".tooltip-arrow"),l=8,i=8,c={top:{top:a.top-r.height-l,left:a.left+a.width/2-r.width/2,arrowTop:r.height-i/2,arrowLeft:r.width/2-i/2,arrowRotate:"rotate(45deg)"},bottom:{top:a.bottom+l,left:a.left+a.width/2-r.width/2,arrowTop:-i/2,arrowLeft:r.width/2-i/2,arrowRotate:"rotate(225deg)"},left:{top:a.top+a.height/2-r.height/2,left:a.left-r.width-l,arrowTop:r.height/2-i/2,arrowLeft:r.width-i/2,arrowRotate:"rotate(135deg)"},right:{top:a.top+a.height/2-r.height/2,left:a.right+l,arrowTop:r.height/2-i/2,arrowLeft:-i/2,arrowRotate:"rotate(315deg)"}};let g=s;const u=c[s];if(u&&(u.top<0||u.top+r.height>window.innerHeight||u.left<0||u.left+r.width>window.innerWidth)){const de=["top","bottom","left","right"];for(const V of de){const q=c[V];if(!(q.top<0||q.top+r.height>window.innerHeight||q.left<0||q.left+r.width>window.innerWidth)){g=V;break}}}const p=c[g]||c.top;e.style.top=`${p.top}px`,e.style.left=`${p.left}px`,n&&(n.style.top=`${p.arrowTop}px`,n.style.left=`${p.arrowLeft}px`,n.style.transform=p.arrowRotate)}hideTooltip(){this.activeTooltip&&(this.activeTooltip.classList.remove("opacity-100","scale-100"),this.activeTooltip.classList.add("opacity-0","scale-95"),setTimeout(()=>{this.activeTooltip&&this.activeTooltip.parentNode&&this.activeTooltip.parentNode.removeChild(this.activeTooltip),this.activeTooltip=null},200))}add(e,o,s={}){e.dataset.tooltip=o,e.dataset.tooltipPosition=s.position||"top",e.dataset.tooltipTheme=s.theme||"dark",e.dataset.tooltipSize=s.size||"medium",this.attachTooltip(e)}remove(e){e.removeAttribute("data-tooltip"),e.removeAttribute("data-tooltip-position"),e.removeAttribute("data-tooltip-theme"),e.removeAttribute("data-tooltip-size"),e.removeAttribute("data-tooltip-attached"),e.removeAttribute("aria-describedby")}update(e,o,s={}){this.remove(e),this.add(e,o,s)}destroy(){this.container&&this.container.parentNode&&this.container.parentNode.removeChild(this.container),clearTimeout(this.hoverTimer),clearTimeout(this.hideTimer),console.log("🗑️ Système de tooltips détruit")}}const ke=new Le;window.tooltip=ke;async function Ce(){return new Promise((t,e)=>{if(w()){const s=ue();if(s&&s.role==="admin"){console.log("✅ Admin autorisé (mode démo):",s.email),t(s);return}else{console.warn("❌ Accès refusé: utilisateur démo non admin"),alert("Accès refusé. Cette page est réservée aux administrateurs."),window.location.href="/index.html",e(new Error("Non autorisé"));return}}const o=me.onAuthStateChanged(async s=>{if(o(),!s){console.warn("❌ Accès refusé: Utilisateur non connecté"),window.location.href="/index.html",e(new Error("Non authentifié"));return}try{const a=await pe(s.uid);if(!a||a.role!=="admin"){console.warn("❌ Accès refusé: Utilisateur non administrateur"),alert("Accès refusé. Cette page est réservée aux administrateurs."),window.location.href="/index.html",e(new Error("Non autorisé"));return}console.log("✅ Admin autorisé:",s.email),t(s)}catch(a){console.error("❌ Erreur vérification admin:",a),window.location.href="/index.html",e(a)}})})}const ae="avantage-quizz-demo-questions";function Te(){if(!w())return[];const t=localStorage.getItem(ae);if(t)try{return JSON.parse(t).map(o=>({...o,createdAt:new Date(o.createdAt)}))}catch(e){console.warn("⚠️ Erreur lecture questions démo:",e)}return[{id:"1",module:"auto",month:11,year:2025,question:"Quelle est la pression recommandée pour les pneus d'une voiture standard ?",options:["32 PSI","25 PSI","40 PSI","50 PSI"],correctAnswer:0,explanation:"La pression recommandée est généralement de 32 PSI pour un véhicule standard.",createdAt:new Date},{id:"2",module:"auto",month:11,year:2025,question:"À quelle fréquence doit-on changer l'huile moteur ?",options:["Tous les 5000 km","Tous les 10000 km","Tous les 15000 km","Tous les 20000 km"],correctAnswer:1,explanation:"Il est recommandé de changer l'huile tous les 10000 km ou selon les recommandations du fabricant.",createdAt:new Date},{id:"3",module:"loisir",month:11,year:2025,question:"Quel est le poids maximal recommandé pour un bateau remorqué ?",options:["1500 kg","2000 kg","2500 kg","3000 kg"],correctAnswer:2,explanation:"Pour un véhicule standard, 2500 kg est souvent la limite recommandée.",createdAt:new Date},{id:"4",module:"vr",month:10,year:2025,question:"Quelle est la capacité minimale recommandée pour une batterie de VR ?",options:["75 Ah","100 Ah","125 Ah","150 Ah"],correctAnswer:1,explanation:"Une batterie de 100 Ah est le minimum recommandé pour un VR.",createdAt:new Date},{id:"5",module:"tracteur",month:10,year:2025,question:"À quelle profondeur doit-on labourer pour les cultures céréalières ?",options:["10-15 cm","20-25 cm","30-35 cm","40-45 cm"],correctAnswer:1,explanation:"La profondeur idéale est de 20-25 cm pour les céréales.",createdAt:new Date}]}function R(t){w()&&(localStorage.setItem(ae,JSON.stringify(t)),console.log("💾 Questions démo sauvegardées:",t.length))}let M=Te();const Me={total:240,byModule:{auto:85,loisir:62,vr:54,tracteur:39},recent:12};let S=[],y={module:"",month:"",year:new Date().getFullYear()},A=1;const N=20;async function $e(){console.log("Initialisation du gestionnaire de questions"),await $(),await z(),ze()}function ze(){const t=document.getElementById("create-question-form");t&&t.addEventListener("submit",Be);const e=document.getElementById("json-file-input");e&&e.addEventListener("change",Ie);const o=document.getElementById("browse-json-btn");o&&o.addEventListener("click",()=>e?.click());const s=document.getElementById("filter-module"),a=document.getElementById("filter-month"),r=document.getElementById("filter-year"),n=document.getElementById("search-questions"),l=document.getElementById("questions-list");s&&s.addEventListener("change",H),a&&a.addEventListener("change",H),r&&r.addEventListener("change",H),n&&n.addEventListener("input",He),l&&!l.dataset.eventsBound&&(l.addEventListener("click",De),l.dataset.eventsBound="true");const i=document.getElementById("prev-page-btn"),c=document.getElementById("next-page-btn");i&&i.addEventListener("click",()=>J(-1)),c&&c.addEventListener("click",()=>J(1))}function De(t){const e=t.target.closest(".edit-question-btn, .delete-question-btn");if(!e)return;const o=e.dataset.questionId;if(o){if(e.classList.contains("edit-question-btn")){Qe(o);return}e.classList.contains("delete-question-btn")&&je(o)}}async function $(){try{if(document.getElementById("questions-list")&&B("questions-list",ve(5)),w()){console.log("📝 Mode démo : Chargement des questions simulées..."),await new Promise(o=>setTimeout(o,500)),S=M.filter(o=>!(y.module&&o.module!==y.module||y.month&&o.month!==parseInt(y.month)||y.year&&o.year!==parseInt(y.year))),console.log(`✅ ${S.length} questions simulées chargées`),U();return}const e={};y.module&&(e.module=y.module),y.month&&(e.month=parseInt(y.month)),y.year&&(e.year=parseInt(y.year)),S=await xe(e),console.log(`Questions chargees: ${S.length}`),U()}catch(t){console.error("Erreur chargement questions:",t);const e=document.getElementById("questions-list");e&&(e.innerHTML=`
                <div class="text-center py-12 text-red-500">
                    <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p class="text-lg font-medium">Erreur lors du chargement</p>
                    <p class="text-sm">${t.message}</p>
                </div>
            `)}}function U(){const t=document.getElementById("questions-list");if(!t)return;if(S.length===0){const r=document.createElement("div");r.className="text-center py-12 text-slate-500",r.innerHTML=`
            <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p class="text-lg font-medium">Aucune question trouvee</p>
            <p class="text-sm">Creez votre premiere question ou importez un fichier JSON</p>
        `,t.replaceChildren(r);return}const e=(A-1)*N,o=e+N,s=S.slice(e,o),a=document.createDocumentFragment();s.forEach(r=>{a.appendChild(re(r))}),t.replaceChildren(a),Fe()}function re(t){const e={auto:"indigo",loisir:"cyan",vr:"orange",tracteur:"green"},o={auto:"🚗",loisir:"🏔️",vr:"🚐",tracteur:"🚜"},s=e[t.module]||"gray",a=o[t.module]||"📝",n=["Jan","Fev","Mar","Avr","Mai","Juin","Juil","Aout","Sep","Oct","Nov","Dec"][t.month-1]||t.month,l=t.createdAt?.seconds?new Date(t.createdAt.seconds*1e3):t.createdAt instanceof Date?t.createdAt:null,i=l?l.toLocaleDateString("fr-FR"):"N/A",c=document.createElement("template");return c.innerHTML=`
        <article class="question-card bg-white rounded-xl shadow-md p-6 mb-4 hover:shadow-lg transition-shadow" data-question-id="${t.id}">
            <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-3">
                    <span class="text-2xl">${a}</span>
                    <div>
                        <span class="inline-block bg-${s}-100 text-${s}-700 text-xs font-semibold px-3 py-1 rounded-full">
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
                ${t.options.map((g,u)=>`
                    <div class="flex items-start gap-2 text-sm ${u===t.correctAnswer?"font-semibold text-green-700 bg-green-50 p-2 rounded":"text-slate-600"}">
                        <span class="font-bold">${String.fromCharCode(65+u)})</span>
                        <span>${L(g)}</span>
                        ${u===t.correctAnswer?'<svg class="w-5 h-5 text-green-600 ml-auto flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>':""}
                    </div>
                `).join("")}
            </div>
            <div class="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                <p class="text-xs font-semibold text-blue-700 mb-1">💡 Explication</p>
                <p class="text-sm text-blue-900">${L(t.explanation)}</p>
            </div>
            <div class="mt-4 pt-4 border-t border-slate-200 text-xs text-slate-500">
                Creee le: ${L(i)}${t.createdBy?L(` | Par: ${t.createdBy}`):""}
            </div>
        </article>
    `,c.content.firstElementChild}async function Be(t){t.preventDefault();const e=t.target,o=e.querySelector('[type="submit"]'),s=o.innerHTML;try{o.disabled=!0,o.innerHTML='<svg class="animate-spin h-5 w-5 inline" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Creation...';const a={question:e.querySelector('[name="question"]').value,options:[e.querySelector('[name="option1"]').value,e.querySelector('[name="option2"]').value,e.querySelector('[name="option3"]').value,e.querySelector('[name="option4"]').value],correctAnswer:parseInt(e.querySelector('[name="correctAnswer"]:checked').value),explanation:e.querySelector('[name="explanation"]').value,module:e.querySelector('[name="module"]').value,month:parseInt(e.querySelector('[name="month"]').value),year:parseInt(e.querySelector('[name="year"]').value)};if(w()){console.log("📝 Mode démo : Simulation création question..."),await new Promise(n=>setTimeout(n,500));const r={id:`demo-${Date.now()}`,...a,explanation:a.explanation||"Explication non fournie",createdAt:new Date};M.unshift(r),R(M),D("✅ Question créée avec succès (mode démo) !"),e.reset(),await $(),await z();return}await Ee(a),D("Question creee avec succes!"),e.reset(),await $(),await z()}catch(a){console.error("Erreur creation question:",a),Q("create-question-error",a.message||"Erreur lors de la creation")}finally{o.disabled=!1,o.innerHTML=s}}async function Ie(t){const e=t.target.files[0];if(e)try{Re("json-preview");const o=await e.text(),s=JSON.parse(o);qe(s),Ne(s,e.name)}catch(o){console.error("Erreur lecture JSON:",o),Q("json-preview",o.message||"Fichier JSON invalide")}}function qe(t){if(!t.module||!t.month||!t.year)throw new Error("Champs obligatoires manquants: module, month, year");if(!Array.isArray(t.questions)||t.questions.length===0)throw new Error("Le fichier doit contenir au moins une question");return t.questions.forEach((e,o)=>{if(!e.question||e.question.length<10)throw new Error(`Question ${o+1}: texte trop court (min 10 caracteres)`);if(!Array.isArray(e.options)||e.options.length!==4)throw new Error(`Question ${o+1}: doit avoir exactement 4 options`);if(e.correctAnswer===void 0||e.correctAnswer<0||e.correctAnswer>3)throw new Error(`Question ${o+1}: correctAnswer invalide (doit etre 0-3)`);if(!e.explanation||e.explanation.length<20)throw new Error(`Question ${o+1}: explication trop courte (min 20 caracteres)`)}),!0}function Ne(t,e){const o=document.getElementById("json-preview");if(!o)return;const s={auto:"Auto",loisir:"Loisir",vr:"VR",tracteur:"Tracteur"},a=["Janvier","Fevrier","Mars","Avril","Mai","Juin","Juillet","Aout","Septembre","Octobre","Novembre","Decembre"];o.innerHTML=`
        <div class="bg-green-50 border-2 border-green-500 rounded-xl p-6">
            <div class="flex items-start justify-between mb-4">
                <div>
                    <h4 class="text-lg font-bold text-green-900 mb-2">📄 ${e}</h4>
                    <div class="space-y-1 text-sm">
                        <p class="text-green-800">✓ Format valide</p>
                        <p class="text-green-800">✓ ${t.questions.length} question(s) detectee(s)</p>
                        <p class="text-green-800">✓ Module: ${s[t.module]||t.module}</p>
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
    `,document.getElementById("confirm-import-btn")?.addEventListener("click",()=>Ue(t)),document.getElementById("cancel-import-btn")?.addEventListener("click",()=>{o.innerHTML="",document.getElementById("json-file-input").value=""})}async function Ue(t){const e=document.getElementById("json-preview"),o=document.getElementById("confirm-import-btn");try{if(o.disabled=!0,o.innerHTML='<svg class="animate-spin h-5 w-5 inline" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle></svg> Import en cours...',w()){console.log("📝 Mode démo : Simulation import JSON..."),await new Promise(r=>setTimeout(r,1e3));const a=t.questions||[];a.forEach((r,n)=>{M.unshift({id:`demo-imported-${Date.now()}-${n}`,question:r.question,options:r.options,correctAnswer:r.correctAnswer,explanation:r.explanation||"Pas d'explication fournie",module:t.module,month:t.month,year:t.year,createdAt:new Date})}),R(M),D(`✅ Import terminé (mode démo): ${a.length} questions importées`),e.innerHTML="",document.getElementById("json-file-input").value="",await $(),await z();return}const s=await Ae(t);D(`Import termine: ${s.success}/${s.total} questions importees`),s.errors.length>0&&console.warn("Erreurs import:",s.errors),e.innerHTML="",document.getElementById("json-file-input").value="",await $(),await z()}catch(s){console.error("Erreur import:",s),Q("json-preview",s.message||"Erreur lors de l import")}}function Qe(t){S.find(o=>o.id===t)&&alert(`Edition de la question ${t}
A implementer: modal d'edition`)}async function je(t){const e=S.find(s=>s.id===t);if(!(!e||!confirm(`Voulez-vous vraiment supprimer cette question?

"${e.question.substring(0,100)}..."

Cette action est irreversible.`)))try{if(w()){console.log("📝 Mode démo : Simulation suppression question..."),await new Promise(a=>setTimeout(a,300));const s=M.findIndex(a=>a.id===t);s>-1&&(M.splice(s,1),R(M)),D("✅ Question supprimée avec succès (mode démo)"),await $(),await z();return}await Se(t),D("Question supprimee avec succes"),await $(),await z()}catch(s){console.error("Erreur suppression:",s),Q("questions-list",s.message||"Erreur lors de la suppression")}}async function H(t){const e=t.target.id.replace("filter-","");y[e]=t.target.value,A=1,await $()}function He(t){const e=t.target.value.toLowerCase();if(!e){U();return}const o=S.filter(r=>r.question.toLowerCase().includes(e)||r.options.some(n=>n.toLowerCase().includes(e))||r.explanation.toLowerCase().includes(e)),s=document.getElementById("questions-list");if(!s)return;if(o.length===0){const r=document.createElement("div");r.className="text-center py-12 text-slate-500",r.innerHTML=`
            <p class="text-lg">Aucun resultat pour "${L(e)}"</p>
        `,s.replaceChildren(r);return}const a=document.createDocumentFragment();o.forEach(r=>{a.appendChild(re(r))}),s.replaceChildren(a)}function J(t){const e=Math.ceil(S.length/N);A+=t,A<1&&(A=1),A>e&&(A=e),U(),window.scrollTo({top:0,behavior:"smooth"})}function Fe(){const t=Math.ceil(S.length/N),e=document.getElementById("page-info"),o=document.getElementById("prev-page-btn"),s=document.getElementById("next-page-btn");e&&(e.textContent=`Page ${A}/${t||1}`),o&&(o.disabled=A===1),s&&(s.disabled=A===t||t===0)}async function z(){try{if(w()){console.log("📊 Mode démo : Chargement des stats simulées..."),G(Me);return}const t=await ye();G(t)}catch(t){console.error("Erreur chargement stats:",t)}}function G(t){const e=document.getElementById("questions-stats");if(!e)return;const o={auto:"Auto",loisir:"Loisir",vr:"VR",tracteur:"Tracteur"};e.innerHTML=`
        <div class="bg-white rounded-xl shadow-md p-6">
            <h3 class="text-xl font-bold text-slate-900 mb-4">📊 Statistiques des Questions</h3>
            
            <div class="mb-6">
                <p class="text-3xl font-bold text-indigo-600 mb-1">${t.total}</p>
                <p class="text-sm text-slate-600">questions au total</p>
            </div>
            
            <div class="space-y-3">
                <p class="text-sm font-semibold text-slate-700 mb-2">Par module:</p>
                ${Object.entries(t.byModule).map(([s,a])=>{const r=(a/t.total*100).toFixed(0);return`
                        <div>
                            <div class="flex justify-between text-sm mb-1">
                                <span class="text-slate-700">${o[s]||s}</span>
                                <span class="font-semibold">${a} (${r}%)</span>
                            </div>
                            <div class="bg-slate-200 rounded-full h-2">
                                <div class="bg-indigo-600 rounded-full h-2 transition-all" style="width: ${r}%"></div>
                            </div>
                        </div>
                    `}).join("")}
            </div>
        </div>
    `}function Re(t){const e=document.getElementById(t);e&&(e.innerHTML=`
        <div class="text-center py-12">
            <svg class="animate-spin h-12 w-12 mx-auto text-indigo-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-slate-600 mt-4">Chargement...</p>
        </div>
    `)}function Q(t,e){const o=document.getElementById(t);if(!o){alert(`Erreur: ${e}`);return}o.innerHTML=`
        <div class="bg-red-50 border-2 border-red-500 rounded-xl p-6 text-center">
            <svg class="w-12 h-12 mx-auto text-red-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-red-900 font-semibold">${e}</p>
        </div>
    `}function D(t){const e=document.createElement("div");e.className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-xl z-50 animate-fade-in",e.innerHTML=`
        <div class="flex items-center gap-3">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span class="font-semibold">${t}</span>
        </div>
    `,document.body.appendChild(e),setTimeout(()=>{e.remove()},3e3)}function L(t){const e=document.createElement("div");return e.textContent=t,e.innerHTML}const Pe=[{id:"1",email:"admin@avantage-quizz.com",displayName:"Administrateur Principal",role:"admin",totalQuizzes:0,averageScore:0,createdAt:new Date("2025-01-15"),lastLogin:new Date},{id:"2",email:"alice.dupont@example.com",displayName:"Alice Dupont",role:"user",totalQuizzes:24,averageScore:92,createdAt:new Date("2025-02-20"),lastLogin:new Date},{id:"3",email:"bob.martin@example.com",displayName:"Bob Martin",role:"user",totalQuizzes:21,averageScore:88,createdAt:new Date("2025-03-10"),lastLogin:new Date(Date.now()-864e5)},{id:"4",email:"claire.bernard@example.com",displayName:"Claire Bernard",role:"user",totalQuizzes:19,averageScore:85,createdAt:new Date("2025-03-25"),lastLogin:new Date(Date.now()-1728e5)},{id:"5",email:"david.dubois@example.com",displayName:"David Dubois",role:"user",totalQuizzes:18,averageScore:83,createdAt:new Date("2025-04-05"),lastLogin:new Date(Date.now()-2592e5)}],Oe={total:42,admins:2,regularUsers:40,activeToday:8,activeWeek:23};let f=[],b={role:"",status:"all"},h={lastDoc:null,hasMore:!1,isLoading:!1,pageSize:20};async function Ve(){console.log("Initialisation du gestionnaire utilisateurs"),await P(),await ie(),We()}function We(){const t=document.getElementById("create-user-form");t&&t.addEventListener("submit",Je);const e=document.getElementById("generate-password-btn");e&&e.addEventListener("click",Ge);const o=document.getElementById("filter-user-role"),s=document.getElementById("filter-user-status"),a=document.getElementById("search-users");o&&o.addEventListener("change",K),s&&s.addEventListener("change",K),a&&a.addEventListener("input",tt)}async function Je(t){t.preventDefault();const e=document.getElementById("create-user-error"),o=document.getElementById("create-user-success"),s=document.getElementById("create-user-btn");e.classList.add("hidden"),o.classList.add("hidden");const a=new FormData(t.target),r={displayName:a.get("displayName"),email:a.get("email"),password:a.get("password"),role:a.get("role")};if(!r.displayName||!r.email||!r.password||!r.role){F(e,"Tous les champs sont obligatoires"),m.error("Veuillez remplir tous les champs");return}if(r.password.length<6){F(e,"Le mot de passe doit contenir au moins 6 caractères"),m.error("Mot de passe trop court (minimum 6 caractères)");return}s.disabled=!0,s.textContent="⏳ Création en cours...";const n=m.showLoadingToast("Création de l'utilisateur...");try{throw console.log("Création d'un nouvel utilisateur:",r.email),m.updateLoadingToast(n,"Cloud Function requise","error"),new Error(`⚠️ CLOUD FUNCTION REQUISE: Cette fonctionnalité nécessite une Cloud Function Firebase pour créer des utilisateurs avec mot de passe. Actuellement, seule l'authentification Google est supportée. Pour activer cette fonctionnalité:

1. Activer Email/Password dans Firebase Auth
2. Créer une Cloud Function createUser
3. Déployer la fonction sur Firebase`)}catch(l){console.error("❌ Erreur création utilisateur:",l),F(e,l.message)}finally{s.disabled=!1,s.textContent="➕ Créer l'utilisateur"}}function Ge(){const t="ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$%&";let o="";for(let a=0;a<12;a++)o+=t.charAt(Math.floor(Math.random()*t.length));const s=document.querySelector('input[name="password"]');s&&(s.value=o,s.type="text",navigator.clipboard.writeText(o).then(()=>{m.success("Mot de passe généré et copié ! Sauvegardez-le en lieu sûr.",5e3)}).catch(()=>{m.warning(`Mot de passe généré: ${o}

Copiez-le manuellement.`,7e3)}))}function F(t,e){t.textContent=e,t.classList.remove("hidden"),t.scrollIntoView({behavior:"smooth",block:"nearest"})}async function P(){try{if(document.getElementById("users-list")&&B("users-list",be(10)),w()){console.log("👥 Mode démo : Chargement des utilisateurs simulés..."),await new Promise(s=>setTimeout(s,500)),f=Pe.filter(s=>{if(b.role&&s.role!==b.role)return!1;if(b.status!=="all"){const a=new Date;a.setDate(a.getDate()-7);const n=s.lastLogin>a;if(b.status==="active"&&!n||b.status==="inactive"&&n)return!1}return!0}),console.log(`✅ ${f.length} utilisateurs simulés chargés`),I();return}const e={};b.role&&(e.role=b.role),h.lastDoc=null,h.hasMore=!1;const o=await ee(e,h.pageSize,null);if(f=o.users,h.lastDoc=o.lastDoc,h.hasMore=o.hasMore,b.status!=="all"){const s=new Date;s.setDate(s.getDate()-7),f=f.filter(a=>{if(!a.lastLogin)return b.status==="inactive";const n=(a.lastLogin.toDate?a.lastLogin.toDate():new Date(a.lastLogin))>s;return b.status==="active"?n:!n})}console.log(`Utilisateurs charges: ${f.length}`),I(),ne()}catch(t){console.error("Erreur chargement utilisateurs:",t);const e=document.getElementById("users-list");if(e){const o=v(t.message);e.innerHTML=`
                <div class="text-center py-12 text-red-500">
                    <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p class="text-lg font-medium">Erreur lors du chargement</p>
                    <p class="text-sm">${o}</p>
                </div>
            `}}}function I(){const t=document.getElementById("users-list");if(t){if(f.length===0){t.innerHTML=`
            <div class="text-center py-12 text-slate-500">
                <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <p class="text-lg font-medium">Aucun utilisateur trouve</p>
            </div>
        `;return}t.innerHTML=f.map(e=>_e(e)).join(""),Ze()}}async function Ke(){if(!(h.isLoading||!h.hasMore))try{h.isLoading=!0;const t={};b.role&&(t.role=b.role);const e=await ee(t,h.pageSize,h.lastDoc);let o=e.users;if(b.status!=="all"){const s=new Date;s.setDate(s.getDate()-7),o=o.filter(a=>{if(!a.lastLogin)return b.status==="inactive";const n=(a.lastLogin.toDate?a.lastLogin.toDate():new Date(a.lastLogin))>s;return b.status==="active"?n:!n})}f=[...f,...o],h.lastDoc=e.lastDoc,h.hasMore=e.hasMore,I(),ne(),console.log(`✅ ${o.length} utilisateurs supplémentaires chargés`)}catch(t){console.error("❌ Erreur chargement utilisateurs supplémentaires:",t),m.error("Erreur lors du chargement des utilisateurs supplémentaires")}finally{h.isLoading=!1}}function ne(){const t=document.getElementById("users-pagination-controls");if(t&&t.remove(),!h.hasMore&&f.length<=h.pageSize)return;const e=document.getElementById("users-list");if(!e)return;const o=`
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
    `;e.insertAdjacentHTML("beforeend",o);const s=document.getElementById("load-more-users-btn");s&&s.addEventListener("click",Ke)}function _e(t){const e=t.role==="admin",o=e?"yellow":"blue",s=e?"🔰":"👤",a=t.lastLogin?t.lastLogin.toDate?t.lastLogin.toDate():new Date(t.lastLogin):null,r=t.createdAt?t.createdAt.toDate?t.createdAt.toDate():new Date(t.createdAt):null,n=a&&new Date-a<10080*60*1e3,l=a?st(a):"Jamais connecte",i=v(t.displayName||"Sans nom"),c=v(t.email||""),g=v(t.displayName||"User"),u=t.photoURL||`https://ui-avatars.com/api/?name=${encodeURIComponent(t.displayName||t.email)}&background=667eea&color=fff&size=128`;return`
        <div class="user-card bg-white rounded-xl shadow-md p-6 mb-4 hover:shadow-lg transition-shadow" data-user-id="${t.uid}">
            <div class="flex items-start gap-4">
                <img src="${u}" alt="${g}" class="w-16 h-16 rounded-full object-cover flex-shrink-0" onerror="this.src='https://ui-avatars.com/api/?name=U&background=667eea&color=fff&size=128'">
                
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-2">
                        <div>
                            <h4 class="text-lg font-bold text-slate-900 truncate">${i}</h4>
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
                        <span class="inline-flex items-center gap-1 bg-${o}-100 text-${o}-700 text-xs font-semibold px-3 py-1 rounded-full">
                            ${s} ${e?"Admin":"User"}
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
                            <p class="font-medium text-slate-900">${l}</p>
                        </div>
                    </div>
                    
                    ${e?"":Ye(t)}
                </div>
            </div>
        </div>
    `}function Ye(t){const e=t.totalQuizzes||0,o=t.averageScore||0,s=t.currentStreak||0;return`
        <div class="mt-4 pt-4 border-t border-slate-200 grid grid-cols-3 gap-4 text-center">
            <div>
                <p class="text-2xl font-bold text-indigo-600">${o}%</p>
                <p class="text-xs text-slate-600">Score moyen</p>
            </div>
            <div>
                <p class="text-2xl font-bold text-purple-600">${e}</p>
                <p class="text-xs text-slate-600">Quiz completes</p>
            </div>
            <div>
                <p class="text-2xl font-bold text-orange-600">🔥 ${s}</p>
                <p class="text-xs text-slate-600">Serie active</p>
            </div>
        </div>
    `}function Ze(){document.querySelectorAll(".edit-user-btn").forEach(t=>{t.addEventListener("click",e=>{const o=e.currentTarget.dataset.userId,s=e.currentTarget.dataset.userEmail,a=e.currentTarget.dataset.userRole;Xe(o,s,a)})})}function Xe(t,e,o){const s=document.createElement("div");s.id="edit-role-modal",s.className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",s.innerHTML=`
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
                <p class="font-semibold text-slate-900">${v(e||"")}</p>
            </div>
            
            <div class="mb-6">
                <p class="text-slate-700 font-medium mb-3">Role actuel: <span class="text-indigo-600">${o==="admin"?"Admin":"User"}</span></p>
                
                <p class="text-sm font-semibold text-slate-700 mb-2">Modifier le role:</p>
                <div class="space-y-3">
                    <label class="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-indigo-500 transition ${o!=="admin"?"border-indigo-500 bg-indigo-50":"border-slate-200"}">
                        <input type="radio" name="role" value="user" ${o!=="admin"?"checked":""} class="mt-1">
                        <div>
                            <p class="font-semibold text-slate-900">👤 User (Utilisateur standard)</p>
                            <p class="text-sm text-slate-600">Acces uniquement au tableau de bord et aux quiz</p>
                        </div>
                    </label>
                    
                    <label class="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-yellow-500 transition ${o==="admin"?"border-yellow-500 bg-yellow-50":"border-slate-200"}">
                        <input type="radio" name="role" value="admin" ${o==="admin"?"checked":""} class="mt-1">
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
    `,document.body.appendChild(s),document.getElementById("close-modal-btn")?.addEventListener("click",()=>s.remove()),document.getElementById("cancel-role-btn")?.addEventListener("click",()=>s.remove()),document.getElementById("save-role-btn")?.addEventListener("click",async()=>{const a=s.querySelector('input[name="role"]:checked')?.value;a&&(await et(t,e,a),s.remove())}),s.addEventListener("click",a=>{a.target===s&&s.remove()})}async function et(t,e,o){const s=document.getElementById("save-role-btn");if(!s)return;const a=s.innerHTML,r=m.showLoadingToast("Mise à jour du rôle...");try{s.disabled=!0,s.innerHTML='<svg class="animate-spin h-5 w-5 inline" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle></svg> Mise a jour...',await he(t,o),m.updateLoadingToast(r,`Rôle mis à jour pour ${e}`,"success"),ot(`Role mis a jour pour ${e}: ${o==="admin"?"Admin":"User"}`),await P(),await ie()}catch(n){console.error("Erreur mise a jour role:",n),m.updateLoadingToast(r,"Erreur de mise à jour","error"),m.error(`Erreur: ${n.message||"Impossible de mettre a jour le role"}`,4e3),s.disabled=!1,s.innerHTML=a}}async function K(t){const e=t.target.id.replace("filter-user-","").replace("-","");b[e]=t.target.value,await P()}function tt(t){const e=t.target.value.toLowerCase();if(!e){I();return}const o=f.filter(r=>r.displayName&&r.displayName.toLowerCase().includes(e)||r.email&&r.email.toLowerCase().includes(e)),s=document.getElementById("users-list");if(!s)return;if(o.length===0){const r=v(e);s.innerHTML=`
            <div class="text-center py-12 text-slate-500">
                <p class="text-lg">Aucun resultat pour "${r}"</p>
            </div>
        `;return}const a=f;f=o,I(),f=a}async function ie(){try{if(w()){console.log("📊 Mode démo : Chargement des stats utilisateurs simulées..."),_(Oe);return}const t=await ge();_(t)}catch(t){console.error("Erreur chargement stats:",t)}}function _(t){const e=document.getElementById("users-stats");if(!e)return;const o=t.total>0?Math.round(t.activeLastWeek/t.total*100):0;e.innerHTML=`
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
                        <span class="font-semibold">${t.activeLastWeek} (${o}%)</span>
                    </div>
                    <div class="bg-slate-200 rounded-full h-2">
                        <div class="bg-green-500 rounded-full h-2 transition-all" style="width: ${o}%"></div>
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
    `}function ot(t){const e=document.createElement("div");e.className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-xl z-50 animate-fade-in";const o=v(t);e.innerHTML=`
        <div class="flex items-center gap-3">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span class="font-semibold">${o}</span>
        </div>
    `,document.body.appendChild(e),setTimeout(()=>{e.remove()},3e3)}function st(t){const o=new Date-t,s=Math.floor(o/6e4),a=Math.floor(o/36e5),r=Math.floor(o/864e5);return s<1?"A l instant":s<60?`Il y a ${s} min`:a<24?`Il y a ${a}h`:r===1?"Hier":r<7?`Il y a ${r} jours`:r<30?`Il y a ${Math.floor(r/7)} semaines`:t.toLocaleDateString("fr-FR")}const O={stats:{totalUsers:42,totalQuizzes:156,totalQuestions:240,totalResources:35,avgScore:78,activeUsersToday:8,activeUsersWeek:23,quizzesToday:12,quizzesWeek:67},topUsers:[{id:"1",email:"alice.dupont@example.com",displayName:"Alice Dupont",totalQuizzes:24,averageScore:92},{id:"2",email:"bob.martin@example.com",displayName:"Bob Martin",totalQuizzes:21,averageScore:88},{id:"3",email:"claire.bernard@example.com",displayName:"Claire Bernard",totalQuizzes:19,averageScore:85},{id:"4",email:"david.dubois@example.com",displayName:"David Dubois",totalQuizzes:18,averageScore:83},{id:"5",email:"emma.petit@example.com",displayName:"Emma Petit",totalQuizzes:16,averageScore:81},{id:"6",email:"francois.roux@example.com",displayName:"François Roux",totalQuizzes:15,averageScore:79},{id:"7",email:"julie.moreau@example.com",displayName:"Julie Moreau",totalQuizzes:14,averageScore:76},{id:"8",email:"lucas.simon@example.com",displayName:"Lucas Simon",totalQuizzes:13,averageScore:74},{id:"9",email:"marie.laurent@example.com",displayName:"Marie Laurent",totalQuizzes:12,averageScore:72},{id:"10",email:"nicolas.michel@example.com",displayName:"Nicolas Michel",totalQuizzes:11,averageScore:70}],recentActivity:[{id:"1",userName:"Alice Dupont",module:"Auto - Novembre",score:95,completedAt:new Date(Date.now()-3e5)},{id:"2",userName:"Emma Petit",module:"Loisir - Novembre",score:90,completedAt:new Date(Date.now()-72e4)},{id:"3",userName:"Bob Martin",module:"VR - Novembre",score:88,completedAt:new Date(Date.now()-138e4)},{id:"4",userName:"Claire Bernard",module:"Auto - Octobre",score:82,completedAt:new Date(Date.now()-27e5)},{id:"5",userName:"David Dubois",module:"Tracteur - Octobre",score:79,completedAt:new Date(Date.now()-36e5)}],moduleStats:[{module:"Auto",questionsCount:85,avgScore:76,completions:67},{module:"Loisir",questionsCount:62,avgScore:81,completions:45},{module:"VR",questionsCount:54,avgScore:73,completions:32},{module:"Tracteur",questionsCount:39,avgScore:79,completions:28}]};x.set("globalStats",{totalUsers:0,totalQuizzes:0,totalQuestions:0,totalResources:0,avgScore:0,activeUsersToday:0,activeUsersWeek:0,quizzesToday:0,quizzesWeek:0});x.set("chartProgress",null);x.set("chartModules",null);x.set("chartActivity",null);async function le(){d.info("📊 Initialisation du dashboard admin avancé"),ht();try{await Promise.all([at(),rt(),nt(),ce()]),it(),pt(),m.success("Dashboard chargé avec succès !",3e3)}catch(t){d.error("❌ Erreur chargement dashboard:",t),m.error("Erreur lors du chargement du dashboard",4e3)}}async function at(){try{let t=x.get("globalStats");if(w()){d.info("📊 Mode démo : Chargement des statistiques simulées..."),t=O.stats,x.set("globalStats",t),Y(),d.info("✅ Statistiques simulées chargées:",t);return}d.info("📈 Chargement des statistiques globales...");const e=await C(T(k,"users"));t.totalUsers=e.size;const o=await C(T(k,"quizResults"));t.totalQuizzes=o.size;let s=0;o.forEach(p=>{s+=p.data().score||0}),t.avgScore=o.size>0?Math.round(s/o.size):0;const a=await C(T(k,"questions"));t.totalQuestions=a.size;const r=await C(T(k,"resources"));t.totalResources=r.size;const n=new Date;n.setHours(0,0,0,0);let l=0;e.forEach(p=>{const E=p.data().lastLogin?.toDate();E&&E>=n&&l++}),t.activeUsersToday=l;const i=new Date;i.setDate(i.getDate()-7);let c=0;e.forEach(p=>{const E=p.data().lastLogin?.toDate();E&&E>=i&&c++}),t.activeUsersWeek=c;let g=0;o.forEach(p=>{const E=p.data().completedAt?.toDate();E&&E>=n&&g++}),t.quizzesToday=g;let u=0;o.forEach(p=>{const E=p.data().completedAt?.toDate();E&&E>=i&&u++}),t.quizzesWeek=u,x.set("globalStats",t),Y(),d.info("✅ Statistiques globales chargées:",t)}catch(t){throw d.error("❌ Erreur chargement stats globales:",t),t}}async function rt(){try{if(w()){d.info("🏆 Mode démo : Chargement du top 10 simulé..."),Z(O.topUsers),d.info("✅ Top 10 simulé chargé");return}d.info("🏆 Chargement du top 10 utilisateurs...");const t=te(T(k,"quizResults"),oe("completedAt","desc"),se(1e3)),e=await C(t),o={};e.forEach(a=>{const r=a.data(),n=r.userId,l=r.score||0;o[n]||(o[n]={userId:n,userName:r.userName||"Utilisateur",totalQuizzes:0,totalScore:0,avgScore:0}),o[n].totalQuizzes++,o[n].totalScore+=l}),Object.values(o).forEach(a=>{a.avgScore=Math.round(a.totalScore/a.totalQuizzes)});const s=Object.values(o).sort((a,r)=>r.avgScore-a.avgScore).slice(0,10);Z(s),d.info("✅ Top 10 utilisateurs chargé:",s)}catch(t){throw d.error("❌ Erreur chargement top users:",t),t}}async function nt(){try{if(w()){d.info("📅 Mode démo : Chargement de l'activité simulée..."),X(O.recentActivity),d.info("✅ Activité simulée chargée");return}d.info("📅 Chargement de l'activité récente...");const t=te(T(k,"quizResults"),oe("completedAt","desc"),se(10)),e=await C(t),o=[];e.forEach(s=>{const a=s.data();o.push({id:s.id,userName:a.userName||"Utilisateur",module:a.module||"Module",score:a.score||0,completedAt:a.completedAt?.toDate()||new Date})}),X(o),d.info("✅ Activité récente chargée:",o)}catch(t){throw d.error("❌ Erreur chargement activité:",t),t}}async function ce(){try{if(w()){d.info("📊 Mode démo : Chargement des stats modules simulées...");const o={Auto:{count:85,totalScore:6460,avgScore:76},Loisir:{count:62,totalScore:5022,avgScore:81},VR:{count:54,totalScore:3942,avgScore:73},Tracteur:{count:39,totalScore:3081,avgScore:79}};return d.info("✅ Stats modules simulées chargées:",o),o}d.info("📊 Chargement des stats par module...");const t=await C(T(k,"quizResults")),e={};return t.forEach(o=>{const s=o.data(),a=s.module||"Autre";e[a]||(e[a]={count:0,totalScore:0,avgScore:0}),e[a].count++,e[a].totalScore+=s.score||0}),Object.values(e).forEach(o=>{o.avgScore=Math.round(o.totalScore/o.count)}),d.info("✅ Stats par module chargées:",e),e}catch(t){throw d.error("❌ Erreur chargement stats modules:",t),t}}function Y(){const t=document.getElementById("global-stats-cards");if(!t)return;const e=x.get("globalStats");t.innerHTML=`
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
            <h3 class="text-4xl font-black mb-1">${v(String(e.totalUsers))}</h3>
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
        <div class="bg-ap-gradient-gold rounded-xl p-6 text-white shadow-ap-gold-lg hover:shadow-ap-gold transition-all">
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
        <div class="bg-gradient-to-br from-ap-warning to-ap-warning-dark rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all">
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
    `}function Z(t){const e=document.getElementById("top-users-list");if(!e)return;if(t.length===0){const s=document.createElement("div");s.className="text-center py-8 text-slate-500",s.innerHTML=`
            <svg class="w-12 h-12 mx-auto mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <p class="font-medium">Aucun utilisateur</p>
        `,e.replaceChildren(s);return}const o=document.createDocumentFragment();t.forEach((s,a)=>{const r=a===0?"🥇":a===1?"🥈":a===2?"🥉":`${a+1}.`,n=a===0?"bg-ap-gold-light border-ap-gold":a===1?"bg-slate-50 border-slate-300":a===2?"bg-ap-warning-light border-ap-warning":"bg-white border-slate-200",l=s.userName||s.displayName||s.email||"Utilisateur",i=v(l),c=Number.isFinite(s.totalQuizzes)?s.totalQuizzes:0,g=Number.isFinite(s.avgScore)?s.avgScore:0,u=document.createElement("article");u.className=`flex items-center justify-between p-4 rounded-lg border ${n} hover:shadow-md transition-shadow`,u.innerHTML=`
            <div class="flex items-center gap-4">
                <span class="text-2xl font-bold w-8">${v(r)}</span>
                <div>
                    <h4 class="font-semibold text-slate-900">${i}</h4>
                    <p class="text-sm text-slate-600">${v(`${c} quiz complétés`)}</p>
                </div>
            </div>
            <div class="text-right">
                <div class="text-2xl font-bold text-ap-success">${v(`${g}%`)}</div>
                <div class="text-xs text-slate-500">Score moyen</div>
            </div>
        `,o.appendChild(u)}),e.replaceChildren(o)}function X(t){const e=document.getElementById("recent-activity-list");if(!e)return;if(t.length===0){const s=document.createElement("div");s.className="text-center py-8 text-slate-500",s.innerHTML=`
            <svg class="w-12 h-12 mx-auto mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="font-medium">Aucune activité récente</p>
        `,e.replaceChildren(s);return}const o=document.createDocumentFragment();t.forEach(s=>{const a=ft(s.completedAt),r=v(a),n=s.score>=80?"text-green-600":s.score>=60?"text-yellow-600":"text-red-600",l=s.userName||"Utilisateur",i=v(l),c=v(s.module||"Module"),g=v(`${Number.isFinite(s.score)?s.score:0}%`),u=v(l.charAt(0).toUpperCase()),p=document.createElement("article");p.className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors",p.innerHTML=`
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-ap-red-100 rounded-full flex items-center justify-center">
                    <span class="text-lg font-bold text-ap-red-primary">${u}</span>
                </div>
                <div>
                    <p class="font-medium text-slate-900">${i}</p>
                    <p class="text-sm text-slate-600">${c}</p>
                </div>
            </div>
            <div class="text-right">
                <div class="text-lg font-bold ${n}">${g}</div>
                <div class="text-xs text-slate-500">${r}</div>
            </div>
        `,o.appendChild(p)}),e.replaceChildren(o)}function it(){lt(),ct(),dt()}async function lt(){const t=document.getElementById("chart-progress");if(t)try{let e,o,s;if(w()){d.info("📈 Mode démo : Création graphique progression simulé..."),e=[],o=[],s=[];for(let n=29;n>=0;n--){const l=new Date;l.setDate(l.getDate()-n),e.push(l.toLocaleDateString("fr-FR",{day:"2-digit",month:"short"})),o.push(Math.floor(Math.random()*15)+5),s.push(Math.floor(Math.random()*20)+70)}}else{const n=new Date;n.setDate(n.getDate()-30);const l=await C(T(k,"quizResults")),i={};for(let c=0;c<30;c++){const g=new Date;g.setDate(g.getDate()-c);const u=g.toISOString().split("T")[0];i[u]={count:0,totalScore:0}}l.forEach(c=>{const g=c.data(),u=g.completedAt?.toDate();if(u&&u>=n){const p=u.toISOString().split("T")[0];i[p]&&(i[p].count++,i[p].totalScore+=g.score||0)}}),e=Object.keys(i).reverse().map(c=>new Date(c).toLocaleDateString("fr-FR",{day:"2-digit",month:"short"})),o=Object.values(i).reverse().map(c=>c.count),s=Object.values(i).reverse().map(c=>c.count>0?Math.round(c.totalScore/c.count):0)}const a=x.get("chartProgress");a&&a.destroy();const r=new Chart(t,{type:"line",data:{labels:e,datasets:[{label:"Quiz complétés",data:o,borderColor:"rgb(196, 30, 58)",backgroundColor:"rgba(196, 30, 58, 0.1)",tension:.4,yAxisID:"y",pointBackgroundColor:"rgb(196, 30, 58)",pointBorderColor:"#fff",pointBorderWidth:2},{label:"Score moyen (%)",data:s,borderColor:"rgb(212, 175, 55)",backgroundColor:"rgba(212, 175, 55, 0.1)",tension:.4,yAxisID:"y1",pointBackgroundColor:"rgb(212, 175, 55)",pointBorderColor:"#fff",pointBorderWidth:2}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},scales:{y:{type:"linear",display:!0,position:"left",title:{display:!0,text:"Nombre de quiz"}},y1:{type:"linear",display:!0,position:"right",title:{display:!0,text:"Score moyen (%)"},grid:{drawOnChartArea:!1}}},plugins:{legend:{position:"top"},title:{display:!0,text:"Évolution sur 30 jours"}}}});x.set("chartProgress",r)}catch(e){d.error("❌ Erreur création graphique progression:",e)}}async function ct(){const t=document.getElementById("chart-modules");if(t)try{const e=await ce(),o=Object.keys(e),s=Object.values(e).map(l=>l.count),a=["rgba(196, 30, 58, 0.9)","rgba(212, 175, 55, 0.9)","rgba(40, 167, 69, 0.9)","rgba(255, 159, 67, 0.9)","rgba(139, 20, 41, 0.9)"],r=x.get("chartModules");r&&r.destroy();const n=new Chart(t,{type:"doughnut",data:{labels:o,datasets:[{data:s,backgroundColor:a,borderWidth:2,borderColor:"#fff"}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"bottom"},title:{display:!0,text:"Répartition par module"}}}});x.set("chartModules",n)}catch(e){d.error("❌ Erreur création graphique modules:",e)}}async function dt(){const t=document.getElementById("chart-activity");if(t)try{const e=[],o=[];for(let r=6;r>=0;r--){const n=new Date;n.setDate(n.getDate()-r),e.push(n.toLocaleDateString("fr-FR",{weekday:"short"})),o.push(Math.floor(Math.random()*20)+5)}const s=x.get("chartActivity");s&&s.destroy();const a=new Chart(t,{type:"bar",data:{labels:e,datasets:[{label:"Utilisateurs actifs",data:o,backgroundColor:"rgba(196, 30, 58, 0.8)",borderColor:"rgb(196, 30, 58)",borderWidth:2,borderRadius:4,hoverBackgroundColor:"rgba(196, 30, 58, 1)"}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1},title:{display:!0,text:"Activité des 7 derniers jours"}},scales:{y:{beginAtZero:!0,ticks:{stepSize:5}}}}});x.set("chartActivity",a)}catch(e){d.error("❌ Erreur création graphique activité:",e)}}async function ut(){const t=m.showLoadingToast("Génération du PDF...");try{const{jsPDF:e}=window.jspdf,o=new e;o.setFontSize(20),o.text("Dashboard Admin - QuizPro",20,20),o.setFontSize(10),o.text(`Généré le ${new Date().toLocaleDateString("fr-FR")}`,20,30),o.setFontSize(14),o.text("Statistiques Globales",20,45),o.setFontSize(10);let s=55;o.text(`Total Utilisateurs: ${globalStats.totalUsers}`,25,s),s+=7,o.text(`Total Quiz: ${globalStats.totalQuizzes}`,25,s),s+=7,o.text(`Score Moyen: ${globalStats.avgScore}%`,25,s),s+=7,o.text(`Questions: ${globalStats.totalQuestions}`,25,s),s+=7,o.text(`Ressources: ${globalStats.totalResources}`,25,s),o.save(`dashboard-admin-${new Date().toISOString().split("T")[0]}.pdf`),m.updateLoadingToast(t,"PDF généré avec succès !","success")}catch(e){d.error("❌ Erreur export PDF:",e),m.updateLoadingToast(t,"Erreur d'export PDF","error"),m.error("Erreur: Assurez-vous que jsPDF est chargé",4e3)}}async function mt(){const t=m.showLoadingToast("Génération du CSV...");try{const e=await C(T(k,"quizResults")),o=["Date","Utilisateur","Module","Mois","Année","Score (%)","Bonnes réponses","Total questions","Temps (s)"],s=[];e.forEach(l=>{const i=l.data(),c=i.completedAt?.toDate().toLocaleString("fr-FR")||"N/A";s.push([c,i.userName||"Inconnu",i.module||"N/A",i.month||"N/A",i.year||"N/A",i.score||0,i.correctAnswers||0,i.totalQuestions||0,i.timeSpent||0])});const a=[o,...s].map(l=>l.join(",")).join(`
`),r=new Blob([a],{type:"text/csv;charset=utf-8;"}),n=document.createElement("a");n.href=URL.createObjectURL(r),n.download=`dashboard-complet-${new Date().toISOString().split("T")[0]}.csv`,n.click(),m.updateLoadingToast(t,"CSV généré avec succès !","success")}catch(e){d.error("❌ Erreur export CSV:",e),m.updateLoadingToast(t,"Erreur d'export CSV","error"),m.error("Erreur lors de l'export CSV",4e3)}}function pt(){document.getElementById("export-pdf-btn")?.addEventListener("click",ut),document.getElementById("export-csv-btn")?.addEventListener("click",mt),document.getElementById("period-filter")?.addEventListener("change",gt),document.getElementById("refresh-dashboard-btn")?.addEventListener("click",()=>{m.info("Actualisation du dashboard...",2e3),le()})}async function gt(t){const e=t.target.value;m.info(`Filtrage: ${e}`,2e3)}function ht(){document.getElementById("global-stats-cards")&&B("global-stats-cards",we(4)),document.getElementById("top-users-list")&&B("top-users-list",W(10)),document.getElementById("recent-activity-list")&&B("recent-activity-list",W(8));const s=document.getElementById("progress-chart");s&&(s.innerHTML=j());const a=document.getElementById("modules-chart");a&&(a.innerHTML=j());const r=document.getElementById("activity-chart");r&&(r.innerHTML=j())}function ft(t){const o=new Date-t,s=Math.floor(o/1e3),a=Math.floor(s/60),r=Math.floor(a/60),n=Math.floor(r/24);return n>0?`Il y a ${n}j`:r>0?`Il y a ${r}h`:a>0?`Il y a ${a}min`:"À l'instant"}Ce().then(t=>{console.log("Admin authentifié:",t.email),m.success(`Bienvenue ${t.displayName||t.email} !`,3e3);const e=document.getElementById("admin-name"),o=document.getElementById("admin-avatar");e&&(e.textContent=t.displayName||t.email),o&&t.photoURL&&(o.src=t.photoURL),le(),$e(),Ve(),vt()}).catch(t=>{console.error("Erreur authentification admin:",t)});function vt(){const t=document.getElementById("tab-dashboard-btn"),e=document.getElementById("tab-questions-btn"),o=document.getElementById("tab-users-btn"),s=document.getElementById("tab-dashboard"),a=document.getElementById("tab-questions"),r=document.getElementById("tab-users");function n(l,i){[t,e,o].forEach(c=>{c.classList.remove("border-ap-red-primary","text-ap-red-primary"),c.classList.add("border-transparent","text-slate-600"),c.setAttribute("aria-selected","false")}),[s,a,r].forEach(c=>{c.classList.add("tab-hidden")}),l.classList.remove("border-transparent","text-slate-600"),l.classList.add("border-ap-red-primary","text-ap-red-primary"),l.setAttribute("aria-selected","true"),i.classList.remove("tab-hidden")}t.addEventListener("click",()=>n(t,s)),e.addEventListener("click",()=>n(e,a)),o.addEventListener("click",()=>n(o,r))}document.getElementById("signout-link")?.addEventListener("click",t=>{t.preventDefault(),confirm("Voulez-vous vraiment vous déconnecter ?")&&fe().then(()=>{window.location.href="/"})});
//# sourceMappingURL=admin-DfaHGIxe.js.map
