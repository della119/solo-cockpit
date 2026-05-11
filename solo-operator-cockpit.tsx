import React, { useState, useEffect } from 'react';
import { Radio, Pickaxe, Sun, FlaskConical, Loader2, Download, Trash2, ChevronRight, Search, History, Sparkles, AlertCircle } from 'lucide-react';

export default function SoloOperatorCockpit() {
  const [activeMode, setActiveMode] = useState('signal');
  const [input, setInput] = useState('');
  const [briefingTopics, setBriefingTopics] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [deepDiveLoading, setDeepDiveLoading] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  // Load history and saved topics on mount
  useEffect(() => {
    (async () => {
      try {
        const h = await window.storage.get('history');
        if (h) setHistory(JSON.parse(h.value));
      } catch (e) {}
      try {
        const t = await window.storage.get('briefing_topics');
        if (t) setBriefingTopics(t.value);
      } catch (e) {}
    })();
  }, []);

  const saveHistory = async (newHistory) => {
    setHistory(newHistory);
    try {
      await window.storage.set('history', JSON.stringify(newHistory.slice(0, 50)));
    } catch (e) {}
  };

  const saveBriefingTopics = async (topics) => {
    setBriefingTopics(topics);
    try {
      await window.storage.set('briefing_topics', topics);
    } catch (e) {}
  };

  const modes = {
    signal: {
      name: 'Signal Harvester',
      icon: Radio,
      placeholder: 'Topic or keywords (e.g., "AI coding assistants", "prediction markets")',
      description: 'Scan the web for trending themes, pain points, and actionable angles',
      buildPrompt: (q) => `You are a signal harvester for a solo operator. Research the topic: "${q}"

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

Include 3-5 items per array. Be specific and grounded in what you actually found — no generic advice.`
    },
    opportunity: {
      name: 'Opportunity Miner',
      icon: Pickaxe,
      placeholder: 'Niche or market (e.g., "freelance bookkeeping software", "pet insurance")',
      description: 'Find complaints, unmet needs, and frustrations ranked by signal strength',
      buildPrompt: (q) => `You are an opportunity miner for a solo operator. Research the niche: "${q}"

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

Include 4-6 opportunities, ranked from highest to lowest signal strength. Be ruthlessly specific about evidence.`
    },
    briefing: {
      name: 'Daily Briefing',
      icon: Sun,
      placeholder: '',
      description: 'Your morning briefing based on saved topics of interest',
      buildPrompt: (topics) => `You are generating a daily briefing for a solo operator. Their topics of interest: "${topics}"

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

Exactly 3 "act_on" items, 2 "watch" items, 1 "contrarian_take". Be concrete and non-generic. Favor specificity over breadth.`
    },
    validator: {
      name: 'Idea Validator',
      icon: FlaskConical,
      placeholder: 'Describe your idea (e.g., "A Chrome extension that summarizes legal contracts for freelancers")',
      description: 'One-page go/no-go memo with Claude as skeptical advisor',
      buildPrompt: (q) => `You are a skeptical but fair advisor validating a business idea for a solo operator. The idea: "${q}"

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

Be honest, not encouraging. Your job is to save them from wasted effort, not validate their ego.`
    }
  };

  const runQuery = async () => {
    const mode = modes[activeMode];
    const query = activeMode === 'briefing' ? briefingTopics : input;
    
    if (!query.trim()) {
      setError(activeMode === 'briefing' ? 'Please set your topics of interest first' : 'Please enter a query');
      return;
    }

    setError(null);
    setIsLoading(true);
    setCurrentResult(null);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          messages: [{ role: "user", content: mode.buildPrompt(query) }],
          tools: [{ type: "web_search_20250305", name: "web_search" }]
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API error: ${response.status} ${errText.substring(0, 200)}`);
      }

      const data = await response.json();
      const textResponse = data.content
        .filter(item => item.type === "text")
        .map(item => item.text)
        .join("\n");

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
        timestamp: new Date().toISOString()
      };

      setCurrentResult(result);
      saveHistory([result, ...history]);
    } catch (err) {
      setError(`Something went wrong: ${err.message}. Try rephrasing or running again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const deepDive = async (topic, context) => {
    setDeepDiveLoading(topic);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          messages: [{ 
            role: "user", 
            content: `Deep dive on this specific item from a research brief.

Context (original query): "${context}"
Item to expand: "${topic}"

Research this further with web search and write a focused 3-4 paragraph deep dive. Include concrete examples, specific names/numbers where possible, and practical implications for a solo operator. No JSON — just well-written prose.`
          }],
          tools: [{ type: "web_search_20250305", name: "web_search" }]
        })
      });
      const data = await response.json();
      const text = data.content.filter(i => i.type === "text").map(i => i.text).join("\n");
      
      setCurrentResult(prev => ({
        ...prev,
        deepDives: { ...(prev.deepDives || {}), [topic]: text }
      }));
    } catch (e) {
      setError(`Deep dive failed: ${e.message}`);
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

  const loadFromHistory = (item) => {
    setActiveMode(item.mode);
    setCurrentResult(item);
    setShowHistory(false);
    if (item.mode !== 'briefing') setInput(item.query);
  };

  const clearHistory = async () => {
    saveHistory([]);
  };

  const CurrentIcon = modes[activeMode].icon;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-medium tracking-tight">Solo Operator Cockpit</h1>
            <p className="text-sm text-stone-500 mt-1">Brainstorm and research tool for one-person companies</p>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 transition-colors"
          >
            <History className="w-4 h-4" />
            History ({history.length})
          </button>
        </div>

        {/* History Panel */}
        {showHistory && (
          <div className="mb-8 p-5 bg-white border border-stone-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">Recent runs</h3>
              {history.length > 0 && (
                <button onClick={clearHistory} className="text-xs text-stone-400 hover:text-red-600 flex items-center gap-1">
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <p className="text-sm text-stone-400">No history yet</p>
            ) : (
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {history.map(item => (
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
          {Object.entries(modes).map(([key, mode]) => {
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
                Your topics of interest (saved between sessions)
              </label>
              <textarea
                value={briefingTopics}
                onChange={(e) => saveBriefingTopics(e.target.value)}
                placeholder="e.g., AI agents, prediction markets, macro/geopolitics, indie SaaS pricing"
                className="w-full px-4 py-3 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400 resize-none h-24"
              />
              <button
                onClick={runQuery}
                disabled={isLoading || !briefingTopics.trim()}
                className="px-4 py-2 bg-stone-900 text-white text-sm rounded-lg hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sun className="w-4 h-4" />}
                Generate briefing
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
                Run
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
            <p className="text-sm text-stone-500">Researching across the web...</p>
            <p className="text-xs text-stone-400 mt-1">This typically takes 15-30 seconds</p>
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
                <Download className="w-3 h-3" /> Export
              </button>
            </div>

            <ResultRenderer 
              result={currentResult} 
              onDeepDive={deepDive} 
              deepDiveLoading={deepDiveLoading}
            />
          </div>
        )}

        {/* Empty State */}
        {!currentResult && !isLoading && !error && (
          <div className="p-16 text-center border-2 border-dashed border-stone-200 rounded-lg">
            <CurrentIcon className="w-8 h-8 mx-auto text-stone-300 mb-3" />
            <p className="text-sm text-stone-400">
              {activeMode === 'briefing' 
                ? 'Set your topics above and generate a briefing'
                : `Enter a ${activeMode === 'validator' ? 'business idea' : 'query'} to get started`}
            </p>
          </div>
        )}

        <div className="mt-16 pt-6 border-t border-stone-200 text-xs text-stone-400 text-center">
          Results are AI-generated research briefs. Always verify before acting.
        </div>
      </div>
    </div>
  );
}

function ResultRenderer({ result, onDeepDive, deepDiveLoading }) {
  const { mode, data, query, deepDives = {} } = result;

  const DeepDiveButton = ({ topic }) => (
    <button
      onClick={() => onDeepDive(topic, query)}
      disabled={deepDiveLoading === topic || deepDives[topic]}
      className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 mt-2 disabled:opacity-50"
    >
      {deepDiveLoading === topic ? (
        <><Loader2 className="w-3 h-3 animate-spin" /> Researching...</>
      ) : deepDives[topic] ? (
        <><Sparkles className="w-3 h-3" /> Expanded below</>
      ) : (
        <><ChevronRight className="w-3 h-3" /> Deep dive</>
      )}
    </button>
  );

  const DeepDiveContent = ({ topic }) => deepDives[topic] && (
    <div className="mt-3 p-4 bg-stone-100 rounded border-l-2 border-stone-400">
      <div className="text-xs text-stone-500 mb-2 uppercase tracking-wide">Deep dive</div>
      <div className="text-sm text-stone-700 whitespace-pre-wrap">{deepDives[topic]}</div>
    </div>
  );

  const Section = ({ title, children }) => (
    <div>
      <h3 className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-3">{title}</h3>
      {children}
    </div>
  );

  const IntensityBadge = ({ level }) => {
    const colors = {
      high: 'bg-red-50 text-red-700 border-red-200',
      medium: 'bg-amber-50 text-amber-700 border-amber-200',
      low: 'bg-stone-50 text-stone-600 border-stone-200'
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded border ${colors[level?.toLowerCase()] || colors.low}`}>
        {level}
      </span>
    );
  };

  if (mode === 'signal') {
    return (
      <div className="space-y-8">
        <Section title="Summary">
          <p className="text-sm text-stone-700 leading-relaxed">{data.summary}</p>
        </Section>

        <Section title="Trending themes">
          <div className="space-y-3">
            {data.trending_themes?.map((t, i) => (
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

        <Section title="Pain points">
          <div className="space-y-2">
            {data.pain_points?.map((p, i) => (
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

        <Section title="Actionable angles">
          <div className="space-y-2">
            {data.actionable_angles?.map((a, i) => (
              <div key={i} className="p-4 bg-white border border-stone-200 rounded-lg">
                <h4 className="text-sm font-medium mb-1">{a.angle}</h4>
                <p className="text-xs text-stone-500">{a.rationale}</p>
              </div>
            ))}
          </div>
        </Section>

        {data.sources_consulted && (
          <Section title="Sources consulted">
            <p className="text-xs text-stone-500">{data.sources_consulted.join(' · ')}</p>
          </Section>
        )}
      </div>
    );
  }

  if (mode === 'opportunity') {
    return (
      <div className="space-y-8">
        <Section title="Niche overview">
          <p className="text-sm text-stone-700 leading-relaxed">{data.niche_summary}</p>
        </Section>

        <Section title="Opportunities (ranked by signal strength)">
          <div className="space-y-3">
            {data.opportunities?.map((o, i) => (
              <div key={i} className="p-5 bg-white border border-stone-200 rounded-lg">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4 className="text-sm font-medium">{o.title}</h4>
                  <IntensityBadge level={o.signal_strength} />
                </div>
                <p className="text-sm text-stone-600 mb-3">{o.pain_description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-stone-400 uppercase tracking-wide mb-1">Evidence</div>
                    <div className="text-stone-600">{o.evidence}</div>
                  </div>
                  <div>
                    <div className="text-stone-400 uppercase tracking-wide mb-1">Signal reasoning</div>
                    <div className="text-stone-600">{o.signal_reasoning}</div>
                  </div>
                  <div>
                    <div className="text-stone-400 uppercase tracking-wide mb-1">Solo operator angle</div>
                    <div className="text-stone-600">{o.solo_operator_angle}</div>
                  </div>
                  <div>
                    <div className="text-stone-400 uppercase tracking-wide mb-1">Gap in existing solutions</div>
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
          <Section title="Meta-patterns">
            <ul className="space-y-1">
              {data.patterns_noticed.map((p, i) => (
                <li key={i} className="text-sm text-stone-600 flex gap-2">
                  <span className="text-stone-400">·</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {data.sources_consulted && (
          <Section title="Sources consulted">
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

        <Section title="Act on">
          <div className="space-y-3">
            {data.act_on?.map((item, i) => (
              <div key={i} className="p-4 bg-white border border-stone-200 rounded-lg">
                <h4 className="text-sm font-medium mb-1">{item.headline}</h4>
                <p className="text-sm text-stone-600 mb-2">{item.what}</p>
                <div className="text-xs space-y-1">
                  <div><span className="text-stone-400 uppercase tracking-wide">Why: </span><span className="text-stone-600">{item.why_act}</span></div>
                  <div><span className="text-stone-400 uppercase tracking-wide">Do: </span><span className="text-stone-700">{item.suggested_action}</span></div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Watch">
          <div className="space-y-2">
            {data.watch?.map((item, i) => (
              <div key={i} className="p-4 bg-white border border-stone-200 rounded-lg">
                <h4 className="text-sm font-medium mb-1">{item.headline}</h4>
                <p className="text-sm text-stone-600 mb-1">{item.what}</p>
                <p className="text-xs text-stone-500">Watch for: {item.why_watch}</p>
              </div>
            ))}
          </div>
        </Section>

        {data.contrarian_take && (
          <Section title="Contrarian take">
            <div className="p-5 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm font-medium text-stone-900 mb-2">{data.contrarian_take.take}</p>
              <p className="text-xs text-stone-600">{data.contrarian_take.reasoning}</p>
            </div>
          </Section>
        )}

        {data.sources_consulted && (
          <Section title="Sources consulted">
            <p className="text-xs text-stone-500">{data.sources_consulted.join(' · ')}</p>
          </Section>
        )}
      </div>
    );
  }

  if (mode === 'validator') {
    const verdict = data.verdict || {};
    const verdictColors = {
      'GO': 'bg-emerald-50 border-emerald-200 text-emerald-900',
      'NO-GO': 'bg-red-50 border-red-200 text-red-900',
      'NEEDS-PIVOT': 'bg-amber-50 border-amber-200 text-amber-900'
    };

    return (
      <div className="space-y-8">
        <Section title="Idea restated">
          <p className="text-sm text-stone-700 italic">"{data.idea_restated}"</p>
        </Section>

        {verdict.lean && (
          <div className={`p-5 border rounded-lg ${verdictColors[verdict.lean] || 'bg-stone-50 border-stone-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wide opacity-70">Verdict</span>
              <span className="text-xs opacity-70">Confidence: {verdict.confidence}</span>
            </div>
            <div className="text-xl font-medium mb-2">{verdict.lean}</div>
            <p className="text-sm">{verdict.reasoning}</p>
            {verdict.if_pivot && (
              <div className="mt-3 pt-3 border-t border-current opacity-80">
                <div className="text-xs uppercase tracking-wide mb-1">Pivot direction</div>
                <p className="text-sm">{verdict.if_pivot}</p>
              </div>
            )}
          </div>
        )}

        <Section title="Existing solutions">
          <div className="space-y-2">
            {data.existing_solutions?.map((s, i) => (
              <div key={i} className="p-4 bg-white border border-stone-200 rounded-lg">
                <h4 className="text-sm font-medium mb-1">{s.name}</h4>
                <div className="text-xs space-y-1">
                  <div><span className="text-stone-400">Approach: </span><span className="text-stone-600">{s.approach}</span></div>
                  <div><span className="text-stone-400">Weakness: </span><span className="text-stone-600">{s.weakness}</span></div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {data.market_signals && (
          <Section title="Market signals">
            <div className="p-4 bg-white border border-stone-200 rounded-lg space-y-3 text-sm">
              <div>
                <div className="text-xs text-stone-400 uppercase tracking-wide mb-1">Demand evidence</div>
                <p className="text-stone-700">{data.market_signals.demand_evidence}</p>
              </div>
              <div>
                <div className="text-xs text-stone-400 uppercase tracking-wide mb-1">Pricing benchmarks</div>
                <p className="text-stone-700">{data.market_signals.pricing_benchmarks}</p>
              </div>
              <div>
                <div className="text-xs text-stone-400 uppercase tracking-wide mb-1">Size estimate</div>
                <p className="text-stone-700">{data.market_signals.size_estimate}</p>
              </div>
            </div>
          </Section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Section title="Case for">
            <ul className="space-y-2">
              {data.strongest_case_for?.map((item, i) => (
                <li key={i} className="text-sm text-stone-700 p-3 bg-emerald-50 border border-emerald-100 rounded">
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Case against">
            <ul className="space-y-2">
              {data.strongest_case_against?.map((item, i) => (
                <li key={i} className="text-sm text-stone-700 p-3 bg-red-50 border border-red-100 rounded">
                  {item}
                </li>
              ))}
            </ul>
          </Section>
        </div>

        <Section title="Hard questions to answer first">
          <ol className="space-y-2">
            {data.skeptical_questions?.map((q, i) => (
              <li key={i} className="text-sm text-stone-700 flex gap-3">
                <span className="text-stone-400 font-mono">{String(i + 1).padStart(2, '0')}</span>
                <span>{q}</span>
              </li>
            ))}
          </ol>
        </Section>

        {data.sources_consulted && (
          <Section title="Sources consulted">
            <p className="text-xs text-stone-500">{data.sources_consulted.join(' · ')}</p>
          </Section>
        )}
      </div>
    );
  }

  return <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>;
}