import React, { useState } from "react";
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
  LogOut,
  Search,
  Menu,
  Plus,
  SquareArrowUpRight,
} from "lucide-react";
import EditModal from "./components/edit-modal";
import DeleteDialog from "./components/delete-dialog";
import { logout } from "@/utils/auth";
import { useNavigate } from "react-router-dom";

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

const data: ObjectItem[] = [
  {
    sr: 1,
    name: "KK-17RXW",
    imei: "861900070264485",
    active: true,
    install: "2025-03-23",
    expiry: "2026-02-15",
    simCardNumber: "447404669515",
    lastConnection: "02/15/2025 12:03 PM",
    payment: "NA",
    smsNo: "447404669515",
    category: "car",
    status: "offline",
  },
  {
    sr: 2,
    name: "SLM-16-2509 SILF",
    imei: "861900070355697",
    active: true,
    install: "2025-02-18",
    expiry: "2026-02-18",
    simCardNumber: "923181530160",
    lastConnection: "10/12/2025 15:55 PM",
    payment: "NA",
    smsNo: "923181530160",
    category: "car",
    status: "online",
  },
  {
    sr: 3,
    name: "AKT-9004 SILF",
    imei: "861900070274291",
    active: false,
    install: "2025-06-17",
    expiry: "2026-05-03",
    simCardNumber: "923701396195",
    lastConnection: "08/17/2025 01:47 AM",
    payment: "NA",
    smsNo: "923701396195",
    category: "truck",
    status: "offline",
  },
];

const AdminObjects = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<ObjectItem | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [deleteItem, setDeleteItem] = useState<ObjectItem | null>(null);

  return (
    <div className="p-4">
      <div className="overflow-x-auto overflow-y-auto border rounded-md max-h-[80vh]">
        <header className="bg-white border-b shadow-sm py-3 sm:py-4 px-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h1 className="text-xl sm:text-2xl font-semibold text-[#04003A]">
              Control Panel{" "}
              <span className="text-gray-700 font-normal">/ Objects</span>
            </h1>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative flex-1 sm:flex-none sm:w-48 lg:w-60">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border border-gray-300 pl-9 pr-3 py-2 text-sm bg-[#04003A] text-white focus:outline-none focus:ring-1 focus:ring-blue-500 rounded sm:rounded-none"
                />
              </div>
              <button
                onClick={() => navigate("/admin/users")}
                className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition flex-shrink-0"
              >
                <SquareArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#04003A]" />
              </button>
              <button
                onClick={() => logout()}
                className="p-2 rounded-full bg-red-50 hover:bg-red-100 transition flex-shrink-0"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              </button>
            </div>
          </div>
        </header>

        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 sticky top-0">
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
              <th className="p-2 border">Controls</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.sr} className="hover:bg-gray-50">
                <td className="p-2 border">{item.sr}</td>
                <td className="p-2 border">{item.name}</td>
                <td className="p-2 border">{item.imei}</td>
                <td className="p-2 border text-center">
                  {item.active ? (
                    <Check className="text-green-600" />
                  ) : (
                    <X className="text-red-600" />
                  )}
                </td>
                <td className="p-2 border">{item.install}</td>
                <td className="p-2 border">{item.expiry}</td>
                <td className="p-2 border">{item.simCardNumber}</td>
                <td className="p-2 border">{item.lastConnection}</td>
                <td className="p-2 border">{item.payment}</td>
                <td className="p-2 border">{item.smsNo}</td>
                <td className="p-2 border text-center">
                  {item.category === "car" && <Car />}
                  {item.category === "truck" && <Truck />}
                  {item.category === "motorcycle" && <Bike />}
                </td>
                <td className="p-2 border text-center">
                  {item.status === "online" ? (
                    <Wifi className="text-green-600" />
                  ) : (
                    <WifiOff className="text-red-600" />
                  )}
                </td>
                <td className="p-2 border flex gap-2 justify-center">
                  <Edit
                    className="cursor-pointer text-blue-600"
                    onClick={() => {
                      setSelectedItem(item);
                      setShowEdit(true);
                    }}
                  />
                  <Trash2
                    className="cursor-pointer text-red-600"
                    onClick={() => setDeleteItem(item)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {showEdit && selectedItem && (<EditModal item={selectedItem} onClose={() => setShowEdit(false)} />)}

      {/* Delete Dialog */}
      {deleteItem && (<DeleteDialog item={deleteItem} onClose={() => setDeleteItem(null)} />)}
    </div>
  );
};

export default AdminObjects;