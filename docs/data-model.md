# Data Model

## Tujuan

Dokumen ini mendefinisikan data yang dibutuhkan katalog dan batas perluasan
menuju inquiry atau e-commerce.

## Entitas katalog saat ini

### Product

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

### Product asset

Current implementation memiliki satu gambar utama dan satu file PDF per produk.
MVP dapat menambahkan beberapa gambar dengan satu gambar yang ditandai sebagai
utama.

### Category

Kategori memiliki nama, slug, deskripsi, status aktif, dan relasi parent-child.
Parent tidak boleh menunjuk dirinya sendiri atau membuat siklus hierarki.

### User dan role

User memiliki identitas login, status aktif, dan role. Pada versi saat ini role
admin memiliki akses yang sama; permission granular bukan scope wajib MVP.

## Entitas roadmap

`customers`, `product_variants`, `inquiries`, `inquiry_items`, `quotations`,
`quotation_items`, `carts`, `cart_items`, `orders`, `order_items`, dan `payments`
disiapkan sebagai arah future roadmap. Jangan menambahkannya hanya untuk
memenuhi roadmap sebelum proses bisnisnya disepakati.

## Aturan integritas

- SKU dan slug harus unik.
- Produk nonaktif tidak tampil di katalog publik.
- Penghapusan produk harus menangani aset terkait.
- Relasi kategori tidak boleh membentuk siklus.
- Field sensitif user tidak boleh masuk response publik.

## Perubahan model

Setiap perubahan data harus disertai migration, validasi, perubahan kontrak API
yang relevan, dan test untuk aturan yang berubah.
