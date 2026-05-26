# みどり市民吹奏楽団 公式サイト

Astro で構築する、市民吹奏楽団の公式ウェブサイトです。
現時点では **ダミーデータを使った静的サイト** として動作します。

## ページ構成

| パス | ページ |
| --- | --- |
| `/` | トップ |
| `/about` | 団紹介 |
| `/concerts` | 演奏会情報 |
| `/recruitment` | 団員募集 |
| `/activities` | 活動予定 |
| `/contact` | お問い合わせ |
| `/subscribe` | 演奏会案内通知受付 |

## ディレクトリ構成

```
.
├── astro.config.mjs
├── package.json
├── public/
│   └── favicon.svg
├── src/
│   ├── components/        # 再利用 UI コンポーネント
│   │   ├── ActivityItem.astro
│   │   ├── ActivityList.astro
│   │   ├── ConcertCard.astro
│   │   ├── ConcertList.astro
│   │   ├── Footer.astro
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   ├── NewsItem.astro
│   │   ├── NewsList.astro
│   │   ├── PageHeader.astro
│   │   └── RecruitmentStatus.astro
│   ├── data/              # ダミーデータ（将来 microCMS に置換予定）
│   │   ├── activities.ts
│   │   ├── concerts.ts
│   │   ├── news.ts
│   │   ├── recruitment.ts
│   │   └── site.ts
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── lib/
│   │   └── format.ts
│   ├── pages/             # 各ルート
│   ├── styles/
│   │   └── global.css
│   └── types/
│       └── index.ts       # 共通型定義
└── tsconfig.json
```

## セットアップ

```bash
cp .env.example .env   # microCMS のキーを記入
npm install
npm run dev      # 開発サーバ起動 (http://localhost:4321)
npm run build    # 静的サイトを dist/ に出力
npm run preview  # ビルド結果をローカルプレビュー
```

## Cloudflare Pages で仮公開

詳細は [docs/cloudflare-pages.md](./docs/cloudflare-pages.md) を参照してください。

- ビルドコマンド: `npm run build`
- 出力ディレクトリ: `dist`
- 必須の環境変数: `MICROCMS_SERVICE_DOMAIN`, `MICROCMS_API_KEY`
- CLI デプロイ: `npm run pages:deploy`（要 `npx wrangler login`）

## microCMS 連携の方針

将来 microCMS で内容を更新できるよう、以下を分離してあります。

| データ | 現在の場所 | 想定する microCMS エンドポイント | 型 |
| --- | --- | --- | --- |
| 演奏会情報 | `src/data/concerts.ts` | `concerts`（リスト） | `Concert` |
| 団員募集状況 | `src/data/recruitment.ts` | `recruitment`（オブジェクト） | `Recruitment` |
| 活動予定 | `src/data/activities.ts` | `activities`（リスト） | `Activity` |
| お知らせ | `src/data/news.ts` | `news`（リスト） | `News` |
| サイト基本情報 | `src/data/site.ts` | `site`（オブジェクト） | - |

切り替え手順（例）

1. `microcms-js-sdk` を導入する。
2. 各 `src/data/*.ts` の `export const xxx = [...]` を、microCMS から取得する
   `export async function getXxx() { ... }` に置き換える。
3. 各ページ（`src/pages/*.astro`）で `getXxx()` を await して受け取る。
4. 型 (`src/types/index.ts`) は基本そのまま使えるよう設計済み。

つまり **ページ側のコンポーネント (`ConcertCard` / `RecruitmentStatus` / `ActivityList` / `NewsList`) は変更不要**で、データ取得部だけ差し替えれば microCMS 化が完了します。

## スタイル

- グローバル CSS は `src/styles/global.css`（カラー・余白・ボタンなどのトークン）。
- 各コンポーネントは Astro の `<style>` スコープを利用しているため、命名衝突を気にせず編集できます。
- スマホ対応：ヘッダーはハンバーガーメニュー、各レイアウトはレスポンシブグリッド。

## フォーム

`/contact` と `/subscribe` のフォームは現在ダミーで、送信ボタンを押すと注意書きを表示するだけです。
Netlify Forms / Formspree / microCMS Form 等への接続を後日実装予定。
