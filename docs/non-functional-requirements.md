# Non-functional Requirements

## Performance

- Target awal halaman utama dan detail: maksimal 2 detik pada kondisi normal,
  tidak termasuk waktu download file.
- Gunakan pagination pada listing.
- Optimalkan eager loading untuk mencegah N+1 query.
- Sajikan gambar dan PDF melalui storage yang sesuai.

## Responsive usability

- Katalog dan dashboard mendukung desktop, tablet, dan mobile.
- Filter tersedia sebagai sidebar pada desktop dan drawer pada mobile.
- Pesan sukses, error, validasi, dan konfirmasi penghapusan harus jelas.
- Label dan navigasi konsisten untuk tim sales.

## SEO

- Katalog dan detail produk memiliki title dan metadata relevan.
- URL detail produk stabil dan mudah dibagikan.
- Produk nonaktif tidak boleh diindeks.
- Sitemap dan robots policy disiapkan sebelum publikasi eksternal.

## Backup dan observability

- Database dan storage memiliki backup atau replikasi yang terjadwal.
- Aktivitas penting, error aplikasi, dan kegagalan upload dapat ditelusuri.
- Monitoring kesehatan aplikasi, database, storage, dan queue disiapkan jika queue
  digunakan.

## Status requirement

Sebagian requirement di atas merupakan target kesiapan produksi. Status
implementasinya harus diverifikasi melalui test dan checklist deployment.
