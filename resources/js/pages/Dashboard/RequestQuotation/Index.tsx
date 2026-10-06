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
import { Input } from '@/components/ui/input';
import { useServerTableSort } from '@/hooks/use-server-table-sort';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { Paginated } from '@/types';
import { getRequestQuotationColumns } from './Columns';
import type { RequestQuotation } from './Columns';
import { RequestQuotationDetailDialog } from './Detail';

interface FilterProps {
    search?: string;
    status?: string;
    date_preset?: string;
    date_from?: string;
    date_to?: string;
    sort?: string;
    direction?: 'asc' | 'desc';
}

const statusOptions = [
    { label: 'Show All Status', value: 'all' },
    { label: 'New', value: 'new' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Closed', value: 'closed' },
];

const datePresetOptions = [
    { label: 'Show All Dates', value: 'all' },
    { label: 'Today', value: 'today' },
    { label: 'Last 7 Days', value: 'last_7_days' },
    { label: 'Last 30 Days', value: 'last_30_days' },
    { label: 'Custom Range', value: 'custom' },
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
    const [datePreset, setDatePreset] = useState(filters.date_preset || 'all');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    const tableSort = useServerTableSort(filters, 'created_at');
    const [selectedQuotationDetail, setSelectedQuotationDetail] = useState<
        RequestQuotation | undefined
    >();

    const openDetailModal = (quotation: RequestQuotation) => {
        setSelectedQuotationDetail(quotation);
    };

    const closeDetailModal = () => {
        setSelectedQuotationDetail(undefined);
    };

    const handleFilter = (
        newSearch: string,
        newStatus: string,
        newDatePreset = datePreset,
        newDateFrom = dateFrom,
        newDateTo = dateTo,
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

        if (newDatePreset && newDatePreset !== 'all') {
            query.date_preset = newDatePreset;
        }

        if (newDatePreset === 'custom') {
            if (newDateFrom) {
                query.date_from = newDateFrom;
            }

            if (newDateTo) {
                query.date_to = newDateTo;
            }
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

    const handleDatePresetChange = (newDatePreset: string) => {
        setDatePreset(newDatePreset);

        if (newDatePreset !== 'custom') {
            setDateFrom('');
            setDateTo('');
            handleFilter(search, status, newDatePreset, '', '');

            return;
        }

        handleFilter(search, status, newDatePreset, dateFrom, dateTo);
    };

    const handleDateFromChange = (newDateFrom: string) => {
        setDateFrom(newDateFrom);
        handleFilter(search, status, datePreset, newDateFrom, dateTo);
    };

    const handleDateToChange = (newDateTo: string) => {
        setDateTo(newDateTo);
        handleFilter(search, status, datePreset, dateFrom, newDateTo);
    };

    const handleReset = () => {
        setSearch('');
        setStatus('all');
        setDatePreset('all');
        setDateFrom('');
        setDateTo('');
        tableSort.resetSort();
        handleFilter('', 'all', 'all', '', '', 'created_at', 'desc');
    };

    const handleSort = (newSort: string, newDirection: 'asc' | 'desc') => {
        tableSort.applySort(newSort, newDirection, (nextSort, nextDirection) =>
            handleFilter(
                search,
                status,
                datePreset,
                dateFrom,
                dateTo,
                nextSort,
                nextDirection,
            ),
        );
    };

    const breadcrumbs = [
        {
            label: 'Request Quotation',
            url: route('dashboard.request-quotations'),
        },
    ];

    const columns = getRequestQuotationColumns({
        onDetail: openDetailModal,
    });
    const hasFilters =
        search !== '' ||
        status !== 'all' ||
        datePreset !== 'all' ||
        dateFrom !== '' ||
        dateTo !== '' ||
        tableSort.hasSorting;
    const showCustomDateRange = datePreset === 'custom';

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
                            <StatusFilter
                                value={datePreset}
                                onChange={handleDatePresetChange}
                                options={datePresetOptions}
                                placeholder="Tanggal"
                            />
                            {showCustomDateRange && (
                                <div className="grid gap-2 sm:grid-cols-2">
                                    <Input
                                        type="date"
                                        value={dateFrom}
                                        onChange={(event) =>
                                            handleDateFromChange(
                                                event.target.value,
                                            )
                                        }
                                        aria-label="Tanggal mulai"
                                        className="min-h-11 sm:min-h-8 sm:w-[150px]"
                                    />
                                    <Input
                                        type="date"
                                        value={dateTo}
                                        onChange={(event) =>
                                            handleDateToChange(
                                                event.target.value,
                                            )
                                        }
                                        aria-label="Tanggal selesai"
                                        className="min-h-11 sm:min-h-8 sm:w-[150px]"
                                    />
                                </div>
                            )}
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

            <RequestQuotationDetailDialog
                quotation={selectedQuotationDetail}
                onClose={closeDetailModal}
            />
        </DashboardLayout>
    );
}
