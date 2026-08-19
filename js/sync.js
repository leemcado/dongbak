/* ═════════════════ 두 창 사이 상태 공유 ═════════════════
   상태의 주인은 메인 창이다. 관리자는 채점 신호(cmd)만 보내고,
   문항이 넘어간 사실은 메인이 방송하는 state 를 받아서 안다.
   문 애니메이션 타임라인이 상태와 얽혀 있으므로 동기화 지점을 한 곳으로 모은다. */

var NAME='kucc-quiz';

/* open('main',  {on:function(cmd){}, state:function(){return snapshot;}})
   open('admin', {on:function(state){}})
   cmd : 'ok' | 'ng' | 'undo' | 'restart'                                   */
export function open(role,opt){
var on=opt&&opt.on,getState=opt&&opt.state;
if(typeof BroadcastChannel!=='function')return{post:function(){},alive:false};
var ch=new BroadcastChannel(NAME);
function post(v){ch.postMessage(role==='main'?{type:'state',state:v}:{type:'cmd',cmd:v});}
ch.onmessage=function(e){var m=e.data;if(!m)return;
if(role==='main'){
if(m.type==='hello'){if(getState)post(getState());}   /* 관리자가 새로 열렸다 — 현재 상태를 다시 알린다 */
else if(m.type==='cmd'&&on)on(m.cmd);}
else if(m.type==='state'&&on)on(m.state);};
/* 관리자가 메인보다 먼저 열리면 hello 를 들을 상대가 없다.
   상태가 한 번 올 때까지 되풀이해 부른다. */
if(role==='admin'){var got=0,n=0;
var inner=on;on=function(v){got=1;if(inner)inner(v);};
ch.onmessage=function(e){var m=e.data;if(m&&m.type==='state'&&on)on(m.state);};
var ping=function(){if(got||n++>600)return;
ch.postMessage({type:'hello'});setTimeout(ping,1000);};ping();}
return{post:post,alive:true};}
