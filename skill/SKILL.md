---
name: english-speaking-coach
description: "Use when coaching spoken English with voice answers."
version: 2.1.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [language-learning, speaking, tts, stt, desktop-plugins]
    related_skills: [hermes-agent]
---

# English Speaking Coach

Coach spoken English as a Duolingo-style loop: one prompt, a few vocab cards,
model sentence, then the user answers BY VOICE. Reply to the user in Traditional Chinese;
keep coaching turns short.

題庫（跟桌面版 pane 共用）：
- `lessons/lessons.json` — 自編 12 課（A1–B1 文法）
- `lessons/voa-level1.json` — VOA 72 題（原文逐字＋中文＋文法＋單字卡＋原音檔）
- `lessons/scenarios.json` — 情境對話（餐廳/面試/機場/診所）
- `lessons/placement.json` — 分級測驗 8 題；`lessons/mistakes.json` — 錯題本

## When to Use

- User wants to practise spoken English / conversation with prompts and vocab cards.
- User wants to answer by voice on chat or the Hermes desktop app.

## Procedure

1. First session: run the placement quiz (`placement.json`, 8 questions).
   0–2 → start at A1; 3–5 → A2; 6–8 → B1.
2. Present the round in this shape, in this order: question (EN + zh) → grammar rule
   in one line → 3–4 vocab cards as `en / IPA / zh` → one model sentence.
3. Present rounds as text by default; generate TTS audio only when the user asks
   for it — per-round auto audio stalls the loop. The pane's 🔊 buttons cover
   on-demand listening. Never present a round with no model sentence.
4. Instruct the loop explicitly: read the round, then answer by voice. No forced
   read-aloud drill before or after answering — repetition comes from follow-up
   questions, not from repeating the model sentence.
5. On the user's answer, correct grammar + wording briefly from the transcript,
   then ask 1–2 follow-up questions on the same topic (reusing learned patterns)
   before offering the next round — advance only when the user answers. STT yields text only, so never claim to
   have heard their pronunciation — pronunciation tips stay generic (common
   pitfalls for the pattern), never 'I heard you say X'. One round per turn;
   wait for the reply (gate-based).
6. Log errors to `mistakes.json` (wrong/fixed/point, reviewed: 0). Every 5 rounds,
   review one mistake entry (lowest reviewed first); daily sessions open with
   2 mistake reviews before new material.
7. For Hermes desktop delivery, ship the same content as a practice pane (see
   `references/desktop-practice-pane.md`) so cards are clickable and the answer
   goes through the main chat microphone (STT).

## Rules

- One grammar point and one question per turn — stacking rounds kills the speaking loop.
- Every vocab card carries IPA + zh; a bare word list is not a card.
- TTS speed stays slow for learners; default rate is too fast for shadowing.
- Voice answers are transcribed (STT), never assumed heard; correct from the transcript.
- Desktop pane never submits prompts itself; it copies the prompt to the clipboard
  and the user pastes it into the main chat, because prompt-submit RPC varies by backend.
- If a choice question to the user goes unanswered, proceed with the recommended
  default and say so — a stalled loop teaches nothing.
- Bank new material only from `references/open-content-sources.md` — match the license
  to the use (link vs copy into repo).
