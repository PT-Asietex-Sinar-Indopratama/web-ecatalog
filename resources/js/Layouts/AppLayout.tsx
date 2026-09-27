import React from 'react';
import BottomNav from '@/components/BottomNav';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';

export default function AppLayout({ children, className }: any) {
    return (
        <div className="min-h-screen text-slate-800">
            {/* NAVBAR */}
            <Navbar />

            {/* Bottom Navigation */}
            <BottomNav />

            {/* MAIN CONTENT */}
            <div
                className={cn(
                    'mx-auto min-h-screen w-full max-w-7xl px-4 pt-4 pb-20 sm:px-6 md:pt-24 lg:px-8',
                    className,
                )}
            >
                {children}
            </div>
        </div>
    );
}
