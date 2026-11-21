# 📄 RANGKUMAN EKSEKUTIF & KESEPAKATAN PENGEMBANGAN: AwNotes

**Proyek**: AwNotes (Web-Based Samsung Notes Clone)  
**Dokumen Tanggal**: 2026-11-22  
**Target Hosting**: GitHub Pages (`username.github.io/awnotes`)  
**Target Biaya Server**: Rp 0 (Zero Server Footprint / Free Tier Permanen)  

---

## 1. Ringkasan Visi Produk

AwNotes adalah aplikasi catatan digital berbasis web yang berfokus pada **kenyamanan tulisan tangan alami (stylus/S-Pen)**, **teks ketik**, dan **anotasi PDF multi-halaman**. Aplikasi ini dibangun dengan prinsip:
1. **Ultra-Clean & Zen Focus**: Tampilan bebas gangguan dengan bilah alat melayang (*Sleek Island*) yang otomatis memudar saat menulis dan bilah status bawah yang dapat dilipat menjadi anak panah kecil `[ ⌃ ]`.
2. **Local-First & 100% Offline**: Semua catatan disimpan di perangkat pengguna (IndexedDB) dengan latensi 0ms.
3. **Bring Your Own Storage (BYOS)**: Pengguna yang login (Member) dapat mencadangkan catatan langsung ke akun Google Drive pribadi mereka secara gratis.
4. **Ergonomis untuk Semua Perangkat**: Mendukung layar sentuh, stylus bertekanan, serta mouse & keyboard fisik di HP, Tablet, Laptop, dan PC.

---

## 2. Kesepakatan Arsitektur & Teknologi

| Komponen | Pilihan Teknologi | Alasan Pemilihan |
| :--- | :--- | :--- |
| **Runtime & Bundler** | **Bun** | Sangat cepat untuk instalasi paket dan kompilasi build. |
| **Framework Frontend** | **SvelteKit (`adapter-static`)** | Sangat ringan, reaktif tanpa virtual DOM berlebih, menjaga kanvas stabil di 60 FPS. |
| **Styling & UI** | **Tailwind CSS + Flowbite Svelte** | UI modern, konsisten, mendukung tema gelap/terang secara mulus. |
| **Mesin Tinta / Kanvas** | **HTML5 Canvas + `perfect-freehand`** | Menghasilkan garis bertekanan (*pressure sensitivity*) sehalus pulpen fisik. |
| **Penyimpanan Lokal** | **IndexedDB (via Dexie.js)** | Menyimpan data vektor stroke, teks, gambar, dan folder di browser tanpa kuota ketat. |
| **Penyimpanan Cadangan** | **Google Drive API (GIS OAuth 2.0)** | Cadangan manual *on-demand* ke folder `AwNotes_Backup/` di Drive pribadi pengguna. |
| **Autentikasi Member** | **Firebase Auth (Google Login)** | Berjalan langsung dari client-side GitHub Pages secara gratis. |
| **Anotasi Dokumen** | **PDF.js (`pdfjs-dist`) & `pdf-lib`** | Membaca halaman PDF dan mengekspor dokumen gabungan dengan coretan tinta. |
| **Testing & Logging** | **Vitest & Centralized In-App Logger** | Pengujian unit cepat untuk algoritma data dan logger terisolasi tanpa merusak FPS. |

---

## 3. Spesifikasi Fitur Utama (Hasil Diskusi Lengkap)

### A. Layar 1: Dashboard Catatan (Home)
- **Profil Pengguna di Atas Sidebar**: Menampilkan nama, foto profil Google, status Member, atau tombol Login.
- **Tombol Tambah Catatan (FAB `(+)`)**: Mengambang di **kiri bawah layar** ($56 \times 56\text{ px}$) agar ergonomis untuk tablet/HP.
- **Pengaturan di Dasar Sidebar**: Pengaturan tema gelap, kustomisasi pintasan keyboard, ekspor/impor file `.awn` offline.
- **Manajemen Catatan**: Tampilan Grid/List dengan thumbnail lembar pertama, folder hierarkis, tag, dan pencarian cepat.
- **Tur Singkat Pengguna Baru (*Onboarding Tour*)**: Modal 3 slide interaktif dan catatan latihan bawaan (*Welcome Starter Note*).

### B. Layar 2: Editor Ruang Kerja (Workspace)
- **Sleek Island Pen Dock**: Toolbar kapsul melayang yang dapat diposisikan di Atas, Bawah, Kiri, Kanan, atau Bebas Mengambang.
- **Zen Focus Mode**: Toolbar memudar (*fade to 30%*) saat stylus sedang menorehkan garis, dan kembali terang saat stylus diangkat.
- **Collapsible Bottom Bar**: Bilah bawah (status simpan, nomor halaman, zoom) dapat dilipat menjadi **anak panah kecil `[ ⌃ ]`** untuk memperluas kanvas.
- **Pilihan Format & Template Kertas**: Lembar A4 (*paging*) vs *Infinite Canvas*, pilihan kertas polos, bergaris, grid, dot, atau unggah template kustom sendiri.

### C. Jajaran Alat Tulis & Interaksi Pintar
1. **Pen (`P`)**: Ujung tinta solid dengan sensitivitas tekanan stylus.
2. **Pensil (`B`)**: Grade standar dunia nyata (**2H, H, HB, B, 2B, 4B, 6B**) dengan tekstur grafit berbutir.
3. **Stabilo (`H`)**: Mode *multiply blend* transparan di bawah teks dan tinta.
4. **Penghapus (`E`)**: Opsi *Stroke Eraser* (1 garis utuh) dan *Pixel Eraser* (area sapuan).
5. **Objek Geometri (`S`)**: Garis lurus, kotak, lingkaran, segitiga, bintang.
6. **Hold to Snap**: Tahan stylus 0,5 detik di akhir coretan untuk otomatis merapikan garis atau lingkaran.
7. **Lasso Tool (`L`)**: Melingkari area catatan untuk digeser, diperbesar/perkecil, diubah warnanya, atau dihapus.
8. **Pad Penulisan Mudah (`Z`)**: Kotak zoom di bawah untuk menulis besar dan rapi dengan fitur *auto-advance* (geser otomatis ke kanan).
9. **Gambar & Kunci Objek**: Tempel cepat via `Ctrl+V`, kotak 8 titik kendali, dan tombol gembok (*Lock Image*) agar tidak terseret saat dicoret.
10. **Perekaman Suara Tersinkronisasi**: Rekaman audio WebM/Opus yang tersinkronisasi detik goresan tulisan tangan.

---

## 4. Rencana Tahapan Eksekusi (6 Sprint Terstruktur)

- **Sprint 1**: Setup Bun + SvelteKit + Tailwind + Flowbite, Canvas Inking Engine, Pen, Pensil 2H–6B, Stabilo, Eraser, Undo/Redo.
- **Sprint 2**: IndexedDB (Dexie.js), Dashboard, Profil, Folder, FAB Kiri Bawah, Auto-save lokal.
- **Sprint 3**: Floating Dock Fleksibel, Objek Geometri, Hold-to-Snap, Lasso Tool, Easy Writing Pad, Gambar & Gembok, Collapsible Bottom Bar.
- **Sprint 4**: Import PDF (PDF.js), Anotasi di atas PDF, Ekspor PDF (`pdf-lib`), PNG, dan `.awn`.
- **Sprint 5**: Firebase Auth (Google Login Member), Backup & Restore Google Drive (GIS).
- **Sprint 6**: PWA Service Worker (100% Offline-ready), Kustomisasi Pintasan Keyboard, Pengujian & Rilis v1.0.0 ke GitHub Pages.
