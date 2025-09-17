import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MapView from "@/components/MapView";
import Dashboard from "@/components/Dashboard";

const GPSTracker = () => {
  const [currentPage, setCurrentPage] = useState<"main" | "dashboard">("main");
  const [activeTab, setActiveTab] = useState("Objects");

  const handleNavigation = (page: "main" | "dashboard") => {
    setCurrentPage(page);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  if (currentPage === "dashboard") {
    return <Dashboard onNavigate={handleNavigation} />;
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 flex overflow-y-auto">
        <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
        <MapView onNavigate={handleNavigation} />
      </div>
    </div>
  );
};

export default GPSTracker;