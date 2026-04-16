import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ExternalLink,
  Trash2,
  GripVertical,
  Pencil,
  Rss,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  TrendingUp,
} from 'lucide-react';
import type { Competitor } from '../types';
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
  return `${Math.floor(d / 7)}w ago`;
}

export default function CompetitorCard({ competitor, onEdit }: Props) {
  const { removeCompetitor } = useCompetitorStore();
  const [notesOpen, setNotesOpen] = useState(false);
  const [feedOpen, setFeedOpen] = useState(false);

  const { items, loading, error, fetched, fetch } = useCompanyNews(competitor.name);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: competitor.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const domain = (() => {
    try { return new URL(competitor.url).hostname.replace('www.', ''); }
    catch { return competitor.url; }
  })();

  const cardAge = timeAgo(competitor.updatedAt);

  function handleFeedToggle() {
    if (!feedOpen && !fetched) fetch();
    setFeedOpen((v) => !v);
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-surface-700 border border-surface-600 rounded-lg group hover:border-surface-500 transition-colors"
    >
      {/* Header row */}
      <div className="flex items-start gap-2.5 p-3">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 text-surface-500 hover:text-white cursor-grab active:cursor-grabbing transition flex-shrink-0"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <img
          src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
          alt=""
          className="w-5 h-5 rounded mt-0.5 flex-shrink-0"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-white text-sm font-medium truncate">{competitor.name}</span>
            <a
              href={competitor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-surface-500 hover:text-accent transition flex-shrink-0"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p className="text-surface-500 text-xs truncate">{domain}</p>
        </div>

        {/* Action buttons — visible on hover */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition flex-shrink-0">
          <button
            onClick={() => onEdit(competitor)}
            className="p-1 text-surface-500 hover:text-white rounded transition"
            title="Edit"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => removeCompetitor(competitor.id)}
            className="p-1 text-surface-500 hover:text-danger rounded transition"
            title="Remove"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tags */}
      {competitor.tags.length > 0 && (
        <div className="px-3 pb-2 flex flex-wrap gap-1">
          {competitor.tags.map((tag) => (
            <span
              key={tag.id}
              className="text-xs px-2 py-0.5 rounded-full border"
              style={{
                color: tag.color,
                borderColor: `${tag.color}40`,
                backgroundColor: `${tag.color}15`,
              }}
            >
              {tag.label}
            </span>
          ))}
        </div>
      )}

      {/* Description */}
      {competitor.description && (
        <p className="px-3 pb-2 text-xs text-surface-500 leading-relaxed line-clamp-2">
          {competitor.description}
        </p>
      )}

      {/* Notes toggle */}
      {competitor.notes && (
        <>
          <button
            onClick={() => setNotesOpen((v) => !v)}
            className="w-full flex items-center gap-1 px-3 py-1.5 text-xs text-surface-500 hover:text-white border-t border-surface-600 transition"
          >
            {notesOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            Notes
          </button>
          {notesOpen && (
            <p className="px-3 pb-3 text-xs text-surface-500 leading-relaxed">{competitor.notes}</p>
          )}
        </>
      )}

      {/* Live Feed toggle */}
      <button
        onClick={handleFeedToggle}
        className="w-full flex items-center gap-1.5 px-3 py-1.5 text-xs border-t border-surface-600 transition text-surface-500 hover:text-accent"
      >
        <Rss className="w-3 h-3" />
        Live Feed
        {loading && <Loader2 className="w-3 h-3 animate-spin ml-auto" />}
        {!loading && (feedOpen ? <ChevronUp className="w-3 h-3 ml-auto" /> : <ChevronDown className="w-3 h-3 ml-auto" />)}
      </button>

      {feedOpen && (
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
            <p className="px-3 py-3 text-xs text-surface-500">No recent mentions found.</p>
          )}

          {items.length > 0 && (
            <ul className="divide-y divide-surface-600">
              {items.map((item) => (
                <li key={item.objectID} className="px-3 py-2.5">
                  <a
                    href={item.url ?? `https://news.ycombinator.com/item?id=${item.objectID}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-white hover:text-accent transition leading-snug block mb-1"
                  >
                    {item.title}
                  </a>
                  <div className="flex items-center gap-2 text-xs text-surface-500">
                    <span className="flex items-center gap-0.5">
                      <TrendingUp className="w-2.5 h-2.5" /> {item.points ?? 0}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <MessageSquare className="w-2.5 h-2.5" /> {item.num_comments ?? 0}
                    </span>
                    <span className="ml-auto">{timeAgo(item.created_at)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="px-3 py-1.5 text-xs text-surface-500 flex items-center justify-between border-t border-surface-600">
            <span>Source: Hacker News</span>
            <button
              onClick={() => fetch()}
              className="text-accent hover:text-accent-hover transition"
            >
              Refresh
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-3 py-1.5 border-t border-surface-600 flex justify-end">
        <span className="text-xs text-surface-500">Updated {cardAge}</span>
      </div>
    </div>
  );
}
