(()=>{var Q=(...r)=>et(nt(...r));var q=new AudioContext,et=(...r)=>{let e=q.createBuffer(r.length,r[0].length,44100),d=q.createBufferSource();return r.map((h,b)=>e.getChannelData(b).set(h)),d.buffer=e,d.connect(q.destination),d.start(),d},nt=(r=1,e=.05,d=220,h=0,b=0,L=.1,T=0,W=1,m=0,k=0,H=0,A=0,g=0,C=0,n=0,N=0,p=0,G=1,E=0,O=0)=>{let s=Math.PI*2,V=o=>o>0?1:-1,D=m*=500*s/44100/44100,X=d*=(1+e*2*Math.random()-e)*s/44100,F=[],x=0,z=0,a=0,S=1,K=0,B=0,_=0,w,t;for(h=h*44100+9,E*=44100,b*=44100,L*=44100,p*=44100,k*=500*s/44100**3,n*=s/44100,H*=s/44100,A*=44100,g=g*44100|0,t=h+E+b+L+p|0;a<t;F[a++]=_)++B%(N*100|0)||(_=T?T>1?T>2?T>3?Math.sin((x%s)**3):Math.max(Math.min(Math.tan(x),1),-1):1-(2*x/s%2+2)%2:1-4*Math.abs(Math.round(x/s)-x/s):Math.sin(x),_=(g?1-O+O*Math.sin(s*a/g):1)*V(_)*Math.abs(_)**W*r*.3*(a<h?a/h:a<h+E?1-(a-h)/E*(1-G):a<h+E+b?G:a<t-p?(t-a-p)/L*G:0),_=p?_/2+(p>a?0:(a<t-p?1:(t-a)/p)*F[a-p|0]/2):_),w=(d+=m+=k)*Math.cos(n*z++),x+=w-w*C*(1-(Math.sin(a)+1)*1e9%2),S&&++S>A&&(d+=H,X+=H,S=0),g&&!(++K%g)&&(d=X,m=D,S=S||1);return F};var I=["#0a080d","#f4f4f4","#697594","#f7aaa8","#d4689a","#782c96","#e83562","#f2825c","#ffc76e","#88c44d","#3f9e59","#373461","#4854a8","#7199d9","#9e5252","#4d2536"];var U=[[1.5,,332,.01,.03,.2,,1.24,-3.6,,,,,.4,309,.3,,.77,.09],[1.5,,603,,.02,0,,.04,,-.4,473,,,.1,,,.18,.2,.1],[1.5,,152,.01,.07,.06,1,1.21,-16,,,,,,,,,.62,.03],[,,468,.02,.22,.45,1,.84,,5.6,-37,.05,.09,,,,,.8,.27,.05],[,,1959,.01,.04,.12,,.2,,.1,252,.04,,.1,,,,.5,.01,.09],[2.5,,450,.05,.15,.38,1,1.72,.2,-.2,128,.13,.18,,,,.08,.79,.13,.31],[1.5,0,261.6256,.07,.1,.26,,1.58,,,,,,.3,,.1,,.43,.17],[2.63,,1727,,.03,.23,,2.65,,-89,5,.06,,,166,,.12,.72],[,,391,.03,.26,.45,1,.07,,,-11,.07,.1,,,,,.56,.14,.2],[1.34,,1117,.07,.07,0,2,.05,,,274,.08,.11,,10,,.09,.82,.11],[,,1705,.24,.15,.12,2,2.97,-5.7,,300,.04,.08],[1.35,,470,.18,.07,0,,2.23,,,-948,,.12,.1,-37,,.01,,,.21],[,,248,,.06,.07,4,1.26,,.3,,,.01,,,.1,,.7,.06,.38],[2.5,,328,.03,.26,.4,4,1.09,.5,.1,,,,.5,,.3,.33,.43,.05,.45],[1.5,,0,.02,,.04,,.37,9.9,,,,,.1,,,.24,,.15],[2,,657,.22,.33,0,3,.28,,-.7,,,.36,,,,.13,.8,.02,.73]];var u=globalThis;u.floppy=Z;function Z(r={}){let e={WIDTH:r.width??null,HEIGHT:r.height??null,CANVAS:document.createElement("canvas"),PARENT:r.parent??document.body,TAPPED:!1,TAPX:0,TAPY:0,TICKS:0,ELAPSED:0,FPS:0,zzfx:Q,math:u.Math,loop:{init:[],update:[],draw:[]}},d=r.fps??60,h=r.background??null,b=r.global??!0,L=r.antialias??!0,T=r.fullscreen??!1,W=r.autoscale??!0,m=r.loop??{},k=r.plugins??[],H=1,A={top:0,left:0},g=null,C=null,n=null,N=null,p=0,G=0,E=1/d,O=1e3/d,s=0,V=0,D={count:0,time:0},X=Math.PI/180,F=180/Math.PI,x=Math.PI*2,z={set(t,o){e[t]=o,b&&(u[t]=o)}};function a(){_RATIO=e.WIDTH/e.HEIGHT,g=e.WIDTH,C=e.HEIGHT;function t(o){w(!0,o.pageX||0,o.pageY||0)}e.CANVAS.addEventListener("click",function(o){o.preventDefault(),t(o)},!1),e.CANVAS.addEventListener("touchstart",function(o){o.preventDefault(),t(o.touches[0])},!1),B(),(W||T)&&u.addEventListener("resize",B),(m.init||u.init)&&e.loop.init.push(m.init||u.init),(m.update||u.update)&&e.loop.update.push(m.update||u.update),(m.draw||u.draw)&&e.loop.draw.push(m.draw||u.draw),k.sort((o,i)=>(o.priority??10)-(i.priority??10));for(let o of k){let i=o(e,z);for(let f in i)z.set(f,i[f])}for(let o of e.loop.init)o();h!=null&&(e.CANVAS.style.backgroundColor=I[h%16]),p=performance.now(),V=requestAnimationFrame(S)}function S(){let t=0;for(N=performance.now(),G=N-p,p=N,s+=G,s>=100&&(s=0);s>=O;){for(let o of e.loop.update)o(E);w(!1,0,0),s-=O,t++}if(t>0){z.set("TICKS",e.TICKS+t),z.set("ELAPSED",e.ELAPSED+t*E);for(let o of e.loop.draw)o();D.count++,D.time+=t*E,D.time>=1&&(z.set("FPS",D.count),D.time-=1,D.count=0)}V=requestAnimationFrame(S)}function K(t){e.WIDTH>0&&T&&(T=!1,e.HEIGHT=e.HEIGHT>0?e.HEIGHT:e.WIDTH),t.width=e.WIDTH,t.height=e.HEIGHT,e.PARENT.appendChild(t),t.ctx=t.getContext("2d"),n=t.ctx,t.style.display="block",T?(t.style.position="absolute",t.style.top=t.style.bottom=t.style.left=t.style.right=0):t.style.margin=W?"auto":null,L||(n.imageSmoothingEnabled=!1,t.style.imageRendering="pixelated"),A.top=t.offsetTop,A.left=t.offsetLeft}function B(){let t=e.CANVAS;!W&&!T||(g=u.innerWidth,C=u.innerHeight,T?(t.width=g,t.height=C,z.set("WIDTH",g),z.set("HEIGHT",C)):W&&(H=Math.min(g/e.WIDTH,C/e.HEIGHT),t.style.width=e.WIDTH*H+"px",t.style.height=e.HEIGHT*H+"px",console.log(H)),A.top=t.offsetTop,A.left=t.offsetLeft)}function _(){for(let t in e)t in u||(u[t]=e[t])}function w(t,o,i){z.set("TAPX",(o-A.left)/H),z.set("TAPY",(i-A.top)/H),z.set("TAPPED",t)}return e.math.rand=Math.random,e.math.randi=function(t=1,o=100){return Math.floor(Math.random()*(o-t+1)+t)},e.math.lerp=function(t,o,i){return t+(o-t)*i},e.math.deg2rad=function(t){return t*X},e.math.rad2deg=function(t){return t*F},e.math.clamp=function(t,o,i){return Math.min(Math.max(t,o),i)},e.clear=function(t=null){t==null?n.clearRect(0,0,e.WIDTH,e.HEIGHT):(n.fillStyle=I[~~t%16],n.beginPath(),n.fillRect(0,0,e.WIDTH,e.HEIGHT))},e.rect=function(t,o,i,f,l=0,P=1){n.strokeStyle=I[~~l%16],n.lineWidth=~~P,n.beginPath(),n.strokeRect(~~t,~~o,~~i,~~f)},e.rectfill=function(t,o,i,f,l=0){n.fillStyle=I[~~l%16],n.beginPath(),n.fillRect(~~t,~~o,~~i,~~f)},e.circle=function(t,o,i,f=0,l=1){n.strokeStyle=I[~~f%16],n.lineWidth=~~l,n.beginPath(),n.arc(~~t,~~o,~~i,0,x),n.closePath(),n.stroke()},e.circlefill=function(t,o,i,f=0){n.fillStyle=I[~~f%16],n.beginPath(),n.arc(~~t,~~o,~~i,0,x),n.closePath(),n.fill()},e.oval=function(t,o,i,f,l=0,P=1){n.strokeStyle=I[~~l%16],n.lineWidth=~~P,n.beginPath(),n.ellipse(~~t+~~i,~~o+~~f,~~i,~~f,0,0,x),n.closePath(),n.stroke()},e.ovalfill=function(t,o,i,f,l=0){n.strokeStyle=I[~~l%16],n.beginPath(),n.ellipse(~~t+~~i,~~o+~~f,~~i,~~f,0,0,x),n.closePath(),n.fill()},e.line=function(t,o,i,f,l=0,P=1){n.strokeStyle=I[~~l%16],n.beginPath(),n.lineWidth=~~P,n.moveTo(~~t,~~o),n.lineTo(~~i,~~f),n.stroke()},e.text=function(t,o,i,f=0,l=null,P="monospace"){l=l||Math.max(16,e.HEIGHT/16),n.textBaseline="top",n.font=~~l+"px "+P,n.fillStyle=I[~~f%16],n.fillText(i,~~t,~~o)},e.image=function(t,o,i){n.drawImage(i,~~t,~~o)},e.paint=function(t,o,i){let f=new OffscreenCanvas(t,o),l=n;if(f.width=t,f.height=o,n=f.getContext("2d"),typeof i=="function")i(f,n);else if(Array.isArray(i)){let P=n.createImageData(t,o),M=P.data,Y=y=0;for(let $ of i){for(let j of $.split("")){let R=y*(t*4)+Y*4;if(j===" "||j===".")M[R]=0,M[R+1]=0,M[R+2]=0,M[R+3]=0;else{c=I[~~parseInt(j,16)];let v=parseInt(c.slice(1,3),16),J=parseInt(c.slice(3,5),16),tt=parseInt(c.slice(5,7),16);M[R]=v,M[R+1]=J,M[R+2]=tt,M[R+3]=255}Y++}y++,Y=0}n.putImageData(P,0,0)}return n=l,f},e.transform=function(t,o,i=1,f=0){n.setTransform(i,0,0,i,t,o),n.rotate(e.math.deg2rad(f))},e.push=function(){n.save()},e.pop=function(){n.restore()},e.sfx=function(t=0,o=1,i=0,f=0){let l=U[~~t%U.length];return(l!==1||i!==0||f!==0)&&(l=[...l],l[0]=(Number(o)||1)*(l[0]||1),l[1]=f>=0?f:0,l[10]=~~l[10]+~~i),Q(...l)},b&&_(),K(e.CANVAS),u.document.readyState==="loading"?u.addEventListener("DOMContentLoaded",a):a(),e}})();
