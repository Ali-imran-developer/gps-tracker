import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Formik, Form, Field } from "formik";
import { useAdmin } from "@/hooks/admin-hook";
import { Loader2 } from "lucide-react";
import AuthController from "@/controllers/authController";

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  user: any;
  onUpdate: (values: any) => void;
  onDelete: (userId: any) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  open,
  onClose,
  user,
  onUpdate,
  onDelete,
}) => {
  if (!user) return null;
  const session = AuthController.getSession();
  const { isAdding, handleEditUser, handleGetAllUsers } = useAdmin();

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0];
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#04003A]">Edit User</DialogTitle>
        </DialogHeader>

        <Formik
          initialValues={{
            email: user.email || "",
            password: user.phone || "",
            disabled: user.disabled === "true" || user.disabled === true,
            expirationtime: formatDate(user.expirationtime),
          }}
          enableReinitialize
          onSubmit={async (values) => {
            const payload = {
              name: `${values.email} / ${values.password}`,
              email: values.email,
              password: values.password,
              id: user.ID,
              expirationTime: values.expirationtime,
              disableduser: values.disabled ? 1 : 0,
            };
            await handleEditUser(payload);
            await handleGetAllUsers(session?.user?.id);
            onUpdate(payload);
            onClose();
          }}
        >
          {({ values, setFieldValue, dirty }) => (
            <Form className="flex flex-col gap-4 mt-2">
              {/* Disable checkbox */}
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={values.disabled}
                  onCheckedChange={(checked) =>
                    setFieldValue("disabled", !!checked)
                  }
                />
                <label className="text-sm font-medium text-gray-700">
                  Disable User
                </label>
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email / Username
                </label>
                <Field
                  as={Input}
                  type="text"
                  name="email"
                  placeholder="Enter email or username"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <Field
                  as={Input}
                  type="text"
                  name="password"
                  placeholder="Enter password"
                  required
                />
              </div>

              {/* Expiration Date */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Expiry Date
                </label>
                <Field as={Input} type="date" name="expirationtime" />
              </div>

              {/* Footer */}
              <DialogFooter className="mt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose} className="min-w-32">
                  Close
                </Button>
                <Button type="submit" className="bg-[#04003A] text-white min-w-32" disabled={isAdding || !dirty}>
                  {isAdding ? <Loader2 className="w-8 h-8 animate-spin" /> : "Update"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;