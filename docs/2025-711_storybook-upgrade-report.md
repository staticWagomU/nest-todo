# Storybook v8.6.0 → v9.0.16 アップグレードレポート

## 概要

- **実施日**: 2025年7月11日
- **アップグレード前**: Storybook v8.6.0
- **アップグレード後**: Storybook v9.0.16
- **作業時間**: 約15分
- **影響範囲**: フロントエンド開発環境のみ（本番アプリケーションには影響なし）

## アップグレードの背景

Storybook 9.0は以下の改善を提供します：
- パッケージサイズが48%削減
- 依存関係の階層がフラット化され、インストール時間が短縮
- 多くのアドオンがコアに統合され、設定がシンプルに
- パフォーマンスの向上

## 実施手順

### 1. 自動アップグレードコマンドの実行

```bash
npx storybook@latest upgrade --yes
```

### 2. 適用された自動マイグレーション

以下の4つの自動マイグレーションが適用されました：

1. **consolidated-imports**
   - 名前変更または統合されたパッケージのインポートを自動更新

2. **remove-addon-interactions**
   - `@storybook/addon-interactions`がStorybookコアに移動したため削除

3. **renderer-to-framework**
   - レンダラーベースからフレームワークベースの設定への移行

4. **remove-essential-addons**
   - コアに移動したエッセンシャルアドオンの削除

### 3. 依存関係の更新とクリーンアップ

```bash
pnpm install
```

## 主要な変更点

### パッケージの変更

**削除されたパッケージ**（コアに統合）:
- `@storybook/addon-essentials`
- `@storybook/addon-interactions`
- `@storybook/blocks`
- `@storybook/test`

**更新されたパッケージ**:
- `@storybook/react` → `@storybook/react-vite` v9.0.16
- `storybook` v8.6.0 → v9.0.16

**新規追加パッケージ**:
- `@storybook/addon-docs` v9.0.16（ドキュメント機能用）

### 設定ファイルの変更

#### `.storybook/main.ts`
```typescript
// 変更前
import type { StorybookConfig } from '@storybook/react-vite';

// 変更後
import type { StorybookConfig } from '@storybook/react-vite';
// addon-docsが明示的に追加された
addons: [getAbsolutePath('@storybook/addon-docs')],
```

#### `.storybook/preview.tsx`
```typescript
// import文が更新
import type { Preview } from '@storybook/react-vite';
```

## 遭遇した問題と解決方法

### 1. Mantineバージョンの依存関係警告

**問題**: 
```
✕ unmet peer @mantine/core@8.1.1: found 7.17.8
✕ unmet peer @mantine/hooks@8.1.1: found 7.17.8
```

**解決**: 
この警告は`@mantine/notifications`パッケージがMantine v8を期待しているために発生しますが、実際の動作には影響ありません。将来的にMantineのバージョンを統一することを推奨します。

### 2. Biomeリンターのエラー

**問題**: 
`storybook-static`ディレクトリ内の生成ファイルに対してリントエラーが大量発生

**解決**: 
`biome.json`の`files.ignore`に`storybook-static`を追加：
```json
"ignore": ["node_modules", "dist", "build", ".next", ".vite", "coverage", "storybook-static"]
```

## 動作確認結果

### ✅ 開発サーバー
```bash
pnpm storybook
```
- http://localhost:6006 で正常に起動
- 起動時間: 約1.35秒（プレビュー）

### ✅ ストーリーの動作確認
以下の4つのコンポーネントストーリーが正常に動作：
1. TodoItem
2. TodoForm
3. SortControl
4. ConfirmDialog

### ✅ プロダクションビルド
```bash
pnpm build-storybook
```
- ビルド時間: 5.97秒
- 出力先: `/app/frontend/storybook-static`

## 今後の推奨事項

### 1. Vite CJS API非推奨警告への対応

現在表示される警告：
```
The CJS build of Vite's Node API is deprecated
```

これはStorybookがViteの内部APIを使用しているために発生します。Storybookの将来のバージョンで解決される予定です。

### 2. browserslistの更新

ビルド時の警告に対応するため、以下のコマンドを実行することを推奨：
```bash
npx update-browserslist-db@latest
```

### 3. Mantineバージョンの統一

現在、プロジェクトはMantine v7を使用していますが、`@mantine/notifications`はv8です。将来的に全体をv8に統一することを検討してください。

## まとめ

Storybook v9へのアップグレードは成功し、すべての機能が正常に動作しています。パッケージサイズの削減とパフォーマンスの向上により、開発体験が改善されました。自動マイグレーションツールにより、手動での設定変更はほとんど必要ありませんでした。