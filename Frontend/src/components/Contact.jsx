import React from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer"; // Added Footer import
import { useForm } from "react-hook-form";

function Contact() {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  // Pre-fill form if user is logged in
  React.useEffect(() => {
    const userStr = sessionStorage.getItem("Users");
    if (userStr) {
      const user = JSON.parse(userStr);
      setValue("name", user.fullname || "");
      setValue("email", user.email || "");
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      await axios.post('http://localhost:4001/api/feedbacks/submit', data);
      alert("Thanks for reaching out! We will get back to you soon.");
      reset(); // Clear form after submit
    } catch (error) {
      alert("Failed to send message. Please try again later.");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#0f172a] pt-32 pb-20 px-6">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row gap-12">
          
          {/* Left Side - Info */}
          <div className="w-full md:w-1/2 space-y-8">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Let's <span className="text-purple-500">Connect</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              Have questions about an upcoming event? Want to partner with EventHub? Drop us a message and our RIT team will get back to you.
            </p>
            
            <div className="space-y-6 pt-6">
              <div className="flex items-center gap-4">
                <div className="bg-slate-800 p-4 rounded-xl text-purple-500 text-xl">📧</div>
                <div>
                  <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Email Us</p>
                  <p className="text-white text-lg font-medium">support@riteventhub.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-slate-800 p-4 rounded-xl text-purple-500 text-xl">📞</div>
                <div>
                  <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Call Us</p>
                  <p className="text-white text-lg font-medium">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-slate-800 p-4 rounded-xl text-purple-500 text-xl">📍</div>
                <div>
                  <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Visit Us</p>
                  <p className="text-white text-lg font-medium">Rajarambapu Institute of Technology</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full md:w-1/2">
            <div className="bg-[#1e293b] border border-gray-700 rounded-3xl p-8 shadow-2xl">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" autoComplete="off">
                
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-500 ml-1">Your Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe" 
                    autoComplete="name"
                    className="w-full bg-slate-900 border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-all"
                    {...register("name", { required: true })}
                  />
                  {errors.name && <span className="text-xs text-red-500 font-semibold">Name is required</span>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-500 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com" 
                    autoComplete="email"
                    className="w-full bg-slate-900 border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-all"
                    {...register("email", { required: true })}
                  />
                  {errors.email && <span className="text-xs text-red-500 font-semibold">Email is required</span>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-500 ml-1">Your Message</label>
                  <textarea 
                    rows="4"
                    placeholder="How can we help you?" 
                    className="w-full bg-slate-900 border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-all resize-none"
                    {...register("message", { required: true })}
                  ></textarea>
                  {errors.message && <span className="text-xs text-red-500 font-semibold">Message is required</span>}
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition-all transform active:scale-95 shadow-lg shadow-purple-500/20"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
      <Footer /> {/* Footer added at the bottom */}
    </>
  );
}

export default Contact;