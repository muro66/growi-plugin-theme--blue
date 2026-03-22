/**
 * ticket-intent ブロックの型（仕様: docs/schema-ticket-intent.md）
 */

export type RelationType = 'blocker' | 'dependency' | 'risk' | 'impact';

export interface TicketIntentRelation {
  type: RelationType;
  /** ページパス（/project/...）または 24hex pageId */
  target: string;
  note?: string;
}

export interface TicketIntentEmergencyBypass {
  used: boolean;
  reason?: string;
  at?: string;
}

export interface TicketIntent {
  question?: string;
  decision: string;
  nextAction: string;
  impactTarget: string;
  /** YYYY-MM-DD */
  due: string;
  relations?: TicketIntentRelation[];
  emergencyBypass?: TicketIntentEmergencyBypass;
}

/** ゲート用: 必須4項目が揃い、日付が妥当なら true */
export function isTicketIntentFilled(intent: TicketIntent | null): boolean {
  if (!intent) return false;
  const d = intent.decision?.trim();
  const n = intent.nextAction?.trim();
  const i = intent.impactTarget?.trim();
  const due = intent.due?.trim();
  if (!d || !n || !i || !due) return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(due)) return false;
  const t = Date.parse(due);
  if (Number.isNaN(t)) return false;
  if (intent.emergencyBypass?.used) {
    const r = intent.emergencyBypass.reason?.trim();
    if (!r) return false;
  }
  return true;
}
