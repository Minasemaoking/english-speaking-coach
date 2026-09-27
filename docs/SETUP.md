# SETUP — 語音設定

## STT（語音→文字，你說話我聽懂）

```yaml
# ~/.hermes/config.yaml
stt:
  enabled: true
  provider: local   # local 免費 | groq | openai | mistral | elevenlabs | deepinfra
  local:
    model: base     # tiny, base, small, medium, large-v3
```

```bash
hermes config set stt.enabled true
pip install faster-whisper   # local 用
# 或 export GROQ_API_KEY=... 用 Groq（免費額度，更準）
```

## TTS（文字→語音，我說話你跟讀）

pane 內用瀏覽器 speechSynthesis（免設定）。
主對話語音回覆：

```bash
hermes config set tts.provider edge   # 免費預設，免 key
```

## 桌面版語音指令

- `/voice on` — 語音來回
- `/voice tts` — 永遠語音回覆
- `/voice off` — 關閉
