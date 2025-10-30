import AuthController from "@/controllers/authController";
import { ensureArray } from "@/helper-functions/use-formater";
import { useHistory } from "@/hooks/history-hook";
import { Formik, Form, Field } from "formik";
import moment from "moment-timezone";
import { Loader2 } from "lucide-react";
import { getDateRange } from "@/helper-functions/use-date-range";
import historySchema from "@/validators/history-schema";
import SearchableSelect from "./ui/search-input";

interface HistoryTableProps {
  mergedData: any;
  setHistoryData: any;
  setHistoryOpen?: (val: boolean) => void;
  handleDownloadPDF: (fromTime: string, toTime: string) => void;
  setShowPlayback: (val: boolean) => void;
}

const HistoryTable = ({ mergedData, setHistoryData, setHistoryOpen, handleDownloadPDF, setShowPlayback }: HistoryTableProps) => {
  const session = AuthController.getSession();
  const { isLoading, handleGetAllHistory, handleGetIgnitionHistory, handleGetIdleHistory } = useHistory();

  return (
    <div className="space-y-2">
      <Formik
        initialValues={{
          deviceId: "",
          filter: "Today",
          type: "route",
          timeFrom: "",
          timeTo: "",
        }}
        validationSchema={historySchema}
        enableReinitialize={true}
        onSubmit={async (values, { resetForm }) => {
          let from = values.timeFrom;
          let to = values.timeTo;
          if (values.filter !== "Custom") {
            const range = getDateRange(values.filter);
            from = range.from!;
            to = range.to!;
          } else if (values.filter === "Custom") {
            from = moment(values.timeFrom).utc().toISOString();
            to = moment(values.timeTo).utc().toISOString();
          }
          if(values?.type === "route"){
            console.log("route clicked");
            const queryParams = { deviceId: Number(values.deviceId), from, to, user: session?.credentials?.user, pass: session?.credentials?.pass };
            if (queryParams.deviceId && queryParams.from && queryParams.to) {
              const response = await handleGetAllHistory(queryParams);
              const selectedDevice = ensureArray(mergedData)?.find((d: any) => d.deviceId === Number(values.deviceId));
              const responseWithDeviceName = ensureArray(response)?.map((item: any) => ({
                ...item,
                deviceName: selectedDevice?.devicename || "",
              }));
              setHistoryData(responseWithDeviceName);
              setHistoryOpen(true);
            }
          }else if(values?.type === "events"){
            console.log("events clicked");
            // const queryParams = { deviceId: Number(values.deviceId), from, to };
            const queryParams = { deviceId: Number(values.deviceId), from, to, user: session?.credentials?.user, pass: session?.credentials?.pass };
            if (queryParams.deviceId && queryParams.from && queryParams.to) {
              const response = await handleGetIgnitionHistory(queryParams);
              const selectedDevice = ensureArray(mergedData)?.find((d: any) => d.deviceId === Number(values.deviceId));
              const responseWithDeviceName = ensureArray(response)?.map((item: any) => ({
                ...item,
                deviceName: selectedDevice?.devicename || "",
              }));
              setHistoryData(responseWithDeviceName);
              setHistoryOpen(true);
            }
          }else if(values?.type === "trips"){
            const queryParams = { deviceId: Number(values.deviceId), from, to };
            if (queryParams?.deviceId && queryParams?.from && queryParams?.to) {
              const response = await handleGetIdleHistory(queryParams);
              const selectedDevice = ensureArray(mergedData)?.find((d: any) => d.deviceId === Number(values.deviceId));
              const responseWithDeviceName = ensureArray(response)?.map((item: any) => ({
                ...item,
                deviceName: selectedDevice?.devicename || "",
              }));
              setHistoryData(responseWithDeviceName);
              setHistoryOpen(true);
            }
          }
        }}
      >
        {({ values }) => (
          <Form className="bg-gray-100 px-2 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700 text-sm">
                Type
              </span>
              <Field as="select" name="type" className="border rounded-none p-1 w-20 md:w-48 h-8 text-sm bg-[#04003A] text-white">
                <option value="route">Route</option>
                <option value="events">Events</option>
                <option value="trips">Trips</option>
                <option value="stops">Stops</option>
                <option value="summary">Summary</option>
                <option value="dailySummary">Daily Summary</option>
              </Field>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700 text-sm">
                Objects
              </span>
              <SearchableSelect name="deviceId" data={ensureArray(mergedData) || []} />
              {/* <Field as="select" name="deviceId" className="border rounded-none p-1 w-20 md:w-48 h-8 text-sm bg-[#04003A] text-white">
                <option value="">Select Object</option>
                {ensureArray(mergedData)?.map((obj: any) => (
                  <option key={obj?.deviceId} value={obj?.deviceId}>
                    {obj?.devicename ?? ""}
                  </option>
                ))}
              </Field> */}
            </div>

            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700 text-sm">
                Filters
              </span>
              <Field as="select" name="filter" className="border rounded-none p-1 w-20 md:w-48 h-8 text-sm bg-[#04003A] text-white">
                <option value="Today">Today</option>
                <option value="Yesterday">Yesterday</option>
                <option value="beforeYesterday">Day before yesterday</option>
                <option value="thisWeek">This week</option>
                <option value="thisMonth">This month</option>
                <option value="Custom">Custom Date</option>
              </Field>
            </div>

            {values?.filter === "Custom" && (
              <>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700 text-sm">
                    Time From
                  </span>
                  <Field
                    type="datetime-local"
                    name="timeFrom"
                    className="border rounded p-2 w-20 md:w-52 bg-[#04003A] text-white"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700 text-sm">
                    Time To
                  </span>
                  <Field
                    type="datetime-local"
                    name="timeTo"
                    className="border rounded p-2 w-20 md:w-52 bg-[#04003A] text-white"
                  />
                </div>
              </>
            )}

            <div className="grid grid-cols-3 gap-1 mt-1">
              <button type="submit" className="bg-[#727270] text-white flex items-center justify-center w-full h-7 text-xs font-semibold rounded-none">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Show"}
              </button>
              <button type="button" onClick={() => { setShowPlayback(true); setHistoryOpen(false); }} className="bg-[#727270] text-white w-full h-7 text-xs font-semibold rounded-none">
                Play
              </button>
              <button type="button" className="bg-[#727270] text-white w-full h-7 text-xs font-semibold rounded-none"
                onClick={() => {
                  let from = values.timeFrom;
                  let to = values.timeTo;

                  if (values.filter !== "Custom") {
                    const range = getDateRange(values.filter);
                    from = range.from!;
                    to = range.to!;
                  } else if (values.filter === "Custom") {
                    from = moment(values.timeFrom).utc().toISOString();
                    to = moment(values.timeTo).utc().toISOString();
                  }
                  handleDownloadPDF(from, to);
                }}
              >
                Import/Export
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1 mt-1">
              <button className="bg-[#727270] text-white w-full h-7 text-xs font-semibold border-none rounded-none">
                Time
              </button>
              <button className="bg-[#727270] text-white w-full h-7 text-xs font-semibold border-none rounded-none">
                Information
              </button>
            </div>
          </Form>
        )}
      </Formik>

      <div className="bg-white shadow rounded-lg max-h-[calc(100vh-430px)] overflow-hidden">
        {/* <div className="min-h-[300px] flex items-center w-full justify-center">
          {isLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : ""}
        </div> */}
      </div>
    </div>
  );
};

export default HistoryTable;