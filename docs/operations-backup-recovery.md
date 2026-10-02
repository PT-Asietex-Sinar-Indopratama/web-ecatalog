# Operations, Backup & Recovery

## Backup scope

- Database aplikasi.
- Gambar produk.
- File PDF produk.
- Konfigurasi deployment yang tidak berisi secret mentah.

## Jadwal dan retensi

Jadwal, retensi, lokasi salinan, dan owner operasional harus ditetapkan bersama
tim sebelum production. Nilainya tidak diasumsikan oleh dokumen ini.

## Restore procedure

1. Identifikasi incident dan hentikan perubahan data bila perlu.
2. Tentukan titik backup yang akan dipulihkan.
3. Pulihkan database dan storage dalam lingkungan terkontrol.
4. Verifikasi jumlah produk, kategori, relasi, dan aset.
5. Jalankan smoke test katalog dan admin.
6. Catat hasil, waktu pemulihan, dan tindakan perbaikan.

## Operational monitoring

- Error aplikasi dan kegagalan upload.
- Kesehatan database dan storage.
- Kapasitas disk.
- Waktu respons katalog dan dashboard.
- Login atau perubahan data penting.

## Recovery objective

RTO, RPO, dan kontak incident response perlu disepakati sebelum aplikasi dipakai
sebagai sistem produksi.
