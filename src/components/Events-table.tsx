import { Loader2, MoreVertical } from "lucide-react";
import { useState } from "react";

interface EventTableProps{
  eventsLoader: boolean;
  eventsData: any;
  geoFenceData: any;
  onSelectionChange?: (selected: any[]) => void;
  onMoreClick?: (item: any) => void;
}

const EventsTable = ({ eventsLoader, eventsData, geoFenceData, onSelectionChange, onMoreClick  }: EventTableProps) => {
  const [expandedRows, setExpandedRows] = useState<string[]>([]); 
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

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
      updated = [rowKey];
    } else {
      updated = [];
    }
    setSelectedItems(updated);
    const selectedObjects = mergedData?.filter((_, idx) => updated.includes(getRowKey(_, idx)));
    onSelectionChange?.(selectedObjects ?? []);
  };

  return (
    <div className="w-full max-w-md mx-auto border rounded-md shadow-sm bg-white font-sans text-xs">
      <div className="max-h-[70vh] overflow-y-auto divide-y">
        {eventsLoader ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            <span className="ml-2 text-gray-600 text-sm">Loading events...</span>
          </div>
        ) : (
          mergedData?.map((item: any, index: number) => {
            const rowKey = getRowKey(item, index); // unique per row
            const isExpanded = expandedRows.includes(rowKey);
            const isChecked = selectedItems.includes(rowKey);
            const disabled = !item?.lat || !item?.longi;

            return (
              <div key={rowKey} className="flex flex-col cursor-pointer hover:bg-gray-50" onClick={() => toggleExpand(rowKey)}>
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
                    <button type="button" onClick={(e) => { e.stopPropagation(); onMoreClick?.(item) }} className="p-1 rounded hover:bg-gray-200">
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
          })
        )}
      </div>
    </div>
  );
};

export default EventsTable;