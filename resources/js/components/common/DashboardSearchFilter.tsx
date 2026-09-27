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
        <div className="mb-4 flex items-center gap-4">
            <SearchInput
                value={value}
                onSearch={onSearch}
                placeholder={placeholder}
            />

            {children}

            {showReset && (
                <Button variant="secondary" onClick={onReset}>
                    <RotateCcw />
                    <span className="hidden sm:inline-block">Reset</span>
                </Button>
            )}
        </div>
    );
}
