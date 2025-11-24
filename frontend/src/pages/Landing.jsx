import { useNavigate } from 'react-router-dom';
import { Car, Users, Briefcase, ArrowRight, Shield, Clock, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] rounded-full bg-indigo-500/10 blur-3xl animate-float" />
                <div className="absolute top-[40%] -left-[10%] w-[600px] h-[600px] rounded-full bg-violet-500/10 blur-3xl" style={{ animationDelay: '2s' }} />
            </div>

            {/* Navbar */}
            <nav className="relative z-10 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2 rounded-xl shadow-lg">
                            <Car className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                            SwiftRide
                        </h1>
                    </div>
                    <button
                        onClick={() => navigate('/employee/login')}
                        className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-xl text-slate-700 font-semibold transition-all shadow-sm hover:shadow-md border border-slate-200"
                    >
                        <Briefcase className="w-4 h-4" />
                        Employee Portal
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-6xl font-bold text-slate-900 mb-6 leading-tight">
                            Your Ride,
                            <br />
                            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                                On Demand
                            </span>
                        </h2>
                        <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                            Experience seamless transportation with SwiftRide. Book your ride in seconds and travel with confidence.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                            <button
                                onClick={() => navigate('/login?role=customer')}
                                className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3"
                            >
                                <Users className="w-5 h-5" />
                                Customer Login
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => navigate('/register?role=customer')}
                                className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all border-2 border-indigo-100 hover:border-indigo-200"
                            >
                                Sign Up
                            </button>
                        </div>

                        {/* Driver Login Link */}
                        <div className="flex items-center gap-3 text-slate-600">
                            <Car className="w-5 h-5" />
                            <span>Are you a driver?</span>
                            <button
                                onClick={() => navigate('/login?role=driver')}
                                className="text-indigo-600 font-semibold hover:text-indigo-700 underline underline-offset-4"
                            >
                                Login here
                            </button>
                        </div>
                    </motion.div>

                    {/* Right Content - Features */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="grid gap-6"
                    >
                        {[
                            { icon: Shield, title: 'Safe & Secure', desc: 'Verified drivers and secure payments' },
                            { icon: Clock, title: 'Fast Booking', desc: 'Book your ride in under 30 seconds' },
                            { icon: CreditCard, title: 'Multiple Payment Options', desc: 'Cash, Card, or Wallet - your choice' }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                className="glass p-6 rounded-3xl hover:shadow-xl transition-all group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-2xl group-hover:scale-110 transition-transform">
                                        <feature.icon className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-1">{feature.title}</h3>
                                        <p className="text-slate-600">{feature.desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default Landing;
