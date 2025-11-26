import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { User, Car, ArrowLeft, Mail, Lock, ChevronRight, AlertCircle, Sun, Moon } from 'lucide-react';
import { customerAPI, driverAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import AlertBanner from '../components/AlertBanner';

const Login = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const role = searchParams.get('role') || 'customer';
    const isDriver = role === 'driver';

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState(null);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = 'Email address is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError(null);

        if (!validateForm()) return;

        setLoading(true);

        try {
            const api = isDriver ? driverAPI : customerAPI;
            const response = await api.login(formData);

            const userData = {
                ...response.data,
                role: isDriver ? 'DRIVER' : 'CUSTOMER'
            };

            login(userData);
            navigate(isDriver ? '/driver/dashboard' : '/customer/dashboard');

        } catch (error) {
            let message = 'Unable to sign in. Please check your connection.';
            if (error.response) {
                if (error.response.status === 401) {
                    message = 'Invalid email or password. Please try again.';
                } else if (error.response.status === 404) {
                    message = 'Account not found. Please register first.';
                } else {
                    message = error.response.data?.message || 'An unexpected error occurred.';
                }
            }
            setApiError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 relative flex items-center justify-center p-4 overflow-hidden">

            {/* Theme Toggle */}
            <button
                onClick={toggleTheme}
                className="absolute top-6 right-6 p-3 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:scale-110 transition-all z-50"
            >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Background Decor */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[600px] h-[600px] rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 blur-3xl animate-float" />
                <div className="absolute bottom-[10%] -right-[10%] w-[500px] h-[500px] rounded-full bg-violet-500/10 dark:bg-violet-500/20 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </button>

                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/20 dark:border-slate-700">
                    <div className="text-center mb-8">
                        <div className="bg-gradient-to-br from-indigo-500 to-violet-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30 transform rotate-3">
                            {isDriver ? (
                                <Car className="w-8 h-8 text-white" />
                            ) : (
                                <User className="w-8 h-8 text-white" />
                            )}
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                            {isDriver ? 'Driver Login' : 'Customer Login'}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">
                            Welcome back to SwiftRide
                        </p>
                    </div>

                    <AlertBanner
                        message={apiError}
                        onClose={() => setApiError(null)}
                    />

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.email ? 'text-red-500' : 'text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400'}`} />
                                <input
                                    type="email"
                                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl border bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm outline-none transition-all duration-300 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600
                                        ${errors.email
                                            ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                                            : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10'
                                        }`}
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={(e) => {
                                        setFormData({ ...formData, email: e.target.value });
                                        if (errors.email) setErrors({ ...errors, email: null });
                                    }}
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1.5 text-sm text-red-500 font-medium flex items-center gap-1 animate-in slide-in-from-top-1 fade-in">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.password ? 'text-red-500' : 'text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400'}`} />
                                <input
                                    type="password"
                                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl border bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm outline-none transition-all duration-300 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600
                                        ${errors.password
                                            ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                                            : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10'
                                        }`}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => {
                                        setFormData({ ...formData, password: e.target.value });
                                        if (errors.password) setErrors({ ...errors, password: null });
                                    }}
                                />
                            </div>
                            {errors.password && (
                                <p className="mt-1.5 text-sm text-red-500 font-medium flex items-center gap-1 animate-in slide-in-from-top-1 fade-in">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-end mb-5">
                            <Link
                                to="/forgot-password"
                                className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Sign In <ChevronRight size={18} /></>
                            )}
                        </button>
                    </form>

                    {!isDriver && (
                        <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                            Don't have an account?{' '}
                            <Link
                                to="/register?role=customer"
                                className="text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                            >
                                Create Account
                            </Link>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
