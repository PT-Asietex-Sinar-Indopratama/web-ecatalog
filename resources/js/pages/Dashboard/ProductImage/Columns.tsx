export interface ProductImage {
    id: number;
    product?: {
        id: number;
        name: string;
        sku: string;
    };
    image_path: string;
    image_url: string;
}

export function getProductImageColumns() {
    return [
        {
            key: 'image_url',
            header: 'Preview',
            sortable: false,
            cell: (item: ProductImage) => (
                <img
                    src={item.image_url}
                    alt={item.product?.name ?? 'Product image'}
                    className="h-14 w-14 rounded-md border object-cover"
                />
            ),
        },
        {
            key: 'product',
            header: 'Product',
            sortable: false,
            cell: (item: ProductImage) => (
                <div className="space-y-1">
                    <p className="font-medium">{item.product?.name ?? '-'}</p>
                    <p className="text-xs text-muted-foreground">
                        {item.product?.sku ?? '-'}
                    </p>
                </div>
            ),
        },
        {
            key: 'image_path',
            header: 'Path',
            sortable: true,
            cell: (item: ProductImage) => (
                <span
                    className="block max-w-md truncate"
                    title={item.image_path}
                >
                    {item.image_path}
                </span>
            ),
        },
    ];
}
