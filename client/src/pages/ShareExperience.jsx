import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Building2, FileText, CheckCircle, XCircle, Send } from 'lucide-react';
import api from '../utils/api';
import Layout from '../components/Layout';
import Select from 'react-select';

const ShareExperience = () => {
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [companyOptions, setCompanyOptions] = useState([]);
    const [roundType, setRoundType] = useState('OT');
    const [result, setResult] = useState('Qualified');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
        }
    }, [user, authLoading, navigate]);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const { data } = await api.get('/companies');
                const options = data.map(c => ({ value: c._id, label: c.name }));
                setCompanyOptions(options);
            } catch (err) {
                console.error('Failed to fetch companies', err);
            }
        };
        fetchCompanies();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedCompany) {
            setError('Please select a company');
            return;
        }
        setLoading(true);
        try {
            await api.post('/experiences', {
                companyId: selectedCompany.value,
                roundType,
                description,
                result
            });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit experience');
        } finally {
            setLoading(false);
        }
    };

    // React Select Custom Styles for Dark Theme
    const selectStyles = {
        control: (base, state) => ({
            ...base,
            backgroundColor: 'rgba(15, 23, 42, 0.5)', // slate-900/50
            borderColor: state.isFocused ? '#3b82f6' : '#334155', // blue-500 : slate-700
            padding: '4px',
            borderRadius: '0.75rem',
            boxShadow: 'none',
            '&:hover': { borderColor: '#475569' } // slate-600
        }),
        menu: (base) => ({
            ...base,
            backgroundColor: '#1e293b', // slate-800
            border: '1px solid #334155',
            borderRadius: '0.75rem',
            overflow: 'hidden'
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? '#334155' : 'transparent',
            color: '#f1f5f9', // slate-100
            cursor: 'pointer'
        }),
        singleValue: (base) => ({
            ...base,
            color: '#f8fafc' // slate-50
        }),
        input: (base) => ({
            ...base,
            color: '#f8fafc'
        }),
        placeholder: (base) => ({
            ...base,
            color: '#64748b' // slate-500
        })
    };

    return (
        <Layout>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto glass-card p-8 rounded-2xl shadow-xl"
            >
                <div className="flex items-center mb-8">
                    <div className="bg-blue-500/10 p-3 rounded-2xl mr-4 text-blue-500 border border-blue-500/20">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Share Interview Experience</h2>
                        <p className="text-slate-400 text-sm">Help others by sharing your journey</p>
                    </div>
                </div>

                {error && <div className="bg-red-500/10 text-red-400 p-3 rounded-xl mb-6 text-sm border border-red-500/20">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wide mb-1.5 flex items-center ml-1">
                            <Building2 size={14} className="mr-1.5" />
                            Company
                        </label>
                        <Select
                            options={companyOptions}
                            value={selectedCompany}
                            onChange={setSelectedCompany}
                            placeholder="Select a company..."
                            styles={selectStyles}
                            required
                        />
                        <p className="text-xs text-slate-500 mt-2 ml-1">Found a new company? Contact an admin to add it.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-slate-400 text-xs font-bold uppercase tracking-wide mb-1.5 ml-1">Round Type</label>
                            <div className="relative">
                                <select
                                    className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 appearance-none"
                                    value={roundType}
                                    onChange={(e) => setRoundType(e.target.value)}
                                >
                                    <option value="OT">Online Test</option>
                                    <option value="Technical">Technical Interview</option>
                                    <option value="HR">HR Interview</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-slate-400 text-xs font-bold uppercase tracking-wide mb-1.5 ml-1">Result</label>
                            <div className="flex space-x-4">
                                <label className={`
                                    flex-1 flex items-center justify-center px-4 py-3 rounded-xl border cursor-pointer transition-all
                                    ${result === 'Qualified'
                                        ? 'bg-green-500/10 border-green-500/50 text-green-400'
                                        : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-600'}
                                `}>
                                    <input
                                        type="radio"
                                        className="hidden"
                                        name="result"
                                        value="Qualified"
                                        checked={result === 'Qualified'}
                                        onChange={(e) => setResult(e.target.value)}
                                    />
                                    <CheckCircle size={16} className={`mr-2 ${result === 'Qualified' && 'fill-current'}`} />
                                    <span className="text-sm font-medium">Qualified</span>
                                </label>
                                <label className={`
                                    flex-1 flex items-center justify-center px-4 py-3 rounded-xl border cursor-pointer transition-all
                                    ${result === 'Not Qualified'
                                        ? 'bg-red-500/10 border-red-500/50 text-red-400'
                                        : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-600'}
                                `}>
                                    <input
                                        type="radio"
                                        className="hidden"
                                        name="result"
                                        value="Not Qualified"
                                        checked={result === 'Not Qualified'}
                                        onChange={(e) => setResult(e.target.value)}
                                    />
                                    <XCircle size={16} className={`mr-2 ${result === 'Not Qualified' && 'fill-current'}`} />
                                    <span className="text-sm font-medium">Failed</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-slate-400 text-xs font-bold uppercase tracking-wide mb-1.5 ml-1">Experience Description</label>
                        <textarea
                            className="input-field h-40 resize-none"
                            placeholder="Share the questions asked, difficulty level, and your thoughts..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        className={`btn-primary flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : (
                            <>
                                <Send size={18} className="mr-2" />
                                Submit Experience
                            </>
                        )}
                    </motion.button>
                </form>
            </motion.div>
        </Layout>
    );
};

export default ShareExperience;
