# Electron App Template

Electron + React + TypeScript + better-sqlite3 を使用したデスクトップアプリケーションのテンプレートです。

## 特徴

- ⚡ **Electron** - クロスプラットフォーム対応デスクトップアプリ
- ⚛️ **React 19** - 最新の React で UI を構築
- 🔷 **TypeScript** - 型安全な開発
- 📦 **Webpack** - 効率的なバンドル
- 💾 **better-sqlite3** - 高速な SQLite データベース
- 🔧 **Hot Reload** - 開発時の自動リロード

## 必要環境

- Node.js 18 以上
- npm 9 以上
- Python 3.x (ネイティブモジュールのビルドに必要)
- Windows: Visual Studio Build Tools

## クイックスタート

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 開発モードで起動

```bash
npm run dev
```

ファイルを編集すると、自動的にアプリがリロードされます。

### 3. 本番ビルド

```bash
# Webpackビルドのみ
npm run build

# Windows向けインストーラー作成
npm run dist:win

# macOS向けインストーラー作成 (macOS上で実行)
npm run dist:mac

# Linux向けインストーラー作成 (Linux/macOS上で実行)
npm run dist:linux
```

詳細なビルド手順は [`doc/BUILD.md`](./doc/BUILD.md) を参照してください。

## プロジェクト構造

```
electron-app-template/
├── src/
│   ├── main/           # メインプロセス (Node.js環境)
│   │   ├── index.ts    # エントリーポイント
│   │   └── database.ts # SQLite操作
│   ├── preload/        # プリロードスクリプト
│   │   └── index.ts    # IPC通信のブリッジ
│   ├── renderer/       # レンダラープロセス (React)
│   │   ├── main.tsx    # Reactエントリーポイント
│   │   ├── App.tsx     # ルートコンポーネント
│   │   └── components/ # UIコンポーネント
│   └── shared/         # 共通の型定義
│       └── types.ts
├── build/              # ビルドリソース (アイコンなど)
├── dist/               # Webpackビルド成果物
├── release/            # electron-builderビルド成果物
├── doc/                # ドキュメント
├── package.json
├── webpack.config.ts   # Webpack設定
└── tsconfig.json       # TypeScript設定
```

## 利用可能なスクリプト

| コマンド             | 説明                                    |
| -------------------- | --------------------------------------- |
| `npm run dev`        | 開発モードで起動 (Hot Reload 有効)      |
| `npm run build`      | 本番用に Webpack ビルド                 |
| `npm run pack`       | パッケージ化 (インストーラーなし)       |
| `npm run dist`       | インストーラー作成 (全プラットフォーム) |
| `npm run dist:win`   | Windows 向けインストーラー作成          |
| `npm run dist:mac`   | macOS 向けインストーラー作成            |
| `npm run dist:linux` | Linux 向けインストーラー作成            |

## 開発ガイド

### データベース操作

このテンプレートでは、`better-sqlite3`を使用してローカル SQLite データベースを操作できます。

```typescript
// src/renderer/components/YourComponent.tsx
import { useEffect, useState } from "react";

function YourComponent() {
  const [memos, setMemos] = useState([]);

  useEffect(() => {
    // メインプロセスのデータベース操作を呼び出す
    window.api.getAllMemos().then(setMemos);
  }, []);

  const handleCreate = async () => {
    await window.api.createMemo("新しいメモ");
    // データを再取得
    const updated = await window.api.getAllMemos();
    setMemos(updated);
  };

  return (
    <div>
      <button onClick={handleCreate}>メモ作成</button>
      {/* ... */}
    </div>
  );
}
```

### IPC 通信の追加

1. **メインプロセス** (`src/main/index.ts`)にハンドラーを追加:

```typescript
ipcMain.handle("your-channel", async (_event, arg) => {
  // 処理
  return result;
});
```

2. **プリロードスクリプト** (`src/preload/index.ts`)に API を公開:

```typescript
contextBridge.exposeInMainWorld("api", {
  yourMethod: (arg: string) => ipcRenderer.invoke("your-channel", arg),
});
```

3. **型定義** (`src/renderer/global.d.ts`)を更新:

```typescript
interface Window {
  api: {
    yourMethod: (arg: string) => Promise<any>;
  };
}
```

### セキュリティのベストプラクティス

このテンプレートは以下のセキュリティ対策を実装しています:

- ✅ `nodeIntegration: false` (デフォルト)
- ✅ `contextIsolation: true` (デフォルト)
- ✅ プリロードスクリプトによる制限された API 公開
- ✅ CSP (Content Security Policy) 対応のビルド設定

## リリース方法

1. `package.json`のバージョンを更新
2. アイコンファイルを`build/`に配置
3. ビルドを実行: `npm run dist:win`
4. `release/`ディレクトリ内のインストーラーを配布

詳細は [`doc/BUILD.md`](./doc/BUILD.md) を参照してください。

## ライセンス

MIT

## トラブルシューティング

### ネイティブモジュールのビルドエラー

```bash
npm run postinstall
```

### Windows でビルドエラー

Windows Defender を一時的に無効化するか、`release/`ディレクトリを除外リストに追加してください。

### より詳しい情報

- [Electron 公式ドキュメント](https://www.electronjs.org/docs/latest/)
- [React 公式ドキュメント](https://react.dev/)
- [electron-builder 公式ドキュメント](https://www.electron.build/)
