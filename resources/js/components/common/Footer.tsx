import { Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="footer-mesh relative overflow-hidden text-foreground">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-[1.3fr_0.8fr_1fr] lg:px-8">
                <div className="max-w-sm space-y-3">
                    <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                        E-Catalog
                    </p>
                    <h2 className="text-2xl font-semibold tracking-tight">
                        Katalog produk untuk pencarian yang jelas dan praktis.
                    </h2>
                    <p className="text-sm leading-6 text-muted-foreground">
                        Jelajahi referensi produk, material, dan katalog yang
                        dapat diunduh dalam satu tempat.
                    </p>
                </div>

                <nav aria-label="Footer navigation" className="space-y-3">
                    <p className="text-sm font-semibold">Jelajahi</p>
                    <div className="grid gap-2 text-sm text-muted-foreground">
                        <a
                            href="/"
                            className="transition-colors hover:text-foreground"
                        >
                            Katalog
                        </a>
                        <a
                            href="/"
                            className="transition-colors hover:text-foreground"
                        >
                            Produk
                        </a>
                        <a
                            href="/"
                            className="transition-colors hover:text-foreground"
                        >
                            Kategori
                        </a>
                    </div>
                </nav>

                <div className="space-y-3">
                    <p className="text-sm font-semibold">Kontak</p>
                    <div className="grid gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Mail className="size-4 text-muted-foreground" />
                            <span>info@example.com</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="size-4 text-muted-foreground" />
                            <span>+62 812 0000 0000</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="size-4 text-muted-foreground" />
                            <span>Indonesia</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative border-t border-border/80 px-4 py-4 text-sm text-muted-foreground sm:px-6 lg:px-8">
                <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <span>E-Catalog Website</span>
                    <span>
                        &copy; {new Date().getFullYear()} Asietex Sinar
                        Indopratama. Hak cipta dilindungi.
                    </span>
                </div>
            </div>
        </footer>
    );
}
