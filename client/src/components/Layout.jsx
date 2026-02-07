import Navbar from './Navbar';
import { motion } from 'framer-motion';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-slate-950 font-sans text-slate-100 selection:bg-blue-500/30">
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black -z-10" />
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 -z-10 mix-blend-overlay"></div>

            <Navbar />
            <motion.main
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                className="flex-grow container mx-auto px-4 py-8 relative z-0"
            >
                {children}
            </motion.main>
            <footer className="border-t border-slate-800/50 text-slate-500 py-8 text-center text-sm relative z-0">
                <p>&copy; {new Date().getFullYear()} SeniorInsights. <span className="text-slate-600">Anonymous Interview Experiences.</span></p>
            </footer>
        </div>
    );
};

export default Layout;
