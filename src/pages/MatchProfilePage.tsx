import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, Variants, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Features (FSD)
import MatchHeader from '../features/match/components/MatchHeader';
import MatchActionButtons from '../features/match/components/MatchActionButtons';
import MatchIntroOverlay from '../features/match/components/MatchIntroOverlay';

// 11-Step New Components
import MatchStorySection from '../features/match/components/MatchStorySection';
import { MatchPhotoGallery } from '../features/match/components/MatchPhotoGallery';
import MatchRealismSection from '../features/match/components/MatchRealismSection';
import MatchQuickFacts from '../features/match/components/MatchQuickFacts';
import MatchFullProfile from '../features/match/components/MatchFullProfile';
import MatchWaitingScreen from '../features/match/components/MatchWaitingScreen';
import MatchWaitResponseScreen from '../features/match/components/MatchWaitResponseScreen';
import { HelpModal } from '../shared/components/HelpModal';

// Hooks
import { useTheatricalIntro, useMatchAudio } from '../features/match/hooks/useMatchProfile';
import { useMatchSuggestion } from '../features/match/hooks/useMatchSuggestion';
import { useMatchProfileData } from '../features/match/hooks/useMatchProfileData';
import { 
  useMatchProfileActions, 
  useMatchProfileNavigation, 
  useMatchProfileScroll 
} from '../features/match/hooks/useMatchProfileLogic';

// Shared
import FloatingParticles from '../shared/components/FloatingParticles';

const MatchProfilePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // 1. Data Fetching
  const { suggestion, isRefreshing } = useMatchSuggestion();
  const { matchData } = useMatchProfileData(suggestion);

  // 2. Specialized Logic Hooks
  const { introStage } = useTheatricalIntro(!!suggestion && !isRefreshing);
  const { audioRef, isMuted, toggleMute } = useMatchAudio();
  const { 
    headerScrollWidth, 
    particlesFade 
  } = useMatchProfileScroll(introStage);

  // Show buttons only if intro is done
  const showActionButtons = introStage === 4;

  const { handleReject, handleLike } = useMatchProfileActions(suggestion);
  useMatchProfileNavigation(suggestion, matchData);

  // 3. Simple UI Handlers
  const handleBack = useCallback(() => navigate('/dashboard'), [navigate]);

  // Scroll Lock during Reveal Intro
  useEffect(() => {
    const shouldLock = !!suggestion && introStage < 4;
    const scrollContainer = document.getElementById('main-scroll-container');
    
    if (shouldLock) {
      document.body.style.overflow = 'hidden';
      if (scrollContainer) scrollContainer.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      if (scrollContainer) scrollContainer.style.overflow = 'auto'; // restore AppLayout's explicit overflow bounds
    }

    return () => { 
      document.body.style.overflow = ''; 
      if (scrollContainer) scrollContainer.style.overflow = 'auto';
    };
  }, [introStage, suggestion]);

  // Loading & State Guards
  if (!suggestion && !isRefreshing) return <MatchWaitingScreen />;
  if (!matchData) return null;
  if (suggestion?.status === 'accepted_by_owner') {
    return <MatchWaitResponseScreen matchName={matchData.name || t('common.match_fallback')} />;
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const headerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 2.0, ease: "linear", delay: 0.8 }
    }
  };

  return (
    <div className="relative min-h-screen w-full text-ink selection:bg-primary/30 font-sans overflow-x-hidden">

      <FloatingParticles opacity={introStage >= 3 ? particlesFade : 0} />

      <AnimatePresence>
        {introStage < 4 && (
          <MatchIntroOverlay isVisible={true} introStage={introStage} matchData={matchData} />
        )}
      </AnimatePresence>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={introStage === 4 ? "visible" : "hidden"}
        className="w-full"
        style={{ pointerEvents: introStage === 4 ? 'auto' : 'none' }}
      >
        <motion.div variants={headerVariants}>
          <MatchHeader
            scrollProgress={headerScrollWidth}
            isMuted={isMuted}
            onToggleSound={toggleMute}
            onBack={handleBack}
          />
        </motion.div>

        <main className="relative z-30">
          <section className="relative min-h-[60vh] w-full flex flex-col items-center justify-center text-center pt-32 pb-20 px-8 z-10">
            <motion.div
              initial={{ opacity: 0, y: -40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: "easeOut" }}
              className="flex flex-col items-center gap-12 transform-gpu max-w-3xl"
            >
              <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-4 md:gap-6 w-full max-w-xl">
                <motion.div variants={itemVariants} className="px-8 py-4 rounded-full bg-ink/5 backdrop-blur-2xl border border-divider flex items-center gap-3 shadow-xl">
                  <span className="typo-heading !font-light text-ink tracking-wide">{matchData.name}, {matchData.age}</span>
                </motion.div>

                <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                  {matchData.city && (
                    <motion.div variants={itemVariants} className="px-5 py-2.5 rounded-full bg-background-warm backdrop-blur-md border border-divider flex items-center gap-2">
                      <span className="material-symbols-outlined text-ink/40 text-[16px]">location_on</span>
                      <span className="typo-caption-wide !font-light text-ink/80">{matchData.city}</span>
                    </motion.div>
                  )}

                  {matchData.job && (
                    <motion.div variants={itemVariants} className="px-5 py-2.5 rounded-full bg-background-warm backdrop-blur-md border border-divider flex items-center gap-2">
                      <span className="material-symbols-outlined text-ink/40 text-[16px]">work</span>
                      <span className="typo-caption-wide !font-light text-ink/80">{matchData.job}</span>
                    </motion.div>
                  )}

                  {matchData.identityLabel && (
                    <motion.div variants={itemVariants} className="px-5 py-2.5 rounded-full bg-primary/10 backdrop-blur-md border border-primary/20">
                      <span className="typo-caption text-primary/90">{matchData.identityLabel}</span>
                    </motion.div>
                  )}
                </div>
              </div>

              <motion.div variants={itemVariants} animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="mt-8 w-[1px] h-20 bg-gradient-to-b from-primary/0 via-primary/50 to-primary/0" />
            </motion.div>
          </section>
  
          <div className="max-w-6xl mx-auto flex flex-col gap-48 -mt-32 pb-32 relative z-40">
            <MatchStorySection hook={matchData.stories.hook} label={t('match_profile.story_labels.hook')} />
            <MatchStorySection thesis={matchData.stories.matchReveal} label={t('match_profile.story_labels.reveal')} />
            
            <MatchPhotoGallery photos={matchData.photos} />

            <MatchStorySection compatibilityStory={matchData.stories.whyThisMatch} label={t('match_profile.story_labels.why_this_match')} />
            <MatchStorySection compatibilityStory={matchData.stories.personalityEmotionalFit} label={t('match_profile.story_labels.emotional_fit')} />
            <MatchStorySection compatibilityStory={matchData.stories.lifestyleCompatibility} label={t('match_profile.story_labels.lifestyle')} />
            <MatchStorySection compatibilityStory={matchData.stories.relationshipDynamics} label={t('match_profile.story_labels.dynamics')} />
            <MatchStorySection compatibilityStory={matchData.stories.deepInsight} label={t('match_profile.story_labels.insight')} />
            
            <MatchRealismSection watchout={matchData.stories.watchOut} />
            
            <MatchQuickFacts quickFacts={matchData.quickFacts} />
            <MatchFullProfile fullProfile={matchData.fullProfile} interests={matchData.fullProfile.interests} />

            <div className="mt-24 md:mt-32 flex flex-col items-center gap-8 md:gap-12 text-center px-4 md:px-10 pb-40">
              <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3, repeat: Infinity }} className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center border border-primary/20 blur-[1px]">
                <span className="material-symbols-outlined text-primary text-5xl">auto_awesome</span>
              </motion.div>
              <div className="space-y-6 md:space-y-8 max-w-2xl relative px-2 md:px-0">
                <h3 className="typo-heading italic px-2 !font-extralight leading-relaxed">
                  {(matchData.stories.finalPush || matchData.stories.matchReveal || '').replace(/^["']+|["']+$/g, '')}
                </h3>
                <div className="space-y-4">
                  <p className="typo-body !text-xl !text-ink/80">{t('match_profile.next_step_title')}</p>
                  <p className="typo-desc-xs italic !text-base">{t('match_profile.next_step_desc')}</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-4 opacity-30 mt-8 pb-10">
                <div className="w-[1px] h-20 bg-gradient-to-b from-white to-transparent" />
                <span className="typo-caption-cinematic !text-ink/60">{t('match_profile.ready_to_meet')}</span>
              </div>
            </div>
          </div>
        </main>

        <MatchActionButtons profilePicUrl={matchData.profilePicUrl} onPass={handleReject} onLike={handleLike} isVisible={showActionButtons} />

        {matchData.anthem?.url && (
          <audio ref={audioRef} src={matchData.anthem.url} muted={isMuted} autoPlay loop />
        )}
        <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      </motion.div>
    </div>
  );
};

export default MatchProfilePage;
