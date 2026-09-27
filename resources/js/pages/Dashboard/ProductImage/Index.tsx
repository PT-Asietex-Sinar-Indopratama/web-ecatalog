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
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { Paginated } from '@/types';
import { getProductImageColumns } from './Columns';
import type { ProductImage } from './Columns';

interface FilterProps {
    search?: string;
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

    const handleFilter = (newSearch: string) => {
        const query: Record<string, string> = {};

        if (newSearch) {
            query.search = newSearch;
        }

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
        handleFilter('');
    };

    const breadcrumbs = [
        {
            label: 'Product Images',
            url: route('dashboard.product-images'),
        },
    ];

    const columns = getProductImageColumns();

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
                            showReset={search !== ''}
                            placeholder="Search product or image"
                        />

                        <DataShowing meta={images} label="product images" />

                        <DataTable data={images.data} columns={columns} />
                    </CardContent>
                </Card>

                <DataPagination meta={images} />
            </div>
        </DashboardLayout>
    );
}
