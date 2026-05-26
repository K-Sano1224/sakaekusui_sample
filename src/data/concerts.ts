/**
 * 演奏会情報（microCMS の `concerts` エンドポイントから取得）。
 *
 * API フィールド:
 *   date, title, open_time, start_time, venue, price, content, program
 */
import type { Concert } from '../types';
import { isPastConcertDate, parseConcertDay, getTodayStart } from '../lib/concertDate';
import { parseProgram } from '../lib/parseProgram';
import { getList, getObject } from '../lib/microcms';

/** 次回演奏会が未登録のときの表示文言 */
export const UPCOMING_CONCERTS_EMPTY =
  '次回演奏会の情報は随時更新いたします。決定次第、こちらでお知らせします。';

type MicroCMSImage = {
  url: string;
  width?: number;
  height?: number;
};

type MicroCMSConcert = {
  title: string;
  date: string;
  open_time?: string;
  start_time?: string;
  venue?: string;
  /** microCMS の数値フィールド（0 = 無料） */
  price?: string | number;
  content?: string;
  program?: string;
  flyer?: MicroCMSImage | null;
};

function mapFlyer(
  flyer: MicroCMSImage | null | undefined,
  title: string,
): Concert['flyer'] | undefined {
  if (!flyer?.url) return undefined;
  return {
    url: flyer.url,
    alt: `${title}のチラシ`,
    width: flyer.width,
    height: flyer.height,
  };
}

/** 時刻フィールド（"13:00" や ISO 日時）を表示用 HH:mm（JST）に整形 */
function normalizeTime(value?: string): string | undefined {
  if (value == null || value === '') return undefined;
  const str = String(value).trim();
  if (!str) return undefined;

  if (str.includes('T')) {
    const d = new Date(str);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleTimeString('ja-JP', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Tokyo',
      });
    }
  }

  const match = str.match(/(\d{1,2}):(\d{2})/);
  if (match) {
    return `${match[1].padStart(2, '0')}:${match[2]}`;
  }
  return str;
}

/** 料金（数値・文字列）を表示用テキストに変換。0 は全席無料 */
function formatPrice(price: string | number | undefined | null): string {
  if (price === undefined || price === null || price === '') {
    return '未定';
  }

  if (typeof price === 'number') {
    if (price === 0) return '全席無料';
    return `${price.toLocaleString('ja-JP')}円`;
  }

  const trimmed = String(price).trim();
  if (!trimmed) return '未定';
  if (trimmed === '0') return '全席無料';

  const num = Number(trimmed.replace(/[,，]/g, ''));
  if (!Number.isNaN(num) && num === 0) return '全席無料';
  if (!Number.isNaN(num)) return `${num.toLocaleString('ja-JP')}円`;

  return trimmed;
}

function htmlToPlainText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/p>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function mapToConcert(item: MicroCMSConcert & { id: string }): Concert | null {
  if (!item.title?.trim() || !item.date) {
    return null;
  }

  const { program, programSections } = parseProgram(item.program);
  const body = item.content?.trim() || undefined;
  const finished = isPastConcertDate(item.date);

  return {
    id: item.id,
    title: item.title.trim(),
    date: item.date,
    openTime: normalizeTime(item.open_time),
    startTime: normalizeTime(item.start_time),
    venue: typeof item.venue === 'string' ? item.venue.trim() || '会場未定' : '会場未定',
    fee: formatPrice(item.price),
    program,
    programSections,
    description: body ? htmlToPlainText(body).slice(0, 160) : undefined,
    body,
    flyer: mapFlyer(item.flyer, item.title.trim()),
    status: finished ? 'finished' : 'upcoming',
  };
}

/** microCMS から演奏会1件を取得（詳細ページ用） */
export async function getConcertById(id: string): Promise<Concert | null> {
  try {
    const item = await getObject<MicroCMSConcert & { id: string }>(`concerts/${id}`);
    return mapToConcert({ ...item, id: item.id ?? id });
  } catch {
    return null;
  }
}

/** microCMS から演奏会一覧を取得 */
export async function getConcerts(): Promise<Concert[]> {
  const { contents } = await getList<MicroCMSConcert>('concerts', {
    limit: 100,
    orders: 'date',
  });

  return contents
    .map((item) => mapToConcert(item))
    .filter((c): c is Concert => c !== null);
}

/** 開催日で「次回（今日以降）」と「過去」に分割 */
export function splitConcertsByDate(concerts: Concert[]): {
  upcoming: Concert[];
  past: Concert[];
} {
  const todayStart = getTodayStart();

  const upcoming = concerts
    .filter((c) => {
      const day = parseConcertDay(c.date);
      return !Number.isNaN(day) && day >= todayStart;
    })
    .sort((a, b) => parseConcertDay(a.date) - parseConcertDay(b.date));

  const past = concerts
    .filter((c) => isPastConcertDate(c.date))
    .sort((a, b) => parseConcertDay(b.date) - parseConcertDay(a.date));

  return { upcoming, past };
}
