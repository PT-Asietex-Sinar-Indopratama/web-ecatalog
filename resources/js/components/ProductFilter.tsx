import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export interface ProductCategoryFilter {
    id: number;
    name: string;
}

interface ProductFilterProps {
    categories: ProductCategoryFilter[];
    selectedCategoryIds: string[];
    onCategoryChange: (categoryId: string) => void;
    onReset?: () => void;
    className?: string;
    hideHeader?: boolean;
}

export default function ProductFilter({
    categories,
    selectedCategoryIds,
    onCategoryChange,
    onReset,
    className = '',
    hideHeader = false,
}: ProductFilterProps) {
    const [isCategoryOpen, setIsCategoryOpen] = useState(true);

    return (
        <div className={`space-y-4 ${className}`}>
            {!hideHeader && (
                <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="flex items-center gap-2 text-base font-semibold">
                        <Filter className="h-4 w-4" strokeWidth={2.3} /> Filter
                    </h3>
                    <Button
                        className="p-0 text-xs font-bold text-blue-600 hover:underline"
                        variant="link"
                        onClick={onReset}
                    >
                        Reset
                    </Button>
                </div>
            )}

            <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold text-slate-700">
                        Product Category
                    </h4>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-slate-500 hover:text-slate-700"
                        aria-label={
                            isCategoryOpen
                                ? 'Collapse product category filter'
                                : 'Expand product category filter'
                        }
                        aria-expanded={isCategoryOpen}
                        onClick={() => setIsCategoryOpen((current) => !current)}
                    >
                        {isCategoryOpen ? (
                            <ChevronUp className="h-4 w-4" />
                        ) : (
                            <ChevronDown className="h-4 w-4" />
                        )}
                    </Button>
                </div>

                {isCategoryOpen && (
                    <div className="space-y-2 text-sm text-slate-600">
                        {categories.length > 0 ? (
                            categories.map((category) => {
                                const categoryId = String(category.id);

                                return (
                                    <label
                                        key={category.id}
                                        className="flex cursor-pointer items-center gap-2"
                                    >
                                        <Checkbox
                                            checked={selectedCategoryIds.includes(
                                                categoryId,
                                            )}
                                            onCheckedChange={() =>
                                                onCategoryChange(categoryId)
                                            }
                                        />
                                        {category.name}
                                    </label>
                                );
                            })
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No category available.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
