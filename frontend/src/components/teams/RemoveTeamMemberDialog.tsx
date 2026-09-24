import { Loader2, UserMinus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface RemoveTeamMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberName: string;
  onRemove: () => void;
  isPending?: boolean;
  errorMessage?: string | null;
}

export function RemoveTeamMemberDialog({
  open,
  onOpenChange,
  memberName,
  onRemove,
  isPending = false,
  errorMessage,
}: RemoveTeamMemberDialogProps) {
  const handleOpenChange = (nextOpen: boolean) => {
    if (isPending) {
      return;
    }

    onOpenChange(nextOpen);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="bg-background">
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Team Member?</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to remove{" "}
            <span className="font-semibold text-foreground">{memberName}</span>{" "}
            from this team?
          </AlertDialogDescription>
        </AlertDialogHeader>

        {errorMessage && (
          <p role="alert" className="text-sm text-destructive">
            {errorMessage}
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={onRemove}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UserMinus className="mr-2 h-4 w-4" />
            )}
            Remove Member
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
