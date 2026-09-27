import { Link } from '@inertiajs/react';
import * as React from 'react';

import { route } from 'ziggy-js';
import { NavMain } from '@/components/NavMain';
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const SidebarFooterComponent = site.sidebarFooter.component;

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
                {site.navMain.map((group) => (
                    <NavMain
                        key={group.label}
                        label={group.label}
                        items={group.items}
                    />
                ))}
            </SidebarContent>

            <SidebarFooter>
                <SidebarFooterComponent {...site.sidebarFooter.props} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
