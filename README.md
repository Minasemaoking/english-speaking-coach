# English Speaking Coach

像多鄰國，但用**說的**回答的英文口說練習。跑在 Hermes 桌面版上。

- 左邊 pane：題目＋中文＋文法點＋單字卡（點卡片就發音）
- 主對話：按麥克風用語音回答，Agent 自動轉寫並改文法跟發音
- 3 堂 starter 課：現在簡單式、過去式、現在進行式

## 快速開始

```bash
# 1. 裝到桌面版
cp -r desktop-plugin/english-speaking ~/.hermes/desktop-plugins/
# 有 profile 的話：~/.hermes/profiles/<name>/desktop-plugins/

# 2. 開語音輸入
hermes config set stt.enabled true
# 預設本地 faster-whisper 免費；要更準就設 GROQ_API_KEY 用 Groq

# 3. 開桌面版，按 ⌘K → Reload desktop plugins
hermes desktop
```

進 pane 按「✋ 用這題問我」，貼到主對話送出，再按麥克風回答。

## 結構

- `desktop-plugin/english-speaking/plugin.js` — 桌面版練習 pane
- `lessons/lessons.json` — 題庫（可擴充）
- `skill/SKILL.md` — 家教流程：出題、聽回答、改錯、下一題
- `docs/PRODUCT.md` — 產品規劃完整版
- `docs/SETUP.md` — STT/TTS 設定

## Roadmap

- v1：3 堂課＋手動下一題（現在）
- v2：分級測驗＋錯題本＋每日複習
- v3：情境對話（餐廳、面試、旅遊）＋發音評分
