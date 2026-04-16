import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Competitor, ColumnId } from '../types';

interface CompetitorState {
  competitors: Competitor[];
  addCompetitor: (c: Omit<Competitor, 'id' | 'addedAt' | 'updatedAt'>) => void;
  updateCompetitor: (id: string, patch: Partial<Competitor>) => void;
  removeCompetitor: (id: string) => void;
  moveCompetitor: (id: string, targetColumn: ColumnId) => void;
  reorderCompetitors: (activeId: string, overId: string) => void;
}

export const useCompetitorStore = create<CompetitorState>()(
  persist(
    (set) => ({
      competitors: [
        {
          id: '1',
          name: 'Acme Corp',
          url: 'https://acme.com',
          favicon: 'https://www.google.com/s2/favicons?domain=acme.com&sz=32',
          description: 'Direct competitor in enterprise SaaS space.',
          tags: [{ id: 't1', label: 'SaaS', color: '#58a6ff' }, { id: 't2', label: 'Enterprise', color: '#3fb950' }],
          notes: 'Recently raised Series B. Watch their pricing page.',
          columnId: 'direct',
          addedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Globex Inc',
          url: 'https://globex.io',
          favicon: 'https://www.google.com/s2/favicons?domain=globex.io&sz=32',
          description: 'Targeting similar SMB market segment.',
          tags: [{ id: 't3', label: 'SMB', color: '#e3b341' }],
          notes: 'Their UX is weaker but pricing is 30% lower.',
          columnId: 'direct',
          addedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Initech',
          url: 'https://initech.com',
          favicon: 'https://www.google.com/s2/favicons?domain=initech.com&sz=32',
          description: 'Indirect overlap in reporting features.',
          tags: [{ id: 't4', label: 'Analytics', color: '#a371f7' }],
          notes: '',
          columnId: 'indirect',
          addedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '4',
          name: 'Umbrella Ltd',
          url: 'https://umbrella.co',
          favicon: 'https://www.google.com/s2/favicons?domain=umbrella.co&sz=32',
          description: 'New entrant, worth monitoring.',
          tags: [{ id: 't5', label: 'Startup', color: '#f78166' }],
          notes: 'Just launched in March.',
          columnId: 'watching',
          addedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],

      addCompetitor: (c) =>
        set((s) => ({
          competitors: [
            ...s.competitors,
            {
              ...c,
              id: crypto.randomUUID(),
              addedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),

      updateCompetitor: (id, patch) =>
        set((s) => ({
          competitors: s.competitors.map((c) =>
            c.id === id ? { ...c, ...patch, updatedAt: new Date().toISOString() } : c
          ),
        })),

      removeCompetitor: (id) =>
        set((s) => ({ competitors: s.competitors.filter((c) => c.id !== id) })),

      moveCompetitor: (id, targetColumn) =>
        set((s) => ({
          competitors: s.competitors.map((c) =>
            c.id === id ? { ...c, columnId: targetColumn, updatedAt: new Date().toISOString() } : c
          ),
        })),

      reorderCompetitors: (activeId, overId) =>
        set((s) => {
          const items = [...s.competitors];
          const activeIdx = items.findIndex((c) => c.id === activeId);
          const overIdx = items.findIndex((c) => c.id === overId);
          if (activeIdx === -1 || overIdx === -1) return s;
          const [moved] = items.splice(activeIdx, 1);
          items.splice(overIdx, 0, moved);
          return { competitors: items };
        }),
    }),
    { name: 'competitors-storage' }
  )
);
