import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const OrganizerDashboard = () => {
  const [activeTab, setActiveTab] = useState('events'); // 'events', 'participants', 'form'
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('all');
  const [participants, setParticipants] = useState([]);
  const [paymentFilter, setPaymentFilter] = useState('All'); // 'All', 'Free', 'Paid'

  const [editingEvent, setEditingEvent] = useState(null);
  const [showOtherCategory, setShowOtherCategory] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [banners, setBanners] = useState([]);
  const [newBanners, setNewBanners] = useState([{ imageUrl: '', altText: '' }]);
  
  const predefinedCategories = ['Technical', 'Cultural', 'Sports', 'Online', 'Workshop', 'Seminar'];
  
  // Default empty form state
  const initialFormState = {
    title: '',
    description: '',
    organizer: '',
    mobile_no: '',
    venue: '',
    price: 0,
    category: '',
    image: '',
    media_link: '',
    start_date: '',
    start_time: '',
    deadline: ''
  };
  
  const [formData, setFormData] = useState(initialFormState);

  // Helper to get auth headers
  const getHeaders = () => {
    const token = sessionStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // Fetch organizer's events
  const fetchEvents = async () => {
    try {
      const res = await axios.get('http://localhost:4001/api/events/organizer/events', getHeaders());
      setEvents(res.data);
    } catch (error) {
      toast.error('Failed to load your events');
    }
  };

  useEffect(() => {
    const userStr = sessionStorage.getItem('Users');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      setIsAdmin(user.role === 'Admin');
      setFormData(prev => ({ ...prev, organizer: user.fullname || '' }));
      
      if (user.role === 'Admin') {
        setActiveTab('overview');
        fetchAdminData();
      }
    }
    fetchEvents();
  }, []);

  const fetchAdminData = async () => {
    try {
      const headers = getHeaders();
      const [statsRes, usersRes, feedbackRes, bannerRes] = await Promise.all([
        axios.get('http://localhost:4001/api/admin/stats', headers),
        axios.get('http://localhost:4001/api/admin/users', headers),
        axios.get('http://localhost:4001/api/feedbacks/all', headers),
        axios.get('http://localhost:4001/api/banners/all', headers)
      ]);
      setStats(statsRes.data);
      setAllUsers(usersRes.data);
      setFeedbacks(feedbackRes.data);
      setBanners(bannerRes.data);
    } catch (error) {
      console.error("Error fetching admin data", error);
    }
  };

  const handleApproveOrganizer = async (userId) => {
    if (!window.confirm("Are you sure you want to approve this organizer?")) return;
    if (!window.confirm("Double check: This will grant them permission to create events on the platform. Proceed?")) return;
    
    try {
      await axios.put(`http://localhost:4001/api/admin/approve/${userId}`, {}, getHeaders());
      toast.success('Organizer approved');
      fetchAdminData();
    } catch (error) {
      toast.error('Failed to approve');
    }
  };

  const handleRemoveUser = async (userId) => {
    if (!window.confirm("This will permanently delete the user and all their events. Continue?")) return;
    if (!window.confirm("Are you absolutely sure? This action CANNOT be undone!")) return;
    
    try {
      await axios.delete(`http://localhost:4001/api/admin/users/${userId}`, getHeaders());
      toast.success('User removed');
      fetchAdminData();
      fetchEvents();
    } catch (error) {
      toast.error('Failed to remove user');
    }
  };

  const handleAddBanner = async (e) => {
    e.preventDefault();
    
    // Filter out completely empty rows
    const validBanners = newBanners.filter(b => b.imageUrl.trim() !== '');
    
    if (validBanners.length === 0) {
      toast.error('Please provide at least one valid image URL');
      return;
    }

    try {
      // Send multiple requests in parallel
      await Promise.all(validBanners.map(banner => 
        axios.post('http://localhost:4001/api/banners/add', banner, getHeaders())
      ));
      
      toast.success(`${validBanners.length} Banner(s) added successfully`);
      setNewBanners([{ imageUrl: '', altText: '' }]); // Reset form
      fetchAdminData();
    } catch (error) {
      toast.error('Failed to add some or all banners');
    }
  };

  const updateNewBanner = (index, field, value) => {
    const updated = [...newBanners];
    updated[index][field] = value;
    setNewBanners(updated);
  };

  const addBannerFieldRow = () => {
    setNewBanners([...newBanners, { imageUrl: '', altText: '' }]);
  };

  const removeBannerFieldRow = (index) => {
    if (newBanners.length > 1) {
      const updated = newBanners.filter((_, i) => i !== index);
      setNewBanners(updated);
    }
  };

  const handleDeleteBanner = async (id) => {
    try {
      await axios.delete(`http://localhost:4001/api/banners/${id}`, getHeaders());
      toast.success('Banner deleted');
      fetchAdminData();
    } catch (error) {
      toast.error('Failed to delete banner');
    }
  };

  const handleDeleteFeedback = async (id) => {
    try {
      await axios.delete(`http://localhost:4001/api/feedbacks/${id}`, getHeaders());
      toast.success('Feedback deleted');
      fetchAdminData();
    } catch (error) {
      toast.error('Failed to delete feedback');
    }
  };

  // Fetch participants when an event is selected or "All Events" is active
  useEffect(() => {
    if (activeTab === 'participants') {
      const fetchParticipants = async () => {
        try {
          const endpoint = selectedEventId === 'all' 
            ? 'http://localhost:4001/api/registrations/all-participants'
            : `http://localhost:4001/api/registrations/event/${selectedEventId}/participants`;
            
          const res = await axios.get(endpoint, getHeaders());
          setParticipants(res.data);
        } catch (error) {
          toast.error('Failed to load participants');
        }
      };
      fetchParticipants();
    }
  }, [selectedEventId, activeTab]);

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await axios.delete(`http://localhost:4001/api/events/${id}`, getHeaders());
      setEvents(events.filter(e => e._id !== id));
      toast.success('Event deleted');
      if (selectedEventId === id) setSelectedEventId('');
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  const handleEditClick = (event) => {
    setEditingEvent(event._id);
    
    // Format date for the input field if it's a full Date string
    let formattedDeadline = '';
    if (event.deadline) {
      const d = new Date(event.deadline);
      if (!isNaN(d.getTime())) {
        formattedDeadline = d.toISOString().split('T')[0];
      } else {
        formattedDeadline = event.deadline;
      }
    }

    setFormData({
      title: event.title,
      description: event.description,
      organizer: event.organizer,
      mobile_no: event.mobile_no,
      venue: event.venue,
      price: event.price,
      category: event.category,
      image: event.image || '',
      media_link: event.media_link || '',
      start_date: event.start_date,
      start_time: event.start_time,
      deadline: event.deadline ? new Date(event.deadline).toISOString().split('T')[0] : '',
    });

    if (event.category && !predefinedCategories.includes(event.category)) {
      setShowOtherCategory(true);
    } else {
      setShowOtherCategory(false);
    }

    setEditingEvent(event);
    setActiveTab('form');
  };

  const handleCreateNewClick = () => {
    setEditingEvent(null);
    setFormData(initialFormState);
    if (currentUser) {
      setFormData(prev => ({ ...prev, organizer: currentUser.fullname || '' }));
    }
    setShowOtherCategory(false);
    setActiveTab('form');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'category') {
      if (value === 'Other') {
        setShowOtherCategory(true);
        setFormData(prev => ({ ...prev, category: '' }));
        return;
      } else {
        setShowOtherCategory(false);
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = getHeaders();
      if (editingEvent) {
        await axios.put(`http://localhost:4001/api/events/${editingEvent._id}`, formData, headers);
        toast.success('Event updated successfully');
      } else {
        await axios.post('http://localhost:4001/api/events/add', formData, headers);
        toast.success('Event created successfully');
      }
      setActiveTab('events');
      fetchEvents();
      setFormData(initialFormState);
      setEditingEvent(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save event');
    }
  };

  const handleRemoveParticipant = async (regId, eventId) => {
    if (!window.confirm("Remove this participant?")) return;
    try {
      // Use the specific eventId passed to the function, not the state selectedEventId
      await axios.delete(`http://localhost:4001/api/registrations/event/${eventId}/participants/${regId}`, getHeaders());
      setParticipants(participants.filter(p => p._id !== regId));
      toast.success('Participant removed');
    } catch (error) {
      toast.error('Failed to remove participant');
    }
  };

  const filteredParticipants = participants.filter(p => {
    if (paymentFilter === 'All') return true;
    return p.paymentStatus === paymentFilter;
  });

  // Calculate total collection for the selected event
  const selectedEventInfo = events.find(e => e._id === selectedEventId);
  const totalEarned = selectedEventInfo && selectedEventInfo.price > 0
    ? participants.filter(p => p.paymentStatus === 'Paid').length * selectedEventInfo.price
    : 0;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-4 pb-4 md:px-8 md:pb-8 pt-32 md:pt-40 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      <Toaster />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-400 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent uppercase tracking-tighter drop-shadow-2xl">
            {isAdmin ? '🛡️ Admin Control Center' : '✨ Organizer Dashboard'}
          </h1>
          {!isAdmin && currentUser && !currentUser.isApproved && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-5 py-2.5 rounded-2xl text-sm font-black animate-pulse shadow-[0_0_15px_rgba(234,179,8,0.2)]">
              ⚠️ Status: Waiting for Admin Approval
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto space-x-3 mb-10 pb-2 scrollbar-hide">
          {isAdmin ? (
            <>
              <button className={`px-6 py-2.5 font-bold rounded-xl transition-all whitespace-nowrap shadow-lg ${activeTab === 'overview' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white scale-105' : 'bg-slate-800/80 text-gray-400 hover:text-white hover:bg-slate-700'}`} onClick={() => setActiveTab('overview')}>Overview</button>
              <button className={`px-6 py-2.5 font-bold rounded-xl transition-all whitespace-nowrap shadow-lg ${activeTab === 'users' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white scale-105' : 'bg-slate-800/80 text-gray-400 hover:text-white hover:bg-slate-700'}`} onClick={() => setActiveTab('users')}>Users & Approvals</button>
              <button className={`px-6 py-2.5 font-bold rounded-xl transition-all whitespace-nowrap shadow-lg ${activeTab === 'events' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white scale-105' : 'bg-slate-800/80 text-gray-400 hover:text-white hover:bg-slate-700'}`} onClick={() => setActiveTab('events')}>All Events</button>
              <button className={`px-6 py-2.5 font-bold rounded-xl transition-all whitespace-nowrap shadow-lg ${activeTab === 'feedbacks' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white scale-105' : 'bg-slate-800/80 text-gray-400 hover:text-white hover:bg-slate-700'}`} onClick={() => setActiveTab('feedbacks')}>Feedbacks</button>
              <button className={`px-6 py-2.5 font-bold rounded-xl transition-all whitespace-nowrap shadow-lg ${activeTab === 'banners' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white scale-105' : 'bg-slate-800/80 text-gray-400 hover:text-white hover:bg-slate-700'}`} onClick={() => setActiveTab('banners')}>Banners</button>
            </>
          ) : (
            <>
              <button className={`px-6 py-2.5 font-bold rounded-xl transition-all whitespace-nowrap shadow-lg ${activeTab === 'events' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white scale-105' : 'bg-slate-800/80 text-gray-400 hover:text-white hover:bg-slate-700'}`} onClick={() => setActiveTab('events')}>My Events</button>
              <button className={`px-6 py-2.5 font-bold rounded-xl transition-all whitespace-nowrap shadow-lg ${activeTab === 'participants' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white scale-105' : 'bg-slate-800/80 text-gray-400 hover:text-white hover:bg-slate-700'}`} onClick={() => setActiveTab('participants')}>Manage Participants</button>
              <button className={`px-6 py-2.5 font-bold rounded-xl transition-all whitespace-nowrap shadow-lg ${activeTab === 'form' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white scale-105' : 'bg-slate-800/80 text-gray-400 hover:text-white hover:bg-slate-700'}`} onClick={handleCreateNewClick}>{editingEvent ? '✏️ Edit Event' : '✨ Create Event'}</button>
            </>
          )}
        </div>

        {/* ADMIN OVERVIEW TAB */}
        {isAdmin && activeTab === 'overview' && (
          <div className="animate-fadeIn space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Users', value: stats?.totalUsers || 0, icon: '👥', color: 'blue' },
                { label: 'Live Events', value: stats?.totalEvents || 0, icon: '📅', color: 'purple' },
                { label: 'Registrations', value: stats?.totalRegistrations || 0, icon: '✅', color: 'green' },
                { label: 'Feedbacks', value: stats?.totalFeedbacks || 0, icon: '💬', color: 'yellow' },
              ].map((stat, i) => (
                <div key={i} className={`bg-slate-800 border border-gray-700 p-6 rounded-3xl shadow-xl border-l-4 border-l-${stat.color}-500`}>
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-gray-400 text-xs font-black uppercase tracking-widest">{stat.label}</div>
                  <div className="text-3xl font-black text-white">{stat.value}</div>
                </div>
              ))}
            </div>

            <div className="bg-slate-800 border border-gray-700 rounded-3xl p-8">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => setActiveTab('users')} className="bg-purple-600 px-6 py-2 rounded-xl font-bold">Review Pending Organizers</button>
                <button onClick={() => setActiveTab('banners')} className="bg-slate-700 px-6 py-2 rounded-xl font-bold">Manage Homepage Banners</button>
              </div>
            </div>
          </div>
        )}

        {/* ADMIN USERS TAB */}
        {isAdmin && activeTab === 'users' && (
          <div className="animate-fadeIn space-y-8">
            <div className="bg-slate-800 border border-gray-700 rounded-3xl p-8">
              <h2 className="text-2xl font-black mb-6 uppercase tracking-tight">Pending Approvals (Organizers)</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-gray-500 text-xs uppercase font-black">
                    <tr>
                      <th className="pb-4">Name</th>
                      <th className="pb-4">Email</th>
                      <th className="pb-4">College</th>
                      <th className="pb-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {allUsers.filter(u => u.role === 'Organizer' && !u.isApproved).map(u => (
                      <tr key={u._id} className="group">
                        <td className="py-4 font-bold">{u.fullname}</td>
                        <td className="py-4 text-gray-400">{u.email}</td>
                        <td className="py-4 text-gray-400 text-sm">{u.college}</td>
                        <td className="py-4 text-right">
                          <button onClick={() => handleApproveOrganizer(u._id)} className="bg-green-500/20 text-green-400 border border-green-500/30 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-green-500 hover:text-white transition-all">Approve</button>
                        </td>
                      </tr>
                    ))}
                    {allUsers.filter(u => u.role === 'Organizer' && !u.isApproved).length === 0 && (
                      <tr><td colSpan="4" className="py-8 text-center text-gray-500 italic">No pending organizers</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-slate-800 border border-gray-700 rounded-3xl p-8">
              <h2 className="text-2xl font-black mb-6 uppercase tracking-tight">User Directory</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-gray-500 text-xs uppercase font-black">
                    <tr>
                      <th className="pb-4">User</th>
                      <th className="pb-4">Role</th>
                      <th className="pb-4">College/ID</th>
                      <th className="pb-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {allUsers.map(u => (
                      <tr key={u._id} className="group">
                        <td className="py-4">
                          <div className="font-bold">{u.fullname}</div>
                          <div className="text-[10px] text-gray-500">{u.email}</div>
                        </td>
                        <td className="py-4">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${u.role === 'Admin' ? 'bg-red-500/20 text-red-400' : u.role === 'Organizer' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="text-xs text-gray-400">{u.college}</div>
                          <div className="text-[10px] text-gray-600">{u.collegeId}</div>
                        </td>
                        <td className="py-4 text-right">
                          {u.role !== 'Admin' && (
                            <button onClick={() => handleRemoveUser(u._id)} className="text-red-400 hover:text-red-600 p-2">🗑️</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ADMIN FEEDBACKS TAB */}
        {isAdmin && activeTab === 'feedbacks' && (
          <div className="animate-fadeIn space-y-6">
            <h2 className="text-2xl font-black uppercase tracking-tight">User Feedbacks & Messages</h2>
            {feedbacks.length === 0 ? (
              <div className="text-center py-20 text-gray-500 italic bg-slate-800 rounded-3xl">No messages yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {feedbacks.map(f => (
                  <div key={f._id} className="bg-slate-800 border border-gray-700 p-6 rounded-3xl relative group">
                    <button onClick={() => handleDeleteFeedback(f._id)} className="absolute top-4 right-4 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">✕</button>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-400 font-bold">
                        {f.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold">{f.name}</div>
                        <div className="text-xs text-gray-500">{f.email}</div>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm italic">"{f.message}"</p>
                    <div className="mt-4 text-[10px] text-gray-600 uppercase font-black">{new Date(f.createdAt).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ADMIN BANNERS TAB */}
        {isAdmin && activeTab === 'banners' && (
          <div className="animate-fadeIn space-y-8">
            <div className="bg-slate-800 border border-gray-700 rounded-3xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black uppercase tracking-tight">Add Homepage Banners</h2>
                <button 
                  onClick={addBannerFieldRow}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                >
                  + Add Another Image Row
                </button>
              </div>
              <form onSubmit={handleAddBanner} className="space-y-4">
                {newBanners.map((banner, index) => (
                  <div key={index} className="flex flex-col md:flex-row gap-4 items-start">
                    <span className="bg-slate-900 text-gray-500 font-black px-3 py-3 rounded-xl border border-gray-700 flex-shrink-0">#{index + 1}</span>
                    <input 
                      type="text" 
                      placeholder="Image URL (e.g. /my-banner.png or https://...)" 
                      className="flex-grow bg-slate-900 border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500"
                      value={banner.imageUrl}
                      onChange={(e) => updateNewBanner(index, 'imageUrl', e.target.value)}
                      required
                    />
                    <input 
                      type="text" 
                      placeholder="Alt Text (Optional)" 
                      className="bg-slate-900 border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500"
                      value={banner.altText}
                      onChange={(e) => updateNewBanner(index, 'altText', e.target.value)}
                    />
                    {newBanners.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeBannerFieldRow(index)}
                        className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-4 py-3 rounded-xl transition-colors font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                
                <div className="pt-4 border-t border-gray-700 flex justify-end">
                  <button type="submit" className="bg-purple-600 px-8 py-3 rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20 active:scale-95">
                    Upload All Banners
                  </button>
                </div>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {banners.map(b => (
                <div key={b._id} className="bg-slate-800 border border-gray-700 rounded-3xl overflow-hidden group relative">
                  <img src={b.imageUrl} alt={b.altText} className="w-full h-40 object-cover" />
                  <div className="p-4 flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-bold truncate max-w-[200px]">{b.altText}</span>
                    <button onClick={() => handleDeleteBanner(b._id)} className="bg-red-500/10 text-red-400 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-all">🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'events' && (
          <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{isAdmin ? 'All Platform Events' : 'Your Managed Events'}</h2>
              {!isAdmin && (
                <button 
                  onClick={handleCreateNewClick}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-purple-500/20 active:scale-95"
                >
                  + Create New Event
                </button>
              )}
            </div>

            {events.length === 0 ? (
              <div className="text-center py-20 bg-slate-800 rounded-3xl border border-dashed border-gray-700">
                <span className="text-5xl block mb-4">📅</span>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">No events found.</p>
                {!isAdmin && <p className="text-gray-600 text-xs mt-2">Start by creating your first event!</p>}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(event => (
                  <div key={event._id} className="bg-slate-800 border border-gray-700 rounded-2xl p-6 shadow-xl hover:border-purple-500/50 transition-colors group">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-xl font-black uppercase tracking-tight text-white group-hover:text-purple-400 transition-colors">{event.title}</h3>
                      <div className="flex flex-col items-end gap-1">
                        <span className="bg-slate-900 text-xs text-gray-400 px-2 py-1 rounded-md border border-gray-700 font-mono">#{event.eventId}</span>
                        {new Date(event.deadline) < new Date() && (
                          <span className="bg-red-500/10 text-red-500 text-[8px] font-black px-1.5 py-0.5 rounded border border-red-500/20 uppercase tracking-tighter animate-pulse">Retired</span>
                        )}
                      </div>
                    </div>
                    {isAdmin && (
                      <div className="text-[10px] text-purple-500 font-bold uppercase mb-2">By: {event.organizer}</div>
                    )}
                    
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{event.description}</p>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-xs text-gray-500 gap-2 font-bold">
                        <span>📅 {event.start_date}</span>
                        <span>🕒 {event.start_time}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 gap-2 font-bold">
                        <span>📍 {event.venue}</span>
                        <span className="text-purple-400">💰 {event.price === 0 ? 'FREE' : `₹${event.price}`}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditClick(event)}
                        className="flex-1 bg-slate-900 hover:bg-slate-700 text-white py-2 rounded-xl text-xs font-bold transition-all border border-gray-700"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteEvent(event._id)}
                        className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-2 rounded-xl transition-all border border-red-500/20"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'form' && (
          <div className="animate-fadeIn bg-slate-800 border border-gray-700 rounded-3xl p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-700">
              <h2 className="text-3xl font-black uppercase tracking-tighter">
                {editingEvent ? '✏️ Edit' : '✨ Create'} <span className="text-purple-500">Event</span>
              </h2>
              <button onClick={() => setActiveTab('events')} className="text-gray-400 hover:text-white text-sm font-bold">✕ Cancel</button>
            </div>

            {(!isAdmin && currentUser && !currentUser.isApproved) ? (
              <div className="text-center py-20 bg-slate-900 rounded-3xl border border-gray-700">
                <span className="text-5xl block mb-4">⌛</span>
                <h3 className="text-2xl font-black uppercase mb-2">Approval Pending</h3>
                <p className="text-gray-400 max-w-md mx-auto">Your organizer account is currently waiting for admin verification. You'll be able to create events as soon as you're approved!</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Basic Info */}
                <div className="space-y-2 lg:col-span-3">
                  <label className="text-xs font-bold uppercase text-gray-500 ml-1">Event Title</label>
                  <input type="text" name="title" required value={formData.title} onChange={handleFormChange} placeholder="Hackathon 2026" className="w-full bg-slate-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none" />
                </div>
                
                <div className="space-y-2 lg:col-span-3">
                  <label className="text-xs font-bold uppercase text-gray-500 ml-1">Description</label>
                  <textarea name="description" required rows="3" value={formData.description} onChange={handleFormChange} placeholder="What is this event about?" className="w-full bg-slate-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none resize-none" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-500 ml-1">Venue</label>
                  <input type="text" name="venue" required value={formData.venue} onChange={handleFormChange} placeholder="College Auditorium" className="w-full bg-slate-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-500 ml-1">Contact No (WhatsApp)</label>
                  <input type="tel" name="mobile_no" required value={formData.mobile_no} onChange={handleFormChange} placeholder="10 Digit Number" className="w-full bg-slate-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-500 ml-1">Organizer Name</label>
                  <input type="text" name="organizer" required value={formData.organizer} onChange={handleFormChange} className="w-full bg-slate-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none" />
                </div>

                {/* Categories & Price */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-500 ml-1">Category</label>
                  <select 
                    name="category" 
                    required={!showOtherCategory} 
                    value={showOtherCategory ? 'Other' : formData.category} 
                    onChange={handleFormChange} 
                    className="w-full bg-slate-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none"
                  >
                    <option value="">Select Category</option>
                    <option value="Technical">Technical</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Sports">Sports</option>
                    <option value="Online">Online</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Other">Other (Type below)</option>
                  </select>

                  {showOtherCategory && (
                    <div className="mt-3 animate-fadeIn">
                      <input 
                        type="text" 
                        name="category" 
                        required 
                        value={formData.category} 
                        onChange={handleFormChange} 
                        placeholder="Enter custom category(e.g.eSports)" 
                        className="w-full bg-slate-900 border border-purple-500/50 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none"
                      />
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-500 ml-1">Registration Fee (₹)</label>
                  <input type="number" name="price" required value={formData.price} onChange={handleFormChange} placeholder="0 for Free" className="w-full bg-slate-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none" />
                </div>

                {/* Media */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-500 ml-1">Banner Image URL</label>
                  <input type="text" name="image" value={formData.image} onChange={handleFormChange} placeholder="Paste image link here" className="w-full bg-slate-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-500 ml-1">Promo Video (YT Link)</label>
                  <input type="text" name="media_link" value={formData.media_link} onChange={handleFormChange} placeholder="Optional YouTube link" className="w-full bg-slate-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none" />
                </div>

                {/* Schedule */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-500 ml-1">Start Date</label>
                  <input type="date" name="start_date" required value={formData.start_date} onChange={handleFormChange} className="w-full bg-slate-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-500 ml-1">Start Time</label>
                  <input type="time" name="start_time" required value={formData.start_time} onChange={handleFormChange} className="w-full bg-slate-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-purple-400 ml-1">Registration Deadline</label>
                  <input type="date" name="deadline" required value={formData.deadline} onChange={handleFormChange} className="w-full bg-slate-900 border border-purple-500/30 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none" />
                </div>
              </div>

              <div className="pt-6">
                <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-4 rounded-2xl transition-all active:scale-95 shadow-xl shadow-purple-500/20 uppercase tracking-widest">
                  {editingEvent ? '🚀 Update Event' : '🚢 Launch Event'}
                </button>
              </div>

            </form>
            )}
          </div>
        )}

        {activeTab === 'participants' && (
          <div className="animate-fadeIn space-y-6">
            <div className="bg-slate-800 border border-gray-700 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-500 ml-1">Select Event</label>
                  <select 
                    value={selectedEventId} 
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className="bg-slate-900 border border-gray-700 rounded-xl px-4 py-2 text-sm text-white focus:border-purple-500 outline-none"
                  >
                    <option value="all">All Managed Events</option>
                    {events.map(e => (
                      <option key={e._id} value={e._id}>{e.title}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-500 ml-1">Payment Status</label>
                  <div className="flex bg-slate-900 p-1 rounded-xl border border-gray-700">
                    {['All', 'Free', 'Paid'].map(type => (
                      <button 
                        key={type}
                        onClick={() => setPaymentFilter(type)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${paymentFilter === type ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-8 text-right">
                <div>
                  <div className="text-[10px] font-black uppercase text-gray-500 mb-1">Total Registrations</div>
                  <div className="text-3xl font-black text-white leading-none">{filteredParticipants.length}</div>
                </div>
                {selectedEventInfo && selectedEventInfo.price > 0 && (
                  <div>
                    <div className="text-[10px] font-black uppercase text-green-500 mb-1">Total Collection</div>
                    <div className="text-3xl font-black text-green-400 leading-none">₹{totalEarned}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-800 border border-gray-700 rounded-3xl p-4 md:p-8 shadow-xl">
              <h2 className="text-2xl font-black mb-6 uppercase tracking-tight">Participant Roster</h2>
              
              {filteredParticipants.length === 0 ? (
                <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-dashed border-gray-700">
                  <p className="text-gray-500 font-bold">No participants found for this filter.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-gray-700 scrollbar-thin scrollbar-thumb-gray-700">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead className="bg-slate-900 text-white">
                      <tr className="border-b border-gray-700 text-gray-400 text-[10px] uppercase tracking-widest font-black">
                        <th className="py-4 px-4 whitespace-nowrap">Participant</th>
                        {selectedEventId === 'all' && <th className="py-4 px-4 whitespace-nowrap">Event</th>}
                        <th className="py-4 px-4 whitespace-nowrap">College & ID</th>
                        <th className="py-4 px-4 whitespace-nowrap">WhatsApp</th>
                        <th className="py-4 px-4 whitespace-nowrap">Payment</th>
                        <th className="py-4 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                      {filteredParticipants.map(p => {
                        // Extract event ID for removal
                        const actualEventId = p.eventId?._id || selectedEventId;
                        
                        return (
                          <tr key={p._id} className="hover:bg-slate-700/30 transition-colors group">
                            <td className="py-4 px-4">
                              <div className="font-bold text-white group-hover:text-purple-400 transition-colors truncate max-w-[150px]">{p.userId?.fullname || 'Unknown User'}</div>
                              <div className="text-[10px] text-gray-500 mt-0.5 truncate max-w-[150px]">{p.userId?.email}</div>
                            </td>
                            {selectedEventId === 'all' && (
                              <td className="py-4 px-4">
                                <div className="text-[10px] font-bold text-purple-300 bg-purple-500/10 px-2 py-1 rounded-lg border border-purple-500/20 w-fit truncate max-w-[100px]">
                                  {p.eventId?.title || 'Unknown Event'}
                                </div>
                              </td>
                            )}
                            <td className="py-4 px-4">
                              <div className="text-xs text-gray-200 truncate max-w-[120px]">{p.userId?.college || 'N/A'}</div>
                              <div className="text-[10px] text-purple-500 font-mono mt-0.5">{p.userId?.collegeId || 'N/A'}</div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-1">
                                <span className="text-green-500 text-[10px]">💬</span>
                                <span className="text-xs font-bold text-gray-300">{p.userId?.whatsapp_no || 'N/A'}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${p.paymentStatus === 'Paid' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                                {p.paymentStatus}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <button
                                onClick={() => handleRemoveParticipant(p._id, actualEventId)}
                                className="text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-2 py-1 rounded-md text-[10px] font-bold transition-colors border border-red-500/20"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboard;
