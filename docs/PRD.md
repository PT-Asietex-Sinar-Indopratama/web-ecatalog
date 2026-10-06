# Product Requirements Document — Web E-Catalog

**Status:** Draft — kondisi saat ini, target E-Catalog MVP, dan arah pengembangan  
**Versi:** 1.2  
**Tanggal:** 6 Oktober 2026  
**Platform:** Web responsive

## 1. Ringkasan Produk

Perusahaan adalah manufaktur tekstil yang telah berdiri sejak 1980. Saat ini proses penjualan masih banyak dilakukan secara manual: customer menghubungi sales melalui WhatsApp, sales mengirim katalog PDF, customer berdiskusi dan menegosiasikan harga, lalu pembayaran dan pemrosesan order dilakukan secara manual.

Web E-Catalog menjadi tahap pertama digitalisasi proses tersebut. Aplikasi memungkinkan pengunjung melihat produk aktif, mencari dan memfilter katalog, membuka detail produk, serta mengunduh file PDF produk tanpa login. Aplikasi juga menyediakan dashboard internal bagi Staff dan Admin untuk mengelola katalog dan inquiry, sedangkan pengelolaan user dan role hanya tersedia bagi Admin.

Produk ini berfungsi sebagai digital sales assistant, bukan pengganti tim sales. Tujuannya adalah mengurangi pekerjaan berulang, membantu customer menemukan produk secara mandiri, dan membuat proses request quotation lebih terstruktur.

### Tingkat cakupan PRD

PRD ini membedakan tiga tingkat cakupan agar fitur yang sudah tersedia tidak tercampur dengan rencana pengembangan:

1. **Current implementation:** fitur yang sudah terlihat pada kode project.
2. **E-Catalog MVP target:** fitur yang menjadi target penguatan versi E-Catalog, terutama product gallery dan penyempurnaan operasional inquiry.
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
- Dashboard dilindungi autentikasi dan role `admin` atau `staff`.
- Produk memiliki satu gambar utama dan satu file PDF yang dapat diunduh.
- Produk memiliki harga dasar (`price`) yang ditampilkan pada detail produk dan dikelola dari dashboard.
- Kategori mendukung struktur parent-child.
- Request quotation dari halaman detail produk sudah tersimpan ke database, membuka WhatsApp Sales dengan pesan awal, dan dapat diproses Staff/Admin dari dashboard.
- User dengan role `staff` dapat mengakses fitur operasional katalog dan inquiry, sedangkan pengelolaan user dan role hanya tersedia untuk `admin`.
- Fitur audit log lengkap, analitik, backup otomatis, dan product gallery multi-gambar belum terlihat sebagai fitur aplikasi saat ini.

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
4. Staff dan Admin perlu mengelola data produk, kategori, aset, dan inquiry dari satu dashboard; pengelolaan user dan role hanya dilakukan oleh Admin.
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

Current implementation adalah fitur yang sudah tersedia berdasarkan kode project, yaitu katalog publik, pencarian, filter kategori bertingkat, sorting, detail produk, harga produk, download PDF, request quotation guest, redirect WhatsApp Sales, autentikasi, dashboard Staff/Admin, CRUD produk/kategori/user/role, pengelolaan aset, dan pengelolaan status inquiry.

### 5.2 Target E-Catalog MVP

Target MVP memperkuat katalog untuk kebutuhan customer dan sales dengan fitur berikut:

- Homepage dan product listing yang profesional.
- Product categories, search, filtering, sorting, dan pagination.
- Product detail page.
- Product gallery: satu gambar utama dan gambar tambahan per produk jika diperlukan.
- Download PDF produk.
- Penyempurnaan request quotation sesuai kebutuhan operasional.
- Tombol WhatsApp yang membuka WhatsApp sales, idealnya dengan pesan awal yang memuat nama atau SKU produk.
- CMS internal untuk Staff dan Admin dalam mengelola katalog.

Request quotation pada implementasi saat ini merupakan proses inquiry yang disimpan ke database, bukan checkout dan bukan pembayaran online. Seluruh Staff dan Admin dapat melihat dan memproses inquiry.

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
- Pengelolaan stok, pesanan, pembayaran, dan harga khusus per customer.
- Permission granular per aksi untuk setiap role.
- Approval workflow multi-level.
- CRM atau pencatatan lead sales yang lengkap.
- Integrasi WhatsApp API, bot, webhook, atau sinkronisasi percakapan.

## 6. Persona dan Hak Akses

| Persona    | Deskripsi                                          | Akses                                                                              |
| ---------- | -------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Pengunjung | Customer atau pihak eksternal yang melihat katalog | Melihat katalog, mencari, memfilter, membuka detail, dan mengunduh PDF tanpa login |
| Staff      | Tim operasional & sales internal                   | Mengakses seluruh fitur internal katalog & inquiry (tanpa kelola user/role)        |
| Admin      | Pengelola sistem, katalog, dan user                | Akses penuh dashboard: produk, kategori, inquiry, user, serta role & permission    |

Seluruh Staff dan Admin dapat melihat dan memproses inquiry. Hanya Admin yang dapat mengakses menu dan route pengelolaan user dan role. Pembatasan akses wajib diterapkan pada backend dan tidak hanya dengan menyembunyikan menu pada frontend. Pengelolaan role menyediakan seleksi permission granular per modul (products, categories, quotations, users, roles).

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
- Harga dasar produk.
- Deskripsi.
- Satu gambar utama atau placeholder jika gambar belum tersedia.
- Indikator ketersediaan file.
- Link download file PDF jika tersedia.
- Link kembali ke katalog.

#### Target tambahan E-Catalog MVP

- Product gallery dengan satu gambar utama dan gambar tambahan yang dapat dilihat dari halaman detail.
- Penyempurnaan product gallery dengan beberapa gambar tambahan.
- Penyempurnaan WhatsApp flow jika dibutuhkan. Integrasi saat ini berupa link/redirect dan tidak mencakup WhatsApp API, bot, webhook, atau sinkronisasi chat.

#### Request quotation

Request quotation adalah inquiry dari customer terhadap produk yang dipilih.
Fitur ini bukan checkout, bukan pembayaran, dan bukan order final.

Alur saat ini:

```text
Visitor membuka detail produk
   ↓
Memilih request quotation atau WhatsApp sales
   ↓
Mengirim konteks produk
   ↓
Sales menerima dan melakukan follow-up
```

Keputusan implementasi saat ini:

- Request quotation dapat dimulai dari halaman detail produk.
- Inquiry dapat dikirim sebagai guest tanpa login.
- Inquiry membawa konteks produk, minimal nama atau SKU.
- Field wajib: nama lengkap dan nomor WhatsApp.
- Field opsional: nama perusahaan, jumlah kebutuhan, dan catatan atau kebutuhan khusus.
- Inquiry disimpan ke database dengan status awal `new`.
- Data produk yang disimpan mencakup `product_id`, nama, dan SKU sebagai snapshot.
- Setelah inquiry berhasil disimpan, WhatsApp Sales dibuka dengan pesan yang sudah diisi konteks produk dan data inquiry.
- Nomor WhatsApp dikonfigurasi melalui `SALES_WHATSAPP_NUMBER`, dengan nomor dummy `6280000000000` untuk sementara.
- Kegagalan membuka WhatsApp tidak boleh membatalkan atau menghapus inquiry yang sudah tersimpan.
- Seluruh Staff dan Admin dapat melihat, memproses, menambahkan catatan, mengubah status, menutup, dan membuka kembali inquiry.
- Inquiry tidak ditugaskan kepada satu Staff tertentu.
- Status inquiry terdiri dari `new`, `in_progress`, dan `closed`.
- Inquiry yang ditutup wajib memiliki alasan `won`, `lost`, atau `invalid`.
- Sistem mencatat user dan waktu untuk setiap perubahan status, penutupan, pembukaan kembali, dan perubahan penting lainnya.
- Sistem harus mencegah perubahan diam-diam ketika dua user memperbarui inquiry yang sama, minimal dengan mendeteksi bahwa data telah berubah sejak halaman dibuka dan meminta user memuat ulang data terbaru.
- Inquiry baru harus mulai ditindaklanjuti maksimal satu hari kerja setelah diterima.
- Inquiry berstatus `new` yang melewati satu hari kerja ditandai terlambat pada dashboard.
- Inquiry yang diterima di luar jam kerja mulai dihitung pada hari kerja berikutnya. Definisi hari dan jam kerja mengikuti konfigurasi operasional perusahaan.

Keamanan dan pencegahan penyalahgunaan request quotation:

- Maksimal lima pengiriman inquiry dari satu alamat IP dalam 15 menit.
- Maksimal sepuluh pengiriman inquiry dari satu alamat IP dalam 24 jam.
- Kombinasi nomor WhatsApp dan produk yang sama tidak dapat dikirim kembali dalam 10 menit.
- Nilai batas dan periode pembatasan harus dapat diubah melalui konfigurasi aplikasi.
- Tombol submit dinonaktifkan selama request diproses untuk mencegah pengiriman berulang dari antarmuka.
- Pelanggaran rate limit menampilkan pesan umum tanpa membocorkan aturan keamanan secara terperinci dan dicatat dalam security log.
- Jika alamat IP disimpan hanya untuk pembatasan dan deteksi penyalahgunaan, alamat tersebut disimpan dalam bentuk hash.
- Data inquiry hanya dapat diakses oleh Staff dan Admin melalui endpoint yang dilindungi autentikasi dan otorisasi backend.
- Form menjelaskan bahwa data customer digunakan untuk menindaklanjuti permintaan quotation.

Di luar scope request quotation saat ini:

- Harga otomatis, diskon otomatis, atau customer-specific pricing.
- Checkout, pembayaran, stok, pengiriman, dan invoice.
- Inquiry cart dan inquiry history terautentikasi; ini adalah roadmap Phase 2.

#### Product assets publik

- Gambar produk digunakan untuk thumbnail dan detail.
- File PDF digunakan sebagai materi download produk.
- Gallery gambar tambahan menjadi target E-Catalog MVP.
- Satu produk memiliki satu gambar utama dan satu file PDF pada current implementation.
- Satu gambar ditetapkan sebagai gambar utama pada target gallery MVP.
- Gambar tambahan dapat ditampilkan di halaman detail.
- Batas jumlah gambar tambahan masih perlu ditetapkan sebelum implementasi final.

#### Aturan akses publik

- Produk nonaktif tidak boleh muncul pada katalog publik.
- Produk nonaktif tidak boleh diakses melalui halaman detail publik.
- Pengunjung tidak wajib login untuk mengakses katalog dan download PDF.
- File PDF hanya ditampilkan jika tersedia dan valid.
- URL detail harus stabil dan mudah dibagikan.
- Metadata halaman harus mendukung SEO; produk nonaktif tidak boleh diindeks.

### 7.2 Autentikasi dan profil

Sistem harus menyediakan:

- Halaman login dengan email dan password.
- Opsi remember me.
- Validasi kredensial dan pesan kesalahan.
- Regenerasi session setelah login.
- Logout yang mengakhiri session.
- Halaman profil untuk user yang sedang login.
- Proteksi dashboard untuk Staff dan Admin yang terautentikasi.
- Proteksi pengelolaan user dan role menggunakan role Admin.

### 7.3 Dashboard internal

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

Staff dan Admin dapat:

- Melihat daftar produk.
- Mencari produk.
- Memfilter produk berdasarkan status aktif/nonaktif.
- Membuat produk.
- Mengubah produk.
- Menghapus produk.
- Mengatur kategori, SKU, nama, slug, harga dasar, deskripsi, material, dan status.
- Mengunggah satu gambar produk.
- Mengunggah satu file PDF produk.
- Melihat aset yang sudah tersimpan.
- Menghapus gambar atau file yang sudah tersimpan.
- Mengganti aset dengan menghapus aset lama terlebih dahulu.

#### Target pengelolaan gallery pada MVP

- Staff dan Admin dapat menyimpan satu gambar utama dan gambar tambahan untuk satu produk.
- Staff dan Admin dapat menentukan gambar utama.
- Pengunjung dapat melihat gambar utama dan gambar tambahan pada halaman detail.
- Batas jumlah, ukuran, dan format gambar tambahan perlu ditetapkan sebelum implementasi final.

#### Validasi produk

- Kategori wajib berasal dari kategori yang tersedia.
- SKU wajib diisi dan unik.
- Nama, slug, dan material wajib diisi.
- Harga dasar wajib diisi, numerik, dan tidak boleh bernilai negatif.
- Status aktif/nonaktif wajib ditentukan.
- Gambar hanya menerima JPG, JPEG, PNG, atau WEBP sampai 5 MB.
- File hanya menerima PDF sampai 10 MB.
- Satu produk hanya memiliki satu gambar dan satu file pada current implementation.
- MVP target dapat memperluas gambar menjadi satu gambar utama dan beberapa gambar tambahan.
- Produk yang dihapus ikut menghapus aset terkait dari storage.

### 7.5 Pengelolaan kategori

Staff dan Admin dapat:

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

Staff dan Admin dapat:

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
- Memilih dan mengatur hak akses / permission granular per modul (`products`, `categories`, `quotations`, `users`, `roles`) untuk setiap role.
- Melihat jumlah user yang terkait dengan role.

## 8. Data Produk

Field produk yang dipertahankan:

| Field     |    Wajib | Keterangan                                                                |
| --------- | -------: | ------------------------------------------------------------------------- |
| Kategori  |       Ya | Kategori utama produk                                                     |
| SKU       |       Ya | Identitas unik produk                                                     |
| Nama      |       Ya | Nama produk                                                               |
| Harga     |       Ya | Harga dasar produk yang ditampilkan di detail dan dikelola dari dashboard |
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
- `request_quotations`.
- `customers`.
- `product_variants`.
- `quotations` dan `quotation_items`.
- `carts` dan `cart_items`.
- `orders` dan `order_items`.
- `payments`.

### Entitas untuk perluasan masa depan

Entitas `request_quotations` sudah digunakan untuk menyimpan request quotation saat ini. Entitas customer, variant, quotation, cart, order, dan payment tidak wajib diimplementasikan pada E-Catalog MVP. Entitas tersebut dapat ditambahkan bertahap tanpa mengganggu katalog ketika proses bisnis B2B sudah siap dan tidak boleh menambah kompleksitas transaksi terlalu dini.

## 9. Kebutuhan Non-Fungsional

### Keamanan

- Dashboard hanya dapat diakses user yang sudah login.
- Dashboard internal hanya dapat diakses user dengan role Staff atau Admin.
- Pengelolaan user dan role hanya dapat diakses user dengan role Admin.
- Password harus disimpan menggunakan hashing.
- Validasi tipe dan ukuran file wajib diterapkan di server.
- Akses file dan route harus mengikuti hak akses yang ditentukan.
- Session harus diregenerasi saat login dan diinvalidasi saat logout.
- Data sensitif tidak boleh ditampilkan dalam response publik.
- Sistem perlu memiliki perlindungan terhadap upload file berbahaya dan path traversal.
- Otorisasi Staff dan Admin wajib diterapkan pada route dan action backend, bukan hanya pada tampilan frontend.
- Aplikasi wajib menerapkan perlindungan terhadap CSRF, XSS, SQL injection, mass assignment, dan request berulang.
- Endpoint login dan pengiriman inquiry wajib menggunakan rate limiting.
- Data inquiry tidak boleh tersedia melalui endpoint publik dan hanya dapat diakses oleh Staff dan Admin yang terautentikasi.
- Validasi inquiry dan upload file wajib dilakukan di server meskipun frontend juga melakukan validasi.
- Pesan error publik tidak boleh membocorkan stack trace, query database, path server, credential, atau detail internal lainnya.
- Aktivitas pemrosesan inquiry, perubahan status, penutupan, dan pembukaan kembali wajib dicatat beserta user dan waktunya.

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
- Request quotation dari detail produk yang tersimpan sebelum WhatsApp Sales dibuka.
- Dashboard inquiry untuk melihat, memfilter, dan mengubah status request quotation.
- Informasi produk terpusat dan dapat dikelola oleh Staff dan Admin.

### Dukungan sales pada target berikutnya

1. Product detail memiliki URL yang mudah dibagikan.
2. Product gallery menampilkan gambar tambahan selain gambar utama.
3. Flow inquiry dapat diperkaya dengan SLA operasional dan notifikasi internal bila dibutuhkan.
4. Tidak ada integrasi WhatsApp API, bot, webhook, atau sinkronisasi chat pada MVP.

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
6. User tanpa role Staff atau Admin tidak dapat mengakses dashboard internal.
7. Staff dan Admin dapat membuat, mengubah, dan menghapus produk dengan validasi yang sesuai.
8. Staff dan Admin dapat mengelola kategori bertingkat tanpa membuat siklus parent-child.
9. Admin dapat mengelola user dan role.
10. Upload gambar dan PDF menolak format atau ukuran yang tidak sesuai.
11. Produk yang dihapus tidak meninggalkan aset file di storage.
12. Tampilan utama dapat digunakan pada desktop dan mobile.
13. Target MVP mendukung gallery dengan satu gambar utama dan gambar tambahan.
14. Current implementation menyediakan request quotation dari produk yang dipilih.
15. Current implementation menyediakan tombol/link WhatsApp menuju sales tanpa integrasi WhatsApp langsung.
16. Sistem memiliki rencana backup, keamanan, audit, monitoring, dan pemulihan sebelum digunakan sebagai aplikasi produksi.
17. Request quotation yang valid tersimpan ke database dengan status awal `new` sebelum WhatsApp dibuka.
18. Seluruh Staff dan Admin dapat memproses inquiry, sedangkan hanya Admin yang dapat mengakses pengelolaan user dan role.
19. Inquiry menggunakan status `new`, `in_progress`, atau `closed`; status `closed` wajib memiliki alasan `won`, `lost`, atau `invalid`.
20. Inquiry `new` yang belum ditindaklanjuti setelah satu hari kerja ditandai terlambat.
21. Pengiriman inquiry dibatasi berdasarkan IP serta kombinasi nomor WhatsApp dan produk sesuai konfigurasi aplikasi.
22. Percobaan akses inquiry tanpa autentikasi atau tanpa role yang sesuai ditolak oleh backend.
23. Sistem mendeteksi konflik ketika dua user mencoba memperbarui inquiry yang sama berdasarkan data yang sudah tidak terbaru.

## 13. Asumsi dan Keputusan

- PRD ini memisahkan current implementation, target E-Catalog MVP, dan future roadmap.
- Satu gambar dan satu PDF per produk dipertahankan untuk current implementation.
- Product gallery menjadi target E-Catalog MVP; request quotation dasar sudah tersedia pada current implementation.
- Status aktif/nonaktif cukup untuk kebutuhan saat ini.
- Seluruh admin memiliki hak akses yang sama.
- Pengunjung tidak membutuhkan akun.
- Tombol WhatsApp menuju sales sudah tersedia sebagai redirect/link, sedangkan integrasi WhatsApp API tidak termasuk scope.
- Request quotation wajib disimpan ke database sebelum WhatsApp dibuka.
- Seluruh Staff dan Admin dapat memproses inquiry tanpa penugasan kepada satu Staff tertentu.
- Staff dapat mengakses seluruh fitur internal kecuali pengelolaan user dan role.
- SLA tindak lanjut pertama inquiry adalah maksimal satu hari kerja.
- Status inquiry dibatasi menjadi `new`, `in_progress`, dan `closed`, dengan alasan penutupan `won`, `lost`, atau `invalid`.
- Fitur semi e-commerce dan full e-commerce hanya menjadi arah roadmap, bukan scope implementasi saat ini.
- Detail prioritas dan target waktu implementasi dapat ditetapkan pada perencanaan proyek berikutnya.
