import React, { useState, useEffect } from 'react';
import { GroupedStepLayout } from '../../../../shared/components/GroupedStepLayout';
import { useAsyncAction } from '../../../../shared/hooks/useAsyncAction';
import { OptionButton } from '../../../../shared/components/OptionButton';
import { useTranslation } from 'react-i18next';
import { useFormContext, Controller } from 'react-hook-form';
import { Search, MapPin } from 'lucide-react';

export const IntakeLocationInput = ({ onNext, onBack }) => {
  const { t } = useTranslation();
  const { control } = useFormContext();
  const { execute } = useAsyncAction();
  const [provinces, setProvinces] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    execute(
        async () => {
            const res = await fetch('https://provinces.open-api.vn/api/p/');
            if (!res.ok) throw new Error('Failed to fetch provinces');
            const data = await res.json();
            const names = data.map((p: any) => 
              p.name.replace('Tỉnh ', '').replace('Thành phố ', '')
            );
            
            const priorityCities = ['Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng'];
            const sortedNames = names.sort((a: string, b: string) => {
              const aIndex = priorityCities.indexOf(a);
              const bIndex = priorityCities.indexOf(b);
              
              if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
              if (aIndex !== -1) return -1;
              if (bIndex !== -1) return 1;
              
              return a.localeCompare(b, 'vi');
            });

            setProvinces(sortedNames);
            return sortedNames;
        },
        { 
            loadingMessage: t('common.loading'),
            showToastOnSuccess: false
        }
    ).catch(() => setProvinces([]));
  }, [execute, t]);

  const removeAccents = (str: string) => {
    return str.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  };

  const filtered = provinces.filter(p => {
    const normalizedProvince = removeAccents(p.toLowerCase());
    const normalizedSearch = removeAccents(searchTerm.toLowerCase());
    return normalizedProvince.includes(normalizedSearch);
  });

  return (
    <Controller
      name="location"
      control={control}
      render={({ field: { value, onChange } }) => {
        const handleSelect = (city: string) => {
          onChange(city);
        };

        const isOther = value && !provinces.includes(value);

        return (
          <GroupedStepLayout
            currentStep={4}
            totalSteps={4}
            title={t('intake.location.title')}
            description={t('intake.location.description')}
            onNext={onNext}
            onBack={onBack}
            nextDisabled={!value || value.trim().length === 0}
          >


            <div className="flex flex-col gap-6">
              <div className="relative shrink-0">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/40">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder={t('intake.location.search_placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-14 bg-background-warm/40 border border-divider/50 rounded-3xl pl-12 pr-4 text-ink focus:border-primary/40 focus:outline-none transition-all placeholder:text-ink/20"
                />
              </div>

              <div className="space-y-3">
                  {filtered.slice(0, 10).map((province) => (
                      <OptionButton
                          key={province}
                          label={province}
                          selected={value === province}
                          onClick={() => handleSelect(province)}
                          className="!w-full"
                      />
                  ))}
                
                <div className="pt-4">
                  <h4 className="typo-ritual-label-small text-ink/30 mb-4 ml-2">{t('intake.location.other_city_label')}</h4>
                  <input
                    type="text"
                    placeholder={t('intake.location.other_city_placeholder')}
                    value={isOther ? value : ''}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full h-14 px-6 rounded-3xl bg-background-warm/60 border transition-all text-ink focus:outline-none ${
                      isOther ? 'border-primary' : 'border-divider/50 focus:border-primary/40'
                    }`}
                  />
                </div>
              </div>
            </div>
          </GroupedStepLayout>
        );
      }}
    />
  );
};

