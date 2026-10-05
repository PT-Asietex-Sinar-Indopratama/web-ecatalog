import { Link, usePage } from '@inertiajs/react';
import { Home, User } from 'lucide-react';
import { route } from 'ziggy-js';

export default function BottomNav() {
    const { auth } = usePage().props as any;
    const currentUrl = usePage().url;

    const navItems = [
        { id: 'home', label: 'Beranda', icon: Home, href: route('main') },
        {
            id: 'profile',
            label: auth.user ? 'Akun' : 'Masuk',
            icon: User,
            href: auth.user ? route('profile') : route('login'),
        },
    ];

    return (
        <nav className="fixed right-0 bottom-0 left-0 z-[9999] w-full border-t border-border bg-background md:hidden">
            <div className="flex h-16 items-center justify-around">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                        item.id === 'profile'
                            ? currentUrl.startsWith('/profile')
                            : item.id === 'home' && currentUrl === '/';

                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className="flex h-full w-full flex-col items-center justify-center space-y-1 transition-colors duration-200"
                        >
                            <Icon
                                className={`h-5 w-5 ${
                                    isActive
                                        ? 'fill-primary/20 text-primary'
                                        : 'text-muted-foreground'
                                }`}
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                            <span
                                className={`text-[10px] font-medium ${
                                    isActive
                                        ? 'text-primary'
                                        : 'text-muted-foreground'
                                }`}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
