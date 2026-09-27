import { Button } from '@/components/ui/button';

export default function ProductCardList({ index, product }: any) {
    const thumbnailUrl = product.thumbnail_image?.image_url;
    const downloadUrl = product.downloadable_file?.file_url;

    return (
        <div
            key={index}
            className="flex h-auto flex-col items-center justify-between gap-4 rounded-xl bg-white md:h-35 md:flex-row"
        >
            <div className="flex h-full w-full flex-1 items-start justify-start gap-4 md:w-auto">
                <div className="aspect-[3/4] h-auto w-12 flex-shrink-0 overflow-hidden rounded-lg bg-blue-100 md:h-full md:w-auto">
                    {thumbnailUrl && (
                        <img
                            src={thumbnailUrl}
                            alt={product.name}
                            className="h-full w-full object-cover"
                        />
                    )}
                </div>

                <div className="flex h-full flex-col justify-between space-y-4 md:space-y-1">
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-slate-900 md:text-base">
                            {product.name}
                        </h4>
                        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                            <span className="rounded-full border bg-slate-100 px-2 py-0.5">
                                {product.material}
                            </span>
                        </div>
                    </div>

                    {/* <span className="font-bold text-lg text-slate-900">{product.price ?? 'Rp. 0'}</span> */}

                    <div className="w-full md:hidden">
                        <Button
                            className="w-full rounded-lg px-5 py-2 text-xs"
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
                    className="rounded-lg px-5 py-2 text-xs"
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
        </div>
    );
}
