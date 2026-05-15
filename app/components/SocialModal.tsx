'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './SocialModal.module.css';

export default function SocialModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const node = document.createElement('div');
    document.body.appendChild(node);
    setPortalNode(node);

    return () => {
      if (document.body.contains(node)) {
        document.body.removeChild(node);
      }
    };
  }, []);

  useEffect(() => {
    // Prevent scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  const modalContent = isOpen ? (
    <div className={styles.overlay} onClick={() => setIsOpen(false)}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>Temukan Kami</h3>
          <button className={styles.closeBtn} onClick={() => setIsOpen(false)} aria-label="Tutup">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className={styles.socialList}>
          {/* TikTok */}
          <a href="https://www.tiktok.com/@ammarray26" target="_blank" rel="noopener noreferrer" className={styles.socialItem}>
            <div className={styles.iconWrap} style={{ color: '#000' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
              </svg>
            </div>
            <div className={styles.socialText}>
              <span className={styles.socialName}>TikTok</span>
              <span className={styles.socialHandle}>@ammarray26</span>
            </div>
            <div className={styles.arrowIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6"></path>
              </svg>
            </div>
          </a>

          {/* Instagram */}
          <a href="https://www.instagram.com/rayyanmarf_" target="_blank" rel="noopener noreferrer" className={styles.socialItem}>
            <div className={styles.iconWrap} style={{ color: '#E1306C' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </div>
            <div className={styles.socialText}>
              <span className={styles.socialName}>Instagram</span>
              <span className={styles.socialHandle}>@rayyanmarf_</span>
            </div>
            <div className={styles.arrowIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6"></path>
              </svg>
            </div>
          </a>

          {/* WhatsApp */}
          <a href="https://wa.me/6285817591120" target="_blank" rel="noopener noreferrer" className={styles.socialItem}>
            <div className={styles.iconWrap} style={{ color: '#25D366' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </div>
            <div className={styles.socialText}>
              <span className={styles.socialName}>WhatsApp</span>
              <span className={styles.socialHandle}>085817591120</span>
            </div>
            <div className={styles.arrowIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6"></path>
              </svg>
            </div>
          </a>

          {/* GitHub */}
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className={styles.socialItem}>
            <div className={styles.iconWrap} style={{ color: '#333' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </div>
            <div className={styles.socialText}>
              <span className={styles.socialName}>GitHub Repo</span>
              <span className={styles.socialHandle}>Source Code</span>
            </div>
            <div className={styles.arrowIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6"></path>
              </svg>
            </div>
          </a>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className={`btn-secondary ${styles.triggerBtn}`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
        Sosmed
      </button>

      {/* Render modal in portal to break out of any backdrop-filter containing blocks */}
      {portalNode && createPortal(modalContent, portalNode)}
    </>
  );
}
