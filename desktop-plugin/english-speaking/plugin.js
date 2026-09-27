/**
 * English Speaking Practice — Duolingo-style pane
 * id: english-speaking (folder name must match)
 */

import { host, Tip, usePluginI18n } from '@hermes/plugin-sdk'
import { useState } from 'react'
import { jsx, jsxs } from 'react/jsx-runtime'

const ID = 'english-speaking'

const LESSONS = [
  {
    title: '現在簡單式 · 日常習慣',
    grammar: '第三人稱單數加 s：I go → She goes',
    q: 'What does she do every day?',
    qZh: '她每天做什麼？',
    answer: 'She goes to work every day.',
    cards: [
      { en: 'goes to work', ipa: '/ɡoʊz tuː wɝːk/', zh: '去上班' },
      { en: 'drinks coffee', ipa: '/drɪŋks ˈkɑːfi/', zh: '喝咖啡' },
      { en: 'watches TV', ipa: '/ˈwɑːtʃɪz ˌtiːˈviː/', zh: '看電視' },
      { en: 'every day', ipa: '/ˈevri deɪ/', zh: '每天' },
    ],
  },
  {
    title: '過去式 · 昨天做了什麼',
    grammar: '過去式：go → went，watch → watched',
    q: 'What did you do yesterday?',
    qZh: '你昨天做了什麼？',
    answer: 'I watched a movie yesterday.',
    cards: [
      { en: 'yesterday', ipa: '/ˈjes.tɚ.deɪ/', zh: '昨天' },
      { en: 'went shopping', ipa: '/went ˈʃɑː.pɪŋ/', zh: '去購物' },
      { en: 'watched a movie', ipa: '/wɑːtʃt ə ˈmuː.vi/', zh: '看電影' },
      { en: 'stayed home', ipa: '/steɪd hoʊm/', zh: '待在家' },
    ],
  },
  {
    title: '現在進行式 · 正在做什麼',
    grammar: 'be + V-ing：I am eating',
    q: 'What are you doing now?',
    qZh: '你現在在做什麼？',
    answer: 'I am cooking dinner now.',
    cards: [
      { en: 'cooking dinner', ipa: '/ˈkʊkɪŋ ˈdɪnɚ/', zh: '煮晚餐' },
      { en: 'reading a book', ipa: '/ˈriːdɪŋ ə bʊk/', zh: '看書' },
      { en: 'taking a walk', ipa: '/ˈteɪkɪŋ ə wɑːk/', zh: '散步' },
      { en: 'right now', ipa: '/raɪt naʊ/', zh: '現在' },
    ],
  },
]

function speak(text) {
  try {
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-US'
    u.rate = 0.85
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
  } catch (e) {
    host.notify({ kind: 'error', message: 'TTS 不可用：' + String(e) })
  }
}

function PracticePane() {
  const t = usePluginI18n(ID)
  const [idx, setIdx] = useState(0)
  const lesson = LESSONS[idx]

  const copyPrompt = async () => {
    const text = `請考我這題英文口說：${lesson.q}（${lesson.qZh}）。文法：${lesson.grammar}。我會用語音回答，請聽完幫我改文法跟發音。`
    try {
      await navigator.clipboard.writeText(text)
      host.notify({ kind: 'success', message: t('copied') })
    } catch (e) {
      host.notify({ kind: 'error', message: '複製失敗' })
    }
  }

  return jsxs('div', {
    className: 'flex h-full flex-col gap-2 overflow-y-auto p-3 text-sm',
    children: [
      jsx('div', { className: 'text-xs text-(--ui-text-tertiary)', children: `${idx + 1} / ${LESSONS.length} · ${lesson.title}` }),
      jsx('div', { className: 'font-medium', children: lesson.q }),
      jsx('div', { className: 'text-xs text-(--ui-text-tertiary)', children: lesson.qZh }),
      jsx('div', { className: 'text-xs', children: `文法：${lesson.grammar}` }),
      jsxs('div', {
        className: 'flex gap-1.5',
        children: [
          jsx('button', {
            type: 'button',
            className: 'rounded border border-(--ui-stroke-secondary) px-2 py-1 text-xs hover:bg-(--chrome-action-hover)',
            onClick: () => speak(lesson.q),
            children: '🔊 聽題目',
          }),
          jsx('button', {
            type: 'button',
            className: 'rounded border border-(--ui-stroke-secondary) px-2 py-1 text-xs hover:bg-(--chrome-action-hover)',
            onClick: () => speak(lesson.answer),
            children: '🔊 聽例句',
          }),
          jsx('button', {
            type: 'button',
            className: 'rounded bg-(--ui-accent) px-2 py-1 text-xs',
            onClick: copyPrompt,
            children: '✋ 用這題問我',
          }),
        ],
      }),
      jsx('div', { className: 'mt-1 text-xs font-medium', children: '單字卡（點卡片可發音）：' }),
      jsxs('div', {
        className: 'flex flex-col gap-1.5',
        children: lesson.cards.map((c) =>
          jsx(
            'button',
            {
              type: 'button',
              onClick: () => speak(c.en),
              className: 'rounded border border-(--ui-stroke-secondary) p-2 text-left hover:bg-(--chrome-action-hover)',
              children: jsxs('div', {
                children: [
                  jsx('div', { className: 'font-medium', children: c.en }),
                  jsx('div', { className: 'text-xs text-(--ui-text-tertiary)', children: `${c.ipa} · ${c.zh}` }),
                ],
              }),
            },
            c.en
          )
        ),
      }),
      jsx('div', {
        className: 'rounded bg-(--chrome-action-hover) p-2 text-xs',
        children: `例句：${lesson.answer}（先跟讀 3 次，再按麥克風用說的回答）`,
      }),
      jsxs('div', {
        className: 'mt-auto flex gap-1.5 pt-2',
        children: [
          jsx('button', {
            type: 'button',
            className: 'rounded border border-(--ui-stroke-secondary) px-2 py-1 text-xs hover:bg-(--chrome-action-hover)',
            onClick: () => setIdx((idx + LESSONS.length - 1) % LESSONS.length),
            children: '← 上一題',
          }),
          jsx('button', {
            type: 'button',
            className: 'rounded border border-(--ui-stroke-secondary) px-2 py-1 text-xs hover:bg-(--chrome-action-hover)',
            onClick: () => setIdx((idx + 1) % LESSONS.length),
            children: '下一題 →',
          }),
        ],
      }),
      jsx(Tip, {
        label: '在主對話按麥克風用語音回答，我會自動轉寫並幫你改',
        children: jsx('div', { className: 'text-[11px] text-(--ui-text-quaternary)', children: 'ⓘ 在主對話按麥克風回答' }),
      }),
    ],
  })
}

export default {
  id: ID,
  name: 'English Speaking',
  register(ctx) {
    ctx.i18n.register({
      en: { copied: 'Prompt copied — paste it in chat, then answer by voice!', paneTitle: 'English Speaking' },
      'zh-Hant': { copied: '已複製！貼到主對話送出，再按麥克風用說的回答', paneTitle: '英文口說練習' },
    })
    ctx.register({
      id: 'pane',
      area: 'panes',
      title: '英文口說練習',
      data: { placement: 'right', width: '300px' },
      render: () => jsx(PracticePane, {}),
    })
  },
}
