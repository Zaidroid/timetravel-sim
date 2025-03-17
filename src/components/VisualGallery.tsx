import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Image, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';

interface VisualGalleryProps {
    formData: {
        year: number;
        city: string;
    }
}

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  credit: string;
}

const VisualGallery: React.FC<VisualGalleryProps> = ({ formData }) => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [expanded, setExpanded] = useState(false);

    const { year, city } = formData;

  // Generate gallery items based on year and city
  useEffect(() => {
    // This would normally come from an API
    const period = year < 1950 ? 'historical' : year < 1980 ? 'mid-century' : 'modern';
    const items: GalleryItem[] = [
      {
        id: 1,
        title: language === 'en' ? `${city} Cityscape` : `منظر مدينة ${city}`,
        description: language === 'en' 
          ? `A view of ${city} during the ${period} period, showing the architectural style and urban layout of the time.`
          : `منظر لمدينة ${city} خلال فترة ${period}، يظهر الطراز المعماري والتخطيط الحضري في ذلك الوقت.`,
        imageUrl: `https://source.unsplash.com/random/800x600?${city},palestine,architecture`,
        credit: "Unsplash"
      },
      {
        id: 2,
        title: language === 'en' ? 'Daily Life' : 'الحياة اليومية',
        description: language === 'en'
          ? `People going about their daily activities in ${city} during the ${year}s.`
          : `الناس يمارسون أنشطتهم اليومية في ${city} خلال ${year}.`,
        imageUrl: `https://source.unsplash.com/random/800x600?palestine,people,market`,
        credit: "Unsplash"
      },
      {
        id: 3,
        title: language === 'en' ? 'Cultural Heritage' : 'التراث الثقافي',
        description: language === 'en'
          ? `Traditional crafts and cultural artifacts from ${city} that showcase Palestinian heritage.`
          : `الحرف التقليدية والقطع الأثرية الثقافية من ${city} التي تعرض التراث الفلسطيني.`,
        imageUrl: `https://source.unsplash.com/random/800x600?palestine,craft,heritage`,
        credit: "Unsplash"
      },
      {
        id: 4,
        title: language === 'en' ? 'Landscape' : 'المناظر الطبيعية',
        description: language === 'en'
          ? `The natural landscape surrounding ${city}, showing the geographical features of Palestine.`
          : `المناظر الطبيعية المحيطة بـ ${city}، تظهر المعالم الجغرافية لفلسطين.`,
        imageUrl: `https://source.unsplash.com/random/800x600?palestine,landscape`,
        credit: "Unsplash"
      }
    ];
    
    // Simulate loading data
    setTimeout(() => {
      setGalleryItems(items);
      setLoading(false);
    }, 1500);
  }, [year, city, language]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === galleryItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? galleryItems.length - 1 : prevIndex - 1
    );
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1] 
      }
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 }
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 }
      }
    })
  };

  const contentVariants = {
    collapsed: { 
      height: '300px', 
      overflow: 'hidden' 
    },
    expanded: { 
      height: 'auto',
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const [direction, setDirection] = useState(0);

  if (loading) {
    return (
      <motion.div
        variants={cardVariants}
        className="widget-container w-full h-full mx-auto p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-xl border border-gray-100 dark:border-gray-700"
      >
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      className="widget-container w-full h-full mx-auto p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-xl border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Image className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {language === 'en' ? 'Visual Gallery' : 'معرض الصور'}
          </h2>
        </div>
        
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              <span className="text-sm">{language === 'en' ? 'Show less' : 'عرض أقل'}</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              <span className="text-sm">{language === 'en' ? 'Show more' : 'عرض المزيد'}</span>
            </>
          )}
        </button>
      </div>

      <motion.div
        variants={contentVariants}
        initial={!expanded ? "collapsed" : "expanded"}
        animate={!expanded ? "collapsed" : "expanded"}
        className="relative"
      >
        <div className="relative overflow-hidden rounded-lg aspect-[4/3]">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0"
            >
              <div className="relative h-full">
                <img 
                  src={galleryItems[currentIndex]?.imageUrl} 
                  alt={galleryItems[currentIndex]?.title}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                  <h3 className="text-lg font-semibold">{galleryItems[currentIndex]?.title}</h3>
                  <p className="text-sm text-gray-200">{galleryItems[currentIndex]?.description}</p>
                  <p className="text-xs text-gray-300 mt-1">
                    {language === 'en' ? 'Credit: ' : 'المصدر: '}
                    {galleryItems[currentIndex]?.credit}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button 
            onClick={() => {
              setDirection(-1);
              prevSlide();
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => {
              setDirection(1);
              nextSlide();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex justify-center mt-4 space-x-2">
          {galleryItems.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex 
                  ? 'bg-blue-500' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        {!expanded && (
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-gray-800 to-transparent"></div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default VisualGallery;
