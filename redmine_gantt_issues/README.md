# Redmine Gantt Issues

Redmine のチケット（開始日・期日が設定されているもの）を**ガントチャート**で表示するプラグインです。

## 機能

- プロジェクトメニューに「ガントチャート」を追加
- **開始日**と**期日**が両方設定されているチケットをガントバーで表示
- 進捗率（%）をバー上に表示
- バーをクリックすると該当チケットの詳細へ遷移
- [Frappe Gantt](https://github.com/frappe/gantt)（MIT）を利用したシンプルなガント表示

## 必要な環境

- Redmine 4.x ～ 5.x（Rails 5/6 ベース）
- チケットに「開始日」「期日」カスタムフィールドまたは標準の開始日・期日が設定されていること

## インストール

1. Redmine の `plugins/` ディレクトリにこのプラグインを配置します。

   ```bash
   cd /path/to/redmine/plugins
   git clone https://github.com/your-org/redmine_gantt_issues.git
   # または ディレクトリをコピーして redmine_gantt_issues という名前にする
   ```

2. Redmine を再起動します。

   ```bash
   # 例: Passenger の場合
   touch tmp/restart.txt
   ```

3. プロジェクト画面のメニューに **「ガントチャート」** が表示されます（「チケット」の近く）。クリックするとガント画面が開きます。

## 使い方

- **表示対象**: そのプロジェクト内で、**開始日**と**期日**が両方入力されていて、かつ「開始日 ≦ 期日」であるチケットのみ表示されます。
- チケット一覧や詳細で開始日・期日を設定すると、ガントに自動で反映されます（画面を再読み込みしてください）。
- ガント上のバーをクリックすると、そのチケットの詳細ページに移動します。

## 権限

- **チケットを表示**できる権限を持つユーザーが、ガントチャート画面にもアクセスできます。追加の権限設定は不要です。

## ディレクトリ構成

```
redmine_gantt_issues/
├── init.rb                    # プラグイン登録・メニュー
├── config/
│   ├── routes.rb              # ルート
│   └── locales/
│       └── ja.yml             # 日本語
├── app/
│   ├── controllers/
│   │   └── gantt_issues_controller.rb
│   └── views/
│       └── gantt_issues/
│           └── index.html.erb
└── README.md
```

## ライセンス

MIT License
