import { ensureArray } from '@/helper-functions/use-formater';
import { animateMarker, getCarIcon } from '@/helper-functions/use-mapview';
import { useEffect, useRef, useState } from 'react';

export const useMapMarkers = (
  mapRef: React.RefObject<google.maps.Map | null>,
  selectedItems: any[],
  onMarkerClick?: (markerId: string) => void
) => {
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const [activeMarkers, setActiveMarkers] = useState<Set<string>>(new Set());
  const [polylinePaths, setPolylinePaths] = useState<Map<string, google.maps.LatLngLiteral[]>>(new Map());

  const updatePolylinePath = (deviceId: string, newPoint: google.maps.LatLngLiteral) => {
    setPolylinePaths(prev => {
      const newPaths = new Map(prev);
      const currentPath = newPaths.get(deviceId) || [];
      const updatedPath = [...currentPath, newPoint];
      if (updatedPath.length > 20) updatedPath.shift();
      newPaths.set(deviceId, updatedPath);
      return newPaths;
    });
  };

  const handleMarkerClick = (markerId: string) => {
    setActiveMarkers(prev => {
      const newSet = new Set(prev);
      newSet.has(markerId) ? newSet.delete(markerId) : newSet.add(markerId);
      return newSet;
    });
    onMarkerClick?.(markerId);
  };

  useEffect(() => {
    if (!mapRef.current) return;
    const currentMarkerIds = new Set(ensureArray(selectedItems)?.map((item, idx) => (item?.positionid || item?.deviceId || item?.id || idx).toString()));

    selectedItems?.forEach((item, idx) => {
      const markerId = (item?.positionid || item?.deviceId || item?.id || idx).toString();
      const lat = parseFloat(item?.lat || item?.latitude || "0");
      const lng = parseFloat(item?.longi || item?.longitude || "0");
      if (!isFinite(lat) || !isFinite(lng)) return;
      const newPos = { lat, lng };
      updatePolylinePath(markerId, newPos);

      if (markersRef.current.has(markerId)) {
        const existingMarker = markersRef.current.get(markerId)!;
        const currentPos = existingMarker.getPosition()?.toJSON();
        if (!currentPos || currentPos.lat !== lat || currentPos.lng !== lng) {
          animateMarker(existingMarker, newPos);
        }
        existingMarker.setTitle(`${item?.vehicle || item?.name || "Vehicle"} - Speed: ${item?.speed?.toFixed(2) ?? 0} km/h`);
      } else {
        const marker = new google.maps.Marker({
          position: newPos,
          map: mapRef.current,
          icon: getCarIcon(),
          title: `${item?.vehicle || item?.name || "Vehicle"} - Speed: ${item?.speed?.toFixed(2) ?? 0} km/h`,
        });
        marker.addListener("click", () => handleMarkerClick(markerId));
        markersRef.current.set(markerId, marker);
      }
    });

    markersRef.current.forEach((marker, id) => {
      if (!currentMarkerIds.has(id)) {
        marker.setMap(null);
        markersRef.current.delete(id);
        setPolylinePaths(prev => {
          const newPaths = new Map(prev);
          newPaths.delete(id);
          return newPaths;
        });
        setActiveMarkers(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }
    });
  }, [selectedItems]);

  return { activeMarkers, polylinePaths };
};
