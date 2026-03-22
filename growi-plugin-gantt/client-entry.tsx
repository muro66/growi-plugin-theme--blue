import React from 'react';
import { createRoot } from 'react-dom/client';
import Panel from './src/components/Panel';
import {
  ensureSidebarPluginStyles,
  findSidebarCreateRoot,
  insertPluginButtonAfterCreate,
  moveCreateControlToFirst,
  PLUGIN_BTN_CLASS,
} from './src/sidebar/sidebarButton';

const PLUGIN_ID = 'growi-plugin-gantt';
const SIDEBAR_BTN_ID = 'grw-gantt-sidebar-btn';
const PANEL_ROOT_ID = 'grw-gantt-panel-root';
const FALLBACK_BTN_ID = 'grw-gantt-fallback-btn';

let sidebarObserver: MutationObserver | null = null;
let repositionRaf = 0;

function disconnectSidebarObserver(): void {
  sidebarObserver?.disconnect();
  sidebarObserver = null;
}

function scheduleRepositionSidebar(): void {
  if (repositionRaf) cancelAnimationFrame(repositionRaf);
  repositionRaf = requestAnimationFrame(() => {
    repositionRaf = 0;
    repositionSidebarButtonIfPresent();
  });
}

/** ガント（棒グラフ）を表す線画 SVG — テーマのモノクロアイコンに合わせる */
const GANTT_ICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20V10"/><path d="M12 20V4"/><path d="M20 20v-8"/></svg>';

function getSidebarContainer(): HTMLElement | null {
  return (
    document.querySelector('.grw-sidebar-nav') ||
    document.querySelector('.grw-sidebar-content') ||
    document.querySelector('.grw-sidebar .grw-sidebar-nav-container') ||
    document.querySelector('.grw-sidebar-nav-container') ||
    document.querySelector('#grw-sidebar-nav') ||
    document.querySelector('[class*="grw-sidebar"]') ||
    document.querySelector('[class*="sidebar"]') ||
    document.querySelector('.sidebar')
  ) as HTMLElement | null;
}

function ensurePanelRoot(): HTMLDivElement {
  let root = document.getElementById(PANEL_ROOT_ID) as HTMLDivElement | null;
  if (!root) {
    root = document.createElement('div');
    root.id = PANEL_ROOT_ID;
    document.body.appendChild(root);
  }
  return root;
}

function createButton(id: string): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.id = id;
  btn.type = 'button';
  btn.className = `${PLUGIN_BTN_CLASS} grw-gantt-sidebar-btn`;
  btn.setAttribute('aria-label', 'チケット・ガントを開く');
  btn.title = 'チケット・ガントを開く';
  btn.innerHTML = GANTT_ICON_SVG;
  btn.addEventListener('click', openPanel);
  return btn;
}

/** Create を先頭へ、プラグインボタンをその直下の列へ配置 */
function layoutSidebarButton(btn: HTMLElement, container: HTMLElement): void {
  ensureSidebarPluginStyles();
  const createRoot = findSidebarCreateRoot(container);
  if (createRoot) moveCreateControlToFirst(container, createRoot);
  insertPluginButtonAfterCreate(container, btn, createRoot);
}

function addSidebarButton(): boolean {
  if (document.getElementById(SIDEBAR_BTN_ID) || document.getElementById(FALLBACK_BTN_ID)) return true;
  const container = getSidebarContainer();
  if (container) {
    const btn = createButton(SIDEBAR_BTN_ID);
    layoutSidebarButton(btn, container);
    return true;
  }
  return false;
}

/** 既にボタンがあるとき、SPA 再描画後などに位置だけ直す */
function repositionSidebarButtonIfPresent(): void {
  const btn = document.getElementById(SIDEBAR_BTN_ID) as HTMLButtonElement | null;
  if (!btn) return;
  const container = getSidebarContainer();
  if (!container || !container.contains(btn)) return;
  layoutSidebarButton(btn, container);
}

function addFallbackButton(): void {
  if (document.getElementById(FALLBACK_BTN_ID)) return;
  const btn = createButton(FALLBACK_BTN_ID);
  btn.style.position = 'fixed';
  btn.style.left = '8px';
  btn.style.top = '50%';
  btn.style.transform = 'translateY(-50%)';
  btn.style.zIndex = '1040';
  document.body.appendChild(btn);
}

function openPanel(): void {
  const rootEl = ensurePanelRoot();
  rootEl.innerHTML = '';
  const root = createRoot(rootEl);
  root.render(
    React.createElement(Panel, {
      onClose: () => {
        root.unmount();
        rootEl.innerHTML = '';
      },
    })
  );
}

function removeSidebarButton(): void {
  document.getElementById(SIDEBAR_BTN_ID)?.remove();
  document.getElementById(FALLBACK_BTN_ID)?.remove();
}

function removePanelRoot(): void {
  document.getElementById(PANEL_ROOT_ID)?.remove();
}

const activate = (): void => {
  if (typeof window === 'undefined') return;
  function tryAdd() {
    if (addSidebarButton()) {
      repositionSidebarButtonIfPresent();
      return;
    }
    addFallbackButton();
  }
  tryAdd();
  if (document.readyState !== 'complete') {
    window.addEventListener('load', tryAdd);
  }
  [500, 1500, 3000, 5000].forEach((ms) =>
    setTimeout(() => {
      if (document.getElementById(SIDEBAR_BTN_ID)) {
        repositionSidebarButtonIfPresent();
        document.getElementById(FALLBACK_BTN_ID)?.remove();
        return;
      }
      if (addSidebarButton()) {
        document.getElementById(FALLBACK_BTN_ID)?.remove();
      } else {
        addFallbackButton();
      }
    }, ms)
  );

  // サイドバーが React で差し替わったあと、Create 先頭・プラグイン列を維持
  disconnectSidebarObserver();
  sidebarObserver = new MutationObserver(() => scheduleRepositionSidebar());
  const tryObserve = () => {
    const c = getSidebarContainer();
    if (c) {
      sidebarObserver?.observe(c, { childList: true, subtree: false });
    }
  };
  tryObserve();
  setTimeout(tryObserve, 800);
};

const deactivate = (): void => {
  disconnectSidebarObserver();
  removeSidebarButton();
  removePanelRoot();
};

declare global {
  interface Window {
    pluginActivators?: Record<string, { activate: () => void; deactivate: () => void }>;
  }
}

if (typeof window !== 'undefined') {
  if (window.pluginActivators == null) window.pluginActivators = {};
  window.pluginActivators[PLUGIN_ID] = { activate, deactivate };
}
