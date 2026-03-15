# growi-plugin-project-dashboard

GROWI の `$lsx()` で列挙したタスク一覧を、プロジェクトダッシュボード風に集計・表示するスクリプトプラグインです。

- ステータス別件数
- 担当者別件数
- 期限ハイライト（今日まで / 今週まで / 期限超過）
- タスク一覧（ステータス・担当・期間・進捗）

を 1 つのセクションとして描画します。

## 使い方

1. このリポジトリをビルドし、`dist/` を配信できる URL を用意します。
2. GROWI 管理画面 → **プラグイン** → **スクリプトプラグイン**で、`dist/` を指す URL を登録します。
3. プロジェクトページ（例: `/projects/sample`）を作成し、本文に次のように書きます。

```markdown
## Tasks

$lsx(/projects/sample/tasks, depth=1, sort=path)
```

4. `/projects/sample/tasks/...` 配下のタスクページの本文先頭に、`ticket-meta` ブロックを置きます（`growi-plugin-gantt` と同じ形式）。

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

5. プロジェクトページを開くと、`$lsx()` がレンダリングしたリストの直前に、ダッシュボードが表示されます（元のリストは非表示になります）。

## ビルド

```bash
npm ci
npm run build
```

成果物は `dist/` に出力されます。GROWI のスクリプトプラグインには、この `dist/` を配信する URL を指定してください。

