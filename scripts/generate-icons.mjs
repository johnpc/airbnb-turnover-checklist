import sharp from 'sharp'
import { writeFileSync } from 'fs'

const sizes = [16, 32, 192, 512]
const color = '#a78bfa' // Light purple

async function generateIcons() {
  for (const size of sizes) {
    // Create SVG with camera emoji
    const svg = `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${size}" height="${size}" fill="${color}" rx="${size * 0.1}"/>
        <text x="50%" y="50%" font-size="${size * 0.5}" text-anchor="middle" dominant-baseline="central" fill="white">📸</text>
      </svg>
    `
    
    await sharp(Buffer.from(svg))
      .png()
      .toFile(`public/icon-${size}.png`)
    
    console.log(`Generated icon-${size}.png`)
  }
  
  // Create favicon.ico from 32px
  console.log('Icons generated successfully!')
}

generateIcons().catch(console.error)
