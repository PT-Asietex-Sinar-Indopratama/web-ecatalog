import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SearchInputProps {
  value?: string;
  onSearch: (value: string) => void;
  placeholder?: string;
  delay?: number;
  className?: string;
}

export function SearchInput({
  value: initialValue = "",
  onSearch,
  placeholder = "Search...",
  delay = 400,
  className = "relative md:flex-1 w-full",
}: SearchInputProps) {
  const [value, setValue] = useState(initialValue);
  const isFirstRender = useRef(true);

  // Sync internal state if external value changes (e.g. page load/reset)
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      onSearch(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div className={className}>
      <Input
        type="text"
        placeholder={placeholder}
        className="pl-7"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground w-3.5 h-3.5" />
    </div>
  );
}
