'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { PRESET_TEMPLATES, FRAMES, TEMPLATES } from '@/lib/config';
import styles from './page.module.css';

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const popularTemplates = [...PRESET_TEMPLATES].sort((a, b) => b.uses - a.uses).slice(0, 10);

  const partners = [
    { name: 'Polar Photobooth', icon: '📸' },
    { name: 'Enzy Studio', icon: '✨' },
    { name: 'Kalsa Studio', icon: '🐱' },
    { name: 'Wijana Studio', icon: '🎞️' },
    { name: 'Sejiwa Booth', icon: '💖' },
    { name: 'Graperan', icon: '⚡' },
    { name: 'Giftart Studio', icon: '🎁' },
    { name: 'Jepret Cambox', icon: '🎯' },
    { name: 'RuangGaya Studio', icon: '🌟' },
  ];

  const faqs = [
    {
      q: 'Apakah RuangGaya benar-benar gratis?',
      a: 'Ya, 100% gratis! Kamu bisa menggunakan semua template, filter foto, filter wajah AR, stiker, dan mengunduh photostrip resolusi tinggi tanpa biaya atau biaya langganan.',
    },
    {
      q: 'Apakah perlu install aplikasi tambahan?',
      a: 'Sama sekali tidak! RuangGaya berjalan langsung di browser modern (Chrome, Safari, Edge) baik di laptop, komputer, tablet, maupun smartphone.',
    },
    {
      q: 'Bagaimana cara menyimpan hasil foto ke HP?',
      a: 'Setelah selesai foto dan menghias photostrip, kamu bisa langsung klik "Scan QR". Cukup scan QR code tersebut dengan kamera HP kamu dan foto akan langsung terbuka untuk disimpan!',
    },
    {
      q: 'Apakah bisa membuat animasi GIF bergerak?',
      a: 'Bisa banget! RuangGaya secara otomatis merekam klip pendek saat kamu berpose dan menyatukannya menjadi animasi GIF yang estetik dan seru.',
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
              <span className={styles.badgeSparkle}>✨</span>
              <span>Digital Photobooth Made Simple</span>
            </div>

            <h1 className={`${styles.heroTitle} text-pop-3d-lg`}>
              Abadikan Momen
              <span className={`${styles.highlightYellow} text-pop-3d-lg`}>
                Bareng RuangGaya!
              </span>
            </h1>

            <p className={styles.heroDesc}>
              Abadikan momen seru bersama teman dengan photobooth digital yang keren, praktis, dan modern langsung dari browsermu.
            </p>

            <div className={styles.heroActions}>
              <Link href="/studio" className="neo-btn-primary" id="hero-btn-coba">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                  <circle cx="12" cy="13" r="3"/>
                </svg>
                <span>Coba Sekarang</span>
              </Link>

              <Link href="/template-selection" className="neo-btn-yellow" id="hero-btn-template">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
                <span>Pilih Template</span>
              </Link>
            </div>

            {/* Stats Box */}
            <div className={styles.statsRow}>
              <div className={styles.statItem}>
                <div className={`${styles.statNumber} text-stat-pop`}>200K</div>
                <div className={styles.statLabel}>Total pengguna</div>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.statItem}>
                <div className={`${styles.statNumber} text-stat-pop`}>100k++</div>
                <div className={styles.statLabel}>Template terpakai</div>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.statItem}>
                <div className={`${styles.statNumber} text-stat-pop`} style={{ color: 'var(--rg-purple)' }}>
                  5 <span style={{ color: 'var(--rg-yellow)' }}>★</span>
                </div>
                <div className={styles.statLabel}>Rating pengguna</div>
              </div>
            </div>
          </div>

          {/* Right Visual Graphic */}
          <div className={styles.heroVisual}>
            <div className={styles.visualCardWrapper}>
              {/* Floating Decorative Badges */}
              <div className={styles.floatingBadge1}>
                <span>📸</span>
                <span>Pose Seru!</span>
              </div>
              <div className={styles.floatingBadge2}>
                <span>✨</span>
                <span>Auto-Flash HD</span>
              </div>

              {/* Main Photo Strip Mockup */}
              <div className={styles.mainPhotoStripMock}>
                <div className={styles.stripMockInner}>
                  <div className={styles.mockSlot}>
                    <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '2px 8px', borderRadius: 9999, fontSize: '0.7rem', fontWeight: 800 }}>
                      #1
                    </div>
                    <span style={{ fontSize: '2.5rem' }}>🥳</span>
                  </div>

                  <div className={styles.mockSlot}>
                    <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '2px 8px', borderRadius: 9999, fontSize: '0.7rem', fontWeight: 800 }}>
                      #2
                    </div>
                    <span style={{ fontSize: '2.5rem' }}>😎</span>
                  </div>

                  <div className={styles.mockSlot}>
                    <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '2px 8px', borderRadius: 9999, fontSize: '0.7rem', fontWeight: 800 }}>
                      #3
                    </div>
                    <span style={{ fontSize: '2.5rem' }}>🫶</span>
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
          <span className={styles.sectionPretitle}>Katalog Populer</span>
          <h2 className={styles.sectionTitle}>Pilih Template Photobooth</h2>
          <p className={styles.sectionSubtitle}>
            Jelajahi template photostrip terfavorit — pilih, foto, dan bagikan hasilnya.
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
                      : { background: frameObj?.bgColor || '#f0edf5' }
                  }
                >
                  {/* Badges */}
                  <div className={styles.templateTagRow}>
                    <span className={styles.tagPill}>✨ Free</span>
                    <span className={styles.tagPillAdFree}>Ad-free</span>
                  </div>

                  <div className={styles.usesTag}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                    </svg>
                    <span>{item.uses.toLocaleString()} uses</span>
                  </div>

                  {/* Photostrip Mini Representation */}
                  <div
                    className={styles.templateMiniStrip}
                    style={{
                      background: 'rgba(255,255,255,0.78)',
                      backdropFilter: 'blur(4px)',
                      display: cols > 1 ? 'grid' : 'flex',
                      gridTemplateColumns: cols > 1 ? `repeat(${cols}, 1fr)` : undefined,
                      flexDirection: cols === 1 ? 'column' : undefined,
                      gap: 4,
                      padding: 6,
                    }}
                  >
                    {Array.from({ length: totalSlots }).map((_, idx) => (
                      <div key={idx} className={styles.templateSlotBox}>
                        <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>📷</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Body */}
                <div className={styles.templateCardBody}>
                  <h3 className={styles.templateCardTitle}>{item.title}</h3>
                  <div className={styles.templateCardMeta}>
                    <span>Oleh {item.author}</span>
                    <span>{totalSlots} foto</span>
                  </div>

                  <button className={styles.templateActionBtn}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="4"/>
                      <path d="M20 20H4a2 2 0 01-2-2V8a2 2 0 012-2h2l2-3h8l2 3h2a2 2 0 012 2v10a2 2 0 01-2 2z"/>
                    </svg>
                    <span>Mulai Pakai</span>
                  </button>
                </div>
              </Link>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Link href="/template-selection" className="neo-btn-primary" style={{ padding: '12px 32px' }}>
            <span>Lihat Semua Template ({PRESET_TEMPLATES.length}+)</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* ═══ 4. FITUR UNGGULAN SECTION ═══ */}
      <section className={styles.featuresSection} id="features">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionPretitle}>Fitur Unggulan</span>
          <h2 className={styles.sectionTitle}>Semua Yang Kamu Butuhkan</h2>
          <p className={styles.sectionSubtitle}>
            Didesain khusus untuk memberikan pengalaman photobooth digital yang seru, mudah, dan berkualitas tinggi.
          </p>
        </div>

        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIconWrapper} style={{ background: '#fef08a' }}>
              <span style={{ fontSize: '1.8rem' }}>⏱️</span>
            </div>
            <h3 className={styles.featureTitle}>Multi-Timer &amp; Auto-Shoot</h3>
            <p className={styles.featureDesc}>
              Bebas pilih countdown 3s, 5s, atau 10s. Tersedia mode Auto-Shoot yang otomatis menjepret semua slot tanpa perlu sentuh layar berkali-kali!
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIconWrapper} style={{ background: '#e9d5ff' }}>
              <span style={{ fontSize: '1.8rem' }}>🎭</span>
            </div>
            <h3 className={styles.featureTitle}>AI AR Face Filter</h3>
            <p className={styles.featureDesc}>
              Filter wajah pintar yang melacak ekspresimu secara langsung: telinga kucing, mahkota emas, kacamata gaya, glitter, hingga mode beauty.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIconWrapper} style={{ background: '#fed7aa' }}>
              <span style={{ fontSize: '1.8rem' }}>🎨</span>
            </div>
            <h3 className={styles.featureTitle}>Koleksi Frame Estetik</h3>
            <p className={styles.featureDesc}>
              Pilihan layout Strip (2x1, 3x1, 4x1) dan Grid (2x2, 2x3) dengan background koran vintage, Y2K retro, Spotify playlist, atau warna pastel.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIconWrapper} style={{ background: '#bbf7d0' }}>
              <span style={{ fontSize: '1.8rem' }}>✨</span>
            </div>
            <h3 className={styles.featureTitle}>Stiker &amp; Custom Teks</h3>
            <p className={styles.featureDesc}>
              Dekorasi photostrip dengan stiker favoritmu, ubah posisi dan rotasi, serta tuliskan tanggal atau pesan kenangan dengan font pilihan.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIconWrapper} style={{ background: '#bae6fd' }}>
              <span style={{ fontSize: '1.8rem' }}>🎞️</span>
            </div>
            <h3 className={styles.featureTitle}>Unduh HD &amp; Animasi GIF</h3>
            <p className={styles.featureDesc}>
              Simpan photostrip dalam resolusi tinggi yang jernih untuk dicetak, atau unduh animasi GIF bergerak seru untuk diunggah ke Instagram &amp; TikTok.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIconWrapper} style={{ background: '#fbcfe8' }}>
              <span style={{ fontSize: '1.8rem' }}>📲</span>
            </div>
            <h3 className={styles.featureTitle}>Scan QR Langsung ke HP</h3>
            <p className={styles.featureDesc}>
              Tidak perlu kabel atau kirim file! Cukup arahkan kamera smartphone ke QR code di layar untuk langsung download fotomu dalam sekejap.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 5. HOW IT WORKS ═══ */}
      <section className={styles.howSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionPretitle}>Langkah Mudah</span>
          <h2 className={styles.sectionTitle}>3 Langkah Bikin Kenangan</h2>
          <p className={styles.sectionSubtitle}>
            Tanpa ribet, langsung siap dalam hitungan detik.
          </p>
        </div>

        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>1</div>
            <h3 className={styles.stepTitle}>Pilih Template</h3>
            <p className={styles.stepDesc}>
              Buka katalog dan pilih format layout serta background favoritmu yang sesuai dengan mood hari ini.
            </p>
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>2</div>
            <h3 className={styles.stepTitle}>Pose &amp; Jepret</h3>
            <p className={styles.stepDesc}>
              Aktifkan kamera, pilih filter warna atau AR face filter, pasang pose terbaikmu, dan biarkan timer menghitung mundur.
            </p>
          </div>

          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>3</div>
            <h3 className={styles.stepTitle}>Hias &amp; Bagikan</h3>
            <p className={styles.stepDesc}>
              Tambahkan stiker lucu dan teks kenangan. Unduh file JPG atau scan QR code langsung dari smartphonemu!
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 6. FAQ SECTION ═══ */}
      <section className={styles.faqSection} id="faq">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionPretitle}>Bantuan &amp; Jawaban</span>
          <h2 className={styles.sectionTitle}>Pertanyaan Umum</h2>
          <p className={styles.sectionSubtitle}>
            Segala hal yang sering ditanyakan seputar RuangGaya.
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
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
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
          <h2 className={`${styles.ctaTitle} text-pop-3d`}>
            Siap Bikin Kenangan Bareng?
          </h2>
          <p className={styles.ctaDesc}>
            Gratis selamanya, tanpa perlu install aplikasi apapun. Ajak teman atau pasanganmu dan mulai foto sekarang juga!
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/studio" className="neo-btn-primary" style={{ padding: '16px 36px', fontSize: '1.15rem' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                <circle cx="12" cy="13" r="3"/>
              </svg>
              <span>Mulai Foto Sekarang</span>
            </Link>
            <Link href="/template-selection" className="neo-btn-white" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
              <span>Jelajahi Template</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
