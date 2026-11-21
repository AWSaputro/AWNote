# 🛑 BATASAN PENGEMBANGAN & SPESIFIKASI DESAIN UI/UX (GUARDRAILS)

Dokumen ini menetapkan **batasan-batasan resmi (*guardrails*)** dalam pengembangan aplikasi **AwNotes**, mencakup batasan teknis performa, batasan ruang lingkup (*scope boundaries* untuk v1.0.0), serta penyempurnaan desain UI & UX final agar pengembangan tetap fokus, cepat, dan tidak mengalami pembengkakan fitur (*scope creep*).

---

## 1. Batasan Teknis & Anggaran Performa (Performance Budget)

Untuk memastikan pengalaman menulis sehalus aplikasi bawaan perangkat (*native-feel*), implementasi kode wajib mematuhi batas-batas berikut:

### 1.1 Performa Kanvas & Latensi
- **Target Frame Rate**: Wajib stabil di **60 FPS** (atau 120 FPS pada layar *high refresh rate*).
- **Latensi Goresan Tinta**: Maksimal **16 milidetik** antara ujung stylus dan garis di layar.
- **Larangan di Loop Gambar (`pointermove`)**:
  - DILARANG menaruh `console.log()` di dalam event goresan pena.
  - DILARANG melakukan manipulasi DOM berat atau *re-render* komponen Svelte di dalam loop aktif menggambar.
  - Alokasi memori objek baru harus diminimalisir (*object pooling* jika diperlukan).

### 1.2 Batasan Ukuran Dokumen & Penyimpanan Lokal
- **Penyederhanaan Titik (*Stroke Simplification*)**: Setiap goresan yang memiliki lebih dari 30 titik koordinat wajib disaring menggunakan algoritma *Ramer-Douglas-Peucker (RDP)* sebelum disimpan ke database, dengan toleransi distorsi visual maksimal $0.5\text{px}$.
- **Limit Memori per Catatan**: Satu berkas catatan (termasuk seluruh halaman dan gambar sisipan) dibatasi maksimal **25 MB** di penyimpanan lokal agar tidak menghabiskan kuota IndexedDB browser pengguna.
- **Ukuran Bundle Aplikasi (PWA)**:
  - Ukuran awal JavaScript + CSS saat pertama kali dibuka maksimal **< 500 KB (gzipped)** agar aplikasi instan terbuka di koneksi internet lambat.

---

## 2. Batasan Ruang Lingkup (Scope Boundaries untuk v1.0.0)

Untuk menjamin rilis **Versi 1.0.0** selesai tepat waktu, kita tetapkan secara tegas apa yang **MASUK** dan apa yang **DITUNDA**:

| Fitur | Status v1.0.0 | Catatan Batasan |
| :--- | :---: | :--- |
| **Mesin Tinta & Pensil 2H–6B** | ✅ **Wajib Ada** | Fitur inti, wajib berfungsi mulus. |
| **Penyimpanan Lokal (IndexedDB)** | ✅ **Wajib Ada** | Offline-first, auto-save instan 0ms. |
| **Pad Penulisan Mudah (*Zoom Box*)** | ✅ **Wajib Ada** | Fitur unggulan untuk layar HP/tablet. |
| **Anotasi PDF & Ekspor Dokumen** | ✅ **Wajib Ada** | Import via PDF.js, ekspor PDF/PNG/`.awn`. |
| **Backup Manual Google Drive** | ✅ **Wajib Ada** | Hanya untuk pengguna yang login (Member). |
| **Pintasan Keyboard Kustom** | ✅ **Wajib Ada** | Dapat diubah di menu Pengaturan. |
| **Kolaborasi Real-time Multi-User** | ❌ **DITUNDA (v1.1.0+)** | Menunggu tahap server VPS pribadi aktif. |
| **Handwriting-to-Text (OCR AI)** | ❌ **DITUNDA (v1.1.0+)** | Tidak dimasukkan ke v1.0.0 agar rilis awal stabil. |
| **Pencarian Tulisan Tangan AI** | ❌ **DITUNDA (v1.1.0+)** | v1.0.0 hanya mencari judul catatan dan tag teks. |
| **Sinkronisasi Otomatis Latar Belakang** | ❌ **DITUNDA (v1.1.0+)** | v1.0.0 hanya menggunakan cadangan manual/*on-demand*. |

---

## 3. Desain Ulang UI & UX Final (Spesifikasi Antarmuka)

Berikut adalah penyempurnaan desain antarmuka final yang menggabungkan seluruh masukan:

### 3.1 Layar 1: Dashboard Catatan (Home)

```
+---------------------------------------------------------------------------------------------------+
|  [☰]  AwNotes                                  [ 🔍 Cari catatan... ]       [☁️ Status Backup]    |
+----------------------+----------------------------------------------------------------------------+
| 👤 [Avatar] [Nama]   |  📁 Semua Catatan  (12 Catatan)                   [⊞ Grid] [☰ List]        |
|    Akun: Member ⭐   |  ------------------------------------------------------------------------  |
|    [Keluar / Logout] |                                                                            |
| -------------------- |  +-------------+  +-------------+  +-------------+                         |
|  📝 Semua Catatan    |  | [Thumbnail] |  | [Thumbnail] |  | [Thumbnail] |                         |
|  ⭐ Favorit          |  | ~ ~ ~ ~ ~ ~ |  | [|||||||||] |  | (Polos)     |                         |
|  🗑️ Sampah           |  |-------------|  |-------------|  |-------------|                         |
|                      |  | Rumus Fisik |  | Todo Project|  | Sketsa UI   |                         |
|  FOLDER              |  | 20 Mnt lalu |  | Kemarin     |  | 12 Nov 2026 |                         |
|  📁 Kuliah           |  +-------------+  +-------------+  +-------------+                         |
|  📁 Pekerjaan        |                                                                            |
|  [+ Folder Baru]     |                                                                            |
|                      |                                                                            |
| (  +  )  <-- FAB     |                                                                            |
| Floating Action      |                                                                            |
| Button (Kiri Bawah)  |                                                                            |
| -------------------- |                                                                            |
| ⚙️ Pengaturan        |                                                                            |
|    (Dark/Shortcut)   |                                                                            |
+----------------------+----------------------------------------------------------------------------+
```

#### Aturan UX Layar 1:
1. **Posisi FAB Tambah Catatan**:
   - Berada mengambang di **kiri bawah** dengan jarak aman `bottom-6 left-6` (di luar area sidebar yang tertutup).
   - Ukuran target sentuh: Minimal **$56 \times 56\text{ px}$** agar sangat mudah ditekan dengan ibu jari.
2. **Hierarki Profil & Pengaturan**:
   - **Profil Pengguna**: Menempati posisi teratas di sidebar. Menampilkan status Member dan tombol Login Akun Google.
   - **Pengaturan**: Terpaku di dasar sidebar (*sticky bottom*). Berisi saklar Tema Gelap/Terang, pengaturan Pintasan Keyboard, dan tombol Ekspor/Impor berkas `.awn` offline.

---

### 3.2 Layar 2: Editor Ruang Kerja (Workspace)

```
+---------------------------------------------------------------------------------------------------+
| [← Dashboard]   Catatan Kuliah ✏️                  [ ↩ Undo ] [ ↪ Redo ]  [ 📄 Menu Lembar ] [⋮ Menu]|
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|               +-----------------------------------------------------------------+                 |
|               | [⌨ Teks] [🖊 Pen] [✏️ Pensil] [🖌 Stabilo] [🧹 Hapus] [✂ Lasso] [📐 Objek] [Z Pad] [⚙️] |
|               +-----------------------------------------------------------------+                 |
|               ▲ Floating Dock: Snapping ke Atas / Bawah / Kiri / Kanan / Bebas Floating           |
|                                                                                                   |
|                                     +-----------------------+                                     |
|                                     |    Lembar Kertas      |                                     |
|                                     | --------------------- |                                     |
|                                     |   Format:             |                                     |
|                                     |    - Lembar A4 (Paging|                                     |
|                                     |    - Infinite Canvas  |                                     |
|                                     |                       |                                     |
|                                     |   Template:           |                                     |
|                                     |    - Polos / Garis    |                                     |
|                                     |    - Grid / Dot       |                                     |
|                                     |    - Kustom (Upload)  |                                     |
|                                     +-----------------------+                                     |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
| [💾 Tersimpan Lokal]              Halaman 1 dari 2    [+ Halaman]                       [🔍 100%] |
|                                       [ ⌄ Sembunyikan Bilah ]                                     |
+---------------------------------------------------------------------------------------------------+

[KETIKA BILAH BAWAH DISEMBUNYIKAN (ZEN MODE)]:
+---------------------------------------------------------------------------------------------------+
|                                               [ ⌃ ]  <-- Anak Panah Kecil Melayang                |
+---------------------------------------------------------------------------------------------------+
```

#### Aturan UX Layar 2:
1. **Ergonomi Floating Pen Dock**:
   - Menampilkan **hanya ikon** dengan *tooltip* saat disentuh/diarahkan kursor.
   - Ukuran target tombol ikon minimal **$44 \times 44\text{ px}$** (standar aksesibilitas WCAG).
   - Menekan ikon aktif untuk kedua kalinya akan membuka jendela popover (pemilih warna, grade pensil, atau pilihan bentuk geometri).
   - Pengguna dapat memilih posisi snapping dok: Atas, Bawah, Kiri, Kanan, atau Mengambang bebas.
2. **Bilah Status Bawah Dapat Dilipat (Collapsible Bottom Bar)**:
   - Bilah bawah (yang berisi status simpan, nomor halaman, dan zoom) dapat disembunyikan dengan mengklik panah kecil `[ ⌄ ]`.
   - Saat disembunyikan, bilah meluncur ke bawah dan hanya menyisakan **anak panah kecil melayang `[ ⌃ ]`** di bagian tengah bawah layar.
   - Mengklik panah kecil tersebut akan memunculkan kembali bilah status secara halus (*smooth transition*).
   - Ini memaksimalkan area kanvas menulis di tablet atau layar kecil.
3. **Adaptasi Mode Gelap Kertas (*Dark Paper Mode*)**:
   - Jika pengguna mengaktifkan kertas gelap: tinta berwarna hitam otomatis dibalik menjadi **putih kontras tinggi** agar tulisan tetap terbaca jelas tanpa mengubah data warna asli.
3. **Pencegahan Salah Sentuh (*Palm Rejection*)**:
   - Ketika ada kontak dari stylus (`pointerType === 'pen'`), seluruh interaksi jari satu sentuhan (`pointerType === 'touch'`) dinonaktifkan dari kanvas gambar dan dialihkan untuk navigasi/scrolling lembar.

---

## 4. Standar Kode & Kualitas (Code Quality Guardrails)

- **Strict TypeScript**: Semua variabel koordinat goresan, konfigurasi alat, dan data dokumen wajib memiliki tipe data eksplisit (tanpa `any`).
- **Pemisahan Logika & UI**: Logika perhitungan matematika kanvas ditempatkan di `src/lib/engine/`, bukan di dalam file komponen `.svelte`.
- **Kompatibilitas Layar Sentuh**: Semua interaksi wajib diuji dapat berjalan menggunakan:
  - Stylus / S-Pen (dengan tekanan).
  - Jari / Layar Sentuh biasa (tanpa tekanan, default tebal rata-rata).
  - Mouse & Keyboard fisik (klik dan drag).
