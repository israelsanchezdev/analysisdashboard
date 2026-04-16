import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, LayoutGrid, Rss, Link2, Shield, ChevronRight,
  Check, Zap, Users, BarChart3, Globe, ArrowRight,
} from 'lucide-react';

// ─── Mock dashboard preview data ───────────────────────────────────────────

const MOCK_CARDS = [
  {
    name: 'Apple', domain: 'apple.com', threat: 5, threatLabel: 'Critical', threatColor: '#f85149',
    tags: [{ label: 'Hardware', color: '#58a6ff' }, { label: 'Consumer', color: '#3fb950' }],
    links: ['💰 Pricing', 'in LinkedIn', 'CB Crunchbase'],
    swot: 'Unmatched brand loyalty, tight hardware-software integration.',
  },
  {
    name: 'Google', domain: 'google.com', threat: 5, threatLabel: 'Critical', threatColor: '#f85149',
    tags: [{ label: 'AI', color: '#e3b341' }, { label: 'Cloud', color: '#58a6ff' }],
    links: ['in LinkedIn', 'GH GitHub', '𝕏 Twitter'],
    swot: '90%+ search market share, massive AI compute infrastructure.',
  },
  {
    name: 'Microsoft', domain: 'microsoft.com', threat: 4, threatLabel: 'High', threatColor: '#f0883e',
    tags: [{ label: 'AI', color: '#e3b341' }, { label: 'Enterprise', color: '#a371f7' }],
    links: ['💰 Pricing', 'GH GitHub'],
    swot: 'Enterprise lock-in via Office 365, OpenAI partnership.',
  },
];

function MockCard({ card, dim = false }: { card: typeof MOCK_CARDS[0]; dim?: boolean }) {
  return (
    <div className={`rounded-lg border border-surface-600 bg-surface-700 text-left transition-all ${dim ? 'opacity-40' : ''}`}>
      <div className="h-0.5 rounded-t-lg" style={{ backgroundColor: card.threatColor }} />
      <div className="flex items-center gap-2 px-3 py-2.5">
        <img src={`https://www.google.com/s2/favicons?domain=${card.domain}&sz=32`} className="w-4 h-4 rounded" alt="" />
        <span className="text-white text-xs font-medium flex-1">{card.name}</span>
        <span className="text-xs font-semibold px-1.5 py-0.5 rounded"
          style={{ color: card.threatColor, backgroundColor: `${card.threatColor}20` }}>
          {card.threatLabel}
        </span>
      </div>
      <div className="px-3 pb-2 flex flex-wrap gap-1">
        {card.tags.map((t) => (
          <span key={t.label} className="text-[10px] px-1.5 py-0.5 rounded-full border"
            style={{ color: t.color, borderColor: `${t.color}40`, backgroundColor: `${t.color}15` }}>
            {t.label}
          </span>
        ))}
      </div>
      <p className="px-3 pb-2 text-[10px] text-surface-500 leading-relaxed line-clamp-1">{card.swot}</p>
      <div className="px-3 pb-2.5 flex flex-wrap gap-1">
        {card.links.map((l) => (
          <span key={l} className="text-[10px] px-1.5 py-0.5 bg-surface-600 text-surface-300 rounded">{l}</span>
        ))}
      </div>
    </div>
  );
}

function MockBoard() {
  return (
    <div className="flex gap-3 scale-95 origin-top">
      {/* Direct column */}
      <div className="w-52 flex-shrink-0">
        <div className="flex items-center gap-1.5 mb-2 px-0.5">
          <span className="w-2 h-2 rounded-full bg-danger" />
          <span className="text-xs font-medium text-white">Direct</span>
          <span className="text-[10px] text-surface-500 bg-surface-700 px-1.5 py-0.5 rounded-full">2</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium ml-auto"
            style={{ color: '#f85149', backgroundColor: '#f8514920' }}>⚠ 5/5</span>
        </div>
        <div className="bg-surface-800/40 rounded-lg p-1.5 flex flex-col gap-1.5">
          <MockCard card={MOCK_CARDS[0]} />
          <MockCard card={MOCK_CARDS[1]} />
        </div>
      </div>
      {/* Indirect column */}
      <div className="w-52 flex-shrink-0">
        <div className="flex items-center gap-1.5 mb-2 px-0.5">
          <span className="w-2 h-2 rounded-full bg-warning" />
          <span className="text-xs font-medium text-white">Indirect</span>
          <span className="text-[10px] text-surface-500 bg-surface-700 px-1.5 py-0.5 rounded-full">1</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium ml-auto"
            style={{ color: '#f0883e', backgroundColor: '#f0883e20' }}>⚠ 4/5</span>
        </div>
        <div className="bg-surface-800/40 rounded-lg p-1.5">
          <MockCard card={MOCK_CARDS[2]} />
        </div>
      </div>
      {/* Watching column (faded) */}
      <div className="w-52 flex-shrink-0 opacity-60">
        <div className="flex items-center gap-1.5 mb-2 px-0.5">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span className="text-xs font-medium text-white">Watching</span>
          <span className="text-[10px] text-surface-500 bg-surface-700 px-1.5 py-0.5 rounded-full">2</span>
        </div>
        <div className="bg-surface-800/40 rounded-lg p-1.5 flex flex-col gap-1.5">
          {[
            { name: 'Tesla', domain: 'tesla.com', threat: 3, threatLabel: 'Moderate', threatColor: '#e3b341', tags: [{ label: 'EV', color: '#3fb950' }], links: ['𝕏 Twitter'], swot: 'Supercharger network, FSD data advantage.' },
            { name: 'Meta', domain: 'meta.com', threat: 2, threatLabel: 'Guarded', threatColor: '#7ee787', tags: [{ label: 'Social', color: '#79c0ff' }], links: ['in LinkedIn'], swot: '3B+ daily users, Llama open-source AI.' },
          ].map((c) => <MockCard key={c.name} card={c} />)}
        </div>
      </div>
    </div>
  );
}

// ─── Features ──────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: <LayoutGrid className="w-5 h-5" />,
    color: '#58a6ff',
    title: 'Kanban Intelligence Board',
    desc: 'Organize competitors into Direct, Indirect, and Watching columns. Drag cards between columns as the market shifts.',
  },
  {
    icon: <Shield className="w-5 h-5" />,
    color: '#f85149',
    title: 'Threat Level Scoring',
    desc: 'Rate every competitor 1–5. Color-coded stripes and column-wide averages give you an instant threat heat map.',
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    color: '#3fb950',
    title: 'SWOT Analysis',
    desc: 'Structured Strengths, Weaknesses, Opportunities, and Threats per competitor — always one click away on every card.',
  },
  {
    icon: <Rss className="w-5 h-5" />,
    color: '#e3b341',
    title: 'Live News Feed',
    desc: 'Each card pulls the last 30 days of real news and discussions about that company. No manual searching required.',
  },
  {
    icon: <Link2 className="w-5 h-5" />,
    color: '#a371f7',
    title: 'Quick Links',
    desc: 'Pin their Pricing page, LinkedIn, Crunchbase, GitHub, and Twitter directly to the card. Everything one click away.',
  },
  {
    icon: <Globe className="w-5 h-5" />,
    color: '#79c0ff',
    title: 'Drop a URL to Add',
    desc: 'Drag any link from your browser into the board. The competitor is added instantly with auto-filled details.',
  },
];

// ─── Pricing ───────────────────────────────────────────────────────────────

const PLANS = [
  {
    name: 'Starter',
    price: 'Free',
    sub: 'forever',
    color: '#484f58',
    features: ['Up to 5 competitors', 'Kanban board', 'Tags & notes', 'Drag & drop'],
    cta: 'Get started free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$29',
    sub: 'per month',
    color: '#58a6ff',
    features: ['Unlimited competitors', 'Threat level scoring', 'SWOT analysis', 'Live news feed', 'Quick links', 'CSV export'],
    cta: 'Start 14-day free trial',
    highlight: true,
  },
  {
    name: 'Team',
    price: '$79',
    sub: 'per month',
    color: '#a371f7',
    features: ['Everything in Pro', 'Up to 10 team members', 'Shared boards', 'Custom columns', 'API access', 'Priority support'],
    cta: 'Contact us',
    highlight: false,
  },
];

// ─── Component ─────────────────────────────────────────────────────────────

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-900 text-white">

      {/* ── Nav ── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-surface-900/80 backdrop-blur border-b border-surface-700/50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-accent" />
            </div>
            <span className="font-semibold text-sm">CompeteIQ</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-surface-500">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/login')}
              className="text-sm text-surface-500 hover:text-white transition">
              Sign in
            </button>
            <button onClick={() => navigate('/login')}
              className="text-sm bg-accent hover:bg-accent-hover text-surface-900 font-medium px-4 py-1.5 rounded-lg transition">
              Start free
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute top-40 left-1/3 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto relative">
          <div className="max-w-2xl mx-auto text-center mb-12">
            {/* Badge */}
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border border-accent/30 bg-accent/10 text-accent mb-6">
              <Zap className="w-3 h-3" /> Built for founders & CEOs
            </span>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
              Know your{' '}
              <span className="bg-gradient-to-r from-accent via-purple-400 to-accent bg-clip-text text-transparent">
                competition
              </span>
              <br />before they know you
            </h1>
            <p className="text-surface-500 text-lg leading-relaxed mb-8">
              A live intelligence board for tracking competitors — with SWOT analysis, threat scoring,
              real-time news, and quick access to everything that matters. All in one place.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button onClick={() => navigate('/login')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-surface-900 font-semibold px-6 py-3 rounded-xl text-sm transition">
                Start for free <ArrowRight className="w-4 h-4" />
              </button>
              <a href="#features"
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 text-sm text-surface-500 hover:text-white border border-surface-600 hover:border-surface-500 px-6 py-3 rounded-xl transition">
                See the features <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Dashboard preview */}
          <div className="relative mx-auto max-w-4xl">
            {/* Glow under the preview */}
            <div className="absolute -inset-4 bg-gradient-to-b from-accent/10 to-transparent rounded-2xl blur-xl pointer-events-none" />
            <div className="relative bg-surface-800 border border-surface-600 rounded-xl overflow-hidden shadow-2xl">
              {/* Fake browser chrome */}
              <div className="flex items-center gap-1.5 px-4 py-3 bg-surface-800 border-b border-surface-600">
                <span className="w-2.5 h-2.5 rounded-full bg-danger/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-warning/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-success/70" />
                <span className="flex-1 mx-3 bg-surface-700 rounded-md text-[10px] text-surface-500 px-3 py-1 text-center">
                  app.competeiq.io/dashboard
                </span>
              </div>
              {/* Fake top nav */}
              <div className="flex items-center gap-3 px-4 py-2.5 bg-surface-800 border-b border-surface-600">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-accent" />
                  <span className="text-xs font-semibold text-white">CompeteIQ</span>
                </div>
                <div className="flex-1 max-w-xs bg-surface-700 rounded-md h-6 ml-2" />
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-[10px] text-surface-500">6 tracked</span>
                  <span className="text-[10px] text-danger font-medium">3 direct</span>
                  <div className="w-14 h-6 bg-accent rounded-md text-[10px] text-surface-900 font-medium flex items-center justify-center">+ Add</div>
                </div>
              </div>
              {/* Board */}
              <div className="p-4 overflow-x-auto bg-surface-900">
                <MockBoard />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Logos ── */}
      <section className="py-10 px-6 border-y border-surface-700/50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-surface-500 uppercase tracking-widest mb-6">Track companies like</p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {['apple.com', 'google.com', 'microsoft.com', 'amazon.com', 'tesla.com', 'meta.com', 'netflix.com', 'openai.com'].map((domain) => (
              <div key={domain} className="flex items-center gap-2 text-surface-500 hover:text-white transition">
                <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`} className="w-5 h-5 rounded" alt="" />
                <span className="text-sm">{domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-4">Everything you need to stay ahead</h2>
            <p className="text-surface-500 max-w-lg mx-auto">
              Built specifically for founders and CEOs who need to move fast and stay informed —
              not drown in spreadsheets.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title}
                className="bg-surface-800 border border-surface-600 hover:border-surface-500 rounded-xl p-6 transition group">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4 transition"
                  style={{ backgroundColor: `${f.color}20`, color: f.color }}>
                  {f.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                <p className="text-surface-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SWOT Highlight ── */}
      <section className="py-16 px-6 bg-surface-800/40 border-y border-surface-700/50">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <span className="text-xs font-medium text-accent uppercase tracking-widest mb-3 block">SWOT Analysis</span>
            <h2 className="text-3xl font-bold mb-4">Turn intuition into structured intel</h2>
            <p className="text-surface-500 leading-relaxed mb-6">
              Stop keeping competitor knowledge locked in your head or scattered across notes.
              Every card has a full SWOT breakdown — always one tap away, right inside the board.
            </p>
            <button onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent-hover transition font-medium">
              Try it now <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {/* SWOT visual */}
          <div className="flex-1 w-full">
            <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
              {[
                { label: 'Strengths', color: '#3fb950', text: 'Brand loyalty, ecosystem lock-in, $3T market cap.' },
                { label: 'Weaknesses', color: '#f85149', text: 'Closed ecosystem; premium pricing excludes mass market.' },
                { label: 'Opportunities', color: '#58a6ff', text: 'Spatial computing, generative AI, financial services.' },
                { label: 'Threats', color: '#e3b341', text: 'Antitrust pressure on App Store; China slowdown.' },
              ].map(({ label, color, text }) => (
                <div key={label} className="rounded-xl p-4 border"
                  style={{ borderColor: `${color}30`, backgroundColor: `${color}08` }}>
                  <p className="text-xs font-semibold mb-1.5" style={{ color }}>{label}</p>
                  <p className="text-xs text-surface-500 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-surface-500">Start free. Upgrade when you're ready to go deeper.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <div key={plan.name}
                className={`relative rounded-2xl p-6 border flex flex-col transition ${
                  plan.highlight
                    ? 'border-accent bg-accent/5 shadow-lg shadow-accent/10'
                    : 'border-surface-600 bg-surface-800'
                }`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="text-xs font-semibold bg-accent text-surface-900 px-3 py-1 rounded-full">
                      Most popular
                    </span>
                  </div>
                )}
                <div className="mb-5">
                  <p className="text-sm font-medium mb-1" style={{ color: plan.color }}>{plan.name}</p>
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                    <span className="text-surface-500 text-sm pb-0.5">/ {plan.sub}</span>
                  </div>
                </div>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-surface-500">
                      <Check className="w-4 h-4 flex-shrink-0" style={{ color: plan.color }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/login')}
                  className={`w-full py-2.5 rounded-xl text-sm font-medium transition ${
                    plan.highlight
                      ? 'bg-accent hover:bg-accent-hover text-surface-900'
                      : 'border border-surface-600 hover:border-surface-500 text-white'
                  }`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-purple-500/10 to-accent/10 rounded-3xl blur-2xl pointer-events-none" />
            <div className="relative bg-surface-800 border border-surface-600 rounded-2xl px-8 py-14">
              <Users className="w-8 h-8 text-accent mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Ready to outmaneuver the competition?</h2>
              <p className="text-surface-500 mb-8 leading-relaxed">
                Join founders and CEOs who use CompeteIQ to stay one step ahead.
                Free to start. No credit card required.
              </p>
              <button onClick={() => navigate('/login')}
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-surface-900 font-semibold px-8 py-3 rounded-xl text-sm transition">
                Start for free <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-surface-700/50 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-surface-500">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span className="font-medium text-white">CompeteIQ</span>
            <span>— Know your competition.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
            <button onClick={() => navigate('/login')} className="hover:text-white transition">Sign in</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
