/**
 * 演奏会の開催日（date）と「今日」を比較するユーティリティ。
 * ローカルタイムゾーンの 0:00 を基準に、過去 / 今後を判定する。
 */

/** 今日 0:00（ローカル）のタイムスタンプ */
export function getTodayStart(): number {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
}

/** ISO 日付文字列を「日」の開始時刻に正規化 */
export function parseConcertDay(iso: string): number {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return NaN;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

/** 開催日が今日より前なら過去演奏会 */
export function isPastConcertDate(iso: string): boolean {
  const day = parseConcertDay(iso);
  if (Number.isNaN(day)) return false;
  return day < getTodayStart();
}
