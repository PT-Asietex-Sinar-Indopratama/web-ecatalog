import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash, Plus } from "lucide-react";

interface DeleteConfirmationProps {
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function DeleteConfirmation({ open, title, description, onConfirm, onCancel, }: DeleteConfirmationProps) {
    return (
        <AlertDialog open={open} onOpenChange={(open) => { if (!open) onCancel(); }}>
            <AlertDialogContent className="">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <div className="bg-red-200 rounded-full w-6 h-6 flex items-center justify-center">
                            <Trash className="text-destructive w-3" strokeWidth="2.5" />
                        </div>
                        {title}
                    </AlertDialogTitle>

                    {/* <AlertDialogDescription className="p-2 pb-10 bg-muted w-full text-foreground rounded-md"> */}
                    <AlertDialogDescription className="text-foreground">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="border-0 bg-transparent">
                    <AlertDialogCancel>
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction onClick={onConfirm}>
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}