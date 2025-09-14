import React, { useState } from 'react';
import { Eye, EyeOff, User, Truck, MoreVertical, ChevronDown, ChevronRight } from 'lucide-react';

const ObjectsTable = () => {
  const [isGroupExpanded, setIsGroupExpanded] = useState(true);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [visibleItems, setVisibleItems] = useState(new Set(['item-1', 'item-2', 'item-3']));

  const objectsData = [
    // { id: 'item-1', name: '882643047744701', type: 'Online', status: 'active' },
    // { id: 'item-2', name: '882643047744701', type: 'Online', status: 'active' },
    // { id: 'item-3', name: '882643047744701', type: 'Offline', status: 'idle' },
  ];

  const handleSelectAll = () => {
    if (selectedItems.size === objectsData.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(objectsData.map(item => item.id)));
    }
  };

  const handleSelectItem = (id) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const toggleVisibility = (id) => {
    const newVisible = new Set(visibleItems);
    if (newVisible.has(id)) {
      newVisible.delete(id);
    } else {
      newVisible.add(id);
    }
    setVisibleItems(newVisible);
  };

  const toggleAllVisibility = () => {
    if (visibleItems.size === objectsData.length) {
      setVisibleItems(new Set());
    } else {
      setVisibleItems(new Set(objectsData.map(item => item.id)));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white border border-gray-300 shadow-sm font-sans">
      {/* Header */}
      <div className="px-3 py-2 border-b border-gray-300 bg-gray-100">
        <div className="flex items-center gap-2">
          <button  onClick={toggleAllVisibility} className="w-5 h-5 flex items-center justify-center hover:bg-gray-200 rounded">
              <div className="max-w-32">
                <img src="/assets/icons/eye.png" alt="eye Icon" className="w-full h-full object-contain" />
              </div>
          </button>
          <button className="w-5 h-5 flex items-center justify-center hover:bg-gray-200 rounded">
              <div className="max-w-32">
                <img src="/assets/icons/plus-user.png" alt="plus-user Icon" className="w-full h-full object-contain" />
              </div>
          </button>
          <span className="text-sm font-medium text-gray-800">Objects</span>
        </div>
      </div>

      {/* Group Header */}
      <div className="px-3 py-2 border-b border-gray-300 bg-[#D9D9D9]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedItems.size === objectsData.length}
              onChange={handleSelectAll}
              className="w-4 h-4 accent-blue-600 cursor-pointer"
            />
            <input
              type="checkbox"
              checked={visibleItems.size === objectsData.length}
              onChange={toggleAllVisibility}
              className="w-4 h-4 accent-blue-600 cursor-pointer"
            />
            <button
              onClick={() => setIsGroupExpanded(!isGroupExpanded)}
              className="flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900 cursor-pointer"
            >
              {isGroupExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <span>Regrouped(3)</span>
            </button>
          </div>
          <div className="flex items-center gap-1">
            <button className="w-5 h-5 flex items-center justify-center hover:bg-gray-200 rounded cursor-pointer">
              <ChevronDown className="w-3 h-3 text-gray-500" />
            </button>
            <button className="w-5 h-5 flex items-center justify-center hover:bg-gray-200 rounded cursor-pointer">
              <ChevronDown className="w-3 h-3 text-gray-500 rotate-180" />
            </button>
          </div>
        </div>
      </div>

      {/* Table Content */}
      {isGroupExpanded && (
        <div className="divide-y divide-gray-200">
          {objectsData.map((item) => (
            <div key={item.id} className="px-3 py-2 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                    className="w-4 h-4 accent-blue-600 cursor-pointer"
                  />
                  <button
                    onClick={() => toggleVisibility(item.id)}
                    className="w-4 h-4 flex items-center justify-center cursor-pointer"
                  >
                    {visibleItems.has(item.id) ? (
                      <Eye className="w-4 h-4 text-blue-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  <div className="w-5 h-5 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-gray-900 truncate">{item.name}</span>
                    <span className="text-xs text-gray-500">{item.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-gray-500">0 kph</span>
                  <div className="w-4 h-4 flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-sm"></div>
                  </div>
                  <button className="w-4 h-4 flex items-center justify-center hover:bg-gray-200 rounded cursor-pointer">
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ObjectsTable;