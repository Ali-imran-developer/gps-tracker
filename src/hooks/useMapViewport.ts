import { ensureArray } from "@/helper-functions/use-formater";
import { parseWKT } from "@/helper-functions/use-mapview";
import { useEffect, useRef, useState } from "react";

export const useMapViewport = (selectedItems: any[], historyData: any[]) => {
  const [center] = useState({ lat: 30.3384, lng: 71.2781 });
  const [zoom, setZoom] = useState(15);
  const mapRef = useRef<google.maps.Map | null>(null);

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
          const circleBounds = new google.maps.Circle({ center: { lat, lng }, radius }).getBounds();
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
    if (historyData && historyData?.length > 0 && mapRef?.current) {
      const bounds = new google.maps.LatLngBounds();
      ensureArray(historyData)?.forEach((point: any) => {
        const lat = parseFloat(point?.latitude);
        const lng = parseFloat(point?.longitude);
        if (isFinite(lat) && isFinite(lng)) {
          bounds.extend({ lat, lng });
        }
      });
      if (!bounds.isEmpty()) {
        mapRef?.current?.fitBounds(bounds);
      }
    }
  }, [historyData]);

  return { center, zoom, setZoom, mapRef };
};
