import React from 'react';
import BottomNav from '@/components/common/BottomNav';
import Navbar from '@/components/common/Navbar';
import { cn } from '@/lib/utils';

export default function AuthLayout({ children, className }: any) {
    return (
        <div className="min-h-screen text-slate-800">
            {/* NAVBAR */}
            <Navbar />

            {/* Bottom Navigation */}
            <BottomNav />

            {/* MAIN CONTENT */}
            <div
                className={cn(
                    'mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center justify-center px-4 py-20 sm:px-6 lg:px-8',
                    className,
                )}
            >
                {children}
            </div>
        </div>
    );
}
