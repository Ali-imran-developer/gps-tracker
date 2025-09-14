import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import ObjectsTable from "./Objects-table";

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const Sidebar = ({ activeTab = "Objects", onTabChange }: SidebarProps) => {
  const [selectedTab, setSelectedTab] = useState(activeTab);

  const tabs = ["Objects", "Events", "Places", "History"];
  
  const objectsData = [
    { id: 1, name: "Vehicle-001", status: "active", user: "John Doe" },
    { id: 2, name: "Vehicle-002", status: "idle", user: "Jane Smith" },
    { id: 3, name: "Vehicle-003", status: "active", user: "Mike Johnson" },
    { id: 4, name: "Vehicle-004", status: "maintenance", user: "Sarah Wilson" },
    { id: 5, name: "Vehicle-005", status: "active", user: "David Brown" },
  ];

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
    onTabChange?.(tab);
  };

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col h-full">
      <div className="flex border-b border-border bg-[#D9D9D9]">
        {tabs?.map((tab) => (
          <button key={tab} onClick={() => handleTabClick(tab)}
            className={cn("flex-1 px-4 py-3 text-sm font-medium transition-colors",
            selectedTab === tab ? "text-[#444444] border-b-2 border-primary bg-white" : "text-muted-foreground hover:text-foreground hover:bg-accent")}>
            {tab}
          </button>
        ))}
      </div>

      {selectedTab === "Objects" && (
        <div className="flex-1 flex flex-col">
          <div className="py-4 flex items-center gap-2 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search" className="pl-9 bg-[#04003A] placeholder:text-gray-300 rounded-none" />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="outline" className="bg-[#04003A] rounded-none" size="sm">
                <div className="max-w-28">
                  <img src="/assets/icons/refresh.png" alt="refresh Icon" className="w-full h-full object-contain" />
                </div>
              </Button>
              <Button variant="outline" className="bg-[#04003A] rounded-none" size="sm">
                <div className="max-w-28">
                  <img src="/assets/icons/sunlight.png" alt="sunlight Icon" className="w-full h-full object-contain" />
                </div>
              </Button>
              <Button variant="outline" className="bg-[#04003A] rounded-none" size="sm">
                <div className="max-w-28">
                  <img src="/assets/icons/plus.png" alt="plus Icon" className="w-full h-full object-contain" />
                </div>
              </Button>
            </div>
          </div>

          <ObjectsTable />

          {/* <div className="px-4 py-2 border-b border-border bg-muted">
            <div className="flex items-center gap-2">
              <div className="max-w-28">
                <img src="/assets/icons/eye.png" alt="eye Icon" className="w-full h-full object-contain" />
              </div>
              <div className="max-w-28">
                <img src="/assets/icons/plus-user.png" alt="plus-user Icon" className="w-full h-full object-contain" />
              </div>
              <span className="text-sm font-medium">Objects</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {objectsData.map((object) => (
              <div key={object.id} className="px-4 py-3 border-b border-border hover:bg-accent cursor-pointer transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-2 h-2 rounded-full", object.status === "active" && "bg-success", object.status === "idle" && "bg-warning", object.status === "maintenance" && "bg-danger")} />
                    <div>
                      <div className="font-medium text-sm">{object.name}</div>
                      <div className="text-xs text-muted-foreground">{object.user}</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {object.status}
                  </div>
                </div>
              </div>
            ))}
          </div> */}
        </div>
      )}

      {selectedTab !== "Objects" && (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          {selectedTab} content coming soon...
        </div>
      )}
    </div>
  );
};

export default Sidebar;
