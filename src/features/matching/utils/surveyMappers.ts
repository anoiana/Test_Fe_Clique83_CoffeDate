/**
 * Survey Mappers — Centralized translation-to-API mapping for Round 2 survey.
 */
import type { TFunction } from 'i18next';
import { Round2SurveyData } from '../../../shared/types/models';

/** Maps a single translated value to its API counterpart */
const createMapper = <T extends string | number>(
  t: TFunction,
  entries: [i18nKey: string, apiValue: T][],
  fallback: T
) => (val: any): T => {
  if (typeof val === 'number') return val as T;
  const strVal = String(val || '');
  for (const [key, apiVal] of entries) {
    if (t(key) === strVal) return apiVal;
  }
  return fallback;
};

/** Maps an array of translated values to API counterparts */
const createArrayMapper = (
  t: TFunction,
  entries: [i18nKey: string, apiValue: string][]
) => (vals: any[]): string[] => {
  const safeVals = Array.isArray(vals) ? vals : [];
  const map = Object.fromEntries(entries.map(([key, api]) => [t(key), api]));
  return safeVals.map(v => map[String(v)] || String(v));
};

export const createSurveyMappers = (t: TFunction) => ({
  decisionStyle: createMapper(t, [
    ['matching.round2.decision_style.options.logic', 'Logic & long-term planning'],
    ['matching.round2.decision_style.options.emotional', 'Emotional intuition'],
    ['matching.round2.decision_style.options.balance', 'A balance of both'],
  ], 'A balance of both'),

  moneyMindset: createMapper(t, [
    ['matching.round2.money_relation.options.plan_save', 'I plan and save carefully'],
    ['matching.round2.money_relation.options.spend_enjoy', 'I spend to enjoy life'],
    ['matching.round2.money_relation.options.invest_growth', 'I invest for long-term growth'],
    ['matching.round2.money_relation.options.balance', 'I try to balance all three'],
    ['matching.round2.money_relation.options.not_focus', "Money isn't a big focus for me"],
  ], 'I try to balance all three'),

  lifeStage: createMapper(t, [
    ['matching.round2.life_stage.options.exploring', 'Exploring / figuring things out'],
    ['matching.round2.life_stage.options.building_career', 'Building my career'],
    ['matching.round2.life_stage.options.established', 'Established & stable'],
    ['matching.round2.life_stage.options.starting_family', 'Starting or raising a family'],
    ['matching.round2.life_stage.options.in_transition', 'In transition'],
  ], 'Building my career'),

  childrenGoal: createMapper(t, [
    ['matching.round2.children_view.options.want_children', 'I want children'],
    ['matching.round2.children_view.options.no_children', "I don't want children"],
    ['matching.round2.children_view.options.already_have', 'I already have children'],
    ['matching.round2.children_view.options.open_undecided', "I'm open / undecided"],
    ['matching.round2.children_view.options.open', "I'm open / undecided"],
  ], "I'm open / undecided"),

  attachmentStyle: createMapper(t, [
    ['matching.round2.attachment_style.options.secure', 'Secure'],
    ['matching.round2.attachment_style.options.anxious', 'Anxious'],
    ['matching.round2.attachment_style.options.avoidant', 'Avoidant'],
    ['matching.round2.attachment_style.options.not_sure', 'Other'],
  ], 'Secure'),

  communicationStyle: createMapper(t, [
    ['matching.round2.conflict_style.options.direct', 'Address it directly'],
    ['matching.round2.conflict_style.options.time', 'Take time before speaking'],
    ['matching.round2.conflict_style.options.gentle_indirect', 'Communicate gently or indirectly'],
    ['matching.round2.conflict_style.options.avoid', 'Avoid conflict if possible'],
  ], 'Address it directly'),

  petAttitude: createMapper(t, [
    ['matching.round2.pet.options.love', 'I love pets'],
    ['matching.round2.pet.options.okay', "I'm okay with pets"],
    ['matching.round2.pet.options.no_pets', 'I prefer no pets'],
    ['matching.round2.pet.options.allergic', "I'm allergic / cannot live with pets"],
    ['matching.round2.pet_preference.options.love', 'I love pets'],
    ['matching.round2.pet_preference.options.okay', "I'm okay with pets"],
    ['matching.round2.pet_preference.options.no_pets', 'I prefer no pets'],
    ['matching.round2.pet_preference.options.allergic', "I'm allergic / cannot live with pets"],
  ], "I'm okay with pets"),

  smokingLevel: createMapper(t, [
    ['matching.round2.habits.smoking.options.never', 'Never'],
    ['matching.round2.habits.smoking.options.socially', 'Socially'],
    ['matching.round2.habits.smoking.options.occasionally', 'Occasionally'],
    ['matching.round2.habits.smoking.options.regularly', 'Regularly'],
  ], 'Never'),

  drinkingLevel: createMapper(t, [
    ['matching.round2.habits.drinking.options.never', 'Never'],
    ['matching.round2.habits.drinking.options.occasionally', 'Occasionally'],
    ['matching.round2.habits.drinking.options.socially', 'Socially'],
    ['matching.round2.habits.drinking.options.regularly', 'Regularly'],
  ], 'Never'),

  maritalStatus: createMapper(t, [
    ['matching.round2.marital_status.options.single', 'Single (never married)'],
    ['matching.round2.marital_status.options.divorced', 'Divorced'],
    ['matching.round2.marital_status.options.widowed', 'Widowed'],
    ['matching.round2.marital_status.options.separated', 'Separated'],
    ['matching.round2.marital_status.options.married_separated', 'Married but separated']
  ], 'Single (never married)'),

  religionBelief: createMapper(t, [
    ['matching.round2.religion.options.none', 'None'],
    ['matching.round2.religion.options.buddhism', 'Buddhism'],
    ['matching.round2.religion.options.christianity', 'Christianity'],
    ['matching.round2.religion.options.catholic', 'Catholic'],
    ['matching.round2.religion.options.islam', 'Islam'],
    ['matching.round2.religion.options.hinduism', 'Hinduism'],
    ['matching.round2.religion.options.spiritual', 'Spiritual but not religious'],
    ['matching.round2.common.other', 'Other']
  ], 'None'),

  culturalBackground: createMapper(t, [
    ['matching.round2.cultural_bg.options.vn_raised_vn', 'Vietnamese, raised in Vietnam'],
    ['matching.round2.cultural_bg.options.vn_raised_abroad', 'Vietnamese, raised abroad'],
    ['matching.round2.cultural_bg.options.vn_mixed', 'Vietnamese mixed background'],
    ['matching.round2.cultural_bg.options.asian_non_vn', 'Asian (non-Vietnamese)'],
    ['matching.round2.cultural_bg.options.western', 'Western'],
    ['matching.round2.cultural_bg.options.mixed_intl', 'Mixed international background'],
  ], 'Vietnamese, raised in Vietnam'),

  fitnessLevel: createMapper<number>(t, [
    ['matching.round2.physical_activity.options.very_low', 1],
    ['matching.round2.physical_activity.options.low', 2],
    ['matching.round2.physical_activity.options.moderate', 3],
    ['matching.round2.physical_activity.options.high', 4],
    ['matching.round2.physical_activity.options.very_active', 5],
  ], 3),

  dietType: createMapper(t, [
    ['matching.round2.diet.options.no_restriction', 'no_restriction'],
    ['matching.round2.diet.options.vegetarian', 'vegetarian'],
    ['matching.round2.diet.options.vegan', 'vegan'],
    ['matching.round2.diet.options.halal', 'halal'],
  ], 'no_restriction'),

  socialEnergy: createMapper<number>(t, [
    ['matching.round2.personality_social.options.strongly_introverted', 1],
    ['matching.round2.personality_social.options.slightly_introverted', 2],
    ['matching.round2.personality_social.options.balanced', 3],
    ['matching.round2.personality_social.options.slightly_extroverted', 4],
    ['matching.round2.personality_social.options.strongly_extroverted', 5],
  ], 3),

  nationality: createMapper(t, [
    ['matching.round2.nationality.options.vietnamese', 'Vietnamese'],
  ], 'Vietnamese'),

  lifePriorities: createArrayMapper(t, [
    ['matching.round2.core_values.options.family', 'family'],
    ['matching.round2.core_values.options.career', 'career'],
    ['matching.round2.core_values.options.financial', 'financial'],
    ['matching.round2.core_values.options.freedom', 'freedom'],
    ['matching.round2.core_values.options.adventure', 'adventure'],
    ['matching.round2.core_values.options.creativity', 'creativity'],
    ['matching.round2.core_values.options.spirituality', 'spirituality'],
    ['matching.round2.core_values.options.health', 'health'],
    ['matching.round2.core_values.options.growth', 'growth'],
    ['matching.round2.core_values.options.stability', 'stability'],
  ]),

  loveLanguages: createArrayMapper(t, [
    ['matching.round2.love_language.options.affirmation', 'affirmation'],
    ['matching.round2.love_language.options.quality_time', 'quality_time'],
    ['matching.round2.love_language.options.acts_of_service', 'acts_of_service'],
    ['matching.round2.love_language.options.physical_touch', 'physical_touch'],
    ['matching.round2.love_language.options.gifts', 'gifts'],
  ]),

  interests: createArrayMapper(t, [
    ['matching.round2.activities.options.traveling', 'traveling'],
    ['matching.round2.activities.options.fitness_gym', 'fitness'],
    ['matching.round2.activities.options.outdoor_sports', 'outdoor'],
    ['matching.round2.activities.options.yoga_wellness', 'yoga'],
    ['matching.round2.activities.options.reading', 'reading'],
    ['matching.round2.activities.options.movies_netflix', 'movies'],
    ['matching.round2.activities.options.music_concerts', 'music'],
    ['matching.round2.activities.options.cooking_food', 'cooking'],
    ['matching.round2.activities.options.cafe_hopping', 'cafe'],
    ['matching.round2.activities.options.art_exhibitions', 'art'],
    ['matching.round2.activities.options.gaming', 'gaming'],
    ['matching.round2.activities.options.business_networking', 'business'],
  ]),

  languages: createArrayMapper(t, [
    ['matching.round2.languages.options.vietnamese', 'vietnamese'],
    ['matching.round2.languages.options.english', 'english'],
    ['matching.round2.languages.options.french', 'french'],
    ['matching.round2.languages.options.german', 'german'],
    ['matching.round2.languages.options.russian', 'russian'],
    ['matching.round2.languages.options.korean', 'korean'],
    ['matching.round2.languages.options.japanese', 'japanese'],
    ['matching.round2.languages.options.mandarin', 'chinese'],
    ['matching.round2.languages.options.thai', 'thai'],
  ]),
});

export const buildRound2Payload = (data: any, t: TFunction) => {
  const m = createSurveyMappers(t);
  
  // Mapping current Round 2 fields
  const payload: any = {
    lifePriorities: m.lifePriorities(data.coreValues || []),
    lifeOrientation: parseInt(String(data.lifestylePreference)) || 3,
    decisionStyle: m.decisionStyle(data.decisionStyle),
    preferredAgeMin: parseInt(String(data.ageRange?.from)) || 21,
    preferredAgeMax: parseInt(String(data.ageRange?.to)) || 35,
    ageFlexible: !!data.ageRange?.flexible,
    socialEnergy: m.socialEnergy(data.introExtro),
    attachmentStyle: m.attachmentStyle(data.attachmentStyle),
    communicationStyle: m.communicationStyle(data.conflictStyle),
    loveLanguages: m.loveLanguages(data.loveLanguage || []),
    fitnessLevel: m.fitnessLevel(data.physicalActivity),
    height: parseInt(String(data.height)) || 165,
    interests: m.interests(data.activities || []),
    languages: m.languages(data.languages || []),
    bio: data.bio || '',
  };

  // Adding Round 3 fields with valid defaults to satisfy Backend validation
  // These will be overridden when Round 3 is actually filled.
  payload.moneyMindset = m.moneyMindset(data.moneyRelation);
  payload.lifeStage = m.lifeStage(data.lifeStage);
  payload.childrenGoal = m.childrenGoal(data.childrenView);
  payload.dietType = m.dietType(data.diet);
  payload.petAttitude = m.petAttitude(data.petPreference);
  payload.sharedInterestsImportance = parseInt(String(data.sharedInterests)) || 3;
  payload.religionBelief = m.religionBelief(data.religion);
  payload.religionImportance = parseInt(String(data.religionImportance)) || 1;
  payload.fortuneBelief = parseInt(String(data.spirituality)) || 3;
  payload.culturalBackground = m.culturalBackground(data.culturalBg);
  payload.nationality = data.nationality || 'Vietnamese';
  payload.maritalStatus = m.maritalStatus(data.maritalStatus);
  payload.acceptDivorced = data.acceptDivorced === t('matching.round2.accept_divorced.options.yes') ? 'Yes' : 'No';
  payload.smokingLevel = m.smokingLevel(data.smoking);
  payload.drinkingLevel = m.drinkingLevel(data.drinking);
  
  // Handle descriptiveWords specifically as an array of 3 strings
  if (data.descriptiveWords && typeof data.descriptiveWords === 'object') {
    const words = data.descriptiveWords;
    payload.descriptiveWords = [
      words.energy || 'Warm',
      words.depth || 'Kind',
      words.values || 'Honest'
    ].filter(Boolean);
  } else {
    payload.descriptiveWords = ['Warm', 'Kind', 'Honest'];
  }

  return payload;
};

export const buildRound3Payload = (data: any, t: TFunction) => {
  return buildRound2Payload(data, t); // Reuse the same combined logic
};
