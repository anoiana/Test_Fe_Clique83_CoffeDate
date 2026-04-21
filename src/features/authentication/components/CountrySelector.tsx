import React, { useState } from 'react';
import { countries } from '../data/countries';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

/**
 * Premium Country Selector Modal.
 * Upgraded with sleek UI, flags, and custom scrolling for a professional feel.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Modal visibility
 * @param {Function} props.onClose - Close callback
 * @param {Function} props.onSelect - Country selection callback
 * @param {Object} [props.selectedCountry] - Currently selected country for highlight
 */
export const CountrySelector = ({ isOpen, onClose, onSelect, selectedCountry }) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const filteredCountries = countries.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.code.includes(search)
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[100]"
          />
          
          {/* Modal */}
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 h-[75vh] bg-[#0d0d0d] border-t border-divider rounded-t-[2.5rem] z-[101] overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Handle Bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-12 h-1.5 bg-ink/5 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-8 py-6 flex items-center justify-between">
              <h3 className="text-ink text-xl font-semibold tracking-tight">{t('auth.country_selector.select_country')}</h3>
              <button 
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-background-warm hover:bg-ink/5 transition-all active:scale-90"
              >
                <span className="material-symbols-outlined text-ink text-xl">close</span>
              </button>
            </div>

            {/* Search */}
            <div className="px-8 mb-6">
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-ink/40 group-focus-within:text-primary transition-colors">search</span>
                <input 
                  type="text" 
                  placeholder={t('auth.country_selector.search_placeholder')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-14 bg-background-warm border border-divider rounded-2xl pl-12 pr-4 text-ink placeholder:text-ink/30 focus:outline-none focus:border-primary/40 focus:bg-ink/5 transition-all font-light"
                />
              </div>
            </div>

            {/* List */}
            <div 
              className="flex-1 overflow-y-auto px-4 pb-12 scrollbar-premium"
              style={{
                scrollbarWidth: 'none', /* Firefox */
                msOverflowStyle: 'none' /* IE/Edge */
              }}
            >
              {/* Inline style to hide scrollbar for Chrome/Safari/Opera */}
              <style dangerouslySetInnerHTML={{__html: `
                .scrollbar-premium::-webkit-scrollbar {
                  display: none;
                }
              `}} />

              <div className="space-y-1 px-4">
                {filteredCountries.map((country, index) => {
                  const isSelected = selectedCountry?.name === country.name;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        onSelect(country);
                        onClose();
                      }}
                      className={`w-full flex items-center gap-4 py-4 px-5 rounded-2xl transition-all duration-200 group ${
                        isSelected ? 'bg-ink/5' : 'hover:bg-background-warm'
                      }`}
                    >
                      <span className="text-2xl drop-shadow-sm">{country.flag}</span>
                      
                      <div className="flex flex-col items-start gap-0.5 flex-1">
                        <span className={`font-medium transition-colors ${
                          isSelected ? 'text-primary' : 'text-ink'
                        }`}>
                          {country.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-ink/40 font-mono text-sm tracking-tighter">
                          {country.code}
                        </span>
                        
                        <div className="w-6 flex justify-center">
                          {isSelected && (
                            <span className="material-symbols-outlined text-primary text-xl animate-in zoom-in duration-300">
                              check
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {filteredCountries.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-ink/40 animate-in fade-in duration-500">
                  <span className="material-symbols-outlined text-5xl mb-4 opacity-20">public_off</span>
                  <p className="font-light tracking-wide">{t('auth.country_selector.no_countries_found')}</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
