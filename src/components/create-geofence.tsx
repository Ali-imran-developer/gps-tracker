import { useFormik } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GoogleMap, DrawingManagerF, Circle, Polygon } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
import { useZones } from "@/hooks/zones-hook";
import { Loader2 } from "lucide-react";
import AuthController from "@/controllers/authController";

interface AddPlaceDialogProps {
  trigger: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingZone?: any | null;
}

const parseCircleWKT = (wkt: string) => {
  const match = wkt.match(/CIRCLE\(([-\d.]+) ([-\d.]+), ([-\d.]+)\)/);
  if (!match) return null;
  return {
    center: { lat: parseFloat(match[1]), lng: parseFloat(match[2]) },
    radius: parseFloat(match[3]),
  };
};

const parsePolygonWKT = (wkt: string) => {
  const match = wkt.match(/POLYGON\s*\(\((.+)\)\)/);
  if (!match) return [];
  return match[1].split(",").map((pair) => {
    const [lat, lng] = pair.trim().split(" ").map(Number);
    return { lat, lng };
  });
};

const CreateGeofence = ({ trigger, open, setOpen, editingZone }: AddPlaceDialogProps) => {
  const [center] = useState({ lat: 30.3384, lng: 71.2781 });
  const [zoom] = useState(12);
  const mapRef = useRef<google.maps.Map | null>(null);
  const { isLoadingZones, handleAddNewZone, handleEditZone } = useZones();
  const [polygonCoords, setPolygonCoords] = useState<{ lat: number; lng: number }[]>([]);
  const [circle, setCircle] = useState<{center: { lat: number; lng: number }; radius: number;} | null>(null);
  const session = AuthController.getSession();
  const circleRef = useRef<google.maps.Circle | null>(null);
  const polygonRef = useRef<google.maps.Polygon | null>(null);
  console.log("Editing Zone:", editingZone);

  const formik = useFormik({
    initialValues: {
      name: editingZone?.name || "",
      description: editingZone?.description || "",
      type: editingZone ? editingZone.area.startsWith("CIRCLE") ? "CIRCLE" : "POLYGON" : "",
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (values?.type === "POLYGON" && polygonCoords?.length > 0) {
          const coords = [...polygonCoords];
          const first = coords[0];
          const last = coords[coords?.length - 1];
          if (first?.lat !== last?.lat || first?.lng !== last?.lng) {
            coords.push(first);
          }
          const wkt = `POLYGON((${coords.map((p) => `${p.lat} ${p.lng}`).join(", ")}))`;
          if (editingZone) {
            await handleEditZone(editingZone?.id, session.credentials.user, session.credentials.pass, values.name, values.description, wkt);
          } else {
            await handleAddNewZone( session?.credentials?.user, session?.credentials?.pass, values.name, values.description, wkt);
          }
          // await handleAddNewZone(session?.credentials?.user, session?.credentials?.pass, values.name, values.description, wkt);
          setPolygonCoords([]);
        } else if (values.type === "CIRCLE" && circle) {
          const circlePayload = `CIRCLE(${circle.center.lat} ${circle.center.lng}, ${circle.radius})`;
          if (editingZone) {
            await handleEditZone(editingZone?.id, session.credentials.user, session.credentials.pass, values.name, values.description, circlePayload);
          } else {
            await handleAddNewZone(session?.credentials?.user, session?.credentials?.pass, values.name, values.description, circlePayload );
          }
          // await handleAddNewZone( session?.credentials?.user, session?.credentials?.pass, values.name, values.description, circlePayload );
          setCircle(null);
        }
        formik.resetForm();
        setOpen(false);
      } catch (error) {
        console.error("Error adding zone:", error);
      }
    },
  });

  useEffect(() => {
    if (!editingZone) {
      setPolygonCoords([]);
      setCircle(null);
      return;
    }
    if (editingZone.area.startsWith("CIRCLE")) {
      const circleData = parseCircleWKT(editingZone.area);
      if (circleData) {
        setCircle(circleData);
        setPolygonCoords([]);
        formik.setFieldValue("type", "CIRCLE");
      }
    } else if (editingZone.area.startsWith("POLYGON")) {
      const polygonData = parsePolygonWKT(editingZone.area);
      if (polygonData.length > 0) {
        setPolygonCoords(polygonData);
        setCircle(null);
        formik.setFieldValue("type", "POLYGON");
      }
    }
  }, [editingZone]);

  const handlePolygonComplete = (poly: google.maps.Polygon) => {
    const path = poly.getPath().getArray().map((latLng) => ({
      lat: latLng.lat(),
      lng: latLng.lng(),
    }));
    setPolygonCoords(path);
    poly.setMap(null);
  };

  const handleCircleComplete = (circleObj: google.maps.Circle) => {
    const center = circleObj.getCenter();
    if (!center) return;
    setCircle({
      center: { lat: center.lat(), lng: center.lng() },
      radius: circleObj.getRadius(),
    });
    circleObj.setMap(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">{editingZone ? "Edit Geofence" : "Add New Geofence"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <Input
              name="name"
              placeholder="Enter name"
              value={formik.values.name}
              onChange={formik.handleChange}
              className="text-sm"
            />
            <Input
              name="description"
              placeholder="Enter description"
              value={formik.values.description}
              onChange={formik.handleChange}
              className="text-sm"
            />
          </div>

          <Select
            onValueChange={(val) => {
              formik.setFieldValue("type", val);
              setPolygonCoords([]);
              setCircle(null);
            }}
            value={formik.values.type}
          >
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="POLYGON">POLYGON</SelectItem>
              <SelectItem value="CIRCLE">CIRCLE</SelectItem>
            </SelectContent>
          </Select>

          <div className="w-full h-[200px] sm:h-[250px] md:h-[300px]">
            <GoogleMap
              mapTypeId="roadmap"
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={circle ? circle.center : polygonCoords[0] || center}
              zoom={zoom}
              onLoad={(map: any) => (mapRef.current = map)}
              options={{
                zoomControl: true,
                mapTypeControl: false,
                scaleControl: false,
                rotateControl: false,
                fullscreenControl: false,
                gestureHandling: "greedy",
              }}
            >
              {formik?.values?.type && (
                <DrawingManagerF
                  onPolygonComplete={handlePolygonComplete}
                  onCircleComplete={handleCircleComplete}
                  options={{
                    drawingControl: false,
                    drawingMode:
                      formik.values.type === "POLYGON"
                        ? google?.maps?.drawing?.OverlayType?.POLYGON
                        : google?.maps?.drawing?.OverlayType?.CIRCLE,
                    polygonOptions: {
                      fillColor: "#2196F3",
                      fillOpacity: 0.4,
                      strokeColor: "#1E88E5",
                      strokeWeight: 2,
                      editable: true,
                      draggable: true,
                    },
                    circleOptions: {
                      fillColor: "#4CAF50",
                      fillOpacity: 0.3,
                      strokeColor: "#2E7D32",
                      strokeWeight: 2,
                      editable: true,
                      draggable: true,
                    },
                  }}
                />
              )}

              {polygonCoords?.length > 0 && (
                <Polygon
                  onLoad={(p) => (polygonRef.current = p)}
                  path={polygonCoords}
                  options={{
                    fillColor: "#2196F3",
                    fillOpacity: 0.4,
                    strokeColor: "#1E88E5",
                    strokeWeight: 2,
                    editable: true,
                    draggable: true,
                  }}
                  onMouseUp={() => {
                    const path = polygonRef.current?.getPath().getArray().map((p) => ({
                      lat: p.lat(),
                      lng: p.lng(),
                    }));
                    if (path) setPolygonCoords(path);
                  }}
                />
              )}

              {circle && (
                <Circle
                  onLoad={(c) => (circleRef.current = c)}
                  center={circle.center}
                  radius={circle.radius}
                  options={{
                    fillColor: "#4CAF50",
                    fillOpacity: 0.3,
                    strokeColor: "#2E7D32",
                    strokeWeight: 2,
                    editable: true,
                    draggable: true,
                  }}
                  onDragEnd={() => {
                    if (circleRef.current) {
                      const c = circleRef.current.getCenter();
                      setCircle((prev) =>
                        prev ? { ...prev, center: { lat: c!.lat(), lng: c!.lng() } } : null
                      );
                    }
                  }}
                  onRadiusChanged={() => {
                    if (circleRef.current) {
                      requestAnimationFrame(() => {
                        const r = circleRef.current!.getRadius();
                        setCircle((prev) => (prev ? { ...prev, radius: r } : null));
                      });
                    }
                  }}
                />
              )}
            </GoogleMap>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="w-full text-sm"
              onClick={() => {
                setPolygonCoords([]);
                setCircle(null);
              }}
            >
              Reset
            </Button>
            <Button type="submit" className="w-full bg-[#04003A] text-sm">
              {isLoadingZones ? (
                <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGeofence;