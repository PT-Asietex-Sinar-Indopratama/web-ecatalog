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
import { getUserColumns } from './Columns';
import type { Role, User } from './Columns';
import { UserForm } from './FormCreateEdit';

interface FilterProps {
    search?: string;
    status?: string;
    sort?: string;
    direction?: 'asc' | 'desc';
}

export default function User({
    users,
    roles,
    filters = {},
}: {
    users: Paginated<User>;
    roles: Role[];
    filters?: FilterProps;
}) {
    const { flash } = usePage<PageProps>().props;

    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const tableSort = useServerTableSort(filters);
    const [showFormModal, setShowFormModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | undefined>();

    const openCreateModal = () => {
        setSelectedUser(undefined);
        setShowFormModal(true);
    };

    const openEditModal = (user: User) => {
        setSelectedUser(user);
        setShowFormModal(true);
    };

    const closeFormModal = () => {
        setShowFormModal(false);
        setSelectedUser(undefined);
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

        router.get(route('dashboard.user'), query, {
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
            label: 'User',
            url: route('dashboard.user'),
        },
    ];

    const columns = getUserColumns({ onEdit: openEditModal });

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
                        <div className="mb-4 flex justify-end">
                            <Button onClick={openCreateModal}>
                                <Plus /> Add user
                            </Button>
                        </div>

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

                        <DataShowing meta={users} label="users" />

                        <DataTable
                            data={users.data}
                            columns={columns}
                            sortKey={tableSort.sort}
                            sortDirection={tableSort.direction}
                            onSort={handleSort}
                            emptyMessage={
                                search || status !== 'all'
                                    ? 'No users match your filters.'
                                    : 'No users yet.'
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

                <DataPagination meta={users} />
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
                <DialogContent className="max-h-[90vh] w-full max-w-2xl!">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedUser ? 'Edit User' : 'Create User'}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedUser
                                ? 'Update user access data.'
                                : 'Add a new user access.'}
                        </DialogDescription>
                    </DialogHeader>

                    <UserForm
                        user={selectedUser}
                        roles={roles}
                        onCancel={closeFormModal}
                        onSuccess={closeFormModal}
                    />
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
