import { Badge } from '@/components/ui/badge';

export interface RequestQuotation {
    id: number;
    product_name: string;
    product_sku: string;
    customer_name: string;
    customer_phone: string;
    company_name: string | null;
    quantity: number | null;
    notes: string | null;
    status: string;
    created_at: string;
    product?: {
        id: number;
        name: string;
        sku: string;
    } | null;
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
}

function formatStatus(status: string) {
    return status.charAt(0).toUpperCase() + status.slice(1);
}

export function getRequestQuotationColumns() {
    return [
        {
            key: 'created_at',
            header: 'Date',
            sortable: true,
            cell: (item: RequestQuotation) => (
                <span className="text-sm whitespace-nowrap">
                    {formatDate(item.created_at)}
                </span>
            ),
        },
        {
            key: 'customer_name',
            header: 'Customer',
            sortable: true,
            cell: (item: RequestQuotation) => (
                <div className="space-y-1">
                    <p className="font-medium">{item.customer_name}</p>
                    <p className="text-xs text-muted-foreground">
                        {item.company_name || item.customer_phone}
                    </p>
                    {item.company_name && (
                        <p className="text-xs text-muted-foreground">
                            {item.customer_phone}
                        </p>
                    )}
                </div>
            ),
        },
        {
            key: 'product_name',
            header: 'Product',
            sortable: true,
            cell: (item: RequestQuotation) => (
                <div className="space-y-1">
                    <p className="max-w-xs truncate font-medium">
                        {item.product_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        SKU: {item.product_sku}
                    </p>
                </div>
            ),
        },
        {
            key: 'quantity',
            header: 'Quantity',
            sortable: true,
            cell: (item: RequestQuotation) => item.quantity ?? '-',
        },
        {
            key: 'notes',
            header: 'Notes',
            sortable: false,
            cell: (item: RequestQuotation) => (
                <span
                    className="block max-w-xs truncate"
                    title={item.notes ?? undefined}
                >
                    {item.notes || '-'}
                </span>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            sortable: true,
            cell: (item: RequestQuotation) => (
                <Badge variant={item.status === 'new' ? 'yellow' : 'secondary'}>
                    {formatStatus(item.status)}
                </Badge>
            ),
        },
    ];
}
