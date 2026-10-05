import { useForm } from '@inertiajs/react';
import {
    CheckCircle2,
    ChevronDown,
    Clock,
    MessageCircle,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

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
                <MessageCircle className="size-3" />
                In Progress
            </Badge>
        );
    }

    if (status === 'closed') {
        return (
            <Badge variant="secondary" className="gap-1">
                <CheckCircle2 className="size-3" />
                Closed
            </Badge>
        );
    }

    return <Badge variant="outline">{status}</Badge>;
}

interface UpdateStatusFormData {
    status: string;
    closed_reason: string;
    admin_notes: string;
    updated_at: string;
}

function StatusUpdateDialog({
    quotation,
    open,
    onClose,
}: {
    quotation: RequestQuotation;
    open: boolean;
    onClose: () => void;
}) {
    const { data, setData, put, processing, errors, reset } =
        useForm<UpdateStatusFormData>({
            status: quotation.status,
            closed_reason: (quotation.closed_reason ?? '') as string,
            admin_notes: (quotation.admin_notes ?? '') as string,
            updated_at: quotation.updated_at,
        });

    // Allow dynamic error keys (e.g. 'conflict' from backend)
    const allErrors = errors as Record<string, string | undefined>;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('dashboard.request-quotations.update-status', quotation.id), {
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    const needsClosedReason = data.status === 'closed';

    return (
        <Dialog
            open={open}
            onOpenChange={(o) => {
                if (!processing && !o) {
                    onClose();
                }
            }}
        >
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Perbarui Inquiry</DialogTitle>
                    <DialogDescription>
                        {quotation.customer_name} — {quotation.product_name}
                    </DialogDescription>
                </DialogHeader>

                <form
                    id="update-status-form"
                    onSubmit={handleSubmit}
                    className="grid gap-4"
                >
                    <Field>
                        <FieldLabel htmlFor="status">Status</FieldLabel>
                        <Select
                            value={data.status}
                            onValueChange={(v) =>
                                setData('status', (v ?? '') as string)
                            }
                        >
                            <SelectTrigger id="status">
                                <SelectValue placeholder="Pilih status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="in_progress">
                                    In Progress
                                </SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.status && (
                            <FieldError>{errors.status}</FieldError>
                        )}
                    </Field>

                    {needsClosedReason && (
                        <Field>
                            <FieldLabel htmlFor="closed_reason">
                                Alasan penutupan{' '}
                                <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Select
                                value={data.closed_reason}
                                onValueChange={(v) =>
                                    setData(
                                        'closed_reason',
                                        (v ?? '') as string,
                                    )
                                }
                            >
                                <SelectTrigger id="closed_reason">
                                    <SelectValue placeholder="Pilih alasan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="won">
                                        Won — Deal berhasil
                                    </SelectItem>
                                    <SelectItem value="lost">
                                        Lost — Deal gagal
                                    </SelectItem>
                                    <SelectItem value="invalid">
                                        Invalid — Bukan inquiry valid
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.closed_reason && (
                                <FieldError>{errors.closed_reason}</FieldError>
                            )}
                        </Field>
                    )}

                    <Field>
                        <FieldLabel htmlFor="admin_notes">
                            Catatan internal{' '}
                            <span className="text-xs text-muted-foreground">
                                (opsional)
                            </span>
                        </FieldLabel>
                        <Textarea
                            id="admin_notes"
                            value={data.admin_notes}
                            onChange={(e) =>
                                setData('admin_notes', e.target.value)
                            }
                            placeholder="Catatan untuk tim internal..."
                            rows={3}
                        />
                        {errors.admin_notes && (
                            <FieldError>{errors.admin_notes}</FieldError>
                        )}
                    </Field>

                    {allErrors.conflict && (
                        <p className="text-sm text-destructive">
                            <XCircle className="mr-1 inline size-4" />
                            {allErrors.conflict}
                        </p>
                    )}
                </form>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={processing}
                        onClick={onClose}
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        form="update-status-form"
                        disabled={processing}
                    >
                        {processing ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export function getRequestQuotationColumns() {
    return [
        {
            key: 'created_at',
            header: 'Tanggal',
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
            header: 'Produk',
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
            header: 'Jumlah',
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
        {
            key: 'actions',
            header: '',
            sortable: false,
            cell: (item: RequestQuotation) => (
                <InlineStatusActions quotation={item} />
            ),
        },
    ];
}

function InlineStatusActions({ quotation }: { quotation: RequestQuotation }) {
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger
                    render={
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                            Tindak lanjut
                            <ChevronDown className="ml-1 size-3" />
                        </Button>
                    }
                />
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ubah status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setDialogOpen(true)}
                        className="cursor-pointer"
                    >
                        <MessageCircle className="mr-2 size-4" />
                        Perbarui / tutup inquiry
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                        {quotation.notes && (
                            <span
                                title={quotation.notes}
                                className="block max-w-[200px] truncate"
                            >
                                Catatan: {quotation.notes}
                            </span>
                        )}
                        {quotation.status_changed_at && (
                            <span className="block">
                                Diubah:{' '}
                                {formatDate(quotation.status_changed_at)}
                            </span>
                        )}
                    </DropdownMenuLabel>
                </DropdownMenuContent>
            </DropdownMenu>

            <StatusUpdateDialog
                quotation={quotation}
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
            />
        </>
    );
}
