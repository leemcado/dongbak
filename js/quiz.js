/* ═════════════════ 문항 진행과 채점 ═════════════════
   상태의 주인은 이 모듈이다. 렌더러(door.js)는 Q 를 읽기만 한다.
   문제 데이터 구조는 data/questions.json 참고.
     t 유형 · c 범주 · l 난이도 · q 문제 · o 선지 · a 정답 · x 해설
     x : 해설. 저장만 되고 메인 화면에는 렌더링하지 않음                */

export var MAXQ=7;

/* ── 인터페이스 배치 (960×540) ──
   선지는 문을 비껴가도록 좌우 열로. COLL/COLR 안쪽 가장자리가
   문설주(x≈319 / 641) 바로 바깥에서 멈춘다.                      */
var COLL=166,COLR=794;
export function LAY(q){var B=[],t=q.t;
function box(x,y,w,h,r,role,i){B.push({x:x,y:y,w:w,h:h,r:r,role:role,i:i});}
if(t==='주관식'){box(480,168,820,216,34,'q');}
else if(t==='주관식삽화'){box(480,124,860,196,30,'q');box(480,382,430,250,30,'illust');}
else if(t==='4지선다삽화'){box(480,68,820,96,24,'q');
/* 삽화는 왼쪽, 선지는 오른쪽에 세로로. 가운데를 비워 문이 드러나게 한다.
   문틀은 이 시점에 x 268~692 를 차지하므로 360~610 이 열린 띠가 된다. */
box(200,344,320,320,30,'illust');
for(var i=0;i<4;i++)box(770,196+i*96,320,80,26,'o',i);}
else if(t==='6지선다'){box(480,76,660,82,26,'q');
for(var i=0;i<6;i++)box(i%2?COLR:COLL,208+((i/2)|0)*102,300,80,26,'o',i);}
else if(t==='선지사진'){box(480,74,780,84,24,'q');
for(var i=0;i<4;i++)box(i%2?COLR+8:COLL-8,240+((i/2)|0)*200,300,184,26,'o',i);}
else{box(480,82,660,88,26,'q');
box(COLL,252,300,86,26,'o',0);box(COLR,252,300,86,26,'o',1);
box(COLL,358,300,86,26,'o',2);box(COLR,358,300,86,26,'o',3);}
return B;}

/* ═════════════════ 진행 상태 ═════════════════
   door.js 가 매 프레임 읽는 값. 필드 이름은 원본의 전역 변수명 그대로다. */
export var Q={target:0,dead:0,cur:null,BOX:[],uiT:1,pick:-1,lang:'ko',gave:0,no:1};

/* 렌더러·동기화가 걸어 두는 훅. 순환 임포트를 피하려고 콜백으로 둔다. */
export var hooks={onRestart:null,onState:null};

var BANK=[],PLAN=[],QUIZ=[],lastAct=null;

export async function loadBank(url){
var r=await fetch(url||'data/questions.json',{cache:'no-store'});
if(!r.ok)throw new Error('questions.json '+r.status);
var d=await r.json();BANK=d.BANK;PLAN=d.PLAN;return d;}

function rnd(a){return a[(Math.random()*a.length)|0];}
function tell(){if(hooks.onState)hooks.onState(snapshot());}

/* 7문항 추출 규칙: (범주, 난이도) 칸마다 하나씩 랜덤 */
export function build(){QUIZ=[];for(var i=0;i<PLAN.length;i++){
var pool=BANK.filter(function(q){return q.c===PLAN[i][0]&&q.l===PLAN[i][1];});
QUIZ.push(pool.length?rnd(pool):BANK[0]);}load(0);}
/* 문항의 img 배열을 박스에 붙인다. 삽화는 img[0], 선지사진은 선지 순서대로. */
function attachImg(q,B){var im=q.img;if(!im||!im.length)return B;
var md=q.imgmode||'invert';
for(var i=0;i<B.length;i++){var b=B[i];
if(b.role==='illust')b.img=im[0];
else if(b.role==='o'&&q.t==='선지사진'&&im[b.i])b.img=im[b.i];
if(b.img)b.imode=md;}
return B;}
export function load(i){Q.cur=i<MAXQ?QUIZ[i]:null;Q.BOX=Q.cur?attachImg(Q.cur,LAY(Q.cur)):[];
/* 번호는 문항과 함께 바뀌어야 한다. target 은 next() 에서 먼저 오르므로 여기서 따로 잡는다. */
Q.no=i+1;Q.pick=-1;tell();}
export function next(){if(Q.target<MAXQ){lastAct='ok';Q.target++;Q.uiT=0;
setTimeout(function(){load(Q.target);Q.uiT=1;},380);}}
export function fail(){lastAct='ng';Q.dead=1;Q.uiT=0;tell();}
export function answer(k){if(!Q.cur||Q.dead)return;if(Q.cur.t.indexOf('주관식')===0)return;
Q.pick=k;if(k===Q.cur.a)next();else fail();}
export function restart(){Q.target=0;Q.dead=0;Q.uiT=1;Q.gave=0;lastAct=null;
if(hooks.onRestart)hooks.onRestart();build();}

/* 한국어 ↔ 영어. 번역은 문항 데이터의 qe/oe/ae 에 미리 넣어 두었다. */
export function toggleLang(){Q.lang=Q.lang==='en'?'ko':'en';tell();}

/* 중도 포기. 남은 문항을 건너뛰고 바로 문이 열린다.
   target 을 MAXQ 로 올리면 solved 가 뒤따라 붙으며 남은 확대가 이어서 재생되고,
   그대로 phase 가 흐르기 시작한다. 별도 연출을 새로 만들지 않는다. */
var FADEMS=680;   /* 인터페이스가 다 옅어질 때까지. uiA 는 프레임당 0.16 으로 준다 */
export function giveUp(){if(Q.dead||Q.target>=MAXQ)return;
lastAct=null;Q.gave=1;Q.target=MAXQ;Q.uiT=0;
/* 곧바로 비우면 문제·선지·삽화가 한 프레임에 사라진다. 정답 처리 때처럼
   uiA 가 옅어지는 것을 기다렸다가 비운다. 그동안 문은 이미 다가오기 시작한다.
   비울 때 Q.target 을 다시 읽으므로 사이에 R 이 눌려도 어긋나지 않는다. */
setTimeout(function(){load(Q.target);},FADEMS);}

/* 전부 맞혀 문이 열리기 시작하면 더는 되돌릴 수 없다.
   되돌리면 연출이 거꾸로 감기며 관리자 화면도 종료화면에서 문항으로 튄다. */
function done(){return Q.target>=MAXQ&&!Q.dead;}

/* 직전 판정 하나만 되돌린다. 관리자 창에서만 호출한다. */
export function undo(){if(done())return;
if(lastAct==='ng'){Q.dead=0;Q.uiT=1;lastAct=null;load(Q.target);return;}
if(lastAct==='ok'&&Q.target>0){Q.target--;Q.uiT=1;lastAct=null;load(Q.target);}}

/* 관리자 창에 보낼 상태. 메인이 소유하고 방송한다. */
export function snapshot(){return{i:Q.target,total:MAXQ,dead:Q.dead,lang:Q.lang,gave:Q.gave,
cur:Q.cur,nxt:Q.target+1<MAXQ?QUIZ[Q.target+1]:null,undoable:lastAct!==null&&!done()};}

/* ═════════════════ 메인 창 입력 ═════════════════ */
export function bindMainInput(c,toDesign){
c.addEventListener('click',function(e){var pt=toDesign(e.clientX,e.clientY);
var mx=pt.x,my=pt.y;
for(var i=0;i<Q.BOX.length;i++){var b=Q.BOX[i];
if(b.role==='o'&&Math.abs(mx-b.x)<b.w/2&&Math.abs(my-b.y)<b.h/2){answer(b.i);return;}}});
/* 글자 키는 e.code 로 받는다 — 한글 입력 상태에서 r/e 가 ㄱ/ㄷ 으로 들어오기 때문. */
window.addEventListener('keydown',function(e){var c=e.code;
if(e.key==='F5'||c==='KeyR'){e.preventDefault();restart();return;}
if(c==='Space'||e.key===' '){e.preventDefault();if(!Q.dead)next();return;}
if(c==='Escape'||e.key==='Escape'){e.preventDefault();if(!Q.dead)fail();return;}
if(c==='Backspace'){e.preventDefault();undo();return;}
if(c==='KeyE'){e.preventDefault();toggleLang();return;}
if(c==='KeyP'){e.preventDefault();giveUp();return;}
if(!Q.cur||Q.dead)return;
/* 주관식은 메인 창에서 채점하지 않는다. 관리자 창의 스페이스/Esc 로만 판정한다. */
if(e.key>='1'&&e.key<='6')answer(parseInt(e.key,10)-1);},{passive:false});}
