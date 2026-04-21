import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  ChevronLeft, 
  User, 
  LogOut, 
  Globe, 
  Sparkles, 
  ShieldCheck,
  Bell,
  RefreshCw,
  Eye,
  HelpCircle
} from 'lucide-react';
import { HelpModal } from '../shared/components/HelpModal';
import { useTranslation } from 'react-i18next';
import { PageTransition } from '../shared/components/PageTransition';
import { useAuthContext } from '../shared/context/AuthContext';
import { authApi } from '../features/authentication/api/authApi';
import { useNotification } from '../shared/context/NotificationContext';

/**
 * SettingsPage — The Ritual Style
 * Paper background with burgundy accents.
 */
export const SettingsPage = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { user, updateUser, logout } = useAuthContext();
    const { showSuccess, showError } = useNotification();
    const [isUpdatingPool, setIsUpdatingPool] = useState(false);
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    const handleToggleMatchingPool = async () => {
        const userId = user?.id || user?.userId;
        if (!userId || isUpdatingPool) return;

        const currentStatus = user?.isInMatchingPool !== false;
        const newStatus = !currentStatus;
        setIsUpdatingPool(true);

        try {
            await authApi.updateProfile(userId, { isInMatchingPool: newStatus });
            updateUser({ isInMatchingPool: newStatus });
            showSuccess(newStatus ? t('settings.matching_service.pool_active') : t('settings.matching_service.pool_inactive'));
        } catch (err: unknown) {
            console.error('Failed to update matching pool status:', err);
            showError(err instanceof Error ? err.message : t('settings.matching_service.update_error'));
        } finally {
            setIsUpdatingPool(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const toggleLanguage = () => {
        const newLang = i18n.language === 'vi' ? 'en' : 'vi';
        i18n.changeLanguage(newLang);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <PageTransition className="bg-background-paper min-h-screen text-ink">
            <div className="max-w-lg mx-auto w-full p-6 pb-12 font-sans">
                
                {/* Header */}
                <header className="flex items-center justify-between mb-10 pt-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="w-12 h-12 rounded-2xl bg-background-warm flex items-center justify-center border border-divider active:scale-90 transition-all"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-black uppercase tracking-[0.3em] text-ink/80 font-serif">
                        {t('settings.title', 'CÀI ĐẶT')}
                    </h1>
                    <div className="w-12" /> {/* Spacer */}
                </header>

                {/* Profile Identity - Minimalist */}
                <section className="mb-10 text-center flex flex-col items-center">
                    <h2 className="text-3xl font-black text-ink uppercase tracking-tight">{user?.fullName || user?.name}</h2>
                    <p className="text-ink/40 text-[11px] font-black uppercase tracking-[0.4em] mt-2">{user?.email}</p>
                </section>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                >
                    {/* Matching Pool Section */}
                    <motion.div variants={itemVariants} className="space-y-4">
                        <h3 className="text-[12px] font-black text-ink/30 uppercase tracking-[0.3em] px-2 mb-2">
                            {t('settings.matching_service.title')}
                        </h3>
                        <div className="p-6 rounded-[2.5rem] bg-background-warm border border-divider shadow-card">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border ${
                                        (user?.isInMatchingPool !== false) 
                                        ? 'bg-primary/20 border-primary/20 text-primary shadow-burgundy' 
                                        : 'bg-background-warm border-divider text-ink/20'
                                    }`}>
                                        <Sparkles className={`w-6 h-6 ${(user?.isInMatchingPool !== false) ? 'animate-pulse' : ''}`} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[15px] font-bold text-ink">{t('settings.matching_service.mode_label')}</span>
                                        <span className={`text-[11px] font-black uppercase tracking-widest mt-0.5 ${(user?.isInMatchingPool !== false) ? 'text-primary/80' : 'text-ink/30'}`}>
                                            {(user?.isInMatchingPool !== false) ? t('settings.matching_service.searching') : t('settings.matching_service.resting')}
                                        </span>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleToggleMatchingPool}
                                    disabled={isUpdatingPool}
                                    className={`w-14 h-8 rounded-full relative transition-all duration-500 p-1 ${
                                        (user?.isInMatchingPool !== false) ? 'bg-primary shadow-burgundy' : 'bg-divider'
                                    }`}
                                >
                                    <motion.div 
                                        animate={{ x: (user?.isInMatchingPool !== false) ? 24 : 0 }}
                                        className="w-6 h-6 rounded-full bg-background-paper shadow-lg flex items-center justify-center"
                                    >
                                        {isUpdatingPool && <RefreshCw className="w-3 h-3 text-primary animate-spin" />}
                                    </motion.div>
                                </button>
                            </div>
                            <p className="mt-5 text-[14px] text-ink/50 font-light leading-relaxed">
                                {(user?.isInMatchingPool !== false) 
                                    ? t('settings.matching_service.desc_searching') 
                                    : t('settings.matching_service.desc_resting')}
                            </p>
                        </div>
                    </motion.div>

                    {/* General Settings Section */}
                    <motion.div variants={itemVariants} className="space-y-4">
                        <h3 className="text-[12px] font-black text-ink/30 uppercase tracking-[0.3em] px-2 mb-2">
                            {t('settings.app_settings.title')}
                        </h3>
                        <div className="rounded-[2.5rem] bg-background-warm/60 border border-divider overflow-hidden">
                            {/* Review Profile */}
                            <button 
                                onClick={() => navigate('/settings/profile-review')}
                                className="w-full p-6 flex items-center justify-between border-b border-divider hover:bg-ink/[0.02] transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-background-warm flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                        <Eye className="w-5 h-5 text-ink/40 group-hover:text-primary transition-colors" />
                                    </div>
                                    <span className="text-[15px] font-bold text-ink/80">{t('settings.app_settings.review_profile')}</span>
                                </div>
                                <ChevronLeft className="w-4 h-4 text-ink/10 rotate-180" />
                            </button>

                            {/* Help & Tutorial */}
                            <button 
                                onClick={() => setIsHelpOpen(true)}
                                className="w-full p-6 flex items-center justify-between border-b border-divider hover:bg-ink/[0.02] transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-background-warm flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                        <HelpCircle className="w-5 h-5 text-ink/40 group-hover:text-primary transition-colors" />
                                    </div>
                                    <span className="text-[15px] font-bold text-ink/80">{t('settings.app_settings.help')}</span>
                                </div>
                                <ChevronLeft className="w-4 h-4 text-ink/10 rotate-180" />
                            </button>

                            {/* Language Toggle */}
                            <button 
                                onClick={toggleLanguage}
                                className="w-full p-6 flex items-center justify-between border-b border-divider hover:bg-ink/[0.02] transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-background-warm flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                        <Globe className="w-5 h-5 text-ink/40 group-hover:text-primary transition-colors" />
                                    </div>
                                    <span className="text-[15px] font-bold text-ink/80">{t('settings.app_settings.language')}</span>
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-widest text-primary/80 bg-primary/10 px-3 py-1 rounded-full">
                                    {i18n.language === 'vi' ? 'Tiếng Việt' : 'English'}
                                </span>
                            </button>

                            {/* Notifications (Mock) */}
                            <button className="w-full p-6 flex items-center justify-between hover:bg-ink/[0.02] transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-background-warm flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                        <Bell className="w-5 h-5 text-ink/40 group-hover:text-primary transition-colors" />
                                    </div>
                                    <span className="text-[15px] font-bold text-ink/80">{t('settings.app_settings.notifications')}</span>
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-widest text-ink/20">{t('settings.app_settings.on')}</span>
                            </button>
                        </div>
                    </motion.div>

                    {/* Logout Button */}
                    <motion.div variants={itemVariants} className="pt-6">
                        <button 
                            onClick={handleLogout}
                            className="w-full p-6 rounded-[2rem] bg-red-500/10 border border-red-500/20 flex items-center justify-center gap-3 group active:scale-95 transition-all"
                        >
                            <LogOut className="w-5 h-5 text-red-500 group-hover:translate-x-1 transition-transform" />
                            <span className="text-sm font-black uppercase tracking-[0.2em] text-red-500">{t('settings.auth.logout')}</span>
                        </button>
                        <p className="text-center text-[10px] text-ink/10 uppercase font-black tracking-[0.4em] mt-8">
                            Clique83 Coffee Date v1.0
                        </p>
                    </motion.div>
                </motion.div>
            </div>
            <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
        </PageTransition>
    );
};
