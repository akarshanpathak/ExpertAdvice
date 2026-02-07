import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, ArrowRight } from 'lucide-react';
import api from '../utils/api';
import Layout from '../components/Layout';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { data } = await api.post('/auth/login', { email, password });
            login(data.user, data.token);
            // Admin Redirection Logic
            if (data.user.role === 'admin') {
                navigate('/add-company');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <Layout>
            <div className="flex justify-center items-center py-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-slate-800"
                >
                    <div className="text-center mb-8">
                        <div className="bg-blue-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                            <LogIn className="text-blue-500" size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
                        <p className="text-slate-400 mt-2">Sign in to access senior insights</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-red-500/10 text-red-400 p-3 rounded-lg mb-6 text-sm border border-red-500/20 flex items-center"
                        >
                            <span className="font-medium mr-1">Error:</span> {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-slate-400 text-xs font-bold uppercase tracking-wide mb-1.5 ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                                <input
                                    type="email"
                                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/50 border border-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder-slate-600"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-400 text-xs font-bold uppercase tracking-wide mb-1.5 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                                <input
                                    type="password"
                                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/50 border border-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder-slate-600"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-200 mt-4 flex items-center justify-center gap-2"
                        >
                            Sign In <ArrowRight size={18} />
                        </motion.button>
                    </form>

                    <p className="mt-8 text-center text-slate-500 text-sm">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors hover:underline">
                            Register here
                        </Link>
                    </p>
                </motion.div>
            </div>
        </Layout>
    );
};

export default Login;
