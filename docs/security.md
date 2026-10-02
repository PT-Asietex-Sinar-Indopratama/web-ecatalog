# Security

## Access control

- Katalog publik hanya mengekspos produk aktif.
- Dashboard dilindungi autentikasi.
- Route admin dilindungi role `admin`.
- Otorisasi harus ditegakkan di server, bukan hanya menyembunyikan tombol UI.

## Authentication

- Password wajib di-hash.
- Session diregenerasi setelah login.
- Session diinvalidasi saat logout.
- Credential dan data sensitif tidak boleh muncul pada response publik atau log.

## File upload

- Validasi MIME/type, extension, dan ukuran di server.
- Tolak file berbahaya dan nama/path yang dapat menyebabkan path traversal.
- Simpan file menggunakan lokasi storage yang terkontrol.
- Pastikan penghapusan record membersihkan file terkait.

## Input dan output

- Validasi semua input dari client.
- Gunakan query parameter yang ter-parameterisasi melalui ORM/query builder.
- Escape output sesuai konteks untuk mencegah XSS.
- Jangan menampilkan stack trace atau detail internal di production.

## Produksi

- Secret disimpan melalui environment/secret manager.
- HTTPS digunakan untuk akses publik.
- Error, login, perubahan katalog, dan kegagalan upload dapat ditelusuri tanpa
  mencatat data sensitif.
- Backup dan restore diuji secara berkala.
