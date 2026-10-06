import { Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle2,
    Download,
    ImageOff,
    MessageCircle,
    Send,
} from 'lucide-react';
import { useEffect, useState } from 'react';
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
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/Layouts/AppLayout';

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

interface ProductCategory {
    id: number;
    name: string;
    slug: string;
    parent?: {
        id: number;
        name: string;
        slug: string;
    } | null;
}

interface Product {
    id: number;
    sku: string;
    name: string;
    slug: string;
    price: number;
    description?: string | null;
    material: string;
    category?: ProductCategory | null;
    thumbnail_image?: ProductImage | null;
    downloadable_file?: ProductFile | null;
}

const quotationFields = [
    'customer_name',
    'customer_phone',
    'company_name',
    'quantity',
    'notes',
] as const;

export default function ProductShow({ product }: { product: Product }) {
    const [quotationOpen, setQuotationOpen] = useState(false);
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            customer_name: '',
            customer_phone: '',
            company_name: '',
            quantity: '',
            notes: '',
        });

    const image = product.thumbnail_image;
    const downloadableFile = product.downloadable_file;
    const categoryLabel = product.category?.parent
        ? `${product.category.parent.name} / ${product.category.name}`
        : product.category?.name;

    useEffect(() => {
        const invalidField = quotationFields.find((field) => errors[field]);

        if (invalidField) {
            document.getElementById(invalidField)?.focus();
        }
    }, [errors]);

    const openQuotation = () => {
        clearErrors();
        setQuotationOpen(true);
    };

    const submitQuotation = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const whatsappWindow = window.open('', '_blank');

        post(route('product.quotation.store', product.id), {
            preserveScroll: true,
            onSuccess: (page) => {
                const flash = page.props.flash;
                const whatsappUrl = flash?.whatsapp_url;

                setQuotationOpen(false);
                reset();

                if (whatsappUrl) {
                    if (whatsappWindow) {
                        whatsappWindow.location.href = whatsappUrl;
                    } else {
                        window.location.href = whatsappUrl;
                    }
                } else {
                    whatsappWindow?.close();
                }
            },
            onError: () => whatsappWindow?.close(),
        });
    };

    return (
        <AppLayout className="block">
            <div className="space-y-6">
                <Button
                    className="-ml-2 text-muted-foreground"
                    variant="ghost"
                    render={<Link href={route('main')} />}
                >
                    <ArrowLeft />
                    Kembali ke katalog
                </Button>

                <div className="grid items-start gap-8 px-0 lg:grid-cols-[1fr_1fr] lg:px-40">
                    <section>
                        <div className="flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-lg bg-muted">
                            {image ? (
                                <img
                                    src={image.image_url}
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                                    <ImageOff className="size-8" />
                                    Gambar belum tersedia
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="space-y-6 lg:sticky lg:top-24">
                        <div className="space-y-3">
                            {categoryLabel && (
                                <p className="text-sm font-medium text-primary">
                                    {categoryLabel}
                                </p>
                            )}
                            <h1 className="text-3xl font-semibold text-foreground">
                                {product.name}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                SKU: {product.sku}
                            </p>
                            <p className="text-2xl font-semibold text-foreground">
                                {new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                    maximumFractionDigits: 2,
                                }).format(product.price)}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="outline">
                                    {product.material}
                                </Badge>
                                {downloadableFile && (
                                    <Badge variant="green">
                                        <CheckCircle2 />
                                        File tersedia
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <div className="border-t pt-5">
                            <h2 className="mb-2 text-sm font-semibold text-foreground">
                                Deskripsi produk
                            </h2>
                            <p className="text-sm leading-6 whitespace-pre-line text-muted-foreground">
                                {product.description ||
                                    'Deskripsi produk belum tersedia.'}
                            </p>
                        </div>

                        <Button
                            size="lg"
                            className="w-full"
                            type="button"
                            onClick={openQuotation}
                        >
                            <MessageCircle />
                            Minta penawaran
                        </Button>

                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full"
                            disabled={!downloadableFile}
                            render={
                                downloadableFile ? (
                                    <a
                                        href={downloadableFile.file_url}
                                        download
                                        target="_blank"
                                        rel="noreferrer"
                                    />
                                ) : undefined
                            }
                        >
                            <Download />
                            {downloadableFile
                                ? 'Unduh katalog'
                                : 'File belum tersedia'}
                        </Button>
                    </section>
                </div>
            </div>

            <Dialog
                open={quotationOpen}
                onOpenChange={(open) => {
                    if (!processing) {
                        setQuotationOpen(open);
                    }
                }}
            >
                <DialogContent
                    scrollable={false}
                    className="max-h-[90vh] max-w-lg"
                >
                    <DialogHeader>
                        <DialogTitle>Minta penawaran</DialogTitle>
                        <DialogDescription>
                            Isi data berikut. Setelah tersimpan, WhatsApp Sales
                            akan dibuka dengan detail produk ini.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
                        <div className="rounded-lg bg-muted px-3 py-2 text-sm">
                            <p className="font-medium text-foreground">
                                {product.name}
                            </p>
                            <p className="text-muted-foreground">
                                SKU: {product.sku}
                            </p>
                        </div>

                        <form
                            id="request-quotation-form"
                            onSubmit={submitQuotation}
                            className="mt-4 grid gap-4"
                        >
                            <Field>
                                <FieldLabel htmlFor="customer_name">
                                    Nama lengkap{' '}
                                    <span className="text-destructive">*</span>
                                </FieldLabel>
                                <Input
                                    id="customer_name"
                                    name="customer_name"
                                    value={data.customer_name}
                                    onChange={(event) =>
                                        setData(
                                            'customer_name',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Nama Anda"
                                    autoComplete="name"
                                    aria-invalid={!!errors.customer_name}
                                    aria-describedby={
                                        errors.customer_name
                                            ? 'customer_name-error'
                                            : undefined
                                    }
                                    required
                                />
                                {errors.customer_name && (
                                    <FieldError id="customer_name-error">
                                        {errors.customer_name}
                                    </FieldError>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="customer_phone">
                                    Nomor WhatsApp{' '}
                                    <span className="text-destructive">*</span>
                                </FieldLabel>
                                <Input
                                    id="customer_phone"
                                    type="tel"
                                    name="customer_phone"
                                    value={data.customer_phone}
                                    onChange={(event) =>
                                        setData(
                                            'customer_phone',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="08xxxxxxxxxx"
                                    autoComplete="tel"
                                    aria-invalid={!!errors.customer_phone}
                                    aria-describedby={
                                        errors.customer_phone
                                            ? 'customer_phone-error'
                                            : undefined
                                    }
                                    required
                                />
                                {errors.customer_phone && (
                                    <FieldError id="customer_phone-error">
                                        {errors.customer_phone}
                                    </FieldError>
                                )}
                            </Field>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="company_name">
                                        Nama perusahaan{' '}
                                        <span className="text-xs text-muted-foreground">
                                            (opsional)
                                        </span>
                                    </FieldLabel>
                                    <Input
                                        id="company_name"
                                        name="company_name"
                                        value={data.company_name}
                                        onChange={(event) =>
                                            setData(
                                                'company_name',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Nama perusahaan"
                                        autoComplete="organization"
                                        aria-invalid={!!errors.company_name}
                                        aria-describedby={
                                            errors.company_name
                                                ? 'company_name-error'
                                                : undefined
                                        }
                                    />
                                    {errors.company_name && (
                                        <FieldError id="company_name-error">
                                            {errors.company_name}
                                        </FieldError>
                                    )}
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="quantity">
                                        Jumlah kebutuhan{' '}
                                        <span className="text-xs text-muted-foreground">
                                            (opsional)
                                        </span>
                                    </FieldLabel>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        name="quantity"
                                        min="1"
                                        value={data.quantity}
                                        onChange={(event) =>
                                            setData(
                                                'quantity',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Contoh: 100"
                                        aria-invalid={!!errors.quantity}
                                        aria-describedby={
                                            errors.quantity
                                                ? 'quantity-error'
                                                : undefined
                                        }
                                    />
                                    {errors.quantity && (
                                        <FieldError id="quantity-error">
                                            {errors.quantity}
                                        </FieldError>
                                    )}
                                </Field>
                            </div>

                            <Field>
                                <FieldLabel htmlFor="notes">
                                    Catatan atau kebutuhan khusus{' '}
                                    <span className="text-xs text-muted-foreground">
                                        (opsional)
                                    </span>
                                </FieldLabel>
                                <Textarea
                                    id="notes"
                                    name="notes"
                                    value={data.notes}
                                    onChange={(event) =>
                                        setData('notes', event.target.value)
                                    }
                                    placeholder="Tuliskan kebutuhan atau pertanyaan Anda"
                                    rows={4}
                                    aria-invalid={!!errors.notes}
                                    aria-describedby={
                                        errors.notes ? 'notes-error' : undefined
                                    }
                                />
                                {errors.notes && (
                                    <FieldError id="notes-error">
                                        {errors.notes}
                                    </FieldError>
                                )}
                            </Field>
                        </form>
                    </div>

                    <DialogFooter className="shrink-0">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={processing}
                            onClick={() => setQuotationOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            form="request-quotation-form"
                            disabled={processing}
                        >
                            <Send />
                            {processing ? 'Menyimpan...' : 'Kirim permintaan'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
