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
import type { RequestQuotation } from './Columns';
import { StatusBadge } from './Columns';

function formatDate(value?: string | null) {
    if (!value) {
        return '-';
    }

    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
}

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

interface RequestQuotationDetailDialogProps {
    quotation?: RequestQuotation;
    onClose: () => void;
}

export function RequestQuotationDetailDialog({
    quotation,
    onClose,
}: RequestQuotationDetailDialogProps) {
    return (
        <Dialog
            open={!!quotation}
            onOpenChange={(open) => {
                if (!open) {
                    onClose();
                }
            }}
        >
            <DialogContent className="h-[calc(100dvh-2rem)] max-h-[90vh] w-full max-w-3xl!">
                <DialogHeader className="shrink-0">
                    <DialogTitle>
                        {quotation?.customer_name ?? 'Request Quotation Detail'}
                    </DialogTitle>
                    <DialogDescription>
                        Complete request quotation information.
                    </DialogDescription>
                </DialogHeader>

                {quotation && (
                    <div className="h-0 min-h-0 flex-1 overflow-y-scroll overscroll-contain pr-1">
                        <Card className="shadow-none ring-0">
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Inquiry data
                                </CardTitle>
                                <CardDescription>
                                    All data currently stored for this request.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-5">
                                <dl className="grid gap-4 sm:grid-cols-2">
                                    <DetailField label="ID">
                                        {quotation.id}
                                    </DetailField>
                                    <DetailField label="Created">
                                        {formatDate(quotation.created_at)}
                                    </DetailField>
                                    <DetailField label="Customer">
                                        {quotation.customer_name}
                                    </DetailField>
                                    <DetailField label="WhatsApp / Phone">
                                        {quotation.customer_phone}
                                    </DetailField>
                                    <DetailField label="Company">
                                        {quotation.company_name ?? '-'}
                                    </DetailField>
                                    <DetailField label="Product">
                                        {quotation.product_name}
                                    </DetailField>
                                    <DetailField label="SKU">
                                        {quotation.product_sku}
                                    </DetailField>
                                    <DetailField label="Quantity">
                                        {quotation.quantity ?? '-'}
                                    </DetailField>
                                    <DetailField label="Status">
                                        <StatusBadge
                                            status={quotation.status}
                                        />
                                    </DetailField>
                                    <DetailField label="Close reason">
                                        {quotation.closed_reason ? (
                                            <Badge
                                                variant="outline"
                                                className="capitalize"
                                            >
                                                {quotation.closed_reason}
                                            </Badge>
                                        ) : (
                                            '-'
                                        )}
                                    </DetailField>
                                    <DetailField label="Status changed at">
                                        {formatDate(
                                            quotation.status_changed_at,
                                        )}
                                    </DetailField>
                                    <DetailField label="Updated">
                                        {formatDate(quotation.updated_at)}
                                    </DetailField>
                                </dl>

                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Customer notes
                                    </p>
                                    <p className="rounded-md border bg-muted/30 p-3 text-sm leading-6 whitespace-pre-line">
                                        {quotation.notes || 'No notes.'}
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Internal notes
                                    </p>
                                    <p className="rounded-md border bg-muted/30 p-3 text-sm leading-6 whitespace-pre-line">
                                        {quotation.admin_notes ||
                                            'No internal notes.'}
                                    </p>
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
