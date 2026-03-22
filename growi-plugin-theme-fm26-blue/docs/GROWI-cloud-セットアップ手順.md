# GROWI.cloud への適用 — 詳細手順

このドキュメントでは、テーマプラグインを GitHub に公開し、GROWI.cloud で使うまでの手順を**ステップ番号順**に説明します。

---

## ステップ 1: GitHub にリポジトリを作る

### 1-1. GitHub にログインする
- ブラウザで [https://github.com](https://github.com) を開く
- アカウントがない場合は「Sign up」で新規登録してからログイン

### 1-2. 新しいリポジトリを作成する
1. 画面右上の **「+」** → **「New repository」** をクリック
2. 次のように入力・選択する：

   | 項目 | 入力例 |
   |------|--------|
   | **Repository name** | `growi-plugin-theme-fm26-blue` |
   | **Description** | （任意）例: FM26風・青系テーマ for GROWI |
   | **Public / Private** | **Public** を選択（GROWI.cloud から参照するため） |
   | **Add a README file** | チェック**しない**（既にローカルに README があるため） |
   | **Add .gitignore** | なしでよい（既に .gitignore あり） |
   | **Choose a license** | 任意（MIT 推奨） |

3. **「Create repository」** をクリック

### 1-3. リポジトリの URL を控える
- 作成後に表示される URL をコピーする  
  - 例: `https://github.com/あなたのユーザー名/growi-plugin-theme-fm26-blue.git`  
  - または: `https://github.com/あなたのユーザー名/growi-plugin-theme-fm26-blue`  
- 次のステップで使います。

---

## ステップ 2: ローカルのプラグインを Git で管理し、GitHub に push する

### 2-1. ターミナル（PowerShell やコマンドプロンプト）を開く
- 例: VS Code の「ターミナル」や、Windows の「PowerShell」

### 2-2. プラグインのフォルダに移動する
```powershell
cd "i:\Projects\Growi\growi-plugin-theme-fm26-blue"
```

### 2-3. Git リポジトリを初期化する（まだの場合）
- このフォルダでまだ `git init` していない場合のみ実行：
```powershell
git init
```

### 2-4. リモートを追加する
- 次の `あなたのユーザー名` を、自分の GitHub ユーザー名に置き換えて実行：
```powershell
git remote add origin https://github.com/あなたのユーザー名/growi-plugin-theme-fm26-blue.git
```
- すでに `origin` がある場合は、次のように変更：
```powershell
git remote set-url origin https://github.com/あなたのユーザー名/growi-plugin-theme-fm26-blue.git
```

### 2-5. ファイルを追加してコミットする
```powershell
git add .
git status
```
- `.gitignore` により `node_modules/` と `dist/` は追加されません（意図通りです）。

```powershell
git commit -m "Initial commit: FM26-blue theme plugin for GROWI"
```

### 2-6. メインブランチ名を合わせる（必要な場合）
- GitHub のデフォルトが `main` の場合：
```powershell
git branch -M main
```

### 2-7. GitHub に push する
```powershell
git push -u origin main
```
- 初回は GitHub のログイン（ブラウザまたはトークン）を求められることがあります。表示に従って認証する。

---

## ステップ 3: ビルドして dist をコミットする（推奨）

- GROWI.cloud でテーマが認識されない場合に実施します。最初から含めておくと安心です。

### 3-1. ビルドを実行する
```powershell
cd "i:\Projects\Growi\growi-plugin-theme-fm26-blue"
npm run build
```

### 3-2. dist を強制追加してコミット・push する
```powershell
git add -f dist/
git status
git commit -m "chore: add built assets for GROWI.cloud"
git push
```

---

## ステップ 4: GROWI.cloud でプラグインをインストールする

### 4-1. GROWI.cloud にログインする
- [https://growi.cloud](https://growi.cloud) を開き、管理者アカウントでログイン

### 4-2. 管理画面を開く
- 画面右上の **歯車アイコン** または **ユーザーメニュー** から **「管理」**（または **Admin**）をクリック

### 4-3. プラグイン設定を開く
- 左メニューから **「プラグイン」** をクリック

### 4-4. リポジトリ URL を入力する
- **「リポジトリ URL」** の入力欄に、ステップ 1-3 で控えた URL を貼り付ける  
  - 例: `https://github.com/あなたのユーザー名/growi-plugin-theme-fm26-blue`  
  - ブランチを指定する場合: `https://github.com/あなたのユーザー名/growi-plugin-theme-fm26-blue#main`

### 4-5. インストールを実行する
- **「インストール」** ボタンをクリック
- 処理が終わると、インストールしたプラグインがプラグイン一覧に表示されます

### 4-6. プラグインを有効にする
- 一覧に表示された **growi-plugin-theme-fm26-blue** のスイッチを **ON** にする（既に ON の場合はそのままでよい）

---

## ステップ 5: テーマ「fm26-blue」を選択する

### 5-1. 外観（テーマ）設定を開く
- 管理画面の左メニューから **「外観」** または **「Appearance」** をクリック  
  - メニュー名は GROWI のバージョンで「テーマ」「カスタマイズ」などになっている場合があります

### 5-2. テーマを選ぶ
- **「テーマ」** または **「Wiki のテーマ」** のような項目で、一覧から **「fm26-blue」** を選択

### 5-3. 保存する
- 画面下部の **「保存」** ボタンをクリック

### 5-4. 確認する
- 管理画面を閉じ、通常の Wiki 画面を開く  
- 背景が濃い青（#00043E）で、青系の縁取りになっていれば適用されています

---

## トラブルシューティング

| 現象 | 対処 |
|------|------|
| テーマ一覧に fm26-blue が出ない | ステップ 3 のとおり `dist` をコミットして push し直し、プラグインを一度削除してから同じ URL で再インストールする |
| CSS を更新したのに反映されない（毎回「外観」でテーマを選び直さないと変わらない） | `package.json` の **version** を上げて push → プラグインを **再インストール** → ブラウザを **ハードリロード**（Ctrl+F5）。`dist` は必ず `npm run build` 後にコミットする |
| 初回だけ背景が茶系（例: #26231E）に見える | テーマ CSS 読み込み前の一瞬の表示（FOUC）。テーマ側で `html`/`body` の先行背景を指定して緩和済み。気になる場合はキャッシュクリアと再インストールを試す |
| push で認証エラー | GitHub の「Settings → Developer settings → Personal access tokens」でトークンを作成し、パスワードの代わりにトークンを入力する |
| プラグインのインストールに失敗する | リポジトリが **Public** か確認する。URL のスペルやユーザー名を確認する |

---

## まとめチェックリスト

- [ ] ステップ 1: GitHub にリポジトリを作成した
- [ ] ステップ 2: プラグインを push した
- [ ] ステップ 3: （推奨）dist をコミットして push した
- [ ] ステップ 4: GROWI.cloud の「プラグイン」で URL を入力してインストールした
- [ ] ステップ 5: 「外観」でテーマ **fm26-blue** を選んで保存した

以上で、GROWI.cloud に FM26-blue テーマが適用された状態になります。
