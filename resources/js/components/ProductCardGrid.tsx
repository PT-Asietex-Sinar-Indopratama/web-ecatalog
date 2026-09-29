import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';

export default function ProductCardGrid({ product }: any) {
    const thumbnailUrl = product.thumbnail_image?.image_url;
    const downloadUrl = product.downloadable_file?.file_url;

    return (
        <article className="group relative flex h-full w-full flex-col items-center gap-4 rounded-xl bg-white transition-transform duration-200 hover:-translate-y-0.5">
            <Link
                href={route('product.show', product.id)}
                aria-label={`View details for ${product.name}`}
                className="absolute inset-0 z-10 cursor-pointer rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none"
            />

            <div className="aspect-[3/4] w-full flex-shrink-0 overflow-hidden rounded-lg bg-blue-100">
                {thumbnailUrl && (
                    <img
                        src={thumbnailUrl}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                    />
                )}
            </div>

            {/* Title, detail, price */}
            <div className="flex w-full flex-1 flex-col">
                {/* Bagian atas: rata atas */}
                <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-slate-900">
                        {product.name}
                    </h4>
                    <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                        <span className="rounded-full border bg-slate-100 px-2 py-0.5">
                            {product.material}
                        </span>
                    </div>
                </div>

                {/* Bagian bawah: didorong ke bawah, sejajar antar card */}
                <div className="mt-auto space-y-4 pt-4">
                    {/* <span className="font-bold text-sm text-slate-900 block">{product.price ?? 'Rp. 0'}</span> */}

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
        </article>
    );
}
