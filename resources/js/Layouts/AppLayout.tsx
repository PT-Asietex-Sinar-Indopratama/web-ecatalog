import { Mail, MapPin, Phone } from 'lucide-react';
import React from 'react';
import BottomNav from '@/components/common/BottomNav';
import Navbar from '@/components/common/Navbar';
import { cn } from '@/lib/utils';

export default function AppLayout({ children, className }: any) {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <a
                href="#main-content"
                className="sr-only fixed start-4 top-4 z-[100] rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only"
            >
                Lewati ke konten utama
            </a>

            {/* NAVBAR */}
            <Navbar />

            {/* Bottom Navigation */}
            <BottomNav />

            {/* MAIN CONTENT */}
            <main
                id="main-content"
                className={cn(
                    'mx-auto min-h-screen w-full max-w-7xl px-4 pt-4 pb-20 sm:px-6 md:pt-24 lg:px-8',
                    className,
                )}
            >
                {children}
            </main>

            {/* FOOTER */}
            <footer className="relative overflow-hidden border-t border-border bg-muted text-foreground">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(147,197,253,0.42),transparent_28%),radial-gradient(circle_at_82%_12%,rgba(203,213,225,0.72),transparent_30%),radial-gradient(circle_at_68%_78%,rgba(186,230,253,0.38),transparent_32%)]" />
                <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-[1.3fr_0.8fr_1fr] lg:px-8">
                    <div className="max-w-sm space-y-3">
                        <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                            E-Catalog
                        </p>
                        <h2 className="text-2xl font-semibold tracking-tight">
                            Katalog produk untuk pencarian yang jelas dan
                            praktis.
                        </h2>
                        <p className="text-sm leading-6 text-muted-foreground">
                            Jelajahi referensi produk, material, dan katalog
                            yang dapat diunduh dalam satu tempat.
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
                        <span>
                            &copy; {new Date().getFullYear()} Asietex Sinar
                            Indopratama. Hak cipta dilindungi.
                        </span>
                        <span>Dirancang dengan jelas dan ringkas.</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
