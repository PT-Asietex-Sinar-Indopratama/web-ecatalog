import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDateTime } from '@/lib/formatDate';

export interface ProductFile {
    id: number;
    product?: {
        id: number;
        name: string;
        sku: string;
    };
    file_path: string;
    file_name: string;
    file_type: string;
    file_url: string;
    created_at?: string;
    updated_at?: string;
}

interface ProductFileColumnsProps {
    onPreview: (file: ProductFile) => void;
}

export function getProductFileColumns({ onPreview }: ProductFileColumnsProps) {
    return [
        {
            key: 'preview',
            header: 'Preview',
            sortable: false,
            className: 'w-1 whitespace-nowrap',
            cell: (item: ProductFile) => (
                <div className="inline-flex w-max gap-2 whitespace-nowrap">
                    <Button
                        type="button"
                        variant="secondary"
                        size="icon-sm"
                        className="gap-2 md:h-8 md:w-auto md:px-2.5"
                        onClick={() => onPreview(item)}
                    >
                        <span className="hidden md:block">Detail</span>
                        <Eye />
                    </Button>
                </div>
            ),
        },
        {
            key: 'file_name',
            header: 'File',
            sortable: true,
            cell: (item: ProductFile) => (
                <div className="">
                    <span className="max-w-sm truncate">{item.file_name}</span>
                    <p className="text-xs text-muted-foreground uppercase">
                        {item.file_type}
                    </p>
                </div>
            ),
        },
        {
            key: 'product',
            header: 'Product',
            sortable: true,
            cell: (item: ProductFile) => (
                <div className="space-y-1">
                    <p className="font-medium">{item.product?.name ?? '-'}</p>
                    <p className="text-xs text-muted-foreground">
                        {item.product?.sku ?? '-'}
                    </p>
                </div>
            ),
        },
        {
            key: 'created_at',
            header: 'Created At',
            sortable: true,
            cell: (item: ProductFile) => formatDateTime(item.created_at),
        },
        {
            key: 'updated_at',
            header: 'Updated At',
            sortable: true,
            cell: (item: ProductFile) => formatDateTime(item.updated_at),
        },
    ];
}
