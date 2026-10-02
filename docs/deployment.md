# Deployment

## Tujuan

Dokumen ini menjadi checklist deployment Web E-Catalog. Nilai environment,
credential, dan host production tidak ditulis di repository.

## Pre-deployment

- Pastikan scope release sesuai PRD dan acceptance checklist.
- Jalankan test dan pemeriksaan build.
- Review migration dan perubahan storage.
- Pastikan environment production memiliki secret yang diperlukan.
- Buat backup sebelum migration atau perubahan aset.

## Environment minimum

- PHP 8.3.
- Laravel 13.x.
- Database relasional yang didukung aplikasi.
- Storage untuk gambar dan PDF.
- Secret aplikasi dan credential database melalui secret manager/environment.

## Release sequence

1. Deploy source code dan dependency yang terkunci.
2. Jalankan migration secara terkontrol.
3. Bersihkan/cache ulang konfigurasi sesuai kebutuhan framework.
4. Pastikan storage link dan permission filesystem benar.
5. Jalankan smoke test login, katalog, detail, download, dan admin.
6. Pantau error dan performa setelah release.

## Rollback

Rollback harus mencakup source code, migration yang aman untuk dibalikkan, dan
prosedur pemulihan database/storage. Jangan menghapus data production sebagai
bagian rollback tanpa prosedur backup dan persetujuan yang sesuai.
