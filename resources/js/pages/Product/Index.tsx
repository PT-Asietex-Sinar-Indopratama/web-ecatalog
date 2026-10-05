import { Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle2,
    Download,
    ImageOff,
    MessageCircle,
    Send,
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
import { Field, FieldLabel } from '@/components/ui/field';
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
    description?: string | null;
    material: string;
    category?: ProductCategory | null;
    thumbnail_image?: ProductImage | null;
    downloadable_file?: ProductFile | null;
}

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
                    variant="ghost"
                    className="-ml-2"
                    render={<Link href={route('main')} />}
                >
                    <ArrowLeft />
                    Back to catalog
                </Button>

                {/* <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]"> */}
                <div className="grid items-start gap-8 px-0 lg:grid-cols-[1fr_1fr] lg:px-40">
                    <section>
                        <div className="flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                            {image ? (
                                <img
                                    src={image.image_url}
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-sm text-slate-500">
                                    <ImageOff className="size-8" />
                                    No image available
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="space-y-6 lg:sticky lg:top-24">
                        <div className="space-y-3">
                            {categoryLabel && (
                                <p className="text-sm font-medium text-blue-600">
                                    {categoryLabel}
                                </p>
                            )}
                            <h1 className="text-3xl font-semibold text-slate-950">
                                {product.name}
                            </h1>
                            <p className="text-sm text-slate-500">
                                SKU: {product.sku}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="outline">
                                    {product.material}
                                </Badge>
                                {downloadableFile && (
                                    <Badge variant="green">
                                        <CheckCircle2 />
                                        File available
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <div className="border-t pt-5">
                            <h2 className="mb-2 text-sm font-semibold text-slate-900">
                                Product description
                            </h2>
                            <p className="text-sm leading-6 whitespace-pre-line text-slate-600">
                                {product.description ||
                                    'No product description available.'}
                            </p>
                        </div>

                        <Button
                            size="lg"
                            className="w-full"
                            type="button"
                            onClick={openQuotation}
                        >
                            <MessageCircle />
                            Request quotation
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
                                ? 'Download catalog'
                                : 'File unavailable'}
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
                <DialogContent className="max-h-[90vh] max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Request quotation</DialogTitle>
                        <DialogDescription>
                            Isi data berikut. Setelah tersimpan, WhatsApp Sales
                            akan dibuka dengan detail produk ini.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="rounded-lg bg-slate-50 px-3 py-2 text-sm">
                        <p className="font-medium text-slate-900">
                            {product.name}
                        </p>
                        <p className="text-slate-500">SKU: {product.sku}</p>
                    </div>

                    <form
                        id="request-quotation-form"
                        onSubmit={submitQuotation}
                        className="grid gap-4"
                    >
                        <Field>
                            <FieldLabel htmlFor="customer_name">
                                Nama lengkap{' '}
                                <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Input
                                id="customer_name"
                                value={data.customer_name}
                                onChange={(event) =>
                                    setData('customer_name', event.target.value)
                                }
                                placeholder="Nama Anda"
                                autoComplete="name"
                                required
                            />
                            {errors.customer_name && (
                                <p className="text-sm text-red-500">
                                    {errors.customer_name}
                                </p>
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
                                value={data.customer_phone}
                                onChange={(event) =>
                                    setData(
                                        'customer_phone',
                                        event.target.value,
                                    )
                                }
                                placeholder="08xxxxxxxxxx"
                                autoComplete="tel"
                                required
                            />
                            {errors.customer_phone && (
                                <p className="text-sm text-red-500">
                                    {errors.customer_phone}
                                </p>
                            )}
                        </Field>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field>
                                <FieldLabel htmlFor="company_name">
                                    Nama perusahaan{' '}
                                    <span className="text-xs text-slate-400">
                                        (opsional)
                                    </span>
                                </FieldLabel>
                                <Input
                                    id="company_name"
                                    value={data.company_name}
                                    onChange={(event) =>
                                        setData(
                                            'company_name',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Nama perusahaan"
                                    autoComplete="organization"
                                />
                                {errors.company_name && (
                                    <p className="text-sm text-red-500">
                                        {errors.company_name}
                                    </p>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="quantity">
                                    Jumlah kebutuhan{' '}
                                    <span className="text-xs text-slate-400">
                                        (opsional)
                                    </span>
                                </FieldLabel>
                                <Input
                                    id="quantity"
                                    type="number"
                                    min="1"
                                    value={data.quantity}
                                    onChange={(event) =>
                                        setData('quantity', event.target.value)
                                    }
                                    placeholder="Contoh: 100"
                                />
                                {errors.quantity && (
                                    <p className="text-sm text-red-500">
                                        {errors.quantity}
                                    </p>
                                )}
                            </Field>
                        </div>

                        <Field>
                            <FieldLabel htmlFor="notes">
                                Catatan atau kebutuhan khusus{' '}
                                <span className="text-xs text-slate-400">
                                    (opsional)
                                </span>
                            </FieldLabel>
                            <Textarea
                                id="notes"
                                value={data.notes}
                                onChange={(event) =>
                                    setData('notes', event.target.value)
                                }
                                placeholder="Tuliskan kebutuhan atau pertanyaan Anda"
                                rows={4}
                            />
                            {errors.notes && (
                                <p className="text-sm text-red-500">
                                    {errors.notes}
                                </p>
                            )}
                        </Field>
                    </form>

                    <DialogFooter>
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
                            {processing ? 'Menyimpan...' : 'buka WhatsApp'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
