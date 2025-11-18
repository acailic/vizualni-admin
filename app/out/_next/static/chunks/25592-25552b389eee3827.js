"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[25592],{6135:function(e,t,n){n.d(t,{$:function(){return h}});var r=n(19914),i=n(94873),o=n(98505),a=n(79894),s=n.n(a),l=n(35721),c=n(16976),u=n(49148),d=n(24246);let p=()=>{let e="",t="";return c.yN&&(e=`(${c.yN.substr(0,7)})`),c.Zx&&(t=`${c.Zx}/commit/${c.yN}`),{title:`${c.bS} ${e}`,href:t,external:!0}},h=e=>{let{sx:t}=e,n=(0,u.bU)(),a={title:l.legal[n].title,href:l.legal[n].path,external:!1},c={title:l.imprint[n].title,href:l.imprint[n].path,external:!1},h=p();return(0,d.jsxs)(i.$_,{ContentWrapperProps:{sx:t??void 0},bottomLinks:[h,c,a],nCols:3,children:[(0,d.jsxs)(i.mT,{children:[(0,d.jsx)(i.Ir,{title:r.ag._({id:"footer.about_us.label"})}),(0,d.jsx)(i.iq,{text:r.ag._({id:"footer.about_us.text"})})]}),(0,d.jsxs)(i.mT,{children:[(0,d.jsx)(i.Ir,{title:r.ag._({id:"footer.contact.title"})}),(0,d.jsxs)(i.HO,{children:[(0,d.jsx)(i._X,{type:"youtube",href:"https://www.youtube.com/@visualizetutorials"}),(0,d.jsx)(i._X,{type:"news",href:"mailto:visualize@bafu.admin.ch"})]})]}),(0,d.jsxs)(i.mT,{children:[(0,d.jsx)(i.Ir,{title:r.ag._({id:"footer.information.title"})}),(0,d.jsx)(o.Z,{href:`https://lindas.admin.ch/?lang=${n}`,target:"_blank",underline:"none",children:(0,d.jsx)(i.Uv,{iconName:"external",label:r.ag._({id:"footer.button.lindas"})})}),(0,d.jsx)(o.Z,{href:"https://www.youtube.com/@visualizetutorials",target:"_blank",underline:"none",children:(0,d.jsx)(i.Uv,{iconName:"external",label:r.ag._({id:"footer.tutorials"})})}),(0,d.jsx)(o.Z,{href:"https://visualization-tool.status.interactivethings.io/",target:"_blank",underline:"none",children:(0,d.jsx)(i.Uv,{iconName:"external",label:r.ag._({id:"footer.status"})})}),(0,d.jsx)(s(),{href:"/statistics",passHref:!0,legacyBehavior:!0,children:(0,d.jsx)(o.Z,{underline:"none",children:(0,d.jsx)(i.Uv,{label:r.ag._({id:"footer.statistics"})})})})]})]})}},7752:function(e,t,n){n.d(t,{r:function(){return i},u:function(){return r}});let r="--header-height",i=`var(${r})`},25592:function(e,t,n){n.d(t,{LN:function(){return M},Dv:function(){return U},mg:function(){return F}});var r=n(53082),i=n(6135),o=n(17043),a=n(94873),s=n(25008),l=n(86677),c=n(96338),u=n(87026),d=n(27378),p=n(99990),h=n(87182),m=n(75067),f=n(57906),b=n(24246);let x=()=>{let{dataSource:e,setDataSource:t}=(0,f.qo)(),n=(0,l.useRouter)(),i=(0,d.useMemo)(()=>!(0,h.QT)(n.pathname),[n.pathname]);return(0,b.jsxs)(r.k,{alignItems:"center",gap:1,children:[(0,b.jsxs)(u.Z,{variant:"h5",component:"p",sx:{color:"white"},children:[(0,b.jsx)(c.cC,{id:"data.source"}),":"," "]}),(0,b.jsx)(p.Ph,{id:"dataSourceSelect",variant:"standard",value:(0,h.M_)(e),onChange:e=>{t((0,h.$v)(e.target.value))},disabled:i,options:m.XS,sort:!1,sx:{width:"fit-content",color:"white !important","&:hover":{color:"cobalt.100"},"& .MuiSelect-select":{"&:hover, &[aria-expanded='true']":{backgroundColor:"transparent !important"}}}})]})};var g=n(7752),v=n(35721),j=JSON.parse('{"k":["sr","en","de","fr","it"]}'),y=n(49148),k=n(19914),z=n(12548),w=n(42180),O=n(73868),S=n(7663),P=n(16976),C=n(95700),I=n(48947),q=n(59266),E=n(61579),D=n(65410),T=n(12645),N=n(41538),Z=n(27061);let B=()=>{let e=(0,q.a)(),{0:t,1:n}=(0,d.useState)(null),{0:r,1:i}=(0,d.useState)(!1),o=(0,d.useRef)(null);return(0,b.jsx)("div",{children:e?(0,b.jsxs)(b.Fragment,{children:[(0,b.jsxs)(z.Z,{variant:"text",onClick:e=>n(e.currentTarget),sx:{gap:.25,minWidth:0,minHeight:0,padding:0,whiteSpace:"nowrap",color:"white","&:hover":{color:"cobalt.100"}},children:[e.name,(0,b.jsx)(I.JO,{name:"chevronDown",size:24})]}),(0,b.jsxs)(w.Z,{anchorEl:t,anchorOrigin:{vertical:"bottom",horizontal:"center"},transformOrigin:{vertical:"top",horizontal:"center"},open:!!t,onClose:()=>n(null),PaperProps:{ref:o,sx:{mt:3}},sx:{"& .MuiLink-root":{pr:"64px !important"}},children:[(0,b.jsx)(S.M,{type:"link",as:"menuitem",label:k.ag._({id:"login.profile.my-visualizations"}),href:"/profile"}),P.nf&&(0,b.jsx)(S.M,{type:"link",as:"menuitem",label:"eIAM MyAccount",href:P.nf}),(0,b.jsx)(S.M,{type:"button",as:"menuitem",label:k.ag._({id:"login.profile.feedback"}),trailingIconName:"arrowRight",onClick:()=>i(!0)}),(0,b.jsx)(S.M,{type:"button",as:"menuitem",label:k.ag._({id:"login.sign-out"}),onClick:async()=>await (0,O.signOut)({callbackUrl:"/api/auth/signout"})})]}),(0,b.jsx)(V,{paperEl:o.current,open:r,handleClose:()=>i(!1)})]}):(0,b.jsx)(z.Z,{"data-testid":"test-sign-in",variant:"text",size:"sm",onClick:()=>(0,C.Oz)(window.location.host)||"true"===Z.env.E2E_ENV?(0,O.signIn)("credentials"):(0,O.signIn)("adfs"),sx:{whiteSpace:"nowrap",color:"white","&:hover":{color:"cobalt.100"}},children:(0,b.jsx)(u.Z,{variant:"h5",component:"p",children:(0,b.jsx)(c.cC,{id:"login.sign-in"})})})})},V=e=>{let{paperEl:t,open:n,handleClose:r}=e,i=(0,y.bU)(),{0:o,1:a}=(0,d.useState)({top:0,left:0});return(0,d.useEffect)(()=>{if(!t)return;let e=t.getBoundingClientRect();a(t?{top:e.y+4,left:e.left-8}:{top:0,left:0})},[n,t]),(0,b.jsxs)(w.Z,{anchorPosition:o,open:n,onClose:r,anchorReference:"anchorPosition",PaperProps:{sx:{transform:"translate(calc(-100%), 100%) !important"}},children:[(0,b.jsx)(S.M,{type:"link",as:"menuitem",label:k.ag._({id:"login.profile.bug-report"}),href:(0,E.L)(i,{recipients:{to:T.T,bcc:T.X},template:D.l,subject:"Visualize Bug Report"})}),(0,b.jsx)(S.M,{type:"link",as:"menuitem",label:k.ag._({id:"login.profile.feature-request"}),href:(0,E.L)(i,{recipients:{to:T.T,bcc:T.X},template:N.J,subject:"Visualize Feature Request"})})]})};var _=n(82395);function A(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}let $=e=>{let{contentId:t,hideLogo:n,extendTopBar:i}=e,c=(0,y.bU)(),{push:u,pathname:d,query:h}=(0,l.useRouter)(),[f]=(0,_.y)(e=>{let{height:t}=e;t&&document.documentElement.style.setProperty(g.u,`${t}px`)}),k=t&&t in v?v[t]:void 0;return(0,b.jsxs)("div",{ref:f,style:{zIndex:1},children:[(0,b.jsxs)(a.Du,{ContentWrapperProps:{sx:function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?A(Object(n),!0).forEach(function(t){(0,o.Z)(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):A(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}({justifyContent:"space-between"},i?{maxWidth:"unset !important",px:"48px !important"}:{})},children:[m.XS.length>1&&(0,b.jsx)(x,{}),(0,b.jsxs)(r.k,{alignItems:"center",gap:3,marginLeft:"auto",children:[(0,b.jsx)(B,{}),(0,b.jsx)(p.Ph,{id:"localeSwitcherSelect",variant:"standard",value:c,onChange:e=>{let t=e.target.value,n=k?.[t];n?u(n.path,void 0,{locale:!1}):u({pathname:d,query:h},void 0,{locale:t})},options:j.k.map(e=>({label:e.toUpperCase(),value:e})),sort:!1,sx:{width:"fit-content",color:"white !important","&:hover":{color:"cobalt.100"},"& .MuiSelect-select":{"&:hover, &[aria-expanded='true']":{backgroundColor:"transparent !important"}}}})]})]}),n?null:(0,b.jsx)(s.h4,{longTitle:"visualize.admin.ch",shortTitle:"visualize",rootHref:"/",sx:{backgroundColor:"white"}})]})},M=e=>{let{children:t,hideHeader:n,editing:i}=e;return(0,b.jsxs)(r.k,{sx:{minHeight:"100vh",flexDirection:"column"},children:[n?null:(0,b.jsx)($,{hideLogo:i,extendTopBar:i}),(0,b.jsx)(r.k,{component:"main",role:"main",sx:{flex:1,flexDirection:"column"},children:t})]})},U=e=>{let{children:t,contentId:n}=e;return(0,b.jsxs)(r.k,{sx:{minHeight:"100vh",flexDirection:"column",backgroundColor:"monochrome.100"},children:[(0,b.jsx)($,{contentId:n}),(0,b.jsx)(r.k,{component:"main",role:"main",sx:{flexDirection:"column",flex:1,width:"100%"},children:t}),(0,b.jsx)(i.$,{})]})},F=e=>{let{children:t,contentId:n}=e;return(0,b.jsxs)(r.k,{sx:{minHeight:"100vh",flexDirection:"column",backgroundColor:"monochrome.100"},children:[(0,b.jsx)($,{contentId:n}),(0,b.jsx)(r.k,{component:"main",role:"main",sx:{flexDirection:"column",flex:1,width:"100%",maxWidth:1024,my:[4,6],mx:[0,0,"auto"],px:4,"& h2":{mb:1}},children:t}),(0,b.jsx)(i.$,{})]})}},7663:function(e,t,n){n.d(t,{M:function(){return N}});var r=n(17043),i=n(90089),o=n(1869),a=n(1787),s=n(12548),l=n(98505),c=n(87026),u=n(26398),d=n(79894),p=n.n(d),h=n(96338),m=n(19914),f=n(64689),b=n(3615),x=n(96373),g=n(54986),v=n(47434),j=n(65637),y=n(27378),k=n(57064),z=n(24246);let w=["title","text","onClick","onSuccess","onConfirm"];function O(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function S(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?O(Object(n),!0).forEach(function(t){(0,r.Z)(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):O(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}let P=e=>{let{title:t,text:n,onClick:r,onSuccess:o,onConfirm:a}=e,l=(0,i.Z)(e,w),{0:c,1:u}=(0,y.useState)(!1);return(0,z.jsxs)(f.Z,S(S({maxWidth:"xs",PaperProps:{sx:{gap:4,width:"100%",p:6}}},l),{},{children:[(0,z.jsx)(b.Z,{sx:{p:0,typography:"h4"},children:t||m.ag._({id:"login.profile.chart.confirmation.default"})}),n&&(0,z.jsx)(x.Z,{sx:{p:0},children:(0,z.jsx)(g.Z,{sx:{typography:"body2"},children:n})}),(0,z.jsxs)(v.Z,{sx:{p:0,"& > .MuiButton-root":{justifyContent:"center",minWidth:76,minHeight:"fit-content",pointerEvents:c?"none":"auto"}},children:[(0,z.jsx)(s.Z,{variant:"outlined",onClick:()=>l.onClose({},"escapeKeyDown"),children:(0,z.jsx)(h.cC,{id:"no"})}),(0,z.jsx)(s.Z,{variant:"contained",onClick:async e=>{e.stopPropagation(),u(!0),await r(e),await (0,k._)(100),l.onClose({},"escapeKeyDown"),o?.()},children:c?(0,z.jsx)(j.Z,{}):(0,z.jsx)(h.cC,{id:"yes"})})]})]}))};var C=n(79234),I=n(48947);let q=["leadingIcon","trailingIcon","label","color"];function E(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function D(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?E(Object(n),!0).forEach(function(t){(0,r.Z)(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):E(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}let T=(0,o.ZP)(a.Z)(e=>{let{theme:t,color:n}=e;return{display:"flex",alignItems:"flex-start",gap:t.spacing(2),color:"red"===n?t.palette.red.main:t.palette.text.primary,whiteSpace:"normal"}}),N=e=>{let{disabled:t,label:n,trailingIconName:r,leadingIconName:o}=e,{isOpen:a,open:d,close:h}=(0,C.q)(),m=n=>{let{leadingIcon:r,trailingIcon:o,label:a,color:p}=n,h=(0,i.Z)(n,q),m="button"===e.type?D({onClick:t=>{if(e.onClick){if(!("requireConfirmation"in e)||!e.requireConfirmation)return e.onClick(t);d()}}},h):D({href:e.href,target:e.target,rel:e.rel},h);return"button"===e.as?(0,z.jsx)(s.Z,D(D({disabled:t,variant:"contained",size:"sm"},m),{},{sx:{minHeight:0},children:a})):(0,z.jsxs)(z.Fragment,{children:[(0,z.jsxs)(T,D(D({disabled:t,component:"link"===e.type?l.Z:"div"},m),{},{color:p,sx:{display:"flex",alignItems:"center",minHeight:0},children:[r&&(0,z.jsx)(I.JO,{name:r}),(0,z.jsx)(c.Z,{variant:"body3",children:a}),o&&(0,z.jsx)(I.JO,{name:o,style:{marginLeft:"auto"}})]})),(0,z.jsx)(u.Z,{sx:{mx:4,my:"0 !important","&:last-of-type":{display:"none"}}})]})};return(0,z.jsxs)(z.Fragment,{children:["link"===e.type?(0,z.jsx)(p(),{href:e.href,passHref:!0,legacyBehavior:!0,children:(0,z.jsx)(m,{label:n,leadingIcon:o,trailingIcon:r,color:e.color})}):"button"===e.type?(0,z.jsx)(m,{label:n,leadingIcon:o,trailingIcon:r,color:e.color}):null,"button"===e.type&&e.requireConfirmation&&(0,z.jsx)(P,{onClose:h,open:a,title:e.confirmationTitle,text:e.confirmationText,onClick:e.onClick,onSuccess:e.onSuccess})]})}},75067:function(e,t,n){n.d(t,{H9:function(){return c},XS:function(){return l},eI:function(){return a},nF:function(){return d},r$:function(){return u},sp:function(){return s}});var r=n(83864),i=n.n(r),o=n(16976);let a="https://lindas.admin.ch/query",s="https://lindas-cached.cluster.ldbar.ch/query",l=[{value:`sparql+${s}`,label:"Prod",url:s,isTrusted:!0,supportsCachingPerCubeIri:!0},{value:"sparql+https://lindas.admin.ch/query",label:"Prod-uncached",url:"https://lindas.admin.ch/query",isTrusted:!0,supportsCachingPerCubeIri:!0},{value:"sparql+https://lindas-cached.int.cluster.ldbar.ch/query",label:"Int",url:"https://lindas-cached.int.cluster.ldbar.ch/query",isTrusted:!1,supportsCachingPerCubeIri:!0},{value:"sparql+https://int.lindas.admin.ch/query",label:"Int-uncached",url:"https://int.lindas.admin.ch/query",isTrusted:!1,supportsCachingPerCubeIri:!0},{value:"sparql+https://lindas-cached.test.cluster.ldbar.ch/query",label:"Test",url:"https://lindas-cached.test.cluster.ldbar.ch/query",isTrusted:!1,supportsCachingPerCubeIri:!0},{value:"sparql+https://test.lindas.admin.ch/query",label:"Test-uncached",url:"https://test.lindas.admin.ch/query",isTrusted:!1,supportsCachingPerCubeIri:!0}].filter(e=>o.rM.includes(e.label)),c=i()(l,e=>e.label),u=i()(l,e=>e.value),d=i()(l,e=>e.url)},87182:function(e,t,n){n.d(t,{Ve:function(){return l},op:function(){return m},QT:function(){return h},$v:function(){return s},vT:function(){return d},nw:function(){return p},M_:function(){return c},Id:function(){return u}});var r=n(27378),i=n(75067),o=n(16976);let a=JSON.parse(n(27061).env.WHITELISTED_DATA_SOURCES??"[]");i.XS.filter(e=>a.includes(e.label)).map(e=>e.value.split("+")[1]);let s=e=>{let[t,n]=e.split("+");return{type:t,url:n}},l=s(o.f4),c=e=>{let{type:t,url:n}=e;return`${t}+${n}`},u=e=>(0,r.useMemo)(()=>{let t=c(e);return i.r$[t]?.isTrusted},[e]),d=e=>{let t=i.H9[e];return t?s(t.value):void 0},p=e=>i.r$[c(e)]?.label,h=e=>["/","/browse"].includes(e),m=e=>{switch(e.type){case"sparql":let t=new URL(e.url);return`${t.origin}/sparql`;case"sql":throw Error("Not implemented yet.")}}},59266:function(e,t,n){n.d(t,{a:function(){return s},d:function(){return a}});var r=n(64986),i=n(73868),o=n(7752);let a=(0,r.Z)(e=>({root:{minHeight:`calc(100vh - ${o.r})`,display:"flex",flexDirection:"column"},content:{flexGrow:1,display:"flex",flexDirection:"column"},section:{display:"flex",flexDirection:"column",padding:`0 ${e.spacing(6)}`},sectionContent:{width:"100%",maxWidth:1548,margin:"0 auto"}})),s=()=>{let{data:e,status:t}=(0,i.useSession)();return"loading"!==t&&e?e.user:null}},57906:function(e,t,n){let r,i;n.d(t,{ZB:function(){return b},qo:function(){return v}});var o=n(17043),a=n(86677),s=n.n(a),l=n(58555),c=n(87182),u=n(31251),d=n(37457);function p(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function h(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?p(Object(n),!0).forEach(function(t){(0,o.Z)(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):p(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}let m="dataSource",f=e=>{try{localStorage.setItem(m,(0,c.nw)(e))}catch(e){console.error("Error saving data source to localStorage",e)}},b=()=>{try{let e=localStorage.getItem(m);if(e)return(0,c.vT)(e)}catch(e){console.error("Error getting data source from localStorage",e)}},x=e=>!e.includes("__test"),g=e=>{let t=(0,d.ij)(m),n=(0,c.nw)(e);t!==n&&(0,d.WC)(m,n)},v=(r=s(),(0,l.ZP)((i=e=>({dataSource:c.Ve,setDataSource:t=>e({dataSource:t})}),(e,t,n)=>{let o=(0,u.K)(),a=i(t=>{e(t),o&&(f(t.dataSource),g(t.dataSource))},t,n,[]),s=c.Ve;if(o){let e=(0,d.ij)(m),t=e?(0,c.vT)(e):void 0;if(e&&t)s=t,f(t);else{let e=b();e?s=e:f(s)}}let l=()=>{let e=t()?.dataSource;e&&x(r.pathname)&&g(e)};return r.events.on("routeChangeComplete",l),r.ready(l),h(h({},a),{},{dataSource:s})})))},65410:function(e,t,n){n.d(t,{l:function(){return r}});let r={sr:`
Prijava greške

Opišite grešku 
Jasan i sažet opis greške. Ako se čini da je povezana sa problemom sa podacima (nedostajuće vrednosti, pogrešno parsiranje), prvo proverite skup podataka na Portalu otvorenih podataka (https://data.gov.rs) da biste videli da li je tamo sve u redu.
Molimo opišite...

----------------------------------------------
Kako reprodukovati
Koraci za reprodukovanje ponašanja:
1. Idite na '...'
2. Kliknite na '...'
3. Skrolujte do '...'
4. Vidite grešku

----------------------------------------------
Očekivano ponašanje
Jasan i sažet opis onoga što ste očekivali da se dogodi.
Molimo opišite...

----------------------------------------------
Snimci ekrana ili video
Ako je moguće, dodajte snimke ekrana ili kratak video da pomognete u stavljanju problema u kontekst.

----------------------------------------------
Okruženje
Molimo dopunite sledeće informacije.
- Vizualni Admin okruženje i verzija: [npr., v1.0.0]
- Pretraživač i verzija [npr., Chrome 107]

----------------------------------------------
Dodatni kontekst
Dodajte bilo koji dodatni kontekst o problemu ovde.
Molimo opišite...

----------------------------------------------
Kontakt informacije
Titula: 
Prezime:
Ime:
Pozicija:
Organizacija:
Email:
Broj telefona (za eventualana pitanja):
`,en:`
Bug Report

Describe the bug 
A clear and concise description of what the bug is. If it seems connected to some data problem (missing values, wrong parsing), please first check the cube in Cube Validator (https://cube-validator.lindas.admin.ch/select) to see if everything is fine there.
Please describe...

----------------------------------------------
To Reproduce
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

----------------------------------------------
Expected behavior
A clear and concise description of what you expected to happen.
Please describe...

----------------------------------------------
Screenshots or video
If applicable, add screenshots or a short video to help put your problem into a context.

----------------------------------------------
Environment
Please complete the following information.
- Visualize environment and version: [e.g., INT v4.9.4]
- Browser and version [e.g., Chrome 107]

----------------------------------------------
Additional context
Add any other context about the problem here.
Please describe...

----------------------------------------------
Contact Information
Title: 
Last Name:
First Name:
Position:
Organization:
Email:
Phone Number (for any questions):
`,de:`
Fehlermeldung 

----------------------------------------------
Beschreiben Sie den Fehler
Eine klare und pr\xe4zise Beschreibung des Fehlers. Wenn es mit einem Datenproblem zusammenh\xe4ngt (fehlende Werte, falsche Analyse), \xfcberpr\xfcfen Sie bitte zuerst den Cube im Cube Validator (https://cube-validator.lindas.admin.ch/select), um sicherzustellen, dass dort alles in Ordnung ist.
Bitte beschreiben Sie...

----------------------------------------------
Zum Reproduzieren
Schritte zum Reproduzieren des Verhaltens:
1. Gehen Sie zu '...'
2. Klicken Sie auf '...'
3. Scrollen Sie nach unten zu '...'
4. Fehlermeldung erscheint

----------------------------------------------
Erwartetes Verhalten
Eine klare und pr\xe4zise Beschreibung dessen, was Sie erwartet haben.
Bitte beschreiben Sie...

----------------------------------------------
Screenshots oder Video
Falls zutreffend, f\xfcgen Sie Screenshots oder ein kurzes Video hinzu, um Ihr Problem in einen Kontext zu setzen.

----------------------------------------------
Umgebung
Bitte vervollst\xe4ndigen Sie die folgenden Informationen.
- Visualize-Umgebung und Version: [z.B., INT v4.9.4]
- Browser und Version [z.B., Chrome 107]

----------------------------------------------
Zus\xe4tzlicher Kontext
F\xfcgen Sie hier weitere Kontextinformationen zum Problem hinzu.
Bitte beschreiben Sie...

----------------------------------------------
Kontakt Information
Anrede:
Name:
Vorname:
Funktion:
Organisation:
Mail:
Telefonnummer (f\xfcr R\xfcckfragen):
`,fr:`
Rapport de bug

Description du bug 
Une description claire et concise du bug. S'il semble li\xe9 \xe0 un probl\xe8me de donn\xe9es (valeurs manquantes, analyse incorrecte), veuillez d'abord v\xe9rifier le cube dans le Cube Validator (https://cube-validator.lindas.admin.ch/select) pour vous assurer que tout y est correct.
Veuillez d\xe9crire...

----------------------------------------------
Pour reproduire
\xc9tapes pour reproduire le comportement :
1. Aller \xe0 '...'
2. Cliquer sur '...'
3. Faire d\xe9filer jusqu'\xe0 '...'
4. Voir l'erreur

----------------------------------------------
Comportement attendu
Une description claire et concise de ce que vous attendiez.
Veuillez d\xe9crire...

----------------------------------------------
Captures d'\xe9cran ou vid\xe9o
Le cas \xe9ch\xe9ant, ajoutez des captures d'\xe9cran ou une courte vid\xe9o pour mettre votre probl\xe8me en contexte.

----------------------------------------------
Environnement
Veuillez compl\xe9ter les informations suivantes.
- Environnement et version Visualize : [ex. INT v4.9.4]
- Navigateur et version [ex. Chrome 107]

----------------------------------------------
Contexte suppl\xe9mentaire
Ajoutez ici tout autre contexte concernant le probl\xe8me.
Veuillez d\xe9crire...

----------------------------------------------
Informations de contact
Civilit\xe9:
Nom:
Pr\xe9nom:
Fonction:
Organisation:
E-mail:
Num\xe9ro de t\xe9l\xe9phone (pour d'\xe9ventuelles questions):
`,it:`
Segnalazione di bug

Descrizione del bug 
Una descrizione chiara e concisa del bug. Se sembra collegato a un problema di dati (valori mancanti, analisi errata), controllare prima il cubo nel Cube Validator (https://cube-validator.lindas.admin.ch/select) per assicurarsi che tutto sia a posto.
Si prega di descrivere...

----------------------------------------------
Per riprodurre
Passaggi per riprodurre il comportamento:
1. Andare a '...'
2. Cliccare su '...'
3. Scorrere fino a '...'
4. Vedere l'errore

----------------------------------------------
Comportamento previsto
Una descrizione chiara e concisa di ci\xf2 che ci si aspettava.
Si prega di descrivere...

----------------------------------------------
Screenshot o video
Se applicabile, aggiungere screenshot o un breve video per contestualizzare il problema.

----------------------------------------------
Ambiente
Si prega di completare le seguenti informazioni.
- Ambiente e versione Visualize: [es. INT v4.9.4]
- Browser e versione [es. Chrome 107]

----------------------------------------------
Contesto aggiuntivo
Aggiungere qui qualsiasi altro contesto sul problema.
Si prega di descrivere...

----------------------------------------------
Informazioni di contatto
Titolo:
Cognome:
Nome:
Ruolo:
Organizzazione:
E-mail:
Numero di telefono (per eventuali domande):
`}},12645:function(e,t,n){n.d(t,{T:function(){return r},X:function(){return i}});let r="visualize@bafu.admin.ch",i="support@interactivethings.com"},41538:function(e,t,n){n.d(t,{J:function(){return r}});let r={sr:`
Nova funkcionalnost

Da li je vaš zahtev za funkcionalnost povezan sa problemom?
Jasan i sažet opis problema. Npr. Uvek sam frustriran kada [...]
Molimo opišite...

----------------------------------------------
Opišite rešenje koje biste želeli
Jasan i sažet opis onoga što želite da se dogodi.
Molimo opišite...

----------------------------------------------
Opišite alternative koje ste razmotrili
Jasan i sažet opis bilo kojih alternativnih rešenja ili funkcionalnosti koje ste razmotrili.
Molimo opišite...

----------------------------------------------
Slučajevi upotrebe i uticaj
Primeri kako bi funkcionalnost bila korisna i procena koliki bi njen uticaj bio.
Molimo opišite...

----------------------------------------------
Dodatni kontekst
Dodajte bilo koji dodatni kontekst ili snimke ekrana o zahtevu za funkcionalnost ovde.
Molimo opišite...

----------------------------------------------
Kontakt informacije
Titula: 
Prezime:
Ime:
Pozicija:
Organizacija:
Email:
Broj telefona (za eventualna pitanja):
`,en:`
New Feature

Is your feature request related to a problem?
A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]
Please describe...

----------------------------------------------
Describe the solution you'd like
A clear and concise description of what you want to happen.
Please describe...

----------------------------------------------
Describe alternatives you've considered
A clear and concise description of any alternative solutions or features you've considered.
Please describe...

----------------------------------------------
Use cases and impact
Examples of how the feature would be beneficial and an estimation of how much impact it would have.
Please describe...

----------------------------------------------
Additional context
Add any other context or screenshots about the feature request here.
Please describe...

----------------------------------------------
Contact Information
Title: 
Last Name:
First Name:
Position:
Organization:
Email:
Phone Number (for any questions):
`,de:`
Neue Funktion

Bezieht sich Ihre Feature-Anfrage auf ein Problem?
Eine klare und pr\xe4zise Beschreibung des Problems. Z.B. Es frustriert mich immer, wenn [...]
Bitte beschreiben Sie...

----------------------------------------------
Beschreiben Sie die gew\xfcnschte L\xf6sung
Eine klare und pr\xe4zise Beschreibung dessen, was passieren soll.
Bitte beschreiben Sie...

----------------------------------------------
Beschreiben Sie Alternativen, die Sie in Betracht gezogen haben
Eine klare und pr\xe4zise Beschreibung aller alternativen L\xf6sungen oder Funktionen, die Sie in Betracht gezogen haben.
Bitte beschreiben Sie...

----------------------------------------------
Anwendungsf\xe4lle und Auswirkungen
Beispiele daf\xfcr, wie die Funktion n\xfctzlich w\xe4re und eine Einsch\xe4tzung der Auswirkungen.
Bitte beschreiben Sie...

----------------------------------------------
Zus\xe4tzlicher Kontext
F\xfcgen Sie hier weitere Kontextinformationen oder Screenshots zur Feature-Anfrage hinzu.
Bitte beschreiben Sie...

----------------------------------------------
Kontakt Information
Anrede:
Name:
Vorname:
Funktion:
Organisation:
Mail:
Telefonnummer (f\xfcr R\xfcckfragen):
`,fr:`
Nouvelle fonctionnalit\xe9

Votre demande de fonctionnalit\xe9 est-elle li\xe9e \xe0 un probl\xe8me ?
Une description claire et concise du probl\xe8me. Ex. Je suis toujours frustr\xe9 quand [...]
Veuillez d\xe9crire...

----------------------------------------------
D\xe9crivez la solution que vous souhaitez
Une description claire et concise de ce que vous voulez qu'il se passe.
Veuillez d\xe9crire...

----------------------------------------------
D\xe9crivez les alternatives que vous avez envisag\xe9es
Une description claire et concise des solutions ou fonctionnalit\xe9s alternatives que vous avez envisag\xe9es.
Veuillez d\xe9crire...

----------------------------------------------
Cas d'utilisation et impact
Exemples de l'utilit\xe9 de la fonctionnalit\xe9 et estimation de son impact.
Veuillez d\xe9crire...

----------------------------------------------
Contexte suppl\xe9mentaire
Ajoutez ici tout autre contexte ou captures d'\xe9cran concernant la demande de fonctionnalit\xe9.
Veuillez d\xe9crire...

----------------------------------------------
Informations de contact
Civilit\xe9:
Nom:
Pr\xe9nom:
Fonction:
Organisation:
E-mail:
Num\xe9ro de t\xe9l\xe9phone (pour d'\xe9ventuelles questions):
`,it:`
Nuova funzionalit\xe0

La sua richiesta di funzionalit\xe0 \xe8 legata a un problema?
Una descrizione chiara e concisa del problema. Es. Sono sempre frustrato quando [...]
Si prega di descrivere...

----------------------------------
Descriva la soluzione che vorrebbe
Una descrizione chiara e concisa di ci\xf2 che vuole che accada.
Si prega di descrivere...

----------------------------------------------
Descriva le alternative considerate
Una descrizione chiara e concisa di eventuali soluzioni o funzionalit\xe0 alternative che ha considerato.
Si prega di descrivere...

----------------------------------------------
Casi d'uso e impatto
Esempi di come la funzionalit\xe0 sarebbe utile e una stima del suo impatto.
Si prega di descrivere...

----------------------------------------------
Contesto aggiuntivo
Aggiunga qui qualsiasi altro contesto o screenshot sulla richiesta di funzionalit\xe0.
Si prega di descrivere...

----------------------------------------------
Informazioni di contatto
Titolo:
Cognome:
Nome:
Ruolo:
Organizzazione:
E-mail:
Numero di telefono (per eventuali domande):
`}},61579:function(e,t,n){n.d(t,{L:function(){return r}});let r=(e,t)=>{let{recipients:n,template:r,subject:i}=t,o=r[e];return`mailto:${n.to}?subject=${encodeURIComponent(i)}&body=${encodeURIComponent(o)}${n.bcc?`&bcc=${n.bcc}`:""}`}},37457:function(e,t,n){n.d(t,{WC:function(){return l},ij:function(){return s},vf:function(){return c}});var r=n(17043),i=n(31251);function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach(function(t){(0,r.Z)(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}let s=e=>{let t=(0,i.K)(),n=t?new URL(t.location.href):null;if(n)return n.searchParams.get(e)},l=(e,t)=>{let{protocol:n,host:r,pathname:i,href:o}=window.location,s=new URL(o).searchParams;s.delete(e),s.append(e,t);let l=`${n}//${r}${i}?${s}`;window.history.replaceState(a(a({},window.history.state),{},{path:l}),"",l)},c=e=>e.split("?")[0].split("/").pop()},57064:function(e,t,n){n.d(t,{_:function(){return r}});let r=e=>new Promise(t=>setTimeout(t,e))},82395:function(e,t,n){n.d(t,{Q:function(){return u},y:function(){return d}});var r=n(52267),i=n(54417),o=n(56141),a=n.n(o),s=n(19783),l=n.n(s),c=n(27378);let u=1,d=e=>{let t=(0,c.useRef)(),n=(0,c.useRef)(),{0:o,1:s}=(0,c.useState)({width:u,height:u}),d=(0,i.Z)(i=>{if(i){if(n.current=i,!t.current){let n=l()(t=>{if(!t.length)return;let n=t[0],{width:r,height:i}=o,{inlineSize:l,blockSize:c}=n.contentBoxSize[0],u=Math.abs(c-i)>16&&c>0||Math.abs(l-r)>16&&l>0?{height:c,width:l}:o;a()(u,o)||(s(u),e?.(u))},16);t.current=new r.do(n)}t.current.observe(n.current)}});return(0,c.useEffect)(()=>(n.current&&d(n.current),()=>{t.current?.disconnect(),t.current=void 0}),[d]),[d,o.width,o.height]}},35721:function(e){e.exports=JSON.parse('{"imprint":{"de":{"title":"Impressum","path":"/de/impressum"},"fr":{"title":"Impressum","path":"/fr/impressum"},"it":{"title":"Colophon","path":"/it/colophon"},"en":{"title":"Imprint","path":"/en/imprint"}},"legal":{"de":{"title":"Rechtliche Grundlagen","path":"/de/rechtliche-grundlagen"},"fr":{"title":"Cadre juridique","path":"/fr/cadre-juridique"},"it":{"title":"Quadro giuridico","path":"/it/quadro-giuridico"},"en":{"title":"Legal Framework","path":"/en/legal-framework"}}}')}}]);
//# sourceMappingURL=25592-25552b389eee3827.js.map