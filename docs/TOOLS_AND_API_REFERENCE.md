# 🛠️ KATALOG FITUR & SPESIFIKASI TEKNIS ALAT (API REFERENCE)

Dokumen ini menjelaskan spesifikasi internal, parameter matematis, serta skema data dari seluruh alat dan fitur dalam aplikasi **AwNotes**.

---

## 1. Spesifikasi Mesin Tinta (Inking Engine)

Mesin tinta AwNotes dibangun di atas HTML5 Canvas dengan kalkulasi poligon kurva menggunakan library `perfect-freehand` dan pembacaan hardware melalui *W3C Pointer Events API*.

### 1.1 Parameter Alat Tulis

| Nama Alat | Tipe Goresan | Parameter Smoothing | Simulasi Tekanan (*Pressure*) | Blend Mode Kanvas |
| :--- | :--- | :--- | :--- | :--- |
| **Pen** | Solid Vector Stroke | `thinning: 0.5, smoothing: 0.5, streamline: 0.6` | Aktif (Garis menebal saat stylus ditekan kuat) | `source-over` |
| **Pensil** | Textured Gradient | `thinning: 0.2, smoothing: 0.4, streamline: 0.4` | Aktif (Gradasi opacity & butiran grafit) | `source-over` |
| **Stabilo** | Wide Chisel Stroke | `thinning: 0.0, smoothing: 0.8, streamline: 0.7` | Nonaktif (Ketebalan konstan persegi panjang) | `multiply` |
| **Penghapus** | Hit-test Bounding Box | - | - | `destination-out` (Pixel) / Splice Vector (Stroke) |

---

### 1.2 Spesifikasi Grade Pensil (*Pencil Grading System*)

Pensil AwNotes memetakan standar grafit dunia nyata ke dalam kombinasi ketebalan dasar (*base width*), transparansi (*opacity*), dan responsivitas tekanan:

```typescript
export interface PencilGradeSpec {
  grade: '2H' | 'H' | 'HB' | 'B' | '2B' | '4B' | '6B';
  baseWidth: number; // Lebar garis dasar (piksel)
  opacity: number;   // Tingkat kepekatan tinta (0.0 - 1.0)
  hardness: number;  // Ketahanan terhadap tekanan stylus
}

export const PENCIL_GRADES: Record<string, PencilGradeSpec> = {
  '2H': { grade: '2H', baseWidth: 1.5, opacity: 0.40, hardness: 0.8 },
  'H':  { grade: 'H',  baseWidth: 2.0, opacity: 0.50, hardness: 0.7 },
  'HB': { grade: 'HB', baseWidth: 2.5, opacity: 0.65, hardness: 0.5 },
  'B':  { grade: 'B',  baseWidth: 3.0, opacity: 0.75, hardness: 0.4 },
  '2B': { grade: '2B', baseWidth: 3.8, opacity: 0.85, hardness: 0.3 },
  '4B': { grade: '4B', baseWidth: 5.0, opacity: 0.95, hardness: 0.2 },
  '6B': { grade: '6B', baseWidth: 7.0, opacity: 1.00, hardness: 0.1 }
};
```

---

### 1.3 Algoritma Pengenalan Bentuk ("Hold to Snap")

- **Timer Ambang Batas**: 500 milidetik (0,5 detik) tanpa pergerakan pointer di akhir goresan.
- **Deteksi Geometri**:
  - **Garis Lurus**: Menghitung deviasi titik tengah terhadap garis proyeksi antara titik awal $(x_0, y_0)$ dan titik akhir $(x_n, y_n)$. Jika deviasi rata-rata $< 5\text{px}$, goresan diubah menjadi vektor garis lurus.
  - **Lingkaran / Elips**: Menghitung jarak jarak rata-rata dari titik pusat perkiraan. Jika varians jari-jari $< 10\%$, goresan diganti dengan kurva Bezier elips sempurna.
  - **Kotak / Poligon**: Menghitung jumlah sudut tajam (*corner detection*) menggunakan algoritma Douglas-Peucker.

---

## 2. Struktur Data Catatan (Skema IndexedDB & File `.awn`)

Format file cadangan `.awn` dan database lokal Dexie.js menggunakan skema JSON terstruktur berikut:

```typescript
export interface NoteDocument {
  id: string;                      // UUID v4 catatan
  version: number;                 // Versi skema dokumen (default: 1)
  title: string;                   // Judul catatan
  folderId: string | null;         // ID folder penampung
  tags: string[];                  // Kumpulan label tag (cth: ["kuliah", "fisika"])
  createdAt: number;               // Waktu pembuatan (Unix Timestamp ms)
  updatedAt: number;               // Waktu terakhir diubah (Unix Timestamp ms)
  paperFormat: 'paging' | 'infinite'; // Model lembar kerja
  paperTemplate: 'blank' | 'ruled' | 'grid' | 'dot' | 'custom';
  customTemplateUrl?: string;      // Base64 data gambar template kustom jika ada
  audioRecording?: {
    blobUrl?: string;              // Audio data stream (WebM/Opus)
    durationSeconds: number;       // Total durasi audio
  };
  pages: NotePage[];               // Lembaran halaman catatan
}

export interface NotePage {
  pageNumber: number;
  width: number;                   // Lebar kanvas (standar A4 rasio: 794px)
  height: number;                  // Tinggi kanvas (standar A4 rasio: 1123px)
  pdfPageRef?: number;             // Referensi index halaman PDF jika dokumen anotasi
  strokes: VectorStroke[];         // Data seluruh goresan tangan
  images: EmbeddedImage[];         // Gambar yang disisipkan
  textLayerHtml?: string;          // Konten teks ketik / checklist to-do
}

export interface VectorStroke {
  id: string;
  tool: 'pen' | 'pencil' | 'highlighter';
  color: string;                   // HEX atau RGBA
  size: number;
  pencilGrade?: string;            // Grade pensil jika tool === 'pencil'
  timestamp: number;               // Detik ke berapa goresan dibuat (untuk sinkronisasi audio)
  points: Array<[x: number, y: number, pressure: number]>; // Array koordinat titik
}

export interface EmbeddedImage {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;                // Sudut putar (derajat 0 - 360)
  isLocked: boolean;               // Apakah gambar dikunci dari pergeseran stylus
  dataUrl: string;                 // Base64 data gambar (PNG/JPEG)
}
```

---

## 3. Spesifikasi Arsitektur Sinkronisasi Google Drive

- **Protokol**: Google Identity Services (GIS) Web Client (OAuth 2.0).
- **Scope Izin**: `https://www.googleapis.com/auth/drive.file`
  - *Catatan Privasi*: Hanya dapat membaca dan menulis berkas yang dibuat oleh AwNotes sendiri.
- **Lokasi Folder**: `AwNotes_Backup/` pada direktori root Google Drive pengguna.
- **Format File Unggahan**: `[Nama_Catatan]_[NoteID].awn` (JSON terkompresi Gzip).

---

## 4. Konfigurasi Pintasan Keyboard Default (Keybindings API)

Kustomisasi pintasan keyboard disimpan di `localStorage['awnotes_keybindings']`.

```json
{
  "tools.text": "KeyT",
  "tools.pen": "KeyP",
  "tools.pencil": "KeyB",
  "tools.highlighter": "KeyH",
  "tools.eraser": "KeyE",
  "tools.lasso": "KeyL",
  "tools.shapes": "KeyS",
  "tools.easy_writing_pad": "KeyZ",
  "presets.slot1": "Digit1",
  "presets.slot2": "Digit2",
  "presets.slot3": "Digit3",
  "presets.slot4": "Digit4",
  "canvas.undo": "ctrl+KeyZ",
  "canvas.redo": "ctrl+KeyY",
  "media.paste": "ctrl+KeyV"
}
```
