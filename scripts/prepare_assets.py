from pathlib import Path
import shutil, json, hashlib, wave, math
from PIL import Image, ImageOps
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(r'D:\Downloads\XiaoAi\510')
NAMES = [
('ScreenShot_2026-10-17_214641_361.png','表情失控','回应如下：哈哈哈哈'),
('微信图片_20231229103821_478_270.jpg','表情失控','表情管理：不在服务区'),
('微信图片_20240330164148_5002_270.jpg','生活现场','学习时：谢绝打扰'),
('微信图片_20240602134011_6834_270.jpg','生活现场','同一个人'),
('微信图片_20240602134011_6835_270.jpg','生活现场','三张照片'),
('微信图片_20240810210146_908_188.jpg','生活现场','没有一张在管理表情'),
('微信图片_20250711152303_264_413.jpg','正经出场','下面请当事人发言'),
('微信图片_20250711152323_267_413.jpg','正经出场','关于这些照片，本人回应'),
('微信图片_20250711152329_272_413.jpg','正经出场','发布会后台：憋住'),
('微信图片_20251101101636_667_413.jpg','正经出场','正经出场，仅供参考'),
('dji_export_photo_20260518143034663.jpg','表情失控','回应结束，开始笑场'),
('MVIMG_20251001_125921.jpg','生活现场','开饭时：本人到场'),
('IMG_20260308_174216.jpg','正经出场','帅照体验卡，限时两秒'),
('mmexport1736054773033.jpg','正经出场','镜头来了，坐稳'),
('IMG_20261017_210600.jpg','表情失控','帅照体验时间已结束'),
('IMG_20261017_210503.jpg','表情失控','我刚才是不是被拍了'),
('mmexport1792242658510.jpg','表情失控','本人正在尝试退出网站'),
('MVIMG_20260125_145134.jpg','生活现场','实体库存，同步公开'),
('IMG_20260819_170814.jpg','生活现场','复读篇：探望顺便补货'),
]
assets = ROOT/'public'/'assets'
originals = ROOT/'public'/'originals'
assets.mkdir(parents=True, exist_ok=True)
originals.mkdir(parents=True, exist_ok=True)
manifest=[]
for i,(name,group,caption) in enumerate(NAMES,1):
    src = Path(name) if Path(name).is_absolute() else SOURCE/name
    dest = originals/f'{i:02}{src.suffix.lower()}'
    shutil.copy2(src,dest)
    with Image.open(src) as img:
        img=ImageOps.exif_transpose(img).convert('RGB')
        width,height=img.size
        img.thumbnail((1800,1800))
        img.save(assets/f'{i:02}.webp', quality=88,method=6)
        img.thumbnail((600,760))
        img.save(assets/f'{i:02}-thumb.webp',quality=84,method=6)
    manifest.append(dict(id=i,src=f'/assets/{i:02}.webp',thumb=f'/assets/{i:02}-thumb.webp',original=f'/originals/{dest.name}',width=width,height=height,group=group,caption=caption,sha256=hashlib.sha256(src.read_bytes()).hexdigest(),source=str(src)))
video = SOURCE/'微信视频2026-10-17_213500_788.mp4'
shutil.copy2(video, originals/'classroom.mp4')
(ROOT/'asset-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
(ROOT/'src'/'photos.json').write_text(json.dumps([{k:v for k,v in item.items() if k not in ('source','sha256')} for item in manifest],ensure_ascii=False,indent=2),encoding='utf-8')

# A locally synthesized original 8-bar instrumental loop, 120 BPM.
sr=24000
beat=60/120
seconds=32*beat
music=np.zeros(int(sr*seconds),dtype=np.float64)
def note(buf,start,duration,midi,volume=.1,kind='pluck'):
    count=min(int(duration*sr),len(buf)-int(start*sr))
    if count<=0:return
    t=np.arange(count)/sr
    freq=440*2**((midi-69)/12)
    env=np.minimum(t/.012,1)*np.minimum((duration-t)/.09,1)
    if kind=='pluck':env*=np.exp(-t*12)
    tone=np.sin(2*np.pi*freq*t)+.22*np.sin(2*np.pi*freq*2*t)
    buf[int(start*sr):int(start*sr)+count]+=tone*env*volume
chords=[(60,64,67),(55,59,62),(57,60,64),(53,57,60)]*2
melody=[72,60,75,67, 74,62,77,65, 76,64,79,67, 71,59,74,62]*2
for bar,chord in enumerate(chords):
    for pos in range(8):note(music,(bar*4+pos*.5)*beat,.16,chord[pos%3]+12,.04)
    for pos in range(4):
        note(music,(bar*4+pos)*beat,.36,melody[bar*4+pos],.065)
        note(music,(bar*4+pos)*beat,.24,chord[0]-12,.065)
    for pos in [1,3]:
        rng=np.random.default_rng(bar*10+pos)
        n=int(.07*sr);t=np.arange(n)/sr
        start=int((bar*4+pos)*beat*sr)
        music[start:start+n]+=rng.uniform(-1,1,n)*np.exp(-t*70)*.035
music/=max(1,np.max(np.abs(music))/.55)
def save(name,data):
    with wave.open(str(assets/name),'wb') as f:
        f.setnchannels(1);f.setsampwidth(2);f.setframerate(sr)
        f.writeframes((np.clip(data,-1,1)*32767).astype('<i2').tobytes())
save('birthday-loop.wav',music)
for name,pitches in [('open.wav',[48,60,55]),('turn.wav',[84,72,60]),('celebrate.wav',[72,76,79,84,88])]:
    effect=np.zeros(sr)
    for j,pitch in enumerate(pitches):note(effect,j*.09,.45,pitch,.14)
    save(name,effect)
print(json.dumps({'photos':len(manifest),'music_seconds':seconds,'original_video_bytes':video.stat().st_size}))
