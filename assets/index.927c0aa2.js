import{r as e,c as r,o as t,a as o,b as n,d as s,e as i,p as c,f as a}from"./vendor.5998f14b.js";!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver((e=>{for(const t of e)if("childList"===t.type)for(const e of t.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&r(e)})).observe(document,{childList:!0,subtree:!0})}function r(e){if(e.ep)return;e.ep=!0;const r=function(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerpolicy&&(r.referrerPolicy=e.referrerpolicy),"use-credentials"===e.crossorigin?r.credentials="include":"anonymous"===e.crossorigin?r.credentials="omit":r.credentials="same-origin",r}(e);fetch(e.href,r)}}();const d={};d.render=function(o,n){const s=e("router-view");return t(),r(s)};const l={},u=[{name:"Index",path:"/",component:()=>{return e=()=>import("./Index.371ed5c8.js"),(r=["assets/Index.371ed5c8.js","assets/vendor.5998f14b.js"])&&0!==r.length?Promise.all(r.map((e=>{if((e=`/mask-app/${e}`)in l)return;l[e]=!0;const r=e.endsWith(".css"),t=r?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${e}"]${t}`))return;const o=document.createElement("link");return o.rel=r?"stylesheet":"modulepreload",r||(o.as="script",o.crossOrigin=""),o.href=e,document.head.appendChild(o),r?new Promise(((e,r)=>{o.addEventListener("load",e),o.addEventListener("error",r)})):void 0}))).then((()=>e())):e();var e,r}}],p=o({history:n(),routes:u}),f=s({});const m=i(d);m.use(p),m.use(f),m.use(c,a),m.provide("axios",m.config.globalProperties.axios),m.mount("#app");