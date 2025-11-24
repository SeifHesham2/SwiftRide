import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { User, ArrowLeft, Mail, Lock, Phone, ChevronRight } from 'lucide-react';
import { customerAPI } from '../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

const Register = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const role = searchParams.get('role') || 'customer';

    // Redirect drivers to employee portal
    useEffect(() => {
        if (role === 'driver') {
            toast.error('Driver registration is only available through the Employee Portal');
            navigate('/employee/login');
        }
    }, [role, navigate]);

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [verificationToken, setVerificationToken] = useState('');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const handleSendToken = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await customerAPI.sendEmailToken(formData.email, formData.firstName);
            toast.success('Verification code sent to your email!');
            setStep(2);
        } catch (error) {
            toast.error(error.message || 'Failed to send verification code');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return toast.error('Passwords do not match');
        }

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
            toast.success('Account created successfully!');
            setTimeout(() => navigate('/login?role=customer'), 2000);
        } catch (error) {
            toast.error(error.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    if (role === 'driver') {
        return null; // Will redirect via useEffect
    }

    return (
        <div className="min-h-screen bg-slate-50 relative flex items-center justify-center p-4 overflow-hidden">
            <Toaster position="top-center" />

            {/* Background Decor */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -right-[10%] w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-3xl animate-float" />
                <div className="absolute bottom-[10%] -left-[10%] w-[500px] h-[500px] rounded-full bg-violet-500/10 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
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
                        <div className="bg-gradient-to-br from-indigo-500 to-violet-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30 transform -rotate-3">
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            Create Customer Account
                        </h1>
                        <p className="text-slate-500 mt-2">Join SwiftRide today</p>
                    </div>

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
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">First Name</label>
                                    <input
                                        type="text"
                                        placeholder="John"
                                        required
                                        className="input"
                                        value={formData.firstName}
                                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Last Name</label>
                                    <input
                                        type="text"
                                        placeholder="Doe"
                                        required
                                        className="input"
                                        value={formData.lastName}
                                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        type="email"
                                        placeholder="john@example.com"
                                        required
                                        className="input pl-12"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
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
                            <div className="bg-indigo-50/50 p-4 rounded-xl mb-4 border border-indigo-100">
                                <label className="block text-sm font-medium text-indigo-900 mb-1.5">Verification Code</label>
                                <input
                                    type="text"
                                    placeholder="Check your email"
                                    required
                                    className="input border-indigo-200 focus:border-indigo-500"
                                    value={verificationToken}
                                    onChange={e => setVerificationToken(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        type="tel"
                                        placeholder="+20 123 456 7890"
                                        required
                                        className="input pl-12"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        className="input pl-12"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        className="input pl-12"
                                        value={formData.confirmPassword}
                                        onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="btn btn-primary w-full mt-2">
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </motion.form>
                    )}

                    <div className="mt-8 text-center text-sm text-slate-500">
                        Already have an account?{' '}
                        <Link
                            to="/login?role=customer"
                            className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
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
