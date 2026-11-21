# 🧹 Alat: Penghapus (Eraser)

Alat **Penghapus** menyediakan dua mode penghapusan sesuai kebutuhan menulis dan menggambar.

---

## 1. Mode Penghapusan

### A. Stroke Eraser (Penghapus Garis Utuh - Bawaan)
- **Cara Kerja**: Cukup sentuhkan ujung penghapus ke bagian mana pun dari sebuah garis, seluruh tarikan garis (*stroke vector*) tersebut akan langsung terhapus rapi secara instan.
- **Penggunaan Ideal**: Sangat efisien saat mencatat cepat, mengoreksi salah tulis kata, atau membersihkan coretan tanpa menyisakan residu.

### B. Pixel Eraser (Penghapus Area/Piksel)
- **Cara Kerja**: Bekerja seperti karet penghapus fisik. Menghapus hanya titik kanvas yang terlewati oleh lingkaran kuas penghapus.
- **Penggunaan Ideal**: Menghapus detail sketsa pensil, memotong garis gambar, atau merapikan arsiran.

---

## 2. Parameter Teknis
```typescript
export interface EraserConfig {
  mode: 'stroke' | 'pixel';
  radius: number; // 5px sampai 50px
}
```

---

## 3. Pintasan Keyboard
- **Default**: Tombol **`E`**
