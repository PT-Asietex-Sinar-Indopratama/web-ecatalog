import type { PageProps } from '@inertiajs/core';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import { AlertComponent } from '@/components/common/AlertComponent';
import { DashboardSearchFilter } from '@/components/common/DashboardSearchFilter';
import { DataPagination } from '@/components/common/DataPagination';
import { DataShowing } from '@/components/common/DataShowing';
import { DataTable } from '@/components/common/DataTable';
import { StatusFilter } from '@/components/common/StatusFilter';
import { Card, CardContent } from '@/components/ui/card';
import { useServerTableSort } from '@/hooks/use-server-table-sort';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { Paginated } from '@/types';
import { getRequestQuotationColumns } from './Columns';
import type { RequestQuotation } from './Columns';

interface FilterProps {
    search?: string;
    status?: string;
    sort?: string;
    direction?: 'asc' | 'desc';
}

const statusOptions = [
    { label: 'Semua', value: 'all' },
    { label: 'New', value: 'new' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Closed', value: 'closed' },
];

export default function RequestQuotation({
    quotations,
    filters = {},
}: {
    quotations: Paginated<RequestQuotation>;
    filters?: FilterProps;
}) {
    const { flash } = usePage<PageProps>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const tableSort = useServerTableSort(filters, 'created_at');

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

        router.get(route('dashboard.request-quotations'), query, {
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
        handleFilter('', 'all', 'created_at', 'desc');
    };

    const handleSort = (newSort: string, newDirection: 'asc' | 'desc') => {
        tableSort.applySort(newSort, newDirection, (nextSort, nextDirection) =>
            handleFilter(search, status, nextSort, nextDirection),
        );
    };

    const breadcrumbs = [
        {
            label: 'Request Quotation',
            url: route('dashboard.request-quotations'),
        },
    ];

    const columns = getRequestQuotationColumns();
    const hasFilters =
        search !== '' || status !== 'all' || tableSort.hasSorting;

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
                            showReset={hasFilters}
                            placeholder="Cari customer atau produk"
                        >
                            <StatusFilter
                                value={status}
                                onChange={handleStatusChange}
                                options={statusOptions}
                            />
                        </DashboardSearchFilter>

                        <DataShowing
                            meta={quotations}
                            label="request quotations"
                        />

                        <DataTable
                            data={quotations.data}
                            columns={columns}
                            sortKey={tableSort.sort}
                            sortDirection={tableSort.direction}
                            onSort={handleSort}
                            emptyMessage={
                                hasFilters
                                    ? 'Tidak ada inquiry yang sesuai filter.'
                                    : 'Belum ada request quotation.'
                            }
                            emptyAction={
                                hasFilters
                                    ? {
                                          label: 'Hapus filter',
                                          onClick: handleReset,
                                      }
                                    : undefined
                            }
                        />
                    </CardContent>
                </Card>

                <DataPagination meta={quotations} />
            </div>
        </DashboardLayout>
    );
}
