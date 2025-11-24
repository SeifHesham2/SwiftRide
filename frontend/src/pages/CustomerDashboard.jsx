import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { tripAPI, complaintAPI, driverAPI } from '../services/api';
import { MapPin, Calendar, CreditCard, Clock, LogOut, RefreshCw, Trash2, User, ChevronRight, Star, AlertTriangle, Wallet, X, Map } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MapPicker from '../components/MapPicker';

const CustomerDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('active');

    const [booking, setBooking] = useState({
        pickup: '',
        destination: '',
        date: '',
        payment: 'CASH'
    });

    // Modal States
    const [complaintModal, setComplaintModal] = useState({ open: false, tripId: null, message: '' });
    const [paymentModal, setPaymentModal] = useState({ open: false, type: null, cardNumber: '', expiry: '', cvv: '', name: '', walletId: '', pin: '' });
    const [ratingModal, setRatingModal] = useState({ open: false, driverId: null, rating: 0, hoveredRating: 0, tripId: null });
    const [mapModal, setMapModal] = useState({ open: false, type: null, selectedLocation: null });
    const [suggestions, setSuggestions] = useState({ pickup: [], destination: [] });

    const handleSearch = async (query, type) => {
        setBooking(prev => ({ ...prev, [type]: query }));
        if (query.length < 3) {
            setSuggestions(prev => ({ ...prev, [type]: [] }));
            return;
        }
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
            const data = await response.json();
            setSuggestions(prev => ({ ...prev, [type]: data }));
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    };

    const selectSuggestion = (suggestion, type) => {
        setBooking(prev => ({ ...prev, [type]: suggestion.display_name }));
        setSuggestions(prev => ({ ...prev, [type]: [] }));
    };

    useEffect(() => {
        if (user?.id) fetchTrips();
    }, [activeTab, user]);

    const fetchTrips = async () => {
        setLoading(true);
        try {
            const apiCall = activeTab === 'active'
                ? tripAPI.getCustomerTrips(user.id)
                : tripAPI.getPreviousTrips(user.id);

            const response = await apiCall;
            if (activeTab === 'active') {
                const activeStatuses = ['REQUESTED', 'ACCEPTED', 'ONGOING'];
                setTrips(response.data.filter(t => activeStatuses.includes(t.status)));
            } else {
                setTrips(response.data);
            }
        } catch (error) {
            console.error(error);
            setTrips([]);
        } finally {
            setLoading(false);
        }
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        return parts.length ? parts.join(' ') : value;
    };

    const formatExpiry = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
        }
        return v;
    };

    const handleBook = async (e) => {
        e.preventDefault();
        if (!booking.date) return toast.error('Please select a date and time');
        if (!booking.pickup || !booking.destination) return toast.error('Please enter pickup and destination');

        if (booking.payment === 'WALLET' || booking.payment === 'CREDIT_CARD') {
            setPaymentModal({ open: true, type: booking.payment, cardNumber: '', expiry: '', cvv: '', name: '', walletId: '', pin: '' });
            return;
        }

        await confirmBooking();
    };

    const confirmBooking = async () => {
        try {
            const formattedDate = booking.date + ":00";
            await tripAPI.bookTrip(user.id, {
                pickupLocation: booking.pickup,
                destination: booking.destination,
                tripDate: formattedDate
            }, booking.payment);

            toast.success('Trip booked successfully!');
            setActiveTab('active');
            setBooking({ pickup: '', destination: '', date: '', payment: 'CASH' });
            setPaymentModal({ open: false, type: null, cardNumber: '', expiry: '', cvv: '', name: '', walletId: '', pin: '' });
            fetchTrips();
        } catch (error) {
            toast.error(error.message || 'Failed to book trip');
        }
    };

    const handleCancel = async (tripId) => {
        if (!confirm('Are you sure you want to cancel this trip?')) return;
        try {
            await tripAPI.cancelByCustomer(user.id, tripId);
            toast.success('Trip cancelled');
            fetchTrips();
        } catch (error) {
            toast.error(error.message || 'Failed to cancel trip');
        }
    };

    const handleRate = async () => {
        if (ratingModal.rating === 0) return toast.error('Please select a rating');
        try {
            await driverAPI.rateDriver(ratingModal.driverId, ratingModal.rating, ratingModal.tripId);
            toast.success('Driver rated successfully!');
            setRatingModal({ open: false, driverId: null, rating: 0, hoveredRating: 0, tripId: null });
            fetchTrips();
        } catch (error) {
            toast.error(error.message || 'Failed to rate driver');
        }
    };

    const handleSubmitComplaint = async (e) => {
        e.preventDefault();
        try {
            await complaintAPI.sendComplaint(user.id, complaintModal.tripId, complaintModal.message);
            toast.success('Complaint submitted');
            setComplaintModal({ open: false, tripId: null, message: '' });
        } catch (error) {
            toast.error(error.message || 'Failed to submit complaint');
        }
    };

    const openMapModal = (type) => {
        setMapModal({ open: true, type, selectedLocation: null });
    };

    const handleLocationSelect = (address, coords) => {
        setMapModal({ ...mapModal, selectedLocation: address });
    };

    const confirmLocationSelection = () => {
        if (!mapModal.selectedLocation) {
            return toast.error('Please select a location on the map');
        }

        if (mapModal.type === 'pickup') {
            setBooking({ ...booking, pickup: mapModal.selectedLocation });
        } else {
            setBooking({ ...booking, destination: mapModal.selectedLocation });
        }

        setMapModal({ open: false, type: null, selectedLocation: null });
        toast.success(`${mapModal.type === 'pickup' ? 'Pickup' : 'Destination'} location selected`);
    };

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden">
            <Toaster position="top-center" />

            {/* Background Decor */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] rounded-full bg-indigo-500/5 blur-3xl" />
                <div className="absolute top-[40%] -left-[10%] w-[600px] h-[600px] rounded-full bg-violet-500/5 blur-3xl" />
            </div>

            {/* Navbar */}
            <nav className="glass sticky top-0 z-50 px-6 py-4 border-b border-white/20">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                            <User size={20} className="text-white" />
                        </div>
                        SwiftRide
                    </h1>
                    <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                            <p className="font-semibold text-slate-800">{user?.firstName} {user?.lastName}</p>
                            <p className="text-xs text-slate-500 font-medium">Customer Account</p>
                        </div>
                        <button
                            onClick={() => { logout(); navigate('/'); }}
                            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 hover:text-red-500 transition-colors"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-6 grid lg:grid-cols-12 gap-8 relative z-10">

                {/* Booking Panel */}
                <div className="lg:col-span-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass p-6 rounded-3xl sticky top-28"
                    >
                        <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-indigo-600" />
                            Book a Ride
                        </h2>

                        <form onSubmit={handleBook} className="space-y-5">
                            <div className="relative z-20">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Pickup Location</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-indigo-600 ring-4 ring-indigo-50" />
                                    <input
                                        type="text"
                                        className="input pl-8 pr-10"
                                        placeholder="Enter pickup location"
                                        value={booking.pickup}
                                        onChange={e => handleSearch(e.target.value, 'pickup')}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => openMapModal('pickup')}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-colors"
                                        title="Select on map"
                                    >
                                        <Map className="w-4 h-4" />
                                    </button>
                                </div>
                                {suggestions.pickup.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 bg-white rounded-xl shadow-xl border border-slate-100 mt-2 overflow-hidden max-h-60 overflow-y-auto">
                                        {suggestions.pickup.map((item, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() => selectSuggestion(item, 'pickup')}
                                                className="w-full text-left px-4 py-3 hover:bg-indigo-50 text-sm text-slate-700 border-b border-slate-50 last:border-0 transition-colors flex items-start gap-2"
                                            >
                                                <MapPin className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                                                <span className="line-clamp-2">{item.display_name}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="relative z-10">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Destination</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-pink-500 ring-4 ring-pink-50" />
                                    <input
                                        type="text"
                                        className="input pl-8 pr-10"
                                        placeholder="Enter destination"
                                        value={booking.destination}
                                        onChange={e => handleSearch(e.target.value, 'destination')}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => openMapModal('destination')}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-pink-50 rounded-lg text-pink-600 transition-colors"
                                        title="Select on map"
                                    >
                                        <Map className="w-4 h-4" />
                                    </button>
                                </div>
                                {suggestions.destination.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 bg-white rounded-xl shadow-xl border border-slate-100 mt-2 overflow-hidden max-h-60 overflow-y-auto">
                                        {suggestions.destination.map((item, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() => selectSuggestion(item, 'destination')}
                                                className="w-full text-left px-4 py-3 hover:bg-pink-50 text-sm text-slate-700 border-b border-slate-50 last:border-0 transition-colors flex items-start gap-2"
                                            >
                                                <MapPin className="w-4 h-4 text-pink-400 mt-0.5 shrink-0" />
                                                <span className="line-clamp-2">{item.display_name}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Date & Time</label>
                                <div className="relative group">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-600 w-5 h-5 z-10 pointer-events-none" />
                                    <input
                                        type="datetime-local"
                                        className="input pl-11 text-slate-700 font-medium cursor-pointer
                                                   [&::-webkit-calendar-picker-indicator]:cursor-pointer 
                                                   [&::-webkit-calendar-picker-indicator]:opacity-0
                                                   [&::-webkit-calendar-picker-indicator]:absolute
                                                   [&::-webkit-calendar-picker-indicator]:inset-0
                                                   [&::-webkit-calendar-picker-indicator]:w-full
                                                   [&::-webkit-calendar-picker-indicator]:h-full
                                                   hover:border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                        value={booking.date}
                                        onChange={e => setBooking({ ...booking, date: e.target.value })}
                                        required
                                    />
                                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                                </div>
                                <p className="text-xs text-slate-500 mt-1.5 ml-1">Select your preferred date and time</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Payment Method</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { value: 'CASH', icon: '💵', label: 'Cash' },
                                        { value: 'WALLET', icon: '👛', label: 'Wallet' },
                                        { value: 'CREDIT_CARD', icon: '💳', label: 'Card' }
                                    ].map(method => (
                                        <button
                                            key={method.value}
                                            type="button"
                                            onClick={() => setBooking({ ...booking, payment: method.value })}
                                            className={`p-3 rounded-xl text-xs font-bold border transition-all duration-200 ${booking.payment === method.value
                                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/30 scale-105'
                                                : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:scale-102'
                                                }`}
                                        >
                                            <div className="text-xl mb-1">{method.icon}</div>
                                            {method.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary w-full mt-4">
                                Confirm Booking <ChevronRight size={16} />
                            </button>
                        </form>
                    </motion.div>
                </div>

                {/* Trips Panel - keeping the same as before, truncated for brevity */}
                <div className="lg:col-span-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex gap-1 bg-white/50 backdrop-blur-sm p-1 rounded-xl border border-white/20">
                            <button
                                onClick={() => setActiveTab('active')}
                                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'active' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Active Trips
                            </button>
                            <button
                                onClick={() => setActiveTab('history')}
                                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'history' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                History
                            </button>
                        </div>
                        <button
                            onClick={fetchTrips}
                            className="p-2.5 bg-white rounded-xl text-slate-500 hover:text-indigo-600 transition-colors shadow-sm border border-slate-100"
                        >
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {trips.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-16 glass rounded-3xl border-dashed border-2 border-slate-200"
                            >
                                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                                    <Clock className="w-10 h-10 text-slate-300" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-700">No trips found</h3>
                                <p className="text-slate-500">Your trip history will appear here</p>
                            </motion.div>
                        ) : (
                            trips.map((trip, index) => (
                                <motion.div
                                    key={trip.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="glass p-6 rounded-2xl hover:shadow-lg transition-shadow border border-white/40"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${trip.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                trip.status === 'ONGOING' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                    trip.status === 'ACCEPTED' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                        trip.status === 'REQUESTED' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                                                            'bg-rose-50 text-rose-600 border-rose-100'
                                                }`}>
                                                {trip.status}
                                            </span>
                                            <p className="text-xs text-slate-400 mt-2 font-medium ml-1">Trip ID #{trip.id}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-slate-800">
                                                {trip.fare ? trip.fare.toFixed(2) : '0.00'} <span className="text-sm text-slate-500 font-medium">EGP</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-4 relative pl-4 border-l-2 border-slate-100 ml-2">
                                            <div className="relative">
                                                <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-white shadow-sm" />
                                                <p className="text-sm font-semibold text-slate-900">{trip.pickupLocation}</p>
                                                <p className="text-xs text-slate-500">Pickup Location</p>
                                            </div>
                                            <div className="relative">
                                                <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full bg-pink-500 ring-4 ring-white shadow-sm" />
                                                <p className="text-sm font-semibold text-slate-900">{trip.destination}</p>
                                                <p className="text-xs text-slate-500">Destination</p>
                                            </div>
                                        </div>

                                        {trip.driver && (
                                            <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-100 flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-indigo-600 font-bold text-lg border border-slate-100">
                                                    {trip.driver.firstName[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">{trip.driver.firstName} {trip.driver.lastName}</p>
                                                    <p className="text-xs text-slate-500 font-medium">{trip.driver.phone}</p>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <Star size={12} className="fill-amber-400 text-amber-400" />
                                                        <span className="text-xs font-bold text-slate-700">{trip.driver.rating || 5.0}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-slate-100 flex gap-3">
                                        {activeTab === 'active' && trip.status === 'REQUESTED' && (
                                            <button
                                                onClick={() => handleCancel(trip.id)}
                                                className="flex-1 py-2.5 text-rose-600 hover:bg-rose-50 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 border border-transparent hover:border-rose-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Cancel Trip
                                            </button>
                                        )}

                                        {trip.status === 'COMPLETED' && (
                                            <>
                                                <button
                                                    onClick={() => setComplaintModal({ open: true, tripId: trip.id, message: '' })}
                                                    className="flex-1 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <AlertTriangle className="w-4 h-4" />
                                                    Report Issue
                                                </button>
                                                {trip.driver && (
                                                    trip.rated ? (
                                                        <button disabled className="flex-1 py-2.5 bg-slate-100 text-slate-400 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-not-allowed border border-slate-200">
                                                            <Star className="w-4 h-4 fill-slate-300 text-slate-300" />
                                                            Rated
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => setRatingModal({ open: true, driverId: trip.driver.id, rating: 0, hoveredRating: 0, tripId: trip.id })}
                                                            className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30"
                                                        >
                                                            <Star className="w-4 h-4" />
                                                            Rate Driver
                                                        </button>
                                                    )
                                                )}
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </main>

            {/* Map Modal */}
            <AnimatePresence>
                {mapModal.open && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-2xl p-6 w-full max-w-4xl shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-indigo-600" />
                                    Select {mapModal.type === 'pickup' ? 'Pickup' : 'Destination'} Location
                                </h3>
                                <button onClick={() => setMapModal({ open: false, type: null, selectedLocation: null })} className="p-1 hover:bg-slate-100 rounded-full">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <p className="text-sm text-slate-600 mb-4">Click anywhere on the map to select a location</p>

                            <MapPicker onLocationSelect={handleLocationSelect} />

                            {mapModal.selectedLocation && (
                                <div className="mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                                    <p className="text-sm font-medium text-indigo-900">Selected Location:</p>
                                    <p className="text-sm text-indigo-700 mt-1">{mapModal.selectedLocation}</p>
                                </div>
                            )}

                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={confirmLocationSelection}
                                    disabled={!mapModal.selectedLocation}
                                    className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Confirm Location
                                </button>
                                <button
                                    onClick={() => setMapModal({ open: false, type: null, selectedLocation: null })}
                                    className="btn btn-outline flex-1"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Payment Modal */}
            <AnimatePresence>
                {paymentModal.open && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    {paymentModal.type === 'WALLET' ? <Wallet className="w-5 h-5 text-indigo-600" /> : <CreditCard className="w-5 h-5 text-indigo-600" />}
                                    {paymentModal.type === 'WALLET' ? 'Wallet Payment' : 'Card Payment'}
                                </h3>
                                <button onClick={() => setPaymentModal({ open: false, type: null, cardNumber: '', expiry: '', cvv: '', name: '', walletId: '', pin: '' })} className="p-1 hover:bg-slate-100 rounded-full">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={(e) => { e.preventDefault(); confirmBooking(); }} className="space-y-4">
                                {paymentModal.type === 'WALLET' ? (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Wallet ID</label>
                                            <input
                                                type="text"
                                                className="input"
                                                placeholder="Enter your wallet ID"
                                                value={paymentModal.walletId}
                                                onChange={e => setPaymentModal({ ...paymentModal, walletId: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">PIN</label>
                                            <input
                                                type="password"
                                                className="input"
                                                placeholder="Enter PIN"
                                                maxLength={4}
                                                value={paymentModal.pin}
                                                onChange={e => setPaymentModal({ ...paymentModal, pin: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Card Number</label>
                                            <input
                                                type="text"
                                                className="input font-mono tracking-wider"
                                                placeholder="1234 5678 9012 3456"
                                                maxLength={19}
                                                value={paymentModal.cardNumber}
                                                onChange={e => setPaymentModal({ ...paymentModal, cardNumber: formatCardNumber(e.target.value) })}
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Expiry Date</label>
                                                <input
                                                    type="text"
                                                    className="input font-mono"
                                                    placeholder="MM/YY"
                                                    maxLength={5}
                                                    value={paymentModal.expiry}
                                                    onChange={e => setPaymentModal({ ...paymentModal, expiry: formatExpiry(e.target.value) })}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1.5">CVV</label>
                                                <input
                                                    type="password"
                                                    className="input font-mono"
                                                    placeholder="123"
                                                    maxLength={3}
                                                    value={paymentModal.cvv}
                                                    onChange={e => setPaymentModal({ ...paymentModal, cvv: e.target.value.replace(/\D/g, '') })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Cardholder Name</label>
                                            <input
                                                type="text"
                                                className="input uppercase"
                                                placeholder="JOHN DOE"
                                                value={paymentModal.name}
                                                onChange={e => setPaymentModal({ ...paymentModal, name: e.target.value.toUpperCase() })}
                                                required
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentModal({ open: false, type: null, cardNumber: '', expiry: '', cvv: '', name: '', walletId: '', pin: '' })}
                                        className="btn btn-outline flex-1"
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary flex-1">
                                        Confirm Payment
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Rating Modal - Same as before */}
            <AnimatePresence>
                {ratingModal.open && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-slate-800">Rate Your Driver</h3>
                                <button onClick={() => setRatingModal({ open: false, driverId: null, rating: 0, hoveredRating: 0, tripId: null })} className="p-1 hover:bg-slate-100 rounded-full">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="text-center mb-8">
                                <p className="text-slate-600 mb-6">How was your experience?</p>
                                <div className="flex justify-center gap-3">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRatingModal({ ...ratingModal, rating: star })}
                                            onMouseEnter={() => setRatingModal({ ...ratingModal, hoveredRating: star })}
                                            onMouseLeave={() => setRatingModal({ ...ratingModal, hoveredRating: 0 })}
                                            className="transition-transform hover:scale-125 active:scale-110"
                                        >
                                            <Star
                                                size={40}
                                                className={`transition-all ${star <= (ratingModal.hoveredRating || ratingModal.rating)
                                                    ? 'fill-amber-400 text-amber-400 drop-shadow-lg'
                                                    : 'text-slate-300'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                {ratingModal.rating > 0 && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-2xl font-bold text-amber-500 mt-4"
                                    >
                                        {ratingModal.rating} {ratingModal.rating === 1 ? 'Star' : 'Stars'}
                                    </motion.p>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRatingModal({ open: false, driverId: null, rating: 0, hoveredRating: 0, tripId: null })}
                                    className="btn btn-outline flex-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRate}
                                    disabled={ratingModal.rating === 0}
                                    className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Submit Rating
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Complaint Modal - Same as before */}
            <AnimatePresence>
                {complaintModal.open && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
                        >
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Report an Issue</h3>
                            <form onSubmit={handleSubmitComplaint}>
                                <textarea
                                    className="input min-h-[100px] mb-4"
                                    placeholder="Describe your issue..."
                                    value={complaintModal.message}
                                    onChange={e => setComplaintModal({ ...complaintModal, message: e.target.value })}
                                    required
                                />
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setComplaintModal({ open: false, tripId: null, message: '' })}
                                        className="btn btn-outline flex-1"
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary flex-1">
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomerDashboard;
