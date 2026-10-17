'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { PRESET_TEMPLATES, FRAMES, TEMPLATES } from '@/lib/config';
import styles from './page.module.css';

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const popularTemplates = [...PRESET_TEMPLATES].sort((a, b) => b.uses - a.uses).slice(0, 8);

  const partners = [
    {
      name: 'Polar Photobooth',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
          <circle cx="12" cy="13" r="3"/>
        </svg>
      ),
    },
    {
      name: 'Enzy Studio',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="m14.31 8 5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16 3.95 6.06M14.31 16H2.83M16.62 12l-5.74 9.94"/>
        </svg>
      ),
    },
    {
      name: 'Kalsa Studio',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2"/>
          <path d="M7 7h10M7 12h10M7 17h10"/>
        </svg>
      ),
    },
    {
      name: 'Wijana Studio',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="20" x="2" y="2" rx="2.18" ry="2.18"/>
          <line x1="7" x2="7" y1="2" y2="22"/>
          <line x1="17" x2="17" y1="2" y2="22"/>
          <line x1="2" x2="22" y1="12" y2="12"/>
          <line x1="2" x2="7" y1="7" y2="7"/>
          <line x1="2" x2="7" y1="17" y2="17"/>
          <line x1="17" x2="22" y1="17" y2="17"/>
          <line x1="17" x2="22" y1="7" y2="7"/>
        </svg>
      ),
    },
    {
      name: 'Sejiwa Booth',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        </svg>
      ),
    },
    {
      name: 'Graperan',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
      ),
    },
    {
      name: 'Giftart Studio',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 12 20 22 4 22 4 12"/>
          <rect width="20" height="5" x="2" y="7"/>
          <line x1="12" x2="12" y1="22" y2="7"/>
          <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
          <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
        </svg>
      ),
    },
    {
      name: 'Jepret Cambox',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      ),
    },
    {
      name: 'RuangGaya Studio',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14"/>
        </svg>
      ),
    },
  ];

  const faqs = [
    {
      q: 'Apakah RuangGaya benar-benar gratis?',
      a: 'Ya, 100% gratis. Kamu dapat menggunakan semua template, filter foto, filter wajah AR, stiker, dan mengunduh photostrip resolusi tinggi tanpa biaya atau langganan.',
    },
    {
      q: 'Apakah perlu install aplikasi tambahan?',
      a: 'Tidak perlu. RuangGaya berjalan langsung di browser modern (Chrome, Safari, Edge) baik di laptop, komputer, tablet, maupun smartphone.',
    },
    {
      q: 'Bagaimana cara menyimpan hasil foto ke HP?',
      a: 'Setelah selesai sesi foto, klik "Scan QR". Cukup arahkan kamera smartphone ke QR code di layar untuk langsung mengunduh hasil fotomu.',
    },
    {
      q: 'Apakah bisa membuat animasi GIF bergerak?',
      a: 'Ya, RuangGaya secara otomatis merekam setiap pose saat sesi foto dan menyatukannya menjadi animasi GIF bergerak yang siap dibagikan ke media sosial.',
    },
  ];

  return (
    <div className={styles.pageWrapper}>
      <Navbar />

      {/* ═══ 1. HERO SECTION ═══ */}
      <section className={styles.heroSection}>
        <div className={styles.heroGrid}>
          {/* Left Text */}
          <div className={styles.heroText}>
            <div className={styles.badgePill}>
              <span className={styles.badgeIcon}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                  <circle cx="12" cy="13" r="3"/>
                </svg>
              </span>
              <span>Photobooth Digital Modern</span>
            </div>

            <h1 className={styles.heroTitle}>
              Abadikan Momen
              <span className={styles.highlightGradient}>
                Bareng RuangGaya.
              </span>
            </h1>

            <p className={styles.heroDesc}>
              Photobooth digital praktis langsung dari browser. Pilih template estetik, pasang pose terbaik, hias stiker, dan unduh photostrip beresolusi tinggi secara instan.
            </p>

            <div className={styles.heroActions}>
              <Link href="/studio" className="neo-btn-primary" id="hero-btn-coba">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                  <circle cx="12" cy="13" r="3"/>
                </svg>
                <span>Mulai Foto Sekarang</span>
              </Link>

              <Link href="/template-selection" className="neo-btn-yellow" id="hero-btn-template">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1.5"/>
                  <rect x="14" y="3" width="7" height="7" rx="1.5"/>
                  <rect x="14" y="14" width="7" height="7" rx="1.5"/>
                  <rect x="3" y="14" width="7" height="7" rx="1.5"/>
                </svg>
                <span>Pilih Template</span>
              </Link>
            </div>

            {/* Stats Box */}
            <div className={styles.statsRow}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>200K+</div>
                <div className={styles.statLabel}>Total Pengguna</div>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.statItem}>
                <div className={styles.statNumber}>100K+</div>
                <div className={styles.statLabel}>Template Dipakai</div>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.statItem}>
                <div className={styles.statNumber} style={{ color: 'var(--rg-purple)' }}>
                  4.9
                </div>
                <div className={styles.statLabel}>Rating Kepuasan</div>
              </div>
            </div>
          </div>

          {/* Right Visual Graphic */}
          <div className={styles.heroVisual}>
            <div className={styles.visualCardWrapper}>
              {/* Floating Decorative Badges with clean SVGs */}
              <div className={styles.floatingBadge1}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--rg-purple)' }}>
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                  <circle cx="12" cy="13" r="3"/>
                </svg>
                <span>Multi-Pose Studio</span>
              </div>
              <div className={styles.floatingBadge2}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--rg-yellow)' }}>
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
                <span>Auto-Shutter HD</span>
              </div>

              {/* Main Photo Strip Mockup */}
              <div className={styles.mainPhotoStripMock}>
                <div className={styles.stripMockInner}>
                  <div className={styles.mockSlot}>
                    <div className={styles.mockSlotBadge}>01</div>
                    <div className={styles.mockSlotInner}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                        <circle cx="9" cy="9" r="2"/>
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                      </svg>
                    </div>
                  </div>

                  <div className={styles.mockSlot}>
                    <div className={styles.mockSlotBadge}>02</div>
                    <div className={styles.mockSlotInner}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                        <circle cx="9" cy="9" r="2"/>
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                      </svg>
                    </div>
                  </div>

                  <div className={styles.mockSlot}>
                    <div className={styles.mockSlotBadge}>03</div>
                    <div className={styles.mockSlotInner}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                        <circle cx="9" cy="9" r="2"/>
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                      </svg>
                    </div>
                  </div>

                  <div className={styles.mockFooterText}>
                    <span>RuangGaya Photobooth • 2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 2. STUDIO PARTNER MARQUEE ═══ */}
      <section className={styles.marqueeSection} aria-label="Studio Rekanan">
        <div className="animate-marquee">
          {[...partners, ...partners, ...partners].map((partner, idx) => (
            <div key={idx} className={styles.marqueeCard}>
              <span className={styles.marqueeCardIcon}>{partner.icon}</span>
              <span className={styles.marqueeCardTitle}>{partner.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 3. TEMPLATE SHOWCASE SECTION ═══ */}
      <section className={styles.templateSection} id="templates">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionPretitle}>Katalog Desain</span>
          <h2 className={styles.sectionTitle}>Pilih Template Photobooth</h2>
          <p className={styles.sectionSubtitle}>
            Jelajahi berbagai pilihan layout dan tema favorit — pilih desain, sesuaikan gaya, dan mulai sesi foto.
          </p>
        </div>

        <div className={styles.templateGrid}>
          {popularTemplates.map((item) => {
            const frameObj = FRAMES.find((f) => f.id === item.frameId);
            const tmplObj = TEMPLATES.find((t) => t.id === item.templateId);
            const cols = tmplObj?.cols || 1;
            const totalSlots = tmplObj?.slots || 3;

            return (
              <Link
                key={item.id}
                href={`/studio?template=${item.templateId}&frame=${item.frameId}`}
                className={styles.templateCard}
              >
                {/* Visual Preview */}
                <div
                  className={styles.templatePreviewArea}
                  style={
                    frameObj?.bgImage
                      ? {
                          backgroundImage: `url(${frameObj.bgImage})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }
                      : { background: frameObj?.bgColor || '#f8fafc' }
                  }
                >
                  {/* Badges */}
                  <div className={styles.templateTagRow}>
                    <span className={styles.tagPill}>Gratis</span>
                    <span className={styles.tagPillAdFree}>Tanpa Iklan</span>
                  </div>

                  <div className={styles.usesTag}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                    </svg>
                    <span>{item.uses.toLocaleString()} sesi</span>
                  </div>

                  {/* Photostrip Mini Representation */}
                  <div
                    className={styles.templateMiniStrip}
                    style={{
                      background: 'rgba(255,255,255,0.85)',
                      backdropFilter: 'blur(6px)',
                      display: cols > 1 ? 'grid' : 'flex',
                      gridTemplateColumns: cols > 1 ? `repeat(${cols}, 1fr)` : undefined,
                      flexDirection: cols === 1 ? 'column' : undefined,
                      gap: 4,
                      padding: 6,
                    }}
                  >
                    {Array.from({ length: totalSlots }).map((_, idx) => (
                      <div key={idx} className={styles.templateSlotBox}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
                          <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                          <circle cx="9" cy="9" r="2"/>
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Body */}
                <div className={styles.templateCardBody}>
                  <h3 className={styles.templateCardTitle}>{item.title}</h3>
                  <div className={styles.templateCardMeta}>
                    <span>{item.author}</span>
                    <span>{totalSlots} slot foto</span>
                  </div>

                  <div className={styles.templateActionBtn}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                      <circle cx="12" cy="13" r="3"/>
                    </svg>
                    <span>Gunakan Template</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: 36 }}>
          <Link href="/template-selection" className="neo-btn-primary" style={{ padding: '11px 28px' }}>
            <span>Lihat Semua Template ({PRESET_TEMPLATES.length}+)</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* ═══ 4. FITUR UNGGULAN SECTION ═══ */}
      <section className={styles.featuresSection} id="features">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionPretitle}>Kemampuan Studio</span>
          <h2 className={styles.sectionTitle}>Fitur Lengkap Sesi Photobooth</h2>
          <p className={styles.sectionSubtitle}>
            Semua kebutuhan photobooth tersedia dalam satu layar yang rapi, intuitif, dan responsif.
          </p>
        </div>

        <div className={styles.featureGrid}>
          {/* Feature 1 */}
          <div className={styles.featureCard}>
            <div className={styles.featureIconWrapper} style={{ background: '#fef3c7', color: '#b45309' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Multi-Timer &amp; Auto-Shoot</h3>
            <p className={styles.featureDesc}>
              Pengaturan jeda hitung mundur 3s, 5s, atau 10s. Mode Auto-Shoot otomatis menjepret setiap pose berurutan tanpa perlu menekan tombol berulang.
            </p>
          </div>

          {/* Feature 2 */}
          <div className={styles.featureCard}>
            <div className={styles.featureIconWrapper} style={{ background: '#ede9fe', color: '#6d28d9' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                <line x1="9" x2="9.01" y1="9" y2="9"/>
                <line x1="15" x2="15.01" y1="9" y2="9"/>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>AR Face Filter &amp; Efek</h3>
            <p className={styles.featureDesc}>
              Pelacakan wajah langsung dengan efek aksesoris: kacamata, mahkota, filter telinga, hingga pencahayaan studio yang menyesuaikan gerakanmu.
            </p>
          </div>

          {/* Feature 3 */}
          <div className={styles.featureCard}>
            <div className={styles.featureIconWrapper} style={{ background: '#ffedd5', color: '#c2410c' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2"/>
                <path d="M3 9h18M9 21V9"/>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Koleksi Layout &amp; Frame</h3>
            <p className={styles.featureDesc}>
              Format strip vertikal (2x1, 3x1, 4x1) dan grid modern (2x2, 2x3) dengan tema newspaper vintage, retro Y2K, musik, hingga warna minimalis.
            </p>
          </div>

          {/* Feature 4 */}
          <div className={styles.featureCard}>
            <div className={styles.featureIconWrapper} style={{ background: '#dcfce7', color: '#15803d' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 7 4 4 20 4 20 7"/>
                <line x1="9" x2="15" y1="20" y2="20"/>
                <line x1="12" x2="12" y1="4" y2="20"/>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Stiker &amp; Tipografi Kustom</h3>
            <p className={styles.featureDesc}>
              Hias photostrip dengan stiker bebas geser dan rotasi, serta tambahkan catatan tanggal atau pesan kenangan dengan berbagai pilihan font.
            </p>
          </div>

          {/* Feature 5 */}
          <div className={styles.featureCard}>
            <div className={styles.featureIconWrapper} style={{ background: '#e0f2fe', color: '#0369a1' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" x2="12" y1="15" y2="3"/>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Unduh Cetak HD &amp; GIF</h3>
            <p className={styles.featureDesc}>
              Simpan photostrip dengan ketajaman tinggi untuk dicetak langsung, atau unduh rekaman animasi GIF bergerak untuk diunggah ke media sosial.
            </p>
          </div>

          {/* Feature 6 */}
          <div className={styles.featureCard}>
            <div className={styles.featureIconWrapper} style={{ background: '#fce7f3', color: '#be185d' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/>
                <path d="M12 18h.01"/>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Scan QR Langsung ke Smartphone</h3>
            <p className={styles.featureDesc}>
              Simpan hasil foto tanpa kabel atau aplikasi perantara. Cukup arahkan kamera smartphone ke QR code di layar untuk download instan.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 5. HOW IT WORKS ═══ */}
      <section className={styles.howSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionPretitle}>Panduan Sederhana</span>
          <h2 className={styles.sectionTitle}>3 Langkah Mudah</h2>
          <p className={styles.sectionSubtitle}>
            Pengalaman photobooth digital yang praktis tanpa konfigurasi rumit.
          </p>
        </div>

        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>01</div>
            <h3 className={styles.stepTitle}>Pilih Template</h3>
            <p className={styles.stepDesc}>
              Tentukan format layout dan background yang sesuai dengan tema atau suasana yang kamu inginkan.
            </p>
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>02</div>
            <h3 className={styles.stepTitle}>Pose &amp; Tangkap</h3>
            <p className={styles.stepDesc}>
              Gunakan kamera, pilih filter warna atau efek wajah, dan biarkan timer menghitung mundur secara presisi.
            </p>
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>03</div>
            <h3 className={styles.stepTitle}>Hias &amp; Unduh</h3>
            <p className={styles.stepDesc}>
              Sempurnakan dengan stiker dan teks kenangan. Simpan file JPG resolusi tinggi atau pindai QR code langsung dari HP.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 6. FAQ SECTION ═══ */}
      <section className={styles.faqSection} id="faq">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionPretitle}>Tanya Jawab</span>
          <h2 className={styles.sectionTitle}>Pertanyaan Umum</h2>
          <p className={styles.sectionSubtitle}>
            Informasi seputar penggunaan dan fitur di RuangGaya.
          </p>
        </div>

        <div>
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className={styles.faqItem}>
                <button
                  className={styles.faqQuestion}
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      flexShrink: 0,
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {isOpen && <div className={styles.faqAnswer}>{faq.a}</div>}
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══ 7. BOTTOM CTA BANNER ═══ */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaBox}>
          <h2 className={styles.ctaTitle}>
            Mulai Sesi Photobooth Sekarang
          </h2>
          <p className={styles.ctaDesc}>
            Gratis tanpa instalasi aplikasi. Ajak teman, rekan, atau pasanganmu untuk mengabadikan momen berharga langsung dari browser.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/studio" className="neo-btn-yellow" style={{ padding: '13px 32px', fontSize: '1rem', background: '#ffffff', color: 'var(--rg-dark)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                <circle cx="12" cy="13" r="3"/>
              </svg>
              <span>Buka Studio Foto</span>
            </Link>
            <Link href="/template-selection" className="neo-btn-primary" style={{ padding: '13px 28px', fontSize: '0.96rem', background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
              <span>Jelajahi Template</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
