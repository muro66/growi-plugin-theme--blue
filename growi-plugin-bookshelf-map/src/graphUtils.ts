/**
 * ページ本文（Markdown）から自サイトへのリンクパスを抽出
 */

/**
 * 絶対パスに正規化（先頭 / あり、デコード済み）
 */
export function normalizePath(path: string, currentPath: string): string {
  const s = path.trim();
  if (!s) return currentPath;
  if (s.startsWith('/')) return '/' + s.replace(/^\/+/, '').replace(/#.*$/, '').trim();
  const base = currentPath.replace(/\/[^/]*$/, '') || '/';
  const joined = base === '/' ? '/' + s : base + '/' + s;
  return '/' + joined.replace(/^\/+/, '').replace(/\/+/g, '/').replace(/#.*$/, '').trim();
}

/**
 * Markdown 本文から GROWI ページリンクのパスを抽出
 * 対応: [text](/path), [text](/path#anchor), [text](path)
 */
export function extractPageLinksFromBody(body: string, currentPath: string): string[] {
  if (!body) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  const regex = /\]\s*\(\s*([^)\s#]+)(?:#[\w-]*)?\s*\)/g;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(body)) !== null) {
    const raw = m[1].trim();
    if (raw.startsWith('http:') || raw.startsWith('https:') || raw.startsWith('mailto:')) continue;
    const path = normalizePath(raw, currentPath);
    if (path && path !== currentPath && !seen.has(path)) {
      seen.add(path);
      out.push(path);
    }
  }
  return out;
}
