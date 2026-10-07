'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { PRESET_TEMPLATES, FRAMES, TEMPLATES, PresetTemplate } from '@/lib/config';
import styles from './page.module.css';

export default function TemplateSelectionPage() {
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedEligibility, setSelectedEligibility] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Active open dropdown menu ('size' | 'category' | 'sort' | 'eligibility' | null)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Session photo modal state
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [sessionPhotos, setSessionPhotos] = useState<string[]>([]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Check for saved session in localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ruanggaya_session_photos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSessionPhotos(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const sizeLabels: Record<string, string> = {
    all: 'All Sizes',
    '1x1': '1×1 Polaroid',
    '2x1': '2×1 Duo Strip',
    '3x1': '3×1 Classic Strip',
    '4x1': '4×1 Korean Strip',
    '1x2': '1×2 Wide Duo',
    '2x2': '2×2 Square Grid',
    '2x3': '2×3 Story Grid',
    '3x2': '3×2 Wide Grid',
    '4x2': '4×2 Party Board',
  };

  const categoryLabels: Record<string, string> = {
    all: 'All Types',
    Cartoon: 'Cartoon Disney & Pixar',
    Meme: 'Meme Kocak & Viral',
    Cute: 'Cute & Kawaii',
    Aesthetic: 'Aesthetic',
    Retro: 'Retro & Vintage',
    Minimal: 'Minimalist',
    Party: 'Party & Event',
  };

  const sortLabels: Record<string, string> = {
    popular: 'Most Popular',
    newest: 'Newest',
    title: 'Title (A-Z)',
  };

  const eligibilityLabels: Record<string, string> = {
    all: 'All Eligible',
    free: 'Free Only',
    adfree: 'Ad-free Only',
  };

  const trendingTags = [
    'Disney',
    'Pixar',
    'Meme',
    'Batik',
    'Y2K',
    'Film',
    'Ribbon',
    'Matcha',
    'Cherry',
    'Spotify',
    'Koran',
    'Capybara',
    'Chill Guy',
    'Cat',
    'Minimalist',
  ];

  // Filter & Search Logic
  const filteredTemplates = useMemo(() => {
    let list = [...PRESET_TEMPLATES];

    // Filter by Size (templateId)
    if (selectedSize !== 'all') {
      list = list.filter((item) => item.templateId === selectedSize);
    }

    // Filter by Category
    if (selectedCategory !== 'all') {
      list = list.filter((item) => item.category === selectedCategory);
    }

    // Filter by Tag
    if (selectedTag) {
      list = list.filter((item) =>
        item.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase())
      );
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q)) ||
          item.author.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'popular') {
      const featuredOrder = ['sal-priadi-blur-2x1', 'couple8-monkey-4x1', 'frame-batik-1-4x2', 'kk-studio-4r-4x2'];
      list.sort((a, b) => {
        const aFeat = featuredOrder.indexOf(a.id);
        const bFeat = featuredOrder.indexOf(b.id);
        if (aFeat !== -1 && bFeat !== -1) return aFeat - bFeat;
        if (aFeat !== -1) return -1;
        if (bFeat !== -1) return 1;
        return b.uses - a.uses;
      });
    } else if (sortBy === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [selectedSize, selectedCategory, selectedTag, searchQuery, sortBy]);

  const toggleDropdown = (name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  return (
    <div className={styles.container}>
      {/* Background Grid Pattern & Ambience */}
      <div className={styles.gridBackground} />
      <div className={styles.glowTopRight} />
      <div className={styles.glowBottomLeft} />

      <Navbar />

      <main className={styles.mainContent}>
        {/* ═══ Continue Photo Session Banner (Jepreto signature feature) ═══ */}
        <section className={styles.continueBanner} aria-label="Sesi Foto Sebelumnya">
          <div className={styles.continueLeft}>
            <div className={styles.continueIconBox}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="3"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="m21 15-5-5L5 21"/>
              </svg>
            </div>
            <div>
              <h2 className={styles.continueTitle}>Continue Your Photo Session</h2>
              <p className={styles.continueSubtitle}>
                {sessionPhotos.length > 0
                  ? `You have ${sessionPhotos.length} unfinished photo${sessionPhotos.length > 1 ? 's' : ''} waiting for you!`
                  : 'You have 1 unfinished photo waiting for you!'}
              </p>
            </div>
          </div>
          <button
            type="button"
            className={styles.continueBtn}
            onClick={() => setShowSessionModal(true)}
          >
            Show Photos
          </button>
        </section>

        {/* ═══ Header Title ═══ */}
        <div className={styles.headerTitleBlock}>
          <h1 className={styles.pageHeading}>Pilih Template Photobooth</h1>
          <p className={styles.pageSubheading}>
            Jelajahi template photostrip karya creator RuangGaya — pilih, foto, dan bagikan hasilnya.
          </p>
        </div>

        {/* ═══ Filter & Search Bar ═══ */}
        <section className={styles.filterBar} ref={dropdownRef} aria-label="Filter Template Photobooth">
          <div className={styles.filterControls}>
            <span className={styles.filterLabel}>Filter by</span>

            {/* 1. All Sizes Dropdown */}
            <div className={styles.dropdownWrapper}>
              <button
                type="button"
                className={styles.yellowPillBtn}
                onClick={() => toggleDropdown('size')}
                aria-expanded={openDropdown === 'size'}
              >
                <span>{sizeLabels[selectedSize] || 'All Sizes'}</span>
                <svg
                  className={`${styles.chevronIcon} ${openDropdown === 'size' ? styles.chevronOpen : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {openDropdown === 'size' && (
                <div className={styles.dropdownMenu}>
                  {Object.entries(sizeLabels).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      className={`${styles.dropdownItem} ${selectedSize === key ? styles.dropdownItemActive : ''}`}
                      onClick={() => {
                        setSelectedSize(key);
                        setOpenDropdown(null);
                      }}
                    >
                      <span>{label}</span>
                      {selectedSize === key && <span>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. All Types Dropdown */}
            <div className={styles.dropdownWrapper}>
              <button
                type="button"
                className={styles.yellowPillBtn}
                onClick={() => toggleDropdown('category')}
                aria-expanded={openDropdown === 'category'}
              >
                <span>{categoryLabels[selectedCategory] || 'All Types'}</span>
                <svg
                  className={`${styles.chevronIcon} ${openDropdown === 'category' ? styles.chevronOpen : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {openDropdown === 'category' && (
                <div className={styles.dropdownMenu}>
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      className={`${styles.dropdownItem} ${selectedCategory === key ? styles.dropdownItemActive : ''}`}
                      onClick={() => {
                        setSelectedCategory(key);
                        setOpenDropdown(null);
                      }}
                    >
                      <span>{label}</span>
                      {selectedCategory === key && <span>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Most Popular Dropdown */}
            <div className={styles.dropdownWrapper}>
              <button
                type="button"
                className={styles.yellowPillBtn}
                onClick={() => toggleDropdown('sort')}
                aria-expanded={openDropdown === 'sort'}
              >
                <span>{sortLabels[sortBy] || 'Most Popular'}</span>
                <svg
                  className={`${styles.chevronIcon} ${openDropdown === 'sort' ? styles.chevronOpen : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {openDropdown === 'sort' && (
                <div className={styles.dropdownMenu}>
                  {Object.entries(sortLabels).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      className={`${styles.dropdownItem} ${sortBy === key ? styles.dropdownItemActive : ''}`}
                      onClick={() => {
                        setSortBy(key);
                        setOpenDropdown(null);
                      }}
                    >
                      <span>{label}</span>
                      {sortBy === key && <span>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 4. All Eligible Dropdown */}
            <div className={styles.dropdownWrapper}>
              <button
                type="button"
                className={styles.yellowPillBtn}
                onClick={() => toggleDropdown('eligibility')}
                aria-expanded={openDropdown === 'eligibility'}
              >
                <span>{eligibilityLabels[selectedEligibility] || 'All Eligible'}</span>
                <svg
                  className={`${styles.chevronIcon} ${openDropdown === 'eligibility' ? styles.chevronOpen : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {openDropdown === 'eligibility' && (
                <div className={styles.dropdownMenu}>
                  {Object.entries(eligibilityLabels).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      className={`${styles.dropdownItem} ${selectedEligibility === key ? styles.dropdownItemActive : ''}`}
                      onClick={() => {
                        setSelectedEligibility(key);
                        setOpenDropdown(null);
                      }}
                    >
                      <span>{label}</span>
                      {selectedEligibility === key && <span>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search Box & Search Button */}
          <div className={styles.searchSection}>
            <div className={styles.searchBox}>
              <svg
                className={styles.searchIcon}
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search Templates..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              type="button"
              className={styles.searchBtn}
              onClick={() => {
                // Trigger search filter
              }}
            >
              Search
            </button>
          </div>
        </section>

        {/* ═══ Trending Row (Matching Jepreto) ═══ */}
        <section className={styles.trendingSection} aria-label="Trending Templates">
          <div className={styles.trendingNotice}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8e36ff" strokeWidth="2.5">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
            <span>~ No trending today, share your favorite template!</span>
          </div>

          <div className={styles.trendingTagsScroll}>
            <button
              type="button"
              className={`${styles.tagPill} ${selectedTag === null ? styles.tagPillActive : ''}`}
              onClick={() => setSelectedTag(null)}
            >
              Semua
            </button>

            {trendingTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`${styles.tagPill} ${selectedTag === tag ? styles.tagPillActive : ''}`}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              >
                #{tag}
              </button>
            ))}
          </div>
        </section>

        {/* ═══ Template Cards Grid (4 Columns Desktop) ═══ */}
        {filteredTemplates.length > 0 ? (
          <div className={styles.grid}>
            {filteredTemplates.map((item: PresetTemplate) => {
              const frameObj = FRAMES.find((f) => f.id === item.frameId);
              const tmplObj = TEMPLATES.find((t) => t.id === item.templateId);
              const cols = tmplObj?.cols || 1;
              const totalSlots = tmplObj?.slots || 3;

              // Check special templates
              const isNewspaper = item.frameId === 'bg-koran';
              const isMonkeyMeme = item.id === 'couple8-monkey-4x1' || item.frameId === 'bg-monkey-meme';

              return (
                <div key={item.id} className={styles.card}>
                  <Link
                    href={`/studio?template=${item.templateId}&frame=${item.frameId}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                    aria-label={`Pilih template ${item.title}`}
                  >
                    {/* Card Preview (Aspect 2/3) */}
                    <div
                      className={styles.cardPreview}
                      style={
                        frameObj?.bgImage
                          ? {
                              backgroundImage: `url(${frameObj.bgImage})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                            }
                          : { background: frameObj?.bgColor || '#ece8f5' }
                      }
                    >
                      {/* Top Badges */}
                      <span className={styles.badgeTopLeft}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6.4-4.8-6.4 4.8 2.4-7.2-6-4.8h7.6z"/>
                        </svg>
                        <span>Free</span>
                      </span>

                      <span className={styles.badgeTopRight}>Ad-free</span>

                      {/* Bottom Left Uses Badge */}
                      <span className={styles.badgeBottomLeft}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                        </svg>
                        <span>{item.uses.toLocaleString()} uses</span>
                      </span>

                      {/* Hover Overlay with "Start Creating" Button */}
                      <div className={styles.hoverOverlay}>
                        <div className={styles.startBtn}>
                          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                            <circle cx="12" cy="13" r="3"/>
                          </svg>
                          <span>Start Creating</span>
                        </div>
                      </div>

                      {/* Photostrip Realistic Cutout Slots */}
                      {frameObj?.customSlots && frameObj.customSlots.length > 0 ? (
                        <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                          {frameObj.customSlots.map((rect, slotIdx) => (
                            <div
                              key={slotIdx}
                              style={{
                                position: 'absolute',
                                left: `${rect.x}%`,
                                top: `${rect.y}%`,
                                width: `${rect.width}%`,
                                height: `${rect.height}%`,
                                borderRadius: 6,
                                background: 'rgba(255, 255, 255, 0.85)',
                                border: '1.5px dashed rgba(32, 32, 48, 0.45)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)',
                                fontSize: '1.1rem',
                                color: '#8e36ff',
                              }}
                            >
                              📸
                            </div>
                          ))}
                        </div>
                      ) : (
                        /* Photostrip layout matching cols & slots */
                        <div
                          className={styles.photostripWrapper}
                          style={{
                            background: frameObj?.bgImage ? 'transparent' : 'rgba(255, 255, 255, 0.7)',
                          }}
                        >
                          <div
                            className={styles.slotsContainer}
                            style={{
                              gridTemplateColumns: `repeat(${cols}, 1fr)`,
                              gridTemplateRows: `repeat(${Math.ceil(totalSlots / cols)}, 1fr)`,
                            }}
                          >
                            {Array.from({ length: totalSlots }).map((_, slotIdx) => (
                              <div key={slotIdx} className={styles.cutoutSlot}>
                                <span className={styles.slotPlaceholderIcon}>📸</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div className={styles.cardFooter}>
                      <h2 className={styles.cardTitle}>{item.title}</h2>
                      <div className={styles.cardMetaRow}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                          <circle cx="12" cy="13" r="3"/>
                        </svg>
                        <span>{totalSlots} photos</span>
                      </div>
                      <span className={styles.detailLink}>
                        Detail template {item.title}
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div style={{ fontSize: '3rem', marginBottom: 14 }}>🔍</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 8, color: '#1e1b4b' }}>
              Tidak ada template yang cocok
            </h3>
            <p style={{ color: '#72678f', fontSize: '0.92rem', marginBottom: 20 }}>
              Coba kata kunci lain atau ubah filter ukuran dan kategori di atas.
            </p>
            <button
              type="button"
              className={styles.searchBtn}
              onClick={() => {
                setSelectedSize('all');
                setSelectedCategory('all');
                setSortBy('popular');
                setSelectedEligibility('all');
                setSearchQuery('');
                setSelectedTag(null);
              }}
            >
              Reset Semua Filter
            </button>
          </div>
        )}
      </main>

      {/* ═══ Session Photos Modal ═══ */}
      {showSessionModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowSessionModal(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '1.5rem' }}>📸</span>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#1e1b4b' }}>
                  Sesi Foto Anda
                </h3>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setShowSessionModal(false)}
                aria-label="Tutup modal"
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.9rem', color: '#685e82', lineHeight: 1.5, marginBottom: 20 }}>
              {sessionPhotos.length > 0
                ? `Anda memiliki ${sessionPhotos.length} foto dari sesi sebelumnya. Mau lanjutkan sekarang?`
                : 'Anda memiliki 1 foto draft yang belum selesai. Masuk ke Studio Photobooth untuk melanjutkan sesi foto!'}
            </p>

            <div
              style={{
                background: '#f8f5fe',
                border: '2px dashed #8e36ff',
                borderRadius: 16,
                padding: 24,
                textAlign: 'center',
                marginBottom: 24,
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🎞️</div>
              <div style={{ fontWeight: 700, color: '#1e1b4b', marginBottom: 4 }}>
                Sesi Photobooth Tersimpan
              </div>
              <div style={{ fontSize: '0.82rem', color: '#7e7399' }}>
                Siap untuk pose berikutnya dan ekspor strip foto
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                type="button"
                style={{
                  background: '#f4effe',
                  border: '1px solid #ded3f8',
                  borderRadius: 10,
                  padding: '9px 18px',
                  fontWeight: 700,
                  color: '#655488',
                  cursor: 'pointer',
                }}
                onClick={() => setShowSessionModal(false)}
              >
                Tutup
              </button>
              <Link
                href="/studio"
                style={{
                  background: '#8e36ff',
                  border: 'none',
                  borderRadius: 10,
                  padding: '9px 20px',
                  fontWeight: 700,
                  color: '#ffffff',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>Lanjutkan di Studio</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
