# ビルド & リリースガイド

このドキュメントでは、Electron アプリケーションの本番ビルドとリリース手順について説明します。

## 前提条件

### 1. アイコンファイルの準備

本番リリース前に、`build/`ディレクトリに以下のアイコンファイルを配置してください:

- **Windows**: `icon.ico` (256x256 ピクセル以上)
- **macOS**: `icon.icns` (1024x1024 ピクセルを含むマルチサイズ)
- **Linux**: `icon.png` (512x512 ピクセル)

詳細は `build/README.md` を参照してください。

### 2. 依存パッケージのインストール

```bash
npm install
```

## ビルドコマンド

### 開発ビルド(Webpack)

アプリケーションのソースコードをバンドルします:

```bash
npm run build
```

成果物: `dist/` ディレクトリ

### パッケージビルド (インストーラーなし)

Electron アプリをパッケージ化しますが、インストーラーは作成しません:

```bash
npm run pack
```

成果物: `release/win-unpacked/` (Windows)、`release/mac/` (macOS) など

### 本番ビルド (インストーラー作成)

#### Windows 向けビルド

```bash
npm run dist:win
```

成果物:

- `release/*.exe` - NSIS インストーラー (x64, ia32)
- `release/*.exe` - Portable 版 (x64)

#### macOS 向けビルド (macOS 上で実行)

```bash
npm run dist:mac
```

成果物:

- `release/*.dmg` - DMG イメージ (x64, arm64)
- `release/*.zip` - ZIP 圧縮版 (x64, arm64)

#### Linux 向けビルド (Linux/macOS 上で実行)

```bash
npm run dist:linux
```

成果物:

- `release/*.AppImage` - AppImage (x64)
- `release/*.deb` - Debian パッケージ (x64)

#### 全プラットフォーム向けビルド

```bash
npm run dist
```

**注意**: クロスプラットフォームビルドには制限があります。詳細は下記を参照してください。

## クロスプラットフォームビルドについて

### ビルド可能な組み合わせ

| ホスト OS | ビルド可能なターゲット |
| --------- | ---------------------- |
| Windows   | Windows, Linux         |
| macOS     | macOS, Windows, Linux  |
| Linux     | Linux, Windows         |

### macOS 向けビルドの制限

- **macOS 向けのビルドは macOS 上でのみ可能**です
- Windows/Linux 上から macOS 向けにビルドすることはできません
- これは Apple のコード署名要件によるものです

### Windows 上での Linux ビルド

Windows 上で Linux 向けにビルドする場合、WSL2 や Docker を使用することを推奨します:

```bash
# Docker使用例
docker run --rm -ti \
  --env-file <(env | grep -iE 'DEBUG|NODE_|ELECTRON_|YARN_|NPM_|CI|CIRCLE|TRAVIS_TAG|TRAVIS|TRAVIS_REPO_|TRAVIS_BUILD_|TRAVIS_BRANCH|TRAVIS_PULL_REQUEST_|APPVEYOR_|CSC_|GH_|GITHUB_|BT_|AWS_|STRIP|BUILD_') \
  --env ELECTRON_CACHE="/root/.cache/electron" \
  --env ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder" \
  -v ${PWD}:/project \
  -v ~/.cache/electron:/root/.cache/electron \
  -v ~/.cache/electron-builder:/root/.cache/electron-builder \
  electronuserland/builder:wine \
  /bin/bash -c "npm install && npm run dist:linux"
```

## コード署名と Notarization

### Windows

コード署名を行う場合、環境変数を設定してください:

```powershell
$env:CSC_LINK = "証明書ファイルのパス"
$env:CSC_KEY_PASSWORD = "証明書のパスワード"
npm run dist:win
```

### macOS

Apple Developer アカウントが必要です:

```bash
export CSC_LINK="証明書ファイルのパス"
export CSC_KEY_PASSWORD="証明書のパスワード"
export APPLE_ID="your-apple-id@example.com"
export APPLE_ID_PASSWORD="app-specific-password"
export APPLE_TEAM_ID="your-team-id"
npm run dist:mac
```

詳細は [electron-builder 公式ドキュメント](https://www.electron.build/code-signing) を参照してください。

## トラブルシューティング

### ネイティブモジュール (better-sqlite3) のビルドエラー

```bash
npm run postinstall
```

を実行して、ネイティブモジュールを再ビルドしてください。

### Windows でのビルドエラー

Windows Defender やアンチウイルスソフトが干渉している可能性があります。
`release/`ディレクトリを除外リストに追加してください。

### macOS でのビルドエラー

Xcode のコマンドラインツールがインストールされているか確認してください:

```bash
xcode-select --install
```

## 継続的インテグレーション (CI/CD)

GitHub Actions を使用した自動ビルドの例:

```yaml
# .github/workflows/build.yml
name: Build

on:
  push:
    tags:
      - "v*"

jobs:
  build:
    strategy:
      matrix:
        os: [macos-latest, ubuntu-latest, windows-latest]

    runs-on: ${{ matrix.os }}

    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: 20

      - run: npm install

      - run: npm run dist
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - uses: actions/upload-artifact@v3
        with:
          name: release-${{ matrix.os }}
          path: release/
```

## リリースチェックリスト

- [ ] `package.json`のバージョン番号を更新
- [ ] アイコンファイルを配置
- [ ] CHANGELOG.md を更新
- [ ] 開発環境でテスト実行
- [ ] 本番ビルドを実行
- [ ] インストーラーの動作確認
- [ ] アンインストールの動作確認
- [ ] GitHub リリースを作成
- [ ] リリースノートを記載

## 参考リンク

- [electron-builder Documentation](https://www.electron.build/)
- [Electron Documentation](https://www.electronjs.org/docs/latest/)
- [Code Signing Guide](https://www.electron.build/code-signing)
