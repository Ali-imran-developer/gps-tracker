import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/hooks/admin-hook";
import toast from "react-hot-toast";
import AuthController from "@/controllers/authController";

interface DeleteUserDialogProps {
  userId: string;
  onConfirm: (id: string) => void;
}

export function DeleteUserDialog({ userId, onConfirm }: DeleteUserDialogProps) {
  const [open, setOpen] = useState(false);
  const session = AuthController.getSession();
  const { handleDeleteUser, handleGetAllUsers } = useAdmin();

  const handleConfirm = async () => {
    try{
      await handleDeleteUser(userId);
      await handleGetAllUsers(session?.user?.id);
      onConfirm(userId);
      setOpen(false);
    }catch(error){
      console.log(error);
      toast.error(error);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash2 className="w-4 h-4 text-red-600" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the user account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700" onClick={handleConfirm}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
