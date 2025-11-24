import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { User, Car, ArrowLeft, Mail, Lock, ChevronRight } from 'lucide-react';
import { customerAPI, driverAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

const Login = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();

    const role = searchParams.get('role') || 'customer';
    const isDriver = role === 'driver';

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const api = isDriver ? driverAPI : customerAPI;
            const response = await api.login(formData);

            const userData = {
                ...response.data,
                role: isDriver ? 'DRIVER' : 'CUSTOMER'
            };

            login(userData);
            toast.success(`Welcome back, ${userData.firstName}!`);

            setTimeout(() => {
                navigate(isDriver ? '/driver/dashboard' : '/customer/dashboard');
            }, 1000);

        } catch (error) {
            toast.error(error.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 relative flex items-center justify-center p-4 overflow-hidden">
            <Toaster position="top-center" />

            {/* Background Decor */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-3xl animate-float" />
                <div className="absolute bottom-[10%] -right-[10%] w-[500px] h-[500px] rounded-full bg-violet-500/10 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-slate-500 hover:text-indigo-600 mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </button>

                <div className="glass p-8 rounded-3xl">
                    <div className="text-center mb-8">
                        <div className="bg-gradient-to-br from-indigo-500 to-violet-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30 transform rotate-3">
                            {isDriver ? (
                                <Car className="w-8 h-8 text-white" />
                            ) : (
                                <User className="w-8 h-8 text-white" />
                            )}
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            {isDriver ? 'Driver Login' : 'Customer Login'}
                        </h1>
                        <p className="text-slate-500 mt-2">
                            Welcome back to SwiftRide
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    className="input pl-12"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    className="input pl-12"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full mt-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Sign In <ChevronRight size={18} /></>
                            )}
                        </button>
                    </form>

                    {!isDriver && (
                        <div className="mt-8 text-center text-sm text-slate-500">
                            Don't have an account?{' '}
                            <Link
                                to="/register?role=customer"
                                className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
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
