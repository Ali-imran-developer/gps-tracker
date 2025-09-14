import { useState } from "react";
import { Search, RefreshCw, Users, Plus, Eye, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={cn(
              "flex-1 px-4 py-3 text-sm font-medium transition-colors",
              selectedTab === tab
                ? "text-primary border-b-2 border-primary bg-accent"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Objects Tab Content */}
      {selectedTab === "Objects" && (
        <div className="flex-1 flex flex-col">
          {/* Top Controls */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2 mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search objects..." className="pl-9" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Table Header */}
          <div className="px-4 py-2 border-b border-border bg-muted">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Objects</span>
            </div>
          </div>

          {/* Objects List */}
          <div className="flex-1 overflow-y-auto">
            {objectsData.map((object) => (
              <div
                key={object.id}
                className="px-4 py-3 border-b border-border hover:bg-accent cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        object.status === "active" && "bg-success",
                        object.status === "idle" && "bg-warning",
                        object.status === "maintenance" && "bg-danger"
                      )}
                    />
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
          </div>
        </div>
      )}

      {/* Other tabs content placeholder */}
      {selectedTab !== "Objects" && (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          {selectedTab} content coming soon...
        </div>
      )}
    </div>
  );
};

export default Sidebar;
