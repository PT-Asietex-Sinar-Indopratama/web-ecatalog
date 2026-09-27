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
import { getUserColumns } from './Columns';
import type { Role, User } from './Columns';
import { UserForm } from './FormCreateEdit';

interface FilterProps {
    search?: string;
    status?: string;
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

    const handleFilter = (newSearch: string, newStatus: string) => {
        const query: Record<string, string> = {};

        if (newSearch) {
            query.search = newSearch;
        }

        if (newStatus && newStatus !== 'all') {
            query.status = newStatus;
        }

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
        handleFilter('', 'all');
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
                                <Plus /> Add Data
                            </Button>
                        </div>

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

                        <DataShowing meta={users} label="users" />

                        <DataTable data={users.data} columns={columns} />
                    </CardContent>
                </Card>

                <DataPagination meta={users} />
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
                            {selectedUser ? 'Edit User' : 'Create User'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {selectedUser
                                ? 'Update user access data.'
                                : 'Add a new user access.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <UserForm
                        user={selectedUser}
                        roles={roles}
                        onCancel={closeFormModal}
                        onSuccess={closeFormModal}
                    />
                </AlertDialogContent>
            </AlertDialog>
        </DashboardLayout>
    );
}
