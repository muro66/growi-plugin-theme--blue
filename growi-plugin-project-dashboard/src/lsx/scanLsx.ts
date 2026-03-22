export interface LsxTarget {
  root: HTMLUListElement;
  title: string;
  paths: string[];
}

function extractPathFromAnchor(href: string): string | null {
  try {
    const url = new URL(href, window.location.origin);
    return url.pathname || null;
  } catch {
    return null;
  }
}

/** 同一オリジンのページパスか（先頭が / で、# や ? は含まない） */
function isPagePath(path: string): boolean {
  if (!path || path.charAt(0) !== '/') return false;
  try {
    const u = new URL(path, window.location.origin);
    return u.origin === window.location.origin && u.pathname.length > 1;
  } catch {
    return false;
  }
}

export function scanLsxLists(): LsxTarget[] {
  if (typeof document === 'undefined') return [];
  const targets: LsxTarget[] = [];

  // メインコンテンツ内に限定（GROWI は .wiki や #content などを使うことが多い）
  const scope = document.querySelector('.wiki, .content, #content, [class*="page-body"], main') || document.body;
  const lists = Array.from(scope.querySelectorAll('ul, ol')) as HTMLUListElement[];

  for (const ul of lists) {
    // GROWI lsx は <div class="lsx"><div class="page-list"><ul class="page-list-ul">…</ul></div></div> という構造で、
    // li 直下ではなく li > div > a.page-list-link になっているため、a を広めに拾う
    const items = Array.from(
      ul.querySelectorAll('a.page-list-link, li a')
    ) as HTMLAnchorElement[];
    if (items.length < 1) continue;

    const paths: string[] = [];
    for (const a of items) {
      const p = extractPathFromAnchor(a.href);
      if (p && isPagePath(p)) paths.push(p);
    }
    // リンクのほとんどがページパスなら lsx またはページリンクリストとみなす
    if (paths.length < 1 || paths.length < items.length * 0.5) continue;

    // すでにダッシュボードを挿入済みのリストはスキップ（再スキャン時の重複防止）
    if (ul.previousElementSibling?.classList?.contains('grw-project-dashboard-root')) continue;

    // 見出しの直後なら確実（例: ## Tasks の次のリスト）
    const prev = ul.previousElementSibling;
    const title =
      prev && /^H[1-6]$/.test(prev.tagName) ? (prev.textContent?.trim() || '') : 'Project Tasks';

    targets.push({
      root: ul,
      title: title || 'Tasks',
      paths,
    });

    ul.style.display = 'none';
  }

  return targets;
}

