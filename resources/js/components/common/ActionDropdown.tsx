import { ChevronDown, Eye, SquarePen, Trash } from 'lucide-react';
import { useState } from 'react';
import DeleteConfirmation from '@/components/common/DeleteConfirmation';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface CustomAction {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    variant?: 'default' | 'destructive';
    className?: string;
}

interface ActionDropdownProps {
    onDetail?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    deleteTitle?: string;
    deleteDescription?: string;
    customActions?: CustomAction[];
    triggerLabel?: string;
    contentClassName?: string;
}

export function ActionDropdown({
    onDetail,
    onEdit,
    onDelete,
    deleteTitle = 'Delete Confirmation',
    deleteDescription = 'Are you sure you want to delete this item?',
    customActions = [],
    triggerLabel = 'Action',
    contentClassName,
}: ActionDropdownProps) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleConfirmDelete = () => {
        setShowDeleteConfirm(false);

        if (onDelete) {
            onDelete();
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger
                    render={
                        <Button
                            variant="outline"
                            size="sm"
                            className="min-h-11 sm:min-h-7"
                        >
                            {triggerLabel}
                            <ChevronDown className="ml-1 h-4 w-4" />
                        </Button>
                    }
                />

                <DropdownMenuContent className={contentClassName}>
                    <DropdownMenuGroup>
                        {onDetail && (
                            <DropdownMenuItem onClick={onDetail}>
                                <Eye className="h-3.5! w-3.5!" /> Detail
                            </DropdownMenuItem>
                        )}

                        {onEdit && (
                            <DropdownMenuItem onClick={onEdit}>
                                <SquarePen className="h-3.5! w-3.5!" /> Edit
                            </DropdownMenuItem>
                        )}

                        {customActions.map((action, index) => (
                            <DropdownMenuItem
                                key={index}
                                variant={action.variant}
                                className={action.className}
                                onClick={action.onClick}
                            >
                                {action.icon}
                                {action.label}
                            </DropdownMenuItem>
                        ))}

                        {onDelete && (
                            <DropdownMenuItem
                                variant="destructive"
                                onClick={() => setShowDeleteConfirm(true)}
                            >
                                <Trash className="h-3.5! w-3.5!" /> Delete
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            {onDelete && (
                <DeleteConfirmation
                    open={showDeleteConfirm}
                    title={deleteTitle}
                    description={deleteDescription}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setShowDeleteConfirm(false)}
                />
            )}
        </>
    );
}
