import type { TicketMeta } from './types';
import { DEFAULT_META } from './types';

const BLOCK_REGEX = /^```ticket-meta\s*\n([\s\S]*?)\n```/m;

function metaFromObject(o: Record<string, unknown> | null): TicketMeta | null {
  if (!o || typeof o !== 'object') return null;
  const progress = o.progress;
  const numProgress = typeof progress === 'number' ? progress : Number(progress);
  return {
    status: String(o.status ?? DEFAULT_META.status),
    project: String(o.project ?? DEFAULT_META.project ?? ''),
    assignee: String(o.assignee ?? DEFAULT_META.assignee),
    startDate: String(o.startDate ?? DEFAULT_META.startDate),
    dueDate: String(o.dueDate ?? DEFAULT_META.dueDate),
    progress: Number.isFinite(numProgress) ? numProgress : DEFAULT_META.progress,
  };
}

export function parseTicketMeta(body: string | undefined): TicketMeta | null {
  if (!body) return null;
  const m = body.match(BLOCK_REGEX);
  if (!m) return null;
  const raw = m[1].trim();
  try {
    const o = JSON.parse(raw) as Record<string, unknown>;
    return metaFromObject(o);
  } catch {
    // YAML 風 (key: value) も簡易的にサポート
    const out: Record<string, unknown> = {};
    const lines = raw.split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const colonIdx = trimmed.indexOf(':');
      if (colonIdx <= 0) continue;
      const key = trimmed.slice(0, colonIdx).trim();
      let val = trimmed.slice(colonIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith('\'') && val.endsWith('\''))) {
        val = val.slice(1, -1);
      }
      if (key) out[key] = val;
    }
    return metaFromObject(Object.keys(out).length ? out : null);
  }
}

