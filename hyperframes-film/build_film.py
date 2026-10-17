# -*- coding: utf-8 -*-
"""Generate the HyperFrames composition (index.html) for the 74s 510 film.

Scene table is ported 1:1 from the Remotion timeline (src/Film.jsx) so the two
renders can be compared shot by shot.

Structure follows the HyperFrames clip model: the root composition holds only
flat, leaf clips; media lives inside one non-timed wrapper (#viewport) so the
videos are never nested in a timed element.
"""
import json
import os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "index.html")

# start, duration, kind, payload
SCENES = [
    (0.0, 6.0, "aux", {"index": 0}),
    (6.0, 4.0, "photo", {"id": 13, "label": "隆重登场", "caption": "下面有请本次发布会主角——510。", "doodle": "sign"}),
    (10.0, 2.0, "photo", {"id": 15, "label": "紧急更正", "caption": "不好意思，放错了。", "zoom": True}),
    (12.0, 2.0, "photo", {"id": 17, "label": "本人实拍", "caption": "这个才是。", "zoom": True}),
    (14.0, 3.0, "photo", {"id": 8, "label": "发布会现场", "caption": "关于网上流传的照片，本人回应如下——"}),
    (17.0, 2.0, "photo", {"id": 1, "label": "回应结束", "caption": "哈哈哈哈哈哈。", "zoom": True}),
    (19.0, 6.0, "aux", {"index": 1}),
    (25.0, 1.5, "photo", {"id": 4, "label": "游戏厅 / 01", "caption": "同一个人。"}),
    (26.5, 1.5, "photo", {"id": 5, "label": "游戏厅 / 02", "caption": "三张照片。"}),
    (28.0, 2.0, "photo", {"id": 6, "label": "游戏厅 / 03", "caption": "没有一张在管理表情。", "zoom": True}),
    (30.0, 3.0, "video", {"label": "现场视频", "caption": "你以为他只是拍照不太正常。", "ms": 0}),
    (33.0, 3.0, "video", {"label": "现场视频", "caption": "直到你打开了视频。", "ms": 3}),
    (36.0, 1.0, "video", {"label": "精彩回放", "caption": "再确认一遍。", "ms": 3, "replay": True}),
    (37.0, 1.0, "video", {"label": "精彩回放 ×2", "caption": "确实是本人。", "ms": 3, "replay": True}),
    (38.0, 2.0, "photo", {"id": 3, "label": "日常记录", "caption": "学习时：谢绝打扰。"}),
    (40.0, 2.0, "photo", {"id": 12, "label": "日常记录", "caption": "开饭时：本人到场。"}),
    (42.0, 6.0, "aux", {"index": 2}),
    (48.0, 2.0, "text", {"label": "复读篇", "caption": "别人毕业退场。", "doodle": "runner"}),
    (50.0, 2.0, "photo", {"id": 10, "label": "复读篇", "caption": "510选择返场。高三二周目，正式开启。"}),
    (52.0, 4.0, "photo", {"id": 19, "label": "复读篇 / 探望现场", "caption": "2026年8月19日，去复读学校探望他。"}),
    (56.0, 2.0, "photo", {"id": 19, "label": "复读篇 / 探望现场", "caption": "人见到了。", "zoom": True}),
    (58.0, 2.0, "photo", {"id": 19, "label": "复读篇 / 顺便补货", "caption": "本网站的库存也增加了。", "zoom": True}),
    (60.0, 2.0, "photo", {"id": 14, "label": "库存持续更新", "caption": "高考等你上岸。"}),
    (62.0, 1.0, "photo", {"id": 18, "label": "库存持续更新", "caption": "黑历史已经上线。"}),
    (63.0, 1.0, "photo", {"id": 11, "label": "库存持续更新", "caption": "黑历史已经上线。"}),
    (64.0, 2.0, "photo", {"id": 17, "label": "本次发布结束", "caption": "行了，今天先放这些。"}),
    (66.0, 6.0, "aux", {"index": 3}),
    (72.0, 2.0, "photo", {"id": 13, "label": "库存还有", "caption": "生日快乐！", "final": True}),
]

SFX = [(6.0, "open"), (10.0, "open"), (14.0, "open"), (36.0, "turn"),
       (37.0, "turn"), (48.0, "open"), (72.0, "celebrate")]
MUSIC_SEGMENTS = [(0.0, 16.0), (16.0, 16.0), (32.0, 16.0), (48.0, 16.0), (64.0, 10.0)]

DOODLE_SIGN = """<svg width="230" height="330" viewBox="0 0 230 330">
        <g id="%s-sign">
          <rect x="26" y="8" width="176" height="86" rx="8" fill="#FFE500" stroke="#111111" stroke-width="10"/>
          <text x="114" y="72" text-anchor="middle" font-size="58" font-weight="900" fill="#111111" stroke="none" font-family="Microsoft YaHei, PingFang SC">510</text>
        </g>
        <circle cx="108" cy="158" r="28" fill="#FFFFFF" stroke="#111111" stroke-width="16"/>
        <circle cx="108" cy="158" r="28" fill="#FFFFFF" stroke="#FFE500" stroke-width="7"/>
        <line x1="112" y1="96" x2="108" y2="128" class="ink-out"/><line x1="112" y1="96" x2="108" y2="128" class="ink-in"/>
        <line x1="108" y1="186" x2="108" y2="248" class="ink-out"/><line x1="108" y1="186" x2="108" y2="248" class="ink-in"/>
        <line x1="108" y1="200" x2="60" y2="232" class="ink-out"/><line x1="108" y1="200" x2="60" y2="232" class="ink-in"/>
        <line x1="108" y1="200" x2="158" y2="228" class="ink-out"/><line x1="108" y1="200" x2="158" y2="228" class="ink-in"/>
        <g id="%s-legA"><line x1="108" y1="248" x2="76" y2="312" class="ink-out"/><line x1="108" y1="248" x2="76" y2="312" class="ink-in"/></g>
        <g id="%s-legB"><line x1="108" y1="248" x2="140" y2="312" class="ink-out"/><line x1="108" y1="248" x2="140" y2="312" class="ink-in"/></g>
      </svg>"""

DOODLE_RUNNER = """<svg width="230" height="320" viewBox="0 0 230 320">
        <rect x="22" y="140" width="64" height="80" rx="12" fill="#FF3434" stroke="#111111" stroke-width="10"/>
        <circle cx="104" cy="112" r="26" fill="#FFFFFF" stroke="#111111" stroke-width="16"/>
        <circle cx="104" cy="112" r="26" fill="#FFFFFF" stroke="#FFE500" stroke-width="7"/>
        <line x1="104" y1="138" x2="104" y2="204" class="ink-out"/><line x1="104" y1="138" x2="104" y2="204" class="ink-in"/>
        <g id="%s-armL"><line x1="104" y1="158" x2="58" y2="182" class="ink-out"/><line x1="104" y1="158" x2="58" y2="182" class="ink-in"/></g>
        <line x1="104" y1="156" x2="152" y2="152" class="ink-out"/><line x1="104" y1="156" x2="152" y2="152" class="ink-in"/>
        <g id="%s-legA"><line x1="104" y1="204" x2="68" y2="276" class="ink-out"/><line x1="104" y1="204" x2="68" y2="276" class="ink-in"/></g>
        <g id="%s-legB"><line x1="104" y1="204" x2="138" y2="276" class="ink-out"/><line x1="104" y1="204" x2="138" y2="276" class="ink-in"/></g>
      </svg>"""

HEAD = """<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<title>510 黑历史发布会 · 74 秒成片（HyperFrames）</title>
<style>
  @font-face { font-family: 'Microsoft YaHei'; src: local('Microsoft YaHei'); font-weight: 400 900; }
  @font-face { font-family: 'PingFang SC'; src: local('PingFang SC'); font-weight: 400 900; }

  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { background: #111111; }
  body { font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif; }

  #stage { position: relative; width: 1080px; height: 1440px; overflow: hidden; background: #111111; color: #FFFFFF; }

  /* non-timed media wrapper: clips crop here, videos stay out of timed divs */
  #viewport {
    position: absolute; left: 30px; top: 146px; width: 1020px; height: 950px;
    border: 14px solid #FFFFFF; background: #111111; overflow: hidden; z-index: 2;
  }
  #viewport .media { position: absolute; left: 0; top: 0; width: 992px; height: 922px; object-fit: contain; }
  #viewport .plain-title {
    position: absolute; left: 0; top: 0; width: 992px; height: 922px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    color: #FFE500; font-size: 126px; font-weight: 900; line-height: 1.18; text-align: center;
  }
  .plain-sub { display: block; margin-top: 20px; color: #FFFFFF; font-size: 62px; letter-spacing: 2px; font-weight: 900; }

  .clip.bar {
    position: absolute; left: 30px; top: 34px; width: 1020px; height: 74px; z-index: 6;
    display: flex; align-items: flex-end; justify-content: space-between;
    border-bottom: 6px solid #FFE500; padding-bottom: 14px;
    color: #FFE500; font-size: 33px; font-weight: 900; letter-spacing: 1px;
  }
  .clip.cap {
    position: absolute; left: 30px; bottom: 96px; width: 1020px; min-height: 200px; z-index: 6;
    background: #FFE500; color: #111111; display: flex; align-items: center; justify-content: center;
    padding: 26px 30px; text-align: center; font-size: 57px; font-weight: 900; line-height: 1.34;
  }
  .clip.foot {
    position: absolute; left: 30px; bottom: 34px; z-index: 6;
    font-size: 24px; letter-spacing: 6px; color: #FFFFFF; opacity: .9;
  }
  .clip.badge {
    position: absolute; left: 44px; top: 170px; z-index: 7;
    background: #FF3434; color: #FFFFFF; font-size: 33px; font-weight: 900;
    padding: 14px 20px; letter-spacing: 1px;
  }
  .clip.doodle { position: absolute; left: 0; top: 0; width: 992px; height: 922px; z-index: 8; pointer-events: none; }
  .clip.doodle svg { position: absolute; left: 24px; bottom: 10px; overflow: visible; }
  .ink-out { fill: none; stroke: #111111; stroke-width: 19; stroke-linecap: round; stroke-linejoin: round; }
  .ink-in { fill: none; stroke: #FFE500; stroke-width: 8; stroke-linecap: round; stroke-linejoin: round; }

  video.aux { position: absolute; left: 0; top: 0; width: 1080px; height: 1440px; object-fit: cover; background: #111111; z-index: 3; }

  #cutflash { position: absolute; inset: 0; background: #FFFFFF; opacity: 0; z-index: 40; pointer-events: none; }
  #vignette { position: absolute; inset: 0; z-index: 20; pointer-events: none;
    background: radial-gradient(120% 80% at 50% 42%, rgba(0,0,0,0) 55%, rgba(0,0,0,.45) 100%); }
  #confetti { position: absolute; inset: 0; z-index: 30; pointer-events: none; }
  .conf { position: absolute; width: 18px; height: 26px; opacity: 0; }
</style>
</head>
<body>
<div id="stage" data-composition-id="birthday510" data-width="1080" data-height="1440" data-start="0" data-duration="74">
  <div id="viewport">
"""

TAIL = """
  <div id="cutflash"></div>
  <div id="vignette"></div>
  <div id="confetti"></div>

  <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
  <script>
    window.__timelines = window.__timelines || {};

    const SCENES = __SCENES__;

    const confetti = document.getElementById('confetti');
    const colors = ['#FFE500', '#FF3434', '#FFFFFF'];
    for (let i = 0; i < 26; i++) {
      const d = document.createElement('div');
      d.className = 'conf';
      d.style.left = (40 + (i * 37) % 1000) + 'px';
      d.style.top = '-40px';
      d.style.background = colors[i % colors.length];
      d.style.transform = 'rotate(' + (i * 13 % 90) + 'deg)';
      confetti.appendChild(d);
    }

    const tl = gsap.timeline({ paused: true });

    SCENES.forEach(function (s, i) {
      const t = s.start;
      const bar = '#s' + i + '-bar';
      const cap = '#s' + i + '-cap';
      const foot = '#s' + i + '-foot';
      const badge = '#s' + i + '-badge';
      const media = '#s' + i + '-media';
      const title = '#s' + i + '-title';

      if (s.kind === 'aux') {
        tl.set('#cutflash', { opacity: 0.85 }, t);
        tl.to('#cutflash', { opacity: 0, duration: 0.18, ease: 'none' }, t + 0.02);
        return;
      }

      tl.from(bar, { x: -46, opacity: 0, duration: 0.32, ease: 'power3.out' }, t + 0.04);
      tl.from(cap, { y: 46, opacity: 0, duration: 0.42, ease: 'power4.out' }, t + 0.2);
      tl.fromTo(cap, { clipPath: 'inset(0 0 0 100%)' },
        { clipPath: 'inset(0 0 0 0%)', duration: 0.34, ease: 'power2.out' }, t + 0.16);
      tl.from(foot, { opacity: 0, duration: 0.3, ease: 'sine.out' }, t + 0.34);

      if (s.kind === 'text') {
        tl.from(title, { y: 74, opacity: 0, duration: 0.5, ease: 'expo.out' }, t + 0.12);
      } else {
        tl.from(media, { y: 54, scale: 0.94, opacity: 0, duration: 0.5, ease: 'power3.out' }, t + 0.1);
      }
      if (s.zoom) {
        tl.fromTo(media, { scale: 1 }, { scale: 1.16, duration: 1.7, ease: 'power1.inOut' }, t + 0.55);
      }
      if (s.badge) {
        tl.from(badge, { rotation: -9, scale: 1.7, opacity: 0, duration: 0.34, ease: 'back.out(2.4)' }, t + 0.06);
      }
      if (s.doodle === 'sign') {
        const d = '#s' + i + '-doodle';
        tl.from(d, { x: -300, opacity: 0, duration: 0.62, ease: 'back.out(1.5)' }, t + 0.18);
        tl.to('#s' + i + '-legA', { rotation: 14, svgOrigin: '108 248', duration: 0.3, repeat: 7, yoyo: true, ease: 'sine.inOut' }, t + 0.32);
        tl.to('#s' + i + '-legB', { rotation: -14, svgOrigin: '108 248', duration: 0.3, repeat: 7, yoyo: true, ease: 'sine.inOut' }, t + 0.32);
        tl.to('#s' + i + '-sign', { rotation: -3.5, svgOrigin: '114 94', duration: 0.44, repeat: 3, yoyo: true, ease: 'sine.inOut' }, t + 0.62);
      }
      if (s.doodle === 'runner') {
        const d = '#s' + i + '-doodle';
        tl.from(d, { x: -280, opacity: 0, duration: 0.5, ease: 'power2.out' }, t + 0.1);
        tl.to(d, { x: 200, duration: 1.25, ease: 'none' }, t + 0.6);
        tl.to('#s' + i + '-legA', { rotation: 22, svgOrigin: '104 204', duration: 0.16, repeat: 9, yoyo: true, ease: 'sine.inOut' }, t + 0.55);
        tl.to('#s' + i + '-legB', { rotation: -22, svgOrigin: '104 204', duration: 0.16, repeat: 9, yoyo: true, ease: 'sine.inOut' }, t + 0.55);
        tl.to('#s' + i + '-armL', { rotation: -20, svgOrigin: '104 158', duration: 0.16, repeat: 9, yoyo: true, ease: 'sine.inOut' }, t + 0.55);
      }

      tl.set('#cutflash', { opacity: 0.5 }, t);
      tl.to('#cutflash', { opacity: 0, duration: 0.14, ease: 'none' }, t + 0.02);
    });

    // closing beat
    tl.fromTo('#s27-cap', { scale: 0.66, rotation: -2.5 },
      { scale: 1, rotation: 0, duration: 0.55, ease: 'back.out(3)' }, 72.06);
    tl.to('#viewport', { scale: 1.05, duration: 1.9, ease: 'sine.inOut' }, 72.1);

    const confs = document.querySelectorAll('.conf');
    confs.forEach(function (c, i) {
      tl.fromTo(c, { y: -60, opacity: 0, rotation: 0 },
        { y: 1520, opacity: 1, rotation: 540 + (i % 5) * 90, duration: 2.0 + (i % 4) * 0.15, ease: 'power1.in' },
        72.08 + (i % 9) * 0.045);
      tl.to(c, { opacity: 0, duration: 0.22 }, 73.85);
    });

    window.__timelines['birthday510'] = tl;
  </script>
</body>
</html>
"""


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def build():
    out = [HEAD]
    js = []
    media = []
    overlay = []
    for i, (start, dur, kind, p) in enumerate(SCENES):
        js.append({
            "start": start, "duration": dur, "kind": kind,
            "zoom": bool(p.get("zoom")),
            "badge": bool(p.get("replay")),
            "doodle": p.get("doodle"),
        })
        if kind == "aux":
            overlay.append('  <video id="v%d" class="clip aux" data-start="%s" data-duration="%s" data-media-start="%s" data-track-index="0" src="assets/motion-v2.mp4" muted playsinline></video>\n'
                           % (i, start, dur, p["index"] * 6))
            continue
        if kind == "video":
            media.append('   <video id="s%d-media" class="clip media" data-start="%s" data-duration="%s" data-media-start="%s" data-track-index="2" src="assets/classroom.mp4" muted playsinline></video>\n'
                         % (i, start, dur, p["ms"]))
        if kind == "photo":
            media.append('   <img id="s%d-media" class="clip media" data-start="%s" data-duration="%s" data-track-index="2" src="assets/%02d.webp" alt="" />\n'
                         % (i, start, dur, p["id"]))
        if kind == "text":
            media.append('   <div id="s%d-title" class="clip plain-title" data-start="%s" data-duration="%s" data-track-index="2">复读篇<span class="plain-sub">高三二周目玩家</span></div>\n'
                         % (i, start, dur))
        if p.get("doodle") == "sign":
            media.append('   <div id="s%d-doodle" class="clip doodle" data-layout-ignore data-start="%s" data-duration="%s" data-track-index="5">\n      %s\n   </div>\n'
                         % (i, start, dur, DOODLE_SIGN % ("s%d" % i, "s%d" % i, "s%d" % i)))
        if p.get("doodle") == "runner":
            media.append('   <div id="s%d-doodle" class="clip doodle" data-layout-ignore data-start="%s" data-duration="%s" data-track-index="5">\n      %s\n   </div>\n'
                         % (i, start, dur, DOODLE_RUNNER % ("s%d" % i, "s%d" % i, "s%d" % i)))
        overlay.append('  <div id="s%d-bar" class="clip bar" data-layout-allow-overflow data-start="%s" data-duration="%s" data-track-index="1">510 / 黑历史发布会<span>%s</span></div>\n'
                       % (i, start, dur, esc(p.get("label", ""))))
        if p.get("replay"):
            overlay.append('  <div id="s%d-badge" class="clip badge" data-start="%s" data-duration="%s" data-track-index="5">↶ 再确认一遍</div>\n'
                           % (i, start, dur))
        overlay.append('  <div id="s%d-cap" class="clip cap" data-start="%s" data-duration="%s" data-track-index="4">%s</div>\n'
                       % (i, start, dur, esc(p["caption"])))
        overlay.append('  <div id="s%d-foot" class="clip foot" data-start="%s" data-duration="%s" data-track-index="6">BIRTHDAY EDITION / 当事人请勿离场</div>\n'
                       % (i, start, dur))

    out.append("".join(media))
    out.append("  </div>\n")
    out.append("".join(overlay))

    for k, (ms, dur) in enumerate(MUSIC_SEGMENTS):
        out.append('  <audio id="mus%d" data-start="%s" data-duration="%s" data-media-start="0" data-track-index="9" data-volume="0.16" src="assets/birthday-loop.wav"></audio>\n'
                   % (k, ms, dur))
    for k, (ms, idx) in enumerate([(0, 0), (19, 1), (42, 2), (66, 3)]):
        out.append('  <audio id="auxa%d" data-start="%s" data-duration="6" data-media-start="%s" data-track-index="8" data-volume="0.50" src="assets/motion-v2.mp4"></audio>\n'
                   % (k, ms, idx * 6))
    for k, (ms, name) in enumerate(SFX):
        out.append('  <audio id="sfx%d" data-start="%s" data-duration="0.6" data-media-start="0" data-track-index="7" data-volume="0.22" src="assets/%s.wav"></audio>\n'
                   % (k, ms, name))

    out.append(TAIL.replace("__SCENES__", json.dumps(js)))
    html = "".join(out)
    with open(OUT, "w", encoding="utf-8") as fh:
        fh.write(html)
    print("wrote", OUT, len(html), "chars,", len(SCENES), "scenes")


if __name__ == "__main__":
    build()
