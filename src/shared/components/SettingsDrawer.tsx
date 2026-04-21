import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  LogOut, 
  Globe, 
  Sparkles, 
  RefreshCw,
  User,
  Eye,
  HelpCircle,
  Bell
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useMatchingPoolToggle } from '../hooks/useMatchingPoolToggle';
import { useNavigate } from 'react-router-dom';
import { HelpModal } from './HelpModal';


interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * SettingsDrawer — A sleek side-drawer for quick settings access.
 */
export const SettingsDrawer = ({ isOpen, onClose }: SettingsDrawerProps) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { user, logout } = useAuthContext();
    const { showSuccess, showError } = useNotification();
    const { isInPool, isUpdating: isUpdatingPool, toggle: handleToggleMatchingPool } = useMatchingPoolToggle();
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        onClose();
        navigate('/');
    };

    const toggleLanguage = () => {
        const newLang = i18n.language === 'vi' ? 'en' : 'vi';
        i18n.changeLanguage(newLang);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[100]"
                    />

                    {/* Drawer Content */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 bottom-0 w-[85%] max-w-[320px] bg-background-paper border-l border-divider z-[101] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 flex items-center justify-between border-b border-divider">
                            <span className="typo-section-header opacity-40">{t('shared.settings.title')}</span>
                            <button 
                                onClick={onClose}
                                className="w-8 h-8 rounded-full bg-background-warm flex items-center justify-center text-ink/40 hover:text-ink transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
                            {/* Profile Mini Card - Simplified */}
                            <div className="flex flex-col gap-1 p-4 rounded-2xl bg-background-warm/60 border border-divider">
                                <span className="typo-desc-bright !text-lg !font-black uppercase tracking-tight">{user?.fullName || user?.name}</span>
                                <span className="typo-meta !text-[10px] !font-black uppercase tracking-[0.2em] opacity-30">{user?.email}</span>
                            </div>

                            {/* Matching Pool Toggle */}
                            <div className="space-y-3">
                                <h3 className="typo-caption-wide text-ink/20 px-1">{t('shared.settings.services')}</h3>
                                <div className="p-5 rounded-3xl bg-gradient-to-br from-white/[0.04] to-transparent border border-divider">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <Sparkles size={16} className={isInPool ? 'text-primary animate-pulse' : 'text-ink/20'} />
                                            <span className="typo-desc-bright">{t('shared.settings.matching')}</span>
                                        </div>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleToggleMatchingPool(); }}
                                            disabled={isUpdatingPool}
                                            className={`w-11 h-6 rounded-full relative transition-all duration-500 p-1 ${
                                                isInPool ? 'bg-primary' : 'bg-ink/5'
                                            }`}
                                        >
                                            <motion.div 
                                                animate={{ x: isInPool ? 18 : 0 }}
                                                className="w-4 h-4 rounded-full bg-white shadow-md flex items-center justify-center"
                                            >
                                                {isUpdatingPool && <RefreshCw size={10} className="text-primary animate-spin" />}
                                            </motion.div>
                                        </button>
                                    </div>
                                    <p className="typo-desc-xs">
                                        {isInPool ? t('shared.settings.matching_desc_on') : t('shared.settings.matching_desc_off')}
                                    </p>
                                </div>
                            </div>

                            {/* Options List */}
                            <div className="space-y-1">
                                <h3 className="typo-caption-wide text-ink/20 px-1 mb-3">{t('shared.settings.configuration')}</h3>
                                
                                <button 
                                    onClick={() => { onClose(); navigate('/settings/profile-review'); }} 
                                    className="w-full p-4 flex items-center justify-between rounded-2xl hover:bg-background-warm/60 transition-all group text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <Eye size={16} className="text-ink/20 group-hover:text-primary transition-colors" />
                                        <span className="typo-body-sm text-ink/60">{t('settings.app_settings.review_profile')}</span>
                                    </div>
                                    <span className="material-symbols-outlined text-ink/10 text-lg rotate-180">arrow_back</span>
                                </button>

                                <button 
                                    onClick={() => setIsHelpOpen(true)} 
                                    className="w-full p-4 flex items-center justify-between rounded-2xl hover:bg-background-warm/60 transition-all group text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <HelpCircle size={16} className="text-ink/20 group-hover:text-primary transition-colors" />
                                        <span className="typo-body-sm text-ink/60">{t('settings.app_settings.help')}</span>
                                    </div>
                                    <span className="material-symbols-outlined text-ink/10 text-lg rotate-180">arrow_back</span>
                                </button>

                                <button onClick={toggleLanguage} className="w-full p-4 flex items-center justify-between rounded-2xl hover:bg-background-warm/60 transition-all group text-left">
                                    <div className="flex items-center gap-3">
                                        <Globe size={16} className="text-ink/20 group-hover:text-primary transition-colors" />
                                        <span className="typo-body-sm text-ink/60">{t('shared.settings.language')}</span>
                                    </div>
                                    <span className="typo-lang-switch text-primary/60 uppercase">{i18n.language === 'vi' ? 'Tiếng Việt' : 'English'}</span>
                                </button>

                                <button className="w-full p-4 flex items-center justify-between rounded-2xl hover:bg-background-warm/60 transition-all group text-left">
                                    <div className="flex items-center gap-3">
                                        <Bell size={16} className="text-ink/20 group-hover:text-primary transition-colors" />
                                        <span className="typo-body-sm text-ink/60">{t('shared.settings.notifications')}</span>
                                    </div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                </button>

                            </div>
                        </div>

                        {/* Footer - Logout */}
                        <div className="p-6 border-t border-divider mt-auto">
                            <button 
                                onClick={handleLogout}
                                className="w-full py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 typo-caption flex items-center justify-center gap-2 active:scale-95 transition-all"
                            >
                                <LogOut size={16} />
                                <span>{t('shared.settings.logout')}</span>
                            </button>
                            <p className="text-center typo-footnote text-ink/10 mt-6">
                                Clique83 v1.0
                            </p>
                        </div>
                    </motion.div>
                    
                    {/* Help Modal Integration */}
                    {isHelpOpen && (
                        <div className="fixed inset-0 z-[200]">
                            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsHelpOpen(false)} />
                            <div className="flex items-center justify-center h-full p-4">
                                <div className="w-full max-w-sm">
                                    {/* Using a separate context or standard modal here would be better, 
                                        but for now we trigger the HelpModal component */}
                                    <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </AnimatePresence>
    );
};
