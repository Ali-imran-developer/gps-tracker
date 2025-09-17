const formatDate = (utcDate: string) => {
  if (!utcDate) return "";
  const date = new Date(utcDate);
  const gmt5 = new Date(date.getTime() + 5 * 60 * 60 * 1000);
  return gmt5.toLocaleString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export default formatDate;