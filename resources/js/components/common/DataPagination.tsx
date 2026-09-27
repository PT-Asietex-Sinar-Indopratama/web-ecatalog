import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import type { Paginated } from '@/types';

interface DataPaginationProps {
    meta: Paginated<any>;
    className?: string;
    maxPages?: number;
}

export function DataPagination({
    meta,
    className = 'justify-start',
    maxPages = 3,
}: DataPaginationProps) {
    const start = Math.max(
        1,
        Math.min(meta.current_page - 1, meta.last_page - (maxPages - 1)),
    );

    const pages = Array.from(
        { length: Math.min(maxPages, meta.last_page) },
        (_, i) => start + i,
    );

    const buildPageUrl = (page: number): string => {
        if (typeof window === 'undefined') {
            return `?page=${page}`;
        }

        const params = new URLSearchParams(window.location.search);
        params.set('page', String(page));

        return `?${params.toString()}`;
    };

    if (meta.last_page <= 1) {
        return null;
    }

    return (
        <Pagination className={className}>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href={meta.prev_page_url ?? '#'}
                        isDisabled={!meta.prev_page_url}
                    />
                </PaginationItem>

                {pages.map((page) => (
                    <PaginationItem key={page}>
                        <PaginationLink
                            href={buildPageUrl(page)}
                            isActive={page === meta.current_page}
                        >
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                <PaginationItem>
                    <PaginationNext
                        href={meta.next_page_url ?? '#'}
                        isDisabled={!meta.next_page_url}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
