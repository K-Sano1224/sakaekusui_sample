import type { Activity } from '../types';

/**
 * 活動予定（ダミーデータ）。
 * 将来 microCMS の `activities` エンドポイントから取得する想定。
 *
 * 練習は週1回・毎週日曜日（時間は午後が多いですが毎回異なります）、
 * 会場は栄区周辺の公共施設（毎回異なります）。
 */
export const activities: Activity[] = [
  {
    id: 'rehearsal-2026-06-07',
    date: '2026-06-07',
    title: '通常練習',
    type: 'rehearsal',
    location: '栄区周辺の公共施設',
    description: '第23回定期演奏会に向けた合奏',
  },
  {
    id: 'rehearsal-2026-06-14',
    date: '2026-06-14',
    title: '通常練習',
    type: 'rehearsal',
    location: '栄区周辺の公共施設',
  },
  {
    id: 'rehearsal-2026-06-21',
    date: '2026-06-21',
    title: '通常練習',
    type: 'rehearsal',
    location: '栄区周辺の公共施設',
  },
  {
    id: 'rehearsal-2026-06-28',
    date: '2026-06-28',
    title: '通常練習',
    type: 'rehearsal',
    location: '栄区周辺の公共施設',
    description: '本番直前 合奏',
  },
  {
    id: 'rehearsal-2026-07-05',
    date: '2026-07-05',
    title: 'ゲネプロ',
    type: 'rehearsal',
    location: '栄区周辺の公共施設',
    description: '本番前最終練習',
  },
  {
    id: 'concert-2026-07-12',
    date: '2026-07-12',
    title: '第23回定期演奏会',
    type: 'concert',
    location: '鎌倉芸術館 大ホール',
    description: 'テーマ「音楽で巡る世界旅行」',
  },
];
