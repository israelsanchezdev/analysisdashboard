import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import type { Competitor, Column, ThreatLevel } from '../types';
import { THREAT_COLORS } from '../types';
import CompetitorCard from './CompetitorCard';

interface Props {
  column: Column;
  competitors: Competitor[];
  onAdd: () => void;
  onEdit: (c: Competitor) => void;
}

export default function KanbanColumn({ column, competitors, onAdd, onEdit }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  const avgThreat = competitors.length
    ? Math.round(competitors.reduce((sum, c) => sum + (c.threatLevel ?? 3), 0) / competitors.length) as ThreatLevel
    : null;

  return (
    <div className="flex flex-col w-80 flex-shrink-0">
      {/* Column header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: column.color }} />
          <h3 className="text-sm font-medium text-white">{column.title}</h3>
          <span className="text-xs text-surface-500 bg-surface-700 px-1.5 py-0.5 rounded-full">
            {competitors.length}
          </span>
          {avgThreat !== null && (
            <span className="text-xs px-1.5 py-0.5 rounded-full font-medium"
              style={{ color: THREAT_COLORS[avgThreat], backgroundColor: `${THREAT_COLORS[avgThreat]}20` }}
              title={`Avg threat: ${avgThreat}/5`}>
              ⚠ {avgThreat}/5
            </span>
          )}
        </div>
        <button onClick={onAdd} className="p-1 text-surface-500 hover:text-white hover:bg-surface-700 rounded transition" title="Add competitor">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Drop zone */}
      <div ref={setNodeRef}
        className={`flex-1 min-h-[200px] rounded-lg p-2 transition-colors ${
          isOver ? 'bg-surface-700/60 border border-dashed border-surface-500' : 'bg-surface-800/40'
        }`}>
        <SortableContext items={competitors.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2">
            {competitors.map((c) => (
              <CompetitorCard key={c.id} competitor={c} onEdit={onEdit} />
            ))}
          </div>
        </SortableContext>

        {competitors.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-surface-500 text-xs gap-1 py-10">
            <p>Drop a card here</p>
            <p>or click + to add</p>
          </div>
        )}
      </div>
    </div>
  );
}
