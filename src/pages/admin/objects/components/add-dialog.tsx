import { useFormik } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useObjects } from "@/hooks/objects-hook";
import { Loader2, X } from "lucide-react";
import { useState } from "react";
import AuthController from "@/controllers/authController";

const AddObjectForm = ({ onClose }: { onClose: (val: any) => void }) => {
  const session = AuthController.getSession();
  const { isLoading, handleAddObject } = useObjects();
  const [disableVehicle, setDisableVehicle] = useState(false);
  console.log("session", session);

  const formik = useFormik({
    initialValues: {
      password: session?.credentials?.pass ?? "",
      email: session?.credentials?.user ?? "",
      name: "",
      imei: "",
      phone: "",
      disabled: 0,
      category: "",
      devicesofinsjs: "",
      devicesofexpjs: "",
      devicesofnamedjs: "",
      devicesofcontactdjs: "",
      devicesofscodejs: "",
      devicesofenginejs: "",
      devicesofchasisjs: "",
      devicesofextrajs: "",
      devicesofnoticejs: "",
      speed: "",
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log(values);
      const response = await handleAddObject({
        ...values,
        disabled: disableVehicle ? 1 : 0,
      }, session?.user?.id);

      if (response) {
        onClose(false);
      }
    },
  });

  const categories = [
    "car",
    "truck",
    "bus",
    "van",
    "motorcycle",
    "loader",
    "person",
    "offroad",
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white w-[500px] rounded-none shadow-lg">
        {/* Blue Header */}
        <div className="flex items-center justify-between bg-[#04003A] text-white p-4">
          <h2 className="text-lg font-semibold">Add New Object</h2>
          <X className="cursor-pointer" onClick={onClose} />
        </div>

        <form onSubmit={formik.handleSubmit} className="grid grid-cols-2 gap-3 p-4 max-h-[80vh] overflow-y-auto">
          {/* Disable Vehicle */}
          <div className="col-span-2 flex items-center space-x-2">
            <input
              type="checkbox"
              checked={disableVehicle}
              onChange={(e) => setDisableVehicle(e.target.checked)}
            />
            <Label>Disable Vehicle</Label>
          </div>

          {/* Name */}
          <div>
            <Label>Name</Label>
            <Input
              name="name"
              onChange={formik.handleChange}
              value={formik.values.name}
            />
          </div>

          {/* IMEI */}
          <div>
            <Label>IMEI</Label>
            <Input
              name="imei"
              onChange={formik.handleChange}
              value={formik.values.imei}
            />
          </div>

          {/* Category */}
          <div>
            <Label>Category</Label>
            <Select
              onValueChange={(value) => formik.setFieldValue("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* SIM Card Number */}
          <div>
            <Label>SIM Card Number</Label>
            <Input
              name="phone"
              onChange={formik.handleChange}
              value={formik.values.phone}
            />
          </div>

          {/* Date of Install */}
          <div>
            <Label>Date of Install</Label>
            <Input
              type="date"
              name="devicesofinsjs"
              onChange={formik.handleChange}
              value={formik.values.devicesofinsjs}
            />
          </div>

          {/* Expire On */}
          <div>
            <Label>Expire On</Label>
            <Input
              type="date"
              name="devicesofexpjs"
              onChange={formik.handleChange}
              value={formik.values.devicesofexpjs}
            />
          </div>

          {/* Customer Name */}
          <div>
            <Label>Customer Name</Label>
            <Input
              name="devicesofnamedjs"
              onChange={formik.handleChange}
              value={formik.values.devicesofnamedjs}
            />
          </div>

          {/* Customer Contact */}
          <div>
            <Label>Customer Contact</Label>
            <Input
              name="devicesofcontactdjs"
              onChange={formik.handleChange}
              value={formik.values.devicesofcontactdjs}
            />
          </div>

          {/* Security Code */}
          <div>
            <Label>Security Code</Label>
            <Input
              name="devicesofscodejs"
              onChange={formik.handleChange}
              value={formik.values.devicesofscodejs}
            />
          </div>

          {/* Engine# */}
          <div>
            <Label>Engine#</Label>
            <Input
              name="devicesofenginejs"
              onChange={formik.handleChange}
              value={formik.values.devicesofenginejs}
            />
          </div>

          {/* Chasis# */}
          <div>
            <Label>Chasis#</Label>
            <Input
              name="devicesofchasisjs"
              onChange={formik.handleChange}
              value={formik.values.devicesofchasisjs}
            />
          </div>

          {/* Extra Information */}
          <div>
            <Label>Extra Information</Label>
            <Input
              name="devicesofextrajs"
              onChange={formik.handleChange}
              value={formik.values.devicesofextrajs}
            />
          </div>

          {/* Notice */}
          <div>
            <Label>Notice</Label>
            <Input
              name="devicesofnoticejs"
              onChange={formik.handleChange}
              value={formik.values.devicesofnoticejs}
            />
          </div>

          {/* OverSpeed */}
          <div>
            <Label>OverSpeed</Label>
            <Input
              name="speed"
              onChange={formik.handleChange}
              value={formik.values.speed}
            />
          </div>

          {/* Buttons */}
          <div className="col-span-2 flex justify-end space-x-2 mt-4">
            <Button type="button" variant="outline">
              Close
            </Button>
            <Button type="submit" className="bg-[#04003A] text-white w-24" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Add New"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddObjectForm;
