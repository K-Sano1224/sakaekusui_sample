/**
 * 日付フォーマットなどの共通ユーティリティ。
 */
const weekdayJa = ['日', '月', '火', '水', '木', '金', '土'];

export function formatDateJa(iso: string, opts?: { withWeekday?: boolean }): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const base = `${y}年${m}月${day}日`;
  if (opts?.withWeekday) {
    return `${base}（${weekdayJa[d.getDay()]}）`;
  }
  return base;
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${m}/${day}（${weekdayJa[d.getDay()]}）`;
}
