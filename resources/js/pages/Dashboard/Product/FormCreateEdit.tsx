import { router, useForm } from '@inertiajs/react';
import {
    CheckCircle2,
    FileText,
    Image,
    Save,
    Trash2,
    Upload,
} from 'lucide-react';
import { useState } from 'react';
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

interface Product {
    id: number;
    category_id: number;
    sku: string;
    name: string;
    slug: string;
    description?: string;
    material: string;
    is_active: boolean;
    images?: ProductImage[];
    files?: ProductFile[];
}

interface ProductImage {
    id: number;
    image_path: string;
    image_url: string;
    is_thumbnail: boolean;
}

interface ProductFile {
    id: number;
    file_path: string;
    file_name: string;
    file_type: string;
    file_url: string;
    is_downloadable: boolean;
}

interface Props {
    product?: Product;
    categories: Array<{
        id: number;
        name: string;
        label: string;
    }>;
    onCancel?: () => void;
    onSuccess?: () => void;
}

export function ProductForm({
    product,
    categories = [],
    onCancel,
    onSuccess,
}: Props) {
    const isEdit = !!product;
    const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
    const [deletedFileIds, setDeletedFileIds] = useState<number[]>([]);
    const existingImages = (product?.images ?? []).filter(
        (image) => !deletedImageIds.includes(image.id),
    );
    const existingFiles = (product?.files ?? []).filter(
        (file) => !deletedFileIds.includes(file.id),
    );
    const hasExistingImage = existingImages.length > 0;
    const hasExistingFile = existingFiles.length > 0;

    const items = [
        { label: 'Active', value: '1' },
        { label: 'Inactive', value: '0' },
    ];

    const { data, setData, post, processing, errors, transform } = useForm({
        category_id: product?.category_id ? String(product.category_id) : '',
        sku: product?.sku ?? '',
        name: product?.name ?? '',
        slug: product?.slug ?? '',
        description: product?.description ?? '',
        material: product?.material ?? '',
        is_active: product ? (product.is_active ? '1' : '0') : '',
        images: [] as File[],
        files: [] as File[],
    });

    const selectedCategoryName = categories.find(
        (item) => String(item.id) === data.category_id,
    )?.label;
    const selectedStatusLabel = items.find(
        (item) => item.value === data.is_active,
    )?.label;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            transform((formData) => ({
                ...formData,
                _method: 'put',
            }));

            post(route('dashboard.product.update', product.id), {
                forceFormData: true,
                preserveScroll: true,
                onSuccess,
            });
        } else {
            transform((formData) => formData);

            post(route('dashboard.product.store'), {
                forceFormData: true,
                preserveScroll: true,
                onSuccess,
            });
        }
    };

    const deleteImage = (imageId: number) => {
        router.delete(route('dashboard.product.image.destroy', imageId), {
            preserveScroll: true,
            onSuccess: () => {
                setDeletedImageIds((imageIds) => [...imageIds, imageId]);
            },
        });
    };

    const deleteFile = (fileId: number) => {
        router.delete(route('dashboard.product.file.destroy', fileId), {
            preserveScroll: true,
            onSuccess: () => {
                setDeletedFileIds((fileIds) => [...fileIds, fileId]);
            },
        });
    };

    return (
        <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col gap-4">
            {/* FORM CARD */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 shadow-none">
                <Card className="grid grid-cols-8 gap-4 border-0 shadow-none [&_div]:mb-0">
                    <CardContent className="col-span-8 flex flex-col gap-4 md:col-span-4 [&_div]:mb-0">
                        {/* CATEGORY */}
                        <Field>
                            <FieldLabel htmlFor="category_id">
                                Category 123{' '}
                                <span className="text-destructive">*</span>
                            </FieldLabel>

                            <Select
                                value={data.category_id}
                                onValueChange={(value) =>
                                    setData('category_id', value ?? '')
                                }
                                required
                            >
                                <SelectTrigger className="w-full">
                                    <span
                                        className={
                                            selectedCategoryName
                                                ? ''
                                                : 'text-muted-foreground'
                                        }
                                    >
                                        {selectedCategoryName ??
                                            'Select Category'}
                                    </span>
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Category</SelectLabel>

                                        {categories.map((item) => (
                                            <SelectItem
                                                key={item.id}
                                                value={String(item.id)}
                                            >
                                                {' '}
                                                {item.label}{' '}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            {errors.category_id && (
                                <p className="text-sm text-red-500">
                                    {' '}
                                    {errors.category_id}{' '}
                                </p>
                            )}
                        </Field>

                        {/* NAME */}
                        <Field>
                            <FieldLabel htmlFor="name">
                                Name <span className="text-destructive">*</span>
                            </FieldLabel>

                            <Input
                                id="name"
                                type="text"
                                placeholder="Ergonomic Office Chair"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                required
                            />

                            {errors.name && (
                                <p className="text-sm text-red-500">
                                    {' '}
                                    {errors.name}{' '}
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
                                placeholder="Comfortable office chair with adjustable height and lumbar support."
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
                                Status{' '}
                                <span className="text-destructive">*</span>
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

                    <CardContent className="col-span-8 flex flex-col gap-4 md:col-span-4 [&_div]:mb-0">
                        {/* SKU */}
                        <Field>
                            <FieldLabel htmlFor="sku">
                                SKU <span className="text-destructive">*</span>
                            </FieldLabel>

                            <Input
                                id="sku"
                                type="text"
                                placeholder="CHR-ERG-001"
                                value={data.sku}
                                onChange={(e) => setData('sku', e.target.value)}
                                required
                            />

                            {errors.sku && (
                                <p className="text-sm text-red-500">
                                    {' '}
                                    {errors.sku}{' '}
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
                                placeholder="ergonomic-office-chair"
                                value={data.slug}
                                onChange={(e) =>
                                    setData('slug', e.target.value)
                                }
                                required
                            />

                            {errors.slug && (
                                <p className="text-sm text-red-500">
                                    {' '}
                                    {errors.slug}{' '}
                                </p>
                            )}
                        </Field>

                        {/* MATERIAL */}
                        <Field>
                            <FieldLabel htmlFor="material">
                                Material{' '}
                                <span className="text-destructive">*</span>
                            </FieldLabel>

                            <Input
                                id="material"
                                type="text"
                                placeholder="Mesh, fabric, and steel"
                                value={data.material}
                                onChange={(e) =>
                                    setData('material', e.target.value)
                                }
                                required
                            />

                            {errors.material && (
                                <p className="text-sm text-red-500">
                                    {' '}
                                    {errors.material}{' '}
                                </p>
                            )}
                        </Field>
                    </CardContent>

                    <CardContent className="col-span-8 grid grid-cols-1 gap-4 [&_div]:mb-0">
                        <Field>
                            <FieldLabel htmlFor="images">
                                Product Image
                            </FieldLabel>

                            <label
                                htmlFor={
                                    hasExistingImage ? undefined : 'images'
                                }
                                aria-disabled={hasExistingImage}
                                className={`flex min-h-28 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-5 text-center text-sm transition ${
                                    hasExistingImage
                                        ? 'cursor-not-allowed opacity-60'
                                        : 'cursor-pointer hover:bg-muted/60'
                                }`}
                            >
                                <Image className="size-5 text-muted-foreground" />
                                <span className="font-medium">
                                    {hasExistingImage
                                        ? 'Delete the existing image to upload a new one'
                                        : 'Upload image'}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    JPG, PNG, or WEBP up to 5 MB
                                </span>
                            </label>

                            <Input
                                id="images"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                disabled={hasExistingImage}
                                className="sr-only"
                                onChange={(e) => {
                                    const image = e.target.files?.[0];
                                    setData('images', image ? [image] : []);
                                }}
                            />

                            {data.images.length > 0 && (
                                <p className="text-sm text-muted-foreground">
                                    Selected: {data.images[0].name}
                                </p>
                            )}

                            {errors.images && (
                                <p className="text-sm text-red-500">
                                    {' '}
                                    {errors.images}{' '}
                                </p>
                            )}
                        </Field>
                        {isEdit && existingImages.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium">
                                    Existing Image
                                </h3>

                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    {existingImages.map((image) => (
                                        <div
                                            key={image.id}
                                            className="group relative overflow-hidden rounded-lg border"
                                        >
                                            <img
                                                src={image.image_url}
                                                alt=""
                                                className="aspect-square w-full object-cover"
                                            />

                                            {image.is_thumbnail && (
                                                <div className="absolute top-2 left-2 flex items-center gap-1 rounded-md bg-green-600 px-2 py-1 text-xs font-medium text-white">
                                                    <CheckCircle2 className="size-3" />
                                                    Thumbnail
                                                </div>
                                            )}

                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon-sm"
                                                className="absolute top-2 right-2 opacity-90"
                                                onClick={() =>
                                                    deleteImage(image.id)
                                                }
                                            >
                                                <Trash2 />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Field>
                            <FieldLabel htmlFor="files">
                                Product File
                            </FieldLabel>

                            <label
                                htmlFor={hasExistingFile ? undefined : 'files'}
                                aria-disabled={hasExistingFile}
                                className={`flex min-h-28 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-5 text-center text-sm transition ${
                                    hasExistingFile
                                        ? 'cursor-not-allowed opacity-60'
                                        : 'cursor-pointer hover:bg-muted/60'
                                }`}
                            >
                                <Upload className="size-5 text-muted-foreground" />
                                <span className="font-medium">
                                    {hasExistingFile
                                        ? 'Delete the existing file to upload a new one'
                                        : 'Upload PDF file'}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    PDF only, up to 10 MB
                                </span>
                            </label>

                            <Input
                                id="files"
                                type="file"
                                accept="application/pdf,.pdf"
                                disabled={hasExistingFile}
                                className="sr-only"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    setData('files', file ? [file] : []);
                                }}
                            />

                            {data.files.length > 0 && (
                                <p className="text-sm text-muted-foreground">
                                    Selected: {data.files[0].name}
                                </p>
                            )}

                            {errors.files && (
                                <p className="text-sm text-red-500">
                                    {' '}
                                    {errors.files}{' '}
                                </p>
                            )}
                        </Field>

                        {isEdit && existingFiles.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium">
                                    Existing File
                                </h3>

                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    {existingFiles.map((file) => (
                                        <div
                                            key={file.id}
                                            className="overflow-hidden rounded-lg border"
                                        >
                                            <div className="relative aspect-square bg-muted">
                                                <iframe
                                                    src={`${file.file_url}#toolbar=0&navpanes=0&scrollbar=0&zoom=page-width`}
                                                    title={file.file_name}
                                                    className="aspect-square h-auto w-auto object-cover"
                                                />

                                                {file.is_downloadable && (
                                                    <div className="absolute top-2 left-2 flex items-center gap-1 rounded-md bg-green-600 px-2 py-1 text-xs font-medium text-white">
                                                        <CheckCircle2 className="size-3" />
                                                        Download
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2 p-2">
                                                <FileText className="size-4 text-muted-foreground" />

                                                <a
                                                    href={file.file_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="min-w-0 flex-1 truncate text-sm hover:underline"
                                                >
                                                    {file.file_name}
                                                </a>

                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon-sm"
                                                    onClick={() =>
                                                        deleteFile(file.id)
                                                    }
                                                >
                                                    <Trash2 />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* BUTTONS */}
            <div className="flex shrink-0 justify-end gap-2">
                <Button
                    type="button"
                    variant="secondary"
                    disabled={processing}
                    className="w-fit"
                    onClick={onCancel}
                >
                    Close
                </Button>

                <Button type="submit" disabled={processing} className="w-30">
                    <Save /> {isEdit ? 'Update' : 'Create'}
                </Button>
            </div>
        </form>
    );
}

export default ProductForm;
