import type { DashboardTask } from './types';
import type { LsxTarget } from './lsx/scanLsx';
import { parseTicketMeta } from './ticketMeta';
import { DEFAULT_META } from './types';

interface GrowiPage {
  id?: string;
  path?: string;
  title?: string;
  revision?: { body?: string };
  body?: string;
}

async function fetchPageByPath(path: string): Promise<GrowiPage | null> {
  const res = await fetch(`/_api/v3/page?path=${encodeURIComponent(path)}`);
  if (!res.ok) return null;
  const json = await res.json();
  return json.page ?? null;
}

export async function fetchTasksForLsx(target: LsxTarget): Promise<DashboardTask[]> {
  const tasks: DashboardTask[] = [];
  for (const path of target.paths) {
    const page = await fetchPageByPath(path);
    if (!page) continue;
    const body = page.revision?.body ?? page.body ?? '';
    const meta = parseTicketMeta(body) ?? DEFAULT_META;
    tasks.push({
      path,
      title: page.title ?? path.split('/').pop() ?? path,
      meta,
    });
  }
  return tasks;
}

