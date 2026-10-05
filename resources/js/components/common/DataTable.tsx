import { ArrowDownWideNarrow, ArrowUpWideNarrow } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface Column<T> {
    key: keyof T | string;
    header: string;
    sortable?: boolean;
    className?: string;
    headerClassName?: string;
    cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    emptyMessage?: string;
    emptyDescription?: string;
    emptyAction?: {
        label: string;
        onClick: () => void;
    };
    sortKey?: string | null;
    sortDirection?: 'asc' | 'desc';
    onSort?: (key: string, direction: 'asc' | 'desc') => void;
}

export function DataTable<T>({
    data,
    columns,
    emptyMessage = 'No records found.',
    emptyDescription = 'Try adjusting your search or filters.',
    emptyAction,
    sortKey: controlledSortKey,
    sortDirection: controlledSortDirection,
    onSort,
}: DataTableProps<T>) {
    const [localSortKey, setLocalSortKey] = useState<string | null>(null);

    const [localSortDirection, setLocalSortDirection] = useState<
        'asc' | 'desc'
    >('asc');

    const sortKey = controlledSortKey ?? localSortKey;
    const sortDirection = controlledSortDirection ?? localSortDirection;
    const isServerSorted = Boolean(onSort);

    const handleSort = (key: string, sortable?: boolean) => {
        if (!sortable) {
            return;
        }

        const nextDirection =
            sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';

        if (onSort) {
            onSort(key, nextDirection);

            return;
        }

        setLocalSortKey(key);
        setLocalSortDirection(nextDirection);
    };

    const sortedData = useMemo(() => {
        if (!sortKey || isServerSorted) {
            return data;
        }

        return [...data].sort((a, b) => {
            const aValue = a[sortKey as keyof T];
            const bValue = b[sortKey as keyof T];

            if (aValue === bValue) {
                return 0;
            }

            if (aValue == null) {
                return 1;
            }

            if (bValue == null) {
                return -1;
            }

            const result = String(aValue).localeCompare(
                String(bValue),
                undefined,
                {
                    numeric: true,
                    sensitivity: 'base',
                },
            );

            return sortDirection === 'asc' ? result : -result;
        });
    }, [data, isServerSorted, sortKey, sortDirection]);

    const renderCell = (item: T, column: Column<T>) =>
        column.cell
            ? column.cell(item)
            : String(item[column.key as keyof T] ?? '');

    const emptyState = (
        <div className="rounded-lg border border-dashed p-6 text-center">
            <p className="text-sm font-medium text-foreground">
                {emptyMessage}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
                {emptyDescription}
            </p>
            {emptyAction && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-4 min-h-11 sm:min-h-7"
                    onClick={emptyAction.onClick}
                >
                    {emptyAction.label}
                </Button>
            )}
        </div>
    );

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {columns.map((column) => {
                        const key = String(column.key);
                        const isActive = sortKey === key;

                        return (
                            <TableHead
                                key={key}
                                aria-sort={
                                    column.sortable
                                        ? isActive
                                            ? sortDirection === 'asc'
                                                ? 'ascending'
                                                : 'descending'
                                            : 'none'
                                        : undefined
                                }
                                className={cn(
                                    column.className,
                                    column.headerClassName,
                                )}
                            >
                                <div className="flex items-center gap-1">
                                    <span>{column.header}</span>

                                    {column.sortable && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-11 w-11 shrink-0 sm:h-6 sm:w-6"
                                            aria-label={`Sort by ${column.header} ${isActive && sortDirection === 'asc' ? 'descending' : 'ascending'}`}
                                            onClick={() =>
                                                handleSort(key, column.sortable)
                                            }
                                        >
                                            {isActive ? (
                                                sortDirection === 'asc' ? (
                                                    <ArrowUpWideNarrow
                                                        aria-hidden="true"
                                                        className="h-4 w-4"
                                                    />
                                                ) : (
                                                    <ArrowDownWideNarrow
                                                        aria-hidden="true"
                                                        className="h-4 w-4"
                                                    />
                                                )
                                            ) : (
                                                <ArrowUpWideNarrow
                                                    aria-hidden="true"
                                                    className="h-4 w-4 opacity-30"
                                                />
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </TableHead>
                        );
                    })}
                </TableRow>
            </TableHeader>

            <TableBody>
                {sortedData.length > 0 ? (
                    sortedData.map((item, index) => (
                        <TableRow key={index}>
                            {columns.map((column) => (
                                <TableCell
                                    key={String(column.key)}
                                    className={column.className}
                                >
                                    {renderCell(item, column)}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={columns.length} className="p-4">
                            {emptyState}
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
