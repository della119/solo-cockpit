# Solo Operator Cockpit

A research toolkit for one-person companies. Five modes powered by a real-time web search + LLM stack, wrapped in a clean React UI.

**Live demo:** https://solo-cockpit.onrender.com

---

## What it does

| Mode | Input | Output |
|------|-------|--------|
| **Daily Briefing** | Your topic list | Signals, trends, and what changed today |
| **Signal Harvester** | A topic or keyword | Hot topics, pain points, and actionable angles |
| **Opportunity Miner** | A niche or market | Ranked opportunities with demand evidence |
| **Operator Radar** | A space (e.g. "dev tools") | Real solo operators — products, revenue models, gaps |
| **Idea Validator** | A business idea | GO / NO-GO / PIVOT with hard questions |

Every run searches the web first (via Tavily), then sends fresh results to the LLM. No stale training data.

---

## Stack

```
Frontend   React + TypeScript + Vite + Tailwind CSS
Backend    Node.js / Express proxy
LLM        Aliyun DashScope — Qwen3.6-plus (OpenAI-compatible endpoint)
Search     Tavily API (real-time web results injected into every prompt)
Deploy     Render (single web service, Express serves built frontend + API)
```

---

## Run locally

**Prerequisites:** Node.js 18+, a [DashScope API key](https://dashscope.console.aliyun.com), a [Tavily API key](https://tavily.com) (free tier: 1000/month)

```bash
git clone https://github.com/della119/solo-cockpit.git
cd solo-cockpit/app

cp .env.example .env
# Edit .env — fill in your ANTHROPIC_API_KEY and TAVILY_API_KEY

npm install
npm run dev
```

Opens at **http://localhost:5173**. The `dev` script runs Vite (UI) + Express (API proxy) concurrently.

**Windows one-click:** double-click `run.bat` — installs deps on first run, starts both servers, opens the browser.

---

## Environment variables

Copy `app/.env.example` to `app/.env` and fill in:

```env
ANTHROPIC_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode
ANTHROPIC_API_KEY=sk-your-dashscope-key-here
TAVILY_API_KEY=tvly-your-tavily-key-here

# Optional tuning
RATE_LIMIT_PER_HOUR=30      # per-IP hourly cap (localhost exempt)
MAX_DAILY_REQUESTS=200       # global daily warning threshold
IP_DAILY_LIMIT=0             # set to 5 for public demo deployments
PORT=3001
```

---

## Deploy to Render

The repo includes a `render.yaml` — Render picks it up automatically.

1. New → Web Service → connect this repo
2. Render auto-fills: root dir `app`, build `npm install && npm run build`, start `npm start`
3. Add three env vars in the Render dashboard (do **not** commit real keys):
   - `ANTHROPIC_BASE_URL`
   - `ANTHROPIC_API_KEY`
   - `TAVILY_API_KEY`
4. Set `IP_DAILY_LIMIT=5` if you want per-IP daily rate limiting for a public demo

Every `git push` to main triggers an automatic redeploy.

> **Note:** Render free tier sleeps after 15 min of inactivity (30–60s cold start). The app pings `/api/health` on load to warm up the server before the user's first query. Upgrade to Starter ($7/mo) to keep it always-on.

---

## Project layout

```
solo-cockpit/
├── CLAUDE.md              Claude Code project instructions
├── topics.md              Daily briefing topic list (edit to customize)
├── prompts/               Prompt templates for each mode
│   ├── signal-harvester.md
│   ├── opportunity-miner.md
│   ├── daily-briefing.md
│   └── idea-validator.md
├── outputs/               Research outputs saved here (gitignored)
├── render.yaml            Render deployment config
└── app/                   Web application
    ├── server/
    │   └── index.mjs      Express proxy (Tavily injection + rate limiting)
    └── src/
        ├── App.tsx         Five-mode UI + history + i18n (EN/ZH)
        └── CoverPage.tsx   Landing page
```

---

## Rate limiting

The proxy has two layers of protection:

- **Per-IP hourly limit** — `RATE_LIMIT_PER_HOUR` (default 30), via `express-rate-limit`
- **Per-IP daily limit** — `IP_DAILY_LIMIT` (default off), in-memory counter, resets at midnight
- **localhost is always exempt** from both limits

---

## License

MIT
