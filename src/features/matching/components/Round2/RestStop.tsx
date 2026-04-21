import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Coffee, Heart, Target, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '../../../../shared/components/Button';

interface RestStopProps {
  sectionCompleted: number; // 1 or 2
  onNext: () => void;
}

export const RestStop: React.FC<RestStopProps> = ({ sectionCompleted, onNext }) => {
  const { t } = useTranslation();

  const content = {
    1: {
      title: t('matching.round2.rest_stop.done_p1_title', 'Khởi đầu tốt đẹp!'),
      desc: t('matching.round2.rest_stop.done_p1_desc', 'Những thói quen của bạn sẽ giúp chúng tôi tìm thấy người có cùng tần số.'),
      nextTitle: t('matching.round2.rest_stop.next_p2_title', 'Quan điểm & Cách yêu'),
      nextDesc: t('matching.round2.rest_stop.next_p2_desc', 'Chia sẻ về quan điểm sống và cách bạn dành tình cảm trong một mối quan hệ.'),
      icon: <Coffee className="w-8 h-8 text-primary" />,
      progress: 35
    },
    2: {
      title: t('matching.round2.rest_stop.done_p2_title', 'Sâu sắc & Gắn kết'),
      desc: t('matching.round2.rest_stop.done_p2_desc', 'Những chia sẻ chân thành là chìa khóa cho một mối quan hệ bền vững.'),
      nextTitle: t('matching.round2.rest_stop.next_p3_title', 'Tiêu chuẩn hẹn hò'),
      nextDesc: t('matching.round2.rest_stop.next_p3_desc', 'Phác họa chân dung "người ấy" và đặt ra kỳ vọng cho buổi hẹn lý tưởng.'),
      icon: <Heart className="w-8 h-8 text-primary" />,
      progress: 70
    }
  }[sectionCompleted];

  if (!content) return null;

  return (
    <div className="flex flex-col items-center justify-start min-h-full py-10 px-4 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-8 border border-primary/20 relative"
      >
        <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-20" />
        <CheckCircle2 className="w-10 h-10 text-primary" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-3xl font-black text-ink mb-4 uppercase italic tracking-tight leading-tight">
          {content.title}
        </h2>
        <p className="text-ink/60 mb-12 max-w-[280px] mx-auto text-sm leading-relaxed">
          {content.desc}
        </p>
      </motion.div>

      {/* Next Section Preview Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full bg-background-warm border border-divider rounded-[2.5rem] p-6 mb-12 text-left relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Sparkles className="w-20 h-20 text-ink" />
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
            {content.icon}
          </div>
          <div>
            <p className="text-primary font-black text-[10px] tracking-[0.2em] uppercase">{t('matching.round2.rest_stop.up_next', 'UP NEXT')}</p>
            <h3 className="text-xl font-black text-ink uppercase tracking-tight italic">{content.nextTitle}</h3>
          </div>
        </div>
        <p className="text-ink/40 text-xs font-medium leading-relaxed">
          {content.nextDesc}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="w-full"
      >
        <Button
          onClick={onNext}
          variant="golden"
          icon="arrow_forward"
        >
          {t('common.continue', 'Tiếp tục')}
        </Button>
      </motion.div>
    </div>
  );
};
