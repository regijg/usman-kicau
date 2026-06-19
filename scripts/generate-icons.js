const sharp = require('sharp')
const path  = require('path')

const SIZES = [192, 512]

const svgIcon = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#F59E0B"/>
  <ellipse cx="252" cy="305" rx="100" ry="80" fill="white"/>
  <circle cx="325" cy="205" r="64" fill="white"/>
  <polygon points="382,203 425,192 382,218" fill="#F59E0B"/>
  <circle cx="345" cy="192" r="13" fill="#1C1917"/>
  <circle cx="348" cy="189" r="4" fill="white"/>
  <path d="M152,288 Q180,215 236,254 Q208,300 152,288Z" fill="white" opacity="0.85"/>
  <path d="M152,308 Q92,328 80,378 Q138,340 186,356" fill="white" opacity="0.85"/>
</svg>`

async function main() {
  for (const size of SIZES) {
    const outPath = path.join(__dirname, `../public/icons/icon-${size}.png`)
    await sharp(Buffer.from(svgIcon(size)))
      .resize(size, size)
      .png()
      .toFile(outPath)
    console.log(`✓ icon-${size}.png`)
  }

  // Apple touch icon 180x180
  const applePath = path.join(__dirname, '../public/icons/apple-touch-icon.png')
  await sharp(Buffer.from(svgIcon(180)))
    .resize(180, 180)
    .png()
    .toFile(applePath)
  console.log('✓ apple-touch-icon.png')

  // Maskable (full bleed, no rounded corners)
  const maskSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#F59E0B"/>
  <ellipse cx="252" cy="318" rx="88" ry="70" fill="white"/>
  <circle cx="318" cy="224" r="56" fill="white"/>
  <polygon points="368,222 406,212 368,234" fill="#F59E0B"/>
  <circle cx="336" cy="212" r="11" fill="#1C1917"/>
  <circle cx="339" cy="209" r="3.5" fill="white"/>
  <path d="M164,302 Q190,236 242,272 Q216,314 164,302Z" fill="white" opacity="0.85"/>
  <path d="M164,320 Q108,338 96,384 Q150,350 194,364" fill="white" opacity="0.85"/>
</svg>`

  const maskPath = path.join(__dirname, '../public/icons/icon-maskable.png')
  await sharp(Buffer.from(maskSvg))
    .resize(512, 512)
    .png()
    .toFile(maskPath)
  console.log('✓ icon-maskable.png')

  console.log('\nSemua icons berhasil dibuat di public/icons/')
}

main().catch(console.error)
