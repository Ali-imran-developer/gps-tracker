import React from "react";
import { X } from "lucide-react";

interface EditModalProps {
  item: any;
  onClose: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ item, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white w-[500px] rounded-none shadow-lg">
        <div className="flex items-center justify-between bg-[#04003A] text-white p-4">
          <h2 className="text-lg font-semibold">Edit Object</h2>
          <X className="cursor-pointer" onClick={onClose} />
        </div>
        <div className="p-4 space-y-3">
          <p><strong>Name:</strong> {item.name}</p>
          <p><strong>IMEI:</strong> {item.imei}</p>
          {/* Add editable form fields here */}
        </div>
      </div>
    </div>
  );
};

export default EditModal;