(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const c of r.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&o(c)}).observe(document,{childList:!0,subtree:!0});function s(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(n){if(n.ep)return;n.ep=!0;const r=s(n);fetch(n.href,r)}})();/**
 * @license lucide v0.556.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide v0.556.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=([e,t,s])=>{const o=document.createElementNS("http://www.w3.org/2000/svg",e);return Object.keys(t).forEach(n=>{o.setAttribute(n,String(t[n]))}),s?.length&&s.forEach(n=>{const r=C(n);o.appendChild(r)}),o},N=(e,t={})=>{const o={...E,...t};return C(["svg",o,e])};/**
 * @license lucide v0.556.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T=e=>Array.from(e.attributes).reduce((t,s)=>(t[s.name]=s.value,t),{}),k=e=>typeof e=="string"?e:!e||!e.class?"":e.class&&typeof e.class=="string"?e.class.split(" "):e.class&&Array.isArray(e.class)?e.class:"",M=e=>e.flatMap(k).map(s=>s.trim()).filter(Boolean).filter((s,o,n)=>n.indexOf(s)===o).join(" "),O=e=>e.replace(/(\w)(\w*)(_|-|\s*)/g,(t,s,o)=>s.toUpperCase()+o.toLowerCase()),p=(e,{nameAttr:t,icons:s,attrs:o})=>{const n=e.getAttribute(t);if(n==null)return;const r=O(n),c=s[r];if(!c)return console.warn(`${e.outerHTML} icon name was not found in the provided icons object.`);const a=T(e),f={...E,"data-lucide":n,...o,...a},m=M(["lucide",`lucide-${n}`,a,o]);m&&Object.assign(f,{class:m});const A=N(c,f);return e.parentNode?.replaceChild(A,e)};/**
 * @license lucide v0.556.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=[["path",{d:"M12 7v14"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"}]];/**
 * @license lucide v0.556.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=[["path",{d:"M18 19a5 5 0 0 1-5-5v8"}],["path",{d:"M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v5"}],["circle",{cx:"13",cy:"12",r:"2"}],["circle",{cx:"20",cy:"19",r:"2"}]];/**
 * @license lucide v0.556.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"}]];/**
 * @license lucide v0.556.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2"}]];/**
 * @license lucide v0.556.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"}],["circle",{cx:"12",cy:"7",r:"4"}]];/**
 * @license lucide v0.556.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=({icons:e={},nameAttr:t="data-lucide",attrs:s={},root:o=document,inTemplates:n}={})=>{if(!Object.values(e).length)throw new Error(`Please provide an icons object.
If you want to use all the icons you can import it like:
 \`import { createIcons, icons } from 'lucide';
lucide.createIcons({icons});\``);if(typeof o>"u")throw new Error("`createIcons()` only works in a browser environment.");if(Array.from(o.querySelectorAll(`[${t}]`)).forEach(c=>p(c,{nameAttr:t,icons:e,attrs:s})),n&&Array.from(o.querySelectorAll("template")).forEach(a=>I({icons:e,nameAttr:t,attrs:s,root:a.content,inTemplates:n})),t==="data-lucide"){const c=o.querySelectorAll("[icon-name]");c.length>0&&(console.warn("[Lucide] Some icons were found with the now deprecated icon-name attribute. These will still be replaced for backwards compatibility, but will no longer be supported in v1.0 and you should switch to data-lucide"),Array.from(c).forEach(a=>p(a,{nameAttr:"icon-name",icons:e,attrs:s})))}};function S(){[{selector:"nav ul li:nth-child(1) a",iconName:"home",IconClass:v},{selector:"nav ul li:nth-child(2) a",iconName:"user",IconClass:w},{selector:"nav ul li:nth-child(3) a",iconName:"folder-git-2",IconClass:y},{selector:"nav ul li:nth-child(4) a",iconName:"book-open",IconClass:h},{selector:"nav ul li:nth-child(5) a",iconName:"mail",IconClass:g}].forEach(({selector:t,iconName:s})=>{const o=document.querySelector(t);if(o){const n=o.textContent.trim();o.innerHTML=`
                <i data-lucide="${s}" style="width: 20px; height: 20px;"></i>
                <span>${n}</span>
            `,o.style.display="flex",o.style.alignItems="center",o.style.gap="8px"}}),I({icons:{Home:v,User:w,FolderGit2:y,BookOpen:h,Mail:g}})}const b=["每個成功的男人背後，都有一條脊椎","如果你願意多花一點時間了解我，你會發現你多花了一點時間","醫生說我有拖延症，但我決定下次再去治療","我覺得這件事撇除不好玩的部分，其實都蠻好玩的","你知道嗎? 其實我也不知道","恭喜你！被我恭喜到了","注意!!!!!!!!!!!!!     感謝你的注意。","為什麼警察不直接去監獄裡抓人?","在成功路上，一定有紅綠燈","每天喝一罐10%的蘋果汁，10天後你就吃了一顆蘋果","如果覺得冷，就蹲在牆角，因為那裡有90度","研表究明，手機長期不充電，就會沒電","經證實，人在清醒的時候通常都沒在睡覺","我能預測未來，比如你看完這句話後會看下一句話"],B=80,H=50,j=1e3;let u=0,l=0,i=!1;function L(){const e=document.getElementById("typewriter"),t=b[u];e.textContent=t.substring(0,i?l--:l++),i&&l===0&&(i=!1,u=(u+1)%b.length),!i&&l===t.length&&setTimeout(()=>i=!0,j);let s=B;i&&(s=t.charAt(l)===" "?0:H),setTimeout(L,s)}let d=null;function x(e){const t=document.getElementById("toast");t.textContent=e,d&&clearTimeout(d),t.classList.remove("opacity-100","translate-y-0"),t.classList.add("opacity-0","translate-y-20"),t.offsetWidth,requestAnimationFrame(()=>{t.classList.remove("opacity-0","translate-y-20","pointer-events-none"),t.classList.add("opacity-100","translate-y-0")}),d=setTimeout(()=>{t.classList.remove("opacity-100","translate-y-0"),t.classList.add("opacity-0","translate-y-20","pointer-events-none"),d=null},2e3)}function q(e){navigator.clipboard.writeText(e).then(()=>{x("已複製 Discord ID！")}).catch(t=>{console.error("Failed to copy:",t)})}function P(e){let t=!1,s=null;const o=()=>{s&&(clearTimeout(s),s=null),t=!0,e.style.transition="transform 100ms ease-out",e.style.transform="scale(0.95)"},n=()=>{t&&(t=!1,e.style.transition="transform 450ms cubic-bezier(0.175, 0.885, 0.32, 1.275)",e.style.transform="scale(1)",s=setTimeout(()=>{t||(e.style.transform="",e.style.transition=""),s=null},450))};e.addEventListener("mousedown",o),e.addEventListener("mouseup",n),e.addEventListener("mouseleave",n),e.addEventListener("touchstart",o),e.addEventListener("touchend",n),e.addEventListener("touchcancel",n)}document.addEventListener("DOMContentLoaded",()=>{document.getElementById("typewriter").textContent="",L(),S(),document.querySelectorAll(".clickable-card").forEach(o=>{P(o)});const t=document.getElementById("discord-card");t&&t.addEventListener("click",o=>{o.preventDefault();const n=t.dataset.userId;q(n)});const s=document.getElementById("cat-image");s&&s.addEventListener("click",()=>{x("他是蛋餅，一隻會瞬移的貓")})});
