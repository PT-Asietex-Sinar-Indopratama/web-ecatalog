import { Check, Clock, Hourglass, SquarePen } from 'lucide-react';
import { useState } from 'react';
import { ActionDropdown } from '@/components/common/ActionDropdown';
import { Badge } from '@/components/ui/badge';
import { FormCreateEdit } from './FormCreateEdit';

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
    closed_reason: string | null;
    admin_notes: string | null;
    status_changed_by: number | null;
    status_changed_at: string | null;
    updated_at: string;
    created_at: string;
    status_changed_by_user?: {
        id: number;
        name: string;
    } | null;
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

export function StatusBadge({ status }: { status: string }) {
    if (status === 'new') {
        return (
            <Badge variant="yellow" className="gap-1">
                <Clock className="size-3" />
                New
            </Badge>
        );
    }

    if (status === 'in_progress') {
        return (
            <Badge variant="default" className="gap-1">
                <Hourglass className="size-3" />
                In Progress
            </Badge>
        );
    }

    if (status === 'closed') {
        return (
            <Badge variant="secondary" className="gap-1">
                <Check className="size-3" />
                Closed
            </Badge>
        );
    }

    return <Badge variant="outline">{status}</Badge>;
}

interface RequestQuotationColumnsProps {
    onDetail: (quotation: RequestQuotation) => void;
}

export function getRequestQuotationColumns({
    onDetail,
}: RequestQuotationColumnsProps) {
    return [
        {
            key: 'actions',
            header: 'Action',
            sortable: false,
            cell: (item: RequestQuotation) => (
                <InlineStatusActions
                    quotation={item}
                    onDetail={() => onDetail(item)}
                />
            ),
        },
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
                <div className="space-y-0.5">
                    <p className="font-medium">{item.customer_name}</p>
                    {item.company_name && (
                        <p className="text-xs text-muted-foreground">
                            {item.company_name}
                        </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                        {item.customer_phone}
                    </p>
                </div>
            ),
        },
        {
            key: 'product_name',
            header: 'Product',
            sortable: true,
            cell: (item: RequestQuotation) => (
                <div className="space-y-0.5">
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
            key: 'status',
            header: 'Status',
            sortable: true,
            cell: (item: RequestQuotation) => (
                <div className="space-y-1">
                    <StatusBadge status={item.status} />
                    {item.closed_reason && (
                        <p className="text-xs text-muted-foreground capitalize">
                            {item.closed_reason}
                        </p>
                    )}
                </div>
            ),
        },
    ];
}

function InlineStatusActions({
    quotation,
    onDetail,
}: {
    quotation: RequestQuotation;
    onDetail: () => void;
}) {
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <>
            <ActionDropdown
                onDetail={onDetail}
                triggerLabel="Action"
                contentClassName="w-auto min-w-56"
                customActions={[
                    {
                        label: 'Update / close inquiry',
                        icon: <SquarePen className="h-3.5! w-3.5!" />,
                        className: 'whitespace-nowrap',
                        onClick: () => setDialogOpen(true),
                    },
                ]}
            />

            <FormCreateEdit
                quotation={quotation}
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
            />
        </>
    );
}
