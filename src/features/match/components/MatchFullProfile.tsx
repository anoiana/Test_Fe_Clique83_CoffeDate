import React from 'react';
import { motion } from 'framer-motion';
import { User, Heart, Coffee, MessagesSquare, School, Star, ListPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { MatchFullProfile as MatchFullProfileType } from '../../../shared/types/models';
import { LocalizedValue } from '../../../shared/types/index';

interface ProfileSectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

const ProfileSection = ({ icon, title, children }: ProfileSectionProps) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="flex flex-col gap-8 pb-16 border-b border-divider last:border-b-0"
  >
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center">
        {icon}
      </div>
      <h4 className="text-[12px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold text-primary/80">{title}</h4>
    </div>
    <div className="pl-6 sm:pl-14">
      {children}
    </div>
  </motion.div>
);

interface MatchFullProfileProps {
  fullProfile: MatchFullProfileType;
  interests: string[];
}

const MatchFullProfile = ({ fullProfile, interests }: MatchFullProfileProps) => {
  const { t } = useTranslation();
  if (!fullProfile) return null;

  // Safe defaults for nested objects
  const lifestyle = fullProfile.lifestyle || {};
  const relationship = fullProfile.relationship || {};
  const background = fullProfile.background || {};
  const about = fullProfile.about || {};

  const translateValue = (category: string, subCategory: string, val: string) => {
    if (!val) return t('common.not_specified');
    if (typeof val !== 'string') return String(val);
    const lowVal = val.toLowerCase().trim();
    
    // Attempt to map to matching.json round2 options if possible
    const mappings: Record<string, string> = {
      diet: 'matching.round2.diet.options',
      activity: 'matching.round2.physical_activity.options',
      attachment: 'matching.round2.attachment_style.options',
      education: 'intake.education.options',
      religion: 'matching.round2.religion.options',
      pets: 'matching.round2.pet.options'
    };

    const baseKey = mappings[subCategory] || mappings[category];
    if (!baseKey) return val;

    // Direct value-to-key mapping for backend human-readable strings
    const valueMap: Record<string, string> = {
      // Smoking/Drinking
      'non-smoker': 'never',
      'not at all': 'never',
      'never': 'never',
      'socially': 'socially',
      'occasionally': 'occasionally',
      'regularly': 'regularly',
      'very active': 'very_active',
      'moderate': 'moderate',
      'low': 'low',
      'very low': 'very_low',

      // Children
      'i want children': 'want_children',
      'i already have children': 'already_have',
      'i don\'t want children': 'no_children',
      'open / undecided': 'open_undecided',

      // Pets
      'i love pets': 'love',
      'i\'m okay with pets': 'okay',
      'i prefer not to have pets': 'no_pets',
      'i\'m allergic': 'allergic',

      // Attachment
      'secure': 'secure',
      'anxious': 'anxious',
      'avoidant': 'avoidant',
      'not sure': 'not_sure',

      // Education
      'secondary school': 'secondary',
      'high school': 'highschool',
      'associate degree': 'associate',
      "bachelor's degree": 'bachelor',
      "master's degree": 'master',
      'phd': 'phd'
    };

    let key = valueMap[lowVal];

    if (!key) {
      // Use common logic to find key (lowercase, replace spaces, etc.)
      key = lowVal
        .replace("'", "")
        .replace(' relationship', '')
        .replace(' / ', '_')
        .replace(' , ', '_')
        .replace(' ', '_')
        .replace('-', '_');
    }

    const translated = t(`${baseKey}.${key}`);
    
    return translated !== `${baseKey}.${key}` ? translated : val;
  };

  const localizeText = (val: LocalizedValue): string => {
    if (!val) return '';
    if (typeof val !== 'string') return String(val);
    const text = val.toLowerCase().trim();
    const dict: Record<string, string> = {
      'direct and open': 'Trực tiếp & Cởi mở',
      'open communication': 'Giao tiếp cởi mở',
      'direct communication': 'Giao tiếp trực tiếp',
      'honest communication': 'Giao tiếp chân thành',
      'quality time': 'Thời gian chất lượng',
      'physical touch': 'Cử chỉ thân mật',
      'words of affirmation': 'Lời nói yêu thương',
      'acts of service': 'Hành động chăm sóc',
      'receiving gifts': 'Quà tặng',
      'vietnamese': 'Việt Nam',
      'vietnam': 'Việt Nam',
      'english': 'Tiếng Anh',
      'french': 'Tiếng Pháp',
      'asian': 'Châu Á',
      'western': 'Phương Tây',
      'reading': 'Đọc sách',
      'coffee': 'Đi cà phê',
      'traveling': 'Du lịch',
      'music': 'Nghe nhạc',
      'movies': 'Xem phim',
      'workout': 'Tập luyện',
      'cooking': 'Nấu ăn'
    };
    return dict[text] || val;
  };

  return (
    <div className="py-32 px-4 md:px-8 max-w-5xl mx-auto flex flex-col gap-24">
      <div className="flex flex-col items-center gap-4 text-center mb-12">
        <span className="text-[12px] md:text-[14px] uppercase tracking-[0.3em] md:tracking-[0.4em] text-primary/80 font-bold drop-shadow-sm">{t('match_profile.details.deep_dive')}</span>
        <h3 className="text-2xl md:text-3xl font-light text-ink tracking-wide leading-tight uppercase drop-shadow-lg px-4 text-balance">{t('match_profile.details.title')}</h3>
      </div>

      <div className="flex flex-col gap-16">
        {/* 1. About */}
        {(about.bio || fullProfile.bio) && (
          <ProfileSection icon={<User className="w-5 h-5 text-primary/60" />} title={t('match_profile.sections.about')}>
            <div className="flex flex-col gap-6">
              <p className="text-xl text-ink/80 font-light leading-relaxed max-w-2xl">
                {about.bio || fullProfile.bio}
              </p>
            </div>
          </ProfileSection>
        )}

        {/* 2. Values */}
        {Array.isArray(fullProfile.values) && fullProfile.values.filter(Boolean).length > 0 && (
          <ProfileSection icon={<Heart className="w-5 h-5 text-primary/60" />} title={t('match_profile.sections.values')}>
            <div className="flex flex-wrap gap-4">
              {fullProfile.values.filter(Boolean).map((v: string, i: number) => (
                <div key={i} className="flex flex-col mb-4 md:mb-6 w-full">
                  <span className="text-[12px] md:text-[14px] uppercase tracking-widest text-primary/80 font-bold drop-shadow-sm mb-2">{t('match_profile.details.priority')} #{i + 1}</span>
                  <span className="text-xl md:text-2xl text-ink font-extralight italic drop-shadow-md">{localizeText(v)}</span>
                </div>
              ))}
            </div>
          </ProfileSection>
        )}

        {/* 3. Lifestyle */}
        {(lifestyle.activity || lifestyle.exercise || lifestyle.pets || lifestyle.diet) && (
          <ProfileSection icon={<Coffee className="w-5 h-5 text-primary/60" />} title={t('match_profile.sections.lifestyle')}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {(lifestyle.activity || lifestyle.exercise) && (
                <div>
                  <span className="text-[12px] md:text-[14px] uppercase tracking-widest text-primary/80 font-bold drop-shadow-sm block mb-2">{t('match_profile.details.activity_level')}</span>
                  <p className="text-ink/80 font-light text-lg">{translateValue('lifestyle', 'activity', lifestyle.activity || lifestyle.exercise)}</p>
                </div>
              )}
              {lifestyle.pets && (
                <div>
                  <span className="text-[12px] md:text-[14px] uppercase tracking-widest text-primary/80 font-bold drop-shadow-sm block mb-2">{t('match_profile.details.pets')}</span>
                  <p className="text-ink/80 font-light text-lg">{translateValue('lifestyle', 'pets', lifestyle.pets)}</p>
                </div>
              )}
              {lifestyle.diet && (
                <div>
                  <span className="text-[12px] md:text-[14px] uppercase tracking-widest text-primary/80 font-bold drop-shadow-sm block mb-2">{t('match_profile.details.diet')}</span>
                  <p className="text-ink/80 font-light text-lg">{translateValue('lifestyle', 'diet', lifestyle.diet)}</p>
                </div>
              )}
            </div>
          </ProfileSection>
        )}

        {/* 4. Relationship Style */}
        {(relationship.communication || relationship.attachment || relationship.loveLanguage) && (
          <ProfileSection icon={<MessagesSquare className="w-5 h-5 text-primary/60" />} title={t('match_profile.sections.relationship')}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relationship.communication && (
                <div>
                  <span className="text-[12px] md:text-[14px] uppercase tracking-widest text-primary/80 font-bold drop-shadow-sm block mb-2">{t('match_profile.details.communication')}</span>
                  <p className="text-ink/80 font-light text-lg">{localizeText(relationship.communication)}</p>
                </div>
              )}
              {relationship.attachment && (
                <div>
                  <span className="text-[12px] md:text-[14px] uppercase tracking-widest text-primary/80 font-bold drop-shadow-sm block mb-2">{t('match_profile.details.attachment')}</span>
                  <p className="text-ink/80 font-light text-lg">{translateValue('relationship', 'attachment', relationship.attachment)}</p>
                </div>
              )}
              {relationship.loveLanguage && (
                <div className="md:col-span-2">
                  <span className="text-[12px] md:text-[14px] uppercase tracking-widest text-primary/80 font-bold drop-shadow-sm block mb-2">{t('match_profile.details.love_languages')}</span>
                  <p className="text-ink/80 font-light text-lg">{localizeText(relationship.loveLanguage)}</p>
                </div>
              )}
            </div>
          </ProfileSection>
        )}

        {/* 5. Background */}
        {(background.education || fullProfile.education || background.culture || background.languages || background.nationality) && (
          <ProfileSection icon={<School className="w-5 h-5 text-primary/60" />} title={t('match_profile.sections.background')}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {(background.education || fullProfile.education) && (
                <div>
                  <span className="text-[12px] md:text-[14px] uppercase tracking-widest text-primary/80 font-bold drop-shadow-sm block mb-2">{t('match_profile.details.education')}</span>
                  <p className="text-ink/80 font-light text-lg">{translateValue('background', 'education', background.education || fullProfile.education)}</p>
                </div>
              )}
              {background.culture && (
                <div>
                  <span className="text-[12px] md:text-[14px] uppercase tracking-widest text-primary/80 font-bold drop-shadow-sm block mb-2">{t('match_profile.details.culture')}</span>
                  <p className="text-ink/80 font-light text-lg">{localizeText(background.culture)}</p>
                </div>
              )}
              {background.languages && (
                <div>
                  <span className="text-[12px] md:text-[14px] uppercase tracking-widest text-primary/80 font-bold drop-shadow-sm block mb-2">{t('match_profile.details.languages')}</span>
                  <p className="text-ink/80 font-light text-lg">
                    {Array.isArray(background.languages) ? background.languages.map(localizeText).join(', ') : localizeText(background.languages)}
                  </p>
                </div>
              )}
              {background.nationality && (
                <div>
                  <span className="text-[12px] md:text-[14px] uppercase tracking-widest text-primary/80 font-bold drop-shadow-sm block mb-2">{t('match_profile.details.nationality')}</span>
                  <p className="text-ink/80 font-light text-lg">{localizeText(background.nationality)}</p>
                </div>
              )}
            </div>
          </ProfileSection>
        )}

        {/* 6. Interests */}
        {Array.isArray(interests) && interests.filter(Boolean).length > 0 && (
          <ProfileSection icon={<Star className="w-5 h-5 text-primary/60" />} title={t('match_profile.sections.interests')}>
             <div className="flex flex-wrap items-center gap-3 md:gap-4">
              {interests.filter(Boolean).map((interest: string, i: number) => (
                <div 
                  key={i} 
                  className="px-5 py-2.5 rounded-full border border-divider bg-background-warm hover:bg-ink/5 transition-colors duration-300 shadow-sm"
                >
                  <span className="text-ink/80 text-sm md:text-base font-light tracking-wide">
                    {localizeText(interest)}
                  </span>
                </div>
              ))}
            </div>
          </ProfileSection>
        )}
      </div>
    </div>
  );
};

export default MatchFullProfile;
