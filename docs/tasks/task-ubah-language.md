# Task: Implementasi Fitur Multi-Bahasa (Internationalization / i18n)

## 📌 Deskripsi Task

Menambahkan dukungan multi-bahasa pada aplikasi Web E-Catalog (Laravel + Inertia React) untuk mendukung **Bahasa Indonesia (`id`)** dan **Bahasa Portugis (`pt`)** secara manual (native i18n, tanpa Google Translate widget).

---

## 🎯 Tujuan & Target

1. Pengguna dapat memilih dan mengganti bahasa antara **Bahasa Indonesia** dan **Bahasa Portugis**.
2. Preferensi bahasa disimpan di **Session / Cookie / User Preference** agar konsisten saat berpindah halaman.
3. Semua teks statis pada UI (Navbar, Footer, Button, Header, Label, Pesan Toast/Alert) menggunakan kamus terjemahan JSON (`id.json` dan `pt.json`).
4. Komponen **Language Switcher UI** yang bersih, modern, dan mudah diakses ditempatkan pada Header/Navbar.

---

## 🏗️ Arsitektur & Pendekatan Teknis

### 1. Backend (Laravel)

- **Folder Lokalisasi:** Membuat file kamus terjemahan:
    - `lang/id.json`
    - `lang/pt.json`
- **Middleware `SetLocale`:**
    - Memeriksa preferensi bahasa dari Session / Cookie / Header request.
    - Memasang locale aktif Laravel menggunakan `App::setLocale($locale)`.
- **Inertia Shared Props:**
    - Mengirimkan `locale` aktif dan dictionary terjemahan ke React frontend melalui `HandleInertiaRequests.php`.
- **Route Switcher:**
    - Menambahkan endpoint `POST /locale` atau `GET /locale/{lang}` untuk memproses pergantian bahasa.

### 2. Frontend (Inertia React)

- **Helper / Context i18n:**
    - Membuat fungsi helper React `__(key, replace = {})` atau Context `useTranslation()` untuk menerjemahkan string berdasarkan key JSON.
- **Komponen `LanguageSwitcher`:**
    - Diletakkan pada Navigation Bar / Header.
    - Menampilkan penanda bahasa aktif (`ID` vs `PT`).
    - Mengirim request ganti bahasa ke server saat dipilih tanpa merusak UX/state aplikasi.

---

## 📑 Rencana Langkah Kerja (Checklist Implementasi)

- [ ] **Langkah 1: Setup File Terjemahan Backend**
    - [ ] Buat file `lang/id.json`
    - [ ] Buat file `lang/pt.json`
    - [ ] Isi struktur key-value dasar untuk komponen umum (Navigation, Buttons, Auth, Common, Footer).

- [ ] **Langkah 2: Middleware & Controller Laravel**
    - [ ] Buat Middleware `SetLocale.php` untuk menangani pembacaan & penyimpanan locale dari session.
    - [ ] Daftarkan middleware pada `bootstrap/app.php` / web middleware stack.
    - [ ] Buat `SetLocaleController.php` (atau route handler) untuk memproses aksi ganti bahasa.
    - [ ] Share data `locale` dan `translations` di `HandleInertiaRequests.php`.

- [ ] **Langkah 3: Helper & Integration Frontend (React)**
    - [ ] Buat helper / hook terjemahan di frontend (`resources/js/hooks/useTranslation.ts` atau `resources/js/utils/i18n.ts`).
    - [ ] Integrasikan `locale` dan `translations` dari Inertia shared props.

- [ ] **Langkah 4: Komponen Language Switcher UI**
    - [ ] Buat komponen `LanguageSwitcher.tsx` menggunakan UI/styling project saat ini (Tailwind CSS / Shadcn UI).
    - [ ] Pasang `LanguageSwitcher` pada Navigation Bar / Header utama.

- [ ] **Langkah 5: Refactoring Teks UI ke i18n Key**
    - [ ] Ubah string statis di Navbar & Footer menggunakan `__('Key')`.
    - [ ] Ubah string statis di Halaman Beranda / Katalog.
    - [ ] Ubah string statis di Form & Pesan Respon.

- [ ] **Langkah 6: Pengujian & Validasi**
    - [ ] Uji alur pergantian bahasa dari ID ke PT dan sebaliknya.
    - [ ] Pastikan preferensi bahasa bertahan setelah refresh halaman.
    - [ ] Pastikan tidak ada layout breaking akibat perbedaan panjang kata antara Bahasa Indonesia dan Portugis.

---

## 📝 Catatan Penting

- **Kualitas Terjemahan:** Terjemahan Bahasa Portugis harus disesuaikan secara manual dan natural (bukan hasil translate mentah tanpa konteks) agar pengalaman pengguna tetap profesional.
- **Performa:** Kamus terjemahan JSON di-share ke Inertia secara efisien agar tidak memperberat payload JS.
