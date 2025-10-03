import * as Yup from "yup";

const historySchema = Yup.object().shape({
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

export default historySchema;