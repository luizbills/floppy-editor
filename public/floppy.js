(()=>{var q=(...l)=>tt(et(...l));var j=new AudioContext,tt=(...l)=>{let o=j.createBuffer(l.length,l[0].length,44100),g=j.createBufferSource();return l.map((d,A)=>o.getChannelData(A).set(d)),g.buffer=o,g.connect(j.destination),g.start(),g},et=(l=1,o=.05,g=220,d=0,A=0,w=.1,H=0,G=1,I=0,k=0,P=0,R=0,z=0,C=0,e=0,L=0,p=0,W=1,T=0,N=0)=>{let h=Math.PI*2,b=i=>i>0?1:-1,F=I*=500*h/44100/44100,O=g*=(1+o*2*Math.random()-o)*h/44100,S=[],r=0,V=0,a=0,D=1,X=0,B=0,_=0,t,n;for(d=d*44100+9,T*=44100,A*=44100,w*=44100,p*=44100,k*=500*h/44100**3,e*=h/44100,P*=h/44100,R*=44100,z=z*44100|0,n=d+T+A+w+p|0;a<n;S[a++]=_)++B%(L*100|0)||(_=H?H>1?H>2?H>3?Math.sin((r%h)**3):Math.max(Math.min(Math.tan(r),1),-1):1-(2*r/h%2+2)%2:1-4*Math.abs(Math.round(r/h)-r/h):Math.sin(r),_=(z?1-N+N*Math.sin(h*a/z):1)*b(_)*Math.abs(_)**G*l*.3*(a<d?a/d:a<d+T?1-(a-d)/T*(1-W):a<d+T+A?W:a<n-p?(n-a-p)/w*W:0),_=p?_/2+(p>a?0:(a<n-p?1:(n-a)/p)*S[a-p|0]/2):_),t=(g+=I+=k)*Math.cos(e*V++),r+=t-t*C*(1-(Math.sin(a)+1)*1e9%2),D&&++D>R&&(g+=P,O+=P,D=0),z&&!(++X%z)&&(g=O,I=F,D=D||1);return S};var m=["#0a080d","#697594","#dfe9f5","#f7aaa8","#d4689a","#782c96","#e83562","#f2825c","#ffc76e","#88c44d","#3f9e59","#373461","#4854a8","#7199d9","#9e5252","#4d2536"];var v=[[1.03,,332,.01,.03,.2,,1.24,-3.6,,,,,.4,309,.3,,.77,.09],[1.35,,470,.18,.07,0,,2.23,,,-948,,.12,.1,-37,,.01,,,.21],[1.38,,570,.06,.16,.36,1,.6,,,158,.09,.15,,,,.16,.85,.22],[3.9,,461,.03,.26,.55,,4.9,,.5,,,.3,1.2,69,.6,.14,.3,.04],[1.99,,542,.01,.13,.39,3,.67,.1,,,,.19,1.6,,.2,.39,.49,.14],[2.5,,450,.05,.15,.38,1,1.72,.2,-.2,128,.13,.18,,,,.08,.79,.13,.31],[,0,261.6256,.07,.1,.26,,1.58,,,,,,.3,,.1,,.43,.17],[1.14,,152,.01,.07,.06,1,1.21,-16,,,,,,,,,.62,.03],[1.61,,1898,.02,.09,.14,2,1.6,-1,-3,450,.09,.05,,,,.07,.87,.03,.04],[1.34,,1117,.07,.07,0,2,.05,,,274,.08,.11,,10,,.09,.82,.11],[,,1705,.24,.15,.12,2,2.97,-5.7,,300,.04,.08],[1.99,,603,,.02,0,,.04,,-.4,473,,,.1,,,.18,.2,.1],[,,248,,.06,.07,4,1.26,,.3,,,.01,,,.1,,.7,.06,.38],[,,1959,.01,.04,.12,,.2,,.1,252,.04,,.1,,,,.5,.01,.09]];var s=globalThis;s.floppy=Q;function Q(l={}){let o={WIDTH:l.width??s.innerWidth,HEIGHT:l.height??s.innerHeight,CANVAS:document.createElement("canvas"),TAPPED:!1,TAPX:0,TAPY:0,TICKS:0,ELAPSED:0,FPS:0,zzfx:q,math:s.Math,loop:{init:[],update:[],draw:[]}},g=l.fps??60,d=l.background??null,A=l.global??!0,w=l.antialias??!0,H=l.fullscreen??!1,G=l.autoscale??!0,I=l.loop??{},k=l.plugins??[],P=1,R={top:0,left:0},z=null,C=null,e=null,L=null,p=null,W=0,T=1/g,N=1e3/g,h=0,b={count:0,time:0},F=Math.PI/180,O=180/Math.PI,S=Math.PI*2,r={set(t,n){o[t]=n,A&&(s[t]=n)}};function V(){_RATIO=o.WIDTH/o.HEIGHT,z=o.WIDTH,C=o.HEIGHT,document.body.appendChild(o.CANVAS),X(o.CANVAS);function t(n){_(!0,n.pageX||0,n.pageY||0)}o.CANVAS.addEventListener("click",function(n){n.preventDefault(),t(n)},!1),o.CANVAS.addEventListener("touchstart",function(n){n.preventDefault(),t(n.touches[0])},!1),D(),(G||H)&&s.addEventListener("resize",D),(I.init||s.init)&&o.loop.init.push(I.init||s.init),(I.update||s.update)&&o.loop.update.push(I.update||s.update),(I.draw||s.draw)&&o.loop.draw.push(I.draw||s.draw),k.sort((n,i)=>(n.priority??10)-(i.priority??10));for(let n of k){let i=n(o,r);for(let f in i)r.set(f,i[f])}for(let n of o.loop.init)n();d!=null&&(o.CANVAS.style.backgroundColor=m[d%16]),p=performance.now(),_rafid=requestAnimationFrame(a)}function a(){let t=0;for(L=performance.now(),W=L-p,p=L,h+=W;h>=N;){for(let n of o.loop.update)n(T);_(!1,0,0),h-=N,t++}if(t>0){r.set("TICKS",t+o.TICKS),r.set("ELAPSED",t*T+o.ELAPSED);for(let n of o.loop.draw)n();b.count++,b.time+=t*T,b.time>=1&&(r.set("FPS",b.count),b.time-=1,b.count=0)}_rafid=requestAnimationFrame(a)}function D(){let t=o.CANVAS;z=s.innerWidth,C=s.innerHeight,H?(P=1,t.width=z,t.height=C,r.set("WIDTH",z),r.set("HEIGHT",C)):G&&(P=Math.min(z/WIDTH,C/HEIGHT),t.style.width=WIDTH*P+"px",t.style.height=HEIGHT*P+"px"),R.top=t.offsetTop,R.left=t.offsetLeft}function X(t){t.width=o.WIDTH,t.height=o.HEIGHT,t.ctx=t.getContext("2d"),e=t.ctx,H?(t.style.position="absolute",t.style.top="0",t.style.right="0",t.style.left="0",t.style.right="0"):(t.style.display="block",t.style.margin=G?"auto":null),w||(e.imageSmoothingEnabled=!1,t.style.imageRendering="pixelated")}function B(){for(let t in o)t in s||(s[t]=o[t])}function _(t,n,i){r.set("TAPX",(n-R.left)/P),r.set("TAPY",(i-R.top)/P),r.set("TAPPED",t)}return o.math.rand=Math.random,o.math.randi=function(t=1,n=100){return Math.floor(Math.random()*(n-t+1)+t)},o.math.lerp=function(t,n,i){return t+(n-t)*i},o.math.deg2rad=function(t){return t*F},o.math.rad2deg=function(t){return t*O},o.math.clamp=function(t,n,i){return Math.min(Math.max(t,n),i)},o.clear=function(t=null){t==null?e.clearRect(0,0,o.WIDTH,o.HEIGHT):(e.fillStyle=m[~~t%16],e.beginPath(),e.fillRect(0,0,o.WIDTH,o.HEIGHT))},o.rect=function(t,n,i,f,u=0,x=1){e.strokeStyle=m[~~u%16],e.lineWidth=~~x,e.beginPath(),e.strokeRect(~~t,~~n,~~i,~~f)},o.rectfill=function(t,n,i,f,u=0){e.fillStyle=m[~~u%16],e.beginPath(),e.fillRect(~~t,~~n,~~i,~~f)},o.circle=function(t,n,i,f=0,u=1){e.strokeStyle=m[~~f%16],e.lineWidth=~~u,e.beginPath(),e.arc(~~t,~~n,~~i,0,S),e.closePath(),e.stroke()},o.circlefill=function(t,n,i,f=0){e.fillStyle=m[~~f%16],e.beginPath(),e.arc(~~t,~~n,~~i,0,S),e.closePath(),e.fill()},o.oval=function(t,n,i,f,u=0,x=1){e.strokeStyle=m[~~u%16],e.lineWidth=~~x,e.beginPath(),e.ellipse(~~t+~~i,~~n+~~f,~~i,~~f,0,0,S),e.closePath(),e.stroke()},o.ovalfill=function(t,n,i,f,u=0,x=1){e.strokeStyle=m[~~u%16],e.lineWidth=~~x,e.beginPath(),e.ellipse(~~t+~~i,~~n+~~f,~~i,~~f,0,0,S),e.closePath(),e.fill()},o.line=function(t,n,i,f,u=0,x=1){e.strokeStyle=m[~~u%16],e.beginPath(),e.lineWidth=~~x,e.moveTo(~~t,~~n),e.lineTo(~~i,~~f),e.stroke()},o.text=function(t,n,i,f,u=0,x="monospace"){e.textBaseline="top",e.font=~~f+"px "+x,e.fillStyle=m[~~u%16],e.fillText(t,~~n,~~i)},o.image=function(t,n,i){e.drawImage(t,~~n,~~i)},o.paint=function(t,n,i){let f=new OffscreenCanvas(t,n),u=e;if(f.width=t,f.height=n,e=f.getContext("2d"),typeof i=="function")i(f,e);else if(Array.isArray(i)){let x=e.createImageData(t,n),E=x.data,K=y=0;for(let U of i){for(let Y of U.split("")){let M=y*(t*4)+K*4;if(Y===" "||Y===".")E[M]=0,E[M+1]=0,E[M+2]=0,E[M+3]=0;else{c=m[~~parseInt(Y,16)];let Z=parseInt(c.slice(1,3),16),$=parseInt(c.slice(3,5),16),J=parseInt(c.slice(5,7),16);E[M]=Z,E[M+1]=$,E[M+2]=J,E[M+3]=255}K++}y++,K=0}e.putImageData(x,0,0)}return e=u,f},o.transform=function(t,n,i=1,f=0){e.setTransform(i,0,0,i,t,n),e.rotate(o.math.deg2rad(f))},o.push=function(){e.save()},o.pop=function(){e.restore()},o.sfx=function(t){return o.zzfx(...v[~~t%v.length])},A&&B(),s.document.readyState==="loading"?s.addEventListener("DOMContentLoaded",V):V(),o}})();
