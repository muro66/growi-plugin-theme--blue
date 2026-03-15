import React from 'react';
import type { DashboardTask } from '../types';
import './Dashboard.css';

interface Props {
  title: string;
  tasks: DashboardTask[];
}

function groupBy<T, K extends string | number>(items: T[], keyFn: (item: T) => K): Map<K, T[]> {
  const m = new Map<K, T[]>();
  for (const item of items) {
    const k = keyFn(item);
    const arr = m.get(k);
    if (arr) arr.push(item);
    else m.set(k, [item]);
  }
  return m;
}

function computeStatusSummary(tasks: DashboardTask[]) {
  const map = groupBy(tasks, (t) => t.meta.status || 'Unknown');
  return Array.from(map.entries()).map(([status, items]) => ({ status, count: items.length }));
}

function computeAssigneeSummary(tasks: DashboardTask[]) {
  const map = groupBy(tasks, (t) => t.meta.assignee || '未担当');
  return Array.from(map.entries()).map(([assignee, items]) => ({ assignee, count: items.length }));
}

function computeDeadlineSummary(tasks: DashboardTask[]) {
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfWeek = new Date(startOfToday);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  let dueToday = 0;
  let dueThisWeek = 0;
  let overdue = 0;

  for (const t of tasks) {
    if (!t.meta.dueDate) continue;
    const d = new Date(t.meta.dueDate);
    if (Number.isNaN(d.getTime())) continue;
    if (d < startOfToday) overdue += 1;
    else if (d.getTime() === startOfToday.getTime()) dueToday += 1;
    else if (d <= endOfWeek) dueThisWeek += 1;
  }
  return { dueToday, dueThisWeek, overdue };
}

export const Dashboard: React.FC<Props> = ({ title, tasks }) => {
  if (!tasks.length) return null;

  const statusSummary = computeStatusSummary(tasks);
  const assigneeSummary = computeAssigneeSummary(tasks);
  const deadlineSummary = computeDeadlineSummary(tasks);

  return (
    <section className="grw-project-dashboard">
      <header className="grw-project-dashboard-header">
        <h2 className="grw-project-dashboard-title">{title}</h2>
        <span className="grw-project-dashboard-count">{tasks.length} 件</span>
      </header>

      <div className="grw-project-dashboard-cards">
        <div className="grw-project-dashboard-card">
          <h3 className="grw-project-dashboard-card-title">ステータス</h3>
          <ul className="grw-project-dashboard-list">
            {statusSummary.map((s) => (
              <li key={s.status} className="grw-project-dashboard-list-item">
                <span className="grw-project-dashboard-label">{s.status}</span>
                <span className="grw-project-dashboard-value">{s.count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grw-project-dashboard-card">
          <h3 className="grw-project-dashboard-card-title">担当別</h3>
          <ul className="grw-project-dashboard-list">
            {assigneeSummary.map((a) => (
              <li key={a.assignee} className="grw-project-dashboard-list-item">
                <span className="grw-project-dashboard-label">{a.assignee}</span>
                <span className="grw-project-dashboard-value">{a.count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grw-project-dashboard-card">
          <h3 className="grw-project-dashboard-card-title">期限</h3>
          <ul className="grw-project-dashboard-list">
            <li className="grw-project-dashboard-list-item">
              <span className="grw-project-dashboard-label">今日まで</span>
              <span className="grw-project-dashboard-value">{deadlineSummary.dueToday}</span>
            </li>
            <li className="grw-project-dashboard-list-item">
              <span className="grw-project-dashboard-label">今週まで</span>
              <span className="grw-project-dashboard-value">{deadlineSummary.dueThisWeek}</span>
            </li>
            <li className="grw-project-dashboard-list-item">
              <span className="grw-project-dashboard-label">期限超過</span>
              <span className="grw-project-dashboard-value">{deadlineSummary.overdue}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="grw-project-dashboard-list-wrapper">
        <h3 className="grw-project-dashboard-card-title">タスク一覧</h3>
        <ul className="grw-project-dashboard-task-list">
          {tasks.map((t) => (
            <li key={t.path} className="grw-project-dashboard-task">
              <a href={t.path} className="grw-project-dashboard-task-title">
                {t.title}
              </a>
              <div className="grw-project-dashboard-task-meta">
                <span className="grw-project-dashboard-badge">{t.meta.status}</span>
                <span className="grw-project-dashboard-text">{t.meta.assignee || '未担当'}</span>
                <span className="grw-project-dashboard-text">
                  {t.meta.startDate || '—'} ～ {t.meta.dueDate || '—'}
                </span>
                <span className="grw-project-dashboard-text">{t.meta.progress}%</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

