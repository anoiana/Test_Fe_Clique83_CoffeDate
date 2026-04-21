import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageTransition } from '../../../../shared/components/PageTransition';
import { Button } from '../../../../shared/components/Button';

/**
 * ConfettiParticle Component: Celebratory explosion logic.
 */
const ConfettiParticle = ({ color, index }: { color: string; index: number }) => {
    const angle = (index / 40) * Math.PI * 2;
    const velocity = Math.random() * 300 + 150;
    const xEnd = Math.cos(angle) * velocity;
    const yEnd = Math.sin(angle) * velocity;

    return (
        <motion.div
            initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
            animate={{
                x: xEnd,
                y: yEnd,
                opacity: 0,
                scale: [0, 1.2, 0.4],
                rotate: Math.random() * 360
            }}
            transition={{
                duration: Math.random() * 1.5 + 1,
                ease: [0.1, 0.9, 0.2, 1],
                delay: Math.random() * 0.1
            }}
            className="absolute w-1.5 h-1.5 rounded-sm"
            style={{ backgroundColor: color }}
        />
    );
};

export const Round3SuccessPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [showExplosion, setShowExplosion] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowExplosion(true), 500);
        return () => clearTimeout(timer);
    }, []);

    const handleContinueToMatch = () => {
        navigate('/match', { replace: true });
    };

    return (
        <PageTransition className="fixed inset-0 bg-background-paper z-[100] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
            {/* Background Mesh Gradient */}
            <div
                className="absolute inset-0 z-0 opacity-40 pointer-events-none"
                style={{ background: 'var(--gradient-mesh)' }}
            />

            {/* Confetti Explosion */}
            {showExplosion && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                    {[...Array(40)].map((_, i) => (
                        <ConfettiParticle key={i} index={i} color={i % 2 === 0 ? '#8B1D3D' : '#D4AF37'} />
                    ))}
                </div>
            )}

            <div className="relative z-10 flex flex-col items-center">
                {/* Logo Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="mb-12"
                >
                    <img src="./logo.png" alt="Clique83" className="h-16 w-auto" />
                </motion.div>
                {/* lll */}
                {/* Celebration Icon */}
                <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 12, delay: 0.2 }}
                    className="w-24 h-24 rounded-[2.5rem] bg-primary/10 flex items-center justify-center mb-10 border border-primary/20 relative"
                >
                    <Sparkles className="w-12 h-12 text-primary" />
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-2 -right-2 bg-primary text-background-paper p-2 rounded-full shadow-lg"
                    >
                        <Sparkles className="w-4 h-4" />
                    </motion.div>
                </motion.div>

                {/* Title & Description */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="space-y-4 max-w-sm mb-12"
                >
                    <h1 className="text-3xl font-black text-ink uppercase tracking-tight leading-none">
                        CHÚC MỪNG BẠN!
                    </h1>
                    <div className="h-1 w-16 bg-primary mx-auto rounded-full" />
                    <p className="typo-ritual-body text-ink/60 mt-6 leading-relaxed">
                        Hồ sơ của bạn đã được hoàn thiện 100%. Chúng tôi đã bắt đầu quá trình tìm kiếm người đồng điệu nhất với tâm hồn bạn.
                    </p>
                </motion.div>

                {/* Action Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="w-full max-w-xs"
                >
                    <Button
                        variant="golden"
                        onClick={handleContinueToMatch}
                        className="w-full py-6 flex items-center justify-center gap-3 shadow-burgundy group"
                    >
                        <span className="uppercase tracking-[0.2em] font-bold text-sm">Khám phá ngay</span>
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                </motion.div>

                {/* Secondary Note */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    transition={{ delay: 1.2, duration: 1 }}
                    className="mt-10 text-[11px] uppercase tracking-widest font-black text-ink"
                >
                    Một trải nghiệm độc bản đang chờ đợi
                </motion.p>
            </div>
        </PageTransition>
    );
};
