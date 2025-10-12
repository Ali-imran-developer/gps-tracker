import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Formik, Form, Field } from "formik";
import { useAdmin } from "@/hooks/admin-hook";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import AuthController from "@/controllers/authController";

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (values: any) => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ open, onClose, onAdd }) => {
  const session = AuthController.getSession();
  const { isAdding, handleAddNewUser, handleGetAllUsers } = useAdmin();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
        </DialogHeader>

        <Formik
          initialValues={{ email: "", password: "" }}
          enableReinitialize={true}
          onSubmit={async(values) => {
            try{
              const queryParams = {
                ...values,
                name: `${values.email} / ${values.password}`,
                emailuser: session?.credentials?.user ?? "",
                passworduser: session?.credentials?.pass ?? "",
              };
              await handleAddNewUser(queryParams);
              await handleGetAllUsers(session?.user?.id);
              onAdd(values);
              onClose();
            }catch(error){
              console.log(error);
              toast.error(error?.message);
            }
          }}
        >
          {() => (
            <Form className="flex flex-col gap-4 mt-2">
              <div>
                <label className="text-sm font-medium text-gray-700">Email/Username</label>
                <Field as={Input} type="text" name="email" placeholder="Enter email or username" required />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Password</label>
                <Field as={Input} type="password" name="password" placeholder="Enter password" required />
              </div>

              <DialogFooter className="mt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose} className="min-w-32">
                  Close
                </Button>
                <Button type="submit" className="bg-[#04003A] text-white min-w-32">
                  {isAdding ? <Loader2 className="animate-spin w-6 h-6" /> : "Add"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal;