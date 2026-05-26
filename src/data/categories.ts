/**
 * お知らせカテゴリ（microCMS の `categories` エンドポイント）。
 *
 * news の category フィールドはコンテンツ参照（ID）のため、
 * 表示名は categories API から取得した name を使う。
 */
import { getList } from '../lib/microcms';

export type MicroCMSCategory = {
  name: string;
};

/** id → name のマップ（news の category 参照を解決する） */
export async function getCategoryMap(): Promise<Map<string, string>> {
  const { contents } = await getList<MicroCMSCategory>('categories', {
    limit: 100,
    fields: 'id,name',
  });
  return new Map(contents.map((c) => [c.id, c.name]));
}
