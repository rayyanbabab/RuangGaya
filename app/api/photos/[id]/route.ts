import { NextRequest, NextResponse } from 'next/server';
import { getPhoto } from '@/lib/photo-store';

// GET /api/photos/[id] — serve the stored image
// Used both for <img src> preview (inline) and anchor download (attachment via ?download=1)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const photo = getPhoto(id);

  if (!photo) {
    return NextResponse.json({ error: 'Photo not found or expired' }, { status: 404 });
  }

  // If ?download=1, force file download; otherwise serve inline for <img> preview
  const isDownload = req.nextUrl.searchParams.get('download') === '1';
  const disposition = isDownload
    ? `attachment; filename="ruanggaya-${id}.jpg"`
    : 'inline';

  return new NextResponse(new Uint8Array(photo.data), {
    status: 200,
    headers: {
      'Content-Type': photo.mimeType,
      'Content-Disposition': disposition,
      'Cache-Control': 'private, no-store',
    },
  });
}
