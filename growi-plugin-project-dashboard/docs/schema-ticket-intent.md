# ticket-intent スキーマ（意思表明ゲート用・確定版）

GROWI ページ本文に配置する `ticket-intent` コードブロックの最小仕様です。  
`growi-plugin-gantt` の `ticket-meta` と併用します（ブロックは別）。

## ブロック形式

````markdown
```ticket-intent
question: "（任意）LLMまたはテンプレで生成した問い"
decision: "判断・結論（必須）"
nextAction: "次に取る行動（必須）"
impactTarget: "影響先（ページパスまたは説明）（必須）"
due: "YYYY-MM-DD（必須）"
relations:
  - type: blocker
    target: /project/sample/tasks/other-task
    note: 短い根拠
emergencyBypass:
  used: false
  reason: ""
  at: ""
```
````

## フィールド定義

| キー | 必須 | 型 | 説明 |
|------|------|-----|------|
| `question` | 推奨 | string | 認知を起こす問い。未設定でもゲートは `decision` 等で成立可。 |
| `decision` | **はい** | string | 何を決めたか（1〜3行推奨）。 |
| `nextAction` | **はい** | string | 具体的な次アクション。 |
| `impactTarget` | **はい** | string | 影響を受けるページパス（`/project/...`）または「顧客A・モジュールB」等の明示。 |
| `due` | **はい** | string | 次アクションまたは判断の有効期限 `YYYY-MM-DD`。 |
| `relations` | 任意 | list | [spec-relation-rollup.md](./spec-relation-rollup.md) と同一形式。 |
| `emergencyBypass` | 任意 | object | 緊急時のゲートスキップ用。 |

### emergencyBypass（例外）

| サブキー | 必須 | 説明 |
|----------|------|------|
| `used` | はい（オブジェクト使用時） | `true` のときゲート通過を許容する運用フラグ。 |
| `reason` | `used: true` 時必須 | スキップ理由（監査用）。 |
| `at` | 推奨 | ISO8601 または `YYYY-MM-DDTHH:mm` 。 |

## 「意思表明済み」の判定（プラグイン実装用）

次をすべて満たすとき **filled（意思表明済み）** とみなす。

1. `decision`, `nextAction`, `impactTarget`, `due` がいずれも空でない。
2. `due` が `YYYY-MM-DD` としてパース可能。
3. `emergencyBypass.used === true` の場合は `reason` が空でない（監査用最低条件）。

## ゲート連携（growi-plugin-gantt 想定）

- **トリガー**: `ticket-meta` の `status` / `progress` / `dueDate` のいずれかを変更しようとしたとき。
- **厳格モード**: 上記 filled でない場合は API 更新を拒否（UI でエラー）。
- **緩和モード**: 更新は許可するが、本文先頭に `ticket-intent-missing: true` 相当のフラグを別ブロックで付与、またはダッシュボードで「未意思表明」として表示。

## YAML 記述上の注意

- コロンを含む値は `"..."` で囲む。
- `relations` はインデント付きリスト（簡易 YAML パーサ互換を想定）。

## 参照

- 全体方針: [../PLAN.md](../PLAN.md)
- 関係・集計: [spec-relation-rollup.md](./spec-relation-rollup.md)
