import { formatDate2 } from '@/utils/format-date';
import { Eye, EyeOff } from 'lucide-react';

interface AddressPanelProps {
  address: string;
  showAddress: boolean;
  onToggle: () => void;
}

export const AddressPanel: React.FC<AddressPanelProps> = ({ address, showAddress, onToggle }) => {
  if (!address) return null;

  return (
    <div className="absolute bottom-14 sm:bottom-[56px] left-1/2 -translate-x-1/2 z-50 w-[90%] sm:w-auto max-w-md">
      <div className="flex items-center justify-between bg-[#04003A] text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md">
        {showAddress ? (
          <p className="text-xs sm:text-sm truncate">{formatDate2(address)}</p>
        ) : (
          <p className="text-xs sm:text-sm italic text-gray-400">Address hidden</p>
        )}
        <button onClick={onToggle} className="ml-2 sm:ml-3">
          {showAddress ? (
            <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </button>
      </div>
    </div>
  );
};
