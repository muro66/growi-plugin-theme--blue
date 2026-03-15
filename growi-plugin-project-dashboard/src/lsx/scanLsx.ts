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

export function scanLsxLists(): LsxTarget[] {
  if (typeof document === 'undefined') return [];
  const lists = Array.from(document.querySelectorAll('ul, ol')) as HTMLUListElement[];
  const targets: LsxTarget[] = [];

  for (const ul of lists) {
    // 簡易なヒューリスティック: data-lsx や lsx を含むクラス名を持つリストを対象にする
    const cls = ul.className || '';
    if (!cls.includes('lsx') && !ul.dataset.lsx) continue;

    const items = Array.from(ul.querySelectorAll('li > a')) as HTMLAnchorElement[];
    if (!items.length) continue;

    const paths: string[] = [];
    for (const a of items) {
      const p = extractPathFromAnchor(a.href);
      if (p) paths.push(p);
    }
    if (!paths.length) continue;

    const heading = ul.previousElementSibling;
    const title = heading && /^H[1-6]$/.test(heading.tagName) ? heading.textContent?.trim() || '' : 'Project Tasks';

    targets.push({
      root: ul,
      title,
      paths,
    });

    // 一覧そのものはダッシュボードに置き換えるので隠す
    ul.style.display = 'none';
  }

  return targets;
}

