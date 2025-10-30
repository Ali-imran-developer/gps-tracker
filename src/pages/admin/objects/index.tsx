import React, { useEffect, useState } from "react";
import { Wifi, WifiOff, Car, Truck, Bike, Edit, Trash2, Check, X, LogOut, Search, SquareArrowUpRight, Loader2, Plus } from "lucide-react";
import EditModal from "./components/edit-modal";
import DeleteDialog from "./components/delete-dialog";
import { logout } from "@/utils/auth";
import { useNavigate } from "react-router-dom";
import { ensureArray } from "@/helper-functions/use-formater";
import AuthController from "@/controllers/authController";
import { useSelector } from "react-redux";
import { useObjects } from "@/hooks/objects-hook";
import AddObjectForm from "./components/add-dialog";

const AdminObjects = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [deleteItem, setDeleteItem] = useState<any | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { isLoading, handleGetAllObjects } = useObjects();
  const session = AuthController.getSession();
  const { objectsData } = useSelector((state: any) => state?.Objects);

  useEffect(() => {
    handleGetAllObjects(session?.user?.id);

  }, []);

  const filteredData = ensureArray(objectsData)?.filter(
      (item: any) => item?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        item?.uniqueId?.toLowerCase()?.includes(searchQuery?.toLowerCase())
    )?.sort((a: any, b: any) => (a?._id < b?._id ? 1 : -1));

  return (
    <div className="p-4">
      <div className="overflow-x-auto overflow-y-auto border rounded-md relative">
        {/* Header */}
        <header className="bg-white border-b shadow-sm py-3 sm:py-4 px-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h1 className="text-xl sm:text-2xl font-semibold text-[#04003A]">
              Control Panel <span className="text-gray-700 font-normal">/ Objects</span>
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

              <button onClick={() => navigate("/admin/users")} className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition flex-shrink-0">
                <SquareArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#04003A]" />
              </button>

              <button onClick={() => setIsOpen(true)} className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition flex-shrink-0">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-[#04003A]" />
              </button>

              <button onClick={() => logout()} className="p-2 rounded-full bg-red-50 hover:bg-red-100 transition flex-shrink-0">
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Table */}
        <div className="relative min-h-[400px]">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
              <Loader2 className="animate-spin text-[#04003A] w-10 h-10" />
            </div>
          )}

          <table className="min-w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="p-2 border">Sr</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">IMEI</th>
                <th className="p-2 border">Active</th>
                <th className="p-2 border">Install</th>
                <th className="p-2 border">Expiry</th>
                <th className="p-2 border">SIM Number</th>
                <th className="p-2 border">Last Connection</th>
                <th className="p-2 border">SMS No</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
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
                  <td className="p-2 border">{item?.phone}</td>
                  <td className="p-2 border text-center">
                    {item?.category === "car" && <Car className="inline-block w-5 h-5" />}
                    {item?.category === "truck" && <Truck className="inline-block w-5 h-5" />}
                    {item?.category === "motorcycle" && (
                      <Bike className="inline-block w-5 h-5" />
                    )}
                  </td>
                  <td className="p-2 border text-center">
                    {item?.status === "online" ? (
                      <Wifi className="text-green-600 inline-block w-5 h-5" />
                    ) : (
                      <WifiOff className="text-red-600 inline-block w-5 h-5" />
                    )}
                  </td>
                  <td className="p-2 border pt-5 flex gap-2 justify-center border-none">
                    <Edit
                      className="cursor-pointer text-[#04003A] w-5 h-5"
                      onClick={() => {
                        setSelectedItem(item);
                        setShowEdit(true);
                      }}
                    />
                    <Trash2
                      className="cursor-pointer text-red-600 w-5 h-5"
                      onClick={() => setDeleteItem(item)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showEdit && selectedItem && (<EditModal item={selectedItem} onClose={() => setShowEdit(false)} />)}

      {/* Delete Dialog */}
      {deleteItem && <DeleteDialog item={deleteItem} onClose={() => setDeleteItem(null)} />}

      {isOpen && <AddObjectForm onClose={() => setIsOpen(false)} />}
    </div>
  );
};

export default AdminObjects;