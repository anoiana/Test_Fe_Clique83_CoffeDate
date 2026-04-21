import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PageTransition } from '../shared/components/PageTransition';
import { Check } from 'lucide-react';
import { useAuthContext } from '../shared/context/AuthContext';
import { useNavigationFlow } from '../shared/hooks/useNavigationFlow';
import Logo from '../assets/logo.png';

/**
 * Particle Explosion Component
 * Creates a burst of burgundy and kraft particles for the "Explosion" effect.
 */
const ParticleExplosion = () => {
  const particles = Array.from({ length: 100 }); // Tăng số lượng hạt
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-50">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
          animate={{
            x: (Math.random() - 0.5) * 1200, // Tỏa rộng hơn
            y: (Math.random() - 0.5) * 1200,
            opacity: 0,
            scale: Math.random() * 2.5 + 0.5,
          }}
          transition={{
            duration: 1.5,
            ease: [0.12, 0, 0.39, 0], // Hiệu ứng tỏa nhanh chậm dần
            delay: Math.random() * 0.2, // Hạt bay ra không cùng lúc
          }}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            backgroundColor: i % 3 === 0 ? 'var(--c-primary)' : (i % 3 === 1 ? 'var(--c-highlight)' : 'var(--c-divider)'),
          }}
        />
      ))}
    </div>
  );
};

export const CommunityGuidelinesPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { navigateToCorrectStep } = useNavigationFlow();
  
  const [showContent, setShowContent] = useState(false);
  const [showExplosion, setShowExplosion] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 400);

    const explosionTimer = setTimeout(() => {
      setShowExplosion(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearTimeout(explosionTimer);
    };
  }, []);

  const handleAgree = () => {
    if (user) {
      localStorage.setItem(`clique_guidelines_accepted_${user.id || user.userId}`, 'true');
      navigateToCorrectStep(user);
    } else {
      navigate('/');
    }
  };

  const rules = [
    { key: 'real_profile' },
    { key: 'screening' },
    { key: 'serious' },
    { key: 'time_is_gold' },
    { key: 'real_life' },
    { key: 'civil_behavior' },
    { key: 'be_proactive' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.4,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <PageTransition>
      <div className="relative min-h-[100dvh] bg-background flex flex-col items-center overflow-x-hidden p-6 font-sans">
        {/* Explosion Effect */}
        <AnimatePresence>
          {showExplosion && <ParticleExplosion />}
        </AnimatePresence>

        {/* Paper Canvas */}
        <div className="w-full max-w-lg flex-1 flex flex-col z-10 py-6">
          
          {/* Header with Logo */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center mb-8 flex flex-col items-center"
          >
            <img src={Logo} alt="Clique83 Logo" className="w-16 h-auto mb-6 opacity-90" />
            
            <p className="text-ink-a70 text-[10px] font-medium tracking-[0.2em] uppercase mb-1">
              {t('onboarding.community_guidelines.title')}
            </p>
            <h1 className="text-primary font-serif text-2xl md:text-3xl italic leading-tight">
              {t('onboarding.community_guidelines.brand')}
            </h1>
          </motion.div>

          {/* Rules List - Compact Spacing */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={showContent ? "visible" : "hidden"}
            className="space-y-4 flex-1"
          >
            {rules.map((rule) => (
              <motion.div key={rule.key} variants={itemVariants} className="group">
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-5 h-5 rounded-full border border-primary/20 flex items-center justify-center bg-surface group-hover:bg-primary/5 transition-colors">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-ink font-serif text-md font-bold mb-0.5 leading-tight">
                      {t(`onboarding.community_guidelines.rules.${rule.key}.title`)}
                    </h3>
                    <p className="text-ink-a70 text-xs leading-relaxed">
                      {t(`onboarding.community_guidelines.rules.${rule.key}.desc`)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Footer & Agree Button - Compacted */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={showContent ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.5, duration: 1 }}
            className="mt-10 text-center space-y-5"
          >
            <div className="px-4">
              <p className="text-ink-a50 text-[11px] leading-relaxed">
                {t('onboarding.community_guidelines.agreement_prefix')} <br />
                <a 
                  href="https://clique83.com/clique-connection-company-limited-agency-policy/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary underline font-medium hover:text-primary-dark transition-colors"
                >
                  {t('onboarding.community_guidelines.policy_link')}
                </a>
              </p>
            </div>

            <button
              onClick={handleAgree}
              className="btn-cta-primary w-full max-w-xs mx-auto shadow-golden-btn hover:shadow-golden-btn-hover transition-all duration-300"
            >
              {t('onboarding.community_guidelines.agree_btn')}
            </button>
          </motion.div>
        </div>

        {/* Paper Texture Overlay */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] z-0" />
      </div>
    </PageTransition>
  );
};
