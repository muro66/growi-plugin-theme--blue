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

/** 24文字の16進ならページIDとみなす（GROWI パーマリンク） */
function isPageId(s: string): boolean {
  return /^[0-9a-f]{24}$/i.test(s.replace(/^\//, '').trim());
}

async function fetchPage(pathOrId: string): Promise<GrowiPage | null> {
  const base = typeof window !== 'undefined' ? window.location.origin : '';
  const id = pathOrId.replace(/^\//, '').trim();

  if (isPageId(id)) {
    const res = await fetch(`${base}/_api/v3/page?pageId=${encodeURIComponent(id)}`, { credentials: 'include' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.page ?? json ?? null;
  }

  const path = pathOrId.startsWith('/') ? pathOrId : '/' + pathOrId;
  const res = await fetch(`${base}/_api/v3/page?path=${encodeURIComponent(path)}`, {
    credentials: 'include',
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.page ?? null;
}

export async function fetchTasksForLsx(target: LsxTarget): Promise<DashboardTask[]> {
  const tasks: DashboardTask[] = [];
  for (const path of target.paths) {
    const page = await fetchPage(path);
    if (!page) continue;
    const body = page.revision?.body ?? page.body ?? '';
    const meta = parseTicketMeta(body) ?? DEFAULT_META;
    const pagePath = page.path != null && String(page.path).trim() !== ''
      ? (String(page.path).startsWith('/') ? String(page.path) : '/' + String(page.path))
      : path;
    tasks.push({
      path,
      href: pagePath,
      title: page.title ?? path.split('/').pop() ?? path,
      meta,
    });
  }
  return tasks;
}

