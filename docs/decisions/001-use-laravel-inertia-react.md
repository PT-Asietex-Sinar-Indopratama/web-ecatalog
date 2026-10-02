# ADR-001: Menggunakan Laravel, Inertia.js, dan React

- **Status:** Accepted
- **Tanggal:** 2026-10-02

## Context

Repository saat ini sudah menggunakan Laravel, Inertia.js, React 19 dengan
TypeScript, Tailwind CSS, dan Vite. PRD disusun berdasarkan implementasi tersebut.

## Decision

Pertahankan stack saat ini untuk E-Catalog MVP. Perubahan stack besar tidak
menjadi bagian dari requirement PRD.

## Consequences

- Tim dapat melanjutkan route, controller, model, migration, dan halaman yang ada.
- Data server tetap dekat dengan Laravel dan Inertia.
- Komponen interaktif dapat dibangun dengan React dan TypeScript.
- Keputusan ini menghindari biaya migrasi sebelum kebutuhan produk tervalidasi.
- Business logic baru tetap dapat dipisahkan ke service secara bertahap.
