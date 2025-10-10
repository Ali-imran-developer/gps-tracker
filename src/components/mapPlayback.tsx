import React, { useEffect, useRef, useState } from "react";

type HistoryPoint = {
  latitude: string | number;
  longitude: string | number;
  serverTime?: string;
  speed?: string | number;
};

type Props = {
  map: google.maps.Map | null;
  historyData: HistoryPoint[];
  initialPlaying?: boolean;
  onFinish?: () => void;
  className?: string;
  modalOpen: (val: any) => void;
};

function haversineKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const lat1 = toRad(aLat);
  const lat2 = toRad(bLat);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function parseTime(t?: string | number) {
  if (!t) return NaN;
  const d = new Date(t);
  return isNaN(d.getTime()) ? NaN : d.getTime();
}

function formatDuration(ms: number) {
  if (!isFinite(ms) || ms <= 0) return "0s";
  const s = Math.floor(ms / 1000);
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

export const MapPlayback: React.FC<Props> = ({
  map,
  modalOpen,
  historyData,
  initialPlaying = false,
}) => {
  const [playing, setPlaying] = useState(initialPlaying);
  const [playRate, setPlayRate] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);
  const [isReady, setIsReady] = useState(false);
  const [info, setInfo] = useState({
    routeKm: 0,
    movingMs: 0,
    topSpeed: 0,
    totalMs: 0,
  });
  const [showModal, setShowModal] = useState(true);

  const playbackMarker = useRef<google.maps.Marker | null>(null);
  const playbackPolyline = useRef<google.maps.Polyline | null>(null);
  const rafRef = useRef<number | null>(null);

  const timelineRef = useRef<{
    points: { lat: number; lng: number; t: number; speed: number }[];
    start: number;
    end: number;
  } | null>(null);
  const playStartWallClockRef = useRef<number | null>(null);
  const playOffsetMsRef = useRef<number>(0);

  // --- expose modal open externally ---
  useEffect(() => {
    if (modalOpen) {
      modalOpen((val: boolean) => {
        setShowModal(val);
      });
    }
  }, [modalOpen]);

  // --- preprocess and scale total duration ---
  useEffect(() => {
    if (!historyData || historyData.length < 2) {
      setIsReady(false);
      return;
    }

    const pts = historyData
      .map((p) => ({
        lat: Number(p.latitude),
        lng: Number(p.longitude),
        t: parseTime(p.serverTime),
        speed: Number(p.speed || 0),
      }))
      .filter((p) => isFinite(p.lat) && isFinite(p.lng) && isFinite(p.t))
      .sort((a, b) => a.t - b.t);

    const start = pts[0].t;
    const end = pts[pts.length - 1].t;
    const totalMs = end - start;

    // --- SCALE to 30 minutes if 200 points ---
    const desiredDurationMs = 30 * 60 * 1000;
    const scaleFactor = pts.length > 1 ? desiredDurationMs / totalMs : 1;

    const scaledPts = pts.map((p) => ({
      ...p,
      t: start + (p.t - start) * scaleFactor,
    }));

    timelineRef.current = { points: scaledPts, start, end: start + desiredDurationMs };

    // compute info
    let totalKm = 0;
    let movingMs = 0;
    let topSpeed = 0;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1];
      const b = pts[i];
      totalKm += haversineKm(a.lat, a.lng, b.lat, b.lng);
      const dt = b.t - a.t;
      const avgSpeed =
        ((a.speed + b.speed) / 2) || (dt > 0 ? (totalKm / (dt / 3600000)) : 0);
      if (avgSpeed > 0.5) movingMs += dt;
      topSpeed = Math.max(topSpeed, a.speed, b.speed);
    }

    setInfo({ routeKm: totalKm, movingMs, topSpeed, totalMs: desiredDurationMs });
    setIsReady(true);
    setProgress(0);
    setPlaying(initialPlaying);

    // --- setup map elements ---
    if (map) {
      if (playbackPolyline.current) playbackPolyline.current.setMap(null);
      playbackPolyline.current = new google.maps.Polyline({
        map,
        path: pts.map((p) => ({ lat: p.lat, lng: p.lng })),
        strokeColor: "#0A5C36",
        strokeOpacity: 0.9,
        strokeWeight: 4,
      });

      if (playbackMarker.current) playbackMarker.current.setMap(null);
      playbackMarker.current = new google.maps.Marker({
        map,
        position: { lat: pts[0].lat, lng: pts[0].lng },
        icon: {
          url: "/assets/icons/car5.png",
          scaledSize: new google.maps.Size(40, 40),
        },
      });

      const bounds = new google.maps.LatLngBounds();
      pts.forEach((p) => bounds.extend({ lat: p.lat, lng: p.lng }));
      map.fitBounds(bounds);
    }
  }, [historyData, map]);

  // --- playback animation ---
  useEffect(() => {
    if (!isReady || !timelineRef.current) return;
    const tl = timelineRef.current;
    const duration = tl.end - tl.start;

    const step = (now: number) => {
      if (playStartWallClockRef.current == null)
        playStartWallClockRef.current = now - playOffsetMsRef.current / playRate;

      const elapsedWall = now - playStartWallClockRef.current;
      const timelineMs = playOffsetMsRef.current + elapsedWall * playRate;
      const current = Math.min(timelineMs, duration);
      setProgress(current / duration);

      const sample = sampleAt(tl.start + current);
      if (sample && playbackMarker.current)
        playbackMarker.current.setPosition({ lat: sample.lat, lng: sample.lng });

      if (current >= duration) {
        setPlaying(false);
        playOffsetMsRef.current = duration;
        return;
      }

      rafRef.current = requestAnimationFrame(step);
    };

    if (playing) {
      rafRef.current = requestAnimationFrame(step);
    } else if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, playRate, isReady]);

  // --- helper for sampling position ---
  const sampleAt = (tMs: number) => {
    const tl = timelineRef.current;
    if (!tl) return null;
    const pts = tl.points;
    if (tMs <= tl.start) return pts[0];
    if (tMs >= tl.end) return pts[pts.length - 1];
    let i = 1;
    while (i < pts.length && tMs > pts[i].t) i++;
    const a = pts[i - 1],
      b = pts[i];
    const frac = (tMs - a.t) / (b.t - a.t);
    return {
      lat: a.lat + (b.lat - a.lat) * frac,
      lng: a.lng + (b.lng - a.lng) * frac,
      speed: a.speed + (b.speed - a.speed) * frac,
    };
  };

  // --- handle manual dragging of range ---
  const handleSliderChange = (val: number) => {
    setProgress(val);
    const tl = timelineRef.current;
    if (!tl) return;
    const duration = tl.end - tl.start;
    const currentMs = val * duration;
    playOffsetMsRef.current = currentMs;

    const sample = sampleAt(tl.start + currentMs);
    if (sample && playbackMarker.current) {
      playbackMarker.current.setPosition({ lat: sample.lat, lng: sample.lng });
    }
  };

  const togglePlay = () => setPlaying((p) => !p);

  const changeRate = (dir: "up" | "down") => {
    const rates = [0.5, 1, 2, 4];
    const idx = rates.indexOf(playRate);
    const next =
      dir === "up"
        ? rates[Math.min(rates.length - 1, idx + 1)]
        : rates[Math.max(0, idx - 1)];
    setPlayRate(next);
  };

  if (!showModal) return null;

  return (
    <div
      className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-xl 
                 bg-white rounded-t-2xl shadow-lg p-4 border border-gray-200"
    >
      {/* Header with close */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-gray-700 text-sm">Trip Information</h3>
        <button
          onClick={() => setShowModal(false)}
          className="text-gray-500 hover:text-gray-800 text-xl font-bold"
        >
          ×
        </button>
      </div>

      {/* Info */}
      <div className="grid grid-cols-2 gap-1 text-sm text-gray-700 mb-3">
        <div>
          <strong>Route:</strong> {info.routeKm.toFixed(2)} km
        </div>
        <div>
          <strong>Top Speed:</strong> {info.topSpeed.toFixed(2)} km/h
        </div>
        <div>
          <strong>Moving Time:</strong> {formatDuration(info.movingMs)}
        </div>
        <div>
          <strong>Total Time:</strong> {formatDuration(info.totalMs)}
        </div>
      </div>

      {/* Progress */}
      <div className="w-full mb-3">
        <input
          type="range"
          min={0}
          max={1}
          step={0.0001}
          value={progress}
          onChange={(e) => handleSliderChange(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => changeRate("down")}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          -
        </button>

        <button
          onClick={togglePlay}
          className="px-5 py-2 bg-indigo-600 text-white rounded text-sm font-medium"
        >
          {playing ? "Pause" : "Play"}
        </button>

        <button
          onClick={() => changeRate("up")}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          +
        </button>

        <span className="text-sm text-gray-600">{playRate}x</span>
      </div>
    </div>
  );
};

export default MapPlayback;