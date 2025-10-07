import MainLoader from "@/components/ui/main-loader";
import { useJsApiLoader } from "@react-google-maps/api";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
export const MapProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, loadError } = useJsApiLoader({ googleMapsApiKey: API_KEY, libraries: ["places", "drawing"] });

  if (loadError) return <p>Error loading maps</p>;
  if (!isLoaded) return <p><MainLoader /></p>;

  return <>{children}</>;
};
