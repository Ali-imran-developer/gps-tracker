import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import AuthController from "@/controllers/authController";
import { useGeoFence } from "@/hooks/geoFecnce-hook";
import { Loader2, X } from "lucide-react";

const AddComments = ({ viewDialogOpen, setViewDialogOpen, moreItem }) => {
  const session = AuthController.getSession();
  const { isAdding, handlePostMessage } = useGeoFence();

  const initialValues = {
    ID: moreItem?.ID ?? "",
    agent: session?.credentials?.user ?? "",
    imei: moreItem?.imei ?? "",
    alerttype: moreItem?.type ?? "",
    process: "1",
    vehicle: moreItem?.vehicle ?? "",
    comments: "",
    selectedOption: "",
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        const finalComment = values.selectedOption || values.comments;
        const { selectedOption, ...apiValues } = values;
        const payload = {
          ...apiValues,
          comments: finalComment,
        };
        console.log("Form submitted:", payload);
        await handlePostMessage(payload);
        setViewDialogOpen(false);
        resetForm();
      } catch (error) {
        console.log(error);
      }
    },
  });

  const isButtonDisabled =
    formik.values.comments.trim() === "" &&
    formik.values.selectedOption.trim() === "";

  return (
    <div>
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Add Comments</DialogTitle>
          </DialogHeader>
          <form onSubmit={formik.handleSubmit} className="space-y-3 sm:space-y-4 mt-3 sm:mt-5">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Comments
              </label>
              <Input
                name="comments"
                value={formik?.values?.comments}
                disabled={formik.values.selectedOption !== ""}
                onChange={formik.handleChange}
                placeholder="Enter your comment..."
                className="mt-1 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Choose option
              </label>
              <Select
                name="comments"
                onValueChange={(val) =>
                  formik.setFieldValue("selectedOption", val)
                }
                value={formik?.values?.selectedOption}
                disabled={formik?.values?.comments?.trim() !== ""}
              >
                <SelectTrigger className="mt-1 w-full text-sm">
                  <SelectValue placeholder="Choose your option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 call ok">1 Call Ok</SelectItem>
                  <SelectItem value="2 call ok">2 Call Ok</SelectItem>
                  <SelectItem value="numbers busy">Numbers Busy</SelectItem>
                  <SelectItem value="numbers not responding">
                    Numbers Not Responding
                  </SelectItem>
                  <SelectItem value="Always Busy">Always Busy</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                  <SelectItem value="Wrong Alert">Wrong Alert</SelectItem>
                  <SelectItem value="Repeat Alert">Repeat Alert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" disabled={isButtonDisabled} className="w-full text-white bg-[#04003A] px-3 sm:px-4 py-2 rounded-none text-sm">
              {isAdding ? <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" /> : "Add"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddComments;