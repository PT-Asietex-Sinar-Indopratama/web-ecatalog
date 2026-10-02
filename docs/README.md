# Dokumentasi Web E-Catalog

Dokumentasi ini melengkapi [PRD](./PRD.md) dengan panduan arsitektur, domain,
fitur, keamanan, operasional, dan pengujian.

## Urutan membaca

1. [PRD](./PRD.md) — tujuan, scope, persona, dan kriteria penerimaan.
2. [Architecture](./architecture.md) — struktur teknis dan alur aplikasi.
3. [Data Model](./data-model.md) — entitas dan batas data.
4. Dokumentasi fitur — perilaku katalog publik, CMS admin, aset, dan inquiry.
5. Dokumentasi operasional — deployment, backup, keamanan, dan monitoring.

## Daftar dokumentasi

| Dokumen                                                             | Fungsi                                           |
| ------------------------------------------------------------------- | ------------------------------------------------ |
| [Architecture](./architecture.md)                                   | Struktur aplikasi dan arah maintainability       |
| [Data Model](./data-model.md)                                       | Entitas, field, relasi, dan fase implementasi    |
| [Public Catalog](./public-catalog.md)                               | Katalog yang diakses pengunjung                  |
| [Admin CMS](./admin-cms.md)                                         | Dashboard dan CRUD admin                         |
| [Authentication & Authorization](./authentication-authorization.md) | Login, session, role, dan akses                  |
| [Product Assets](./product-assets.md)                               | Gambar, PDF, upload, dan storage                 |
| [Request Quotation](./request-quotation.md)                         | Inquiry MVP dan WhatsApp sales                   |
| [API Conventions](./api-conventions.md)                             | Kontrak request, response, error, dan pagination |
| [Security](./security.md)                                           | Kontrol keamanan aplikasi                        |
| [Non-functional Requirements](./non-functional-requirements.md)     | Performa, UX, SEO, audit, dan observability      |
| [Testing & Acceptance](./testing-acceptance.md)                     | Skenario uji dan checklist penerimaan            |
| [Deployment](./deployment.md)                                       | Build dan deployment                             |
| [Backup & Recovery](./operations-backup-recovery.md)                | Backup, restore, dan operasional                 |
| [Sales Workflow](./sales-workflow.md)                               | Alur kerja sales sebelum dan sesudah MVP         |

## Keputusan arsitektur

- [ADR-001: Laravel, Inertia, dan React](./decisions/001-use-laravel-inertia-react.md)
- [ADR-002: E-Catalog sebelum E-Commerce](./decisions/002-e-catalog-before-ecommerce.md)

Dokumentasi ini tidak menggantikan PRD. Jika terdapat perbedaan scope, PRD dan
keputusan bisnis terbaru menjadi acuan utama.
