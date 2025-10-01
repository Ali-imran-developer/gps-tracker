import AuthController from "@/controllers/authController";
import { ensureArray } from "@/helper-functions/use-formater";
import { useHistory } from "@/hooks/history-hook";
import { useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import moment from "moment-timezone";
import { Loader2 } from "lucide-react";

interface HistoryTableProps {
  mergedData: any;
  setHistoryData: any;
  setHistoryOpen?: (val: boolean) => void;
}

const HistoryTable = ({ mergedData, setHistoryData, setHistoryOpen }: HistoryTableProps) => {
  const session = AuthController.getSession();
  const { isLoading, handleGetAllHistory } = useHistory();
  // const { historyLists } = useSelector((state: any) => state.History);

  const FilterSchema = Yup.object().shape({
    deviceId: Yup.string().required("Object is required"),
    filter: Yup.string().required("Filter is required"),
    timeFrom: Yup.string().when("filter", {
      is: "Custom",
      then: (schema) => schema.required("From date is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    timeTo: Yup.string().when("filter", {
      is: "Custom",
      then: (schema) => schema.required("To date is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const getDateRange = (filter: string) => {
    const now = moment().tz("Asia/Karachi");
    let from: any, to: any;
    if (filter === "Today") {
      from = now.clone().startOf("day").subtract(5, "hours").toISOString();
      to = now.clone().subtract(5, "hours").toISOString();
    } else if (filter === "Yesterday") {
      from = now
        .clone()
        .subtract(1, "day")
        .startOf("day")
        .subtract(5, "hours")
        .toISOString();
      to = now
        .clone()
        .subtract(1, "day")
        .endOf("day")
        .subtract(5, "hours")
        .toISOString();
    }
    return { from, to };
  };

  return (
    <div className="space-y-2">
      <Formik
        initialValues={{
          deviceId: "",
          filter: "Today",
          timeFrom: "",
          timeTo: "",
        }}
        validationSchema={FilterSchema}
        enableReinitialize={true}
        onSubmit={async (values, { resetForm }) => {
          let from = values.timeFrom;
          let to = values.timeTo;
          if (values.filter === "Today" || values.filter === "Yesterday") {
            const range = getDateRange(values.filter);
            from = range.from!;
            to = range.to!;
          } else if (values.filter === "Custom") {
            from = moment(values.timeFrom).subtract(5, "hours").toISOString();
            to = moment(values.timeTo).subtract(5, "hours").toISOString();
          }
          const queryParams = {
            deviceId: Number(values.deviceId),
            from,
            to,
            user: session?.credentials?.user,
            pass: session?.credentials?.pass,
          };
          console.log("params", queryParams);
          if (queryParams.deviceId && queryParams.from && queryParams.to) {
            const response = await handleGetAllHistory(queryParams);
            setHistoryData(response);
            resetForm();
            setHistoryOpen(true);
          }
        }}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form className="bg-gray-100 px-2 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700 text-sm">
                Objects
              </span>
              <Field as="select" name="deviceId" className="border rounded-none p-1 w-20 md:w-48 h-8 text-sm bg-[#04003A] text-white">
                <option value="">Select Object</option>
                {ensureArray(mergedData)?.map((obj: any) => (
                  <option key={obj?.deviceId} value={obj?.deviceId}>
                    {obj?.deviceId}
                  </option>
                ))}
              </Field>
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
              <button
                type="submit"
                className="bg-[#727270] text-white w-full h-7 text-xs font-semibold rounded-none"
              >
                Show
              </button>
              <button
                type="button"
                className="bg-[#727270] text-white w-full h-7 text-xs font-semibold rounded-none"
              >
                Hide
              </button>
              <button
                type="button"
                className="bg-[#727270] text-white w-full h-7 text-xs font-semibold rounded-none"
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
        <div className="min-h-[300px] flex items-center w-full justify-center">
          {isLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : ""}
        </div>
      </div>
    </div>
  );
};

export default HistoryTable;