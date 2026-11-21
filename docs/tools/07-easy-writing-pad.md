# 📝 Fitur: Pad Penulisan Mudah (Easy Writing Pad)

Fitur **Pad Penulisan Mudah (*Zoom Box*)** memungkinkan pengguna menulis catatan secara rapi, lurus, dan nyaman di layar tablet atau smartphone.

---

## 1. Konsep & Alur Kerja
1. **Kotak Fokus (*Target Box*)**: Sebuah kotak persegi panjang transparan muncul di lembar catatan atas.
2. **Jendela Tulis Bawah (*Input Pad*)**: Jendela kanvas berukuran besar muncul di bagian bawah layar.
3. **Penskalaan Otomatis (*Auto-Scaling*)**: Pengguna menulis kata berukuran besar di jendela bawah dengan stylus/jari. Goresan otomatis diperkecil (misal faktor skala $0.3\times$) dan ditempatkan rapi di dalam kotak target atas.
4. **Auto-Advance (Pergeseran Otomatis)**:
   - Begitu goresan mendekati sisi kanan jendela tulis bawah, kotak target di atas otomatis bergeser ke kanan untuk menerima kata berikutnya.
   - Tombol **Enter / Baris Baru**: Menurunkan kotak target ke baris berikutnya di bawahnya.

---

## 2. Parameter Teknis
```typescript
export interface EasyWritingPadConfig {
  scaleFactor: number;       // Rasio perkecil (0.25 - 0.5)
  targetBoxHeight: number;   // Tinggi baris catatan (default: 40px)
  autoAdvanceMargin: number; // Jarak pemicu geser kanan (default: 80% lebar pad)
}
```

---

## 3. Pintasan Keyboard
- **Default**: Tombol **`Z`**
