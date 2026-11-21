# 🖌️ Alat: Stabilo (Highlighter)

Alat **Stabilo** digunakan untuk menandai kalimat penting pada catatan teks, tulisan tangan, maupun dokumen buku PDF.

---

## 1. Karakteristik & Efek Transparansi
- **Multiply Blend Mode (`globalCompositeOperation = 'multiply'`)**:
  - Warna stabilo semi-transparan.
  - Saat melewati tulisan tinta hitam atau teks buku PDF, warna stabilo berada **di bawah tinta**, sehingga tulisan tetap 100% terbaca tajam dan tidak tertutup warna stabilo.
- **Bentuk Ujung Miring (*Chisel Tip*)**:
  - Garis stabilo memiliki ketebalan horizontal konstan tanpa penipisan ujung garis.

---

## 2. Parameter Teknis
```typescript
export const HIGHLIGHTER_CONFIG = {
  thinning: 0.0,
  smoothing: 0.8,
  streamline: 0.7,
  compositeOperation: 'multiply',
  defaultAlpha: 0.45
};
```

---

## 3. Pintasan Keyboard
- **Default**: Tombol **`H`**
