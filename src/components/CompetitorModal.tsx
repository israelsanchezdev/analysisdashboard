import { useState, useEffect, useRef } from 'react';
import { X, Plus, Loader2, Sparkles, ExternalLink, Trash2 } from 'lucide-react';
import type { Competitor, ColumnId, Tag, ThreatLevel, QuickLink, QuickLinkType, SwotAnalysis, CompanyIntel } from '../types';
import { COLUMNS, THREAT_COLORS, THREAT_LABELS, QUICK_LINK_PRESETS, EMPTY_INTEL } from '../types';
import { useCompetitorStore, EMPTY_SWOT } from '../store/useCompetitorStore';
import { fetchWikipediaSummary } from '../hooks/useWikipediaSummary';

interface Props {
  open: boolean;
  onClose: () => void;
  defaultColumn?: ColumnId;
  editing?: Competitor | null;
  prefillUrl?: string;
}

const TAG_COLORS = ['#58a6ff', '#3fb950', '#e3b341', '#f85149', '#a371f7', '#f78166', '#79c0ff'];
type Tab = 'details' | 'swot' | 'links';

export default function CompetitorModal({ open, onClose, defaultColumn = 'watching', editing, prefillUrl }: Props) {
  const { addCompetitor, updateCompetitor } = useCompetitorStore();
  const [tab, setTab] = useState<Tab>('details');

  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [columnId, setColumnId] = useState<ColumnId>(defaultColumn);
  const [threatLevel, setThreatLevel] = useState<ThreatLevel>(3);
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [tagColor, setTagColor] = useState(TAG_COLORS[0]);
  const [wikiLoading, setWikiLoading] = useState(false);

  const [swot, setSwot] = useState<SwotAnalysis>(EMPTY_SWOT);
  const [intel, setIntel] = useState<CompanyIntel>(EMPTY_INTEL);

  const [links, setLinks] = useState<QuickLink[]>([]);
  const [linkType, setLinkType] = useState<QuickLinkType>('pricing');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkLabel, setLinkLabel] = useState('');

  const tagInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setTab('details');
    if (editing) {
      setName(editing.name); setUrl(editing.url); setDescription(editing.description);
      setNotes(editing.notes); setColumnId(editing.columnId); setTags(editing.tags);
      setThreatLevel(editing.threatLevel ?? 3);
      setSwot(editing.swot ?? EMPTY_SWOT);
      setLinks(editing.links ?? []);
      setIntel(editing.intel ?? EMPTY_INTEL);
    } else {
      setName(''); setUrl(prefillUrl || ''); setDescription(''); setNotes('');
      setColumnId(defaultColumn); setTags([]); setThreatLevel(3);
      setSwot(EMPTY_SWOT); setLinks([]); setIntel(EMPTY_INTEL);
    }
    setTagInput(''); setTagColor(TAG_COLORS[0]);
    setLinkType('pricing'); setLinkUrl(''); setLinkLabel('');
  }, [open, editing, prefillUrl, defaultColumn]);

  if (!open) return null;

  function addTag() {
    const label = tagInput.trim();
    if (!label) return;
    setTags((p) => [...p, { id: crypto.randomUUID(), label, color: tagColor }]);
    setTagInput('');
    tagInputRef.current?.focus();
  }

  function addLink() {
    const u = linkUrl.trim();
    if (!u) return;
    const label = linkLabel.trim() || QUICK_LINK_PRESETS[linkType].label;
    setLinks((p) => [...p, { id: crypto.randomUUID(), label, url: u, type: linkType }]);
    setLinkUrl(''); setLinkLabel('');
  }

  async function autoPopulate() {
    const query = name.trim() || (() => {
      try { return new URL(url).hostname.replace('www.', '').split('.')[0]; } catch { return ''; }
    })();
    if (!query) return;
    setWikiLoading(true);
    const result = await fetchWikipediaSummary(query);
    setWikiLoading(false);
    if (result) setDescription(result.description);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const favicon = `https://www.google.com/s2/favicons?domain=${url}&sz=32`;
    const payload = { name, url, favicon, description, notes, columnId, tags, threatLevel, swot, links, intel, activityLog: editing?.activityLog ?? [], metrics: editing?.metrics ?? [] };
    if (editing) updateCompetitor(editing.id, payload);
    else addCompetitor(payload);
    onClose();
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: 'details', label: 'Details' },
    { id: 'swot', label: 'SWOT' },
    { id: 'links', label: 'Quick Links' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-800 border border-surface-600 rounded-xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-600 flex-shrink-0">
          <h2 className="text-white font-medium">{editing ? 'Edit competitor' : 'Add competitor'}</h2>
          <button onClick={onClose} className="text-surface-500 hover:text-white transition"><X className="w-5 h-5" /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-surface-600 flex-shrink-0">
          {TABS.map((t) => (
            <button key={t.id} type="button" onClick={() => setTab(t.id)}
              className={`px-5 py-2.5 text-sm transition border-b-2 -mb-px ${
                tab === t.id ? 'border-accent text-accent' : 'border-transparent text-surface-500 hover:text-white'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          <form id="competitor-form" onSubmit={handleSubmit}>

            {/* DETAILS TAB */}
            {tab === 'details' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-surface-500 mb-1.5">Company name *</label>
                    <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Apple Inc"
                      className="w-full bg-surface-700 border border-surface-600 text-white rounded-lg px-3 py-2 text-sm placeholder-surface-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition" />
                  </div>
                  <div>
                    <label className="block text-xs text-surface-500 mb-1.5">Column</label>
                    <select value={columnId} onChange={(e) => setColumnId(e.target.value as ColumnId)}
                      className="w-full bg-surface-700 border border-surface-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition">
                      {COLUMNS.map((col) => <option key={col.id} value={col.id}>{col.title}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-surface-500 mb-1.5">Website URL *</label>
                  <input required type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://apple.com"
                    className="w-full bg-surface-700 border border-surface-600 text-white rounded-lg px-3 py-2 text-sm placeholder-surface-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition" />
                </div>

                {/* Threat Level */}
                <div>
                  <label className="block text-xs text-surface-500 mb-2">Threat Level</label>
                  <div className="flex items-center gap-1.5">
                    {([1, 2, 3, 4, 5] as ThreatLevel[]).map((lvl) => (
                      <button key={lvl} type="button" onClick={() => setThreatLevel(lvl)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition ${
                          threatLevel === lvl ? 'text-surface-900 border-transparent' : 'text-surface-500 border-surface-600 hover:border-surface-500'
                        }`}
                        style={threatLevel === lvl ? { backgroundColor: THREAT_COLORS[lvl], borderColor: THREAT_COLORS[lvl] } : {}}>
                        {lvl} · {THREAT_LABELS[lvl]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs text-surface-500">Description</label>
                    <button type="button" onClick={autoPopulate} disabled={wikiLoading || (!name && !url)}
                      className="flex items-center gap-1 text-xs text-accent hover:text-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition">
                      {wikiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      Auto-fill from Wikipedia
                    </button>
                  </div>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                    placeholder="What they do, target market…" rows={2}
                    className="w-full bg-surface-700 border border-surface-600 text-white rounded-lg px-3 py-2 text-sm placeholder-surface-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition resize-none" />
                </div>

                {/* Intel fields */}
                <div>
                  <label className="block text-xs text-surface-500 mb-2">Company Intel</label>
                  <div className="grid grid-cols-2 gap-2">
                    {([
                      { key: 'location',  placeholder: 'e.g. Austin, TX',   label: '📍 Location' },
                      { key: 'founded',   placeholder: 'e.g. 2018',          label: '📅 Founded' },
                      { key: 'employees', placeholder: 'e.g. 50–200',        label: '👥 Employees' },
                      { key: 'revenue',   placeholder: 'e.g. ~$5M/yr',       label: '💰 Revenue' },
                    ] as const).map(({ key, placeholder, label }) => (
                      <div key={key}>
                        <label className="block text-[10px] text-surface-500 mb-1">{label}</label>
                        <input
                          value={intel[key]}
                          onChange={(e) => setIntel((p) => ({ ...p, [key]: e.target.value }))}
                          placeholder={placeholder}
                          className="w-full bg-surface-700 border border-surface-600 text-white rounded-lg px-3 py-1.5 text-xs placeholder-surface-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-surface-500 mb-1.5">Notes</label>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                    placeholder="Pricing intel, recent moves, watch items…" rows={3}
                    className="w-full bg-surface-700 border border-surface-600 text-white rounded-lg px-3 py-2 text-sm placeholder-surface-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition resize-none" />
                </div>
              </div>
            )}

            {/* SWOT TAB */}
            {tab === 'swot' && (
              <div className="grid grid-cols-2 gap-3">
                {([
                  { key: 'strengths',     label: '💪 Strengths',      color: '#3fb950', placeholder: 'What do they do better than anyone?' },
                  { key: 'weaknesses',    label: '🩹 Weaknesses',     color: '#f85149', placeholder: 'Where are they vulnerable?' },
                  { key: 'opportunities', label: '🚀 Opportunities',  color: '#58a6ff', placeholder: 'What could accelerate their growth?' },
                  { key: 'threats',       label: '⚡ Threats',        color: '#e3b341', placeholder: 'What could hurt them — or you?' },
                ] as const).map(({ key, label, color, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-medium mb-1.5" style={{ color }}>{label}</label>
                    <textarea value={swot[key]} onChange={(e) => setSwot((s) => ({ ...s, [key]: e.target.value }))}
                      placeholder={placeholder} rows={5}
                      className="w-full bg-surface-700 border text-white rounded-lg px-3 py-2 text-xs placeholder-surface-500 focus:outline-none focus:ring-1 transition resize-none"
                      style={{ borderColor: `${color}40` }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = color; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = `${color}40`; }} />
                  </div>
                ))}
              </div>
            )}

            {/* LINKS TAB */}
            {tab === 'links' && (
              <div className="space-y-4">
                {links.length > 0 && (
                  <ul className="space-y-1.5">
                    {links.map((link) => (
                      <li key={link.id} className="flex items-center gap-2 bg-surface-700 border border-surface-600 rounded-lg px-3 py-2">
                        <span className="text-xs text-surface-500 w-20 flex-shrink-0">{link.label}</span>
                        <a href={link.url} target="_blank" rel="noopener noreferrer"
                          className="flex-1 text-xs text-accent hover:text-accent-hover truncate flex items-center gap-1">
                          {link.url}<ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
                        </a>
                        <button type="button" onClick={() => setLinks((p) => p.filter((l) => l.id !== link.id))}
                          className="text-surface-500 hover:text-danger transition flex-shrink-0">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="space-y-2">
                  <label className="block text-xs text-surface-500">Add a link</label>
                  <div className="flex gap-2">
                    <select value={linkType} onChange={(e) => { setLinkType(e.target.value as QuickLinkType); setLinkLabel(''); }}
                      className="bg-surface-700 border border-surface-600 text-white rounded-lg px-2 py-2 text-xs focus:outline-none focus:border-accent transition flex-shrink-0">
                      {(Object.keys(QUICK_LINK_PRESETS) as QuickLinkType[]).map((t) => (
                        <option key={t} value={t}>{QUICK_LINK_PRESETS[t].label}</option>
                      ))}
                    </select>
                    <input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder={QUICK_LINK_PRESETS[linkType].placeholder}
                      className="flex-1 bg-surface-700 border border-surface-600 text-white rounded-lg px-3 py-2 text-xs placeholder-surface-500 focus:outline-none focus:border-accent transition" />
                  </div>
                  {linkType === 'custom' && (
                    <input value={linkLabel} onChange={(e) => setLinkLabel(e.target.value)}
                      placeholder="Label (e.g. Blog, Changelog…)"
                      className="w-full bg-surface-700 border border-surface-600 text-white rounded-lg px-3 py-2 text-xs placeholder-surface-500 focus:outline-none focus:border-accent transition" />
                  )}
                  <button type="button" onClick={addLink} disabled={!linkUrl.trim()}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-surface-700 border border-surface-600 hover:border-surface-500 text-white rounded-lg disabled:opacity-40 transition">
                    <Plus className="w-3.5 h-3.5" /> Add link
                  </button>
                </div>
              </div>
            )}

          </form>

          {/* Tags — outside form to prevent Enter-key submit */}
          {tab === 'details' && (
            <div className="mt-4">
              <label className="block text-xs text-surface-500 mb-1.5">Tags</label>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {tags.map((tag) => (
                    <span key={tag.id} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border"
                      style={{ color: tag.color, borderColor: `${tag.color}40`, backgroundColor: `${tag.color}15` }}>
                      {tag.label}
                      <button type="button" onClick={() => setTags((p) => p.filter((t) => t.id !== tag.id))} className="hover:opacity-70 transition">
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="flex gap-1 flex-shrink-0">
                  {TAG_COLORS.map((c) => (
                    <button key={c} type="button" onClick={() => setTagColor(c)} className="w-4 h-4 rounded-full transition"
                      style={{ backgroundColor: c, outline: tagColor === c ? `2px solid ${c}` : 'none', outlineOffset: '2px' }} />
                  ))}
                </div>
                <input ref={tagInputRef} value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); addTag(); } }}
                  placeholder="Type a tag, press Enter or +"
                  className="flex-1 bg-surface-700 border border-surface-600 text-white rounded-lg px-3 py-1.5 text-xs placeholder-surface-500 focus:outline-none focus:border-accent transition" />
                <button type="button" onClick={addTag}
                  className="p-1.5 bg-surface-700 border border-surface-600 rounded-lg text-surface-500 hover:text-white hover:border-surface-500 transition flex-shrink-0">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-surface-600 flex-shrink-0">
          <button type="button" onClick={onClose}
            className="px-4 py-2 text-sm text-surface-500 hover:text-white border border-surface-600 hover:border-surface-500 rounded-lg transition">
            Cancel
          </button>
          <button type="submit" form="competitor-form"
            className="px-4 py-2 text-sm bg-accent hover:bg-accent-hover text-surface-900 font-medium rounded-lg transition">
            {editing ? 'Save changes' : 'Add competitor'}
          </button>
        </div>
      </div>
    </div>
  );
}
