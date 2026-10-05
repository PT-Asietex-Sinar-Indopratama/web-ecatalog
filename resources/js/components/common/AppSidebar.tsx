import type { PageProps } from '@inertiajs/core';
import { Link, usePage } from '@inertiajs/react';
import * as React from 'react';

import { route } from 'ziggy-js';
import { NavMain } from '@/components/common/NavMain';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '@/components/ui/sidebar';
import { site } from '@/lib/site';

interface AuthProps {
    auth: {
        user: { name: string } | null;
        is_admin: boolean;
    };
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const SidebarFooterComponent = site.sidebarFooter.component;
    const { auth } = usePage<PageProps & AuthProps>().props;

    // Sembunyikan grup User Management untuk non-admin
    const visibleNavGroups = site.navMain.filter((group) => {
        if (group.adminOnly && !auth.is_admin) {
            return false;
        }

        return true;
    });

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton className="pl-1! group-data-[collapsible=icon]:p-1!">
                            <Link
                                href={route('main')}
                                className="flex w-full items-center gap-2"
                            >
                                <img
                                    src="/favicon-192x192.png"
                                    className="h-auto w-5.5 rounded-lg object-contain"
                                />
                                <span className="text-base font-semibold group-data-[collapsible=icon]:hidden">
                                    Asietex
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {visibleNavGroups.map((group) => (
                    <NavMain
                        key={group.label}
                        label={group.label}
                        items={group.items}
                    />
                ))}
            </SidebarContent>

            <SidebarFooter>
                <SidebarFooterComponent user={auth.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
