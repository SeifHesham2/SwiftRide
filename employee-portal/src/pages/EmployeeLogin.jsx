import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Mail, Lock, Shield, Users, TrendingUp, Sun, Moon } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import AlertBanner from '../components/AlertBanner';

const EmployeeLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({ email: '', password: '' });
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
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
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
            const response = await api.post('/employees/login', formData);
            const userData = { ...response.data, role: 'EMPLOYEE' };
            login(userData);
            navigate('/dashboard');
        } catch (error) {
            // Map backend errors to friendly messages
            let message = 'Unable to sign in. Please check your connection.';
            if (error.response) {
                if (error.response.status === 401) {
                    message = 'Invalid email or password. Please try again.';
                } else if (error.response.status === 404) {
                    message = 'Account not found. Please contact your administrator.';
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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 flex items-center justify-center p-4 relative overflow-hidden">

            {/* Theme Toggle */}
            <button
                onClick={toggleTheme}
                className="absolute top-6 right-6 p-3 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:scale-110 transition-all z-50"
            >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[40%] -right-[20%] w-[1000px] h-[1000px] rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 blur-3xl animate-pulse" />
                <div className="absolute top-[60%] -left-[20%] w-[800px] h-[800px] rounded-full bg-violet-500/10 dark:bg-violet-500/20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="w-full max-w-6xl relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Side - Branding */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hidden lg:block"
                >
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-4 rounded-2xl shadow-2xl">
                                <Briefcase className="w-12 h-12 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                                    SwiftRide
                                </h1>
                                <p className="text-indigo-600 dark:text-indigo-400 text-lg font-medium">Employee Portal</p>
                            </div>
                        </div>
                        <h2 className="text-5xl font-bold mb-6 leading-tight text-slate-900 dark:text-white">
                            Manage Your
                            <br />
                            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Fleet Operations
                            </span>
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed">
                            Access powerful tools to manage drivers, vehicles, and customer support.
                            Your centralized hub for operational excellence.
                        </p>
                    </div>

                    {/* Feature Highlights */}
                    <div className="space-y-4">
                        {[
                            { icon: Users, title: 'Driver Management', desc: 'Register and manage your driver fleet' },
                            { icon: Shield, title: 'Secure Access', desc: 'Enterprise-grade security and encryption' },
                            { icon: TrendingUp, title: 'Real-time Analytics', desc: 'Monitor operations and performance' }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                className="flex items-start gap-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
                            >
                                <div className="bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-lg">
                                    <feature.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{feature.title}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{feature.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Right Side - Login Form */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="w-full"
                >
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 lg:p-10 border border-slate-100 dark:border-slate-700 transition-colors duration-300">

                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h2>
                            <p className="text-slate-600 dark:text-slate-400">Sign in to access your dashboard</p>
                        </div>

                        {/* Alert Banner for API Errors */}
                        <AlertBanner
                            message={apiError}
                            onClose={() => setApiError(null)}
                        />

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.email ? 'text-red-500' : 'text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400'}`} />
                                    <input
                                        type="email"
                                        placeholder="employee@swiftride.com"
                                        className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 bg-slate-50 dark:bg-slate-900 outline-none transition-all duration-300 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600
                                            ${errors.email
                                                ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                                                : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10'
                                            }`}
                                        value={formData.email}
                                        onChange={e => {
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
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Password
                                </label>
                                <div className="relative group">
                                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.password ? 'text-red-500' : 'text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400'}`} />
                                    <input
                                        type="password"
                                        placeholder="••••••••••••"
                                        className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 bg-slate-50 dark:bg-slate-900 outline-none transition-all duration-300 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600
                                            ${errors.password
                                                ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                                                : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10'
                                            }`}
                                        value={formData.password}
                                        onChange={e => {
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

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Verifying...
                                    </span>
                                ) : (
                                    'Access Portal'
                                )}
                            </motion.button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
                            <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                <span>Secure employee access • Authorized personnel only</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

// Helper component for error icon
const AlertCircle = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

export default EmployeeLogin;
