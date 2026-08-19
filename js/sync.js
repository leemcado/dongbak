/* ═════════════════ 두 창 사이 상태 공유 ═════════════════
   상태의 주인은 메인 창이다. 관리자는 채점 신호(cmd)만 보내고,
   문항이 넘어간 사실은 메인이 방송하는 state 를 받아서 안다.
   문 애니메이션 타임라인이 상태와 얽혀 있으므로 동기화 지점을 한 곳으로 모은다. */

var NAME='kucc-quiz';

/* open('main',  {on:function(cmd){}, state:function(){return snapshot;}})
   open('admin', {on:function(state){}, onConflict:function(){}})
   cmd : 'ok' | 'ng' | 'undo' | 'restart' | 'lang'                          */
export function open(role,opt){
opt=opt||{};
var on=opt.on,getState=opt.state,onConflict=opt.onConflict;
if(typeof BroadcastChannel!=='function')return{post:function(){},alive:false};
var ch=new BroadcastChannel(NAME);

/* 메인마다 다른 표식. 관리자는 처음 들은 메인 하나에만 붙는다. */
var MYID=role==='main'?(Date.now().toString(36)+Math.random().toString(36).slice(2,8)):null;
function post(v){ch.postMessage(role==='main'?{type:'state',state:v,id:MYID}:{type:'cmd',cmd:v});}

if(role==='main'){
ch.onmessage=function(e){var m=e.data;if(!m)return;
if(m.type==='hello'){if(getState)post(getState());}   /* 관리자가 새로 열렸다 — 현재 상태를 다시 알린다 */
else if(m.type==='cmd'&&on)on(m.cmd);};
return{post:post,alive:true,id:MYID};}

/* ── 관리자 ── */
var got=0,n=0,lock=null,warned=0;
ch.onmessage=function(e){var m=e.data;
if(!m||m.type!=='state')return;
if(lock===null)lock=m.id;
if(m.id!==lock){                    /* 메인 창이 둘 이상 떠 있다 */
if(!warned&&onConflict){warned=1;onConflict();}
return;}
got=1;if(on)on(m.state);};

/* 관리자가 메인보다 먼저 열리면 hello 를 들을 상대가 없다.
   상태가 한 번 올 때까지 되풀이해 부른다. */
(function ping(){if(got||n++>600)return;
ch.postMessage({type:'hello'});setTimeout(ping,1000);})();

return{post:post,alive:true};}
