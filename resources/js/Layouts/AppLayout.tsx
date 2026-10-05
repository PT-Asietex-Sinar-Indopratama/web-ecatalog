import React from 'react';
import backgroundUrl from '@/assets/background-4.png';
import BottomNav from '@/components/common/BottomNav';
import Footer from '@/components/common/Footer';
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

            <div
                className="h-100 w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${backgroundUrl})` }}
            />

            {/* MAIN CONTENT */}
            <main
                id="main-content"
                className={cn(
                    'relative z-10 mx-auto -mt-12 min-h-screen w-full max-w-7xl px-4 pt-4 pb-20 sm:px-6 md:-mt-16 md:pt-10 lg:px-8',
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
