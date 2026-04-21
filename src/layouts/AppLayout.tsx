import React, { useRef, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, HelpCircle, LogOut, User as UserIcon, Globe, Sparkles, RefreshCw } from 'lucide-react';
import { useAuthContext } from '../shared/context/AuthContext';
import { useNotification } from '../shared/context/NotificationContext';
import { HelpModal } from '../shared/components/HelpModal';
import { IntakeReview } from '../features/onboarding/components/Intake/IntakeReview';
import { LanguageSwitcher } from '../shared/components/LanguageSwitcher';
import { LoadingOverlay } from '../shared/components/LoadingOverlay';
import { useMatchingPoolToggle } from '../shared/hooks/useMatchingPoolToggle';
import logo from '../assets/logo.png';

import { TopControlsProps } from '../shared/types/index';

const TopControls = ({ user, updateUser, logout, isBeginPath, isAuthStarted, setShowReview, isMatchPath }: TopControlsProps) => {
  const { t } = useTranslation();
  const settingsRef = useRef<HTMLDivElement>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { isInPool, isUpdating: isUpdatingPool, toggle: handleToggleMatchingPool } = useMatchingPoolToggle();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setShowSettings(false);
    navigate('/');
  };

  return (
    <>
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      {!isMatchPath && !(isBeginPath && !user && !isAuthStarted) && (
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[101] flex items-center pointer-events-auto transition-all duration-500 animate-in fade-in" ref={settingsRef}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className={`size-8 sm:size-10 rounded-full bg-background-warm flex items-center justify-center transition-all duration-200 active:scale-95 border shadow-lg group cursor-pointer ${
                showSettings 
                  ? 'border-primary shadow-primary/10 scale-105' 
                  : 'border-divider hover:border-primary/50'
              }`}
              aria-label={t('layout.settings')}
            >
              <Settings className={`w-4 h-4 sm:w-5 sm:h-5 text-primary transition-all duration-200 ${showSettings ? 'rotate-90' : 'group-hover:rotate-45'}`} />
            </button>

            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 mt-4 w-64 bg-background-paper/95 backdrop-blur-md border border-divider rounded-[2rem] overflow-y-auto custom-scrollbar shadow-xl z-[102] max-h-[calc(100dvh-120px)]"
                >
                  {user && (
                    <div className="p-5 border-b border-divider bg-ink/[0.01]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 overflow-hidden">
                          {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <UserIcon className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-ink font-bold text-sm truncate">{user.fullName || user.name || 'User'}</span>
                          <span className="text-ink/40 text-[10px] uppercase tracking-widest font-black">{t('layout.member_status')}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-2.5 space-y-1.5">
                    {/* Matching Pool Toggle */}
                    <div className="px-3 py-4 bg-ink/[0.03] rounded-2xl border border-divider mb-1.5 flex flex-col gap-3 mx-2.5">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleToggleMatchingPool(); }}
                        disabled={isUpdatingPool}
                        className={`w-full p-4 flex items-center justify-between transition-all duration-300 ${isUpdatingPool ? 'opacity-50 cursor-wait' : 'hover:bg-ink/[0.02] cursor-pointer'}`}
                      >
                        <div className="flex items-center gap-4 group">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border overflow-hidden shrink-0 ${
                            isInPool 
                            ? 'bg-primary/20 border-primary/20 shadow-burgundy' 
                            : 'bg-background-warm border-divider opacity-20 grayscale'
                          }`}>
                            <img src={logo} alt="" className={`w-8 h-8 object-contain ${isInPool ? 'animate-pulse' : ''}`} />
                          </div>
                          <div className="flex flex-col text-left">
                            <span className="text-sm font-bold text-ink tracking-widest uppercase">{t('layout.matching_pool')}</span>
                            <span className={`text-[10px] uppercase font-black tracking-widest mt-0.5 ${isInPool ? 'text-primary/80' : 'text-ink/30'}`}>
                              {isInPool ? t('layout.matching_pool_active') : t('layout.matching_pool_paused')}
                            </span>
                          </div>
                        </div>
                        <div className={`w-11 h-6 rounded-full relative transition-all duration-500 shadow-inner flex items-center px-1 ${isInPool ? 'bg-primary' : 'bg-divider/60'}`}>
                          <motion.div 
                            animate={{ x: isInPool ? 20 : 0 }}
                            className="size-4 rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.2)] flex items-center justify-center"
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          >
                            {isUpdatingPool && <RefreshCw size={8} className="text-primary animate-spin" />}
                          </motion.div>
                        </div>
                      </button>
                    </div>

                    {/* Profile Review Option */}
                    <button
                      onClick={() => {
                        setShowReview(true);
                        setShowSettings(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3.5 text-ink/70 hover:text-primary hover:bg-primary/5 transition-all group rounded-2xl"
                    >
                      <div className="w-8 h-8 rounded-xl bg-ink/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <UserIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
                      </div>
                      <span className="text-sm font-bold tracking-wide">{t('layout.profile_review')}</span>
                    </button>

                    {/* Language Section */}
                    <div className="px-3.5 py-4 bg-ink/[0.03] rounded-2xl border border-divider mb-2">
                      <div className="flex items-center gap-2 mb-3">
                        <Globe className="w-3.5 h-3.5 text-primary/60" />
                        <span className="text-[10px] font-black text-primary/80 tracking-[0.2em] uppercase">{t('layout.language')}</span>
                      </div>
                      <div className="flex justify-center">
                        <LanguageSwitcher />
                      </div>
                    </div>

                    {/* Logout Option */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3.5 text-red-600/70 hover:text-red-600 hover:bg-red-50/5 transition-all group rounded-2xl"
                    >
                      <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                        <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                      </div>
                      <span className="text-sm font-bold tracking-wide">{t('layout.logout')}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      )}
    </>
  );
};

export const AppLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, logout, isInitialized, updateUser } = useAuthContext();
  const [showReview, setShowReview] = useState(false);

  const isBeginPath = location.pathname === '/';
  const isMatchPath = location.pathname === '/match';
  const [isAuthStarted, setIsAuthStarted] = useState(false);

  useEffect(() => {
    setIsAuthStarted(document.body.classList.contains('layout-blur-active'));
    const observer = new MutationObserver(() => {
      setIsAuthStarted(document.body.classList.contains('layout-blur-active'));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  if (!isInitialized) {
    return <LoadingOverlay isVisible={true} message={t('shared.loading.preparing')} />;
  }

  return (
    <div className="relative w-full h-viewport bg-background-paper overflow-hidden font-sans text-ink">
      
      {/* ── Paper Texture Overlay (The Ritual Concept) ── */}
      <div className="fixed inset-0 pointer-events-none z-[99] opacity-[0.04] bg-paper-texture mix-blend-multiply animate-ritual-paper-pulse"></div>

      {/* ── Decorative Ambient Warmth ── */}
      <div className="fixed -top-20 -right-20 w-80 h-80 bg-kraft/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="fixed bottom-0 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <TopControls 
        user={user} 
        updateUser={updateUser}
        logout={logout} 
        isBeginPath={isBeginPath || isMatchPath} 
        isMatchPath={isMatchPath}
        isAuthStarted={isAuthStarted} 
        setShowReview={setShowReview} 
      />

      <AnimatePresence>
        {showReview && (
          <IntakeReview onClose={() => setShowReview(false)} ctaLabel={t('common.back')} />
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div id="main-scroll-container" className="relative z-10 w-full h-full flex flex-col pt-2 sm:pt-4 overflow-y-auto custom-scrollbar">
         <Outlet />
      </div>
    </div>
  );
};
