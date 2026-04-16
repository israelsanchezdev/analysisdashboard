export type ColumnId = 'direct' | 'indirect' | 'watching';

export interface Tag {
  id: string;
  label: string;
  color: string;
}

export interface Competitor {
  id: string;
  name: string;
  url: string;
  favicon: string;
  description: string;
  tags: Tag[];
  notes: string;
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
