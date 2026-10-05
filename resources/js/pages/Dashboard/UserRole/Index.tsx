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
import { getUserRoleColumns } from './Columns';
import type { Role } from './Columns';
import { UserRoleForm } from './FormCreateEdit';

interface FilterProps {
    search?: string;
    sort?: string;
    direction?: 'asc' | 'desc';
}

export default function UserRole({
    roles,
    filters = {},
}: {
    roles: Paginated<Role>;
    filters?: FilterProps;
}) {
    const { flash } = usePage<PageProps>().props;

    const [search, setSearch] = useState(filters.search || '');
    const tableSort = useServerTableSort(filters);
    const [showFormModal, setShowFormModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | undefined>();

    const openCreateModal = () => {
        setSelectedRole(undefined);
        setShowFormModal(true);
    };

    const openEditModal = (role: Role) => {
        setSelectedRole(role);
        setShowFormModal(true);
    };

    const closeFormModal = () => {
        setShowFormModal(false);
        setSelectedRole(undefined);
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

        router.get(route('dashboard.user-role'), query, {
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
            label: 'User Role',
            url: route('dashboard.user-role'),
        },
    ];

    const columns = getUserRoleColumns({ onEdit: openEditModal });

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
                                <Plus /> Add role
                            </Button>
                        </div>

                        <DashboardSearchFilter
                            value={search}
                            onSearch={handleSearch}
                            onReset={handleReset}
                            showReset={search !== '' || tableSort.hasSorting}
                            placeholder="Search"
                        />

                        <DataShowing meta={roles} label="user roles" />

                        <DataTable
                            data={roles.data}
                            columns={columns}
                            sortKey={tableSort.sort}
                            sortDirection={tableSort.direction}
                            onSort={handleSort}
                            emptyMessage={
                                search
                                    ? 'No user roles match your search.'
                                    : 'No user roles yet.'
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

                <DataPagination meta={roles} />
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
                <DialogContent className="max-h-[90vh] w-full max-w-xl">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedRole
                                ? 'Edit User Role'
                                : 'Create User Role'}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedRole
                                ? 'Update user role data.'
                                : 'Add a new user role.'}
                        </DialogDescription>
                    </DialogHeader>

                    <UserRoleForm
                        role={selectedRole}
                        onCancel={closeFormModal}
                        onSuccess={closeFormModal}
                    />
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
