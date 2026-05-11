# Solo Operator Cockpit — Web App

The artifact version, as a real local app. Four modes (Signal Harvester, Opportunity Miner, Daily Briefing, Idea Validator) in a single-page React UI. Backend shells out to the `claude` CLI, so usage is **covered by your Claude Max plan** — no API key needed.

## What changed from the artifact

| Artifact | This app |
|---|---|
| `window.storage` (Claude sandbox) | `localStorage` |
| Direct `fetch` to `api.anthropic.com` (keyless, sandbox-proxied) | `fetch('/api/messages')` → Express → spawns `claude -p` → OAuth session |

Your history and briefing topics persist in the browser. The `claude` CLI on your machine handles auth.

## Prerequisites

1. **Node.js 18+** (for the server)
2. **Claude Code** installed and logged in with your Max account:
   ```bash
   npm install -g @anthropic-ai/claude-code
   claude        # first run prompts a browser login
   ```
   Verify you're on Max: run `claude` interactively and check it doesn't complain about API limits.

No Anthropic API key is required.

## Setup

**Easy mode (Windows)** — just double-click `run.bat` in this folder. It installs deps on first run, starts both servers, and opens the browser for you. Keep the console window open while using the app; close it to stop.

**Manual**

```bash
cd solo-cockpit/app
npm install
npm run dev
```

(Optionally `cp .env.example .env` only if you want to change the port.)

The browser will auto-open at http://localhost:5173.

The `dev` script runs two processes via `concurrently`:
- **web** — Vite dev server on :5173 (the UI)
- **api** — Express server on :3001 (spawns the CLI)

Vite proxies `/api/*` → `:3001`, so the browser just calls `/api/messages`.

## How billing works

Each `POST /api/messages` spawns `claude -p "<prompt>" --output-format json --allowedTools WebSearch` as a subprocess. That CLI uses the OAuth token stored in your local `~/.claude/` config — which is your Max subscription. Runs count against your Max usage limits, not Console API credits.

## Usage

- **Signal Harvester** — topic → trending themes + pain points + angles
- **Opportunity Miner** — niche → ranked opportunities with signal strength
- **Daily Briefing** — set topics once (saved to localStorage), generate a 3+2+1 brief anytime
- **Idea Validator** — idea → GO / NO-GO / NEEDS-PIVOT memo
- **Deep dive** on any item expands it further
- **Export** downloads the current result as markdown
- **History** (top right) — last 50 runs, click to reload

Each run hits the web via Claude's `WebSearch` tool; expect ~15–60s per run.

## Troubleshooting

- **`claude CLI not found on PATH`** — install it: `npm install -g @anthropic-ai/claude-code`, then restart the server.
- **CLI exits with auth error** — run `claude` interactively once to complete the OAuth login.
- **`Failed to parse claude JSON output`** — occasionally the CLI streams extra output. Rerun; if persistent, check the terminal where `npm run dev` is running for the raw output.
- **Request hangs past 60s** — web_search can be slow. Server timeout is 5 min; wait it out or check the CLI subprocess isn't stuck.
- **Port 3001 in use** — change `PORT` in `.env` and update the `proxy` target in `vite.config.ts`.
- **Rate-limited by Max** — if you blast through your Max limits, you'll need to wait for the window to reset (or fall back to an API key; see below).

## Fallback to API key

If you'd rather bill through the Console (or you don't have Max), swap `server/index.mjs` back to a raw `fetch` against `api.anthropic.com/v1/messages` with an `x-api-key` header. The previous version of that file is preserved in git history; the frontend doesn't need to change.

## File layout

```
app/
├── package.json
├── vite.config.ts       # dev-proxies /api → :3001
├── tsconfig*.json
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── .env.example         # optional, only for PORT override
├── server/
│   └── index.mjs        # spawns `claude -p`
└── src/
    ├── main.tsx
    ├── App.tsx          # four-mode UI
    └── index.css
```

## Production build

```bash
npm run build     # outputs to dist/
npm run preview
```

For a real deployment, serving a per-user Max session isn't practical — you'd move to API key billing at that point.
