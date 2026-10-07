import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Brand Info */}
          <div className={styles.brandCol}>
            <Link href="/" className={styles.brand}>
              <div className={styles.logoIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                  <circle cx="12" cy="13" r="3"/>
                </svg>
              </div>
              <span>RuangGaya</span>
            </Link>
            <p className={styles.desc}>
              Platform photobooth digital yang praktis, estetik, dan modern untuk abadikan momen seru bersama teman &amp; keluarga secara instan.
            </p>
            <div className={styles.badgePill}>
              <span>⚡ 100% Bebas Pasang Aplikasi</span>
            </div>
          </div>

          {/* Navigasi */}
          <div>
            <h4 className={styles.colTitle}>Fitur &amp; Menu</h4>
            <ul className={styles.linkList}>
              <li><Link href="/" className={styles.link}>Beranda</Link></li>
              <li><Link href="/studio" className={styles.link}>Kamera Studio</Link></li>
              <li><Link href="/template-selection" className={styles.link}>Koleksi Template</Link></li>
              <li><Link href="/#features" className={styles.link}>Fitur Lengkap</Link></li>
              <li><Link href="/#faq" className={styles.link}>Tanya Jawab (FAQ)</Link></li>
            </ul>
          </div>

          {/* Template Populer */}
          <div>
            <h4 className={styles.colTitle}>Koleksi Favorit</h4>
            <ul className={styles.linkList}>
              <li><Link href="/template-selection?cat=Aesthetic" className={styles.link}>Aesthetic Strip</Link></li>
              <li><Link href="/template-selection?cat=Retro" className={styles.link}>Y2K &amp; Vintage</Link></li>
              <li><Link href="/template-selection?cat=Cute" className={styles.link}>Kawaii &amp; Cute</Link></li>
              <li><Link href="/template-selection?cat=Minimal" className={styles.link}>Korean Monochrome</Link></li>
              <li><Link href="/template-selection?cat=Party" className={styles.link}>Party &amp; Event</Link></li>
            </ul>
          </div>

          {/* Komunitas & Kontak */}
          <div>
            <h4 className={styles.colTitle}>Hubungi Kami</h4>
            <p className={styles.desc} style={{ fontSize: '0.88rem' }}>
              Punya ide template baru atau kolaborasi event photobooth? Hubungi kami di sosmed!
            </p>
            <div className={styles.socialRow}>
              <a
                href="https://www.tiktok.com/@ammarray26"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIconBtn}
                title="TikTok"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/rayyanmarf_"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIconBtn}
                title="Instagram"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a
                href="https://wa.me/6285817591120"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIconBtn}
                title="WhatsApp"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={styles.bottomBar}>
          <div className={styles.copyright}>
            <span>© {new Date().getFullYear()} RuangGaya. Dibuat dengan cinta untuk semua momen indah.</span>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <span>Digital Photobooth Indonesia</span>
            <span>•</span>
            <span>Estetik &amp; Modern</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
