import Link from 'next/link';
import styles from './page.module.css';
import SocialModal from './components/SocialModal';

export default function HomePage() {
  return (
    <main className={styles.main}>
      {/* Decorative Bubbles */}
      <div className="rg-bubble rg-bubble-1" />
      <div className="rg-bubble rg-bubble-2" />
      <div className="rg-bubble rg-bubble-3" />
      <div className="rg-bubble rg-bubble-4" />
      <div className="rg-bubble rg-bubble-5" />

      {/* ═══ Header ═══ */}
      <header className={styles.header}>
        <span className={styles.logo}>RuangGaya</span>
        <nav className={styles.nav}>
          <SocialModal />
          <Link href="/studio" className="btn-secondary" style={{ padding: '8px 20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><path d="M20 20H4a2 2 0 01-2-2V8a2 2 0 012-2h2l2-3h8l2 3h2a2 2 0 012 2v10a2 2 0 01-2 2z"/></svg>
            Buka Studio
          </Link>
        </nav>
      </header>

      {/* ═══ Hero ═══ */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.badge}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--rg-accent)" stroke="none"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>
            Free &amp; No Sign-up Needed
          </p>
          <h1 className={styles.heroTitle}>
            Foto bareng,<br />
            <span className={styles.highlight}>kenangan abadi</span>
          </h1>
          <p className={styles.heroDesc}>
            Buat photo strip cantik langsung dari browser kamu. Pilih frame,
            jepret momen terbaik, dan simpan hasilnya dalam hitungan detik!
          </p>
          <div className={styles.heroActions}>
            <Link href="/studio" className="btn-primary" id="cta-mulai-foto">
              <span>Mulai Foto</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <p className={styles.heroCta}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--rg-muted)" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              Tidak perlu install apapun
            </p>
          </div>
        </div>

        <div className={styles.heroIllustration}>
          <div className="animate-float">
            <CameraIllustration />
          </div>
        </div>
      </section>

      {/* ═══ Feature Cards ═══ */}
      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>Semua yang kamu butuhkan</h2>
        <div className={styles.featureGrid}>
          <FeatureCard
            icon={<FrameIcon />}
            title="Pilih Frame Cantik"
            desc="Koleksi frame dengan berbagai warna & latar belakang. Bisa diganti kapan saja!"
            color="#fde8f0"
          />
          <FeatureCard
            icon={<CameraIcon />}
            title="Jepret & Ekspresi"
            desc="Timer otomatis, auto-shoot, dan filter foto real-time biar hasil makin kece!"
            color="#f4e8ff"
          />
          <FeatureCard
            icon={<DownloadIcon />}
            title="Simpan & Bagikan"
            desc="Download photo strip kualitas tinggi. Langsung share ke sosmed!"
            color="#e8f5ff"
          />
        </div>
      </section>

      {/* ═══ CTA Banner ═══ */}
      <section className={styles.ctaBanner}>
        <div className={styles.ctaBannerContent}>
          <h2>Siap bikin kenangan?</h2>
          <p>Gratis selamanya, langsung dari browser kamu</p>
          <Link href="/studio" className="btn-primary" id="cta-bottom" style={{ marginTop: '16px' }}>
            <span>Mulai Foto Sekarang</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </section>

      {/* ═══ Footer ═══ */}
      <footer className={styles.footer}>
        <span className={styles.footerLogo}>RuangGaya</span>
        <span className={styles.footerDivider}>·</span>
        <span className={styles.footerCredit}>Dibuat untuk semua momen indah</span>
      </footer>
    </main>
  );
}

// ─── Feature Card ─────────────────────────────────────────────
function FeatureCard({ icon, title, desc, color }: { icon: React.ReactNode; title: string; desc: string; color: string }) {
  return (
    <div className="rg-card" style={{ textAlign: 'center' }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1.05rem', marginBottom: 8, color: 'var(--rg-dark)' }}>{title}</h3>
      <p style={{ fontSize: '0.88rem', color: 'var(--rg-muted)', lineHeight: 1.6 }}>{desc}</p>
    </div>
  );
}

function FrameIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4537E" strokeWidth="1.8" strokeLinecap="round">
      <rect x="3" y="3" width="18" height="18" rx="3"/>
      <rect x="7" y="7" width="10" height="10" rx="1"/>
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9B59B6" strokeWidth="1.8" strokeLinecap="round">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2980B9" strokeWidth="1.8" strokeLinecap="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}

// ─── Camera SVG Illustration ─────────────────────────────────
function CameraIllustration() {
  return (
    <svg width="320" height="280" viewBox="0 0 320 280" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Ilustrasi kamera photobooth">
      <rect x="40" y="80" width="240" height="160" rx="24" fill="#F4C0D1" />
      <rect x="50" y="90" width="220" height="140" rx="18" fill="#FBEAF0" />
      <circle cx="160" cy="165" r="56" fill="#D4537E" opacity="0.25" />
      <circle cx="160" cy="165" r="46" fill="#D4537E" opacity="0.35" />
      <circle cx="160" cy="165" r="36" fill="#D4537E" />
      <circle cx="160" cy="165" r="26" fill="#F4C0D1" />
      <circle cx="160" cy="165" r="16" fill="#993556" />
      <circle cx="152" cy="157" r="5" fill="white" opacity="0.6" />
      <rect x="120" y="60" width="80" height="28" rx="10" fill="#ED93B1" />
      <rect x="130" y="66" width="60" height="16" rx="7" fill="#F4C0D1" />
      <rect x="260" y="68" width="22" height="14" rx="5" fill="#FFD6E8" />
      <circle cx="268" cy="100" r="12" fill="#D4537E" />
      <circle cx="268" cy="100" r="7" fill="#993556" />
      <rect x="110" y="228" width="100" height="50" rx="6" fill="white" stroke="#F4C0D1" strokeWidth="2" />
      <rect x="118" y="236" width="30" height="22" rx="3" fill="#FDE8F0" />
      <rect x="154" y="236" width="30" height="22" rx="3" fill="#FDE8F0" />
      <line x1="118" y1="265" x2="182" y2="265" stroke="#F4C0D1" strokeWidth="1.5" />
      <line x1="118" y1="270" x2="160" y2="270" stroke="#F4C0D1" strokeWidth="1.5" />
      {/* Sparkle SVG shapes — no emoji */}
      <polygon points="38,52 40,58 46,58 41,62 43,68 38,64 33,68 35,62 30,58 36,58" fill="#ED93B1" opacity="0.8"/>
      <polygon points="278,44 279,48 283,48 280,50 281,54 278,52 275,54 276,50 273,48 277,48" fill="#D4537E" opacity="0.8"/>
      <polygon points="148,36 149,40 153,40 150,42 151,46 148,44 145,46 146,42 143,40 147,40" fill="#D4537E" opacity="0.6"/>
    </svg>
  );
}
