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
import { getProductColumns } from './Columns';
import type { Product } from './Columns';
import { ProductDetailDialog } from './Detail';
import { ProductForm } from './FormCreateEdit';

interface Category {
    id: number;
    name: string;
    label: string;
}

interface FilterProps {
    search?: string;
    status?: string;
    sort?: string;
    direction?: 'asc' | 'desc';
}

export default function Product({
    products,
    categories,
    filters = {},
}: {
    products: Paginated<Product>;
    categories: Category[];
    filters?: FilterProps;
}) {
    const { flash } = usePage<PageProps>().props;

    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const tableSort = useServerTableSort(filters);
    const [showFormModal, setShowFormModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<
        Product | undefined
    >();
    const [selectedProductDetail, setSelectedProductDetail] = useState<
        Product | undefined
    >();

    const openCreateModal = () => {
        setSelectedProduct(undefined);
        setShowFormModal(true);
    };

    const openEditModal = (product: Product) => {
        setSelectedProduct(product);
        setShowFormModal(true);
    };

    const closeFormModal = () => {
        setShowFormModal(false);
        setSelectedProduct(undefined);
    };

    const openDetailModal = (product: Product) => {
        setSelectedProductDetail(product);
    };

    const closeDetailModal = () => {
        setSelectedProductDetail(undefined);
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

        router.get(route('dashboard.product'), query, {
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
            label: 'Product',
            url: route('dashboard.product'),
        },
    ];

    const columns = getProductColumns({
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
                                <Plus /> Add product
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

                        <DataShowing meta={products} label="products" />

                        {/* TABLE */}
                        <DataTable
                            data={products.data}
                            columns={columns}
                            sortKey={tableSort.sort}
                            sortDirection={tableSort.direction}
                            onSort={handleSort}
                            emptyMessage={
                                search || status !== 'all'
                                    ? 'No products match your filters.'
                                    : 'No products yet.'
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
                <DataPagination meta={products} />
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
                    className="h-[calc(100dvh-2rem)] max-h-[90vh] w-full max-w-2xl!"
                    scrollable={false}
                >
                    <DialogHeader className="shrink-0">
                        <DialogTitle>
                            {selectedProduct
                                ? 'Edit Product'
                                : 'Create Product'}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedProduct
                                ? 'Update product data.'
                                : 'Add a new product.'}
                        </DialogDescription>
                    </DialogHeader>

                    <ProductForm
                        product={selectedProduct}
                        categories={categories}
                        onCancel={closeFormModal}
                        onSuccess={closeFormModal}
                    />
                </DialogContent>
            </Dialog>

            <ProductDetailDialog
                product={selectedProductDetail}
                onClose={closeDetailModal}
            />
        </DashboardLayout>
    );
}
