(()=>{var J=(g,d)=>()=>(d||g((d={exports:{}}).exports,d),d.exports);var N=J((V,M)=>{var K=typeof window<"u"?window:typeof WorkerGlobalScope<"u"&&self instanceof WorkerGlobalScope?self:{};var i=function(g){var d=/(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,b=0,x={},s={manual:g.Prism&&g.Prism.manual,disableWorkerMessageHandler:g.Prism&&g.Prism.disableWorkerMessageHandler,util:{encode:function a(e){return e instanceof y?new y(e.type,a(e.content),e.alias):Array.isArray(e)?e.map(a):e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ")},type:function(a){return Object.prototype.toString.call(a).slice(8,-1)},objId:function(a){return a.__id||Object.defineProperty(a,"__id",{value:++b}),a.__id},clone:function a(e,t){t=t||{};var n,r;switch(s.util.type(e)){case"Object":if(r=s.util.objId(e),t[r])return t[r];n={},t[r]=n;for(var l in e)e.hasOwnProperty(l)&&(n[l]=a(e[l],t));return n;case"Array":return r=s.util.objId(e),t[r]?t[r]:(n=[],t[r]=n,e.forEach(function(o,u){n[u]=a(o,t)}),n);default:return e}},getLanguage:function(a){for(;a;){var e=d.exec(a.className);if(e)return e[1].toLowerCase();a=a.parentElement}return"none"},setLanguage:function(a,e){a.className=a.className.replace(RegExp(d,"gi"),""),a.classList.add("language-"+e)},currentScript:function(){if(typeof document>"u")return null;if("currentScript"in document&&1<2)return document.currentScript;try{throw new Error}catch(n){var a=(/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(n.stack)||[])[1];if(a){var e=document.getElementsByTagName("script");for(var t in e)if(e[t].src==a)return e[t]}return null}},function(a,e,t){for(var n="no-"+e;a;){var r=a.classList;if(r.contains(e))return!0;if(r.contains(n))return!1;a=a.parentElement}return!!t}},languages:{plain:x,plaintext:x,text:x,txt:x,extend:function(a,e){var t=s.util.clone(s.languages[a]);for(var n in e)t[n]=e[n];return t},insertBefore:function(a,e,t,n){n=n||s.languages;var r=n[a],l={};for(var o in r)if(r.hasOwnProperty(o)){if(o==e)for(var u in t)t.hasOwnProperty(u)&&(l[u]=t[u]);t.hasOwnProperty(o)||(l[o]=r[o])}var f=n[a];return n[a]=l,s.languages.DFS(s.languages,function(v,w){w===f&&v!=a&&(this[v]=l)}),l},DFS:function a(e,t,n,r){r=r||{};var l=s.util.objId;for(var o in e)if(e.hasOwnProperty(o)){t.call(e,o,e[o],n||o);var u=e[o],f=s.util.type(u);f==="Object"&&!r[l(u)]?(r[l(u)]=!0,a(u,t,null,r)):f==="Array"&&!r[l(u)]&&(r[l(u)]=!0,a(u,t,o,r))}}},plugins:{},highlightAll:function(a,e){s.highlightAllUnder(document,a,e)},highlightAllUnder:function(a,e,t){var n={callback:t,container:a,selector:'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'};s.hooks.run("before-highlightall",n),n.elements=Array.prototype.slice.apply(n.container.querySelectorAll(n.selector)),s.hooks.run("before-all-elements-highlight",n);for(var r=0,l;l=n.elements[r++];)s.highlightElement(l,e===!0,n.callback)},highlightElement:function(a,e,t){var n=s.util.getLanguage(a),r=s.languages[n];s.util.setLanguage(a,n);var l=a.parentElement;l&&l.nodeName.toLowerCase()==="pre"&&s.util.setLanguage(l,n);var o=a.textContent,u={element:a,language:n,grammar:r,code:o};function f(w){u.highlightedCode=w,s.hooks.run("before-insert",u),u.element.innerHTML=u.highlightedCode,s.hooks.run("after-highlight",u),s.hooks.run("complete",u),t&&t.call(u.element)}if(s.hooks.run("before-sanity-check",u),l=u.element.parentElement,l&&l.nodeName.toLowerCase()==="pre"&&!l.hasAttribute("tabindex")&&l.setAttribute("tabindex","0"),!u.code){s.hooks.run("complete",u),t&&t.call(u.element);return}if(s.hooks.run("before-highlight",u),!u.grammar){f(s.util.encode(u.code));return}if(e&&g.Worker){var v=new Worker(s.filename);v.onmessage=function(w){f(w.data)},v.postMessage(JSON.stringify({language:u.language,code:u.code,immediateClose:!0}))}else f(s.highlight(u.code,u.grammar,u.language))},highlight:function(a,e,t){var n={code:a,grammar:e,language:t};if(s.hooks.run("before-tokenize",n),!n.grammar)throw new Error('The language "'+n.language+'" has no grammar.');return n.tokens=s.tokenize(n.code,n.grammar),s.hooks.run("after-tokenize",n),y.stringify(s.util.encode(n.tokens),n.language)},tokenize:function(a,e){var t=e.rest;if(t){for(var n in t)e[n]=t[n];delete e.rest}var r=new _;return S(r,r.head,a),C(a,r,e,r.head,0),L(r)},hooks:{all:{},add:function(a,e){var t=s.hooks.all;t[a]=t[a]||[],t[a].push(e)},run:function(a,e){var t=s.hooks.all[a];if(!(!t||!t.length))for(var n=0,r;r=t[n++];)r(e)}},Token:y};g.Prism=s;function y(a,e,t,n){this.type=a,this.content=e,this.alias=t,this.length=(n||"").length|0}y.stringify=function a(e,t){if(typeof e=="string")return e;if(Array.isArray(e)){var n="";return e.forEach(function(f){n+=a(f,t)}),n}var r={type:e.type,content:a(e.content,t),tag:"span",classes:["token",e.type],attributes:{},language:t},l=e.alias;l&&(Array.isArray(l)?Array.prototype.push.apply(r.classes,l):r.classes.push(l)),s.hooks.run("wrap",r);var o="";for(var u in r.attributes)o+=" "+u+'="'+(r.attributes[u]||"").replace(/"/g,"&quot;")+'"';return"<"+r.tag+' class="'+r.classes.join(" ")+'"'+o+">"+r.content+"</"+r.tag+">"};function $(a,e,t,n){a.lastIndex=e;var r=a.exec(t);if(r&&n&&r[1]){var l=r[1].length;r.index+=l,r[0]=r[0].slice(l)}return r}function C(a,e,t,n,r,l){for(var o in t)if(!(!t.hasOwnProperty(o)||!t[o])){var u=t[o];u=Array.isArray(u)?u:[u];for(var f=0;f<u.length;++f){if(l&&l.cause==o+","+f)return;var v=u[f],w=v.inside,G=!!v.lookbehind,q=!!v.greedy,B=v.alias;if(q&&!v.pattern.global){var W=v.pattern.toString().match(/[imsuy]*$/)[0];v.pattern=RegExp(v.pattern.source,W+"g")}for(var U=v.pattern||v,m=n.next,A=r;m!==e.tail&&!(l&&A>=l.reach);A+=m.value.length,m=m.next){var E=m.value;if(e.length>a.length)return;if(!(E instanceof y)){var z=1,F;if(q){if(F=$(U,A,a,G),!F||F.index>=a.length)break;var I=F.index,X=F.index+F[0].length,k=A;for(k+=m.value.length;I>=k;)m=m.next,k+=m.value.length;if(k-=m.value.length,A=k,m.value instanceof y)continue;for(var T=m;T!==e.tail&&(k<X||typeof T.value=="string");T=T.next)z++,k+=T.value.length;z--,E=a.slice(A,k),F.index-=A}else if(F=$(U,0,E,G),!F)continue;var I=F.index,P=F[0],R=E.slice(0,I),Z=E.slice(I+P.length),j=A+E.length;l&&j>l.reach&&(l.reach=j);var D=m.prev;R&&(D=S(e,D,R),A+=R.length),O(e,D,z);var Y=new y(o,w?s.tokenize(P,w):P,B,P);if(m=S(e,D,Y),Z&&S(e,m,Z),z>1){var H={cause:o+","+f,reach:j};C(a,e,t,m.prev,A,H),l&&H.reach>l.reach&&(l.reach=H.reach)}}}}}}function _(){var a={value:null,prev:null,next:null},e={value:null,prev:a,next:null};a.next=e,this.head=a,this.tail=e,this.length=0}function S(a,e,t){var n=e.next,r={value:t,prev:e,next:n};return e.next=r,n.prev=r,a.length++,r}function O(a,e,t){for(var n=e.next,r=0;r<t&&n!==a.tail;r++)n=n.next;e.next=n,n.prev=e,a.length-=r}function L(a){for(var e=[],t=a.head.next;t!==a.tail;)e.push(t.value),t=t.next;return e}if(!g.document)return g.addEventListener&&(s.disableWorkerMessageHandler||g.addEventListener("message",function(a){var e=JSON.parse(a.data),t=e.language,n=e.code,r=e.immediateClose;g.postMessage(s.highlight(n,s.languages[t],t)),r&&g.close()},!1)),s;var p=s.util.currentScript();p&&(s.filename=p.src,p.hasAttribute("data-manual")&&(s.manual=!0));function c(){s.manual||s.highlightAll()}if(!s.manual){var h=document.readyState;h==="loading"||h==="interactive"&&p&&p.defer?document.addEventListener("DOMContentLoaded",c):window.requestAnimationFrame?window.requestAnimationFrame(c):window.setTimeout(c,16)}return s}(K);typeof M<"u"&&M.exports&&(M.exports=i);typeof global<"u"&&(global.Prism=i);i.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:"attr-equals"},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:"named-entity"},/&#x?[\da-f]{1,8};/i]};i.languages.markup.tag.inside["attr-value"].inside.entity=i.languages.markup.entity;i.languages.markup.doctype.inside["internal-subset"].inside=i.languages.markup;i.hooks.add("wrap",function(g){g.type==="entity"&&(g.attributes.title=g.content.replace(/&amp;/,"&"))});Object.defineProperty(i.languages.markup.tag,"addInlined",{value:function(d,b){var x={};x["language-"+b]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:i.languages[b]},x.cdata=/^<!\[CDATA\[|\]\]>$/i;var s={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:x}};s["language-"+b]={pattern:/[\s\S]+/,inside:i.languages[b]};var y={};y[d]={pattern:RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g,function(){return d}),"i"),lookbehind:!0,greedy:!0,inside:s},i.languages.insertBefore("markup","cdata",y)}});Object.defineProperty(i.languages.markup.tag,"addAttribute",{value:function(g,d){i.languages.markup.tag.inside["special-attr"].push({pattern:RegExp(/(^|["'\s])/.source+"(?:"+g+")"+/\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,"i"),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[d,"language-"+d],inside:i.languages[d]},punctuation:[{pattern:/^=/,alias:"attr-equals"},/"|'/]}}}})}});i.languages.html=i.languages.markup;i.languages.mathml=i.languages.markup;i.languages.svg=i.languages.markup;i.languages.xml=i.languages.extend("markup",{});i.languages.ssml=i.languages.xml;i.languages.atom=i.languages.xml;i.languages.rss=i.languages.xml;(function(g){var d=/(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;g.languages.css={comment:/\/\*[\s\S]*?\*\//,atrule:{pattern:RegExp("@[\\w-](?:"+/[^;{\s"']|\s+(?!\s)/.source+"|"+d.source+")*?"+/(?:;|(?=\s*\{))/.source),inside:{rule:/^@[\w-]+/,"selector-function-argument":{pattern:/(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,lookbehind:!0,alias:"selector"},keyword:{pattern:/(^|[^\w-])(?:and|not|only|or)(?![\w-])/,lookbehind:!0}}},url:{pattern:RegExp("\\burl\\((?:"+d.source+"|"+/(?:[^\\\r\n()"']|\\[\s\S])*/.source+")\\)","i"),greedy:!0,inside:{function:/^url/i,punctuation:/^\(|\)$/,string:{pattern:RegExp("^"+d.source+"$"),alias:"url"}}},selector:{pattern:RegExp(`(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|`+d.source+")*(?=\\s*\\{)"),lookbehind:!0},string:{pattern:d,greedy:!0},property:{pattern:/(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,lookbehind:!0},important:/!important\b/i,function:{pattern:/(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,lookbehind:!0},punctuation:/[(){};:,]/},g.languages.css.atrule.inside.rest=g.languages.css;var b=g.languages.markup;b&&(b.tag.addInlined("style","css"),b.tag.addAttribute("style","css"))})(i);i.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,lookbehind:!0,greedy:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0,greedy:!0}],string:{pattern:/(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0},"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,lookbehind:!0,inside:{punctuation:/[.\\]/}},keyword:/\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,boolean:/\b(?:false|true)\b/,function:/\b\w+(?=\()/,number:/\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,operator:/[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,punctuation:/[{}[\];(),.:]/};i.languages.javascript=i.languages.extend("clike",{"class-name":[i.languages.clike["class-name"],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp(/(^|[^\w$])/.source+"(?:"+(/NaN|Infinity/.source+"|"+/0[bB][01]+(?:_[01]+)*n?/.source+"|"+/0[oO][0-7]+(?:_[0-7]+)*n?/.source+"|"+/0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source+"|"+/\d+(?:_\d+)*n/.source+"|"+/(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source)+")"+/(?![\w$])/.source),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/});i.languages.javascript["class-name"][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/;i.languages.insertBefore("javascript","keyword",{regex:{pattern:RegExp(/((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source+/\//.source+"(?:"+/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source+"|"+/(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source+")"+/(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:"language-regex",inside:i.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:"function"},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:i.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:i.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:i.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:i.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/});i.languages.insertBefore("javascript","string",{hashbang:{pattern:/^#!.*/,greedy:!0,alias:"comment"},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:"string"},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:"punctuation"},rest:i.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:"property"}});i.languages.insertBefore("javascript","operator",{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:"property"}});i.languages.markup&&(i.languages.markup.tag.addInlined("script","javascript"),i.languages.markup.tag.addAttribute(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,"javascript"));i.languages.js=i.languages.javascript;(function(){if(typeof i>"u"||typeof document>"u")return;Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector);var g="Loading\u2026",d=function(p,c){return"\u2716 Error "+p+" while fetching file: "+c},b="\u2716 Error: File does not exist or is empty",x={js:"javascript",py:"python",rb:"ruby",ps1:"powershell",psm1:"powershell",sh:"bash",bat:"batch",h:"c",tex:"latex"},s="data-src-status",y="loading",$="loaded",C="failed",_="pre[data-src]:not(["+s+'="'+$+'"]):not(['+s+'="'+y+'"])';function S(p,c,h){var a=new XMLHttpRequest;a.open("GET",p,!0),a.onreadystatechange=function(){a.readyState==4&&(a.status<400&&a.responseText?c(a.responseText):a.status>=400?h(d(a.status,a.statusText)):h(b))},a.send(null)}function O(p){var c=/^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(p||"");if(c){var h=Number(c[1]),a=c[2],e=c[3];return a?e?[h,Number(e)]:[h,void 0]:[h,h]}}i.hooks.add("before-highlightall",function(p){p.selector+=", "+_}),i.hooks.add("before-sanity-check",function(p){var c=p.element;if(c.matches(_)){p.code="",c.setAttribute(s,y);var h=c.appendChild(document.createElement("CODE"));h.textContent=g;var a=c.getAttribute("data-src"),e=p.language;if(e==="none"){var t=(/\.(\w+)$/.exec(a)||[,"none"])[1];e=x[t]||t}i.util.setLanguage(h,e),i.util.setLanguage(c,e);var n=i.plugins.autoloader;n&&n.loadLanguages(e),S(a,function(r){c.setAttribute(s,$);var l=O(c.getAttribute("data-range"));if(l){var o=r.split(/\r\n?|\n/g),u=l[0],f=l[1]==null?o.length:l[1];u<0&&(u+=o.length),u=Math.max(0,Math.min(u-1,o.length)),f<0&&(f+=o.length),f=Math.max(0,Math.min(f,o.length)),r=o.slice(u,f).join(`
`),c.hasAttribute("data-start")||c.setAttribute("data-start",String(u+1))}h.textContent=r,i.highlightElement(h)},function(r){c.setAttribute(s,C),h.textContent=r})}}),i.plugins.fileHighlight={highlight:function(c){for(var h=(c||document).querySelectorAll(_),a=0,e;e=h[a++];)i.highlightElement(e)}};var L=!1;i.fileHighlight=function(){L||(console.warn("Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead."),L=!0),i.plugins.fileHighlight.highlight.apply(this,arguments)}})()});N();})();
