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
import type { Category } from './Columns';

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

interface ProductCategoryDetailDialogProps {
    category?: Category;
    onClose: () => void;
}

export function ProductCategoryDetailDialog({
    category,
    onClose,
}: ProductCategoryDetailDialogProps) {
    return (
        <Dialog
            open={!!category}
            onOpenChange={(open) => {
                if (!open) {
                    onClose();
                }
            }}
        >
            <DialogContent className="h-[calc(100dvh-2rem)] max-h-[90vh] w-full max-w-2xl!">
                <DialogHeader className="shrink-0">
                    <DialogTitle>
                        {category?.name ?? 'Product Category Detail'}
                    </DialogTitle>
                    <DialogDescription>
                        Complete product category information.
                    </DialogDescription>
                </DialogHeader>

                {category && (
                    <div className="h-0 min-h-0 flex-1 overflow-y-scroll overscroll-contain pr-1">
                        <Card className="shadow-none ring-0">
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Category data
                                </CardTitle>
                                <CardDescription>
                                    All data currently stored for this category.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-5">
                                <dl className="grid gap-4 sm:grid-cols-2">
                                    <DetailField label="ID">
                                        {category.id}
                                    </DetailField>
                                    <DetailField label="Name">
                                        {category.name}
                                    </DetailField>
                                    <DetailField label="Slug">
                                        {category.slug}
                                    </DetailField>
                                    <DetailField label="Parent ID">
                                        {category.parent_id ?? '-'}
                                    </DetailField>
                                    <DetailField label="Parent Category">
                                        {category.parent?.name ?? 'Top-level'}
                                    </DetailField>
                                    <DetailField label="Status">
                                        <Badge
                                            variant={
                                                category.is_active
                                                    ? 'green'
                                                    : 'yellow'
                                            }
                                        >
                                            {category.is_active
                                                ? 'Active'
                                                : 'Inactive'}
                                        </Badge>
                                    </DetailField>
                                </dl>

                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Description
                                    </p>
                                    <p className="rounded-md border bg-muted/30 p-3 text-sm leading-6 whitespace-pre-line">
                                        {category.description ||
                                            'No description.'}
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
