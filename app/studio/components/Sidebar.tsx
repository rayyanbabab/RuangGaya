'use client';
import { useState, useEffect, useMemo } from 'react';
import {
  Template, Frame, FilterType, TimerOption, FontOption, TextPosition,
  FONTS, FONT_SIZES, FACE_FILTERS, FILTER_METAS, type FaceFilterId
} from '@/lib/config';
import styles from './Sidebar.module.css';

interface SidebarProps {
  templates: readonly Template[];
  frames: readonly Frame[];
  filters: readonly FilterType[];
  activeTemplate: Template;
  activeFrame: Frame;
  activeFilter: FilterType;
  stripText: string;
  stripTextColor: string;
  stripTextFont: FontOption;
  stripTextSize: number;
  stripTextPosition: TextPosition;
  timer: TimerOption;
  timerOptions: readonly number[];
  autoShoot: boolean;
  isReviewMode: boolean;
  onTemplateChange: (t: Template) => void;
  onFrameChange: (f: Frame) => void;
  onFilterChange: (f: FilterType) => void;
  onStripTextChange: (s: string) => void;
  onStripTextColorChange: (c: string) => void;
  onStripTextFontChange: (f: FontOption) => void;
  onStripTextSizeChange: (s: number) => void;
  onStripTextPositionChange: (p: TextPosition) => void;
  onTimerChange: (t: TimerOption) => void;
  onAutoShootToggle: () => void;
  addSticker: (src: string) => void;
  stickerCount?: number;
  onClearStickers?: () => void;
  faceFilter: FaceFilterId;
  onFaceFilterChange: (id: FaceFilterId) => void;
}

// Tab definition
const TABS = [
  { id: 'frame',  label: 'Background', icon: <FrameTabIcon /> },
  { id: 'filter', label: 'Filter',     icon: <FilterTabIcon /> },
  { id: 'face',   label: 'Face',       icon: <FaceTabIcon /> },
  { id: 'sticker',label: 'Stiker',     icon: <StickerTabIcon /> },
  { id: 'text',   label: 'Teks',       icon: <TextTabIcon /> },
  { id: 'tmpl',   label: 'Layout',     icon: <LayoutTabIcon /> },
] as const;
type TabId = (typeof TABS)[number]['id'];

interface StickerItemMeta {
  src: string;
  name: string;
  category: string;
}

export default function Sidebar({
  templates, frames, filters,
  activeTemplate, activeFrame, activeFilter,
  stripText, stripTextColor, stripTextFont, stripTextSize, stripTextPosition,
  faceFilter,
  timer, timerOptions, isReviewMode,
  onTemplateChange, onFrameChange, onFilterChange,
  onStripTextChange, onStripTextColorChange,
  onStripTextFontChange, onStripTextSizeChange, onStripTextPositionChange,
  onFaceFilterChange,
  onTimerChange, addSticker,
  stickerCount = 0, onClearStickers,
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<TabId>('frame');
  const [stickersList, setStickersList] = useState<StickerItemMeta[]>([]);
  const [stickerCategory, setStickerCategory] = useState<string>('all');
  const [stickerQuery, setStickerQuery] = useState<string>('');
  const [frameCategory, setFrameCategory] = useState<'all' | 'cartoon' | 'meme' | 'aesthetic' | 'solid'>('all');

  const filteredFrames = useMemo(() => {
    if (frameCategory === 'cartoon') {
      return frames.filter((f) => f.id.includes('pixar') || f.id.includes('disney') || f.id.includes('monsters') || f.id.includes('stitch'));
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

  useEffect(() => {
    fetch('/api/stickers')
      .then(res => res.json())
      .then(data => {
        if (data.items && Array.isArray(data.items) && data.items.length > 0) {
          setStickersList(data.items);
        } else if (data.stickers && Array.isArray(data.stickers)) {
          setStickersList(data.stickers.map((src: string) => {
            const slug = src.split('/').pop()?.split('.')[0] || 'Stiker';
            return {
              src,
              name: slug.replace(/[-_]/g, ' '),
              category: 'y2k',
            };
          }));
        }
      })
      .catch(err => console.error('Failed to load stickers', err));
  }, []);

  const filteredStickers = useMemo(() => {
    return stickersList.filter((item) => {
      const matchCat = stickerCategory === 'all' || item.category === stickerCategory;
      const matchQuery = !stickerQuery.trim() || item.name.toLowerCase().includes(stickerQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [stickersList, stickerCategory, stickerQuery]);

  const visibleTabs = isReviewMode
    ? TABS
    : TABS;

  return (
    <aside className={styles.sidebar} aria-label="Panel kontrol">
      {/* ── Tab bar (mobile + desktop) ── */}
      <div className={styles.tabBar}>
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab.id)}
            aria-label={tab.label}
            title={tab.label}
          >
            {tab.icon}
            <span className={styles.tabLabel}>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}
      <div className={styles.inner}>

        {/* FRAME */}
        {activeTab === 'frame' && (
          <Section title="Background">
            {/* Quick Category Filter Chips */}
            <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '6px', marginBottom: '8px' }}>
              {[
                { id: 'all', label: 'Semua' },
                { id: 'cartoon', label: 'Kartun' },
                { id: 'meme', label: 'Meme' },
                { id: 'aesthetic', label: 'Desain' },
                { id: 'solid', label: 'Polos' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFrameCategory(cat.id as any)}
                  style={{
                    padding: '5px 10px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    borderRadius: '6px',
                    border: frameCategory === cat.id ? '1px solid var(--rg-purple)' : '1px solid var(--rg-border)',
                    background: frameCategory === cat.id ? 'var(--rg-purple)' : '#ffffff',
                    color: frameCategory === cat.id ? '#ffffff' : 'var(--rg-muted)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className={styles.frameGrid}>
              {filteredFrames.map((f) => (
                <button
                  key={f.id}
                  id={`frame-${f.id}`}
                  className={`${styles.frameBtn} ${activeFrame.id === f.id ? styles.active : ''}`}
                  onClick={() => onFrameChange(f)}
                  title={f.name}
                >
                  {/* Priority: bgImage > color swatch */}
                  {f.bgImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={f.bgImage} alt={f.name} className={styles.frameBgThumb} />
                  ) : (
                    <div
                      className={styles.frameSwatch}
                      style={{ background: f.bgColor, border: `3px solid ${f.borderColor}` }}
                    >
                      <div className={styles.frameSwatchSlot} style={{ background: f.borderColor, opacity: 0.6 }} />
                    </div>
                  )}
                  <span className={styles.frameLabel}>{f.name}</span>
                </button>
              ))}
            </div>
            {/* Custom Background Color Picker */}
            <div className={styles.bgColorPickerWrap}>
              <label htmlFor="custom-bg" className={styles.bgColorLabel}>
                Warna Latar Kustom:
              </label>
              <div className={styles.bgColorInputBox}>
                <input
                  type="color"
                  id="custom-bg"
                  value={activeFrame.bgColor}
                  onChange={(e) => onFrameChange({ ...activeFrame, bgColor: e.target.value })}
                  className={styles.bgColorInput}
                  title="Ganti warna latar belakang"
                />
                <span className={styles.bgColorHex}>{activeFrame.bgColor.toUpperCase()}</span>
              </div>
            </div>
            {/* Guide for adding custom frames */}
            {/* <div className={styles.frameGuide}>
              <div className={styles.frameGuideTitle}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                Cara tambah background sendiri
              </div>
              <div className={styles.frameGuideBody}>
                <p>① Taruh gambar/PNG ke <code>/public/backgrounds/</code></p>
                <p>② Tambah entri di <code>lib/config.ts</code></p>
                <p>③ Simpan → background langsung muncul</p>
              </div>
            </div> */}
          </Section>
        )}


        {/* FILTER */}
        {activeTab === 'filter' && (
          <Section title="Filter Foto">
            <div className={styles.filterCardGrid}>
              {FILTER_METAS.map((f) => (
                <button
                  key={f.id}
                  id={`filter-${f.id.toLowerCase().replace(/[^a-z0-9]/g, '')}`}
                  className={`${styles.filterCard} ${activeFilter === f.id ? styles.filterCardActive : ''}`}
                  onClick={() => onFilterChange(f.id)}
                  title={f.description}
                >
                  <div
                    className={styles.filterPreviewSwatch}
                    style={{ background: f.previewBg }}
                  >
                    <span className={styles.filterIcon}>{f.icon}</span>
                  </div>
                  <div className={styles.filterCardInfo}>
                    <span className={styles.filterCardLabel}>{f.label}</span>
                    <span className={styles.filterCardDesc}>{f.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </Section>
        )}

        {/* FACE FILTER */}
        {activeTab === 'face' && (
          <Section title="Filter Wajah (AR)">
            <p className={styles.hint} style={{ marginBottom: '10px' }}>
              Filter wajah AR melacak posisi otomatis dan mengikuti gerakan kepala.
            </p>
            <div className={styles.faceFilterGrid}>
              {FACE_FILTERS.map((f) => (
                <button
                  key={f.id}
                  id={`face-filter-${f.id}`}
                  className={`${styles.faceFilterBtn} ${faceFilter === f.id ? styles.active : ''}`}
                  onClick={() => onFaceFilterChange(f.id)}
                  title={f.description}
                >
                  <span className={styles.faceFilterEmoji}>{f.icon}</span>
                  <span className={styles.faceFilterLabel}>{f.label}</span>
                </button>
              ))}
            </div>
            {faceFilter !== 'none' && (
              <div className={styles.activeFaceBadge}>
                {FACE_FILTERS.find(f => f.id === faceFilter)?.description}
              </div>
            )}
          </Section>
        )}

        {/* OVERLAY / STIKER */}
        {activeTab === 'sticker' && (
          <Section title="Stiker Photobooth">
            {/* Header info & clear button */}
            <div className={styles.stickerHeaderRow}>
              <span className={styles.stickerCountBadge}>
                {stickersList.length} Stiker
                {stickerCount > 0 ? ` • ${stickerCount} di kanvas` : ''}
              </span>
              {stickerCount > 0 && onClearStickers && (
                <button
                  type="button"
                  className={styles.stickerClearBtn}
                  onClick={onClearStickers}
                  title="Hapus semua stiker yang ada di strip foto"
                >
                  Bersihkan Kanvas
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className={styles.categoryPills}>
              {[
                { id: 'all', label: 'Semua 🌟' },
                { id: 'korean', label: 'Korean 🎀' },
                { id: 'animals', label: 'Hewan 🐾' },
                { id: 'memes', label: 'Meme 😹' },
                { id: 'y2k', label: 'Y2K ✨' },
                { id: 'emoji', label: 'Emoji 😎' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`${styles.categoryPill} ${stickerCategory === cat.id ? styles.categoryPillActive : ''}`}
                  onClick={() => setStickerCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className={styles.stickerSearchBox}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
              <input
                type="text"
                placeholder="Cari stiker (misal: bow, shiba, doge, flame)..."
                value={stickerQuery}
                onChange={(e) => setStickerQuery(e.target.value)}
                className={styles.stickerSearchInput}
              />
              {stickerQuery && (
                <button
                  type="button"
                  className={styles.clearSearchBtn}
                  onClick={() => setStickerQuery('')}
                >
                  ×
                </button>
              )}
            </div>

            {/* Sticker Grid */}
            <div className={styles.stickerGrid}>
              {filteredStickers.length === 0 ? (
                <p className={styles.emptyStickerMsg}>
                  Tidak ada stiker yang cocok.
                </p>
              ) : (
                filteredStickers.map((item) => (
                  <button
                    key={item.src}
                    type="button"
                    className={styles.stickerBtn}
                    onClick={() => addSticker(item.src)}
                    title={`Tambah ${item.name}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.src} alt={item.name} className={styles.stickerThumb} />
                    <span className={styles.stickerItemLabel}>{item.name}</span>
                  </button>
                ))
              )}
            </div>
            <p className={styles.hint} style={{ marginTop: '0.8rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>Klik stiker untuk menaruh di foto. Geser, cubit, atau putar sesukamu!</span>
            </p>
          </Section>
        )}

        {/* TEXT */}
        {activeTab === 'text' && (
          <Section title="Teks Strip">
            <input
              id="input-strip-text"
              type="text"
              className="rg-input"
              placeholder="Nama / tanggal acara..."
              value={stripText}
              onChange={(e) => onStripTextChange(e.target.value)}
              maxLength={60}
            />

            {/* Font family picker */}
            <div className={styles.bgColorPickerWrap} style={{ marginTop: '16px' }}>
              <label className={styles.bgColorLabel}>Jenis Font:</label>
              <div className={styles.fontGrid}>
                {FONTS.map((font) => (
                  <button
                    key={font.id}
                    className={`${styles.fontBtn} ${stripTextFont.id === font.id ? styles.active : ''}`}
                    onClick={() => onStripTextFontChange(font)}
                    style={{ fontFamily: font.cssFamily }}
                    title={font.label}
                  >
                    {font.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Font size slider */}
            <div className={styles.bgColorPickerWrap} style={{ marginTop: '14px' }}>
              <label className={styles.bgColorLabel}>
                Ukuran Font: <strong>{stripTextSize}px</strong>
              </label>
              <input
                type="range"
                min={FONT_SIZES[0]}
                max={FONT_SIZES[FONT_SIZES.length - 1]}
                value={stripTextSize}
                onChange={(e) => onStripTextSizeChange(Number(e.target.value))}
                className={styles.sizeSlider}
                step={1}
              />
              <div className={styles.sizeSliderLabels}>
                <span>{FONT_SIZES[0]}px</span>
                <span>{FONT_SIZES[FONT_SIZES.length - 1]}px</span>
              </div>
            </div>

            {/* Text position toggle */}
            <div className={styles.bgColorPickerWrap} style={{ marginTop: '14px' }}>
              <label className={styles.bgColorLabel}>Posisi Teks:</label>
              <div className={styles.positionToggle}>
                <button
                  className={`${styles.positionBtn} ${stripTextPosition === 'top' ? styles.active : ''}`}
                  onClick={() => onStripTextPositionChange('top')}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="5" y1="5" x2="19" y2="5"/><polyline points="12 19 12 9"/><polyline points="8 13 12 9 16 13"/>
                  </svg>
                  Atas
                </button>
                <button
                  className={`${styles.positionBtn} ${stripTextPosition === 'bottom' ? styles.active : ''}`}
                  onClick={() => onStripTextPositionChange('bottom')}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="5" y1="19" x2="19" y2="19"/><polyline points="12 5 12 15"/><polyline points="8 11 12 15 16 11"/>
                  </svg>
                  Bawah
                </button>
              </div>
            </div>

            {/* Text color */}
            <div className={styles.bgColorPickerWrap} style={{ marginTop: '14px' }}>
              <label htmlFor="custom-text-color" className={styles.bgColorLabel}>
                Warna Teks:
              </label>
              <div className={styles.bgColorInputBox}>
                <input
                  type="color"
                  id="custom-text-color"
                  value={stripTextColor}
                  onChange={(e) => onStripTextColorChange(e.target.value)}
                  className={styles.bgColorInput}
                  title="Ganti warna teks"
                />
                <span className={styles.bgColorHex}>{stripTextColor.toUpperCase()}</span>
              </div>
            </div>

            {/* Preview of selected font */}
            {stripText && (
              <div style={{
                marginTop: '14px',
                padding: '10px 14px',
                background: 'var(--rg-surface)',
                borderRadius: '10px',
                border: '1.5px solid var(--rg-card)',
                fontFamily: stripTextFont.cssFamily,
                fontSize: `${Math.min(stripTextSize, 24)}px`,
                color: stripTextColor,
                fontWeight: 'bold',
                textAlign: 'center',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}>
                {stripText}
              </div>
            )}

            <p className={styles.hint}>Muncul di bagian {stripTextPosition === 'top' ? 'atas' : 'bawah'} strip foto</p>
          </Section>
        )}

        {/* TEMPLATE */}
        {activeTab === 'tmpl' && (
          <>
            <Section title="Layout Template">
              <div className={styles.templateGrid}>
                {templates.map((t) => (
                  <button
                    key={t.id}
                    id={`tmpl-${t.id}`}
                    className={`${styles.templateBtn} ${activeTemplate.id === t.id ? styles.active : ''}`}
                    onClick={() => onTemplateChange(t)}
                    title={t.label}
                  >
                    {t.previewImg ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.previewImg} alt={t.label} className={styles.templateThumb} />
                    ) : (
                      <TemplateIcon cols={(t as any).cols} rows={Math.ceil((t as any).slots / (t as any).cols)} />
                    )}
                    <span className={styles.templateLabel}>{t.label}</span>
                  </button>
                ))}
              </div>
            </Section>

            {!isReviewMode && (
              <Section title="Timer Foto">
                <div className={styles.timerRow}>
                  {timerOptions.map((t) => (
                    <button
                      key={t}
                      id={`timer-${t}`}
                      className={`${styles.timerBtn} ${timer === t ? styles.active : ''}`}
                      onClick={() => onTimerChange(t as TimerOption)}
                    >
                      {t}s
                    </button>
                  ))}
                </div>
              </Section>
            )}
          </>
        )}

      </div>
    </aside>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionTitle}>{title}</div>
      {children}
    </div>
  );
}

function TemplateIcon({ cols, rows }: { cols: number; rows: number }) {
  const gapX = cols > 1 ? 3 : 0;
  const slotW = Math.max(8, Math.floor((40 - (cols - 1) * gapX) / cols));
  const gapY = rows > 1 ? 2 : 0;
  const slotH = Math.max(5, Math.floor((28 - (rows - 1) * gapY) / rows));
  return (
    <svg width="46" height="34" viewBox="0 0 46 34" aria-hidden style={{ display: 'block' }}>
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => (
          <rect
            key={`${r}-${c}`}
            x={3 + c * (slotW + gapX)}
            y={3 + r * (slotH + gapY)}
            width={slotW}
            height={slotH}
            rx="1.5"
            fill="currentColor"
          />
        ))
      )}
    </svg>
  );
}

// ─── Tab Icons (SVG) ──────────────────────────────────────────
function FaceTabIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  );
}
function FrameTabIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <rect x="7" y="7" width="10" height="10" rx="1" />
    </svg>
  );
}
function FilterTabIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a9 9 0 0 1 0 18v-18z" />
    </svg>
  );
}
function StickerTabIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3z"/>
      <path d="M15 3v6h6"/>
      <circle cx="10" cy="14" r="2"/>
    </svg>
  );
}
function TextTabIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 7 4 4 20 4 20 7" />
      <line x1="9" y1="20" x2="15" y2="20" />
      <line x1="12" y1="4" x2="12" y2="20" />
    </svg>
  );
}
function LayoutTabIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  );
}
