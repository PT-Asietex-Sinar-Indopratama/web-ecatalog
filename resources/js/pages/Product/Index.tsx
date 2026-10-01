import { Link } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, Download, ImageOff } from 'lucide-react';
import { route } from 'ziggy-js';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
    const image = product.thumbnail_image;
    const downloadableFile = product.downloadable_file;
    const categoryLabel = product.category?.parent
        ? `${product.category.parent.name} / ${product.category.name}`
        : product.category?.name;

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
        </AppLayout>
    );
}
