'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import styles from './share.module.css';

export default function SharePage() {
  const { id } = useParams<{ id: string }>();
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  // The image URL (inline — no ?download param)
  const photoUrl = `/api/photos/${id}`;
  // Download URL (forces file download)
  const downloadUrl = `/api/photos/${id}?download=1`;

  useEffect(() => {
    if (!id) return;
    // Use GET instead of HEAD — HEAD is not always supported by mobile browsers on redirects
    // We just check if the response is OK (2xx). We don't read the body here.
    fetch(photoUrl)
      .then((res) => {
        if (res.ok) {
          setStatus('ready');
        } else {
          setStatus('error');
        }
      })
      .catch(() => setStatus('error'));
  }, [id, photoUrl]);

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `ruanggaya-${id}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className={styles.page}>
      {/* Decorative bubbles */}
      <div className="rg-bubble rg-bubble-1" />
      <div className="rg-bubble rg-bubble-3" />

      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logo}>RuangGaya</div>
        <p className={styles.tagline}>Foto strip siap diunduh 🎀</p>

        {status === 'loading' && (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p>Memuat foto...</p>
          </div>
        )}

        {status === 'error' && (
          <div className={styles.error}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--rg-muted)" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p className={styles.errorTitle}>Foto tidak ditemukan</p>
            <p className={styles.errorMsg}>
              Link ini sudah kedaluwarsa (berlaku 30 menit) atau dibuka setelah server di-restart.
              Silakan kembali ke studio dan buat QR baru.
            </p>
            <a href="/" className="btn-secondary" style={{ marginTop: 16, display: 'inline-block', padding: '10px 24px' }}>
              Buka RuangGaya
            </a>
          </div>
        )}

        {status === 'ready' && (
          <>
            {/* Photo preview — src loads inline (no attachment header) */}
            <div className={styles.photoWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoUrl}
                alt="Strip foto RuangGaya"
                className={styles.photo}
                onError={() => setStatus('error')}
              />
            </div>

            {/* Download button — uses ?download=1 to force file save */}
            <button className={styles.downloadBtn} onClick={handleDownload}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Simpan ke Galeri
            </button>

            <p className={styles.hint}>Link berlaku 30 menit sejak foto dibuat</p>
          </>
        )}

        <a href="/" className={styles.homeLink}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Kembali ke RuangGaya
        </a>
      </div>
    </div>
  );
}
