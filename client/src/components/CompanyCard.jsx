import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, ArrowRight } from 'lucide-react';

const CompanyCard = ({ company }) => {
    return (
        <Link to={`/company/${company._id}`} className="block group">
            <motion.div
                whileHover={{ y: -5 }}
                className="glass-card rounded-xl p-6 transition-all duration-300 relative overflow-hidden group-hover:border-blue-500/30 group-hover:shadow-blue-500/10 hover:shadow-xl"
            >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Building2 size={64} className="text-slate-100 transform rotate-12" />
                </div>

                <div className="relative z-10">
                    <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                        <Building2 size={24} />
                    </div>

                    <h3 className="text-xl font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
                        {company.name}
                    </h3>

                    <p className="text-sm text-slate-400 mt-1 font-medium">
                        {company.industry || 'Tech Industry'}
                    </p>

                    <div className="mt-6 flex items-center text-sm text-blue-400 font-semibold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <span>View Experiences</span>
                        <ArrowRight size={16} className="ml-1" />
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

export default CompanyCard;
