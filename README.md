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

### 反映されない・毎回「カスタマイズのテーマ」で更新しないと変わらない場合

GROWI.cloud / ブラウザ / CDN が **古い `dist` をキャッシュ**していることが多いです。

1. **`package.json` の `version` を上げる**（例: `1.0.0` → `1.0.1`）して push する  
2. 管理画面で当該テーマプラグインを **一度アンインストール → 再インストール** するか、利用可能なら **更新** を実行する  
3. ブラウザで **ハードリロード**（Ctrl+F5）またはシークレットウィンドウで確認する  
4. `dist/` をリポジトリに含めている場合は、**必ず `npm run build` 後に `dist` をコミット**する  

### 初回アクセス時だけ背景が茶系（例: `#26231E`）に見える場合

テーマ用 CSS の読み込み前に、本体側の既定背景が一瞬表示される **FOUC** です。  
本テーマでは `style.scss` 先頭で `html` / `body` にベース色（`#00043e` / ライト時 `#0a0a2e`）を先行適用して緩和しています。  
まだ目立つ場合は、管理画面の **外観** でテーマを一度選び直すと、キャッシュと合わせて安定しやすくなります。

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
