import { Button } from '@/components/ui/button'

export default function ProductCardGrid({ index, product }: any) {
    return (
        <div
            key={index}
            className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col items-center gap-4 hover:shadow-md transition-shadow w-full h-full"
        >
            {/* Thumbnail Placeholder */}
            <div className="w-full aspect-[3/4] bg-blue-100 rounded-lg flex-shrink-0"></div>

            {/* Title, detail, price */}
            <div className="flex flex-col w-full flex-1">

                {/* Bagian atas: rata atas */}
                <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-slate-900">{product.name}</h4>
                    <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                        <span className="bg-slate-100 px-2 py-0.5 rounded-full border">{product.material}</span>
                    </div>
                </div>

                {/* Bagian bawah: didorong ke bawah, sejajar antar card */}
                <div className="mt-auto space-y-4 pt-4">
                    {/* <span className="font-bold text-sm text-slate-900 block">{product.price ?? 'Rp. 0'}</span> */}

                    <Button className="text-xs px-5 py-2 rounded-lg w-full" variant={'default'}>
                        Download
                    </Button>
                </div>

            </div>

        </div>
    )
}