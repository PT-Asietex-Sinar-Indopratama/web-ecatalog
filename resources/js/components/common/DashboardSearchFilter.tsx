import { RotateCcw } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { SearchInput } from './SearchInput';

interface DashboardSearchFilterProps {
    value: string;
    onSearch: (value: string) => void;
    onReset: () => void;
    showReset: boolean;
    placeholder?: string;
    children?: ReactNode;
}

export function DashboardSearchFilter({
    value,
    onSearch,
    onReset,
    showReset,
    placeholder = 'Search',
    children,
}: DashboardSearchFilterProps) {
    return (
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <SearchInput
                value={value}
                onSearch={onSearch}
                placeholder={placeholder}
            />

            {children}

            {showReset && (
                <Button
                    type="button"
                    variant="secondary"
                    aria-label="Reset filters"
                    className="min-h-11 shrink-0 sm:min-h-8"
                    onClick={onReset}
                >
                    <RotateCcw />
                    <span className="hidden sm:inline-block">Reset</span>
                </Button>
            )}
        </div>
    );
}
