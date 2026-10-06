import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export interface StatusOption {
    label: string;
    value: string;
}

const DEFAULT_STATUS_ITEMS: StatusOption[] = [
    { label: 'Show All Status', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
];

interface StatusFilterProps {
    value?: string;
    onChange: (value: string) => void;
    options?: StatusOption[];
    placeholder?: string;
    className?: string;
}

export function StatusFilter({
    value = 'all',
    onChange,
    options = DEFAULT_STATUS_ITEMS,
    placeholder = 'Status',
    className = 'min-h-11 w-full sm:min-h-8 sm:w-[180px]',
}: StatusFilterProps) {
    const handleValueChange = (val: string | null) => {
        if (val !== null) {
            onChange(val);
        }
    };

    return (
        <Select items={options} value={value} onValueChange={handleValueChange}>
            <SelectTrigger
                className={className}
                aria-label={`Filter by ${placeholder.toLowerCase()}`}
            >
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent>
                <SelectGroup>
                    <SelectLabel>{placeholder}</SelectLabel>
                    {options.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                            {item.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
