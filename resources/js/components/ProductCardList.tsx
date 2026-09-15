import { Button } from '@/components/ui/button'

export default function ProductCardList({index, product}: any){
    return(
        <div
            key={index}
            className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col md:flex-row items-center justify-between gap-4 hover:shadow-md transition-shadow h-auto md:h-35"
        >

            <div className="flex flex-1 items-start justify-start gap-4 w-full md:w-auto h-full">
                {/* Thumbnail Placeholder */}
                <div className="w-12 md:w-auto h-auto md:h-full aspect-[3/4] bg-blue-100 rounded-lg flex-shrink-0"></div>

                <div className="flex flex-col justify-between space-y-4 md:space-y-1 h-full"> 
                    <div className="space-y-2">
                        <h4 className="font-semibold text-sm md:text-base text-slate-900">{product.name}</h4>
                        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                            <span className="bg-slate-100 px-2 py-0.5 rounded-full border">{product.material}</span>
                        </div>
                    </div>

                    {/* <span className="font-bold text-lg text-slate-900">{product.price ?? 'Rp. 0'}</span> */}

                    <div className="w-full md:hidden">
                        <Button className="text-xs px-5 py-2 rounded-lg w-full" variant={'default'}>
                            Download
                        </Button>
                    </div>
                </div>

            </div>

            <div className="hidden md:flex flex-1 items-end justify-end w-full md:w-auto md:border-t-0 pt-3 md:pt-0 h-full">
                <Button className="text-xs px-5 py-2 rounded-lg" variant={'default'}>
                    Download
                </Button>
            </div>

        </div>
    )
}