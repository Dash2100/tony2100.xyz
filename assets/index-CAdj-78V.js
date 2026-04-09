(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))n(t);new MutationObserver(t=>{for(const c of t)if(c.type==="childList")for(const s of c.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function r(t){const c={};return t.integrity&&(c.integrity=t.integrity),t.referrerPolicy&&(c.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?c.credentials="include":t.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function n(t){if(t.ep)return;t.ep=!0;const c=r(t);fetch(t.href,c)}})();/**
 * @license lucide v0.556.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide v0.556.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=([e,o,r])=>{const n=document.createElementNS("http://www.w3.org/2000/svg",e);return Object.keys(o).forEach(t=>{n.setAttribute(t,String(o[t]))}),r?.length&&r.forEach(t=>{const c=x(t);n.appendChild(c)}),n},N=(e,o={})=>{const n={...b,...o};return x(["svg",n,e])};/**
 * @license lucide v0.556.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=e=>Array.from(e.attributes).reduce((o,r)=>(o[r.name]=r.value,o),{}),M=e=>typeof e=="string"?e:!e||!e.class?"":e.class&&typeof e.class=="string"?e.class.split(" "):e.class&&Array.isArray(e.class)?e.class:"",L=e=>e.flatMap(M).map(r=>r.trim()).filter(Boolean).filter((r,n,t)=>t.indexOf(r)===n).join(" "),O=e=>e.replace(/(\w)(\w*)(_|-|\s*)/g,(o,r,n)=>r.toUpperCase()+n.toLowerCase()),p=(e,{nameAttr:o,icons:r,attrs:n})=>{const t=e.getAttribute(o);if(t==null)return;const c=O(t),s=r[c];if(!s)return console.warn(`${e.outerHTML} icon name was not found in the provided icons object.`);const a=A(e),u={...b,"data-lucide":t,...n,...a},f=L(["lucide",`lucide-${t}`,a,n]);f&&Object.assign(u,{class:f});const I=N(s,u);return e.parentNode?.replaceChild(I,e)};/**
 * @license lucide v0.556.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=[["path",{d:"M12 7v14"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"}]];/**
 * @license lucide v0.556.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=[["path",{d:"M18 19a5 5 0 0 1-5-5v8"}],["path",{d:"M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v5"}],["circle",{cx:"13",cy:"12",r:"2"}],["circle",{cx:"20",cy:"19",r:"2"}]];/**
 * @license lucide v0.556.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"}]];/**
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
 */const C=({icons:e={},nameAttr:o="data-lucide",attrs:r={},root:n=document,inTemplates:t}={})=>{if(!Object.values(e).length)throw new Error(`Please provide an icons object.
If you want to use all the icons you can import it like:
 \`import { createIcons, icons } from 'lucide';
lucide.createIcons({icons});\``);if(typeof n>"u")throw new Error("`createIcons()` only works in a browser environment.");if(Array.from(n.querySelectorAll(`[${o}]`)).forEach(s=>p(s,{nameAttr:o,icons:e,attrs:r})),t&&Array.from(n.querySelectorAll("template")).forEach(a=>C({icons:e,nameAttr:o,attrs:r,root:a.content,inTemplates:t})),o==="data-lucide"){const s=n.querySelectorAll("[icon-name]");s.length>0&&(console.warn("[Lucide] Some icons were found with the now deprecated icon-name attribute. These will still be replaced for backwards compatibility, but will no longer be supported in v1.0 and you should switch to data-lucide"),Array.from(s).forEach(a=>p(a,{nameAttr:"icon-name",icons:e,attrs:r})))}};function S(){[{selector:"nav ul li:nth-child(1) a",iconName:"home",IconClass:y},{selector:"nav ul li:nth-child(2) a",iconName:"user",IconClass:w},{selector:"nav ul li:nth-child(3) a",iconName:"folder-git-2",IconClass:m},{selector:"nav ul li:nth-child(4) a",iconName:"book-open",IconClass:h},{selector:"nav ul li:nth-child(5) a",iconName:"mail",IconClass:g}].forEach(({selector:o,iconName:r})=>{const n=document.querySelector(o);if(n){const t=n.textContent.trim();n.innerHTML=`
                <i data-lucide="${r}" style="width: 20px; height: 20px;"></i>
                <span>${t}</span>
            `,n.style.display="flex",n.style.alignItems="center",n.style.gap="8px"}}),C({icons:{Home:y,User:w,FolderGit2:m,BookOpen:h,Mail:g}})}const v=["每個成功的男人背後，都有一條脊椎","如果你願意多花一點時間了解我，你會發現你多花了一點時間","我覺得這件事撇除不好玩的部分，其實都蠻好玩的","恭喜你！被我恭喜到了","注意!!!!!!!!!!!!!     感謝你的注意。","為什麼警察不直接去監獄裡抓人?","在成功路上，一定有紅綠燈","每天喝一罐10%的蘋果汁，10天後你就吃了一顆蘋果","如果覺得冷，就蹲在牆角，因為那裡有90度","研表究明，手機長期不充電，就會沒電","只要每天省下買一杯奶茶的錢，十天後就能買十杯奶茶","經證實，人在清醒的時候通常都沒在睡覺","我能預測未來，比如你看完這句話後會看下一句話"],H=80,T=50,j=1e3;let d=0,l=0,i=!1;function E(){const e=document.getElementById("typewriter"),o=v[d];e.textContent=o.substring(0,i?l--:l++),i&&l===0&&(i=!1,d=(d+1)%v.length),!i&&l===o.length&&setTimeout(()=>i=!0,j);let r=H;i&&(r=o.charAt(l)===" "?0:T),setTimeout(E,r)}document.addEventListener("DOMContentLoaded",()=>{document.getElementById("typewriter").textContent="",E(),S()});
