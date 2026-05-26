/**
 * microCMS の program（テキストエリア）を、既存 UI 用の配列・部構成に変換する。
 *
 * 推奨入力フォーマット（管理画面での入稿例）:
 *
 *   第1部
 *   ・オリエント急行
 *   ・バレエ音楽「コッペリア」より
 *
 *   第2部
 *   ・The Lion King
 *
 *   アンコール
 *   ・I Will Follow Him
 *
 * 部見出しがない場合は 1 行 1 曲として扱う。
 */
export type ParsedProgram = {
  program: string[];
  programSections?: { title: string; items: string[] }[];
};

const SECTION_HEADING = /^第[0-9一二三四五六七八九十百千]+部/;
const ENCORE_HEADING = /^アンコール/;
const BULLET_PREFIX = /^[・\-*●○]\s*/;
const NUMBERED_PREFIX = /^\d+[\.\)、]\s*/;

function cleanLine(line: string): string {
  return line.replace(BULLET_PREFIX, '').replace(NUMBERED_PREFIX, '').trim();
}

function isSectionHeading(line: string): boolean {
  const normalized = line.replace(/^■\s*/, '').trim();
  return (
    SECTION_HEADING.test(normalized) ||
    ENCORE_HEADING.test(normalized) ||
    /^■/.test(line)
  );
}

function normalizeSectionTitle(line: string): string {
  return line.replace(/^■\s*/, '').trim();
}

export function parseProgram(raw?: string | null): ParsedProgram {
  if (!raw?.trim()) {
    return { program: [] };
  }

  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const flat: string[] = [];
  const sections: { title: string; items: string[] }[] = [];
  let current: { title: string; items: string[] } | null = null;

  for (const line of lines) {
    if (isSectionHeading(line)) {
      if (current && current.items.length > 0) {
        sections.push(current);
      }
      current = { title: normalizeSectionTitle(line), items: [] };
      continue;
    }

    const item = cleanLine(line);
    if (!item) continue;

    flat.push(item);
    if (current) {
      current.items.push(item);
    }
  }

  if (current && current.items.length > 0) {
    sections.push(current);
  }

  if (sections.length > 0) {
    return { program: flat, programSections: sections };
  }

  return { program: flat };
}
