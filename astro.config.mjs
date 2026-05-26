import { defineConfig, envField } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Cloudflare Pages ビルド時は CF_PAGES_URL が自動設定される
  site: process.env.SITE_URL || process.env.CF_PAGES_URL || 'https://example.com',
  output: 'static',
  /** ポートが使用中のとき別ポートに逃げずエラーにする（古い dev サーバーに繋ぎ続ける事故を防ぐ） */
  server: { port: 4321, strictPort: true },
  preview: { port: 4321, strictPort: true },
  /**
   * 型付きの環境変数スキーマ。
   * - context: 'server' / access: 'secret'  → サーバー（ビルド時）のみ参照可、クライアントに露出しない
   * - 値は .env（プロジェクトルート）から自動で読み込まれる
   * - 利用側は `import { ... } from 'astro:env/server'` で参照する
   */
  env: {
    schema: {
      MICROCMS_SERVICE_DOMAIN: envField.string({ context: 'server', access: 'secret' }),
      MICROCMS_API_KEY: envField.string({ context: 'server', access: 'secret' }),
    },
  },
});
