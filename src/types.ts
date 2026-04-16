export type ColumnId = 'direct' | 'indirect' | 'watching';

export type ThreatLevel = 1 | 2 | 3 | 4 | 5;

export interface Tag {
  id: string;
  label: string;
  color: string;
}

export interface SwotAnalysis {
  strengths: string;
  weaknesses: string;
  opportunities: string;
  threats: string;
}

export type QuickLinkType = 'pricing' | 'linkedin' | 'crunchbase' | 'github' | 'twitter' | 'custom';

export interface QuickLink {
  id: string;
  label: string;
  url: string;
  type: QuickLinkType;
}

export interface CompanyIntel {
  location: string;
  founded: string;
  employees: string;
  revenue: string;
}

export const EMPTY_INTEL: CompanyIntel = {
  location: '', founded: '', employees: '', revenue: '',
};

export interface Competitor {
  id: string;
  name: string;
  url: string;
  favicon: string;
  description: string;
  tags: Tag[];
  notes: string;
  threatLevel: ThreatLevel;
  swot: SwotAnalysis;
  links: QuickLink[];
  intel: CompanyIntel;
  columnId: ColumnId;
  addedAt: string;
  updatedAt: string;
}

export interface Column {
  id: ColumnId;
  title: string;
  color: string;
}

export const COLUMNS: Column[] = [
  { id: 'direct', title: 'Direct Competitors', color: '#f85149' },
  { id: 'indirect', title: 'Indirect Competitors', color: '#e3b341' },
  { id: 'watching', title: 'Watching', color: '#58a6ff' },
];

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export const THREAT_COLORS: Record<ThreatLevel, string> = {
  1: '#3fb950',
  2: '#7ee787',
  3: '#e3b341',
  4: '#f0883e',
  5: '#f85149',
};

export const THREAT_LABELS: Record<ThreatLevel, string> = {
  1: 'Low',
  2: 'Guarded',
  3: 'Moderate',
  4: 'High',
  5: 'Critical',
};

export const QUICK_LINK_PRESETS: Record<QuickLinkType, { label: string; placeholder: string }> = {
  pricing:   { label: 'Pricing',    placeholder: 'https://example.com/pricing' },
  linkedin:  { label: 'LinkedIn',   placeholder: 'https://linkedin.com/company/...' },
  crunchbase:{ label: 'Crunchbase', placeholder: 'https://crunchbase.com/organization/...' },
  github:    { label: 'GitHub',     placeholder: 'https://github.com/...' },
  twitter:   { label: 'X / Twitter',placeholder: 'https://x.com/...' },
  custom:    { label: 'Custom',     placeholder: 'https://...' },
};
