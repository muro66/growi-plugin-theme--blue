# growi-plugin-project-dashboard

GROWI の `$lsx()` で列挙したタスク一覧を、プロジェクトダッシュボード風に集計・表示するスクリプトプラグインです。

- ステータス別件数
- 担当者別件数
- 期限ハイライト（今日まで / 今週まで / 期限超過）
- タスク一覧（ステータス・担当・期間・進捗）

を 1 つのセクションとして描画します。

## ドキュメント（機能拡張・問関構）

- [PLAN.md](./PLAN.md) — 問関構の全体方針（v0〜v2）
- [docs/schema-ticket-intent.md](./docs/schema-ticket-intent.md) — 意思表明 `ticket-intent` スキーマ
- [docs/spec-relation-rollup.md](./docs/spec-relation-rollup.md) — Relation / Rollup とダッシュボードカード仕様
- [docs/mvp-implementation-tickets.md](./docs/mvp-implementation-tickets.md) — MVP 実装チケット分解

型定義: [src/types/intent.ts](./src/types/intent.ts), [src/types/rollup.ts](./src/types/rollup.ts)

## GROWI への登録

1. GROWI 管理画面 → **プラグイン** → **プラグインインストーラー**（または **スクリプトプラグイン**）を開く。
2. **リポジトリURL** に次を**そのまま**入力する（末尾のスラッシュは付けない）:
   ```
   https://github.com/muro66/growi-plugin-project-dashboard
   ```
3. **ブランチの指定** は `main` のまま。
4. **インストール** をクリックし、続けて **有効にする**。
5. プロジェクトページ（例: `/project/sample`）を開き、数秒待つと「Tasks」見出しの直前にダッシュボードが表示される。

> **注意:** このリポジトリにはビルド済みの `dist/` を含めてあります。GROWI がリポジトリから `dist/.vite/manifest.json` 等を参照してスクリプトを読み込みます。まだ「The specified URL is invalid」となる場合は、リポジトリURLの前後に余計な空白やスラッシュがないか、`https` で始まっているか確認してください。

## 使い方

1. プロジェクトページ（例: `/project/sample`）を作成し、本文に次のように書きます。

```markdown
## Tasks

$lsx(/project/sample/tasks, depth=1, sort=path)
```
（パスはあなたの GROWI の構成に合わせて変更してください。）

````
```ticket-meta
status: In Progress
project: プロジェクトA
assignee: 田中
startDate: "2025-03-01"
dueDate: "2025-03-15"
progress: 40
```
````

2. 各タスクページの本文先頭に `ticket-meta` ブロックを置きます（`growi-plugin-gantt` と同じ形式）。lsx のリンクがパス（`/project/sample/tasks/xxx`）でもパーマリンク（`/69b6...` の ID）でも、どちらでも取得できます。

3. プロジェクトページを開くと、`$lsx()` がレンダリングしたリストの直前に、ダッシュボードが表示されます（元のリストは非表示になります）。

## ビルド

```bash
npm ci
npm run build
```

成果物は `dist/` に出力されます。`dist/` をリポジトリにコミットして push しておけば、上記のリポジトリURLから GROWI が読み込みます。

