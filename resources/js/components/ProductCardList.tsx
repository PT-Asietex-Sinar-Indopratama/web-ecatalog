import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';

export default function ProductCardList({ product }: any) {
    const thumbnailUrl = product.thumbnail_image?.image_url;
    const downloadUrl = product.downloadable_file?.file_url;
    const categoryName = product.category?.name;

    return (
        <article className="group relative flex h-auto flex-col items-center justify-between gap-4 rounded-xl bg-white transition-colors hover:bg-slate-50 md:min-h-35 md:flex-row">
            <Link
                href={route('product.show', product.id)}
                aria-label={`View details for ${product.name}`}
                className="absolute inset-0 z-10 cursor-pointer rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none"
            />

            <div className="flex h-full w-full flex-1 items-start justify-start gap-4 md:w-auto">
                <div className="aspect-[3/4] h-auto w-14 flex-shrink-0 overflow-hidden rounded-lg bg-blue-100 md:h-35 md:w-auto">
                    {thumbnailUrl && (
                        <img
                            src={thumbnailUrl}
                            alt={product.name}
                            className="h-full w-full object-cover"
                        />
                    )}
                </div>

                <div className="flex h-full flex-col justify-between space-y-4 md:space-y-3">
                    <div className="space-y-2.5">
                        <h4 className="text-sm font-semibold text-slate-900 md:text-base">
                            {product.name}
                        </h4>
                        <div className="grid gap-1 text-xs text-slate-500 sm:grid-cols-2">
                            {product.sku && (
                                <span className="truncate">
                                    SKU: {product.sku}
                                </span>
                            )}
                            {categoryName && (
                                <span className="truncate">
                                    Category: {categoryName}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs">
                            {product.material && (
                                <span className="rounded-full border bg-slate-100 px-2 py-0.5 text-slate-600">
                                    {product.material}
                                </span>
                            )}
                            <span className="rounded-full border bg-slate-100 px-2 py-0.5 text-slate-600">
                                {downloadUrl ? 'File available' : 'No file'}
                            </span>
                        </div>
                    </div>

                    {/* <span className="font-bold text-lg text-slate-900">{product.price ?? 'Rp. 0'}</span> */}

                    <div className="w-full md:hidden">
                        <Button
                            className="relative z-20 w-full rounded-lg px-5 py-2 text-xs"
                            variant={'default'}
                            disabled={!downloadUrl}
                            render={
                                downloadUrl ? (
                                    <a
                                        href={downloadUrl}
                                        download
                                        target="_blank"
                                        rel="noreferrer"
                                    />
                                ) : undefined
                            }
                        >
                            Download
                        </Button>
                    </div>
                </div>
            </div>

            <div className="hidden h-full w-full flex-1 items-end justify-end pt-3 md:flex md:w-auto md:border-t-0 md:pt-0">
                <Button
                    className="relative z-20 rounded-lg px-5 py-2 text-xs"
                    variant={'default'}
                    disabled={!downloadUrl}
                    render={
                        downloadUrl ? (
                            <a
                                href={downloadUrl}
                                download
                                target="_blank"
                                rel="noreferrer"
                            />
                        ) : undefined
                    }
                >
                    {downloadUrl ? 'Download' : 'Download'}
                </Button>
            </div>
        </article>
    );
}
