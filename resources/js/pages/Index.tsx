import { router } from '@inertiajs/react';
import { Filter, Grid2x2, List } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import ProductCardGrid from '@/components/common/ProductCardGrid';
import ProductCardList from '@/components/common/ProductCardList';
import type { ProductCategoryFilter } from '@/components/common/ProductFilter';
import ProductFilter from '@/components/common/ProductFilter';
import { SearchInput } from '@/components/common/SearchInput';
import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '@/components/ui/select';
import AppLayout from '@/Layouts/AppLayout';

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
    thumbnail_image?: {
        id: number;
        image_path: string;
        image_url: string;
        is_thumbnail: boolean;
    } | null;
    downloadable_file?: {
        id: number;
        file_path: string;
        file_name: string;
        file_type: string;
        file_url: string;
        is_downloadable: boolean;
    } | null;
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

interface FilterProps {
    search?: string;
    categories?: string[] | string;
    sort?: SortOption;
}

const sortOptions = [
    { label: 'Terbaru', value: 'latest' },
    { label: 'Terlama', value: 'oldest' },
    { label: 'Nama A-Z', value: 'name_asc' },
    { label: 'Nama Z-A', value: 'name_desc' },
] as const;

type SortOption = (typeof sortOptions)[number]['value'];

function isSortOption(value: string | null): value is SortOption {
    return sortOptions.some((option) => option.value === value);
}

export default function Dashboard({
    products,
    categories,
    filters = {},
}: {
    products: Paginated<Product>;
    categories: ProductCategoryFilter[];
    filters?: FilterProps;
}) {
    // ========== KODE UNTUK VIEW MODE (START) ==========
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
    // ========== KODE UNTUK VIEW MODE (END) ==========

    // ========== KODE UNTUK FILTER (START) ==========
    const initialCategoryIds = Array.isArray(filters.categories)
        ? filters.categories.map(String)
        : filters.categories
          ? [String(filters.categories)]
          : [];

    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategoryIds, setSelectedCategoryIds] =
        useState<string[]>(initialCategoryIds);
    const [sort, setSort] = useState<SortOption>(filters.sort ?? 'latest');
    const selectedSortLabel =
        sortOptions.find((option) => option.value === sort)?.label ?? 'Terbaru';

    const handleFilter = (
        newSearch: string,
        newCategoryIds: string[],
        newSort: SortOption,
    ) => {
        const query: Record<string, string | string[]> = {};

        if (newSearch) {
            query.search = newSearch;
        }

        if (newCategoryIds.length > 0) {
            query.categories = newCategoryIds;
        }

        if (newSort !== 'latest') {
            query.sort = newSort;
        }

        router.get(route('main'), query, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSearch = (newSearch: string) => {
        setSearch(newSearch);
        setSelectedCategoryIds([]);
        handleFilter(newSearch, [], sort);
    };

    const toggleCategory = (categoryId: string) => {
        const nextCategoryIds = selectedCategoryIds.includes(categoryId)
            ? selectedCategoryIds.filter((item) => item !== categoryId)
            : [...selectedCategoryIds, categoryId];

        setSelectedCategoryIds(nextCategoryIds);
        handleFilter(search, nextCategoryIds, sort);
    };

    const handleSortChange = (value: string | null) => {
        const nextSort = isSortOption(value) ? value : 'latest';

        setSort(nextSort);
        handleFilter(search, selectedCategoryIds, nextSort);
    };

    const resetFilters = () => {
        setSearch('');
        setSelectedCategoryIds([]);
        setSort('latest');
        handleFilter('', [], 'latest');
    };
    // ========== KODE UNTUK FILTER (END) ==========

    // ========== KODE UNTUK PAGINATION (START) ==========
    const start = Math.max(
        1,
        Math.min(products.current_page - 1, products.last_page - 2),
    );

    const pages = Array.from(
        { length: Math.min(3, products.last_page) },
        (_, i) => start + i,
    );

    // Bangun URL pagination dengan tetap membawa parameter filter lain.
    const buildPageUrl = (page: number): string => {
        if (typeof window === 'undefined') {
            return `?page=${page}`;
        }

        const params = new URLSearchParams(window.location.search);
        params.delete('view_mode');
        params.set('page', String(page));

        return `?${params.toString()}`;
    };

    // ========== KODE UNTUK PAGINATION (END) ==========

    return (
        <AppLayout className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* SIDEBAR FILTER */}
            <aside className="hidden h-fit space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-md md:block">
                <ProductFilter
                    categories={categories}
                    selectedCategoryIds={selectedCategoryIds}
                    onCategoryChange={toggleCategory}
                    onReset={resetFilters}
                />
            </aside>

            {/* CATALOG SECTION */}
            <main className="space-y-6 lg:col-span-3">
                {/* TOOLBAR: SEARCH, SORT, & VIEW */}
                <div className="mb-4 flex flex-col justify-between gap-4 md:mb-6 md:flex-row md:items-center">
                    {/* SEARCH */}
                    <SearchInput
                        value={search}
                        onSearch={handleSearch}
                        placeholder="Search product..."
                        className="fixed top-0 left-0 z-10 w-full flex-1 border-b border-slate-200 bg-white px-5 py-4 md:relative md:w-auto md:border-none md:px-0 md:py-0"
                        inputClassName="pl-9 bg-slate-50 border-slate-200 w-full"
                        iconClassName="absolute left-8 md:left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                    />

                    {/* ACTIONS: SORT & VIEW */}
                    <div className="mt-[80px] flex w-full items-center justify-between gap-4 md:mt-0 md:w-auto">
                        {/* SORT */}
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span>Urutkan:</span>
                            <Select
                                value={sort}
                                onValueChange={handleSortChange}
                            >
                                <SelectTrigger className="h-9 w-[120px]">
                                    <span className="flex-1 text-left">
                                        {selectedSortLabel}
                                    </span>
                                </SelectTrigger>
                                <SelectContent>
                                    {sortOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* VIEW TOGGLE */}
                        <div className="flex items-center overflow-hidden rounded-lg border bg-slate-50">
                            <Button
                                variant="ghost"
                                size="sm"
                                className={`h-9 gap-1 rounded-none ${
                                    viewMode === 'list'
                                        ? 'bg-white text-slate-900 shadow-sm'
                                        : 'text-slate-500'
                                }`}
                                onClick={() => setViewMode('list')}
                            >
                                <List className="h-4 w-4" />
                                <span className="hidden md:block">List</span>
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                className={`h-9 gap-1 rounded-none ${
                                    viewMode === 'grid'
                                        ? 'bg-white text-slate-900 shadow-sm'
                                        : 'text-slate-500'
                                }`}
                                onClick={() => setViewMode('grid')}
                            >
                                <Grid2x2 className="h-4 w-4" />
                                <span className="hidden md:block">Grid</span>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Filter Mobile */}
                <Drawer>
                    <DrawerTrigger
                        render={
                            <Button
                                variant={'outline'}
                                className="w-full text-sm text-slate-600 md:hidden"
                            >
                                {' '}
                                <Filter
                                    className="!h-3 !w-3"
                                    strokeWidth={2.3}
                                />{' '}
                                Filter{' '}
                            </Button>
                        }
                    />

                    <DrawerContent className="max-h-[80vh] pb-18">
                        <DrawerHeader>
                            <div className="mb-3 flex h-1 w-full items-center justify-center">
                                <div className="h-full w-1/3 rounded-full bg-slate-200"></div>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <DrawerTitle>Filter</DrawerTitle>
                                <Button
                                    className="h-auto p-0 text-xs font-bold text-blue-600 hover:underline"
                                    variant="link"
                                    onClick={resetFilters}
                                >
                                    Reset
                                </Button>
                            </div>
                            <DrawerDescription></DrawerDescription>
                        </DrawerHeader>
                        <div className="h-10 flex-1 scroll-fade overflow-y-auto p-4">
                            <ProductFilter
                                categories={categories}
                                selectedCategoryIds={selectedCategoryIds}
                                onCategoryChange={toggleCategory}
                                onReset={resetFilters}
                                hideHeader={true}
                            />
                        </div>
                        <DrawerFooter>
                            <DrawerClose
                                render={
                                    <Button variant="outline">Close</Button>
                                }
                            />
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>

                <p className="text-sm text-slate-500">
                    Showing {products.from} - {products.to} of {products.total}{' '}
                    products
                </p>

                {/* PRODUCT LIST */}
                <div
                    className={`grid gap-7 ${viewMode === 'list' ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-5'} mb-4 md:mb-20`}
                >
                    {products.data.map((product) =>
                        viewMode === 'list' ? (
                            <ProductCardList
                                key={product.id}
                                product={product}
                            />
                        ) : (
                            <ProductCardGrid
                                key={product.id}
                                product={product}
                            />
                        ),
                    )}
                </div>

                {/* PAGINATION SECTION */}
                <Pagination className="justify-start">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href={products.prev_page_url ?? ''}
                                isDisabled={!products.prev_page_url}
                            />
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
                            <PaginationNext
                                href={products.next_page_url ?? ''}
                                isDisabled={!products.next_page_url}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </main>
        </AppLayout>
    );
}
