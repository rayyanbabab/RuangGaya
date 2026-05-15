import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const overlaysDir = path.join(process.cwd(), 'public', 'overlays');
    
    // Check if directory exists
    if (!fs.existsSync(overlaysDir)) {
      return NextResponse.json({ stickers: [] });
    }

    // Read files
    const files = fs.readdirSync(overlaysDir);
    
    // Filter only images
    const images = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext);
    });

    // Map to URLs
    const stickerUrls = images.map(file => `/overlays/${file}`);

    return NextResponse.json({ stickers: stickerUrls });
  } catch (error) {
    console.error('Error reading stickers:', error);
    return NextResponse.json({ stickers: [] }, { status: 500 });
  }
}
