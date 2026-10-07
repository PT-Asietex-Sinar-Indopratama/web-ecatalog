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
import type { ProductFile } from './Columns';

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

interface ProductFileDetailDialogProps {
    file?: ProductFile | null;
    onClose: () => void;
}

export function ProductFileDetailDialog({
    file,
    onClose,
}: ProductFileDetailDialogProps) {
    return (
        <Dialog
            open={!!file}
            onOpenChange={(open) => {
                if (!open) {
                    onClose();
                }
            }}
        >
            <DialogContent className="h-[calc(100dvh-2rem)] max-h-[90vh] w-full max-w-5xl!">
                <DialogHeader className="shrink-0">
                    <DialogTitle>
                        {file?.file_name ?? 'Product File Detail'}
                    </DialogTitle>
                    <DialogDescription>
                        Complete product file information and preview.
                    </DialogDescription>
                </DialogHeader>

                {file && (
                    <div className="h-0 min-h-0 flex-1 overflow-y-scroll overscroll-contain pr-1">
                        <Card className="shadow-none ring-0">
                            <CardHeader>
                                <CardTitle className="text-base">
                                    File preview
                                </CardTitle>
                                <CardDescription>
                                    Document preview and stored metadata.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-5">
                                <div className="h-[50vh] w-full overflow-hidden rounded-md border bg-muted">
                                    <iframe
                                        src={`${file.file_url}#toolbar=0&navpanes=0&scrollbar=0&view=Fit`}
                                        title={file.file_name}
                                        className="h-full w-full border-0"
                                    />
                                </div>

                                <dl className="grid gap-4 sm:grid-cols-2">
                                    <DetailField label="File ID">
                                        {file.id}
                                    </DetailField>
                                    <DetailField label="Product ID">
                                        {file.product?.id ?? '-'}
                                    </DetailField>
                                    <DetailField label="Product">
                                        {file.product?.name ?? '-'}
                                    </DetailField>
                                    <DetailField label="SKU">
                                        {file.product?.sku ?? '-'}
                                    </DetailField>
                                    <DetailField label="File Name">
                                        {file.file_name}
                                    </DetailField>
                                    <DetailField label="File Type">
                                        <Badge
                                            variant="outline"
                                            className="uppercase"
                                        >
                                            {file.file_type}
                                        </Badge>
                                    </DetailField>
                                    {file.created_at && (
                                        <DetailField label="Created">
                                            {formatDateTime(file.created_at)}
                                        </DetailField>
                                    )}
                                    {file.updated_at && (
                                        <DetailField label="Updated">
                                            {formatDateTime(file.updated_at)}
                                        </DetailField>
                                    )}
                                </dl>

                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Storage path
                                    </p>
                                    <p className="rounded-md border bg-muted/30 p-3 font-mono text-sm break-all">
                                        {file.file_path}
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Public URL
                                    </p>
                                    <a
                                        href={file.file_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block rounded-md border bg-muted/30 p-3 text-sm break-all text-primary underline-offset-4 hover:underline"
                                    >
                                        {file.file_url}
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
