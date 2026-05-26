import type { HeroImage, SocialLinks, Stat } from '../types';

const FOUNDED = 2002;
/**
 * ビルド時に site.founded から算出される活動年数。
 * 静的サイトのため「ビルドした年」が反映される（年が明けたら再ビルドで更新）。
 */
const yearsOfMusic = new Date().getFullYear() - FOUNDED;

/**
 * サイト基本情報。
 * 将来 microCMS の「サイト設定」オブジェクトに置き換え可能。
 *
 *   const data = await client.get({ endpoint: 'site' });
 *   export const site = data;
 */
export const site = {
  name: '横浜栄区民吹奏楽団',
  shortName: '栄区吹',
  enName: 'Yokohama Sakae Public Wind Ensemble',
  tagline: '地域密着で、音楽の歓びをわたしたちのまちへ。',
  description:
    '横浜栄区民吹奏楽団（愛称・栄区吹）は、2002年4月1日に発足した地域密着型の吹奏楽団です。栄区民の団員はもちろん、関東各県から集った仲間と地元の方々に支えられながら活動しています。',
  founded: FOUNDED,
  affiliation: '神奈川県職場・一般吹奏楽連盟',
  email: 'sakaewinds@gmail.com',
  twitter: 'https://twitter.com/sakaekusui',

  /**
   * トップページの「数値ハイライト」セクション。
   * microCMS 側では「サイト設定」内の繰り返しフィールド `stats` として
   * （value / label / desc）で管理する想定。
   *
   * - Years of Music は `founded` から自動算出。
   *   microCMS 化後も、value を空にしておき表示側で計算する／管理画面で毎年更新する、
   *   いずれの運用にも切り替えやすい構造にしています。
   */
  stats: [
    { value: `${yearsOfMusic}+`, label: 'Years of\nMusic', desc: `${FOUNDED}年4月発足` },
    { value: '48',               label: 'Members',         desc: '現団員数（休団者除く）' },
    { value: '600+',             label: 'Audience',        desc: '前回演奏会のご来場者数' },
  ] satisfies Stat[],

  /**
   * トップページのヒーロー画像。
   * microCMS では「サイト設定」内の画像フィールドに置き換える想定。
   *
   *   const data = await client.get({ endpoint: 'site' });
   *   site.heroImage = {
   *     url: data.heroImage.url,
   *     alt: data.heroImageAlt ?? '吹奏楽団の演奏風景',
   *     width: data.heroImage.width,
   *     height: data.heroImage.height,
   *   };
   */
  heroImage: {
    url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1400&q=80',
    alt: '吹奏楽団の演奏風景',
  } satisfies HeroImage,

  /**
   * SNS リンク集。
   * URL が未設定のものは表示されません。
   * microCMS では「サイト設定」内のテキストフィールドに対応。
   */
  social: {
    x: 'https://twitter.com/sakaekusui',
    instagram: 'https://www.instagram.com/sakaekusui/',
    ameba: 'https://ameblo.jp/sakaekusui/',
  } satisfies SocialLinks,
};
