import type { PageProps } from '@inertiajs/core';
import { router, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import { AlertComponent } from '@/components/common/AlertComponent';
import { DashboardSearchFilter } from '@/components/common/DashboardSearchFilter';
import { DataPagination } from '@/components/common/DataPagination';
import { DataShowing } from '@/components/common/DataShowing';
import { DataTable } from '@/components/common/DataTable';
import { StatusFilter } from '@/components/common/StatusFilter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useServerTableSort } from '@/hooks/use-server-table-sort';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { Paginated } from '@/types';
import { getProductCategoryColumns } from './Columns';
import type { Category } from './Columns';
import { ProductCategoryDetailDialog } from './Detail';
import { ProductCategoryForm } from './FormCreateEdit';
import type { CategoryOption } from './FormCreateEdit';

interface FilterProps {
    search?: string;
    status?: string;
    sort?: string;
    direction?: 'asc' | 'desc';
}

export default function ProductCategory({
    category,
    categoryOptions,
    filters = {},
}: {
    category: Paginated<Category>;
    categoryOptions: CategoryOption[];
    filters?: FilterProps;
}) {
    const { flash } = usePage<PageProps>().props;

    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const tableSort = useServerTableSort(filters);
    const [showFormModal, setShowFormModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<
        Category | undefined
    >();
    const [selectedCategoryDetail, setSelectedCategoryDetail] = useState<
        Category | undefined
    >();

    const openCreateModal = () => {
        setSelectedCategory(undefined);
        setShowFormModal(true);
    };

    const openEditModal = (category: Category) => {
        setSelectedCategory(category);
        setShowFormModal(true);
    };

    const closeFormModal = () => {
        setShowFormModal(false);
        setSelectedCategory(undefined);
    };

    const openDetailModal = (category: Category) => {
        setSelectedCategoryDetail(category);
    };

    const closeDetailModal = () => {
        setSelectedCategoryDetail(undefined);
    };

    const handleFilter = (
        newSearch: string,
        newStatus: string,
        newSort = tableSort.sort,
        newDirection = tableSort.direction,
    ) => {
        const query: Record<string, string> = {};

        if (newSearch) {
            query.search = newSearch;
        }

        if (newStatus && newStatus !== 'all') {
            query.status = newStatus;
        }

        tableSort.appendSortQuery(query, newSort, newDirection);

        router.get(route('dashboard.product-category'), query, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSearch = (newSearch: string) => {
        setSearch(newSearch);
        handleFilter(newSearch, status);
    };

    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
        handleFilter(search, newStatus);
    };

    const handleReset = () => {
        setSearch('');
        setStatus('all');
        tableSort.resetSort();
        handleFilter('', 'all', 'updated_at', 'desc');
    };

    const handleSort = (newSort: string, newDirection: 'asc' | 'desc') => {
        tableSort.applySort(newSort, newDirection, (nextSort, nextDirection) =>
            handleFilter(search, status, nextSort, nextDirection),
        );
    };

    const breadcrumbs = [
        {
            label: 'Product Category',
            url: route('dashboard.product-category'),
        },
    ];

    const columns = getProductCategoryColumns({
        onDetail: openDetailModal,
        onEdit: openEditModal,
    });

    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            {/* FLASH SECTION */}
            {flash && (
                <AlertComponent
                    title={flash.message}
                    variant={flash.type}
                    className="col-span-4 mb-4"
                />
            )}

            {/* ADD, FILTER AND TABLE SECTION */}
            <div className="col-span-4 space-y-4">
                <Card>
                    <CardContent>
                        {/* ADD SECTION */}
                        <div className="mb-4 flex justify-end">
                            <Button onClick={openCreateModal}>
                                <Plus /> Add category
                            </Button>
                        </div>

                        {/* FILTER SECTION */}
                        <DashboardSearchFilter
                            value={search}
                            onSearch={handleSearch}
                            onReset={handleReset}
                            showReset={
                                search !== '' ||
                                status !== 'all' ||
                                tableSort.hasSorting
                            }
                            placeholder="Search"
                        >
                            <StatusFilter
                                value={status}
                                onChange={handleStatusChange}
                            />
                        </DashboardSearchFilter>

                        <DataShowing
                            meta={category}
                            label="product categories"
                        />

                        {/* TABLE */}
                        <DataTable
                            data={category.data}
                            columns={columns}
                            sortKey={tableSort.sort}
                            sortDirection={tableSort.direction}
                            onSort={handleSort}
                            emptyMessage={
                                search || status !== 'all'
                                    ? 'No categories match your filters.'
                                    : 'No categories yet.'
                            }
                            emptyAction={
                                search ||
                                status !== 'all' ||
                                tableSort.hasSorting
                                    ? {
                                          label: 'Clear filters',
                                          onClick: handleReset,
                                      }
                                    : undefined
                            }
                        />
                    </CardContent>
                </Card>

                {/* PAGINATION */}
                <DataPagination meta={category} />
            </div>

            <Dialog
                open={showFormModal}
                onOpenChange={(open) => {
                    if (!open) {
                        closeFormModal();
                    } else {
                        setShowFormModal(true);
                    }
                }}
            >
                <DialogContent
                    className="h-[calc(100dvh-2rem)] max-h-[90vh] w-full max-w-xl"
                    scrollable={false}
                >
                    <DialogHeader className="shrink-0">
                        <DialogTitle>
                            {selectedCategory
                                ? 'Edit Product Category'
                                : 'Create Product Category'}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedCategory
                                ? 'Update product category data.'
                                : 'Add a new product category.'}
                        </DialogDescription>
                    </DialogHeader>

                    <ProductCategoryForm
                        key={selectedCategory?.id ?? 'new'}
                        category={selectedCategory}
                        categories={categoryOptions}
                        onCancel={closeFormModal}
                        onSuccess={closeFormModal}
                    />
                </DialogContent>
            </Dialog>

            <ProductCategoryDetailDialog
                category={selectedCategoryDetail}
                onClose={closeDetailModal}
            />
        </DashboardLayout>
    );
}
