import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios"; 
import toast from "react-hot-toast"; 
import Footer from "./Footer";

function Signup() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { college: "RIT", role: "Student" },
  });

  const password = watch("password", "");
  const selectedCollege = watch("college");

  const onSubmit = async (data) => {
    const userInfo = {
      role: data.role,
      fullname: data.fullName, 
      collegeId: data.studentId, 
      college: data.college === "Other" ? data.otherCollege : data.college,
      whatsapp_no: data.mobile, 
      email: data.email,
      password: data.password,
    };

    try {
      const res = await axios.post("http://localhost:4001/api/users/signup", userInfo);

      if (res.data) {
        toast.success(res.data.message || "Registration Successful!");
        
        sessionStorage.setItem("Users", JSON.stringify(res.data.user));
        if (res.data.token) {
          sessionStorage.setItem("token", res.data.token);
        }

        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      }
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="bg-[#0f172a] flex flex-col min-h-screen">
      {/* Main Content Area with padding for Navbar */}
      <div className="flex-grow flex items-center justify-center pt-28 pb-12 px-6">
        
        <div className="relative w-full max-w-2xl bg-[#1e293b] border border-gray-700 rounded-3xl p-8 shadow-2xl overflow-y-auto max-h-[95vh] scrollbar-hide animate-fadeIn">
          {/* THE "X" BUTTON */}
          <Link
            to="/"
            className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </Link>

          <form onSubmit={handleSubmit(onSubmit)}>
            <h3 className="font-black text-3xl text-white mb-2 tracking-tighter">
              Join <span className="text-purple-500">EventHub</span>
            </h3>
            <p className="text-gray-400 text-sm mb-8">Create your professional account.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ROLE BASED ACCESS CONTROL */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase text-purple-400 ml-1">
                  Register As
                </label>
                <select
                  className="w-full bg-slate-900 border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-all"
                  {...register("role", { required: true })}
                >
                  <option value="Student">Student (View & Join Events)</option>
                  <option value="Organizer">Organizer (Create & Manage Events)</option>
                </select>
              </div>

              {/* FULL NAME */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500 ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Sanket Pawar"
                  autoComplete="name"
                  className={`w-full bg-slate-900 border ${
                    errors.fullName ? "border-red-500" : "border-gray-700"
                  } rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-all`}
                  {...register("fullName", {
                    required: "Name is required",
                    minLength: { value: 3, message: "Too short" },
                  })}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-[10px] uppercase font-bold ml-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* STUDENT ID */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500 ml-1">
                  Student ID / Employee ID
                </label>
                <input
                  type="text"
                  placeholder="2023MCA001"
                  className={`w-full bg-slate-900 border ${
                    errors.studentId ? "border-red-500" : "border-gray-700"
                  } rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-all`}
                  {...register("studentId", { required: "ID is required" })}
                />
                {errors.studentId && (
                  <p className="text-red-500 text-[10px] uppercase font-bold ml-1">
                    {errors.studentId.message}
                  </p>
                )}
              </div>

              {/* COLLEGE SELECTION */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500 ml-1">
                  College
                </label>
                <select
                  className="w-full bg-slate-900 border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-all"
                  {...register("college")}
                >
                  <option value="RIT">RIT (Rajarambapu Institute of Technology)</option>
                  <option value="Other">Other (Enter Manually)</option>
                </select>
              </div>

              {/* CONDITIONAL MANUAL COLLEGE FIELD */}
              {selectedCollege === "Other" && (
                <div className="space-y-1 animate-fadeIn">
                  <label className="text-xs font-bold uppercase text-purple-400 ml-1">
                    Enter College Name
                  </label>
                  <input
                    type="text"
                    placeholder="University Name"
                    className="w-full bg-slate-900 border border-purple-500/50 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-all"
                    {...register("otherCollege", { required: "College name is required" })}
                  />
                </div>
              )}

              {/* WHATSAPP VALIDATION */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500 ml-1">
                  WhatsApp No (10 Digits)
                </label>
                <input
                  type="tel"
                  placeholder="9876543210"
                  className={`w-full bg-slate-900 border ${
                    errors.mobile ? "border-red-500" : "border-gray-700"
                  } rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-all`}
                  {...register("mobile", {
                    required: "Number is required",
                    pattern: { value: /^[0-9]{10}$/, message: "Must be 10 digits" },
                  })}
                />
                {errors.mobile && (
                  <p className="text-red-500 text-[10px] uppercase font-bold ml-1">
                    {errors.mobile.message}
                  </p>
                )}
              </div>

              {/* EMAIL VALIDATION */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500 ml-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="sanket@ritindia.edu"
                  autoComplete="email"
                  className={`w-full bg-slate-900 border ${
                    errors.email ? "border-red-500" : "border-gray-700"
                  } rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-all`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email format" },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-[10px] uppercase font-bold ml-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* PASSWORD */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500 ml-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={`w-full bg-slate-900 border ${
                    errors.password ? "border-red-500" : "border-gray-700"
                  } rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-all`}
                  {...register("password", {
                    required: "Required",
                    minLength: { value: 6, message: "Min 6 chars" },
                  })}
                />
                {errors.password && (
                  <p className="text-red-500 text-[10px] uppercase font-bold ml-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500 ml-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={`w-full bg-slate-900 border ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-700"
                  } rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-all`}
                  {...register("confirmPassword", {
                    required: "Required",
                    validate: (val) => val === password || "Passwords don't match",
                  })}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-[10px] uppercase font-bold ml-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-4 rounded-xl mt-10 transition-all active:scale-95 shadow-lg"
            >
              CREATE ACCOUNT
            </button>
            <p className="text-center text-gray-400 text-sm mt-6">
              Already have an account?{" "}
              <Link to="/?login=true" className="text-purple-400 font-bold hover:underline">
                Log In
              </Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Signup;