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
          name: 'Apple',
          url: 'https://apple.com',
          favicon: 'https://www.google.com/s2/favicons?domain=apple.com&sz=32',
          description: 'Consumer electronics, software, and services giant. Dominates premium hardware with iOS ecosystem lock-in.',
          tags: [{ id: 't1', label: 'Hardware', color: '#58a6ff' }, { id: 't2', label: 'Consumer', color: '#3fb950' }],
          notes: 'Watch Vision Pro adoption and Apple Intelligence rollout.',
          columnId: 'direct',
          addedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Google',
          url: 'https://google.com',
          favicon: 'https://www.google.com/s2/favicons?domain=google.com&sz=32',
          description: 'Search, cloud, and AI powerhouse. Gemini AI is a key battleground across all product lines.',
          tags: [{ id: 't3', label: 'AI', color: '#e3b341' }, { id: 't4', label: 'Cloud', color: '#58a6ff' }],
          notes: 'Gemini integration across Workspace is accelerating fast.',
          columnId: 'direct',
          addedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Amazon',
          url: 'https://amazon.com',
          favicon: 'https://www.google.com/s2/favicons?domain=amazon.com&sz=32',
          description: 'E-commerce and cloud leader. AWS remains most dominant cloud platform globally.',
          tags: [{ id: 't5', label: 'Cloud', color: '#58a6ff' }, { id: 't6', label: 'E-commerce', color: '#f78166' }],
          notes: 'AWS re:Invent announcements — monitor new AI tooling.',
          columnId: 'indirect',
          addedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '4',
          name: 'Tesla',
          url: 'https://tesla.com',
          favicon: 'https://www.google.com/s2/favicons?domain=tesla.com&sz=32',
          description: 'EV and energy company pushing autonomous driving and robotics.',
          tags: [{ id: 't7', label: 'EV', color: '#3fb950' }, { id: 't8', label: 'AI', color: '#e3b341' }],
          notes: 'Robotaxi launch and Optimus robot timeline — key signals.',
          columnId: 'watching',
          addedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '5',
          name: 'Microsoft',
          url: 'https://microsoft.com',
          favicon: 'https://www.google.com/s2/favicons?domain=microsoft.com&sz=32',
          description: 'Cloud and productivity leader. Copilot AI deeply integrated across Microsoft 365 and Azure.',
          tags: [{ id: 't9', label: 'AI', color: '#e3b341' }, { id: 't10', label: 'Enterprise', color: '#a371f7' }],
          notes: 'OpenAI partnership gives them edge in enterprise AI — track Copilot adoption.',
          columnId: 'direct',
          addedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '6',
          name: 'Meta',
          url: 'https://meta.com',
          favicon: 'https://www.google.com/s2/favicons?domain=meta.com&sz=32',
          description: 'Social media and AR/VR company. Llama open-source AI models shifting the competitive landscape.',
          tags: [{ id: 't11', label: 'Social', color: '#79c0ff' }, { id: 't12', label: 'AR/VR', color: '#a371f7' }],
          notes: 'Ray-Ban smart glasses gaining traction. Monitor Threads vs X.',
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
