import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Calendar, User, CheckCircle, XCircle } from 'lucide-react';
import api from '../utils/api';
import Layout from '../components/Layout';

const CompanyDetails = () => {
    const { id } = useParams();
    const [company, setCompany] = useState(null);
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('OT');

    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                const { data } = await api.get(`/companies/${id}`);
                setCompany(data.company);
                setExperiences(data.experiences);
            } catch (err) {
                console.error('Failed to fetch company details', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCompanyData();
    }, [id]);

    if (loading) return (
        <Layout>
            <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            </div>
        </Layout>
    );

    if (!company) return <Layout><div className="text-center py-10 text-slate-400">Company not found</div></Layout>;

    // Filter experiences by active tab
    const filteredExperiences = experiences.filter(exp => exp.roundType === activeTab);

    return (
        <Layout>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-8 mb-10 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-6 opacity-5">
                    <Building2 size={120} className="transform rotate-12 text-white" />
                </div>

                <div className="relative z-10">
                    <div className="inline-block p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 mb-4">
                        <Building2 size={32} />
                    </div>
                    <h1 className="text-4xl font-extrabold text-white mb-2">{company.name}</h1>
                    <p className="text-lg text-slate-400 font-medium">{company.industry || 'Tech Industry'}</p>
                    <div className="mt-6 flex items-center text-sm text-slate-500">
                        <Calendar size={14} className="mr-2" />
                        <span>Added {new Date(company.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </motion.div>

            <div className="mb-8 border-b border-slate-800">
                <nav className="-mb-px flex space-x-8">
                    {['OT', 'Technical', 'HR'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`
                                relative whitespace-nowrap pb-4 px-2 font-medium text-sm transition-colors duration-200
                                ${activeTab === tab ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}
                            `}
                        >
                            {tab === 'OT' ? 'Online Test' : tab}
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                />
                            )}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="space-y-6 min-h-[300px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {filteredExperiences.length > 0 ? (
                            <div className="grid gap-6">
                                {filteredExperiences.map((exp, index) => (
                                    <motion.div
                                        key={exp._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-slate-900/40 backdrop-blur-sm rounded-xl border border-slate-800 p-6 transition-all hover:border-slate-700 hover:bg-slate-900/60"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-700">
                                                    <User size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-200">Anonymous Senior</p>
                                                    <p className="text-xs text-slate-500">{new Date(exp.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border ${exp.result === 'Qualified'
                                                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                                                }`}>
                                                {exp.result === 'Qualified' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                                {exp.result}
                                            </span>
                                        </div>
                                        <div className="prose prose-sm prose-invert max-w-none">
                                            <p className="whitespace-pre-line text-slate-300 leading-relaxed">{exp.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-20 bg-slate-900/30 rounded-xl border border-dashed border-slate-800"
                            >
                                <p className="text-slate-400 font-medium">No experiences found for this round.</p>
                                <p className="text-sm text-slate-600 mt-1">Be the first to share your experience!</p>
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </Layout>
    );
};

export default CompanyDetails;
