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
import type { ProductImage } from './Columns';

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

interface ProductImageDetailDialogProps {
    image?: ProductImage | null;
    onClose: () => void;
}

export function ProductImageDetailDialog({
    image,
    onClose,
}: ProductImageDetailDialogProps) {
    return (
        <Dialog
            open={!!image}
            onOpenChange={(open) => {
                if (!open) {
                    onClose();
                }
            }}
        >
            <DialogContent className="h-[calc(100dvh-2rem)] max-h-[90vh] w-full max-w-5xl!">
                <DialogHeader className="shrink-0">
                    <DialogTitle>
                        {image?.product?.name ?? 'Product Image Detail'}
                    </DialogTitle>
                    <DialogDescription>
                        Complete product image information.
                    </DialogDescription>
                </DialogHeader>

                {image && (
                    <div className="h-0 min-h-0 flex-1 overflow-y-scroll overscroll-contain pr-1">
                        <Card className="shadow-none ring-0">
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Image preview
                                </CardTitle>
                                <CardDescription>
                                    Full image and stored metadata.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-5">
                                <div className="flex justify-center overflow-hidden rounded-md border bg-muted p-2">
                                    <img
                                        src={image.image_url}
                                        alt={
                                            image.product?.name ??
                                            'Product image'
                                        }
                                        className="max-h-[55vh] w-full object-contain"
                                    />
                                </div>

                                <dl className="grid gap-4 sm:grid-cols-2">
                                    <DetailField label="Image ID">
                                        {image.id}
                                    </DetailField>
                                    <DetailField label="Product ID">
                                        {image.product?.id ?? '-'}
                                    </DetailField>
                                    <DetailField label="Product">
                                        {image.product?.name ?? '-'}
                                    </DetailField>
                                    <DetailField label="SKU">
                                        {image.product?.sku ?? '-'}
                                    </DetailField>
                                    <DetailField label="Type">
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
                                    </DetailField>
                                    {image.created_at && (
                                        <DetailField label="Created">
                                            {formatDateTime(image.created_at)}
                                        </DetailField>
                                    )}
                                    {image.updated_at && (
                                        <DetailField label="Updated">
                                            {formatDateTime(image.updated_at)}
                                        </DetailField>
                                    )}
                                </dl>

                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Storage path
                                    </p>
                                    <p className="rounded-md border bg-muted/30 p-3 text-sm break-all">
                                        {image.image_path}
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Public URL
                                    </p>
                                    <a
                                        href={image.image_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block rounded-md border bg-muted/30 p-3 text-sm break-all text-primary underline-offset-4 hover:underline"
                                    >
                                        {image.image_url}
                                    </a>
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
