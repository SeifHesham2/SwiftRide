import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { employeeAPI, carAPI, complaintAPI, driverAPI } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { Briefcase, LogOut, UserPlus, Car, AlertTriangle, ArrowLeft, RefreshCw, Trash2, CheckCircle, XCircle, Sun, Moon, Search } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

const EmployeeDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [activeModule, setActiveModule] = useState('hub');

    // State
    const [cars, setCars] = useState([]);
    const [availableCars, setAvailableCars] = useState([]);
    const [driversWithoutCar, setDriversWithoutCar] = useState([]);
    const [complaints, setComplaints] = useState({ new: [], open: [], closed: [] });
    const [loading, setLoading] = useState(false);

    // Search states
    const [carSearch, setCarSearch] = useState('');
    const [driverSearch, setDriverSearch] = useState('');
    const [assignCarSearch, setAssignCarSearch] = useState('');
    const [assignDriverSearch, setAssignDriverSearch] = useState('');

    // Forms
    const [driverForm, setDriverForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '', licenseNumber: '' });
    const [carForm, setCarForm] = useState({ model: '', licensePlate: '', color: '' });
    const [assignForm, setAssignForm] = useState({ carId: '', driverId: '' });

    const fetchCars = async () => {
        setLoading(true);
        try {
            const [all, available] = await Promise.all([
                carAPI.getAllCars(),
                carAPI.getAvailableCars()
            ]);
            setCars(all.data);
            setAvailableCars(available.data);

            // Fetch drivers without car
            const driversResp = await driverAPI.getDriversWithoutCar();
            setDriversWithoutCar(driversResp.data || []);
        } catch (e) {
            toast.error(e.message || 'Failed to load cars');
        } finally {
            setLoading(false);
        }
    };

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const [n, o, c] = await Promise.all([
                complaintAPI.getByStatus('NEW'),
                complaintAPI.getByStatus('OPENED'),
                complaintAPI.getByStatus('CLOSED')
            ]);
            setComplaints({ new: n.data, open: o.data, closed: c.data });
        } catch (e) {
            toast.error(e.message || 'Failed to load complaints');
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterDriver = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await employeeAPI.registerDriver(driverForm);
            toast.success('Driver registered successfully');
            setDriverForm({ firstName: '', lastName: '', email: '', password: '', phone: '', licenseNumber: '' });
            // Refresh drivers list if on cars module
            if (activeModule === 'cars') fetchCars();
        } catch (e) {
            toast.error(e.message || 'Failed to register driver');
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterCar = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await carAPI.registerCar(carForm);
            toast.success('Car registered successfully');
            setCarForm({ model: '', licensePlate: '', color: '' });
            fetchCars();
        } catch (e) {
            toast.error(e.message || 'Failed to register car');
        } finally {
            setLoading(false);
        }
    };

    const handleAssignCar = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await carAPI.assignCar(assignForm.carId, assignForm.driverId);
            toast.success('Car assigned successfully');
            setAssignForm({ carId: '', driverId: '' });
            setAssignCarSearch('');
            setAssignDriverSearch('');
            fetchCars();
        } catch (e) {
            toast.error(e.message || 'Failed to assign car');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCar = async (carId) => {
        if (!confirm('Are you sure you want to delete this car?')) return;
        setLoading(true);
        try {
            await carAPI.deleteCar(carId);
            toast.success('Car deleted successfully');
            fetchCars();
        } catch (e) {
            toast.error(e.message || 'Failed to delete car');
        } finally {
            setLoading(false);
        }
    };

    const handleComplaintAction = async (action, id) => {
        setLoading(true);
        try {
            if (action === 'open') await complaintAPI.openComplaint(id);
            if (action === 'close') await complaintAPI.closeComplaint(id);
            toast.success(`Complaint ${action}ed`);
            fetchComplaints();
        } catch (e) {
            toast.error(e.message || `Failed to ${action} complaint`);
        } finally {
            setLoading(false);
        }
    };

    // Filtering logic
    const filteredCars = cars.filter(car =>
        car.licensePlate.toLowerCase().includes(carSearch.toLowerCase())
    );

    const filteredAvailableCars = availableCars.filter(car =>
        car.licensePlate.toLowerCase().includes(assignCarSearch.toLowerCase())
    );

    const filteredDriversWithoutCar = driversWithoutCar.filter(driver =>
        driver.email.toLowerCase().includes(assignDriverSearch.toLowerCase())
    );

    const renderHub = () => (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
                {
                    title: 'Register Driver',
                    icon: UserPlus,
                    gradient: 'from-blue-500 to-cyan-500',
                    id: 'drivers',
                    description: 'Add new drivers to the system'
                },
                {
                    title: 'Manage Cars',
                    icon: Car,
                    gradient: 'from-indigo-500 to-purple-500',
                    id: 'cars',
                    description: 'Register and assign vehicles'
                },
                {
                    title: 'Manage Complaints',
                    icon: AlertTriangle,
                    gradient: 'from-rose-500 to-pink-500',
                    id: 'complaints',
                    description: 'Handle customer complaints'
                }
            ].map((item) => (
                <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                        setActiveModule(item.id);
                        if (item.id === 'cars') fetchCars();
                        if (item.id === 'complaints') fetchComplaints();
                    }}
                    className="glass p-8 rounded-3xl text-left group border border-white/40 dark:border-slate-700/40 hover:border-white/60 dark:hover:border-slate-600/60 transition-all shadow-lg hover:shadow-xl dark:bg-slate-800/50"
                >
                    <div className={`bg-gradient-to-br ${item.gradient} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow`}>
                        <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
                    <div className="flex items-center text-indigo-600 dark:text-indigo-400 font-semibold text-sm mt-4 group-hover:gap-2 transition-all">
                        Open Module <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </div>
                </motion.button>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50 dark:from-slate-900 dark:via-indigo-950/30 dark:to-slate-900 relative overflow-hidden transition-colors duration-300">
            <Toaster position="top-center" />

            {/* Background Decor */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] rounded-full bg-indigo-500/10 blur-3xl" />
                <div className="absolute top-[40%] -left-[10%] w-[600px] h-[600px] rounded-full bg-violet-500/10 blur-3xl" />
            </div>

            {/* Navbar */}
            <nav className="glass sticky top-0 z-50 px-6 py-4 border-b border-white/20 dark:border-slate-700/50 backdrop-blur-xl dark:bg-slate-800/50">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-xl shadow-lg">
                            <Briefcase size={20} className="text-white" />
                        </div>
                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            SwiftRide Employee Portal
                        </span>
                    </h1>
                    <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                            <p className="font-semibold text-slate-800 dark:text-white">{user?.firstName} {user?.lastName}</p>
                            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Employee</p>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mr-2"
                            title="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={() => { logout(); navigate('/'); }}
                            className="p-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto p-6 relative z-10">
                {activeModule !== 'hub' && (
                    <button
                        onClick={() => setActiveModule('hub')}
                        className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-colors font-medium group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </button>
                )}

                {activeModule === 'hub' && renderHub()}

                {activeModule === 'drivers' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass p-8 rounded-3xl max-w-2xl mx-auto shadow-xl dark:bg-slate-800/50 dark:border-slate-700"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-xl">
                                <UserPlus className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Register New Driver</h2>
                        </div>
                        <form onSubmit={handleRegisterDriver} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">First Name</label>
                                    <input type="text" placeholder="John" required className="input dark:bg-slate-900/50 dark:border-slate-700 dark:text-white dark:placeholder-slate-500" value={driverForm.firstName} onChange={e => setDriverForm({ ...driverForm, firstName: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Last Name</label>
                                    <input type="text" placeholder="Doe" required className="input dark:bg-slate-900/50 dark:border-slate-700 dark:text-white dark:placeholder-slate-500" value={driverForm.lastName} onChange={e => setDriverForm({ ...driverForm, lastName: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                                <input type="email" placeholder="john.doe@example.com" required className="input dark:bg-slate-900/50 dark:border-slate-700 dark:text-white dark:placeholder-slate-500" value={driverForm.email} onChange={e => setDriverForm({ ...driverForm, email: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                                <input type="password" placeholder="••••••••" required className="input dark:bg-slate-900/50 dark:border-slate-700 dark:text-white dark:placeholder-slate-500" value={driverForm.password} onChange={e => setDriverForm({ ...driverForm, password: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Phone</label>
                                <input type="text" placeholder="+20 123 456 7890" required className="input dark:bg-slate-900/50 dark:border-slate-700 dark:text-white dark:placeholder-slate-500" value={driverForm.phone} onChange={e => setDriverForm({ ...driverForm, phone: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">License Number</label>
                                <input type="text" placeholder="ABC123456" required className="input dark:bg-slate-900/50 dark:border-slate-700 dark:text-white dark:placeholder-slate-500" value={driverForm.licenseNumber} onChange={e => setDriverForm({ ...driverForm, licenseNumber: e.target.value })} />
                            </div>
                            <button type="submit" disabled={loading} className="btn btn-primary w-full mt-2">
                                {loading ? 'Registering...' : 'Register Driver'}
                            </button>
                        </form>
                    </motion.div>
                )}

                {activeModule === 'cars' && (
                    <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="glass p-6 rounded-3xl shadow-lg dark:bg-slate-800/50 dark:border-slate-700"
                            >
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                    <Car className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                    Register Car
                                </h3>
                                <form onSubmit={handleRegisterCar} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Model</label>
                                        <input type="text" placeholder="Toyota Corolla" required className="input dark:bg-slate-900/50 dark:border-slate-700 dark:text-white dark:placeholder-slate-500" value={carForm.model} onChange={e => setCarForm({ ...carForm, model: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">License Plate</label>
                                        <input type="text" placeholder="ABC 1234" required className="input dark:bg-slate-900/50 dark:border-slate-700 dark:text-white dark:placeholder-slate-500" value={carForm.licensePlate} onChange={e => setCarForm({ ...carForm, licensePlate: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Color</label>
                                        <select
                                            required
                                            className="input dark:bg-slate-900/50 dark:border-slate-700 dark:text-white"
                                            value={carForm.color}
                                            onChange={e => setCarForm({ ...carForm, color: e.target.value })}
                                        >
                                            <option value="">Select Color</option>
                                            {['White', 'Black', 'Silver', 'Grey', 'Red', 'Blue', 'Brown', 'Green', 'Beige', 'Yellow', 'Orange', 'Gold'].map(color => (
                                                <option key={color} value={color}>{color}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button type="submit" disabled={loading} className="btn btn-primary w-full">
                                        {loading ? 'Registering...' : 'Register Car'}
                                    </button>
                                </form>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="glass p-6 rounded-3xl shadow-lg dark:bg-slate-800/50 dark:border-slate-700"
                            >
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                    <UserPlus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                    Assign Car to Driver
                                </h3>
                                <form onSubmit={handleAssignCar} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Select Car</label>
                                        {/* Search Input for Cars */}
                                        <div className="relative mb-2">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Search by license plate..."
                                                className="input pl-9 py-2 text-sm dark:bg-slate-900/50 dark:border-slate-700 dark:text-white dark:placeholder-slate-500"
                                                value={assignCarSearch}
                                                onChange={e => setAssignCarSearch(e.target.value)}
                                            />
                                        </div>
                                        <select required className="input dark:bg-slate-900/50 dark:border-slate-700 dark:text-white" value={assignForm.carId} onChange={e => setAssignForm({ ...assignForm, carId: e.target.value })}>
                                            <option value="">Choose a car...</option>
                                            {filteredAvailableCars.map(c => (
                                                <option key={c.id} value={c.id}>
                                                    {c.model} ({c.licensePlate}) - {c.color}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{filteredAvailableCars.length} available cars found</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Select Driver</label>
                                        {/* Search Input for Drivers */}
                                        <div className="relative mb-2">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Search by email..."
                                                className="input pl-9 py-2 text-sm dark:bg-slate-900/50 dark:border-slate-700 dark:text-white dark:placeholder-slate-500"
                                                value={assignDriverSearch}
                                                onChange={e => setAssignDriverSearch(e.target.value)}
                                            />
                                        </div>
                                        <select required className="input dark:bg-slate-900/50 dark:border-slate-700 dark:text-white" value={assignForm.driverId} onChange={e => setAssignForm({ ...assignForm, driverId: e.target.value })}>
                                            <option value="">Choose a driver...</option>
                                            {filteredDriversWithoutCar.map(d => (
                                                <option key={d.id} value={d.id}>
                                                    {d.firstName} {d.lastName} - {d.email}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{filteredDriversWithoutCar.length} drivers without cars found</p>
                                    </div>
                                    <button type="submit" disabled={loading} className="btn btn-primary w-full">
                                        {loading ? 'Assigning...' : 'Assign Car'}
                                    </button>
                                </form>
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass p-6 rounded-3xl shadow-lg dark:bg-slate-800/50 dark:border-slate-700"
                        >
                            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white">All Cars</h3>
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <div className="relative flex-1 sm:w-64">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Search by license plate..."
                                            className="input pl-9 dark:bg-slate-900/50 dark:border-slate-700 dark:text-white dark:placeholder-slate-500"
                                            value={carSearch}
                                            onChange={e => setCarSearch(e.target.value)}
                                        />
                                    </div>
                                    <button onClick={fetchCars} disabled={loading} className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-colors">
                                        <RefreshCw className={`w-5 h-5 text-indigo-600 dark:text-indigo-400 ${loading ? 'animate-spin' : ''}`} />
                                    </button>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredCars.length === 0 ? (
                                    <p className="text-slate-400 col-span-full text-center py-8">No cars found</p>
                                ) : (
                                    filteredCars.map(car => (
                                        <div key={car.id} className="p-4 border-2 border-slate-100 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 hover:shadow-md transition-all hover:border-indigo-100 dark:hover:border-indigo-900/50">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <span className="font-bold text-slate-800 dark:text-white text-lg">{car.model}</span>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{car.licensePlate}</p>
                                                </div>
                                                <button onClick={() => handleDeleteCar(car.id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-slate-600 dark:text-slate-300">🎨 {car.color}</span>
                                                <span className={`px-2 py-1 text-xs rounded-full font-semibold ${car.driver ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'}`}>
                                                    {car.driver ? '🔒 Assigned' : '✅ Available'}
                                                </span>
                                            </div>
                                            {car.driver && (
                                                <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-2 font-medium bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-lg">
                                                    👤 {car.driver.firstName} {car.driver.lastName}
                                                </p>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}

                {activeModule === 'complaints' && (
                    <div className="space-y-6">
                        {['new', 'open', 'closed'].map(status => (
                            <motion.div
                                key={status}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass p-6 rounded-3xl shadow-lg dark:bg-slate-800/50 dark:border-slate-700"
                            >
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 uppercase flex items-center gap-2">
                                    {status === 'new' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                                    {status === 'open' && <AlertTriangle className="w-5 h-5 text-blue-500" />}
                                    {status === 'closed' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                                    {status} Complaints ({complaints[status].length})
                                </h3>
                                <div className="space-y-3">
                                    {complaints[status].length === 0 ? (
                                        <p className="text-slate-400 italic text-center py-4">No {status} complaints</p>
                                    ) :
                                        complaints[status].map(c => (
                                            <div key={c.id} className="p-4 border-2 border-slate-100 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-colors">
                                                <div className="flex justify-between items-start gap-4">
                                                    <div className="flex-1">
                                                        <p className="font-medium text-slate-800 dark:text-white mb-1">{c.message}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            Trip #{c.trip?.id} • Customer: {c.customer?.firstName} {c.customer?.lastName}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {status === 'new' && (
                                                            <button
                                                                onClick={() => handleComplaintAction('open', c.id)}
                                                                disabled={loading}
                                                                className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl text-sm font-semibold hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors flex items-center gap-1"
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                                Open
                                                            </button>
                                                        )}
                                                        {status === 'open' && (
                                                            <button
                                                                onClick={() => handleComplaintAction('close', c.id)}
                                                                disabled={loading}
                                                                className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl text-sm font-semibold hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors flex items-center gap-1"
                                                            >
                                                                <XCircle className="w-4 h-4" />
                                                                Close
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default EmployeeDashboard;
