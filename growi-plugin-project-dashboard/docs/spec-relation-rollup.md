# Relation / Rollup データ仕様とダッシュボード表示カード

Notion の Relation/Rollup 相当を、GROWI の本文ブロックとプラグイン表示で再現するための仕様です。

## 1. データモデル

### 1.1 Relation エントリ（1件）

`ticket-intent` 内の `relations` 配列、または将来の専用 `ticket-relations` ブロックで共有。

| フィールド | 必須 | 型 | 説明 |
|------------|------|-----|------|
| `type` | はい | enum | `blocker` \| `dependency` \| `risk` \| `impact` |
| `target` | はい | string | 影響先ページの **パス**（`/project/...`）または **pageId**（24hex）。 |
| `note` | 任意 | string | 根拠・一言メモ。 |

### 1.2 Rollup（集計・派生値）

ページ単体には保存せず、**プラグインが子タスク群から算出**する想定。

| 指標 | 算出例 |
|------|--------|
| `completionRate` | `status === Done` の件数 / 子タスク総数 × 100 |
| `overdueCount` | `dueDate < today` かつ `status !== Done` |
| `blockerOpenCount` | 子の `relations` に `type: blocker` があり、先方タスクが未完了 |
| `riskOpenCount` | `type: risk` のリンク先に未解決フラグ（将来拡張） |

データソース:

- 子一覧: lsx または `/_api/v3/pages/list?path=...`
- 各子: `ticket-meta` + `ticket-intent`（relations）をパース

## 2. ダッシュボード表示カード仕様

既存 [Dashboard.tsx](../src/components/Dashboard.tsx) を拡張する際の UI 契約。

### カード A: 「関係サマリ」（新規）

- **配置**: ステータス / 担当別 / 期限 の行の下、または同一行の4列目。
- **内容**:
  - `ブロッカー件数`（rollup.blockerOpenCount）
  - `依存未完了`（dependency 先が未 Done の件数・簡易版は relations 件数のみでも可）
- **空時**: 「関係なし」と表示。

### カード B: 「未意思表明」（新規・ゲート連携後）

- **配置**: 最上段またはカード行の先頭（目立たせる）。
- **内容**: `ticket-intent` が filled でないタスク数とタイトル一覧（最大5件＋「他N件」）。
- **操作**: クリックで該当ページを新規タブで開く（既存 `href` ロジックと同様）。

### カード C: 「ロールアップ進捗」（オプション・親ページ向け）

- **配置**: プロジェクト直下ページのみ表示（パス判定 `/project/x` かつ lsx 直下）。
- **内容**: 円弧または横バーで `completionRate`、数値で `overdueCount`。

## 3. パース優先順位

1. 同一ページに `ticket-intent` があり `relations` がある → それを採用。
2. 無い場合は rollup のみ（メタから算出）、Relation カードは非表示または 0。

## 4. API 依存

- 子ページ取得: `GET /_api/v3/page?pageId=` / `?path=`（既存 [api.ts](../src/api.ts) と同様）。
- 一覧取得: `GET /_api/v3/pages/list?path=`（gantt プラグインと同等の実装を共通化予定）。

## 5. 参照

- 意思表明スキーマ: [schema-ticket-intent.md](./schema-ticket-intent.md)
- MVP チケット: [mvp-implementation-tickets.md](./mvp-implementation-tickets.md)
