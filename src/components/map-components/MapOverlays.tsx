import { ensureArray } from "@/helper-functions/use-formater";
import { parseWKT, renderInfoContent } from "@/helper-functions/use-mapview";
import { Circle, InfoWindow, Polygon, Polyline } from "@react-google-maps/api";
import React from "react";

interface MapOverlaysProps {
  selectedItems: any[];
  activeMarkers: Set<string>;
  historyData: any[];
  polylinePaths: Map<string, google.maps.LatLngLiteral[]>;
}

export const MapOverlays: React.FC<MapOverlaysProps> = ({ selectedItems, activeMarkers, historyData, polylinePaths }) => {
  return (
    <>
      {selectedItems?.map((item, idx) => {
        if (item?.area?.startsWith("CIRCLE")) {
          const match = item.area.match(
            /CIRCLE\s*\(\s*([\d.-]+)\s+([\d.-]+)\s*,\s*([\d.-]+)\s*\)/
          );
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

      {/* History polyline */}
      {historyData && historyData.length > 0 && (
        <Polyline
          path={ensureArray(historyData)?.map((point: any) => ({
            lat: parseFloat(point.latitude),
            lng: parseFloat(point.longitude),
          }))}
          options={{
            strokeColor: "#0A5C36",
            strokeOpacity: 0.8,
            strokeWeight: 3,
            icons: [
              {
                icon: {
                  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  strokeColor: "#FF0000",
                  scale: 3,
                },
                offset: "100%",
                repeat: "100px",
              },
            ],
          }}
        />
      )}

      {/* Vehicle polylines */}
      {Array.from(polylinePaths?.entries())?.map(([deviceId, path]) => {
        if (path?.length < 2) return null;
        return (
          <Polyline
            key={`polyline-${deviceId}`}
            path={path}
            options={{
              strokeColor: "#FF0000",
              strokeOpacity: 0.8,
              strokeWeight: 3,
              icons: [
                {
                  icon: {
                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    strokeColor: "#00FF00",
                    scale: 3,
                  },
                  offset: "100%",
                  repeat: "100px",
                },
              ],
            }}
          />
        );
      })}
    </>
  );
};
