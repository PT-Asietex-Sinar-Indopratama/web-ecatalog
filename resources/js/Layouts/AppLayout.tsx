import React from 'react';
import BottomNav from '@/components/common/BottomNav';
import Footer from '@/components/common/Footer';
import Navbar from '@/components/common/Navbar';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
    children: React.ReactNode;
    className?: string;
    hero?: React.ReactNode;
    fullWidth?: boolean;
}

export default function AppLayout({
    children,
    className,
    hero,
    fullWidth,
}: AppLayoutProps) {
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

            {/* HERO / FULL-WIDTH SECTION */}
            {hero && <div className="relative top-16 z-10 w-full">{hero}</div>}

            {/* MAIN CONTENT */}
            <main
                id="main-content"
                className={cn(
                    'relative z-10 mx-auto min-h-screen w-full px-4 pt-4 pb-20 sm:px-6 lg:px-8',
                    // hero ? '' : 'top-24 -mt-12 md:-mt-16 md:pt-10',
                    hero ? '' : 'md:pt-20',
                    fullWidth
                        ? 'max-w-none px-0! sm:px-0! lg:px-0!'
                        : 'max-w-7xl',
                    className,
                )}
            >
                {children}
            </main>

            {/* FOOTER */}
            <Footer />
        </div>
    );
}
