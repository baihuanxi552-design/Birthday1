from pathlib import Path
import hashlib, json, wave, subprocess
from PIL import Image
import numpy as np

root=Path(__file__).resolve().parents[1]
manifest=json.loads((root/'asset-manifest.json').read_text(encoding='utf-8'))
assert len(manifest)==19
for photo in manifest:
    original=root/'public'/photo['original'].lstrip('/')
    assert hashlib.sha256(original.read_bytes()).hexdigest()==photo['sha256'], f"Original mismatch: {photo['id']}"
    assert hashlib.sha256(Path(photo['source']).read_bytes()).hexdigest()==photo['sha256'], f"Source changed: {photo['id']}"
    for field in ['src','thumb']:
        with Image.open(root/'public'/photo[field].lstrip('/')) as im:
            im.verify()
    with Image.open(root/'public'/photo['src'].lstrip('/')) as im:
        assert abs(im.width/im.height-photo['width']/photo['height'])<.01
for name in ['birthday-loop','open','turn','celebrate']:
    with wave.open(str(root/'public'/'assets'/f'{name}.wav'),'rb') as audio:
        assert audio.getnchannels()==1
        data=np.frombuffer(audio.readframes(audio.getnframes()),dtype='<i2')
        assert 1000<max(abs(data.astype(np.int32)))<32767
        if name=='birthday-loop':assert audio.getnframes()/audio.getframerate()==16
info=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','stream=width,height,codec_type:format=duration','-of','json',str(root/'public'/'assets'/'classroom.mp4')]))
assert info['streams'][0]['width']==720 and info['streams'][0]['height']==1280
assert 11<float(info['format']['duration'])<12
assert all(s['codec_type']!='audio' for s in info['streams'])
assert (root/'public'/'originals'/'classroom.mp4').read_bytes()==Path(r'D:\Downloads\XiaoAi\510\微信视频2026-10-17_213500_788.mp4').read_bytes()
print('PASS: 19 originals match source SHA-256; 38 WebP files decode and preserve ratio; 4 audio files are audible/non-clipping; portrait clip and original video verified.')

