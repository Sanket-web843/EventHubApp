import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";

function Login({ isOpen, onClose }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const userInfo = {
      email: data.email,
      password: data.password,
    };

    try {
      const res = await axios.post("http://localhost:4001/api/users/login", userInfo);

      if (res.data) {
        toast.success(res.data.message || "Login Successful!");
        
        sessionStorage.setItem("Users", JSON.stringify(res.data.user));
        if (res.data.token) {
          sessionStorage.setItem("token", res.data.token);
        }

        onClose(); // Close modal on success
        setTimeout(() => {
          window.location.reload(); // Reload to update UI state
        }, 1000);
      }
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An error occurred during login.");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Overlay Background with Blur */}
      <div 
        className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      ></div>
      
      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-[#1e293b] border border-gray-700 rounded-3xl p-8 shadow-2xl animate-zoomIn">
        
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Close (X) Button */}
          <button 
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>

          <h3 className="font-black text-3xl text-white mb-2 tracking-tighter">
            Login to <span className="text-purple-500">EventHub</span>
          </h3>
          <p className="text-gray-400 text-sm mb-8">Enter your credentials to manage your events.</p>

          <div className="space-y-2 mb-4">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Email Address</label>
            <input
              type="email"
              placeholder="sanket@example.com"
              autoComplete="email"
              className="w-full bg-slate-900 border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-all"
              {...register("email", { required: true })}
            />
            {errors.email && <span className="text-xs text-red-500 font-semibold ml-1">This field is required</span>}
          </div>

          <div className="space-y-2 mb-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full bg-slate-900 border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-all"
              {...register("password", { required: true })}
            />
            {errors.password && <span className="text-xs text-red-500 font-semibold ml-1">This field is required</span>}
          </div>

          <div className="flex justify-end mb-8">
            <span className="text-xs text-purple-400 hover:underline cursor-pointer font-bold">Forgot Password?</span>
          </div>

          <button 
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl transition-all transform active:scale-95 shadow-lg shadow-purple-500/20"
          >
            Log In
          </button>

          <p className="text-center text-gray-400 text-sm mt-8">
            Not registered?{" "}
            <Link 
              to="/signup" 
              onClick={onClose}
              className="text-purple-400 font-bold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;