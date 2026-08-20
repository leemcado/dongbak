/* ═════════════════ 문 · 필터 렌더러 ═════════════════
   원본 quiz-seed(kucc_quiz).html 의 렌더링 코드를 그대로 옮긴 것이다.
   진행 상태는 quiz.js 의 Q 를 읽기만 한다(target/dead/cur/BOX/uiT/pick).
   그 외의 로직·상수·연산 순서는 원본과 동일하다.                        */
import {Q,MAXQ} from './quiz.js';
/* ═════════════════ 문 · 필터 상수 ═════════════════ */
var W=960,H=540,MIR=960,PVX=480,PVY=H*0.8,GAPF=8.48,DS0=0.5,DS1=1.0;
var MERGE=4.7,HOLD=0.8,THIN=2.1,WAIT=0.9,MOVE=3.6,OPENW=0.5,LWF=2.6;
var DMIN=0.16,WEXP=1.4,PAUSE=0.9,UA=0.45,RUSH=4.6;
var SPD=1.8,GLOW=2.5,FLARE=0.29,BLURK=0.55,BEAD=0.45,LWSTART=0.95;
var SKIPS=0.55;   /* 중도 포기 시 건너뛴 문항 하나당 다가가는 시간(초) */
var DT={sx:1.075,ox:114.5,sy:1.075,oy:48.7},OCY=134;
var LEAF_SOLID=["M236 246 Q267.2 138.2 340 92 L340 418 L236 418 Z",
"M246 246 L246 198 Q258.6 148 288 130 Q317.4 148 330 198 L330 246 Z"];
var SHAPE={frame:[
"M202 418 L202 236 Q243.4 101.6 340 44 Q436.6 101.6 478 236 L478 418",
"M220 418 L220 240 Q256 121 340 70 Q424 121 460 240 L460 418",
"M190 236 L190 418","M490 236 L490 418",
"M176 418 L504 418","M152 433 L528 433","M128 449 L552 449"],
leaf:["M236 246 Q267.2 138.2 340 92","M236 246 L236 418","M340 92 L340 418","M236 246 L340 246",
"M236 352 L340 352","M236 300 L340 300","M236 418 L340 418",
"M248 258 L326 258 L326 290 L248 290 Z","M248 364 L326 364 L326 406 L248 406 Z",
"M273 326 A15 15 0 1 1 303 326 A15 15 0 1 1 273 326","M288 311 L288 300",
"M340 "+(OCY+25)+" A25 25 0 0 1 340 "+(OCY-25),"M340 "+(OCY+12)+" A12 12 0 0 1 340 "+(OCY-12)],
orn:["M246 246 L246 198 Q258.6 148 288 130 Q317.4 148 330 198 L330 246",
"M276 218 A12 12 0 1 1 300 218 A12 12 0 1 1 276 218"]};
for(var i=0;i<7;i++){var y=236-i*8;SHAPE.frame.push("M190 "+y+" L201 "+y,"M479 "+y+" L490 "+y);}
var LOGO={w:831,h:1000,paths:[
"M 686 26 L 679 24 L 661 24 L 651 27 L 640 34 L 620 57 L 572 42 L 521 34 L 469 34 L 401 45 L 364 28 L 336 7 L 321 0 L 298 0 L 283 7 L 270 16 L 259 27 L 248 42 L 235 66 L 219 111 L 208 173 L 178 188 L 147 208 L 117 232 L 91 258 L 71 282 L 50 313 L 23 368 L 9 413 L 2 462 L 0 463 L 0 524 L 2 525 L 8 570 L 23 620 L 43 663 L 74 710 L 116 755 L 139 774 L 175 798 L 213 817 L 252 831 L 297 841 L 338 845 L 388 845 L 381 878 L 367 923 L 351 962 L 332 999 L 395 955 L 466 899 L 510 860 L 567 802 L 603 759 L 629 723 L 650 689 L 666 657 L 692 640 L 717 620 L 761 573 L 788 532 L 810 483 L 822 442 L 828 399 L 830 398 L 830 339 L 828 338 L 825 309 L 818 279 L 799 227 L 774 183 L 770 157 L 760 125 L 738 77 L 725 57 L 709 40 Z",
"M 305 50 L 312 49 L 338 69 L 378 87 L 393 97 L 404 97 L 425 90 L 462 83 L 516 82 L 561 89 L 597 100 L 615 108 L 627 109 L 647 98 L 659 87 L 665 78 L 672 73 L 686 86 L 697 103 L 719 154 L 726 183 L 727 200 L 756 249 L 771 290 L 781 343 L 781 395 L 775 432 L 764 469 L 748 504 L 735 526 L 714 554 L 690 579 L 665 600 L 639 617 L 595 638 L 558 649 L 530 654 L 471 655 L 424 647 L 380 632 L 351 617 L 321 597 L 300 579 L 276 554 L 247 513 L 226 469 L 212 417 L 208 372 L 211 326 L 219 290 L 228 263 L 253 214 L 257 165 L 271 106 L 287 71 Z",
"M 685 298 L 675 302 L 666 310 L 659 325 L 659 403 L 662 412 L 671 423 L 682 429 L 699 430 L 715 422 L 725 406 L 726 326 L 721 313 L 714 305 L 699 298 Z",
"M 439 298 L 423 306 L 413 322 L 412 400 L 416 413 L 427 425 L 439 430 L 452 430 L 466 424 L 475 414 L 479 404 L 479 324 L 473 311 L 463 302 L 453 298 Z"]};
function TX(x){return x*DT.sx+DT.ox;}function TY(y){return y*DT.sy+DT.oy;}
var HINGE_L=TX(236),HINGE_R=TX(444),MULL=104*DT.sx,SPR=TY(246),APEXY=TY(92),BASEY=TY(418),LSRC=TY(320);
var ZX=480,ZY=LSRC,LGK0=0.117;
var LG_START={x:480,y:TY(OCY),k:LGK0},LG_END={x:480,y:APEXY-58,k:LGK0};
var c=document.getElementById('rC'),ctx=c.getContext('2d');
var dpr=Math.min(1.5,window.devicePixelRatio||1);
/* ── 좌표계 두 겹 ──
   설계 좌표계는 언제까지나 960×540 이다. 박스·문·마스코트는 전부 그 안에서만 논다.
   화면이 16:9 가 아니면 남는 위아래(또는 좌우)만큼 설계 좌표계를 바깥으로 늘려
   그 여백에도 격자·노이즈·문빛이 이어지게 한다. OX/OY 가 그 여백의 폭이다.
   따라서 그릴 수 있는 설계 좌표 범위는 x∈[-OX, W+OX], y∈[-OY, H+OY].     */
var SCL=1,OX=0,OY=0,EW=W,EH=H;   /* EW/EH = 늘어난 전체 폭·높이(설계 단위) */
function mk(s){var o=document.createElement('canvas');o.width=Math.ceil(EW*s);o.height=Math.ceil(EH*s);
var g=o.getContext('2d');g.setTransform(s,0,0,s,OX*s,OY*s);return{c:o,g:g,s:s};}
var GLW=null,LIT=null,LYR=null,FILT=(typeof ctx.filter==='string');
var svg=document.getElementById('rSvg'),NS='http://www.w3.org/2000/svg';
function sample(ds,tr){var out=[];for(var i=0;i<ds.length;i++){var p=document.createElementNS(NS,'path');p.setAttribute('d',ds[i]);svg.appendChild(p);
var L=p.getTotalLength(),n=Math.max(2,Math.ceil(L/1.7)),a=[];
for(var k=0;k<=n;k++){var q=p.getPointAtLength(L*k/n);a.push(q.x*tr.sx+tr.ox,q.y*tr.sy+tr.oy);}out.push(a);svg.removeChild(p);}return out;}
function mirror(sp){var o=[];for(var i=0;i<sp.length;i++){var a=[],s=sp[i];for(var k=0;k<s.length;k+=2)a.push(MIR-s[k],s[k+1]);o.push(a);}return o;}
function cwf(p){var A=0;for(var i=0;i<p.length;i+=2){var j=(i+2)%p.length;A+=p[i]*p[j+1]-p[j]*p[i+1];}
if(A<0){var q=[];for(var i=p.length-2;i>=0;i-=2)q.push(p[i],p[i+1]);return q;}return p;}
var FR=sample(SHAPE.frame,DT),LF=sample(SHAPE.leaf,DT),RF=mirror(LF);
var LO=sample(SHAPE.orn,DT),RO=mirror(LO);
var SOL_L=sample(LEAF_SOLID,DT).map(cwf),SOL_R=mirror(SOL_L).map(cwf);
var K0=LG_START.k,LTR={sx:K0,ox:LG_START.x-LOGO.w*K0/2,sy:K0,oy:LG_START.y-LOGO.h*K0/2};
var LG=sample(LOGO.paths,LTR);
var P2=[];for(var i=0;i<LOGO.paths.length;i++)P2.push(new Path2D(LOGO.paths[i]));
var P2ALL=new Path2D();for(var i=0;i<LOGO.paths.length;i++)P2ALL.addPath(P2[i]);
function flat(){var f=[];for(var a=0;a<arguments.length;a++){var sp=arguments[a];
for(var i=0;i<sp.length;i++)for(var k=0;k<sp[i].length;k++)f.push(sp[i][k]);}return f;}
var RES=3,RW=Math.ceil(W/RES)+1,RH=Math.ceil(H/RES)+1;
function field(p){var CE=18,GW=Math.ceil(W/CE)+3,GH=Math.ceil(H/CE)+3,b=[];
for(var i=0;i<GW*GH;i++)b.push([]);
for(var i=0;i<p.length;i+=2){var x=Math.floor(p[i]/CE),y=Math.floor(p[i+1]/CE);if(x>=0&&y>=0&&x<GW&&y<GH)b[y*GW+x].push(p[i],p[i+1]);}
var f=new Float32Array(RW*RH);
for(var j=0;j<RH;j++)for(var i=0;i<RW;i++){var px=i*RES,py=j*RES,bx=Math.floor(px/CE),by=Math.floor(py/CE),bs=1e9;
for(var v=by-1;v<=by+1;v++)for(var u=bx-1;u<=bx+1;u++){if(u<0||v<0||u>=GW||v>=GH)continue;var q=b[v*GW+u];
for(var k=0;k<q.length;k+=2){var dx=q[k]-px,dy=q[k+1]-py,d=dx*dx+dy*dy;if(d<bs)bs=d;}}
f[j*RW+i]=bs<1e9?Math.sqrt(bs):90;}return f;}
var fF=field(flat(FR)),fLB=field(flat(LF)),fRB=field(flat(RF)),fLO=field(flat(LO)),fRO=field(flat(RO)),fG=field(flat(LG));
function smp(f,x,y){if(x<0||y<0||x>W||y>H)return 90;return f[Math.round(y/RES)*RW+Math.round(x/RES)];}
function logoTF(g,cx,cy,k){g.translate(cx,cy);g.scale(k,k);g.translate(-LOGO.w/2,-LOGO.h/2);}
function maskOf(draw){var o=document.createElement('canvas');o.width=RW;o.height=RH;var g=o.getContext('2d');
g.scale(1/RES,1/RES);g.fillStyle='#fff';draw(g);
var d=g.getImageData(0,0,RW,RH).data,m=new Uint8Array(RW*RH);
for(var i=0;i<m.length;i++)m[i]=d[i*4+3]>120?1:0;return m;}
function polyFill(g,p){g.beginPath();g.moveTo(p[0],p[1]);
for(var k=2;k<p.length;k+=2)g.lineTo(p[k],p[k+1]);g.closePath();g.fill();}
var MKL=maskOf(function(g){logoTF(g,LG_START.x,LG_START.y,K0);g.fill(P2[0]);});
var MKO=maskOf(function(g){polyFill(g,SOL_L[1]);polyFill(g,SOL_R[1]);});
function inM(m,x,y){if(x<0||y<0||x>W||y>H)return 0;return m[Math.round(y/RES)*RW+Math.round(x/RES)];}
var ARC=[];(function(){var p=document.createElementNS(NS,'path');p.setAttribute('d',SHAPE.leaf[0]);svg.appendChild(p);
var L=p.getTotalLength();for(var k=0;k<=48;k++){var q=p.getPointAtLength(L*k/48);ARC.push(TX(q.x),TY(q.y));}svg.removeChild(p);})();
function hs(x,y,z){var n=Math.sin(x*127.1+y*311.7+z*74.7)*43758.5453;return n-Math.floor(n);}
function vn(x,y,z){var xi=Math.floor(x),yi=Math.floor(y),zi=Math.floor(z),xf=x-xi,yf=y-yi,zf=z-zi;
var u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf),w=zf*zf*(3-2*zf);
function lp(q){var a=hs(xi,yi,q),b=hs(xi+1,yi,q),cc=hs(xi,yi+1,q),d=hs(xi+1,yi+1,q);return a+(b-a)*u+(cc-a)*v+(a-b-cc+d)*u*v;}
var p=lp(zi),r=lp(zi+1);return p+(r-p)*w;}
var NCELL=10,NW=96,NH=54,nf=new Float32Array(NW*NH);
function noiseGrid(){NW=Math.ceil(EW/NCELL)+2;NH=Math.ceil(EH/NCELL)+2;
nf=new Float32Array(NW*NH);}
/* 설계 좌표 → 노이즈 격자. 여백 쪽도 같은 밀도로 이어진다. */
function nAt(x,y){
var u=(x+OX)/NCELL,v=(y+OY)/NCELL;
if(u<0)u=0;else if(u>NW-1.001)u=NW-1.001;
if(v<0)v=0;else if(v>NH-1.001)v=NH-1.001;
var i=u|0,j=v|0,fu=u-i,fv=v-j;
var a=nf[j*NW+i],b=nf[j*NW+i+1],cc=nf[(j+1)*NW+i],d=nf[(j+1)*NW+i+1];
return a+(b-a)*fu+(cc-a)*fv+(a-b-cc+d)*fu*fv;}
function ss(a,b,x){var t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);}

/* ═════════════════ 애니메이션 상태 ═════════════════ */
var solved=0,life=1,phase=0,t=0,last=0,DS=DS0,ZM=1;
var skipFrom=-1,skipT=0,skipDur=0;   /* 중도 포기 활강 */
var uiA=0;

/* 격자 — 화면 중앙을 원점으로 하는 고정 필터 */
var cols=0,rows=0,X=[],Y=[],R=null,A=null;
function grid(){var cx=W/2,cy=H/2;
var nl=Math.ceil((cx+OX)/GAPF),nt=Math.ceil((cy+OY)/GAPF);
X=[];Y=[];
for(var x=cx-nl*GAPF;x<=W+OX+GAPF*0.5;x+=GAPF)X.push(x);
for(var y=cy-nt*GAPF;y<=H+OY+GAPF*0.5;y+=GAPF)Y.push(y);
cols=X.length;rows=Y.length;R=new Float32Array(cols*rows);A=new Float32Array(cols*rows);}

/* 화면 크기가 바뀔 때마다 여백을 다시 재고 격자·노이즈·보조 캔버스를 새로 잡는다. */
function layout(){
var cw=Math.max(1,c.clientWidth||W),ch=Math.max(1,c.clientHeight||H);
SCL=Math.min(cw/W,ch/H);
EW=cw/SCL;EH=ch/SCL;
OX=(EW-W)/2;OY=(EH-H)/2;
c.width=Math.round(cw*dpr);c.height=Math.round(ch*dpr);
ctx.setTransform(SCL*dpr,0,0,SCL*dpr,OX*SCL*dpr,OY*SCL*dpr);
GLW=mk(0.5);LIT=mk(0.5);LYR=mk(dpr);
grid();noiseGrid();}
window.addEventListener('resize',layout);
 
/* 화면 = 소실점 확대(걷기) ∘ 기준점 확대(정답 진행) */
function dtf(g){g.translate(ZX,ZY);g.scale(ZM,ZM);g.translate(-ZX,-ZY);
g.translate(PVX,PVY);g.scale(DS,DS);g.translate(-PVX,-PVY);}
function trace(g,sp,hx,sc,lw,al){g.save();g.translate(hx,0);g.scale(sc,1);g.translate(-hx,0);
g.lineCap='round';g.lineJoin='round';g.lineWidth=lw/Math.max(sc,0.16);
g.strokeStyle='rgba(255,255,255,'+al.toFixed(3)+')';g.beginPath();
for(var i=0;i<sp.length;i++){var p=sp[i];g.moveTo(p[0],p[1]);for(var k=6;k<p.length;k+=6)g.lineTo(p[k],p[k+1]);g.lineTo(p[p.length-2],p[p.length-1]);}
g.stroke();g.restore();}
/* ctx.filter 의 blur 는 변환과 무관한 장치 픽셀 단위다.
   설계 단위로 지정한 반경이 화면 크기와 함께 커지도록 SCL 을 곱한다. */
function bl(g,src,rad,al){if(al<=0.002)return;g.save();g.globalCompositeOperation='lighter';
var rp=rad*SCL;
if(FILT)g.filter='blur('+rp.toFixed(1)+'px)';else{g.shadowColor='#fff';g.shadowBlur=rp;}
g.globalAlpha=Math.min(1,al);g.drawImage(src,-OX,-OY,EW,EH);g.restore();}
function paste(){ctx.save();ctx.globalCompositeOperation='lighter';ctx.drawImage(LYR.c,-OX,-OY,EW,EH);ctx.restore();}
var SC=1,LGX=0,LGY=0,LGK=0;
 
/* ── 면(솔리드): 불투명 객체는 여기에만 등록한다 ── */
function faceLeaves(g){g.save();dtf(g);for(var s=0;s<2;s++){var pl=s?SOL_R:SOL_L,hx=s?HINGE_R:HINGE_L;
for(var i=0;i<pl.length;i++){var p=pl[i];g.beginPath();g.moveTo(hx+(p[0]-hx)*SC,p[1]);
for(var k=2;k<p.length;k+=2)g.lineTo(hx+(p[k]-hx)*SC,p[k+1]);g.closePath();g.fill();}}g.restore();}
function faceOrn(g){g.save();dtf(g);for(var s=0;s<2;s++){var p=(s?SOL_R:SOL_L)[1],hx=s?HINGE_R:HINGE_L;
g.beginPath();g.moveTo(hx+(p[0]-hx)*SC,p[1]);
for(var k=2;k<p.length;k+=2)g.lineTo(hx+(p[k]-hx)*SC,p[k+1]);g.closePath();g.fill();}g.restore();}
function faceLogo(g){g.save();dtf(g);logoTF(g,LGX,LGY,LGK);g.fill(P2[0]);g.restore();}
/* ── 면에 대한 두 조작. 다른 곳에 중복 구현 금지 ── */
function occlude(g,face){g.save();g.globalCompositeOperation='destination-out';
g.globalAlpha=1;g.fillStyle='#000';face(g);g.restore();}
function lit(g,face,a){if(a<=0.002)return;g.save();g.globalCompositeOperation='lighter';
g.fillStyle='rgba(255,255,255,'+a.toFixed(3)+')';face(g);g.restore();}
function strokeFrame(g,w,a){g.save();dtf(g);trace(g,FR,0,1,w/DS,a);g.restore();}
function strokeLeaf(g,w,a){g.save();dtf(g);trace(g,LF,HINGE_L,SC,w/DS,a);trace(g,RF,HINGE_R,SC,w/DS,a);g.restore();}
function strokeOrn(g,w,a){g.save();dtf(g);trace(g,LO,HINGE_L,SC,w/DS,a);trace(g,RO,HINGE_R,SC,w/DS,a);g.restore();}
function strokeLogo(g,w,a){g.save();dtf(g);logoTF(g,LGX,LGY,LGK);g.lineJoin='round';g.lineCap='round';
g.lineWidth=w/LGK/DS;g.strokeStyle='rgba(255,255,255,'+a.toFixed(3)+')';g.stroke(P2ALL);g.restore();}
var gg=0,sAA=0,lwA=0,bwA=0;
/* 광원 단계에서 가린 뒤 블러 → 보이는 선의 빛만 면 위로 번진다 */
function obj(strokeFn,cuts){
if(gg>0.01){GLW.g.clearRect(-OX,-OY,EW,EH);strokeFn(GLW.g,bwA,1);
for(var i=0;i<cuts.length;i++)occlude(GLW.g,cuts[i]);
bl(ctx,GLW.c,(2.5+gg*5)*BLURK,0.30*gg);bl(ctx,GLW.c,(9+gg*16)*BLURK,0.40*gg);bl(ctx,GLW.c,(26+gg*44)*BLURK,0.28*gg);}
if(sAA>0.01){LYR.g.clearRect(-OX,-OY,EW,EH);
LYR.g.save();LYR.g.globalCompositeOperation='lighter';strokeFn(LYR.g,lwA,sAA);LYR.g.restore();
for(var i=0;i<cuts.length;i++)occlude(LYR.g,cuts[i]);paste();}}
function apPath(g,sc){var lL=HINGE_L+MULL*sc,rL=HINGE_R-MULL*sc;if(rL-lL<1)return false;
g.beginPath();g.moveTo(lL,BASEY);g.lineTo(lL,SPR);
for(var i=0;i<ARC.length;i+=2)g.lineTo(Math.max(ARC[i],lL),ARC[i+1]);
for(var i=ARC.length-2;i>=0;i-=2)g.lineTo(Math.min(MIR-ARC[i],rL),ARC[i+1]);
g.lineTo(rL,SPR);g.lineTo(rL,BASEY);g.closePath();return true;}
var BOXDEPTH=34,BOXCUT=1.05;   /* 박스 안쪽 감쇠 깊이 / 깎는 양 */
/* 둥근 사각형 부호거리 — 안쪽 깊이만큼 점 반지름을 뺀다(곱셈 아님) */
function sdBox(px,py,b){var qx=Math.abs(px-b.x)-(b.w/2-b.r),qy=Math.abs(py-b.y)-(b.h/2-b.r);
var ax=qx>0?qx:0,ay=qy>0?qy:0;
return Math.min(Math.max(qx,qy),0)+Math.sqrt(ax*ax+ay*ay)-b.r;}
/* ── 선지·삽화 이미지 ──
   삽화만은 필터 문법에서 뺀다. 점으로 옮기면 그림 속 정보가 읽히지 않기 때문.
   대신 흰 바탕을 걷어내고 가장자리를 흐려, 검은 화면에 스미듯 얹는다.
   격자·문·박스는 여전히 필터 문법을 그대로 따른다.                        */
var FONT='"HeirofLight",-apple-system,BlinkMacSystemFont,"Noto Sans KR",sans-serif';
var IPAD=10,ILAB=24,IMGDIM=0.94,IMAX=560;
var IMGC={};
/* 배경(테두리에서 이어진 흰 영역)만 걷어낸다. 안쪽에 갇힌 흰색(마스코트 얼굴)은 남는다. */
function keyBg(p,w,h){var seen=new Uint8Array(w*h),st=[],i,x,y;
function pale(i){var j=i*4,r=p[j],g2=p[j+1],b=p[j+2],
mx=Math.max(r,Math.max(g2,b)),mn=Math.min(r,Math.min(g2,b));
return mx>184&&(mx-mn)<58;}
for(x=0;x<w;x++){st.push(x);st.push((h-1)*w+x);}
for(y=0;y<h;y++){st.push(y*w);st.push(y*w+w-1);}
while(st.length){i=st.pop();if(seen[i])continue;seen[i]=1;
if(!pale(i))continue;
p[i*4+3]=0;
x=i%w;y=(i/w)|0;
if(x>0)st.push(i-1);if(x<w-1)st.push(i+1);
if(y>0)st.push(i-w);if(y<h-1)st.push(i+w);}}
/* mode: 'invert' 명도 반전(기본) | 'keyout' 배경만 제거 | 'none' 원본 그대로 */
function imgField(src,mode){mode=mode||'invert';var key=mode+'|'+src,e=IMGC[key];if(e)return e;
e=IMGC[key]={ready:0,cv:null,ar:1};
var im=new Image();
im.onload=function(){
var w=im.width,h=im.height,k=Math.min(1,IMAX/Math.max(w,h));
w=Math.max(1,Math.round(w*k));h=Math.max(1,Math.round(h*k));
var o=document.createElement('canvas');o.width=w;o.height=h;
var g=o.getContext('2d',{willReadFrequently:true});g.drawImage(im,0,0,w,h);
var d=g.getImageData(0,0,w,h),p=d.data,N=w*h;
if(mode==='invert'){
/* 명도만 뒤집는다 — HSL 의 L 을 1-L 로 보내되 H·S 는 그대로.
   그 변환은 각 채널에 (255 - (max+min)) 를 더하는 것과 정확히 같다.
   흰 바탕은 검게, 검은 선은 희게 가면서 빨간 로고는 빨간 채로 남는다. */
for(var i=0;i<N;i++){var j=i*4,
r=p[j],gg2=p[j+1],b2=p[j+2],
off=255-(Math.max(r,Math.max(gg2,b2))+Math.min(r,Math.min(gg2,b2)));
p[j]=r+off;p[j+1]=gg2+off;p[j+2]=b2+off;}}
else if(mode==='keyout')keyBg(p,w,h);
/* 가장자리 페더 — 액자 테두리 티를 없앤다 */
var fx=Math.max(5,w*0.055),fy=Math.max(5,h*0.055);
for(var y=0;y<h;y++)for(var x=0;x<w;x++){
var t=Math.min(Math.min(x,w-1-x)/fx,Math.min(y,h-1-y)/fy);
if(t<1)p[(y*w+x)*4+3]*=ss(0,1,t);}
g.putImageData(d,0,0);
e.cv=o;e.ar=w/h;e.ready=1;};
im.src=src;return e;}
/* 박스 안에 맞춤(contain)으로 앉힌 자리. 선지 박스는 아래 라벨 자리를 비워 둔다. */
function fitImg(b,e){var lab=(b.role==='o')?ILAB:0;
var mw=b.w-IPAD*2,mh=b.h-IPAD*2-lab;
var w0=Math.min(mw,mh*e.ar),h0=w0/e.ar;
return{x:b.x-w0/2,y:b.y-lab/2-h0/2,w:w0,h:h0};}
function drawImages(){if(uiA<0.02||!Q.cur)return;
for(var i=0;i<Q.BOX.length;i++){var b=Q.BOX[i];if(!b.img)continue;
var e=IMGC[(b.imode||'invert')+'|'+b.img];if(!e||!e.ready)continue;
var f=fitImg(b,e),dim=(b.role==='o'&&Q.pick>=0&&Q.pick!==b.i)?0.38:1;
ctx.save();ctx.globalAlpha=Math.min(1,uiA*IMGDIM*dim);
ctx.drawImage(e.cv,f.x,f.y,f.w,f.h);ctx.restore();}}
function boxCut(px,py){if(uiA<0.01)return 0;var mx=0;
for(var i=0;i<Q.BOX.length;i++){var b=Q.BOX[i];
if(px<b.x-b.w/2-2||px>b.x+b.w/2+2||py<b.y-b.h/2-2||py>b.y+b.h/2+2)continue;
var d=-sdBox(px,py,b);if(d>mx)mx=d;}
return mx/BOXDEPTH*BOXCUT*uiA;}
function wrap(g,txt,mw){var w=txt.split(' '),ln=[],cu='';
for(var i=0;i<w.length;i++){var tr=cu?cu+' '+w[i]:w[i];
if(g.measureText(tr).width>mw&&cu){ln.push(cu);cu=w[i];}else cu=tr;}
if(cu)ln.push(cu);return ln;}
var TG1=4.5,TGA1=0.60,TG2=13,TGA2=0.34;
/* 전부 맞혔을 때 섬광 한가운데 뜨는 문구 */
var CLEARTXT='CONGRATULATIONS!',CLEARFS=62;
/* 글자를 레이어에 한 번 모아 그린 뒤 통째로 가우시안 블러를 먹여 얹는다.
   글자마다 그림자를 다는 것과 달리, 문장 덩어리 전체가 은은하게 번진다. */
function drawText(){if(uiA<0.02||!Q.cur)return;
LYR.g.clearRect(-OX,-OY,EW,EH);
paintText(LYR.g);
bl(ctx,LYR.c,TG1,TGA1);
bl(ctx,LYR.c,TG2,TGA2);
paintText(ctx);}
function paintText(ctx){
ctx.save();ctx.textBaseline='middle';
for(var i=0;i<Q.BOX.length;i++){var b=Q.BOX[i],txt=null,fs=18,wt='500';
var EN=Q.lang==='en';
if(b.role==='q'){txt=Q.no+'. '+((EN&&Q.cur.qe)?Q.cur.qe:Q.cur.q);wt='700';
fs=txt.length>210?18:txt.length>150?20:txt.length>90?22:25;}
else if(b.role==='o'){
/* 그림이 곧 선지인 문항은 라벨을 그리지 않는다(데이터의 labels:false). */
if(b.img&&Q.cur.labels===false)continue;
var OO=(EN&&Q.cur.oe)?Q.cur.oe:Q.cur.o;txt=OO[b.i];fs=b.img?17:19;}
else if(b.role==='illust'){if(b.img)continue;txt='삽화';fs=15;}
if(txt===null||txt==='')continue;
ctx.font=wt+' '+fs+'px '+FONT;
var dim=(b.role==='illust')?0.30:(b.role==='o'&&Q.pick>=0&&Q.pick!==b.i?0.45:0.94);
var al=dim*uiA;
var ln=wrap(ctx,txt,b.w-52),lh=fs*1.45;
/* 이미지가 있는 선지는 글씨를 박스 아래쪽으로 내려 그림과 겹치지 않게 한다 */
var cy=b.img?(b.y+b.h/2-IPAD-lh*(ln.length-0.5)+lh/2):b.y;
var y0=cy-(ln.length-1)*lh/2;
ctx.fillStyle='rgba(255,255,255,'+al.toFixed(3)+')';
/* 세로로 늘어선 선지는 왼끝을 맞춰야 목록으로 읽힌다 */
var lf=b.align==='left';
ctx.textAlign=lf?'left':'center';
var tx=lf?b.x-b.w/2+26:b.x;
for(var k=0;k<ln.length;k++)ctx.fillText(ln[k],tx,y0+k*lh);}
ctx.restore();}
 

function frame(ts){requestAnimationFrame(frame);if(ts-last<33)return;
var dt=Math.min(0.06,(ts-last)/1000);last=ts;t+=dt*0.675;
/* 평소엔 지수 감쇠로 한 칸씩 따라붙는다. 그런데 중도 포기로 여러 칸을
   한꺼번에 뛰면 초기 속도가 남은 거리에 비례해 튀어나가듯 보인다.
   그때만 거리에 비례한 시간을 잡고 스무스스텝으로 재서 등속에 가깝게,
   양 끝에서 도함수가 0이 되도록 활강시킨다. */
if(!Q.gave)skipFrom=-1;
else if(skipFrom<0){skipFrom=solved;skipT=0;
skipDur=Math.max(0.5,SKIPS*(MAXQ-skipFrom));}
if(skipFrom>=0&&skipT<skipDur){skipT+=dt;
solved=skipFrom+(MAXQ-skipFrom)*ss(0,skipDur,skipT);}
else solved+=(Q.target-solved)*0.08;life+=((Q.dead?0:1)-life)*0.045;
uiA+=((Q.dead||Q.target>=MAXQ?0:Q.uiT)-uiA)*0.16;
DS=DS0+(DS1-DS0)*(solved/MAXQ);
/* 문 개방 타임라인은 '다가가기'가 끝난 뒤에 시작한다. 중도 포기로 target 이
   한꺼번에 뛰어도 solved 가 따라붙는 동안은 확대만 보이고, 다 붙은 다음 결합이 시작된다. */
if(Q.target>=MAXQ&&!Q.dead&&solved>MAXQ-0.05)phase+=dt*SPD;else phase=Math.max(0,phase-dt*2.5);
var P=phase,T1=MERGE,T2=T1+HOLD,T3=T2+THIN,T4=T3+WAIT,T5=T4+MOVE,T6=T5+OPENW,TR=T6+PAUSE,T7=TR+RUSH;
var grow=ss(0,T1,P),thin=ss(T2,T3,P);
var sA=ss(T2-HOLD*0.2,T2+THIN*0.65,P);
var g=ss(T1*0.45,T2+THIN*0.35,P)*(1+FLARE*(1-ss(T2+THIN*0.45,T3+2.3,P)))*GLOW;
var mv=ss(T4,T5,P),oe=ss(T6,T6+3.6,P);
var u=P<T6?UA*ss(T4,T6,P):(P<TR?UA:UA+(1-UA)*ss(TR,T7,P));
ZM=1/(1-(1-DMIN)*Math.pow(u,WEXP));
var FL=ss(TR+0.7,T7+0.4,P);
SC=1-0.88*oe;var sc=SC;
LGX=LG_START.x+(LG_END.x-LG_START.x)*mv;LGK=LG_START.k+(LG_END.k-LG_START.k)*mv;
LGY=LG_START.y+(LG_END.y-LG_START.y)*mv;
var FACE=sA*0.14*oe,rel=K0/LGK;
var bg=life*(1-ss(0,T3,P)),dOn=life*(1-sA);
for(var j=0;j<NH;j++)for(var i=0;i<NW;i++){
var n=vn(i*0.0475,j*0.0475,t)*0.58+vn(i*0.0992+9,j*0.0992+4,t*1.6+17)*0.42;
nf[j*NW+i]=n*n*(3-2*n);}
for(var bi=0;bi<Q.BOX.length;bi++)if(Q.BOX[bi].img)imgField(Q.BOX[bi].img,Q.BOX[bi].imode);
ctx.fillStyle='#000';ctx.fillRect(-OX,-OY,EW,EH);
var nAmp=GAPF*0.17*bg,base=GAPF*0.028*bg;
var dAmp=GAPF*(0.13+grow*BEAD)*dOn,halo=0.18*(1-sA),sig2=2*Math.pow(4.6+grow*2.2,2);
if(bg>0.004||dOn>0.004){
for(var j=0;j<rows;j++){var y=Y[j],zy=ZY+(y-ZY)/ZM,qy=PVY+(zy-PVY)/DS;
for(var i=0;i<cols;i++){var x=X[i],zx=ZX+(x-ZX)/ZM,qx=PVX+(zx-PVX)/DS,d=90;
var sx=LG_START.x+(qx-LGX)*rel,sy=LG_START.y+(qy-LGY)*rel;
if(!inM(MKL,sx,sy)){d=smp(fF,qx,qy);
if(qy>APEXY-6&&qy<BASEY+4){
var lx=HINGE_L+(qx-HINGE_L)/sc,rx=HINGE_R+(qx-HINGE_R)/sc;
if(lx<=481){var dl=smp(fLO,lx,qy);if(!inM(MKO,lx,qy))dl=Math.min(dl,smp(fLB,lx,qy));d=Math.min(d,dl*sc);}
if(rx>=479){var dr=smp(fRO,rx,qy);if(!inM(MKO,rx,qy))dr=Math.min(dr,smp(fRB,rx,qy));d=Math.min(d,dr*sc);}}}
d=Math.min(d,smp(fG,sx,sy)/rel)*DS*ZM;
var f=Math.min(1,Math.exp(-(d*d)/sig2)+Math.exp(-(d*d)/1400)*halo);
var n=nAt(x,y),k=j*cols+i;
var r=base+n*n*nAmp+f*dAmp-boxCut(x,y);
R[k]=r>0?r:0;
A[k]=Math.min(1,(0.10+n*0.62)*bg+f*0.55*dOn);}}
ctx.lineCap='round';
if(grow>0.03&&sA<0.99){
for(var j=0;j<rows;j++)for(var i=0;i<cols;i++){var k=j*cols+i;if(R[k]<GAPF*0.2)continue;
for(var e=0;e<3;e++){var i2=i+[1,0,1][e],j2=j+[0,1,1][e];
if(i2>=cols||j2>=rows)continue;var k2=j2*cols+i2;if(R[k2]<GAPF*0.2)continue;
var L=GAPF*(e===2?1.4142:1),ov=(R[k]+R[k2])/L;if(ov<0.9)continue;
var w=Math.min(1,(ov-0.9)/0.35);
ctx.lineWidth=Math.min(R[k],R[k2])*1.85*w;
ctx.strokeStyle='rgba(255,255,255,'+(Math.min(A[k],A[k2])*w).toFixed(3)+')';
ctx.beginPath();ctx.moveTo(X[i],Y[j]);ctx.lineTo(X[i2],Y[j2]);ctx.stroke();}}}
for(var j=0;j<rows;j++)for(var i=0;i<cols;i++){var k=j*cols+i,r=R[k];if(r<0.05)continue;
ctx.fillStyle='rgba(255,255,255,'+A[k].toFixed(3)+')';
ctx.beginPath();ctx.arc(X[i],Y[j],r,0,6.2832);ctx.fill();}}
if(sA>0.01||g>0.01){
gg=g;sAA=sA;lwA=(1-thin)*GAPF*LWSTART+thin*LWF;bwA=Math.max(lwA,GAPF*0.7*(1-thin)+thin*LWF*1.2);
obj(strokeFrame,[faceLeaves,faceLogo]);
if(oe>0.004){
LIT.g.clearRect(-OX,-OY,EW,EH);LIT.g.globalCompositeOperation='lighter';LIT.g.fillStyle='#fff';
for(var s2=0;s2<16;s2++){var fs2=1+s2*0.115;
LIT.g.save();dtf(LIT.g);LIT.g.translate(480,LSRC);LIT.g.scale(fs2,fs2);LIT.g.translate(-480,-LSRC);
LIT.g.globalAlpha=0.42/(fs2*fs2);if(apPath(LIT.g,sc))LIT.g.fill();LIT.g.restore();}
LIT.g.globalAlpha=1;LIT.g.globalCompositeOperation='source-over';
bl(ctx,LIT.c,4,0.45*oe);bl(ctx,LIT.c,18,0.55*oe);bl(ctx,LIT.c,52,0.7*oe);
ctx.save();dtf(ctx);ctx.globalCompositeOperation='lighter';ctx.globalAlpha=Math.min(1,oe);
if(apPath(ctx,sc))ctx.fill();ctx.restore();}
if(FACE>0.002){LYR.g.clearRect(-OX,-OY,EW,EH);lit(LYR.g,faceLeaves,FACE);
occlude(LYR.g,faceOrn);occlude(LYR.g,faceLogo);paste();}
obj(strokeLeaf,[faceOrn,faceLogo]);
if(FACE>0.002){LYR.g.clearRect(-OX,-OY,EW,EH);lit(LYR.g,faceOrn,FACE);occlude(LYR.g,faceLogo);paste();}
obj(strokeOrn,[faceLogo]);
lit(ctx,faceLogo,FACE);
obj(strokeLogo,[]);}
drawImages();
drawText();
if(FL>0.001){ctx.save();ctx.globalCompositeOperation='source-over';
ctx.fillStyle='rgba(255,255,255,'+Math.min(1,Math.pow(FL,0.75)).toFixed(3)+')';
ctx.fillRect(-OX,-OY,EW,EH);
/* 섬광이 화면을 다 덮은 뒤 그 한가운데. 후광 없이 검은 글씨만 얹는다. */
var ca=ss(0.66,1,FL);
if(ca>0.002&&!Q.gave){ctx.textAlign='center';ctx.textBaseline='middle';
ctx.font='700 '+CLEARFS+'px '+FONT;
ctx.fillStyle='rgba(0,0,0,'+ca.toFixed(3)+')';
ctx.fillText(CLEARTXT,W/2,H/2);}
ctx.restore();}
}

/* ═════════════════ 외부 인터페이스 ═════════════════ */
export var canvas=c;
/* 화면 좌표 → 설계 좌표. 여백을 누르면 설계 범위 밖 값이 나온다(박스에 안 걸림). */
export function toDesign(clientX,clientY){var r=c.getBoundingClientRect();
return{x:(clientX-r.left)/(r.width||1)*EW-OX,y:(clientY-r.top)/(r.height||1)*EH-OY};}
export function relayout(){layout();}
/* 재시작은 즉시. 문이 천천히 물러나면 다음 참가자를 기다리게 만든다. */
export function resetAnim(){life=1;phase=0;solved=0;skipFrom=-1;}
export function start(){layout();requestAnimationFrame(frame);}
