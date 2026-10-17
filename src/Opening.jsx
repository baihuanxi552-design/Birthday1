import React, {useEffect,useRef} from 'react';
import gsap from 'gsap';
import {url} from './paths';

// HyperFrames-style HTML composition: explicit canvas metadata and a GSAP timeline.
export function Opening({onOpen,reducedMotion,opened}) {
  const root=useRef(null);
  const busy=useRef(false);
  useEffect(()=>()=>{window.__timelines?.['birthday-opening']?.kill();},[]);
  function open(sound) {
    if(opened){document.querySelector('#film').scrollIntoView({behavior:reducedMotion?'instant':'smooth'});return;}
    if(busy.current)return;
    busy.current=true;
    onOpen(sound);
    if(reducedMotion)return;
    const tl=gsap.timeline({paused:true});
    tl.fromTo(root.current.querySelector('.hero-photo'),{rotate:4,y:12},{rotate:-3,y:0,duration:.65,ease:'back.out(1.5)'})
      .fromTo(root.current.querySelector('.hero-title'),{y:18,opacity:.4},{y:0,opacity:1,duration:.5},0)
      .fromTo(root.current.querySelector('.birthday-seal'),{scale:.5},{scale:1,rotate:12,duration:.6,ease:'back.out(2)'},.15);
    window.__timelines=window.__timelines||{};
    window.__timelines['birthday-opening']=tl;
    tl.play();
  }
  return <section ref={root} className="hero" data-composition-id="birthday-opening" data-width="1080" data-height="1440" data-start="0" data-duration="1">
    <div className="hero-copy">
      <span className="eyebrow">BIRTHDAY PRESS CONFERENCE / 10.18</span>
      <h1 className="hero-title"><span className="hero-number">510<span className="asterisk">✳</span></span><br/>黑历史<br/>发布会<span className="title-dot">！</span></h1>
      <p className="hero-lead">今天过生日，<br/>顺便公开一点库存。</p>
      <div className="entry-actions"><button className="primary" onClick={()=>open(true)}>{opened?'返回发布现场':'开始公开处刑'} <span>↗</span></button>{!opened&&<button className="text-button" onClick={()=>open(false)}>静音打开</button>}</div>
      <div className="ticket"><span>生日限定 · 全程高能</span><span>NO. 0510</span></div>
    </div>
    <div className="hero-art"><div className="orbit-text">EXCLUSIVE / 当事人请勿离场</div><figure className="hero-photo"><span className="tape"/><img src={url('assets/06.webp')} alt="510在游戏厅的笑场抓拍" fetchPriority="high"/><figcaption><span>表情管理 / 已离线</span><span>☺</span></figcaption></figure><span className="birthday-seal">公开<br/>处刑</span><span className="scribble">↓ 库存不止这些</span></div>
  </section>;
}
