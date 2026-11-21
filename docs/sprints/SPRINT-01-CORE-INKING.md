# 🚀 PANDUAN IMPLEMENTASI SPRINT 1: MESIN TINTA INTI (CORE INKING ENGINE) — v0.1.0

Dokumen ini adalah spesifikasi koding tingkat teknis (*implementation blueprint*) untuk **Sprint 1**. Dokumen ini dirancang dengan instruksi yang sangat presisi agar model AI dapat mengimplementasikan kode tanpa ambigu.

---

## 🎯 Sasaran Sprint 1
1. Inisialisasi proyek SvelteKit dengan **Bun**, **Tailwind CSS**, dan **Flowbite Svelte**.
2. Konfigurasi `@sveltejs/adapter-static` dengan `fallback: '404.html'` dan base path `/awnotes`.
3. Komponen kanvas menggambar interaktif dengan **Pointer Events API** + `perfect-freehand`.
4. Implementasi 4 alat dasar: **Pen**, **Pensil (2H–6B)**, **Stabilo (Multiply)**, dan **Penghapus (Stroke & Pixel)**.
5. Sistem **Undo / Redo** dan pergantian template kertas (Polos, Garis, Kotak).

---

## 🛠️ Langkah 1: Perintah Terminal Inisialisasi Proyek

Jalankan perintah berikut di root folder `/home/hiawsaputro/APP/awnotes`:

```bash
# 1. Inisialisasi SvelteKit minimal (Skeleton project, TypeScript, Prettier)
bun create svelte@latest . --template minimal --types ts --no-prettier --no-eslint --no-playwright --no-vitest

# 2. Instalasi Dependensi Inti
bun install
bun add -d tailwindcss postcss autoprefixer @sveltejs/adapter-static
bun add flowbite flowbite-svelte @popperjs/core
bun add perfect-freehand

# 3. Instalasi Vitest untuk pengujian unit
bun add -d vitest
```

---

## 📁 Langkah 2: Konfigurasi File Inti

### 2.1 `svelte.config.js`
Konfigurasikan adapter statis untuk GitHub Pages:
```javascript
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: '404.html',
      precompress: false,
      strict: true
    }),
    paths: {
      base: process.env.NODE_ENV === 'production' ? '/awnotes' : ''
    }
  }
};

export default config;
```

### 2.2 `tailwind.config.js`
Konfigurasikan Flowbite dan warna tema:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca'
        }
      }
    }
  },
  plugins: [require('flowbite/plugin')]
};
```

---

## 🧱 Langkah 3: Struktur Tipe Data (`src/lib/types/canvas.ts`)

Buat berkas `src/lib/types/canvas.ts` dengan isi:
```typescript
export type ToolType = 'pen' | 'pencil' | 'highlighter' | 'eraser';
export type PencilGrade = '2H' | 'H' | 'HB' | 'B' | '2B' | '4B' | '6B';
export type PaperTemplate = 'blank' | 'ruled' | 'grid';

export interface Point {
  x: number;
  y: number;
  pressure: number;
}

export interface Stroke {
  id: string;
  tool: ToolType;
  color: string;
  size: number;
  pencilGrade?: PencilGrade;
  points: Point[];
}

export interface CanvasState {
  currentTool: ToolType;
  currentColor: string;
  currentSize: number;
  currentPencilGrade: PencilGrade;
  eraserMode: 'stroke' | 'pixel';
  eraserRadius: number;
  paperTemplate: PaperTemplate;
  isDarkPaper: boolean;
}
```

---

## ⚙️ Langkah 4: Mesin Tinta (`src/lib/engine/inking.ts`)

Buat modul kalkulasi garis menggunakan `perfect-freehand`:
```typescript
import getStroke from 'perfect-freehand';
import type { Stroke, PencilGrade } from '../types/canvas';

export const PENCIL_PROPERTIES: Record<PencilGrade, { width: number; opacity: number }> = {
  '2H': { width: 1.5, opacity: 0.40 },
  'H':  { width: 2.0, opacity: 0.50 },
  'HB': { width: 2.5, opacity: 0.65 },
  'B':  { width: 3.0, opacity: 0.75 },
  '2B': { width: 3.8, opacity: 0.85 },
  '4B': { width: 5.0, opacity: 0.95 },
  '6B': { width: 7.0, opacity: 1.00 }
};

export function getStrokeOptions(stroke: Stroke) {
  if (stroke.tool === 'highlighter') {
    return {
      size: stroke.size,
      thinning: 0,
      smoothing: 0.8,
      streamline: 0.7,
      simulatePressure: false
    };
  }

  if (stroke.tool === 'pencil') {
    const grade = stroke.pencilGrade || '2B';
    const spec = PENCIL_PROPERTIES[grade];
    return {
      size: spec.width,
      thinning: 0.2,
      smoothing: 0.4,
      streamline: 0.4,
      simulatePressure: true
    };
  }

  // Pen default
  return {
    size: stroke.size,
    thinning: 0.5,
    smoothing: 0.5,
    streamline: 0.6,
    simulatePressure: true
  };
}

// Konversi titik outline polygon dari perfect-freehand menjadi SVG Path string
export function getSvgPathFromStroke(strokePoints: number[][]): string {
  if (!strokePoints.length) return '';
  const d = strokePoints.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ['M', ...strokePoints[0], 'Q']
  );
  d.push('Z');
  return d.join(' ');
}
```

---

## 🎨 Langkah 5: Komponen Kanvas (`src/lib/components/editor/Canvas.svelte`)

Spesifikasi interaksi:
1. Menangani event `pointerdown`, `pointermove`, `pointerup`, `pointercancel`.
2. Menggunakan `pointerType === 'pen'` untuk memprioritaskan stylus.
3. Menggambar goresan aktif ke kanvas secara langsung (menggunakan dual-canvas: 1 kanvas untuk riwayat goresan permanen, 1 kanvas overlay untuk goresan yang sedang aktif bergerak).
4. Menyimpan riwayat stroke ke stack `undoStack` dan `redoStack`.

---

## ✅ Kriteria Sukses Sprint 1 (Definition of Done)
- [ ] `bun run build` sukses tanpa error TypeScript.
- [ ] Stylus/mouse dapat mencoret di kanvas dengan goresan halus bertekanan.
- [ ] Pergantian grade pensil (2H s.d. 6B) mengubah ketebalan dan kepekatan secara visual.
- [ ] Stabilo tidak menutupi garis pulpen yang sudah digambar di bawahnya (*multiply blend*).
- [ ] Tombol Undo dan Redo berfungsi mengembalikan dan membatalkan goresan.
- [ ] Latar belakang kertas dapat diganti antara Polos, Garis Buku, dan Kotak-kotak.
