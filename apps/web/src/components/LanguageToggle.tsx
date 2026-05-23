import { motion } from 'framer-motion';
import { useLocale } from '../providers/LocaleProvider';

export function LanguageToggle() {
  const { language, toggleLanguage } = useLocale();

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={toggleLanguage}
      className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold shadow-sm"
      aria-label="Toggle language"
    >
      {language === 'en' ? 'EN / አማ' : 'አማ / EN'}
    </motion.button>
  );
}