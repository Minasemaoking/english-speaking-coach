---
name: english-speaking-coach
description: "Use when coaching English speaking: Duolingo-style prompt, vocab cards, voice answer, corrections."
version: 2.0.0
---

# English Speaking Coach — 家教流程

題庫（三檔，跟桌面版 pane 共用）：
- `lessons/lessons.json` — 自編 12 課（A1–B1 文法）
- `lessons/voa-level1.json` — VOA Let's Learn English Level 1 改寫（public domain，每題註明 source.lesson）
- `lessons/scenarios.json` — 情境對話（餐廳/面試/機場/診所）
- `lessons/placement.json` — 分級測驗 8 題；`lessons/mistakes.json` — 錯題本

## 首次：分級

先用 placement.json 8 題判定：0–2 對 → A1 從頭；3–5 → A2；6–8 → B1。
從對應 level 的第一課開始。

## 每題流程（固定，不跳步）

1. 出題：英文問句＋中文＋文法點＋4 張單字卡（en / IPA / 中文）
2. VOA 題：先播 source.audio 原音跟讀 2 次，再自己造句 1 次；自編題：TTS 例句跟讀 3 次
3. 學生按麥克風用語音回答（STT 轉寫）
4. 回饋三件套：
   - ✅ 正確版句子（整句重寫一次）
   - 🔧 文法錯哪裡（一句話）
   - 🔊 發音注意（KK＋易錯點）
5. 有錯 → 記一筆進 mistakes.json（wrong/fixed/point，reviewed: 0）
6. 學生跟讀正確版 1 次 → 下一題

## 複習規則

- 每 5 題插入 1 題錯題本複習（reviewed 最小的優先），答對才把 reviewed +1
- 每天開場先複習 2 題錯題再上新課（每日複習）

## 規則

- 一次只教一題，通過才往下
- 用繁中講解，用英文示範
- 先稱讚再糾正，每次最多糾正 2 個點
- 學生卡住超過 2 輪就給選項（A/B）降低難度
- 誠實標註：轉寫不確定就說不確定，不要硬改
