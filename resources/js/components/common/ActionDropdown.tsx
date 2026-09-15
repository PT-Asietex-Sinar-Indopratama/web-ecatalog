import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, SquarePen, Trash } from "lucide-react";
import DeleteConfirmation from "@/components/common/DeleteConfirmation";

export interface CustomAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "destructive";
}

interface ActionDropdownProps {
  onEdit?: () => void;
  onDelete?: () => void;
  deleteTitle?: string;
  deleteDescription?: string;
  customActions?: CustomAction[];
  triggerLabel?: string;
}

export function ActionDropdown({
  onEdit,
  onDelete,
  deleteTitle = "Delete Confirmation",
  deleteDescription = "Are you sure you want to delete this item?",
  customActions = [],
  triggerLabel = "Action",
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
            <Button variant="outline" size="sm">
              {triggerLabel}
              <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
          }
        />

        <DropdownMenuContent>
          <DropdownMenuGroup>
            {onEdit && (
              <DropdownMenuItem onClick={onEdit}>
                <SquarePen className="w-3.5! h-3.5!" /> Edit
              </DropdownMenuItem>
            )}

            {customActions.map((action, index) => (
              <DropdownMenuItem
                key={index}
                variant={action.variant}
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
                <Trash className="w-3.5! h-3.5!" /> Delete
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
