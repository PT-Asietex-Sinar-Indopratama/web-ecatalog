import type { PageProps } from '@inertiajs/core';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import { AlertComponent } from '@/components/common/AlertComponent';
import { DashboardSearchFilter } from '@/components/common/DashboardSearchFilter';
import { DataPagination } from '@/components/common/DataPagination';
import { DataShowing } from '@/components/common/DataShowing';
import { DataTable } from '@/components/common/DataTable';
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
import { getProductImageColumns } from './Columns';
import type { ProductImage } from './Columns';

interface FilterProps {
    search?: string;
    sort?: string;
    direction?: 'asc' | 'desc';
}

export default function ProductImage({
    images,
    filters = {},
}: {
    images: Paginated<ProductImage>;
    filters?: FilterProps;
}) {
    const { flash } = usePage<PageProps>().props;
    const [search, setSearch] = useState(filters.search || '');
    const tableSort = useServerTableSort(filters);
    const [selectedImage, setSelectedImage] = useState<ProductImage | null>(
        null,
    );

    const handleFilter = (
        newSearch: string,
        newSort = tableSort.sort,
        newDirection = tableSort.direction,
    ) => {
        const query: Record<string, string> = {};

        if (newSearch) {
            query.search = newSearch;
        }

        tableSort.appendSortQuery(query, newSort, newDirection);

        router.get(route('dashboard.product-images'), query, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSearch = (newSearch: string) => {
        setSearch(newSearch);
        handleFilter(newSearch);
    };

    const handleReset = () => {
        setSearch('');
        tableSort.resetSort();
        handleFilter('', 'updated_at', 'desc');
    };

    const handleSort = (newSort: string, newDirection: 'asc' | 'desc') => {
        tableSort.applySort(newSort, newDirection, (nextSort, nextDirection) =>
            handleFilter(search, nextSort, nextDirection),
        );
    };

    const breadcrumbs = [
        {
            label: 'Product Images',
            url: route('dashboard.product-images'),
        },
    ];

    const columns = getProductImageColumns({
        onPreview: setSelectedImage,
    });

    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            {flash && (
                <AlertComponent
                    title={flash.message}
                    variant={flash.type}
                    className="col-span-4 mb-4"
                />
            )}

            <div className="col-span-4 space-y-4">
                <Card>
                    <CardContent>
                        <DashboardSearchFilter
                            value={search}
                            onSearch={handleSearch}
                            onReset={handleReset}
                            showReset={search !== '' || tableSort.hasSorting}
                            placeholder="Search product or image"
                        />

                        <DataShowing meta={images} label="product images" />

                        <DataTable
                            data={images.data}
                            columns={columns}
                            sortKey={tableSort.sort}
                            sortDirection={tableSort.direction}
                            onSort={handleSort}
                            emptyMessage={
                                search
                                    ? 'No product images match your search.'
                                    : 'No product images yet.'
                            }
                            emptyAction={
                                search || tableSort.hasSorting
                                    ? {
                                          label: 'Clear search',
                                          onClick: handleReset,
                                      }
                                    : undefined
                            }
                        />
                    </CardContent>
                </Card>

                <DataPagination meta={images} />
            </div>

            <Dialog
                open={!!selectedImage}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedImage(null);
                    }
                }}
            >
                <DialogContent className="max-h-[90vh] w-full max-w-5xl!">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedImage?.product?.name ?? 'Product image'}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedImage?.product?.sku ??
                                'Full image preview'}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedImage && (
                        <div className="flex max-h-[70vh] justify-center overflow-hidden rounded-md border bg-muted p-2">
                            <img
                                src={selectedImage.image_url}
                                alt={
                                    selectedImage.product?.name ??
                                    'Product image'
                                }
                                className="max-h-[65vh] w-full object-contain"
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
