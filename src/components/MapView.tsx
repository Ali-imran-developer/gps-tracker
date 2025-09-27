import React, { useState, useMemo, useEffect, useRef } from "react";
import { BarChart3, FileText, MapPin, Info, X, Loader2, EyeOff, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GoogleMap, LoadScript, Marker, Polygon, InfoWindow, Circle, OverlayView } from "@react-google-maps/api";
import { mapTools, topControls } from "@/data/map-view";
import { useGeoFence } from "@/hooks/geoFecnce-hook";
import { useSelector } from "react-redux";
import { animateMarker, createSurroundingArea, formatDate, getCarIcon, parseWKT, renderInfoContent } from "@/helper-functions/use-mapview";

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

const MapView = ({ cities, moreItem, selectedItems, onNavigate, onProcessUpdate }: MapViewProps) => {
  const [activeControl, setActiveControl] = useState<string | null>(null);
  const [center] = useState({ lat: 30.3384, lng: 71.2781 });
  const [zoom, setZoom] = useState(15);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const [selectedArea, setSelectedArea] = useState<any | null>(null);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const { handleGetAddress } = useGeoFence();
  const { address } = useSelector((state: any) => state.GeoFence);
  const [showAddress, setShowAddress] = useState(true);
  const [activeMarkers, setActiveMarkers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!mapRef.current) return;
    selectedItems.forEach((item, idx) => {
      const markerId = (item?.positionid || idx).toString();
      const lat = parseFloat(item?.lat || item.latitude || "0");
      const lng = parseFloat(item?.longi || item.longitude || "0");
      if (!isFinite(lat) || !isFinite(lng)) return;
      const newPos = { lat, lng };
      if (markersRef.current.has(markerId)) {
        animateMarker(markersRef.current.get(markerId)!, newPos);
      } else {        
        const marker = new google.maps.Marker({
          position: newPos,
          map: mapRef.current,
          icon: getCarIcon(),
          title: `${item.vehicle || "Vehicle"} - Speed: ${item.speed} km/h`,
        });
        marker.addListener("click", () => {
          setActiveMarkers((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(markerId)) {
              newSet.delete(markerId);
            } else {
              newSet.add(markerId);
            }
            return newSet;
          });
        });
        markersRef.current.set(markerId, marker);
      }
    });
    markersRef.current.forEach((marker, id) => {
      if (!selectedItems.find((item, idx) => (item?.positionid || idx).toString() === id)) {
        marker.setMap(null);
        markersRef.current.delete(id);
      }
    });
  }, [selectedItems]);

  useEffect(() => {
    if (selectedItems.length > 0 && mapRef.current) {
      selectedItems.forEach((item) => {
        if (item.area?.startsWith("CIRCLE")) {
          const match = item.area.match(/CIRCLE\s*\(\s*([\d.-]+)\s+([\d.-]+)\s*,\s*([\d.-]+)\s*\)/);
          if (match) {
            const lat = parseFloat(match[1]);
            const lng = parseFloat(match[2]);
            const radius = parseFloat(match[3]);
            mapRef.current.panTo({ lat, lng });
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
    if (selectedItems?.length === 1 && mapRef?.current) {
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

  useEffect(() => {
    if (selectedItems?.length > 0) {
      const ids = new Set(
        selectedItems.map((item, idx) => (item?.positionid || idx).toString())
      );
      setActiveMarkers(ids);
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

  return (
    <div className="flex-1 relative bg-accent min-h-screen overflow-hidden">
      {selectedItems?.length === 1 && address && showAddress && (
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
            const markerId = (item?.positionid || idx)?.toString();

            return (
              <React.Fragment key={`vehicle-${item.positionid || idx}`}>
                {/* <Marker
                  position={{ lat, lng }}
                  title={`${item.vehicle || "Vehicle"} - Speed: ${item.speed} km/h`}
                  icon={getCarIcon()}
                  onClick={() => {
                    setActiveMarkers((prev) => {
                      const newSet = new Set(prev);
                      if (newSet.has(markerId)) {
                        newSet.delete(markerId);
                      } else {
                        newSet.add(markerId);
                      }
                      return newSet;
                    });
                  }}
                /> */}
                {activeMarkers?.has(markerId) && (
                <InfoWindow
                  position={{ lat: lat + 0.0008, lng }}
                  options={{
                    disableAutoPan: false,
                    pixelOffset: new google.maps.Size(0, -10),
                    maxWidth: 250,
                  }}
                >
                  <div className="custom-info-window p-0">
                    {renderInfoContent(item, selectedItems.length > 1)}
                  </div>
                </InfoWindow>
                )}
              </React.Fragment>
            );
          })}
        </GoogleMap>
      </div>
    </div>
  );
};

export default MapView;