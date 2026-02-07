import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, FileText, CheckCircle, XCircle, Send, ArrowRight, ArrowLeft, Briefcase, Users, Lock } from 'lucide-react';
import api from '../utils/api';
import Layout from '../components/Layout';
import Select from 'react-select';

const STEPS = [
    { id: 1, title: 'Company & Role', icon: Building2 },
    { id: 2, title: 'Online Test', icon: FileText, field: 'Online Test' },
    { id: 3, title: 'Technical', icon: Briefcase, field: 'Technical' },
    { id: 4, title: 'HR Round', icon: Users, field: 'HR' },
    { id: 5, title: 'Summary', icon: CheckCircle }
];

const ShareExperience = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const [companyOptions, setCompanyOptions] = useState([]);

    const [formData, setFormData] = useState({
        companyId: null,
        role: '',
        stages: {
            'Online Test': { description: '', difficulty: 'Medium', result: 'Pending', included: true },
            'Technical': { description: '', difficulty: 'Medium', result: 'Pending', included: false },
            'HR': { description: '', difficulty: 'Medium', result: 'Pending', included: false },
        },
        overallResult: 'Pending'
    });

    useEffect(() => {
        if (!authLoading && !user) navigate('/login');
        const fetchCompanies = async () => {
            try {
                const { data } = await api.get('/companies');
                setCompanyOptions(data.map(c => ({ value: c._id, label: c.name })));
            } catch (err) { console.error(err); }
        };
        fetchCompanies();
    }, [user, authLoading, navigate]);

    const handleStageChange = (stage, field, value) => {
        setFormData(prev => ({
            ...prev,
            stages: {
                ...prev.stages,
                [stage]: { ...prev.stages[stage], [field]: value }
            }
        }));
    };

    // Logic to check if we can proceed to next step
    const canProceed = () => {
        if (currentStep === 1) return formData.companyId && formData.role;

        const currentStageKey = STEPS[currentStep - 1].field;
        const currentStageData = formData.stages[currentStageKey];

        // If current stage is included, check if description is filled
        if (currentStageData?.included && !currentStageData.description.trim()) return false;

        return true;
    };

    // Logic to update subsequent stages based on result
    const handleNext = () => {
        if (currentStep > 1 && currentStep < 5) {
            const currentStageKey = STEPS[currentStep - 1].field;
            const currentStageData = formData.stages[currentStageKey];

            // If user failed this round, ensure subsequent rounds are disabled
            if (currentStageData.result === 'Rejected') {
                setFormData(prev => {
                    const nextStages = { ...prev.stages };
                    // Disable all future stages
                    for (let i = currentStep; i < 4; i++) {
                        const nextKey = STEPS[i].field;
                        nextStages[nextKey] = { ...nextStages[nextKey], included: false };
                    }
                    return { ...prev, stages: nextStages, overallResult: 'Rejected' };
                });
                // Jump to summary if rejected
                setCurrentStep(5);
                return;
            }

            // Auto-enable next round if selected
            if (currentStageData.result === 'Selected' && currentStep < 4) {
                const nextKey = STEPS[currentStep].field;
                setFormData(prev => ({
                    ...prev,
                    stages: {
                        ...prev.stages,
                        [nextKey]: { ...prev.stages[nextKey], included: true }
                    }
                }));
            }
        }
        setCurrentStep(prev => Math.min(prev + 1, 5));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const validStages = Object.entries(formData.stages)
                .filter(([_, data]) => data.included && data.description.trim() !== '')
                .map(([type, data]) => ({
                    stageType: type,
                    description: data.description,
                    difficulty: data.difficulty,
                    result: data.result
                }));

            await api.post('/experiences', {
                companyId: formData.companyId.value,
                role: formData.role,
                stages: validStages,
                overallResult: formData.overallResult
            });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit');
            setLoading(false);
        }
    };

    const selectStyles = {
        control: (base, state) => ({
            ...base,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            borderColor: state.isFocused ? '#3b82f6' : '#334155',
            padding: '4px',
            borderRadius: '0.75rem',
            color: 'white',
        }),
        menu: (base) => ({ ...base, backgroundColor: '#1e293b', border: '1px solid #334155' }),
        option: (base, state) => ({ ...base, backgroundColor: state.isFocused ? '#334155' : 'transparent', color: '#f1f5f9' }),
        singleValue: (base) => ({ ...base, color: '#f8fafc' }),
        input: (base) => ({ ...base, color: '#f8fafc' })
    };

    const renderStageInput = (stageTitle) => {
        const isLocked = !formData.stages[stageTitle].included;
        const prevStageIndex = STEPS.findIndex(s => s.field === stageTitle) - 1;
        // Check if previous stage was passed (simplified check)
        const prevStageKey = prevStageIndex >= 1 ? STEPS[prevStageIndex].field : null;
        const prevStagePassed = prevStageKey ? formData.stages[prevStageKey].result === 'Selected' : true;

        if (!prevStagePassed && stageTitle !== 'Online Test') {
            return (
                <div className="text-center py-20 bg-slate-900/30 rounded-xl border border-dashed border-red-500/30">
                    <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 text-red-500">
                        <Lock size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Round Locked</h3>
                    <p className="text-slate-400">You must qualify the previous round to unlock this.</p>
                </div>
            );
        }

        return (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">{stageTitle} Details</h3>
                </div>

                <div>
                    <label className="block text-slate-400 text-xs font-bold uppercase mb-2">Description / Questions</label>
                    <textarea
                        className="input-field h-32"
                        value={formData.stages[stageTitle].description}
                        onChange={(e) => handleStageChange(stageTitle, 'description', e.target.value)}
                        placeholder={`Describe your ${stageTitle} experience...`}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-slate-400 text-xs font-bold uppercase mb-2">Difficulty</label>
                        <select
                            className="input-field"
                            value={formData.stages[stageTitle].difficulty}
                            onChange={(e) => handleStageChange(stageTitle, 'difficulty', e.target.value)}
                        >
                            <option>Easy</option>
                            <option>Medium</option>
                            <option>Hard</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-400 text-xs font-bold uppercase mb-2">Result</label>
                        <select
                            className="input-field"
                            value={formData.stages[stageTitle].result}
                            onChange={(e) => handleStageChange(stageTitle, 'result', e.target.value)}
                        >
                            <option value="Pending">Pending</option>
                            <option value="Selected">Qualified</option>
                            <option value="Rejected">Not Qualified</option>
                        </select>
                        <p className="text-[10px] text-slate-500 mt-1">
                            * Selecting 'Not Qualified' will end the interview process here.
                        </p>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <Layout>
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-10 relative">
                    <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-800 -z-10" />
                    {STEPS.map((step) => (
                        <div key={step.id} className="flex flex-col items-center bg-slate-950 px-2 cursor-default">
                            <motion.div
                                animate={{
                                    backgroundColor: currentStep >= step.id ? '#3b82f6' : '#1e293b',
                                    borderColor: currentStep >= step.id ? '#3b82f6' : '#334155',
                                }}
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 transition-colors ${currentStep >= step.id ? 'text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'text-slate-500'}`}
                            >
                                <step.icon size={18} />
                            </motion.div>
                            <span className={`text-xs font-medium ${currentStep >= step.id ? 'text-blue-400' : 'text-slate-500'}`}>{step.title}</span>
                        </div>
                    ))}
                </div>

                <motion.div className="glass-card p-8 rounded-2xl border border-slate-700/50 min-h-[400px]">
                    {error && <div className="bg-red-500/10 text-red-400 p-3 rounded-xl mb-6 text-sm border border-red-500/20">{error}</div>}

                    <AnimatePresence mode="wait">
                        {currentStep === 1 && (
                            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                <h2 className="text-2xl font-bold text-white mb-6">Basic Information</h2>
                                <div>
                                    <label className="block text-slate-400 text-xs font-bold uppercase mb-2">Company</label>
                                    <Select
                                        options={companyOptions}
                                        value={formData.companyId}
                                        onChange={(val) => setFormData({ ...formData, companyId: val })}
                                        styles={selectStyles}
                                        placeholder="Search Company..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-xs font-bold uppercase mb-2">Job Role</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        placeholder="e.g. SDE Intern"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 2 && renderStageInput('Online Test')}
                        {currentStep === 3 && renderStageInput('Technical')}
                        {currentStep === 4 && renderStageInput('HR')}

                        {currentStep === 5 && (
                            <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                <h2 className="text-2xl font-bold text-white mb-6">Final Verification</h2>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                                        <span className="text-slate-400">Company</span>
                                        <span className="text-white font-medium">{formData.companyId?.label}</span>
                                    </div>
                                    <div className="flex justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                                        <span className="text-slate-400">Role</span>
                                        <span className="text-white font-medium">{formData.role}</span>
                                    </div>
                                    <div className="flex justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                                        <span className="text-slate-400">Overall Result</span>
                                        <span className={`font-bold ${formData.overallResult === 'Rejected' ? 'text-red-400' : 'text-green-400'}`}>
                                            {formData.overallResult}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex justify-center">
                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="w-full md:w-auto flex items-center justify-center px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-green-500/20"
                                    >
                                        {loading ? 'Submitting...' : 'Submit Experience'} <Send size={18} className="ml-2" />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex justify-between mt-10 pt-6 border-t border-slate-800">
                        <button
                            onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
                            disabled={currentStep === 1}
                            className={`flex items-center px-6 py-2 rounded-xl text-slate-400 hover:bg-slate-800 transition-colors ${currentStep === 1 ? 'opacity-0 pointer-events-none' : ''}`}
                        >
                            <ArrowLeft size={18} className="mr-2" /> Back
                        </button>

                        {currentStep < 5 && (
                            <button
                                onClick={handleNext}
                                disabled={!canProceed()}
                                className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next <ArrowRight size={18} className="ml-2" />
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
};

export default ShareExperience;
