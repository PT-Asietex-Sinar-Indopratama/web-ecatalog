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
5. Gunakan ADR untuk keputusan yang berdampak lintas fitur.
