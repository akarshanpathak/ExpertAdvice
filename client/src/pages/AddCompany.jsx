import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Building2, Plus, Briefcase, BarChart3, Users, LayoutDashboard } from 'lucide-react';
import api from '../utils/api';
import Layout from '../components/Layout';

const AddCompany = () => {
    const [name, setName] = useState('');
    const [industry, setIndustry] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
        if (!authLoading) {
            if (!user || user.role !== 'admin') {
                navigate('/');
            }
        }
    }, [user, authLoading, navigate]);

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const { data } = await api.get('/companies');
            setCompanies(data);
        } catch (err) {
            console.error('Failed to fetch companies', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const { data } = await api.post('/companies', { name, industry });
            setSuccess('Company added successfully!');
            setName('');
            setIndustry('');
            setCompanies([...companies, data]); // Update list immediately
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add company');
        }
    };

    if (authLoading) return <Layout><div className="text-center py-20 text-slate-400">Loading...</div></Layout>;

    return (
        <Layout>
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex items-center gap-4"
                >
                    <div className="bg-blue-500/10 p-3 rounded-2xl text-blue-400 border border-blue-500/20">
                        <LayoutDashboard size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                        <p className="text-slate-400">Manage companies and view platform insights</p>
                    </div>
                </motion.div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card p-6 rounded-2xl border border-slate-700/50"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-slate-400 font-medium">Total Companies</h3>
                            <Building2 className="text-blue-500" size={24} />
                        </div>
                        <p className="text-4xl font-bold text-white">{companies.length}</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card p-6 rounded-2xl border border-slate-700/50"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-slate-400 font-medium">Active Users</h3>
                            <Users className="text-purple-500" size={24} />
                        </div>
                        <p className="text-4xl font-bold text-white">Active</p>
                        <p className="text-xs text-slate-500 mt-1">Platform growing</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-card p-6 rounded-2xl border border-slate-700/50"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-slate-400 font-medium">Total Interactions</h3>
                            <BarChart3 className="text-emerald-500" size={24} />
                        </div>
                        <p className="text-4xl font-bold text-white">High</p>
                        <p className="text-xs text-slate-500 mt-1">Engagement rate</p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="glass-card p-8 rounded-2xl h-fit border border-slate-700/50 sticky top-24"
                        >
                            <div className="flex items-center mb-6">
                                <Plus className="text-blue-400 mr-2" size={20} />
                                <h2 className="text-xl font-bold text-white">Add New Company</h2>
                            </div>

                            {error && <div className="bg-red-500/10 text-red-400 p-3 rounded-xl mb-6 text-sm border border-red-500/20">{error}</div>}
                            {success && <div className="bg-green-500/10 text-green-400 p-3 rounded-xl mb-6 text-sm border border-green-500/20">{success}</div>}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-slate-400 text-xs font-bold uppercase tracking-wide mb-1.5 ml-1">Company Name</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Microsoft"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-xs font-bold uppercase tracking-wide mb-1.5 ml-1">Industry (Optional)</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={industry}
                                        onChange={(e) => setIndustry(e.target.value)}
                                        placeholder="e.g. Technology"
                                    />
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all mt-4"
                                >
                                    List Company
                                </motion.button>
                            </form>
                        </motion.div>
                    </div>

                    {/* List Section */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="glass-card p-8 rounded-2xl border border-slate-700/50 min-h-[500px]"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center">
                                    <Building2 className="text-slate-400 mr-2" size={20} />
                                    <h2 className="text-xl font-bold text-white">Company Directory</h2>
                                </div>
                                <span className="bg-slate-800 text-slate-400 text-xs font-bold px-2.5 py-1 rounded-full border border-slate-700">
                                    {companies.length} Listed
                                </span>
                            </div>

                            <div className="space-y-3">
                                {companies.length > 0 ? (
                                    companies.map((company, index) => (
                                        <motion.div
                                            key={company._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 + (index * 0.05) }}
                                            className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:border-blue-500/30 hover:bg-slate-800 transition-all group"
                                        >
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 group-hover:text-blue-400 transition-colors mr-4 border border-slate-700">
                                                    <Briefcase size={18} />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-slate-200 group-hover:text-blue-300 transition-colors">{company.name}</h3>
                                                    <p className="text-xs text-slate-500">{company.industry || 'Tech'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                                                    Listed
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="text-center py-20 text-slate-500 border border-dashed border-slate-800 rounded-xl">
                                        No companies added yet. Start listing!
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AddCompany;
