export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';
export type Status = 'todo' | 'in-progress' | 'in-review' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  order: number;
  createdAt: string;
}

export interface Column {
  id: Status;
  label: string;
  color: string;
}

export const COLUMNS: Column[] = [
  { id: 'todo', label: 'TO DO', color: '#4f7dff' },
  { id: 'in-progress', label: 'IN PROGRESS', color: '#f59e0b' },
  { id: 'in-review', label: 'IN REVIEW', color: '#8b5cf6' },
  { id: 'done', label: 'DONE', color: '#10b981' },
];

export const PRIORITY_COLORS: Record<Priority, { bg: string; text: string }> = {
  HIGH: { bg: '#fee2e2', text: '#ef4444' },
  MEDIUM: { bg: '#fef3c7', text: '#f59e0b' },
  LOW: { bg: '#f0fdf4', text: '#22c55e' },
};
