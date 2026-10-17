import React,{lazy,Suspense,useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Opening} from './Opening';
import photos from './photos.json';
import './style.css';
const FilmPlayer=lazy(()=>import('./FilmPlayer'));

function App(){
  const [opened,setOpened]=useState(false),[sound,setSound]=useState(false),[suspended,setSuspended]=useState(false),[prank,setPrank]=useState(false),[prankLoaded,setPrankLoaded]=useState(false);
  const [group,setGroup]=useState('全部库存'),[modal,setModal]=useState(null),[lit,setLit]=useState(true),[confetti,setConfetti]=useState(0),[audioError,setAudioError]=useState(''),[originalSound,setOriginalSound]=useState(false);
  const [reduced,setReduced]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
  const bg=useRef(null),effect=useRef(null),player=useRef(null),dialog=useRef(null),original=useRef(null),restoreFocus=useRef(null),main=useRef(null),burstTimer=useRef(null);
  const visible=group==='全部库存'?photos:photos.filter(p=>p.group===group);
  const current=typeof modal==='number'?photos[modal]:null;
  const mediaEnabled=opened&&sound&&!suspended;
  function sfx(name){if(!sound||suspended)return;effect.current.pause();effect.current.src=`/assets/${name}.wav`;effect.current.volume=.22;effect.current.play().catch(()=>{});}
  function burst(){if(reduced)return;setConfetti(v=>v+1);clearTimeout(burstTimer.current);burstTimer.current=setTimeout(()=>setConfetti(0),2300);}
  useEffect(()=>{
    const mq=matchMedia('(prefers-reduced-motion: reduce)');const change=()=>setReduced(mq.matches);mq.addEventListener('change',change);
    function hide(){if(document.hidden){setSuspended(true);player.current?.pause();original.current?.pause();effect.current?.pause();}}
    document.addEventListener('visibilitychange',hide);
    return()=>{mq.removeEventListener('change',change);document.removeEventListener('visibilitychange',hide);clearTimeout(burstTimer.current);};
  },[]);
  useEffect(()=>{
    const audio=bg.current;
    audio.volume=.14;
    if(mediaEnabled&&modal!=='video'&&!document.hidden){audio.play().then(()=>setAudioError('')).catch(()=>{setAudioError('音乐未能播放，点一下声音按钮重试。');setSound(false);});}else audio.pause();
    if(!mediaEnabled){effect.current.pause();if(original.current)original.current.muted=true;}
  },[mediaEnabled,modal]);
  useEffect(()=>{if(modal!=='prank'||reduced||prank||!prankLoaded)return;const timer=setTimeout(()=>setPrank(true),2000);return()=>clearTimeout(timer);},[modal,reduced,prank,prankLoaded]);
  useEffect(()=>{
    if(modal===null)return;
    restoreFocus.current=document.activeElement;
    dialog.current.showModal();document.body.style.overflow='hidden';
    return()=>{document.body.style.overflow='';restoreFocus.current?.focus();};
  },[modal!==null]);
  function enter(withSound){
    setSound(withSound);setSuspended(false);setOpened(true);
    if(withSound){bg.current.volume=.19;bg.current.play().catch(()=>{setSound(false);setAudioError('点一下声音按钮即可开启音乐。');});effect.current.src='/assets/open.wav';effect.current.volume=.22;effect.current.play().catch(()=>{});}
    burst();
  }
  function showModal(value){player.current?.pause();setOriginalSound(false);setPrank(false);setPrankLoaded(false);setModal(value);sfx('turn');}
  function closeModal(){original.current?.pause();dialog.current.close();setModal(null);}
  function movePhoto(step){setModal((modal+step+photos.length)%photos.length);sfx('turn');}
  function celebrate(){if(!lit)return;setLit(false);sfx('celebrate');burst();}
  function toggleSound(){if(suspended){setSuspended(false);setSound(true);}else setSound(v=>!v);}
  return <>
    <audio ref={bg} data-testid="background-audio" src="/assets/birthday-loop.wav" loop preload="auto"/>
    <audio ref={effect} data-testid="effect-audio" preload="none"/>
    <header className="site-header"><a href="#" className="wordmark" aria-label="回到首页">510<span> / 黑历史发布会</span></a><div className="header-right"><span className="header-date">10.18 · BIRTHDAY EDITION</span>{opened&&<button className="sound-button" onClick={toggleSound} aria-pressed={sound&&!suspended}>{suspended?'▷ 恢复音乐':sound?'♫ 声音开':'♪ 声音关'}</button>}</div></header>
    <Opening onOpen={enter} reducedMotion={reduced} opened={opened}/>
    {!opened&&<div className="closed-note">19 张照片 · 1 段现场视频 · 当事人请坐稳</div>}
    {opened&&<main ref={main}>
      <div className="opening-note" role="status">发布会已开始。<a href="#film">直接看现场 ↓</a></div>
      {audioError&&<p role="status" className="audio-notice">{audioError}</p>}
      <div className="marquee" aria-hidden="true">510 / 黑历史公开中 / NO COMMENT / 510 /</div>
      <section id="film" className="section film-section">
        <div className="section-heading"><div><span className="eyebrow">01 / OFFICIAL REPLAY</span><h2>本人回应：<br/><em>先别放这个。</em></h2></div><p>50 秒特别放映。<br/>越不想看的，越在后面。</p></div>
        <div className="film-layout"><div className="film-side"><span className="red-stamp">独家库存</span><h3>有图。<br/>有视频。<br/>有点难评。</h3><p>从正经出场到表情失控，<br/>再到高三二周目。</p><button className="primary" onClick={()=>showModal('prank')}>给我看点帅的 ↗</button><small>限时体验 · 后果自负</small></div>
        <div className="player-frame"><Suspense fallback={<div className="film-error">发布会设备准备中……</div>}><FilmPlayer ref={player} reducedMotion={reduced} sound={mediaEnabled&&modal===null}/></Suspense></div></div>
        <div className="film-under"><span>50 SEC / 未经当事人表情管理</span><button className="text-button" onClick={()=>showModal('video')}>看完整现场视频 ↗</button></div>
      </section>
      <section id="repeat" className="section repeat-section"><div className="section-heading"><div><span className="eyebrow">02 / SEASON TWO · 复读篇</span><h2>高三二周目<br/><em>玩家。</em></h2></div><span className="red-stamp">返场嘉宾</span></div><div className="repeat-layout"><figure><button className="visit-photo" onClick={()=>showModal(18)} aria-label="查看复读学校探望照片"><img src="/assets/19.webp" alt="2026年8月19日，去510复读学校探望时的蓝伞校门照片" loading="lazy"/></button><figcaption>2026.08.19 / 探望现场 / 顺便补货</figcaption></figure><div className="repeat-copy"><p className="big-copy">别人毕业退场，<br/>510选择返场。</p><p>没错，这位正在<strong>复读</strong>。<br/>高三，再来一局。</p><hr/><p>我去他复读的学校看他。<br/>人见到了，照片也拍到了。</p><p>本来是去探望的，结果又给本网站补了点库存。</p><div className="ticker">高考等你上岸，<br/>黑历史已经上线。</div></div></div></section>
      <section id="gallery" className="section gallery-section"><div className="section-heading"><div><span className="eyebrow">03 / EVIDENCE ROOM</span><h2>库存公开<span className="title-dot">。</span></h2></div><p>素材横跨多年，本人毫无防备。<br/>点开看大图。</p></div>
        <div className="filters" aria-label="相册分组">{['全部库存','正经出场','表情失控','生活现场'].map(g=><button key={g} className={group===g?'active':''} aria-pressed={group===g} onClick={()=>{setGroup(g);sfx('turn');}}>{g}{g==='全部库存'?' / 19':''}</button>)}</div>
        <div className="photo-grid">{visible.map(p=><button className={`photo-card photo-${p.id}`} key={p.id} onClick={()=>showModal(p.id-1)} aria-label={`查看照片：${p.caption}`}><span className="photo-img-wrap"><img src={p.thumb} alt={p.caption} width={p.width} height={p.height} loading="lazy"/></span><span className="photo-caption"><span>{p.caption}</span><small>{String(p.id).padStart(2,'0')}</small></span></button>)}</div>
      </section>
      <section id="wish" className="wish-section"><span className="eyebrow">04 / REQUEST DENIED</span><h2>{lit?'还有什么想说的？':'行了，今天先放这些。'}</h2>{lit?<button className="primary" onClick={celebrate}>今天就放过我 ↗</button>:<div aria-live="polite"><p className="stock-note">库存还有。</p><p className="birthday-final">生日快乐！</p></div>}</section>
      <footer><span>510 / 黑历史发布会</span><a href="#film" onClick={()=>{player.current?.pause();player.current?.seekTo(0);}}>再公开一次 ↗</a><span>本次发布会到此结束。</span></footer>
    </main>}
    {confetti>0&&<div key={confetti} className="confetti" aria-hidden="true">{Array.from({length:36},(_,i)=><i key={i} style={{'--x':`${(i*37)%100}vw`,'--r':`${i*29}deg`,'--d':`${(i%6)*.07}s`,background:['#FFE500','#FF3434','#FFFFFF'][i%3]}}/>)}</div>}
    {modal!==null&&<dialog ref={dialog} className="media-dialog" onCancel={e=>{e.preventDefault();closeModal();}} onClick={e=>{if(e.target===dialog.current)closeModal();}} onKeyDown={e=>{if(current&&e.key==='ArrowRight')movePhoto(1);if(current&&e.key==='ArrowLeft')movePhoto(-1);}}><div className="dialog-inner"><div className="dialog-top"><span>{current?`${current.id} / ${photos.length} · ${current.caption}`:modal==='prank'?'帅照申请 / 限时体验':'特别收录 / 完整现场视频'}</span><button className="dialog-close" onClick={closeModal} aria-label="关闭大图或视频">✕</button></div>{modal==='prank'?<><div className={`prank-image ${prank?'revealed':'handsome'}`}><img onLoad={()=>setPrankLoaded(true)} src={prank?'/assets/15.webp':'/assets/13.webp'} alt={prank?'歪头抓拍':'西装合照最右侧的510'}/></div><h3 aria-live="polite">{prank?'帅照体验时间已结束。':'这张确实挺帅。'}</h3>{reduced&&!prank&&<button className="primary" onClick={()=>setPrank(true)}>继续看下一张</button>}</>:current?<><img className="large-photo" src={current.src} alt={current.caption}/><div className="dialog-controls"><button onClick={()=>movePhoto(-1)}>← 上一张</button><a href={current.original} target="_blank" rel="noreferrer">查看原图 ↗</a><button onClick={()=>movePhoto(1)}>下一张 →</button></div></>:<><video ref={original} src="/originals/classroom.mp4" controls playsInline muted={!mediaEnabled||!originalSound} preload="metadata" onVolumeChange={()=>{if(original.current&&!mediaEnabled&&!original.current.muted)original.current.muted=true;}}/><div className="dialog-controls"><button onClick={()=>{if(!originalSound||!mediaEnabled){setSound(true);setSuspended(false);setOriginalSound(true);}else setOriginalSound(false);}}>{originalSound&&mediaEnabled?'♫ 关闭原声':'♪ 开启原声'}</button><span className="video-note">原片默认静音，背景音乐已暂停。</span></div></>}</div></dialog>}
  </>;
}
createRoot(document.getElementById('root')).render(<App/>);
