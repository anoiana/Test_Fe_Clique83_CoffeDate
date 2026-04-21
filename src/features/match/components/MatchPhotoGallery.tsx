import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface Photo {
  url: string;
  category?: string;
}

interface MatchPhotoGalleryProps {
  photos: Photo[];
}

export const MatchPhotoGallery = ({ photos }: MatchPhotoGalleryProps) => {
  const { t } = useTranslation();
  if (!photos || photos.length === 0) return null;

  return (
    <div className="w-full py-10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-12 flex flex-col items-center text-center gap-4">
        <span className="text-[12px] md:text-[14px] uppercase tracking-[0.3em] md:tracking-[0.4em] text-primary/80 font-bold drop-shadow-sm">{t('match_profile.visual_story.label')}</span>
        <h3 className="text-2xl md:text-3xl font-light text-ink tracking-wide leading-tight uppercase drop-shadow-lg px-4 text-balance">{t('match_profile.visual_story.title')}</h3>
      </div>

      <div className="relative">
        {/* Horizontal Scroll Area */}
        <div className={`flex gap-4 overflow-x-auto pb-8 px-6 no-scrollbar snap-x snap-mandatory ${photos.length === 1 ? 'justify-center' : ''}`}>
          {photos.map((photo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`flex-shrink-0 w-[80vw] md:w-[400px] aspect-[3/4] rounded-[2rem] overflow-hidden relative group snap-center shadow-2xl ${photos.length === 1 ? 'md:w-[500px]' : ''}`}
            >
              <img 
                src={photo.url} 
                alt="" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {photo.category && (
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-ink/60 bg-ink/40 backdrop-blur-md px-4 py-2 rounded-full border border-divider">
                    {photo.category}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Decorative elements - Only show if there's more than 1 photo */}
        {photos.length > 1 && (
          <>
            <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-background-dark to-transparent pointer-events-none z-10 opacity-30" />
            <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-background-dark to-transparent pointer-events-none z-10 opacity-30" />
          </>
        )}
      </div>
    </div>
  );
};
