import { useNavigate } from 'react-router-dom';
import {
    Car, Users, ArrowRight, Shield, Clock, CreditCard,
    MapPin, Star, TrendingUp, Award, CheckCircle, Phone, Mail,
    Facebook, Twitter, Instagram, Linkedin, Zap, DollarSign, Globe,
    Sun, Moon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Landing = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const staggerChildren = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 blur-3xl animate-float" />
                <div className="absolute top-[40%] -left-[10%] w-[600px] h-[600px] rounded-full bg-violet-500/10 dark:bg-violet-500/20 blur-3xl" style={{ animationDelay: '2s' }} />
                <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] rounded-full bg-pink-500/10 dark:bg-pink-500/20 blur-3xl" style={{ animationDelay: '4s' }} />
            </div>

            {/* Navbar */}
            <nav className="relative z-10 px-6 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm sticky top-0 transition-colors duration-300">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2 rounded-xl shadow-lg">
                            <Car className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                            SwiftRide
                        </h1>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">Features</a>
                        <a href="#how-it-works" className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">How It Works</a>
                        <a href="#pricing" className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">Pricing</a>
                        <a href="#testimonials" className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">Testimonials</a>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <motion.div {...fadeInUp}>
                        <div className="inline-block px-4 py-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-full text-indigo-700 dark:text-indigo-300 font-semibold mb-6">
                            🚀 The Future of Transportation
                        </div>
                        <h2 className="text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                            Your Ride,
                            <br />
                            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                                On Demand
                            </span>
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
                            Experience seamless transportation with SwiftRide. Book your ride in seconds,
                            travel with confidence, and arrive in style. Join millions of satisfied riders worldwide.
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
                                className="px-8 py-4 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all border-2 border-indigo-100 dark:border-indigo-900 hover:border-indigo-200 dark:hover:border-indigo-800"
                            >
                                Sign Up Free
                            </button>
                        </div>

                        {/* Driver Login Link */}
                        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                            <Car className="w-5 h-5" />
                            <span>Are you a driver?</span>
                            <button
                                onClick={() => navigate('/login?role=driver')}
                                className="text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 underline underline-offset-4"
                            >
                                Login here
                            </button>
                        </div>
                    </motion.div>

                    {/* Right Content - Hero Image/Illustration */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="relative bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl p-12 shadow-2xl">
                            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl"></div>
                            <Car className="w-full h-64 text-white relative z-10" strokeWidth={1} />
                            <div className="absolute -top-6 -right-6 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-xl">
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                    <span className="font-bold text-slate-900 dark:text-white">4.9/5</span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">User Rating</p>
                            </div>
                            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-xl">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-green-500" />
                                    <span className="font-bold text-slate-900 dark:text-white">1M+</span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Happy Riders</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Stats Section */}
            <section className="relative z-10 bg-white dark:bg-slate-900 py-16 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 gap-8"
                        variants={staggerChildren}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {[
                            { icon: Users, value: '1M+', label: 'Active Users' },
                            { icon: Car, value: '50K+', label: 'Verified Drivers' },
                            { icon: MapPin, value: '100+', label: 'Cities Covered' },
                            { icon: Award, value: '4.9/5', label: 'Average Rating' }
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className="text-center"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/50 dark:to-violet-900/50 rounded-2xl mb-4">
                                    <stat.icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <h3 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{stat.value}</h3>
                                <p className="text-slate-600 dark:text-slate-400">{stat.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative z-10 py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">
                            Why Choose <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">SwiftRide?</span>
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Experience the perfect blend of convenience, safety, and affordability
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                        variants={staggerChildren}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {[
                            {
                                icon: Shield,
                                title: 'Safe & Secure',
                                desc: 'All drivers are verified with background checks. Your safety is our top priority with 24/7 support.',
                                color: 'from-blue-500 to-indigo-500'
                            },
                            {
                                icon: Clock,
                                title: 'Fast Booking',
                                desc: 'Book your ride in under 30 seconds. Real-time tracking and instant driver matching.',
                                color: 'from-violet-500 to-purple-500'
                            },
                            {
                                icon: CreditCard,
                                title: 'Multiple Payment Options',
                                desc: 'Cash, Card, or Digital Wallet - choose what works best for you. Secure and encrypted transactions.',
                                color: 'from-pink-500 to-rose-500'
                            },
                            {
                                icon: DollarSign,
                                title: 'Affordable Pricing',
                                desc: 'Transparent pricing with no hidden fees. Get the best rates in town with our competitive pricing.',
                                color: 'from-green-500 to-emerald-500'
                            },
                            {
                                icon: Zap,
                                title: 'Lightning Fast',
                                desc: 'Average pickup time of just 5 minutes. Get where you need to go, faster than ever.',
                                color: 'from-yellow-500 to-orange-500'
                            },
                            {
                                icon: Globe,
                                title: 'Global Coverage',
                                desc: 'Available in over 100 cities worldwide. Same great service wherever you travel.',
                                color: 'from-cyan-500 to-blue-500'
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className="glass dark:bg-slate-800/50 p-8 rounded-3xl hover:shadow-2xl transition-all group cursor-pointer border border-white/20 dark:border-slate-700"
                            >
                                <div className={`inline-flex p-4 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                                    <feature.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="relative z-10 bg-gradient-to-br from-indigo-600 to-violet-600 py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-5xl font-bold text-white mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
                            Getting started is easy. Follow these simple steps to book your ride
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '01',
                                icon: MapPin,
                                title: 'Set Your Location',
                                desc: 'Enter your pickup and drop-off locations. Our smart system will find the best route for you.'
                            },
                            {
                                step: '02',
                                icon: Car,
                                title: 'Choose Your Ride',
                                desc: 'Select from our range of vehicles. From economy to premium, we have options for every need.'
                            },
                            {
                                step: '03',
                                icon: CheckCircle,
                                title: 'Enjoy Your Trip',
                                desc: 'Track your driver in real-time. Sit back, relax, and enjoy a comfortable ride to your destination.'
                            }
                        ].map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                viewport={{ once: true }}
                                className="relative"
                            >
                                <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 hover:bg-white/20 transition-all">
                                    <div className="text-6xl font-bold text-white/20 mb-4">{step.step}</div>
                                    <div className="inline-flex p-4 bg-white rounded-2xl mb-6 shadow-lg">
                                        <step.icon className="w-8 h-8 text-indigo-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                                    <p className="text-indigo-100 leading-relaxed">{step.desc}</p>
                                </div>
                                {index < 2 && (
                                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                                        <ArrowRight className="w-8 h-8 text-white/40" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="relative z-10 py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">
                            Simple, Transparent <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Pricing</span>
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            No hidden fees. No surprises. Just honest pricing for quality service.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                name: 'Economy',
                                price: '$8',
                                desc: 'Perfect for daily commutes',
                                features: ['Comfortable sedans', 'Shared rides available', 'Standard wait time', 'Basic support'],
                                popular: false
                            },
                            {
                                name: 'Premium',
                                price: '$15',
                                desc: 'Travel in style and comfort',
                                features: ['Luxury vehicles', 'Priority matching', 'Extended wait time', 'Premium support'],
                                popular: true
                            },
                            {
                                name: 'Business',
                                price: '$25',
                                desc: 'For corporate travelers',
                                features: ['Executive cars', 'Professional drivers', 'Flexible scheduling', '24/7 VIP support'],
                                popular: false
                            }
                        ].map((plan, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className={`relative p-8 rounded-3xl ${plan.popular
                                    ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-2xl scale-105'
                                    : 'bg-white dark:bg-slate-800 shadow-lg border border-slate-100 dark:border-slate-700'
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-slate-900 px-4 py-1 rounded-full text-sm font-bold">
                                        Most Popular
                                    </div>
                                )}
                                <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                                    {plan.name}
                                </h3>
                                <p className={`mb-6 ${plan.popular ? 'text-indigo-100' : 'text-slate-600 dark:text-slate-400'}`}>
                                    {plan.desc}
                                </p>
                                <div className="mb-6">
                                    <span className={`text-5xl font-bold ${plan.popular ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{plan.price}</span>
                                    <span className={plan.popular ? 'text-indigo-100' : 'text-slate-600 dark:text-slate-400'}>/ride</span>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <CheckCircle className={`w-5 h-5 ${plan.popular ? 'text-white' : 'text-green-500'}`} />
                                            <span className={plan.popular ? 'text-indigo-100' : 'text-slate-600 dark:text-slate-400'}>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => navigate('/register?role=customer')}
                                    className={`w-full py-3 rounded-xl font-bold transition-all ${plan.popular
                                        ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                                        : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:shadow-lg'
                                        }`}
                                >
                                    Get Started
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="relative z-10 bg-slate-50 dark:bg-slate-900 py-24 px-6 transition-colors duration-300">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">
                            What Our <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Riders Say</span>
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Don't just take our word for it. Here's what our customers have to say
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                name: 'Sarah Johnson',
                                role: 'Business Professional',
                                image: '👩‍💼',
                                rating: 5,
                                text: 'SwiftRide has completely transformed my daily commute. The drivers are professional, the cars are clean, and I always arrive on time. Highly recommended!'
                            },
                            {
                                name: 'Michael Chen',
                                role: 'Student',
                                image: '👨‍🎓',
                                rating: 5,
                                text: 'As a student, I appreciate the affordable pricing and the ease of booking. The app is super intuitive and the service is reliable. Best ride-sharing app out there!'
                            },
                            {
                                name: 'Emily Rodriguez',
                                role: 'Healthcare Worker',
                                image: '👩‍⚕️',
                                rating: 5,
                                text: 'Working night shifts, safety is my top concern. SwiftRide\'s verified drivers and real-time tracking give me peace of mind. Thank you for the excellent service!'
                            }
                        ].map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all border border-slate-100 dark:border-slate-700"
                            >
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/50 dark:to-violet-900/50 rounded-full flex items-center justify-center text-2xl">
                                        {testimonial.image}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white">{testimonial.name}</h4>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">{testimonial.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-12 text-center shadow-2xl"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Ready to Get Started?
                        </h2>
                        <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
                            Join millions of satisfied riders and experience the future of transportation today.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate('/register?role=customer')}
                                className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
                            >
                                Sign Up Now
                            </button>
                            <button
                                onClick={() => navigate('/register?role=driver')}
                                className="px-8 py-4 bg-indigo-500 text-white rounded-2xl font-bold text-lg shadow-xl hover:bg-indigo-400 transition-all border-2 border-white/20"
                            >
                                Become a Driver
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 bg-slate-900 text-white py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        {/* Company Info */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2 rounded-xl">
                                    <Car className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold">SwiftRide</h3>
                            </div>
                            <p className="text-slate-400 mb-6">
                                Your trusted partner for safe, reliable, and affordable transportation.
                            </p>
                            <div className="flex gap-4">
                                <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors">
                                    <Facebook className="w-5 h-5" />
                                </a>
                                <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors">
                                    <Twitter className="w-5 h-5" />
                                </a>
                                <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors">
                                    <Instagram className="w-5 h-5" />
                                </a>
                                <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors">
                                    <Linkedin className="w-5 h-5" />
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
                            <ul className="space-y-3">
                                <li><a href="#features" className="text-slate-400 hover:text-white transition-colors">Features</a></li>
                                <li><a href="#how-it-works" className="text-slate-400 hover:text-white transition-colors">How It Works</a></li>
                                <li><a href="#pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</a></li>
                                <li><a href="#testimonials" className="text-slate-400 hover:text-white transition-colors">Testimonials</a></li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h4 className="font-bold text-lg mb-4">Support</h4>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Help Center</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Safety</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="font-bold text-lg mb-4">Contact Us</h4>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-slate-400">
                                    <Phone className="w-5 h-5" />
                                    <span>+1 (555) 123-4567</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-400">
                                    <Mail className="w-5 h-5" />
                                    <span>support@swiftride.com</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-400">
                                    <MapPin className="w-5 h-5" />
                                    <span>123 Tech Street, SF, CA</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
                        <p>&copy; 2025 SwiftRide. All rights reserved. Made with ❤️ for better transportation.</p>
                    </div>
                </div>
            </footer>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .glass {
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                }
                .dark .glass {
                    background: rgba(30, 41, 59, 0.7);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
            `}</style>
        </div>
    );
};

export default Landing;
