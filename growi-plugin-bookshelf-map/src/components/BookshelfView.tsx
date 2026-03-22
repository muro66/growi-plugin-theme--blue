import React from 'react';
import type { GrowiPage } from '../types';
import { fetchPagesUnderPath, buildPageUrl, filterDirectChildren } from '../api';
import './BookshelfView.css';

interface BookshelfViewProps {
  rootPath: string;
  onOpenShelf?: (path: string) => void;
}

export default function BookshelfView({ rootPath, onOpenShelf }: BookshelfViewProps) {
  const [pages, setPages] = React.useState<GrowiPage[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchPagesUnderPath(rootPath)
      .then((res) => {
        if (!cancelled) {
          const list = filterDirectChildren(res.pages || [], rootPath);
          setPages(list);
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [rootPath]);

  if (loading) return <div className="grw-bookshelf-loading">読み込み中...</div>;
  if (error) return <div className="grw-bookshelf-error">{error}</div>;

  const displayPath = rootPath === '/' ? '（ルート）' : rootPath;
  return (
    <div className="grw-bookshelf-view">
      <div className="grw-bookshelf-header">
        <span className="grw-bookshelf-path" title={rootPath}>{displayPath}</span>
      </div>
      <div className="grw-bookshelf-grid">
        {pages.length === 0 ? (
          <p className="grw-bookshelf-empty">この棚にはページがありません。</p>
        ) : (
          pages.map((p) => {
            const path = p.path || '';
            const title = p.title || path.split('/').pop() || '無題';
            const count = p.descendantCount ?? 0;
            const isContainer = path && (pages.some((x) => x.path !== path && x.path.startsWith(path + '/')) || count > 0);
            return (
              <article key={p.id} className="grw-bookshelf-card">
                <a
                  href={buildPageUrl(path, p.id)}
                  className="grw-bookshelf-card-link"
                  onClick={(e) => {
                    if (isContainer && onOpenShelf) {
                      e.preventDefault();
                      onOpenShelf(path);
                    }
                  }}
                >
                  <div className="grw-bookshelf-card-cover" aria-hidden>📄</div>
                  <h3 className="grw-bookshelf-card-title">{title}</h3>
                  {count > 0 && <span className="grw-bookshelf-card-meta">{count} ページ</span>}
                </a>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
