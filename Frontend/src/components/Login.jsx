import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // Simulate session storage
    const user = { email: data.email, name: "Student" };
    localStorage.setItem("Users", JSON.stringify(user));
    
    // Close modal and refresh to update Navbar state
    document.getElementById("my_modal_3").close();
    alert("Login Successful!");
    window.location.reload(); 
    
  };
 

  return (
    <div>
      <dialog id="my_modal_3" className="modal backdrop-blur-sm">
        <div className="modal-box bg-[#1e293b] border border-gray-700 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Close Button */}
            <button 
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-gray-400"
              onClick={() => document.getElementById("my_modal_3").close()}
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
              <Link to="/signup" className="text-purple-400 font-bold hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </dialog>
    </div>
  );
}

export default Login;