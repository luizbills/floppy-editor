(()=>{var U=(...a)=>nt(ot(...a));var Q=new AudioContext,nt=(...a)=>{let e=Q.createBuffer(a.length,a[0].length,44100),g=Q.createBufferSource();return a.map((h,b)=>e.getChannelData(b).set(h)),g.buffer=e,g.connect(Q.destination),g.start(),g},ot=(a=1,e=.05,g=220,h=0,b=0,N=.1,G=0,D=1,M=0,T=0,k=0,m=0,d=0,L=0,S=0,n=0,p=0,R=1,H=0,F=0)=>{let u=Math.PI*2,O=t=>t>0?1:-1,_=M*=500*u/44100/44100,A=g*=(1+e*2*Math.random()-e)*u/44100,X=[],P=0,V=0,r=0,w=1,B=0,Y=0,z=0,K,E;for(h=h*44100+9,H*=44100,b*=44100,N*=44100,p*=44100,T*=500*u/44100**3,S*=u/44100,k*=u/44100,m*=44100,d=d*44100|0,E=h+H+b+N+p|0;r<E;X[r++]=z)++Y%(n*100|0)||(z=G?G>1?G>2?G>3?Math.sin((P%u)**3):Math.max(Math.min(Math.tan(P),1),-1):1-(2*P/u%2+2)%2:1-4*Math.abs(Math.round(P/u)-P/u):Math.sin(P),z=(d?1-F+F*Math.sin(u*r/d):1)*O(z)*Math.abs(z)**D*a*.3*(r<h?r/h:r<h+H?1-(r-h)/H*(1-R):r<h+H+b?R:r<E-p?(E-r-p)/N*R:0),z=p?z/2+(p>r?0:(r<E-p?1:(E-r)/p)*X[r-p|0]/2):z),K=(g+=M+=T)*Math.cos(S*V++),P+=K-K*L*(1-(Math.sin(r)+1)*1e9%2),w&&++w>m&&(g+=k,A+=k,w=0),d&&!(++B%d)&&(g=A,M=_,w=w||1);return X};var x=["#0a080d","#f4f4f4","#697594","#f7aaa8","#d4689a","#782c96","#e83562","#f2825c","#ffc76e","#88c44d","#3f9e59","#373461","#4854a8","#7199d9","#9e5252","#4d2536"];var Z=[[1.5,,332,.01,.03,.2,,1.24,-3.6,,,,,.4,309,.3,,.77,.09],[1.5,,603,,.02,0,,.04,,-.4,473,,,.1,,,.18,.2,.1],[1.5,,152,.01,.07,.06,1,1.21,-16,,,,,,,,,.62,.03],[,,468,.02,.22,.45,1,.84,,5.6,-37,.05,.09,,,,,.8,.27,.05],[,,1959,.01,.04,.12,,.2,,.1,252,.04,,.1,,,,.5,.01,.09],[2.5,,450,.05,.15,.38,1,1.72,.2,-.2,128,.13,.18,,,,.08,.79,.13,.31],[1.5,0,261.6256,.07,.1,.26,,1.58,,,,,,.3,,.1,,.43,.17],[2.63,,1727,,.03,.23,,2.65,,-89,5,.06,,,166,,.12,.72],[,,391,.03,.26,.45,1,.07,,,-11,.07,.1,,,,,.56,.14,.2],[1.34,,1117,.07,.07,0,2,.05,,,274,.08,.11,,10,,.09,.82,.11],[,,1705,.24,.15,.12,2,2.97,-5.7,,300,.04,.08],[1.35,,470,.18,.07,0,,2.23,,,-948,,.12,.1,-37,,.01,,,.21],[,,248,,.06,.07,4,1.26,,.3,,,.01,,,.1,,.7,.06,.38],[2.5,,328,.03,.26,.4,4,1.09,.5,.1,,,,.5,,.3,.33,.43,.05,.45],[1.5,,0,.02,,.04,,.37,9.9,,,,,.1,,,.24,,.15],[2,,657,.22,.33,0,3,.28,,-.7,,,.36,,,,.13,.8,.02,.73]];var s=globalThis;s.floppy=$;function $(a={}){let e={WIDTH:a.width??null,HEIGHT:a.height??null,CANVAS:document.createElement("canvas"),PARENT:a.parent??document.body,TAPPED:!1,TAPX:0,TAPY:0,TICKS:0,ELAPSED:0,FPS:0,math:s.Math,loop:{init:[],update:[],draw:[]}},g=a.fps??60,h=a.background??null,b=a.global??!0,N=a.antialias??!0,G=a.pixelart??!1,D=a.fullscreen??!0,M=a.autoscale??!0,T=a.loop??{},k=a.plugins??[],m=1,d={top:0,left:0},L=null,S=null,n=null,p=null,R=0,H=0,F=1/g,u=1e3/g,O=0,_=0,A={count:0,time:0},X=Math.PI/180,P=180/Math.PI,V=Math.PI*2,r={set(t,o){e[t]=o,b&&(s[t]=o)}};function w(){_RATIO=e.WIDTH/e.HEIGHT,L=e.WIDTH,S=e.HEIGHT;function t(o){E(!0,o.pageX||0,o.pageY||0)}e.CANVAS.addEventListener("click",function(o){o.preventDefault(),t(o)},!1),e.CANVAS.addEventListener("touchstart",function(o){o.preventDefault(),t(o.touches[0])},!1),window.addEventListener("focus",()=>{_===0&&(R=performance.now(),_=requestAnimationFrame(B))}),window.addEventListener("blur",()=>{_&&(cancelAnimationFrame(_),_=0)}),z(),(M||D)&&s.addEventListener("resize",z),(T.init||s.init)&&e.loop.init.push(T.init||s.init),(T.update||s.update)&&e.loop.update.push(T.update||s.update),(T.draw||s.draw)&&e.loop.draw.push(T.draw||s.draw),k.sort((o,i)=>(o.priority??10)-(i.priority??10));for(let o of k){let i=o(e,r);for(let f in i)r.set(f,i[f])}for(let o of e.loop.init)o();h!=null&&(e.CANVAS.style.backgroundColor=x[h%16]),R=performance.now(),_=requestAnimationFrame(B)}function B(){let t=0;for(p=performance.now(),H=p-R,R=p,O+=H,H>1e3&&(O=u);O>=u;){for(let o of e.loop.update)o(F);E(!1,0,0),O-=u,t++}if(t>0){r.set("TICKS",e.TICKS+t),r.set("ELAPSED",e.ELAPSED+t*F);for(let o of e.loop.draw)o();A.count++,A.time+=t*F,A.time>=1&&(r.set("FPS",A.count),A.time-=1,A.count=0)}_=requestAnimationFrame(B)}function Y(t){e.WIDTH>0&&D&&(D=!1,e.HEIGHT=e.HEIGHT>0?e.HEIGHT:e.WIDTH),t.width=e.WIDTH,t.height=e.HEIGHT,e.PARENT.appendChild(t),t.ctx=t.getContext("2d"),n=t.ctx,t.style.display="block",D?(t.style.position="absolute",t.style.top=t.style.bottom=t.style.left=t.style.right=0):M&&(t.style.margin="auto"),G&&(N=!1),N||(n.imageSmoothingEnabled=!1,t.style.imageRendering="pixelated"),d.top=t.offsetTop,d.left=t.offsetLeft}function z(){let t=e.CANVAS;!M&&!D||(L=s.innerWidth,S=s.innerHeight,D?(t.width=L,t.height=S,r.set("WIDTH",L),r.set("HEIGHT",S)):M&&(m=Math.min(L/e.WIDTH,S/e.HEIGHT),m=G?Math.floor(m):m,t.style.width=e.WIDTH*m+"px",t.style.height=e.HEIGHT*m+"px"),d.top=t.offsetTop,d.left=t.offsetLeft)}function K(){for(let t in e)t in s||(s[t]=e[t])}function E(t,o,i){r.set("TAPX",(o-d.left)/m),r.set("TAPY",(i-d.top)/m),r.set("TAPPED",t)}return e.math.rand=Math.random,e.math.randi=function(t=1,o=100){return Math.floor(Math.random()*(o-t+1)+t)},e.math.lerp=function(t,o,i){return t+(o-t)*i},e.math.deg2rad=function(t){return t*X},e.math.rad2deg=function(t){return t*P},e.math.clamp=function(t,o,i){return Math.min(Math.max(t,o),i)},e.clear=function(t=null){t==null?n.clearRect(0,0,e.WIDTH,e.HEIGHT):(n.fillStyle=x[~~t%16],n.beginPath(),n.fillRect(0,0,e.WIDTH,e.HEIGHT))},e.rect=function(t,o,i,f,l=0,I=1){n.strokeStyle=x[~~l%16],n.lineWidth=~~I,n.beginPath(),n.strokeRect(~~t,~~o,~~i,~~f)},e.rectfill=function(t,o,i,f,l=0){n.fillStyle=x[~~l%16],n.beginPath(),n.fillRect(~~t,~~o,~~i,~~f)},e.circle=function(t,o,i,f=0,l=1){n.strokeStyle=x[~~f%16],n.lineWidth=~~l,n.beginPath(),n.arc(~~t,~~o,~~i,0,V),n.closePath(),n.stroke()},e.circlefill=function(t,o,i,f=0){n.fillStyle=x[~~f%16],n.beginPath(),n.arc(~~t,~~o,~~i,0,V),n.closePath(),n.fill()},e.oval=function(t,o,i,f,l=0,I=1){n.strokeStyle=x[~~l%16],n.lineWidth=~~I,n.beginPath(),n.ellipse(~~t+~~i,~~o+~~f,~~i,~~f,0,0,V),n.closePath(),n.stroke()},e.ovalfill=function(t,o,i,f,l=0){n.strokeStyle=x[~~l%16],n.beginPath(),n.ellipse(~~t+~~i,~~o+~~f,~~i,~~f,0,0,V),n.closePath(),n.fill()},e.line=function(t,o,i,f,l=0,I=1){n.strokeStyle=x[~~l%16],n.beginPath(),n.lineWidth=~~I,n.moveTo(~~t,~~o),n.lineTo(~~i,~~f),n.stroke()},e.text=function(t,o,i,f=0,l=null,I="monospace"){l=l||Math.max(16,e.HEIGHT/16),n.textBaseline="top",n.font=~~l+"px "+I,n.fillStyle=x[~~f%16],n.fillText(i,~~t,~~o)},e.image=function(t,o,i){n.drawImage(i,~~t,~~o)},e.paint=function(t,o,i){let f=new OffscreenCanvas(t,o),l=n;if(f.width=t,f.height=o,n=f.getContext("2d"),typeof i=="function")i(f,n);else if(Array.isArray(i)){let I=n.createImageData(t,o),C=I.data,j=y=0;for(let v of i){for(let q of v.split("")){let W=y*(t*4)+j*4;if(q===" "||q===".")C[W]=0,C[W+1]=0,C[W+2]=0,C[W+3]=0;else{c=x[~~parseInt(q,16)];let J=parseInt(c.slice(1,3),16),tt=parseInt(c.slice(3,5),16),et=parseInt(c.slice(5,7),16);C[W]=J,C[W+1]=tt,C[W+2]=et,C[W+3]=255}j++}y++,j=0}n.putImageData(I,0,0)}return n=l,f},e.transform=function(t,o,i=1,f=0){n.setTransform(i,0,0,i,t,o),n.rotate(e.math.deg2rad(f))},e.push=function(){n.save()},e.pop=function(){n.restore()},e.sfx=function(t=0,o=1,i=0,f=0){let l=Array.isArray(t)?t:Z[~~t%16];return(o!==1||i!==0||f!==0)&&(l=[...l],l[0]=(Number(o)||1)*(l[0]||1),l[1]=Number(f)>0?f:0,l[10]=~~l[10]+~~i),U(...l)},b&&K(),Y(e.CANVAS),s.document.readyState==="loading"?s.addEventListener("DOMContentLoaded",w):w(),e}})();
