import { Link } from '@inertiajs/react';
import { ChevronRightIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { route } from 'ziggy-js';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';

type NavItem = {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
        title: string;
        url: string;
    }[];
};

function resolveUrl(url: string) {
    return url === '#' ? url : route(url);
}

export function NavMain({ label, items }: { label: string; items: NavItem[] }) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>{label}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const Icon = item.icon;

                    if (!item.items?.length) {
                        return (
                            <SidebarMenuItem
                                key={item.title}
                                className="flex items-center gap-2"
                            >
                                <SidebarMenuButton tooltip={item.title}>
                                    <Link
                                        href={resolveUrl(item.url)}
                                        className="flex w-full cursor-pointer items-center gap-2"
                                    >
                                        {Icon && <Icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    }

                    return (
                        <Collapsible
                            key={item.title}
                            defaultOpen={item.isActive}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger
                                    render={
                                        <SidebarMenuButton
                                            tooltip={item.title}
                                        />
                                    }
                                >
                                    {Icon && <Icon />}
                                    <span>{item.title}</span>
                                    <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90" />
                                </CollapsibleTrigger>

                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.items.map((subItem) => (
                                            <SidebarMenuSubItem
                                                key={subItem.title}
                                            >
                                                <SidebarMenuSubButton
                                                    render={
                                                        <Link
                                                            href={resolveUrl(
                                                                subItem.url,
                                                            )}
                                                        />
                                                    }
                                                >
                                                    <span>{subItem.title}</span>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
