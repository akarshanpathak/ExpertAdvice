import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Briefcase, BookOpen, Share, UserCheck } from 'lucide-react';
import api from '../utils/api';
import Layout from '../components/Layout';
import CompanyCard from '../components/CompanyCard';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

const Home = () => {
    const [companies, setCompanies] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCompanies();
    }, [search]);

    const fetchCompanies = async () => {
        try {
            const { data } = await api.get(`/companies?search=${search}`);
            setCompanies(data);
        } catch (err) {
            console.error('Failed to fetch companies', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="mb-20 text-center pt-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                        Anonymous Interview Experiences
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                        Find Interview <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Insights</span>
                    </h1>
                    <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Unlock the secrets to landing your dream job with real stories from seniors who have been there.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="max-w-2xl mx-auto relative group mb-20"
                >
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl group-hover:bg-blue-500/30 transition-all duration-300"></div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search companies (e.g. Google, Amazon)..."
                            className="w-full px-6 py-4 rounded-2xl bg-slate-900/80 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 shadow-2xl pl-14 transition-all text-lg text-white placeholder-slate-500 backdrop-blur-xl"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Search className="w-6 h-6 text-slate-500 absolute left-5 top-4.5 group-focus-within:text-blue-400 transition-colors" />
                    </div>
                </motion.div>

                {/* How it Works Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20"
                >
                    <div className="glass-card p-6 rounded-2xl border border-slate-800/50 hover:border-blue-500/30 transition-all">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4 mx-auto border border-blue-500/20">
                            <Search size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">1. Find Companies</h3>
                        <p className="text-slate-400 text-sm">Search for your dream companies and explore their interview history.</p>
                    </div>
                    <div className="glass-card p-6 rounded-2xl border border-slate-800/50 hover:border-purple-500/30 transition-all">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4 mx-auto border border-purple-500/20">
                            <BookOpen size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">2. Read Stories</h3>
                        <p className="text-slate-400 text-sm">Read detailed, anonymous accounts of interview rounds and questions.</p>
                    </div>
                    <div className="glass-card p-6 rounded-2xl border border-slate-800/50 hover:border-emerald-500/30 transition-all">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 mx-auto border border-emerald-500/20">
                            <Share size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">3. Share Yours</h3>
                        <p className="text-slate-400 text-sm">Help others by sharing your own interview experiences securely.</p>
                    </div>
                </motion.div>
            </div>

            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                </div>
            ) : companies.length > 0 ? (
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center mb-8">
                        <Briefcase className="text-blue-400 mr-2" size={24} />
                        <h2 className="text-2xl font-bold text-white">Featured Companies</h2>
                    </div>
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {companies.map(company => (
                            <motion.div key={company._id} variants={item}>
                                <CompanyCard company={company} />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800"
                >
                    <div className="bg-slate-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
                        <Briefcase className="text-slate-500" size={32} />
                    </div>
                    <p className="text-lg text-slate-300 font-medium mb-1">No companies found.</p>
                    <p className="text-slate-500">Be the first to share an experience!</p>
                </motion.div>
            )}
        </Layout>
    );
};

export default Home;
