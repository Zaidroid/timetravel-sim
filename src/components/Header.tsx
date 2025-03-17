import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { MoonIcon, SunIcon, Globe } from 'lucide-react';

const Header: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <motion.header
      className="fixed top-0 left-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm z-50 border-b border-gray-100 dark:border-gray-800"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-teal-500 dark:from-cyan-400 dark:to-teal-400 text-transparent bg-clip-text">
            {language === 'en' ? 'Palestine Time Travel' : 'السفر عبر الزمن في فلسطين'}
          </h1>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <motion.button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600/10 to-teal-500/10 dark:from-cyan-400/10 dark:to-teal-400/10 text-indigo-700 dark:text-cyan-300 font-medium hover:from-indigo-600/20 hover:to-teal-500/20 dark:hover:from-cyan-400/20 dark:hover:to-teal-400/20 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Globe className="w-4 h-4" />
            <span className="text-sm">
              {language === 'en' ? 'العربية' : 'English'}
            </span>
          </motion.button>
          
          <motion.button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gradient-to-r from-indigo-600/10 to-teal-500/10 dark:from-cyan-400/10 dark:to-teal-400/10 text-indigo-700 dark:text-cyan-300 hover:from-indigo-600/20 hover:to-teal-500/20 dark:hover:from-cyan-400/20 dark:hover:to-teal-400/20 transition-all duration-300"
            whileHover={{ 
              scale: 1.1,
              rotate: isDarkMode ? -15 : 15
            }}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? 
              <SunIcon className="w-5 h-5" /> : 
              <MoonIcon className="w-5 h-5" />
            }
          </motion.button>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;
