// Express proxy — forwards /api/messages to an Anthropic-compatible endpoint,
// optionally enriches prompts with Tavily web search results first.
//
// .env variables:
//   ANTHROPIC_BASE_URL    defaults to https://api.anthropic.com
//   ANTHROPIC_API_KEY     your LLM provider key
//   TAVILY_API_KEY        (optional) free at tavily.com — 1000 searches/month
//   RATE_LIMIT_PER_HOUR   max LLM requests per IP per hour  (default: 30)
//   MAX_DAILY_REQUESTS    log a warning when this is exceeded (default: 200)
//   PORT                  defaults to 3001

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { rateLimit } from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_PATH  = join(__dirname, '..', 'dist');

// override:true so .env values win over any pre-existing shell env vars
dotenv.config({ override: true });

const app = express();
app.set('trust proxy', 1); // Render sits behind a reverse proxy — trust X-Forwarded-For for real client IPs
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ─── Config ──────────────────────────────────────────────────────────────────

const BASE_URL        = (process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com').replace(/\/+$/, '');
const API_KEY         = process.env.ANTHROPIC_API_KEY;
const TAVILY_KEY      = process.env.TAVILY_API_KEY || '';
const RATE_LIMIT      = parseInt(process.env.RATE_LIMIT_PER_HOUR  || '30',  10);
const DAILY_CAP       = parseInt(process.env.MAX_DAILY_REQUESTS   || '200', 10);
const IP_DAILY_LIMIT  = parseInt(process.env.IP_DAILY_LIMIT       || '0',   10); // 0 = disabled
const REQUEST_TIMEOUT_MS = 5 * 60 * 1000;

if (!API_KEY) {
  console.error('\n[solo-cockpit] Missing ANTHROPIC_API_KEY. Set it in app/.env.\n');
  process.exit(1);
}

// ─── Daily request counter ────────────────────────────────────────────────────

let _dailyCount = 0;
let _dayStart   = todayMidnight();

// Per-IP daily counter: Map<ip, {count, dayStart}>
const _ipDailyMap = new Map();

function todayMidnight() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function tickDaily() {
  const now = Date.now();
  if (now >= _dayStart + 86_400_000) {
    console.log(`[solo-cockpit] ── day reset — yesterday: ${_dailyCount} LLM requests ──`);
    _dailyCount = 0;
    _dayStart   = todayMidnight();
    _ipDailyMap.clear();
  }
  _dailyCount++;
  if (_dailyCount === DAILY_CAP) {
    console.warn(`[solo-cockpit] ⚠  daily cap reached: ${DAILY_CAP} requests today. Check usage.`);
  }
  return _dailyCount;
}

// Returns true if the IP has hit the daily limit (only enforced when IP_DAILY_LIMIT > 0)
function checkIpDailyLimit(ip) {
  if (!IP_DAILY_LIMIT) return false;
  const now = todayMidnight();
  const entry = _ipDailyMap.get(ip);
  if (!entry || entry.dayStart !== now) {
    _ipDailyMap.set(ip, { count: 0, dayStart: now });
    return false;
  }
  return entry.count >= IP_DAILY_LIMIT;
}

function tickIpDaily(ip) {
  const now = todayMidnight();
  const entry = _ipDailyMap.get(ip) || { count: 0, dayStart: now };
  entry.count++;
  entry.dayStart = now;
  _ipDailyMap.set(ip, entry);
}

// ─── Rate limiting ────────────────────────────────────────────────────────────
// Protects against runaway loops / unexpected public exposure.
// RATE_LIMIT_PER_HOUR requests per IP per rolling hour window.

const limiter = rateLimit({
  windowMs : 60 * 60 * 1000,
  max      : RATE_LIMIT,
  standardHeaders: 'draft-7',
  legacyHeaders  : false,
  message: {
    error: {
      message: `Rate limit: max ${RATE_LIMIT} requests/hour per IP. Wait a bit and try again.`,
    },
  },
  // Skip rate limit for localhost (personal use on your own machine)
  skip: (req) => {
    const ip = req.ip || '';
    return ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1';
  },
});

// ─── Tavily helpers ───────────────────────────────────────────────────────────

async function tavilySearch(query) {
  try {
    const res = await fetch('https://api.tavily.com/search', {
      method : 'POST',
      headers: { 'content-type': 'application/json' },
      body   : JSON.stringify({
        api_key     : TAVILY_KEY,
        query,
        search_depth: 'basic',
        include_answer: true,
        include_images: false,
        max_results : 7,
      }),
    });
    if (!res.ok) {
      console.warn(`[tavily] ${res.status}: ${(await res.text()).slice(0, 200)}`);
      return null;
    }
    return await res.json();
  } catch (e) {
    console.warn('[tavily] error:', e.message);
    return null;
  }
}

function buildSearchContext(data, query) {
  if (!data) return '';
  const today = new Date().toISOString().slice(0, 10);
  const lines = [`<web_search_results query="${query}" date="${today}">`];
  if (data.answer) lines.push(`<answer>${data.answer}</answer>`, '');
  const results = (data.results || []).slice(0, 6);
  if (results.length) {
    lines.push('<sources>');
    results.forEach((r, i) => {
      const snippet = (r.content || '').slice(0, 350).replace(/\n+/g, ' ');
      const date    = r.published_date ? ` [${r.published_date.slice(0, 10)}]` : '';
      lines.push(`${i + 1}. ${r.title}${date}`, `   URL: ${r.url}`, `   ${snippet}`);
    });
    lines.push('</sources>');
  }
  lines.push('</web_search_results>');
  return lines.join('\n');
}

// ─── Routes ───────────────────────────────────────────────────────────────────

app.get('/api/health', (_req, res) =>
  res.json({
    ok          : true,
    baseUrl     : BASE_URL,
    tavilyEnabled: !!TAVILY_KEY,
    rateLimitPerHour: RATE_LIMIT,
    requestsToday   : _dailyCount,
    dailyCap        : DAILY_CAP,
  })
);

app.post('/api/messages', limiter, async (req, res) => {
  req.setTimeout(REQUEST_TIMEOUT_MS);
  res.setTimeout(REQUEST_TIMEOUT_MS);

  const count = tickDaily();
  const clientIp = req.ip || '';
  const isLocalhost = clientIp === '127.0.0.1' || clientIp === '::1' || clientIp === '::ffff:127.0.0.1';
  console.log(`[req #${count}/${DAILY_CAP} today] ip=${clientIp}`);

  // Per-IP daily limit (skipped for localhost)
  if (!isLocalhost && checkIpDailyLimit(clientIp)) {
    return res.status(429).json({
      error: {
        message: `Daily limit reached: this demo allows ${IP_DAILY_LIMIT} requests per IP per day. Come back tomorrow, or self-host your own instance.`,
      },
    });
  }
  if (!isLocalhost) tickIpDaily(clientIp);

  try {
    const body = JSON.parse(JSON.stringify(req.body));

    // _search_query is our private field — read it, then delete before forwarding
    const searchQuery = body._search_query || '';
    delete body._search_query;

    if (TAVILY_KEY && searchQuery && body.messages?.length > 0) {
      console.log(`[tavily] searching: "${searchQuery.slice(0, 80)}"`);
      const tavilyData = await tavilySearch(searchQuery);
      const context    = buildSearchContext(tavilyData, searchQuery);
      if (context) {
        const firstMsg = body.messages[0];
        const original = typeof firstMsg.content === 'string'
          ? firstMsg.content
          : firstMsg.content.map(c => c.type === 'text' ? c.text : '').join('\n');
        firstMsg.content =
          'Here is fresh web search data for your research. Use these sources as primary evidence — cite specific results where relevant.\n\n' +
          context + '\n\n---\n\n' + original;
        console.log(`[tavily] injected ${(tavilyData?.results || []).length} results`);
      }
    }

    // ── Convert Anthropic-format body → OpenAI chat/completions format ──────
    const oaiMessages = [];
    if (body.system) {
      oaiMessages.push({ role: 'system', content: body.system });
    }
    for (const m of (body.messages || [])) {
      const text = typeof m.content === 'string'
        ? m.content
        : (m.content || []).map(c => c.type === 'text' ? c.text : '').join('\n');
      oaiMessages.push({ role: m.role, content: text });
    }
    const oaiBody = {
      model      : body.model,
      messages   : oaiMessages,
      max_tokens : body.max_tokens,
      temperature: body.temperature,
      stream     : false,
    };
    // Remove undefined keys
    Object.keys(oaiBody).forEach(k => oaiBody[k] === undefined && delete oaiBody[k]);

    const upstream = await fetch(`${BASE_URL}/v1/chat/completions`, {
      method : 'POST',
      headers: {
        'content-type' : 'application/json',
        'authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(oaiBody),
    });

    const upstreamData = await upstream.json();

    // ── Translate OpenAI response → Anthropic format for the frontend ────────
    let responseData;
    if (upstream.ok && upstreamData.choices) {
      const content = upstreamData.choices[0]?.message?.content || '';
      responseData = {
        id        : upstreamData.id || ('msg_' + Date.now()),
        type      : 'message',
        role      : 'assistant',
        content   : [{ type: 'text', text: content }],
        model     : upstreamData.model || oaiBody.model,
        stop_reason: 'end_turn',
        usage: {
          input_tokens : upstreamData.usage?.prompt_tokens     || 0,
          output_tokens: upstreamData.usage?.completion_tokens || 0,
        },
      };
    } else {
      // Pass error through as-is
      responseData = upstreamData;
    }
    res.status(upstream.status).type('application/json').json(responseData);
  } catch (e) {
    console.error('[proxy error]', e.message);
    res.status(500).json({ error: { message: e.message } });
  }
});

// ─── Static files (production) ───────────────────────────────────────────────
// In dev, Vite serves the frontend separately on port 5173.
// In production (Render), Express serves the built dist/ folder.

if (existsSync(DIST_PATH)) {
  app.use(express.static(DIST_PATH));
  app.get('*', (_req, res) => res.sendFile(join(DIST_PATH, 'index.html')));
}

// ─── Start ────────────────────────────────────────────────────────────────────

const port   = process.env.PORT || 3001;
const server = app.listen(port, () => {
  console.log(`[solo-cockpit] proxy listening on http://localhost:${port}`);
  console.log(`[solo-cockpit] forwarding to: ${BASE_URL}/v1/chat/completions`);
  const masked = API_KEY.length > 8 ? `${API_KEY.slice(0, 6)}...${API_KEY.slice(-4)}` : '***';
  console.log(`[solo-cockpit] api key: ${masked}`);
  console.log(`[solo-cockpit] tavily: ${TAVILY_KEY ? 'ENABLED' : 'DISABLED'}`);
  console.log(`[solo-cockpit] rate limit: ${RATE_LIMIT} req/hour/IP (localhost exempt)`);
  console.log(`[solo-cockpit] daily cap warning at: ${DAILY_CAP} requests`);
});
server.setTimeout(REQUEST_TIMEOUT_MS);
