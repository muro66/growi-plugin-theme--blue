import React from 'react';
import { getCurrentPath, fetchPageByPath, fetchPagesUnderPath, filterDirectChildren, buildPageUrl } from '../api';
import { extractPageLinksFromBody } from '../graphUtils';
import './GraphView.css';

interface GraphNode {
  path: string;
  label: string;
  isCenter: boolean;
  pageId?: string;
}

interface GraphViewProps {
  rootPath?: string;
}

function shortenLabel(path: string, maxLen: number = 14): string {
  const name = path.split('/').filter(Boolean).pop() || path || '無題';
  return name.length <= maxLen ? name : name.slice(0, maxLen - 1) + '…';
}

export default function GraphView({ rootPath }: GraphViewProps) {
  const [nodes, setNodes] = React.useState<GraphNode[]>([]);
  const [edges, setEdges] = React.useState<[string, string][]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const centerPath = rootPath ?? getCurrentPath();

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([
      fetchPageByPath(centerPath),
      fetchPagesUnderPath(centerPath).then((r) => filterDirectChildren(r.pages || [], centerPath)),
    ])
      .then(([page, directChildren]) => {
        if (cancelled) return;
        const body = page?.revision?.body ?? page?.body ?? '';
        const links = extractPageLinksFromBody(body, centerPath);
        const centerLabel = page?.title ?? shortenLabel(centerPath, 20);
        const centerNode: GraphNode = { path: centerPath, label: centerLabel, isCenter: true, pageId: page?.id };
        const childPaths = links.length > 0
          ? links
          : directChildren.map((p) => p.path || '').filter(Boolean);
        const linkNodes: GraphNode[] = childPaths.map((path) => {
          const child = directChildren.find((c) => (c.path || '') === path);
          return {
            path,
            label: child?.title ?? shortenLabel(path),
            isCenter: false,
            pageId: child?.id,
          };
        });
        setNodes([centerNode, ...linkNodes]);
        setEdges(childPaths.map((path) => [centerPath, path]));
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [centerPath]);

  const handleNodeClick = (path: string, pageId?: string) => {
    window.location.href = buildPageUrl(path, pageId);
  };

  if (loading) return <div className="grw-graph-loading">読み込み中...</div>;
  if (error) return <div className="grw-graph-error">{error}</div>;
  if (nodes.length <= 1) {
    return (
      <div className="grw-graph-empty">
        表示するリンク・子ページがありません。本文に <code>[表示名](/path)</code> 形式のリンクがあるか、直下にページがあるとグラフに表示されます。
      </div>
    );
  }

  const w = 400;
  const h = 320;
  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.min(w, h) * 0.35;
  const linkNodes = nodes.filter((n) => !n.isCenter);
  const positions = new Map<string, { x: number; y: number }>();
  positions.set(centerPath, { x: cx, y: cy });
  linkNodes.forEach((n, i) => {
    const angle = (i / linkNodes.length) * 2 * Math.PI - Math.PI / 2;
    positions.set(n.path, {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    });
  });

  return (
    <div className="grw-graph-view" ref={containerRef}>
      <div className="grw-graph-header">
        <span className="grw-graph-path" title={centerPath}>
          {centerPath === '/' ? '（ルート）' : shortenLabel(centerPath, 24)}
        </span>
      </div>
      <svg className="grw-graph-svg" viewBox={`0 0 ${w} ${h}`} width="100%" height="100%">
        {edges.map(([from, to], i) => {
          const a = positions.get(from);
          const b = positions.get(to);
          if (!a || !b) return null;
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              className="grw-graph-edge"
            />
          );
        })}
        {nodes.map((n) => {
          const pos = positions.get(n.path);
          if (!pos) return null;
          return (
            <g
              key={n.path}
              className={'grw-graph-node' + (n.isCenter ? ' grw-graph-node-center' : '')}
              onClick={() => handleNodeClick(n.path, n.pageId)}
              style={{ cursor: 'pointer' }}
            >
              <circle cx={pos.x} cy={pos.y} r={n.isCenter ? 24 : 18} />
              <text
                x={pos.x}
                y={pos.y + 5}
                textAnchor="middle"
                className="grw-graph-label"
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="grw-graph-hint">ノードをクリックでページを開く</p>
    </div>
  );
}
