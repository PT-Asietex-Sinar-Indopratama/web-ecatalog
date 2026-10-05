import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';

interface SearchInputProps {
    value?: string;
    onSearch: (value: string) => void;
    placeholder?: string;
    ariaLabel?: string;
    delay?: number;
    className?: string;
    inputClassName?: string;
    iconClassName?: string;
}

export function SearchInput({
    value: initialValue = '',
    onSearch,
    placeholder = 'Search...',
    ariaLabel,
    delay = 400,
    className = 'relative min-w-0 w-full md:flex-1',
    inputClassName = 'h-11 pl-7 sm:h-8',
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
                name="search"
                aria-label={ariaLabel ?? placeholder}
                placeholder={placeholder}
                className={inputClassName}
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <Search aria-hidden="true" className={iconClassName} />
        </div>
    );
}
