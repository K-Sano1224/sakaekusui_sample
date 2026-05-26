import type { Recruitment } from '../types';

/**
 * 団員募集状況（ダミーデータ）。
 * 将来 microCMS の単一オブジェクト `recruitment` から取得する想定。
 *
 * 2026.05.25 現在 / 合計：48名（休団者除く）
 */
export const recruitment: Recruitment = {
  updatedAt: '2026-05-25',
  overallStatus: 'partial',
  message:
    '当団では随時一緒に音楽を楽しむ仲間を募集中です！新生活に慣れてきたあなたも、今までと違う環境で頑張っているあなたも、やっぱり音楽を楽しみたいあなたも——栄区吹は全力でそんな皆さんをお迎えします。ぜひこの機会にご見学にお越しください。',
  trialInfo:
    '練習の雰囲気をより感じていただけるよう、見学時には楽器持参で一緒に合奏を体験いただくことをお勧めしています。もちろん見学のみのご希望も大歓迎です。',
  parts: [
    { name: 'Flute / Piccolo',                       status: 'closed' },
    { name: 'Oboe',                       members: 1, status: 'closed' },
    { name: 'Bassoon',                    members: 0, status: 'open'   },
    { name: 'Clarinet',                   members: 8, status: 'closed' },
    { name: 'Bass Clarinet',              members: 1, status: 'open'   },
    { name: 'Alto Saxophone',             members: 4, status: 'closed' },
    { name: 'Tenor Saxophone',            members: 2, status: 'closed' },
    { name: 'Baritone Saxophone（貸出楽器有）', members: 1, status: 'open'   },
    { name: 'Trumpet',                    members: 7, status: 'closed' },
    { name: 'Horn',                       members: 5, status: 'open'   },
    { name: 'Trombone',                   members: 5, status: 'closed' },
    { name: 'Bass Trombone',              members: 1, status: 'closed' },
    { name: 'Euphonium',                  members: 2, status: 'open'   },
    { name: 'Tuba',                       members: 3, status: 'closed' },
    { name: 'String Bass',                members: 1, status: 'open'   },
    { name: 'Percussions',                members: 1, status: 'urgent' },
  ],
};
