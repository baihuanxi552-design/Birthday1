import {bundle} from '@remotion/bundler';
import {renderMedia,renderStill,selectComposition} from '@remotion/renderer';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {mkdir,writeFile} from 'node:fs/promises';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const output=path.resolve(process.argv[2]||path.join(root,'outputs','birthday-510-motion-v2.mp4'));
const browserExecutable=process.env.BIRTHDAY_CHROME;
if(!browserExecutable)throw new Error('Set BIRTHDAY_CHROME to an installed Chromium executable.');
await mkdir(path.dirname(output),{recursive:true});
const serveUrl=await bundle({entryPoint:path.join(root,'src','studio.jsx'),rootDir:root,publicDir:path.join(root,'public'),outDir:path.join(root,'verification','motion-bundle')});
const inputProps={sound:true,music:true};
const composition=await selectComposition({serveUrl,id:'Birthday510',browserExecutable,inputProps});
const common={serveUrl,composition,inputProps,browserExecutable,logLevel:'warn',timeoutInMilliseconds:120000};
if(process.argv.includes('--stills')){
 for(const second of [3.7,7,22.5,44.8,52,69.8,73]){
  await renderStill({...common,frame:Math.floor(second*composition.fps),output:path.join(path.dirname(output),`film-${second.toFixed(1)}.png`),imageFormat:'png'});
 }
 console.log('Representative frames exported.');
}else{
 let previous=-1;
 await renderMedia({...common,codec:'h264',audioCodec:'aac',crf:19,pixelFormat:'yuv420p',outputLocation:output,concurrency:2,x264Preset:'fast',enforceAudioTrack:true,onProgress:({progress})=>{const stage=Math.floor(progress*20);if(stage!==previous){previous=stage;console.log(`Render ${stage*5}%`);}}});
 await writeFile(output.replace(/\.mp4$/i,'-composition.json'),JSON.stringify({id:composition.id,width:composition.width,height:composition.height,fps:composition.fps,durationInFrames:composition.durationInFrames,seconds:composition.durationInFrames/composition.fps,inputProps,output},null,2));
 console.log(output);
}
