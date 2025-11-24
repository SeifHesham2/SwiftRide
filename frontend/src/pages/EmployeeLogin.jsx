import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, ArrowLeft, Mail, Lock } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

const EmployeeLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/employees/login', formData);
            const userData = { ...response.data, role: 'EMPLOYEE' };
            login(userData);
            toast.success(`Welcome back, ${userData.firstName}!`);
            setTimeout(() => navigate('/employee/dashboard'), 1000);
        } catch (error) {
            toast.error('Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Toaster position="top-center" />

            <div className="w-full max-w-md">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-slate-500 hover:text-indigo-600 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </button>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                    <div className="text-center mb-8">
                        <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Briefcase className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800">Employee Portal</h1>
                        <p className="text-slate-500 mt-2">Authorized Personnel Only</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="email"
                                    required
                                    className="input pl-10"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="password"
                                    required
                                    className="input pl-10"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full"
                        >
                            {loading ? 'Verifying...' : 'Access Portal'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EmployeeLogin;
