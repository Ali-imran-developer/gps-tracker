import React, { useEffect, useState } from "react";
import {
  Wifi,
  WifiOff,
  Car,
  Truck,
  Bike,
  Edit,
  Trash2,
  Check,
  X,
  Search,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useObjects } from "@/hooks/objects-hook";
import AuthController from "@/controllers/authController";
import { useSelector } from "react-redux";
import { ensureArray } from "@/helper-functions/use-formater";

interface ObjectItem {
  sr: number;
  name: string;
  imei: string;
  active: boolean;
  install: string;
  expiry: string;
  simCardNumber: string;
  lastConnection: string;
  payment: string;
  smsNo: string;
  category: "car" | "truck" | "motorcycle";
  status: "online" | "offline";
}

interface ObjectsModalProps {
  open: boolean;
  onClose: () => void;
}

const ObjectsModal: React.FC<ObjectsModalProps> = ({ open, onClose }) => {
  const { isLoading, handleGetAllObjects } = useObjects();
  const [searchQuery, setSearchQuery] = useState("");
  const session = AuthController.getSession();
  const { objectsData } = useSelector((state: any) => state?.Objects);
  const filteredData = ensureArray(objectsData)?.filter((item: any) => item?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) || item?.uniqueId?.toLowerCase()?.includes(searchQuery?.toLowerCase()));

  useEffect(() => {
    handleGetAllObjects(session?.user?.id);

  }, [])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[750px] max-h-[80vh] overflow-x-auto flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-xl sm:text-2xl font-semibold text-[#04003A]">
            Object Control
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-3 border-b">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search objects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 pl-9 pr-3 py-2 text-sm bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
            />
          </div>
        </div>

        <div className="overflow-auto flex-1 px-6 pb-6">
          <table className="min-w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="p-2 border">Sr</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">IMEI</th>
                <th className="p-2 border">Active</th>
                <th className="p-2 border">Install</th>
                <th className="p-2 border">Expiry</th>
                <th className="p-2 border">SIM Card Number</th>
                <th className="p-2 border">Last Connection</th>
                <th className="p-2 border">Payment</th>
                <th className="p-2 border">SMS No</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {ensureArray(filteredData)?.map((item: any, index: number) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-2 border">{index + 1}</td>
                  <td className="p-2 border">{item?.name ?? ""}</td>
                  <td className="p-2 border">{item?.uniqueId ?? ""}</td>
                  <td className="p-2 border text-center">
                    {item?.disabled ? (
                      <X className="text-red-600 inline-block" />
                    ) : (
                      <Check className="text-green-600 inline-block" />
                    )}
                  </td>
                  <td className="p-2 border">{item?.installDT}</td>
                  <td className="p-2 border">{item?.expiryDT}</td>
                  <td className="p-2 border">{item?.phone}</td>
                  <td className="p-2 border">{item?.lastUpdate}</td>
                  <td className="p-2 border">{item?.payment ?? "N/A"}</td>
                  <td className="p-2 border">{item?.phone}</td>
                  <td className="p-2 border text-center">
                    {item?.category === "car" && <Car className="inline-block" />}
                    {item?.category === "truck" && <Truck className="inline-block" />}
                    {item?.category === "motorcycle" && <Bike className="inline-block" />}
                  </td>
                  <td className="p-2 border text-center">
                    {item?.status === "online" ? (
                      <Wifi className="text-green-600 inline-block" />
                    ) : (
                      <WifiOff className="text-red-600 inline-block" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ObjectsModal;