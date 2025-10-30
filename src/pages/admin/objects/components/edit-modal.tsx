import React from "react";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useObjects } from "@/hooks/objects-hook";
import AuthController from "@/controllers/authController";

interface EditModalProps {
  item: any;
  onClose: () => void;
}

const geoFenceOptions = [
  "QABOOLA",
  "ADA SHREENWALA",
  "316",
  "MIA CHANNU",
  "DEPALPUR",
  "SINDH-1",
  "NOORSHAH",
  "SAHIWAL",
  "HARAPPA",
  "ARIF WALA",
  "MALGADACITY",
  "PANJAB",
  "CHICHAWATNI",
  "NEW MALGADA CITY",
  "LAHORE",
  "FAISALABAD",
  "MEHER JAVED PETROL PUMP",
  "SAHIWAL TO OKARA",
];

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  imei: Yup.string().required("IMEI is required"),
  category: Yup.string().required("Category is required"),
  simCardNumber: Yup.string().required("SIM Card Number is required"),
  dateOfInstall: Yup.date().required("Date of Install is required"),
  expireOn: Yup.date().required("Expire On is required"),
  geoFence1: Yup.string().required("Select a Geo Fence"),
});

const EditModal = ({ item, onClose }: EditModalProps) => {
  const session = AuthController.getSession();
  const { isLoading, handleEditObject } = useObjects();
  const formik = useFormik({
    initialValues: {
      disabled: item?.disabled || false,
      name: item?.name || "",
      imei: item?.uniqueId || "",
      category: item?.category || "",
      simCardNumber: item?.phone || "",
      geoFence1: item?.geofence || "QABOOLA",
      dateOfInstall: item?.installDT || "",
      expireOn: item?.expiryDT || "",
      customerName: item?.cusname || "",
      customerContact: item?.cusphone || "",
      securityCode: item?.model || "",
      engine: item?.engine || "",
      chasis: item?.chasis || "",
      extraInformation: item?.info || "",
      notice: item?.notice || "",
      overSpeed: item?.speed || "0",
    },
    validationSchema,
    onSubmit: async (values) => {
      // ✅ Map Formik values to API fields
      const payload = {
        deviceid: item?.id,
        name: values.name,
        imei: values.imei,
        phone: values.simCardNumber,
        disabled: values.disabled ? 1 : 0,
        category: values.category,
        devicesofinsjs: values.dateOfInstall,
        devicesofexpjs: values.expireOn,
        devicesofnamedjs: values.customerName,
        devicesofcontactdjs: values.customerContact,
        devicesofscodejs: values.securityCode,
        devicesofenginejs: values.engine,
        devicesofchasisjs: values.chasis,
        devicesofextrajs: values.extraInformation,
        devicesofnoticejs: values.notice,
        speed: values.overSpeed,
        groupId: 0,
      };

      const response = await handleEditObject(payload, session?.user?.id);
      if (response) {
        onClose();
      }
    },
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white w-[500px] h-[85vh] overflow-y-auto rounded-none shadow-lg">
        {/* Blue Header */}
        <div className="flex items-center justify-between bg-[#04003A] text-white p-4">
          <h2 className="text-lg font-semibold">Vehicle</h2>
          <X className="cursor-pointer" onClick={onClose} />
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="p-4 space-y-3 text-sm text-gray-800">
          {/* Disable Vehicle */}
          <div className="flex items-center gap-2">
            <label htmlFor="disabled" className="font-semibold w-40">
              Disable Vehicle
            </label>
            <input
              type="checkbox"
              id="disabled"
              name="disabled"
              checked={formik.values.disabled}
              onChange={formik.handleChange}
              className="w-4 h-4"
            />
          </div>

          {/* Basic Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold">Name</label>
              <input
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                className="w-full border px-2 py-1"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-xs">{formik.errors.name as any}</p>
              )}
            </div>
            <div>
              <label className="block font-semibold">IMEI</label>
              <input
                name="imei"
                value={formik.values.imei}
                onChange={formik.handleChange}
                className="w-full border px-2 py-1"
              />
              {formik.touched.imei && formik.errors.imei && (
                <p className="text-red-500 text-xs">{formik.errors.imei as any}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold">Category</label>
              <input
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                className="w-full border px-2 py-1"
              />
            </div>
            <div>
              <label className="block font-semibold">SIM Card Number</label>
              <input
                name="simCardNumber"
                value={formik.values.simCardNumber}
                onChange={formik.handleChange}
                className="w-full border px-2 py-1"
              />
            </div>
          </div>

          {/* Geo Fence */}
          <div>
            <label className="block font-semibold">Geo Fence1</label>
            <select
              name="geoFence1"
              value={formik.values.geoFence1}
              onChange={formik.handleChange}
              className="w-full border px-2 py-1"
            >
              <option value="">Select a Geo Fence</option>
              {geoFenceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {formik.touched.geoFence1 && formik.errors.geoFence1 && (
              <p className="text-red-500 text-xs">{formik.errors.geoFence1 as any}</p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold">Date of Install</label>
              <input
                type="date"
                name="dateOfInstall"
                value={formik.values.dateOfInstall}
                onChange={formik.handleChange}
                className="w-full border px-2 py-1"
              />
            </div>
            <div>
              <label className="block font-semibold">Expire On</label>
              <input
                type="date"
                name="expireOn"
                value={formik.values.expireOn}
                onChange={formik.handleChange}
                className="w-full border px-2 py-1"
              />
            </div>
          </div>

          {/* Customer Info */}
          <div>
            <label className="block font-semibold">Customer Name</label>
            <input
              name="customerName"
              value={formik.values.customerName}
              onChange={formik.handleChange}
              className="w-full border px-2 py-1"
            />
          </div>
          <div>
            <label className="block font-semibold">Customer Contact</label>
            <input
              name="customerContact"
              value={formik.values.customerContact}
              onChange={formik.handleChange}
              className="w-full border px-2 py-1"
            />
          </div>

          {/* Other Fields */}
          <div>
            <label className="block font-semibold">Security Code</label>
            <input
              name="securityCode"
              value={formik.values.securityCode}
              onChange={formik.handleChange}
              className="w-full border px-2 py-1"
            />
          </div>
          <div>
            <label className="block font-semibold">Engine#</label>
            <input
              name="engine"
              value={formik.values.engine}
              onChange={formik.handleChange}
              className="w-full border px-2 py-1"
            />
          </div>
          <div>
            <label className="block font-semibold">Chasis#</label>
            <input
              name="chasis"
              value={formik.values.chasis}
              onChange={formik.handleChange}
              className="w-full border px-2 py-1"
            />
          </div>
          <div>
            <label className="block font-semibold">Extra Information</label>
            <input
              name="extraInformation"
              value={formik.values.extraInformation}
              onChange={formik.handleChange}
              className="w-full border px-2 py-1"
            />
          </div>
          <div>
            <label className="block font-semibold">Notice</label>
            <input
              name="notice"
              value={formik.values.notice}
              onChange={formik.handleChange}
              className="w-full border px-2 py-1"
            />
          </div>
          <div>
            <label className="block font-semibold">OverSpeed</label>
            <input
              name="overSpeed"
              value={formik.values.overSpeed}
              onChange={formik.handleChange}
              className="w-full border px-2 py-1"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-3">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="px-4 py-1 font-semibold"
            >
              Close
            </Button>
            <Button
              type="submit"
              disabled={!formik.dirty}
              className="bg-[#04003A] text-white px-4 py-1 font-semibold"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Update"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;