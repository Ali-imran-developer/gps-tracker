import { formatDate } from "@/utils/format-date";

export const formatVehicleInfoContent = (item: any) => {
  const getIgnitionStatus = (ignition: string | boolean) => {
    return ignition === "1" || ignition === true ? "On" : "Off";
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
    <div className="px-2 min-w-[180px] max-w-[220px] bg-white rounded-md shadow-md overflow-y-auto">
      <div className="space-y-1 text-[11px] leading-tight">
        <div className="border-b pb-1 mb-1">
          <h3 className="font-semibold text-sm text-blue-900">
            {item?.vehicle || item?.name}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-1">
          <div>
            <span className="font-medium text-gray-600">IMEI:</span>
            <div className="text-gray-900 text-[10px]">
              {item?.imei || item?.uniqueId}
            </div>
          </div>

          <div>
            <span className="font-medium text-gray-600 ms-6">Model:</span>
            <div className="text-gray-900 text-[11px] ms-6">
              {item.model}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1">
          <div>
            <span className="font-medium text-gray-600">Speed:</span>
            <div className={`font-semibold ${getSpeedColor(item?.speed)}`}>
              {item?.speed?.toFixed(1)} km/h
            </div>
          </div>

          <div>
            <span className="font-medium text-gray-600">Ignition:</span>
            <div
              className={`font-semibold ${
                item?.ignition === "1" || item?.attribute?.ignition === true
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {getIgnitionStatus(item?.ignition || item?.attribute?.ignition)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1">
          <div>
            <span className="font-medium text-gray-600">Course:</span>
            <div className="text-gray-900">{item.course}°</div>
          </div>
          {item.contact && (
            <div>
              <span className="font-medium text-gray-600">Contact:</span>
              <div className="text-gray-900 text-[10px]">
                {item?.phone}
              </div>
            </div>
          )}
        </div>

        <div>
          <span className="font-medium text-gray-600">Date:</span>
          <div className="text-gray-900 text-[10px]">
            {formatDate(item?.lastUpdate) ?? ""}
          </div>
        </div>

        <div>
          <span className="font-medium text-gray-600">Position:</span>
          <div className="text-gray-900 text-[10px]">
            Lat: {getLat(item)}, Lng: {getLng(item)}
          </div>
        </div>
      </div>
    </div>
  );
};

export const createSurroundingArea = (item: any) => {
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

export const renderInfoContent = (item: any, multiple: boolean) => {
  if (multiple) {
    return (
      <div className="p-0">
        <strong className="font-semibold text-[11px]">
          {item.vehicle || item.name}
        </strong>
        <span className="ml-2">({item?.speed}Kph)</span>
      </div>
    );
  }
  return formatVehicleInfoContent(item);
};

export function parseWKT(area: string): google.maps.LatLngLiteral[] {
  if (!area) return [];
  const match = area.match(/POLYGON\s*\(\((.*?)\)\)/i);
  if (!match) return [];
  const coordinates = match[1]
    .split(",")
    .map((coord) => {
      const [lat, lng] = coord.trim().split(/\s+/).map(Number);
      return { lat, lng };
    })
    .filter((coord) => !isNaN(coord.lat) && !isNaN(coord.lng));
  return coordinates;
}

async function getRotatedCarIcon(imageUrl: string, heading: number) {
  return new Promise<string>((resolve) => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const size = 60;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, size, size);
      ctx.save();
      ctx.translate(size / 2, size / 2);
      ctx.rotate((heading * Math.PI) / 180);
      ctx.drawImage(img, -size / 2, -size / 2, size, size);
      ctx.restore();
      resolve(canvas.toDataURL());
    };
  });
}

export const getCarIcon = async (heading = 0) => {
  if (typeof window !== "undefined" && window.google) {
    const rotatedUrl = await getRotatedCarIcon("/assets/icons/car5.png", heading);
    return {
      url: rotatedUrl,
      scaledSize: new window.google.maps.Size(60, 60),
      anchor: new window.google.maps.Point(30, 30),
    };
  }
  return undefined;
};

export function animateMarker(marker: google.maps.Marker, newPosition: google.maps.LatLngLiteral, duration = 2000) {
  if (!marker.getPosition()) return;
  const oldPos = marker.getPosition()?.toJSON();
  const startLat = oldPos?.lat || 0;
  const startLng = oldPos?.lng || 0;
  const endLat = newPosition.lat;
  const endLng = newPosition.lng;
  const startTime = performance.now();
  function step(timestamp: number) {
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const lat = startLat + (endLat - startLat) * progress;
    const lng = startLng + (endLng - startLng) * progress;
    marker.setPosition({ lat, lng });
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }
  requestAnimationFrame(step);
}
