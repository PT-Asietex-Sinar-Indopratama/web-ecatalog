import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';

export default function ProductCardList({ product }: any) {
    const thumbnailUrl = product.thumbnail_image?.image_url;
    const downloadUrl = product.downloadable_file?.file_url;
    const categoryName = product.category?.name;
    const formattedPrice =
        product.price != null
            ? new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  maximumFractionDigits: 2,
              }).format(product.price)
            : 'Rp. 0';

    return (
        <article className="group relative flex h-auto flex-col items-center justify-between gap-4 rounded-xl bg-white transition-transform duration-200 hover:-translate-y-0.5 md:min-h-35 md:flex-row">
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
                            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                        />
                    )}
                </div>

                <div className="flex h-full flex-col justify-between space-y-4 md:space-y-3">
                    <div className="space-y-2.5">
                        <div className="flex flex-col gap-1">
                            {categoryName && (
                                <span className="text-xs font-bold text-slate-900">
                                    {categoryName}
                                </span>
                            )}
                            <span className="truncate text-sm text-slate-900 uppercase">
                                {product.name}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2 text-[0.65rem]">
                            {product.material && (
                                <span className="rounded-full border bg-slate-100 px-2 py-0.5 text-slate-600">
                                    {product.material}
                                </span>
                            )}
                        </div>
                    </div>

                    <span className="text-lg font-bold text-slate-900">
                        {formattedPrice}
                    </span>

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
