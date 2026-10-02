# Product Requirements Document — Web E-Catalog

**Status:** Draft — kondisi saat ini, target E-Catalog MVP, dan arah pengembangan  
**Versi:** 1.1  
**Tanggal:** 2 Oktober 2026  
**Platform:** Web responsive

## 1. Ringkasan Produk

Perusahaan adalah manufaktur tekstil yang telah berdiri sejak 1980. Saat ini proses penjualan masih banyak dilakukan secara manual: customer menghubungi sales melalui WhatsApp, sales mengirim katalog PDF, customer berdiskusi dan menegosiasikan harga, lalu pembayaran dan pemrosesan order dilakukan secara manual.

Web E-Catalog menjadi tahap pertama digitalisasi proses tersebut. Aplikasi memungkinkan pengunjung melihat produk aktif, mencari dan memfilter katalog, membuka detail produk, serta mengunduh file PDF produk tanpa login. Aplikasi juga menyediakan dashboard internal untuk staff dan admin dalam mengelola data produk, kategori, aset produk, user, dan role.

Produk ini berfungsi sebagai digital sales assistant, bukan pengganti tim sales. Tujuannya adalah mengurangi pekerjaan berulang, membantu customer menemukan produk secara mandiri, dan membuat proses request quotation lebih terstruktur.

### Tingkat cakupan PRD

PRD ini membedakan tiga tingkat cakupan agar fitur yang sudah tersedia tidak tercampur dengan rencana pengembangan:

1. **Current implementation:** fitur yang sudah terlihat pada kode project.
2. **E-Catalog MVP target:** fitur yang menjadi target penguatan versi E-Catalog, termasuk product gallery dan request quotation.
3. **Future roadmap:** arah pengembangan semi e-commerce dan full e-commerce; bersifat informatif dan belum menjadi scope implementasi saat ini.

## 2. Dasar Penyusunan

PRD ini disusun dari implementasi yang ada pada project Laravel, Inertia.js, dan React, termasuk route, controller, model, migration, serta halaman frontend.

### Teknologi yang digunakan saat ini

- PHP 8.3.
- Laravel 13.x.
- Inertia.js.
- React 19 dengan TypeScript.
- Tailwind CSS 4 dan Vite.
- Spatie Laravel Permission untuk role.
- Storage publik Laravel untuk gambar dan file PDF.

PRD ini menggunakan stack yang sedang dipakai repository. PostgreSQL, Laravel 12, atau penggantian stack tidak dianggap sebagai requirement dokumen ini.

### Arah arsitektur

Kode saat ini menggunakan controller, model Eloquent, route, dan halaman Inertia/React. Seiring bertambahnya fitur request quotation dan roadmap e-commerce, business logic baru sebaiknya dipisahkan secara bertahap dengan pola berikut:

```text
Controller
   ↓
Service
   ↓
Repository / Eloquent Query
   ↓
Database
```

Pola tersebut merupakan arah pengembangan maintainability, bukan klaim bahwa seluruh Service dan Repository sudah tersedia pada current implementation.

### Kondisi implementasi saat ini

- Katalog publik tersedia pada halaman utama.
- Hanya produk aktif yang ditampilkan kepada pengunjung.
- Pengunjung tidak perlu login untuk melihat detail dan mengunduh PDF.
- Login diperlukan untuk staff/user dan admin.
- Dashboard dilindungi autentikasi dan role `admin`.
- Produk memiliki satu gambar utama dan satu file PDF yang dapat diunduh.
- Kategori mendukung struktur parent-child.
- Admin saat ini memiliki akses yang sama.
- Fitur audit log, analitik, backup otomatis, dan CTA sales belum terlihat sebagai fitur aplikasi saat ini.

### Alur bisnis saat ini

```text
Customer
   ↓
WhatsApp Sales
   ↓
PDF Catalog
   ↓
Negosiasi
   ↓
Manual Bank Transfer
   ↓
Manual Order Processing
```

## 3. Masalah yang Diselesaikan

1. Informasi produk perlu tersedia dalam satu katalog digital yang terpusat.
2. Tim sales perlu menemukan detail produk dengan cepat ketika melayani customer.
3. Customer perlu mengakses informasi dan file produk tanpa proses login.
4. Admin perlu mengelola data produk, kategori, aset, user, dan role dari satu dashboard.
5. Data katalog perlu memiliki status publikasi sederhana agar produk yang belum siap tidak tampil kepada pengunjung.

Pain point bisnis yang menjadi dasar produk:

- Informasi produk tersebar dan dibagikan berulang kali secara manual.
- Sales perlu mengirim katalog PDF yang sama berulang kali.
- Customer belum dapat menelusuri produk secara mandiri.
- Pencarian produk di dalam katalog manual tidak efisien.
- Belum ada riwayat inquiry yang terstruktur.
- Proses manual sulit ditingkatkan skalanya.

## 4. Tujuan Produk

### Tujuan utama

- Menyediakan katalog produk publik yang mudah digunakan dan mudah dibagikan oleh tim sales.
- Mempercepat pencarian informasi produk berdasarkan nama, SKU, material, deskripsi, dan kategori.
- Menyediakan detail produk dan file PDF sebagai materi pendukung penjualan.
- Memungkinkan customer mengajukan request quotation dari informasi produk yang dipilih.
- Menyediakan tombol yang mengarahkan customer ke WhatsApp sales tanpa integrasi WhatsApp langsung.
- Memusatkan pengelolaan katalog pada dashboard internal.
- Menjaga konsistensi data melalui validasi, status aktif/nonaktif, dan pengelolaan role.

### Indikator keberhasilan

Indikator berikut perlu diukur setelah instrumentasi analitik tersedia:

- Waktu yang dibutuhkan staff sales untuk menemukan produk.
- Jumlah kunjungan halaman detail produk.
- Jumlah download file PDF produk.
- Persentase pencarian yang menghasilkan produk relevan.
- Persentase produk aktif yang memiliki gambar dan file PDF.
- Waktu respons halaman katalog dan dashboard.

### Customer journey yang dituju

```text
Visitor
   ↓
Browse Products
   ↓
Find Interested Products
   ↓
Request Quotation / Sample
   ↓
Sales Follow-up
   ↓
Deal
   ↓
(Future) Online Checkout
```

### Alasan E-Catalog menjadi tahap pertama

Proses penjualan perusahaan bersifat B2B dan belum cocok langsung dengan checkout e-commerce standar. Transaksi dapat melibatkan customer-specific pricing, negosiasi harga, minimum order quantity (MOQ), dynamic shipping cost, variable stock availability, dan special discount.

Karena itu, E-Catalog diprioritaskan untuk memperbaiki discovery produk dan inquiry terlebih dahulu. Fitur transaksi online baru dipertimbangkan setelah aturan operasional, harga, stok, pembayaran, dan pengiriman siap dikelola secara digital.

## 5. Cakupan Berdasarkan Tahap

### 5.1 Current implementation

Current implementation adalah fitur yang sudah tersedia berdasarkan kode project, yaitu katalog publik, pencarian, filter, sorting, detail produk, download PDF, autentikasi, dashboard admin, CRUD produk/kategori/user/role, dan pengelolaan aset.

### 5.2 Target E-Catalog MVP

Target MVP memperkuat katalog untuk kebutuhan customer dan sales dengan fitur berikut:

- Homepage dan product listing yang profesional.
- Product categories, search, filtering, sorting, dan pagination.
- Product detail page.
- Product gallery: satu gambar utama dan gambar tambahan per produk jika diperlukan.
- Download PDF produk.
- Request quotation dari halaman produk.
- Tombol WhatsApp yang membuka WhatsApp sales, idealnya dengan pesan awal yang memuat nama atau SKU produk.
- Admin CMS untuk mengelola katalog.

Request quotation pada MVP merupakan proses inquiry, bukan checkout dan bukan pembayaran online. Detail field, penerima inquiry, dan alur tindak lanjut ditentukan bersama proses bisnis sales.

### 5.3 Future roadmap

Roadmap berikut menggambarkan arah jangka panjang dan bukan scope wajib implementasi saat ini.

#### Phase 2 — Semi E-Commerce

Customer dapat membuat akun dan mengelola inquiry secara terstruktur tanpa pembayaran online:

- Customer login.
- Inquiry cart.
- Request quotation untuk beberapa produk.
- Inquiry history.
- Customer dashboard.

Tujuan phase ini adalah mengurangi percakapan WhatsApp yang berulang dan menggantinya dengan inquiry yang terdokumentasi.

#### Phase 3 — Full E-Commerce

Fitur transaksi baru dipertimbangkan setelah proses bisnis siap:

- Shopping cart.
- Checkout.
- Online payment.
- Order management.
- Shipment tracking.
- Invoice generation.
- Payment status.
- Customer order history.

### 5.4 Di luar scope implementasi saat ini

- Transaksi atau checkout.
- Pengelolaan harga, stok, pesanan, dan pembayaran.
- Permission granular per aksi untuk setiap role.
- Approval workflow multi-level.
- CRM atau pencatatan lead sales yang lengkap.
- Integrasi WhatsApp API, bot, webhook, atau sinkronisasi percakapan.

## 6. Persona dan Hak Akses

| Persona    | Deskripsi                                          | Akses                                                                              |
| ---------- | -------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Pengunjung | Customer atau pihak eksternal yang melihat katalog | Melihat katalog, mencari, memfilter, membuka detail, dan mengunduh PDF tanpa login |
| Staff/User | Staff internal, termasuk tim sales                 | Login dan mengakses area internal sesuai konfigurasi akses aplikasi                |
| Admin      | Pengelola katalog dan user                         | Mengakses dashboard, mengelola produk, kategori, aset, user, dan role              |

Pada versi saat ini, seluruh admin memiliki tingkat akses yang sama. Pengembangan permission granular dapat dilakukan pada fase berikutnya jika kebutuhan organisasi meningkat.

## 7. Ruang Lingkup Fitur

### 7.1 Katalog publik

#### Daftar produk

Pengunjung dapat:

- Melihat daftar produk aktif.
- Mencari produk berdasarkan nama, SKU, material, deskripsi, nama kategori, atau slug kategori.
- Memfilter berdasarkan satu atau beberapa kategori.
- Mengikutsertakan produk dari turunan kategori saat kategori induk dipilih.
- Mengurutkan berdasarkan terbaru, terlama, nama A-Z, atau nama Z-A.
- Mengubah tampilan antara grid dan list.
- Berpindah halaman menggunakan pagination.
- Menggunakan filter melalui tampilan desktop maupun mobile.

#### Detail produk

Detail produk menampilkan:

- Nama produk.
- SKU.
- Kategori dan jalur kategori induk.
- Material.
- Deskripsi.
- Satu gambar utama atau placeholder jika gambar belum tersedia.
- Indikator ketersediaan file.
- Link download file PDF jika tersedia.
- Link kembali ke katalog.

#### Target tambahan E-Catalog MVP

- Product gallery dengan satu gambar utama dan gambar tambahan yang dapat dilihat dari halaman detail.
- Tombol request quotation yang mengarahkan customer ke proses inquiry.
- Tombol WhatsApp yang membuka percakapan dengan sales. Tombol ini hanya berupa link/redirect dan tidak mencakup WhatsApp API, bot, webhook, atau sinkronisasi chat.

#### Aturan akses publik

- Produk nonaktif tidak boleh muncul pada katalog publik.
- Produk nonaktif tidak boleh diakses melalui halaman detail publik.
- Pengunjung tidak wajib login untuk mengakses katalog dan download PDF.

### 7.2 Autentikasi dan profil

Sistem harus menyediakan:

- Halaman login dengan email dan password.
- Opsi remember me.
- Validasi kredensial dan pesan kesalahan.
- Regenerasi session setelah login.
- Logout yang mengakhiri session.
- Halaman profil untuk user yang sedang login.
- Proteksi dashboard untuk user terautentikasi.
- Proteksi area admin menggunakan role admin.

### 7.3 Dashboard admin

Dashboard menampilkan:

- Total produk.
- Total produk aktif.
- Total kategori aktif.
- Produk yang belum memiliki file download.
- Produk yang belum memiliki thumbnail.
- Produk tanpa deskripsi.
- Produk nonaktif.
- Daftar produk terbaru.
- Shortcut atau akses ke pengelolaan kategori dan produk.

### 7.4 Pengelolaan produk

Admin dapat:

- Melihat daftar produk.
- Mencari produk.
- Memfilter produk berdasarkan status aktif/nonaktif.
- Membuat produk.
- Mengubah produk.
- Menghapus produk.
- Mengatur kategori, SKU, nama, slug, deskripsi, material, dan status.
- Mengunggah satu gambar produk.
- Mengunggah satu file PDF produk.
- Melihat aset yang sudah tersimpan.
- Menghapus gambar atau file yang sudah tersimpan.
- Mengganti aset dengan menghapus aset lama terlebih dahulu.

#### Target pengelolaan gallery pada MVP

- Admin dapat menyimpan satu gambar utama dan gambar tambahan untuk satu produk.
- Admin dapat menentukan gambar utama.
- Pengunjung dapat melihat gambar utama dan gambar tambahan pada halaman detail.
- Batas jumlah, ukuran, dan format gambar tambahan perlu ditetapkan sebelum implementasi final.

#### Validasi produk

- Kategori wajib berasal dari kategori yang tersedia.
- SKU wajib diisi dan unik.
- Nama, slug, dan material wajib diisi.
- Status aktif/nonaktif wajib ditentukan.
- Gambar hanya menerima JPG, JPEG, PNG, atau WEBP sampai 5 MB.
- File hanya menerima PDF sampai 10 MB.
- Satu produk hanya memiliki satu gambar dan satu file pada current implementation.
- MVP target dapat memperluas gambar menjadi satu gambar utama dan beberapa gambar tambahan.
- Produk yang dihapus ikut menghapus aset terkait dari storage.

### 7.5 Pengelolaan kategori

Admin dapat:

- Melihat daftar kategori.
- Mencari kategori.
- Memfilter kategori berdasarkan status.
- Membuat kategori.
- Mengubah kategori.
- Menghapus kategori.
- Menentukan parent category.
- Mengatur nama, slug, deskripsi, dan status aktif/nonaktif.

#### Aturan kategori

- Slug kategori harus unik.
- Kategori dapat memiliki parent dan child.
- Kategori tidak boleh menjadi parent bagi dirinya sendiri.
- Perubahan parent tidak boleh membuat siklus hierarki.
- Struktur kategori bertingkat yang ada saat ini dipertahankan.

### 7.6 Pengelolaan aset produk

Admin dapat:

- Melihat daftar gambar produk.
- Mencari gambar berdasarkan nama produk, SKU, atau path.
- Melihat daftar file produk.
- Mencari file berdasarkan nama file, path, nama produk, atau SKU.
- Melakukan preview file PDF dari dashboard.
- Melihat status thumbnail dan file download.
- Menghapus aset dari halaman pengelolaan produk.

### 7.7 Pengelolaan user

Admin dapat:

- Melihat daftar user.
- Mencari user berdasarkan nama atau email.
- Memfilter user berdasarkan status aktif/nonaktif.
- Membuat user.
- Mengubah user.
- Menghapus user.
- Menetapkan satu role kepada user.
- Mengatur nama, email, password, dan status user.

### 7.8 Pengelolaan role

Admin dapat:

- Melihat daftar role.
- Mencari role.
- Membuat role.
- Mengubah role.
- Menghapus role.
- Melihat jumlah user yang terkait dengan role.

Untuk versi saat ini, role admin memiliki akses yang sama. Permission detail per modul atau per aksi belum menjadi kebutuhan wajib.

## 8. Data Produk

Field produk yang dipertahankan:

| Field     |    Wajib | Keterangan                                                                |
| --------- | -------: | ------------------------------------------------------------------------- |
| Kategori  |       Ya | Kategori utama produk                                                     |
| SKU       |       Ya | Identitas unik produk                                                     |
| Nama      |       Ya | Nama produk                                                               |
| Slug      |       Ya | Identitas URL produk                                                      |
| Deskripsi |    Tidak | Informasi detail produk                                                   |
| Material  |       Ya | Material produk                                                           |
| Status    |       Ya | Aktif atau nonaktif                                                       |
| Gambar    |    Tidak | Satu gambar utama pada current implementation; gallery menjadi target MVP |
| File PDF  |    Tidak | Satu file yang dapat diunduh pada versi saat ini                          |
| Pembuat   | Otomatis | User yang membuat produk                                                  |

### Prinsip database

Model data MVP harus memprioritaskan kebutuhan katalog, tetapi tetap memberi ruang untuk perluasan e-commerce. Core table yang sudah relevan atau diproyeksikan meliputi:

- `users`.
- `products`.
- `product_categories`.
- `product_images`.
- `product_files`.
- `customers`.
- `product_variants`.
- `inquiries` dan `inquiry_items`.
- `quotations` dan `quotation_items`.
- `carts` dan `cart_items`.
- `orders` dan `order_items`.
- `payments`.

### Entitas untuk perluasan masa depan

Entitas customer, variant, inquiry, quotation, cart, order, dan payment tidak wajib diimplementasikan pada E-Catalog MVP. Entitas tersebut dapat ditambahkan bertahap tanpa mengganggu katalog ketika proses bisnis B2B sudah siap, dan tidak boleh menambah kompleksitas transaksi terlalu dini.

## 9. Kebutuhan Non-Fungsional

### Keamanan

- Dashboard hanya dapat diakses user yang sudah login.
- Area admin hanya dapat diakses user dengan role admin.
- Password harus disimpan menggunakan hashing.
- Validasi tipe dan ukuran file wajib diterapkan di server.
- Akses file dan route harus mengikuti hak akses yang ditentukan.
- Session harus diregenerasi saat login dan diinvalidasi saat logout.
- Data sensitif tidak boleh ditampilkan dalam response publik.
- Sistem perlu memiliki perlindungan terhadap upload file berbahaya dan path traversal.

### Performa

- Katalog harus tetap responsif saat jumlah produk bertambah.
- Pagination digunakan untuk daftar produk, kategori, user, gambar, dan file.
- Query relasi harus dioptimalkan untuk mencegah N+1 query.
- Gambar dan file harus disajikan melalui storage yang sesuai.
- Target awal waktu respons halaman utama dan detail produk: maksimal 2 detik pada kondisi normal, tidak termasuk waktu download file.

### Responsif dan usability

- Katalog dan dashboard harus dapat digunakan pada desktop, tablet, dan mobile.
- Filter katalog harus tersedia dalam bentuk sidebar desktop dan drawer mobile.
- Pesan sukses, error, validasi, dan konfirmasi penghapusan harus jelas.
- Navigasi dan label fitur harus konsisten untuk membantu penggunaan oleh tim sales.

### SEO dan discoverability

- Halaman katalog dan detail produk perlu memiliki title dan metadata yang relevan.
- URL detail produk harus stabil dan mudah dibagikan.
- Produk nonaktif tidak boleh diindeks oleh mesin pencari.
- Sitemap dan robots policy perlu disiapkan saat aplikasi dipublikasikan secara eksternal.

### Backup dan pemulihan

- Database perlu memiliki backup terjadwal.
- Storage gambar dan PDF perlu memiliki backup atau mekanisme replikasi.
- Prosedur restore perlu diuji secara berkala.
- Penghapusan produk dan aset perlu memiliki prosedur pemulihan sesuai kebijakan organisasi.

### Audit dan observability

- Sistem perlu mencatat aktivitas penting seperti login, perubahan produk, perubahan kategori, perubahan user, dan penghapusan aset.
- Error aplikasi dan kegagalan upload perlu dicatat dan dapat ditelusuri.
- Perlu tersedia monitoring kesehatan aplikasi, storage, database, dan queue jika digunakan.

## 10. Dukungan untuk Tim Sales

### Dukungan yang tersedia saat ini

- Pencarian produk berdasarkan beberapa atribut.
- Filter berdasarkan kategori bertingkat.
- Halaman detail yang dapat dibagikan melalui URL.
- Download PDF tanpa login.
- Tampilan grid dan list untuk kebutuhan browsing yang berbeda.
- Informasi produk terpusat dan dapat dikelola oleh admin.

### Dukungan sales pada target E-Catalog MVP

1. Product detail memiliki URL yang mudah dibagikan.
2. Customer dapat mengajukan request quotation dari produk yang diminati.
3. Customer dapat menekan tombol WhatsApp untuk membuka percakapan dengan sales.
4. Link WhatsApp dapat menyertakan konteks produk, seperti nama atau SKU, pada pesan awal.
5. Tidak ada integrasi WhatsApp API, bot, webhook, atau sinkronisasi chat pada MVP.

### Rekomendasi pengembangan setelah MVP

1. Tombol share untuk menyalin link produk atau membagikannya ke aplikasi komunikasi.
2. Pelacakan jumlah kunjungan detail, pencarian, request quotation, dan download PDF.
3. Informasi kontak sales berdasarkan kategori atau wilayah jika diperlukan.
4. Kemampuan menandai produk favorit atau membuat daftar produk untuk dibagikan.
5. Dukungan lebih dari satu dokumen, misalnya brosur, datasheet, sertifikat, atau manual.

Rekomendasi tersebut belum dianggap sebagai fitur current implementation dan perlu diprioritaskan kembali berdasarkan kebutuhan tim sales.

## 11. Future Enhancement

Fitur berikut dapat dipertimbangkan setelah versi saat ini stabil:

- Status `draft`, `published`, dan `archived`.
- Workflow approval katalog.
- Permission granular per role dan per aksi.
- Analitik pencarian, halaman detail, dan download.
- Audit log lengkap.
- Multi-file product documents.
- Export katalog ke PDF atau spreadsheet.
- Import produk secara massal.
- Integrasi CRM atau lead management.

## 12. Kriteria Penerimaan Utama

1. Pengunjung dapat membuka katalog tanpa login.
2. Pengunjung hanya melihat produk aktif.
3. Pengunjung dapat mencari, memfilter, mengurutkan, dan melakukan pagination katalog.
4. Pengunjung dapat membuka detail produk dan mengunduh PDF jika tersedia.
5. User yang belum login tidak dapat mengakses dashboard.
6. User non-admin tidak dapat mengakses route admin.
7. Admin dapat membuat, mengubah, dan menghapus produk dengan validasi yang sesuai.
8. Admin dapat mengelola kategori bertingkat tanpa membuat siklus parent-child.
9. Admin dapat mengelola user dan role.
10. Upload gambar dan PDF menolak format atau ukuran yang tidak sesuai.
11. Produk yang dihapus tidak meninggalkan aset file di storage.
12. Tampilan utama dapat digunakan pada desktop dan mobile.
13. Target MVP mendukung gallery dengan satu gambar utama dan gambar tambahan.
14. Target MVP menyediakan request quotation dari produk yang dipilih.
15. Target MVP menyediakan tombol/link WhatsApp menuju sales tanpa integrasi WhatsApp langsung.
16. Sistem memiliki rencana backup, keamanan, audit, monitoring, dan pemulihan sebelum digunakan sebagai aplikasi produksi.

## 13. Asumsi dan Keputusan

- PRD ini memisahkan current implementation, target E-Catalog MVP, dan future roadmap.
- Satu gambar dan satu PDF per produk dipertahankan untuk current implementation.
- Product gallery dan request quotation menjadi target E-Catalog MVP.
- Status aktif/nonaktif cukup untuk kebutuhan saat ini.
- Seluruh admin memiliki hak akses yang sama.
- Pengunjung tidak membutuhkan akun.
- Tombol WhatsApp menuju sales termasuk target MVP, sedangkan integrasi WhatsApp API tidak termasuk scope.
- Fitur semi e-commerce dan full e-commerce hanya menjadi arah roadmap, bukan scope implementasi saat ini.
- Detail prioritas, target waktu implementasi, dan target bisnis kuantitatif dapat ditetapkan pada perencanaan proyek berikutnya.
