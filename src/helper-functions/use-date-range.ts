import moment from "moment-timezone";

export const getDateRange = (filter: string) => {
  const now = moment().tz("Asia/Karachi");
  let from: any, to: any;
  if (filter === "Today") {
    from = now.clone().startOf('day').utc().toISOString();
    to = now.clone().add(1, 'day').startOf('day').utc().toISOString();
  } else if (filter === "Yesterday") {
    from = now.clone().subtract(1, 'day').startOf('day').utc().toISOString();
    to = now.clone().startOf('day').utc().toISOString();
  } else if (filter === "beforeYesterday") {
    from = now.clone().subtract(2, 'days').startOf('day').utc().toISOString();
    to = now.clone().subtract(1, 'day').startOf('day').utc().toISOString();
  } else if (filter === "thisWeek") {
    from = now.clone().subtract(6, 'days').startOf('day').utc().toISOString();
    to = now.clone().add(1, 'day').startOf('day').utc().toISOString();
  } else if (filter === "thisMonth") {
    from = now.clone().startOf('month').utc().toISOString();
    to = now.clone().add(1, 'day').startOf('day').utc().toISOString();
  }  
  return { from, to };
};
