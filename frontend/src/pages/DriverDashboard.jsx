import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { tripAPI, customerAPI, driverAPI } from '../services/api';
import { MapPin, Clock, LogOut, RefreshCw, CheckCircle, Play, Square, Car, Star, DollarSign, Activity, Sun, Moon, Camera, User } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const DriverDashboard = () => {
    const { user, logout, updateUser } = useAuth();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [trips, setTrips] = useState([]);
    const [activeTripsCount, setActiveTripsCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('available'); // available, active
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (user?.id) {
            fetchTrips();
            fetchActiveTripsCount();
        }
    }, [activeTab, user]);

    const fetchTrips = async () => {
        setLoading(true);
        try {
            const apiCall = activeTab === 'available'
                ? tripAPI.getRequestedTrips()
                : tripAPI.getActiveTrips(user.id);

            const response = await apiCall;
            setTrips(response.data);
        } catch (error) {
            if (error.response?.status !== 404) {
                console.error(error);
            } else {
                setTrips([]);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchActiveTripsCount = async () => {
        try {
            const response = await tripAPI.getActiveTrips(user.id);
            setActiveTripsCount(response.data.length);
        } catch (error) {
            setActiveTripsCount(0);
        }
    };

    const handleAction = async (action, tripId) => {
        try {
            let response;
            if (action === 'accept') {
                response = await tripAPI.acceptTrip(user.id, tripId);
                // Send email notification
                if (response.data && response.data.customer) {
                    try {
                        await customerAPI.sendAcceptanceEmail(response.data.customer.id, user.id, tripId);
                        toast.success('Customer notified via email');
                    } catch (emailError) {
                        console.error('Failed to send email', emailError);
                    }
                }
            }
            if (action === 'start') await tripAPI.startTrip(user.id, tripId);
            if (action === 'end') await tripAPI.endTrip(user.id, tripId);
            if (action === 'cancel') await tripAPI.cancelByDriver(user.id, tripId);

            toast.success(`Trip ${action}ed successfully!`);
            fetchTrips();
            fetchActiveTripsCount(); // Update active trips count
            if (action === 'accept') setActiveTab('active');
        } catch (error) {
            toast.error(`Failed to ${action} trip: ${error.message || 'Unknown error'}`);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }

        setUploading(true);
        try {
            const response = await driverAPI.uploadPhoto(user.id, file);
            toast.success('Profile photo updated successfully!');
            // Update user context with new image URL
            if (response.data.imageUrl) {
                updateUser({ imageUrl: response.data.imageUrl });
            }
        } catch (error) {
            toast.error('Failed to upload photo: ' + (error.message || 'Unknown error'));
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-900 relative overflow-hidden transition-colors">
            <Toaster position="top-center" />

            {/* Background Decor */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] rounded-full bg-indigo-500/5 blur-3xl" />
                <div className="absolute top-[40%] -left-[10%] w-[600px] h-[600px] rounded-full bg-violet-500/5 blur-3xl" />
            </div>

            {/* Navbar */}
            <nav className="glass sticky top-0 z-50 px-6 py-4 border-b border-white/20 dark:border-gray-700/50">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                            <Car size={20} className="text-white" />
                        </div>
                        SwiftRide Driver
                    </h1>
                    <div className="flex items-center gap-6">
                        {/* Profile Photo Upload */}
                        <div className="relative group">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoUpload}
                                className="hidden"
                                id="driver-photo-upload"
                                disabled={uploading}
                            />
                            <label
                                htmlFor="driver-photo-upload"
                                className="cursor-pointer block relative"
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg overflow-hidden border-2 border-white dark:border-gray-700">
                                    {user?.imageUrl ? (
                                        <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={20} />
                                    )}
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-indigo-600 rounded-full p-1 shadow-md group-hover:scale-110 transition-transform">
                                    {uploading ? (
                                        <RefreshCw size={10} className="text-white animate-spin" />
                                    ) : (
                                        <Camera size={10} className="text-white" />
                                    )}
                                </div>
                            </label>
                        </div>
                        <div className="text-right hidden sm:block">
                            <p className="font-semibold text-slate-800 dark:text-white">{user?.firstName} {user?.lastName}</p>
                            <div className="flex items-center justify-end gap-1 text-xs text-slate-500 dark:text-gray-400 font-medium">
                                <span>Driver</span>
                                <span>•</span>
                                <span className="flex items-center text-amber-500 gap-0.5">
                                    {user?.rating || 5.0} <Star size={10} fill="currentColor" />
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-full text-slate-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mr-2"
                            title="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={() => { logout(); navigate('/'); }}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-full text-slate-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto p-6 relative z-10">

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-6 mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass p-6 rounded-3xl border border-white/40 dark:border-gray-700/50"
                    >
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
                                <DollarSign size={24} />
                            </div>
                            <p className="text-slate-500 dark:text-gray-400 text-sm font-medium">Today's Earnings</p>
                        </div>
                        <p className="text-3xl font-bold text-slate-800 dark:text-white mt-2">0 <span className="text-sm text-slate-400 dark:text-gray-500 font-normal">EGP</span></p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass p-6 rounded-3xl border border-white/40"
                    >
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
                                <Activity size={24} />
                            </div>
                            <p className="text-slate-500 dark:text-gray-400 text-sm font-medium">Active Trips</p>
                        </div>
                        <p className="text-3xl font-bold text-slate-800 dark:text-white mt-2">
                            {activeTripsCount}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass p-6 rounded-3xl border border-white/40"
                    >
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
                                <Star size={24} fill="currentColor" />
                            </div>
                            <p className="text-slate-500 dark:text-gray-400 text-sm font-medium">Rating</p>
                        </div>
                        <p className="text-3xl font-bold text-slate-800 dark:text-white mt-2">{user?.rating || 5.0}</p>
                    </motion.div>
                </div>

                {/* Tabs */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex gap-1 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-1 rounded-xl border border-white/20 dark:border-gray-700/50">
                        <button
                            onClick={() => setActiveTab('available')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'available' ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200'
                                }`}
                        >
                            Available Trips
                        </button>
                        <button
                            onClick={() => setActiveTab('active')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'active' ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200'
                                }`}
                        >
                            My Active Trips
                        </button>
                    </div>
                    <button
                        onClick={fetchTrips}
                        className="p-2.5 bg-white dark:bg-gray-800 rounded-xl text-slate-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-sm border border-slate-100 dark:border-gray-700"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {/* Trips List */}
                <div className="grid gap-6">
                    {trips.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-16 glass rounded-3xl border-dashed border-2 border-slate-200 dark:border-gray-700"
                        >
                            <div className="bg-slate-50 dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                                <Clock className="w-10 h-10 text-slate-300 dark:text-gray-600" />
                            </div>
                            <p className="text-slate-500 dark:text-gray-400 font-medium">
                                {activeTab === 'available' ? 'No trips available nearby' : 'No active trips'}
                            </p>
                        </motion.div>
                    ) : (
                        trips.map((trip, index) => (
                            <motion.div
                                key={trip.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass p-8 rounded-3xl hover:shadow-xl transition-all border border-white/40 dark:border-gray-700/50 group"
                            >
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${trip.status === 'ONGOING' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                            trip.status === 'ACCEPTED' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                'bg-slate-100 text-slate-600 border-slate-200'
                                            }`}>
                                            {trip.status}
                                        </span>
                                        {/* <p className="text-xs text-slate-400 mt-3 font-medium ml-1">Trip ID #{trip.id}</p> */}
                                        <div className="mt-3 space-y-1">
                                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-gray-400">
                                                <Clock size={12} />
                                                <span>Scheduled: {formatDate(trip.tripDate)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <Activity size={12} />
                                                <span>Requested: {formatDate(trip.createdAt)}</span>
                                            </div>
                                            {trip.estimatedMinutes > 0 && (
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <Clock size={12} />
                                                    <span>Est. Duration: {trip.estimatedMinutes} min</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-bold text-emerald-600">
                                            {trip.fare ? trip.fare.toFixed(2) : '0.00'} <span className="text-sm text-slate-500 dark:text-gray-400 font-medium">EGP</span>
                                        </p>
                                        <p className="text-xs text-slate-400 dark:text-gray-500 font-medium mt-1">Estimated Fare</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8 mb-8">
                                    <div className="space-y-6 relative pl-6 border-l-2 border-slate-100 dark:border-gray-700 ml-2">
                                        <div className="relative">
                                            <div className="absolute -left-[29px] top-1.5 w-4 h-4 rounded-full bg-indigo-600 ring-4 ring-white shadow-sm" />
                                            <p className="text-base font-semibold text-slate-900 dark:text-white">{trip.pickupLocation}</p>
                                            <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">Pickup Location</p>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute -left-[29px] top-1.5 w-4 h-4 rounded-full bg-pink-500 ring-4 ring-white shadow-sm" />
                                            <p className="text-base font-semibold text-slate-900 dark:text-white">{trip.destination}</p>
                                            <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">Destination</p>
                                        </div>
                                    </div>

                                    {trip.customer && (
                                        <div className="bg-slate-50/80 dark:bg-gray-800/50 p-5 rounded-2xl border border-slate-100 dark:border-gray-700">
                                            <p className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider mb-3">Passenger</p>
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-700 shadow-sm border border-slate-100 dark:border-gray-600 flex items-center justify-center text-slate-600 dark:text-gray-300 font-bold text-lg">
                                                    {trip.customer.firstName[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800 dark:text-white">{trip.customer.firstName} {trip.customer.lastName}</p>
                                                    <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">{trip.customer.phone}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4 pt-6 border-t border-slate-100/50 dark:border-gray-700/50">
                                    {activeTab === 'available' && (
                                        <button
                                            onClick={() => handleAction('accept', trip.id)}
                                            className="btn btn-primary flex-1 py-3.5 text-base shadow-lg shadow-indigo-500/20"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                            Accept Trip
                                        </button>
                                    )}

                                    {activeTab === 'active' && trip.status === 'ACCEPTED' && (
                                        <>
                                            <button
                                                onClick={() => handleAction('start', trip.id)}
                                                className="btn bg-blue-600 text-white hover:bg-blue-700 flex-1 py-3.5 text-base shadow-lg shadow-blue-500/20"
                                            >
                                                <Play className="w-5 h-5" />
                                                Start Trip
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm('Are you sure you want to cancel this trip?')) {
                                                        handleAction('cancel', trip.id);
                                                    }
                                                }}
                                                className="btn bg-red-50 text-red-600 hover:bg-red-100 py-3.5 px-4 rounded-xl transition-colors"
                                                title="Cancel Trip"
                                            >
                                                <LogOut className="w-5 h-5" />
                                            </button>
                                        </>
                                    )}



                                    {activeTab === 'active' && trip.status === 'ONGOING' && (
                                        <button
                                            onClick={() => handleAction('end', trip.id)}
                                            className="btn bg-emerald-600 text-white hover:bg-emerald-700 flex-1 py-3.5 text-base shadow-lg shadow-emerald-500/20"
                                        >
                                            <Square className="w-5 h-5" />
                                            End Trip
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </main >
        </div >
    );
};

export default DriverDashboard;
