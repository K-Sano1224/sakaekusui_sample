# Vercel で仮公開する手順

このサイトは **静的ビルド（`dist/`）** を配信します。  
microCMS のデータは **ビルド時** に取得するため、Vercel の環境変数設定が必須です。

## 1. Vercel にプロジェクトを作成

1. [Vercel](https://vercel.com/) にログイン（GitHub 連携推奨）
2. **Add New…** → **Project**
3. GitHub リポジトリ（例: `K-Sano1224/sakaekusui_sample`）を **Import**

## 2. ビルド設定

Vercel が Astro を自動検出します。念のため次を確認してください。

| 項目 | 値 |
| --- | --- |
| Framework Preset | **Astro** |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install`（デフォルト） |

`vercel.json` に同じ内容を記載済みです。

## 3. 環境変数（必須）

**Settings** → **Environment Variables** で追加:

| Name | Value | 環境 |
| --- | --- | --- |
| `MICROCMS_SERVICE_DOMAIN` | 例: `sakaekusui` | Production, Preview, Development |
| `MICROCMS_API_KEY` | microCMS の API キー | Production, Preview, Development |

任意:

| Name | Value |
| --- | --- |
| `SITE_URL` | 本番 URL（`https://xxxx.vercel.app` など）。OGP 用 |

## 4. Deploy

**Deploy** を押すとビルドが始まります。

成功すると次のような URL で公開されます。

- 本番: `https://<プロジェクト名>.vercel.app`
- プレビュー: 各ブランチ・PR ごとに自動 URL

## 5. 完了の確認

ブラウザで以下を開き、表示を確認してください。

- トップ（お知らせ・次回演奏会）
- `/concerts`（演奏会一覧・詳細）
- `/concerts/<id>`（過去演奏会の詳細）

## コンテンツ更新時

microCMS を更新したあと、GitHub に **push** すると Vercel が自動で再ビルドします。

## トラブルシュート

| 症状 | 対処 |
| --- | --- |
| ビルド失敗（microCMS） | 環境変数 `MICROCMS_*` を確認 |
| お知らせ・演奏会が空 | API キーの権限・エンドポイント名 |
| 404（演奏会詳細） | microCMS に該当 ID があるか確認し再デプロイ |

## CLI からデプロイ（任意）

```bash
npm i -g vercel
vercel login
vercel        # 初回: プロジェクト紐付け
vercel --prod # 本番デプロイ
```
