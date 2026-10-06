# Web E-Catalog Design System & UI Guidelines

_(Enhanced with Apple Design Philosophy & Fluid Interface Principles)_

Dokumen ini mendokumentasikan sistem desain (_Design System_), token visual, pedoman komponen, serta standar antarmuka (_User Interface_) untuk aplikasi Web E-Catalog.

Sistem desain ini memadukan **Apple Design Philosophy** (WWDC _Designing Fluid Interfaces_, WWDC 2026 _Principles of Great Design_), **shadcn/ui**, serta **Tailwind CSS v4** untuk menghadirkan antarmuka yang tidak hanya indah secara visual, tetapi juga responsif, fisik, dan terasa hidup.

---

## 1. Prinsip Utama Desain (Apple Design Foundations)

Antarmuka Web E-Catalog beroperasi berdasarkan 8 fondasi desain Apple:

1. **Purpose (Tujuan Clear)**: Setiap tombol, badge, dan layout memiliki kegunaan yang jelas. Mengeliminasi elemen dekoratif tanpa fungsi.
2. **Direct Manipulation & Response (Nir-Latensi)**: Umpan balik visual harus hadir secara instan pada `pointerdown` (bukan menunggu `click` / touch release).
3. **Fluidity & Interruptibility**: Animasi bersifat _interruptible_ (dapat disela/dibalikkan di tengah jalan) menggunakan kurva fisika _Spring_ alih-alih durasi kaku.
4. **Spatial Consistency**: Elemen muncul dan menghilang dari dan ke lokasi asal penjelajahannya (misal: dialog/popover memekar dari tombol pemicunya).
5. **Materials & Translucency**: Penggunaan material translusen (_glassmorphism_ dengan `backdrop-filter`) untuk hirarki visual tanpa memotong alur kerja pengguna.
6. **Optical Typography**: Pengaturan _tracking_ (letter-spacing) dan _leading_ (line-height) dinamis yang disesuaikan secara proporsional dengan skala teks.
7. **Accessibility & Graceful Degradation**: Menghormati preferensi pengguna (_Reduced Motion_, _Reduced Transparency_, _High Contrast_).
8. **Craft & Delight**: Kualitas detail pada setiap transisi, alignment, dan umpan balik yang konsisten.

---

## 2. Sistem Warna & Material (OKLCH Tokens & Glassmorphism)

Aplikasi ini menggunakan ruang warna **OKLCH** melalui CSS Variables & Tailwind CSS v4 (`resources/css/app.css`) dipadu dengan lapisan material translusen berbasis iOS.

### 2.1 CSS Variables & Palette Tokens

#### Light Mode (`:root`)

| Token Variable         | Perceptual OKLCH Value            | Kegunaan Utama                               |
| :--------------------- | :-------------------------------- | :------------------------------------------- |
| `--background`         | `oklch(1 0 0)`                    | Warna dasar latar belakang aplikasi          |
| `--foreground`         | `oklch(0.1477 0.004 228.7597)`    | Teks utama (_High Contrast_)                 |
| `--primary`            | `oklch(0.5711 0.1812 255.8691)`   | Warna aksen brand (Tombol CTA, active state) |
| `--primary-foreground` | `oklch(0.9836 0.0142 180.72)`     | Teks di atas primary background              |
| `--secondary`          | `oklab(94.744% 0.00178 -0.00235)` | Permukaan sekunder / soft badges             |
| `--muted`              | `oklch(0.9626 0.0021 197.1213)`   | Latar belakang elemen non-aktif              |
| `--muted-foreground`   | `oklch(0.5602 0.0211 213.5028)`   | Teks sekunder, label pembantu, placeholder   |
| `--accent`             | `oklch(0.9626 0.0021 197.1213)`   | Hover state pada list/table/menu             |
| `--destructive`        | `oklch(0.583 0.2387 28.4765)`     | Aksi destruktif (Hapus, Error Toast)         |
| `--border` / `--input` | `oklch(84.782% 0.00573 211.878)`  | Garis tepi komponen & input field            |
| `--ring`               | `oklch(0.723 0.0143 214.3836)`    | Focus ring indicator (Accessibility)         |

#### Dark Mode (`.dark`)

| Token Variable         | Perceptual OKLCH Value         | Kegunaan Utama                             |
| :--------------------- | :----------------------------- | :----------------------------------------- |
| `--background`         | `oklch(0.1477 0.004 228.7597)` | Latar belakang mode gelap                  |
| `--foreground`         | `oklch(0.985 0 0)`             | Teks utama mode gelap                      |
| `--card` / `--popover` | `oklch(0.17 0.005 228)`        | Latar permukaan card & dropdown            |
| `--primary`            | `oklch(0.65 0.18 255)`         | Primary color terkalibrasi untuk dark mode |

### 2.2 Apple Translucent Materials (Glassmorphism)

Floating chrome (Header sticky, floating toolbars, modal overlays) menerapkan efek lapisan kaca Apple:

```css
/* Translucent Floating Chrome */
.glass-panel {
    background: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.4); /* Highlight tepi atas yang menangkap cahaya */
}

.dark .glass-panel {
    background: rgba(23, 25, 35, 0.75);
    backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.1);
}
```

---

## 3. Tipografi Optik (Apple Typography Discipline)

Sistem tipografi menggunakan **Figtree Variable** dengan penerapan _Optical Sizing_, _Tracking_ berbasis ukuran, dan _Leading_ terbalik:

### 3.1 Skala Tipografi & Tracking Rules

| Level             | Class Tailwind                  | Tracking (Letter Spacing)     | Leading (Line Height) | Usage                                    |
| :---------------- | :------------------------------ | :---------------------------- | :-------------------- | :--------------------------------------- |
| **Display / H1**  | `text-3xl font-bold`            | `-0.025em` (Tight)            | `1.1` (Tight)         | Judul utama halaman / Dashboard Header   |
| **H2**            | `text-2xl font-semibold`        | `-0.02em` (Tight)             | `1.2`                 | Sub-header section / Judul modal utama   |
| **H3**            | `text-lg font-medium`           | `-0.01em`                     | `1.3`                 | Judul Card / Table section header        |
| **Body Large**    | `text-base font-normal`         | `0` (Normal)                  | `1.5` (Relaxed)       | Teks paragraf utama / deskripsi          |
| **Body Normal**   | `text-sm font-normal`           | `0` (Normal)                  | `1.4`                 | Standard UI text, Form Input, Table Body |
| **Caption / Sub** | `text-xs text-muted-foreground` | `+0.01em` (Slightly expanded) | `1.3`                 | Timestamps, helper text, badge labels    |

---

## 4. Fizika Gerakan & Animasi (Spring & Motion Rules)

Menghindari `@keyframes` dan CSS `duration` yang kaku untuk gestur. Gunakan prinsip **Spring Physics** dari Apple:

### 4.1 Parameter Spring Apple

- **Critically Damped (`damping: 1.0`, `response: 0.3s–0.4s`)**: Digunakan secara default untuk transisi UI umum (Buka modal, dropdown, switch tab). Mencegah mentalan/bounce berlebih.
- **Momentum Spring (`damping: ~0.8`, `response: 0.3s`)**: Digunakan **hanya** ketika ada gerakan fisik/gestur (Swipe drawer, flick card, drag release).

### 4.2 Matrix Pemilihan Animasi

| Tipe Interaksi              | Damping Ratio                  | Response Time | Perilaku (Behavior)                              |
| :-------------------------- | :----------------------------- | :------------ | :----------------------------------------------- |
| **Standard UI Transition**  | `1.0` (No bounce)              | `0.35s`       | Settle mulus tanpa mengganggu produktivitas      |
| **Drawer / Bottom Sheet**   | `0.8` (Subtle bounce)          | `0.30s`       | Mengikuti momentum kecepatan drag/flick pengguna |
| **Press Feedback (Button)** | Instan (`active:scale-[0.97]`) | `0.10s`       | Respons langsung pada `pointerdown`              |

---

## 5. Standar Komponen UI & Varian (Apple Style + shadcn/ui)

### 5.1 Tombol (Button)

- Umpan balik **instan** pada `pointerdown` (`active:scale-[0.97]`):

```tsx
// Primary CTA (Apple Style)
<button className="h-9 rounded-md bg-primary px-4 font-medium text-primary-foreground shadow-sm transition-all duration-100 ease-out focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97]">
    Simpan Perubahan
</button>
```

### 5.2 Input Field & Search

- Border halus dengan pemfokusan ring yang tegas tanpa _outline jump_:
- `SearchInput` mendukung clearing instan dan pengikatan status pencarian tanpa latensi ketik.

### 5.3 Modals, Sheets & Spatial Origin

- Modal/Popover memekar dari lokasi tombol trigger (Spatial Anchor).
- Sheet overlay meredupkan latar belakang (_dimming scrim_) dan mendorong konten di belakangnya secara bertahap.

---

## 6. Aksesibilitas (A11y) & Adaptive Media Rules

Sistem desain secara otomatis beradaptasi dengan preferensi sistem pengguna:

### 6.1 Reduced Motion (`prefers-reduced-motion`)

Mengganti gerakan pegas/slide dengan transisi fading transparansi singkat:

```css
@media (prefers-reduced-motion: reduce) {
    *,
    ::before,
    ::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}
```

### 6.2 Reduced Transparency (`prefers-reduced-transparency`)

Menghapus `backdrop-filter` blur dan menggantinya dengan latar padat (_solid surface_) untuk pengguna dengan gangguan visual:

```css
@media (prefers-reduced-transparency: reduce) {
    .glass-panel {
        background: var(--background);
        backdrop-filter: none;
    }
}
```

---

_Dokumen ini dibuat dan dikelola secara terpusat untuk menjaga konsistensi visual, performa gerak fisik, dan pengalaman pengguna pada seluruh modul Web E-Catalog._
