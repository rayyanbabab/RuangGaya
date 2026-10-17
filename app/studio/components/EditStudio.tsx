'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import QRCode from 'qrcode';
import {
  Template,
  Frame,
  FilterType,
  StickerItem,
  FontOption,
  TextPosition,
  FILTER_CSS,
  FILTER_METAS,
  FONTS,
  FONT_SIZES,
} from '@/lib/config';
import { buildStripCanvas } from '@/lib/capture';
import StripPreview from './StripPreview';
import styles from './EditStudio.module.css';

export interface EditStudioProps {
  slots: string[];
  template: Template;
  frame: Frame;
  filter: FilterType;
  stripText: string;
  stripTextColor: string;
  stripTextFont: FontOption;
  stripTextSize: number;
  stripTextPosition: TextPosition;
  stickers: StickerItem[];
  templates: readonly Template[];
  frames: readonly Frame[];
  filters: readonly FilterType[];
  onTemplateChange: (t: Template) => void;
  onFrameChange: (f: Frame) => void;
  onFilterChange: (f: FilterType) => void;
  onStripTextChange: (s: string) => void;
  onStripTextColorChange: (c: string) => void;
  onStripTextFontChange: (f: FontOption) => void;
  onStripTextSizeChange: (s: number) => void;
  onStripTextPositionChange: (p: TextPosition) => void;
  addSticker: (src: string) => void;
  updateSticker: (id: string, updates: Partial<StickerItem>) => void;
  removeSticker: (id: string) => void;
  clearStickers: () => void;
  onReset: () => void;
}

interface StickerItemMeta {
  src: string;
  name: string;
  category: string;
}

// Popular Jepreto & aesthetic background swatches
const COLOR_SWATCHES = [
  { name: 'Putih Bersih', color: '#ffffff' },
  { name: 'Pastel Pink', color: '#ffccd5' },
  { name: 'Bubblegum Rose', color: '#f472b6' },
  { name: 'Sky Blue', color: '#93c5fd' },
  { name: 'Mint Green', color: '#86efac' },
  { name: 'Lilac Lavender', color: '#c4b5fd' },
  { name: 'Butter Yellow', color: '#fef08a' },
  { name: 'Charcoal Dark', color: '#202030' },
];

export default function EditStudio({
  slots,
  template,
  frame,
  filter,
  stripText,
  stripTextColor,
  stripTextFont,
  stripTextSize,
  stripTextPosition,
  stickers,
  templates,
  frames,
  filters,
  onTemplateChange,
  onFrameChange,
  onFilterChange,
  onStripTextChange,
  onStripTextColorChange,
  onStripTextFontChange,
  onStripTextSizeChange,
  onStripTextPositionChange,
  addSticker,
  updateSticker,
  removeSticker,
  clearStickers,
  onReset,
}: EditStudioProps) {
  const [isBuilding, setIsBuilding] = useState(false);
  const [isGifBuilding, setIsGifBuilding] = useState(false);
  const [downloadModal, setDownloadModal] = useState<{ show: boolean; dataUrl: string }>({
    show: false,
    dataUrl: '',
  });
  const [qrModal, setQrModal] = useState<{
    show: boolean;
    qrDataUrl: string;
    shareUrl: string;
    isGenerating: boolean;
  }>({
    show: false,
    qrDataUrl: '',
    shareUrl: '',
    isGenerating: false,
  });

  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Sticker gallery state
  const [stickersList, setStickersList] = useState<StickerItemMeta[]>([]);
  const [stickerCategory, setStickerCategory] = useState<string>('all');
  const [stickerQuery, setStickerQuery] = useState<string>('');
  const [frameCategory, setFrameCategory] = useState<'all' | 'aesthetic' | 'cartoon' | 'meme' | 'solid'>('all');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load stickers from API
  useEffect(() => {
    fetch('/api/stickers')
      .then((res) => res.json())
      .then((data) => {
        if (data.items && Array.isArray(data.items) && data.items.length > 0) {
          setStickersList(data.items);
        } else if (data.stickers && Array.isArray(data.stickers)) {
          setStickersList(
            data.stickers.map((src: string) => {
              const slug = src.split('/').pop()?.split('.')[0] || 'Stiker';
              return {
                src,
                name: slug.replace(/[-_]/g, ' '),
                category: 'y2k',
              };
            })
          );
        }
      })
      .catch((err) => console.error('Failed to load stickers', err));
  }, []);

  // Filtered frames
  const filteredFrames = useMemo(() => {
    if (frameCategory === 'cartoon') {
      return frames.filter(
        (f) =>
          f.id.includes('pixar') ||
          f.id.includes('disney') ||
          f.id.includes('monsters') ||
          f.id.includes('stitch')
      );
    }
    if (frameCategory === 'meme') {
      return frames.filter((f) => f.id.includes('meme'));
    }
    if (frameCategory === 'solid') {
      return frames.filter((f) => !f.bgImage);
    }
    if (frameCategory === 'aesthetic') {
      return frames.filter(
        (f) =>
          f.bgImage &&
          !f.id.includes('pixar') &&
          !f.id.includes('disney') &&
          !f.id.includes('monsters') &&
          !f.id.includes('stitch') &&
          !f.id.includes('meme')
      );
    }
    return frames;
  }, [frames, frameCategory]);

  // Filtered stickers
  const filteredStickers = useMemo(() => {
    return stickersList.filter((item) => {
      const matchCat =
        stickerCategory === 'all' ||
        item.category.toLowerCase() === stickerCategory.toLowerCase();
      const matchQuery =
        !stickerQuery.trim() ||
        item.name.toLowerCase().includes(stickerQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [stickersList, stickerCategory, stickerQuery]);

  // Invalidate cached canvas when appearance changes
  useEffect(() => {
    canvasRef.current = null;
  }, [
    slots,
    template,
    frame,
    stripText,
    stripTextColor,
    stripTextFont,
    stripTextSize,
    stripTextPosition,
    filter,
    stickers,
  ]);

  /** Build high-resolution composite canvas */
  const getCanvas = useCallback(async () => {
    if (canvasRef.current) return canvasRef.current;

    const previewEl = document.getElementById('strip-preview-area');
    const domWidth = previewEl ? previewEl.clientWidth : undefined;

    const canvas = await buildStripCanvas({
      slots,
      cols: template.cols,
      templateId: template.id,
      frame,
      stripText,
      stripTextColor,
      stripTextFont: stripTextFont.cssFamily,
      stripTextSize,
      stripTextPosition,
      filter,
      stickers,
      domWidth,
    });
    canvasRef.current = canvas;
    return canvas;
  }, [
    slots,
    template,
    frame,
    stripText,
    stripTextColor,
    stripTextFont,
    stripTextSize,
    stripTextPosition,
    filter,
    stickers,
  ]);

  /** Download JPG (HD) & open helper modal (Jepreto behavior) */
  const handleDownloadJPG = useCallback(async () => {
    setIsBuilding(true);
    try {
      const canvas = await getCanvas();
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      const link = document.createElement('a');
      link.download = `ruanggaya-${Date.now()}.jpg`;
      link.href = dataUrl;
      link.click();

      // Show download helper modal for long-press / save manual
      setDownloadModal({ show: true, dataUrl });
    } catch (err) {
      console.error('Download JPG gagal:', err);
      alert('Gagal mengunduh gambar. Silakan coba lagi.');
    } finally {
      setIsBuilding(false);
    }
  }, [getCanvas]);

  /** Download PNG (Uncompressed) */
  const handleDownloadPNG = useCallback(async () => {
    setIsBuilding(true);
    try {
      const canvas = await getCanvas();
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `ruanggaya-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download PNG gagal:', err);
    } finally {
      setIsBuilding(false);
    }
  }, [getCanvas]);

  /** Save & Print */
  const handleSaveAndPrint = useCallback(async () => {
    setIsBuilding(true);
    try {
      const canvas = await getCanvas();
      const dataUrl = canvas.toDataURL('image/jpeg', 0.98);
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Cetak Photostrip - RuangGaya</title>
              <style>
                @page { size: auto; margin: 10mm; }
                body {
                  margin: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                  background: #ffffff;
                }
                img {
                  max-height: 90vh;
                  max-width: 90vw;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                  border-radius: 4px;
                }
              </style>
            </head>
            <body>
              <img src="${dataUrl}" onload="window.print(); window.close();" />
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    } catch (err) {
      console.error('Print gagal:', err);
    } finally {
      setIsBuilding(false);
    }
  }, [getCanvas]);

  /** Generate animated GIF */
  const handleDownloadGIF = useCallback(async () => {
    if (isGifBuilding) return;
    setIsGifBuilding(true);
    try {
      const cssFilter = FILTER_CSS[filter];
      const frameW = 400;
      const frameH = 300;
      const frameDataUrls: string[] = [];

      for (const src of slots) {
        const canvas = document.createElement('canvas');
        canvas.width = frameW;
        canvas.height = frameH;
        const ctx = canvas.getContext('2d')!;
        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
          const i = new Image();
          i.onload = () => resolve(i);
          i.onerror = reject;
          i.src = src;
        });
        if (cssFilter !== 'none') ctx.filter = cssFilter;
        ctx.drawImage(img, 0, 0, frameW, frameH);
        ctx.filter = 'none';
        frameDataUrls.push(canvas.toDataURL('image/jpeg', 0.85));
      }

      const gifshot = (await import('gifshot')).default;
      gifshot.createGIF(
        {
          images: frameDataUrls,
          gifWidth: frameW,
          gifHeight: frameH,
          interval: 0.7,
          numFrames: frameDataUrls.length,
          frameDuration: 1,
          sampleInterval: 10,
          numWorkers: 2,
        },
        (obj: { error: boolean; image: string }) => {
          setIsGifBuilding(false);
          if (!obj.error) {
            const link = document.createElement('a');
            link.download = `ruanggaya-${Date.now()}.gif`;
            link.href = obj.image;
            link.click();
          } else {
            alert('Gagal membuat animasi GIF. Silakan coba lagi.');
          }
        }
      );
    } catch (err) {
      console.error('GIF gagal:', err);
      setIsGifBuilding(false);
      alert('Gagal membuat GIF.');
    }
  }, [isGifBuilding, slots, filter]);

  /** Generate QR code for mobile save */
  const handleGenerateQR = useCallback(async () => {
    setQrModal({ show: true, qrDataUrl: '', shareUrl: '', isGenerating: true });
    try {
      const canvas = await getCanvas();
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

      const res = await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataUrl }),
      });
      if (!res.ok) throw new Error('Upload failed');
      const { shareUrl } = (await res.json()) as { id: string; shareUrl: string };

      const qrDataUrl = await QRCode.toDataURL(shareUrl, {
        width: 240,
        margin: 2,
        color: { dark: '#202030', light: '#FFFFFF' },
        errorCorrectionLevel: 'M',
      });

      setQrModal({ show: true, qrDataUrl, shareUrl, isGenerating: false });
    } catch (err) {
      console.error('QR gagal:', err);
      setQrModal({ show: false, qrDataUrl: '', shareUrl: '', isGenerating: false });
      alert('Gagal membuat QR. Silakan coba lagi.');
    }
  }, [getCanvas]);

  return (
    <div className={styles.editStudioContainer}>
      {/* ── Top Secondary Quick Bar ── */}
      <div className={styles.topActionsBar}>
        <div className={styles.topBadgeGroup}>
          <span className={styles.studioBadge}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            Edit Studio
          </span>
          <span className={styles.topSubtitle}>
            Sesuaikan warna bingkai, filter foto, dan tempel stiker seru!
          </span>
        </div>

        <div className={styles.topBtnGroup}>
          <button
            type="button"
            className={`${styles.quickBtn} ${styles.quickRetakeBtn}`}
            onClick={onReset}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M1 4v6h6M23 20v-6h-6" />
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
            </svg>
            <span>Foto Ulang</span>
          </button>

          <button
            type="button"
            className={`${styles.quickBtn} ${styles.quickDownloadBtn}`}
            onClick={handleDownloadJPG}
            disabled={isBuilding}
          >
            {isBuilding ? (
              <span className={styles.spinner} style={{ borderTopColor: '#202030' }} />
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            )}
            <span>Download Sekarang</span>
          </button>
        </div>
      </div>

      {/* ── Main Studio Split Stage ── */}
      <div className={styles.studioLayout}>
        {/* ── Left Column: Craft Canvas Viewport ── */}
        <div className={styles.canvasCol}>
          <div className={styles.stripCardWrapper}>
            <div className={styles.stripCardHeader}>
              <span className={styles.stripCardTitle}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="9" y1="21" x2="9" y2="9" />
                </svg>
                Photostrip Preview
              </span>
              <span className={styles.stripCardBadge}>
                {template.slots} Foto • {frame.name}
              </span>
            </div>

            {/* Live Strip Preview with Interactive Sticker Layer */}
            <StripPreview
              slots={slots}
              template={template}
              frame={frame}
              filter={filter}
              stripText={stripText}
              stripTextColor={stripTextColor}
              stripTextFont={stripTextFont.cssFamily}
              stripTextSize={stripTextSize}
              stripTextPosition={stripTextPosition}
              stickers={stickers}
              updateSticker={updateSticker}
              removeSticker={removeSticker}
            />
          </div>

          <div className={styles.canvasTip}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: 'var(--rg-purple)' }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span>
              <strong>Tips Stiker:</strong> Klik &amp; geser stiker langsung pada foto untuk mengatur posisi, putar, atau ubah ukuran!
            </span>
          </div>
        </div>

        {/* ── Right Column: Jepreto-Style Cards Stack ── */}
        <div className={styles.cardsCol}>
          {/* Card 1: Polish your photostrip Banner */}
          <div className={styles.studioCard}>
            <div className={styles.cardHeaderBanner}>
              <span className={styles.bannerTag}>EDIT STUDIO</span>
              <h2 className={styles.bannerTitle}>Polish your photostrip</h2>
              <p className={styles.bannerSubtitle}>
                Atur template, pilih filter, lalu tambahkan sticker yang seru.
              </p>
            </div>

            <button
              type="button"
              className={styles.backOptionsBtn}
              onClick={onReset}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <span>← Back to Options (Foto Ulang)</span>
            </button>
          </div>

          {/* Card 2: Selected Template & Background */}
          <div className={styles.studioCard}>
            <h3 className={styles.cardTitle}>Selected Template</h3>

            <div className={styles.templateCardBox}>
              <div className={styles.templateInfo}>
                <div className={styles.templateIconBadge}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--rg-purple)' }}>
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <div>
                  <div className={styles.templateName}>{template.label}</div>
                  <div className={styles.templatePositions}>
                    {template.slots} photo positions ({template.cols} kolom)
                  </div>
                </div>
              </div>

              <button
                type="button"
                className={styles.changeTemplateBtn}
                onClick={() => setShowTemplateModal(true)}
              >
                Change Template
              </button>
            </div>

            {/* Background Color Swatches (Jepreto signature) */}
            <div>
              <div className={styles.subSectionTitle}>Background Color</div>
              <div className={styles.colorSwatchesGrid}>
                {COLOR_SWATCHES.map((swatch) => (
                  <button
                    key={swatch.color}
                    type="button"
                    title={swatch.name}
                    className={`${styles.colorSwatchBtn} ${
                      frame.bgColor.toLowerCase() === swatch.color.toLowerCase() && !frame.bgImage
                        ? styles.colorSwatchActive
                        : ''
                    }`}
                    style={{ backgroundColor: swatch.color }}
                    onClick={() => {
                      onFrameChange({
                        ...frame,
                        bgColor: swatch.color,
                        bgImage: null,
                      });
                    }}
                  />
                ))}

                {/* Custom Color Input */}
                <label className={styles.customColorWrap} title="Pilih warna kustom">
                  <input
                    type="color"
                    className={styles.customColorInput}
                    value={frame.bgColor}
                    onChange={(e) => {
                      onFrameChange({
                        ...frame,
                        bgColor: e.target.value,
                        bgImage: null,
                      });
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Frame Desain Bergambar */}
            <div>
              <div className={styles.subSectionTitle}>Frame &amp; Tema Desain</div>
              <div className={styles.frameCategoryChips}>
                {[
                  { id: 'all', label: 'Semua' },
                  { id: 'aesthetic', label: 'Aesthetic' },
                  { id: 'cartoon', label: 'Kartun' },
                  { id: 'meme', label: 'Meme' },
                  { id: 'solid', label: 'Warna Polos' },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`${styles.frameChip} ${frameCategory === c.id ? styles.frameChipActive : ''}`}
                    onClick={() => setFrameCategory(c.id as any)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              <div className={styles.frameScrollRow}>
                {filteredFrames.map((f) => (
                  <div
                    key={f.id}
                    className={`${styles.frameThumbItem} ${frame.id === f.id ? styles.frameThumbActive : ''}`}
                    onClick={() => onFrameChange(f)}
                  >
                    <div
                      className={styles.frameThumbBox}
                      style={{
                        backgroundColor: f.bgColor,
                        backgroundImage: f.bgImage ? `url(${f.bgImage})` : undefined,
                      }}
                    />
                    <span className={styles.frameThumbLabel}>{f.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Filter Playground (Live preview on user's actual photo) */}
          <div className={styles.studioCard}>
            <h3 className={styles.cardTitle}>Filter Playground</h3>
            <p className={styles.cardSubtitle}>
              Select a filter below to apply it to all photos.
            </p>

            <div className={styles.filterGrid}>
              {filters.map((f) => {
                const isSelected = filter === f;
                const cssFilter = FILTER_CSS[f];
                const meta = FILTER_METAS.find((m) => m.id === f);

                return (
                  <button
                    key={f}
                    type="button"
                    className={`${styles.filterCard} ${isSelected ? styles.filterCardActive : ''}`}
                    onClick={() => onFilterChange(f)}
                  >
                    <div className={styles.filterThumbContainer}>
                      {slots[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={slots[0]}
                          alt={f}
                          className={styles.filterThumbImg}
                          style={{
                            filter: cssFilter !== 'none' ? cssFilter : undefined,
                            transform: 'scaleX(-1)', // Match mirrored photo preview
                          }}
                        />
                      ) : (
                        <div
                          className={styles.filterFallbackSwatch}
                          style={{ background: meta?.previewBg || '#8e36ff' }}
                        />
                      )}

                      {isSelected && (
                        <div className={styles.filterCheckBadge}>✓</div>
                      )}
                    </div>
                    <span className={styles.filterName}>{f}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card 4: Sticker Corner */}
          <div className={styles.studioCard}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 className={styles.cardTitle}>Sticker Corner</h3>
              {stickers.length > 0 && (
                <button
                  type="button"
                  className={styles.clearStickersBtn}
                  onClick={clearStickers}
                  title="Hapus semua stiker yang ada di foto"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  <span>Hapus Semua ({stickers.length})</span>
                </button>
              )}
            </div>

            <p className={styles.cardSubtitle}>
              Tap sticker favoritmu untuk langsung tempel ke foto.
            </p>

            {/* Sticker Category Tabs (Pills) */}
            <div className={styles.stickerTabsRow}>
              {[
                { id: 'all', label: 'Semua' },
                { id: 'emoji', label: 'Emoji' },
                { id: 'decorative', label: 'Decorative' },
                { id: 'flowers', label: 'Flowers' },
                { id: 'memes', label: 'Memes' },
                { id: 'y2k', label: 'Y2K' },
                { id: 'korean', label: 'Korean' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`${styles.stickerTabBtn} ${stickerCategory === cat.id ? styles.stickerTabActive : ''}`}
                  onClick={() => setStickerCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sticker Search Bar */}
            <div className={styles.stickerSearchRow}>
              <input
                type="text"
                placeholder="Cari stiker lucu..."
                value={stickerQuery}
                onChange={(e) => setStickerQuery(e.target.value)}
                className={styles.stickerSearchInput}
              />
            </div>

            {/* Sticker Grid with Bounce Hover */}
            <div className={styles.stickerGrid}>
              {filteredStickers.map((stk, idx) => (
                <button
                  key={`${stk.src}-${idx}`}
                  type="button"
                  className={styles.stickerTileBtn}
                  onClick={() => addSticker(stk.src)}
                  title={`Tempel ${stk.name}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={stk.src} alt={stk.name} className={styles.stickerTileImg} />
                </button>
              ))}
            </div>
          </div>

          {/* Card 5: Tambahkan Teks & Watermark */}
          <div className={styles.studioCard}>
            <h3 className={styles.cardTitle}>Tambahkan Teks</h3>
            <p className={styles.cardSubtitle}>
              Beri tanggal, pesan cinta, atau caption pada strip foto.
            </p>

            <input
              type="text"
              placeholder="Ketik teks di sini (contoh: Happy Sweet 17!)"
              value={stripText}
              onChange={(e) => onStripTextChange(e.target.value)}
              className={styles.textInput}
              maxLength={40}
            />

            {/* Font Picker */}
            <div className={styles.fontPickerGrid}>
              {FONTS.map((font) => (
                <button
                  key={font.id}
                  type="button"
                  className={`${styles.fontPickerBtn} ${stripTextFont.id === font.id ? styles.fontPickerActive : ''}`}
                  style={{ fontFamily: font.cssFamily }}
                  onClick={() => onStripTextFontChange(font)}
                >
                  {font.label}
                </button>
              ))}
            </div>

            {/* Text Controls: Color & Position */}
            <div className={styles.textControlsRow}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Warna:</span>
                <input
                  type="color"
                  value={stripTextColor}
                  onChange={(e) => onStripTextColorChange(e.target.value)}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: '1.5px solid #202030',
                    cursor: 'pointer',
                  }}
                />
              </div>

              {/* Position Toggle */}
              <div className={styles.posToggleRow}>
                <button
                  type="button"
                  className={`${styles.posBtn} ${stripTextPosition === 'bottom' ? styles.posBtnActive : ''}`}
                  onClick={() => onStripTextPositionChange('bottom')}
                >
                  Bawah
                </button>
                <button
                  type="button"
                  className={`${styles.posBtn} ${stripTextPosition === 'top' ? styles.posBtnActive : ''}`}
                  onClick={() => onStripTextPositionChange('top')}
                >
                  Atas
                </button>
              </div>
            </div>
          </div>

          {/* Card 6: Final Actions (Jepreto-style Action Block) */}
          <div className={styles.studioCard}>
            <h3 className={styles.cardTitle}>Final Actions</h3>

            <div className={styles.finalActionsGrid}>
              {/* Save & Print */}
              <button
                type="button"
                className={`${styles.actionBtnPrimary} ${styles.btnSavePrint}`}
                onClick={handleSaveAndPrint}
                disabled={isBuilding}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
                <span>Save &amp; Print</span>
              </button>

              {/* Download */}
              <button
                type="button"
                className={`${styles.actionBtnPrimary} ${styles.btnDownload}`}
                onClick={handleDownloadJPG}
                disabled={isBuilding}
              >
                {isBuilding ? (
                  <span className={styles.spinner} style={{ borderTopColor: '#202030' }} />
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                )}
                <span>Download HD Quality</span>
              </button>

              {/* GIF Animation */}
              <button
                type="button"
                className={`${styles.actionBtnPrimary} ${styles.btnGif}`}
                onClick={handleDownloadGIF}
                disabled={isGifBuilding}
              >
                {isGifBuilding ? (
                  <span className={styles.spinner} />
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="5" height="5" rx="1" />
                    <rect x="10" y="3" width="5" height="5" rx="1" />
                    <rect x="3" y="10" width="5" height="5" rx="1" />
                    <rect x="10" y="10" width="5" height="5" rx="1" />
                    <path d="M17 16l2 2 4-4" />
                  </svg>
                )}
                <span>{isGifBuilding ? 'Membuat GIF...' : 'Unduh Animasi GIF'}</span>
              </button>

              {/* Scan QR di HP */}
              <button
                type="button"
                className={`${styles.actionBtnPrimary} ${styles.btnQr}`}
                onClick={handleGenerateQR}
                disabled={qrModal.isGenerating}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="5" y="5" width="3" height="3" fill="currentColor" />
                  <rect x="16" y="5" width="3" height="3" fill="currentColor" />
                  <rect x="16" y="16" width="3" height="3" fill="currentColor" />
                  <rect x="5" y="16" width="3" height="3" fill="currentColor" />
                </svg>
                <span>{qrModal.isGenerating ? 'Membuat QR...' : 'Unduh via Scan QR (HP)'}</span>
              </button>

              {/* Foto Ulang */}
              <button
                type="button"
                className={`${styles.actionBtnPrimary} ${styles.btnRetake}`}
                onClick={onReset}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 .49-4.5" />
                </svg>
                <span>Foto Ulang Dari Awal</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Jepreto-Style Download Helper Modal ── */}
      {downloadModal.show && (
        <div
          className={styles.modalOverlay}
          onClick={() => setDownloadModal({ show: false, dataUrl: '' })}
        >
          <div
            className={styles.downloadModal}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.modalCloseBtn}
              onClick={() => setDownloadModal({ show: false, dataUrl: '' })}
              aria-label="Tutup"
            >
              ✕
            </button>

            <h3 className={styles.modalTitle}>Fotunya ga ke download?</h3>

            <div className={styles.modalInstructions}>
              <span className={styles.instructionHeading}>Kamu bisa save manual dengan cara:</span>
              <ol className={styles.instructionList}>
                <li>Tekan dan tahan gambar di bawah ini atau klik kanan untuk pengguna laptop/komputer</li>
                <li>Pilih &quot;Save Image&quot; atau &quot;Simpan Gambar&quot;</li>
              </ol>
            </div>

            <div className={styles.modalPreviewWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={downloadModal.dataUrl}
                alt="RuangGaya Photostrip"
                className={styles.modalStripImg}
              />
            </div>

            <div className={styles.modalActionButtons}>
              <button
                type="button"
                className={styles.modalBtn}
                style={{ background: '#f8d22a', color: '#0f172a' }}
                onClick={handleDownloadJPG}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Download JPG HD</span>
              </button>
              <button
                type="button"
                className={styles.modalBtn}
                style={{ background: '#ffffff', color: '#0f172a' }}
                onClick={handleDownloadPNG}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span>Download PNG</span>
              </button>
              <button
                type="button"
                className={styles.modalBtn}
                style={{ background: 'var(--rg-purple)', color: '#ffffff' }}
                onClick={handleDownloadGIF}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="2.18" />
                  <line x1="7" y1="2" x2="7" y2="22" />
                  <line x1="17" y1="2" x2="17" y2="22" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                </svg>
                <span>Unduh Animasi GIF</span>
              </button>
              <button
                type="button"
                className={styles.modalBtn}
                style={{ background: '#0f172a', color: '#ffffff' }}
                onClick={handleGenerateQR}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                <span>Scan QR di HP</span>
              </button>
            </div>

            <button
              type="button"
              className={styles.modalCloseBigBtn}
              onClick={() => setDownloadModal({ show: false, dataUrl: '' })}
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* ── QR Code Modal ── */}
      {qrModal.show && (
        <div
          className={styles.modalOverlay}
          onClick={() => setQrModal({ show: false, qrDataUrl: '', shareUrl: '', isGenerating: false })}
        >
          <div
            className={styles.downloadModal}
            style={{ maxWidth: '440px', alignItems: 'center', textAlign: 'center' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.modalCloseBtn}
              onClick={() => setQrModal({ show: false, qrDataUrl: '', shareUrl: '', isGenerating: false })}
              aria-label="Tutup"
            >
              ✕
            </button>

            <h3 className={styles.modalTitle}>Scan untuk unduh di HP</h3>

            {qrModal.isGenerating ? (
              <div style={{ padding: '30px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <span className={styles.spinner} style={{ width: '32px', height: '32px', borderTopColor: 'var(--rg-purple)' }} />
                <p style={{ fontWeight: 600, color: 'var(--rg-dark)' }}>Mempersiapkan gambar...</p>
              </div>
            ) : (
              <>
                <div style={{ padding: '16px', background: '#ffffff', border: '1px solid var(--rg-border)', borderRadius: '16px', boxShadow: 'var(--rg-shadow-md)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrModal.qrDataUrl} alt="QR Code" style={{ width: '220px', height: '220px', display: 'block' }} />
                </div>

                <div className={styles.modalInstructions} style={{ textAlign: 'left', width: '100%' }}>
                  <ol className={styles.instructionList}>
                    <li>Buka kamera smartphone atau aplikasi pemindai QR</li>
                    <li>Arahkan kamera ke QR code di atas</li>
                    <li>Klik link untuk langsung menyimpan foto ke galeri HP</li>
                  </ol>
                </div>

                <button
                  type="button"
                  className={styles.modalBtn}
                  style={{ width: '100%', background: '#f8d22a', color: '#0f172a' }}
                  onClick={() => {
                    navigator.clipboard.writeText(qrModal.shareUrl);
                    alert('Link berhasil disalin ke clipboard!');
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>Salin Link Berbagi</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Change Template Modal ── */}
      {showTemplateModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowTemplateModal(false)}
        >
          <div
            className={styles.downloadModal}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.modalCloseBtn}
              onClick={() => setShowTemplateModal(false)}
              aria-label="Tutup"
            >
              ✕
            </button>

            <h3 className={styles.modalTitle}>Ganti Template</h3>
            <p className={styles.cardSubtitle}>
              Catatan: Memilih template dengan jumlah foto berbeda akan mereset foto yang sudah diambil.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {templates.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`${styles.templateCardBox} ${template.id === t.id ? styles.frameThumbActive : ''}`}
                  onClick={() => {
                    onTemplateChange(t);
                    setShowTemplateModal(false);
                  }}
                >
                  <div className={styles.templateInfo}>
                    <div className={styles.templateIconBadge}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--rg-purple)' }}>
                        <rect x="2" y="2" width="20" height="20" rx="2" />
                        <line x1="7" y1="2" x2="7" y2="22" />
                        <line x1="17" y1="2" x2="17" y2="22" />
                      </svg>
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div className={styles.templateName}>{t.label}</div>
                      <div className={styles.templatePositions}>{t.slots} foto • {t.cols} kolom</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <button
              type="button"
              className={styles.modalCloseBigBtn}
              onClick={() => setShowTemplateModal(false)}
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
