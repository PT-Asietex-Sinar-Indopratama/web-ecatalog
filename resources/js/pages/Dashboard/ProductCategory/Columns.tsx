import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { ActionDropdown } from '@/components/common/ActionDropdown';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/lib/formatDate';

export interface Category {
    id: number;
    parent_id: number | null;
    name: string;
    slug: string;
    description: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
    parent?: {
        id: number;
        name: string;
    } | null;
}

interface ProductCategoryColumnsProps {
    onDetail: (category: Category) => void;
    onEdit: (category: Category) => void;
}

export function getProductCategoryColumns({
    onDetail,
    onEdit,
}: ProductCategoryColumnsProps) {
    return [
        {
            key: 'action',
            header: 'Action',
            sortable: false,
            cell: (item: Category) => (
                <ActionDropdown
                    onDetail={() => onDetail(item)}
                    onEdit={() => onEdit(item)}
                    onDelete={() =>
                        router.delete(
                            route(
                                'dashboard.product-category.destroy',
                                item.id,
                            ),
                        )
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
            key: 'parent',
            header: 'Parent Category',
            sortable: false,
            cell: (item: Category) => item.parent?.name ?? 'Top-level',
        },
        {
            key: 'description',
            header: 'Description',
            sortable: true,
        },
        {
            key: 'is_active',
            header: 'Status',
            sortable: true,
            cell: (item: Category) =>
                item.is_active ? (
                    <Badge variant="green">Active</Badge>
                ) : (
                    <Badge variant="yellow">Inactive</Badge>
                ),
        },
        {
            key: 'created_at',
            header: 'Created At',
            sortable: true,
            cell: (item: Category) => formatDateTime(item.created_at),
        },
        {
            key: 'updated_at',
            header: 'Updated At',
            sortable: true,
            cell: (item: Category) => formatDateTime(item.updated_at),
        },
    ];
}
