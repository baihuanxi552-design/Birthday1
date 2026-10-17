# -*- coding: utf-8 -*-
"""Stack the two contact sheets into one labelled comparison image."""
from PIL import Image, ImageDraw, ImageFont

base = r"D:\Codex projects\项目1\birthday-510\verification\compare"
rm = Image.open(base + r"\sheet-remotion.png").convert("RGB")
hf = Image.open(base + r"\sheet-hyperframes.png").convert("RGB")

width = 1728
def fit(im):
    h = round(im.height * width / im.width)
    return im.resize((width, h), Image.LANCZOS)

rm, hf = fit(rm), fit(hf)
label_h = 52
out = Image.new("RGB", (width, rm.height + hf.height + label_h * 2), (17, 17, 17))
out.paste(rm, (0, label_h))
out.paste(hf, (0, label_h + rm.height + label_h))
d = ImageDraw.Draw(out)
try:
    font = ImageFont.truetype("C:/Windows/Fonts/msyhbd.ttc", 34)
except Exception:
    font = ImageFont.load_default()
d.text((18, 8), "REMOTION 版   outputs/birthday-510-motion-v2.mp4", fill=(255, 229, 0), font=font)
d.text((18, label_h + rm.height + 8), "HYPERFRAMES 版   outputs/birthday-510-hyperframes-74s.mp4", fill=(255, 229, 0), font=font)
out.save(base + r"\compare-both.png")
print("saved", out.size)
