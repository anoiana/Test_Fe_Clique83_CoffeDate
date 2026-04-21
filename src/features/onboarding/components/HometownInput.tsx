import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StepLayout } from './StepLayout';

export const HometownInput = ({ value, onChange, onNext, onBack, currentLocation }) => {
  const { t } = useTranslation();
  const [provinces, setProvinces] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const staticProvinces = [
    "Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Bình Dương", "Đồng Nai", "Khánh Hòa", "Hải Phòng", "Long An", "Quảng Ninh", "Cần Thơ", "Ba Ria - Vung Tau",
    "An Giang", "Bac Giang", "Bac Kan", "Bac Lieu", "Bac Ninh", "Ben Tre", "Binh Dinh", "Binh Phuoc", "Binh Thuan", "Ca Mau", "Cao Bang", "Dak Lak", "Dak Nong", "Dien Bien", "Dong Thap", "Gia Lai", "Ha Giang", "Ha Nam", "Ha Tinh", "Hai Duong", "Hau Giang", "Hoa Binh", "Hung Yen", "Kon Tum", "Lai Chau", "Lam Dong", "Lang Son", "Lao Cai", "Nam Dinh", "Nghe An", "Ninh Binh", "Ninh Thuan", "Phu Tho", "Phu Yen", "Quang Binh", "Quang Nam", "Quang Ngai", "Quang Tri", "Soc Trang", "Son La", "Tay Ninh", "Thai Binh", "Thai Nguyen", "Thanh Hoa", "Thua Thien Hue", "Tien Giang", "Tra Vinh", "Tuyen Quang", "Vinh Long", "Vinh Phuc", "Yen Bai"
  ];

  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/p/')
      .then(res => res.json())
      .then(data => {
        setProvinces(data.map(p => p.name.replace('Tỉnh ', '').replace('Thành phố ', '')));
      })
      .catch(() => setProvinces(staticProvinces));
  }, []);

  const handleSelect = (province) => {
    onChange(province);
    setTimeout(() => onNext(), 300);
  };

  const filtered = provinces.filter(p => p.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <StepLayout
      subtitle={t('onboarding.subtitles.roots')}
      title={t('onboarding.hometown.title')}
      description={t('onboarding.hometown.description')}
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!value}
      showNext={false}
      scrollable={false}
    >
      <div className="flex flex-col gap-4 h-full">
        {currentLocation && !searchTerm && (
          <button
            onClick={() => handleSelect(currentLocation)}
            className={`w-full py-3 px-5 rounded-xl flex items-center justify-between transition-all border shrink-0 ${
              value === currentLocation 
                ? 'border-primary bg-primary/20 text-primary font-bold' 
                : 'border-primary/30 bg-primary/5 text-slate-300'
            }`}
          >
            <span className="text-sm">{t('onboarding.hometown.same_as_current', { location: currentLocation })}</span>
            <span className="material-symbols-outlined text-xs">home</span>
          </button>
        )}

        <div className="relative shrink-0">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-ink/40">search</span>
          <input
            type="text"
            autoFocus
            placeholder={t('onboarding.hometown.search_placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 bg-background-warm border border-divider rounded-xl pl-12 pr-4 text-sm text-ink focus:border-primary/50 focus:outline-none transition-all"
          />
        </div>

        <div className="space-y-2 overflow-y-auto pr-2 custom-scrollbar flex-1">
          {filtered.map((province) => (
            <button
              key={province}
              onClick={() => handleSelect(province)}
              className={`w-full py-3 px-5 rounded-lg text-left transition-all border text-sm ${
                value === province 
                  ? 'bg-primary/20 border-primary text-primary font-bold' 
                  : 'bg-background-warm/60 border-divider text-ink/40 hover:bg-ink/5 hover:text-ink'
              }`}
            >
              {province}
            </button>
          ))}
        </div>
      </div>
    </StepLayout>
  );
};
