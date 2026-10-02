# ADR-002: Memprioritaskan E-Catalog sebelum E-Commerce

- **Status:** Accepted
- **Tanggal:** 2026-10-02

## Context

Penjualan bersifat B2B dan dapat melibatkan harga khusus customer, negosiasi,
MOQ, biaya pengiriman dinamis, stok yang berubah, dan diskon khusus. Checkout
standar belum cukup untuk menggambarkan proses tersebut.

## Decision

Bangun E-Catalog dan inquiry/request quotation terlebih dahulu. Semi e-commerce
dan full e-commerce tetap menjadi roadmap, bukan scope MVP.

## Consequences

- Visitor dapat menemukan produk dan menghubungi sales lebih cepat.
- Tim dapat memvalidasi kebutuhan inquiry sebelum membangun transaksi online.
- MVP tidak perlu menanggung kompleksitas order, payment, shipment, dan invoice.
- Model data perlu memberi ruang untuk inquiry dan e-commerce di masa depan tanpa
  memaksakan semua entitas sejak awal.
