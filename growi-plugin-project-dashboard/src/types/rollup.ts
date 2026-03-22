/**
 * Rollup 集計結果（仕様: docs/spec-relation-rollup.md）
 * 子タスク群から算出する派生指標。
 */

export interface RollupMetrics {
  /** 0–100 */
  completionRate: number;
  overdueCount: number;
  /** relations の blocker で、先が未完了とみなせる件数（簡易版は blocker 件数のみでも可） */
  blockerOpenCount: number;
  /** risk 型 relation の件数（将来拡張） */
  riskOpenCount: number;
}

export function emptyRollup(): RollupMetrics {
  return {
    completionRate: 0,
    overdueCount: 0,
    blockerOpenCount: 0,
    riskOpenCount: 0,
  };
}
