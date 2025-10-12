import React, { useEffect, useState } from "react";
import { Search, Plus, LogOut, Pencil, CirclePlus, Loader2, X, Check, Trash2, Menu, SquareArrowUpRight } from "lucide-react";
import { useAdmin } from "@/hooks/admin-hook";
import { useSelector } from "react-redux";
import AuthController from "@/controllers/authController";
import { ensureArray } from "@/helper-functions/use-formater";
import { formatDate } from "@/utils/format-date";
import AddUserModal from "./components/add-user-modal";
import EditUserModal from "./components/edit-user-modal";
import { DeleteUserDialog } from "./components/delete-user-dialog";
import AttachDeattachModal from "./components/addDevice-modal";
import { logout } from "@/utils/auth";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const navigate = useNavigate();
  const session = AuthController.getSession();
  const { adminUsers } = useSelector((state: any) => state.Admin);
  const { handleGetAllUsers, isLoading } = useAdmin();
  const [searchQuery, setSearchQuery] = useState("");
  const users = ensureArray(adminUsers)?.length ? ensureArray(adminUsers) : [];
  const sortedUsers = [...ensureArray(users)].reverse();
  const filteredUsers = ensureArray(sortedUsers)?.filter((user: any) => Object.values(user).join(" ").toLowerCase().includes(searchQuery.toLowerCase()));
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);
  const [selectedAttachUser, setSelectedAttachUser] = useState<any>(null);

  useEffect(() => {
    handleGetAllUsers(session?.user?.id);

  }, []);

  const handleEditClick = (user: any) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleAddUser = (values: any) => {
    console.log("New user added:", values);
    setIsAddModalOpen(false);
  };

  const handleUpdateUser = (updatedUser: any) => {
    console.log("Updated user:", updatedUser);
  };

  const handleDeleteUser = (id: any) => {
    console.log("Deleted user ID:", id);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Header */}
        <header className="bg-white border-b shadow-sm py-3 sm:py-4 px-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h1 className="text-xl sm:text-2xl font-semibold text-[#04003A]">
              Control Panel <span className="text-gray-700 font-normal">/ Users</span>
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
              <button onClick={() => navigate("/admin/objects")} className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition flex-shrink-0">
                <SquareArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#04003A]" />
              </button>
              <button onClick={() => setIsAddModalOpen(true)} className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition flex-shrink-0">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-[#04003A]" />
              </button>
              <button onClick={() => logout()} className="p-2 rounded-full bg-red-50 hover:bg-red-100 transition flex-shrink-0">
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="py-4 sm:py-6">
          <div className="bg-white border rounded-lg sm:rounded-xl shadow-sm overflow-hidden">
            {/* Mobile Card View */}
            <div className="block sm:hidden">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="animate-spin w-8 h-8 mb-2" />
                  <span className="text-sm font-medium">Loading users...</span>
                </div>
              ) : ensureArray(filteredUsers)?.length > 0 ? (
                <div className="divide-y">
                  {ensureArray(filteredUsers)?.map((user: any, i: number) => (
                    <div key={user?.ID} className="p-4 hover:bg-blue-50 transition">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-sm text-gray-500">#{i + 1}</span>
                          <h3 className="font-medium text-gray-900">{user.email}</h3>
                          <p className="text-sm text-gray-600">ID: {user?.ID}</p>
                        </div>
                        <div className="flex gap-1">
                          <button 
                            onClick={() => handleEditClick(user)} 
                            className="p-1.5 rounded-full hover:bg-gray-100"
                          >
                            <Pencil className="w-4 h-4 text-gray-700" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedAttachUser(user);
                              setIsAttachModalOpen(true);
                            }}
                            className="p-1.5 rounded-full hover:bg-gray-100"
                          >
                            <CirclePlus className="w-4 h-4 text-gray-700" />
                          </button>
                          <DeleteUserDialog userId={user?.ID} onConfirm={handleDeleteUser} />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Password:</span>
                          <p className="truncate">{user.phone}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Active:</span>
                          <p>
                            {user?.disabled === "false" ? (
                              <span className="text-green-600 font-semibold flex items-center">
                                <Check className="w-3 h-3 mr-1" /> Active
                              </span>
                            ) : (
                              <span className="text-red-500 font-semibold flex items-center">
                                <X className="w-3 h-3 mr-1" /> Inactive
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-500">Expires:</span>
                          <p>{formatDate(user?.expirationtime) || "-"}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 italic">
                  No users found
                </div>
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100 border-b text-gray-700">
                  <tr>
                    <th className="px-3 py-2 lg:px-4 lg:py-3 font-semibold text-xs lg:text-sm">SR</th>
                    <th className="px-3 py-2 lg:px-4 lg:py-3 font-semibold text-xs lg:text-sm">ID</th>
                    <th className="px-3 py-2 lg:px-4 lg:py-3 font-semibold text-xs lg:text-sm">E-mail</th>
                    <th className="px-3 py-2 lg:px-4 lg:py-3 font-semibold text-xs lg:text-sm">Password</th>
                    <th className="px-3 py-2 lg:px-4 lg:py-3 font-semibold text-xs lg:text-sm">Active</th>
                    <th className="px-3 py-2 lg:px-4 lg:py-3 font-semibold text-xs lg:text-sm">Expires</th>
                    <th className="px-3 py-2 lg:px-4 lg:py-3 font-semibold text-xs lg:text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="py-16">
                        <div className="flex flex-col items-center justify-center font-medium">
                          <Loader2 className="animate-spin w-8 h-8 mb-2" />
                          <span>Loading users...</span>
                        </div>
                      </td>
                    </tr>
                  ) : ensureArray(filteredUsers)?.length > 0 ? (
                    ensureArray(filteredUsers)?.map((user: any, i: number) => (
                      <tr key={user?.ID} className="border-b hover:bg-blue-50 transition">
                        <td className="px-3 py-2 lg:px-4 lg:py-3 text-gray-600 text-xs lg:text-sm">{i + 1}</td>
                        <td className="px-3 py-2 lg:px-4 lg:py-3 font-medium text-gray-700 text-xs lg:text-sm">
                          {user?.ID}
                        </td>
                        <td className="px-3 py-2 lg:px-4 lg:py-3 text-xs lg:text-sm">{user.email}</td>
                        <td className="px-3 py-2 lg:px-4 lg:py-3 text-xs lg:text-sm">{user.phone}</td>
                        <td className="px-3 py-2 lg:px-4 lg:py-3 text-xs lg:text-sm">
                          {user?.disabled === "false" ? (
                            <span className="text-green-600 font-semibold">
                              <Check className="w-4 h-4" />
                            </span>
                          ) : (
                            <span className="text-red-500 font-semibold">
                              <X className="w-4 h-4" />
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2 lg:px-4 lg:py-3 text-gray-600 text-xs lg:text-sm">
                          {formatDate(user?.expirationtime) || "-"}
                        </td>
                        <td className="px-3 py-2 lg:px-4 lg:py-3 flex gap-1 lg:gap-2">
                          <button 
                            onClick={() => handleEditClick(user)} 
                            className="p-1.5 rounded-full hover:bg-gray-100"
                          >
                            <Pencil className="w-3 h-3 lg:w-4 lg:h-4 text-gray-700" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedAttachUser(user);
                              setIsAttachModalOpen(true);
                            }}
                            className="p-1.5 rounded-full hover:bg-gray-100"
                          >
                            <CirclePlus className="w-3 h-3 lg:w-4 lg:h-4 text-gray-700" />
                          </button>
                          <DeleteUserDialog userId={user?.ID} onConfirm={handleDeleteUser} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-500 italic">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        <AttachDeattachModal
          open={isAttachModalOpen}
          onClose={() => setIsAttachModalOpen(false)}
          user={selectedAttachUser}
          onAttach={(vehicle) => console.log("Attach clicked:", vehicle)}
          onDeattach={(vehicle) => console.log("De-Attach clicked:", vehicle)}
        />
        <AddUserModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddUser} />
        <EditUserModal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} user={selectedUser} onUpdate={handleUpdateUser} onDelete={handleDeleteUser} />
      </div>
    </div>
  );
};

export default AdminPanel;