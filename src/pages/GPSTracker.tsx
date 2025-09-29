import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MapView from "@/components/MapView";
import Dashboard from "@/components/Dashboard";
import { useGeoFence } from "@/hooks/geoFecnce-hook";
import { useSelector } from "react-redux";
import AuthController from "@/controllers/authController";
import useWebSocket from "@/hooks/useWebSocket";

const GPSTracker = () => {
  const [currentPage, setCurrentPage] = useState<"main" | "dashboard">("main");
  const [activeTab, setActiveTab] = useState("Objects");
  const { cities, isLoading, handleCheckalldevices, handleGetTrackLocations, handleGetEventsData } = useGeoFence();
  const { geoFenceData, trackLocations, eventsData } = useSelector((state: any) => state.GeoFence);
  const session = AuthController.getSession();
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [moreItem, setMoreItem] = useState<any | null>(null);
  const [page, setPage] = useState(1);
  const totalPages = 50;
  const [localEvents, setLocalEvents] = useState<any[]>([]);

  const wsRef = useWebSocket("ws://live.farostestip.online/api/socket", (data) => {
    console.log("📩 New WS data:", data);
  });
  console.log(wsRef, "WebSocket Connection:");

  const updateEventProcess = (id: string, process: "0" | "1") => {
    setLocalEvents((prev) => {
      const exists = prev.find((e) => e.ID === id);
      if (exists) {
        return prev.map((e) => (e.ID === id ? { ...e, process } : e));
      }
      const event = eventsData.find((e: any) => e.ID === id);
      if (event) {
        return [...prev, { ...event, process }];
      }
      return prev;
    });
  };

  const mergedEvents = eventsData?.map((e: any) => {
    const override = localEvents.find((o) => o.ID === e.ID);
    return override ? { ...e, ...override } : e;
  });

  const handleSelectionChange = (selected: any[]) => {
    setSelectedItems(selected);
  };

  const queryParams = {
    username: session?.credentials?.user ?? "",
    password: session?.credentials?.pass ?? "",
  };

  useEffect(() => {
    handleCheckalldevices(queryParams);

  }, [page]);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (!session?.user) return;
      const eventsResponse = await handleGetEventsData({
        page,
        userid: session.user.id,
      });
      await handleGetTrackLocations(queryParams);
    };
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 20000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [page, session?.user?.id]);

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

  // useEffect(() => {
  //   if(selectedItems?.[0]?.geofenceid){
  //     handleGeofenceCities(selectedItems?.[0]?.geofenceid);
  //   }
  // }, [selectedItems]);

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          selectedItems={selectedItems}
          loader={isLoading}
          geoFenceData={geoFenceData}
          trackLocations={trackLocations}
          eventsData={mergedEvents}
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
          onProcessUpdate={updateEventProcess}
        />
      </div>
    </div>
  );
};

export default GPSTracker;