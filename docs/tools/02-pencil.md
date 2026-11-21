# ✏️ Alat: Pensil (Sistem Grade 2H–6B)

Alat **Pensil** dirancang untuk membuat sketsa, arsir ilustrasi, dan tulisan tangan bernuansa grafit alami.

---

## 1. Karakteristik & Fisika Goresan
Pensil AwNotes tidak menggunakan slider piksel biasa, melainkan **grade grafit standar dunia nyata**:

| Grade | Lebar Garis | Opacity | Karakter Visual | Penggunaan Ideal |
| :---: | :---: | :---: | :--- | :--- |
| **`2H`** | $1.5\text{ px}$ | $40\%$ | Abu-abu muda, tipis, garis keras | Garis bantu teknik, sketsa dasar |
| **`H`**  | $2.0\text{ px}$ | $50\%$ | Abu-abu cerah, tajam | Sketsa proporsi diagram |
| **`HB`** | $2.5\text{ px}$ | $65\%$ | Abu-abu netral seimbang | Menulis catatan pensil sehari-hari |
| **`B`**  | $3.0\text{ px}$ | $75\%$ | Lebih empuk dan gelap | Sketsa bebas |
| **`2B`** | $3.8\text{ px}$ | $85\%$ | Hitam gelap, responsif terhadap tekanan | Catatan ujian & diagram alir |
| **`4B`** | $5.0\text{ px}$ | $95\%$ | Tebal, lembut, butiran grafit jelas | Arsiran gelap (*shading*) |
| **`6B`** | $7.0\text{ px}$ | $100\%$ | Sangat tebal, hitam pekat bertekstur | Ilustrasi artistik & kaligrafi |

---

## 2. Parameter Teknis
```typescript
export const PENCIL_CONFIG = {
  thinning: 0.2,
  smoothing: 0.4,
  streamline: 0.4,
  textureGrain: true // Filter noise kanvas untuk butiran grafit
};
```

---

## 3. Pintasan Keyboard
- **Default**: Tombol **`B`**
