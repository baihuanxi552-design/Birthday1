import React from 'react';
import {registerRoot, Composition} from 'remotion';
import {Film} from './Film';
const Root = () => <Composition id="Birthday510" component={Film} durationInFrames={1500} fps={30} width={1080} height={1440}/>;
registerRoot(Root);
