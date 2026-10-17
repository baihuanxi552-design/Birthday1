import React,{forwardRef,useEffect} from 'react';
import {Player} from '@remotion/player';
import {Film} from './Film';

export default forwardRef(function FilmPlayer({reducedMotion,sound},ref){
  useEffect(()=>{if(sound)ref.current?.unmute();else ref.current?.mute();},[sound,ref]);
  return <Player ref={ref} component={Film} inputProps={{reducedMotion,sound}} durationInFrames={1500} fps={30} compositionWidth={1080} compositionHeight={1440} controls clickToPlay doubleClickToFullscreen style={{width:'100%',aspectRatio:'3/4'}} autoPlay={false} loop={false} moveToBeginningWhenEnded={false} showVolumeControls={false} initiallyMuted errorFallback={({error})=><div className="film-error">短片暂时没能播放。可以先翻相册，或刷新页面重试。<small>{error.message}</small></div>}/>;
});
