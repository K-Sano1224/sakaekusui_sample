# Cloudflare Pages で仮公開する手順

このサイトは **静的ビルド（`dist/`）** を配信します。  
microCMS のデータは **ビルド時** に取得するため、Cloudflare の環境変数設定が必須です。

## ビルド設定（ダッシュボード）

| 項目 | 値 |
| --- | --- |
| フレームワーク | Astro（または「なし」） |
| ビルドコマンド | `npm run build` |
| ビルド出力ディレクトリ | `dist` |
| Node.js バージョン | `22`（環境変数 `NODE_VERSION=22` でも可） |

## 環境変数（必須）

Cloudflare ダッシュボード → **Workers & Pages** → 対象プロジェクト → **設定** → **環境変数**

| 変数名 | 説明 |
| --- | --- |
| `MICROCMS_SERVICE_DOMAIN` | 例: `sakaekusui` |
| `MICROCMS_API_KEY` | microCMS の API キー（読み取り専用で可） |

**Production** と **Preview** の両方に設定してください。

任意:

| 変数名 | 説明 |
| --- | --- |
| `SITE_URL` | 本番 URL（`https://xxxx.pages.dev` など）。OGP 用。未設定時は `CF_PAGES_URL` を利用 |

## 方法 A: Git 連携（おすすめ）

1. GitHub 等にリポジトリを push
2. [Cloudflare ダッシュボード](https://dash.cloudflare.com/) → **Workers & Pages** → **作成** → **Pages** → **Git に接続**
3. リポジトリを選択し、上記のビルド設定・環境変数を入力
4. デプロイ完了後、`https://<プロジェクト名>.pages.dev` で公開

`main` への push のたびに自動で再ビルドされます。

## 方法 B: Wrangler CLI で直接アップロード

```bash
# 初回のみ: Cloudflare にログイン
npx wrangler login

# ローカルでビルド（.env が必要）
npm run build

# dist をアップロード（プロジェクト名は wrangler.toml の name と合わせる）
npm run pages:deploy
```

初回は Cloudflare 側で Pages プロジェクト `sakaekusui` が作成されます。

## コンテンツ更新時の注意

microCMS の内容を反映するには **再デプロイ（再ビルド）** が必要です。

- Git 連携: 空コミットでも可 → `git commit --allow-empty -m "rebuild" && git push`
- CLI: `npm run pages:deploy`

## トラブルシュート

| 症状 | 対処 |
| --- | --- |
| ビルド失敗（microCMS） | 環境変数 `MICROCMS_*` が未設定 |
| お知らせ・演奏会が空 | 同上、または API キーの権限 |
| 404（詳細ページ） | ビルド時に microCMS に存在する ID か確認し再ビルド |
