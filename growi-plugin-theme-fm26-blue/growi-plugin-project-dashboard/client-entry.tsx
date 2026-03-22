import { createRoot } from 'react-dom/client';
import { scanLsxLists } from './src/lsx/scanLsx';
import { fetchTasksForLsx } from './src/api';
import { Dashboard } from './src/components/Dashboard';

const PLUGIN_ID = 'growi-plugin-project-dashboard';

async function enhanceLsxDashboards(): Promise<void> {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const targets = scanLsxLists();
  if (!targets.length) return;

  for (const target of targets) {
    const container = document.createElement('div');
    container.className = 'grw-project-dashboard-root';
    target.root.parentElement?.insertBefore(container, target.root);

    try {
      const tasks = await fetchTasksForLsx(target);
      const root = createRoot(container);
      root.render(
        <Dashboard
          title={target.title}
          tasks={tasks}
        />,
      );
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[project-dashboard] failed to build dashboard', e);
    }
  }
}

const activate = (): void => {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    enhanceLsxDashboards();
  } else {
    window.addEventListener('DOMContentLoaded', () => enhanceLsxDashboards());
  }
};

const deactivate = (): void => {
  document.querySelectorAll('.grw-project-dashboard-root').forEach((el) => el.remove());
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

