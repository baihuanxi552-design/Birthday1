import {shape,disk,cog,draw,piece,fill,cutLine,fillPaper,smooth,lerp,mul,T,R,S} from './art.js';
import {solveRig,ap} from './engine/upstream/rig.js';
import {makeScore} from './score-base.js';
export const width=720,height=960,duration=24;
const yellow='#ffe500',red='#ff3434',ink='#111111',white='#ffffff';
const card=piece([-83,-108,83,108],g=>fill(g,q=>q.rect(-80,-105,160,210),white),{col:white,seed:52,ss:2});
const body=shape([[-25,-102],[-43,-84],[-36,12],[36,12],[43,-84],[25,-102]],yellow,8,g=>{
  fill(g,q=>{q.moveTo(-17,-100);q.lineTo(17,-100);q.lineTo(10,-28);q.lineTo(-10,-28);q.closePath()},white);
  cutLine(g,2.5,q=>{q.moveTo(-23,-94);q.lineTo(-14,-66);q.lineTo(-25,-56);q.lineTo(-8,-34);q.moveTo(23,-94);q.lineTo(14,-66);q.lineTo(25,-56);q.lineTo(8,-34);q.moveTo(-26,-15);q.lineTo(-13,-15);q.moveTo(15,-15);q.lineTo(27,-15)});
  fill(g,q=>{q.moveTo(0,-85);q.lineTo(-14,-93);q.lineTo(-14,-77);q.closePath();q.moveTo(0,-85);q.lineTo(14,-93);q.lineTo(14,-77);q.closePath()},red);
  fill(g,q=>{q.arc(0,-21,2.5,0,7);q.moveTo(2.5,-7);q.arc(0,-7,2.5,0,7)},ink);
});
const neck=piece([-15,-29,15,10],g=>fill(g,q=>q.roundRect(-12,-26,24,36,7),yellow),{col:yellow,seed:23,ss:2});
const head=piece([-46,-72,46,26],g=>{
  fill(g,q=>{q.ellipse(0,-23,36,43,0,0,7);q.ellipse(-35,-21,8,12,0,0,7);q.ellipse(35,-21,8,12,0,0,7)},yellow);
  fill(g,q=>{q.moveTo(-35,-38);q.quadraticCurveTo(-42,-69,-7,-67);q.lineTo(10,-72);q.lineTo(7,-63);q.quadraticCurveTo(37,-64,35,-39);q.lineTo(22,-48);q.lineTo(-5,-45);q.lineTo(-21,-50);q.closePath()},ink);
  cutLine(g,2,q=>{q.moveTo(-38,-23);q.lineTo(-34,-19);q.moveTo(38,-23);q.lineTo(34,-19)});
  g.strokeStyle=ink;g.lineWidth=4;g.beginPath();g.roundRect(-29,-34,24,20,5);g.roundRect(5,-34,24,20,5);g.moveTo(-5,-26);g.lineTo(5,-26);g.stroke();
});
const thigh=shape([[-15,-10],[15,-10],[14,49],[-14,49]],red,31);
const shin=shape([[-13,-9],[13,-9],[12,43],[-12,43]],red,32);
const shoe=piece([-19,-10,29,15],g=>{
  fill(g,q=>{q.roundRect(-16,-8,29,19,6);q.roundRect(-7,-1,34,13,5)},ink);
  fill(g,q=>q.roundRect(-17,8,45,5,2),white);
  cutLine(g,2,q=>{q.moveTo(1,0);q.lineTo(10,0);q.moveTo(1,4);q.lineTo(10,4)});
},{col:ink,seed:33,ss:2});
const sleeve=shape([[-15,-12],[15,-12],[13,55],[-13,55]],yellow,34);
const forearm=shape([[-12,-10],[12,-10],[11,47],[-11,47]],yellow,35,g=>fill(g,q=>q.rect(-12,30,24,9),red));
const hand=disk(12,yellow,36);
const parts=[
  {name:'body',at:[0,0],piece:body,ang:'body'},
  {name:'neck',parent:'body',at:[0,-98],piece:neck,ang:'neck'},
  {name:'head',parent:'body',at:[0,-120],piece:head,ang:'look'},
  {name:'leftThigh',parent:'body',at:[-19,7],piece:thigh,ang:'leftLeg'},
  {name:'leftShin',parent:'leftThigh',at:[0,42],piece:shin,ang:'leftKnee'},
  {name:'leftShoe',parent:'leftShin',at:[0,35],piece:shoe,ang:'leftFoot'},
  {name:'rightThigh',parent:'body',at:[19,7],piece:thigh,ang:'rightLeg'},
  {name:'rightShin',parent:'rightThigh',at:[0,42],piece:shin,ang:'rightKnee'},
  {name:'rightShoe',parent:'rightShin',at:[0,35],piece:shoe,ang:'rightFoot'},
  {name:'leftUpper',parent:'body',at:[-33,-84],piece:sleeve,ang:'leftArm'},
  {name:'leftFore',parent:'leftUpper',at:[0,48],piece:forearm,ang:'leftElbow'},
  {name:'leftHand',parent:'leftFore',at:[0,44],piece:hand,ang:'leftHand'},
  {name:'rightUpper',parent:'body',at:[33,-84],piece:sleeve,ang:'rightArm'},
  {name:'rightFore',parent:'rightUpper',at:[0,48],piece:forearm,ang:'rightElbow'},
  {name:'rightHand',parent:'rightFore',at:[0,44],piece:hand,ang:'rightHand'}
];
const paintOrder=['leftThigh','leftShin','leftShoe','rightThigh','rightShin','rightShoe','neck','body','leftUpper','leftFore','leftHand','rightUpper','rightFore','rightHand','head'];
const curtain=shape([[0,0],[300,0],[300,520],[240,490],[180,525],[120,490],[60,525],[0,490]],red,19,g=>{for(let i=1;i<6;i++)cutLine(g,4,q=>{q.moveTo(i*48,15);q.lineTo(i*48,470)})});
const machine=shape([[-240,-140],[200,-140],[240,-60],[240,140],[-240,140]],red,18,g=>{
  cutLine(g,22,q=>{q.moveTo(-115,55);q.lineTo(150,55)});
  for(let i=0;i<4;i++)cutLine(g,3,q=>{q.moveTo(-180+i*24,-90);q.lineTo(-180+i*24,-20)});
  fill(g,q=>q.roundRect(-120,-116,230,62,8),ink);
  fill(g,q=>q.roundRect(-216,106,432,10,3),yellow);
});
const gear=cog(45,12,yellow);
const book=shape([[-28,-40],[28,-40],[28,40],[-28,40]],red,9,g=>{
  fill(g,q=>q.rect(-19,-32,5,62),white);
  cutLine(g,3,q=>{q.moveTo(-4,-22);q.lineTo(16,-22);q.moveTo(-4,-11);q.lineTo(16,-11)});
});
const cake=shape([[-200,-50],[200,-50],[200,100],[-200,100]],yellow,9,g=>{
  fill(g,q=>q.rect(-196,-30,392,25),white);
  fill(g,q=>q.rect(-195,50,390,14),red);
  for(let i=0;i<9;i++)cutLine(g,4,q=>{q.moveTo(-170+i*40,6);q.lineTo(-170+i*40,39)});
});
const lid=shape([[-208,-20],[208,-20],[215,25],[-215,25]],white,7,g=>{
  for(let i=0;i<9;i++)fill(g,q=>q.arc(-170+i*42,15,7,0,7),red);
});
const flame=shape([[0,-35],[-18,-2],[0,15],[17,-5]],red,42);
const star=shape([[0,-13],[4,-4],[14,0],[4,4],[0,13],[-4,4],[-14,0],[-4,-4]],yellow,46);
const shelf=shape([[-255,-9],[255,-9],[255,12],[-255,12]],red,47);
const photo=new Image();photo.src=new URL('./photo.webp',import.meta.url).href;
export const ready=photo.decode();
function text(g,s,x,y,size=40,color=white,align='center'){
  g.fillStyle=color;g.textAlign=align;g.font=`900 ${size}px "Microsoft YaHei",sans-serif`;g.fillText(s,x,y);
}
function line(g,points,color=yellow,w=3){
  g.strokeStyle=color;g.lineWidth=w;g.lineCap='round';g.lineJoin='round';g.beginPath();g.moveTo(...points[0]);for(const p of points.slice(1))g.lineTo(...p);g.stroke();
}
function person(g,x,y,t,options={}){
  const s=options.scale??.94,walk=options.walk??0,shock=options.shock??0;
  const step=Math.sin(t*10)*walk,lean=options.lean??0;
  const pose={leftLeg:step*.34,rightLeg:-step*.34,leftKnee:Math.max(0,-step)*.5,rightKnee:Math.max(0,step)*.5,
    leftArm:lerp(.22,1.5,shock)-step*.18,leftElbow:lerp(.15,.9,shock),rightArm:lerp(-.22,-1.5,shock)+step*.18,rightElbow:lerp(-.15,-.9,shock),look:options.look??-.1*shock};
  if(options.left)[pose.leftArm,pose.leftElbow]=options.left;
  if(options.right)[pose.rightArm,pose.rightElbow]=options.right;
  // 手掌目标与肩、肘共用原版父子骨架，握持时不另画漂浮的手。
  for(const side of ['left','right']){
    const target=options[`${side}Target`];if(!target)continue;
    const dx=target[0]-(side==='left'?-33:33),dy=target[1]+84;
    const d=Math.min(91.8,Math.max(5,Math.hypot(dx,dy))),bend=side==='left'?1:-1;
    const a=Math.atan2(-dx,dy)+bend*Math.acos(Math.max(-1,Math.min(1,(48*48+d*d-44*44)/(2*48*d))));
    const elbow=-bend*Math.acos(Math.max(-1,Math.min(1,(d*d-48*48-44*44)/(2*48*44))));
    pose[`${side}Arm`]=a;pose[`${side}Elbow`]=elbow;
  }
  pose.leftFoot=-pose.leftLeg-pose.leftKnee-lean;pose.rightFoot=-pose.rightLeg-pose.rightKnee-lean;
  const bob=Math.abs(step)*2.5+(options.bob??0);
  const ms=solveRig(parts,mul(T(x,y-97*s-bob),mul(R(lean),S(s))),pose);
  fill(g,q=>q.ellipse(x,y+1,54*s,10*s,0,0,7),'rgba(0,0,0,.5)');
  for(const name of paintOrder){const part=parts.find(p=>p.name===name),m=ms[name];draw(g,part.piece,m[4],m[5],Math.atan2(m[1],m[0]),s,name==='head'?1.4:.9);}
  const m=ms.head;g.save();g.setTransform(...m);g.fillStyle=ink;
  const pupil=options.gaze??0;g.beginPath();g.arc(-17+pupil,-24,2.8,0,7);g.arc(17+pupil,-24,2.8,0,7);g.fill();
  g.strokeStyle=ink;g.lineWidth=3;g.beginPath();
  if(shock>.35){g.ellipse(0,0,6,8,0,0,7);g.stroke();g.beginPath();g.moveTo(-25,-43);g.lineTo(-12,-45);g.moveTo(12,-45);g.lineTo(25,-43);g.stroke();}
  else {g.moveTo(-11,-1);g.quadraticCurveTo(0,9,13,-3);g.stroke();}
  g.restore();
  return {left:ap(ms.leftHand,[0,0]),right:ap(ms.rightHand,[0,0]),head:ap(ms.head,[0,-23]),matrices:ms};
}
function photograph(g,x,y,a=0,s=1){
  draw(g,card,x,y,a,s,1.2);g.save();g.setTransform(...mul(T(x,y),mul(R(a),S(s))));
  // 照片与相纸共用矩阵，裁切窗口上、左、右均留 12 单位白边。
  g.save();g.beginPath();g.rect(-68,-93,136,170);g.clip();
  const ratio=Math.max(136/photo.naturalWidth,170/photo.naturalHeight),w=photo.naturalWidth*ratio,h=photo.naturalHeight*ratio;
  g.drawImage(photo,-w/2,-8-h/2,w,h);g.restore();
  text(g,'精彩抓拍',0,94,15,ink);g.restore();
}
function caption(g,a,b){
  g.fillStyle=yellow;g.fillRect(35,790,650,130);text(g,a,360,842,32,ink);if(b)text(g,b,360,888,30,ink);
}
function stage(g,scene){
  fill(g,q=>{q.moveTo(125,194);q.lineTo(296,194);q.lineTo(500,706);q.lineTo(45,706);q.closePath()},'rgba(255,229,0,.035)');
  fill(g,q=>{q.moveTo(440,194);q.lineTo(583,194);q.lineTo(671,706);q.lineTo(260,706);q.closePath()},'rgba(255,255,255,.025)');
  fillPaper(g,'ink',44,655,632,95,undefined,'rgba(50,38,30,.78)');
  line(g,[[44,655],[676,655]],'rgba(255,229,0,.23)',2);
  for(let i=0;i<7;i++)line(g,[[140+i*75,655],[50+i*104,744]],'rgba(255,255,255,.075)',1);
  line(g,[[44,739],[676,739]],red,5);
  for(let i=0;i<11;i++)fill(g,q=>q.ellipse(65+i*59,730,6,3,0,0,7),i%2?yellow:white);
  line(g,[[67,214],[180,226],[360,211],[540,226],[653,214]],'rgba(255,255,255,.26)',2);
  for(let i=0;i<9;i++){
    const x=100+i*65,y=216+Math.sin(i*Math.PI/4)*7;
    fill(g,q=>{q.moveTo(x-10,y);q.lineTo(x+10,y);q.lineTo(x,y+21);q.closePath()},i%3?red:yellow);
  }
  for(const [x,y,s] of [[91,336,.7],[632,360,.9],[109,527,.45],[610,266,.45]])draw(g,star,x,y,scene*.25,s,.4);
  g.strokeStyle='rgba(255,229,0,.16)';g.lineWidth=2;g.strokeRect(55,248,610,474);
}
function reaction(g,x,y,amount=1){
  if(amount<=0)return;
  for(let i=0;i<3;i++){const a=-1.1+i*.55;line(g,[[x+Math.cos(a)*12,y+Math.sin(a)*12],[x+Math.cos(a)*(12+16*amount),y+Math.sin(a)*(12+16*amount)]],yellow,3);}
}
function opening(g,t){
  const open=smooth(t,.55,1.95),spill=smooth(t,2.45,2.8),shock=smooth(t,3.02,3.2);
  for(let i=0;i<7;i++){
    const x=160+i*66;g.save();g.globalAlpha=1-spill;photograph(g,x,287,-.06+i*.018,.34);g.restore();
  }
  draw(g,shelf,360,328,.08*spill,1,1.2);
  line(g,[[115,252],[115,324],[142,348]],'rgba(255,255,255,.35)',4);
  line(g,[[605,252],[605,324],[578,348]],'rgba(255,255,255,.35)',4);
  draw(g,curtain,60-285*open,190,0,1,2);draw(g,curtain,360+285*open,190,0,1,2);
  const recoil=Math.sin(Math.max(0,t-3.05)*12)*Math.exp(-Math.max(0,t-3.05)*4)*shock;
  const host=person(g,360+recoil*5,705,t,{scale:.93,shock,look:-.09*shock,bob:recoil*5,
    left:shock>.2?undefined:[lerp(.5,1.24,open),.4],right:shock>.2?undefined:[lerp(-.5,-1.24,open),-.4]});
  if(t<2.5){
    g.strokeStyle=white;g.lineWidth=2.5;g.beginPath();g.moveTo(348-275*open,232);g.quadraticCurveTo(host.left[0]-18,410,...host.left);g.moveTo(372+275*open,232);g.quadraticCurveTo(host.right[0]+18,410,...host.right);g.stroke();
    draw(g,hand,...host.left,0,.93,.6);draw(g,hand,...host.right,0,.93,.6);
  }
  const landings=[[231,668,-.22],[105,629,-.17],[518,659,.22],[614,611,-.13],[455,696,.13]];
  for(let i=0;i<5;i++){
    const start=2.5+i*.2;if(t<start)continue;
    let x,y,a;const [endX,endY,endA]=landings[i];
    if(i===0&&t<3.1){const u=smooth(t,2.5,3.1);x=360;y=lerp(278,378,u);a=.08*u;}
    else if(i===0){const u=smooth(t,3.1,4.05);x=lerp(360,endX,u);y=lerp(378,endY,u)-65*Math.sin(u*Math.PI);a=lerp(.08,endA,u);}
    else {const u=smooth(t,start,start+1.15);x=lerp(150+i*90,endX,u);y=lerp(278,endY,u*u)-13*Math.sin(u*Math.PI*3)*(1-u);a=endA*u;}
    photograph(g,x,y,a,.59);
  }
  if(t>3.05&&t<3.65)reaction(g,host.head[0]+50,host.head[1]-22,1-smooth(t,3.35,3.65));
}
function printer(g,t){
  const busy=smooth(t,.6,1.1),overload=smooth(t,1.6,2.1),shake=Math.sin(t*35)*overload*2;
  draw(g,machine,440+shake,458,0,.83,2);
  draw(g,gear,588+shake,371,t*(2+5*overload),.87,1);
  line(g,[[357,334],[357,296],[505,296],[505,334]],white,7);
  fill(g,q=>q.rect(375,288,110,47),white);line(g,[[391,303],[468,303]],ink,3);line(g,[[391,314],[445,314]],ink,3);
  text(g,t<1.5?'帅照 × 1':'抓拍 × 999',434+shake,391,22,yellow);
  draw(g,diskButton,287+shake,553,0,1,1);
  const host=person(g,193,706,t,{scale:.82,shock:smooth(t,2,2.3),gaze:3,look:-.05,
    right:t<.35?[-.25,-.15]:undefined,rightTarget:t>=.35&&t<1.3?[lerp(65,114,smooth(t,.35,.62)),lerp(0,-89,smooth(t,.35,.62))]:undefined,
    left:t>2?undefined:[.25,.28]});
  if(t>.58&&t<1.3)fill(g,q=>q.arc(287+shake,553,5,0,7),yellow);
  fill(g,q=>q.roundRect(337,513,261,25,5),ink);
  line(g,[[332,537],[339,571],[609,571],[615,537]],'rgba(255,255,255,.7)',4);
  // 先从真实出纸口露出，再沿重力方向落到托盘前，不在机壳上凭空出现。
  for(let i=0;i<7;i++){
    const start=.83+i*.48;if(t<start)continue;
    const u=smooth(t,start,start+1.1),fan=Math.sin(i*3.7);
    g.save();g.beginPath();g.rect(250,514,414,230);g.clip();
    photograph(g,lerp(459,458+fan*134,u),lerp(480,663-(i%3)*18,u),fan*.3*u,.58);g.restore();
  }
  fill(g,q=>q.rect(344,508,241,9),red);
  for(let i=0;i<3;i++)fill(g,q=>q.arc(607,431+i*17,4,0,7),busy&&(Math.floor(t*7)+i)%3===0?yellow:ink);
  if(t>2&&t<2.8)reaction(g,host.head[0]+42,host.head[1]-20,1-smooth(t,2.5,2.8));
}
const diskButton=piece([-19,-19,19,19],g=>{fill(g,q=>q.arc(0,0,17,0,7),white);fill(g,q=>q.arc(0,0,11,0,7),ink)},{col:white,seed:57,ss:2});
function returnTrip(g,t){
  const turn=smooth(t,2.5,2.9),release=smooth(t,2.8,3.45);
  g.strokeStyle='rgba(255,229,0,.30)';g.lineWidth=8;g.beginPath();g.moveTo(136,684);g.bezierCurveTo(655,746,699,304,207,352);g.stroke();
  line(g,[[207,352],[238,330]],yellow,5);line(g,[[207,352],[244,372]],yellow,5);
  fill(g,q=>q.rect(485,309,137,335),'rgba(255,229,0,.08)');
  line(g,[[480,656],[480,307],[625,307],[625,656]],yellow,10);
  for(let i=0;i<3;i++)draw(g,book,555+i*13,615-i*9,-.05,.6,1);
  fill(g,q=>q.rect(420,246,215,58),red);text(g,t<2.6?'出口':'二周目入口',528,287,30,ink);
  const approach=smooth(t,.25,2.45);
  let x=lerp(154,528,approach),y=705;
  if(t>2.8){x=lerp(528,335,release);y-=Math.sin(release*Math.PI)*47;}
  if(t>3.45)x=lerp(335,169,smooth(t,3.45,5.05));
  const braking=smooth(t,2.22,2.58)*(1-smooth(t,3.1,3.5));
  const walking=t<2.45?1:t>3.45&&t<5.05?-1:0;
  if(t>2.32&&t<3.5){
    const startX=x+40,endX=616,cy=y-111;
    const pts=[[startX,cy]];for(let i=1;i<14;i++)pts.push([lerp(startX,endX,i/14),cy+(i%2?10:-10)]);pts.push([endX,cy]);line(g,pts,white,3);
  }
  const host=person(g,x,y,t,{scale:.84,walk:walking,shock:turn*(1-smooth(t,4.5,5.1)),lean:braking*.16-release*(1-release)*.45,gaze:t>2.6?-3:3,
    left:[.48,-1.5],right:braking>.1?[-1.2,-.8]:undefined});
  draw(g,book,host.left[0],host.left[1]-9,t>2.8?-.16:.12,.76,1.2);
  if(t>2.45&&t<3.15){line(g,[[host.head[0]+37,host.head[1]-8],[host.head[0]+55,host.head[1]-26]],white,3);reaction(g,host.head[0]+45,host.head[1]-10,1);}
  if(t>3.45){
    for(let i=0;i<3;i++){
      const f=smooth(t,3.45+i*.13,3.8+i*.13)*(1-smooth(t,4.25,4.65));
      if(f>0)line(g,[[x+60+i*22,681-i*10],[x+60+i*22+18*f,681-i*10]],yellow,3);
    }
  }
}
function backupCake(g,t){
  const lift=smooth(t,1.8,2.7),shock=smooth(t,2.18,2.48),cx=455,cy=623,s=.84;
  fill(g,q=>q.ellipse(cx,712,191,15,0,0,7),'rgba(0,0,0,.5)');
  fill(g,q=>q.ellipse(cx,578,164,21,0,0,7),ink);
  if(t>1.8){
    const sy=570-170*lift,pts=[[455,588]];
    for(let i=1;i<15;i++)pts.push([455+(i%2?18:-18),lerp(588,sy,i/15)]);pts.push([455,sy]);line(g,pts,red,5);
  }
  const targets=[[298,432,-.24],[370,357,-.12],[452,460,.05],[536,373,.15],[607,489,.26]];
  for(let i=0;i<5;i++){
    const start=2.08+i*.21;if(t<start)continue;
    const u=smooth(t,start,start+1.18),[x,y,a]=targets[i];
    photograph(g,lerp(cx,x,u),lerp(610,y,u)-55*Math.sin(Math.PI*u),a*u,.59);
  }
  // 蛋糕前壁遮住未出仓部分，弹簧、照片和盖子共享同一开口。
  draw(g,cake,cx,cy,0,s,1.5);
  line(g,[[278,712],[634,712]],white,6);
  const lidX=cx+25*lift,lidY=571-283*lift,lidAngle=-.13*lift;
  draw(g,lid,lidX,lidY,lidAngle,s,2);
  for(let i=0;i<3;i++){
    const m=mul(T(lidX,lidY),mul(R(lidAngle),S(s)));
    g.save();g.setTransform(...m);fill(g,q=>q.rect(-55+i*50,-70,10,53),white);line(g,[[-55+i*50,-49],[-45+i*50,-56]],red,3);g.restore();
    const top=ap(m,[-50+i*50,-77]);
    if(t<1.72)draw(g,flame,...top,Math.sin(t*8+i)*.08,.43,1);
    else if(t<2.3){g.save();g.globalAlpha=1-smooth(t,1.72,2.3);line(g,[[top[0],top[1]],[top[0]+5,top[1]-15],[top[0]-3,top[1]-29]],white,2);g.restore();}
  }
  const host=person(g,181-8*shock,705,t,{scale:.8,shock,gaze:3,lean:-.07*shock,look:-.14*shock,
    rightTarget:t<2.05?[115,-63-25*smooth(t,1.75,2.05)]:undefined,left:t<1.8?[.38,.55]:undefined});
  if(t>2.22&&t<3.1)reaction(g,host.head[0]+43,host.head[1]-20,1-smooth(t,2.8,3.1));
}
export function render(g,time){
  g.reset();const bounded=Math.max(0,Math.min(duration,time)),scene=Math.min(3,Math.floor(bounded/6)),t=bounded-scene*6;
  fillPaper(g,'ink',0,0,720,960,undefined,'rgba(17,17,17,.74)');
  g.strokeStyle=yellow;g.lineWidth=3;g.strokeRect(24,25,672,910);
  text(g,'510 / 黑历史发布会',48,65,22,yellow,'left');text(g,`动画插播 ${scene+1}/4`,672,65,18,white,'right');
  const titles=['隆 重 开 幕','帅 照 打 印 机','高 三 出 口','删 库 存 仪 式'];
  text(g,titles[scene],360,155,scene%2?49:52,yellow);
  g.save();g.beginPath();g.rect(35,190,650,560);g.clip();stage(g,scene);
  [opening,printer,returnTrip,backupCake][scene](g,t);g.restore();
  if(scene===0)caption(g,t<2.5?'今天，只展示帅照。':'不好意思。',t<2.5?'请当事人放心。':'后台把库存全倒出来了。');
  if(scene===1)caption(g,'申请：一张帅照。',t<2?'正在处理……':'系统理解：无限量抓拍。');
  if(scene===2)caption(g,t<2.6?'别人毕业退场。':'高三二周目，加载完成。',t<2.6?'这位走到出口……':'复读篇，正式返场。');
  if(scene===3)caption(g,t<1.8?'许愿：把这些照片删了。':'愿望已收到。',t<1.8?'好，打开蛋糕看看。':'处理结果：又备份了一份。');
}
export const audioWav=makeScore({duration:24,notes:[60,72,63,67,62,74,65,69],root:36,step:.5,cues:[2.5,3,7.5,8.5,14.6,20.5,21.5],pulse:true,seed:510});
export const evidence={body:machine};
