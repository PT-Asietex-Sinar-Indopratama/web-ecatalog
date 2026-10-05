# Request Quotation

## Tujuan MVP

Request quotation adalah inquiry dari customer terhadap produk yang dipilih.
Fitur ini bukan checkout, bukan pembayaran, dan bukan order final.

## Alur target

```text
Visitor membuka detail produk
  ↓
Memilih request quotation atau WhatsApp sales
  ↓
Mengirim konteks produk
  ↓
Sales menerima dan melakukan follow-up
```

## Scope MVP

- Request quotation dapat dimulai dari halaman detail produk.
- Inquiry membawa konteks produk, minimal nama atau SKU.
- Tombol WhatsApp membuka link/redirect ke sales.
- Pesan awal WhatsApp dapat berisi nama atau SKU produk.
- Tidak ada WhatsApp API, bot, webhook, atau sinkronisasi chat.
- Detail field, penerima inquiry, dan SLA follow-up harus disepakati bersama tim
  sales sebelum implementasi final.

## Di luar scope

- Harga otomatis atau customer-specific pricing.
- Checkout, pembayaran, stok, pengiriman, dan invoice.
- Inquiry cart dan inquiry history terautentikasi; ini adalah roadmap Phase 2.

## Keputusan implementasi MVP

- Inquiry dapat dikirim sebagai guest tanpa login.
- Field wajib: nama lengkap dan nomor WhatsApp.
- Field opsional: nama perusahaan, jumlah kebutuhan, dan catatan atau kebutuhan khusus.
- Inquiry disimpan ke database dengan status awal `new`.
- Data produk yang disimpan mencakup `product_id`, nama, dan SKU sebagai snapshot.
- Setelah inquiry berhasil disimpan, WhatsApp Sales dibuka dengan pesan yang sudah diisi konteks produk dan data inquiry.
- Nomor WhatsApp dikonfigurasi melalui `SALES_WHATSAPP_NUMBER`, dengan nomor dummy `6280000000000` untuk sementara.

## Open decisions

- Alur status lanjutan selain `new` masih perlu disepakati bersama tim sales.
