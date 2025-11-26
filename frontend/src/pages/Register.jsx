import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { User, ArrowLeft, Mail, Lock, Phone, ChevronRight, AlertCircle, Sun, Moon } from 'lucide-react';
import { customerAPI } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import AlertBanner from '../components/AlertBanner';

const Register = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const role = searchParams.get('role') || 'customer';

    // Redirect drivers to employee portal
    useEffect(() => {
        if (role === 'driver') {
            navigate('/employee/login');
        }
    }, [role, navigate]);

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [verificationToken, setVerificationToken] = useState('');
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState(null);
    const [apiSuccess, setApiSuccess] = useState(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email address';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};
        if (!verificationToken) newErrors.token = 'Verification code is required';
        if (!formData.phone) newErrors.phone = 'Phone number is required';
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSendToken = async (e) => {
        e.preventDefault();
        setApiError(null);
        setApiSuccess(null);

        if (!validateStep1()) return;

        setLoading(true);
        try {
            await customerAPI.sendEmailToken(formData.email, formData.firstName);
            setApiSuccess('Verification code sent to your email!');
            setStep(2);
        } catch (error) {
            setApiError(error.message || 'Failed to send verification code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError(null);

        if (!validateStep2()) return;

        setLoading(true);
        try {
            const data = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                password: formData.password
            };

            await customerAPI.register(data, verificationToken);
            setApiSuccess('Account created successfully! Redirecting...');
            setTimeout(() => navigate('/login?role=customer'), 2000);
        } catch (error) {
            setApiError(error.message || 'Registration failed. Please check your details.');
        } finally {
            setLoading(false);
        }
    };

    if (role === 'driver') return null;

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
                <div className="absolute -top-[10%] -right-[10%] w-[600px] h-[600px] rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 blur-3xl animate-float" />
                <div className="absolute bottom-[10%] -left-[10%] w-[500px] h-[500px] rounded-full bg-violet-500/10 dark:bg-violet-500/20 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
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
                        <div className="bg-gradient-to-br from-indigo-500 to-violet-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30 transform -rotate-3">
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                            Create Customer Account
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Join SwiftRide today</p>
                    </div>

                    <AlertBanner
                        message={apiError}
                        onClose={() => setApiError(null)}
                    />

                    <AlertBanner
                        message={apiSuccess}
                        type="success"
                        onClose={() => setApiSuccess(null)}
                    />

                    {/* Step 1: Basic Info */}
                    {step === 1 && (
                        <motion.form
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onSubmit={handleSendToken}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">First Name</label>
                                    <input
                                        type="text"
                                        placeholder="John"
                                        className={`input bg-white/50 dark:bg-slate-900/50 dark:text-white dark:border-slate-700 ${errors.firstName ? 'border-red-300 focus:border-red-500' : ''}`}
                                        value={formData.firstName}
                                        onChange={e => {
                                            setFormData({ ...formData, firstName: e.target.value });
                                            if (errors.firstName) setErrors({ ...errors, firstName: null });
                                        }}
                                    />
                                    {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Last Name</label>
                                    <input
                                        type="text"
                                        placeholder="Doe"
                                        className={`input bg-white/50 dark:bg-slate-900/50 dark:text-white dark:border-slate-700 ${errors.lastName ? 'border-red-300 focus:border-red-500' : ''}`}
                                        value={formData.lastName}
                                        onChange={e => {
                                            setFormData({ ...formData, lastName: e.target.value });
                                            if (errors.lastName) setErrors({ ...errors, lastName: null });
                                        }}
                                    />
                                    {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                                <div className="relative group">
                                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.email ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'}`} />
                                    <input
                                        type="email"
                                        placeholder="john@example.com"
                                        className={`input pl-12 bg-white/50 dark:bg-slate-900/50 dark:text-white dark:border-slate-700 ${errors.email ? 'border-red-300 focus:border-red-500' : ''}`}
                                        value={formData.email}
                                        onChange={e => {
                                            setFormData({ ...formData, email: e.target.value });
                                            if (errors.email) setErrors({ ...errors, email: null });
                                        }}
                                    />
                                </div>
                                {errors.email && <p className="text-xs text-red-500 mt-1 ml-1">{errors.email}</p>}
                            </div>

                            <button type="submit" disabled={loading} className="btn btn-primary w-full">
                                {loading ? 'Sending...' : (
                                    <>
                                        Send Verification Code
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </button>
                        </motion.form>
                    )}

                    {/* Step 2: Full Registration */}
                    {step === 2 && (
                        <motion.form
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            <div className="bg-indigo-50/50 dark:bg-indigo-900/20 p-4 rounded-xl mb-4 border border-indigo-100 dark:border-indigo-800">
                                <label className="block text-sm font-medium text-indigo-900 dark:text-indigo-200 mb-1.5">Verification Code</label>
                                <input
                                    type="text"
                                    placeholder="Check your email"
                                    className={`input border-indigo-200 dark:border-indigo-700 focus:border-indigo-500 bg-white dark:bg-slate-900 dark:text-white ${errors.token ? 'border-red-300' : ''}`}
                                    value={verificationToken}
                                    onChange={e => {
                                        setVerificationToken(e.target.value);
                                        if (errors.token) setErrors({ ...errors, token: null });
                                    }}
                                />
                                {errors.token && <p className="text-xs text-red-500 mt-1">{errors.token}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Phone Number</label>
                                <div className="relative group">
                                    <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.phone ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'}`} />
                                    <input
                                        type="tel"
                                        placeholder="+20 123 456 7890"
                                        className={`input pl-12 bg-white/50 dark:bg-slate-900/50 dark:text-white dark:border-slate-700 ${errors.phone ? 'border-red-300 focus:border-red-500' : ''}`}
                                        value={formData.phone}
                                        onChange={e => {
                                            setFormData({ ...formData, phone: e.target.value });
                                            if (errors.phone) setErrors({ ...errors, phone: null });
                                        }}
                                    />
                                </div>
                                {errors.phone && <p className="text-xs text-red-500 mt-1 ml-1">{errors.phone}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                                <div className="relative group">
                                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.password ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'}`} />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className={`input pl-12 bg-white/50 dark:bg-slate-900/50 dark:text-white dark:border-slate-700 ${errors.password ? 'border-red-300 focus:border-red-500' : ''}`}
                                        value={formData.password}
                                        onChange={e => {
                                            setFormData({ ...formData, password: e.target.value });
                                            if (errors.password) setErrors({ ...errors, password: null });
                                        }}
                                    />
                                </div>
                                {errors.password && <p className="text-xs text-red-500 mt-1 ml-1">{errors.password}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirm Password</label>
                                <div className="relative group">
                                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.confirmPassword ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'}`} />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className={`input pl-12 bg-white/50 dark:bg-slate-900/50 dark:text-white dark:border-slate-700 ${errors.confirmPassword ? 'border-red-300 focus:border-red-500' : ''}`}
                                        value={formData.confirmPassword}
                                        onChange={e => {
                                            setFormData({ ...formData, confirmPassword: e.target.value });
                                            if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
                                        }}
                                    />
                                </div>
                                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1 ml-1">{errors.confirmPassword}</p>}
                            </div>

                            <button type="submit" disabled={loading} className="btn btn-primary w-full mt-2">
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </motion.form>
                    )}

                    <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                        Already have an account?{' '}
                        <Link
                            to="/login?role=customer"
                            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
