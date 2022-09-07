import{K as se,L as D,M as fe,N as oe,O as K,P as Y,Q as le,R as he,f as A,c as p,U as H,W as V,E as re,o as i,_ as L,r as M,q as O,l as ae,e as h,t as I,X as ve,Y as me,Z as j,j as d,I as k,F as U,G as ie,u as r,$ as R,a0 as ge,i as C,p as G,k as Q,d as ee,a1 as ye,w as X,g as E,a2 as be,m as Se,H as q,n as xe,a3 as Le}from"./index.d6a86641.js";import{_ as we,u as Ae,A as F}from"./gh-repo.vue_vue_type_script_setup_true_lang.b42a0298.js";function Ce(e){return se(e==null?void 0:e.lift)}function ue(e){return function(t){if(Ce(t))return t.lift(function(n){try{return e(n,this)}catch(s){this.error(s)}});throw new TypeError("Unable to lift unknown Observable type")}}function ce(e,t,n,s,o){return new Pe(e,t,n,s,o)}var Pe=function(e){D(t,e);function t(n,s,o,a,v,w){var c=e.call(this,n)||this;return c.onFinalize=v,c.shouldUnsubscribe=w,c._next=s?function(u){try{s(u)}catch(l){n.error(l)}}:e.prototype._next,c._error=a?function(u){try{a(u)}catch(l){n.error(l)}finally{this.unsubscribe()}}:e.prototype._error,c._complete=o?function(){try{o()}catch(u){n.error(u)}finally{this.unsubscribe()}}:e.prototype._complete,c}return t.prototype.unsubscribe=function(){var n;if(!this.shouldUnsubscribe||this.shouldUnsubscribe()){var s=this.closed;e.prototype.unsubscribe.call(this),!s&&((n=this.onFinalize)===null||n===void 0||n.call(this))}},t}(fe),de={now:function(){return(de.delegate||Date).now()},delegate:void 0},$e=function(e){D(t,e);function t(n,s){return e.call(this)||this}return t.prototype.schedule=function(n,s){return this},t}(oe),N={setInterval:function(e,t){for(var n=[],s=2;s<arguments.length;s++)n[s-2]=arguments[s];var o=N.delegate;return o!=null&&o.setInterval?o.setInterval.apply(o,K([e,t],Y(n))):setInterval.apply(void 0,K([e,t],Y(n)))},clearInterval:function(e){var t=N.delegate;return((t==null?void 0:t.clearInterval)||clearInterval)(e)},delegate:void 0},Me=function(e){D(t,e);function t(n,s){var o=e.call(this,n,s)||this;return o.scheduler=n,o.work=s,o.pending=!1,o}return t.prototype.schedule=function(n,s){if(s===void 0&&(s=0),this.closed)return this;this.state=n;var o=this.id,a=this.scheduler;return o!=null&&(this.id=this.recycleAsyncId(a,o,s)),this.pending=!0,this.delay=s,this.id=this.id||this.requestAsyncId(a,this.id,s),this},t.prototype.requestAsyncId=function(n,s,o){return o===void 0&&(o=0),N.setInterval(n.flush.bind(n,this),o)},t.prototype.recycleAsyncId=function(n,s,o){if(o===void 0&&(o=0),o!=null&&this.delay===o&&this.pending===!1)return s;N.clearInterval(s)},t.prototype.execute=function(n,s){if(this.closed)return new Error("executing a cancelled action");this.pending=!1;var o=this._execute(n,s);if(o)return o;this.pending===!1&&this.id!=null&&(this.id=this.recycleAsyncId(this.scheduler,this.id,null))},t.prototype._execute=function(n,s){var o=!1,a;try{this.work(n)}catch(v){o=!0,a=v||new Error("Scheduled action threw falsy error")}if(o)return this.unsubscribe(),a},t.prototype.unsubscribe=function(){if(!this.closed){var n=this,s=n.id,o=n.scheduler,a=o.actions;this.work=this.state=this.scheduler=null,this.pending=!1,le(a,this),s!=null&&(this.id=this.recycleAsyncId(o,s,null)),this.delay=null,e.prototype.unsubscribe.call(this)}},t}($e),ne=function(){function e(t,n){n===void 0&&(n=e.now),this.schedulerActionCtor=t,this.now=n}return e.prototype.schedule=function(t,n,s){return n===void 0&&(n=0),new this.schedulerActionCtor(this,t).schedule(s,n)},e.now=de.now,e}(),ke=function(e){D(t,e);function t(n,s){s===void 0&&(s=ne.now);var o=e.call(this,n,s)||this;return o.actions=[],o._active=!1,o._scheduled=void 0,o}return t.prototype.flush=function(n){var s=this.actions;if(this._active){s.push(n);return}var o;this._active=!0;do if(o=n.execute(n.state,n.delay))break;while(n=s.shift());if(this._active=!1,o){for(;n=s.shift();)n.unsubscribe();throw o}},t}(ne),Ie=new ke(Me);function Ve(e){return e&&se(e.schedule)}function Be(e){return e[e.length-1]}function Re(e){return Ve(Be(e))?e.pop():void 0}function te(e,t,n,s,o){s===void 0&&(s=0),o===void 0&&(o=!1);var a=t.schedule(function(){n(),o?e.add(this.schedule(null,s)):this.unsubscribe()},s);if(e.add(a),!o)return a}function Ee(e,t){return ue(function(n,s){var o=0;n.subscribe(ce(s,function(a){return e.call(t,a,o++)&&s.next(a)}))})}function Fe(e){for(var t,n,s=[],o=1;o<arguments.length;o++)s[o-1]=arguments[o];var a=(t=Re(s))!==null&&t!==void 0?t:Ie,v=(n=s[0])!==null&&n!==void 0?n:null,w=s[1]||1/0;return ue(function(c,u){var l=[],_=!1,g=function(y){var P=y.buffer,m=y.subs;m.unsubscribe(),le(l,y),u.next(P),_&&f()},f=function(){if(l){var y=new oe;u.add(y);var P=[],m={buffer:P,subs:y};l.push(m),te(y,a,function(){return g(m)},e)}};v!==null&&v>=0?te(u,a,f,v,!0):_=!0,f();var S=ce(u,function(y){var P,m,$=l.slice();try{for(var b=he($),x=b.next();!x.done;x=b.next()){var T=x.value,Z=T.buffer;Z.push(y),w<=Z.length&&g(T)}}catch(_e){P={error:_e}}finally{try{x&&!x.done&&(m=b.return)&&m.call(b)}finally{if(P)throw P.error}}},function(){for(;l!=null&&l.length;)u.next(l.shift().buffer);S==null||S.unsubscribe(),u.complete(),u.unsubscribe()},void 0,function(){return l=null});c.subscribe(S)})}const Te=A({__name:"flex",props:{direction:null,align:null,justify:null,wrap:null,gap:null,info:{type:Boolean}},setup(e){const t=e;return(n,s)=>{var o;return i(),p("div",{class:V(["flexbox",{info:e.info,[`flexbox-${(o=t.direction)!=null?o:"column"}`]:!0,gap:!!t.gap}]),style:re({flexDirection:t.direction||"column",alignItems:t.align||"center",justifyContent:t.justify||"flex-start",flexWrap:t.wrap||"nowrap","--gap":t.gap})},[H(n.$slots,"default",{},void 0,!0)],6)}}});const B=L(Te,[["__scopeId","data-v-9b5a9433"]]),Oe={},Ne={style:{flex:"1"}};function De(e,t){return i(),p("span",Ne)}const Ge=L(Oe,[["render",De]]),Qe=`JavaScript
Python
TypeScript
Java
Ruby
HTML
Go
C++
PHP
C#
CSS
C
Vue
Shell
Rust
Kotlin
Scala
Jupyter
Swift
PowerShell
Dart
SCSS
Objective-C
Julia
Makefile
DM
HCL
Dockerfile
R
Lua
Roff
Elixir
Groovy
Haskell
Perl
Nix
TeX
Clojure
OCaml
CoffeeScript
Smarty
Erlang
TSQL
CMake
Fortran
Svelte
Emacs
Solidity
Vim
MATLAB
Jinja
D
PLpgSQL
F#
Assembly
XSLT
Mustache
Blade
Puppet
SystemVerilog
Lean
Apex
Markdown
Starlark
EJS
Handlebars
Elm
Batchfile
Nim
GDScript
Crystal
Gherkin
Tcl
Rich
Jsonnet
VimL
Ballerina
Pascal
ShaderLab
Common
QML
Visual
Nunjucks
Twig
Cuda
Verilog
Smalltalk
Haxe
SQF
PureScript
BitBake
Liquid
Vala
SaltStack
Less
WebAssembly
Chapel
Mathematica
Hack
CodeQL
Coq
Nextflow
Bicep
PLSQL
Scheme
Zig
Reason
Objective-C++
Pug
VHDL
Stylus
Modelica
GLSL
V
GAP
Processing
Racket
Arduino
ASP
FreeMarker
SMT
ColdFusion
RobotFramework
Visual
ActionScript
Open
GCC
PostScript
ABAP
Ren'Py
Sass
Standard
Ada
SourcePawn
VBA
Gnuplot
Logos
ApacheConf
Brainfuck
Astro
API
AGS
wdl
Prolog
RAML
Xtend
XQuery
PureBasic
LLVM
AMPL
Agda
YAML
SWIG
JSON
SQLPL
mcfunction
Squirrel
ReScript
Raku
Yacc
Game
M4
Perl6
Groff
LiveScript
LookML
1C
AutoHotkey
Stata
Perl
ASP.NET
ZenScript
Protocol
NSIS
Web
Common
reStructuredText
DIGITAL
Idris
ANTLR
SAS
Eagle
MAXScript
AutoIt
NCL
Dhall
Cucumber
Isabelle
OpenEdge
UnrealScript
ooc
Nginx
OpenSCAD
Objective-J
Nimrod
Gosu
LabVIEW
XML
Inno
Thrift
Haml
COBOL
Slim
Smali
Lasso
Eiffel
AngelScript
KiCad
GAMS
YARA
Pawn
q
DataWeave
VCL
P4
Brightscript
F*
MLIR
CartoCSS
nesC
Pony
CUE
mIRC
Rascal
SQL
Marko
Max
SuperCollider
ASL
Slash
NASL
AL
Cirru
Mako
Meson
G-code
Gettext
NetLogo
Cython
HLSL
IDL
Vim
QMake
RPC
Red
Stan
Scilab
M
Fluent
Inform
OpenQASM
Dylan
LilyPond
Macaulay2
Forth
IGOR
LSL
Classic
EmberScript
Kaitai
MoonScript
XC
Zeek
Cairo
Awk
Motoko
CIL
Ecl
xBase
Cadence
ObjectScript
Factor
Diff
Lex
Pan
Terra
Papyrus
Rebol
Boogie
hoon
VBScript
AppleScript
JSONiq
PowerBuilder
POV-Ray
Propeller
Bikeshed
TLA
Mercury
MQL5
Riot
DTrace
LoomScript
Fennel
Odin
RenderScript
kvlang
Grammatical
Delphi
NewLisp
Io
HyPhy
Ceylon
Uno
Wollok
Augeas
Wikitext
Ring
BlitzMax
Harbour
Bluespec
Q#
BlitzBasic
Hy
sed
Latte
Component
Arc
Dafny
APL
YASnippet
WebIDL
PicoLisp
Bro
REXX
ZAP
Nu
Parrot
Sage
XProc
Cap'n
Pep8
Text
Pure
Xojo
Cool
SRecode
Turing
Alloy
Nemerle
Genshi
FreeBasic
CLIPS
Promela
PEG.js
E
AspectJ
Gleam
JetBrains
MQL4
Limbo
Move
Clean
HolyC
DOT
NWScript
CWeb
RouterOS
LigoLANG
Frege
Nit
Clarity
CAP
Mask
Oz
ATS
Boo
Slice
XS
Monkey
4D
Procfile
ImageJ
REALbasic
J
Ragel
GAML
NetLinx
Vyper
BASIC
Jolie
DenizenScript
Witcher
Csound
Mirah
ZIL
Logtalk
ABNF
RMarkdown
FLUX
PigLatin
AsciiDoc
HiveQL
Shen
LFE
Singularity
Bison
GDB
Kit
Monkey
Asymptote
Nearley
KRL
RPGLE
Turtle
Volt
KakouneScript
ChucK
LOLCODE
Self
Modula-2
eC
Jasmin
Futhark
Fantom
DCPU-16
BrighterScript
Modula-3
GSC
Wren
Faust
Fancy
Zephir
Portugol
wisp
SVG
SmPL
Janet
AL
Metal
Rouge
Golo
TXL
Pike
EQ
Ragel
Clarion
Oxygene
X10
Grace
StringTemplate
Earthly
Xonsh
UrWeb
Click
Csound
Euphoria
Zimpl
Beef
Ox
RUNOFF
Cycript
mupad
MTML
PogoScript
Moocode
Glyph
Dogescript
jq
KiCad
Qt
Opal
AIDL
INI
Org
Velocity
Csound
Nasal
CSON
Opa
Berry
Gerber
Tea
XPages
TI
CSV
Filebench
Genie
TOML
Wavefront
ABAP
Module
Redcode
Altium
Kusto
Talon
Closure
Charity
Edje
KiCad
Antlers
JFlex
Gradle
Ioke
Sieve
Mint
PlantUML
Windows
Curry
`,qe=()=>{const e=new Set;return t=>e.has(t)?!1:(e.add(t),!0)},J=["Any Language",...Qe.split(`
`).filter(Boolean).filter(qe())],je={inheritAttrs:!0,props:{elRef:{type:Function,required:!1}}};function Xe(e,t,n,s,o,a){return i(),p("ul",{class:"list",ref:n.elRef},[H(e.$slots,"default",{},void 0,!0)],512)}const pe=L(je,[["render",Xe],["__scopeId","data-v-c7f044ce"]]),ze={class:"content"},Je=["onKeydown"],He=["onMousedown","onMouseenter"],Ue={key:0,class:"no-data"},We=A({__name:"lang-select",props:{modelValue:null},emits:["update:modelValue"],setup(e,{emit:t}){const n=e,s=M(!1),o=M(""),a=M(),v=M(),w=M(!1),c=M(),u=M(),l=O(()=>c.value||u.value),_=()=>{typeof l.value=="number"&&(t("update:modelValue",P.value[l.value]),s.value=!1)},g=()=>{w.value=!1},f=m=>{w.value||(c.value=m,u.value=void 0)},S=()=>{w.value||(c.value=void 0,u.value=void 0)};ae(()=>{var m;s.value?(o.value="",w.value=!1,c.value=void 0,u.value=void 0):(m=a.value)==null||m.blur()});const y=()=>{var m;l.value&&v.value&&((m=v.value.children.item(l.value))==null||m.scrollIntoView({block:"center"}))},P=O(()=>o.value?J.filter(m=>m.toLowerCase().indexOf(o.value.toLowerCase())!==-1):J);return(m,$)=>(i(),p("div",{class:V(["select-container",{focused:s.value}])},[h("span",ze,I(n.modelValue),1),ve(h("input",{ref_key:"input",ref:a,class:"search",onFocus:$[0]||($[0]=b=>s.value=!0),onBlur:$[1]||($[1]=b=>s.value=!1),style:re({opacity:s.value?1:0}),placeholder:"Search...","onUpdate:modelValue":$[2]||($[2]=b=>o.value=b),onKeydown:[$[3]||($[3]=j(b=>{var x;u.value=Math.min(((x=r(l))!=null?x:-1)+1,r(P).length-1),c.value=void 0,y(),w.value=!0},["down"])),$[4]||($[4]=j(b=>{var x;u.value=Math.max(((x=r(l))!=null?x:1)-1,0),c.value=void 0,y(),w.value=!0},["up"])),j(_,["enter"])]},null,44,Je),[[me,o.value]]),d(pe,{class:V(["lang-list",{show:s.value}]),"el-ref":b=>v.value=b},{default:k(()=>[(i(!0),p(U,null,ie(r(P),(b,x)=>(i(),p("li",{class:V(["lang",{focused:r(l)===x}]),key:b,onMousedown:T=>t("update:modelValue",b),onMouseenter:T=>f(x),onMouseleave:S,onMousemove:g},I(b),43,He))),128)),r(P).length?R("",!0):(i(),p("li",Ue," Not found "))]),_:1},8,["class","el-ref"]),h("span",{class:V(["arrow-down",{open:s.value}])},null,2)],2))}});const Ze=L(We,[["__scopeId","data-v-3e0dc566"]]),Ke=["value"],Ye=A({__name:"repo-filter",props:{modelValue:null},emits:["update:modelValue"],setup(e,{emit:t}){const n=e,s=o=>{t("update:modelValue",o.currentTarget.value)};return(o,a)=>(i(),p("input",{class:"repo-filter",value:n.modelValue,onInput:s,placeholder:"Filter by keyword"},null,40,Ke))}});const en=L(Ye,[["__scopeId","data-v-21c977f4"]]),nn=["href"],tn=A({__name:"gh-user",props:{login:null,isNew:{type:Boolean},url:null},setup(e){const t=e,n=/\[bot]$/,s=O(()=>{const{login:o}=t;return n.test(o)?`https://github.com/apps/${o.replace(n,"")}`:`https://github.com/${o}`});return(o,a)=>(i(),p("a",{href:r(s),target:"_blank",class:V({new:t.isNew})},I(t.login),11,nn))}}),sn=["href"],on=A({__name:"gh-pr",props:{repo:null,number:null},setup(e){const t=e;return(n,s)=>(i(),p("a",{href:`https://github.com/${t.repo}/pull/${t.number}`,target:"_blank"},"#"+I(t.number),9,sn))}}),ln=e=>(G("data-v-436e3bb1"),e=e(),Q(),e),rn=ln(()=>h("span",{class:"dot"},null,-1)),an=C(" in "),un={key:0,class:"language"},cn={key:1,class:"code-changes addition"},dn={key:2,class:"code-changes deletion"},pn=A({__name:"event",props:{event:null},setup(e){const t=e,{event:n}=ge(t);return(s,o)=>(i(),p("span",{class:V(["event",r(n).prEventType])},[rn,d(tn,{login:r(n).actorLogin,"is-new":!!r(n).isDevDay},null,8,["login","is-new"]),C(" "+I(r(n).prEventType)+" ",1),d(on,{repo:r(n).repoName,number:r(n).pr},null,8,["repo","number"]),an,d(we,{name:r(n).repoName},null,8,["name"]),r(n).language?(i(),p("span",un,I(r(n).language),1)):R("",!0),r(n).additions?(i(),p("span",cn,"+"+I(r(n).additions),1)):R("",!0),r(n).deletions?(i(),p("span",dn,"-"+I(r(n).deletions),1)):R("",!0)],2))}});const _n=L(pn,[["__scopeId","data-v-436e3bb1"]]),fn=A({__name:"event-list",props:{stream:null,language:null,repo:null,play:{type:Boolean}},setup(e){const t=e,n=l=>!0,s=ee([]),o=M(),a=ee([]),v=M(n),w=Ae(),c=new ye,u=(l,_)=>{s[l]=_?Se(_):void 0};return c.pipe(Fe(300)).subscribe(l=>{t.play&&a.unshift(...l)}),ae(l=>{if(w.value){const _=t.stream.pipe(Ee(v.value)).subscribe(c);l(()=>_.unsubscribe())}}),X(s,l=>{const _=o.value;if(!_)return;const{bottom:g}=_.getBoundingClientRect();if(l.length>0){let f=l.length-1;for(;f>=0;){const S=l[f];if(!S)return;const{bottom:y}=S.getBoundingClientRect();if(y>=g+32)a.splice(f,1),f--;else break}}},{immediate:!1,flush:"post"}),X([()=>t.language,()=>t.repo],([l,_])=>{_=_.toLowerCase().trim();let g=[];l==="Others"?g.push(f=>{const S=f.language;for(let y of J)if(S===y)return!1;return!0}):l!=="Any Language"&&g.push(f=>f.language===l),_!==""&&g.push(f=>f.actorLogin.toLowerCase().indexOf(_)!==-1||f.repoName.toLowerCase().indexOf(_)!==-1),g.length===0?v.value=n:v.value=f=>{for(const S of g)if(!S(f))return!1;return!0}}),X(v,l=>{const _=a.filter(l);_.length!==a.length&&a.splice(0,a.length,..._)}),(l,_)=>(i(),E(pe,{class:"list","el-ref":g=>o.value=g},{default:k(()=>[d(be,{name:"list"},{default:k(()=>[(i(!0),p(U,null,ie(a,(g,f)=>(i(),p("li",{key:g.id,ref_for:!0,ref:S=>u(f,S)},[d(_n,{event:g},null,8,["event"])]))),128))]),_:1})]),_:1},8,["el-ref"]))}});const hn=L(fn,[["__scopeId","data-v-14777efc"]]),vn={xmlns:"http://www.w3.org/2000/svg",height:"48",width:"48"},mn=h("path",{d:"M19.15 32.5 32.5 24l-13.35-8.5ZM24 44q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 24q0-4.15 1.575-7.8 1.575-3.65 4.3-6.35 2.725-2.7 6.375-4.275Q19.9 4 24 4q4.15 0 7.8 1.575 3.65 1.575 6.35 4.275 2.7 2.7 4.275 6.35Q44 19.85 44 24q0 4.1-1.575 7.75-1.575 3.65-4.275 6.375t-6.35 4.3Q28.15 44 24 44Zm0-3q7.1 0 12.05-4.975Q41 31.05 41 24q0-7.1-4.95-12.05Q31.1 7 24 7q-7.05 0-12.025 4.95Q7 16.9 7 24q0 7.05 4.975 12.025Q16.95 41 24 41Zm0-17Z"},null,-1),gn=[mn];function yn(e,t){return i(),p("svg",vn,gn)}const bn={render:yn},Sn={xmlns:"http://www.w3.org/2000/svg",height:"48",width:"48"},xn=h("path",{d:"M18.5 32h3V16h-3Zm8 0h3V16h-3ZM24 44q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 24q0-4.15 1.575-7.8 1.575-3.65 4.3-6.35 2.725-2.7 6.375-4.275Q19.9 4 24 4q4.15 0 7.8 1.575 3.65 1.575 6.35 4.275 2.7 2.7 4.275 6.35Q44 19.85 44 24q0 4.1-1.575 7.75-1.575 3.65-4.275 6.375t-6.35 4.3Q28.15 44 24 44Zm0-3q7.1 0 12.05-4.975Q41 31.05 41 24q0-7.1-4.95-12.05Q31.1 7 24 7q-7.05 0-12.025 4.95Q7 16.9 7 24q0 7.05 4.975 12.025Q16.95 41 24 41Zm0-17Z"},null,-1),Ln=[xn];function wn(e,t){return i(),p("svg",Sn,Ln)}const An={render:wn},Cn=["title"],Pn=A({__name:"play-button",props:{modelValue:{type:Boolean}},emits:["update:modelValue"],setup(e,{emit:t}){const n=e;return(s,o)=>(i(),p("button",{onClick:o[0]||(o[0]=a=>t("update:modelValue",!n.modelValue)),title:n.modelValue?"Pause":"Play"},[n.modelValue?(i(),E(r(An),{key:0,viewBox:"0 0 48 48"})):(i(),E(r(bn),{key:1,viewBox:"0 0 48 48"}))],8,Cn))}});const $n=L(Pn,[["__scopeId","data-v-572430ef"]]),Mn={class:"events-player-title"},kn=C(" Real-Time Pull Requests "),In=A({__name:"events-player",setup(e){const t=M("Any Language"),n=M(""),s=M(!0),o=q(),v=xe("pullRequestEvents")();return(w,c)=>(i(),p(U,null,[d(B,{info:"",direction:"row",justify:"space-between"},{default:k(()=>[h("h2",Mn,[d($n,{modelValue:s.value,"onUpdate:modelValue":c[0]||(c[0]=u=>s.value=u)},null,8,["modelValue"]),kn])]),_:1}),r(o).height>530?(i(),E(B,{key:0,info:"",direction:"row",justify:"space-between"},{default:k(()=>[d(Ze,{modelValue:t.value,"onUpdate:modelValue":c[1]||(c[1]=u=>t.value=u)},null,8,["modelValue"]),d(en,{modelValue:n.value,"onUpdate:modelValue":c[2]||(c[2]=u=>n.value=u),style:{"margin-left":"16px",flex:"1"}},null,8,["modelValue"])]),_:1})):R("",!0),d(hn,{stream:r(v).stream,language:t.value,repo:n.value,play:s.value},null,8,["stream","language","repo","play"])],64))}});const _t=L(In,[["__scopeId","data-v-684062e3"]]);const Vn={},Bn={class:"divider"};function Rn(e,t){return i(),p("hr",Bn)}const ft=L(Vn,[["render",Rn],["__scopeId","data-v-5a89f117"]]),En=e=>(G("data-v-eb0c94a7"),e=e(),Q(),e),Fn={class:"dot"},Tn=En(()=>h("span",{class:"ripple"},null,-1)),On=[Tn],Nn=A({__name:"dot",props:{color:null,size:null},setup(e){const t=e;Le(s=>({"7e9f2258":r(n),"546637ec":e.color}));const n=O(()=>{var s;return`${(s=t.size)!=null?s:8}px`});return(s,o)=>(i(),p("span",Fn,On))}});const Dn=L(Nn,[["__scopeId","data-v-eb0c94a7"]]),Gn=A({__name:"number-card",props:{title:null,value:null,colorStart:null,colorStop:null},setup(e){const t=e,n=q();return(s,o)=>(i(),p("div",{class:V(["number-card",{small:r(n).down("xs")}])},[h("div",{class:V(["number-card-bg",`number-card-bg-c${t.colorStart}-c${t.colorStop}`])},null,2),d(B,{class:"number-card-content",direction:r(n).down("xs")?"row":"column",align:r(n).down("xs")?"center":"flex-start"},{default:k(()=>[d(B,{class:"number-card-content-title",justify:"center",align:"flex-start"},{default:k(()=>[C(I(t.title),1)]),_:1}),d(B,{class:"number-card-content-value",align:"center",direction:r(n).down("xs")?"row-reverse":"row",gap:"8px"},{default:k(()=>[d(Dn,{color:`var(--c${t.colorStart})`},null,8,["color"]),d(r(F),{value:t.value,comma:""},null,8,["value"])]),_:1},8,["direction"])]),_:1},8,["direction","align"])],2))}});const z=L(Gn,[["__scopeId","data-v-232febb1"]]),Qn=e=>(G("data-v-5c63a06b"),e=e(),Q(),e),qn={class:"banner-title"},jn=C(" developers collaborated on "),Xn=Qn(()=>h("br",null,null,-1)),zn=C(" repositories "),Jn=C(". "),Hn={class:"code-info"},Un=C(" Total code line changes: "),Wn={class:"number addition"},Zn=C(" +"),Kn=C(" / "),Yn={class:"number deletion"},et=C(" -"),nt=A({__name:"StatusCard",props:{developers:null,repositories:null,opened:null,merged:null,closed:null,additions:null,deletions:null,time:null},setup(e){const t=q();return(n,s)=>(i(),E(B,{class:"banner"},{default:k(()=>[h("div",qn,[d(r(F),{class:"number",value:e.developers,comma:""},null,8,["value"]),jn,Xn,d(r(F),{class:"number",value:e.repositories,comma:""},null,8,["value"]),zn,h("b",null,I(e.time),1),Jn]),h("div",Hn,[Un,h("span",Wn,[Zn,d(r(F),{value:e.additions,comma:""},null,8,["value"])]),Kn,h("span",Yn,[et,d(r(F),{value:e.deletions,comma:""},null,8,["value"])])]),d(B,{class:"number-cards",info:"",direction:r(t).down("xs")?"column":"row",gap:"4px"},{default:k(()=>[d(z,{title:"Opened PRs",value:e.opened,"color-start":"1","color-stop":"6"},null,8,["value"]),d(z,{title:"Merged PRs",value:e.merged,"color-start":"7","color-stop":"5"},null,8,["value"]),d(z,{title:"Closed PRs",value:e.closed,"color-start":"2","color-stop":"7"},null,8,["value"])]),_:1},8,["direction"]),H(n.$slots,"footer",{},void 0,!0)]),_:3}))}});const ht=L(nt,[["__scopeId","data-v-5c63a06b"]]),tt="/logos/tidbcloud.png",st="/logos/pulsar.png",W=e=>(G("data-v-5c36c8e9"),e=e(),Q(),e),ot=W(()=>h("a",{class:"more-info",href:"https://ossinsight.io/blog/why-we-choose-tidb-to-support-ossinsight"},"\u{1F916}\uFE0F how to make it",-1)),lt={key:0,style:{color:"var(--text-secondary)","font-size":"12px"}},rt=C(" \xA0 \xA0 "),at=W(()=>h("a",{href:"https://en.pingcap.com/tidb-cloud?utm_source=ossinsight&utm_medium=referral",target:"_blank"},[h("img",{src:tt,alt:"TiDB Cloud",height:"16"})],-1)),it=C(" \xA0 \xA0 "),ut=W(()=>h("a",{href:"https://pulsar.apache.org",target:"_blank"},[h("img",{src:st,alt:"Pulsar",height:"16"})],-1)),ct=A({__name:"side-footer",setup(e){const t=q();return(n,s)=>(i(),E(B,{info:"",direction:"row",justify:"center"},{default:k(()=>[ot,d(Ge),r(t).up("sm")?(i(),p("span",lt,"Powered by")):R("",!0),rt,at,it,ut]),_:1}))}});const vt=L(ct,[["__scopeId","data-v-5c36c8e9"]]);export{ft as D,_t as E,B as F,ht as S,Ge as a,vt as b};
