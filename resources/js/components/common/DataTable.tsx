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
}

export function DataTable<T>({ data, columns }: DataTableProps<T>) {
    const [sortKey, setSortKey] = useState<string | null>(null);

    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const handleSort = (key: string, sortable?: boolean) => {
        if (!sortable) {
            return;
        }

        if (sortKey === key) {
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    const sortedData = useMemo(() => {
        if (!sortKey) {
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
    }, [data, sortKey, sortDirection]);

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {columns.map((column) => (
                        <TableHead
                            key={String(column.key)}
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
                                        className="h-6 w-6"
                                        onClick={() =>
                                            handleSort(
                                                String(column.key),
                                                column.sortable,
                                            )
                                        }
                                    >
                                        {sortKey === column.key ? (
                                            sortDirection === 'asc' ? (
                                                <ArrowUpWideNarrow className="h-4 w-4" />
                                            ) : (
                                                <ArrowDownWideNarrow className="h-4 w-4" />
                                            )
                                        ) : (
                                            <ArrowUpWideNarrow className="h-4 w-4 opacity-30" />
                                        )}
                                    </Button>
                                )}
                            </div>
                        </TableHead>
                    ))}
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
                                    {column.cell
                                        ? column.cell(item)
                                        : String(
                                              item[column.key as keyof T] ?? '',
                                          )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell
                            colSpan={columns.length}
                            className="py-6 text-center text-slate-500"
                        >
                            Tidak ada data.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
