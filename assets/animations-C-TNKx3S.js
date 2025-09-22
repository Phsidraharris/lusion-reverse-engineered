import{r as e,j as y,u as E,m as $}from"./framer-motion-B8PGm2dx.js";const P=({particleCount:h=100,particleColor:g="rgba(255, 255, 255, 0.5)",particleSize:d=2,animationSpeed:s=1,className:a="",useOffscreenCanvas:l=!0})=>{const m=e.useRef(null),n=e.useRef(null),f=e.useRef(null),i=e.useRef([]),r=e.useRef(null),M=e.useRef(0),b=e.useMemo(()=>({count:h,color:g,size:d,speed:s}),[h,g,d,s]),R=e.useCallback((o,x)=>{r.current&&clearTimeout(r.current),r.current=setTimeout(()=>{const c=o.offsetWidth,p=o.offsetHeight;o.width=c,o.height=p,x&&(x.width=c,x.height=p)},150)},[]),j=e.useCallback((o,x,c)=>{const p=performance.now();if(p-M.current<16.67){f.current=requestAnimationFrame(()=>j(o,x,c));return}M.current=p;const A=i.current,u=x||o;u.clearRect(0,0,c.width,c.height),A.forEach((t,v)=>{t.x+=t.vx,t.y+=t.vy,(t.x<=0||t.x>=c.width)&&(t.vx=-t.vx),(t.y<=0||t.y>=c.height)&&(t.vy=-t.vy),t.x=Math.max(0,Math.min(c.width,t.x)),t.y=Math.max(0,Math.min(c.height,t.y)),u.beginPath(),u.arc(t.x,t.y,t.size,0,Math.PI*2),u.fillStyle=b.color.replace("0.5",t.alpha),u.fill(),v<A.length-10&&A.slice(v+1,v+11).forEach(w=>{const _=t.x-w.x,k=t.y-w.y,F=Math.sqrt(_*_+k*k);F<100&&(u.beginPath(),u.moveTo(t.x,t.y),u.lineTo(w.x,w.y),u.strokeStyle=b.color.replace("0.5",(1-F/100)*.2),u.lineWidth=1,u.stroke())})}),x&&l&&(o.clearRect(0,0,c.width,c.height),o.drawImage(n.current,0,0)),f.current=requestAnimationFrame(()=>j(o,x,c))},[b,l]);return e.useEffect(()=>{const o=m.current;if(!o)return;const x=o.getContext("2d"),c=i.current;let p=null,A=null;if(l&&"OffscreenCanvas"in window)try{p=new OffscreenCanvas(o.width,o.height),A=p.getContext("2d"),n.current=p}catch{console.warn("OffscreenCanvas not supported, falling back to regular canvas")}const u=()=>{R(o,p)};return u(),window.addEventListener("resize",u),(()=>{c.length=0;const v=[];for(let w=0;w<b.count;w++)v.push({x:Math.random()*o.width,y:Math.random()*o.height,vx:(Math.random()-.5)*b.speed,vy:(Math.random()-.5)*b.speed,alpha:Math.random()*.5+.2,size:Math.random()*b.size+1});c.push(...v)})(),j(x,A,o),()=>{window.removeEventListener("resize",u),f.current&&cancelAnimationFrame(f.current),r.current&&clearTimeout(r.current)}},[b,R,j,l]),y.jsx("canvas",{ref:m,className:`absolute inset-0 pointer-events-none ${a}`,style:{width:"100%",height:"100%"}})},q=Object.freeze(Object.defineProperty({__proto__:null,default:P},Symbol.toStringTag,{value:"Module"})),T=({className:h="",colors:g=["#6366f1","#8b5cf6","#06b6d4"]})=>{const d=e.useRef(null),s=e.useRef(null),a=e.useRef(0),l=e.useMemo(()=>g,[g]);return e.useEffect(()=>{const m=d.current;if(!m)return;let n=0;const i=1e3/30,r=b=>{if(b-a.current>=i){n+=.02;const R=Math.sin(n)*.1+1,j=Math.cos(n*1.2)*.1+1,o=n*20;m.style.transform=`
          rotate(${o}deg) 
          scaleX(${R}) 
          scaleY(${j})
        `,a.current=b}s.current=requestAnimationFrame(r)};return(()=>{"requestIdleCallback"in window?requestIdleCallback(()=>{s.current=requestAnimationFrame(r)}):s.current=requestAnimationFrame(r)})(),()=>{s.current&&cancelAnimationFrame(s.current)}},[]),y.jsxs("div",{className:`absolute inset-0 overflow-hidden ${h}`,children:[y.jsx("div",{ref:d,className:"absolute top-1/2 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2 opacity-20 blur-3xl",style:{background:`linear-gradient(45deg, ${l.join(", ")})`,filter:"blur(60px)"}}),y.jsx("style",{jsx:!0,children:`
        @keyframes blob {
          0% {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          }
          50% {
            border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
          }
          100% {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          }
        }
      `})]})},D=Object.freeze(Object.defineProperty({__proto__:null,default:T},Symbol.toStringTag,{value:"Module"})),z=({count:h=20,className:g=""})=>{const d=e.useRef(null),s=e.useMemo(()=>Array.from({length:h},(a,l)=>({id:l,initialX:Math.random()*100,initialY:Math.random()*100,speed:Math.random()*.5+.1,amplitude:Math.random()*30+10,frequency:Math.random()*.02+.01,size:Math.random()*8+4,opacity:Math.random()*.3+.1})),[h]);return y.jsx("div",{ref:d,className:`absolute inset-0 overflow-hidden pointer-events-none ${g}`,children:s.map(a=>y.jsx(C,{...a},a.id))})},C=({initialX:h,initialY:g,speed:d,amplitude:s,frequency:a,size:l,opacity:m})=>{const n=e.useRef(null),f=e.useRef(0);return E(()=>{if(!n.current)return;f.current+=d;const i=h+Math.sin(f.current*a)*s,r=g+Math.cos(f.current*a*.7)*s*.5;n.current.style.transform=`translate(${i}vw, ${r}vh)`}),y.jsx($.div,{ref:n,className:"absolute rounded-full bg-gradient-to-br from-blue-400/30 to-purple-600/30 blur-sm",style:{width:l,height:l,opacity:m},initial:{scale:0},animate:{scale:1},transition:{duration:2,delay:Math.random()*2}})},I=Object.freeze(Object.defineProperty({__proto__:null,default:z},Symbol.toStringTag,{value:"Module"})),N=({children:h,className:g="",particleCount:d=50})=>{const s=e.useRef(null),a=e.useMemo(()=>({count:d,className:"absolute w-1 h-1 bg-white/20 rounded-full animate-pulse",maxAnimationDuration:3,minAnimationDuration:2,maxAnimationDelay:2}),[d]),l=e.useCallback(m=>{const n=document.createElement("div");return n.className=a.className,n.style.left=Math.random()*100+"%",n.style.top=Math.random()*100+"%",n.style.animationDuration=Math.random()*a.maxAnimationDuration+a.minAnimationDuration+"s",n.style.animationDelay=Math.random()*a.maxAnimationDelay+"s",n},[a]);return e.useEffect(()=>{const m=s.current;if(!m)return;const n=[];for(let i=0;i<a.count;i++){const r=l(i);m.appendChild(r),n.push(r)}const f=()=>{n.forEach(i=>{const r=parseFloat(i.style.top),M=r<=-2?100:r-.1;i.style.top=M+"%"}),requestAnimationFrame(f)};return f(),()=>{n.forEach(i=>{i.parentNode&&i.parentNode.removeChild(i)}),animationId&&cancelAnimationFrame(animationId)}},[a,l]),y.jsxs("div",{ref:s,className:`relative overflow-hidden ${g}`,children:[y.jsx("div",{className:"absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-teal-900/20 animate-gradient-x"}),y.jsx("div",{className:"absolute inset-0 opacity-10",style:{backgroundImage:`
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,backgroundSize:"50px 50px",animation:"grid-move 20s linear infinite"}}),h,y.jsx("style",{jsx:!0,children:`
        @keyframes gradient-x {
          0%, 100% {
            transform: translateX(0%);
          }
          50% {
            transform: translateX(-100%);
          }
        }
        @keyframes grid-move {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }
        .animate-gradient-x {
          animation: gradient-x 15s ease infinite;
        }
      `})]})},B=Object.freeze(Object.defineProperty({__proto__:null,default:N},Symbol.toStringTag,{value:"Module"})),S=({children:h,className:g="",...d})=>{const[s,a]=e.useState({x:0,y:0}),[l,m]=e.useState(!1),n=e.useCallback(r=>{const M=r.currentTarget.getBoundingClientRect(),b=r.clientX-M.left,R=r.clientY-M.top;a({x:b,y:R})},[]),f=e.useCallback(()=>{m(!0)},[]),i=e.useCallback(()=>{m(!1)},[]);return y.jsxs($.div,{className:`relative overflow-hidden rounded-lg ${g}`,onMouseMove:n,onMouseEnter:f,onMouseLeave:i,whileHover:{scale:1.02},transition:{duration:.3},...d,children:[h,l&&y.jsx("div",{className:"absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none",style:{background:`radial-gradient(circle 300px at ${s.x}px ${s.y}px, rgba(255,255,255,0.2), transparent 40%)`}})]})},X=Object.freeze(Object.defineProperty({__proto__:null,default:S},Symbol.toStringTag,{value:"Module"}));export{B as A,I as F,X as G,D as M,q as P};
