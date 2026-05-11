import React from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';

type Lang = 'en' | 'zh';

// ─── Static data (sourced from public reports, Indie Hackers, news 2024–2025) ─

const TOP_COMPANIES = [
  { name: 'Nomad List',    founder: 'Pieter Levels', url: 'nomadlist.com',     revenue: '~$1.6M ARR',    desc: 'City database for digital nomads. Subscription + data model.' },
  { name: 'Remote OK',     founder: 'Pieter Levels', url: 'remoteok.com',      revenue: '~$1.2M ARR',    desc: 'Remote job board. Job listing fees + sponsorships.' },
  { name: 'PhotoAI',       founder: 'Pieter Levels', url: 'photoai.com',       revenue: '~$2.0M ARR',    desc: 'AI professional photos. Built in days. Launched 2022.' },
  { name: 'Carrd',         founder: 'AJ',            url: 'carrd.co',          revenue: '~$3.0M ARR',    desc: 'One-page website builder. Bootstrapped since 2016, near-solo.' },
  { name: 'Bannerbear',    founder: 'Jon Yongfook',  url: 'bannerbear.com',    revenue: '~$70k MRR',     desc: 'Auto-generate marketing images via API. B2B subscription.' },
  { name: 'Savvycal',      founder: 'Derrick Reimer',url: 'savvycal.com',      revenue: '~$30k MRR',     desc: 'Scheduling tool built with respect for the recipient.' },
  { name: 'Interior AI',   founder: 'Pieter Levels', url: 'interiorai.com',    revenue: '~$300k ARR',    desc: 'Redesign any room with AI. Viral launch → steady revenue.' },
  { name: 'Wordle',        founder: 'Josh Wardle',   url: 'nytimes.com/games/wordle', revenue: 'Sold ~$1M+', desc: 'Daily word game built solo in weeks. Sold to NYT in 2022.' },
  { name: 'Exploding Topics', founder: 'Josh Howarth', url: 'explodingtopics.com', revenue: 'Acq. by Semrush', desc: 'Trend detection database. Acquired by Semrush 2023.' },
  { name: 'Lasso',         founder: 'Matt Giovanisci',url: 'getlasso.co',      revenue: '~$400k ARR',    desc: 'Affiliate link management for content creators.' },
  { name: 'Plausible',     founder: 'Uku Täht & Marko', url: 'plausible.io',   revenue: '~$2.0M ARR',    desc: 'Privacy-first Google Analytics alternative. 2-person team.' },
  { name: 'StatusPal',     founder: 'Juan Vega',     url: 'statuspal.io',      revenue: '~$20k MRR',     desc: 'Status page & incident management tool. Bootstrapped solo.' },
];

const DOMAINS_EN = [
  { icon: '🤖', name: 'AI Tools',               hot: true,
    participants: '10,000+ solo AI products launched since 2023',
    market:       'AI SaaS market $50B+ by 2027 (McKinsey 2024)',
    players:      'PhotoAI, InteriorAI, countless micro-tools' },
  { icon: '⚙️', name: 'SaaS Micro-tools',        hot: false,
    participants: '500,000+ indie SaaS products globally (Baremetrics 2024)',
    market:       'Typical solo ARR: $10k–$500k; $145B total SMB SaaS',
    players:      'Carrd, Bannerbear, Savvycal, Plausible' },
  { icon: '📬', name: 'Content & Newsletters',   hot: false,
    participants: '35,000+ paid newsletters on Substack alone (2025)',
    market:       '3M+ paid subscriptions; top solo newsletters earn $1M+/yr',
    players:      'The Browser, Stratechery, The Diff, Lenny\'s Newsletter' },
  { icon: '🎓', name: 'Education & Courses',     hot: false,
    participants: 'Gumroad: 100,000+ active sellers (2024)',
    market:       '$370B global e-learning market by 2026 (Global Market Insights)',
    players:      'Jack Butcher, Harry Dry, Ali Abdaal, Tiago Forte' },
  { icon: '🗺️', name: 'Marketplaces & Directories', hot: false,
    participants: 'Thousands of niche directories; low competition above $100k ARR',
    market:       'Nomad List $1.6M · Remote OK $1.2M ARR (public reports 2024)',
    players:      'Nomad List, Remote OK, Microacquire (solo origin)' },
  { icon: '🧩', name: 'No-Code & Templates',     hot: false,
    participants: '10,000+ sellers on Gumroad/Etsy/Notion alone',
    market:       'Notion template market $10M+ annually; Figma plugin ecosystem',
    players:      'Marie Poulin, Thomas Frank, Easlo' },
  { icon: '📱', name: 'Consumer Apps',            hot: false,
    participants: 'Millions of solo apps; App Store 1.8M apps (2024)',
    market:       'Top solo apps earn $100k–$5M ARR; casual games dominate',
    players:      'Wordle, many indie iOS/Android games and utilities' },
  { icon: '💻', name: 'Developer Tools',          hot: true,
    participants: '50M+ developers worldwide = one of the largest known TAMs',
    market:       'High willingness to pay ($20–$200/mo); very low churn',
    players:      'Warp, Zed, Railway — many API-first micro-tools' },
];

const DOMAINS_ZH = [
  { icon: '🤖', name: 'AI 工具',               hot: true,
    participants: '2023年以来已有10,000+单人AI产品上线',
    market:       'AI SaaS市场2027年预计超500亿美元（麦肯锡2024）',
    players:      'PhotoAI、InteriorAI及大量微型工具' },
  { icon: '⚙️', name: 'SaaS 微型工具',          hot: false,
    participants: '全球50万+独立SaaS产品（Baremetrics 2024）',
    market:       '单人运营者典型年收入：1万–50万美元；中小企业SaaS总规模1450亿美元',
    players:      'Carrd、Bannerbear、Savvycal、Plausible' },
  { icon: '📬', name: '内容与Newsletter',        hot: false,
    participants: 'Substack平台已有35,000+付费Newsletter（2025年）',
    market:       '300万+付费订阅；头部单人Newsletter年收超100万美元',
    players:      'The Browser、Stratechery、The Diff、Lenny\'s Newsletter' },
  { icon: '🎓', name: '教育与课程',              hot: false,
    participants: 'Gumroad平台10万+活跃卖家（2024年）',
    market:       '2026年全球在线教育市场3700亿美元（Global Market Insights）',
    players:      'Jack Butcher、Harry Dry、Ali Abdaal、Tiago Forte' },
  { icon: '🗺️', name: '垂直目录与市场',          hot: false,
    participants: '数千个细分目录；年收10万美元以上竞争极少',
    market:       'Nomad List 160万美元 · Remote OK 120万美元ARR（2024年公开数据）',
    players:      'Nomad List、Remote OK' },
  { icon: '🧩', name: '无代码与模板',            hot: false,
    participants: 'Gumroad/Etsy/Notion上已有10,000+卖家',
    market:       'Notion模板市场年规模超1000万美元；Figma插件生态快速增长',
    players:      'Marie Poulin、Thomas Frank、Easlo' },
  { icon: '📱', name: '消费者应用',              hot: false,
    participants: 'App Store共180万+应用，独立开发者占主体（2024年）',
    market:       '头部单人应用年收10万–500万美元；休闲游戏为主',
    players:      'Wordle及大量独立iOS/Android游戏和工具' },
  { icon: '💻', name: '开发者工具',              hot: true,
    participants: '全球5000万+开发者 = 已知最大TAM之一',
    market:       '付费意愿强（每月20–200美元）；流失率极低',
    players:      'Warp、Zed、Railway及大量API微工具' },
];

const HISTORY_EN = [
  { year: '2004', text: '37signals publishes "Getting Real" — a manifesto for lean software that plants the seed for solo SaaS.' },
  { year: '2008', text: 'App Store launches. Independent developers gain overnight distribution to hundreds of millions of devices.' },
  { year: '2012', text: 'Stripe and Gumroad remove the last payment friction. Any solo creator can now charge for software or digital goods.' },
  { year: '2016', text: 'Indie Hackers launches. Solo business stories go mainstream; the community eventually reaches millions.' },
  { year: '2017', text: 'Pieter Levels publicly documents hitting $1M ARR running multiple solo products. "Build in public" becomes a movement.' },
  { year: '2020', text: 'COVID accelerates remote work. No-code tools (Webflow, Notion, Zapier) make building without a team trivial.' },
  { year: '2023', text: 'AI tools (ChatGPT, Claude, Cursor, Midjourney) give solo operators the output of a full team. The ceiling explodes.' },
  { year: '2025', text: 'Seven-figure solo businesses are no longer remarkable. Pieter Levels reportedly clears $5.8M ARR. The playbook is proven.' },
];

const HISTORY_ZH = [
  { year: '2004', text: '37signals发布《Getting Real》——精简软件团队宣言，为独立SaaS埋下种子。' },
  { year: '2008', text: 'App Store上线，独立开发者一夜间获得向数亿用户分发产品的能力。' },
  { year: '2012', text: 'Stripe和Gumroad消除最后的支付门槛，任何单人创作者都能为软件或数字产品收费。' },
  { year: '2016', text: 'Indie Hackers上线，单人商业故事进入主流视野，社区规模最终达数百万。' },
  { year: '2017', text: 'Pieter Levels公开记录以多个单人产品年收突破100万美元，"公开构建"成为一种运动。' },
  { year: '2020', text: '新冠疫情推动远程办公，无代码工具（Webflow、Notion、Zapier）让无团队创业唾手可得。' },
  { year: '2023', text: 'AI工具（ChatGPT、Claude、Cursor、Midjourney）赋予单人运营者整个团队的产出能力，生产力上限彻底打开。' },
  { year: '2025', text: '七位数一人公司已不再稀奇。Pieter Levels据报年收入达580万美元，这套玩法已被充分验证。' },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  lang: Lang;
  onLangChange: (l: Lang) => void;
  onEnter: () => void;
}

export default function CoverPage({ lang, onLangChange, onEnter }: Props) {
  const zh = lang === 'zh';
  const DOMAINS  = zh ? DOMAINS_ZH  : DOMAINS_EN;
  const HISTORY  = zh ? HISTORY_ZH  : HISTORY_EN;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">

      {/* ── Fixed nav ── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-stone-50/90 backdrop-blur border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-sm font-medium tracking-tight">
            {zh ? '单兵作战舱' : 'Solo Operator Cockpit'}
          </span>
          <div className="flex items-center gap-3">
            {/* lang toggle */}
            <div className="flex rounded-md border border-stone-200 overflow-hidden text-xs">
              <button
                onClick={() => onLangChange('en')}
                className={`px-3 py-1.5 transition-colors ${lang === 'en' ? 'bg-stone-900 text-white' : 'bg-white text-stone-500 hover:text-stone-900'}`}
              >EN</button>
              <button
                onClick={() => onLangChange('zh')}
                className={`px-3 py-1.5 border-l border-stone-200 transition-colors ${lang === 'zh' ? 'bg-stone-900 text-white' : 'bg-white text-stone-500 hover:text-stone-900'}`}
              >中文</button>
            </div>
            <button
              onClick={onEnter}
              className="flex items-center gap-1.5 text-xs bg-stone-900 text-white px-4 py-2 rounded-md hover:bg-stone-700 transition-colors"
            >
              {zh ? '进入作战舱' : 'Enter Cockpit'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-40 pb-24 px-6 bg-stone-900 text-white">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-medium tracking-widest text-stone-500 uppercase mb-5">
            {zh ? '新商业范式 · 2026' : 'A new kind of business · 2026'}
          </p>
          <h1 className="text-5xl md:text-6xl font-medium tracking-tight leading-[1.25] mb-8">
            {zh
              ? <>一个人 <br />一家公司</>
              : <>One Person.<br />One Company.</>}
          </h1>
          <p className="text-lg text-stone-300 leading-relaxed max-w-2xl mb-10">
            {zh
              ? '一人公司由一个人全权运营——没有联合创始人、没有员工、没有投资人施压。它不是副业，也不是传统创业公司，而是一种深思熟虑的选择：打造有价值的产品，独享全部利润，只对自己负责。产品在你入睡时持续赚钱，杠杆来自软件、系统，以及如今的AI。'
              : 'A one-person company is a business run entirely by a single individual — no co-founders, no employees, no investors breathing down your neck. Not a side hustle, not a startup. A deliberate choice to build something valuable, keep all the margin, and answer to no one. The product earns while you sleep. The leverage comes from software, systems, and now AI.'}
          </p>
          <button
            onClick={onEnter}
            className="inline-flex items-center gap-2 bg-white text-stone-900 px-6 py-3 rounded-lg text-sm font-medium hover:bg-stone-100 transition-colors"
          >
            {zh ? '开始探索你的赛道' : 'Start researching your opportunity'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ── Key stats ── */}
      <section className="bg-stone-800 text-white py-10 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {(zh ? [
            { n: '$5.8M',   label: 'Pieter Levels 2025年年收入（单人）' },
            { n: '3M+',     label: 'Substack付费订阅（来自独立Newsletter）' },
            { n: '10,000+', label: '2023年以来上线的单人AI产品' },
            { n: '$370B',   label: '2026年全球在线教育市场规模' },
          ] : [
            { n: '$5.8M',   label: "Pieter Levels' estimated 2025 ARR — solo" },
            { n: '3M+',     label: 'Substack paid subscriptions across solo newsletters' },
            { n: '10,000+', label: 'solo AI products launched since 2023' },
            { n: '$370B',   label: 'global e-learning market by 2026' },
          ]).map((s, i) => (
            <div key={i}>
              <div className="text-3xl font-mono font-medium mb-1">{s.n}</div>
              <div className="text-xs text-stone-400 leading-snug">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Short history ── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xs font-medium text-stone-400 uppercase tracking-widest mb-10">
            {zh ? '简史' : 'A short history'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
            {HISTORY.map((h, i) => (
              <div key={i} className="flex gap-5 pb-6 mb-6 border-b border-stone-100 last:border-0">
                <div className="text-sm font-mono font-medium text-stone-400 w-12 shrink-0 pt-0.5">{h.year}</div>
                <p className="text-sm text-stone-600 leading-relaxed">{h.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Top companies ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xs font-medium text-stone-400 uppercase tracking-widest mb-2">
            {zh ? '标杆案例' : 'Benchmark companies'}
          </h2>
          <p className="text-sm text-stone-400 mb-10">
            {zh
              ? '全球最知名的一人（或近乎一人）公司 — 按已知收入数据整理，数据来自公开报告'
              : 'The world\'s most notable one-person (or near-solo) businesses — public revenue data as of 2024–2025'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {TOP_COMPANIES.map((co, i) => (
              <div key={i} className="p-4 border border-stone-200 rounded-lg hover:border-stone-400 transition-colors group">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-sm font-medium">{co.name}</h3>
                  <a
                    href={`https://${co.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-300 group-hover:text-stone-600 transition-colors shrink-0 ml-2"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="text-xs text-stone-400 mb-1">{co.founder}</div>
                <a
                  href={`https://${co.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-stone-400 hover:text-stone-600 underline underline-offset-2 block mb-2 truncate"
                >
                  {co.url}
                </a>
                <div className="inline-block text-xs font-mono font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded px-2 py-0.5 mb-3">
                  {co.revenue}
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">{co.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Domain categories ── */}
      <section className="py-20 px-6 bg-stone-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xs font-medium text-stone-400 uppercase tracking-widest mb-2">
            {zh ? '主要赛道' : 'Main domains'}
          </h2>
          <p className="text-sm text-stone-400 mb-10">
            {zh
              ? '一人公司的八大活跃赛道 — 市场规模、参与者数量与代表性玩家'
              : 'Eight active domains where one-person companies thrive — market context, participant scale, and key players'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DOMAINS.map((d, i) => (
              <div
                key={i}
                className={`p-5 border rounded-lg ${d.hot ? 'border-amber-200 bg-amber-50' : 'border-stone-200 bg-white'}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl leading-none">{d.icon}</span>
                  <h3 className="text-sm font-medium leading-tight">{d.name}</h3>
                  {d.hot && (
                    <span className="ml-auto text-xs px-1.5 py-0.5 bg-amber-200 text-amber-800 rounded font-medium shrink-0">
                      {zh ? '热门' : 'Hot'}
                    </span>
                  )}
                </div>
                <div className="space-y-2.5 text-xs">
                  <div>
                    <div className="text-stone-400 uppercase tracking-wide mb-1 text-[10px]">
                      {zh ? '参与者规模' : 'Participants'}
                    </div>
                    <div className="text-stone-700 leading-relaxed">{d.participants}</div>
                  </div>
                  <div className="border-t border-stone-100 pt-2.5">
                    <div className="text-stone-400 uppercase tracking-wide mb-1 text-[10px]">
                      {zh ? '市场规模' : 'Market'}
                    </div>
                    <div className="text-stone-600 leading-relaxed">{d.market}</div>
                  </div>
                  <div className="border-t border-stone-100 pt-2.5">
                    <div className="text-stone-400 uppercase tracking-wide mb-1 text-[10px]">
                      {zh ? '代表性玩家' : 'Key players'}
                    </div>
                    <div className="text-stone-500 leading-relaxed">{d.players}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-24 px-6 bg-stone-900 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-medium mb-4">
            {zh ? '是时候找到你的赛道了' : 'Time to find your lane'}
          </h2>
          <p className="text-stone-400 text-sm leading-relaxed mb-8">
            {zh
              ? '使用单兵作战舱扫描信号、挖掘机会、验证想法。每次运行都基于实时网络数据，不是通用建议。'
              : 'Use the cockpit to scan signals, mine opportunities, and validate ideas. Every run is grounded in live web data — not generic advice.'}
          </p>
          <button
            onClick={onEnter}
            className="inline-flex items-center gap-2 bg-white text-stone-900 px-8 py-3 rounded-lg text-sm font-medium hover:bg-stone-100 transition-colors"
          >
            {zh ? '进入作战舱' : 'Enter the Cockpit'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ── Footer note ── */}
      <div className="py-5 text-center text-xs text-stone-400 border-t border-stone-200">
        {zh
          ? '数据来源：公开收入报告、Indie Hackers、Product Hunt、McKinsey、Global Market Insights（2024–2025）'
          : 'Data sourced from public revenue reports, Indie Hackers, Product Hunt, McKinsey, Global Market Insights (2024–2025)'}
      </div>
    </div>
  );
}
