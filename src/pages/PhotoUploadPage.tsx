import { UserPhoto } from '../shared/types/domain';
import { matchingApi } from '../features/matching/api/matchingApi';
import { normalizePhotoCategory, getBackendPhotoKey, TYPE_SLOT_MAP } from '../features/matching/utils/photoUtils';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAsyncAction } from '../shared/hooks/useAsyncAction';
import { ProgressBar } from '../shared/components/ProgressBar';
import { useNotification } from '../shared/context/NotificationContext';
import { useError } from '../shared/context/ErrorContext';
import { PageTransition } from '../shared/components/PageTransition';
import { StepLayout } from '../features/onboarding/components/StepLayout';
import { useAuthContext } from '../shared/context/AuthContext';
import { LoadingOverlay } from '../shared/components/LoadingOverlay';

interface PhotoSlot {
  id: string;
  type: 'id_card' | 'avatar' | 'full_body' | 'lifestyle' | 'optional';
  label: string;
  required: boolean;
  file: File | null;
  preview: string | null;
}

export const PhotoUploadPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { execute } = useAsyncAction();
  const { showSuccess } = useNotification();
  const { showError } = useError();
  const { user, updateUser } = useAuthContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const totalSteps = 1;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [slots, setSlots] = useState<PhotoSlot[]>([
    { id: 'av-1', type: 'avatar', label: t('photos.avatar.title'), required: true, file: null, preview: null },
    { id: 'av-2', type: 'avatar', label: t('photos.avatar.title'), required: true, file: null, preview: null },
    { id: 'fb-1', type: 'full_body', label: t('photos.full_body.title'), required: true, file: null, preview: null },
    { id: 'fb-2', type: 'full_body', label: t('photos.full_body.title'), required: true, file: null, preview: null },
    { id: 'ls-1', type: 'lifestyle', label: t('photos.lifestyle.title'), required: true, file: null, preview: null },
    { id: 'ls-2', type: 'lifestyle', label: t('photos.lifestyle.title'), required: true, file: null, preview: null },
    { id: 'op-1', type: 'optional', label: t('photos.optional.title'), required: false, file: null, preview: null },
    { id: 'op-2', type: 'optional', label: t('photos.optional.title'), required: false, file: null, preview: null },
    { id: 'op-3', type: 'optional', label: t('photos.optional.title'), required: false, file: null, preview: null },
  ]);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    
    const initPhotos = async () => {
      try {
        const response = await matchingApi.getMyPhotos();
        const photos: UserPhoto[] = Array.isArray(response) ? response : [];
        
        if (photos.length > 0) {
          setSlots(prev => {
            const next = [...prev];
            const typeSlots = TYPE_SLOT_MAP;

            photos.forEach((photo: UserPhoto) => {
              const type = normalizePhotoCategory(photo.category || photo.type || '');
              const targetIds = (typeSlots as Record<string, string[]>)[type] || [];
              const emptySlot = next.find(s => targetIds.includes(s.id) && !s.preview && !s.file);
              if (emptySlot) {
                emptySlot.preview = photo.url;
              }
            });

            const allRequiredFilled = next.filter(s => s.required).every(s => !!s.preview);
            if (allRequiredFilled) {
                // If already a member → go to match/waiting page
                // If not a member → go to payment page
                const destination = user?.isMember 
                  ? '/match' 
                  : '/onboarding/review-status';
                navigate(destination, { replace: true });
            }

            return next;
          });
        }
      } catch (err) {
        console.warn('Failed to fetch existing photos for persistence:', err);
      }
    };
    initPhotos();
  }, [navigate]);

  const progress = (step / totalSteps) * 100;

  const getCurrentStepSlots = () => {
    return slots;
  };

  const getStepInfo = () => {
    return {
      title: t('photos.title'),
      description: t('photos.instruction'),
      count: t('photos.required_count', { count: 6 })
    };
  };

  const handleNext = () => {
    const currentSlots = getCurrentStepSlots();
    const incomplete = currentSlots.filter(s => s.required && !s.file && !s.preview);
    
    if (incomplete.length > 0) {
      showError(t('photos.incomplete_toast'));
      return;
    }

    handleInitialSubmission();
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/onboarding/matching-survey');
    }
  };

  const handleSlotClick = (id: string) => {
    setActiveSlotId(id);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check file sizes (5MB limit)
    const MAX_SIZE = 5 * 1024 * 1024;
    const tooLarge = files.some(f => f.size > MAX_SIZE);
    if (tooLarge) {
      showError(t('photos.file_too_large'));
      e.target.value = '';
      return;
    }

    // Ràng buộc không cho chọn quá 9 ảnh
    if (files.length > 9) {
      showError(t('photos.limit_exceeded'));
      files = files.slice(0, 9);
    }

    // Tìm các ô trống để điền ảnh vào (ưu tiên từ ô đang click)
    const emptySlots = slots.filter(s => !s.preview && !s.file);
    if (emptySlots.length === 0) {
      showError(t('photos.all_filled'));
      return;
    }

    const processCount = Math.min(files.length, emptySlots.length);
    const slotsToFill = emptySlots.slice(0, processCount);

    try {
      const fileReaders = files.slice(0, processCount).map((file, idx) => {
        return new Promise<{ id: string, file: File, preview: string }>((resolve) => {
          const reader = new FileReader();
          const slotId = slotsToFill[idx].id;
          reader.onloadend = () => {
            resolve({ id: slotId, file, preview: reader.result as string });
          };
          reader.readAsDataURL(file);
        });
      });

      const results = await Promise.all(fileReaders);
      
      setSlots(prev => prev.map(slot => {
        const update = results.find(r => r.id === slot.id);
        if (update) {
          return { ...slot, file: update.file, preview: update.preview };
        }
        return slot;
      }));
    } catch (err) {
      console.error('Failed to process multiple files:', err);
    }
    
    e.target.value = '';
  };

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSlots(prev => prev.map(slot => 
      slot.id === id ? { ...slot, file: null, preview: null } : slot
    ));
  };

  const handleInitialSubmission = async () => {
    const allRequiredIncomplete = slots.filter(s => s.required && !s.file && !s.preview);
    if (allRequiredIncomplete.length > 0) {
      showError(t('photos.incomplete_toast'));
      return;
    }

    const newFilesExist = slots.some(s => s.file !== null);
    
    if (!newFilesExist) {
        const allRequiredPresent = slots.filter(s => s.required).every(s => s.file || s.preview);
        if (allRequiredPresent) {
            updateUser({ round2Completed: true });
            navigate('/onboarding/review-status', { replace: true });
            return;
        }
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    const formData = new FormData();
    slots.forEach(slot => {
      if (slot.file) {
        formData.append(getBackendPhotoKey(slot.id, slot.type), slot.file);
      }
    });

    try {
      await execute(
        () => matchingApi.uploadGallery(formData),
        {
          loadingMessage: t('photos.uploading'),
          successMessage: t('photos.success'),
          showToastOnSuccess: true
        }
      );
      
      updateUser({ round2Completed: true });
      navigate('/onboarding/review-status', { replace: true });
    } catch (err: unknown) {
      console.error('Photo upload failed:', err);
      const errorMsg = (err as any)?.message || '';
      if (errorMsg.includes('Profile photo limit (9) reached')) {
        updateUser({ round2Completed: true });
        navigate('/onboarding/review-status', { replace: true });
      } else if (errorMsg.includes('FILE_TOO_LARGE')) {
        showError(t('photos.file_too_large'));
      } else {
        showError(errorMsg || t('photos.upload_failed'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'id_card': return 'id_card';
      case 'avatar': return 'account_circle';
      case 'full_body': return 'accessibility_new';
      case 'lifestyle': return 'camera_enhance';
      default: return 'add_photo_alternate';
    }
  };

  const currentStepInfo = getStepInfo();

  return (
    <div className="fixed inset-0 bg-background-paper z-50 overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="h-full flex flex-col items-center">
        <div className="w-full max-w-md h-full flex flex-col">
          <div className="fixed top-0 left-0 w-full z-[60]">
            <ProgressBar progress={progress} />
          </div>

          <div className="flex-1 min-h-0 pt-10">
            <AnimatePresence mode="wait">
              <PageTransition key={`photo-step-${step}`}>
                <StepLayout
                  subtitle={t('photos.step_subtitle')}
                  title={currentStepInfo.title}
                  description={
                    <div className="space-y-1">
                      <p className="text-primary font-black text-[10px] tracking-widest uppercase">{currentStepInfo.count}</p>
                      <p>{currentStepInfo.description}</p>
                    </div>
                  }
                  onNext={handleNext}
                  onBack={handleBack}
                  showBack={false}
                  nextDisabled={isSubmitting || !getCurrentStepSlots().filter(s => s.required).every(s => s.file || s.preview)}
                  showNext={!isSubmitting && (getCurrentStepSlots().filter(s => s.required).every(s => s.file || s.preview))}
                  nextLabel={step === totalSteps ? t('photos.submit') : t('common.next')}
                >
                  <div className="flex flex-col items-center justify-center gap-6 py-4 w-full">
                    <div className="grid grid-cols-2 gap-4 w-full max-w-[320px] mx-auto">
                      {getCurrentStepSlots().map((slot, index) => (
                        <motion.div
                          key={slot.id}
                          initial={{ opacity: 0, scale: 0.9, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => handleSlotClick(slot.id)}
                          className={`
                            relative ${step === 1 ? 'aspect-[1.58/1]' : 'aspect-[3/4]'} rounded-2xl border-2 border-dashed transition-all cursor-pointer group overflow-hidden shadow-2xl
                            ${slot.preview ? 'border-primary/50 bg-ink/40' : 'border-divider bg-background-warm hover:border-primary/40 hover:bg-white/[0.08] backdrop-blur-sm'}
                          `}
                        >
                          <AnimatePresence mode="wait">
                            {slot.preview ? (
                              <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="w-full h-full relative"
                              >
                                <img src={slot.preview} alt={slot.label} className={`w-full h-full ${step === 1 ? 'object-contain bg-black/20' : 'object-cover'}`} />
                                <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <button 
                                    onClick={(e) => handleRemove(e, slot.id)}
                                    className="size-10 rounded-full bg-red-500/80 backdrop-blur-sm flex items-center justify-center hover:bg-red-500 transition-colors"
                                  >
                                    <span className="material-symbols-outlined text-ink">delete</span>
                                  </button>
                                </div>
                              </motion.div>
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center p-4">
                                <span className={`material-symbols-outlined text-3xl mb-3 transition-colors ${slot.required ? 'text-primary/70' : 'text-ink/20'}`}>
                                  {getIcon(slot.type)}
                                </span>
                                <p className={`text-[10px] font-black uppercase tracking-wider text-center ${slot.required ? 'text-ink/60' : 'text-ink/30'}`}>
                                  {slot.label}
                                </p>
                                <p className="text-[10px] font-medium text-ink/20 mt-1 uppercase tracking-tighter">
                                  {t('photos.upload_button')}
                                </p>
                                {slot.required && !slot.preview && (
                                  <div className="mt-2 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(209,169,62,0.8)]" />
                                )}
                              </div>
                            )}
                          </AnimatePresence>

                          <div className="absolute top-3 right-3">
                            {slot.file && (
                              <div className="size-6 rounded-full bg-primary flex items-center justify-center shadow-lg">
                                <span className="material-symbols-outlined text-[14px] text-background-dark font-black">check</span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </StepLayout>
              </PageTransition>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <LoadingOverlay isVisible={isSubmitting} message={t('photos.uploading')} />

      <input 
        type="file" 
        multiple
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*"
      />
    </div>
  );
};

export default PhotoUploadPage;
