import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Mail, ChevronRight, AlertCircle, CheckCircle, Sun, Moon } from 'lucide-react';
import { customerAPI } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import AlertBanner from '../components/AlertBanner';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [emailError, setEmailError] = useState('');

    const validateEmail = () => {
        if (!email) {
            setEmailError('Email address is required');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Please enter a valid email address');
            return false;
        }
        setEmailError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!validateEmail()) return;

        setLoading(true);

        try {
            await customerAPI.forgotPassword(email);
            setSuccess(true);
        } catch (err) {
            setError(err.message || 'Failed to send reset token. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
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
                    <div className="absolute -top-[10%] -left-[10%] w-[600px] h-[600px] rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 blur-3xl animate-float" />
                    <div className="absolute bottom-[10%] -right-[10%] w-[500px] h-[500px] rounded-full bg-green-500/10 dark:bg-green-500/20 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md relative z-10"
                >
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/20 dark:border-slate-700 text-center">
                        <div className="bg-gradient-to-br from-emerald-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
                            <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
                            Check Your Email
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                            We've sent a password reset token to <strong className="text-slate-800 dark:text-white">{email}</strong>.
                            Please check your inbox for the token.
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                            The token will expire in 10 minutes.
                        </p>
                        <Link
                            to="/reset-password"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all mb-4"
                        >
                            Enter Token & Reset Password
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                        <div className="mt-4">
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors text-sm"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

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
                    onClick={() => navigate('/login')}
                    className="flex items-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Login
                </button>

                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/20 dark:border-slate-700">
                    <div className="text-center mb-8">
                        <div className="bg-gradient-to-br from-indigo-500 to-violet-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30 transform rotate-3">
                            <Mail className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                            Forgot Password?
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">
                            No worries! Enter your email and we'll send you a reset token.
                        </p>
                    </div>

                    <AlertBanner
                        message={error}
                        onClose={() => setError(null)}
                    />

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${emailError ? 'text-red-500' : 'text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400'}`} />
                                <input
                                    type="email"
                                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl border bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm outline-none transition-all duration-300 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600
                                        ${emailError
                                            ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                                            : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10'
                                        }`}
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (emailError) setEmailError('');
                                    }}
                                />
                            </div>
                            {emailError && (
                                <p className="mt-1.5 text-sm text-red-500 font-medium flex items-center gap-1 animate-in slide-in-from-top-1 fade-in">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    {emailError}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Send Reset Token <ChevronRight size={18} /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                        Remember your password?{' '}
                        <Link
                            to="/login"
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

export default ForgotPassword;
