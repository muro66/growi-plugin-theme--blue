/**
 * 自サイトリンクにマウスオーバーでリンク先ページの要約をポップオーバー表示する
 */

import { fetchPageByPath, buildPageUrl } from './api';

const HOVER_DELAY_MS = 500;
const SUMMARY_LENGTH = 200;
const CACHE_TTL_MS = 5 * 60 * 1000;
const POPOVER_ID = 'grw-bookshelf-link-preview';

interface CachedPage {
  title: string;
  summary: string;
  path: string;
  pageId?: string;
  at: number;
}

const cache = new Map<string, CachedPage>();

function getPathFromHref(href: string): string | null {
  if (typeof href !== 'string') return null;
  try {
    const url = href.startsWith('http') ? new URL(href) : new URL(href, window.location.origin);
    const pathname = url.pathname;
    if (url.origin !== window.location.origin) return null;
    // パス形式: /Path/To/Page（従来の /page/... も受け付ける）
    const pageMatch = pathname.match(/^\/page(\/(.*))?$/);
    if (pageMatch) {
      const after = pageMatch[2] ?? '';
      return '/' + after.split('/').map((s) => decodeURIComponent(s)).join('/');
    }
    // パス形式（page 階層なし）: /Path/To/Page（先頭が / で 24 文字 hex だけの場合は ID 形式のためスキップ）
    if (pathname === '' || pathname === '/') return null;
    if (/^\/[0-9a-f]{24}$/i.test(pathname)) return null;
    const decoded = pathname.split('/').filter(Boolean).map((s) => decodeURIComponent(s)).join('/');
    return decoded ? '/' + decoded : null;
  } catch {
    return null;
  }
}


function getSummary(body: string | undefined): string {
  if (!body) return '';
  const plain = body.replace(/#{1,6}\s/g, '').replace(/\*\*?|__?/g, '').replace(/\s+/g, ' ').trim();
  return plain.length <= SUMMARY_LENGTH ? plain : plain.slice(0, SUMMARY_LENGTH) + '…';
}

function ensurePopoverContainer(): HTMLDivElement {
  let el = document.getElementById(POPOVER_ID) as HTMLDivElement | null;
  if (!el) {
    el = document.createElement('div');
    el.id = POPOVER_ID;
    el.setAttribute('aria-hidden', 'true');
    el.style.cssText = 'position:fixed;z-index:1060;max-width:320px;display:none;pointer-events:none;';
    document.body.appendChild(el);
  }
  return el;
}

function showPopover(x: number, y: number, title: string, summary: string, path: string, pageId?: string): void {
  const base = ensurePopoverContainer();
  const pageUrl = buildPageUrl(path, pageId);
  base.innerHTML = `
    <div class="grw-bookshelf-link-preview" style="
      background:#0a0a2e; border:1px solid rgba(79,195,247,0.5); border-radius:8px;
      padding:0.75rem 1rem; box-shadow:0 4px 20px rgba(0,0,0,0.4); color:#e8eaf6;
      font-size:0.875rem; line-height:1.4;">
      <div style="font-weight:600; margin-bottom:0.35rem;">${escapeHtml(title || '無題')}</div>
      <div style="color:rgba(232,234,246,0.85); font-size:0.8rem;">${escapeHtml(summary)}</div>
      <a href="${escapeAttr(pageUrl)}" style="color:#4fc3f7; margin-top:0.5rem; display:inline-block;">ページを開く</a>
    </div>`;
  const box = base.firstElementChild as HTMLElement;
  base.style.display = 'block';
  const rect = box.getBoundingClientRect();
  const pad = 12;
  let left = x + pad;
  let top = y + pad;
  if (left + rect.width > window.innerWidth) left = x - rect.width - pad;
  if (top + rect.height > window.innerHeight) top = window.innerHeight - rect.height - pad;
  if (top < pad) top = pad;
  if (left < pad) left = pad;
  base.style.left = left + 'px';
  base.style.top = top + 'px';
}

function escapeHtml(s: string): string {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function hidePopover(): void {
  const el = document.getElementById(POPOVER_ID);
  if (el) {
    el.style.display = 'none';
    el.innerHTML = '';
  }
}

let hoverTimer: ReturnType<typeof setTimeout> | null = null;
let currentPath: string | null = null;

function onMouseOver(e: MouseEvent): void {
  const target = (e.target as HTMLElement).closest('a');
  if (!target?.href) return;
  const path = getPathFromHref(target.href);
  if (!path) return;

  if (hoverTimer) clearTimeout(hoverTimer);
  currentPath = path;
  hoverTimer = setTimeout(() => {
    hoverTimer = null;
    const cached = cache.get(path);
    const now = Date.now();
    if (cached && now - cached.at < CACHE_TTL_MS) {
      showPopover(e.clientX, e.clientY, cached.title, cached.summary, path, cached.pageId);
      return;
    }
    fetchPageByPath(path).then((page) => {
      if (currentPath !== path) return;
      if (!page) {
        showPopover(e.clientX, e.clientY, '（取得できません）', '', path);
        return;
      }
      const body = page.revision?.body ?? page.body ?? '';
      const title = page.title ?? path.split('/').filter(Boolean).pop() ?? '無題';
      const summary = getSummary(body);
      cache.set(path, { title, summary, path, pageId: page.id, at: Date.now() });
      showPopover(e.clientX, e.clientY, title, summary, path, page.id);
    }).catch(() => {
      if (currentPath === path) showPopover(e.clientX, e.clientY, '（取得できません）', '', path);
    });
  }, HOVER_DELAY_MS);
}

function onMouseOut(e: MouseEvent): void {
  const related = (e.relatedTarget as Node)?.parentNode;
  const from = (e.target as HTMLElement).closest('a');
  if (from && related && from.contains(related)) return;
  if (hoverTimer) {
    clearTimeout(hoverTimer);
    hoverTimer = null;
  }
  currentPath = null;
  hidePopover();
}

function onMouseMove(e: MouseEvent): void {
  const el = document.getElementById(POPOVER_ID);
  if (!el || el.style.display !== 'block') return;
  const box = el.firstElementChild as HTMLElement;
  if (!box) return;
  const rect = box.getBoundingClientRect();
  const pad = 12;
  let left = e.clientX + pad;
  let top = e.clientY + pad;
  if (left + rect.width > window.innerWidth) left = e.clientX - rect.width - pad;
  if (top + rect.height > window.innerHeight) top = window.innerHeight - rect.height - pad;
  if (top < pad) top = pad;
  if (left < pad) left = pad;
  el.style.left = left + 'px';
  el.style.top = top + 'px';
}

export function setupLinkPreview(): void {
  if (typeof document === 'undefined') return;
  document.addEventListener('mouseover', onMouseOver, true);
  document.addEventListener('mouseout', onMouseOut, true);
  document.addEventListener('mousemove', onMouseMove, true);
}

export function cleanupLinkPreview(): void {
  if (hoverTimer) clearTimeout(hoverTimer);
  hoverTimer = null;
  currentPath = null;
  hidePopover();
  document.removeEventListener('mouseover', onMouseOver, true);
  document.removeEventListener('mouseout', onMouseOut, true);
  document.removeEventListener('mousemove', onMouseMove, true);
  const el = document.getElementById(POPOVER_ID);
  el?.remove();
}
