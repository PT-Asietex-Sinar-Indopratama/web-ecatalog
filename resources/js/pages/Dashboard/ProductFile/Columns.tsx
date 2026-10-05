import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
}

export function getProductFileColumns() {
    return [
        {
            key: 'preview',
            header: 'Preview',
            sortable: false,
            className: 'w-1 whitespace-nowrap',
            cell: (item: ProductFile) => (
                <div className="inline-flex w-max gap-2 whitespace-nowrap">
                    <a href={item.file_url} target="_blank" rel="noreferrer">
                        <Button
                            type="button"
                            variant="secondary"
                            size="icon-sm"
                            className="gap-2 md:h-8 md:w-auto md:px-2.5"
                        >
                            <span className="hidden md:block">Open</span>
                            <ExternalLink />
                        </Button>
                    </a>
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
    ];
}
