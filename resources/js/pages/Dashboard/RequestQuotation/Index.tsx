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
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { Paginated } from '@/types';
import { getRequestQuotationColumns } from './Columns';
import type { RequestQuotation } from './Columns';

interface FilterProps {
    search?: string;
    status?: string;
}

const statusOptions = [
    { label: 'Show All', value: 'all' },
    { label: 'New', value: 'new' },
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

    const handleFilter = (newSearch: string, newStatus: string) => {
        const query: Record<string, string> = {};

        if (newSearch) {
            query.search = newSearch;
        }

        if (newStatus && newStatus !== 'all') {
            query.status = newStatus;
        }

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
        handleFilter('', 'all');
    };

    const breadcrumbs = [
        {
            label: 'Request Quotation',
            url: route('dashboard.request-quotations'),
        },
    ];

    const columns = getRequestQuotationColumns();
    const hasFilters = search !== '' || status !== 'all';

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
                            placeholder="Search customer or product"
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
                            emptyMessage={
                                hasFilters
                                    ? 'No request quotations match your filters.'
                                    : 'No request quotations yet.'
                            }
                            emptyAction={
                                hasFilters
                                    ? {
                                          label: 'Clear filters',
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
