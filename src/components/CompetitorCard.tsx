import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ExternalLink, Trash2, GripVertical, ChevronDown, ChevronUp, Pencil } from 'lucide-react';
import type { Competitor } from '../types';
import { useCompetitorStore } from '../store/useCompetitorStore';

interface Props {
  competitor: Competitor;
  onEdit: (c: Competitor) => void;
}

export default function CompetitorCard({ competitor, onEdit }: Props) {
  const { removeCompetitor } = useCompetitorStore();
  const [expanded, setExpanded] = useState(false);

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

  const timeAgo = (() => {
    const diff = Date.now() - new Date(competitor.updatedAt).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'today';
    if (days === 1) return 'yesterday';
    return `${days}d ago`;
  })();

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-surface-700 border border-surface-600 rounded-lg group hover:border-surface-500 transition-colors"
    >
      {/* Header */}
      <div className="flex items-start gap-2.5 p-3">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 text-surface-500 hover:text-white cursor-grab active:cursor-grabbing transition flex-shrink-0"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        {/* Favicon */}
        <img
          src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
          alt=""
          className="w-5 h-5 rounded mt-0.5 flex-shrink-0"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />

        {/* Main content */}
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

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition flex-shrink-0">
          <button
            onClick={() => onEdit(competitor)}
            className="p-1 text-surface-500 hover:text-white rounded transition"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => removeCompetitor(competitor.id)}
            className="p-1 text-surface-500 hover:text-danger rounded transition"
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
              style={{ color: tag.color, borderColor: `${tag.color}40`, backgroundColor: `${tag.color}15` }}
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

      {/* Expandable notes */}
      {competitor.notes && (
        <>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="w-full flex items-center gap-1 px-3 py-1.5 text-xs text-surface-500 hover:text-white border-t border-surface-600 transition"
          >
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            Notes
          </button>
          {expanded && (
            <p className="px-3 pb-3 text-xs text-surface-500 leading-relaxed">{competitor.notes}</p>
          )}
        </>
      )}

      {/* Footer */}
      <div className="px-3 py-1.5 border-t border-surface-600 flex justify-end">
        <span className="text-xs text-surface-500">Updated {timeAgo}</span>
      </div>
    </div>
  );
}
