import React, { useState } from "react";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Filter,
  LayoutList,
  LayoutGrid,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import Navbar from '@/components/Navbar';
import ProductCardGrid from '@/components/ProductCardGrid';
import ProductCardList from "@/components/ProductCardList";
import AppLayout from "@/Layouts/AppLayout";
import ProductFilter, { FilterState } from "@/components/ProductFilter";
import { router } from '@inertiajs/react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Product {
  id: number;
  category_id?: number;
  sku?: string;
  name: string;
  slug?: string;
  description?: string;
  material?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface Paginated<T> {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  current_page_url: string;
  first_page_url: string;
  last_page_url: string;
  next_page_url: string | null;
  prev_page_url: string | null;
  path: string;
  from: number;
  to: number;
  data: T[];
}

export default function Dashboard({ products }: { products: Paginated<Product> }) {

  // ========== KODE UNTUK VIEW MODE (START) ==========
  // Ambil view_mode dari URL, default ke 'grid'
  const getInitialViewMode = (): 'list' | 'grid' => {
    if (typeof window === 'undefined') return 'list';
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('view_mode');
    return mode === 'grid' ? 'grid' : 'list';
  };

  const [viewMode, setViewMode] = useState<'list' | 'grid'>(getInitialViewMode);

  const changeViewMode = (mode: 'list' | 'grid') => {
    const params = new URLSearchParams(window.location.search);
    params.delete('view_mode');
    params.set('view_mode', mode);

    setViewMode(mode); // update state lokal supaya UI langsung re-render

    router.get(
      window.location.pathname,
      Object.fromEntries(params.entries()),
      {
        preserveState: true,
        preserveScroll: true,
      }
    );
  };
  // ========== KODE UNTUK VIEW MODE (END) ==========

  // ========== KODE UNTUK FILTER (START) ==========
  const [openFilter, setOpenFilter] = useState<FilterState>({
    basic: true,
    oversize: false,
    polo: false,
    jaket: false,
    hoodie: false,
    sportwear: false,
    ladies: false,
  });

  const toggleFilter = (key: keyof FilterState) => {
    setOpenFilter((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  // ========== KODE UNTUK FILTER (END) ==========

  // ========== KODE UNTUK PAGINATION (START) ==========
  const start = Math.max(
    1,
    Math.min(products.current_page - 1, products.last_page - 2)
  );

  const pages = Array.from(
    { length: Math.min(3, products.last_page) },
    (_, i) => start + i
  );

  // Bangun URL pagination dengan tetap membawa semua parameter lain (view_mode, search, dll)
  const buildPageUrl = (page: number): string => {
    if (typeof window === 'undefined') return `?page=${page}`;
    const params = new URLSearchParams(window.location.search);
    params.set('page', String(page));
    return `?${params.toString()}`;
  };

  // ========== KODE UNTUK PAGINATION (END) ==========


  return (
    <AppLayout className="md:py-8 grid grid-cols-1 lg:grid-cols-4 gap-8 md:mt-[64px] md:pb-[200px]">

      {/* SIDEBAR FILTER */}
      <aside className="hidden md:block bg-white p-5 rounded-xl border border-slate-200 h-fit space-y-4">
        <ProductFilter openFilter={openFilter} toggleFilter={toggleFilter} />
      </aside>

      {/* CATALOG SECTION */}
      <main className="lg:col-span-3 space-y-6">

        {/* TOOLBAR: SEARCH, SORT, & VIEW */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-6">

          {/* SEARCH */}
          <div className="fixed md:static flex-1 left-0 top-0 w-full md:w-auto z-10 py-4 md:py-0 px-5 md:px-0 bg-white border-b md:border-none border-slate-200">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Search product..." className="pl-9 bg-slate-50 border-slate-200 w-full" />
            </div>
          </div>

          {/* ACTIONS: SORT & VIEW */}
          <div className="flex items-center justify-between gap-4 w-full md:w-auto mt-[80px] md:mt-0">

            {/* SORT */}
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>Urutkan:</span>
              <Select defaultValue="Populer">
                <SelectTrigger className="w-[120px] h-9">
                  <SelectValue placeholder="Populer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Populer">Populer</SelectItem>
                  <SelectItem value="Terbaru">Terbaru</SelectItem>
                  <SelectItem value="Termurah">Termurah</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* VIEW TOGGLE */}
            <div className="flex items-center overflow-hidden rounded-lg border bg-slate-50">
              <Button
                variant="ghost"
                size="sm"
                className={`h-9 gap-1 rounded-none ${viewMode === 'list'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500'
                  }`}
                onClick={() => changeViewMode('list')}
              >
                <LayoutList className="h-4 w-4" />
                <span className="hidden md:block">List</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className={`h-9 gap-1 rounded-none ${viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500'
                  }`}
                onClick={() => changeViewMode('grid')}
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden md:block">Grid</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Filter Mobile */}
        <Drawer>
          <DrawerTrigger
            render={
              <Button variant={"outline"} className="w-full md:hidden text-slate-600 text-sm"> <Filter className="!w-3 !h-3" strokeWidth={2.3} /> Filter </Button>
            } />

          <DrawerContent className="pb-18 max-h-[80vh]">
            <DrawerHeader>
              <div className="flex w-full justify-center items-center h-1 mb-3">
                <div className="h-full w-1/3 rounded-full bg-slate-200"></div>
              </div>
              <DrawerTitle>Filter</DrawerTitle>
              <DrawerDescription>
              </DrawerDescription>
            </DrawerHeader>
            <div className="flex-1 scroll-fade overflow-y-auto h-10 p-4">
              <ProductFilter openFilter={openFilter} toggleFilter={toggleFilter} hideHeader={true} />
            </div>
            <DrawerFooter>
              <Button className="h-[34px]">
                Apply Filter
              </Button>
              <DrawerClose render={<Button variant="outline">Cancel</Button>} />
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        <p className="text-sm text-slate-500">Showing {products.from} - {products.to} of {products.total} products</p>

        {/* PRODUCT LIST */}
        <div className={`gap-4 grid ${viewMode === 'list' ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-5'}`}>
          {products.data.map((product, index) => (
            viewMode === 'list' ? (
              <ProductCardList key={index} product={product} index={index} />
            ) : (
              <ProductCardGrid key={index} product={product} index={index} />
            )
          ))}
        </div>

        {/* PAGINATION SECTION */}
        <Pagination className="justify-start">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href={products.prev_page_url ?? ''} isDisabled={!products.prev_page_url} />
            </PaginationItem>

            {pages.map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href={buildPageUrl(page)}
                  isActive={page === products.current_page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext href={products.next_page_url ?? ''} isDisabled={!products.next_page_url} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

      </main>

    </AppLayout >
  );
}