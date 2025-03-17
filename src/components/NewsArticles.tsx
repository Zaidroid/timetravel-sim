import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Newspaper, ChevronLeft, ChevronRight, ExternalLink, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface NewsArticlesProps {
  formData: { year: number; city: string };
}

interface NewsArticle {
  id: number;
  title: string;
  content: string;
  source: string;
  date: string;
  url?: string;
}

const NewsArticles: React.FC<NewsArticlesProps> = ({ formData }) => {
  const { language } = useLanguage();
  const { isDarkMode } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [newsData, setNewsData] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [direction, setDirection] = useState(0);
  const { year, city } = formData;

  const API_KEY = '432d820d097a4344bf53ee5cad437902';

  const placeholderNews: NewsArticle[] = [
    {
      id: 1,
      title: `Historical Events in ${city}`,
      content: `A comprehensive look at the significant events that shaped ${city} during ${year}, examining their lasting impact on the region.`,
      source: 'Historical Archives',
      date: `${year}-03-15`,
    },
    {
      id: 2,
      title: `${city}'s Transformation`,
      content: `An in-depth analysis of how ${city} evolved throughout ${year}, focusing on social and cultural developments.`,
      source: 'Cultural Review',
      date: `${year}-06-20`,
    },
    {
      id: 3,
      title: `Life in ${city}: ${year}`,
      content: `A detailed exploration of daily life in ${city} during ${year}, featuring personal accounts and historical records.`,
      source: 'Social Chronicles',
      date: `${year}-09-10`,
    },
  ];

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);

      const currentYear = new Date().getFullYear();
      if (year < currentYear - 1) {
        setNewsData(translateNews(placeholderNews));
        setLoading(false);
        return;
      }

      try {
        const fromDate = `${year}-01-01`;
        const toDate = `${year}-12-31`;
        const query = `${city} Palestine`;
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&from=${fromDate}&to=${toDate}&sortBy=publishedAt&apiKey=${API_KEY}&language=${language === 'ar' ? 'ar' : 'en'}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.status !== 'ok') throw new Error(data.message || 'Failed to fetch news');

        const articles = data.articles.slice(0, 3).map((article: any, index: number) => ({
          id: index + 1,
          title: article.title || 'Untitled',
          content: article.description || article.content || 'No content available',
          source: article.source.name || 'Unknown Source',
          date: article.publishedAt ? article.publishedAt.split('T')[0] : `${year}-01-01`,
          url: article.url,
        }));

        setNewsData(articles.length > 0 ? articles : translateNews(placeholderNews));
      } catch (err) {
        console.error('Error fetching news:', err);
        setError(language === 'en' ? 'Failed to load news articles.' : 'فشل في تحميل المقالات الإخبارية.');
        setNewsData(translateNews(placeholderNews));
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [year, city, language]);

  const translateNews = (articles: NewsArticle[]) => {
    if (language === 'ar') {
      return articles.map(article => ({
        ...article,
        title: article.title
          .replace('Historical Events in', 'أحداث تاريخية في')
          .replace('Transformation', 'تحول')
          .replace('Life in', 'الحياة في'),
        content: article.content
          .replace('A comprehensive look at the significant events that shaped', 'نظرة شاملة على الأحداث المهمة التي شكلت')
          .replace('during', 'خلال')
          .replace('examining their lasting impact on the region', 'ودراسة تأثيرها الدائم على المنطقة')
          .replace('An in-depth analysis of how', 'تحليل معمق لكيفية تطور')
          .replace('evolved throughout', 'على مدار')
          .replace('focusing on social and cultural developments', 'مع التركيز على التطورات الاجتماعية والثقافية')
          .replace('A detailed exploration of daily life in', 'استكشاف مفصل للحياة اليومية في')
          .replace('featuring personal accounts and historical records', 'يتضمن روايات شخصية وسجلات تاريخية'),
        source: article.source
          .replace('Historical Archives', 'الأرشيف التاريخي')
          .replace('Cultural Review', 'المراجعة الثقافية')
          .replace('Social Chronicles', 'الوقائع الاجتماعية'),
      }));
    }
    return articles;
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex(prev => (prev === newsData.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex(prev => (prev === 0 ? newsData.length - 1 : prev - 1));
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.3, ease: 'easeInOut' },
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.3, ease: 'easeInOut' },
      },
    }),
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800"
    >
      <div className="flex items-center gap-3 mb-6">
        <Newspaper className="w-6 h-6 text-indigo-600 dark:text-cyan-400" />
        <div>
          <h3 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-teal-500 dark:from-cyan-400 dark:to-teal-400 text-transparent bg-clip-text">
            {language === 'en' ? 'News Articles' : 'مقالات إخبارية'}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {language === 'en' ? `${city}, ${year}` : `${city}، ${year}`}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 text-indigo-600 dark:text-cyan-400 animate-spin" />
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center min-h-[300px]">
          <p className="text-red-500 dark:text-red-400 text-center">{error}</p>
        </div>
      ) : (
        <>
          <div className="relative min-h-[300px] mb-6">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0"
              >
                <div className="bg-gradient-to-r from-indigo-50/50 to-teal-50/50 dark:from-cyan-950/30 dark:to-teal-950/30 rounded-xl p-6">
                  <h3 className="text-xl font-serif font-semibold bg-gradient-to-r from-indigo-600 to-teal-500 dark:from-cyan-400 dark:to-teal-400 text-transparent bg-clip-text mb-2">
                    {newsData[currentIndex]?.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <span>{newsData[currentIndex]?.date}</span>
                    <span>•</span>
                    <span>{newsData[currentIndex]?.source}</span>
                    {newsData[currentIndex]?.url && (
                      <>
                        <span>•</span>
                        <a
                          href={newsData[currentIndex].url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-indigo-600 dark:text-cyan-400 hover:underline"
                        >
                          {language === 'en' ? 'Read More' : 'اقرأ المزيد'}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </>
                    )}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {newsData[currentIndex]?.content}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={prevSlide}
              className="p-2 rounded-full bg-gradient-to-r from-indigo-600/10 to-teal-500/10 dark:from-cyan-400/10 dark:to-teal-400/10 
                text-indigo-700 dark:text-cyan-300 
                hover:from-indigo-600/20 hover:to-teal-500/20 
                dark:hover:from-cyan-400/20 dark:hover:to-teal-400/20 
                transition-all duration-300"
              aria-label={language === 'en' ? 'Previous Article' : 'المقال السابق'}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>

            <span className="text-sm text-gray-600 dark:text-gray-400">
              {currentIndex + 1}/{newsData.length}
            </span>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextSlide}
              className="p-2 rounded-full bg-gradient-to-r from-indigo-600/10 to-teal-500/10 dark:from-cyan-400/10 dark:to-teal-400/10 
                text-indigo-700 dark:text-cyan-300 
                hover:from-indigo-600/20 hover:to-teal-500/20 
                dark:hover:from-cyan-400/20 dark:hover:to-teal-400/20 
                transition-all duration-300"
              aria-label={language === 'en' ? 'Next Article' : 'المقال التالي'}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default NewsArticles;
