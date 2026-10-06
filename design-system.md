# Design System Guidelines (`design-system.md`)

Dokumen ini menjadi panduan sistem desain untuk project **web-ecatalog** sesuai implementasi saat ini di `resources/css/app.css`, komponen `resources/js/components/ui`, layout publik, dan dashboard internal.

## 1. Arah Visual

- UI publik berfungsi sebagai katalog produk B2B: bersih, mudah dipindai, dan membantu customer menemukan produk tanpa banyak distraksi.
- Dashboard internal mengutamakan kepadatan informasi, navigasi cepat, tabel yang mudah dibaca, filter yang jelas, dan feedback aksi yang langsung terasa.
- Gunakan komponen shadcn/Base UI yang sudah tersedia sebelum membuat pola baru. Ikon menggunakan `lucide-react`.
- Hindari dekorasi generik yang tidak membantu konteks produk. Visual utama harus mendukung produk, aset katalog, atau workflow operasional.

## 2. Token Aktual

Token warna dan radius utama didefinisikan di `resources/css/app.css` dengan format OKLCH. Gunakan token Tailwind/tema, bukan hard-coded hex baru, kecuali untuk aset khusus yang memang perlu.

| Token                                    | Penggunaan                              |
| ---------------------------------------- | --------------------------------------- |
| `background` / `foreground`              | Latar dan teks halaman utama            |
| `card` / `card-foreground`               | Card produk, panel dashboard, modal     |
| `primary` / `primary-foreground`         | CTA utama, active state, link penting   |
| `secondary` / `secondary-foreground`     | Tombol sekunder dan permukaan pendukung |
| `muted` / `muted-foreground`             | Empty state, metadata, helper text      |
| `accent` / `accent-foreground`           | Hover/selected subtle state             |
| `destructive` / `destructive-foreground` | Delete, error, aksi berisiko            |
| `border`, `input`, `ring`                | Border form, focus ring, outline        |
| `sidebar-*`                              | Navigasi dashboard                      |

Aturan warna:

- Pertahankan kontras teks minimal WCAG AA untuk teks normal.
- Gunakan `primary` untuk aksi yang benar-benar utama, misalnya submit quotation atau simpan data.
- Badge status harus mudah dibedakan: gunakan varian semantik yang ada dan hindari hanya mengandalkan warna tanpa label.
- Mode gelap sudah memiliki token `.dark`; komponen baru harus memakai token agar tetap kompatibel.

## 3. Tipografi

- Font utama adalah `Figtree Variable` melalui `@fontsource-variable/figtree`.
- `font-sans` adalah default aplikasi. `font-mono` hanya untuk data teknis seperti SKU, ID, atau nilai yang perlu dipindai presisi.
- Jangan menambah keluarga font baru tanpa kebutuhan kuat.

Skala umum:

- Page title/detail produk: `text-3xl`, `font-semibold` atau `font-bold`.
- Section title/dashboard card title: `text-lg` sampai `text-xl`, `font-semibold`.
- Body dan tabel: `text-sm` dengan leading yang cukup.
- Metadata, helper text, dan caption: `text-xs` atau `text-sm` dengan `text-muted-foreground`.

## 4. Layout dan Radius

- Spacing mengikuti kelipatan Tailwind 4px: `gap-2`, `gap-4`, `gap-6`, `gap-8`.
- Container publik memakai padding responsif dan area katalog yang jelas antara sidebar filter dan daftar produk.
- Radius dasar aplikasi adalah `--radius: 0.625rem`; gunakan `rounded-md`, `rounded-lg`, atau `rounded-xl` sesuai komponen. Hindari radius yang terlalu besar pada tabel dan tool surface.
- Product image memakai rasio stabil agar grid tidak melompat saat data berubah.
- Tabel dashboard harus mempertahankan alignment kolom, sort state, filter, dan pagination yang konsisten.

## 5. Pola Komponen Saat Ini

### Katalog Publik

- Halaman utama memakai hero image dari aset lokal, search sticky di mobile, filter sidebar di desktop, dan drawer filter di mobile.
- Product card grid/list harus menampilkan gambar/placeholder, nama, kategori atau metadata penting, dan akses ke detail.
- Toggle grid/list memakai ikon `Grid2x2` dan `List`; label boleh disembunyikan di layar kecil jika ikon sudah jelas.
- Pagination harus mempertahankan query filter, sort, dan pencarian.

### Detail Produk

- Detail produk menampilkan gambar utama atau placeholder, kategori, nama, SKU, harga IDR, material, status file, deskripsi, CTA `Minta penawaran`, dan tombol unduh katalog.
- Dialog request quotation harus menjaga fokus input pertama yang error, menonaktifkan submit saat proses berjalan, dan tidak menutup paksa saat request sedang diproses.
- WhatsApp dibuka setelah inquiry berhasil tersimpan; kegagalan popup tidak boleh menghapus inquiry.

### Dashboard

- Sidebar dashboard menampilkan menu operasional sesuai role.
- Tabel menggunakan search, filter status/tanggal bila relevan, sort, pagination, dan action dropdown.
- Form create/edit produk wajib menampilkan field kategori, SKU, nama, harga, slug, deskripsi, material, status, gambar, dan file PDF.
- Request quotation dashboard menampilkan customer, produk, status, tanggal, dan aksi update status dengan alasan penutupan saat status `closed`.

## 6. Motion dan Feedback

- Motion dipakai untuk feedback ringan: hover, active state, drawer/dialog transition, dan loading/processing.
- Durasi micro-interaction: 150-200ms.
- Transisi dialog/drawer mengikuti komponen Base UI/shadcn yang ada.
- Jangan membuat animasi yang memperlambat dashboard atau mengganggu input data.
- Toast/flash message dipakai untuk aksi sukses/gagal. Copy harus spesifik terhadap aksi, misalnya "Status inquiry berhasil diperbarui."

## 7. Aksesibilitas dan Copy

- Gunakan semantic HTML: `<header>`, `<nav>`, `<main>`, `<aside>`, `<section>`, dan `<footer>` sesuai struktur.
- Semua gambar produk wajib memiliki `alt` yang bermakna; placeholder harus tetap informatif.
- Icon-only button wajib memiliki `aria-label` atau tooltip.
- Form wajib punya label, error message, `aria-invalid`, dan `aria-describedby` saat error.
- Copy menggunakan Bahasa Indonesia yang lugas dan profesional. Hindari pesan internal seperti stack trace, nama query, atau path server.

## 8. Prinsip Perubahan UI

- Ikuti token dan komponen yang sudah ada sebelum menambah variasi baru.
- Perubahan pada katalog publik harus diuji di desktop dan mobile.
- Perubahan pada dashboard harus mempertahankan workflow cepat untuk Staff/Admin.
- Jika menambah pola visual baru, dokumentasikan token, state, dan penggunaan di dokumen ini.
