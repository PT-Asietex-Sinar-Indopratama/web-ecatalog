import { Link, usePage } from '@inertiajs/react';
import { LogOut, PanelsTopLeft, User, UserRound } from 'lucide-react';

import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Navbar() {
    const { auth } = usePage().props as any;

    return (
        <header className="fixed top-0 z-50 hidden w-full border-b bg-white md:block">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-8">
                    <Link href={route('main')}>
                        <Button
                            className="flex items-center gap-2 text-xl font-semibold"
                            variant={'ghost'}
                        >
                            <img
                                src="/favicon-192x192.png"
                                className="h-6 w-6 rounded-lg object-contain md:h-8 md:w-8"
                            />{' '}
                            Asietex
                        </Button>
                    </Link>
                </div>

                <nav className="hidden items-center gap-3 text-sm font-medium text-slate-600 md:flex">
                    <a href="#" className="">
                        <Button
                            className="font-semibold text-blue-600"
                            variant={'ghost'}
                        >
                            Catalog
                        </Button>
                    </a>
                    <a href="#" className="">
                        <Button
                            className="hover:font-semibold"
                            variant={'ghost'}
                        >
                            Stock
                        </Button>
                    </a>
                    <a href="#" className="">
                        <Button
                            className="hover:font-semibold"
                            variant={'ghost'}
                        >
                            Blog
                        </Button>
                    </a>
                    <a href="#" className="">
                        <Button
                            className="hover:font-semibold"
                            variant={'ghost'}
                        >
                            About
                        </Button>
                    </a>
                    <a href="#" className="">
                        <Button
                            className="hover:font-semibold"
                            variant={'ghost'}
                        >
                            FAQ
                        </Button>
                    </a>
                </nav>

                <div className="flex items-center text-slate-600">
                    {auth.user ? (
                        <>
                            <DropdownMenu>
                                <DropdownMenuTrigger
                                    render={
                                        <Button
                                            className="group hover:font-semibold"
                                            variant={'ghost'}
                                            size={'icon'}
                                        />
                                    }
                                >
                                    <User className="h-5 w-5 transition-transform duration-300 group-hover:scale-103" />
                                </DropdownMenuTrigger>

                                <DropdownMenuContent
                                    align="end"
                                    side="bottom"
                                    sideOffset={8}
                                    className="w-48"
                                >
                                    <DropdownMenuGroup>
                                        <DropdownMenuLabel>
                                            <div className="flex flex-col">
                                                <span className="truncate text-sm font-medium">
                                                    {auth.user.name}
                                                </span>
                                                <span className="truncate text-xs text-muted-foreground">
                                                    {auth.user.email}
                                                </span>
                                            </div>
                                        </DropdownMenuLabel>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Link
                                            href={route('profile')}
                                            className="flex w-full items-center gap-2"
                                        >
                                            <UserRound className="h-4 w-4" />
                                            Show Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link
                                            href={route('dashboard.main')}
                                            className="flex w-full items-center gap-2"
                                        >
                                            <PanelsTopLeft className="h-4 w-4" />
                                            Dashboard
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem variant="destructive">
                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="flex w-full items-center gap-2"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Logout
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <Link href={route('login')}>
                            <Button
                                className="text-blue-500 hover:font-semibold"
                                variant={'ghost'}
                            >
                                Login
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
