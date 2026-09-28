# Open content sources for question banks

Reliability and repo-usability trade off: professionally edited sources are usually
link-only (copyrighted); public-domain and CC sources can be copied into a repo.
Pick by use first, then by reliability.

## Copy into a repo (verified this library)

- **VOA Learning English** — US-government public domain; graded Level 1–3 courses
  with transcripts + audio. Best repo-usable dialogue source.
  Course index lives at `learningenglish.voanews.com/p/5644.html`; lessons match
  `/a/lets-learn-english-*.html`. Fetch pages with curl + a browser User-Agent
  and ~2s between requests; take 3–5 short sentences per lesson and note the lesson
  number as attribution. Lesson audio is the mp3 link in each page's media-download
  block (`voa-audio.voanews.eu`); attach the first as `source.audio` on each bank entry.
- **Tatoeba search API** — `tatoeba.org/en/api_v0/search?from=cmn&to=eng&query=<term>&limit=N`
  returns zh–en sentence pairs under CC BY 2.0 FR (attribute in the bank file).
  Community-contributed: run every candidate through a human filter pass before banking.
- **Free Dictionary API** — `api.dictionaryapi.dev/api/v2/entries/en/<word>`, no key.
  Returns phonetics, UK/US mp3 audio URLs, definitions, examples, synonyms.
  Prefer its audio + IPA over hand-written phonetics on vocab cards.

## Link only (reliable, copyrighted — never bulk-copy)

- **British Council LearnEnglish speaking** (A1–C1, video + phrases per lesson).
- **Cambridge sample papers** (A2 Key / B1 Preliminary speaking).
- Free teacher PDFs (e.g. TEFL Lessons conversation questions) — check each file's terms.

## Rules

- Verify the license before content enters a repo; when unsure, link instead of copying.
- Attribute CC sources in the bank file itself, not just in chat.
- Probe each API with one curl before building on it; endpoints drift and keyless
  extractors fail on some hosts.
- Match dialogue patterns against the whole fetched document before narrowing scope —
  an assumed-early landmark tag can sit above the content and silently zero the result.
- Bank at volume by fanning curation across parallel workers with disjoint id ranges
  and one chunk file each; merge and verify every chunk before it enters the bank.
- Normalize Unicode punctuation (curly quotes, ellipsis, dashes) before matching
  banked answers against source transcripts — otherwise verbatim checks false-fail
  on punctuation the author never changed.
- If bulk enrichment fails from the run host (e.g. batch IPA fill unreachable),
  bank with the field empty and enrich at read time (pane looks it up live) —
  never gate the release on enrichment.
