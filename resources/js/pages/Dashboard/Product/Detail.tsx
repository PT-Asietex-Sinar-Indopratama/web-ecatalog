import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { formatDateTime } from '@/lib/formatDate';
import type { Product } from './Columns';

function DetailField({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1">
            <dt className="text-xs font-medium text-muted-foreground">
                {label}
            </dt>
            <dd className="text-sm break-words">{children}</dd>
        </div>
    );
}

interface ProductDetailDialogProps {
    product?: Product;
    onClose: () => void;
}

export function ProductDetailDialog({
    product,
    onClose,
}: ProductDetailDialogProps) {
    return (
        <Dialog
            open={!!product}
            onOpenChange={(open) => {
                if (!open) {
                    onClose();
                }
            }}
        >
            <DialogContent className="h-[calc(100dvh-2rem)] max-h-[90vh] w-full max-w-3xl!">
                <DialogHeader className="shrink-0">
                    <DialogTitle>
                        {product?.name ?? 'Product Detail'}
                    </DialogTitle>
                    <DialogDescription>
                        Complete product information.
                    </DialogDescription>
                </DialogHeader>

                {product && (
                    <div className="h-0 min-h-0 flex-1 overflow-y-scroll overscroll-contain pr-1">
                        <Card className="shadow-none ring-0">
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Product data
                                </CardTitle>
                                <CardDescription>
                                    All data currently stored for this product.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-5">
                                <dl className="grid gap-4 sm:grid-cols-2">
                                    <DetailField label="ID">
                                        {product.id}
                                    </DetailField>
                                    <DetailField label="SKU">
                                        {product.sku}
                                    </DetailField>
                                    <DetailField label="Name">
                                        {product.name}
                                    </DetailField>
                                    <DetailField label="Price">
                                        {new Intl.NumberFormat('id-ID', {
                                            style: 'currency',
                                            currency: 'IDR',
                                            maximumFractionDigits: 2,
                                        }).format(product.price)}
                                    </DetailField>
                                    <DetailField label="Slug">
                                        {product.slug}
                                    </DetailField>
                                    <DetailField label="Category ID">
                                        {product.category_id}
                                    </DetailField>
                                    <DetailField label="Category">
                                        {product.category?.name ?? '-'}
                                    </DetailField>
                                    <DetailField label="Material">
                                        {product.material}
                                    </DetailField>
                                    <DetailField label="Status">
                                        <Badge
                                            variant={
                                                product.is_active
                                                    ? 'green'
                                                    : 'yellow'
                                            }
                                        >
                                            {product.is_active
                                                ? 'Active'
                                                : 'Inactive'}
                                        </Badge>
                                    </DetailField>
                                    {product.created_at && (
                                        <DetailField label="Created">
                                            {formatDateTime(product.created_at)}
                                        </DetailField>
                                    )}
                                    {product.updated_at && (
                                        <DetailField label="Updated">
                                            {formatDateTime(product.updated_at)}
                                        </DetailField>
                                    )}
                                </dl>

                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Description
                                    </p>
                                    <p className="rounded-md border bg-muted/30 p-3 text-sm leading-6 whitespace-pre-line">
                                        {product.description ||
                                            'No description.'}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Images ({product.images?.length ?? 0})
                                    </p>
                                    {product.images?.length ? (
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            {product.images.map((image) => (
                                                <div
                                                    key={image.id}
                                                    className="overflow-hidden rounded-md border"
                                                >
                                                    <img
                                                        src={image.image_url}
                                                        alt={`${product.name} image`}
                                                        className="aspect-video w-full object-cover"
                                                    />
                                                    <div className="space-y-1 p-2">
                                                        <p className="text-xs text-muted-foreground">
                                                            ID: {image.id}
                                                        </p>
                                                        <p
                                                            className="truncate text-xs"
                                                            title={
                                                                image.image_path
                                                            }
                                                        >
                                                            Path:{' '}
                                                            {image.image_path}
                                                        </p>
                                                        <Badge
                                                            variant={
                                                                image.is_thumbnail
                                                                    ? 'green'
                                                                    : 'outline'
                                                            }
                                                        >
                                                            {image.is_thumbnail
                                                                ? 'Thumbnail'
                                                                : 'Additional image'}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
                                            No images.
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Files ({product.files?.length ?? 0})
                                    </p>
                                    {product.files?.length ? (
                                        <div className="space-y-2">
                                            {product.files.map((file) => (
                                                <a
                                                    key={file.id}
                                                    href={file.file_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex items-center justify-between gap-3 rounded-md border p-3 text-sm hover:bg-muted/60"
                                                >
                                                    <span className="min-w-0 space-y-0.5">
                                                        <span className="block truncate font-medium">
                                                            {file.file_name}
                                                        </span>
                                                        <span className="block truncate text-xs text-muted-foreground">
                                                            ID: {file.id} ·{' '}
                                                            {file.file_type} ·{' '}
                                                            {file.file_path}
                                                        </span>
                                                    </span>
                                                    <Badge variant="outline">
                                                        {file.is_downloadable
                                                            ? 'Downloadable'
                                                            : 'Not downloadable'}
                                                    </Badge>
                                                </a>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
                                            No files.
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <div className="flex shrink-0 justify-end">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
