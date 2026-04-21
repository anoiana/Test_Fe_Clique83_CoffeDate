import { useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { MatchSuggestion } from '../api/matchApi';
import { LocalizedValue } from '../../../shared/types/index';

/**
 * SIGNATURE_ANTHEM
 * Curated signature anthem as a reliable fallback
 */
export const SIGNATURE_ANTHEM = {
  id: 1,
  title: 'Step-by-step',
  url: 'https://www.fesliyanstudios.com/musicfiles/2024-05-21_-_Step-by-step_-_www.FesliyanStudios.com/2024-05-21_-_Step-by-step_-_www.FesliyanStudios.com.mp3',
  artist: 'Steve Oxen'
};

/**
 * useMatchProfileData
 * Custom hook to extract large data transformation logic from MatchProfilePage.
 * Maps the server's `reveal` object into a normalized shape for UI components.
 */
export const useMatchProfileData = (suggestion: MatchSuggestion | null) => {
  const { t, i18n } = useTranslation();

  const getLoc = useCallback((obj: any) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    const lang = i18n.language.startsWith('vi') ? 'vi' : 'en';
    // Support both "vi" and "vn" keys from backend
    return obj[lang] || (obj as any)['vn'] || obj['en'] || '';
  }, [i18n.language]);

  const matchData = useMemo(() => {
    if (!suggestion) return null;
    const { reveal } = suggestion;
    const story = reveal?.story;
    const facts = reveal?.facts || {} as any;
    const factBlock = (reveal as any)?.factBlock || {};
    const fp = reveal?.fullProfile || {} as any;

    return {
      name: suggestion.suggested?.fullName || reveal.hero.fullName || reveal.hero.firstName,
      age: reveal.hero.age,
      city: reveal.hero.city,
      job: reveal.hero.profession,
      identityLabel: getLoc(reveal.hero.identityLabel),
      profilePicUrl: (reveal?.photos || suggestion.suggested?.photos || []).find(p => p.category === 'profile')?.url || (reveal?.photos || suggestion.suggested?.photos || [])[0]?.url || reveal.hero.profilePicUrl || reveal.hero.avatarUrl || "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=2000&auto=format&fit=crop", 
      status: suggestion.status,
      anthem: {
        url: reveal.hero.anthemUrl || SIGNATURE_ANTHEM.url,
        song: reveal.hero.anthemName || SIGNATURE_ANTHEM.title,
        artist: reveal.hero.anthemArtist || SIGNATURE_ANTHEM.artist,
        albumCoverUrl: reveal.hero.anthemCoverUrl || "https://images.unsplash.com/photo-1514525253344-f81f1f714342?q=80&w=1000&auto=format&fit=crop"
      },
      // ── Quick Facts ──
      // Map both old field names (smoking, drinking, children) and new ones
      // (smokingLevel, drinkingLevel, childrenGoal) from the API
      quickFacts: {
        age: facts.age || factBlock.age,
        city: reveal.hero.city || factBlock.city,
        job: reveal.hero.profession || factBlock.job,
        height: facts.height || factBlock.height,
        smoking: facts.smoking || facts.smokingLevel || factBlock.smoking || "Non-smoker",
        drinking: facts.drinking || facts.drinkingLevel || factBlock.drinking || "Regularly",
        children: facts.children || facts.childrenGoal || factBlock.children || "Someday",
        intention: facts.intention || factBlock.marriage_plan,
        // New fields from API
        mbti: facts.mbti,
        attachmentStyle: facts.attachmentStyle,
        socialEnergy: facts.socialEnergy,
        communicationStyle: facts.communicationStyle,
        maritalStatus: facts.maritalStatus || factBlock.maritalStatus,
        religion: facts.religionBelief || factBlock.religion,
      },
      // ── Stories ──
      stories: {
        hook: getLoc(story?.hook),
        matchReveal: getLoc(story?.matchReveal),
        whyThisMatch: getLoc(story?.whyThisMatch),
        personalityEmotionalFit: getLoc(story?.personalityEmotionalFit),
        lifestyleCompatibility: getLoc(story?.lifestyleCompatibility),
        relationshipDynamics: getLoc(story?.relationshipDynamics),
        deepInsight: getLoc(story?.deepInsight),
        watchOut: story?.watchOut || [],
        firstDateQuestions: story?.firstDateQuestions || [],
        finalPush: getLoc(story?.finalPush)
      },
      // ── Full Profile ──
      // Map both old and new field names from the API
      fullProfile: {
        ...fp,
        about: {
          bio: fp.about?.bio || fp.bio,
          threeWords: fp.about?.threeWords || fp.descriptiveWords || []
        },
        // Map lifePriorities → values (for the Values section in UI)
        values: fp.values || fp.lifePriorities || [],
        lifestyle: {
          exercise: fp.lifestyle?.exercise || fp.lifestyle?.fitnessLevel || "Regularly",
          pets: fp.lifestyle?.pets || fp.lifestyle?.petAttitude || "Loves animals",
          diet: fp.lifestyle?.diet || fp.lifestyle?.dietType || "Healthy",
          acceptSmoker: fp.lifestyle?.acceptSmoker,
          acceptDrinker: fp.lifestyle?.acceptDrinker,
        },
        relationship: {
          communication: fp.relationship?.communication || facts.communicationStyle,
          attachment: fp.relationship?.attachment || facts.attachmentStyle,
          loveLanguage: fp.relationship?.loveLanguage 
            || (factBlock.loveLanguage ? factBlock.loveLanguage.join(', ') : undefined),
        },
        background: {
          education: fp.background?.education || fp.education,
          culture: fp.background?.culture || fp.culturalBackground,
          languages: fp.background?.languages || factBlock.languages,
          nationality: fp.background?.nationality,
        },
        // Additional fields not previously mapped
        additionalNotes: fp.additionalNotes,
        openness: fp.openness,
      },
      photos: (reveal?.photos || suggestion.suggested?.photos || []).map(p => ({
        url: p.url,
        category: p.category || 'LIFESTYLE'
      }))
    };
  }, [suggestion, i18n.language, getLoc, t]);

  return { matchData, getLoc };
};
