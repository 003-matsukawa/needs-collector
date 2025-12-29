# SNSニーズ収集アプリ 要件定義書

## 1. 概要

SNS（Threads）から「〜したい」「〜が欲しい」「〜に困っている」などのニーズ投稿を収集し、ジャンル別に分類・表示するWebアプリケーション。

## 2. 技術スタック

| 項目 | 技術 |
|------|------|
| フレームワーク | Next.js 16 (App Router) |
| 認証 | better-auth |
| ORM | Drizzle ORM |
| データベース | PostgreSQL (Supabase) |
| ストレージ | Supabase Storage |
| UI | shadcn/ui + Tailwind CSS 4 |
| バリデーション | Zod |
| 通知 | sonner |
| エラー監視 | Sentry |
| AI分類 | Gemini 2.5 Flash |
| SNS連携 | Threads API |
| デプロイ | Vercel |

## 3. 機能要件

### 3.1 認証機能
- ユーザー登録・ログイン
- ソーシャルログイン（Google / GitHub）
- セッション管理

### 3.2 ニーズ収集機能
- Threads APIからの自動収集
- 手動登録（URL貼り付け or テキスト入力）

#### ニーズ検出パターン（幅広く収集）
```
【願望・欲求】
- 〜したい / 〜やりたい
- 〜が欲しい / 〜ほしい
- 〜できたらいいな / 〜あったらいいな
- 〜ないかな / 〜ないですか

【困りごと・課題】
- 〜に困ってる / 〜で困った
- 〜が大変 / 〜がしんどい
- 〜がめんどくさい / 〜がめんどう
- 〜がうまくいかない

【探索・要望】
- 〜探してる / 〜探し中
- 〜おすすめ教えて / 〜教えてください
- 〜知りたい / 〜知ってる人いる？
- 〜ありませんか / 〜ないですか

【不満・改善要望】
- 〜が使いにくい / 〜が分かりにくい
- 〜してほしい / 〜してくれたら
- もっと〜 / さらに〜
- 〜があれば / 〜ができれば

【比較・選択】
- 〜と〜どっちがいい
- 〜のおすすめは？
- 〜で一番いいのは
```

### 3.3 AI自動分類機能
- Gemini 2.5 Flashによるジャンル自動分類
- 分類カテゴリ:
  - 美容・コスメ
  - 健康・フィットネス
  - IT・テクノロジー
  - 生活・家事
  - 仕事・キャリア
  - 趣味・エンタメ
  - その他

### 3.4 検索・フィルタ機能
- キーワード検索（本文全文検索）
- ジャンル別フィルタリング

### 3.5 ブックマーク機能
- ニーズのブックマーク登録・解除
- ブックマーク一覧表示

### 3.6 ダッシュボード
- ニーズ一覧表示
- ジャンル別タブ切り替え

## 4. デザイン仕様

### 4.1 デザインコンセプト
- Apple風ミニマムデザイン
- 白基調のクリーンなUI

### 4.2 カラーパレット

| 用途 | カラーコード |
|------|-------------|
| 背景 | #FFFFFF |
| サブ背景 | #F5F5F7 |
| テキスト（主） | #1D1D1F |
| テキスト（副） | #86868B |
| ボーダー | #E5E5E5 |
| アクセント | #007AFF |

### 4.3 タイポグラフィ
- フォント: system-ui (SF Pro風)
- 角丸: 12px〜16px
- シャドウ: 極薄ドロップシャドウ

## 5. データモデル

### 5.1 users（better-auth管理）
```
id: string (PK)
email: string
name: string
image: string?
createdAt: timestamp
updatedAt: timestamp
```

### 5.2 needs
```
id: string (PK)
content: text
category: string
platform: string ("threads" | "manual")
sourceUrl: string?
author: string?
userId: string (FK)
createdAt: timestamp
updatedAt: timestamp
```

### 5.3 bookmarks
```
id: string (PK)
userId: string (FK)
needId: string (FK)
createdAt: timestamp
```

## 6. API設計

### 6.1 認証
- `POST /api/auth/*` - better-auth管理

### 6.2 ニーズ
- `GET /api/needs` - 一覧取得（検索・フィルタ対応）
- `POST /api/needs` - 手動登録
- `DELETE /api/needs/:id` - 削除

### 6.3 収集
- `POST /api/collect/threads` - Threads収集実行

### 6.4 ブックマーク
- `GET /api/bookmarks` - ブックマーク一覧
- `POST /api/bookmarks` - ブックマーク追加
- `DELETE /api/bookmarks/:id` - ブックマーク解除

## 7. 環境変数

```env
# Database (Supabase)
DATABASE_URL=

# App URL
NEXT_PUBLIC_APP_URL=

# Better Auth
BETTER_AUTH_SECRET=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# GitHub OAuth
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Threads API
THREADS_APP_ID=
THREADS_APP_SECRET=

# Gemini AI
GEMINI_API_KEY=

# Sentry
SENTRY_DSN=
```

## 8. デプロイ設定

### Vercel
- GitHub連携による自動デプロイ
- 環境変数はVercel Dashboardで設定
- プレビューデプロイ: PRごとに自動生成

### Supabase連携
- Vercel Integration経由で自動接続
- 環境変数が自動的に注入される
