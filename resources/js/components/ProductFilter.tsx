import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { useId, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export interface ProductCategoryFilter {
    id: number;
    parent_id: number | null;
    name: string;
    label: string;
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
    const filterId = useId();
    const parentCategories = categories.filter(
        (category) => category.parent_id === null,
    );
    const [expandedCategoryIds, setExpandedCategoryIds] = useState<string[]>(
        () => parentCategories.map((category) => String(category.id)),
    );

    const toggleCategoryVisibility = (categoryId: string) => {
        setExpandedCategoryIds((current) =>
            current.includes(categoryId)
                ? current.filter((item) => item !== categoryId)
                : [...current, categoryId],
        );
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {!hideHeader && (
                <div className="flex items-center justify-between">
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
                {parentCategories.length > 0 ? (
                    <div className="divide-y divide-slate-200">
                        {parentCategories.map((parentCategory) => {
                            const parentCategoryId = String(parentCategory.id);
                            const isExpanded =
                                expandedCategoryIds.includes(parentCategoryId);
                            const subcategories = categories.filter(
                                (category) =>
                                    category.parent_id === parentCategory.id,
                            );
                            const contentId = `${filterId}-category-${parentCategory.id}`;

                            return (
                                <div key={parentCategory.id}>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="h-auto w-full justify-between rounded-none px-0 py-3 text-sm font-medium text-slate-700 hover:bg-transparent hover:text-slate-700 aria-expanded:bg-transparent aria-expanded:text-slate-700"
                                        aria-expanded={isExpanded}
                                        aria-controls={contentId}
                                        onClick={() =>
                                            toggleCategoryVisibility(
                                                parentCategoryId,
                                            )
                                        }
                                    >
                                        <span>{parentCategory.name}</span>
                                        {isExpanded ? (
                                            <ChevronUp className="h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4" />
                                        )}
                                    </Button>

                                    {isExpanded && (
                                        <div
                                            id={contentId}
                                            className="space-y-2 pb-3 pl-2 text-sm text-slate-600"
                                        >
                                            {subcategories.length > 0 ? (
                                                subcategories.map(
                                                    (subcategory) => {
                                                        const subcategoryId =
                                                            String(
                                                                subcategory.id,
                                                            );

                                                        return (
                                                            <label
                                                                key={
                                                                    subcategory.id
                                                                }
                                                                className="flex cursor-pointer items-center gap-2"
                                                            >
                                                                <Checkbox
                                                                    checked={selectedCategoryIds.includes(
                                                                        subcategoryId,
                                                                    )}
                                                                    onCheckedChange={() =>
                                                                        onCategoryChange(
                                                                            subcategoryId,
                                                                        )
                                                                    }
                                                                />
                                                                {
                                                                    subcategory.name
                                                                }
                                                            </label>
                                                        );
                                                    },
                                                )
                                            ) : (
                                                <p className="text-xs text-muted-foreground">
                                                    No subcategory available.
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        No category available.
                    </p>
                )}
            </div>
        </div>
    );
}
