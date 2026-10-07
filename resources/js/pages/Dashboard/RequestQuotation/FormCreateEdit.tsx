import { useForm } from '@inertiajs/react';
import { XCircle } from 'lucide-react';
import { useEffect } from 'react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { RequestQuotation } from './Columns';

export interface FormCreateEditProps {
    quotation?: RequestQuotation;
    open: boolean;
    onClose: () => void;
}

interface UpdateStatusFormData {
    status: string;
    closed_reason: string;
    admin_notes: string;
    updated_at: string;
}

const statusOptions = [
    { label: 'New', value: 'new' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Closed', value: 'closed' },
];

const closedReasonOptions = [
    { label: 'Won — Deal completed', value: 'won' },
    { label: 'Lost — Deal lost', value: 'lost' },
    { label: 'Invalid — Not a valid inquiry', value: 'invalid' },
];

export function FormCreateEdit({
    quotation,
    open,
    onClose,
}: FormCreateEditProps) {
    const { data, setData, put, processing, errors, reset } =
        useForm<UpdateStatusFormData>({
            status: quotation?.status ?? 'new',
            closed_reason: (quotation?.closed_reason ?? '') as string,
            admin_notes: (quotation?.admin_notes ?? '') as string,
            updated_at: quotation?.updated_at ?? '',
        });

    const allErrors = errors as Record<string, string | undefined>;

    useEffect(() => {
        if (!quotation) {
            return;
        }

        setData({
            status: quotation.status,
            closed_reason: (quotation.closed_reason ?? '') as string,
            admin_notes: (quotation.admin_notes ?? '') as string,
            updated_at: quotation.updated_at,
        });
    }, [quotation, setData]);

    if (!quotation) {
        return null;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('dashboard.request-quotations.update-status', quotation.id), {
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    const selectedStatusLabel = statusOptions.find(
        (option) => option.value === data.status,
    )?.label;

    const selectedClosedReasonLabel = closedReasonOptions.find(
        (option) => option.value === data.closed_reason,
    )?.label;

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
                    <DialogTitle>Update Inquiry Status</DialogTitle>
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
                                <SelectValue placeholder="Select status">
                                    {selectedStatusLabel}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.status && (
                            <FieldError>{errors.status}</FieldError>
                        )}
                    </Field>

                    {needsClosedReason && (
                        <Field>
                            <FieldLabel htmlFor="closed_reason">
                                Close reason{' '}
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
                                    <SelectValue placeholder="Select reason">
                                        {selectedClosedReasonLabel}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {closedReasonOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.closed_reason && (
                                <FieldError>{errors.closed_reason}</FieldError>
                            )}
                        </Field>
                    )}

                    <Field>
                        <FieldLabel htmlFor="admin_notes">
                            Internal notes{' '}
                            <span className="text-xs text-muted-foreground">
                                (optional)
                            </span>
                        </FieldLabel>
                        <Textarea
                            id="admin_notes"
                            value={data.admin_notes}
                            onChange={(e) =>
                                setData('admin_notes', e.target.value)
                            }
                            placeholder="Notes for the internal team..."
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
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="update-status-form"
                        disabled={processing}
                    >
                        {processing ? 'Saving...' : 'Save'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default FormCreateEdit;
