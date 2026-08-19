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
else if(t==='4지선다삽화'){box(480,80,860,112,26,'q');box(480,300,330,252,28,'illust');
box(COLL,248,300,84,26,'o',0);box(COLR,248,300,84,26,'o',1);
box(COLL,352,300,84,26,'o',2);box(COLR,352,300,84,26,'o',3);}
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
export var Q={target:0,dead:0,cur:null,BOX:[],uiT:1,pick:-1};

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
for(var i=0;i<B.length;i++){var b=B[i];
if(b.role==='illust')b.img=im[0];
else if(b.role==='o'&&q.t==='선지사진'&&im[b.i])b.img=im[b.i];}
return B;}
export function load(i){Q.cur=i<MAXQ?QUIZ[i]:null;Q.BOX=Q.cur?attachImg(Q.cur,LAY(Q.cur)):[];Q.pick=-1;tell();}
export function next(){if(Q.target<MAXQ){lastAct='ok';Q.target++;Q.uiT=0;
setTimeout(function(){load(Q.target);Q.uiT=1;},380);}}
export function fail(){lastAct='ng';Q.dead=1;Q.uiT=0;tell();}
export function answer(k){if(!Q.cur||Q.dead)return;if(Q.cur.t.indexOf('주관식')===0)return;
Q.pick=k;if(k===Q.cur.a)next();else fail();}
export function restart(){Q.target=0;Q.dead=0;Q.uiT=1;lastAct=null;
if(hooks.onRestart)hooks.onRestart();build();}

/* 직전 판정 하나만 되돌린다. 관리자 창에서만 호출한다. */
export function undo(){if(lastAct==='ng'){Q.dead=0;Q.uiT=1;lastAct=null;load(Q.target);return;}
if(lastAct==='ok'&&Q.target>0){Q.target--;Q.uiT=1;lastAct=null;load(Q.target);}}

/* 관리자 창에 보낼 상태. 메인이 소유하고 방송한다. */
export function snapshot(){return{i:Q.target,total:MAXQ,dead:Q.dead,
cur:Q.cur,nxt:Q.target+1<MAXQ?QUIZ[Q.target+1]:null,undoable:lastAct!==null};}

/* ═════════════════ 메인 창 입력 ═════════════════ */
export function bindMainInput(c,W,H){
c.addEventListener('click',function(e){var r=c.getBoundingClientRect();
var mx=(e.clientX-r.left)/r.width*W,my=(e.clientY-r.top)/r.height*H;
for(var i=0;i<Q.BOX.length;i++){var b=Q.BOX[i];
if(b.role==='o'&&Math.abs(mx-b.x)<b.w/2&&Math.abs(my-b.y)<b.h/2){answer(b.i);return;}}});
window.addEventListener('keydown',function(e){
if(e.key==='F5'){e.preventDefault();restart();return;}
if(e.code==='Space'||e.key===' '){e.preventDefault();if(!Q.dead)next();return;}
if(e.key==='Escape'){e.preventDefault();if(!Q.dead)fail();return;}
if(!Q.cur||Q.dead)return;
/* 주관식은 메인 창에서 채점하지 않는다. 관리자 창의 스페이스/Esc 로만 판정한다. */
if(e.key>='1'&&e.key<='6')answer(parseInt(e.key,10)-1);},{passive:false});}
