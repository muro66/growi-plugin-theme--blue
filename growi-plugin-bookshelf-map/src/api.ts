import type { PagesListResponse, GrowiPage } from './types';

/** 指定パスの直下の子のみにフィルタ（list API は配下全体を返すことがあるため） */
export function filterDirectChildren(pages: GrowiPage[], parentPath: string): GrowiPage[] {
  return pages.filter((p) => {
    const path = p.path || '';
    if (path === parentPath) return false;
    const prefix = parentPath === '/' ? '/' : parentPath.replace(/\/$/, '') + '/';
    if (!path.startsWith(prefix)) return false;
    const rest = path.slice(prefix.length);
    return rest !== '' && !rest.includes('/');
  });
}

const BASE = typeof window !== 'undefined' ? window.location.origin : '';

/**
 * GROWI API v3: 指定パス配下のページ一覧を取得
 */
export async function fetchPagesUnderPath(path: string): Promise<PagesListResponse> {
  const normalized = path.replace(/^\//, '') || '';
  const query = new URLSearchParams({ path: '/' + normalized });
  const url = `${BASE}/_api/v3/pages/list?${query}`;
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  return { pages: data.pages ?? [], totalCount: data.totalCount };
}

/**
 * GROWI API v3: パスで単一ページを取得（リンクプレビュー・グラフ用）
 */
export async function fetchPageByPath(path: string): Promise<GrowiPage | null> {
  const normalized = path.replace(/^\//, '') || '';
  const query = new URLSearchParams({ path: '/' + normalized });
  const url = `${BASE}/_api/v3/page?${query}`;
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) return null;
  const data = await res.json();
  return data.page ?? data ?? null;
}

/**
 * 現在表示中のページパスを取得（DOM または URL から推測）
 * 対応: data-page-path, meta growi:path, URL パス形式（/path または /path/to/page）
 */
export function getCurrentPath(): string {
  if (typeof window === 'undefined') return '/';
  const doc = document;
  const el = doc.querySelector('[data-page-path]') as HTMLElement | null;
  if (el?.dataset?.pagePath) return el.dataset.pagePath;
  const meta = doc.querySelector('meta[property="growi:path"]') as HTMLMetaElement | null;
  if (meta?.content) return meta.content;
  const pathname = window.location.pathname;
  const pageMatch = pathname.match(/^\/page\/(.+)$/);
  if (pageMatch) {
    const raw = pageMatch[1];
    return '/' + raw.split('/').map((s) => decodeURIComponent(s)).join('/');
  }
  if (pathname && pathname !== '/' && !/^\/[0-9a-f]{24}$/i.test(pathname)) {
    const decoded = pathname.split('/').filter(Boolean).map((s) => decodeURIComponent(s)).join('/');
    return decoded ? '/' + decoded : '/';
  }
  return '/';
}

/**
 * ページを開く URL を組み立てる。
 * pageId があればパーマリンク（ID形式）、なければパス形式（/:path）
 * @see https://docs.growi.org/ja/guide/features/copy_to_clipboard.html
 */
export function buildPageUrl(path: string, pageId?: string): string {
  if (typeof window === 'undefined') return '';
  const origin = window.location.origin;
  if (pageId && /^[0-9a-f]{24}$/i.test(pageId)) {
    return `${origin}/${pageId}`;
  }
  const segments = path.split('/').filter((s) => s !== undefined && s !== '');
  const encoded = segments.map((s) => encodeURIComponent(s)).join('/');
  return `${origin}/${encoded}`;
}
