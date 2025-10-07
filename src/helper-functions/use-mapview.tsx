export const formatVehicleInfoContent = (item: any) => {
  const getIgnitionStatus = (ignition: string) => {
    return ignition === "1" || true ? "On" : "Off";
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
          <h3 className="font-bold text-lg text-blue-900">
            {item?.vehicle || item?.name}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="font-medium text-gray-600">IMEI:</span>
            <div className="text-gray-900 text-xs">
              {item?.imei || item?.uniqueId}
            </div>
          </div>

          <div>
            <span className="font-medium text-gray-600">Model:</span>
            <div className="text-gray-900">{item.model}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="font-medium text-gray-600">Speed:</span>
            <div className={`font-semibold ${getSpeedColor(item?.speed)}`}>
              {item?.speed?.toFixed(2)} km/h
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

export const formatDate = (fullAddress: string) => {
  if (!fullAddress) return "";
  const [location, rawDate] = fullAddress.split("^");
  if (!rawDate) return fullAddress;
  const cleanedDate = rawDate.trim().replace(/\s+/g, " ");
  const fixedDate = cleanedDate.replace(
    /(\d{2}):\s*(\d{2}):\s*(\d{2})/,
    "$1:$2:$3"
  );
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

export const getCarIcon = () => {
  if (typeof window !== "undefined" && window.google) {
    return {
      url: "/assets/icons/car5.png",
      scaledSize: new window.google.maps.Size(60, 60),
      anchor: new window.google.maps.Point(20, 20),
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
