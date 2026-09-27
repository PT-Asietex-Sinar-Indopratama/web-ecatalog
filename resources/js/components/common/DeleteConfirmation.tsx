import { Trash } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteConfirmationProps {
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function DeleteConfirmation({
    open,
    title,
    description,
    onConfirm,
    onCancel,
}: DeleteConfirmationProps) {
    return (
        <AlertDialog
            open={open}
            onOpenChange={(open) => {
                if (!open) {
                    onCancel();
                }
            }}
        >
            <AlertDialogContent className="">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-200">
                            <Trash
                                className="w-3 text-destructive"
                                strokeWidth="2.5"
                            />
                        </div>
                        {title}
                    </AlertDialogTitle>

                    {/* <AlertDialogDescription className="p-2 pb-10 bg-muted w-full text-foreground rounded-md"> */}
                    <AlertDialogDescription className="text-foreground">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="border-0 bg-transparent">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                    <AlertDialogAction onClick={onConfirm}>
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
