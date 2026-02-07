import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, PlusCircle, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent flex items-center gap-2">
                    <Briefcase className="text-blue-500" size={24} />
                    SeniorInsights
                </Link>

                <div className="flex items-center space-x-6">
                    <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Startups</Link>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link
                                to="/share"
                                className="hidden md:flex bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-all border border-slate-700 hover:border-slate-600"
                            >
                                Share Experience
                            </Link>

                            {user.role === 'admin' && (
                                <Link
                                    to="/add-company"
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 text-white"
                                >
                                    <PlusCircle size={16} />
                                    <span>Admin Dashboard</span>
                                </Link>
                            )}

                            <div className="flex items-center gap-3 border-l border-slate-800 pl-6 ml-2">
                                <div className="hidden md:block text-right">
                                    <p className="text-sm font-medium text-slate-200">{user.name}</p>
                                    <p className="text-xs text-slate-500 capitalize">{user.role || 'Student'}</p>
                                </div>
                                <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                                    <User size={16} />
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="text-slate-400 hover:text-red-400 transition-colors"
                                    title="Logout"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">Login</Link>
                            <Link
                                to="/register"
                                className="bg-slate-100 hover:bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-white/10"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
