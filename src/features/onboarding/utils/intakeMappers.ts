import { IntakeSurveyData } from '../../../shared/types/models';

/**
 * Mappers to transform UI form keys (stable) into API-compatible enum values.
 */

export const mapGender = (gen: string): string => {
  const map: Record<string, string> = {
    'male': 'Male',
    'female': 'Female',
    'other': 'Other'
  };
  return map[gen] || gen || 'Other';
};

/**
 * Maps frontend education keys to exact backend enum values.
 * Backend requires: "Secondary school", "Bachelor's", "Master's", "PhD", "Other"
 */
export const mapEducation = (edu: string): string => {
  const map: Record<string, string> = {
    'secondary': 'Secondary school',
    'highschool': 'Secondary school',
    'associate': "Bachelor's",
    'bachelor': "Bachelor's",
    'master': "Master's",
    'phd': 'PhD',
    'other': 'Other'
  };
  return map[edu] || edu || 'Other';
};

export const mapIncome = (inc: string): string => {
  const map: Record<string, string> = {
    'below_10': '<10M VND',
    '10_20': '10-20M VND',
    '20_40': '20-40M VND',
    '40_80': '40-80M VND',
    '80_150': '80-150M VND',
    'above_150': '150M+ VND'
  };
  return map[inc] || inc || 'Other';
};

export const mapSource = (src: string | string[] | undefined): string => {
  if (!src) return 'Other';
  const sources = Array.isArray(src) ? src : [src];
  const map: Record<string, string> = {
    'tiktok': 'TikTok',
    'instagram': 'Instagram',
    'facebook': 'Facebook',
    'friends': 'Friends',
    'press': 'Press',
    'other': 'Other'
  };
  const firstSource = sources[0] || 'other';
  return map[firstSource] || 'Other';
};

export const mapPreferGender = (genders: string[] | undefined): string[] => {
  if (!genders) return [];
  const map: Record<string, string> = {
    'men': 'Male',
    'women': 'Female',
    'other': 'Other'
  };
  return genders.map(g => map[g] || 'Other');
};

/**
 * Maps frontend lookingFor IDs to API-expected intentGoal values.
 * API expects: Marriage, Serious relationship, Casual dating, Friends, Business partner
 */
export const mapIntentGoals = (goals: string[] | undefined): string[] => {
  if (!goals) return [];
  const map: Record<string, string> = {
    'marriage': 'Marriage',
    'serious': 'Serious relationship',
    'dating': 'Casual dating',
    'friends': 'Friends',
    'business': 'Business partner'
  };
  return goals.map(g => map[g] || 'Friends');
};

/**
 * Formats birthdate from DD/MM/YYYY to YYYY-MM-DD for API compatibility.
 */
export const formatBirthdate = (dateStr: string | undefined): string => {
  if (!dateStr) return '';
  const parts = dateStr.split('/');
  if (parts.length !== 3) return dateStr;
  const [day, month, year] = parts;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

/**
 * Main mapper to build the final evaluation payload.
 */
export const buildEvaluationPayload = (data: IntakeSurveyData, userId: string | undefined) => {
  return {
    userId,
    fullName: data.name,
    phoneNumber: data.phoneNumber,
    gender: mapGender(data.gender),
    preferGender: mapPreferGender(data.targetGenders),
    birthdate: formatBirthdate(data.birthdate),
    location: data.location,
    education: mapEducation(data.education),
    workField: data.workField,
    incomeRange: mapIncome(data.income),
    intentGoals: mapIntentGoals(data.lookingFor),
    source: mapSource(data.source)
  };
};
