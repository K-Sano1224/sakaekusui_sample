/**
 * サイト全体で利用する型定義。
 * 将来 microCMS に置き換える際は、API レスポンスをこの型にマッピングする。
 */

export type Concert = {
  id: string;
  title: string;
  date: string; // ISO 8601
  openTime?: string;
  startTime?: string;
  venue: string;
  address?: string;
  fee: string;
  /** プログラム（プレーンな曲名リスト。簡易表示用） */
  program: string[];
  /**
   * 部・幕で構造化されたプログラム（任意）。
   * microCMS では「繰り返しフィールド」で title + items として管理する想定。
   */
  programSections?: { title: string; items: string[] }[];
  conductor?: string;
  guest?: string;
  description?: string;
  ticketUrl?: string;
  status: 'upcoming' | 'soldout' | 'finished';
  /**
   * 詳細ページ本文（HTML 文字列）。
   * microCMS の「リッチエディタ」フィールド（content）の出力をそのまま受け取る想定。
   */
  body?: string;
  /**
   * チラシ画像（microCMS の flyer フィールド）。
   */
  flyer?: {
    url: string;
    alt?: string;
    width?: number;
    height?: number;
  };
};

export type RecruitmentPart = {
  name: string;
  /** 在籍人数（不明の場合は undefined） */
  members?: number;
  status: 'open' | 'few' | 'urgent' | 'closed';
};

export type Recruitment = {
  updatedAt: string;
  overallStatus: 'open' | 'partial' | 'closed';
  message: string;
  parts: RecruitmentPart[];
  trialInfo?: string;
};

export type Activity = {
  id: string;
  date: string; // ISO 8601
  endDate?: string;
  title: string;
  type: 'rehearsal' | 'concert' | 'event' | 'other';
  location: string;
  description?: string;
};

export type News = {
  id: string;
  date: string; // ISO 8601
  /** バッジの色分け用（サイト内の4種） */
  category: 'concert' | 'recruitment' | 'media' | 'other';
  /** 表示用ラベル（microCMS categories API の name） */
  categoryLabel: string;
  title: string;
  body: string;
  link?: string;
};

/**
 * トップページで使用する数値ハイライト（活動年数・団員数・演奏会開催数など）。
 * microCMS では「サイト設定」内の繰り返しフィールドとして管理する想定。
 *
 *  - value: 表示する数値・ラベル（例: "23+", "48"）
 *  - label: 英語の見出し（改行したい位置に \n を入れる）
 *  - desc : 日本語の補足説明
 */
export type Stat = {
  value: string;
  label: string;
  desc: string;
};

/**
 * トップページのヒーロー画像。
 * microCMS では「サイト設定」内の画像フィールドに対応し、
 * 画像URL（width / height は任意）を保持する想定。
 */
export type HeroImage = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
};

/**
 * SNS リンク集。
 * microCMS では「サイト設定」内のテキストフィールド（任意）として管理する想定。
 * URL が未設定（undefined もしくは空文字）のものは表示しない。
 */
export type SocialLinks = {
  x?: string;
  instagram?: string;
  ameba?: string;
};
