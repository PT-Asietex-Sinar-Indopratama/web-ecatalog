# Sales Workflow

## Kondisi saat ini

```text
Customer → WhatsApp Sales → PDF Catalog → Negosiasi
         → Manual Bank Transfer → Manual Order Processing
```

## Dukungan current implementation

- Sales dapat mencari produk berdasarkan beberapa atribut.
- Detail produk memiliki URL yang dapat dibagikan.
- PDF dapat diunduh tanpa login.
- Data katalog dipusatkan dan dikelola melalui admin.

## Target E-Catalog MVP

```text
Visitor → Browse Product → Detail Product
        → Request Quotation / WhatsApp Sales → Sales Follow-up → Deal
```

Request quotation adalah inquiry dan tidak otomatis membuat order atau payment.
Link WhatsApp dapat membawa nama atau SKU produk sebagai konteks pesan awal.

## Tanggung jawab sales

- Menindaklanjuti inquiry yang masuk.
- Memverifikasi kebutuhan, MOQ, harga, stok, pengiriman, dan diskon.
- Menentukan quotation dan proses order di luar scope E-Catalog MVP.

## Roadmap

Phase 2 dapat menambahkan customer account, inquiry cart, inquiry history, dan
customer dashboard. Checkout, payment, order, shipment, dan invoice termasuk
Phase 3 setelah proses bisnis siap.
