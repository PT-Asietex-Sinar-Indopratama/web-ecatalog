# Admin CMS

## Tujuan

Dashboard internal memusatkan pengelolaan katalog dan data akses pengguna.

## Akses

- User harus login untuk membuka dashboard.
- Route admin hanya dapat diakses role `admin`.
- Produk, kategori, user, role, gambar, dan file dikelola dari area internal.

## Modul

### Dashboard

Menampilkan total produk, produk aktif, kategori aktif, produk tanpa aset atau
deskripsi, produk nonaktif, produk terbaru, dan shortcut pengelolaan.

### Produk

Admin dapat melihat, mencari, memfilter status, membuat, mengubah, menghapus,
dan mengelola gambar serta PDF produk.

### Kategori

Admin dapat CRUD kategori, menetapkan parent, dan mengatur status. Validasi harus
mencegah slug duplikat, self-parent, dan siklus parent-child.

### User dan role

Admin dapat CRUD user dan role, mengatur status, serta menetapkan satu role kepada
user. Permission granular per aksi belum menjadi kebutuhan wajib versi ini.

## Validasi utama

- SKU dan slug unik.
- Field wajib tidak boleh kosong.
- Gambar: JPG, JPEG, PNG, atau WEBP, maksimal 5 MB.
- PDF: maksimal 10 MB.
- Penghapusan produk harus menghapus aset terkait dari storage.

## Batasan

Gallery gambar adalah target MVP; current implementation menggunakan satu gambar
utama dan satu PDF per produk.
