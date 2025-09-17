import { useEffect, useRef, useState } from "react";
import {
  MoreVertical,
  ChevronDown,
  ChevronRight,
  Car,
  Truck,
  Bike,
  User,
  Key,
  LockKeyhole,
} from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useGeoFence } from "@/hooks/geoFecnce-hook";
import { useDispatch, useSelector } from "react-redux";
import AuthController from "@/controllers/authController";
import formatDate from "@/utils/format-date";
import { useWebSocket } from "@/hooks/useWebSocket";

const ObjectsTable = () => {
  const { isLoading, handleCheckalldevices, handleGetTrackLocations, handleGetCookie } = useGeoFence();
  const { geoFenceData, trackLocations } = useSelector( (state: any) => state.GeoFence );
  const [isGroupExpanded, setIsGroupExpanded] = useState(true);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const session = AuthController.getSession();
  const [messages, setMessages] = useState<string[]>([]);
  const webSocketUrl = import.meta.env.VITE_WEBSOCKET_URL;

  useEffect(() => {
    const ws = new WebSocket(webSocketUrl);

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
      ws.send(JSON.stringify({ type: "auth/check" }));
    };

    ws.onmessage = (event) => {
      console.log("📩 Received:", event.data);
      setMessages((prev) => [event.data, ...prev]);
    };

    ws.onclose = (event) => {
      console.log("❌ WebSocket closed:", event);
    };

    ws.onerror = (err) => {
      console.error("⚠️ WebSocket error:", err);
    };

    return () => {
      ws.close();
    };
  }, []);

  console.log("messages", messages);

  const toggleExpand = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const mergedData = geoFenceData?.map((device: any) => {
    const track = trackLocations?.find((t: any) => t?.deviceId === device?.id);
    return {
      ...device,
      ...track,
    };
  });

  const icons = {
    car: Car,
    truck: Truck,
    motorcycle: Bike,
    person: User,
  };

  useEffect(() => {
    const queryParams = {
      username: session?.credentials?.user ?? "",
      password: session?.credentials?.pass ?? "",
    };

    handleGetCookie(queryParams);
    handleCheckalldevices(queryParams);
    handleGetTrackLocations(queryParams);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto border border-gray-300 rounded-md shadow-sm bg-white font-sans">
      <div className="px-0 py-2 border-b border-gray-200 bg-[#D9D9D9] grid grid-cols-10 items-center text-center">
        <button className="col-span-1 border-r border-gray-400 flex items-center justify-center h-full hover:bg-gray-200">
          <img
            src="/assets/icons/eye.png"
            alt="eye Icon"
            className="w-5 h-5 object-contain"
          />
        </button>

        <button className="col-span-1 border-r border-gray-400 flex items-center justify-center h-full hover:bg-gray-200">
          <img
            src="/assets/icons/plus-user.png"
            alt="plus-user Icon"
            className="w-4 h-4 object-cover"
          />
        </button>

        <div className="col-span-8 flex items-center justify-start px-2 h-full">
          <span className="text-sm font-medium text-gray-800 ps-4">
            Objects
          </span>
        </div>
      </div>

      <div className="px-2 py-2 border-b border-gray-200 bg-[#F5F5F5] flex justify-between items-center">
        <div className="w-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Input
              type="checkbox"
              checked={false}
              // onChange={toggleAllVisibility}
              className="w-4 h-4 accent-blue-600"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setIsGroupExpanded(!isGroupExpanded)}
            className="flex items-center gap-1 text-sm text-gray-700 bg-transparent border-none"
          >
            {isGroupExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            <span>Regrouped({mergedData.length})</span>
          </Button>
        </div>
      </div>

      {isGroupExpanded && (
        <div className="max-h-[calc(100vh-280px)] overflow-y-auto overflow-x-hidden">
          <div className="flex flex-col divide-y">
            {mergedData?.map((item: any) => {
              const Icon = icons[item?.category];
              const isExpanded = expandedRow === item.id;

              return (
                <div key={item?.id} className="flex flex-col">
                  <div
                    className={`flex items-center justify-between py-1
          ps-2 hover:bg-gray-50 cursor-pointer  ${
            item?.disabled === "True" ? "bg-gray-300 hover:bg-gray-300" : ""
          }`}
                    onClick={() => toggleExpand(item.id)}
                  >
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={false}
                      // onChange={toggleAllVisibility}
                      className="w-4 h-4 accent-blue-600 mr-2"
                    />

                    {/* Icon + Info */}
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {Icon && (
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            item?.status === "offline"
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        />
                      )}
                      <div className="truncate">
                        <div className="text-[10px] font-medium text-gray-900 truncate">
                          {item?.name ?? ""}
                        </div>
                        <div className="text-[10px] text-gray-500 truncate">
                          {formatDate(item?.lastUpdate) ?? ""}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-0 min-w-0">
                      <span className="text-[10px] text-gray-500 w-16 text-right shrink-0">
                        {item?.speed?.toFixed(1) ?? 0} kmh
                      </span>
                      <Key
                        className={`w-3 h-3 ms-5 shrink-0 ${
                          item?.attribute?.ignition === true
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      />
                    </div>

                    <LockKeyhole
                      className={`w-3 h-3 ms-2 text-gray-600 shrink-0 ${
                        item?.attribute?.out1 === true
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    />
                    <MoreVertical className="w-4 h-4 text-gray-600 shrink-0" />
                  </div>

                  {isExpanded && (
                    <div className="bg-[#F5F5F5] px-2 py-1 grid grid-cols-2 gap-2 text-xs text-gray-800 max-h-28 overflow-y-auto">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className="font-semibold">Battery</span>
                        </div>
                        <span>{item?.attribute?.batteryLevel}%</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Ignition</span>
                        <span>{item?.attribute?.ignition ? "On" : "Off"}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Satellites</span>
                        <span>{item?.attribute?.sat}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Power</span>
                        <span>{item?.attribute?.power}</span>
                      </div>

                      {item?.attribute?.batteryLevel && (
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Battery Level</span>
                          <span>{item?.attribute?.batteryLevel}%</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Charge</span>
                        <span>
                          {item?.attribute?.charge ? "true" : "false"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Protocol</span>
                        <span>{item?.protocol}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Distance</span>
                        <span>{item?.attribute?.distance} Km</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Speed</span>
                        <span>{item?.speed?.toFixed(1) ?? 0}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Altitude</span>
                        <span>{item?.altitude} m</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Expiry Date</span>
                        <span>{item?.expiryDT}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-semibold">TotalDistance</span>
                        <span>
                          {(item?.attribute?.totalDistance / 1000).toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-semibold">latitude</span>
                        <span>{(item?.latitude).toFixed(4)}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-semibold">longitude</span>
                        <span>{(item?.longitude).toFixed(4)}</span>
                      </div>

                      {item?.attribute?.distance && (
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">distance</span>
                          <span>{(item?.attribute?.distance).toFixed(2)}</span>
                        </div>
                      )}

                      {item?.attribute?.adc1 && (
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">ACD</span>
                          <span>{item?.attribute?.adc1}</span>
                        </div>
                      )}

                      {item?.attribute?.di1 && (
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Di1</span>
                          <span>{item?.attribute?.di1}</span>
                        </div>
                      )}

                      {item?.valid && (
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Valid</span>
                          <span>{item?.valid ? "true" : "false"}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Server Time</span>
                        <span>{formatDate(item?.serverTime)}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Device Time</span>
                        <span>{formatDate(item?.deviceTime)}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        // <div className="max-h-[calc(100vh-320px)] overflow-y-auto overflow-x-hidden">
        //   <Table>
        //     <TableBody>
        //       {mergedData?.map((item: any) => {
        //         const Icon = icons[item?.category];
        //         return (
        //           <>
        //             <TableRow
        //               key={item?.id}
        //               className="hover:bg-gray-50 cursor-pointer"
        //               onClick={() => toggleExpand(item.id)}
        //             >
        //               <TableCell className="w-6 text-center ps-2 pe-0 py-0">
        //                 <Input
        //                   type="checkbox"
        //                   checked={false}
        //                   onChange={toggleAllVisibility}
        //                   className="w-4 h-4 accent-blue-600"
        //                 />
        //               </TableCell>
        //               <TableCell className="flex items-center gap-2 w-40 py-0">
        //                 {Icon && <Icon className="w-4 h-4" />}
        //                 <div>
        //                   <div className="text-[10px] font-medium text-gray-900">
        //                     {item?.name ?? ""}
        //                   </div>
        //                   <div className="text-[10px] text-gray-500">
        //                     {formatDate(item?.lastUpdate) ?? ""}
        //                   </div>
        //                 </div>
        //               </TableCell>
        //               <TableCell className="text-right text-xs text-gray-500 w-20">
        //                 {item?.speed?.toFixed(1) ?? 0} kph
        //               </TableCell>
        //               <TableCell className="w-8 text-right">
        //                 <MoreVertical className="w-4 h-4 text-gray-600" />
        //               </TableCell>
        //             </TableRow>

        //             {expandedRow === item.id && (
        //               <TableRow className="bg-[#F5F5F5]">
        //                 <TableCell colSpan={4} className="px-1">
        //                   <div className="grid grid-cols-2 gap-2 text-sm text-gray-800 space-y-2">
        //                     {/*  */}
        //                     <div className="flex items-center justify-between">
        //                       <div className="flex items-center gap-1">
        //                         <BatteryCharging className="w-5 h-5 text-green-600" />
        //                         <span className="text-xs font-semibold">
        //                           Battery Level
        //                         </span>
        //                       </div>
        //                       <span className="text-xs font-semibold">
        //                         {item?.attribute?.batteryLevel}%
        //                       </span>
        //                     </div>
        //                     {/*  */}
        //                     <div className="flex items-center justify-between">
        //                       <div className="flex items-center gap-1">
        //                         <span className="text-xs font-semibold">#</span>
        //                         <span className="text-xs font-semibold">
        //                           Motion
        //                         </span>
        //                       </div>
        //                       <span className="text-xs font-semibold">
        //                         {item?.attribute?.motion ? "true" : "false"}
        //                       </span>
        //                     </div>
        //                     {/*  */}
        //                     <div className="flex items-center justify-between">
        //                       <div className="flex items-center gap-1">
        //                         <Power className="w-4 h-4 text-green-600" />
        //                         <span className="text-xs font-semibold">
        //                           Ignition
        //                         </span>
        //                       </div>
        //                       <span className="text-xs font-semibold">
        //                         {item?.attribute?.ignition ? "On" : "Off"}
        //                       </span>
        //                     </div>
        //                     {/*  */}
        //                     <div className="flex items-center justify-between">
        //                       <div className="flex items-center gap-1">
        //                         <SatelliteDish className="w-4 h-4 text-green-600" />
        //                         <span className="text-xs font-semibold">
        //                           Satellites
        //                         </span>
        //                       </div>
        //                       <span className="text-xs font-semibold">
        //                         {item.attribute.sat}
        //                       </span>
        //                     </div>
        //                     {/*  */}
        //                     <div className="flex items-center justify-between">
        //                       <div className="flex items-center gap-1">
        //                         <span className="text-xs font-semibold">#</span>
        //                         <span className="text-xs font-semibold">
        //                           Charge
        //                         </span>
        //                       </div>
        //                       <span className="text-xs font-semibold">
        //                         {item.attribute.charge ? "true" : "false"}
        //                       </span>
        //                     </div>
        //                     {/*  */}
        //                     <div className="flex items-center justify-between">
        //                       <div className="flex items-center gap-1">
        //                         <span className="text-xs font-semibold">#</span>
        //                         <span className="text-xs font-semibold">
        //                           Distance
        //                         </span>
        //                       </div>
        //                       <span className="text-xs font-semibold">
        //                         {item.attribute.distance} Km
        //                       </span>
        //                     </div>
        //                     {/*  */}
        //                     <div className="flex items-center justify-between">
        //                       <div className="flex items-center gap-1">
        //                         <ParkingMeter className="w-4 h-4 text-green-600" />
        //                         <span className="text-xs font-semibold">
        //                           Speed
        //                         </span>
        //                       </div>
        //                       <span className="text-xs font-semibold">
        //                         {item.speed?.toFixed(1) ?? 0}
        //                       </span>
        //                     </div>
        //                     {/*  */}
        //                     <div className="flex items-center justify-between">
        //                       <div className="flex items-center gap-1">
        //                         <span className="text-xs font-semibold">⛰️</span>
        //                         <span className="text-xs font-semibold">
        //                           Altitude
        //                         </span>
        //                       </div>
        //                       <span className="text-xs font-semibold">
        //                         {item.altitude} m
        //                       </span>
        //                     </div>
        //                   </div>
        //                 </TableCell>
        //               </TableRow>
        //             )}
        //           </>
        //         )
        //       })}
        //     </TableBody>
        //   </Table>
        //   {/* </div> */}
        // </div>
      )}
    </div>
  );
};

export default ObjectsTable;
