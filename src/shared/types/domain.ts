/**
 * Global Domain Types for Clique83
 * Debt #1 Solved: Replaces 'any' with strict, validated interfaces.
 */

export interface User {
  id: string;
  userId?: string;
  name?: string;
  fullName?: string;
  email: string;
  avatarUrl?: string;
  age?: number;
  bio?: string;
  gender?: 'Male' | 'Female' | 'Other' | string;
  location?: string;
  city?: string;
  job?: string;
  round1Completed?: boolean;
  isMatchingSurveyCompleted?: boolean;
  round2Completed?: boolean;
  isMember?: boolean;
  isInMatchingPool?: boolean;
  photos?: UserPhoto[];
}

export interface UserPhoto {
  url: string;
  category?: 'profile' | 'full_body' | 'lifestyle';
  type?: string;
}

export interface LocalizedString {
  en: string;
  vi: string;
}

export type MatchStatus = 'pending' | 'accepted' | 'rejected' | 'accepted_by_owner' | 'accepted_by_target' | 'mutual_accept';

export interface MatchSuggestion {
  id: string;
  userId: string;
  suggestedId: string;
  score: number;
  confidenceFlag: string;
  status: MatchStatus;
  meetingId: string | null;
  suggestedAt: string;
  suggested?: {
    id: string;
    fullName?: string;
    photos?: UserPhoto[];
  };
  reveal: MatchReveal;
}

export interface MatchReveal {
  hero: {
    firstName: string;
    fullName?: string;
    age: number;
    city: string;
    profession: string;
    identityLabel: LocalizedString;
    profilePicUrl?: string;
    avatarUrl?: string;
    anthemUrl?: string;
    anthemName?: string;
    anthemArtist?: string;
    anthemCoverUrl?: string;
  };
  story: MatchStory;
  facts: MatchFacts;
  fullProfile: MatchFullProfile;
  photos?: UserPhoto[];
}

export interface MatchStory {
  hook?: LocalizedString;
  matchReveal?: LocalizedString;
  whyThisMatch?: LocalizedString;
  personalityEmotionalFit?: LocalizedString;
  lifestyleCompatibility?: LocalizedString;
  relationshipDynamics?: LocalizedString;
  deepInsight?: LocalizedString;
  watchOut?: Array<{ point: string; detail: string }>;
  firstDateQuestions?: Array<{ question: string }>;
  finalPush?: LocalizedString;
}

export interface MatchFacts {
  age: number;
  height: number;
  smoking?: string | null;
  drinking?: string | null;
  children?: string | null;
  intention: string;
}

export interface MatchFullProfile {
  bio: string;
  interests: string[];
  education: string;
  workField: string;
  values?: string[];
  about?: {
    bio?: string;
    threeWords?: string[];
  };
  lifestyle?: {
    diet?: string | null;
    fitnessLevel?: number | string;
    petAttitude?: string | null;
  };
  relationship?: {
    communication?: string;
    attachment?: string;
    loveLanguage?: string;
  };
  background?: {
    education?: string;
    culture?: string;
    languages?: string[] | string;
    nationality?: string;
  };
}

export type MeetingStatus = 'awaiting_payment' | 'scheduled' | 'completed' | 'cancelled' | 'active';

export interface Meeting {
  id: string;
  ownerId: string;
  targetId: string;
  status: MeetingStatus;
  scheduledAt?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
  partner?: Partial<User>;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
