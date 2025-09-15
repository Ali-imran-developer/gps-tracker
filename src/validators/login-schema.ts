import * as Yup from "yup";

const LoginSchema = Yup.object({
  user: Yup.string().required("Username is required"),
  pass: Yup.string().required("Password is required"),
});

export default LoginSchema;