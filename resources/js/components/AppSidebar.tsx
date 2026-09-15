import * as React from "react"

import { NavMain } from "@/components/NavMain"
import { NavUser } from "@/components/NavUser"
import {Link} from "@inertiajs/react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { TerminalSquareIcon } from "lucide-react"
import { route } from "ziggy-js"

// This is sample data.
const data = {

  user: {
    name: "shadcn",
    email: "m@example.com",
    // avatar: "/avatars/shadcn.jpg",
  },

  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: (
        <TerminalSquareIcon
        />
      ),
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
      ],
    }
  ],

}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="group-data-[collapsible=icon]:p-1! pl-1!">
              <Link href={route('main')} className="flex items-center gap-2 w-full">
                <img src="/favicon-192x192.png" className="w-5.5 h-auto object-contain rounded-lg" />
                <span className="text-base font-semibold group-data-[collapsible=icon]:hidden">Asietex</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
