import { useState } from 'react';

type SortDirection = 'asc' | 'desc';

interface SortFilters {
    sort?: string;
    direction?: SortDirection;
}

export function useServerTableSort(
    filters: SortFilters,
    defaultSort = 'updated_at',
    defaultDirection: SortDirection = 'desc',
) {
    const [sort, setSort] = useState(filters.sort || defaultSort);
    const [direction, setDirection] = useState<SortDirection>(
        filters.direction || defaultDirection,
    );

    const hasSorting = sort !== defaultSort || direction !== defaultDirection;

    const appendSortQuery = (
        query: Record<string, string>,
        nextSort = sort,
        nextDirection = direction,
    ) => {
        if (nextSort !== defaultSort || nextDirection !== defaultDirection) {
            query.sort = nextSort;
            query.direction = nextDirection;
        }
    };

    const applySort = (
        nextSort: string,
        nextDirection: SortDirection,
        onChange: (nextSort: string, nextDirection: SortDirection) => void,
    ) => {
        setSort(nextSort);
        setDirection(nextDirection);
        onChange(nextSort, nextDirection);
    };

    const resetSort = () => {
        setSort(defaultSort);
        setDirection(defaultDirection);
    };

    return {
        sort,
        direction,
        hasSorting,
        appendSortQuery,
        applySort,
        resetSort,
    };
}
