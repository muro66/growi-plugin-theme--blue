# growi-plugin-theme-fm26-blue

Football Manager 26 風の GROWI テーマプラグインです。ベースカラー `#00043E` と青系統のアクセント・発光する縁取りで、ダッシュボード風のUIを実現します。

## 特徴

- **ベースカラー**: `#00043E`（濃い青）
- **アクセント**: エレクトリックブルー・シアン（`#00bcd4`, `#4fc3f7`）
- **縁取り**: 参考画像をイメージした、青く発光するボーダーと `box-shadow`
- **ライト/ダーク両対応**（`schemeType: "both"`）

## GROWI.cloud への適用

**詳細な手順は [docs/GROWI-cloud-セットアップ手順.md](docs/GROWI-cloud-セットアップ手順.md) に記載しています。** 以下は概要です。

1. **GitHub にリポジトリを作成する**
   - リポジトリ名の例: `growi-plugin-theme-fm26-blue`
   - このフォルダの内容を push します（`node_modules` と `dist` は .gitignore で除外されます）。

2. **ビルド成果物をリポジトリに含める（推奨）**
   - インストール時に GROWI.cloud が自動で `npm run build` する場合もありますが、**確実に動かすため**にはあらかじめビルドし、`dist` をコミットして push することを推奨します。
   - まずは `dist` なしで push してインストールを試し、テーマが表示されない場合に以下を実行してください。
   ```bash
   npm run build
   git add -f dist/
   git commit -m "chore: add built assets for GROWI.cloud"
   git push
   ```

3. **GROWI.cloud の管理画面でプラグインを追加**
   - GROWI.cloud に管理者でログイン → **管理画面** → **プラグイン**
   - 「リポジトリ URL」に GitHub の URL を入力（例: `https://github.com/あなたのユーザー名/growi-plugin-theme-fm26-blue`）
   - **インストール** をクリック

4. **テーマを選択**
   - 管理画面の **外観**（または **Appearance** / **テーマ**）で、テーマ一覧から **fm26-blue** を選んで保存します。

参照: [プラグイン | GROWI Docs](https://docs.growi.org/ja/admin-guide/management-cookbook/plugins.html)

## その他の GROWI へのインストール

- セルフホストの GROWI の `plugins` ディレクトリにこのパッケージを配置するか、同様に管理画面の「プラグイン」から上記の GitHub リポジトリ URL を指定してインストールします。
- インストール後、管理画面の「外観」でテーマ **fm26-blue** を選択します。

## 開発

```bash
pnpm install
pnpm build
pnpm test
```

## 参考

- [テーマプラグインを開発する | GROWI Docs](https://docs.growi.org/ja/dev/plugin/theme.html)
- 縁取りのイメージ: 青系発光ボーダーのダッシュボードUI

## ライセンス

MIT
