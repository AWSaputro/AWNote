# 🖊️ Alat: Pen (Pulpen Tinta)

Alat **Pen** adalah instrumen utama untuk menulis catatan tangan, tanda tangan digital, dan menggambar garis presisi.

---

## 1. Karakteristik & Fisika Goresan
- **Sensitivitas Tekanan (*Pressure Sensitivity*)**: Menggunakan data `e.pressure` dari stylus/S-Pen. Garis menebal secara dinamis saat ditekan dan menipis saat stylus diangkat.
- **Stroke Smoothing**: Menggunakan algoritma *cubic spline interpolation* untuk merapikan getaran tangan (*hand jitter*).
- **Warna Tinta**: Mendukung palet warna cepat dan pemilih warna HEX kustom.

---

## 2. Parameter Teknis (`src/lib/engine/inking.ts`)
```typescript
export const PEN_CONFIG = {
  thinning: 0.5,      // Penipisan ujung garis
  smoothing: 0.5,     // Kehalusan kurva
  streamline: 0.6,    // Stabilisasi tarikan garis
  easing: (t: number) => t,
  simulatePressure: true
};
```

---

## 3. Pintasan Keyboard
- **Default**: Tombol **`P`**
- Dapat dikustomisasi di: `Pengaturan > Pintasan Keyboard`
