import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MapView from "@/components/MapView";
import Dashboard from "@/components/Dashboard";
import { useGeoFence } from "@/hooks/geoFecnce-hook";
import { useSelector } from "react-redux";
import AuthController from "@/controllers/authController";

const GPSTracker = () => {
  const [currentPage, setCurrentPage] = useState<"main" | "dashboard">("main");
  const [activeTab, setActiveTab] = useState("Objects");
  const { cities, isLoading, handleCheckalldevices, handleGetTrackLocations, handleGetEventsData, handleGeofenceCities } = useGeoFence();
  const { geoFenceData, trackLocations, eventsData } = useSelector((state: any) => state.GeoFence);
  const session = AuthController.getSession();
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [moreItem, setMoreItem] = useState<any | null>(null);
  const [page, setPage] = useState(1);
  const totalPages = 50;

  const handleSelectionChange = (selected: any[]) => {
    setSelectedItems(selected);
  };

  const queryParams = {
    username: session?.credentials?.user ?? "",
    password: session?.credentials?.pass ?? "",
  };

  const initialParams = {
    page: 1,
    userid: session?.user?.id,
  };

  useEffect(() => {
    handleGetEventsData({ page, userid: session?.user?.id });
    handleCheckalldevices(queryParams);
    handleGetTrackLocations(queryParams);
  }, [page]);

  const handlePrevious = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleNavigation = (page: "main" | "dashboard") => {
    setCurrentPage(page);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  if (currentPage === "dashboard") {
    return <Dashboard onNavigate={handleNavigation} />;
  }

  useEffect(() => {
    if(selectedItems?.[0]?.geofenceid){
      handleGeofenceCities(selectedItems?.[0]?.geofenceid);
    }
  }, [selectedItems]);

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 flex overflow-y-auto">
        <Sidebar
          loader={isLoading}
          geoFenceData={geoFenceData}
          trackLocations={trackLocations}
          eventsData={eventsData}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onSelectionChange={handleSelectionChange}
          page={page}
          totalPages={totalPages}
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          onMoreClick={setMoreItem}
        />
        <MapView 
          cities={cities}
          moreItem={moreItem}
          selectedItems={selectedItems} 
          onNavigate={handleNavigation} 
        />
      </div>
    </div>
  );
};

export default GPSTracker;