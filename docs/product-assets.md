# Product Assets

## Jenis aset

- Gambar produk untuk thumbnail dan detail.
- File PDF sebagai materi download produk.
- Gallery gambar tambahan sebagai target E-Catalog MVP.

## Current implementation

Satu produk memiliki satu gambar utama dan satu file PDF. Admin dapat melihat,
menghapus, dan mengganti aset dengan menghapus aset lama terlebih dahulu.

## Validasi upload

| Aset    | Format               | Batas ukuran |
| ------- | -------------------- | -----------: |
| Gambar  | JPG, JPEG, PNG, WEBP |         5 MB |
| Dokumen | PDF                  |        10 MB |

Validasi tipe, ukuran, nama, dan lokasi penyimpanan wajib dilakukan di server.

## Target gallery MVP

- Satu gambar ditetapkan sebagai gambar utama.
- Gambar tambahan dapat ditampilkan di halaman detail.
- Batas jumlah gambar tambahan masih perlu ditetapkan sebelum implementasi final.

## Lifecycle

1. Validasi upload.
2. Simpan file pada storage yang sesuai.
3. Simpan metadata dan relasi ke produk.
4. Tampilkan status aset pada dashboard.
5. Hapus file fisik saat aset atau produk dihapus.

## Keamanan

Lindungi upload dari file berbahaya, path traversal, nama file tidak aman, dan
akses file yang tidak semestinya. Detail kontrol ada di [Security](./security.md).
