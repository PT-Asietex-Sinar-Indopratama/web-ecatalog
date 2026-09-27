import { useForm } from '@inertiajs/react';
import { ChevronLeft, Save } from 'lucide-react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    is_active: boolean;
}

interface Props {
    category?: Category;
    onCancel?: () => void;
    onSuccess?: () => void;
}

export function ProductCategoryForm({ category, onCancel, onSuccess }: Props) {
    const isEdit = !!category;

    const items = [
        { label: 'Active', value: '1' },
        { label: 'Inactive', value: '0' },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        name: category?.name ?? '',
        slug: category?.slug ?? '',
        description: category?.description ?? '',
        is_active: category ? (category.is_active ? '1' : '0') : '',
    });

    const selectedStatusLabel = items.find(
        (item) => item.value === data.is_active,
    )?.label;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            put(route('dashboard.product-category.update', category.id), {
                preserveScroll: true,
                onSuccess,
            });
        } else {
            post(route('dashboard.product-category.store'), {
                preserveScroll: true,
                onSuccess,
            });
        }
    };

    return (
        <form onSubmit={submit} className="grid grid-cols-8 gap-4 [&_div]:mb-0">
            {/* FORM CARD */}
            <Card className="col-span-8 grid grid-cols-8 gap-4 border-0 shadow-none [&_div]:mb-0">
                <CardContent className="col-span-8 flex flex-col gap-4 [&_div]:mb-0">
                    {/* NAME */}
                    <Field>
                        <FieldLabel htmlFor="name">
                            Name <span className="text-destructive">*</span>
                        </FieldLabel>

                        <Input
                            id="name"
                            type="text"
                            placeholder="Office Chair"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />

                        {errors.name && (
                            <p className="text-sm text-red-500">
                                {' '}
                                {errors.name}{' '}
                            </p>
                        )}
                    </Field>

                    {/* SLUG */}
                    <Field>
                        <FieldLabel htmlFor="slug">
                            Slug <span className="text-destructive">*</span>
                        </FieldLabel>

                        <Input
                            id="slug"
                            type="text"
                            placeholder="office-chair"
                            value={data.slug}
                            onChange={(e) => setData('slug', e.target.value)}
                            required
                        />

                        {errors.slug && (
                            <p className="text-sm text-red-500">
                                {' '}
                                {errors.slug}{' '}
                            </p>
                        )}
                    </Field>

                    {/* DESCRIPTION */}
                    <Field>
                        <FieldLabel htmlFor="description">
                            Description{' '}
                            <span className="text-destructive">*</span>
                        </FieldLabel>

                        <Textarea
                            id="description"
                            placeholder="Category for office chair products."
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            required
                        />

                        {errors.description && (
                            <p className="text-sm text-red-500">
                                {' '}
                                {errors.description}{' '}
                            </p>
                        )}
                    </Field>

                    {/* STATUS */}
                    <Field>
                        <FieldLabel htmlFor="is_active">
                            Status <span className="text-destructive">*</span>
                        </FieldLabel>

                        <Select
                            value={data.is_active}
                            onValueChange={(value) =>
                                setData('is_active', value ?? '')
                            }
                            required
                        >
                            <SelectTrigger className="w-full">
                                <span
                                    className={
                                        selectedStatusLabel
                                            ? ''
                                            : 'text-muted-foreground'
                                    }
                                >
                                    {selectedStatusLabel ?? 'Select Status'}
                                </span>
                            </SelectTrigger>

                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Status</SelectLabel>

                                    {items.map((item) => (
                                        <SelectItem
                                            key={item.value}
                                            value={item.value}
                                        >
                                            {' '}
                                            {item.label}{' '}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        {errors.is_active && (
                            <p className="text-sm text-red-500">
                                {' '}
                                {errors.is_active}{' '}
                            </p>
                        )}
                    </Field>
                </CardContent>
            </Card>

            {/* BUTTONS */}
            <div className="col-span-8 mt-5 flex justify-end gap-2">
                <Button
                    type="button"
                    variant="secondary"
                    disabled={processing}
                    className="w-fit"
                    onClick={onCancel}
                >
                    <ChevronLeft /> Cancel
                </Button>

                <Button type="submit" disabled={processing} className="w-30">
                    <Save /> {isEdit ? 'Update' : 'Create'}
                </Button>
            </div>
        </form>
    );
}

export default ProductCategoryForm;
