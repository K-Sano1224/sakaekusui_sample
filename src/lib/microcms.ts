/**
 * microCMS の REST API を叩くための薄いクライアント。
 *
 * 環境変数:
 *   - MICROCMS_SERVICE_DOMAIN : 例 "sakaekusui"
 *   - MICROCMS_API_KEY        : microCMS 管理画面で発行した API キー
 *
 * Astro 公式の `astro:env` 機構で型付き・サーバー専用 (secret) として参照。
 *  - スキーマ定義は `astro.config.mjs` の `env.schema`
 *  - access: 'secret' のためクライアントバンドルに露出しない
 *
 * SDK を使わず Node 標準の fetch を直接利用しているのは、
 *  - エラー原因（DNS / TLS / タイムアウト等）を `error.cause` でそのまま観測したい
 *  - 余計な依存を減らしてビルドサイズを最小化したい
 * という理由。
 */
import { MICROCMS_API_KEY, MICROCMS_SERVICE_DOMAIN } from 'astro:env/server';

const BASE_URL = `https://${MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1`;

export type MicroCMSListResponse<T> = {
  contents: (T & { id: string; createdAt: string; updatedAt: string; publishedAt: string; revisedAt: string })[];
  totalCount: number;
  offset: number;
  limit: number;
};

export type MicroCMSQueries = {
  limit?: number;
  offset?: number;
  orders?: string;
  q?: string;
  fields?: string;
  ids?: string;
  filters?: string;
  depth?: 1 | 2 | 3;
};

function buildQueryString(queries?: MicroCMSQueries): string {
  if (!queries) return '';
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(queries)) {
    if (value !== undefined && value !== null) {
      params.set(key, String(value));
    }
  }
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

/**
 * microCMS のリスト形式 API からコンテンツを取得する。
 */
export async function getList<T>(endpoint: string, queries?: MicroCMSQueries): Promise<MicroCMSListResponse<T>> {
  const url = `${BASE_URL}/${endpoint}${buildQueryString(queries)}`;
  const res = await fetch(url, {
    headers: { 'X-MICROCMS-API-KEY': MICROCMS_API_KEY },
    // 開発中に microCMS の更新がブラウザ／Node にキャッシュされないようにする
    cache: 'no-store',
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`microCMS getList failed: ${res.status} ${res.statusText} ${text}`);
  }
  return (await res.json()) as MicroCMSListResponse<T>;
}

/**
 * microCMS のオブジェクト形式 API から単一コンテンツを取得する。
 */
export async function getObject<T>(endpoint: string): Promise<T> {
  const url = `${BASE_URL}/${endpoint}`;
  const res = await fetch(url, {
    headers: { 'X-MICROCMS-API-KEY': MICROCMS_API_KEY },
    // 開発中に microCMS の更新がブラウザ／Node にキャッシュされないようにする
    cache: 'no-store',
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`microCMS getObject failed: ${res.status} ${res.statusText} ${text}`);
  }
  return (await res.json()) as T;
}
