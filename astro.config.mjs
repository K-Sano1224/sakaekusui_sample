import { defineConfig, envField } from 'astro/config';

/** デプロイ先の URL（Vercel / Cloudflare Pages / 手動指定） */
function resolveSiteUrl(): string {
  if (process.env.SITE_URL) return process.env.SITE_URL;
  if (process.env.VERCEL_URL) {
    const u = process.env.VERCEL_URL;
    return u.startsWith('http') ? u : `https://${u}`;
  }
  if (process.env.CF_PAGES_URL) return process.env.CF_PAGES_URL;
  return 'https://example.com';
}

// https://astro.build/config
export default defineConfig({
  site: resolveSiteUrl(),
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
