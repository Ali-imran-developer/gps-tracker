import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useObjects } from "@/hooks/objects-hook";
import { Loader2 } from "lucide-react";
import AuthController from "@/controllers/authController";

interface DeleteDialogProps {
  item: any;
  onClose: () => void;
}

const DeleteDialog = ({ item, onClose }: DeleteDialogProps) => {
  const session = AuthController.getSession();
  const { isLoading, handleDeleteObject } = useObjects();
  const onSubmit = async () => {
    try{
      console.log(item);
      const response = await handleDeleteObject(item?.id, session?.user?.id);
      if (response) {
        onClose();
      }
    }catch(error){
      console.log(error);
    }
  };

  return (
    <AlertDialog open onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this object <b>{item?.name}</b>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={onSubmit} className="bg-[#04003A] w-20">
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin"/> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDialog;