import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MapView from "@/components/MapView";
import Dashboard from "@/components/Dashboard";

const GPSTracker = () => {
  const [currentPage, setCurrentPage] = useState<"main" | "dashboard">("main");
  const [activeTab, setActiveTab] = useState("Objects");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigation = (page: "main" | "dashboard") => {
    setCurrentPage(page);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  if (currentPage === "dashboard") {
    return <Dashboard onNavigate={handleNavigation} />;
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Header onMenuClick={toggleSidebar} />
      <div className="flex-1 flex relative overflow-hidden">
        <div className="hidden lg:block">
          <Sidebar 
            activeTab={activeTab} 
            onTabChange={handleTabChange}
            isOpen={true}
          />
        </div>
        <div className="lg:hidden">
          <Sidebar 
            activeTab={activeTab} 
            onTabChange={handleTabChange}
            isOpen={sidebarOpen}
            onClose={closeSidebar}
          />
        </div>
        <MapView onNavigate={handleNavigation} />
      </div>
    </div>
  );
};

export default GPSTracker;