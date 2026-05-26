/**
 * お知らせ（microCMS の `news` + `categories` エンドポイントから取得）。
 *
 * microCMS の API スキーマ:
 *   - news.title / news.content / news.publishedAt
 *   - news.category : categories へのコンテンツ参照（ID）
 *   - categories.name : カテゴリ表示名
 */
import type { News } from '../types';
import { getCategoryMap } from './categories';
import { getList } from '../lib/microcms';

type MicroCMSNewsContent = {
  title: string;
  content?: string;
  /** コンテンツ参照（ID または展開オブジェクト） */
  category?: string | string[] | { id: string; name?: string };
  publishedAt: string;
  createdAt: string;
};

const CATEGORY_NAME_MAP: Record<string, News['category']> = {
  演奏会: 'concert',
  演奏会情報: 'concert',
  団員募集: 'recruitment',
  メディア: 'media',
  お知らせ: 'other',
  チュートリアル: 'other',
  concert: 'concert',
  recruitment: 'recruitment',
  media: 'media',
  other: 'other',
};

function inferCategoryKey(label: string): News['category'] {
  if (CATEGORY_NAME_MAP[label]) return CATEGORY_NAME_MAP[label];
  if (/演奏会/.test(label)) return 'concert';
  if (/募集/.test(label)) return 'recruitment';
  if (/メディア|媒体|掲載/.test(label)) return 'media';
  return 'other';
}

function extractCategoryId(
  raw: MicroCMSNewsContent['category'],
): string | undefined {
  if (raw == null) return undefined;
  if (typeof raw === 'string') return raw;
  if (Array.isArray(raw)) return raw[0];
  if (typeof raw === 'object' && raw.id) return raw.id;
  return undefined;
}

function resolveCategory(
  raw: MicroCMSNewsContent['category'],
  categoryMap: Map<string, string>,
): { label: string; key: News['category'] } {
  const id = extractCategoryId(raw);
  const label =
    (id && categoryMap.get(id)) ||
    (raw != null && typeof raw === 'object' && !Array.isArray(raw) ? raw.name : undefined) ||
    'お知らせ';

  return { label, key: inferCategoryKey(label) };
}

function htmlToPlainText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/p>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export async function getNews(): Promise<News[]> {
  const [{ contents }, categoryMap] = await Promise.all([
    getList<MicroCMSNewsContent>('news', {
      limit: 100,
      orders: '-publishedAt',
    }),
    getCategoryMap(),
  ]);

  return contents.map((item) => {
    const { label, key } = resolveCategory(item.category, categoryMap);
    return {
      id: item.id,
      date: item.publishedAt || item.createdAt,
      category: key,
      categoryLabel: label,
      title: item.title,
      body: htmlToPlainText(item.content ?? ''),
    };
  });
}
