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
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { Paginated } from '@/types';
import { getProductColumns } from './Columns';
import type { Product } from './Columns';
import { ProductForm } from './FormCreateEdit';

interface Category {
    id: number;
    name: string;
}

interface FilterProps {
    search?: string;
    status?: string;
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
    const [showFormModal, setShowFormModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<
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

    const handleFilter = (newSearch: string, newStatus: string) => {
        const query: Record<string, string> = {};

        if (newSearch) {
            query.search = newSearch;
        }

        if (newStatus && newStatus !== 'all') {
            query.status = newStatus;
        }

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
        handleFilter('', 'all');
    };

    const breadcrumbs = [
        {
            label: 'Product',
            url: route('dashboard.product'),
        },
    ];

    const columns = getProductColumns({ onEdit: openEditModal });

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
                                <Plus /> Add Data
                            </Button>
                        </div>

                        {/* FILTER SECTION */}
                        <DashboardSearchFilter
                            value={search}
                            onSearch={handleSearch}
                            onReset={handleReset}
                            showReset={search !== '' || status !== 'all'}
                            placeholder="Search"
                        >
                            <StatusFilter
                                value={status}
                                onChange={handleStatusChange}
                            />
                        </DashboardSearchFilter>

                        <DataShowing meta={products} label="products" />

                        {/* TABLE */}
                        <DataTable data={products.data} columns={columns} />
                    </CardContent>
                </Card>

                {/* PAGINATION */}
                <DataPagination meta={products} />
            </div>

            {/* ALERT DIALOG SECTION */}
            <AlertDialog
                open={showFormModal}
                onOpenChange={(open) => {
                    if (!open) {
                        closeFormModal();
                    } else {
                        setShowFormModal(true);
                    }
                }}
            >
                <AlertDialogContent
                    className="max-h-[90vh] w-full max-w-2xl! overflow-y-auto"
                    overlayProps={{ onClick: closeFormModal }}
                >
                    <AlertDialogHeader className="place-items-start text-left">
                        <AlertDialogTitle>
                            {selectedProduct
                                ? 'Edit Product'
                                : 'Create Product'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {selectedProduct
                                ? 'Update product data.'
                                : 'Add a new product.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <ProductForm
                        product={selectedProduct}
                        categories={categories}
                        onCancel={closeFormModal}
                        onSuccess={closeFormModal}
                    />
                </AlertDialogContent>
            </AlertDialog>
        </DashboardLayout>
    );
}
