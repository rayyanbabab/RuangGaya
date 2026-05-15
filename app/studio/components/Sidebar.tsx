'use client';
import { useState, useEffect } from 'react';
import { Template, Frame, FilterType, TimerOption } from '@/lib/config';
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
  timer: TimerOption;
  timerOptions: readonly number[];
  autoShoot: boolean;
  isReviewMode: boolean;
  onTemplateChange: (t: Template) => void;
  onFrameChange: (f: Frame) => void;
  onFilterChange: (f: FilterType) => void;
  onStripTextChange: (s: string) => void;
  onStripTextColorChange: (c: string) => void;
  onTimerChange: (t: TimerOption) => void;
  onAutoShootToggle: () => void;
  addSticker: (src: string) => void;
}

// Tab definition
const TABS = [
  { id: 'frame', label: 'Background', icon: <FrameTabIcon /> },
  { id: 'filter', label: 'Filter', icon: <FilterTabIcon /> },
  { id: 'sticker', label: 'Stiker', icon: <StickerTabIcon /> },
  { id: 'text', label: 'Teks', icon: <TextTabIcon /> },
  { id: 'tmpl', label: 'Layout', icon: <LayoutTabIcon /> },
] as const;
type TabId = (typeof TABS)[number]['id'];

export default function Sidebar({
  templates, frames, filters,
  activeTemplate, activeFrame, activeFilter,
  stripText, stripTextColor, timer, timerOptions, isReviewMode,
  onTemplateChange, onFrameChange, onFilterChange,
  onStripTextChange, onStripTextColorChange, onTimerChange, addSticker,
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<TabId>('frame');
  const [availableStickers, setAvailableStickers] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/stickers')
      .then(res => res.json())
      .then(data => {
        if (data.stickers) setAvailableStickers(data.stickers);
      })
      .catch(err => console.error('Failed to load stickers', err));
  }, []);

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
            <div className={styles.frameGrid}>
              {frames.map((f) => (
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
            <div className={styles.filterGrid}>
              {filters.map((f) => (
                <button
                  key={f}
                  id={`filter-${f.toLowerCase().replace(/[^a-z]/g, '')}`}
                  className={`${styles.filterBtn} ${activeFilter === f ? styles.active : ''}`}
                  onClick={() => onFilterChange(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </Section>
        )}

        {/* OVERLAY / STIKER */}
        {activeTab === 'sticker' && (
          <Section title="Pilih Stiker">
            <div className={styles.frameGrid}>
              {availableStickers.length === 0 && (
                <p style={{ gridColumn: '1 / -1', textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>
                  Memuat stiker...<br />
                  <span style={{ fontSize: '0.75rem' }}>(Taruh file gambar di folder public/overlays/)</span>
                </p>
              )}
              {availableStickers.map((src, i) => {
                const name = src.split('/').pop()?.split('.')[0] || `Stiker ${i + 1}`;
                return (
                  <button
                    key={src}
                    className={styles.frameBtn}
                    onClick={() => addSticker(src)}
                    title={name}
                  >
                    <div className={styles.frameOverlayThumb} style={{ background: '#FFF0F5' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={name} className={styles.frameOverlayImg} />
                    </div>
                    <span className={styles.frameLabel}>{name}</span>
                  </button>
                );
              })}
            </div>
            <p className={styles.hint} style={{ marginTop: '1rem', textAlign: 'center' }}>Klik stiker untuk menambahkannya ke foto. Kamu bisa menggeser dan memutarnya!</p>
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

            <div className={styles.bgColorPickerWrap} style={{ marginTop: '16px' }}>
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
            <p className={styles.hint}>Muncul di bagian bawah strip foto</p>
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
  const slotW = cols === 1 ? 40 : 17;
  const slotH = rows <= 2 ? Math.floor(28 / rows) - 2 : Math.floor(28 / rows) - 1;
  const gapX = cols === 1 ? 0 : 4;
  const gapY = rows === 1 ? 0 : 3;
  return (
    <svg width="46" height="34" viewBox="0 0 46 34" aria-hidden style={{ display: 'block' }}>
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => (
          <rect
            key={`${r}-${c}`}
            x={2 + c * (slotW + gapX)}
            y={3 + r * (slotH + gapY)}
            width={slotW}
            height={slotH}
            rx="2"
            fill="currentColor"
          />
        ))
      )}
    </svg>
  );
}

// ─── Tab Icons (SVG) ──────────────────────────────────────────
function FrameTabIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <rect x="7" y="7" width="10" height="10" rx="1" />
    </svg>
  );
}
function FilterTabIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M1.05 12H3m18 0h1.95M12 1.05V3m0 18v1.95M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}
function StickerTabIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10A10 10 0 0 1 2 12C2 6.48 6.48 2 12 2z" />
      <path d="M12 8v4m0 4h.01" />
    </svg>
  );
}
function TextTabIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="4 7 4 4 20 4 20 7" />
      <line x1="9" y1="20" x2="15" y2="20" />
      <line x1="12" y1="4" x2="12" y2="20" />
    </svg>
  );
}
function LayoutTabIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}
