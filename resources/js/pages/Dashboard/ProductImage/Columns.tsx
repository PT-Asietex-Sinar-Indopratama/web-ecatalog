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

interface ProductImageColumnsProps {
    onPreview: (image: ProductImage) => void;
}

export function getProductImageColumns({
    onPreview,
}: ProductImageColumnsProps) {
    return [
        {
            key: 'image_url',
            header: 'Preview',
            sortable: false,
            cell: (item: ProductImage) => (
                <button
                    type="button"
                    onClick={() => onPreview(item)}
                    className="group block cursor-zoom-in rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                    aria-label={`View full image of ${item.product?.name ?? 'product'}`}
                >
                    <img
                        src={item.image_url}
                        alt={item.product?.name ?? 'Product image'}
                        className="h-40 w-40 rounded-md border object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                </button>
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
