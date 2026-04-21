import { apiClient } from '../../../infrastructure/apiClient';

export interface LocalizedString {
  en: string;
  vn: string;
}

export interface MatchSuggestion {
  id: string;
  userId: string;
  suggestedId: string;
  score: number;
  confidenceFlag: string;
  status: string;
  meetingId: string | null;
  suggestedAt: string;
  suggested?: {
    id: string;
    fullName?: string;
    photos?: Array<{ url: string; category?: string; type?: string }>;
  };
  aiStory?: {
    userAStory: {
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
    };
    userBStory: {
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
    };
  };
  reveal: {
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
    story: {
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
    };
    facts: {
      age: number;
      height: number;
      smoking?: string | null;
      drinking?: string | null;
      children?: string | null;
      smokingLevel?: string | null;
      drinkingLevel?: string | null;
      childrenGoal?: string | null;
      intention: string;
    };
    fullProfile: {
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
        exercise?: string | null;
        activity?: string | null;
        pets?: string | null;
        dietType?: string | null;
        fitnessLevel?: string | null;
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
    };
    photos?: Array<{ url: string; category: string }>;
  };
}


export const matchApi = {
  getLatestSuggestion: async (): Promise<MatchSuggestion[]> => {
    return apiClient.get('/suggestions/me');
  },
  acceptSuggestion: async (id: string): Promise<void> => {
    return apiClient.post(`/suggestions/${id}/accept`, {});
  },
  rejectSuggestion: async (id: string): Promise<void> => {
    return apiClient.post(`/suggestions/${id}/reject`, {});
  }
};
