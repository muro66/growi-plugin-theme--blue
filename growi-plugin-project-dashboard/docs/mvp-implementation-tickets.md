# MVP 実装チケット分解（深掘り計画の実行順）

計画「GROWIプラグイン機能拡張計画（深掘り版）」に沿った **実装単位** の一覧。  
依存関係順に並べています。

---

## Epic E1 — 意思表明ゲート（最優先）

| ID | タイトル | 説明 | 主な変更箇所 |
|----|----------|------|----------------|
| E1-1 | `ticket-intent` パーサ実装 | ` ```ticket-intent` ブロックを YAML/JSON 両対応でパース。filled 判定を関数化。 | `growi-plugin-project-dashboard` または共有 `src/ticketIntent.ts` |
| E1-2 | 型定義の export | [schema-ticket-intent.md](./schema-ticket-intent.md) に準拠した TypeScript 型。 | `src/types/intent.ts` |
| E1-3 | ダッシュボード「未意思表明」カード | lsx 対象タスクの本文を取得し、未 filled を一覧表示。 | `Dashboard.tsx`, `api.ts` |
| E1-4 | growi-plugin-gantt 関門（厳格/緩和） | status 等更新前に filled チェック。モードは定数 or 管理画面設定は後続。 | `growi-plugin-gantt` `Panel.tsx`, `ticketMeta.ts` |

**完了条件**: プロジェクトページで未記入タスクが視覚的に分かる。ガント側で厳格モード時に保存がブロックされる（または緩和でフラグのみ）。

---

## Epic E2 — Relation / Rollup

| ID | タイトル | 説明 | 主な変更箇所 |
|----|----------|------|----------------|
| E2-1 | `relations[]` パース共通化 | intent から relations を抽出するユーティリティ。 | `ticketIntent` モジュール |
| E2-2 | Rollup 集計サービス | 子タスクの meta + intent から completionRate / overdueCount / blockerOpenCount（簡易版）。 | `src/rollup/computeRollup.ts`（新規） |
| E2-3 | ダッシュボード「関係サマリ」カード | [spec-relation-rollup.md](./spec-relation-rollup.md) カード A。 | `Dashboard.tsx` |
| E2-4 | （任意）pages/list 共通化 | gantt の list API をパッケージ共有 or コピー最小化。 | 両リポジトリ |

**完了条件**: ダッシュボードにブロッカー件数等が表示され、0 件時は「関係なし」。

---

## Epic E3 — 変更影響チェッカー

| ID | タイトル | 説明 |
|----|----------|------|
| E3-1 | dueDate/assignee 差分検知 | 更新前の meta を保持し diff を算出。 |
| E3-2 | 影響候補リスト UI | relations からリンク先を列挙しモーダル表示。「影響なし」チェック必須。 |

**依存**: E2-1 完了推奨。

---

## Epic E4 — リスクレジスタ連動

| ID | タイトル | 説明 |
|----|----------|------|
| E4-1 | `ticket-meta` 拡張案 | `riskLevel` 等を optional で追加する RFC を README に記載。 |
| E4-2 | リスク一覧パネル | ダッシュボードに `risk` 型 relation または meta ベースの一覧。 |

**依存**: E1, E2 のパース基盤。

---

## Epic E5 — テンプレート起票

| ID | タイトル | 説明 |
|----|----------|------|
| E5-1 | テンプレート MD 集 | `docs/templates/*.md` に議事録・障害・レビュー雛形。 |
| E5-2 | 「テンプレから作成」リンク | プラグインから `/project/.../new` + クエリは GROWI 仕様に合わせて調整。 |

---

## Epic E6 — コメント起点タスク化

| ID | タイトル | 説明 |
|----|----------|------|
| E6-1 | コメント DOM フック調査 | GROWI バージョン別のコメント欄セレクタ確定。 |
| E6-2 | 起票 API 連携 | 新規ページ作成 API の利用可否調査（権限・CSRF）。 |

**注**: API 制約により v2 以降に回す可能性あり。

---

## Epic E7 — ナレッジストック循環

| ID | タイトル | 説明 |
|----|----------|------|
| E7-1 | ストックメタ設計 | ページタグ or 本文ブロック `knowledge-stock` で最終参照日を保持。 |
| E7-2 | ダッシュボードウィジェット | 再利用候補の簡易リスト（手動メンテから開始可）。 |

---

## Epic E8 — ロードマップ統合ビュー

| ID | タイトル | 説明 |
|----|----------|------|
| E8-1 | Version メタの扱い | Redmine 的 milestone を `ticket-meta.version` 等で持つ案。 |
| E8-2 | ガントタブ拡張 | `growi-plugin-gantt` で version フィルタ。 |

---

## Epic E9 — 依存ヒートマップ

| ID | タイトル | 説明 |
|----|----------|------|
| E9-1 | グラフデータ組み立て | relations をエッジリスト化。 |
| E9-2 | 簡易可視化 | D3/Cytoscape は重いので第1弾はテーブル + 次数表示。 |

---

## Epic E10 — LLM 問い生成

| ID | タイトル | 説明 |
|----|----------|------|
| E10-1 | プロンプトテンプレ固定 | 判断・影響・行動の3観点のみ。 |
| E10-2 | 関門発火時 fetch | 外部 API キーは環境変数経由（ブラウザ直は避け、プロキシ推奨）。 |

**依存**: E1（question フィールドの保存先が確定していること）。

---

## 推奨スプリント割り当て（目安）

| スプリント | チケット |
|------------|----------|
| S1 | E1-1, E1-2, E1-3 |
| S2 | E1-4, E2-1, E2-2 |
| S3 | E2-3, E3-1, E3-2 |
| S4+ | E4〜E10 は優先度に応じてピックアップ |

---

## ドキュメント索引

- [schema-ticket-intent.md](./schema-ticket-intent.md)
- [spec-relation-rollup.md](./spec-relation-rollup.md)
- [../PLAN.md](../PLAN.md)
