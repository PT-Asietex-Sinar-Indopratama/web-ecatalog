import React, { useState } from "react";
import {Link, usePage} from "@inertiajs/react"
import {
    Search,
    ShoppingCart,
    Heart,
    User,
    LayoutList,
    LayoutGrid,
    ChevronDown,
    ChevronUp
} from "lucide-react";

type FilterState = {
    basic: boolean;
    oversize: boolean;
    polo: boolean;
    jaket: boolean;
    hoodie: boolean;
    sportwear: boolean;
    ladies: boolean;
};

import { Button } from "@/components/ui/button"
import { route } from "ziggy-js"


export default function Navbar() {
    const { auth } = usePage().props as any;

    return (
        <header className="hidden md:block fixed w-full top-0 bg-white border-b z-50 px-20">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                <div className="flex items-center gap-8">
                    <Link href={route('main')}>
                        <Button className="flex items-center gap-2 font-semibold text-xl" variant={'ghost'}>
                            <img src="/favicon-192x192.png" className="w-6 h-6 md:w-8 md:h-8 object-contain rounded-lg" /> Asietex
                        </Button>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-3 text-sm font-medium text-slate-600">
                    <a href="#" className=""><Button className="font-semibold text-blue-600" variant={'ghost'}>Catalog</Button></a>
                    <a href="#" className=""><Button className="hover:font-semibold" variant={'ghost'}>Stock</Button></a>
                    <a href="#" className=""><Button className="hover:font-semibold" variant={'ghost'}>Blog</Button></a>
                    <a href="#" className=""><Button className="hover:font-semibold" variant={'ghost'}>About</Button></a>
                    <a href="#" className=""><Button className="hover:font-semibold" variant={'ghost'}>FAQ</Button></a>
                    {auth.user 
                    ? (
                        <>
                            <Link href={route('dashboard.main')} as="button">
                                <Button className="hover:font-semibold" variant={'ghost'}>Dashboard</Button>
                            </Link>
                            <Link href={route('logout')} method="post" as="button">
                                <Button className="hover:font-semibold text-red-500" variant={'ghost'}>Logout</Button>
                            </Link>
                        </>
                    ):(
                        <>
                            <Link href={route('login')} as="button">
                                <Button className="hover:font-semibold text-blue-500" variant={'ghost'}>Login</Button>
                            </Link>
                        </> 
                    )
                }
                </nav>

                <div className="flex items-center text-slate-600">
                    <Button className="group hover:font-semibold" variant={'ghost'} size={'icon'}>
                        <ShoppingCart className="w-5 h-5 transition-transform duration-300 group-hover:scale-103" />
                    </Button>
                    <Button className="group hover:font-semibold" variant={'ghost'} size={'icon'}>
                        <Heart className="w-5 h-5 transition-transform duration-300 group-hover:scale-103" />
                    </Button>
                    <Button className="group hover:font-semibold" variant={'ghost'} size={'icon'}>
                        <User className="w-5 h-5 transition-transform duration-300 group-hover:scale-103" />
                    </Button>
                </div>
                
            </div>
        </header>
    )
}