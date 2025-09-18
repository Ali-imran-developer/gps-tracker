import React, { useState, useMemo, useEffect, useRef } from "react";
import { BarChart3, FileText, MapPin, Info, X, Loader2 } from "lucide-react";
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

interface MapViewProps {
  cities: any[];
  moreItem: any;
  selectedItems: any[];
  onNavigate?: (page: string) => void;
  onProcessUpdate: any;
}

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const containerStyle = {
  width: "100%",
  height: "100%",
};

const MapView = ({ cities, moreItem, selectedItems, onNavigate, onProcessUpdate }: MapViewProps) => {
  const [activeControl, setActiveControl] = useState<string | null>(null);
  const [center] = useState({ lat: 30.3384, lng: 71.2781 });
  const [zoom, setZoom] = useState(15);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [selectedArea, setSelectedArea] = useState<any | null>(null);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const session = AuthController.getSession();
  const { isAdding, handlePostMessage } = useGeoFence();

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

  useEffect(() => {
    if (selectedItems.length > 0 && mapRef.current) {
      const lat = parseFloat(selectedItems[0].lat || "0");
      const lng = parseFloat(selectedItems[0].longi || "0");
      const newCenter = { lat, lng };
      mapRef.current.panTo(newCenter);
      mapRef.current.setZoom(15);
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

    return (
      <div className="p-3 min-w-[250px] max-w-[350px] bg-white rounded-lg shadow-lg">
        <div className="space-y-2 text-sm">
          <div className="border-b pb-2 mb-2">
            <h3 className="font-bold text-lg text-blue-900">{item.vehicle || 'Vehicle'}</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-medium text-gray-600">IMEI:</span>
              <div className="text-gray-900 text-xs">{item.imei}</div>
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
            
            <div>
              <span className="font-medium text-gray-600">Device ID:</span>
              <div className="text-gray-900">{item.deviceid}</div>
            </div>
          </div>

          <div>
            <span className="font-medium text-gray-600">Position:</span>
            <div className="text-gray-900 text-xs">
              Lat: {item.lat}, Lng: {item.longi}
            </div>
            <div className="text-xs text-gray-500">Position ID: {item.positionid}</div>
          </div>

          {item.contact && (
            <div>
              <span className="font-medium text-gray-600">Contact:</span>
              <div className="text-gray-900 text-xs">{item.contact}</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const createSurroundingArea = (item: any) => {
    const lat = parseFloat(item.lat || "0");
    const lng = parseFloat(item.longi || "0");
    const speed = parseFloat(item.speed || "0");
    const baseRadius = 500;
    const speedMultiplier = Math.max(1, speed / 50);
    const radius = baseRadius * speedMultiplier;
    return {
      center: { lat, lng },
      radius: radius
    };
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
            className={cn(
              "w-10 h-10 p-0 bg-map-control hover:bg-map-control-hover bg-[#04003A]",
              activeControl === tool.id && "bg-map-control-active text-white"
            )}
            onClick={() => setActiveControl(activeControl === tool.id ? null : tool.id)}
          >
            <div className="w-6 h-6 mx-auto">
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
        <LoadScript googleMapsApiKey={API_KEY}>
          <GoogleMap
            mapTypeId="satellite"
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
              gestureHandling: 'greedy'
            }}
          >
            {selectedItems.map((item, idx) => {
              const lat = parseFloat(item.lat || "0");
              const lng = parseFloat(item.longi || "0");
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
                    <div>
                      {formatVehicleInfoContent(item)}
                    </div>
                  </InfoWindow>
                </React.Fragment>
              );
            })}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default MapView;