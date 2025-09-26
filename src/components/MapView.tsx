import React, { useState, useMemo, useEffect, useRef } from "react";
import { BarChart3, FileText, MapPin, Info, X, Loader2, EyeOff, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GoogleMap, LoadScript, Marker, Polygon, InfoWindow, Circle } from "@react-google-maps/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { mapTools, topControls } from "@/data/map-view";
import { useFormik } from "formik";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import AuthController from "@/controllers/authController";
import { useGeoFence } from "@/hooks/geoFecnce-hook";
import { useSelector } from "react-redux";

interface MapViewProps {
  cities: any[];
  moreItem: any;
  selectedItems: any[];
  onNavigate?: (page: string) => void;
  onProcessUpdate: any;
}

const containerStyle = {
  width: "100%",
  height: "100%",
};

function parseWKT(area: string): google.maps.LatLngLiteral[] {
  if (!area) return [];
  const match = area.match(/POLYGON\s*\(\((.*?)\)\)/i);
  if (!match) return [];
  const coordinates = match[1].split(",").map(coord => {
    const [lat, lng] = coord.trim().split(/\s+/).map(Number);
    return { lat, lng };
  }).filter(coord => !isNaN(coord.lat) && !isNaN(coord.lng));
  return coordinates;
}

const MapView = ({ cities, moreItem, selectedItems, onNavigate, onProcessUpdate }: MapViewProps) => {
  const [activeControl, setActiveControl] = useState<string | null>(null);
  const [center] = useState({ lat: 30.3384, lng: 71.2781 });
  const [zoom, setZoom] = useState(15);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [selectedArea, setSelectedArea] = useState<any | null>(null);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const session = AuthController.getSession();
  const { isAdding, handlePostMessage, handleGetAddress } = useGeoFence();
  const { address } = useSelector((state: any) => state.GeoFence);
  const [showAddress, setShowAddress] = useState(true);

  const getCarIcon = () => {
    if (typeof window !== 'undefined' && window.google) {
      return {
        url: 'data:image/svg+xml;base64,' + btoa(`
          <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <g fill="#FF4444" stroke="#000" stroke-width="1">
              <path d="M6 20h2c0 1.1.9 2 2 2s2-.9 2-2h8c0 1.1.9 2 2 2s2-.9 2-2h2c1.1 0 2-.9 2-2v-6l-3-3h-3V7c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2z"/>
              <circle cx="10" cy="20" r="2"/>
              <circle cx="22" cy="20" r="2"/>
            </g>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(32, 32),
        anchor: new window.google.maps.Point(16, 16),
      };
    }
    return undefined;
  };

  const initialValues = {
    ID: moreItem?.ID ?? "",
    agent: session?.credentials?.user ?? "",
    imei: moreItem?.imei ?? "",
    alerttype: moreItem?.type ?? "",
    process: "1",
    vehicle: moreItem?.vehicle ?? "",
    comments: "",
    selectedOption: "",
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      try{
        const finalComment = values.selectedOption || values.comments;
        const { selectedOption, ...apiValues } = values;
        const payload = {
          ...apiValues,
          comments: finalComment,
        };
        console.log("Form submitted:", payload);
        await handlePostMessage(payload);
        if (payload.ID) {
          onProcessUpdate(payload.ID, "1");
        }
        resetForm();
        setShowModal(false);
      }catch(error){
        console.log(error);
      }
    },
  });

  const isButtonDisabled = formik.values.comments.trim() === "" && formik.values.selectedOption.trim() === "";

  useEffect(() => {
    if (moreItem) {
      setShowModal(true);
    }
  }, [moreItem]);

  // useEffect(() => {
  //   if (selectedItems.length > 0 && mapRef.current) {
  //     selectedItems?.map((item) => {
  //       const rawLat = item?.lat ?? item?.latitude;
  //       const rawLng = item?.longi ?? item?.longitude;
  //       const lat = parseFloat(rawLat) || 0;
  //       const lng = parseFloat(rawLng) || 0;
  //     if (isFinite(lat) && isFinite(lng)) {
  //       const newCenter = { lat, lng };
  //       mapRef.current.panTo(newCenter);
  //       mapRef.current.setZoom(15);
  //     } else {
  //       console.warn("Invalid lat/lng:", rawLat, rawLng, item);
  //     }
  //     });
  //   }
  // }, [selectedItems]);

  // useEffect(() => {
  //   if (selectedItems.length > 0 && mapRef.current) {
  //     const firstItem = selectedItems[0];
  //     if (firstItem.area) {
  //       const path = parseWKT(firstItem.area);
  //       if (path.length > 0) {
  //         const bounds = new window.google.maps.LatLngBounds();
  //         path.forEach(coord => bounds.extend(coord));
  //         mapRef.current.fitBounds(bounds);
  //       }
  //     }
  //   }
  // }, [selectedItems]);

  useEffect(() => {
    if (selectedItems.length > 0 && mapRef.current) {
      selectedItems.forEach((item) => {
        // Case 1: Circle geometry
        if (item.area?.startsWith("CIRCLE")) {
          const match = item.area.match(/CIRCLE\s*\(\s*([\d.-]+)\s+([\d.-]+)\s*,\s*([\d.-]+)\s*\)/);
          if (match) {
            const lat = parseFloat(match[1]);
            const lng = parseFloat(match[2]);
            const radius = parseFloat(match[3]);

            // Pan to circle center
            mapRef.current.panTo({ lat, lng });

            // Adjust zoom roughly based on radius
            const circleBounds = new google.maps.Circle({
              center: { lat, lng },
              radius,
            }).getBounds();
            if (circleBounds) {
              mapRef.current.fitBounds(circleBounds);
            }
          }
          return;
        }

        // Case 2: Point geometry (vehicle lat/lng)
        const rawLat = item?.lat ?? item?.latitude;
        const rawLng = item?.longi ?? item?.longitude;
        const lat = parseFloat(rawLat) || 0;
        const lng = parseFloat(rawLng) || 0;
        if (isFinite(lat) && isFinite(lng)) {
          mapRef.current.panTo({ lat, lng });
          mapRef.current.setZoom(15);
        }
      });
    }
  }, [selectedItems]);

  useEffect(() => {
    if (selectedItems.length > 0 && mapRef.current) {
      const firstItem = selectedItems[0];
      if (!firstItem?.area) return;

      if (firstItem.area.startsWith("CIRCLE")) {
        // Handle circle zoom
        const match = firstItem.area.match(/CIRCLE\s*\(\s*([\d.-]+)\s+([\d.-]+)\s*,\s*([\d.-]+)\s*\)/);
        if (match) {
          const lat = parseFloat(match[1]);
          const lng = parseFloat(match[2]);
          const radius = parseFloat(match[3]);

          const circleBounds = new google.maps.Circle({
            center: { lat, lng },
            radius,
          }).getBounds();
          if (circleBounds) {
            mapRef.current.fitBounds(circleBounds);
          }
        }
      } else {
        // Handle polygon zoom
        const path = parseWKT(firstItem.area);
        if (path.length > 0) {
          const bounds = new window.google.maps.LatLngBounds();
          path.forEach((coord) => bounds.extend(coord));
          mapRef.current.fitBounds(bounds);
        }
      }
    }
  }, [selectedItems]);

  useEffect(() => {
    if (selectedItems?.length > 0 && mapRef?.current) {
      const item = selectedItems[0];
      const rawLat = item?.lat ?? item?.latitude;
      const rawLng = item?.longi ?? item?.longitude;
      const deviceId = item?.deviceid ?? item?.deviceId;
      const queryParams = {
        lati: rawLat,
        longi: rawLng,
        deviceid: deviceId,
      };
      if(queryParams?.lati && queryParams?.longi && queryParams?.deviceid){
        handleGetAddress(queryParams);
        setShowAddress(true);
      }
    }
  }, [selectedItems]);

  const handleControlClick = (controlId: string) => {
    if (controlId === "dashboard") {
      onNavigate?.("dashboard");
    } else {
      setActiveControl(activeControl === controlId ? null : controlId);
    }
  };

  const handleMapClick = () => {
    setShowDetailsPanel(false);
    setSelectedArea(null);
  };

  const formatVehicleInfoContent = (item: any) => {
    const getIgnitionStatus = (ignition: string) => {
      return ignition === "1" ? "On" : "Off";
    };

    const getSpeedColor = (speed: string) => {
      const speedNum = parseFloat(speed);
      if (speedNum > 80) return "text-red-600";
      if (speedNum > 50) return "text-orange-600";
      return "text-green-600";
    };

    const getLat = (item: any) => {
      if (item.lat) return Number(item.lat).toFixed(6);
      if (item.latitude) return Number(item.latitude).toFixed(6);
      return "0.000000";
    };

    const getLng = (item: any) => {
      if (item.longi) return Number(item.longi).toFixed(6);
      if (item.longitude) return Number(item.longitude).toFixed(6);
      return "0.000000";
    };

    return (
      <div className="p-3 min-w-[250px] max-w-[350px] bg-white rounded-lg shadow-lg">
        <div className="space-y-2 text-sm">
          <div className="border-b pb-2 mb-2">
            <h3 className="font-bold text-lg text-blue-900">{item?.vehicle || item?.name}</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-medium text-gray-600">IMEI:</span>
              <div className="text-gray-900 text-xs">{item?.imei || item?.uniqueId}</div>
            </div>
            
            <div>
              <span className="font-medium text-gray-600">Model:</span>
              <div className="text-gray-900">{item.model}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-medium text-gray-600">Speed:</span>
              <div className={`font-semibold ${getSpeedColor(item.speed)}`}>
                {item.speed} km/h
              </div>
            </div>
            
            <div>
              <span className="font-medium text-gray-600">Ignition:</span>
              <div className={`font-semibold ${item.ignition === "1" ? "text-green-600" : "text-red-600"}`}>
                {getIgnitionStatus(item.ignition)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-medium text-gray-600">Course:</span>
              <div className="text-gray-900">{item.course}°</div>
            </div>
            {item.contact && (
              <div>
                <span className="font-medium text-gray-600">Contact:</span>
                <div className="text-gray-900 text-xs">{item?.phone}</div>
              </div>
            )}
          </div>

          <div>
            <span className="font-medium text-gray-600">Position:</span>
            <div className="text-gray-900 text-xs">
              Lat: {getLat(item)}, Lng: {getLng(item)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const createSurroundingArea = (item: any) => {
    const lat = parseFloat(item.lat ?? item.latitude ?? "0");
    const lng = parseFloat(item.longi ?? item.longitude ?? "0");
    const speed = parseFloat(item.speed ?? "0");
    const baseRadius = 500;
    const speedMultiplier = Math.max(1, speed / 50);
    const radius = baseRadius * speedMultiplier;
    return {
      center: { lat, lng },
      radius,
    };
  };

  const formatDate = (fullAddress: string) => {
    if (!fullAddress) return "";
    const [location, rawDate] = fullAddress.split("^");
    if (!rawDate) return fullAddress;
    const cleanedDate = rawDate.trim().replace(/\s+/g, " "); 
    const fixedDate = cleanedDate.replace(/(\d{2}):\s*(\d{2}):\s*(\d{2})/, "$1:$2:$3"); 
    const date = new Date(fixedDate.replace(" ", "T"));
    if (isNaN(date.getTime())) {
      return fullAddress;
    }
    const formattedDate = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Karachi",
      dateStyle: "short",
      timeStyle: "medium",
    }).format(date);
    return `${location.trim()} | ${formattedDate}`;
  };

  const renderInfoContent = (item: any, multiple: boolean) => {
    if (multiple) {
      return (
        <div className="p-0">
          <strong className="font-semibold text-[11px]">{item.vehicle || item.name}</strong>  
          <span className="ml-2">({item?.speed}Kph)</span>
        </div>
      );
    }
    return formatVehicleInfoContent(item);
  };

  return (
    <div className="flex-1 relative bg-accent min-h-screen overflow-hidden">
      {showModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-[400px] p-4 relative">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h2 className="text-lg font-semibold">Add Comment</h2>
              <button onClick={() => { setShowModal(false); formik?.resetForm() }}>
                <X className="w-5 h-5 text-gray-600 hover:text-black" />
              </button>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Comments
                </label>
                <Input name="comments" value={formik?.values?.comments} disabled={formik.values.selectedOption !== ""} onChange={formik.handleChange} placeholder="Enter your comment..." className="mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Choose option
                </label>
                <Select 
                  name="comments"
                  onValueChange={(val) => formik.setFieldValue("selectedOption", val)}
                  value={formik?.values?.selectedOption}
                  disabled={formik?.values?.comments?.trim() !== ""}
                >
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue placeholder="Choose your option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1 call ok">1 Call Ok</SelectItem>
                    <SelectItem value="2 call ok">2 Call Ok</SelectItem>
                    <SelectItem value="numbers busy">Numbers Busy</SelectItem>
                    <SelectItem value="numbers not responding">
                      Numbers Not Responding
                    </SelectItem>
                    <SelectItem value="Always Busy">Always Busy</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                    <SelectItem value="Wrong Alert">Wrong Alert</SelectItem>
                    <SelectItem value="Repeat Alert">Repeat Alert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" disabled={isButtonDisabled} className="w-full text-white px-4 py-2">
                {isAdding ? <Loader2 className="w-6 h-6 animate-spin" /> : "Add"}
              </Button>
            </form>
          </div>
        </div>
      )}

      {selectedItems?.length > 0 && address && showAddress && (
        <div className="absolute bottom-[56px] left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center justify-between bg-[#04003A] text-white px-4 py-2 rounded-md">
            {showAddress ? (
              <p className="text-sm truncate">{formatDate(address)}</p>
            ) : (
              <p className="text-sm italic text-gray-400">Address hidden</p>
            )}
            <button
              onClick={() => setShowAddress((prev) => !prev)}
              className="ml-3"
            >
              {showAddress ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      )}

      <div className="absolute top-4 left-4 z-10 flex gap-2">
        {topControls?.map((control) => {
          const IconComponent = control.icon;
          return (
            <Button
              key={control.id}
              variant="secondary"
              size="sm"
              className={cn(
                "gap-2 bg-map-control hover:bg-map-control-hover",
                activeControl === control.id && "bg-map-control-active text-white"
              )}
              onClick={() => handleControlClick(control.id)}
            >
              <IconComponent className="h-4 w-4" />
              {control.label}
            </Button>
          );
        })}
      </div>

      <div className="absolute top-4 right-4 z-10 flex flex-col gap-1">
        {mapTools?.map((tool) => (
          <Button
            key={tool.id}
            variant="secondary"
            size="sm"
            className={cn("w-8 h-8 p-0 bg-map-control hover:bg-map-control-hover bg-[#04003A]",
              activeControl === tool.id && "bg-map-control-active text-white"
            )}
            onClick={() => setActiveControl(activeControl === tool.id ? null : tool.id)}
          >
            <div className="w-4 h-4 mx-auto">
              <img
                src={tool.icon}
                alt={tool.id}
                className="w-full h-full object-contain"
              />
            </div>
          </Button>
        ))}
      </div>

      <div className="w-full h-screen">
        <GoogleMap
          mapTypeId="roadmap"
          mapContainerStyle={containerStyle}
          center={center}
          zoom={zoom}
          onLoad={(map: any) => (mapRef.current = map)}
          onClick={handleMapClick}
          options={{
            zoomControl: false,
            mapTypeControl: false,
            scaleControl: false,
            rotateControl: false,
            fullscreenControl: false,
            gestureHandling: 'greedy',
          }}
        >
          {selectedItems?.map((item, idx) => {
            if (item?.area?.startsWith("CIRCLE")) {
              const match = item.area.match(/CIRCLE\s*\(\s*([\d.-]+)\s+([\d.-]+)\s*,\s*([\d.-]+)\s*\)/);
              if (!match) return null;
              const lat = parseFloat(match[1]);
              const lng = parseFloat(match[2]);
              const radius = parseFloat(match[3]);

              return (
                <Circle
                  key={`circle-${item.id}-${idx}`}
                  center={{ lat, lng }}
                  radius={radius}
                  options={{
                    fillColor: "#4285F4",
                    fillOpacity: 0.15,
                    strokeColor: "#4285F4",
                    strokeOpacity: 0.6,
                    strokeWeight: 2,
                  }}
                />
              );
            }

            if (item?.area?.startsWith("POLYGON")) {
              const path = parseWKT(item.area);
              if (!path?.length) return null;

              return (
                <Polygon
                  key={`polygon-${item.id}-${idx}`}
                  paths={path}
                  options={{
                    fillColor: "#4285F4",
                    fillOpacity: 0.15,
                    strokeColor: "#4285F4",
                    strokeOpacity: 0.6,
                    strokeWeight: 2,
                  }}
                />
              );
            }

            const lat = parseFloat(item?.lat || item.latitude || "0");
            const lng = parseFloat(item?.longi || item.longitude || "0");
            const surroundingArea = createSurroundingArea(item);

            return (
              <React.Fragment key={`vehicle-${item.positionid || idx}`}>
                {/* <Circle
                  center={surroundingArea.center}
                  radius={surroundingArea.radius}
                  options={{
                    fillColor: item.ignition === "1" ? "#00FF00" : "#FFA500",
                    fillOpacity: 0.15,
                    strokeColor: item.ignition === "1" ? "#00AA00" : "#FF8C00",
                    strokeOpacity: 0.6,
                    strokeWeight: 2,
                    clickable: false,
                  }}
                /> */}
                <Marker
                  position={{ lat, lng }}
                  title={`${item.vehicle || "Vehicle"} - Speed: ${item.speed} km/h`}
                  icon={getCarIcon()}
                  animation={
                    item.ignition === "1"
                      ? google.maps.Animation.BOUNCE
                      : undefined
                  }
                />
                <InfoWindow
                  position={{ lat: lat + 0.0008, lng }}
                  options={{
                    disableAutoPan: false,
                    pixelOffset: new google.maps.Size(0, -10),
                    maxWidth: 350,
                  }}
                >
                  <div className="custom-info-window p-0">
                    {renderInfoContent(item, selectedItems.length > 1)}
                  </div>
                </InfoWindow>
              </React.Fragment>
            );
          })}
        </GoogleMap>

        {/* <GoogleMap mapTypeId="roadmap" mapContainerStyle={containerStyle} center={center} zoom={zoom} onLoad={(map: any) => (mapRef.current = map)} onClick={handleMapClick}
          options={{ zoomControl: false, mapTypeControl: false, scaleControl: false, rotateControl: false, fullscreenControl: false, gestureHandling: 'greedy' }}>
            {selectedItems?.map((zone, idx) => {
              if (zone?.area?.startsWith("CIRCLE")) {
                const match = zone.area.match(/CIRCLE\s*\(\s*([\d.-]+)\s+([\d.-]+)\s*,\s*([\d.-]+)\s*\)/);
                if (!match) return null;
                const lat = parseFloat(match[1]);
                const lng = parseFloat(match[2]);
                const radius = parseFloat(match[3]);
                console.log("Rendering circle:", { lat, lng, radius });
                return (
                  <Circle
                    key={`circle-${zone.id}-${idx}`}
                    center={{ lat, lng }}
                    radius={radius}
                    options={{
                      fillColor: "#4285F4",
                      fillOpacity: 0.15,
                      strokeColor: "#4285F4",
                      strokeOpacity: 0.6,
                      strokeWeight: 2,
                    }}
                  />
                );
              }

              const path = parseWKT(zone?.area);
              if (path?.length === 0) return null;
              return (
                <Polygon
                  key={`zone-${zone.id}-${idx}`}
                  paths={parseWKT(zone.area)}
                  options={{
                    fillColor: "#4285F4",
                    fillOpacity: 0.15,
                    strokeColor: "#4285F4",
                    strokeOpacity: 0.6,
                    strokeWeight: 2,
                  }}
                />
              );
            })}
            {selectedItems?.map((item, idx) => {
              const lat = parseFloat(item?.lat || item.latitude || "0");
              const lng = parseFloat(item?.longi || item.longitude || "0");
              const surroundingArea = createSurroundingArea(item);
              
              return (
                <React.Fragment key={`vehicle-${item.positionid || idx}`}>
                  <Circle center={surroundingArea.center} radius={surroundingArea.radius}
                    options={{
                      fillColor: item.ignition === "1" ? "#00FF00" : "#FFA500",
                      fillOpacity: 0.15,
                      strokeColor: item.ignition === "1" ? "#00AA00" : "#FF8C00",
                      strokeOpacity: 0.6,
                      strokeWeight: 2,
                      clickable: false,
                    }}
                  />
                  <Marker  position={{ lat, lng }}  title={`${item.vehicle || 'Vehicle'} - Speed: ${item.speed} km/h`}
                    icon={getCarIcon()} animation={item.ignition === "1" ? google.maps.Animation.BOUNCE : undefined}
                  />
                  <InfoWindow  position={{ lat: lat + 0.0008, lng }}
                    options={{  disableAutoPan: false,  pixelOffset: new google.maps.Size(0, -10), maxWidth: 350, }}>
                    <div className="custom-info-window p-0">
                      {renderInfoContent(item, selectedItems.length > 1)}
                    </div>
                  </InfoWindow>
                </React.Fragment>
              );
            })}
        </GoogleMap> */}
      </div>
    </div>
  );
};

export default MapView;