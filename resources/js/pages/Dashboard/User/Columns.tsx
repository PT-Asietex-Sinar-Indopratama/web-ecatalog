import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { ActionDropdown } from '@/components/common/ActionDropdown';
import { Badge } from '@/components/ui/badge';

export interface Role {
    id: number;
    name: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    roles?: Role[];
}

interface UserColumnsProps {
    onEdit: (user: User) => void;
}

export function getUserColumns({ onEdit }: UserColumnsProps) {
    return [
        {
            key: 'action',
            header: 'Action',
            sortable: false,
            cell: (item: User) => (
                <ActionDropdown
                    onEdit={() => onEdit(item)}
                    onDelete={() =>
                        router.delete(route('dashboard.user.destroy', item.id))
                    }
                    deleteTitle="Delete Confirmation"
                    deleteDescription={`Are you sure you want to delete "${item.name}" ?`}
                />
            ),
        },
        {
            key: 'name',
            header: 'Name',
            sortable: true,
        },
        {
            key: 'email',
            header: 'Email',
            sortable: true,
        },
        {
            key: 'roles',
            header: 'Role',
            sortable: false,
            cell: (item: User) => (
                <div className="flex flex-wrap gap-1">
                    {item.roles?.length ? (
                        item.roles.map((role) => (
                            <Badge key={role.id} variant="secondary">
                                {role.name}
                            </Badge>
                        ))
                    ) : (
                        <span className="text-muted-foreground">No role</span>
                    )}
                </div>
            ),
        },
        {
            key: 'is_active',
            header: 'Status',
            sortable: true,
            cell: (item: User) =>
                item.is_active ? (
                    <Badge variant="green">Active</Badge>
                ) : (
                    <Badge variant="yellow">Inactive</Badge>
                ),
        },
    ];
}
