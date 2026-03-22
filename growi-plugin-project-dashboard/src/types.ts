export interface TicketMeta {
  status: string;
  project: string;
  assignee: string;
  startDate: string;
  dueDate: string;
  progress: number;
}

export interface DashboardTask {
  /** 一意キー・元のリンク先（ID またはパス） */
  path: string;
  /** 表示用リンク先。API から取得したパス（例: /project/sample/tasks/auth-api）があればそれを使う */
  href: string;
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

