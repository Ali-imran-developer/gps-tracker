import { useSelector } from "react-redux";
import { useGeoFence } from "./geoFecnce-hook";
import { useEffect, useState } from "react";

export const useAddressDisplay = (selectedItems: any[]) => {
  const { handleGetAddress } = useGeoFence();
  const { address } = useSelector((state: any) => state.GeoFence);
  const [showAddress, setShowAddress] = useState(true);

  useEffect(() => {
    if (selectedItems?.length === 1) {
      const item = selectedItems[0];
      const rawLat = item?.lat ?? item?.latitude;
      const rawLng = item?.longi ?? item?.longitude;
      const deviceId = item?.deviceid ?? item?.deviceId;
      const queryParams = { lati: rawLat, longi: rawLng, deviceid: deviceId };

      if (queryParams?.lati && queryParams?.longi && queryParams?.deviceid) {
        handleGetAddress(queryParams);
        setShowAddress(true);
      }
    }
  }, [selectedItems]);

  return { address, showAddress, setShowAddress };
};
