# Architecture

## Status

Dokumen ini menjelaskan arsitektur saat ini dan arah target berdasarkan implementasi Laravel,
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

## Struktur Modul Dashboard Frontend

Untuk menjaga konsistensi pada kode frontend React di bawah `resources/js/pages/Dashboard/[NamaModul]`, setiap menu/modul mengikuti konvensi struktur file berikut:

```text
resources/js/pages/Dashboard/[NamaModul]/
├── Index.tsx            (Wajib)
├── Columns.tsx          (Opsional)
├── FormCreateEdit.tsx   (Opsional)
└── Detail.tsx           (Opsional)
```

### Keterangan Berkas & Perannya:

- **`Index.tsx` (Wajib)**:
  Page utama / entry point dari menu Inertia. Bertanggung jawab atas layout utama, pencarian (search), filter, sorting, pagination, integrasi `AlertComponent`, serta menampilkan tabel atau kontainer data.

- **`Columns.tsx` (Opsional)**:
  Mendefinisikan tipe data (interface) modul, komponen status badge, formatters, dan fungsi pembuat kolom tabel (`getColumns()`) untuk `DataTable`. Dipisah dari `Index.tsx` agar definisi tabel tetap bersih dan dapat diuji/diubah secara independen.

- **`FormCreateEdit.tsx` (Opsional)**:
  Formulir / dialog modal untuk operasi pembuatan (Create) maupun penyuntingan (Edit/Update) data. Dipisah menjadi berkas tersendiri agar kode form tidak menumpuk di `Index.tsx` atau `Columns.tsx`.

- **`Detail.tsx` (Opsional)**:
  Komponen modal / view khusus untuk menampilkan rincian/detail lengkap dari suatu entitas (read-only view) tanpa mengganggu flow tabel utama.

## Batas area

- Katalog publik hanya membaca produk aktif.
- Dashboard internal memerlukan autentikasi dan role `admin` atau `staff`.
- Route pengelolaan user, role, dan permission granular hanya memerlukan role `admin`.
- File gambar dan PDF dikelola melalui storage, bukan disimpan sebagai blob di
  database.
- Request quotation saat ini adalah inquiry yang disimpan di `request_quotations`, bukan checkout atau pembayaran.

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
| `price`       | Ya       | Harga dasar produk, minimal 0       |
| `slug`        | Ya       | Unik dan stabil untuk URL           |
| `description` | Tidak    | Deskripsi produk                    |
| `material`    | Ya       | Material produk                     |
| `is_active`   | Ya       | Menentukan visibilitas publik       |
| `created_by`  | Otomatis | User pembuat                        |

#### Product asset

Current implementation membatasi upload menjadi satu gambar utama dan satu file
PDF per produk. Relasi aset sudah memakai tabel `product_images` dan
`product_files` dengan penanda `is_thumbnail` dan `is_downloadable`, sehingga
MVP dapat menambahkan beberapa gambar dengan satu gambar yang ditandai sebagai
utama tanpa mengubah konsep relasi.

#### Category

Kategori memiliki nama, slug, deskripsi, status aktif, dan relasi parent-child.
Parent tidak boleh menunjuk dirinya sendiri atau membuat siklus hierarki.

#### User, role, dan permission

User memiliki identitas login, status aktif, role, dan permission. Sistem memiliki 2 role default:

- `admin`: memiliki akses penuh ke seluruh fitur dashboard termasuk pengelolaan user, role, dan permission granular.
- `staff`: memiliki akses operasional ke pengelolaan katalog produk, kategori, aset, dan inquiry quotation.

Pengelolaan role mendukung penetapan permission granular per modul (`products`, `categories`, `quotations`, `users`, `roles`) melalui UI matrix/checkbox di dashboard Admin.

#### Request quotation

Request quotation disimpan pada tabel `request_quotations`. Endpoint publik
membuat inquiry guest dari detail produk aktif, menyimpan snapshot `product_id`,
`product_name`, dan `product_sku`, lalu mengembalikan flash data berisi URL
WhatsApp Sales. Dashboard Staff/Admin dapat mencari, memfilter, dan mengubah
status inquiry. Komponen dialog update status/form dipisahkan ke dalam `FormCreateEdit.tsx` tersendiri agar konsisten dengan modul dashboard lainnya (`Product`, `ProductCategory`, dsb). Pemilihan status dan close reason pada UI menggunakan pemetaan label yang rapi (misal `In Progress` untuk `in_progress`), bukan menampilkan raw value ID.

Field utama:

| Field               | Wajib     | Aturan                                                    |
| ------------------- | --------- | --------------------------------------------------------- |
| `product_id`        | Tidak     | Nullable; menjadi null jika produk dihapus                |
| `product_name`      | Ya        | Snapshot nama produk                                      |
| `product_sku`       | Ya        | Snapshot SKU produk                                       |
| `customer_name`     | Ya        | Nama customer                                             |
| `customer_phone`    | Ya        | Nomor WhatsApp customer                                   |
| `company_name`      | Tidak     | Nama perusahaan                                           |
| `quantity`          | Tidak     | Minimal 1 jika diisi                                      |
| `notes`             | Tidak     | Catatan customer                                          |
| `status`            | Ya        | `new`, `in_progress`, atau `closed`                       |
| `closed_reason`     | Bersyarat | Wajib saat status `closed`: `won`, `lost`, atau `invalid` |
| `admin_notes`       | Tidak     | Catatan internal Staff/Admin                              |
| `status_changed_by` | Otomatis  | User terakhir yang mengubah status                        |
| `status_changed_at` | Otomatis  | Waktu perubahan status terakhir                           |

### Entitas roadmap

`customers`, `product_variants`, `quotations`, `quotation_items`, `carts`,
`cart_items`, `orders`, `order_items`, dan `payments`
disiapkan sebagai arah future roadmap. Jangan menambahkannya hanya untuk
memenuhi roadmap sebelum proses bisnisnya disepakati.

### Aturan integritas

- SKU dan slug harus unik.
- Harga produk tidak boleh negatif.
- Produk nonaktif tidak tampil di katalog publik.
- Penghapusan produk harus menangani aset terkait.
- Relasi kategori tidak boleh membentuk siklus.
- Field sensitif user tidak boleh masuk response publik.
- Request quotation publik hanya dapat dibuat untuk produk aktif.
- Perubahan status request quotation menggunakan optimistic concurrency melalui `updated_at`.

### Perubahan model

Setiap perubahan data harus disertai migration, validasi, perubahan kontrak API
yang relevan, dan test untuk aturan yang berubah.

## Route dan Response Conventions

Bagian ini menjadi aturan umum untuk route internal dan route katalog. Aplikasi
saat ini memakai Inertia page props, redirect, flash data, validasi Laravel, dan
pagination Eloquent. Struktur JSON standar hanya dipakai jika nanti dibuat
endpoint API khusus.

### Request

- Validasi input dilakukan di server.
- Field wajib, tipe, ukuran, format, dan uniqueness harus dinyatakan jelas.
- Mutation yang mengubah data harus memiliki perlindungan CSRF sesuai mekanisme
  aplikasi web Laravel.
- Query listing menggunakan parameter pencarian, filter, sorting, dan pagination
  yang konsisten.

### Response

Route Inertia mengembalikan page props untuk data awal, redirect untuk mutation,
dan flash message untuk feedback sukses atau data tambahan seperti
`whatsapp_url`. Error validasi dikembalikan melalui mekanisme validation errors
Laravel/Inertia agar dapat ditampilkan oleh form.

Jika aplikasi menambahkan endpoint JSON/API, response harus konsisten, memakai
status HTTP yang benar, dan tidak membocorkan informasi sensitif.

### Pagination

Listing harus mengembalikan informasi halaman saat pagination digunakan, minimal
current page, per-page/limit, total, dan total pages bila tersedia.

### Public boundary

Response publik hanya boleh mengembalikan field katalog yang diperlukan. Jangan
mengembalikan credential, internal path yang sensitif, atau data user.

### Perubahan kontrak

Perubahan response atau parameter wajib memperbarui dokumentasi fitur, validasi,
dan test terkait.
