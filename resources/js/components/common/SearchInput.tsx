import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';

interface SearchInputProps {
    value?: string;
    onSearch: (value: string) => void;
    placeholder?: string;
    delay?: number;
    className?: string;
    inputClassName?: string;
    iconClassName?: string;
}

export function SearchInput({
    value: initialValue = '',
    onSearch,
    placeholder = 'Search...',
    delay = 400,
    className = 'relative md:flex-1 w-full',
    inputClassName = 'pl-7',
    iconClassName = 'absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground w-3.5 h-3.5',
}: SearchInputProps) {
    const [value, setValue] = useState(initialValue);
    const [previousInitialValue, setPreviousInitialValue] =
        useState(initialValue);
    const isFirstRender = useRef(true);

    if (initialValue !== previousInitialValue) {
        setPreviousInitialValue(initialValue);
        setValue(initialValue);
    }

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;

            return;
        }

        const timer = setTimeout(() => {
            onSearch(value);
        }, delay);

        return () => clearTimeout(timer);
    }, [value, delay, onSearch]);

    return (
        <div className={className}>
            <Input
                type="text"
                placeholder={placeholder}
                className={inputClassName}
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <Search className={iconClassName} />
        </div>
    );
}
