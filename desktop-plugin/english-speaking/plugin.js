/**
 * English Speaking Practice — Duolingo-style pane (v2)
 * id: english-speaking (folder name must match)
 * Tabs: 自編文法課 / VOA 跟讀 (fetched from GitHub, cached) / 情境對話
 */

import { host, Tip, usePluginI18n } from '@hermes/plugin-sdk'
import { useEffect, useState } from 'react'
import { jsx, jsxs } from 'react/jsx-runtime'

const ID = 'english-speaking'
const VOA_URL =
  'https://raw.githubusercontent.com/Minasemaoking/english-speaking-coach/main/lessons/voa-level1.json'
const VOA_CACHE_KEY = 'english-speaking.voa.v1'

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

const SCENARIOS = [
  {
    title: '餐廳點餐',
    zh: '你在餐廳。點餐並問菜單。',
    lines: ['A table for two, please.', 'Can I see the menu?', 'I would like the chicken.'],
  },
  {
    title: '打工面試',
    zh: '咖啡店打工面試。',
    lines: ['Tell me about yourself.', 'I am good at talking to people.', 'I can work weekend shifts.'],
  },
  {
    title: '機場旅遊',
    zh: '在機場。問路跟求助。',
    lines: ['Where is gate twelve?', 'Here is my boarding pass.', 'My luggage is lost.'],
  },
  {
    title: '看醫生',
    zh: '在診所。描述症狀。',
    lines: ['I have a headache.', 'It started three days ago.', 'I do not have a fever.'],
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

function playUrl(url) {
  try {
    const a = new Audio(url)
    a.play().catch(() => speak('Audio failed, use the text instead'))
  } catch (e) {
    host.notify({ kind: 'error', message: '音檔播不出來' })
  }
}

async function lookup(word) {
  // Free Dictionary API: phonetic + audio + example. Graceful fallback to TTS.
  const first = (word.toLowerCase().match(/[a-z']+/) || [''])[0]
  if (!first) return speak(word)
  try {
    const r = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + first)
    if (!r.ok) return speak(word)
    const d = await r.json()
    const entry = d[0] || {}
    const ph = entry.phonetic || (entry.phonetics || []).map((p) => p.text).find(Boolean) || ''
    const au = (entry.phonetics || []).map((p) => p.audio).find(Boolean) || ''
    const ex =
      ((entry.meanings || [])[0] || {}).definitions?.[0]?.example || ''
    host.notify({ kind: 'info', message: `${word} ${ph}${ex ? ' — e.g. ' + ex : ''}` })
    if (au) playUrl(au)
    else speak(word)
  } catch (e) {
    speak(word)
  }
}

const BTN =
  'rounded border border-(--ui-stroke-secondary) px-2 py-1 text-xs hover:bg-(--chrome-action-hover)'

function LessonCard({ lesson }) {
  const t = usePluginI18n(ID)
  const copyPrompt = async () => {
    const text = `請考我這題英文口說：${lesson.q}（${lesson.qZh}）。文法：${lesson.grammar}。我會用語音回答，請聽完幫我改文法跟發音。`
    try {
      await navigator.clipboard.writeText(text)
      host.notify({ kind: 'success', message: t('copied') })
    } catch (e) {
      host.notify({ kind: 'error', message: '複製失敗' })
    }
  }
  const src = lesson.source || {}
  return jsxs('div', {
    className: 'flex flex-col gap-2',
    children: [
      jsx('div', {
        className: 'text-xs text-(--ui-text-tertiary)',
        children: `${lesson.title || ''}${lesson.level ? ' · ' + lesson.level : ''}`,
      }),
      lesson.q ? jsx('div', { className: 'font-medium', children: lesson.q }) : null,
      lesson.qZh
        ? jsx('div', { className: 'text-xs text-(--ui-text-tertiary)', children: lesson.qZh })
        : null,
      lesson.grammar
        ? jsx('div', { className: 'text-xs', children: `文法：${lesson.grammar}` })
        : null,
      src.lesson
        ? jsx('div', {
            className: 'text-[11px] text-(--ui-text-quaternary)',
            children: `出處：VOA ${src.lesson}（public domain）`,
          })
        : null,
      jsxs('div', {
        className: 'flex flex-wrap gap-1.5',
        children: [
          lesson.answer
            ? jsx('button', {
                type: 'button',
                className: BTN,
                onClick: () => speak(lesson.answer),
                children: '🔊 跟讀',
              })
            : null,
          src.audio
            ? jsx('button', {
                type: 'button',
                className: BTN,
                onClick: () => playUrl(src.audio),
                children: '🎧 VOA 原音',
              })
            : null,
          lesson.q
            ? jsx('button', {
                type: 'button',
                className: 'rounded bg-(--ui-accent) px-2 py-1 text-xs',
                onClick: copyPrompt,
                children: '✋ 用這題問我',
              })
            : null,
        ].filter(Boolean),
      }),
      lesson.answer
        ? jsx('div', {
            className: 'rounded bg-(--chrome-action-hover) p-2 text-xs',
            children: `例句：${lesson.answer}`,
          })
        : null,
      jsx('div', { className: 'mt-1 text-xs font-medium', children: '單字卡（點查字典＋發音）：' }),
      jsxs('div', {
        className: 'flex flex-col gap-1.5',
        children: (lesson.cards || []).map((c) =>
          jsx(
            'button',
            {
              type: 'button',
              onClick: () => lookup(c.en),
              className:
                'rounded border border-(--ui-stroke-secondary) p-2 text-left hover:bg-(--chrome-action-hover)',
              children: jsxs('div', {
                children: [
                  jsx('div', { className: 'font-medium', children: c.en }),
                  jsx('div', {
                    className: 'text-xs text-(--ui-text-tertiary)',
                    children: `${c.ipa ? c.ipa + ' · ' : ''}${c.zh}`,
                  }),
                ],
              }),
            },
            c.en
          )
        ),
      }),
    ].filter(Boolean),
  })
}

function PracticePane() {
  const [tab, setTab] = useState('basic')
  const [idx, setIdx] = useState(0)
  const [voa, setVoa] = useState(null)
  const [voaState, setVoaState] = useState('idle') // idle|loading|ready|error
  const [sIdx, setSIdx] = useState(0)

  useEffect(() => {
    if (tab !== 'voa' || voa) return
    try {
      const cached = window.localStorage.getItem(VOA_CACHE_KEY)
      if (cached) {
        setVoa(JSON.parse(cached))
        setVoaState('ready')
        return
      }
    } catch (e) {}
    setVoaState('loading')
    fetch(VOA_URL)
      .then((r) => {
        if (!r.ok) throw new Error('http ' + r.status)
        return r.json()
      })
      .then((d) => {
        setVoa(d)
        setVoaState('ready')
        try {
          window.localStorage.setItem(VOA_CACHE_KEY, JSON.stringify(d))
        } catch (e) {}
      })
      .catch(() => setVoaState('error'))
  }, [tab])

  const tabs = [
    ['basic', '文法課'],
    ['voa', 'VOA 跟讀'],
    ['scenario', '情境'],
  ]

  let body = null
  if (tab === 'basic') {
    const lesson = LESSONS[idx]
    body = jsxs('div', {
      children: [
        jsx(LessonCard, { lesson }),
        jsxs('div', {
          className: 'mt-2 flex gap-1.5',
          children: [
            jsx('button', {
              type: 'button',
              className: BTN,
              onClick: () => setIdx((idx + LESSONS.length - 1) % LESSONS.length),
              children: '← 上一題',
            }),
            jsx('button', {
              type: 'button',
              className: BTN,
              onClick: () => setIdx((idx + 1) % LESSONS.length),
              children: '下一題 →',
            }),
          ],
        }),
      ],
    })
  } else if (tab === 'voa') {
    if (voaState === 'loading' || voaState === 'idle')
      body = jsx('div', { className: 'text-xs', children: '載入 VOA 題庫中…' })
    else if (voaState === 'error' || !voa)
      body = jsx('div', {
        className: 'text-xs',
        children: '載入失敗（需連網）。先練文法課，連網後重開 pane 自動載入。',
      })
    else {
      const lesson = voa[idx % voa.length]
      body = jsxs('div', {
        children: [
          jsx('div', {
            className: 'mb-2 text-xs text-(--ui-text-tertiary)',
            children: `${(idx % voa.length) + 1} / ${voa.length} · VOA Level 1`,
          }),
          jsx(LessonCard, { lesson }),
          jsxs('div', {
            className: 'mt-2 flex gap-1.5',
            children: [
              jsx('button', {
                type: 'button',
                className: BTN,
                onClick: () => setIdx((idx + voa.length - 1) % voa.length),
                children: '← 上一題',
              }),
              jsx('button', {
                type: 'button',
                className: BTN,
                onClick: () => setIdx((idx + 1) % voa.length),
                children: '下一題 →',
              }),
            ],
          }),
        ],
      })
    }
  } else {
    const s = SCENARIOS[sIdx]
    body = jsxs('div', {
      className: 'flex flex-col gap-2',
      children: [
        jsx('div', { className: 'font-medium', children: s.title }),
        jsx('div', {
          className: 'text-xs text-(--ui-text-tertiary)',
          children: s.zh,
        }),
        jsxs('div', {
          className: 'flex flex-col gap-1.5',
          children: s.lines.map((l) =>
            jsx(
              'button',
              { type: 'button', className: BTN + ' text-left', onClick: () => speak(l), children: `🔊 ${l}` },
              l
            )
          ),
        }),
        jsxs('div', {
          className: 'mt-2 flex gap-1.5',
          children: [
            jsx('button', {
              type: 'button',
              className: BTN,
              onClick: () => setSIdx((sIdx + SCENARIOS.length - 1) % SCENARIOS.length),
              children: '← 上個情境',
            }),
            jsx('button', {
              type: 'button',
              className: BTN,
              onClick: () => setSIdx((sIdx + 1) % SCENARIOS.length),
              children: '下個情境 →',
            }),
          ],
        }),
      ],
    })
  }

  return jsxs('div', {
    className: 'flex h-full flex-col gap-2 overflow-y-auto p-3 text-sm',
    children: [
      jsxs('div', {
        className: 'flex gap-1.5',
        children: tabs.map(([k, label]) =>
          jsx(
            'button',
            {
              type: 'button',
              className:
                k === tab
                  ? 'rounded bg-(--ui-accent) px-2 py-1 text-xs'
                  : BTN,
              onClick: () => {
                setTab(k)
                setIdx(0)
              },
              children: label,
            },
            k
          )
        ),
      }),
      body,
      jsx(Tip, {
        label: '在主對話按麥克風用語音回答，我會自動轉寫並幫你改',
        children: jsx('div', {
          className: 'mt-auto text-[11px] text-(--ui-text-quaternary)',
          children: 'ⓘ 在主對話按麥克風回答',
        }),
      }),
    ],
  })
}

export default {
  id: ID,
  name: 'English Speaking',
  register(ctx) {
    ctx.i18n.register({
      en: {
        copied: 'Prompt copied — paste it in chat, then answer by voice!',
        paneTitle: 'English Speaking',
      },
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
