import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import { TrendingUp, LogOut, Search, Plus, ArrowRight } from 'lucide-react';
import type { Competitor, ColumnId } from '../types';
import { COLUMNS } from '../types';
import { useCompetitorStore } from '../store/useCompetitorStore';
import { useAuthStore } from '../store/useAuthStore';
import KanbanColumn from '../components/KanbanColumn';
import CompetitorCard from '../components/CompetitorCard';
import CompetitorModal from '../components/CompetitorModal';

export default function Dashboard() {
  const { competitors, moveCompetitor, reorderCompetitors } = useCompetitorStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [defaultColumn, setDefaultColumn] = useState<ColumnId>('watching');
  const [editingCompetitor, setEditingCompetitor] = useState<Competitor | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [prefillUrl, setPrefillUrl] = useState('');

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const activeCompetitor = competitors.find((c) => c.id === activeId) ?? null;

  const filtered = search.trim()
    ? competitors.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.url.toLowerCase().includes(search.toLowerCase()) ||
          c.tags.some((t) => t.label.toLowerCase().includes(search.toLowerCase()))
      )
    : competitors;

  function handleDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }

  function handleDragOver(e: DragOverEvent) {
    const overId = e.over?.id;
    if (!overId || !activeId) return;
    const isColumn = COLUMNS.some((c) => c.id === overId);
    if (isColumn) {
      const active = competitors.find((c) => c.id === activeId);
      if (active && active.columnId !== overId) {
        moveCompetitor(activeId, overId as ColumnId);
      }
    }
  }

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    setActiveId(null);
    if (!over) return;
    const overId = String(over.id);
    const isColumn = COLUMNS.some((c) => c.id === overId);
    if (!isColumn && active.id !== overId) {
      // Reorder within same column
      reorderCompetitors(String(active.id), overId);
    }
  }

  function openAddModal(colId: ColumnId) {
    setEditingCompetitor(null);
    setPrefillUrl('');
    setDefaultColumn(colId);
    setModalOpen(true);
  }

  function openEditModal(c: Competitor) {
    setEditingCompetitor(c);
    setModalOpen(true);
  }

  function handleUrlSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const raw = urlInput.trim();
    if (!raw) return;
    const url = raw.startsWith('http') ? raw : `https://${raw}`;
    setPrefillUrl(url);
    setUrlInput('');
    setEditingCompetitor(null);
    setDefaultColumn('watching');
    setModalOpen(true);
  }

  const totalCount = competitors.length;
  const directCount = competitors.filter((c) => c.columnId === 'direct').length;

  return (
    <div className="min-h-screen bg-surface-900 flex flex-col">
      {/* Top nav */}
      <header className="bg-surface-800 border-b border-surface-600 px-6 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-accent" />
          </div>
          <span className="text-white font-semibold text-sm">Competitor Tracker</span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-sm relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search competitors, tags…"
            className="w-full bg-surface-700 border border-surface-600 text-white rounded-lg pl-9 pr-3 py-2 text-sm placeholder-surface-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition"
          />
        </div>

        <div className="flex-1" />

        {/* Stats */}
        <div className="hidden sm:flex items-center gap-4 text-xs text-surface-500">
          <span><span className="text-white font-medium">{totalCount}</span> tracked</span>
          <span><span className="text-danger font-medium">{directCount}</span> direct</span>
        </div>

        {/* Add button */}
        <button
          onClick={() => openAddModal('watching')}
          className="flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-surface-900 text-sm font-medium px-3 py-1.5 rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>

        {/* User */}
        <div className="flex items-center gap-2 pl-2 border-l border-surface-600">
          <img src={user?.avatar} alt={user?.name} className="w-7 h-7 rounded-full" />
          <span className="text-sm text-white hidden sm:block">{user?.name}</span>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="p-1.5 text-surface-500 hover:text-white transition"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* URL quick-add bar */}
      <form onSubmit={handleUrlSubmit} className="mx-6 mt-4 flex items-center gap-2">
        <div className="relative flex-1">
          <input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste or type a competitor URL to add instantly… e.g. stripe.com"
            className="w-full bg-surface-800 border border-surface-600 text-white rounded-lg pl-4 pr-3 py-2 text-sm placeholder-surface-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition"
          />
        </div>
        <button
          type="submit"
          disabled={!urlInput.trim()}
          className="flex items-center gap-1.5 bg-surface-700 hover:bg-surface-600 disabled:opacity-40 disabled:cursor-not-allowed border border-surface-600 text-white text-sm px-3 py-2 rounded-lg transition flex-shrink-0"
        >
          <ArrowRight className="w-4 h-4" />
          Add
        </button>
      </form>

      {/* Board */}
      <main className="flex-1 px-6 py-5 overflow-x-auto">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-5 min-w-fit">
            {COLUMNS.map((col) => (
              <KanbanColumn
                key={col.id}
                column={col}
                competitors={filtered.filter((c) => c.columnId === col.id)}
                onAdd={() => openAddModal(col.id)}
                onEdit={openEditModal}
              />
            ))}
          </div>

          <DragOverlay>
            {activeCompetitor ? (
              <div className="rotate-2 scale-105">
                <CompetitorCard competitor={activeCompetitor} onEdit={() => {}} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>

      {/* Footer */}
      <footer className="px-6 py-3 border-t border-surface-600 flex items-center justify-between text-xs text-surface-500">
        <span>Competitor Tracker &mdash; drag cards between columns or drop links to add</span>
      </footer>

      {/* Modal */}
      <CompetitorModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultColumn={defaultColumn}
        editing={editingCompetitor}
        prefillUrl={prefillUrl}
      />
    </div>
  );
}
