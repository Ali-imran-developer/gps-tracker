import { Loader2, MoreVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AddComments from "./add-comments";
import ViewComments from "./view-comments";
import { useGeoFence } from "@/hooks/geoFecnce-hook";
import { useSelector } from "react-redux";

interface EventTableProps {
  eventsLoader: boolean;
  eventsData: any;
  geoFenceData: any;
  onSelectionChange?: (selected: any[]) => void;
  onMoreClick?: (item: any) => void;
  selectedKeys: string[];
  setSelectedKeys: React.Dispatch<React.SetStateAction<string[]>>;
}

const EventsTable = ({
  eventsLoader,
  eventsData,
  geoFenceData,
  onSelectionChange,
  onMoreClick,
  selectedKeys,
  setSelectedKeys,
}: EventTableProps) => {
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({x: 0, y: 0});
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { isAdding, handleGetAllMessages } = useGeoFence();
  const { fetchAllMessages } = useSelector((state: any) => state.GeoFence);
  const [page, setPage] = useState(1);
  const totalPages = 50;
  const handlePrevious = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>  setPage((prev) => Math.min(prev + 1, totalPages));

  useEffect(() => {
    const queryParams = {
      veh: selectedItem?.vehicle,
      page: page,
    };
    if(selectedItem){
      handleGetAllMessages(queryParams);
    }
  }, [selectedItem, page]);

  const mergedData = eventsData?.map((event: any) => {
    const device = geoFenceData?.find((d: any) => Number(d?.id) === Number(event?.deviceid));
    return {
      ...event,
      ...(device ?? {}),
    };
  });

  const getRowKey = (item: any, index: number) => `${item.id}-${index}`;
  const toggleExpand = (rowKey: string) => {
    setExpandedRows((prev) =>
      prev.includes(rowKey) ? prev.filter((key) => key !== rowKey) : [...prev, rowKey]
    );
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, rowKey: string, item: any) => {
    e.stopPropagation();
    let updated: string[];
    if (e.target.checked) {
      updated = [...selectedKeys, rowKey];
    } else {
      updated = selectedKeys.filter((key) => key !== rowKey);
    }
    setSelectedKeys(updated);
    const selectedObjects = mergedData?.filter((_, idx) => updated.includes(getRowKey(_, idx)));
    onSelectionChange?.(selectedObjects ?? []);
  };

  const handleMoreVerticalClick = (e: React.MouseEvent<HTMLButtonElement>, item: any) => {
    e.stopPropagation();
    setSelectedItem(item);
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({ x: rect.right + 4, y: rect.top });
    setMenuOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto border rounded-md shadow-sm bg-white font-sans text-xs">
      <div className="max-h-[calc(100vh-220px)] relative overflow-y-auto divide-y">
        {mergedData?.map((item: any, index: number) => {
          const rowKey = getRowKey(item, index);
          const isExpanded = expandedRows.includes(rowKey);
          const isChecked = selectedKeys.includes(rowKey);
          const disabled = !item?.lat || !item?.longi;

          return (
            <div key={rowKey} className="flex flex-col cursor-pointer hover:bg-gray-50 relative" onClick={() => toggleExpand(rowKey)}>
              <div className={`flex items-center gap-1 ps-2 py-1 ${item?.process === "1" ? "bg-green-200" : ""}`}>
                <input
                  type="checkbox"
                  className="w-3 h-3 accent-blue-600"
                  disabled={disabled}
                  checked={isChecked}
                  onChange={(e) => handleCheckboxChange(e, rowKey, item)}
                  onClick={(e) => e.stopPropagation()}
                />

                <div className="flex-1">
                  <div className="font-medium text-gray-800 truncate">
                    {item?.vehicle ?? item?.name}
                  </div>
                  <div className="text-[10px] text-gray-600 truncate">
                    {item?.servertime1 ?? ""}
                  </div>
                </div>

                <div className="flex-1 text-right text-wrap shrink-0">
                  <div className="text-[11px] font-medium text-gray-800">
                    {item?.type ?? ""}
                  </div>
                </div>
                <div className="shrink-0">
                  <button type="button" onClick={(e) => handleMoreVerticalClick(e, item)} className="p-1 rounded hover:bg-gray-200">
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
              {isExpanded && (
                <div className="bg-gray-100 text-[11px] px-3 py-2 grid gap-1">
                  <span>
                    <b>Phone:</b> {item?.phone ?? ""}
                  </span>
                  <span>
                    <b>Model:</b> {item?.model ?? ""}
                  </span>
                  <span>
                    <b>Contact:</b> {item?.contact ?? ""}
                  </span>
                  <span>
                    <b>Customer Name:</b>{" "}
                    {item?.attributes?.["Customer Name"] ?? ""}
                  </span>
                  <span>
                    <b>IMEI:</b> {item.imei}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {menuOpen && (
        <div ref={menuRef} className="absolute z-50 w-48 bg-white shadow-lg rounded-md border border-gray-200 text-sm" style={{ top: position.y, left: position.x }}>
          <ul className="flex flex-col">
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setViewDialogOpen(true);
                setMenuOpen(false);
              }}
            >
              View Comments
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setAddDialogOpen(true);
                setMenuOpen(false);
              }}
            >
              Add Comment
            </li>
          </ul>
        </div>
      )}

      <AddComments 
        viewDialogOpen={addDialogOpen}
        setViewDialogOpen={setAddDialogOpen} 
        moreItem={selectedItem}
      />

      <ViewComments
        page={page}
        totalPages={totalPages}
        handlePrevious={handlePrevious}
        handleNext={handleNext}
        loading={isAdding}
        viewDialogOpen={viewDialogOpen} 
        setViewDialogOpen={setViewDialogOpen}
        data={fetchAllMessages} 
      />
    </div>
  );
};

export default EventsTable;