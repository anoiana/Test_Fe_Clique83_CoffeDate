import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, Coffee, MapPin, Sparkles } from 'lucide-react';
import { meetingApi, Meeting } from '../api/meetingApi';
import { useLoading } from '../../../shared/context/LoadingContext';
import { useNotification } from '../../../shared/context/NotificationContext';

interface ConfirmedDateCardProps {
  meeting: Meeting;
}

const MINUTES_TO_UNLOCK = 30;

function getRemainingMinutes(agreedSlot: string): number {
  const agreedDate = new Date(agreedSlot);
  const unlockTime = new Date(agreedDate.getTime() + MINUTES_TO_UNLOCK * 60 * 1000);
  const now = new Date();
  const diffMs = unlockTime.getTime() - now.getTime();
  if (diffMs <= 0) return 0;
  return Math.ceil(diffMs / (60 * 1000));
}

function isUnlocked(agreedSlot: string): boolean {
  return getRemainingMinutes(agreedSlot) <= 0;
}

/**
 * ConfirmedDateCard — Displays the final date and location details.
 * Phase 33: Includes 30-minute countdown before feedback is allowed.
 */
export const ConfirmedDateCard = ({ meeting }: ConfirmedDateCardProps) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [location, setLocation] = useState<any>(null);
  const [remainingMinutes, setRemainingMinutes] = useState(() =>
    getRemainingMinutes(meeting.agreedSlot!)
  );

  const { showLoader, hideLoader } = useLoading();
  const { showError } = useNotification();

  useEffect(() => {
    if (meeting.agreedLocationId) {
      meetingApi.getLocations().then(locs => {
        const found = locs.find(l => l.id === meeting.agreedLocationId);
        if (found) setLocation(found);
      });
    }
  }, [meeting.agreedLocationId]);

  // Countdown timer — update every 30 seconds
  useEffect(() => {
    if (!meeting.agreedSlot) return;
    if (isUnlocked(meeting.agreedSlot)) return;

    const updateRemaining = () => {
      setRemainingMinutes(getRemainingMinutes(meeting.agreedSlot!));
    };

    updateRemaining();
    const interval = setInterval(updateRemaining, 30_000);
    return () => clearInterval(interval);
  }, [meeting.agreedSlot]);

  const date = new Date(meeting.agreedSlot!);
  const dateStr = date.toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });
  const timeStr = date.toLocaleTimeString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const unlocked = isUnlocked(meeting.agreedSlot!);
  const minsLeft = getRemainingMinutes(meeting.agreedSlot!);

  const handleGetDirections = () => {
    if (!location) return;
    const query = encodeURIComponent(`${location.name}, ${location.address}, ${location.city}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const handleCompleteMeeting = async () => {
    showLoader('ĐANG XỬ LÝ KẾT THÚC CUỘC HẸN...');
    try {
      await meetingApi.completeMeeting(meeting.id);
      
      // Lưu agreedSlot vào localStorage nếu cần cho các bước sau
      if (meeting.agreedSlot) {
        localStorage.setItem(`meeting_${meeting.id}_agreedSlot`, meeting.agreedSlot);
      }
      
      navigate(`/meeting/${meeting.id}/feedback`);
    } catch (err: unknown) {
      showError('KHÔNG THỂ CẬP NHẬT TRẠNG THÁI CUỘC HẸN. VUI LÒNG THỬ LẠI.');
    } finally {
      hideLoader();
    }
  };

  return (
    <div className="flex flex-col w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-6 mb-8 relative px-2">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Date Section */}
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-transform hover:scale-105 border border-primary/20">
            <Calendar size={18} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[10px] font-bold text-primary/80 uppercase tracking-widest mb-0.5">{t('meeting_status.date')}</span>
            <span className="text-[14px] md:text-base font-black text-ink uppercase tracking-tight truncate">{dateStr}</span>
          </div>
        </div>

        {/* Time Section */}
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-transform hover:scale-105 border border-primary/20">
            <Clock size={18} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[10px] font-bold text-primary/80 uppercase tracking-widest mb-0.5">{t('meeting_status.time')}</span>
            <span className="text-primary text-[14px] md:text-base font-black uppercase tracking-widest truncate">{timeStr}</span>
          </div>
        </div>

        {/* Location Section */}
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/10 border border-primary/20 shrink-0 flex items-center justify-center shadow-inner transition-transform hover:scale-105">
            {location?.imageUrl ? (
              <img src={location.imageUrl} alt={location.name} className="w-full h-full object-cover" />
            ) : (
              <Coffee size={18} className="text-primary" strokeWidth={2.5} />
            )}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[10px] font-bold text-primary/80 uppercase tracking-widest mb-0.5">{t('meeting_status.location')}</span>
            <h3 className="text-[14px] md:text-base font-black text-ink uppercase tracking-tight leading-snug break-words pr-2">
              {location?.name || location?.address || ''}
            </h3>
            {location?.name && location?.address && (
              <p className="text-[11px] text-ink/40 font-bold uppercase tracking-tight leading-normal break-words mt-1 pr-2">
                {location.address}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={handleGetDirections}
          className="w-full py-4 rounded-[1.5rem] bg-background-warm/60 hover:bg-background-warm/80 active:bg-background-warm border border-divider text-ink/80 font-bold text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all group"
        >
          <span className="material-symbols-outlined text-[16px] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform text-ink/60 group-hover:text-ink">near_me</span>
          {t('date_set.get_directions')}
        </button>

        {/* ── Phase 33: Feedback Unlock Button ── */}
        <div className="flex flex-col gap-2 mt-2">
          {!unlocked ? (
            <button
              disabled
              className="w-full py-5 rounded-[2rem] bg-background-warm/80 backdrop-blur-md border border-divider text-ink/30 font-black text-[13px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 cursor-not-allowed transition-all grayscale opacity-60"
            >
              <Sparkles className="w-5 h-5 opacity-20" />
              XÁC NHẬN ĐÃ GẶP MẶT
            </button>
          ) : (
            <button
              onClick={handleCompleteMeeting}
              className="w-full py-5 rounded-[2rem] bg-primary text-black font-black text-[13px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-[0_10px_40px_rgba(209,169,62,0.2)] hover:brightness-110 active:scale-[0.98] transition-all group"
            >
              <Sparkles className="w-5 h-5" />
              XÁC NHẬN ĐÃ GẶP MẶT
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
