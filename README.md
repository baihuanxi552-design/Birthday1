# 510 黑历史发布会

本地生日网站，黑黄红发布会风格。包含 19 张照片、完整原视频、复读篇、帅照两秒反转、四段剪纸动画插播和生日收尾；短片为 **74 秒**。**站点直接播放 HyperFrames 版成片**，Remotion 版保留为备份。

## 线上地址（GitHub Pages）

- 站点：https://baihuanxi552-design.github.io/Birthday1/
- 仓库：https://github.com/baihuanxi552-design/Birthday1
- 部署方式：推到 `main` 后由 `.github/workflows/deploy.yml` 自动构建并发布；项目页在子路径下，构建时用 `SITE_BASE=/Birthday1/` 生成资源路径。

## 启动

- 本地成品预览：http://localhost:4173/ （双击「预览成品.cmd」可重新启动，窗口弹出后以窗口里的 Local 地址为准）
- 同一局域网手机：http://192.168.2.61:4173/ ，电脑和服务须保持运行；真机和防火墙连通尚未实测。
- 开发：`npm run dev`；构建：`npm run build`；Remotion 短片编辑预览：`npm run studio`。
- 不要直接双击 dist/index.html；使用 HTTP 预览。

## 成片（主用 HyperFrames 版）

两版都是 1080×1440、30fps、74.0 秒、H.264 + AAC，镜头表和文案完全一致。

| 用途 | 文件 | 渲染链路 | 大小 |
| --- | --- | --- | --- |
| **主交付 / 站点播放** | `outputs/birthday-510-hyperframes-74s.mp4`，站点内为 `public/assets/film-510.mp4` | HyperFrames CLI（`hyperframes-film/`，HTML+GSAP） | 29.1 MB |
| 备份 / 对照 | `outputs/birthday-510-motion-v2.mp4` | 项目内 Remotion 组合（`src/Film.jsx` + `scripts/render-film.mjs`） | 14.9 MB |

对比抽帧（同一组时间点各 12 帧）：`verification/compare/compare-both.png`（上 Remotion / 下 HyperFrames）。

更新站点成片：重新渲染 HyperFrames 后，把 `hyperframes-film/renders/510-hyperframes-74s.mp4` 覆盖到 `public/assets/film-510.mp4` 并重新 `npm run build`。

重新渲染：

```bash
# Remotion 版（需要 Chromium；这里用本机 Playwright 的 Chromium）
set BIRTHDAY_CHROME=C:\Users\ASUS\AppData\Local\ms-playwright\chromium-1243\chrome-win64\chrome.exe
"C:\Users\ASUS\.workbuddy-ai\binaries\node\versions\22.22.2-6\node.exe" scripts\render-film.mjs outputs\birthday-510-motion-v2.mp4

# HyperFrames 版
cd hyperframes-film
npx hyperframes render --quality high --output renders\510-hyperframes-74s.mp4
```

## 使用与内容

首页「开始公开处刑」开启声音，也可静音入场。74 秒短片手动播放，支持暂停、拖动、全屏及重播。照片支持分类、大图、原图、键盘切换和 Esc 关闭。

「给我看点帅的」先展示西装照最右侧的 510，两秒后切歪头抓拍；减少动态模式下手动揭晓。关闭按钮始终可用。「今天就放过我」揭晓生日结尾，仅庆祝一次。

复读篇明确交代正在复读，使用 2026 年 8 月 19 日探望学校的蓝伞校门照片。未编造成绩、复读原因或对话。生日为 10 月 18 日，不显示年龄。末尾只写「生日快乐！」。

完整原片默认静音，开启原声时背景音乐暂停。页面隐藏时暂停媒体，返回后需手动恢复音乐和短片。

## 制作

- `Opening.jsx`：HTML/GSAP 开场，带 composition 元数据及注册时间线。
- `FilmPlayer.jsx`：站点短片播放器，直接播 `public/assets/film-510.mp4`（HyperFrames 成片）与封面图，暴露 `pause/play/seekTo/mute/unmute`；声音开关与弹窗打开时同步静音或暂停。
- `Film.jsx`：28 段显式 Remotion 场景，共 2220 帧、30fps、1080×1440，即 74 秒；仅用于重出 Remotion 备份版，站点不再内嵌 Remotion Player。
- `motion-v2/`：Claude Motion 剪纸动画素材，24 秒（四段各 6 秒，720×960、30fps、含配乐）。成品 `public/assets/motion-v2.mp4` 供 Remotion 版引用；`motion-v2/scene.js`、`art.js` 是可编辑源码。
- `hyperframes-film/`：主渲染工程。`build_film.py` 以与 `Film.jsx` 相同的分镜表生成 `index.html`（HTML 片段 + GSAP 时间线），`npx hyperframes lint/check/render` 校验并出片。
- `Doodle.jsx`（Remotion 版）与 `hyperframes-film` 的内联 SVG（HyperFrames 版）：举牌小人、回放放大镜、书包跑者等手绘风动画，按帧计算。
- 音乐为本地合成 120BPM、16 秒原创无歌词循环，另有 3 段短音效。短片在开场、更正、复读和回放节点添加提示音。
- 19 张原图及视频完整保存在 `public/originals`；展示版和缩略图在 `public/assets`。两张补图已改用 `D:\Downloads\XiaoAi\510` 内的永久来源。
- 站点构建产物不再包含 Remotion 引擎（原 828 kB 分块已移除）。
- 运行时无需远程图片、字体或音乐。未发布公网，未写 NFC。

## 验证与备份

- 站点交互：`scripts/verify-motion-v2.cjs`（Playwright）覆盖 74 秒标签、19 张照片、静音入场、成片时长 74.00 秒、声音开关、弹窗暂停成片、页脚重播归零、相册切换/Esc、生日收尾、390px 手机宽度；结果见 `verification/motion-v2-site/website-checks.json` 与同目录截图。
- HyperFrames 版：`npx hyperframes lint` 0 错误，`npx hyperframes check` 通过（含 WCAG 对比度检查）。
- 素材与 HTTP：`scripts/verify_assets.py` 校验原件 SHA-256、图片比例、音频非静音且不削波；`scripts/verify_http.py` 检查生产预览资源。
- 改版前完整备份（不含 node_modules）：`D:\Codex projects\项目1\birthday-510-before-roast-20261017-223620`。

构建仍有 Remotion 的 use-client 忽略提示和视频引擎分块体积提示，不影响预览。真实手机、扬声器主观听感、系统减少动态切换和 NFC 尚未实测。
