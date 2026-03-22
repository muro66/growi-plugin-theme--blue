import React from 'react';
import BookshelfView from './BookshelfView';
import GraphView from './GraphView';
import { getCurrentPath } from '../api';
import './Panel.css';

type TabId = 'shelf' | 'graph';

interface PanelProps {
  onClose: () => void;
}

export default function Panel({ onClose }: PanelProps) {
  const initialPath = getCurrentPath();
  const [pathStack, setPathStack] = React.useState<string[]>([initialPath]);
  const [tab, setTab] = React.useState<TabId>('shelf');
  const rootPath = pathStack[pathStack.length - 1] ?? '/';

  const goToShelf = React.useCallback((path: string) => {
    setPathStack((prev) => [...prev, path]);
  }, []);

  const goBack = React.useCallback(() => {
    setPathStack((prev) => (prev.length <= 1 ? prev : prev.slice(0, -1)));
  }, []);

  const goRoot = React.useCallback(() => {
    setPathStack(['/']);
  }, []);

  const canGoBack = pathStack.length > 1;

  return (
    <div className="grw-bookshelf-panel" role="dialog" aria-label="本棚・グラフビュー">
      <header className="grw-bookshelf-panel-header">
        <div className="grw-bookshelf-panel-tabs">
          <button
            type="button"
            className={'grw-bookshelf-tab' + (tab === 'shelf' ? ' is-active' : '')}
            onClick={() => setTab('shelf')}
          >
            📚 本棚
          </button>
          <button
            type="button"
            className={'grw-bookshelf-tab' + (tab === 'graph' ? ' is-active' : '')}
            onClick={() => setTab('graph')}
          >
            🔗 グラフ
          </button>
        </div>
        <div className="grw-bookshelf-panel-actions">
          {tab === 'shelf' && canGoBack && (
            <button type="button" className="grw-bookshelf-btn grw-bookshelf-btn-back" onClick={goBack}>
              戻る
            </button>
          )}
          {tab === 'shelf' && (
            <>
              <button type="button" className="grw-bookshelf-btn grw-bookshelf-btn-root" onClick={goRoot}>
                ルート
              </button>
            </>
          )}
          <button type="button" className="grw-bookshelf-btn grw-bookshelf-btn-close" onClick={onClose}>
            閉じる
          </button>
        </div>
      </header>
      <div className="grw-bookshelf-panel-body">
        {tab === 'shelf' && <BookshelfView rootPath={rootPath} onOpenShelf={goToShelf} />}
        {tab === 'graph' && <GraphView rootPath={rootPath} />}
      </div>
    </div>
  );
}
