// ─── Shared Domain Types ───────────────────────────────────────────────────────
import { User } from './models';

// ─── Google Auth ──────────────────────────────────────────────────────────────
export interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
}

export interface GSIWindow {
  google?: {
    accounts?: {
      id?: {
        initialize: (config: GSIConfig) => void;
        prompt?: (callback: (notification: GSINotify) => void) => void;
      };
    };
  };
}

export interface GSIConfig {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
  auto_select?: boolean;
  itp_support?: boolean;
  use_fedcm_for_prompt?: boolean;
}

export interface GSINotify {
  isNotDisplayed: () => boolean;
  isSkippedMoment: () => boolean;
  isDisplayed: () => boolean;
}

// ─── Navigation State ─────────────────────────────────────────────────────────
export interface MutualMatchState {
  meetingId?: string;
  matchName?: string;
  matchAvatar?: string;
}

export interface GridSelectionState {
  initialSlots?: string[];
  meetingId?: string;
  updatedSlots?: string[];
}

// ─── API Error ────────────────────────────────────────────────────────────────
export interface ApiError {
  message?: string;
  response?: {
    status?: number;
    data?: unknown;
  };
}

// ─── TopControls ──────────────────────────────────────────────────────────────
export interface TopControlsProps {
  user: User | null;
  updateUser: (data: Partial<User>) => void;
  logout: () => Promise<void>;
  isBeginPath: boolean;
  isAuthStarted: boolean;
  setShowReview: (show: boolean) => void;
  isMatchPath: boolean;
}

// ─── Match Profile ─────────────────────────────────────────────────────────────
export interface MatchDataForNavigation {
  name?: string;
  profilePicUrl?: string;
  [key: string]: unknown;
}

export interface PhotoItem {
  url: string;
  category?: string;
  isPublic?: boolean;
}

export interface SuggestionItem {
  status: string;
  reveal?: {
    hero?: {
      firstName?: string;
      fullName?: string;
      profilePicUrl?: string;
      avatarUrl?: string;
    };
  };
  meetingId?: string;
}

// ─── Localization ─────────────────────────────────────────────────────────────
export type LocalizedValue = string | LocalizedString | undefined;

export interface LocalizedString {
  en?: string;
  vi?: string;
  [lang: string]: string | undefined;
}

// ─── Survey ───────────────────────────────────────────────────────────────────
export type SurveyStepComponent = React.ComponentType<{
  value: unknown;
  onChange: (value: unknown) => void;
  onNext: () => void;
  onBack: () => void;
}>;

export interface StepWrapperProps {
  component: SurveyStepComponent;
  name: string;
  onNext: () => void;
  onBack: () => void;
}

// ─── R1 Completion Intro ──────────────────────────────────────────────────────
export interface InfoRowProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | undefined;
}

// ─── Meeting Status ─────────────────────────────────────────────────────────
export type StatusIconType =
  | typeof import('lucide-react').Clock
  | typeof import('lucide-react').CreditCard
  | typeof import('lucide-react').Calendar
  | typeof import('lucide-react').MapPin
  | typeof import('lucide-react').Sparkles
  | typeof import('lucide-react').CheckCircle2
  | typeof import('lucide-react').AlertCircle;

// ─── Framer Motion ────────────────────────────────────────────────────────────
export type CubicBezier = [number, number, number, number];

// ─── Intake Review ────────────────────────────────────────────────────────────
export interface IntakeReviewInfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
  isLarge?: boolean;
}

// ─── Availability ─────────────────────────────────────────────────────────────
export interface AvailabilityDragReturn {
  selectedSlots: Set<string>;
  isDragging: boolean;
  removeRange: (dateStr: string, hour: number) => void;
  setSelectedSlots: React.Dispatch<React.SetStateAction<Set<string>>>;
}

// ─── Auth Page ───────────────────────────────────────────────────────────────
export interface UserProgress {
  round1Completed?: boolean;
  isMatchingSurveyCompleted?: boolean;
  round2Completed?: boolean;
  isMember?: boolean;
}
