# Testing & Acceptance

## Public catalog

- [ ] Katalog dapat dibuka tanpa login.
- [ ] Hanya produk aktif yang tampil.
- [ ] Search bekerja untuk nama, SKU, material, deskripsi, dan kategori.
- [ ] Filter kategori parent mencakup child sesuai aturan.
- [ ] Sorting, grid/list, dan pagination bekerja.
- [ ] Detail produk menampilkan data dan asset yang benar.
- [ ] PDF dapat diunduh jika tersedia.
- [ ] Produk nonaktif tidak dapat dibuka melalui URL publik.

## Authentication dan admin

- [ ] Login, remember me, validasi, dan logout bekerja.
- [ ] User tanpa login tidak dapat membuka dashboard.
- [ ] User non-admin tidak dapat membuka route admin.
- [ ] Admin dapat CRUD produk, kategori, user, dan role.
- [ ] Perubahan kategori tidak membuat self-parent atau siklus.

## Assets

- [ ] Format dan ukuran gambar divalidasi.
- [ ] Format dan ukuran PDF divalidasi.
- [ ] Aset lama dibersihkan saat diganti atau dihapus.
- [ ] Produk terhapus tidak meninggalkan file di storage.
- [ ] Gallery MVP mendukung gambar utama dan gambar tambahan.

## MVP sales

- [ ] Request quotation dapat dimulai dari detail produk.
- [ ] Inquiry membawa nama atau SKU produk.
- [ ] Link WhatsApp menuju sales dengan konteks produk.
- [ ] Tidak ada asumsi checkout atau pembayaran dalam alur MVP.

## Quality gates

- [ ] Test unit/feature untuk aturan bisnis utama.
- [ ] Test authorization untuk route publik, user, dan admin.
- [ ] Test upload dan cleanup storage.
- [ ] Test responsive pada desktop dan mobile.
- [ ] Verifikasi target performa dan metadata SEO.
- [ ] Backup dan restore diuji sebelum production.
