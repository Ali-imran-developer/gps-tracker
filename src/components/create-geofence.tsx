import { useFormik } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GoogleMap,
  DrawingManagerF,
  Circle,
  Polygon,
} from "@react-google-maps/api";
import { useRef, useState } from "react";
import { useZones } from "@/hooks/zones-hook";
import { Loader2 } from "lucide-react";

interface AddPlaceDialogProps {
  trigger: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateGeofence = ({ trigger, open, setOpen }: AddPlaceDialogProps) => {
  const [center] = useState({ lat: 30.3384, lng: 71.2781 });
  const [zoom] = useState(12);
  const mapRef = useRef<google.maps.Map | null>(null);
  const { isLoadingZones, handleAddNewZone } = useZones();
  const [polygonCoords, setPolygonCoords] = useState<{ lat: number; lng: number }[]>([]);
  const [circle, setCircle] = useState<{center: { lat: number; lng: number }; radius: number;} | null>(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      type: "",
    },
    onSubmit: async (values) => {
      try {
        if (values?.type === "POLYGON" && polygonCoords?.length > 0) {
          const coords = [...polygonCoords];
          const first = coords[0];
          const last = coords[coords?.length - 1];
          if (first?.lat !== last?.lat || first?.lng !== last?.lng) {
            coords.push(first);
          }
          const wkt = `POLYGON((${coords
            .map((p) => `${p.lat} ${p.lng}`)
            .join(", ")}))`;
          console.log("Polygon Payload:", wkt);
          await handleAddNewZone(values.name, values.description, wkt);
          setPolygonCoords([]);
        } else if (values.type === "CIRCLE" && circle) {
          const circlePayload = `CIRCLE(${circle.center.lat} ${circle.center.lng}, ${circle.radius})`;
          console.log("Circle Payload:", circlePayload);
          await handleAddNewZone(
            values.name,
            values.description,
            circlePayload
          );
          setCircle(null);
        }
        formik.resetForm();
        setOpen(false);
      } catch (error) {
        console.error("Error adding zone:", error);
      }
    },
  });

  const handlePolygonComplete = (poly: google.maps.Polygon) => {
    const path = poly
      .getPath()
      .getArray()
      .map((latLng) => ({
        lat: latLng.lat(),
        lng: latLng.lng(),
      }));
    setPolygonCoords(path);

    // Remove the one managed by DrawingManager to avoid duplicates
    poly.setMap(null);
  };
  const handleCircleComplete = (circleObj: google.maps.Circle) => {
    const center = circleObj.getCenter();
    if (!center) return;

    setCircle({
      center: { lat: center.lat(), lng: center.lng() },
      radius: circleObj.getRadius(),
    });

    // Remove the one managed by DrawingManager
    circleObj.setMap(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Geofence</DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              name="name"
              placeholder="Enter name"
              value={formik.values.name}
              onChange={formik.handleChange}
            />
            <Input
              name="description"
              placeholder="Enter description"
              value={formik.values.description}
              onChange={formik.handleChange}
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
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="POLYGON">POLYGON</SelectItem>
              <SelectItem value="CIRCLE">CIRCLE</SelectItem>
            </SelectContent>
          </Select>

          <div className="w-full h-[300px]">
            <GoogleMap
              mapTypeId="roadmap"
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={center}
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
                  path={polygonCoords}
                  options={{
                    fillColor: "#2196F3",
                    fillOpacity: 0.4,
                    strokeColor: "#1E88E5",
                    strokeWeight: 2,
                    editable: true,
                    draggable: true,
                  }}
                  onMouseUp={(e) => {
                    const newPath = e.latLng
                      ? (e.latLng as google.maps.LatLng).toJSON()
                      : null;
                    if (newPath) {
                      setPolygonCoords((prev) => [...prev, newPath]);
                    }
                  }}
                />
              )}

              {circle && (
                <Circle
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
                />
              )}
            </GoogleMap>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setPolygonCoords([]);
                setCircle(null);
              }}
            >
              Reset
            </Button>
            <Button type="submit" className="w-full bg-[#04003A]">
              {isLoadingZones ? (
                <Loader2 className="w-7 h-7 animate-spin" />
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