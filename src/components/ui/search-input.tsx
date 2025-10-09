import { useState, useRef, useEffect } from 'react';
import { useField } from 'formik';

interface ObjectType {
  deviceId: string;
  devicename?: string;
}

interface SearchableSelectProps {
  name: string;
  data: ObjectType[];
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({ name, data }) => {
  const [field, , helpers] = useField(name);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredData, setFilteredData] = useState<ObjectType[]>(data);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter data based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredData(data);
    } else {
      const filtered = data.filter(obj =>
        obj.devicename?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, data]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (obj: ObjectType) => {
    helpers.setValue(obj.deviceId);
    setSearchTerm(obj.devicename ?? '');
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    setSearchTerm('');
  };

  const selectedObject = data.find(obj => obj.deviceId === field.value);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center border rounded-none p-1 w-20 md:w-48 h-8 text-sm bg-[#04003A] text-white">
        <input
          type="text"
          value={isOpen ? searchTerm : (selectedObject?.devicename ?? '')}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder="Search object..."
          className="w-full bg-transparent outline-none placeholder-gray-400"
        />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-[#04003A] border border-gray-600 shadow-lg max-h-60 overflow-auto">
          {filteredData.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-400">No objects found</div>
          ) : (
            filteredData.map((obj) => (
              <div
                key={obj.deviceId}
                onClick={() => handleSelect(obj)}
                className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-600 ${
                  field.value === obj.deviceId ? 'bg-blue-700 text-white' : 'text-white'
                }`}
              >
                {obj.devicename ?? ''}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;