# 🎙️ Fitur: Perekaman Suara Tersinkronisasi (Audio Sync)

Fitur **Sinkronisasi Audio** merekam suara rapat atau perkuliahan sambil mencatat dengan stylus, lalu menghubungkan suara tersebut dengan goresan tulisan tangan Anda.

---

## 1. Mekanisme Kerja
1. **Perekaman Terkompresi**: Suara direkam menggunakan format modern **WebM dengan codec Opus** (kualitas suara jernih, ukuran file hemat: ~1 MB per 10 menit).
2. **Pencatatan Timestamp Vektor**: Setiap goresan stylus yang dibuat menyimpan catatan detik waktu relatif sejak rekaman dimulai (`stroke.timestamp`).
3. **Playback Interaktif**:
   - Saat rekaman suara diputar, goresan tulisan tangan di lembar catatan akan menyala (*highlight*) secara berurutan sesuai detik kata tersebut diucapkan.
   - Mengklik goresan tulisan tertentu akan langsung melompati pemutar audio (*jump to audio*) ke detik saat tulisan itu dibuat!
