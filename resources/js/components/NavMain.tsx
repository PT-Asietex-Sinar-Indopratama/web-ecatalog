import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { route } from "ziggy-js"
import { ChevronRightIcon, PanelTop } from "lucide-react"
import { Link } from "@inertiajs/react"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            defaultOpen={item.isActive}
            className="group/collapsible"
          >

            <SidebarMenuItem className="flex items-center gap-2">
              <SidebarMenuButton
                tooltip="Dashboard"
                className=""
              >
                <Link href={route('dashboard.main')} className="flex items-center gap-2 w-full cursor-pointer">
                  <PanelTop />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem className="flex items-center gap-2">
              <SidebarMenuButton
                tooltip="Product Category"
                className=""
              >
                <Link href={route('dashboard.product-category')} className="flex items-center gap-2 w-full cursor-pointer">
                  <PanelTop />
                  <span>Product Category</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <CollapsibleTrigger
              render={<SidebarMenuButton tooltip={item.title} />}
            >
              {item.icon}
              <span>{item.title}</span>
              <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90" />
            </CollapsibleTrigger>

            <CollapsibleContent>
              <SidebarMenuSub>
                {item.items?.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton render={<a href={subItem.url} />}>
                      <span>{subItem.title}</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>


          </Collapsible>
        ))}

      </SidebarMenu>
    </SidebarGroup>
  )
}
