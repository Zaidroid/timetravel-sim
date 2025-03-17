import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import TimelineForm from './components/TimelineForm';
import OutputSection from './components/OutputSection';
import HistoricalContext from './components/HistoricalContext';
import AnalyticsWidget from './components/AnalyticsWidget';
import NewsArticles from './components/NewsArticles';
import AnimatedBackground from './components/AnimatedBackground';
import IntroductionScreen from './components/IntroductionScreen';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { TimelineFormData } from './types';
import { generateNarrative } from './services/api';
import { ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const [narrative, setNarrative] = useState('');
  const [historicalContext, setHistoricalContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [formData, setFormData] = useState<TimelineFormData | null>(null);
  const [isFormExpanded, setIsFormExpanded] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showIntroduction, setShowIntroduction] = useState(true);
  const { isDarkMode } = useTheme();

  // Check if user has seen the introduction before
  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('hasSeenIntro');
    if (hasSeenIntro === 'true') {
      setShowIntroduction(false);
    }
  }, []);

  const completeIntroduction = () => {
    localStorage.setItem('hasSeenIntro', 'true');
    setShowIntroduction(false);
  };

  const handleSubmit = async (data: TimelineFormData) => {
    setLoading(true);
    setError(null);
    setFormData(data);
    setIsFormExpanded(false);
    setHasSubmitted(true);

    const language = localStorage.getItem('language') || 'en';

    const narrativePrompts = {
      en: `Write a 300-word fictional story about ${data.name}, a ${data.age}-year-old ${data.sex} living in ${data.city}, Palestine in ${data.year}. The story must focus on their personal daily life, challenges, and cultural experiences as an individual. Do NOT generate a bulleted list, historical facts, or any introductory remarks like "Here's the story" or "Okay"; start directly with the narrative text and provide only the story.`,
      ar: `اكتب قصة قصيرة خيالية (حوالي 300 كلمة) عن ${data.name}، ${data.age} عامًا، ${data.sex === 'male' ? 'رجل' : 'امرأة'} يعيش في ${data.city}، فلسطين في عام ${data.year}. ركز على حياتهم اليومية الشخصية، التحديات، والتجارب الثقافية كفرد. لا تتضمن حقائق تاريخية أو قوائم أو أي مقدمة/خاتمة؛ ابدأ مباشرة بالقصة.`
    };

    const contextPrompts = {
      en: `Provide a concise historical context about Palestine in ${data.year}, specifically around ${data.city}. Return only a bulleted list of 5-7 key historical facts, each starting with a dash (-). Do not include any narrative, story, or additional text beyond the list.`,
      ar: `قدم سياقًا تاريخيًا موجزًا عن فلسطين في عام ${data.year}، وتحديدًا حول ${data.city}. أعد فقط قائمة منقطة من 5-7 حقائق تاريخية رئيسية باللغة العربية، كل منها يبدأ بشرطة (-). لا تتضمن أي نصوص إضافية أو عناوين أو شروحات خارج القائمة، وتأكد من أن الرد باللغة العربية فقط.`
    };

    try {
      const [narrativeResponse, contextResponse] = await Promise.all([
        generateNarrative(narrativePrompts[language as keyof typeof narrativePrompts], { language, type: 'story' }),
        generateNarrative(contextPrompts[language as keyof typeof contextPrompts], { language, type: 'list' })
      ]);

      setNarrative(narrativeResponse.trim());
      setHistoricalContext(contextResponse.trim());
    } catch (apiError: any) {
      setError(apiError.message || 'Failed to generate content. Please try again.');
      console.error('API Error:', apiError);
    } finally {
      setLoading(false);
    }
  };

  const handleRandomize = () => {
    const randomYear = Math.floor(Math.random() * (2023 - 1948 + 1)) + 1948;
    const cities = ['Jerusalem', 'Gaza', 'Ramallah', 'Bethlehem', 'Hebron', 'Nablus', 'Jenin', 'Tulkarem', 'Qalqilya', 'Jericho'];
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const randomSex = Math.random() < 0.5 ? 'male' : 'female';
    const randomAge = Math.floor(Math.random() * (80 - 18 + 1)) + 18;

    const randomData: TimelineFormData = {
      name: 'Amin' + (randomSex === 'male' ? '' : 'a'),
      age: randomAge,
      sex: randomSex,
      city: randomCity,
      year: randomYear,
    };

    setFormData(randomData);
    setIsFormExpanded(true);
  };

  const toggleFormExpansion = () => setIsFormExpanded(prev => !prev);

  return (
    <AnimatePresence mode="wait">
      {showIntroduction ? (
        <IntroductionScreen onComplete={completeIntroduction} key="introduction" />
      ) : (
        <motion.div 
          key="main-content"
          className="min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500 relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <AnimatedBackground isDarkMode={isDarkMode} />
          
          <Header />
          
          <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center relative z-10">
            {/* Form Section */}
            <motion.div
              className="w-full flex-shrink-0 relative z-10 flex flex-col items-center max-w-4xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <AnimatePresence mode="wait">
                {isFormExpanded ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { 
                        duration: 0.5,
                        ease: 'easeOut'
                      }
                    }}
                    exit={{ 
                      opacity: 0, 
                      y: -20,
                      transition: { duration: 0.3, ease: 'easeIn' }
                    }}
                    className="w-full flex justify-center"
                  >
                    <TimelineForm
                      onSubmit={handleSubmit}
                      onRandomize={handleRandomize}
                      initialData={formData}
                      isCollapsed={!isFormExpanded}
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>
              
              <ToggleFormButton
                isFormExpanded={isFormExpanded}
                toggleFormExpansion={toggleFormExpansion}
                formData={hasSubmitted ? formData : null}
              />
            </motion.div>

            {/* Output Section */}
            <motion.div 
              className="flex-1 w-full" 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
            >
              <AnimatePresence mode="wait">
                {hasSubmitted && formData && (
                  <motion.div
                    key="output"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                  >
                    <OutputSection narrative={narrative} name={formData?.name} loading={loading} />
                    <HistoricalContext context={historicalContext} year={formData.year} city={formData.city} />
                    <AnalyticsWidget year={formData.year} city={formData.city} />
                    <NewsArticles formData={formData} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </main>
          
          {/* Error Toast */}
          <AnimatePresence>
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white/90 dark:bg-gray-900/90 border border-red-200 dark:border-red-800 px-6 py-4 rounded-2xl shadow-lg backdrop-blur-sm flex items-center gap-4 max-w-md"
              >
                <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
                <p className="text-gray-900 dark:text-gray-100 font-medium">{error}</p>
                <motion.button
                  onClick={() => setError(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Dismiss
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const ToggleFormButton: React.FC<{ 
  isFormExpanded: boolean; 
  toggleFormExpansion: () => void;
  formData?: TimelineFormData | null;
}> = ({ 
  isFormExpanded, 
  toggleFormExpansion,
  formData 
}) => {
  const { language } = useLanguage();
  
  // Get city name in current language
  const getCityName = (cityEn: string) => {
    if (language === 'ar') {
      const palestinianCities = ['Jerusalem', 'Gaza', 'Ramallah', 'Bethlehem', 'Hebron', 'Nablus', 'Jenin', 'Tulkarem', 'Qalqilya', 'Jericho'];
      const palestinianCitiesArabic = ['القدس', 'غزة', 'رام الله', 'بيت لحم', 'الخليل', 'نابلس', 'جنين', 'طولكرم', 'قلقيلية', 'أريحا'];
      const index = palestinianCities.indexOf(cityEn);
      return index >= 0 ? palestinianCitiesArabic[index] : cityEn;
    }
    return cityEn;
  };
  
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
      <motion.button
        onClick={toggleFormExpansion}
        className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-teal-500 dark:from-cyan-400 dark:to-teal-400 px-6 py-3 rounded-full text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        whileHover={{ 
          scale: 1.05,
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.95 }}
      >
        {isFormExpanded ? (
          <>
            <span>{language === 'en' ? 'Collapse Form' : 'طي النموذج'}</span>
            <ChevronUp className="w-4 h-4" />
          </>
        ) : (
          <>
            <span>{language === 'en' ? 'Expand Form' : 'توسيع النموذج'}</span>
            <ChevronDown className="w-4 h-4" />
          </>
        )}
      </motion.button>
      
      {formData && !isFormExpanded && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 shadow-md"
        >
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {formData.name}, {formData.age} {language === 'en' ? 'y/o' : 'سنة'}, {getCityName(formData.city)}, {formData.year}
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default App;
