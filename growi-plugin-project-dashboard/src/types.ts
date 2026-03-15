export interface TicketMeta {
  status: string;
  project: string;
  assignee: string;
  startDate: string;
  dueDate: string;
  progress: number;
}

export interface DashboardTask {
  path: string;
  title: string;
  meta: TicketMeta;
}

export const DEFAULT_META: TicketMeta = {
  status: 'New',
  project: '',
  assignee: '',
  startDate: '',
  dueDate: '',
  progress: 0,
};

