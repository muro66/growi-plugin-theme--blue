/**
 * サイドバー: Create（ページ作成）を先頭にし、プラグイン用ボタンはその直下に並べる。
 * GROWI の DOM 差分に耐えるため複数の探索方法を試す。
 */

const PLUGIN_BTN_CLASS = 'grw-plugin-sidebar-btn';

/** Create 操作とみなすノード（移動・基準点の両方に使う） */
export function findSidebarCreateRoot(container: Element): HTMLElement | null {
  const selectors = [
    '[data-testid="open-page-create-modal"]',
    '[data-testid="grw-sidebar-nav-create-page"]',
    '[data-testid*="create-page"]',
    'a[href*="/new"]',
    'button[aria-label*="Create"]',
    'button[aria-label*="作成"]',
    'a[aria-label*="Create"]',
    'a[aria-label*="作成"]',
  ];
  for (const sel of selectors) {
    const el = container.querySelector(sel);
    if (el) {
      const root = (el.closest('[class*="sidebar"] li') as HTMLElement) || (el.closest('li') as HTMLElement) || (el.parentElement as HTMLElement);
      if (root && container.contains(root)) return root;
      return el as HTMLElement;
    }
  }
  // Material Symbols: ペン・ノート追加系（Create 付近）
  const icons = container.querySelectorAll('.material-symbols-outlined, .material-icons');
  for (const icon of icons) {
    const t = (icon.textContent || '').trim();
    if (/^(edit_square|edit|draw|note_add|post_add|add_circle)$/i.test(t) || t === 'edit_note') {
      const btn = icon.closest('button, a[href], [role="button"]');
      if (btn && container.contains(btn)) {
        const root =
          (btn.closest('[class*="Primary"]') as HTMLElement) ||
          (btn.closest('li') as HTMLElement) ||
          (btn.parentElement as HTMLElement);
        return root && container.contains(root) ? root : (btn as HTMLElement);
      }
    }
  }
  return null;
}

/**
 * 既存のプラグイン用サイドバーボタン（他プラグイン含む）のうち、コンテナ内で最後のもの。
 * `exclude` を渡すと再配置時に自分自身を除いて「直前のプラグイン」を求められる。
 */
export function findLastPluginSidebarBtn(container: Element, exclude?: HTMLElement): HTMLElement | null {
  const nodes = container.querySelectorAll(`.${PLUGIN_BTN_CLASS}`);
  for (let i = nodes.length - 1; i >= 0; i--) {
    const n = nodes[i] as HTMLElement;
    if (exclude && n === exclude) continue;
    return n;
  }
  return null;
}

/**
 * Create をサイドバー内の先頭に移す（可能なときのみ）。
 * React 再描画で元に戻る場合は遅延リトライ側で再度試す。
 */
export function moveCreateControlToFirst(container: HTMLElement, createRoot: HTMLElement): void {
  if (!container.contains(createRoot)) return;
  if (container.firstElementChild === createRoot) return;
  try {
    container.insertBefore(createRoot, container.firstChild);
  } catch {
    /* ignore */
  }
}

/** このボタンの直前に来るべきプラグイン（同一コンテナ内・ツリー順）。なければ Create ルート。 */
function resolvePluginInsertAnchor(
  container: HTMLElement,
  button: HTMLElement,
  createRoot: HTMLElement | null
): HTMLElement | null {
  const all = [...container.querySelectorAll(`.${PLUGIN_BTN_CLASS}`)] as HTMLElement[];
  const selfIdx = all.indexOf(button);
  if (selfIdx === -1) {
    const last = all.length ? all[all.length - 1] : null;
    if (last && container.contains(last)) return last;
    return createRoot;
  }
  if (selfIdx === 0) return createRoot;
  const prev = all[selfIdx - 1];
  return prev && container.contains(prev) ? prev : createRoot;
}

/**
 * プラグインボタンを Create 直下のプラグイン列に配置（既存なら順序を保ったまま位置だけ整える）。
 */
export function insertPluginButtonAfterCreate(
  container: HTMLElement,
  button: HTMLElement,
  createRoot: HTMLElement | null
): void {
  const anchor = resolvePluginInsertAnchor(container, button, createRoot);
  if (anchor && container.contains(anchor)) {
    const ref = anchor.nextSibling;
    if (ref === button) return;
    if (ref) {
      container.insertBefore(button, ref);
      return;
    }
    container.appendChild(button);
    return;
  }
  if (container.firstElementChild) {
    const ref = container.firstElementChild.nextSibling;
    if (ref && ref !== button) container.insertBefore(button, ref);
    else if (!ref) container.appendChild(button);
  } else {
    container.appendChild(button);
  }
}

export function ensureSidebarPluginStyles(): void {
  if (document.getElementById('grw-gantt-sidebar-plugin-styles')) return;
  const style = document.createElement('style');
  style.id = 'grw-gantt-sidebar-plugin-styles';
  style.textContent = `
.${PLUGIN_BTN_CLASS} {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  min-width: 40px;
  margin: 0.35rem auto;
  padding: 0;
  border-radius: 8px;
  border: 1px solid rgba(79, 195, 247, 0.5);
  background: rgba(0, 4, 62, 0.6);
  color: #e8eaf6;
  box-shadow: 0 0 10px rgba(0, 188, 212, 0.15);
  cursor: pointer;
  flex-shrink: 0;
}
.${PLUGIN_BTN_CLASS}:hover {
  background: rgba(0, 188, 212, 0.12);
  border-color: rgba(79, 195, 247, 0.85);
  box-shadow: 0 0 12px rgba(0, 188, 212, 0.28);
}
.${PLUGIN_BTN_CLASS}:focus-visible {
  outline: 2px solid rgba(79, 195, 247, 0.8);
  outline-offset: 2px;
}
.${PLUGIN_BTN_CLASS} svg {
  display: block;
  flex-shrink: 0;
}
`;
  document.head.appendChild(style);
}

export { PLUGIN_BTN_CLASS };
