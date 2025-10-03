import React, { useState } from "react";
import { useFormik } from "formik";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import LoginSchema from "@/validators/login-schema";
import { useAuth } from "@/hooks/auth-hook";
import AuthController from "@/controllers/authController";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { isLoading, handlePrimaryLogin } = useAuth();

  const formik = useFormik({
    initialValues: {
      user: "",
      pass: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      try{
        console.log("Login Data:", values);
        await handlePrimaryLogin(values);
        await AuthController.sessionApi(values);
      }catch(error){
        console.log(error);
      }
    },
  });

  return (
    <div className="relative h-screen w-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/assets/banner/auth-banner.png')" }}>
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>

      <div className="relative flex flex-col items-center justify-center bg-transparent backdrop-blur-md shadow-lg p-4 sm:p-6 md:p-8 lg:p-10 w-[95%] sm:w-[85%] md:w-[75%] max-w-full">
        <div className="w-full max-w-[400px]">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
            <img
              src="/assets/auth-icons/location.png"
              alt="Auth Location"
              className="w-8 h-8 sm:w-10 sm:h-10 object-cover"
            />
            <h1 className="text-base sm:text-lg font-semibold text-gray-800">Logo Here</h1>
          </div>

          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Username */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3 max-w-full">
                  <img src="/assets/auth-icons/user.png" alt="User Icon" className="w-2.5 sm:w-3 h-auto object-cover" />
                </div>
                <Input
                  id="user"
                  name="user"
                  type="text"
                  placeholder="Username"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.user}
                  className="w-full pl-6 sm:pl-8 pr-3 py-2 text-sm sm:text-base border rounded-md"
                />
              </div>
              {formik.touched.user && formik.errors.user && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {formik.errors.user}
                </p>
              )}
            </div>

            <div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3 max-w-full">
                  <img src="/assets/auth-icons/lock.png" alt="Lock Icon" className="w-2.5 sm:w-3 h-auto object-cover" />
                </span>
                <Input
                  id="pass"
                  name="pass"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.pass}
                  className="w-full pl-6 sm:pl-8 pr-10 py-2 text-sm sm:text-base border rounded-md"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3">
                  {showPassword ? (
                    <Eye size={18} className="sm:w-5 sm:h-5" color="#04003A" />
                  ) : (
                    <EyeOff size={18} className="sm:w-5 sm:h-5" color="#04003A" />
                  )}
                </button>
              </div>

              {formik.touched.pass && formik.errors.pass && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {formik.errors.pass}
                </p>
              )}
            </div>

            <div className="text-right">
              <Link to="#" className="text-xs sm:text-sm font-semibold text-[#04003A]">
                Forget Password Reset ?
              </Link>
            </div>

            <Button type="submit" className="w-full rounded-none bg-[#04003A] text-white py-2 text-sm sm:text-base">
              {isLoading ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : "Login"}
            </Button>

            <div className="flex items-end justify-end mt-4">
              <select className="border px-3 sm:px-4 py-1 rounded-none text-xs sm:text-sm">
                <option value="ENG">ENG</option>
                <option value="URDU">URDU</option>
              </select>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;