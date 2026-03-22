# スクリプトプラグインを開発する（参照用）

GROWI 公式ドキュメントの要約。元: [スクリプトプラグインを開発する | GROWI Docs](https://docs.growi.org/ja/dev/plugin/script.html)

---

## 概要

- **スクリプトプラグイン** = GROWI の機能を拡張する JavaScript / TypeScript のプラグイン。
- **推奨**: TypeScript で開発し、Vite でトランスパイル。
- 基本流れは [プラグイン開発の基本](https://docs.growi.org/ja/dev/plugin/development.html) も参照。

---

## スクリプトプラグインの基本構造

### 典型的な構成

```
growi-plugin-example/
├── client-entry.tsx        # プラグインのエントリーポイント
├── package.json            # プラグイン情報と依存関係
├── src/                    # ソースコード
│   ├── Component.tsx       # React コンポーネント
│   └── Component.css       # コンポーネント用スタイル
├── tsconfig.json           # TypeScript 設定
└── vite.config.ts          # ビルド設定
```

### 例1: copy-code-to-clipboard

コードブロックにコピーボタンを追加するプラグイン。

- リポジトリ: [growi-plugin-copy-code-to-clipboard](https://github.com/growilabs/growi-plugin-copy-code-to-clipboard)

```
growi-plugin-copy-code-to-clipboard/
├── client-entry.ts
├── package.json
├── src/
│   ├── components/
│   │   └── CopyCodeButton.tsx
│   └── styles/
│       └── CopyCodeButton.css
├── tsconfig.json
└── vite.config.ts
```

### 例2: datatables

テーブルに DataTable 機能を追加するプラグイン。

- リポジトリ: [growi-plugin-datatables](https://github.com/growilabs/growi-plugin-datatables)

```
growi-plugin-datatables/
├── client-entry.tsx
├── package.json
├── src/
│   ├── CalcMethod.ts
│   ├── DataTable.tsx
│   ├── DataTable.css
│   ├── DataTableCustom.d.ts
│   └── mock/
├── tsconfig.json
└── vite.config.ts
```

---

## 開発手順

### 1. package.json を編集する

- `"type": "module"` を指定（ES モジュール）。
- `growiPlugin.types` に `"script"` を指定。
- スクリプト: `"build": "tsc && vite build"` など。

```json
{
  "name": "growi-plugin-example",
  "version": "1.0.0",
  "description": "Example GROWI plugin",
  "type": "module",
  "keywords": ["growi", "growi-plugin"],
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "@growi/pluginkit": "^1.1.0",
    "typescript": "^x.x.x",
    "vite": "^x.x.x"
  },
  "growiPlugin": {
    "schemaVersion": "4",
    "types": ["script"]
  }
}
```

### 2. ライブラリをインストールする

```bash
pnpm install
# または
npm install
```

### 3. プラグインを実装する

エントリ（例: `client-entry.tsx`）に次の **3 つ** を実装する。

1. **activate 関数**  
   プラグインが有効化されたときに実行される関数。
2. **deactivate 関数**  
   プラグインが無効化されたときに実行される関数（クリーンアップ用）。
3. **プラグインの登録**  
   `window.pluginActivators` に、プラグイン名をキーとして `{ activate, deactivate }` を登録する。  
   GROWI 本体は起動時にこのオブジェクトを参照してプラグインを読み込む。

```typescript
// client-entry.tsx
const activate = (): void => {
  if (growiFacade == null || growiFacade.markdownRenderer == null) {
    return;
  }
  // 実行したい処理
};

const deactivate = (): void => {
  // クリーンアップ処理（必要に応じて実装）
};

if ((window as any).pluginActivators == null) {
  (window as any).pluginActivators = {};
}
(window as any).pluginActivators['growi-plugin-my-feature'] = {
  activate,
  deactivate,
};
```

- **React コンポーネント**  
  UI のカスタマイズは React コンポーネントで行える。実装例は [growi-plugin-copy-code-to-clipboard](https://github.com/growilabs/growi-plugin-copy-code-to-clipboard) を参照。

### 4. Vite の設定

- エントリを `client-entry.tsx` に合わせる。
- React を使う場合は `@vitejs/plugin-react` を入れて `plugins: [react()]` を指定。

```typescript
// vite.config.ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  build: {
    manifest: true,
    rollupOptions: {
      input: ['/client-entry.tsx'],
    },
  },
});
```

### 5. プラグインをビルドする

```bash
pnpm build
# または
npm run build
```

ビルド結果は `dist` ディレクトリに出力される。

---

## チェックリスト（開発時）

- [ ] `package.json` に `"type": "module"` と `growiPlugin.types: ["script"]`
- [ ] エントリファイルに `activate` / `deactivate` と `window.pluginActivators` への登録
- [ ] `vite.config.ts` の `input` がエントリファイル（例: `client-entry.tsx`）を指している
- [ ] `pnpm build` / `npm run build` で `dist` が生成される

---

*このドキュメントは公式ドキュメントを要約・整理したものです。詳細は上記リンクの GROWI Docs を参照してください。*
