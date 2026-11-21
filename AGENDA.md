# 📋 AGENDA & ROADMAP PENGEMBANGAN: AwNotes

Dokumen ini adalah acuan resmi alur pengembangan aplikasi **AwNotes** (Web-based Samsung Notes Alternative). Setiap kali fitur selesai dikerjakan, item terkait akan dicentang (`[x]`), dan versi rilis akan dinaikkan bertahap.

---

## 📌 Ringkasan Spesifikasi Arsitektur

- **Nama Aplikasi**: AwNotes
- **Bentuk**: SPA (Single Page Application) + PWA (Progressive Web App - 100% Offline-First)
- **Runtime & Package Manager**: Bun
- **Frontend Framework**: SvelteKit (`@sveltejs/adapter-static`)
- **UI Library & Styling**: Tailwind CSS + Flowbite Svelte
- **Mesin Tinta / Kanvas**: HTML5 Canvas + `perfect-freehand` (Pointer Events API)
- **Penyimpanan Utama (Lokal)**: IndexedDB via Dexie.js
- **Penyimpanan Cloud (Cadangan)**: Google Drive API (OAuth 2.0 GIS - Khusus Member)
- **Deployment**: GitHub Pages (`username.github.io/awnotes`) via GitHub Actions CI/CD
- **Testing & Logging**: Vitest & Centralized In-App Logger

---

## 🏷️ Pelacak Versi Aplikasi

| Versi | Status | Target Pencapaian |
| :--- | :---: | :--- |
| **v0.1.0** | 🟢 *Completed* | Fondasi Proyek, Canvas Core Inking (Pen, Pensil, Stabilo, Eraser), Undo/Redo |
| **v0.2.0** | 🟡 *Next* | Database Lokal (Dexie.js), Dashboard, Folder, FAB Kiri, Auto-save |
| **v0.3.0** | ⚪ *Planned* | Floating Dock Fleksibel, Objek Geometri, Lasso, Hold-to-Snap, Easy Writing Pad, Gambar |
| **v0.4.0** | ⚪ *Planned* | Import PDF (PDF.js), Anotasi di atas PDF, Ekspor PDF/PNG/`.awn` |
| **v0.5.0** | ⚪ *Planned* | Login Akun Google (Member), Backup & Restore Google Drive |
| **v0.6.0** | ⚪ *Planned* | PWA Offline Service Worker, Kustomisasi Keyboard Shortcuts, Polishing |
| **v1.0.0** | ⚪ *Planned* | **Rilis Produksi Pertama di GitHub Pages** |
| **v1.1.0+**| ⚪ *Future* | Handwriting-to-Text (OCR), Handwriting Search, Realtime Kolaborasi VPS |

---

## 🚀 Rincian Sprint & Checklist Pengembangan

### 📦 Sprint 1: Fondasi Proyek & Mesin Tinta Inti (Core Inking Engine) — `v0.1.0`
- [x] Inisialisasi proyek SvelteKit dengan Bun
- [x] Konfigurasi Tailwind CSS dan Flowbite Svelte
- [x] Setup adapter statis (`@sveltejs/adapter-static`) dengan base path `/awnotes`
- [x] Setup utilitas **Logger Terpusat** (`src/lib/utils/logger.ts`) & konfigurasi **Vitest**
- [x] Buat komponen kanvas dengan dukungan *Pointer Events API* (`pointerType: pen, touch, mouse`)
- [x] Integrasi algoritma goresan halus & tekanan stylus (`perfect-freehand`)
- [x] Implementasi alat dasar:
  - [x] **Pen**: Ujung tinta solid dengan sensitivitas tekanan
  - [x] **Pensil**: Sistem grade standar (**2H, H, HB, B, 2B, 4B, 6B**)
  - [x] **Stabilo / Highlighter**: Multiply blend mode (semi-transparan di atas teks/garis)
  - [x] **Penghapus**: Mode *Stroke Eraser* & *Pixel Eraser*
- [x] Sistem Undo & Redo (Vector stroke stack)
- [x] Pilihan template kertas dasar: Polos (*Blank*), Bergaris (*Ruled*), Kotak (*Grid*)

---

### 📦 Sprint 2: Penyimpanan Lokal & Antarmuka Dashboard — `v0.2.0`
- [ ] Setup skema database browser **IndexedDB (Dexie.js)**
- [ ] Sistem Auto-save instan lokal (0ms) dengan status (`local_only`, `synced`, `modified`)
- [ ] Membangun antarmuka **Layar 1 (Dashboard)**:
  - [ ] Profil pengguna di bagian paling atas sidebar (Avatar + Nama / Tombol Login)
  - [ ] Manajemen folder hierarkis & filter tag
  - [ ] Tombol Pengaturan di bagian paling bawah sidebar (Dark Mode, Backup, dll.)
  - [ ] Tombol **FAB `[+]` Tambah Catatan di sebelah kiri bawah**
- [ ] Tampilan catatan dalam format **Grid** & **List**
- [ ] Pembuatan thumbnail visual otomatis dari lembar pertama catatan
- [ ] Unit test: Pengujian CRUD database Dexie.js dan integritas data

---

### 📦 Sprint 3: Fitur Canggih Editor & Objek — `v0.3.0`
- [ ] Desain **Floating Pen Dock** (Icon-only + Tooltips nama alat):
  - [ ] Popover klik ganda untuk palet warna & slider ukuran
  - [ ] Fleksibilitas posisi dock: *Fixed Top*, *Fixed Bottom*, *Fixed Left*, *Fixed Right*, dan *Free Floating*
  - [ ] Fitur kustomisasi urutan ikon tools (*Reorderable Dock*)
- [ ] Objek Dasar Geometri:
  - [ ] Menu 1 ikon popover: Garis Lurus (2 titik), Kotak, Lingkaran, Segitiga, Bintang
- [ ] **Hold to Snap**: Tahan stylus 0,5 detik untuk otomatis meluruskan garis / merapikan bentuk
- [ ] **Lasso Tool**: Melingkari area coretan untuk digeser (*drag*), diubah ukuran (*resize*), diubah warnanya, disalin, atau dihapus
- [ ] **Pad Penulisan Mudah (*Easy Writing Pad*)**: Jendela zoom kotak bawah dengan fitur *auto-advance*
- [ ] Rak Pena Favorit (*Quick Presets Bar* untuk 3–4 pena)
- [ ] Palm Rejection: Mengabaikan sentuhan telapak tangan saat stylus aktif
- [ ] Penyisipan Gambar:
  - [ ] Upload gambar & tempel cepat via clipboard (`Ctrl + V`)
  - [ ] Bounding box 8-titik kendali (Resize & Rotate)
  - [ ] Tombol **Kunci Gambar (*Lock Image*)** agar tidak bergeser saat dicoret-coret
- [ ] Mode Teks Hybrid (Lapisan Teks di bawah kanvas coretan + To-Do Checklist interaktif)
- [ ] Perekaman Suara (*Audio Recording*) tersinkronisasi goresan tinta (format WebM/Opus)

---

### 📦 Sprint 4: Anotasi Dokumen PDF & Sistem Ekspor — `v0.4.0`
- [ ] Integrasi **PDF.js (`pdfjs-dist`)**:
  - [ ] Import file PDF dari perangkat
  - [ ] Render halaman PDF multi-lembar sebagai latar belakang kanvas
- [ ] Anotasi stylus dan stabilo di atas dokumen PDF
- [ ] Sistem Ekspor Dokumen:
  - [ ] Ekspor ke **PDF Asli** (gabungan halaman PDF + coretan tinta via `pdf-lib`)
  - [ ] Ekspor halaman tunggal ke gambar **PNG/JPEG** resolusi tinggi
  - [ ] Ekspor berkas cadangan offline format **`.awn`**
- [ ] Fitur Import berkas cadangan **`.awn`** dari penyimpanan lokal
- [ ] Unit test: Algoritma ekspor & parser berkas `.awn`

---

### 📦 Sprint 5: Autentikasi Member & Sinkronisasi Google Drive — `v0.5.0`
- [ ] Integrasi **Firebase Authentication**: Login Akun Google (Status Member)
- [ ] Integrasi **Google Identity Services (GIS) / Drive API**:
  - [ ] Otorisasi izin terbatas `drive.file`
  - [ ] Otomatisasi pembuatan folder cadangan `AwNotes_Backup/` di Google Drive pengguna
- [ ] Fitur Backup On-Demand:
  - [ ] Tombol cadangkan catatan individual
  - [ ] Opsi *"Cadangkan Semua Catatan"* di menu Pengaturan
- [ ] Indikator visual status sinkronisasi awan (Ikon awan di dashboard & editor)

---

### 📦 Sprint 6: PWA, Kustomisasi Shortcut & Polishing — `v0.6.0`
- [ ] Konfigurasi **PWA (Progressive Web App)**:
  - [ ] Web App Manifest (`manifest.json`) & icon set
  - [ ] Service Worker via Workbox untuk caching offline penuh
- [ ] Menu Kustomisasi **Pintasan Keyboard (*Custom Keybindings*)** di Pengaturan Dashboard
- [ ] Fitur *"Salin Log Diagnostik / Error Log"* di Pengaturan
- [ ] Pengujian responsivitas menyeluruh di HP, Tablet (layar sentuh & stylus), dan Laptop/PC
- [ ] Unit test menyeluruh untuk memastikan tidak ada regresi

---

### 🌐 Sprint 7: Otomasi Deployment & Rilis v1.0.0 — `v1.0.0`
- [ ] Pembuatan alur kerja **GitHub Actions** (`.github/workflows/deploy.yml`):
  - [ ] Setup Bun runtime
  - [ ] Menjalankan Vitest otomatis
  - [ ] Build statis SvelteKit
  - [ ] Deploy otomatis ke GitHub Pages
- [ ] Konfigurasi domain whitelist di Google Cloud Console & Firebase Console
- [ ] Verifikasi routing SPA (fallback `404.html`) di GitHub Pages
- [ ] **Rilis Resmi Versi 1.0.0** 🚀

---

### 🔮 Tahap Masa Depan (Post-Launch Expansion) — `v1.1.0+`
- [ ] *Handwriting-to-Text* (OCR pengenalan tulisan tangan ke teks ketik)
- [ ] *Handwriting Search* (Pencarian kata dalam tulisan tangan)
- [ ] Pengenalan Rumus Matematika ke KaTeX / LaTeX
- [ ] Kolaborasi Real-Time Multi-Pengguna (Tahap Server VPS pribadi via Yjs / WebSocket)

---

## 📝 Catatan Pembaruan Log (Changelog)

- **2026-11-22**: Penyusunan dokumen master agenda dan roadmap awal proyek AwNotes berdasarkan kesepakatan seluruh fase perencanaan. Status: *Dokumen Dibuat*.
