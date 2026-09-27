import { Link, usePage } from '@inertiajs/react';
import React from 'react';
import { route } from 'ziggy-js';
import { AppSidebar } from '@/components/AppSidebar';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export default function Page({ children, className, breadcrumbs = null }: any) {
    // Jika title berupa string tunggal atau array, kita normalkan jadi array
    const breadcrumbsArray = Array.isArray(breadcrumbs)
        ? breadcrumbs
        : breadcrumbs
          ? [{ label: breadcrumbs }]
          : [];
    const { auth } = usePage().props as any;

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="sticky top-0 z-40 flex h-16 w-full shrink-0 items-center gap-2 border-b-1 bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <div className="flex min-w-0 items-center gap-2">
                            <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 data-vertical:h-4 data-vertical:self-auto"
                            />
                            <Breadcrumb>
                                <BreadcrumbList className="flex-nowrap">
                                    {/* Dashboard: Sembunyikan di HP jika ada breadcrumb setelahnya */}
                                    <BreadcrumbItem
                                        className={
                                            breadcrumbsArray.length > 0
                                                ? 'hidden md:block'
                                                : 'block'
                                        }
                                    >
                                        <BreadcrumbLink>
                                            <Link
                                                href={route('dashboard.main')}
                                            >
                                                Dashboard
                                            </Link>
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>

                                    {breadcrumbsArray.length > 0 && (
                                        <BreadcrumbSeparator
                                            className={
                                                breadcrumbsArray.length > 0
                                                    ? 'hidden md:block'
                                                    : 'block'
                                            }
                                        />
                                    )}

                                    {breadcrumbsArray.map(
                                        (item: any, i: number) => {
                                            const isLast =
                                                i ===
                                                breadcrumbsArray.length - 1;

                                            return (
                                                <React.Fragment key={i}>
                                                    {i > 0 && (
                                                        <BreadcrumbSeparator
                                                            className={
                                                                isLast
                                                                    ? 'block'
                                                                    : 'hidden md:block'
                                                            }
                                                        />
                                                    )}
                                                    {/* Jika item terakhir, tampilkan di HP (block). Jika bukan, sembunyikan di HP (hidden md:block) */}
                                                    <BreadcrumbItem
                                                        className={
                                                            isLast
                                                                ? 'block'
                                                                : 'hidden md:block'
                                                        }
                                                    >
                                                        {isLast ? (
                                                            <BreadcrumbPage className="max-w-[150px] truncate md:max-w-none">
                                                                {item.label}
                                                            </BreadcrumbPage>
                                                        ) : (
                                                            <BreadcrumbLink>
                                                                <Link
                                                                    href={
                                                                        item.url
                                                                    }
                                                                >
                                                                    {item.label}
                                                                </Link>
                                                            </BreadcrumbLink>
                                                        )}
                                                    </BreadcrumbItem>
                                                </React.Fragment>
                                            );
                                        },
                                    )}
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <div className="flex shrink-0 items-center">
                            <div className="flex items-center gap-2">
                                <div className="hidden text-sm md:block">
                                    {' '}
                                    Hello, {auth?.user?.name || 'User'}{' '}
                                </div>
                                <div className="flex aspect-1/1 w-7 items-center justify-center rounded-full bg-secondary text-center text-xs font-semibold">
                                    {auth?.user?.name[0] || 'U'}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div
                    className={cn(
                        'mx-auto grid min-h-screen w-full max-w-7xl grid-cols-4 px-4 pt-4 pb-10 sm:px-6 lg:px-8',
                        className,
                    )}
                >
                    <h1 className="col-span-4 mb-4 text-xl font-semibold">
                        {breadcrumbs
                            ? breadcrumbs[breadcrumbs.length - 1].label
                            : 'Dashboard'}
                    </h1>
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
