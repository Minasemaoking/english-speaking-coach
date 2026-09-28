# English Speaking Coach

像多鄰國，但用**說的**回答的英文口說練習。跑在 Hermes 桌面版上。

- 左邊 pane：題目＋中文＋文法點＋單字卡（點卡片查字典＋發音）
- 主對話：按麥克風用語音回答，Agent 自動轉寫並改文法跟發音
- 12 堂自編文法課（A1–B1）＋ 72 題 VOA 跟讀（原音＋逐字稿，public domain）＋ 4 情境對話

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

- `desktop-plugin/english-speaking/plugin.js` — 桌面版練習 pane（三個分頁）
- `lessons/lessons.json` — 自編 12 課（A1–B1）
- `lessons/voa-level1.json` — VOA Let's Learn English Level 1，72 題（原文逐字＋中文＋文法＋單字卡＋原音檔）
- `lessons/placement.json` — 分級測驗 8 題
- `lessons/scenarios.json` — 情境對話（餐廳/面試/機場/診所）
- `lessons/mistakes.json` — 錯題本格式
- `skill/SKILL.md` — 家教流程 v2：分級、錯題本、每日複習
- `docs/PRODUCT.md` — 產品規劃完整版
- `docs/SETUP.md` — STT/TTS 設定

## 題庫來源與授權

- 自編：本 repo，MIT
- VOA Let's Learn English：美國政府 public domain，每題註明出處課號，答案逐字未改
- 單字發音：pane 即時查 Free Dictionary API（CC 授權發音檔）＋系統 TTS

## Roadmap

- v1：3 堂課＋手動下一題（已發布）
- v2：12 課＋VOA 72 題＋分級測驗＋錯題本＋每日複習（現在）
- v3：發音評分＋學習曲線統計
