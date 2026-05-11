import React, { useState, useEffect } from 'react';
import { Radio, Pickaxe, Sun, FlaskConical, Compass, Loader2, Download, Trash2, ChevronRight, Search, History, Sparkles, AlertCircle, ExternalLink, Home } from 'lucide-react';
import CoverPage from './CoverPage';

// ─── i18n ─────────────────────────────────────────────────────────────────────
type Lang = 'en' | 'zh';

const UI = {
  en: {
    appTitle: 'Solo Operator Cockpit',
    appSubtitle: 'Brainstorm and research tool for one-person companies',
    history: 'History',
    historyEmpty: 'No history yet',
    recentRuns: 'Recent runs',
    clear: 'Clear',
    run: 'Run',
    generateBriefing: 'Generate briefing',
    deepDive: 'Deep dive',
    deepDiveLoading: 'Researching...',
    expanded: 'Expanded below',
    export: 'Export',
    loadingMain: 'Searching the web + generating brief…',
    loadingNote: 'Fetching live sources, then synthesizing — usually 15–30 s',
    errorNoQuery: 'Please enter a query',
    errorNoTopics: 'Please set your topics of interest first',
    errorPrefix: 'Something went wrong: ',
    errorSuffix: ' Try rephrasing or running again.',
    deepDiveFailed: 'Deep dive failed: ',
    footerNote: 'Results are AI-generated research briefs. Always verify before acting.',
    briefingTopicsLabel: 'Your topics of interest (saved between sessions)',
    briefingTopicsPlaceholder: 'e.g., AI agents, prediction markets, macro/geopolitics, indie SaaS pricing',
    emptyBriefing: 'Set your topics above and generate a briefing',
    emptyValidator: 'Enter a business idea to get started',
    emptyDefault: 'Enter a query to get started',
    // Result section headings
    secSummary: 'Summary',
    secTrending: 'Trending themes',
    secPainPoints: 'Pain points',
    secAngles: 'Actionable angles',
    secSources: 'Sources consulted',
    secNicheOverview: 'Niche overview',
    secOpportunities: 'Opportunities (ranked by signal strength)',
    secPatterns: 'Meta-patterns',
    secActOn: 'Act on',
    secWatch: 'Watch',
    secContrarian: 'Contrarian take',
    secIdea: 'Idea restated',
    secExisting: 'Existing solutions',
    secMarket: 'Market signals',
    secCaseFor: 'Case for',
    secCaseAgainst: 'Case against',
    secQuestions: 'Hard questions to answer first',
    secVerdict: 'Verdict',
    // Field labels
    lblEvidence: 'Evidence',
    lblSignalReasoning: 'Signal reasoning',
    lblSoloAngle: 'Solo operator angle',
    lblGap: 'Gap in existing solutions',
    lblDemand: 'Demand evidence',
    lblPricing: 'Pricing benchmarks',
    lblSize: 'Size estimate',
    lblWhy: 'Why: ',
    lblDo: 'Do: ',
    lblWatchFor: 'Watch for: ',
    lblApproach: 'Approach: ',
    lblWeakness: 'Weakness: ',
    lblConfidence: 'Confidence: ',
    lblPivotDirection: 'Pivot direction',
    // Operator Radar
    secSpaceSummary: 'Space overview',
    secRadarExamples: 'Real one-person companies',
    secSpacePatterns: 'Common patterns',
    secGaps: 'Gaps spotted',
    lblFounder: 'Founder',
    lblBizModel: 'Business model',
    lblRevenueSignal: 'Revenue signal',
    lblCustomerPain: 'Customer pain',
    lblWhySolo: 'Why it works solo',
    lblLearnFrom: 'Key insight',
    emptyRadar: 'Enter a space to explore (e.g., "travel tools", "developer utilities", "creator economy")',
    suggestedTopicsLabel: 'Popular topics — click to add:',
    suggestedTopics: ['AI Agents', 'Crypto & Web3', 'Indie SaaS', 'Developer Tools', 'Creator Economy', 'Climate Tech', 'Health Tech', 'Fintech', 'Remote Work', 'Geopolitics', 'E-commerce', 'VC & Startups', 'No-Code Tools', 'Productivity'],
  },
  zh: {
    appTitle: '单兵作战舱',
    appSubtitle: '独立创业者的市场调研与头脑风暴工具',
    history: '历史',
    historyEmpty: '暂无历史记录',
    recentRuns: '最近记录',
    clear: '清除',
    run: '运行',
    generateBriefing: '生成简报',
    deepDive: '深入分析',
    deepDiveLoading: '分析中...',
    expanded: '已展开',
    export: '导出',
    loadingMain: '搜索网络并生成简报…',
    loadingNote: '抓取实时数据并合成 — 通常需要 15–30 秒',
    errorNoQuery: '请输入查询内容',
    errorNoTopics: '请先设置关注主题',
    errorPrefix: '出错了：',
    errorSuffix: ' 请换个说法或重试。',
    deepDiveFailed: '深入分析失败：',
    footerNote: '结果为 AI 生成的研究简报，行动前请自行核实。',
    briefingTopicsLabel: '你的关注主题（跨会话保存）',
    briefingTopicsPlaceholder: '例如：AI 智能体、预测市场、宏观经济、独立 SaaS 定价',
    emptyBriefing: '在上方设置主题后生成简报',
    emptyValidator: '输入商业想法开始验证',
    emptyDefault: '输入查询内容开始',
    // Result section headings
    secSummary: '摘要',
    secTrending: '热门趋势',
    secPainPoints: '痛点',
    secAngles: '可执行方向',
    secSources: '参考来源',
    secNicheOverview: '市场概览',
    secOpportunities: '机会（按信号强度排序）',
    secPatterns: '元规律',
    secActOn: '立即行动',
    secWatch: '持续关注',
    secContrarian: '逆向观点',
    secIdea: '想法重述',
    secExisting: '现有方案',
    secMarket: '市场信号',
    secCaseFor: '支持理由',
    secCaseAgainst: '反对理由',
    secQuestions: '首先需回答的关键问题',
    secVerdict: '判断结论',
    // Field labels
    lblEvidence: '依据',
    lblSignalReasoning: '信号分析',
    lblSoloAngle: '独立创业角度',
    lblGap: '现有方案缺口',
    lblDemand: '需求依据',
    lblPricing: '定价基准',
    lblSize: '规模估算',
    lblWhy: '原因：',
    lblDo: '行动：',
    lblWatchFor: '关注：',
    lblApproach: '方案：',
    lblWeakness: '弱点：',
    lblConfidence: '置信度：',
    lblPivotDirection: '转型方向',
    // Operator Radar
    secSpaceSummary: '赛道概览',
    secRadarExamples: '真实一人公司案例',
    secSpacePatterns: '共同规律',
    secGaps: '发现的空白',
    lblFounder: '创始人',
    lblBizModel: '商业模式',
    lblRevenueSignal: '收入信号',
    lblCustomerPain: '客户痛点',
    lblWhySolo: '单人可行原因',
    lblLearnFrom: '核心启示',
    emptyRadar: '输入赛道或领域（如：旅行工具、开发者工具、创作者经济）',
    suggestedTopicsLabel: '热门主题 — 点击添加：',
    suggestedTopics: ['AI 智能体', '加密货币', '独立 SaaS', '开发者工具', '创作者经济', '气候科技', '健康科技', '金融科技', '远程办公', '地缘政治', '跨境电商', '创业投资', '无代码工具', '效率工具'],
  },
} as const;

// ─── Mode definitions ─────────────────────────────────────────────────────────
function getModes(lang: Lang) {
  // Appended to every prompt when Chinese is selected so the LLM responds in Chinese.
  const langInstruction = lang === 'zh'
    ? '\n\nIMPORTANT: Your entire response must be in Simplified Chinese (简体中文). Every JSON string value must be written in Chinese. Do not use English in any JSON values.'
    : '';

  const _m: any = {
    signal: {
      name: lang === 'en' ? 'Signal Harvester' : '信号采集',
      icon: Radio,
      placeholder: lang === 'en'
        ? 'Topic or keywords (e.g., "AI coding assistants", "prediction markets")'
        : '主题或关键词（如：AI 编程助手、预测市场）',
      description: lang === 'en'
        ? 'Scan the web for trending themes, pain points, and actionable angles'
        : '扫描网络热点、痛点与行动方向',
      buildPrompt: (q: string) => `You are a signal harvester for a solo operator. Research the topic: "${q}"

Use web search to find what's currently being discussed across forums, news, social platforms, and industry sources. Focus on the last 30 days when possible.

Then return a JSON object with this exact structure (no markdown, no preamble, just JSON):
{
  "summary": "2-3 sentence overview of what's happening in this space right now",
  "trending_themes": [
    {"theme": "short theme name", "detail": "1-2 sentence explanation", "why_it_matters": "why a solo operator should care"}
  ],
  "pain_points": [
    {"pain": "short description", "evidence": "what you saw that suggests this", "intensity": "high/medium/low"}
  ],
  "actionable_angles": [
    {"angle": "specific thing a solo operator could do", "rationale": "why this angle given the signals"}
  ],
  "sources_consulted": ["brief description of source types used"]
}

Include 3-5 items per array. Be specific and grounded in what you actually found — no generic advice.${langInstruction}`,
    },

    opportunity: {
      name: lang === 'en' ? 'Opportunity Miner' : '机会挖掘',
      icon: Pickaxe,
      placeholder: lang === 'en'
        ? 'Niche or market (e.g., "freelance bookkeeping software", "pet insurance")'
        : '细分市场（如：自由职业记账软件、宠物保险）',
      description: lang === 'en'
        ? 'Find complaints, unmet needs, and frustrations ranked by signal strength'
        : '发现用户的不满、纠结、与实际需求，按信号强度排序',
      buildPrompt: (q: string) => `You are an opportunity miner for a solo operator. Research the niche: "${q}"

Use web search to find complaints, frustrations, unmet needs, and workflow pain across review sites, forums (Reddit especially), and any marketplaces relevant to this niche.

Return a JSON object with this exact structure (no markdown, no preamble, just JSON):
{
  "niche_summary": "2-3 sentence overview of this market's current state",
  "opportunities": [
    {
      "title": "short opportunity name",
      "pain_description": "what users are struggling with",
      "evidence": "specific complaints or patterns you saw",
      "signal_strength": "high/medium/low",
      "signal_reasoning": "why you rated it this way (frequency, intensity, willingness to pay signals)",
      "solo_operator_angle": "how a one-person company could realistically address this",
      "existing_solutions_gap": "what current solutions are missing"
    }
  ],
  "patterns_noticed": ["meta-patterns across the complaints"],
  "sources_consulted": ["brief description of source types used"]
}

Include 4-6 opportunities, ranked from highest to lowest signal strength. Be ruthlessly specific about evidence.${langInstruction}`,
    },

    briefing: {
      name: lang === 'en' ? 'Daily Briefing' : '每日简报',
      icon: Sun,
      placeholder: '',
      description: lang === 'en'
        ? 'Your morning briefing based on saved topics of interest'
        : '基于保存主题的每日早报',
      buildPrompt: (topics: string) => `You are generating a daily briefing for a solo operator. Their topics of interest: "${topics}"

Use web search to find recent developments (last 24-72 hours preferred) across these topics. Then synthesize into a briefing.

Return a JSON object with this exact structure (no markdown, no preamble, just JSON):
{
  "date_context": "brief framing of the current moment",
  "act_on": [
    {"headline": "short", "what": "what happened", "why_act": "why this needs action or attention soon", "suggested_action": "concrete thing to do"}
  ],
  "watch": [
    {"headline": "short", "what": "what to keep eyes on", "why_watch": "what to watch for next"}
  ],
  "contrarian_take": {
    "take": "one contrarian or non-obvious observation",
    "reasoning": "what's supporting this view that others are missing"
  },
  "sources_consulted": ["brief description of source types used"]
}

Exactly 3 "act_on" items, 2 "watch" items, 1 "contrarian_take". Be concrete and non-generic. Favor specificity over breadth.${langInstruction}`,
    },

    validator: {
      name: lang === 'en' ? 'Idea Validator' : '想法验证',
      icon: FlaskConical,
      placeholder: lang === 'en'
        ? 'Describe your idea (e.g., "A Chrome extension that summarizes legal contracts for freelancers")'
        : '描述你的想法（如：为自由职业者简化法律合同的 Chrome 插件）',
      description: lang === 'en'
        ? 'One-page go/no-go memo with Claude as skeptical advisor'
        : '让AI来验证想法，形成"行不行"备忘录',
      buildPrompt: (q: string) => `You are a skeptical but fair advisor validating a business idea for a solo operator. The idea: "${q}"

Use web search to find: existing solutions in this space, complaints about current options, pricing benchmarks, market size signals, and any relevant discussions.

Return a JSON object with this exact structure (no markdown, no preamble, just JSON):
{
  "idea_restated": "clean one-sentence version of the idea",
  "existing_solutions": [
    {"name": "solution name", "approach": "how they solve it", "weakness": "where they fall short"}
  ],
  "market_signals": {
    "demand_evidence": "what suggests real demand (or lack of it)",
    "pricing_benchmarks": "what similar things cost",
    "size_estimate": "rough market size signals from what you found"
  },
  "strongest_case_for": ["3-4 reasons this could work, grounded in evidence"],
  "strongest_case_against": ["3-4 reasons this might fail, grounded in evidence"],
  "skeptical_questions": ["3-4 hard questions the operator must answer before proceeding"],
  "verdict": {
    "lean": "GO / NO-GO / NEEDS-PIVOT",
    "confidence": "high/medium/low",
    "reasoning": "2-3 sentences on your lean and why",
    "if_pivot": "if NEEDS-PIVOT, a specific pivot direction worth exploring"
  },
  "sources_consulted": ["brief description of source types used"]
}

Be honest, not encouraging. Your job is to save them from wasted effort, not validate their ego.${langInstruction}`,
    },

    radar: {
      name: lang === 'en' ? 'Operator Radar' : '创意导航',
      icon: Compass,
      placeholder: lang === 'en'
        ? 'Space or topic (e.g., "travel tools", "developer utilities", "creator economy", "Nomad List")'
        : '赛道或领域（如：旅行工具、开发者工具、创作者经济，或直接输入公司名如 Nomad List）',
      description: lang === 'en'
        ? 'Real one-person companies — what they built, what their customers want, what you can learn'
        : '真实一人公司案例 — 他们做了什么、客户想要什么、你能学到什么',
      buildPrompt: (q: string) => `You are a researcher mapping the solo operator / one-person company landscape. The user wants to explore: "${q}"

This could be a broad space (e.g., "travel tools") or a specific company name (e.g., "Nomad List"). Adapt accordingly:
- If broad: find 5-7 real one-person or tiny-team companies in that space
- If a specific company: focus one entry on that company and find 4-5 related ones in the same space

Search for real examples on Indie Hackers, Product Hunt, Twitter/X, personal blogs, and news. Look for actual revenue numbers, founder names, and what customers say they want.

Return a JSON object with this exact structure (no markdown, no preamble, just JSON):
{
  "space_summary": "2-3 sentences on the overall landscape — how active it is, who's winning, general vibe",
  "examples": [
    {
      "name": "Product or company name",
      "url": "homepage or product URL if known, else empty string",
      "founder": "founder name(s) if known, else 'unknown'",
      "tagline": "what it does in one crisp sentence",
      "model": "how it makes money: subscription / one-time / ads / marketplace / etc.",
      "revenue_signal": "known ARR/MRR or public revenue, e.g. '$40k MRR' — or 'not public' if unknown",
      "customer_pain": "the specific problem their customers had before this existed",
      "why_it_works_solo": "what specifically makes this viable for one person (automation, distribution, pricing, etc.)",
      "learn_from": "the single most transferable insight from this company for someone entering this space"
    }
  ],
  "space_patterns": [
    "pattern that appears across multiple companies in this space"
  ],
  "gaps_spotted": [
    "a specific underserved angle or audience not well covered by existing players"
  ],
  "sources_consulted": ["brief description of source types used"]
}

Include 5-7 examples. Be specific — real names, real numbers, real URLs where you found them. Do not invent companies.${langInstruction}`,
    },
  };
  // Tab order: briefing → signal → opportunity → radar → validator
  return { briefing: _m.briefing, signal: _m.signal, opportunity: _m.opportunity, radar: _m.radar, validator: _m.validator };
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function SoloOperatorCockpit() {
  const [view, setView] = useState<'cover' | 'app'>('cover');
  const [lang, setLang] = useState<Lang>('en');
  const [activeMode, setActiveMode] = useState('briefing');
  const [input, setInput] = useState('');
  const [briefingTopics, setBriefingTopics] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deepDiveLoading, setDeepDiveLoading] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const L = UI[lang];
  const modes: any = getModes(lang);

  // Load history and saved topics on mount (localStorage — replaces window.storage used in the artifact)
  useEffect(() => {
    try {
      const h = localStorage.getItem('history');
      if (h) setHistory(JSON.parse(h));
    } catch (e) {}
    try {
      const t = localStorage.getItem('briefing_topics');
      if (t) setBriefingTopics(t);
    } catch (e) {}
    try {
      const saved = localStorage.getItem('lang') as Lang | null;
      if (saved === 'en' || saved === 'zh') setLang(saved);
    } catch (e) {}
  }, []);

  const saveHistory = (newHistory: any[]) => {
    setHistory(newHistory);
    try { localStorage.setItem('history', JSON.stringify(newHistory.slice(0, 50))); } catch (e) {}
  };

  const saveBriefingTopics = (topics: string) => {
    setBriefingTopics(topics);
    try { localStorage.setItem('briefing_topics', topics); } catch (e) {}
  };

  const switchLang = (next: Lang) => {
    setLang(next);
    try { localStorage.setItem('lang', next); } catch (e) {}
  };

  // Append a suggested topic to the briefing topics textarea if not already present
  const handleAddTopic = (topic: string) => {
    const current = briefingTopics.trim();
    if (!current) {
      saveBriefingTopics(topic);
      return;
    }
    const existing = current.split(/[,，\n]+/).map(t => t.trim().toLowerCase());
    if (!existing.includes(topic.toLowerCase())) {
      saveBriefingTopics(current + ', ' + topic);
    }
  };

  // Show cover page before the main app
  if (view === 'cover') {
    return (
      <CoverPage
        lang={lang}
        onLangChange={switchLang}
        onEnter={() => setView('app')}
      />
    );
  }

  const runQuery = async () => {
    const mode = modes[activeMode];
    const query = activeMode === 'briefing' ? briefingTopics : input;

    if (!query.trim()) {
      setError(activeMode === 'briefing' ? L.errorNoTopics : L.errorNoQuery);
      return;
    }

    setError(null);
    setIsLoading(true);
    setCurrentResult(null);

    try {
      // Calls local Express proxy at /api/messages (see server/index.mjs).
      // The proxy holds the ANTHROPIC_API_KEY server-side — never exposed to the browser.
      // _search_query is read by the proxy for Tavily enrichment; stripped before LLM.
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'qwen3.6-plus',
          max_tokens: 4000,
          messages: [{ role: 'user', content: mode.buildPrompt(query) }],
          _search_query: query,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API error: ${response.status} ${errText.substring(0, 300)}`);
      }

      const data = await response.json();
      const textResponse = data.content
        .filter((item: any) => item.type === 'text')
        .map((item: any) => item.text)
        .join('\n');

      const clean = textResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      const jsonStart = clean.indexOf('{');
      const jsonEnd = clean.lastIndexOf('}') + 1;
      const jsonStr = clean.substring(jsonStart, jsonEnd);
      const parsed = JSON.parse(jsonStr);

      const result = {
        id: Date.now(),
        mode: activeMode,
        modeName: mode.name,
        query,
        data: parsed,
        timestamp: new Date().toISOString(),
      };

      setCurrentResult(result);
      saveHistory([result, ...history]);
    } catch (err: any) {
      setError(`${L.errorPrefix}${err.message}${L.errorSuffix}`);
    } finally {
      setIsLoading(false);
    }
  };

  const deepDive = async (topic: string, context: string) => {
    setDeepDiveLoading(topic);
    try {
      const langInstruction = lang === 'zh'
        ? '\n\nIMPORTANT: Write your response entirely in Simplified Chinese (简体中文).'
        : '';
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'qwen3.6-plus',
          max_tokens: 1500,
          messages: [{
            role: 'user',
            content: `Deep dive on this specific item from a research brief.

Context (original query): "${context}"
Item to expand: "${topic}"

Write a focused 3-4 paragraph deep dive. Include concrete examples, specific names/numbers where possible, and practical implications for a solo operator. No JSON — just well-written prose.${langInstruction}`,
          }],
          // _search_query is read by the proxy for Tavily enrichment; stripped before LLM.
          _search_query: `${topic} ${context}`,
        }),
      });
      const data = await response.json();
      const text = data.content.filter((i: any) => i.type === 'text').map((i: any) => i.text).join('\n');

      setCurrentResult((prev: any) => ({
        ...prev,
        deepDives: { ...(prev.deepDives || {}), [topic]: text },
      }));
    } catch (e: any) {
      setError(`${L.deepDiveFailed}${e.message}`);
    } finally {
      setDeepDiveLoading(null);
    }
  };

  const exportMarkdown = () => {
    if (!currentResult) return;
    const { modeName, query, data, timestamp } = currentResult;
    let md = `# ${modeName}\n\n**Query:** ${query}\n**Generated:** ${new Date(timestamp).toLocaleString()}\n\n---\n\n`;
    md += '```json\n' + JSON.stringify(data, null, 2) + '\n```\n';

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${modeName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadFromHistory = (item: any) => {
    setActiveMode(item.mode);
    setCurrentResult(item);
    setShowHistory(false);
    if (item.mode !== 'briefing') setInput(item.query);
  };

  const clearHistory = () => saveHistory([]);

  const CurrentIcon = modes[activeMode].icon;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-10 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-medium tracking-tight">{L.appTitle}</h1>
            <p className="text-sm text-stone-500 mt-1">{L.appSubtitle}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Back to cover page */}
            <button
              onClick={() => setView('cover')}
              className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 transition-colors"
              title="Home"
            >
              <Home className="w-4 h-4" />
            </button>

            {/* Language toggle */}
            <div className="flex rounded-md border border-stone-200 overflow-hidden text-xs">
              <button
                onClick={() => switchLang('en')}
                className={`px-3 py-1.5 transition-colors ${
                  lang === 'en' ? 'bg-stone-900 text-white' : 'text-stone-500 hover:text-stone-900 bg-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => switchLang('zh')}
                className={`px-3 py-1.5 border-l border-stone-200 transition-colors ${
                  lang === 'zh' ? 'bg-stone-900 text-white' : 'text-stone-500 hover:text-stone-900 bg-white'
                }`}
              >
                中文
              </button>
            </div>

            {/* History toggle */}
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 transition-colors"
            >
              <History className="w-4 h-4" />
              {L.history} ({history.length})
            </button>
          </div>
        </div>

        {/* History Panel */}
        {showHistory && (
          <div className="mb-8 p-5 bg-white border border-stone-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">{L.recentRuns}</h3>
              {history.length > 0 && (
                <button onClick={clearHistory} className="text-xs text-stone-400 hover:text-red-600 flex items-center gap-1">
                  <Trash2 className="w-3 h-3" /> {L.clear}
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <p className="text-sm text-stone-400">{L.historyEmpty}</p>
            ) : (
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {history.map((item: any) => (
                  <button
                    key={item.id}
                    onClick={() => loadFromHistory(item)}
                    className="w-full text-left px-3 py-2 hover:bg-stone-50 rounded text-sm flex items-center justify-between group"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="text-stone-400 mr-2">{item.modeName}</span>
                      <span className="truncate">{item.query}</span>
                    </div>
                    <span className="text-xs text-stone-400 ml-2">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mode Tabs */}
        <div className="flex gap-1 mb-6 border-b border-stone-200">
          {Object.entries(modes).map(([key, mode]: any) => {
            const Icon = mode.icon;
            return (
              <button
                key={key}
                onClick={() => { setActiveMode(key); setCurrentResult(null); setError(null); }}
                className={`flex items-center gap-2 px-4 py-3 text-sm border-b-2 -mb-px transition-colors ${
                  activeMode === key
                    ? 'border-stone-900 text-stone-900 font-medium'
                    : 'border-transparent text-stone-500 hover:text-stone-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {mode.name}
              </button>
            );
          })}
        </div>

        {/* Mode Description */}
        <div className="mb-5">
          <p className="text-sm text-stone-500">{modes[activeMode].description}</p>
        </div>

        {/* Input Area */}
        <div className="mb-6">
          {activeMode === 'briefing' ? (
            <div className="space-y-3">
              <label className="block text-xs font-medium text-stone-600 uppercase tracking-wide">
                {L.briefingTopicsLabel}
              </label>
              <textarea
                value={briefingTopics}
                onChange={(e) => saveBriefingTopics(e.target.value)}
                placeholder={L.briefingTopicsPlaceholder}
                className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400 resize-none h-24"
              />
              {/* Suggested topic chips */}
              <div>
                <p className="text-xs text-stone-400 mb-2">{L.suggestedTopicsLabel}</p>
                <div className="flex flex-wrap gap-2">
                  {(L.suggestedTopics as readonly string[]).map((topic) => {
                    const alreadyAdded = briefingTopics
                      .split(/[,，\n]+/)
                      .map(t => t.trim().toLowerCase())
                      .includes(topic.toLowerCase());
                    return (
                      <button
                        key={topic}
                        onClick={() => handleAddTopic(topic)}
                        disabled={alreadyAdded}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                          alreadyAdded
                            ? 'border-stone-200 text-stone-300 bg-stone-50 cursor-default'
                            : 'border-stone-300 text-stone-600 hover:border-stone-900 hover:text-stone-900 bg-white'
                        }`}
                      >
                        {topic}
                      </button>
                    );
                  })}
                </div>
              </div>
              <button
                onClick={runQuery}
                disabled={isLoading || !briefingTopics.trim()}
                className="px-4 py-2 bg-stone-900 text-white text-sm rounded-lg hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sun className="w-4 h-4" />}
                {L.generateBriefing}
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !isLoading && runQuery()}
                  placeholder={modes[activeMode].placeholder}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400"
                />
              </div>
              <button
                onClick={runQuery}
                disabled={isLoading || !input.trim()}
                className="px-5 py-3 bg-stone-900 text-white text-sm rounded-lg hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CurrentIcon className="w-4 h-4" />}
                {L.run}
              </button>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="p-12 text-center">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-stone-400 mb-3" />
            <p className="text-sm text-stone-500">{L.loadingMain}</p>
            <p className="text-xs text-stone-400 mt-1">{L.loadingNote}</p>
          </div>
        )}

        {/* Results */}
        {currentResult && !isLoading && (
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="text-xs text-stone-500">
                <span className="font-medium text-stone-900">{currentResult.modeName}</span>
                {' · '}
                {new Date(currentResult.timestamp).toLocaleString()}
              </div>
              <button
                onClick={exportMarkdown}
                className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1"
              >
                <Download className="w-3 h-3" /> {L.export}
              </button>
            </div>

            <ResultRenderer
              result={currentResult}
              onDeepDive={deepDive}
              deepDiveLoading={deepDiveLoading}
              ui={L}
            />
          </div>
        )}

        {/* Empty State */}
        {!currentResult && !isLoading && !error && (
          <div className="p-16 text-center border-2 border-dashed border-stone-200 rounded-lg">
            <CurrentIcon className="w-8 h-8 mx-auto text-stone-300 mb-3" />
            <p className="text-sm text-stone-400">
              {activeMode === 'briefing'
                ? L.emptyBriefing
                : activeMode === 'validator'
                  ? L.emptyValidator
                  : activeMode === 'radar'
                    ? L.emptyRadar
                    : L.emptyDefault}
            </p>
          </div>
        )}

        <div className="mt-16 pt-6 border-t border-stone-200 text-xs text-stone-400 text-center">
          {L.footerNote}
        </div>
      </div>
    </div>
  );
}

// ─── Result renderer ──────────────────────────────────────────────────────────
function ResultRenderer({ result, onDeepDive, deepDiveLoading, ui }: any) {
  const { mode, data, query, deepDives = {} } = result;
  const L = ui;

  const DeepDiveButton = ({ topic }: any) => (
    <button
      onClick={() => onDeepDive(topic, query)}
      disabled={deepDiveLoading === topic || deepDives[topic]}
      className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 mt-2 disabled:opacity-50"
    >
      {deepDiveLoading === topic ? (
        <><Loader2 className="w-3 h-3 animate-spin" /> {L.deepDiveLoading}</>
      ) : deepDives[topic] ? (
        <><Sparkles className="w-3 h-3" /> {L.expanded}</>
      ) : (
        <><ChevronRight className="w-3 h-3" /> {L.deepDive}</>
      )}
    </button>
  );

  const DeepDiveContent = ({ topic }: any) => deepDives[topic] && (
    <div className="mt-3 p-4 bg-stone-100 rounded border-l-2 border-stone-400">
      <div className="text-xs text-stone-500 mb-2 uppercase tracking-wide">{L.deepDive}</div>
      <div className="text-sm text-stone-700 whitespace-pre-wrap">{deepDives[topic]}</div>
    </div>
  );

  const Section = ({ title, children }: any) => (
    <div>
      <h3 className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-3">{title}</h3>
      {children}
    </div>
  );

  const IntensityBadge = ({ level }: any) => {
    const colors: any = {
      high: 'bg-red-50 text-red-700 border-red-200',
      medium: 'bg-amber-50 text-amber-700 border-amber-200',
      low: 'bg-stone-50 text-stone-600 border-stone-200',
      // Chinese equivalents
      高: 'bg-red-50 text-red-700 border-red-200',
      中: 'bg-amber-50 text-amber-700 border-amber-200',
      低: 'bg-stone-50 text-stone-600 border-stone-200',
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded border ${colors[level?.toLowerCase?.()] ?? colors[level] ?? colors.low}`}>
        {level}
      </span>
    );
  };

  if (mode === 'signal') {
    return (
      <div className="space-y-8">
        <Section title={L.secSummary}>
          <p className="text-sm text-stone-700 leading-relaxed">{data.summary}</p>
        </Section>

        <Section title={L.secTrending}>
          <div className="space-y-3">
            {data.trending_themes?.map((t: any, i: number) => (
              <div key={i} className="p-4 bg-white border border-stone-200 rounded-lg">
                <h4 className="text-sm font-medium mb-1">{t.theme}</h4>
                <p className="text-sm text-stone-600 mb-2">{t.detail}</p>
                <p className="text-xs text-stone-500 italic">{t.why_it_matters}</p>
                <DeepDiveButton topic={t.theme} />
                <DeepDiveContent topic={t.theme} />
              </div>
            ))}
          </div>
        </Section>

        <Section title={L.secPainPoints}>
          <div className="space-y-2">
            {data.pain_points?.map((p: any, i: number) => (
              <div key={i} className="p-4 bg-white border border-stone-200 rounded-lg">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h4 className="text-sm font-medium">{p.pain}</h4>
                  <IntensityBadge level={p.intensity} />
                </div>
                <p className="text-xs text-stone-500">{p.evidence}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title={L.secAngles}>
          <div className="space-y-2">
            {data.actionable_angles?.map((a: any, i: number) => (
              <div key={i} className="p-4 bg-white border border-stone-200 rounded-lg">
                <h4 className="text-sm font-medium mb-1">{a.angle}</h4>
                <p className="text-xs text-stone-500">{a.rationale}</p>
              </div>
            ))}
          </div>
        </Section>

        {data.sources_consulted && (
          <Section title={L.secSources}>
            <p className="text-xs text-stone-500">{data.sources_consulted.join(' · ')}</p>
          </Section>
        )}
      </div>
    );
  }

  if (mode === 'opportunity') {
    return (
      <div className="space-y-8">
        <Section title={L.secNicheOverview}>
          <p className="text-sm text-stone-700 leading-relaxed">{data.niche_summary}</p>
        </Section>

        <Section title={L.secOpportunities}>
          <div className="space-y-3">
            {data.opportunities?.map((o: any, i: number) => (
              <div key={i} className="p-5 bg-white border border-stone-200 rounded-lg">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4 className="text-sm font-medium">{o.title}</h4>
                  <IntensityBadge level={o.signal_strength} />
                </div>
                <p className="text-sm text-stone-600 mb-3">{o.pain_description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-stone-400 uppercase tracking-wide mb-1">{L.lblEvidence}</div>
                    <div className="text-stone-600">{o.evidence}</div>
                  </div>
                  <div>
                    <div className="text-stone-400 uppercase tracking-wide mb-1">{L.lblSignalReasoning}</div>
                    <div className="text-stone-600">{o.signal_reasoning}</div>
                  </div>
                  <div>
                    <div className="text-stone-400 uppercase tracking-wide mb-1">{L.lblSoloAngle}</div>
                    <div className="text-stone-600">{o.solo_operator_angle}</div>
                  </div>
                  <div>
                    <div className="text-stone-400 uppercase tracking-wide mb-1">{L.lblGap}</div>
                    <div className="text-stone-600">{o.existing_solutions_gap}</div>
                  </div>
                </div>
                <DeepDiveButton topic={o.title} />
                <DeepDiveContent topic={o.title} />
              </div>
            ))}
          </div>
        </Section>

        {data.patterns_noticed && (
          <Section title={L.secPatterns}>
            <ul className="space-y-1">
              {data.patterns_noticed.map((p: any, i: number) => (
                <li key={i} className="text-sm text-stone-600 flex gap-2">
                  <span className="text-stone-400">·</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {data.sources_consulted && (
          <Section title={L.secSources}>
            <p className="text-xs text-stone-500">{data.sources_consulted.join(' · ')}</p>
          </Section>
        )}
      </div>
    );
  }

  if (mode === 'briefing') {
    return (
      <div className="space-y-8">
        {data.date_context && (
          <p className="text-sm text-stone-500 italic">{data.date_context}</p>
        )}

        <Section title={L.secActOn}>
          <div className="space-y-3">
            {data.act_on?.map((item: any, i: number) => (
              <div key={i} className="p-4 bg-white border border-stone-200 rounded-lg">
                <h4 className="text-sm font-medium mb-1">{item.headline}</h4>
                <p className="text-sm text-stone-600 mb-2">{item.what}</p>
                <div className="text-xs space-y-1">
                  <div><span className="text-stone-400 uppercase tracking-wide">{L.lblWhy}</span><span className="text-stone-600">{item.why_act}</span></div>
                  <div><span className="text-stone-400 uppercase tracking-wide">{L.lblDo}</span><span className="text-stone-700">{item.suggested_action}</span></div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title={L.secWatch}>
          <div className="space-y-2">
            {data.watch?.map((item: any, i: number) => (
              <div key={i} className="p-4 bg-white border border-stone-200 rounded-lg">
                <h4 className="text-sm font-medium mb-1">{item.headline}</h4>
                <p className="text-sm text-stone-600 mb-1">{item.what}</p>
                <p className="text-xs text-stone-500">{L.lblWatchFor}{item.why_watch}</p>
              </div>
            ))}
          </div>
        </Section>

        {data.contrarian_take && (
          <Section title={L.secContrarian}>
            <div className="p-5 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm font-medium text-stone-900 mb-2">{data.contrarian_take.take}</p>
              <p className="text-xs text-stone-600">{data.contrarian_take.reasoning}</p>
            </div>
          </Section>
        )}

        {data.sources_consulted && (
          <Section title={L.secSources}>
            <p className="text-xs text-stone-500">{data.sources_consulted.join(' · ')}</p>
          </Section>
        )}
      </div>
    );
  }

  if (mode === 'validator') {
    const verdict = data.verdict || {};
    const verdictColors: any = {
      'GO': 'bg-emerald-50 border-emerald-200 text-emerald-900',
      'NO-GO': 'bg-red-50 border-red-200 text-red-900',
      'NEEDS-PIVOT': 'bg-amber-50 border-amber-200 text-amber-900',
    };

    return (
      <div className="space-y-8">
        <Section title={L.secIdea}>
          <p className="text-sm text-stone-700 italic">"{data.idea_restated}"</p>
        </Section>

        {verdict.lean && (
          <div className={`p-5 border rounded-lg ${verdictColors[verdict.lean] || 'bg-stone-50 border-stone-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wide opacity-70">{L.secVerdict}</span>
              <span className="text-xs opacity-70">{L.lblConfidence}{verdict.confidence}</span>
            </div>
            <div className="text-xl font-medium mb-2">{verdict.lean}</div>
            <p className="text-sm">{verdict.reasoning}</p>
            {verdict.if_pivot && (
              <div className="mt-3 pt-3 border-t border-current opacity-80">
                <div className="text-xs uppercase tracking-wide mb-1">{L.lblPivotDirection}</div>
                <p className="text-sm">{verdict.if_pivot}</p>
              </div>
            )}
          </div>
        )}

        <Section title={L.secExisting}>
          <div className="space-y-2">
            {data.existing_solutions?.map((s: any, i: number) => (
              <div key={i} className="p-4 bg-white border border-stone-200 rounded-lg">
                <h4 className="text-sm font-medium mb-1">{s.name}</h4>
                <div className="text-xs space-y-1">
                  <div><span className="text-stone-400">{L.lblApproach}</span><span className="text-stone-600">{s.approach}</span></div>
                  <div><span className="text-stone-400">{L.lblWeakness}</span><span className="text-stone-600">{s.weakness}</span></div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {data.market_signals && (
          <Section title={L.secMarket}>
            <div className="p-4 bg-white border border-stone-200 rounded-lg space-y-3 text-sm">
              <div>
                <div className="text-xs text-stone-400 uppercase tracking-wide mb-1">{L.lblDemand}</div>
                <p className="text-stone-700">{data.market_signals.demand_evidence}</p>
              </div>
              <div>
                <div className="text-xs text-stone-400 uppercase tracking-wide mb-1">{L.lblPricing}</div>
                <p className="text-stone-700">{data.market_signals.pricing_benchmarks}</p>
              </div>
              <div>
                <div className="text-xs text-stone-400 uppercase tracking-wide mb-1">{L.lblSize}</div>
                <p className="text-stone-700">{data.market_signals.size_estimate}</p>
              </div>
            </div>
          </Section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Section title={L.secCaseFor}>
            <ul className="space-y-2">
              {data.strongest_case_for?.map((item: any, i: number) => (
                <li key={i} className="text-sm text-stone-700 p-3 bg-emerald-50 border border-emerald-100 rounded">
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <Section title={L.secCaseAgainst}>
            <ul className="space-y-2">
              {data.strongest_case_against?.map((item: any, i: number) => (
                <li key={i} className="text-sm text-stone-700 p-3 bg-red-50 border border-red-100 rounded">
                  {item}
                </li>
              ))}
            </ul>
          </Section>
        </div>

        <Section title={L.secQuestions}>
          <ol className="space-y-2">
            {data.skeptical_questions?.map((q: any, i: number) => (
              <li key={i} className="text-sm text-stone-700 flex gap-3">
                <span className="text-stone-400 font-mono">{String(i + 1).padStart(2, '0')}</span>
                <span>{q}</span>
              </li>
            ))}
          </ol>
        </Section>

        {data.sources_consulted && (
          <Section title={L.secSources}>
            <p className="text-xs text-stone-500">{data.sources_consulted.join(' · ')}</p>
          </Section>
        )}
      </div>
    );
  }

  if (mode === 'radar') {
    return (
      <div className="space-y-8">
        <Section title={L.secSpaceSummary}>
          <p className="text-sm text-stone-700 leading-relaxed">{data.space_summary}</p>
        </Section>

        <Section title={L.secRadarExamples}>
          <div className="space-y-4">
            {data.examples?.map((ex: any, i: number) => (
              <div key={i} className="p-5 bg-white border border-stone-200 rounded-lg">
                {/* Name + URL + revenue row */}
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div>
                    {/* Company name — clickable if URL exists */}
                    {ex.url ? (
                      <a
                        href={ex.url.startsWith('http') ? ex.url : `https://${ex.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium hover:text-stone-600 flex items-center gap-1 group"
                      >
                        {ex.name}
                        <ExternalLink className="w-3 h-3 text-stone-300 group-hover:text-stone-500 transition-colors" />
                      </a>
                    ) : (
                      <h4 className="text-sm font-medium">{ex.name}</h4>
                    )}
                    {/* URL as visible text */}
                    {ex.url && (
                      <a
                        href={ex.url.startsWith('http') ? ex.url : `https://${ex.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-stone-400 hover:text-stone-600 underline underline-offset-2 block mt-0.5 truncate max-w-[220px]"
                      >
                        {ex.url.replace(/^https?:\/\//, '')}
                      </a>
                    )}
                  </div>
                  {ex.revenue_signal && ex.revenue_signal !== 'not public' && ex.revenue_signal !== '不公开' && (
                    <span className="text-xs px-2 py-0.5 rounded border bg-emerald-50 text-emerald-700 border-emerald-200 whitespace-nowrap shrink-0">
                      {ex.revenue_signal}
                    </span>
                  )}
                </div>

                {/* Founder + model */}
                <div className="flex items-center gap-3 mb-2 text-xs text-stone-400">
                  {ex.founder && ex.founder !== 'unknown' && ex.founder !== '未知' && (
                    <span>{L.lblFounder}: <span className="text-stone-600">{ex.founder}</span></span>
                  )}
                  {ex.model && (
                    <span>{L.lblBizModel}: <span className="text-stone-600">{ex.model}</span></span>
                  )}
                </div>

                {/* Tagline */}
                <p className="text-sm text-stone-600 mb-3 italic">"{ex.tagline}"</p>

                {/* Details grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <div className="text-stone-400 uppercase tracking-wide mb-1">{L.lblCustomerPain}</div>
                    <div className="text-stone-600">{ex.customer_pain}</div>
                  </div>
                  <div>
                    <div className="text-stone-400 uppercase tracking-wide mb-1">{L.lblWhySolo}</div>
                    <div className="text-stone-600">{ex.why_it_works_solo}</div>
                  </div>
                  <div>
                    <div className="text-stone-400 uppercase tracking-wide mb-1">{L.lblLearnFrom}</div>
                    <div className="text-stone-700 font-medium">{ex.learn_from}</div>
                  </div>
                </div>

                <DeepDiveButton topic={ex.name} />
                <DeepDiveContent topic={ex.name} />
              </div>
            ))}
          </div>
        </Section>

        {data.space_patterns?.length > 0 && (
          <Section title={L.secSpacePatterns}>
            <ul className="space-y-1">
              {data.space_patterns.map((p: any, i: number) => (
                <li key={i} className="text-sm text-stone-600 flex gap-2">
                  <span className="text-stone-400">·</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {data.gaps_spotted?.length > 0 && (
          <Section title={L.secGaps}>
            <div className="space-y-2">
              {data.gaps_spotted.map((g: any, i: number) => (
                <div key={i} className="p-3 bg-amber-50 border border-amber-100 rounded text-sm text-stone-700 flex gap-2">
                  <span className="text-amber-500 font-bold mt-0.5">↗</span>
                  <span>{g}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {data.sources_consulted && (
          <Section title={L.secSources}>
            <p className="text-xs text-stone-500">{data.sources_consulted.join(' · ')}</p>
          </Section>
        )}
      </div>
    );
  }

  return <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>;
}
