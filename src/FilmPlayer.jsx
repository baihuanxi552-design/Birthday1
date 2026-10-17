import React,{forwardRef,useEffect,useImperativeHandle,useRef} from 'react';
import {FILM_FPS,FILM_SECONDS} from './film-config';
import {url} from './paths';

// Plays the rendered HyperFrames master directly, so the site shows exactly the
// frames that were delivered (outputs/birthday-510-hyperframes-74s.mp4).
export default forwardRef(function FilmPlayer({sound},ref){
  const el=useRef(null);
  useImperativeHandle(ref,()=>({
    pause:()=>el.current?.pause(),
    play:()=>el.current?.play(),
    seekTo:(frame)=>{if(el.current)el.current.currentTime=frame/FILM_FPS;},
    unmute:()=>{if(el.current)el.current.muted=false;},
    mute:()=>{if(el.current)el.current.muted=true;},
  }),[]);
  useEffect(()=>{const v=el.current;if(v)v.muted=!sound;},[sound]);
  return <video ref={el} className="film-video" src={url('assets/film-510.mp4')} poster={url('assets/film-510-poster.jpg')} controls playsInline preload="metadata" muted={!sound} aria-label={`510 黑历史发布会 ${FILM_SECONDS} 秒短片`}/>;
});
