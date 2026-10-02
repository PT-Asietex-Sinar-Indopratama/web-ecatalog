# API Conventions

## Tujuan

Dokumen ini menjadi aturan umum untuk endpoint internal dan endpoint katalog.
Detail endpoint aktual harus mengikuti route dan controller yang tersedia.

## Request

- Validasi input dilakukan di server.
- Field wajib, tipe, ukuran, format, dan uniqueness harus dinyatakan jelas.
- Mutation yang mengubah data harus memiliki perlindungan CSRF sesuai mekanisme
  aplikasi.
- Query listing menggunakan parameter pencarian, filter, sorting, dan pagination
  yang konsisten.

## Response

Gunakan struktur yang konsisten:

```json
{
    "success": true,
    "message": "Optional message",
    "data": {},
    "meta": {}
}
```

Response error harus memberi status HTTP yang benar, pesan yang aman, dan detail
validasi yang dapat ditampilkan oleh form tanpa membocorkan informasi sensitif.

## Pagination

Listing harus mengembalikan informasi halaman saat pagination digunakan, minimal
current page, per-page/limit, total, dan total pages bila tersedia.

## Public boundary

Response publik hanya boleh mengembalikan field katalog yang diperlukan. Jangan
mengembalikan credential, internal path yang sensitif, atau data user.

## Perubahan kontrak

Perubahan response atau parameter wajib memperbarui dokumentasi fitur, validasi,
dan test terkait.
