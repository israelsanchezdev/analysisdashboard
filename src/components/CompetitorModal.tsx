import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import type { Competitor, ColumnId, Tag } from '../types';
import { COLUMNS } from '../types';
import { useCompetitorStore } from '../store/useCompetitorStore';

interface Props {
  open: boolean;
  onClose: () => void;
  defaultColumn?: ColumnId;
  editing?: Competitor | null;
  prefillUrl?: string;
}

const TAG_COLORS = ['#58a6ff', '#3fb950', '#e3b341', '#f85149', '#a371f7', '#f78166', '#79c0ff'];

export default function CompetitorModal({ open, onClose, defaultColumn = 'watching', editing, prefillUrl }: Props) {
  const { addCompetitor, updateCompetitor } = useCompetitorStore();

  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [columnId, setColumnId] = useState<ColumnId>(defaultColumn);
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [tagColor, setTagColor] = useState(TAG_COLORS[0]);

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setUrl(editing.url);
      setDescription(editing.description);
      setNotes(editing.notes);
      setColumnId(editing.columnId);
      setTags(editing.tags);
    } else {
      setName('');
      setUrl(prefillUrl || '');
      setDescription('');
      setNotes('');
      setColumnId(defaultColumn);
      setTags([]);
    }
    setTagInput('');
  }, [editing, prefillUrl, defaultColumn, open]);

  if (!open) return null;

  function addTag() {
    const label = tagInput.trim();
    if (!label) return;
    setTags((t) => [...t, { id: crypto.randomUUID(), label, color: tagColor }]);
    setTagInput('');
  }

  function removeTag(id: string) {
    setTags((t) => t.filter((tag) => tag.id !== id));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const favicon = `https://www.google.com/s2/favicons?domain=${url}&sz=32`;
    if (editing) {
      updateCompetitor(editing.id, { name, url, favicon, description, notes, columnId, tags });
    } else {
      addCompetitor({ name, url, favicon, description, notes, columnId, tags });
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-surface-800 border border-surface-600 rounded-xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-600">
          <h2 className="text-white font-medium">
            {editing ? 'Edit competitor' : 'Add competitor'}
          </h2>
          <button onClick={onClose} className="text-surface-500 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-surface-500 mb-1.5">Company name *</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Acme Corp"
                className="w-full bg-surface-700 border border-surface-600 text-white rounded-lg px-3 py-2 text-sm placeholder-surface-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition"
              />
            </div>
            <div>
              <label className="block text-xs text-surface-500 mb-1.5">Column</label>
              <select
                value={columnId}
                onChange={(e) => setColumnId(e.target.value as ColumnId)}
                className="w-full bg-surface-700 border border-surface-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition"
              >
                {COLUMNS.map((col) => (
                  <option key={col.id} value={col.id}>{col.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-surface-500 mb-1.5">Website URL *</label>
            <input
              required
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full bg-surface-700 border border-surface-600 text-white rounded-lg px-3 py-2 text-sm placeholder-surface-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition"
            />
          </div>

          <div>
            <label className="block text-xs text-surface-500 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What they do, target market…"
              rows={2}
              className="w-full bg-surface-700 border border-surface-600 text-white rounded-lg px-3 py-2 text-sm placeholder-surface-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs text-surface-500 mb-1.5">Tags</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border"
                  style={{ color: tag.color, borderColor: `${tag.color}40`, backgroundColor: `${tag.color}15` }}
                >
                  {tag.label}
                  <button type="button" onClick={() => removeTag(tag.id)} className="hover:opacity-70 transition">
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <div className="flex gap-1">
                {TAG_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setTagColor(c)}
                    className="w-4 h-4 rounded-full flex-shrink-0 transition ring-offset-surface-700"
                    style={{
                      backgroundColor: c,
                      outline: tagColor === c ? `2px solid ${c}` : 'none',
                      outlineOffset: '2px',
                    }}
                  />
                ))}
              </div>
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                placeholder="Add tag…"
                className="flex-1 bg-surface-700 border border-surface-600 text-white rounded-lg px-3 py-1.5 text-xs placeholder-surface-500 focus:outline-none focus:border-accent transition"
              />
              <button
                type="button"
                onClick={addTag}
                className="p-1.5 bg-surface-700 border border-surface-600 rounded-lg text-surface-500 hover:text-white transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs text-surface-500 mb-1.5">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Pricing, strengths, weaknesses, intel…"
              rows={3}
              className="w-full bg-surface-700 border border-surface-600 text-white rounded-lg px-3 py-2 text-sm placeholder-surface-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition resize-none"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-surface-500 hover:text-white border border-surface-600 hover:border-surface-500 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-accent hover:bg-accent-hover text-surface-900 font-medium rounded-lg transition"
            >
              {editing ? 'Save changes' : 'Add competitor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
