import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MapView from "@/components/MapView";
import Dashboard from "@/components/Dashboard";
import { useGeoFence } from "@/hooks/geoFecnce-hook";
import { useDispatch, useSelector } from "react-redux";
import AuthController from "@/controllers/authController";
import { useAuthWebSocket } from "@/hooks/useWebSocket";
// import { webSocketUrl } from "@/config/constants";
import { ensureArray } from "@/helper-functions/use-formater";
import { setGeoFenceData, setTrackLocations } from "@/store/slices/geofenceSlice";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import toast from "react-hot-toast";
import moment from "moment-timezone";
import { useNetworkStatus } from "@/hooks/useInternet";
import { NoInternetModal } from "@/components/internet-modal";

const GPSTracker = () => {
  const [currentPage, setCurrentPage] = useState<"main" | "dashboard">("main");
  const [activeTab, setActiveTab] = useState("Objects");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { cities, isLoading, handleCheckalldevices, handleGetTrackLocations, handleGetEventsData } = useGeoFence();
  const { geoFenceData, trackLocations, eventsData } = useSelector((state: any) => state.GeoFence);
  const session = AuthController.getSession();
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [moreItem, setMoreItem] = useState<any | null>(null);
  const [page, setPage] = useState(1);
  const [showPlayback, setShowPlayback] = useState(false);
  const totalPages = 50;
  const [localEvents, setLocalEvents] = useState<any[]>([]);
  const [historyData, setHistoryData] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const { messages, reconnect } = useAuthWebSocket();
  const dispatch = useDispatch();
  // const isOnline = useNetworkStatus();

  // useEffect(() => {
  //   if (!messages?.length) return;
  //   try {
  //     const latestMessage = JSON.parse(messages[messages.length - 1]);
  //     if (latestMessage?.devices && Array.isArray(latestMessage?.devices)) {
  //       const updatedDevices = latestMessage.devices;
  //       const mergedDevices = ensureArray(geoFenceData)?.map((device: any) => {
  //         const update = ensureArray(updatedDevices)?.find((d: any) => d?.name === device?.name);
  //         if (!update) return device;
  //         const merged = {
  //           ...device,
  //           ...update, id: device.id, deviceId: device.deviceId, name: device.name };
  //         return JSON.stringify(merged) === JSON.stringify(device) ? device : merged;
  //       });
  //       if (JSON.stringify(mergedDevices) !== JSON.stringify(geoFenceData)) {
  //         dispatch(setGeoFenceData(mergedDevices));
  //       }
  //     }

  //     if (latestMessage?.positions && Array.isArray(latestMessage.positions)) {
  //       const updatedPositions = latestMessage.positions;
  //       const mergedPositions = ensureArray(trackLocations)?.map((pos: any) => {
  //         const update = updatedPositions.find((p: any) => p?.deviceId === pos?.deviceId);
  //         return update ? { ...pos, ...update, deviceId: pos.deviceId, id: pos.id } : pos;
  //       });
  //       if (JSON.stringify(mergedPositions) !== JSON.stringify(trackLocations)) {
  //         dispatch(setTrackLocations(mergedPositions));
  //       }
  //     }
  //   } catch (err) {
  //     console.error("❌ Failed to parse WebSocket message:", err);
  //   }
  // }, [messages, geoFenceData, trackLocations, dispatch]);

  useEffect(() => {
    if (!messages?.length) return;
    try {
      const latestMessage = JSON.parse(messages[messages.length - 1]);
      if (latestMessage?.devices && Array.isArray(latestMessage?.devices)) {
        const updatedDevices = latestMessage.devices;
        const mergedDevices = ensureArray(geoFenceData)?.map((device: any) => {
          const update = ensureArray(updatedDevices)?.find((d: any) => d?.name === device?.name);
          if (!update) return device;
          const merged = {
            ...device,
            ...update, id: device.id, deviceId: device.deviceId, name: device.name };
          return JSON.stringify(merged) === JSON.stringify(device) ? device : merged;
        });
        if (JSON.stringify(mergedDevices) !== JSON.stringify(geoFenceData)) {
          dispatch(setGeoFenceData(mergedDevices));
        }
      }

      if (latestMessage?.positions && Array.isArray(latestMessage.positions)) {
        const updatedPositions = latestMessage.positions;
        const mergedPositions = ensureArray(trackLocations)?.map((pos: any) => {
          const update = updatedPositions.find((p: any) => p?.deviceId === pos?.deviceId);
          return update ? { ...pos, ...update, deviceId: pos.deviceId, id: pos.id } : pos;
        });
        if (JSON.stringify(mergedPositions) !== JSON.stringify(trackLocations)) {
          dispatch(setTrackLocations(mergedPositions));
        }
        if (selectedItems?.length > 0) {
          const updatedSelectedItems = ensureArray(selectedItems)?.map(selectedItem => {
            const update = ensureArray(updatedPositions)?.find((p: any) => 
              p?.deviceId === selectedItem?.deviceId || p?.id === selectedItem?.id || p?.name === selectedItem?.name
            );

            if (update) {
              return {
                ...selectedItem,
                ...update,
                id: selectedItem.id,
                deviceId: selectedItem.deviceId,
                name: selectedItem.name,
                lat: update.lat || update.latitude || selectedItem.lat,
                latitude: update.latitude || update.lat || selectedItem.latitude,
                longi: update.longi || update.longitude || selectedItem.longi,
                longitude: update.longitude || update.longi || selectedItem.longitude,
                speed: update.speed ?? selectedItem.speed,
                ...(update.ignition !== undefined && { ignition: update.ignition }),
                ...(update.serverTime !== undefined && { serverTime: update.serverTime }),
                ...(update.address !== undefined && { address: update.address }),
              };
            }
            return selectedItem;
          });
          const hasChanges = JSON.stringify(updatedSelectedItems) !== JSON.stringify(selectedItems);
          if (hasChanges) {
            console.log("🔄 Updating selectedItems with WebSocket data");
            setSelectedItems(updatedSelectedItems);
          }
        }
      }
    } catch (err) {
      console.error("❌ Failed to parse WebSocket message:", err);
    }
  }, [messages, geoFenceData, trackLocations, dispatch, selectedItems]);

  const updateEventProcess = (id: string, process: "0" | "1") => {
    setLocalEvents((prev) => {
      const exists = ensureArray(prev)?.find((e) => e.ID === id);
      if (exists) {
        return ensureArray(prev)?.map((e) =>
          e.ID === id ? { ...e, process } : e
        );
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

  const queryParams = {
    username: session?.credentials?.user ?? "",
    password: session?.credentials?.pass ?? "",
  };

  useEffect(() => {
    handleCheckalldevices(queryParams);
    handleGetEventsData({ page, userid: session?.user?.id });
    handleGetTrackLocations(queryParams);
  }, [page]);

  // useEffect(() => {
  //   let isMounted = true;
  //   const fetchData = async () => {
  //     if (!session?.user) return;
  //     await handleGetEventsData({ page, userid: session.user.id });
  //     await handleGetTrackLocations(queryParams);
  //   };
  //   fetchData();
  //   const interval = setInterval(() => {
  //     fetchData();
  //   }, 20000);
  //   return () => {
  //     isMounted = false;
  //     clearInterval(interval);
  //   };
  // }, [page, session?.user?.id]);

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

  const handleDownloadPDF = async (fromTime: string, toTime: string) => {
    if (!historyData?.length || !mapContainerRef.current) {
      toast.error("No history data to export");
      return;
    }
    try {
      const canvas = await html2canvas(mapContainerRef.current, {
        useCORS: true,
        logging: false,
        scale: 2,
        width: mapContainerRef.current.offsetWidth,
        height: mapContainerRef.current.offsetHeight,
      });
      const pdf = new jsPDF("portrait", "mm", "a4");
      const imgData = canvas.toDataURL("image/png");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      let currentY = 15;
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      const mainHeading = "GPS Tracker Website";
      const headingWidth = pdf.getTextWidth(mainHeading);
      pdf.text(mainHeading, (pageWidth - headingWidth) / 2, currentY);
      currentY += 8;
      pdf.setFontSize(10);
      const formattedFrom = fromTime
        ? moment(fromTime).tz("Asia/Karachi").format("YYYY-MM-DD")
        : "";
      const formattedTo = toTime
        ? moment(toTime).tz("Asia/Karachi").format("YYYY-MM-DD")
        : "";
      const combinedText = `History Report • ${formattedFrom} - ${formattedTo}`;
      const combinedWidth = pdf.getTextWidth(combinedText);
      pdf.text(combinedText, (pageWidth - combinedWidth) / 2, currentY);
      currentY += 6;

      // const logoUrl = "/assets/banner/dashboard-map-banner.png";
      // const logoImg = new Image();
      // logoImg.src = logoUrl;
      // const logoWidth = 35;
      // const logoHeight = 18;
      // pdf.addImage(logoImg, "PNG", (pageWidth - logoWidth) / 2, currentY, logoWidth, logoHeight);
      // currentY += logoHeight + 5;

      const canvasAspectRatio = canvas.width / canvas.height;
      const maxMapWidth = pageWidth - 2 * margin;
      const maxMapHeight = 80;
      let mapWidth = maxMapWidth;
      let mapHeight = mapWidth / canvasAspectRatio;
      if (mapHeight > maxMapHeight) {
        mapHeight = maxMapHeight;
        mapWidth = mapHeight * canvasAspectRatio;
      }
      const mapX = (pageWidth - mapWidth) / 2;
      pdf.addImage(imgData, "PNG", mapX, currentY, mapWidth, mapHeight);
      currentY += mapHeight + 8;
      const headers = [
        "DateTime",
        "Ign",
        "Latitude",
        "Longitude",
        "Speed",
        "Address",
        "Distance",
      ];
      const colWidths = [32, 12, 22, 22, 15, 62, 25];
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "bold");
      pdf.setFillColor(240, 240, 240);
      let x = margin;
      headers.forEach((h, i) => {
        pdf.rect(x, currentY, colWidths[i], 7, "D");
        pdf.text(h, x + 1, currentY + 5);
        x += colWidths[i];
      });
      currentY += 7;
      pdf.setFont("helvetica", "normal");
      historyData?.forEach((row: any) => {
        x = margin;
        const rowData = [
          row?.serverTime ?? "",
          row?.ignition ?? "",
          row?.latitude ?? "",
          row?.longitude ?? "",
          `${row?.speed ?? ""}`,
          row?.address ?? "",
          row?.totalDistance ?? "",
        ];
        let maxCellHeight = 6;
        rowData.forEach((text, i) => {
          let cellText = String(text);
          let lines = [cellText];
          if (i === 5 || i === 0) {
            lines = pdf.splitTextToSize(cellText, colWidths[i] - 2);
          }
          const lineHeight = 3.5;
          const cellHeight = Math.max(6, lines.length * lineHeight + 1);
          if (cellHeight > maxCellHeight) maxCellHeight = cellHeight;
        });
        if (currentY + maxCellHeight > pageHeight - 15) {
          pdf.addPage();
          currentY = 15;
          x = margin;
          pdf.setFont("helvetica", "bold");
          pdf.setFillColor(240, 240, 240);
          headers.forEach((h, i) => {
            pdf.rect(x, currentY, colWidths[i], 7, "D");
            pdf.text(h, x + 1, currentY + 5);
            x += colWidths[i];
          });
          currentY += 7;
          pdf.setFont("helvetica", "normal");
          x = margin;
        }
        rowData.forEach((text, i) => {
          let cellText = String(text);
          let lines = [cellText];
          if (i === 5 || i === 0) {
            lines = pdf.splitTextToSize(cellText, colWidths[i] - 2);
          }
          pdf.rect(x, currentY, colWidths[i], maxCellHeight);
          lines.forEach((line: string, lineIndex: number) => {
            pdf.text(line, x + 1, currentY + 4 + lineIndex * 3.5);
          });
          x += colWidths[i];
        });
        currentY += maxCellHeight;
      });
      pdf.save("gps-tracker-history-report.pdf");
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <>
      {/* {!isOnline && <NoInternetModal onRefresh={() => reconnect()} />} */}
      <div className="h-screen flex flex-col bg-background">
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="flex-1 flex overflow-hidden relative">
          <Sidebar selectedItems={selectedItems} loader={isLoading} geoFenceData={geoFenceData} trackLocations={trackLocations}
            eventsData={mergedEvents} activeTab={activeTab} onTabChange={handleTabChange} onSelectionChange={handleSelectionChange} 
            page={page} totalPages={totalPages} handleNext={handleNext} handlePrevious={handlePrevious} onMoreClick={setMoreItem}
            setHistoryData={setHistoryData} setHistoryOpen={setHistoryOpen} handleDownloadPDF={handleDownloadPDF} isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} setShowPlayback={setShowPlayback}
          />
          <MapView cities={cities} moreItem={moreItem} selectedItems={selectedItems} onNavigate={handleNavigation} setHistoryOpen={setHistoryOpen}
            onProcessUpdate={updateEventProcess} historyData={historyData} historyOpen={historyOpen} mapContainerRef={mapContainerRef}
            showPlayback={showPlayback} setShowPlayback={setShowPlayback}
          />
        </div>
      </div>
    </>
  );
};

export default GPSTracker;