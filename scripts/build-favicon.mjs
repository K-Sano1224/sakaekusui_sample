/**
 * 元のファビコン画像（JPEG, 16x16）の黒い背景を透過に変換し、
 * 高解像度版（64x64 / 180x180）の PNG を生成する。
 *
 * 入力: assets/favicon-source.jpg または public/favicon.png（中身がJPEGでもOK）
 * 出力: public/favicon.png (64x64), public/apple-touch-icon.png (180x180)
 */
import sharp from 'sharp';
import fs from 'node:fs';

const SRC = process.argv[2] || 'public/favicon.png';

if (!fs.existsSync(SRC)) {
  console.error(`Source not found: ${SRC}`);
  process.exit(1);
}

// 1) Raw RGBA を取り出し
const { data, info } = await sharp(SRC)
  .raw()
  .ensureAlpha()
  .toBuffer({ resolveWithObject: true });

console.log(`source: ${info.width}x${info.height} (${info.channels}ch)`);

// 2) 輝度しきい値で黒(背景)を透過化
//    Y' = 0.299*R + 0.587*G + 0.114*B
//      lum <= 14 -> 完全透過
//      14 < lum <= 40 -> グラデーションでアンチエイリアス
//      lum > 40 -> 完全不透明
const out = Buffer.from(data);
const LO = 14;
const HI = 40;
for (let i = 0; i < out.length; i += 4) {
  const r = out[i], g = out[i + 1], b = out[i + 2];
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  if (lum <= LO) {
    out[i + 3] = 0;
  } else if (lum < HI) {
    out[i + 3] = Math.round(((lum - LO) / (HI - LO)) * 255);
  }
  // 全不透明はそのまま
}

const baseImage = sharp(out, {
  raw: { width: info.width, height: info.height, channels: 4 },
});

// 3) 64x64 ファビコン
await baseImage
  .clone()
  .resize(64, 64, { kernel: 'lanczos3', fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ compressionLevel: 9 })
  .toFile('public/favicon.png');
console.log('✓ public/favicon.png (64x64)');

// 4) apple-touch-icon 180x180
await baseImage
  .clone()
  .resize(180, 180, { kernel: 'lanczos3', fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ compressionLevel: 9 })
  .toFile('public/apple-touch-icon.png');
console.log('✓ public/apple-touch-icon.png (180x180)');

// 5) 32x32 サブ
await baseImage
  .clone()
  .resize(32, 32, { kernel: 'lanczos3', fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ compressionLevel: 9 })
  .toFile('public/favicon-32.png');
console.log('✓ public/favicon-32.png (32x32)');
