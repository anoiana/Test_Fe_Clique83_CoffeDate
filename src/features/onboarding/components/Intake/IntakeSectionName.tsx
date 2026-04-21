import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { GroupedStepLayout, useStepValidation } from '../../../../shared/components/GroupedStepLayout';
import { SurveyFieldGroup } from '../../../../shared/components/SurveyFieldGroup';
import { Input } from '../../../../shared/components/Input';
import { User, MapPin, Phone } from 'lucide-react';
import { useAsyncAction } from '../../../../shared/hooks/useAsyncAction';
import { FormError } from '../../../../shared/components/FormError';

interface IntakeSectionNameProps {
  onNext: () => void;
  onBack: () => void;
}

export const IntakeSectionName: React.FC<IntakeSectionNameProps> = ({ onNext, onBack }) => {
  const { t } = useTranslation();
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const { showErrors } = useStepValidation();
  const [searchTerm, setSearchTerm] = useState(watch('location') || '');
  const [isFocused, setIsFocused] = useState(false);
  const [provinces, setProvinces] = useState<string[]>([]);
  const { execute } = useAsyncAction();

  const nameValue = watch('name');
  const locationValue = watch('location');
  const phoneValue = watch('phoneNumber');

  useEffect(() => {
    execute(
      async () => {
        const res = await fetch('https://provinces.open-api.vn/api/p/');
        if (!res.ok) throw new Error('Failed to fetch provinces');
        const data = await res.json();
        const names = data.map((p: any) =>
          p.name.replace('Tỉnh ', '').replace('Thành phố ', '')
        );
        setProvinces(names);
        return names;
      },
      { showToastOnSuccess: false }
    ).catch(() => setProvinces([]));
  }, [execute]);

  const removeAccents = (str: string) => {
    return str.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  };

  const filtered = searchTerm
    ? provinces.filter(p => {
      const normalizedProvince = removeAccents(p.toLowerCase());
      const normalizedSearch = removeAccents(searchTerm.toLowerCase());
      return normalizedProvince.includes(normalizedSearch);
    }).slice(0, 5)
    : ['Hồ Chí Minh', 'Hà Nội'];

  const selectCity = (city: string) => {
    setValue('location', city, { shouldValidate: true });
    setSearchTerm(city);
  };

  // Validation logic for error highlighting and auto-scroll
  const errorsList: string[] = [];
  
  const hasNameError = !nameValue || nameValue.length < 2;
  if (hasNameError) errorsList.push('group-name');
  
  const hasLocationError = !locationValue || searchTerm !== locationValue;
  if (hasLocationError) errorsList.push('group-location');

  const hasPhoneError = !phoneValue || phoneValue.length < 10 || phoneValue.length > 12 || !/^\d+$/.test(phoneValue);
  if (hasPhoneError) errorsList.push('group-phone');

  const isNextDisabled = errorsList.length > 0;

  return (
    <GroupedStepLayout
      currentStep={1}
      totalSteps={3}
      title={null}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={isNextDisabled}
      errorFields={errorsList}
    >
      <div className="space-y-10 pb-10">
        {/* Name Question */}
        <SurveyFieldGroup
          id="group-name"
          label={t('intake.what_is_your_name')}
          selectionNote={t('common.selection_note_type')}
          error={hasNameError}
        >
          <div className="w-full space-y-4 text-left">
            <Input
              {...register('name', {
                required: t('common.validation.required'),
                minLength: { value: 2, message: t('common.validation.min_length', { count: 2 }) }
              })}
              prefix={<User className="w-5 h-5 text-primary/40" />}
              placeholder={t('intake.name_placeholder')}
              className={`[&_input]:italic [&_input]:font-serif [&_input]:text-xl ${showErrors && hasNameError ? 'border-red-500 ring-1 ring-red-500/20' : ''}`}
              autoFocus
            />
            <FormError error={errors.name?.message as string} />
          </div>
        </SurveyFieldGroup>

        {/* Location Question */}
        <SurveyFieldGroup
          id="group-location"
          label={t('intake.where_do_you_live')}
          selectionNote={t('common.selection_note_type')}
          error={hasLocationError}
        >
          <div className="w-full space-y-4 text-left">
            <div className="relative">
              <input
                type="hidden"
                {...register('location', { required: t('common.validation.required') })}
              />
              <Input
                prefix={<MapPin className="w-5 h-5 text-primary/40" />}
                value={searchTerm}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (e.target.value === '') {
                    setValue('location', '', { shouldValidate: true });
                  }
                }}
                placeholder={t('intake.location_placeholder')}
                className={`[&_input]:italic [&_input]:font-serif [&_input]:text-xl ${showErrors && hasLocationError ? 'border-red-500 ring-1 ring-red-500/20' : ''}`}
              />
              {isFocused && filtered.length > 0 && (searchTerm !== locationValue || !searchTerm) && (
                <div className="absolute top-full left-0 w-full mt-2 bg-background-paper border border-divider rounded-3xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  {filtered.map((city, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => selectCity(city)}
                      className="w-full px-6 py-4 flex items-center gap-3 hover:bg-primary/5 transition-colors border-b border-divider/40 last:border-0 text-left"
                    >
                      <MapPin className="w-4 h-4 text-primary/40" />
                      <span className="text-ink text-sm font-medium">
                        {city}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <FormError error={errors.location?.message as string} />
          </div>
        </SurveyFieldGroup>

        {/* Phone Question */}
        <SurveyFieldGroup
          id="group-phone"
          label={t('intake.what_is_your_phone')}
          error={hasPhoneError}
        >
          <div className="w-full space-y-4 text-left">
            <Input
              {...register('phoneNumber', {
                required: t('common.validation.required'),
                minLength: { value: 10, message: t('common.validation.phone_min') },
                maxLength: { value: 12, message: t('common.validation.phone_max') },
                pattern: { value: /^\d+$/, message: t('common.validation.numbers_only') }
              })}
              prefix={<Phone className="w-5 h-5 text-primary/40" />}
              placeholder={t('intake.phone_placeholder')}
              className={`[&_input]:italic [&_input]:font-serif [&_input]:text-xl ${showErrors && hasPhoneError ? 'border-red-500 ring-1 ring-red-500/20' : ''}`}
            />
            <FormError error={errors.phoneNumber?.message as string} />
          </div>
        </SurveyFieldGroup>
      </div>
    </GroupedStepLayout>
  );
};
