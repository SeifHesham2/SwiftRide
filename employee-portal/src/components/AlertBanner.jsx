import { AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AlertBanner = ({ message, type = 'error', onClose }) => {
    if (!message) return null;

    const styles = {
        error: {
            bg: 'bg-red-50 dark:bg-red-900/20',
            border: 'border-red-200 dark:border-red-800',
            text: 'text-red-800 dark:text-red-200',
            icon: 'text-red-500 dark:text-red-400'
        },
        success: {
            bg: 'bg-emerald-50 dark:bg-emerald-900/20',
            border: 'border-emerald-200 dark:border-emerald-800',
            text: 'text-emerald-800 dark:text-emerald-200',
            icon: 'text-emerald-500 dark:text-emerald-400'
        }
    };

    const style = styles[type];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`${style.bg} ${style.border} border rounded-xl p-4 mb-6 flex items-start gap-3 shadow-sm`}
            >
                <AlertCircle className={`w-5 h-5 ${style.icon} mt-0.5 flex-shrink-0`} />
                <div className="flex-1">
                    <p className={`text-sm font-medium ${style.text}`}>
                        {message}
                    </p>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className={`${style.text} hover:opacity-70 transition-opacity`}
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </motion.div>
        </AnimatePresence>
    );
};

export default AlertBanner;
