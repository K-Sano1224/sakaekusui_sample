import sharp from 'sharp';

const src = 'public/favicon.png';
const img = sharp(src);
const meta = await img.metadata();
console.log('meta:', meta);

const { data, info } = await img
  .raw()
  .ensureAlpha()
  .toBuffer({ resolveWithObject: true });

const px = (x, y) => {
  const i = (y * info.width + x) * info.channels;
  return [data[i], data[i + 1], data[i + 2], data[i + 3]];
};

console.log('info:', info);
console.log('corners:');
console.log('  TL:', px(0, 0));
console.log('  TR:', px(info.width - 1, 0));
console.log('  BL:', px(0, info.height - 1));
console.log('  BR:', px(info.width - 1, info.height - 1));
console.log('center:', px(info.width >> 1, info.height >> 1));
console.log('midpoints:');
console.log('  top mid:', px(info.width >> 1, 0));
console.log('  bot mid:', px(info.width >> 1, info.height - 1));
console.log('  left mid:', px(0, info.height >> 1));
console.log('  right mid:', px(info.width - 1, info.height >> 1));
