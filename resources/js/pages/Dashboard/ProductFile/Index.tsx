import type { PageProps } from '@inertiajs/core';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import { AlertComponent } from '@/components/common/AlertComponent';
import { DashboardSearchFilter } from '@/components/common/DashboardSearchFilter';
import { DataPagination } from '@/components/common/DataPagination';
import { DataShowing } from '@/components/common/DataShowing';
import { DataTable } from '@/components/common/DataTable';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent } from '@/components/ui/card';
import { useServerTableSort } from '@/hooks/use-server-table-sort';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { Paginated } from '@/types';
import { getProductFileColumns } from './Columns';
import type { ProductFile } from './Columns';

interface FilterProps {
    search?: string;
    sort?: string;
    direction?: 'asc' | 'desc';
}

export default function ProductFile({
    files,
    filters = {},
}: {
    files: Paginated<ProductFile>;
    filters?: FilterProps;
}) {
    const { flash } = usePage<PageProps>().props;
    const [search, setSearch] = useState(filters.search || '');
    const tableSort = useServerTableSort(filters);
    const [selectedFile, setSelectedFile] = useState<ProductFile | undefined>();

    const closePreview = () => {
        setSelectedFile(undefined);
    };

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

        router.get(route('dashboard.product-files'), query, {
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
            label: 'Product Files',
            url: route('dashboard.product-files'),
        },
    ];

    const columns = getProductFileColumns();

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
                            placeholder="Search product or file"
                        />

                        <DataShowing meta={files} label="product files" />

                        <DataTable
                            data={files.data}
                            columns={columns}
                            sortKey={tableSort.sort}
                            sortDirection={tableSort.direction}
                            onSort={handleSort}
                            emptyMessage={
                                search
                                    ? 'No product files match your search.'
                                    : 'No product files yet.'
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

                <DataPagination meta={files} />
            </div>

            <AlertDialog
                open={!!selectedFile}
                onOpenChange={(open) => {
                    if (!open) {
                        closePreview();
                    }
                }}
            >
                <AlertDialogContent
                    className="max-h-[90vh] w-full max-w-4xl!"
                    overlayProps={{ onClick: closePreview }}
                >
                    <AlertDialogHeader className="place-items-start text-left">
                        <AlertDialogTitle>
                            {selectedFile?.file_name ?? 'File Preview'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {selectedFile?.product?.name ?? 'Product file'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    {selectedFile && (
                        <div className="w-full overflow-hidden rounded-md border bg-muted">
                            <iframe
                                src={`${selectedFile.file_url}#toolbar=0&navpanes=0&scrollbar=0&view=Fit`}
                                title={selectedFile.file_name}
                                className="h-full w-full"
                            />
                        </div>
                    )}

                    <AlertDialogHeader>
                        <AlertDialogCancel onClick={closePreview}>
                            Close
                        </AlertDialogCancel>
                    </AlertDialogHeader>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardLayout>
    );
}
