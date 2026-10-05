import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { ActionDropdown } from '@/components/common/ActionDropdown';
import { Badge } from '@/components/ui/badge';

export interface Product {
    id: number;
    category_id: number;
    category?: {
        id: number;
        name: string;
    };
    sku: string;
    name: string;
    slug: string;
    description?: string;
    material: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
    images?: Array<{
        id: number;
        image_path: string;
        image_url: string;
        is_thumbnail: boolean;
    }>;
    files?: Array<{
        id: number;
        file_path: string;
        file_name: string;
        file_type: string;
        file_url: string;
        is_downloadable: boolean;
    }>;
}

interface ProductColumnsProps {
    onDetail: (product: Product) => void;
    onEdit: (product: Product) => void;
}

export function getProductColumns({ onDetail, onEdit }: ProductColumnsProps) {
    return [
        {
            key: 'action',
            header: 'Action',
            sortable: false,
            cell: (item: Product) => (
                <ActionDropdown
                    onDetail={() => onDetail(item)}
                    onEdit={() => onEdit(item)}
                    onDelete={() =>
                        router.delete(
                            route('dashboard.product.destroy', item.id),
                        )
                    }
                    deleteTitle="Delete Confirmation"
                    deleteDescription={`Are you sure you want to delete "${item.name}" ?`}
                />
            ),
        },
        {
            key: 'sku',
            header: 'SKU',
            sortable: true,
        },
        {
            key: 'name',
            header: 'Name',
            sortable: true,
        },
        {
            key: 'category_id',
            header: 'Category',
            sortable: true,
            cell: (item: Product) => (
                <span
                    className="block max-w-sm truncate"
                    title={item.category?.name ?? item.category_id.toString()}
                >
                    {item.category?.name ?? item.category_id}
                </span>
            ),
        },
        {
            key: 'material',
            header: 'Material',
            sortable: true,
        },
        {
            key: 'is_active',
            header: 'Status',
            sortable: true,
            cell: (item: Product) =>
                item.is_active ? (
                    <Badge variant="green">Active</Badge>
                ) : (
                    <Badge variant="yellow">Inactive</Badge>
                ),
        },
    ];
}
