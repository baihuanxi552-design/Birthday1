import React from 'react';
import {AbsoluteFill,CanvasImage,Series,Audio,staticFile,useCurrentFrame,useVideoConfig,interpolate} from 'remotion';
import {Video} from '@remotion/media';
import {Doodle} from './Doodle';

function Scene({id,caption,label='库存公开',zoom=false,reducedMotion=false,video=false,replay=false,continuation=false,sound=false,doodle=null}){
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 return <AbsoluteFill style={{background:'#111111',color:'#FFFFFF',padding:50,fontFamily:'Microsoft YaHei,sans-serif',display:'flex',flexDirection:'column',gap:28}}>
 <div style={{display:'flex',justifyContent:'space-between',color:'#FFE500',fontSize:30,fontWeight:900,borderBottom:'5px solid #FFE500',paddingBottom:20}}><span>510 / 黑历史发布会</span><span>{label}</span></div>
 <div style={{flex:1,minHeight:0,overflow:'hidden',position:'relative',border:'12px solid #FFFFFF',background:'#111111',display:'flex',alignItems:'center',justifyContent:'center'}}>
 {video?<Video src={staticFile('assets/classroom.mp4')} trimBefore={(replay?3:continuation?3:0)*fps} muted premountFor={fps} objectFit="contain" style={{width:'100%',height:'100%'}}/>:id?<CanvasImage src={staticFile(`assets/${String(id).padStart(2,'0')}.webp`)} style={{width:'100%',height:'100%',objectFit:'contain',scale:zoom&&!reducedMotion?interpolate(f,[0,12],[1,1.18],{extrapolateRight:'clamp',extrapolateLeft:'clamp'}):1,transformOrigin:id===19?'40% 44%':'50% 45%'}}/>:<div style={{color:'#FFE500',fontSize:140,fontWeight:900,textAlign:'center',lineHeight:1.3}}>复读篇<br/><span style={{fontSize:70,color:'#FFFFFF'}}>高三二周目玩家</span></div>}
 {doodle&&<Doodle kind={doodle} reducedMotion={reducedMotion}/>}
 {replay&&<div style={{position:'absolute',top:20,left:20,background:'#FF3434',padding:18,fontSize:38,fontWeight:900}}>↶ 再确认一遍</div>}
 </div><div style={{minHeight:190,display:'flex',alignItems:'center',justifyContent:'center',background:'#FFE500',color:'#111111',padding:24,fontSize:57,fontWeight:900,lineHeight:1.4,textAlign:'center'}}>{caption}</div>
 <div style={{fontSize:24,letterSpacing:5,color:'#FFFFFF'}}>BIRTHDAY EDITION / 当事人请勿离场</div>
 {sound&&(replay||doodle==='entrance'||label==='紧急更正'||label==='复读篇')&&<Audio src={staticFile(replay?'assets/turn.wav':'assets/open.wav')} volume={.18}/>}
 </AbsoluteFill>;
}
export function Film({reducedMotion=false,sound=false}){
 const {fps}=useVideoConfig();
 return <><Series>
 <Series.Sequence name="01 隆重登场" durationInFrames={4*fps} premountFor={fps}><Scene id={13} caption="下面有请本次发布会主角——510。" label="隆重登场" doodle="entrance" reducedMotion={reducedMotion} sound={sound}/></Series.Sequence>
 <Series.Sequence name="02 紧急更正" durationInFrames={2*fps} premountFor={fps}><Scene id={15} caption="不好意思，放错了。" label="紧急更正" reducedMotion={reducedMotion} sound={sound} zoom/></Series.Sequence>
 <Series.Sequence name="03 本人实拍" durationInFrames={2*fps} premountFor={fps}><Scene id={17} caption="这个才是。" label="本人实拍" reducedMotion={reducedMotion} sound={sound} zoom/></Series.Sequence>
 <Series.Sequence name="04 发布会现场" durationInFrames={3*fps} premountFor={fps}><Scene id={8} caption="关于网上流传的照片，本人回应如下——" label="发布会现场" reducedMotion={reducedMotion} sound={sound}/></Series.Sequence>
 <Series.Sequence name="05 回应结束" durationInFrames={2*fps} premountFor={fps}><Scene id={1} caption="哈哈哈哈哈哈。" label="回应结束" reducedMotion={reducedMotion} sound={sound} zoom/></Series.Sequence>
 <Series.Sequence name="06 游戏厅 / 01" durationInFrames={1.5*fps} premountFor={fps}><Scene id={4} caption="同一个人。" label="游戏厅 / 01" reducedMotion={reducedMotion} sound={sound}/></Series.Sequence>
 <Series.Sequence name="07 游戏厅 / 02" durationInFrames={1.5*fps} premountFor={fps}><Scene id={5} caption="三张照片。" label="游戏厅 / 02" reducedMotion={reducedMotion} sound={sound}/></Series.Sequence>
 <Series.Sequence name="08 游戏厅 / 03" durationInFrames={2*fps} premountFor={fps}><Scene id={6} caption="没有一张在管理表情。" label="游戏厅 / 03" reducedMotion={reducedMotion} sound={sound} zoom/></Series.Sequence>
 <Series.Sequence name="09 现场视频" durationInFrames={3*fps} premountFor={fps}><Scene caption="你以为他只是拍照不太正常。" label="现场视频" reducedMotion={reducedMotion} sound={sound} video/></Series.Sequence>
 <Series.Sequence name="10 现场视频" durationInFrames={3*fps} premountFor={fps}><Scene caption="直到你打开了视频。" label="现场视频" reducedMotion={reducedMotion} sound={sound} video continuation/></Series.Sequence>
 <Series.Sequence name="11 精彩回放" durationInFrames={1*fps} premountFor={fps}><Scene caption="再确认一遍。" label="精彩回放" doodle="replay" reducedMotion={reducedMotion} sound={sound} video replay/></Series.Sequence>
 <Series.Sequence name="12 精彩回放 ×2" durationInFrames={1*fps} premountFor={fps}><Scene caption="确实是本人。" label="精彩回放 ×2" doodle="replay" reducedMotion={reducedMotion} sound={sound} video replay/></Series.Sequence>
 <Series.Sequence name="13 日常记录" durationInFrames={2*fps} premountFor={fps}><Scene id={3} caption="学习时：谢绝打扰。" label="日常记录" reducedMotion={reducedMotion} sound={sound}/></Series.Sequence>
 <Series.Sequence name="14 日常记录" durationInFrames={2*fps} premountFor={fps}><Scene id={12} caption="开饭时：本人到场。" label="日常记录" reducedMotion={reducedMotion} sound={sound}/></Series.Sequence>
 <Series.Sequence name="15 复读篇" durationInFrames={2*fps} premountFor={fps}><Scene caption="别人毕业退场。" label="复读篇" doodle="runner" reducedMotion={reducedMotion} sound={sound}/></Series.Sequence>
 <Series.Sequence name="16 复读篇" durationInFrames={2*fps} premountFor={fps}><Scene id={10} caption="510选择返场。高三二周目，正式开启。" label="复读篇" doodle="runner" reducedMotion={reducedMotion} sound={sound}/></Series.Sequence>
 <Series.Sequence name="17 复读篇 / 探望现场" durationInFrames={4*fps} premountFor={fps}><Scene id={19} caption="2026年8月19日，去复读学校探望他。" label="复读篇 / 探望现场" reducedMotion={reducedMotion} sound={sound}/></Series.Sequence>
 <Series.Sequence name="18 复读篇 / 探望现场" durationInFrames={2*fps} premountFor={fps}><Scene id={19} caption="人见到了。" label="复读篇 / 探望现场" reducedMotion={reducedMotion} sound={sound} zoom/></Series.Sequence>
 <Series.Sequence name="19 复读篇 / 顺便补货" durationInFrames={2*fps} premountFor={fps}><Scene id={19} caption="本网站的库存也增加了。" label="复读篇 / 顺便补货" reducedMotion={reducedMotion} sound={sound} zoom/></Series.Sequence>
 <Series.Sequence name="20 库存持续更新" durationInFrames={2*fps} premountFor={fps}><Scene id={14} caption="高考等你上岸。" label="库存持续更新" reducedMotion={reducedMotion} sound={sound}/></Series.Sequence>
 <Series.Sequence name="21 库存持续更新" durationInFrames={1*fps} premountFor={fps}><Scene id={18} caption="黑历史已经上线。" label="库存持续更新" reducedMotion={reducedMotion} sound={sound}/></Series.Sequence>
 <Series.Sequence name="22 库存持续更新" durationInFrames={1*fps} premountFor={fps}><Scene id={11} caption="黑历史已经上线。" label="库存持续更新" reducedMotion={reducedMotion} sound={sound}/></Series.Sequence>
 <Series.Sequence name="23 本次发布结束" durationInFrames={2*fps} premountFor={fps}><Scene id={17} caption="行了，今天先放这些。" label="本次发布结束" reducedMotion={reducedMotion} sound={sound}/></Series.Sequence>
 <Series.Sequence name="24 库存还有" durationInFrames={2*fps} premountFor={fps}><Scene id={13} caption="生日快乐！" label="库存还有" reducedMotion={reducedMotion} sound={sound}/></Series.Sequence>
 </Series></>;
}
