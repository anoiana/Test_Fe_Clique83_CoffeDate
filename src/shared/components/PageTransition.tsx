import { motion } from 'framer-motion';

export const PageTransition = ({ children, className = "", ...props }: { children: React.ReactNode, className?: string }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: "circOut" }}
      className={`h-full w-full ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
