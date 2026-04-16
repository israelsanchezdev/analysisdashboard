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

const EMPTY_SWOT = { strengths: '', weaknesses: '', opportunities: '', threats: '' };

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
          threatLevel: 5,
          swot: {
            strengths: 'Unmatched brand loyalty, tight hardware-software integration, $3T market cap.',
            weaknesses: 'Closed ecosystem limits flexibility; premium pricing excludes mass market.',
            opportunities: 'Spatial computing (Vision Pro), generative AI features, financial services.',
            threats: 'Antitrust pressure on App Store, slowing iPhone growth in China.',
          },
          links: [
            { id: 'l1', label: 'Pricing', url: 'https://apple.com/shop', type: 'pricing' },
            { id: 'l2', label: 'LinkedIn', url: 'https://linkedin.com/company/apple', type: 'linkedin' },
            { id: 'l3', label: 'Crunchbase', url: 'https://crunchbase.com/organization/apple', type: 'crunchbase' },
          ],
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
          threatLevel: 5,
          swot: {
            strengths: '90%+ search market share, massive AI compute infrastructure, YouTube dominance.',
            weaknesses: 'Ad revenue concentration risk; history of killing products damages trust.',
            opportunities: 'Gemini in enterprise Workspace, Waymo autonomous vehicles, quantum computing.',
            threats: 'DOJ antitrust lawsuit targeting search monopoly; OpenAI/ChatGPT eating query volume.',
          },
          links: [
            { id: 'l4', label: 'LinkedIn', url: 'https://linkedin.com/company/google', type: 'linkedin' },
            { id: 'l5', label: 'GitHub', url: 'https://github.com/google', type: 'github' },
            { id: 'l6', label: 'X', url: 'https://x.com/google', type: 'twitter' },
          ],
          columnId: 'direct',
          addedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Microsoft',
          url: 'https://microsoft.com',
          favicon: 'https://www.google.com/s2/favicons?domain=microsoft.com&sz=32',
          description: 'Cloud and productivity leader. Copilot AI deeply integrated across Microsoft 365 and Azure.',
          tags: [{ id: 't9', label: 'AI', color: '#e3b341' }, { id: 't10', label: 'Enterprise', color: '#a371f7' }],
          notes: 'OpenAI partnership gives them edge in enterprise AI — track Copilot adoption.',
          threatLevel: 4,
          swot: {
            strengths: 'Enterprise lock-in via Office 365, Azure #2 cloud, OpenAI exclusive partnership.',
            weaknesses: 'Consumer brand weaker than Apple/Google; gaming division underperforming.',
            opportunities: 'Copilot across every product, healthcare AI via Nuance, LinkedIn data moat.',
            threats: 'Regulatory scrutiny of OpenAI deal; Azure growth slowing vs AWS.',
          },
          links: [
            { id: 'l7', label: 'Pricing', url: 'https://microsoft.com/en-us/microsoft-365/business/compare-all-plans', type: 'pricing' },
            { id: 'l8', label: 'GitHub', url: 'https://github.com/microsoft', type: 'github' },
            { id: 'l9', label: 'Crunchbase', url: 'https://crunchbase.com/organization/microsoft', type: 'crunchbase' },
          ],
          columnId: 'direct',
          addedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '4',
          name: 'Amazon',
          url: 'https://amazon.com',
          favicon: 'https://www.google.com/s2/favicons?domain=amazon.com&sz=32',
          description: 'E-commerce and cloud leader. AWS remains the most dominant cloud platform globally.',
          tags: [{ id: 't5', label: 'Cloud', color: '#58a6ff' }, { id: 't6', label: 'E-commerce', color: '#f78166' }],
          notes: 'AWS re:Invent announcements — monitor new AI tooling.',
          threatLevel: 3,
          swot: {
            strengths: 'AWS cash machine, Prime loyalty flywheel, logistics infrastructure moat.',
            weaknesses: 'Thin e-commerce margins; Alexa/consumer AI behind competition.',
            opportunities: 'Bedrock AI platform, healthcare (Amazon Clinic), satellite internet (Kuiper).',
            threats: 'FTC antitrust scrutiny; Walmart/Shopify competing on logistics.',
          },
          links: [
            { id: 'l10', label: 'AWS Pricing', url: 'https://aws.amazon.com/pricing/', type: 'pricing' },
            { id: 'l11', label: 'LinkedIn', url: 'https://linkedin.com/company/amazon', type: 'linkedin' },
            { id: 'l12', label: 'GitHub', url: 'https://github.com/aws', type: 'github' },
          ],
          columnId: 'indirect',
          addedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '5',
          name: 'Tesla',
          url: 'https://tesla.com',
          favicon: 'https://www.google.com/s2/favicons?domain=tesla.com&sz=32',
          description: 'EV and energy company pushing autonomous driving and robotics.',
          tags: [{ id: 't7', label: 'EV', color: '#3fb950' }, { id: 't8', label: 'AI', color: '#e3b341' }],
          notes: 'Robotaxi launch and Optimus robot timeline — key signals.',
          threatLevel: 3,
          swot: {
            strengths: "Supercharger network, FSD data advantage, Elon's brand as distribution.",
            weaknesses: "Brand damage from Elon's political activity; slowing EV demand growth.",
            opportunities: 'Robotaxi network launch, Optimus humanoid robot at scale, energy storage.',
            threats: 'BYD price competition, legacy OEM EV acceleration, regulatory FSD hurdles.',
          },
          links: [
            { id: 'l13', label: 'X', url: 'https://x.com/tesla', type: 'twitter' },
            { id: 'l14', label: 'Crunchbase', url: 'https://crunchbase.com/organization/tesla-motors', type: 'crunchbase' },
          ],
          columnId: 'watching',
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
          threatLevel: 2,
          swot: {
            strengths: '3B+ daily users across apps, Llama open-source AI momentum, ad targeting.',
            weaknesses: 'Reality Labs burning $15B+/year; teen user decline on core Facebook.',
            opportunities: 'Ray-Ban Meta glasses mass market, WhatsApp monetization, Threads growth.',
            threats: 'TikTok competition for attention; EU Digital Markets Act compliance costs.',
          },
          links: [
            { id: 'l15', label: 'LinkedIn', url: 'https://linkedin.com/company/meta', type: 'linkedin' },
            { id: 'l16', label: 'GitHub', url: 'https://github.com/meta', type: 'github' },
            { id: 'l17', label: 'X', url: 'https://x.com/meta', type: 'twitter' },
          ],
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
    { name: 'competitors-storage-v2' }
  )
);

export { EMPTY_SWOT };
