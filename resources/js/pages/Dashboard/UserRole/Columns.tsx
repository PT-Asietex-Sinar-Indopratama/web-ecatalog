import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { ActionDropdown } from '@/components/common/ActionDropdown';

export interface Role {
    id: number;
    name: string;
    users_count: number;
}

interface UserRoleColumnsProps {
    onEdit: (role: Role) => void;
}

export function getUserRoleColumns({ onEdit }: UserRoleColumnsProps) {
    return [
        {
            key: 'action',
            header: 'Action',
            sortable: false,
            cell: (item: Role) => (
                <ActionDropdown
                    onEdit={() => onEdit(item)}
                    onDelete={() =>
                        router.delete(
                            route('dashboard.user-role.destroy', item.id),
                        )
                    }
                    deleteTitle="Delete Confirmation"
                    deleteDescription={`Are you sure you want to delete "${item.name}" ?`}
                />
            ),
        },
        {
            key: 'name',
            header: 'Role Name',
            sortable: true,
        },
        {
            key: 'users_count',
            header: 'Users',
            sortable: true,
        },
    ];
}
