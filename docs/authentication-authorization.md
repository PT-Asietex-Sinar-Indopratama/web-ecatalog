# Authentication & Authorization

## Authentication

Sistem menyediakan login email/password, remember me, pesan error validasi,
regenerasi session setelah login, profile untuk user login, dan logout yang
mengakhiri session.

## Authorization

- Katalog publik dapat diakses tanpa login.
- Dashboard memerlukan user terautentikasi.
- Area admin memerlukan role `admin`.
- Admin saat ini memiliki tingkat akses yang sama.
- Permission granular per aksi dapat ditambahkan pada fase berikutnya.

## Session dan data sensitif

- Session diregenerasi saat login.
- Session diinvalidasi saat logout.
- Password disimpan menggunakan hashing.
- Token, credential, dan atribut sensitif tidak boleh dikirim ke halaman publik.

## Acceptance criteria

1. Visitor dapat membuka katalog tanpa login.
2. User yang belum login ditolak dari dashboard.
3. User non-admin ditolak dari route admin.
4. Logout mengakhiri akses session sebelumnya.
5. Perubahan role diuji pada request dan bukan hanya pada tampilan UI.
