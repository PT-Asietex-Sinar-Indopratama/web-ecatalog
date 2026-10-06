import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { ActionDropdown } from '@/components/common/ActionDropdown';
import { Badge } from '@/components/ui/badge';

export interface PermissionItem {
    id: number;
    name: string;
}

export interface Role {
    id: number;
    name: string;
    users_count: number;
    permissions?: PermissionItem[];
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
            key: 'permissions',
            header: 'Permissions',
            sortable: false,
            cell: (item: Role) => {
                const perms = item.permissions || [];

                if (perms.length === 0) {
                    return (
                        <span className="text-xs text-muted-foreground">
                            No permissions
                        </span>
                    );
                }

                return (
                    <div className="flex max-w-md flex-wrap gap-1">
                        {perms.slice(0, 4).map((p) => (
                            <Badge key={p.id} variant="secondary">
                                {p.name}
                            </Badge>
                        ))}
                        {perms.length > 4 && (
                            <Badge variant="outline">
                                +{perms.length - 4} more
                            </Badge>
                        )}
                    </div>
                );
            },
        },
        {
            key: 'users_count',
            header: 'Users',
            sortable: true,
        },
    ];
}
