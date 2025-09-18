// import React, { useState, useMemo, useEffect, useRef } from "react";
// import { BarChart3, FileText, MapPin, Info, X } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";
// import { GoogleMap, LoadScript, Marker, Polygon, InfoWindow, Circle } from "@react-google-maps/api";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
// import { mapTools, topControls } from "@/data/map-view";

// interface MapViewProps {
//   cities: any[];
//   selectedItems: any[];
//   onNavigate?: (page: string) => void;
// }

// const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// const containerStyle = {
//   width: "100%",
//   height: "100%",
// };

// const parsePolygon = (wkt: string) => {
//   const coords = wkt.replace("POLYGON((", "").replace("))", "").split(",");
//   return coords.map((c) => {
//     const [lat, lng] = c.trim().split(" ").map(Number);
//     return { lat, lng };
//   });
// };

// const parseCircle = (wkt: string) => {
//   const match = wkt.match(/CIRCLE\(\(([^)]+)\)\)/);
//   if (match) {
//     const [lat, lng, radius] = match[1].split(" ").map(Number);
//     return { center: { lat, lng }, radius };
//   }
//   return null;
// };

// const getPolygonCenter = (path: { lat: number; lng: number }[]) => {
//   const bounds = new google.maps.LatLngBounds();
//   path.forEach(point => bounds.extend(point));
//   return bounds.getCenter().toJSON();
// };

// const getAreaType = (area: string) => {
//   if (area?.startsWith('POLYGON')) return 'polygon';
//   if (area?.startsWith('CIRCLE')) return 'circle';
//   return 'unknown';
// };

// const MapView = ({ cities, selectedItems, onNavigate }: MapViewProps) => {
//   const [activeControl, setActiveControl] = useState<string | null>(null);
//   const [center] = useState({ lat: 30.3384, lng: 71.2781 });
//   const [zoom, setZoom] = useState(16);
//   const mapRef = useRef<google.maps.Map | null>(null);
//   const [selectedArea, setSelectedArea] = useState<any | null>(null);
//   const [showDetailsPanel, setShowDetailsPanel] = useState(false);

//   useEffect(() => {
//     if (selectedItems.length > 0 && mapRef.current) {
//       const lat = parseFloat(selectedItems[0].lat || "0");
//       const lng = parseFloat(selectedItems[0].longi || "0");
//       const newCenter = { lat, lng };
//       mapRef.current.panTo(newCenter);
//       mapRef.current.setZoom(16);
//     }
//   }, [selectedItems]);

//   const handleControlClick = (controlId: string) => {
//     if (controlId === "dashboard") {
//       onNavigate?.("dashboard");
//     } else {
//       setActiveControl(activeControl === controlId ? null : controlId);
//     }
//   };

//   const handleAreaSelect = (area: any) => {
//     setSelectedArea(area);
//     setShowDetailsPanel(true);
//   };

//   const handleMapClick = () => {
//     setShowDetailsPanel(false);
//     setSelectedArea(null);
//   };

//   const getRelevantAreas = () => {
//     if (!selectedItems.length) return cities || [];
    
//     return cities?.filter(city => {
//       return selectedItems.some(item => {
//         const itemLat = parseFloat(item.lat || "0");
//         const itemLng = parseFloat(item.longi || "0");
        
//         const areaType = getAreaType(city.area);
        
//         if (areaType === 'polygon') {
//           const cityPath = parsePolygon(city.area);
//           const cityCenter = getPolygonCenter(cityPath);
//           const distance = Math.sqrt(
//             Math.pow(itemLat - cityCenter.lat, 2) + 
//             Math.pow(itemLng - cityCenter.lng, 2)
//           );
//           return distance < 0.01;
//         } else if (areaType === 'circle') {
//           const circleData = parseCircle(city.area);
//           if (circleData) {
//             const distance = Math.sqrt(
//               Math.pow(itemLat - circleData.center.lat, 2) + 
//               Math.pow(itemLng - circleData.center.lng, 2)
//             );
//             return distance < 0.01;
//           }
//         }
        
//         return false;
//       });
//     }) || cities || [];
//   };

//   const relevantAreas = getRelevantAreas();

//   return (
//     <div className="flex-1 relative bg-accent min-h-screen overflow-hidden">
//       <div className="absolute top-4 left-4 z-10 flex gap-2">
//         {topControls?.map((control) => {
//           const IconComponent = control.icon;
//           return (
//             <Button
//               key={control.id}
//               variant="secondary"
//               size="sm"
//               className={cn(
//                 "gap-2 bg-map-control hover:bg-map-control-hover",
//                 activeControl === control.id && "bg-map-control-active text-white"
//               )}
//               onClick={() => handleControlClick(control.id)}
//             >
//               <IconComponent className="h-4 w-4" />
//               {control.label}
//             </Button>
//           );
//         })}
//       </div>

//       <div className="absolute top-4 right-4 z-10 flex flex-col gap-1">
//         {mapTools?.map((tool) => (
//           <Button
//             key={tool.id}
//             variant="secondary"
//             size="sm"
//             className={cn(
//               "w-10 h-10 p-0 bg-map-control hover:bg-map-control-hover bg-[#04003A]",
//               activeControl === tool.id && "bg-map-control-active text-white"
//             )}
//             onClick={() => setActiveControl(activeControl === tool.id ? null : tool.id)}
//           >
//             <div className="w-6 h-6 mx-auto">
//               <img
//                 src={tool.icon}
//                 alt={tool.id}
//                 className="w-full h-full object-contain"
//               />
//             </div>
//           </Button>
//         ))}
//       </div>

//       {selectedArea && (
//         <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
//           <div className="flex justify-between items-start mb-4">
//             <h3 className="text-lg font-semibold text-gray-900">
//               {selectedArea.name || "Area Details"}
//             </h3>
//             <Button
//               variant="ghost"
//               size="sm"
//               className="h-6 w-6 p-0 hover:bg-gray-100"
//               onClick={() => setShowDetailsPanel(false)}
//             >
//               ×
//             </Button>
//           </div>
          
//           <div className="space-y-4">
//             <div>
//               <h4 className="font-semibold text-sm text-gray-600 uppercase tracking-wide mb-1">
//                 Description
//               </h4>
//               <p className="text-gray-900 text-sm">
//                 {selectedArea.description || "No description available"}
//               </p>
//             </div>
            
//             <div>
//               <h4 className="font-semibold text-sm text-gray-600 uppercase tracking-wide mb-1">
//                 Area Type
//               </h4>
//               <p className="text-gray-900 text-sm capitalize">
//                 {getAreaType(selectedArea.area)}
//               </p>
//             </div>
            
//             {selectedArea.lat && selectedArea.longi && (
//               <div>
//                 <h4 className="font-semibold text-sm text-gray-600 uppercase tracking-wide mb-1">
//                   Coordinates
//                 </h4>
//                 <p className="text-gray-900 text-sm">
//                   Lat: {selectedArea.lat}, Lng: {selectedArea.longi}
//                 </p>
//               </div>
//             )}
            
//             {selectedArea.radius && (
//               <div>
//                 <h4 className="font-semibold text-sm text-gray-600 uppercase tracking-wide mb-1">
//                   Radius
//                 </h4>
//                 <p className="text-gray-900 text-sm">
//                   {selectedArea.radius} meters
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       <div className="w-full h-screen">
//         <LoadScript googleMapsApiKey={API_KEY}>
//           <GoogleMap
//             mapTypeId="satellite"
//             mapContainerStyle={containerStyle}
//             center={center}
//             zoom={zoom}
//             onLoad={(map: any) => (mapRef.current = map)}
//             onClick={handleMapClick}
//           >
//             {relevantAreas.map((area, idx) => {
//               const areaType = getAreaType(area.area);
              
//               if (areaType === 'polygon') {
//                 const path = parsePolygon(area.area);
//                 return (
//                   <Polygon
//                     key={`polygon-${idx}`}
//                     paths={path}
//                     options={{
//                       fillColor: selectedArea === area ? "#00FF00" : "#FF0000",
//                       fillOpacity: selectedArea === area ? 0.4 : 0.3,
//                       strokeColor: selectedArea === area ? "#00FF00" : "#FF0000",
//                       strokeOpacity: 0.8,
//                       strokeWeight: selectedArea === area ? 3 : 2,
//                       clickable: true,
//                     }}
//                     onClick={() => handleAreaSelect(area)}
//                   />
//                 );
//               } else if (areaType === 'circle') {
//                 const circleData = parseCircle(area.area);
//                 if (circleData) {
//                   return (
//                     <Circle
//                       key={`circle-${idx}`}
//                       center={circleData.center}
//                       radius={circleData.radius}
//                       options={{
//                         fillColor: selectedArea === area ? "#00FF00" : "#0066FF",
//                         fillOpacity: selectedArea === area ? 0.4 : 0.2,
//                         strokeColor: selectedArea === area ? "#00FF00" : "#0066FF",
//                         strokeOpacity: 0.8,
//                         strokeWeight: selectedArea === area ? 3 : 2,
//                         clickable: true,
//                       }}
//                       onClick={() => handleAreaSelect(area)}
//                     />
//                   );
//                 }
//               }
              
//               return null;
//             })}

//             {selectedItems.map((item, idx) => {
//               const lat = parseFloat(item.lat || "0");
//               const lng = parseFloat(item.longi || "0");
              
//               return (
//                 <React.Fragment key={`item-${idx}`}>
//                   <Marker
//                     position={{ lat, lng }}
//                     title={item?.name || "Location"}
//                     onClick={() => handleAreaSelect(item)}
//                   />
                  
//                   {item.radius && (
//                     <Circle
//                       center={{ lat, lng }}
//                       radius={parseFloat(item.radius) || 1000}
//                       options={{
//                         fillColor: selectedArea === item ? "#FFFF00" : "#0066FF",
//                         fillOpacity: selectedArea === item ? 0.3 : 0.2,
//                         strokeColor: selectedArea === item ? "#FFFF00" : "#0066FF",
//                         strokeOpacity: 0.8,
//                         strokeWeight: selectedArea === item ? 3 : 2,
//                         clickable: true,
//                       }}
//                       onClick={() => handleAreaSelect(item)}
//                     />
//                   )}
//                 </React.Fragment>
//               );
//             })}
//           </GoogleMap>
//         </LoadScript>
//       </div>
//     </div>
//   );
// };

// export default MapView;


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
}

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const containerStyle = {
  width: "100%",
  height: "100%",
};

const parsePolygon = (wkt: string) => {
  const coords = wkt.replace("POLYGON((", "").replace("))", "").split(",");
  return coords.map((c) => {
    const [lat, lng] = c.trim().split(" ").map(Number);
    return { lat, lng };
  });
};

const parseCircle = (wkt: string) => {
  const match = wkt.match(/CIRCLE\(\(([^)]+)\)\)/);
  if (match) {
    const [lat, lng, radius] = match[1].split(" ").map(Number);
    return { center: { lat, lng }, radius };
  }
  return null;
};

const getPolygonCenter = (path: { lat: number; lng: number }[]) => {
  const bounds = new google.maps.LatLngBounds();
  path.forEach(point => bounds.extend(point));
  return bounds.getCenter().toJSON();
};

const getAreaType = (area: string) => {
  if (area?.startsWith('POLYGON')) return 'polygon';
  if (area?.startsWith('CIRCLE')) return 'circle';
  return 'unknown';
};

const MapView = ({ cities, moreItem, selectedItems, onNavigate }: MapViewProps) => {
  const [activeControl, setActiveControl] = useState<string | null>(null);
  const [center] = useState({ lat: 30.3384, lng: 71.2781 });
  const [zoom, setZoom] = useState(15);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [selectedArea, setSelectedArea] = useState<any | null>(null);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const session = AuthController.getSession();
  const { isAdding, handlePostMessage } = useGeoFence();

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

  const handleAreaSelect = (area: any) => {
    setSelectedArea(area);
    setShowDetailsPanel(true);
  };

  const handleMapClick = () => {
    setShowDetailsPanel(false);
    setSelectedArea(null);
  };

  const getRelevantAreas = () => {
    if (!selectedItems.length) return cities || [];
    
    return cities?.filter(city => {
      return selectedItems.some(item => {
        const itemLat = parseFloat(item.lat || "0");
        const itemLng = parseFloat(item.longi || "0");
        
        const areaType = getAreaType(city.area);
        
        if (areaType === 'polygon') {
          const cityPath = parsePolygon(city.area);
          const cityCenter = getPolygonCenter(cityPath);
          const distance = Math.sqrt(
            Math.pow(itemLat - cityCenter.lat, 2) + 
            Math.pow(itemLng - cityCenter.lng, 2)
          );
          return distance < 0.01;
        } else if (areaType === 'circle') {
          const circleData = parseCircle(city.area);
          if (circleData) {
            const distance = Math.sqrt(
              Math.pow(itemLat - circleData.center.lat, 2) + 
              Math.pow(itemLng - circleData.center.lng, 2)
            );
            return distance < 0.01;
          }
        }
        
        return false;
      });
    }) || cities || [];
  };

  const relevantAreas = getRelevantAreas();

  const formatInfoWindowContent = (item: any) => {
    const formatDate = (dateString: string) => {
      if (!dateString) return "";
      try {
        return new Date(dateString).toLocaleString();
      } catch {
        return dateString;
      }
    };

    return (
      <div className="p-2 min-w-[200px] max-w-[300px]">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Object:</span>
            <span className="text-gray-900">{item.object || item.name || 'N/A'}</span>
          </div>
          
          {item.event && (
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Event:</span>
              <span className="text-gray-900">{item.event}</span>
            </div>
          )}
          
          {item.address && (
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Address:</span>
              <span className="text-gray-900 text-right ml-2">{item.address}</span>
            </div>
          )}
          
          {item.altitude && (
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Altitude:</span>
              <span className="text-gray-900">{item.altitude} m</span>
            </div>
          )}
          
          {item.angle && (
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Angle:</span>
              <span className="text-gray-900">{item.angle}°</span>
            </div>
          )}
          
          {item.speed && (
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Speed:</span>
              <span className="text-gray-900">{item.speed} km/h</span>
            </div>
          )}
          
          {item.time && (
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Time:</span>
              <span className="text-gray-900 text-right ml-2">{formatDate(item.time)}</span>
            </div>
          )}
          
          {item.timestamp && (
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Timestamp:</span>
              <span className="text-gray-900 text-right ml-2">{formatDate(item.timestamp)}</span>
            </div>
          )}
        </div>
      </div>
    );
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
          >
            {relevantAreas.map((area, idx) => {
              const areaType = getAreaType(area.area);
              
              if (areaType === 'polygon') {
                const path = parsePolygon(area.area);
                return (
                  <Polygon
                    key={`polygon-${idx}`}
                    paths={path}
                    options={{
                      fillColor: selectedArea === area ? "#00FF00" : "#FF0000",
                      fillOpacity: selectedArea === area ? 0.4 : 0.3,
                      strokeColor: selectedArea === area ? "#00FF00" : "#FF0000",
                      strokeOpacity: 0.8,
                      strokeWeight: selectedArea === area ? 3 : 2,
                      clickable: true,
                    }}
                    onClick={() => handleAreaSelect(area)}
                  />
                );
              } else if (areaType === 'circle') {
                const circleData = parseCircle(area.area);
                if (circleData) {
                  return (
                    <Circle
                      key={`circle-${idx}`}
                      center={circleData.center}
                      radius={circleData.radius}
                      options={{
                        fillColor: selectedArea === area ? "#00FF00" : "#0066FF",
                        fillOpacity: selectedArea === area ? 0.4 : 0.2,
                        strokeColor: selectedArea === area ? "#00FF00" : "#0066FF",
                        strokeOpacity: 0.8,
                        strokeWeight: selectedArea === area ? 3 : 2,
                        clickable: true,
                      }}
                      onClick={() => handleAreaSelect(area)}
                    />
                  );
                }
              }
              return null;
            })}

            {selectedItems.map((item, idx) => {
              const lat = parseFloat(item.lat || "0");
              const lng = parseFloat(item.longi || "0");
              
              return (
                <React.Fragment key={`item-${idx}`}>
                  <Marker position={{ lat, lng }} title={item?.name || "Location"} />
                  <InfoWindow position={{ lat, lng }}  options={{ disableAutoPan: false, pixelOffset: new google.maps.Size(0, -40) }}>
                    <div>
                      {formatInfoWindowContent(item)}
                    </div>
                  </InfoWindow>
                  
                  {item.radius && (
                    <Circle
                      center={{ lat, lng }}
                      radius={parseFloat(item.radius) || 1000}
                      options={{
                        fillColor: selectedArea === item ? "#FFFF00" : "#0066FF",
                        fillOpacity: selectedArea === item ? 0.3 : 0.2,
                        strokeColor: selectedArea === item ? "#FFFF00" : "#0066FF",
                        strokeOpacity: 0.8,
                        strokeWeight: selectedArea === item ? 3 : 2,
                        clickable: true,
                      }}
                      onClick={() => handleAreaSelect(item)}
                    />
                  )}
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