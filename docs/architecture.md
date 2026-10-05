# Architecture

## Status

Dokumen ini menjelaskan arsitektur target berdasarkan implementasi Laravel,
Inertia.js, dan React. Detail scope produk ada di [PRD](./PRD.md).

## Stack saat ini

- PHP 8.3 dan Laravel 13.x.
- Inertia.js dengan React 19 dan TypeScript.
- Tailwind CSS 4 dan Vite.
- Eloquent ORM dan database relasional.
- Spatie Laravel Permission untuk role.
- Laravel public storage untuk gambar dan PDF.

## Lapisan aplikasi

```text
Browser
  ↓
Inertia page / React component
  ↓
Laravel route + controller
  ↓
Service (untuk business logic baru)
  ↓
Repository atau Eloquent query
  ↓
Database / Storage
```

Kode lama dapat tetap menggunakan controller dan Eloquent secara langsung.
Business logic baru, khususnya request quotation, sebaiknya dipisahkan ke
service secara bertahap agar mudah diuji dan dikembangkan.

## Batas area

- Katalog publik hanya membaca produk aktif.
- Dashboard memerlukan autentikasi.
- Route admin memerlukan role `admin`.
- File gambar dan PDF dikelola melalui storage, bukan disimpan sebagai blob di
  database.
- Request quotation MVP adalah inquiry, bukan checkout atau pembayaran.

## Prinsip pengembangan

1. Pertahankan pemisahan current implementation, MVP, dan future roadmap.
2. Validasi input di server; validasi client hanya membantu pengalaman pengguna.
3. Hindari N+1 query pada listing dan detail produk.
4. Tambahkan migration dan test saat menambah entitas atau aturan bisnis.
5. Dokumentasikan perubahan kontrak data atau API pada dokumen arsitektur ini.

## Data Model

Bagian ini mendefinisikan data yang dibutuhkan katalog dan batas perluasan
menuju inquiry atau e-commerce.

### Entitas katalog saat ini

#### Product

| Field         | Wajib    | Aturan                              |
| ------------- | -------- | ----------------------------------- |
| `category_id` | Ya       | Mengacu pada kategori yang tersedia |
| `sku`         | Ya       | Unik                                |
| `name`        | Ya       | Nama produk                         |
| `slug`        | Ya       | Unik dan stabil untuk URL           |
| `description` | Tidak    | Deskripsi produk                    |
| `material`    | Ya       | Material produk                     |
| `is_active`   | Ya       | Menentukan visibilitas publik       |
| `created_by`  | Otomatis | User pembuat                        |

#### Product asset

Current implementation memiliki satu gambar utama dan satu file PDF per produk.
MVP dapat menambahkan beberapa gambar dengan satu gambar yang ditandai sebagai
utama.

#### Category

Kategori memiliki nama, slug, deskripsi, status aktif, dan relasi parent-child.
Parent tidak boleh menunjuk dirinya sendiri atau membuat siklus hierarki.

#### User dan role

User memiliki identitas login, status aktif, dan role. Pada versi saat ini role
admin memiliki akses yang sama; permission granular bukan scope wajib MVP.

### Entitas roadmap

`customers`, `product_variants`, `inquiries`, `inquiry_items`, `quotations`,
`quotation_items`, `carts`, `cart_items`, `orders`, `order_items`, dan `payments`
disiapkan sebagai arah future roadmap. Jangan menambahkannya hanya untuk
memenuhi roadmap sebelum proses bisnisnya disepakati.

### Aturan integritas

- SKU dan slug harus unik.
- Produk nonaktif tidak tampil di katalog publik.
- Penghapusan produk harus menangani aset terkait.
- Relasi kategori tidak boleh membentuk siklus.
- Field sensitif user tidak boleh masuk response publik.

### Perubahan model

Setiap perubahan data harus disertai migration, validasi, perubahan kontrak API
yang relevan, dan test untuk aturan yang berubah.

## API Conventions

Bagian ini menjadi aturan umum untuk endpoint internal dan endpoint katalog.
Detail endpoint aktual harus mengikuti route dan controller yang tersedia.

### Request

- Validasi input dilakukan di server.
- Field wajib, tipe, ukuran, format, dan uniqueness harus dinyatakan jelas.
- Mutation yang mengubah data harus memiliki perlindungan CSRF sesuai mekanisme
  aplikasi.
- Query listing menggunakan parameter pencarian, filter, sorting, dan pagination
  yang konsisten.

### Response

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

### Pagination

Listing harus mengembalikan informasi halaman saat pagination digunakan, minimal
current page, per-page/limit, total, dan total pages bila tersedia.

### Public boundary

Response publik hanya boleh mengembalikan field katalog yang diperlukan. Jangan
mengembalikan credential, internal path yang sensitif, atau data user.

### Perubahan kontrak

Perubahan response atau parameter wajib memperbarui dokumentasi fitur, validasi,
dan test terkait.
