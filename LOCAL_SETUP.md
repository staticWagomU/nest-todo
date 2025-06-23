# ローカル開発環境セットアップ

## PostgreSQLのセットアップ方法

### Option 1: Docker Compose (推奨)
```bash
# Dockerが起動していることを確認
docker --version

# PostgreSQLコンテナを起動
docker compose up -d

# データベースの状態確認
docker compose ps
```

### Option 2: PostgreSQL直接インストール (Ubuntu/WSL)
```bash
# PostgreSQLインストール
sudo apt update
sudo apt install postgresql postgresql-contrib

# PostgreSQLサービス開始
sudo service postgresql start

# postgresユーザーでログイン
sudo -u postgres psql

# データベースとユーザー作成
CREATE DATABASE todo_db;
CREATE USER postgres WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE todo_db TO postgres;
\q
```

### Option 3: Homebrew (macOS)
```bash
# PostgreSQLインストール
brew install postgresql

# サービス開始
brew services start postgresql

# データベース作成
createdb todo_db
```

## 開発サーバー起動

```bash
# 依存関係インストール
pnpm install

# 開発サーバー起動（フロントエンド・バックエンド両方）
pnpm start:dev
```

## 環境変数

`.env`ファイルがローカル用に設定済み：
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/todo_db"
```

## 確認方法

- バックエンド: http://localhost:3000/api/v1/todos
- フロントエンド: http://localhost:5173
- API文書: http://localhost:3000/api