from pathlib import Path
import json, urllib.request

root=Path(__file__).resolve().parents[1]
photos=json.loads((root/'src'/'photos.json').read_text(encoding='utf-8'))
paths=['/']+[p[k] for p in photos for k in ['src','thumb','original']]+['/assets/classroom.mp4','/originals/classroom.mp4']+[f'/assets/{n}.wav' for n in ['birthday-loop','open','turn','celebrate']]
results=[]
for path in paths:
    with urllib.request.urlopen(urllib.request.Request('http://127.0.0.1:4173'+path,method='HEAD'),timeout=5) as response:
        assert response.status==200,path
        size=int(response.headers['Content-Length']) if response.headers.get('Content-Length') else None
        if path!='/':assert size==(root/'dist'/path.lstrip('/')).stat().st_size,path
        results.append({'path':path,'status':response.status,'bytes':size})
(root/'verification'/'http-assets.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
print(f'PASS: {len(results)} production URLs return HTTP 200; all 63 media assets match built-file sizes.')
