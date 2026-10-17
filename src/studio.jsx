import React from 'react';
import {registerRoot, Composition} from 'remotion';
import {Film} from './Film';
import {FILM_FRAMES,FILM_FPS,FILM_WIDTH,FILM_HEIGHT} from './film-config';
const Root = () => <Composition id="Birthday510" component={Film} durationInFrames={FILM_FRAMES} fps={FILM_FPS} width={FILM_WIDTH} height={FILM_HEIGHT} defaultProps={{sound:true,music:true}}/>;
registerRoot(Root);
