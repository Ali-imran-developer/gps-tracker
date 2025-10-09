export const formatDate = (utcDate: string) => {
  if (!utcDate) return "";
  const date = new Date(utcDate);
  return date.toLocaleString("en-US", {
    timeZone: "Asia/Karachi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).replace(",", "");
};

export const formatDate2 = (fullAddress: string) => {
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
