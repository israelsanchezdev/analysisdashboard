import { useState, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ExternalLink, Trash2, GripVertical, Pencil,
  Rss, Loader2, AlertCircle, LayoutGrid,
  MapPin, Calendar, Users, DollarSign,
  ClipboardList, BarChart2, Plus, X,
} from 'lucide-react';
import type { Competitor, ThreatLevel, ActivityType, MetricSeries } from '../types';
import { THREAT_COLORS, THREAT_LABELS, QUICK_LINK_PRESETS, ACTIVITY_TYPES } from '../types';
import { useCompetitorStore } from '../store/useCompetitorStore';
import { useCompanyNews } from '../hooks/useCompanyNews';

interface Props {
  competitor: Competitor;
  onEdit: (c: Competitor) => void;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  if (d < 30) return `${Math.floor(d / 7)}w ago`;
  const m = Math.floor(d / 30);
  if (m < 12) return `${m}mo ago`;
  return `${Math.floor(m / 12)}y ago`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
}

// Mini sparkline — last 6 values as inline SVG bars
function Sparkline({ series }: { series: MetricSeries }) {
  const last6 = series.entries.slice(-6);
  if (last6.length < 2) return null;
  const vals = last6.map((e) => e.value);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;
  const latest = vals[vals.length - 1];
  const prev = vals[vals.length - 2];
  const trend = latest > prev ? '↑' : latest < prev ? '↓' : '→';
  const trendColor = latest > prev ? '#3fb950' : latest < prev ? '#f85149' : '#484f58';

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-end gap-0.5 h-5">
        {last6.map((e, i) => (
          <div
            key={i}
            className="w-1.5 rounded-sm"
            style={{
              height: `${Math.max(15, ((e.value - min) / range) * 100)}%`,
              backgroundColor: i === last6.length - 1 ? '#58a6ff' : '#30363d',
            }}
          />
        ))}
      </div>
      <span className="text-[10px] font-medium" style={{ color: trendColor }}>
        {trend} {latest}{series.unit}
      </span>
    </div>
  );
}

type Panel = 'swot' | 'log' | 'metrics' | 'feed' | null;

export default function CompetitorCard({ competitor, onEdit }: Props) {
  const { removeCompetitor, updateCompetitor } = useCompetitorStore();
  const [panel, setPanel] = useState<Panel>(null);

  // Activity log inline state
  const [logNote, setLogNote] = useState('');
  const [logType, setLogType] = useState<ActivityType>('observation');
  const logInputRef = useRef<HTMLInputElement>(null);

  // Metrics inline state
  const [newMetricName, setNewMetricName] = useState('');
  const [newMetricUnit, setNewMetricUnit] = useState('');
  const [logMetricId, setLogMetricId] = useState<string | null>(null);
  const [logMetricValue, setLogMetricValue] = useState('');

  const { items, loading, error, fetched, fetch } = useCompanyNews(competitor.name);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: competitor.id,
  });

  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

  const domain = (() => {
    try { return new URL(competitor.url).hostname.replace('www.', ''); }
    catch { return competitor.url; }
  })();

  const threat = (competitor.threatLevel ?? 3) as ThreatLevel;
  const threatColor = THREAT_COLORS[threat];
  const hasSwot = competitor.swot && Object.values(competitor.swot).some(Boolean);
  const activityLog = competitor.activityLog ?? [];
  const metrics = competitor.metrics ?? [];

  function togglePanel(p: Panel) {
    if (p === 'feed' && panel !== 'feed' && !fetched) fetch();
    setPanel((cur) => (cur === p ? null : p));
  }

  // Activity log actions
  function addLogEntry() {
    const note = logNote.trim();
    if (!note) return;
    const entry = { id: crypto.randomUUID(), note, type: logType, createdAt: new Date().toISOString() };
    updateCompetitor(competitor.id, { activityLog: [entry, ...activityLog] });
    setLogNote('');
    logInputRef.current?.focus();
  }

  function deleteLogEntry(entryId: string) {
    updateCompetitor(competitor.id, { activityLog: activityLog.filter((e) => e.id !== entryId) });
  }

  // Metrics actions
  function addMetric() {
    const name = newMetricName.trim();
    if (!name) return;
    const series: MetricSeries = { id: crypto.randomUUID(), name, unit: newMetricUnit.trim() || '', entries: [] };
    updateCompetitor(competitor.id, { metrics: [...metrics, series] });
    setNewMetricName(''); setNewMetricUnit('');
  }

  function logMetricEntry() {
    const val = parseFloat(logMetricValue);
    if (!logMetricId || isNaN(val)) return;
    const updated = metrics.map((m) =>
      m.id === logMetricId
        ? { ...m, entries: [...m.entries, { value: val, date: new Date().toISOString() }] }
        : m
    );
    updateCompetitor(competitor.id, { metrics: updated });
    setLogMetricValue(''); setLogMetricId(null);
  }

  function deleteMetric(metricId: string) {
    updateCompetitor(competitor.id, { metrics: metrics.filter((m) => m.id !== metricId) });
  }

  return (
    <div ref={setNodeRef} style={style}
      className="bg-surface-700 border border-surface-600 rounded-lg group hover:border-surface-500 transition-colors">

      {/* Threat stripe */}
      <div className="h-0.5 rounded-t-lg" style={{ backgroundColor: threatColor }} />

      {/* Header */}
      <div className="flex items-start gap-2.5 p-3">
        <button {...attributes} {...listeners}
          className="mt-0.5 text-surface-500 hover:text-white cursor-grab active:cursor-grabbing transition flex-shrink-0">
          <GripVertical className="w-4 h-4" />
        </button>
        <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`} alt=""
          className="w-5 h-5 rounded mt-0.5 flex-shrink-0"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-white text-sm font-medium truncate">{competitor.name}</span>
            <a href={competitor.url} target="_blank" rel="noopener noreferrer"
              className="text-surface-500 hover:text-accent transition flex-shrink-0">
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p className="text-surface-500 text-xs truncate">{domain}</p>
        </div>
        <span className="text-xs font-semibold px-1.5 py-0.5 rounded flex-shrink-0"
          style={{ color: threatColor, backgroundColor: `${threatColor}20` }}>
          {THREAT_LABELS[threat]}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition flex-shrink-0">
          <button onClick={() => onEdit(competitor)} className="p-1 text-surface-500 hover:text-white rounded transition"><Pencil className="w-3.5 h-3.5" /></button>
          <button onClick={() => removeCompetitor(competitor.id)} className="p-1 text-surface-500 hover:text-danger rounded transition"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      </div>

      {/* Tags */}
      {competitor.tags.length > 0 && (
        <div className="px-3 pb-2 flex flex-wrap gap-1">
          {competitor.tags.map((tag) => (
            <span key={tag.id} className="text-xs px-2 py-0.5 rounded-full border"
              style={{ color: tag.color, borderColor: `${tag.color}40`, backgroundColor: `${tag.color}15` }}>
              {tag.label}
            </span>
          ))}
        </div>
      )}

      {/* Description */}
      {competitor.description && (
        <p className="px-3 pb-2 text-xs text-surface-500 leading-relaxed line-clamp-2">{competitor.description}</p>
      )}

      {/* Intel strip */}
      {competitor.intel && Object.values(competitor.intel).some(Boolean) && (
        <div className="px-3 pb-2.5 flex flex-wrap gap-x-3 gap-y-1">
          {competitor.intel.location  && <span className="flex items-center gap-1 text-[11px] text-surface-500"><MapPin className="w-3 h-3" />{competitor.intel.location}</span>}
          {competitor.intel.founded   && <span className="flex items-center gap-1 text-[11px] text-surface-500"><Calendar className="w-3 h-3" />{competitor.intel.founded}</span>}
          {competitor.intel.employees && <span className="flex items-center gap-1 text-[11px] text-surface-500"><Users className="w-3 h-3" />{competitor.intel.employees}</span>}
          {competitor.intel.revenue   && <span className="flex items-center gap-1 text-[11px] text-surface-500"><DollarSign className="w-3 h-3" />{competitor.intel.revenue}</span>}
        </div>
      )}

      {/* Quick Links */}
      {competitor.links && competitor.links.length > 0 && (
        <div className="px-3 pb-2.5 flex flex-wrap gap-1.5">
          {competitor.links.map((link) => (
            <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs px-2 py-0.5 bg-surface-600 hover:bg-surface-500 text-surface-300 hover:text-white rounded transition"
              title={link.label}>
              <span className="text-[10px]">{QUICK_LINK_PRESETS[link.type]?.icon ?? '🔗'}</span>
              {link.label}
            </a>
          ))}
        </div>
      )}

      {/* Panel toggle bar */}
      <div className="border-t border-surface-600 flex divide-x divide-surface-600 text-[11px]">
        {hasSwot && (
          <button onClick={() => togglePanel('swot')}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 transition ${panel === 'swot' ? 'text-accent' : 'text-surface-500 hover:text-white'}`}>
            <LayoutGrid className="w-3 h-3" /> SWOT
          </button>
        )}
        <button onClick={() => togglePanel('log')}
          className={`flex-1 flex items-center justify-center gap-1 py-1.5 transition ${panel === 'log' ? 'text-accent' : 'text-surface-500 hover:text-white'}`}>
          <ClipboardList className="w-3 h-3" />
          Log
          {activityLog.length > 0 && <span className="ml-0.5 text-[9px] bg-surface-600 px-1 py-0.5 rounded-full">{activityLog.length}</span>}
        </button>
        <button onClick={() => togglePanel('metrics')}
          className={`flex-1 flex items-center justify-center gap-1 py-1.5 transition ${panel === 'metrics' ? 'text-accent' : 'text-surface-500 hover:text-white'}`}>
          <BarChart2 className="w-3 h-3" />
          Metrics
          {metrics.length > 0 && <span className="ml-0.5 text-[9px] bg-surface-600 px-1 py-0.5 rounded-full">{metrics.length}</span>}
        </button>
        <button onClick={() => togglePanel('feed')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 transition ${panel === 'feed' ? 'text-accent' : 'text-surface-500 hover:text-accent'}`}>
          <Rss className="w-3 h-3" />
          News
          {loading && <Loader2 className="w-3 h-3 animate-spin" />}
        </button>
      </div>

      {/* ── SWOT panel ── */}
      {panel === 'swot' && hasSwot && (
        <div className="border-t border-surface-600 grid grid-cols-2 divide-x divide-y divide-surface-600">
          {([
            { key: 'strengths',     label: 'Strengths',     color: '#3fb950' },
            { key: 'weaknesses',    label: 'Weaknesses',    color: '#f85149' },
            { key: 'opportunities', label: 'Opportunities', color: '#58a6ff' },
            { key: 'threats',       label: 'Threats',       color: '#e3b341' },
          ] as const).map(({ key, label, color }) => (
            <div key={key} className="px-3 py-2">
              <p className="text-[10px] font-semibold mb-1" style={{ color }}>{label}</p>
              <p className="text-xs text-surface-500 leading-relaxed">
                {competitor.swot?.[key] || <span className="italic opacity-40">Not filled in</span>}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ── Activity Log panel ── */}
      {panel === 'log' && (
        <div className="border-t border-surface-600">
          {/* Quick-add row */}
          <div className="px-3 py-2.5 flex gap-2 border-b border-surface-600">
            <select
              value={logType}
              onChange={(e) => setLogType(e.target.value as ActivityType)}
              className="bg-surface-600 border border-surface-500 text-white rounded px-2 py-1 text-xs focus:outline-none flex-shrink-0"
            >
              {(Object.entries(ACTIVITY_TYPES) as [ActivityType, { label: string; icon: string }][]).map(([k, v]) => (
                <option key={k} value={k}>{v.icon} {v.label}</option>
              ))}
            </select>
            <input
              ref={logInputRef}
              value={logNote}
              onChange={(e) => setLogNote(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLogEntry(); } }}
              placeholder="Add observation… (Enter to save)"
              className="flex-1 bg-surface-600 border border-surface-500 text-white rounded px-2 py-1 text-xs placeholder-surface-500 focus:outline-none focus:border-accent transition"
            />
            <button onClick={addLogEntry} disabled={!logNote.trim()}
              className="p-1 bg-accent hover:bg-accent-hover disabled:opacity-40 text-surface-900 rounded transition flex-shrink-0">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Entries */}
          {activityLog.length === 0 ? (
            <p className="px-3 py-4 text-xs text-surface-500 text-center">
              No entries yet — log your first observation above.
            </p>
          ) : (
            <ul className="divide-y divide-surface-600 max-h-52 overflow-y-auto">
              {activityLog.map((entry) => {
                const t = ACTIVITY_TYPES[entry.type];
                return (
                  <li key={entry.id} className="px-3 py-2 flex items-start gap-2 group/entry">
                    <span className="text-sm flex-shrink-0 mt-0.5" title={t.label}>{t.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white leading-snug">{entry.note}</p>
                      <p className="text-[10px] text-surface-500 mt-0.5">{formatDate(entry.createdAt)} · {timeAgo(entry.createdAt)}</p>
                    </div>
                    <button
                      onClick={() => deleteLogEntry(entry.id)}
                      className="opacity-0 group-hover/entry:opacity-100 text-surface-500 hover:text-danger transition flex-shrink-0 mt-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {/* ── Metrics panel ── */}
      {panel === 'metrics' && (
        <div className="border-t border-surface-600">
          {/* Existing metrics */}
          {metrics.length > 0 && (
            <ul className="divide-y divide-surface-600">
              {metrics.map((m) => {
                const latest = m.entries[m.entries.length - 1];
                return (
                  <li key={m.id} className="px-3 py-2.5 group/metric">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-white font-medium flex-1">{m.name}</span>
                      {latest && <span className="text-xs text-surface-500">{latest.value}{m.unit}</span>}
                      <button onClick={() => deleteMetric(m.id)}
                        className="opacity-0 group-hover/metric:opacity-100 text-surface-500 hover:text-danger transition">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <Sparkline series={m} />

                    {/* Log a new value inline */}
                    {logMetricId === m.id ? (
                      <div className="flex gap-1.5 mt-2">
                        <input
                          autoFocus
                          type="number"
                          value={logMetricValue}
                          onChange={(e) => setLogMetricValue(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') logMetricEntry(); if (e.key === 'Escape') setLogMetricId(null); }}
                          placeholder={`Value in ${m.unit || 'units'}`}
                          className="flex-1 bg-surface-600 border border-surface-500 text-white rounded px-2 py-1 text-xs focus:outline-none focus:border-accent transition"
                        />
                        <button onClick={logMetricEntry}
                          className="px-2 py-1 bg-accent hover:bg-accent-hover text-surface-900 rounded text-xs transition">
                          Log
                        </button>
                        <button onClick={() => setLogMetricId(null)}
                          className="px-2 py-1 border border-surface-600 text-surface-500 hover:text-white rounded text-xs transition">
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setLogMetricId(m.id)}
                        className="mt-1.5 text-[10px] text-surface-500 hover:text-accent transition flex items-center gap-1">
                        <Plus className="w-2.5 h-2.5" /> Log new value
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          {/* Add new metric */}
          <div className="px-3 py-2.5 border-t border-surface-600 flex gap-2">
            <input value={newMetricName} onChange={(e) => setNewMetricName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') addMetric(); }}
              placeholder="Metric name (e.g. Yelp stars)"
              className="flex-1 bg-surface-600 border border-surface-500 text-white rounded px-2 py-1 text-xs placeholder-surface-500 focus:outline-none focus:border-accent transition" />
            <input value={newMetricUnit} onChange={(e) => setNewMetricUnit(e.target.value)}
              placeholder="Unit"
              className="w-14 bg-surface-600 border border-surface-500 text-white rounded px-2 py-1 text-xs placeholder-surface-500 focus:outline-none focus:border-accent transition" />
            <button onClick={addMetric} disabled={!newMetricName.trim()}
              className="p-1 bg-accent hover:bg-accent-hover disabled:opacity-40 text-surface-900 rounded transition flex-shrink-0">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ── Live Feed panel ── */}
      {panel === 'feed' && (
        <div className="border-t border-surface-600">
          {loading && (
            <div className="flex items-center justify-center py-4 text-surface-500 text-xs gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Fetching latest news…
            </div>
          )}
          {error && (
            <div className="flex items-center gap-1.5 px-3 py-3 text-xs text-danger">
              <AlertCircle className="w-3.5 h-3.5" /> {error}
            </div>
          )}
          {fetched && !loading && items.length === 0 && (
            <p className="px-3 py-3 text-xs text-surface-500 text-center leading-relaxed">
              No recent news found.
              <br />Try logging observations manually in the Log tab.
            </p>
          )}
          {items.length > 0 && (
            <ul className="divide-y divide-surface-600">
              {items.map((item) => (
                <li key={item.id} className="px-3 py-2.5">
                  <a href={item.url} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-white hover:text-accent transition leading-snug block mb-1">
                    {item.title}
                  </a>
                  <div className="flex items-center gap-2 text-xs text-surface-500">
                    <span className="truncate">{item.source}</span>
                    <span className="ml-auto flex-shrink-0">{timeAgo(item.publishedAt)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="px-3 py-1.5 text-xs text-surface-500 flex items-center justify-between border-t border-surface-600">
            <span>Google News</span>
            <button onClick={() => fetch()} className="text-accent hover:text-accent-hover transition">Refresh</button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-3 py-1.5 border-t border-surface-600 flex justify-end">
        <span className="text-xs text-surface-500">Updated {timeAgo(competitor.updatedAt)}</span>
      </div>
    </div>
  );
}
