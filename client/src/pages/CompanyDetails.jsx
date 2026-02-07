import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Calendar, User, CheckCircle, XCircle, ChevronDown, ChevronUp, Briefcase } from 'lucide-react';
import api from '../utils/api';
import Layout from '../components/Layout';

const CompanyDetails = () => {
    const { id } = useParams();
    const [company, setCompany] = useState(null);
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    // No more tabs needed, we show all "Journeys"

    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                const { data } = await api.get(`/companies/${id}`);
                setCompany(data.company);
                setExperiences(data.experiences); // These are now multi-stage objects
            } catch (err) {
                console.error('Failed to fetch company details', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCompanyData();
    }, [id]);

    if (loading) return <Layout><div className="text-center py-20 text-slate-400">Loading...</div></Layout>;
    if (!company) return <Layout><div className="text-center py-10 text-slate-400">Company not found</div></Layout>;

    return (
        <Layout>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-8 mb-10 relative overflow-hidden text-center md:text-left"
            >
                <div className="absolute top-0 right-0 p-6 opacity-5 hidden md:block">
                    <Building2 size={150} className="transform rotate-12 text-white" />
                </div>

                <div className="relative z-10">
                    <div className="inline-block p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-500/30 mb-6 shadow-lg shadow-blue-500/10">
                        <Building2 size={48} className="text-blue-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">{company.name}</h1>
                    <p className="text-xl text-slate-400 font-medium mb-6">{company.industry || 'Tech Industry'}</p>
                    <div className="flex items-center justify-center md:justify-start text-sm text-slate-500 bg-slate-900/50 inline-flex px-4 py-2 rounded-full border border-slate-800">
                        <Calendar size={14} className="mr-2" />
                        <span>Added {new Date(company.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </motion.div>

            <div className="flex items-center mb-8">
                <Briefcase className="text-blue-400 mr-2" size={24} />
                <h2 className="text-2xl font-bold text-white">Interview Journeys</h2>
                <span className="ml-3 bg-slate-800 text-slate-400 text-xs font-bold px-2.5 py-1 rounded-full border border-slate-700">
                    {experiences.length}
                </span>
            </div>

            <div className="space-y-6">
                {experiences.length > 0 ? (
                    experiences.map((exp, index) => (
                        <ExperienceCard key={exp._id} experience={exp} index={index} />
                    ))
                ) : (
                    <div className="text-center py-20 bg-slate-900/30 rounded-xl border border-dashed border-slate-800">
                        <p className="text-slate-400 font-medium">No experiences shared yet.</p>
                        <p className="text-sm text-slate-600 mt-1">Be the first to share your journey!</p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

const ExperienceCard = ({ experience, index }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card rounded-xl border border-slate-800 overflow-hidden hover:border-slate-700 transition-all"
        >
            {/* Header / Summary */}
            <div
                className="p-6 cursor-pointer bg-slate-900/40 hover:bg-slate-900/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-slate-400 border border-slate-600 shadow-inner">
                        <User size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-100">{experience.role}</h3>
                        <p className="text-sm text-slate-500">Anonymous • {new Date(experience.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Stages Pills */}
                    <div className="hidden md:flex gap-2">
                        {experience.stages.map((stage, idx) => (
                            <span key={idx} className="px-2 py-1 rounded bg-slate-800/80 border border-slate-700 text-xs text-slate-400 font-mono">
                                {stage.stageType}
                            </span>
                        ))}
                    </div>

                    <div className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 border ${experience.overallResult === 'Selected'
                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                            : experience.overallResult === 'Rejected'
                                ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        }`}>
                        {experience.overallResult === 'Selected' && <CheckCircle size={16} />}
                        {experience.overallResult === 'Rejected' && <XCircle size={16} />}
                        {experience.overallResult}
                    </div>

                    <div className="text-slate-500">
                        {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                </div>
            </div>

            {/* Expanded Details */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-slate-950/30 border-t border-slate-800"
                    >
                        <div className="p-6 space-y-8 relative">
                            {/* Timeline Line */}
                            <div className="absolute left-8 top-6 bottom-6 w-0.5 bg-slate-800 hidden md:block" />

                            {experience.stages.map((stage, idx) => (
                                <div key={idx} className="relative md:pl-10">
                                    {/* Timeline Dot */}
                                    <div className="absolute left-[-5px] top-1 w-3 h-3 rounded-full bg-slate-600 border-2 border-slate-900 hidden md:block" />

                                    <div className="mb-2 flex items-center gap-3">
                                        <h4 className="text-lg font-semibold text-blue-400">{stage.stageType}</h4>
                                        <span className={`text-xs px-2 py-0.5 rounded border ${stage.difficulty === 'Hard' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                stage.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                    'bg-green-500/10 text-green-400 border-green-500/20'
                                            }`}>
                                            {stage.difficulty}
                                        </span>
                                    </div>
                                    <p className="text-slate-300 leading-relaxed whitespace-pre-line bg-slate-900/50 p-4 rounded-xl border border-slate-800/50">
                                        {stage.description}
                                    </p>
                                    <div className="mt-2 text-xs text-slate-500 font-medium">
                                        Status: <span className={
                                            stage.result === 'Selected' ? 'text-green-400' :
                                                stage.result === 'Rejected' ? 'text-red-400' : 'text-slate-400'
                                        }>{stage.result}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default CompanyDetails;
