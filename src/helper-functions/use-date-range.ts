import moment from "moment-timezone";

export const getDateRange = (filter: string) => {
  const now = moment().tz("Asia/Karachi");
  let from: any, to: any;
  if (filter === "Today") {
    from = now.clone().subtract(1, 'day').utc().toISOString();
    to = now.clone().utc().toISOString();
  } else if (filter === "Yesterday") {
    from = now.clone().subtract(2, 'days').utc().toISOString();
    to = now.clone().subtract(1, 'day').utc().toISOString();
  } else if (filter === "beforeYesterday") {
    from = now.clone().subtract(3, 'days').utc().toISOString();
    to = now.clone().subtract(2, 'days').utc().toISOString();
  } else if (filter === "thisWeek") {
    from = now.clone().subtract(7, 'days').utc().toISOString();
    to = now.clone().utc().toISOString();
  } else if (filter === "thisMonth") {
    from = now.clone().subtract(1, 'month').utc().toISOString();
    to = now.clone().utc().toISOString();
  }
  return { from, to };
};
