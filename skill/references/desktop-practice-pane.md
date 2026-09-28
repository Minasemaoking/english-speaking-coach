# Desktop Practice Pane

Ship the speaking loop as a Hermes desktop UI plugin when the user wants to
answer by voice on desktop.

## Procedure

1. Resolve the real home from `$HERMES_HOME` (never hardcode `~/.hermes`;
   profiles relocate it).
2. Create `$HERMES_HOME/desktop-plugins/<id>/plugin.js` where the folder name
   equals the plugin `id`. Start from the `hermes-agent` skill's
   `templates/plugin.js`.
3. Keep the plugin dependency-free and robust across backends:
   - Plain ESM with `jsx()` calls, never JSX syntax (file loads uncompiled).
   - Import only `@hermes/plugin-sdk`, `react`, `react/jsx-runtime`.
   - Pane TTS via `window.speechSynthesis` (local, no backend key needed).
   - Handoff via `navigator.clipboard.writeText` + `host.notify`; the user
     pastes into the main chat and answers on the microphone (STT).
   - Style with theme vars (`--ui-text-tertiary`, `--ui-stroke-secondary`,
     `--chrome-action-hover`), never hardcoded colors.
4. Tell the user to run `Reload desktop plugins` from Cmd+K; the pane hot-reloads
   on save.

## Shipping to GitHub as a standalone repo

1. Run `git check-ignore` on the pane path and `git remote -v` in the checkout
   first — `$HERMES_HOME` (`.hermes/`) is gitignored by design, and the checkout
   may track upstream, so the pane can never ship from there.
2. Scaffold a standalone repo: `desktop-plugin/<id>/plugin.js` + shared
   `lessons/lessons.json` (pane and tutor read the same file) + `skill/SKILL.md`
   + `docs/PRODUCT.md` + `docs/SETUP.md` + README + LICENSE.
3. `git init -b main && git add -A && git commit`, then
   `gh repo create <name> --source . --public --push`.

## Pitfalls

- Keep the plugin import surface minimal — an extra import specifier fails to
   resolve and the whole pane shows a load toast, because the desktop loader
   allows only the three documented specifiers.
- Never call prompt-submit RPC from the pane; the contract differs between local,
   remote, and cloud backends, so the clipboard handoff is the portable path.
- A push can be rejected when another session committed first — fetch, inspect the
   foreign commit, `pull --rebase`, verify the merged pane still holds both sets of
   changes, then push; never force-push a shared repo.
- Full-page reach (route + sidebar nav + palette command) is valid: `ROUTES_AREA`,
   `SIDEBAR_NAV_AREA`, `PALETTE_AREA`, and `ctx.registerMany` are all exported —
   verify against `apps/desktop/src/sdk/index.ts` before doubting a pane that uses them.
