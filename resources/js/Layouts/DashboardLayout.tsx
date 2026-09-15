import { AppSidebar } from "@/components/AppSidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { Link, usePage } from "@inertiajs/react"
import { route } from "ziggy-js"
import React from "react"
import { title } from "process"

export default function Page({ children, className, breadcrumbs = null }: any) {
  // Jika title berupa string tunggal atau array, kita normalkan jadi array
  const breadcrumbsArray = Array.isArray(breadcrumbs) ? breadcrumbs : breadcrumbs ? [{ label: breadcrumbs }] : [];
  const { auth } = usePage().props as any;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="fixed top-0 z-40 flex w-full h-16 border-b-1 bg-background shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-vertical:h-4 data-vertical:self-auto"
              />
              <Breadcrumb>
                <BreadcrumbList className="flex-nowrap">
                  {/* Dashboard: Sembunyikan di HP jika ada breadcrumb setelahnya */}
                  <BreadcrumbItem className={breadcrumbsArray.length > 0 ? "hidden md:block" : "block"}>
                    <BreadcrumbLink>
                      <Link href={route('dashboard.main')}>Dashboard</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>

                  {breadcrumbsArray.length > 0 && (
                    <BreadcrumbSeparator className={breadcrumbsArray.length > 0 ? "hidden md:block" : "block"} />
                  )}

                  {breadcrumbsArray.map((item: any, i: number) => {
                    const isLast = i === breadcrumbsArray.length - 1;

                    return (
                      <React.Fragment key={i}>
                        {i > 0 && (
                          <BreadcrumbSeparator className={isLast ? "block" : "hidden md:block"} />
                        )}
                        {/* Jika item terakhir, tampilkan di HP (block). Jika bukan, sembunyikan di HP (hidden md:block) */}
                        <BreadcrumbItem className={isLast ? "block" : "hidden md:block"}>
                          {isLast ? (
                            <BreadcrumbPage className="truncate max-w-[150px] md:max-w-none">
                              {item.label}
                            </BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink>
                              <Link href={item.url}>{item.label}</Link>
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                      </React.Fragment>
                    );
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="fixed right-0 items-center px-4">
              <div className="flex items-center gap-2">
                <div className="hidden md:block text-sm"> Hello, {auth?.user?.name || 'User'} </div>
                <div className="w-7 aspect-1/1 bg-secondary rounded-full flex items-center justify-center text-center text-xs font-semibold">{auth?.user?.name[0] || 'U'}</div>
              </div>
            </div>
          </div>
        </header>

        <div className={cn("h-min-screen px-4 grid grid-cols-4 pb-10 pt-20", className)}>
          <h1 className="col-span-4 font-semibold text-xl mb-4">{breadcrumbs && breadcrumbs[breadcrumbs.length - 1].label}</h1>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}