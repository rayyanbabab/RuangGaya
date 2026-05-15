// ═══ RuangGaya — Central Configuration ═══

export const TEMPLATES = [
  { id: '2x1', label: '2×1 Strip', slots: 2, cols: 1, previewImg: '/templates/tmpl-2x1.jpg' },
  { id: '3x1', label: '3×1 Strip', slots: 3, cols: 1, previewImg: '/templates/tmpl-3x1.jpg' },
  { id: '4x1', label: '4×1 Strip', slots: 4, cols: 1, previewImg: '/templates/tmpl-4x1.jpg' },
  { id: '2x2', label: '2×2 Grid', slots: 4, cols: 2, previewImg: '/templates/tmpl-2x2.jpg' },
  { id: '2x3', label: '2×3 Grid', slots: 6, cols: 2, previewImg: '/templates/tmpl-2x3.jpg' },
] as const;

export type Template = (typeof TEMPLATES)[number];
export type TemplateId = Template['id'];



// ─────────────────────────────────────────────────────────────────────
//  Frame Configuration
//
//  Setiap frame bisa memiliki kombinasi dari properti berikut:
//
//  bgColor     — warna latar belakang strip (wajib, digunakan sebagai fallback)
//  borderColor — warna border tipis di sekeliling setiap slot foto
//  bgImage     — (opsional) path ke gambar/foto yang dijadikan LATAR BELAKANG strip
//                  Taruh file di /public/backgrounds/ lalu isi path-nya.
//                  Contoh: '/backgrounds/bg-taman.jpg'
//                  Gambar akan di-crop "cover" untuk memenuhi area strip.
//
//  CARA TAMBAH FRAME BARU:
//    1. Taruh file gambar/PNG di folder  d:\app-project\RuangGaya\public\backgrounds\
//    2. Tambah entri baru di array FRAMES di bawah ini
//    3. Simpan file → app akan langsung update (hot reload)
// ─────────────────────────────────────────────────────────────────────

export interface FrameConfig {
  id: string;
  name: string;
  bgColor: string;
  borderColor: string;
  /** Path ke gambar background (jpg/png). null = tidak ada. */
  bgImage: string | null;
}

export const FRAMES: FrameConfig[] = [
  // ── Solid color frames ───────────────────────────────────────────
  {
    id: 'white',
    name: 'White Clean',
    bgColor: '#FFFFFF',
    borderColor: '#E8E8E8',
    bgImage: null,
  },
  {
    id: 'pink',
    name: 'Pink Soft',
    bgColor: '#FFF0F5',
    borderColor: '#F4C0D1',
    bgImage: null,
  },
  {
    id: 'dark-pink',
    name: 'Dark Rose',
    bgColor: '#993556',
    borderColor: '#D4537E',
    bgImage: null,
  },
  {
    id: 'black',
    name: 'Classic Black',
    bgColor: '#1A1A1A',
    borderColor: '#333333',
    bgImage: null,
  },
  {
    id: 'lavender',
    name: 'Lavender',
    bgColor: '#F0EAFF',
    borderColor: '#C9B8F0',
    bgImage: null,
  },
  {
    id: 'mint',
    name: 'Mint Fresh',
    bgColor: '#EAFAF4',
    borderColor: '#A8E6CF',
    bgImage: null,
  },
  {
    id: 'nude',
    name: 'Nude Beige',
    bgColor: '#F5EDE0',
    borderColor: '#D4B896',
    bgImage: null,
  },

  // ── Frame gambar background ──────────────────────────────────────
  // Taruh file di /public/backgrounds/ lalu uncomment / tambah entri:

  {
    id: 'bg-black1',
    name: 'Black 1',
    bgColor: '#2D5A27',          // fallback jika gambar gagal load
    borderColor: '#ffffff',
    bgImage: '/backgrounds/bg-black1.jpg',
  },

  {
    id: 'bg-blue1',
    name: 'Blue 1',
    bgColor: '#21ecec',
    borderColor: '#ffffff',
    bgImage: '/backgrounds/bg-blue1.jpg',
  },
  {
    id: 'bg-cat1',
    name: 'Cat 1',
    bgColor: '#21ecec',
    borderColor: '#ffffff',
    bgImage: '/backgrounds/bg-cat1.jpg',
  },
  {
    id: 'bg-spotify1',
    name: 'Spotify 1',
    bgColor: '#21ecec',
    borderColor: '#ffffff',
    bgImage: '/backgrounds/bg-spotify1.jpg',
  },

  {
    id: 'bg-koran',
    name: 'Koran',
    bgColor: '#21ecec',
    borderColor: '#ffffff',
    bgImage: '/backgrounds/bg-koran.png',
  },

  {
    id: 'bg-cat2',
    name: 'Cat 2',
    bgColor: '#21ecec',
    borderColor: '#ffffff',
    bgImage: '/backgrounds/bg-cat2.jpg',
  },

  {
    id: 'bg-pink1',
    name: 'Pink 1',
    bgColor: '#21ecec',
    borderColor: '#ffffff',
    bgImage: '/backgrounds/bg-pink1.jpg',
  },
  {
    id: 'bg-purple1',
    name: 'Purple 1',
    bgColor: '#21ecec',
    borderColor: '#ffffff',
    bgImage: '/backgrounds/bg-purple1.jpg',
  },
  {
    id: 'bg-red1',
    name: 'Red 1',
    bgColor: '#21ecec',
    borderColor: '#ffffff',
    bgImage: '/backgrounds/bg-red1.jpg',
  },

];

export type Frame = FrameConfig;

export const FILTERS = ['Normal', 'B&W', 'Vintage', 'Vivid', 'Pastel', 'Warm'] as const;
export type FilterType = (typeof FILTERS)[number];

/** Map filter name → CSS filter string */
export const FILTER_CSS: Record<FilterType, string> = {
  Normal: 'none',
  'B&W': 'grayscale(100%)',
  Vintage: 'sepia(60%) contrast(90%) brightness(90%)',
  Vivid: 'saturate(180%) contrast(110%)',
  Pastel: 'saturate(60%) brightness(110%)',
  Warm: 'sepia(30%) saturate(140%) brightness(105%)',
};

export const TIMER_OPTIONS = [3, 5, 10] as const;
export type TimerOption = (typeof TIMER_OPTIONS)[number];

export interface StickerItem {
  id: string;
  src: string;
  width: number;
  height: number;
  transform: string; // CSS transform string (translate, rotate)
}

