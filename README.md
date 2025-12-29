# NEEDS - SNSニーズ収集アプリ

SNS（Threads）からニーズを収集し、ジャンル別に分類・管理するWebアプリケーション。

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **認証**: better-auth
- **ORM**: Drizzle ORM
- **データベース**: PostgreSQL (Supabase)
- **UI**: shadcn/ui + Tailwind CSS 4
- **AI分類**: Gemini 2.5 Flash
- **デプロイ**: Vercel

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example` をコピーして `.env` を作成し、必要な値を設定:

```bash
cp .env.example .env
```

### 3. データベースのセットアップ

```bash
npm run db:push
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開いてアプリを確認。

## デプロイ

### Vercel

1. GitHubリポジトリを作成してプッシュ
2. [Vercel](https://vercel.com)でプロジェクトをインポート
3. 環境変数を設定
4. デプロイ

### Supabase連携

1. [Supabase](https://supabase.com)でプロジェクトを作成
2. Vercel Integrationで自動接続
3. 環境変数が自動的に設定される

## 環境変数

| 変数 | 説明 |
|------|------|
| `DATABASE_URL` | Supabase PostgreSQL接続URL |
| `NEXT_PUBLIC_APP_URL` | アプリのURL |
| `BETTER_AUTH_SECRET` | 認証用シークレットキー |
| `GOOGLE_CLIENT_ID/SECRET` | Google OAuth |
| `GITHUB_CLIENT_ID/SECRET` | GitHub OAuth |
| `THREADS_APP_ID/SECRET` | Threads API |
| `GEMINI_API_KEY` | Gemini AI API |
| `SENTRY_DSN` | Sentryエラー監視 |

## スクリプト

| コマンド | 説明 |
|----------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | プロダクションビルド |
| `npm run start` | プロダクションサーバー |
| `npm run db:push` | DBスキーマをプッシュ |
| `npm run db:studio` | Drizzle Studioを開く |
