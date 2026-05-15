import { NextRequest, NextResponse } from 'next/server';
import { savePhoto } from '@/lib/photo-store';

// POST /api/photos — save photo, return share ID + URL
export async function POST(req: NextRequest) {
  try {
    const { dataUrl } = await req.json() as { dataUrl: string };
    if (!dataUrl || typeof dataUrl !== 'string') {
      return NextResponse.json({ error: 'Missing dataUrl' }, { status: 400 });
    }
    const id = savePhoto(dataUrl);
    const origin = req.headers.get('origin') ?? req.nextUrl.origin;
    const shareUrl = `${origin}/share/${id}`;
    return NextResponse.json({ id, shareUrl });
  } catch (err) {
    console.error('[POST /api/photos]', err);
    return NextResponse.json({ error: 'Failed to save photo' }, { status: 500 });
  }
}
