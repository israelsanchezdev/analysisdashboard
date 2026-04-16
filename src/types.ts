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

export type QuickLinkType =
  | 'pricing' | 'linkedin' | 'crunchbase' | 'github' | 'twitter'
  | 'googlemaps' | 'yelp' | 'instagram' | 'facebook' | 'tripadvisor'
  | 'custom';

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

// ── Activity Log ────────────────────────────────────────────────────────────

export type ActivityType = 'observation' | 'price' | 'product' | 'social' | 'visit' | 'other';

export interface ActivityEntry {
  id: string;
  note: string;
  type: ActivityType;
  createdAt: string;
}

export const ACTIVITY_TYPES: Record<ActivityType, { label: string; icon: string; color: string }> = {
  observation: { label: 'Observation',   icon: '👁',  color: '#58a6ff' },
  price:       { label: 'Price change',  icon: '💰',  color: '#3fb950' },
  product:     { label: 'Product/menu',  icon: '🛍',  color: '#a371f7' },
  social:      { label: 'Social media',  icon: '📱',  color: '#79c0ff' },
  visit:       { label: 'Site visit',    icon: '🚶',  color: '#e3b341' },
  other:       { label: 'Other',         icon: '📝',  color: '#484f58' },
};

// ── Metrics ─────────────────────────────────────────────────────────────────

export interface MetricEntry {
  value: number;
  date: string;
}

export interface MetricSeries {
  id: string;
  name: string;
  unit: string;
  entries: MetricEntry[];
}

// ── Competitor ───────────────────────────────────────────────────────────────

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
  activityLog: ActivityEntry[];
  metrics: MetricSeries[];
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
  { id: 'direct',   title: 'Direct Competitors',   color: '#f85149' },
  { id: 'indirect', title: 'Indirect Competitors',  color: '#e3b341' },
  { id: 'watching', title: 'Watching',              color: '#58a6ff' },
];

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export const THREAT_COLORS: Record<ThreatLevel, string> = {
  1: '#3fb950', 2: '#7ee787', 3: '#e3b341', 4: '#f0883e', 5: '#f85149',
};

export const THREAT_LABELS: Record<ThreatLevel, string> = {
  1: 'Low', 2: 'Guarded', 3: 'Moderate', 4: 'High', 5: 'Critical',
};

export const QUICK_LINK_PRESETS: Record<QuickLinkType, { label: string; placeholder: string; icon: string }> = {
  pricing:     { label: 'Pricing',      placeholder: 'https://example.com/pricing',              icon: '💰' },
  linkedin:    { label: 'LinkedIn',     placeholder: 'https://linkedin.com/company/...',          icon: 'in' },
  crunchbase:  { label: 'Crunchbase',   placeholder: 'https://crunchbase.com/organization/...',  icon: 'CB' },
  github:      { label: 'GitHub',       placeholder: 'https://github.com/...',                    icon: 'GH' },
  twitter:     { label: 'X / Twitter',  placeholder: 'https://x.com/...',                        icon: '𝕏'  },
  googlemaps:  { label: 'Google Maps',  placeholder: 'https://maps.google.com/?q=...',            icon: '📍' },
  yelp:        { label: 'Yelp',         placeholder: 'https://yelp.com/biz/...',                  icon: '⭐' },
  instagram:   { label: 'Instagram',    placeholder: 'https://instagram.com/...',                 icon: '📸' },
  facebook:    { label: 'Facebook',     placeholder: 'https://facebook.com/...',                  icon: '👥' },
  tripadvisor: { label: 'TripAdvisor',  placeholder: 'https://tripadvisor.com/...',               icon: '🧳' },
  custom:      { label: 'Custom',       placeholder: 'https://...',                               icon: '🔗' },
};
