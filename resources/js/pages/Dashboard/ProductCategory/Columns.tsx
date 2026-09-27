import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { ActionDropdown } from '@/components/common/ActionDropdown';
import { Badge } from '@/components/ui/badge';

export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    is_active: boolean;
}

interface ProductCategoryColumnsProps {
    onEdit: (category: Category) => void;
}

export function getProductCategoryColumns({
    onEdit,
}: ProductCategoryColumnsProps) {
    return [
        {
            key: 'action',
            header: 'Action',
            sortable: false,
            cell: (item: Category) => (
                <ActionDropdown
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
    ];
}
