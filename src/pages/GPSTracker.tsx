import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MapView from "@/components/MapView";
import Dashboard from "@/components/Dashboard";
import { useGeoFence } from "@/hooks/geoFecnce-hook";
import { useDispatch, useSelector } from "react-redux";
import AuthController from "@/controllers/authController";
import { useWebSocket } from "@/hooks/useWebSocket";
import { webSocketUrl } from "@/config/constants";
import { ensureArray } from "@/helper-functions/use-formater";
import { setGeoFenceData, setTrackLocations } from "@/store/slices/geofenceSlice";

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
  const [historyData, setHistoryData] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const { messages } = useWebSocket(webSocketUrl);
  const dispatch = useDispatch();
  console.log("messages", messages);

  useEffect(() => {
    if (!messages?.length) return;
    try {
      const latestMessage = JSON.parse(messages[messages.length - 1]);
      if (latestMessage?.devices && Array.isArray(latestMessage?.devices)) {
        const updatedDevices = latestMessage.devices;
        const mergedDevices = ensureArray(geoFenceData)?.map((device: any) => {
          const update = ensureArray(updatedDevices)?.find((d: any) => d?.name === device?.name);
          return update ? { ...device, ...update } : device;
        });
        dispatch(setGeoFenceData(mergedDevices));
      }

      if (latestMessage?.positions && Array.isArray(latestMessage?.positions)) {
        const updatedPositions = latestMessage?.positions;
        const mergedPositions = ensureArray(trackLocations)?.map((pos: any) => {
          const update = ensureArray(updatedPositions)?.find((p: any) => p?.deviceId === pos?.deviceId);
          return update ? { ...pos, ...update } : pos;
        });
        dispatch(setTrackLocations(mergedPositions));
      }
    } catch (err) {
      console.error("❌ Failed to parse WebSocket message:", err);
    }
  }, [messages, geoFenceData, trackLocations, dispatch]);

  const updateEventProcess = (id: string, process: "0" | "1") => {
    setLocalEvents((prev) => {
      const exists = ensureArray(prev)?.find((e) => e.ID === id);
      if (exists) {
        return ensureArray(prev)?.map((e) => (e.ID === id ? { ...e, process } : e));
      }
      const event = ensureArray(eventsData)?.find((e: any) => e.ID === id);
      if (event) {
        return [...prev, { ...event, process }];
      }
      return prev;
    });
  };

  const mergedEvents = ensureArray(eventsData)?.map((e: any) => {
    const override = ensureArray(localEvents)?.find((o) => o?.ID === e?.ID);
    return override ? { ...e, ...override } : e;
  });

  const handleSelectionChange = (selected: any[]) => {
    setSelectedItems(selected);
  };

  useEffect(() => {
    const queryParams = {
      username: session?.credentials?.user ?? "",
      password: session?.credentials?.pass ?? "",
    };

    handleCheckalldevices(queryParams);
    handleGetEventsData({ page, userid: session?.user?.id });
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
          setHistoryData={setHistoryData}
          setHistoryOpen={setHistoryOpen}
        />
        <MapView
          cities={cities}
          moreItem={moreItem}
          selectedItems={selectedItems}
          onNavigate={handleNavigation}
          onProcessUpdate={updateEventProcess}
          historyData={historyData}
          historyOpen={historyOpen}
          setHistoryOpen={setHistoryOpen}
        />
      </div>
    </div>
  );
};

export default GPSTracker;