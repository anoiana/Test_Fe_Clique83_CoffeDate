import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Check, Coffee, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@tanstack/react-query';
import { PageTransition } from '../shared/components/PageTransition';
import { BackButton } from '../shared/components/BackButton';
import { meetingApi } from '../features/match/api/meetingApi';
import { useLoading } from '../shared/context/LoadingContext';
import { useNotification } from '../shared/context/NotificationContext';
import FloatingParticles from '../shared/components/FloatingParticles';
import { LoadingOverlay } from '../shared/components/LoadingOverlay';

/**
 * LocationSelectionPage
 * Allows users to browse and select 5 preferred cafes for their date.
 */
export const LocationSelectionPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const routerLocation = useLocation();
    const { showLoader, hideLoader } = useLoading();
    const { showError, showSuccess } = useNotification();
    
    const meetingId = routerLocation.state?.meetingId;
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const { data: locations = [], isLoading: isLoadingLocations } = useQuery({
        queryKey: ['locations'],
        queryFn: () => meetingApi.getLocations(),
    });

    const submitMutation = useMutation({
        mutationFn: (locationIds: string[]) => {
            if (!meetingId) throw new Error('Missing meeting info.');
            return meetingApi.submitLocationPreferences(meetingId, locationIds);
        },
        onMutate: () => {
            showLoader('SUBMITTING YOUR CHOICES');
        },
        onSuccess: () => {
            showSuccess(t('location_selection.submit_success'));
            navigate('/scheduling-success', { state: { meetingId, type: 'location' }, replace: true });
        },
        onError: (err: any) => {
            showError(err.message || 'Error submitting.');
        },
        onSettled: () => {
            hideLoader();
        }
    });

    const toggleLocation = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(prev => prev.filter(i => i !== id));
        } else {
            if (selectedIds.length >= 5) {
                showError(t('location_selection.max_error'));
                return;
            }
            setSelectedIds(prev => [...prev, id]);
        }
    };

    const handleConfirm = () => {
        if (selectedIds.length < 5) {
            showError(t('location_selection.min_error'));
            return;
        }
        submitMutation.mutate(selectedIds);
    };

    if (isLoadingLocations) {
        return <LoadingOverlay isVisible={true} message={t('location_selection.loading_locations')} />;
    }

    return (
        <PageTransition className="bg-background-paper h-[100dvh] w-full text-ink relative flex flex-col overflow-hidden">
            <FloatingParticles count={20} opacity={0.2} />

            <div className="flex flex-col h-full relative max-w-md mx-auto w-full z-10">
                
                {/* Compact Header Section */}
                <header className="px-6 pt-8 pb-4 shrink-0">
                    <div className="flex items-center justify-between mb-6">
                        <BackButton onClick={() => navigate(-1)} />
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">{t('payment.premium_service')}</span>
                    </div>
                    
                    <h1 className="text-3xl font-black tracking-tight text-ink leading-tight uppercase italic mb-2">
                        {t('location_selection.title')}
                    </h1>
                    <p className="text-ink/40 text-xs font-medium tracking-wide">
                        {t('location_selection.subtitle')}
                    </p>
                </header>

                {/* Compact Selection Tracker */}
                <div className="px-6 py-2 shrink-0">
                    <div className="bg-background-warm/60 border border-divider rounded-3xl p-4 flex items-center justify-between shadow-xl">
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black uppercase tracking-widest text-ink/30 mb-0.5">{t('location_selection.selected')}</span>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-3xl font-black text-ink">{selectedIds.length}</span>
                                <span className="text-sm font-black text-primary">/ 5</span>
                            </div>
                        </div>
                        
                        <div className="flex gap-1.5">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div 
                                    key={i} 
                                    className={`
                                        h-1 w-5 rounded-full transition-all duration-700 
                                        ${i <= selectedIds.length 
                                            ? 'bg-primary shadow-[0_0_10px_rgba(212,175,55,0.5)]' 
                                            : 'bg-ink/5'}
                                    `} 
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Locations List - Fully Expanded */}
                <main className="flex-1 overflow-y-auto px-6 pt-4 pb-32 no-scrollbar">
                    <div className="flex flex-col gap-4">
                        {locations.map((loc, idx) => {
                            const isSelected = selectedIds.includes(loc.id);
                            return (
                                <motion.button
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.03 * idx }}
                                    key={loc.id}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => toggleLocation(loc.id)}
                                    className={`
                                        relative w-full rounded-[2rem] overflow-hidden border transition-all duration-500 text-left
                                        ${isSelected 
                                            ? 'border-primary bg-primary/10 shadow-[0_15px_30px_-10px_rgba(212,175,55,0.3)] ring-1 ring-primary/20' 
                                            : 'border-divider bg-white/[0.02] hover:bg-background-warm/80'
                                        }
                                    `}
                                >
                                    <div className="p-6 flex items-center justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <h3 className={`text-xl font-black transition-colors leading-tight mb-2 ${isSelected ? 'text-ink' : 'text-ink/90'}`}>
                                                {loc.name}
                                            </h3>
                                            
                                            <div className="flex items-start gap-2 text-ink/40">
                                                <MapPin size={14} className="shrink-0 mt-0.5" />
                                                <span className="text-sm font-medium leading-relaxed">{loc.address}</span>
                                            </div>
                                        </div>

                                        <div 
                                            className={`
                                                w-10 h-10 rounded-2xl flex items-center justify-center border transition-all duration-500 shrink-0
                                                ${isSelected 
                                                    ? 'bg-primary border-primary shadow-lg text-black' 
                                                    : 'bg-background-warm border-divider text-ink/20'
                                                }
                                            `}
                                        >
                                            {isSelected ? (
                                                <Check className="w-5 h-5 stroke-[4px]" />
                                            ) : (
                                                <Coffee className="w-4 h-4 opacity-40" />
                                            )}
                                        </div>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </main>
            </div>

            {/* Sticky Action Footer */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-6 pb-8 bg-gradient-to-t from-background-dark via-background-dark to-transparent z-30 backdrop-blur-sm">
                <div className="relative group">
                    <div className={`absolute inset-0 bg-primary/20 blur-2xl rounded-full transition-opacity duration-500 ${selectedIds.length >= 5 ? 'opacity-100' : 'opacity-0'}`} />
                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={selectedIds.length < 5}
                        onClick={handleConfirm}
                        className={`
                            relative z-10 w-full py-5 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[11px] transition-all duration-500 flex items-center justify-center gap-3 overflow-hidden
                            ${selectedIds.length >= 5 
                                ? 'bg-primary text-black shadow-2xl' 
                                : 'bg-background-warm text-ink/10 cursor-not-allowed border border-divider'
                            }
                        `}
                    >
                        {selectedIds.length >= 5 && (
                            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] animate-[shimmer_2s_infinite] skew-x-12" />
                        )}
                        <Sparkles className={`w-4 h-4 ${selectedIds.length >= 5 ? 'animate-pulse' : ''}`} />
                        <span>{t('location_selection.submit')}</span>
                    </motion.button>
                </div>
            </div>
        </PageTransition>
    );
};
