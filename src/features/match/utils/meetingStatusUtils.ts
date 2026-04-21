import { TFunction } from 'i18next';
import { Clock, CreditCard, Calendar, MapPin, Sparkles, CheckCircle2, AlertCircle, LucideIcon } from 'lucide-react';
import { Meeting } from '../api/meetingApi';

/**
 * Interface for the UI representation of a meeting status.
 */
export interface StatusDetails {
  label: string;
  description: string;
  color: string;
  icon: LucideIcon;
  actionLabel?: string | null;
  actionRoute?: string;
}

/**
 * getStatusDetails — Map backend meeting status to UI-friendly labels, icons, and actions.
 * Extracted from MeetingStatusPage for better maintainability and DRY compliance.
 */
export const getStatusDetails = (meeting: Meeting, currentUserId: string, t: TFunction): StatusDetails => {
  const isUserA = currentUserId === meeting.userAId;
  const youPaid = isUserA ? meeting.userAPaid : meeting.userBPaid;

  switch (meeting.status) {
    case 'awaiting_payment':
      return {
        label: youPaid ? t('meeting_status.waiting_match_payment') : t('meeting_status.status.awaiting_payment.label'),
        description: youPaid ? '' : t('meeting_status.status.awaiting_payment.description'),
        color: youPaid ? 'text-primary' : 'text-yellow-500',
        icon: CreditCard,
        actionLabel: youPaid ? null : t('meeting_status.status.awaiting_payment.action'),
        actionRoute: '/date-payment'
      };
    case 'awaiting_availability':
      const youSubmitted = isUserA ? !!meeting.userAAvailability : !!meeting.userBAvailability;
      return {
        label: youSubmitted ? t('meeting_status.waiting_match_availability') : t('meeting_status.status.awaiting_availability.label'),
        description: t('meeting_status.status.awaiting_availability.description'),
        color: 'text-primary',
        icon: Calendar,
        actionLabel: youSubmitted ? null : t('meeting_status.status.awaiting_availability.action'),
        actionRoute: '/availability'
      };
    case 'slot_found':
    case 'awaiting_location':
      const youSubmittedLoc = isUserA ? !!meeting.userALocationPreferences?.length : !!meeting.userBLocationPreferences?.length;
      return {
        label: youSubmittedLoc ? t('meeting_status.waiting_match_location') : t('meeting_status.status.awaiting_location.label'),
        description: t('meeting_status.status.awaiting_location.description'),
        color: 'text-blue-400',
        icon: MapPin,
        actionLabel: youSubmittedLoc ? null : t('meeting_status.status.awaiting_location.action'),
        actionRoute: '/select-location'
      };
    case 'confirmed':
      return {
        label: t('meeting_status.status.confirmed.label'),
        description: t('meeting_status.status.confirmed.description'),
        color: 'text-green-400',
        icon: Sparkles,
      };
    case 'completed':
      return {
        label: t('meeting_status.status.completed.label'),
        description: t('meeting_status.status.completed.description'),
        color: 'text-ink/40',
        icon: CheckCircle2,
      };
    case 'expired':
      return {
        label: t('meeting_status.status.expired.label'),
        description: t('meeting_status.status.expired.description'),
        color: 'text-red-500/60',
        icon: AlertCircle,
      };
    default:
      return {
        label: meeting.status.replace('_', ' '),
        description: t('meeting_status.status.processing'),
        color: 'text-primary',
        icon: Clock,
      };
  }
};
