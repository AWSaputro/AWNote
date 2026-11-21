# 📄 Fitur: Anotasi Dokumen PDF & Ekspor

Fitur **Anotasi PDF** mengubah dokumen PDF multi-halaman menjadi lembaran kerja digital yang dapat dicoret, distabilo, dan ditandatangani.

---

## 1. Arsitektur Rendering (via `pdfjs-dist`)
1. Setiap halaman PDF dirender sebagai elemen kanvas latar belakang (*background layer*).
2. Lapisan kanvas AwNotes dipasang tepat di atas halaman PDF dengan rasio dimensi 1:1.
3. Seluruh coretan stylus, stabilo, dan teks tambahan disimpan secara independen sebagai data vektor di atas halaman terkait.

---

## 2. Alur Ekspor Dokumen
- **Ekspor PDF Gabungan (via `pdf-lib`)**: Menggabungkan file PDF asli dengan seluruh lapisan coretan vektor pengguna menjadi file PDF beresolusi tinggi baru yang siap cetak.
- **Ekspor Gambar PNG**: Mengekspor halaman yang sedang dibuka sebagai berkas gambar resolusi tinggi.
- **Ekspor Cadangan `.awn`**: Mengemas seluruh dokumen dan riwayat goresan menjadi berkas cadangan offline.
