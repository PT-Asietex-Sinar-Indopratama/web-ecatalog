# Design System Guidelines (`design-system.md`)

Dokumen ini merupakan panduan sistem desain terpadu untuk pengembangan halaman Root, Dashboard, dan halaman lainnya pada project **web-ecatalog**. Panduan ini disusun berdasarkan konvensi dan skill UI/UX yang tersedia pada repository (`better-*`, `design-taste-frontend`, `frontend-design`, `ui-taste`, `emil-design-eng`, `apple-design`, `animate`, `shadcn`, dll).

---

## 1. Core Visual Principles & Aesthetic Direction

- **Anti-Slop & Premium Finish**: Hindari tampilan generik/templated. Setiap komponen dan elemen visual harus memiliki intensi yang jelas, rapi, dan terasa _custom_.
- **Optical Alignment & Depth**: Gunakan permainan _elevation_, _subtle shadows_, _translucent background (glassmorphism)_, dan _concentric border-radius_ untuk menciptakan kedalaman hierarki visual.
- **Contextual & Intentional**: UI untuk halaman publik (Root) difokuskan pada daya tarik visual, kejelasan pesan, dan responsivitas, sedangkan halaman Dashboard mengutamakan efisiensi navigasi, kepadatan informasi yang terstruktur, dan _snappy interaction_.

---

## 2. Color System & Palette (`better-colors`)

### Functional Color Tokens

| Category                      | Usage / Context                               | Color Style / Hex                                        |
| :---------------------------- | :-------------------------------------------- | :------------------------------------------------------- |
| **Primary Base**              | Action utama, brand accent, active state      | Modern Dark/Indigo / Deep Teal (Tailwind/HSL Token)      |
| **Surface / Background**      | Background utama (Light/Dark mode compatible) | Slate / Zinc Neutral tones (`#FAFAFA` / `#0F172A`)       |
| **Elevated Surface**          | Card, Modal, Dropdown, Floating Bar           | `#FFFFFF` (with subtle border `#E2E8F0`)                 |
| **Text Primary**              | Headline, Label utama, Body text              | `#0F172A` (High contrast, legibilitas maksimal)          |
| **Text Secondary**            | Subtitle, Caption, Meta info                  | `#64748B`                                                |
| **Success / Warning / Error** | Status Badge, Toast notification              | Emerald (`#10B981`), Amber (`#F59E0B`), Rose (`#F43F5E`) |

### Color Rules:

- Gunakan kontras rasio minimal **4.5:1** (WCAG AA compliant) untuk teks normal.
- Selalu padukan warna aksen dengan warna netral yang tenang agar UI tidak tampak bising.

---

## 3. Typography & Spacing Scale (`better-typography` & `better-layout`)

### Font Hierarchy

- **Primary Sans-Serif**: Inter / Outfit / System Font Stacks (`font-sans`).
- **Display / Headline**: Sans-serif serbaguna dengan _weight_ tebal (`font-bold` / `font-semibold`) dan _tracking_ sedikit rapat (`tracking-tight`).
- **Monospace**: Untuk ID tracking, data teknis, atau kode (`font-mono`).

### Type Scale

- **H1 (Hero / Page Title)**: `text-3xl` s.d. `text-5xl`, `font-extrabold`, `tracking-tight`
- **H2 (Section Header)**: `text-2xl`, `font-bold`
- **H3 (Card / Modal Header)**: `text-lg` s.d. `text-xl`, `font-semibold`
- **Body Large**: `text-base`, `leading-relaxed`
- **Body / Standard**: `text-sm`, `leading-normal`
- **Caption / Meta**: `text-xs`, `text-slate-500`

### Spacing & Grid Layout

- System Spacing berbasis kelipatan **4px / 8px** (`gap-2`, `gap-4`, `gap-6`, `gap-8`).
- **Container Padding**:
    - Mobile: `px-4`
    - Tablet: `px-6`
    - Desktop: `px-8` s.d. `max-w-7xl`
- **Concentric Border Radius**: Border radius elemen di dalam kontainer harus selaras dengan border radius outer container ($R_{inner} = R_{outer} - padding$).

---

## 4. Motion, Animation & Interaction (`animate` & `emil-design-eng`)

- **Purposeful Motion**: Animasi hanya digunakan untuk memberikan umpan balik (feedback), mengarahkan perhatian, atau memperhalus transisi keadaan (_state transition_). Hindari animasi berlebihan yang menghambat efisiensi kerja user.
- **Timing & Curves**:
    - **Quick Micro-interactions** (Button hover, toggle): `150ms - 200ms`, `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out).
    - **Page / Modal Transitions**: `250ms - 350ms`, spring dynamics atau ease-in-out berbobot halus.
- **Interactive Feedback**:
    - Hover state pada tombol dan card harus memiliki perubahan visual yang halus (_subtle scale_, _border highlight_, atau _background shift_).
    - Focus states wajib menggunakan ring indikator yang jelas demi aksesibilitas.

---

## 5. Component Patterns & UX Standards (`shadcn` & `better-ui`)

### Halaman Root (Landing Page / Public View)

- **Hero Section**: Memiliki judul utama yang lugas, _call-to-action (CTA)_ yang menonjol, dan elemen visual pendukung yang bersih.
- **Product Catalog Cards**: Memuat gambar produk rasio konsisten, nama produk, kategori, dan tombol aksi cepat.
- **Navigation Header**: Sticky/Glassmorphism header dengan logo, tautan navigasi utama, dan pencarian cepat.

### Halaman Dashboard (Admin / Customer Portal)

- **Sidebar Navigation**: Menu bertingkat yang rapi dengan status aktif jelas, icon kontekstual, dan opsi _collapse_.
- **Data Tables & Filters**:
    - Mendukung pencarian cepat (_debounced search_), filter status, dan pagination.
    - Baris tabel memliki _hover state_ untuk keterbacaan yang lebih baik.
- **Stat Cards / Summary Metrics**: Menampilkan indikator statistik utama dengan tren (naik/turun) yang kontras secara visual.
- **Feedback System (Toast & Modals)**: Integrasi notifikasi toast (`ask-sonner`) untuk aksi sukses/gagal secara non-intrusif.

---

## 6. Accessibility & Copywriting (`better-accessibility` & `better-writing`)

- **Semantic HTML**: Gunakan tag `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`, `<article>`, dan `<section>` secara tepat.
- **ARIA & Alt Attributes**: Semua ikon tanpa teks pendamping harus memiliki `aria-label`. Semua gambar produk harus memiliki tag `alt`.
- **Microcopy**:
    - Gunakan Bahasa Indonesia yang lugas, profesional, dan membantu (_helpful error messages_).
    - Hindari istilah teknis error internal (seperti `500 Server Error`), gantilah dengan kalimat yang memberikan petunjuk solutif bagi pengguna.
