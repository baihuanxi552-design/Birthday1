import React from 'react';
import {useCurrentFrame,useVideoConfig,interpolate} from 'remotion';

// Vector strokes are revealed and posed from the current frame, not CSS timers.
export function Doodle({kind,reducedMotion=false}){
 const frame=useCurrentFrame();const {fps}=useVideoConfig();const t=frame/fps;
 const stride=reducedMotion?0:Math.sin(t*15)*22;
 const x=reducedMotion?0:kind==='runner'?Math.sin(t*2)*125:interpolate(frame,[0,18],[-280,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const ink={fill:'none',stroke:'#111111',strokeWidth:8,strokeLinecap:'round',strokeLinejoin:'round'};
 const reveal=reducedMotion?0:Math.max(0,1-t*2.5);
 return <svg viewBox="0 0 980 300" style={{position:'absolute',bottom:0,left:0,width:'100%',height:'30%',overflow:'visible',pointerEvents:'none'}} aria-label={kind==='runner'?'手绘小人绕回高三二周目':kind==='replay'?'手绘箭头和放大镜标出回放':'手绘小人举起510牌子'}>
 <path d="M0 55 Q230 15 480 60 T980 40 L980 300 L0 300Z" fill="#FFE500"/>
 {kind==='replay'?<g {...ink}><path d="M65 210 Q160 50 370 110 L330 65 M370 110 L318 138" pathLength="1" strokeDasharray="1" strokeDashoffset={reveal}/><g transform={`translate(${reducedMotion?0:Math.sin(t*5)*35},0)`}><circle cx="610" cy="120" r="68"/><path d="M657 174 L741 257" strokeWidth="23"/><path d="M586 94 Q606 75 625 94" stroke="#FF3434"/></g><text x="80" y="270" fill="#111111" stroke="none" fontSize="43" fontWeight="900">等一下！再看一遍。</text></g>:<>
 {kind==='runner'&&<g {...ink}><path d="M130 230 C20 90 840 5 885 155 Q910 245 795 243 L826 218 M795 243 L837 267" pathLength="1" strokeDasharray="1" strokeDashoffset={reveal}/><text x="90" y="120" fill="#111111" stroke="none" fontSize="36" fontWeight="900">高三</text><text x="645" y="125" fill="#111111" stroke="none" fontSize="44" fontWeight="900">二周目 ↶</text></g>}
 <g transform={`translate(${x},0)`} {...ink}>
 <ellipse cx="465" cy="78" rx="32" ry="35" fill="#FFFFFF"/><path d="M440 48 Q467 20 490 50"/><path d="M452 77 L455 77 M477 77 L480 77"/><path d="M456 94 Q468 104 480 91"/>
 <path d="M465 114 L465 193"/><path d={`M465 193 L${430+stride} 234 L${406+stride} 270 M465 193 L${498-stride} 231 L${527-stride} 266`}/>
 <path d={`M465 135 L${423-stride/2} 163 L402 133 M465 135 L${501+stride/2} 156 L532 118`}/>
 {kind==='runner'?<path d="M467 120 Q516 109 512 178 L479 181Z" fill="#FF3434"/>:<g transform={`rotate(${reducedMotion?0:Math.sin(t*7)*4} 575 95)`}><path d="M533 132 L554 46"/><path d="M513 0 L735 9 L727 98 L505 87Z" fill="#FFFFFF"/><text x="542" y="68" fill="#111111" stroke="none" fontSize="68" fontWeight="900">510</text></g>}
 </g>{kind==='entrance'&&<text x="75" y="230" fill="#111111" fontSize="38" fontWeight="900">主角就位！</text>}
 </>}
 </svg>;
}
