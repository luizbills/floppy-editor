(()=>{var ot=(...a)=>Tt(xt(...a));var Z=new AudioContext,Tt=(...a)=>{let r=Z.createBuffer(a.length,a[0].length,44100),m=Z.createBufferSource();return a.map((u,D)=>r.getChannelData(D).set(u)),m.buffer=r,m.connect(Z.destination),m.start(),m},xt=(a=1,r=.05,m=220,u=0,D=0,e=.1,W=0,O=1,L=0,v=0,k=0,R=0,P=0,j=0,S=0,q=0,A=0,M=1,_=0,E=0)=>{let s=Math.PI*2,b=$=>$>0?1:-1,Y=L*=500*s/44100/44100,C=m*=(1+r*2*Math.random()-r)*s/44100,n=[],h=0,H=0,p=0,w=1,F=0,V=0,x=0,z,d;for(u=u*44100+9,_*=44100,D*=44100,e*=44100,A*=44100,v*=500*s/44100**3,S*=s/44100,k*=s/44100,R*=44100,P=P*44100|0,d=u+_+D+e+A|0;p<d;n[p++]=x)++V%(q*100|0)||(x=W?W>1?W>2?W>3?Math.sin((h%s)**3):Math.max(Math.min(Math.tan(h),1),-1):1-(2*h/s%2+2)%2:1-4*Math.abs(Math.round(h/s)-h/s):Math.sin(h),x=(P?1-E+E*Math.sin(s*p/P):1)*b(x)*Math.abs(x)**O*a*.3*(p<u?p/u:p<u+_?1-(p-u)/_*(1-M):p<u+_+D?M:p<d-A?(d-p-A)/e*M:0),x=A?x/2+(A>p?0:(p<d-A?1:(d-p)/A)*n[p-A|0]/2):x),z=(m+=L+=v)*Math.cos(S*H++),h+=z-z*j*(1-(Math.sin(p)+1)*1e9%2),w&&++w>R&&(m+=k,C+=k,w=0),P&&!(++F%P)&&(m=C,L=Y,w=w||1);return n};var T=["#1a1c2c","#333c57","#566c86","#f4f4f4","#5d275d","#b13e53","#f89b99","#ef7d57","#ffcd75","#a7f070","#38b764","#257179","#29366f","#3b5dc9","#41a6f6","#73eff7"];var it=[[1.5,,332,.01,.03,.2,,1.24,-3.6,,,,,.4,309,.3,,.77,.09],[1.5,,603,,.02,0,,.04,,-.4,473,,,.1,,,.18,.2,.1],[1.5,,152,.01,.07,.06,1,1.21,-16,,,,,,,,,.62,.03],[,,468,.02,.22,.45,1,.84,,5.6,-37,.05,.09,,,,,.8,.27,.05],[,,1959,.01,.04,.12,,.2,,.1,252,.04,,.1,,,,.5,.01,.09],[2.5,,450,.05,.15,.38,1,1.72,.2,-.2,128,.13,.18,,,,.08,.79,.13,.31],[1.5,,261.6256,.07,.1,.26,,1.58,,,,,,.3,,.1,,.43,.17],[2.63,,1727,,.03,.23,,2.65,,-89,5,.06,,,166,,.12,.72],[,,391,.03,.26,.45,1,.07,,,-11,.07,.1,,,,,.56,.14,.2],[1.34,,1117,.07,.07,0,2,.05,,,274,.08,.11,,10,,.09,.82,.11],[,,1705,.24,.15,.12,2,2.97,-5.7,,300,.04,.08],[1.35,,470,.18,.07,0,,2.23,,,-948,,.12,.1,-37,,.01,,,.21],[,,248,,.06,.07,4,1.26,,.3,,,.01,,,.1,,.7,.06,.38],[2.5,,328,.03,.26,.4,4,1.09,.5,.1,,,,.5,,.3,.33,.43,.05,.45],[1.5,,0,.02,,.04,,.37,9.9,,,,,.1,,,.24,,.15],[2,,657,.22,.33,0,3,.28,,-.7,,,.36,,,,.13,.8,.02,.73]];function lt(a={}){let r=window,m=r.document.body,u=(t,o,i)=>t.addEventListener(o,i),D=(t,o,i)=>t.removeEventListener(o,i),e={WIDTH:a.width??null,HEIGHT:a.height??null,CANVAS:r.document.createElement("canvas"),PARENT:a.parent??m,TAPPED:!1,TAPPING:!1,TAPX:0,TAPY:0,ELAPSED:0,FPS:0,CENTERX:0,CENTERY:0,math:r.Math,loop:{init:[],update:[],draw:[]}},W=a.fps??60,O=a.background??null,L=a.global??!0,v=a.antialias??!0,k=a.pixelart??!1,R=a.fullscreen??!0,P=a.autoscale??!0,j=a.tappingInterval??100,S=a.loop??{},q=a.plugins??[],A="ontouchstart"in r||r.navigator.maxTouchPoints>0,M=0,_=0,E=null,s=1,b={top:0,left:0},Y=null,C=null,n=null,h={},H=null,p=0,w=0,F=1/W,V=1e3/W,x=0,z=0,d={count:0,time:0},$=Math.PI/180,ft=180/Math.PI,U=Math.PI*2,rt=[],B,g={set(t,o){e[t]=o,L&&(r[t]=o)}};function tt(){if(_RATIO=e.WIDTH/e.HEIGHT,Y=e.WIDTH,C=e.HEIGHT,A){let t=0,o=0;E=i=>{if(H=performance.now(),H-_>j){let l=i.touches[0];X(!0,l.pageX,l.pageY),_=H}},u(e.CANVAS,"touchstart",function(i){i.preventDefault();let l=i.touches[0];t=l.pageX,o=l.pageY,u(m,"touchmove",E),X(!0,l.pageX,l.pageY),_=M=performance.now()}),u(e.CANVAS,"touchend",function(i){i.preventDefault(),D(m,"touchmove",E),X(!1),performance.now()-M<=150&&nt(!0,t,o)})}else E=t=>{H=performance.now(),H-_>j&&(_=H,X(!0,t.pageX,t.pageY))},u(e.CANVAS,"mousedown",function(t){t.preventDefault(),u(m,"mousemove",E),X(!0,t.pageX,t.pageY),_=M=performance.now()}),u(e.CANVAS,"mouseup",function(t){t.preventDefault(),D(m,"mousemove",E),X(!1),performance.now()-M<=150&&nt(!0,t.pageX,t.pageY)});u(r,"focus",()=>{z===0&&(p=performance.now(),z=requestAnimationFrame(J))}),u(r,"blur",()=>{z&&(cancelAnimationFrame(z),z=0),D(m,A?"mousemove":"touchmove",E),X(!1)}),et(),(P||R)&&u(r,"resize",et),(S.init||r.init)&&e.loop.init.push(S.init||r.init),(S.update||r.update)&&e.loop.update.push(S.update||r.update),(S.draw||r.draw)&&e.loop.draw.push(S.draw||r.draw),at();for(let t of e.loop.init)t();O!=null&&(e.CANVAS.style.backgroundColor=T[O%16]),p=performance.now(),z=requestAnimationFrame(J)}function J(){let t=0;for(H=performance.now(),w=H-p,p=H,x+=w,w>1e3&&(x=V);x>=V;){for(let o of e.loop.update)o(F);g.set("ELAPSED",e.ELAPSED+F),x-=V,t++,st()}if(t>0){for(let o of e.loop.draw)o();d.count++,d.time+=t*F,d.time>=1&&(g.set("FPS",d.count),d.time-=1,d.count=0)}z=requestAnimationFrame(J)}function at(){q.sort((t,o)=>(t.priority??10)-(o.priority??10));for(let t of q){let o=t(e,g);if(o)for(let i in o)g.set(i,o[i])}}function ct(t){e.WIDTH>0&&R&&(R=!1,e.HEIGHT=e.HEIGHT>0?e.HEIGHT:e.WIDTH),t.width=e.WIDTH,t.height=e.HEIGHT,g.set("CENTERX",e.WIDTH/2),g.set("CENTERY",e.HEIGHT/2),e.PARENT.appendChild(t),t.ctx=t.getContext("2d"),n=t.ctx,n.textAlign="start",n.textBaseline="top",t.style.display="block",R?(t.style.position="absolute",t.style.top=t.style.bottom=t.style.left=t.style.right=0):P&&(t.style.margin="auto"),k&&(v=!1),v||(n.imageSmoothingEnabled=!1,t.style.imageRendering="pixelated"),b.top=t.offsetTop,b.left=t.offsetLeft}function et(){let t=e.CANVAS;!P&&!R||(Y=r.innerWidth,C=r.innerHeight,R?(t.width=Y,t.height=C,g.set("WIDTH",Y),g.set("HEIGHT",C)):P&&(s=Math.min(Y/e.WIDTH,C/e.HEIGHT),s=k?Math.floor(s):s,t.style.width=e.WIDTH*s+"px",t.style.height=e.HEIGHT*s+"px"),g.set("CENTERX",e.WIDTH/2),g.set("CENTERY",e.HEIGHT/2),b.top=t.offsetTop,b.left=t.offsetLeft,e.textalign(h.textAlign||B,h.textBaseline||B),e.linestyle(h.lineWidth||B,h.lineJoin||B,h.lineDash||B))}function ut(){for(let t in e){if(t in r){console.warn(`${t} already exists in global context`);continue}r[t]=e[t]}}function st(){g.set("TAPPED",!1)}function nt(t,o,i){g.set("TAPPED",t),g.set("TAPX",(o-b.left)/s),g.set("TAPY",(i-b.top)/s)}function X(t,o,i){g.set("TAPPING",t),g.set("TAPX",(o-b.left)/s),g.set("TAPY",(i-b.top)/s)}return e.math.rand=Math.random,e.math.randi=function(t=1,o=100){return Math.floor(Math.random()*(o-t+1)+t)},e.math.lerp=function(t,o,i){return t+(o-t)*i},e.math.deg2rad=function(t){return t*$},e.math.rad2deg=function(t){return t*ft},e.math.clamp=function(t,o,i){return Math.min(Math.max(t,o),i)},e.clear=function(t=null){t==null?n.clearRect(0,0,e.WIDTH,e.HEIGHT):(n.fillStyle=T[~~t%16],n.beginPath(),n.fillRect(0,0,e.WIDTH,e.HEIGHT))},e.rect=function(t,o,i,l,f=0){n.strokeStyle=T[~~f%16],n.beginPath(),n.strokeRect(~~t,~~o,~~i,~~l)},e.rectfill=function(t,o,i,l,f=0){n.fillStyle=T[~~f%16],n.beginPath(),n.fillRect(~~t,~~o,~~i,~~l)},e.circle=function(t,o,i,l=0){n.strokeStyle=T[~~l%16],n.beginPath(),n.arc(~~t,~~o,~~i,0,U),n.closePath(),n.stroke()},e.circlefill=function(t,o,i,l=0){n.fillStyle=T[~~l%16],n.beginPath(),n.arc(~~t,~~o,~~i,0,U),n.closePath(),n.fill()},e.oval=function(t,o,i,l,f=0){n.strokeStyle=T[~~f%16],n.beginPath(),n.ellipse(~~t+~~i,~~o+~~l,~~i,~~l,0,0,U),n.closePath(),n.stroke()},e.ovalfill=function(t,o,i,l,f=0){n.fillStyle=T[~~f%16],n.beginPath(),n.ellipse(~~t+~~i,~~o+~~l,~~i,~~l,0,0,U),n.closePath(),n.fill()},e.triangle=function(t,o,i,l,f,G,I=0){e.poly([t,o,i,l,f,G],I)},e.trianglefill=function(t,o,i,l,f,G,I=0){e.polyfill([t,o,i,l,f,G],I)},e.poly=function(t,o=0){n.strokeStyle=T[~~o%16],n.beginPath();let i=t.length;for(let l=0;l<i;l+=2)l===0?n.moveTo(~~t[l],~~t[l+1]):n.lineTo(~~t[l],~~t[l+1]);n.lineTo(~~t[0],~~t[1]),n.stroke()},e.polyfill=function(t,o=0){n.fillStyle=T[~~o%16],n.beginPath();let i=t.length;for(let l=0;l<i;l+=2)l===0?n.moveTo(t[l],t[l+1]):n.lineTo(t[l],t[l+1]);n.lineTo(t[0],t[1]),n.fill()},e.line=function(t,o,i,l,f=0){n.strokeStyle=T[~~f%16],n.beginPath(),n.moveTo(~~t,~~o),n.lineTo(~~i,~~l),n.stroke()},e.linestyle=function(t=1,o="miter",i=null){n.lineWidth=h.lineWidth=t,n.lineJoin=h.lineJoin=o,i?(h.lineDash=Array.isArray(i)?i:[i],n.setLineDash(h.lineDash)):(h.lineDash=rt,n.setLineDash(h.lineDash))},e.text=function(t,o,i,l=0,f=null,G="monospace"){f=f||Math.max(16,e.HEIGHT/16),n.font=~~f+"px "+G,n.fillStyle=T[~~l%16],n.fillText(i,~~t,~~o)},e.textalign=function(t="start",o="top"){n.textAlign=h.textAlign=t,n.textBaseline=h.textBaseline=o},e.image=function(t,o,i){n.drawImage(i,~~t,~~o)},e.paint=function(t,o,i){let l=new OffscreenCanvas(t,o),f=n;if(l.width=t,l.height=o,n=l.getContext("2d"),typeof i=="function")i(l,n);else if(Array.isArray(i)){let G=n.createImageData(t,o),I=G.data,K=y=0;for(let ht of i){for(let Q of ht.split("")){let N=y*(t*4)+K*4;if(Q===" "||Q===".")I[N]=0,I[N+1]=0,I[N+2]=0,I[N+3]=0;else{c=T[~~parseInt(Q,16)];let pt=parseInt(c.slice(1,3),16),gt=parseInt(c.slice(3,5),16),mt=parseInt(c.slice(5,7),16);I[N]=pt,I[N+1]=gt,I[N+2]=mt,I[N+3]=255}K++}y++,K=0}n.putImageData(G,0,0)}return n=f,l},e.transform=function(t,o,i=1,l=0){n.setTransform(i,0,0,i,t,o),n.rotate(l)},e.alpha=function(t=1){n.globalAlpha=t},e.push=function(){n.save()},e.pop=function(){n.restore()},e.sfx=function(t=0,o=1,i=0,l=null){if(console.log(),navigator.userActivation&&!navigator.userActivation.hasBeenActive)return;let f=Array.isArray(t)?t:it[~~t%16];return(o!==1||i!==0||l!=null)&&(f=[...f],f[0]=(Number(o)||1)*(f[0]||1),f[1]=l>=0?l:void 0,f[10]=~~f[10]+~~i),ot(...f)},L&&ut(),ct(e.CANVAS),r.document.readyState==="loading"?u(r,"DOMContentLoaded",tt):tt(),e}window.floppy=lt;})();
