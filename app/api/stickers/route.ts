import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export interface StickerMeta {
  src: string;
  name: string;
  category: 'korean' | 'animals' | 'memes' | 'y2k' | 'emoji';
}

const STICKER_NAMES_CATEGORIES: Record<string, { name: string; category: StickerMeta['category'] }> = {
  // Korean Deco
  'coquette-bow-pink.png': { name: 'Pink Coquette Bow', category: 'korean' },
  'coquette-bow-black.png': { name: 'Black Velvet Bow', category: 'korean' },
  'stamp-photodump.png': { name: 'Photo Dump Stamp', category: 'korean' },
  'stamp-besties.png': { name: 'Besties ♡ Badge', category: 'korean' },
  'stamp-cutie.png': { name: '100% Cute Badge', category: 'korean' },
  'stamp-korean-frame.png': { name: '인생네컷 4-Cuts', category: 'korean' },
  'cherry-blossom.png': { name: 'Sakura Blossom', category: 'korean' },
  'cherry.png': { name: 'Cherry Duo', category: 'korean' },
  'love.png': { name: 'Love Letter Stamp', category: 'korean' },
  'stationary.png': { name: 'Cute Diary Clips', category: 'korean' },

  // Animals
  'shiba-happy.png': { name: 'Happy Shiba', category: 'animals' },
  'cute-frog-mushroom.png': { name: 'Froggy Mushroom', category: 'animals' },
  'cute-panda.png': { name: 'Cute Panda', category: 'animals' },
  'yellow-ducky.png': { name: 'Royal Ducky', category: 'animals' },
  'cat-paw-pink.png': { name: 'Pink Cat Paw', category: 'animals' },
  'capybara.png': { name: 'Chill Capybara', category: 'animals' },
  'rabbit.png': { name: 'Sweet White Bunny', category: 'animals' },
  'nemo-fish.png': { name: 'Nemo Clownfish', category: 'animals' },

  // Memes & Viral
  'doge-face.png': { name: 'Doge Wow', category: 'memes' },
  'chill-guy.png': { name: 'Chill Guy', category: 'memes' },
  'huh-cat.png': { name: 'Huh? Cat', category: 'memes' },
  'bombastic-side-eye.png': { name: 'Bombastic Side Eye', category: 'memes' },
  'this-is-fine-cup.png': { name: 'This Is Fine', category: 'memes' },
  'sad-hamster.png': { name: 'Sad Hamster', category: 'memes' },
  'smudge-cat.png': { name: 'Smudge Cat Salad', category: 'memes' },
  'moai-gigachad.png': { name: 'Gigachad Moai 🗿', category: 'memes' },
  'skull-dead.png': { name: 'Dead Skull 💀', category: 'memes' },
  'alien-toystory.png': { name: 'Toy Story Alien', category: 'memes' },

  // Y2K & Aesthetic
  'sparkle-star-gold.png': { name: 'Golden Sparkle Star', category: 'y2k' },
  'y2k-cyber-star.png': { name: 'Holo Cyber Star', category: 'y2k' },
  'y2k-flame.png': { name: 'Y2K Cyber Flame', category: 'y2k' },
  'pixel-heart.png': { name: '8-Bit Pixel Heart', category: 'y2k' },
  'rainbow-cloud.png': { name: 'Pastel Rainbow', category: 'y2k' },
  'cars-95.png': { name: 'Lightning 95', category: 'y2k' },
  'pixar-ball.png': { name: 'Pixar Ball', category: 'y2k' },
  'woody-star.png': { name: 'Sheriff Star', category: 'y2k' },
  'mickey-ears.png': { name: 'Mickey Ears Bow', category: 'y2k' },
  'paper-plane.png': { name: 'Paper Airplane', category: 'y2k' },
  'plant.png': { name: 'Aesthetic Monstera', category: 'y2k' },

  // Emojis & Hand Signs
  'heart-finger.png': { name: 'Finger Heart 🫰', category: 'emoji' },
  'peace-sign.png': { name: 'Peace Sign ✌️', category: 'emoji' },
  'fire-lit.png': { name: 'Lit Fire 🔥', category: 'emoji' },
  'heart-eyes.png': { name: 'Heart Eyes 😍', category: 'emoji' },
  'sunglasses-cool.png': { name: 'Cool Shades 😎', category: 'emoji' },
  'crown-gold.png': { name: 'Royal Crown 👑', category: 'emoji' },
  'speech-slay.png': { name: 'SLAY! ✨ Bubble', category: 'emoji' },
  'speech-omg.png': { name: 'OMG! 💖 Bubble', category: 'emoji' },
};

export async function GET() {
  try {
    const overlaysDir = path.join(process.cwd(), 'public', 'overlays');

    if (!fs.existsSync(overlaysDir)) {
      return NextResponse.json({ stickers: [], items: [] });
    }

    const files = fs.readdirSync(overlaysDir);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext);
    });

    const stickerUrls = imageFiles.map(file => `/overlays/${file}`);

    const items: StickerMeta[] = imageFiles.map(file => {
      const meta = STICKER_NAMES_CATEGORIES[file];
      const fallbackName = file.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      return {
        src: `/overlays/${file}`,
        name: meta?.name || fallbackName,
        category: meta?.category || 'y2k',
      };
    });

    return NextResponse.json({
      stickers: stickerUrls,
      items,
    });
  } catch (error) {
    console.error('Error reading stickers:', error);
    return NextResponse.json({ stickers: [], items: [] }, { status: 500 });
  }
}
