import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

function Profile() {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [user, setUser] = useState({
    fullname: "",
    email: "",
    college: "",
    collegeId: "",
    whatsapp_no: "",
    role: "",
  });
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileAndRegistrations = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const [profileRes, registrationsRes] = await Promise.all([
          axios.get("http://localhost:4001/api/users/profile", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:4001/api/registrations/my-registrations", {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        setUser(profileRes.data);
        setMyRegistrations(registrationsRes.data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch profile data");
        setLoading(false);
        if (error.response?.status === 401) navigate("/login");
      }
    };

    fetchProfileAndRegistrations();
  }, [navigate]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowVerifyModal(true);
  };

  const handleFinalUpdate = async () => {
    if (!oldPassword) {
      toast.error("Current password is required");
      return;
    }

    setUpdating(true);
    try {
      const token = sessionStorage.getItem("token");
      const updateData = { 
        ...user,
        oldPassword,
        newPassword: password 
      };

      const res = await axios.put("http://localhost:4001/api/users/profile", updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data) {
        toast.success("Profile updated successfully!");
        sessionStorage.setItem("Users", JSON.stringify(res.data.user));
        setPassword("");
        setOldPassword("");
        setShowVerifyModal(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] pt-28 pb-12 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 font-bold uppercase tracking-widest text-xs">
            <span className="text-lg">←</span> Back to Home
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side: Profile Card */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-[#1e293b] border border-gray-700 rounded-3xl p-8 text-center shadow-xl">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-black text-4xl shadow-2xl mx-auto mb-4 border-4 border-slate-700">
                {user.fullname?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-2xl font-black text-white truncate uppercase tracking-tighter">{user.fullname}</h2>
              <p className="text-purple-400 font-bold text-xs uppercase tracking-widest mt-1">
                {user.role} Account
              </p>
              
              <div className="mt-8 pt-8 border-t border-gray-700 space-y-4 text-left">
                <div>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Email Address</p>
                  <p className="text-sm text-gray-300 truncate">{user.email}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">College</p>
                  <p className="text-sm text-gray-300 truncate">{user.college}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">College/Student ID</p>
                  <p className="text-sm text-gray-300 font-mono">{user.collegeId}</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-[#1e293b] border border-gray-700 rounded-3xl p-6 shadow-xl">
               <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Events Joined</span>
                  <span className="text-2xl font-black text-purple-500">{myRegistrations.length}</span>
               </div>
            </div>
          </div>

          {/* Right Side: Tabs / Sections */}
          <div className="lg:col-span-2 space-y-8">
            {/* Edit Profile Form */}
            <div className="bg-[#1e293b] border border-gray-700 rounded-3xl p-8 shadow-xl">
              <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Edit <span className="text-purple-500">Profile</span></h3>
              <p className="text-gray-400 text-sm mb-8 pb-8 border-b border-gray-700">Update your registration details below.</p>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Full Name</label>
                  <input
                    type="text"
                    name="fullname"
                    autoComplete="name"
                    value={user.fullname}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-all font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={user.email}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-all font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">College Name</label>
                  <input
                    type="text"
                    name="college"
                    value={user.college}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-all font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">College/Student ID</label>
                  <input
                    type="text"
                    name="collegeId"
                    value={user.collegeId}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-all font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">WhatsApp No</label>
                  <input
                    type="text"
                    name="whatsapp_no"
                    autoComplete="tel"
                    value={user.whatsapp_no}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-all font-bold"
                  />
                </div>

                <div className="md:col-span-2 pt-4">
                  <button
                    type="submit"
                    className="w-full bg-white hover:bg-gray-200 text-black font-black py-4 rounded-xl transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2"
                  >
                    🚀 SAVE CHANGES
                  </button>
                </div>
              </form>
            </div>

            {/* --- VERIFICATION MODAL --- */}
            {showVerifyModal && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f172a]/95 backdrop-blur-md p-4">
                <div className="bg-[#1e293b] border border-gray-700 rounded-3xl p-8 shadow-2xl w-full max-w-md relative animate-fadeIn">
                  <button 
                    onClick={() => setShowVerifyModal(false)}
                    className="absolute right-6 top-6 text-gray-500 hover:text-white transition-colors"
                  >
                    ✕
                  </button>

                  <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Security <span className="text-purple-500">Check</span></h3>
                  <p className="text-gray-400 text-sm mb-8 pb-6 border-b border-gray-700">Please verify your identity to save changes.</p>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Current Password</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        autoComplete="current-password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full bg-slate-900 border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-all font-bold"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-purple-400 ml-1">New Password (Optional)</label>
                      <input
                        type="password"
                        placeholder="Leave blank to keep current"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-900 border border-purple-500/30 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-all font-bold"
                      />
                    </div>

                    <div className="pt-4 flex gap-4">
                      <button 
                        onClick={() => setShowVerifyModal(false)}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl transition-all active:scale-95 border border-gray-700"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleFinalUpdate}
                        disabled={updating}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-black py-4 rounded-xl transition-all active:scale-95 shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {updating ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                          "CONFIRM"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Registered Events Section */}
            <div className="bg-[#1e293b] border border-gray-700 rounded-3xl p-8 shadow-xl">
               <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tighter flex items-center gap-3">
                  🎟️ Your <span className="text-purple-500">Registered Events</span>
               </h3>

               {myRegistrations.length === 0 ? (
                  <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-dashed border-gray-700">
                     <span className="text-4xl block mb-2">🎈</span>
                     <p className="text-gray-500 font-bold">You haven't registered for any events yet.</p>
                     <Link to="/Event" className="text-purple-400 hover:underline text-sm font-bold mt-2 inline-block">Browse Events</Link>
                  </div>
               ) : (
                  <div className="space-y-4">
                     {myRegistrations.map((reg) => (
                        <div key={reg._id} className="bg-slate-900 border border-gray-700 rounded-2xl p-5 hover:border-purple-500/50 transition-colors group">
                           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                 <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                                    <img 
                                       src={reg.eventId?.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=200&auto=format&fit=crop"} 
                                       alt={reg.eventId?.title} 
                                       className="w-full h-full object-cover"
                                    />
                                 </div>
                                 <div>
                                    <h4 className="font-bold text-white uppercase group-hover:text-purple-400 transition-colors">{reg.eventId?.title}</h4>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                       <span>📅 {reg.eventId?.start_date}</span>
                                       <span>🕒 {reg.eventId?.start_time}</span>
                                       <span>📍 {reg.eventId?.venue}</span>
                                    </div>
                                 </div>
                              </div>
                              <div className="flex flex-col items-end">
                                 <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-2 ${reg.paymentStatus === 'Paid' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                                    {reg.paymentStatus}
                                 </span>
                                 <p className="text-[9px] text-gray-600 font-bold uppercase text-right leading-tight">
                                    To withdraw, contact:<br/>
                                    <span className="text-purple-400">{reg.eventId?.organizer} ({reg.eventId?.mobile_no})</span>
                                 </p>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
