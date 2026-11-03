const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

function createIco(pngBuffers, sizes) {
  const count = pngBuffers.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  let offset = headerSize + count * dirEntrySize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // ICO type
  header.writeUInt16LE(count, 4); // Number of images

  const dirEntries = [];
  for (let i = 0; i < count; i++) {
    const size = sizes[i];
    const buf = pngBuffers[i];
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // Width
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // Height
    entry.writeUInt8(0, 2); // Color palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(buf.length, 8); // Image size in bytes
    entry.writeUInt32LE(offset, 12); // Offset
    dirEntries.push(entry);
    offset += buf.length;
  }

  return Buffer.concat([header, ...dirEntries, ...pngBuffers]);
}

async function main() {
  const source = path.resolve('public/alsaffar-favicon.png');
  if (!fs.existsSync(source)) {
    console.error('Source not found:', source);
    process.exit(1);
  }

  const sizes = [16, 32, 48, 64, 128, 256];
  const pngBuffers = [];

  for (const s of sizes) {
    const buf = await sharp(source)
      .resize(s, s, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png()
      .toBuffer();
    pngBuffers.push(buf);
  }

  const icoBuf = createIco(pngBuffers, sizes);

  // Write src/app/favicon.ico
  fs.writeFileSync('src/app/favicon.ico', icoBuf);
  console.log('Updated src/app/favicon.ico (size:', icoBuf.length, ')');

  // Write public/favicon.ico
  fs.writeFileSync('public/favicon.ico', icoBuf);
  console.log('Updated public/favicon.ico');

  // Write src/app/icon.png (32x32)
  const icon32 = await sharp(source)
    .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toBuffer();
  fs.writeFileSync('src/app/icon.png', icon32);
  console.log('Created src/app/icon.png');

  // Write src/app/apple-icon.png (180x180)
  const appleIcon = await sharp(source)
    .resize(180, 180, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toBuffer();
  fs.writeFileSync('src/app/apple-icon.png', appleIcon);
  console.log('Created src/app/apple-icon.png');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

