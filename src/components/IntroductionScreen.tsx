import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Clock, Map, Book, ArrowRight, ChevronRight, ScrollText, Sparkles, Globe, MoonIcon, SunIcon } from 'lucide-react';
import AnimatedBackground from './AnimatedBackground';

interface IntroductionScreenProps {
  onComplete: () => void;
}

const IntroductionScreen: React.FC<IntroductionScreenProps> = ({ onComplete }) => {
  const { language, setLanguage } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [backgroundKey, setBackgroundKey] = useState(0);

  // Force background re-render when theme changes
  useEffect(() => {
    setBackgroundKey(prev => prev + 1);
  }, [isDarkMode]);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setDirection(language === 'ar' ? -1 : 1);
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setDirection(language === 'ar' ? 1 : -1);
      setCurrentStep(prev => prev - 1);
    }
  };

  const steps = [
    {
      icon: <Sparkles className="w-10 h-10 text-indigo-600 dark:text-cyan-400" />,
      title: language === 'en' ? 'Welcome to Palestine Time Travel' : 'مرحبًا بك في السفر عبر الزمن في فلسطين',
      description: language === 'en' 
        ? 'Experience the rich history and culture of Palestine through an immersive time travel experience. Explore different cities and eras to discover personal stories and historical events.'
        : 'اختبر تاريخ وثقافة فلسطين الغنية من خلال تجربة سفر عبر الزمن غامرة. استكشف مدنًا وعصورًا مختلفة لاكتشاف القصص الشخصية والأحداث التاريخية.',
      image: 'https://images.unsplash.com/photo-1575293924982-20b9240aa155?q=80&w=2906&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      icon: <Clock className="w-10 h-10 text-indigo-600 dark:text-cyan-400" />,
      title: language === 'en' ? 'Choose Your Time Period' : 'اختر الفترة الزمنية',
      description: language === 'en'
        ? 'Select any year between 1900 and present day. Each time period offers unique insights into Palestinian life, culture, and history.'
        : 'اختر أي سنة بين عام 1900 والوقت الحاضر. توفر كل فترة زمنية رؤى فريدة حول الحياة والثقافة والتاريخ الفلسطيني.',
      image: 'https://images.unsplash.com/photo-1529079875474-0a66a1f176d0?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      icon: <Map className="w-10 h-10 text-indigo-600 dark:text-cyan-400" />,
      title: language === 'en' ? 'Explore Palestinian Cities' : 'استكشف المدن الفلسطينية',
      description: language === 'en'
        ? 'Visit iconic Palestinian cities like Jerusalem, Gaza, Ramallah, and more. Each location has its own unique story and historical significance.'
        : 'قم بزيارة المدن الفلسطينية الشهيرة مثل القدس وغزة ورام الله والمزيد. لكل موقع قصته الفريدة وأهميته التاريخية.',
      image: 'https://images.unsplash.com/photo-1594016510631-ff55e6de8e40?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      icon: <Book className="w-10 h-10 text-indigo-600 dark:text-cyan-400" />,
      title: language === 'en' ? 'Discover Personal Narratives' : 'اكتشف الروايات الشخصية',
      description: language === 'en'
        ? 'Experience life through the eyes of Palestinians from different eras. Learn about their daily lives, challenges, hopes, and cultural experiences.'
        : 'عش الحياة من خلال عيون الفلسطينيين من عصور مختلفة. تعرف على حياتهم اليومية وتحدياتهم وآمالهم وتجاربهم الثقافية.',
      image: 'https://images.unsplash.com/photo-1542317752-4ce89974f44c?q=80&w=2944&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      icon: <ScrollText className="w-10 h-10 text-indigo-600 dark:text-cyan-400" />,
      title: language === 'en' ? 'Historical Context' : 'السياق التاريخي',
      description: language === 'en'
        ? 'Gain a deeper understanding of historical events that shaped Palestine. Explore factual information alongside personal stories for a comprehensive experience.'
        : 'احصل على فهم أعمق للأحداث التاريخية التي شكلت فلسطين. استكشف المعلومات الواقعية جنبًا إلى جنب مع القصص الشخصية للحصول على تجربة شاملة.',
      image: 'https://images.unsplash.com/photo-1594016510019-9e71d3498293?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    }
  ];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    })
  };

  return (
    <motion.div 
      className="min-h-screen flex flex-col justify-center items-center relative p-4 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Animated Background */}
      <AnimatedBackground isDarkMode={isDarkMode} />

      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-2/3 bg-gradient-to-b from-indigo-600/5 to-transparent dark:from-cyan-400/5"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-teal-500/5 to-transparent dark:from-teal-400/5"></div>
      </div>

      {/* Header Bar with Toggles */}
      <div className={`absolute top-0 ${language === 'ar' ? 'left-0' : 'right-0'} p-4 flex items-center gap-4`}>
        <motion.button
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-medium shadow-lg hover:shadow-xl transition-all duration-300"
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
          className="p-2 rounded-full bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 shadow-lg hover:shadow-xl transition-all duration-300"
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
      </div>

      {/* Progress Indicator */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 flex gap-2">
        {steps.map((_, index) => (
          <div 
            key={index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentStep 
                ? 'w-8 bg-gradient-to-r from-indigo-600 to-teal-500 dark:from-cyan-400 dark:to-teal-400' 
                : index < currentStep 
                  ? 'w-4 bg-indigo-600/50 dark:bg-cyan-400/50' 
                  : 'w-4 bg-gray-300 dark:bg-gray-700'
            }`}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="w-full max-w-4xl mx-auto">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex flex-col md:flex-row gap-8 items-center"
          >
            {/* Image Section - Order depends on language */}
            <motion.div 
              className={`w-full md:w-1/2 aspect-[4/3] overflow-hidden rounded-2xl border-2 border-transparent hover:border-indigo-500 dark:hover:border-cyan-400 transition-colors duration-300 ${language === 'ar' ? 'md:order-2' : ''} hidden md:block`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <motion.img
                src={steps[currentStep].image}
                alt={steps[currentStep].title}
                className="w-full h-full object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.2 }}
                transition={{ duration: 0.7 }}
              />
            </motion.div>

            {/* Text Section - Order depends on language */}
            <motion.div 
              className={`w-full md:w-1/2 flex flex-col p-6 bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-cyan-400 shadow-lg transition-colors duration-300 ${language === 'ar' ? 'md:order-1' : ''}`}
            >
              <div className="mb-4 flex justify-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {steps[currentStep].icon}
                </motion.div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 bg-gradient-to-r from-indigo-600 via-teal-500 to-indigo-600 dark:from-cyan-400 dark:via-teal-400 dark:to-cyan-400 text-transparent bg-clip-text">
                {steps[currentStep].title}
              </h2>
              <p className="text-base md:text-lg text-gray-900 dark:text-gray-200 mb-8 text-center leading-relaxed">
                {steps[currentStep].description}
              </p>

              <div className="flex justify-between mt-auto">
                <motion.button
                  onClick={previousStep}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300
                    ${currentStep === 0 
                      ? 'opacity-0 pointer-events-none' 
                      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-200 hover:shadow-lg'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {language === 'ar' ? <ChevronRight className="w-5 h-5" /> : <ChevronRight className="w-5 h-5 rotate-180" />}
                  <span>{language === 'ar' ? 'السابق' : 'Previous'}</span>
                </motion.button>

                <motion.button
                  onClick={nextStep}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-all duration-300
                    bg-gradient-to-r from-indigo-600 to-teal-500 dark:from-cyan-400 dark:to-teal-400 
                    hover:from-teal-500 hover:to-indigo-600 dark:hover:from-teal-400 dark:hover:to-cyan-400 
                    shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>
                    {currentStep < steps.length - 1 
                      ? (language === 'ar' ? 'التالي' : 'Next')
                      : (language === 'ar' ? 'ابدأ الرحلة' : 'Start Journey')}
                  </span>
                  {language === 'ar' ? <ArrowRight className="w-5 h-5 rotate-180" /> : <ArrowRight className="w-5 h-5" />}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Skip Button */}
      <div className="fixed inset-x-0 bottom-8 flex justify-center z-50">
        <motion.button
          onClick={onComplete}
          className="px-6 py-3 rounded-full bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {language === 'ar' ? 'تخطي المقدمة' : 'Skip Introduction'}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default IntroductionScreen; 
