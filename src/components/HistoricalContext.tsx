import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Info, ChevronLeft, ChevronRight, Pause, Play, Clock, MapPin } from 'lucide-react';

interface HistoricalContextProps {
  context: string;
  year: number;
  city: string;
}

const HistoricalContext: React.FC<HistoricalContextProps> = ({ context, year, city }) => {
  const { language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const formattedSlides = formatContent(context);
    setSlides(formattedSlides);
    setCurrentSlide(0);
  }, [context]);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    if (isPlaying && slides.length > 1) {
      intervalId = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => clearInterval(intervalId);
  }, [isPlaying, slides.length]);

  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
    setIsPlaying(false);
  };

  const handlePrevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
    setIsPlaying(false);
  };

  const togglePlayPause = () => setIsPlaying(!isPlaying);

  const formatContent = (text: string) => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line !== '');
    const listItems = lines.map(line => line.replace(/^[-*•]\s*/, ''));
    return listItems.length > 0 ? listItems : ['No historical context available.'];
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: 'easeOut',
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({ 
      x: direction > 0 ? 300 : -300, 
      opacity: 0,
      scale: 0.9
    }),
    center: { 
      x: 0, 
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: (direction: number) => ({ 
      x: direction > 0 ? -300 : 300, 
      opacity: 0,
      scale: 0.9,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    })
  };

  const [slideDirection, setSlideDirection] = useState(1);

  const nextSlide = () => {
    setSlideDirection(1);
    handleNextSlide();
  };

  const prevSlide = () => {
    setSlideDirection(-1);
    handlePrevSlide();
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 flex flex-col min-h-[400px] relative overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600/20 to-transparent" />
        <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-to-tl from-teal-500/20 to-transparent" />
      </div>

      {/* Header */}
      <motion.div 
        variants={itemVariants} 
        className="flex flex-col items-center text-center mb-4"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Info className="w-6 h-6 text-indigo-600 dark:text-cyan-400" />
          <h3 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-teal-500 dark:from-cyan-400 dark:to-teal-400 text-transparent bg-clip-text">
            {language === 'en' ? 'Historical Context' : 'السياق التاريخي'}
          </h3>
        </div>
        <div className="flex items-center justify-center gap-4 mt-1">
          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{year}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4" />
            <span>{city}</span>
          </div>
        </div>
      </motion.div>

      {/* Slide content */}
      <motion.div 
        variants={itemVariants} 
        className="flex-1 flex flex-col relative -mt-2"
      >
        <div className="absolute inset-0 flex flex-col">
          {/* Content area */}
          <div className="flex-1 w-full flex items-center justify-center px-4 pb-8">
            <AnimatePresence custom={slideDirection} mode="wait">
              <motion.div
                key={currentSlide}
                custom={slideDirection}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full max-w-md"
              >
                <div className="bg-gradient-to-r from-indigo-600/10 to-teal-500/10 dark:from-cyan-400/10 dark:to-teal-400/10 
                  rounded-xl p-6 backdrop-blur-sm border border-white/20 dark:border-gray-800/50 shadow-lg
                  transform hover:scale-[1.01] transition-transform duration-300"
                >
                  <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                    {slides[currentSlide]}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls area */}
          <div className="w-full">
            {/* Progress indicators */}
            {slides.length > 1 && (
              <div className="flex justify-center gap-2 mb-3">
                {slides.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => {
                      setSlideDirection(index > currentSlide ? 1 : -1);
                      setCurrentSlide(index);
                      setIsPlaying(false);
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'bg-gradient-to-r from-indigo-600 to-teal-500 dark:from-cyan-400 dark:to-teal-400 w-6' 
                        : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
            )}

            {/* Navigation controls */}
            {slides.length > 1 && (
              <motion.div 
                variants={itemVariants}
                className="flex justify-between items-center px-4 pb-1"
              >
                <motion.button
                  whileHover={{ scale: 1.1, x: -2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prevSlide}
                  className="p-2 rounded-full bg-gradient-to-r from-indigo-600/10 to-teal-500/10 dark:from-cyan-400/10 dark:to-teal-400/10 
                    text-indigo-700 dark:text-cyan-300 
                    hover:from-indigo-600/20 hover:to-teal-500/20 
                    dark:hover:from-cyan-400/20 dark:hover:to-teal-400/20 
                    transition-all duration-300 shadow-sm hover:shadow"
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>

                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={togglePlayPause}
                    className="p-2 rounded-full bg-gradient-to-r from-indigo-600/10 to-teal-500/10 dark:from-cyan-400/10 dark:to-teal-400/10 
                      text-indigo-700 dark:text-cyan-300 
                      hover:from-indigo-600/20 hover:to-teal-500/20 
                      dark:hover:from-cyan-400/20 dark:hover:to-teal-400/20 
                      transition-all duration-300 shadow-sm hover:shadow"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </motion.button>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[40px] text-center">
                    {currentSlide + 1}/{slides.length}
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1, x: 2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextSlide}
                  className="p-2 rounded-full bg-gradient-to-r from-indigo-600/10 to-teal-500/10 dark:from-cyan-400/10 dark:to-teal-400/10 
                    text-indigo-700 dark:text-cyan-300 
                    hover:from-indigo-600/20 hover:to-teal-500/20 
                    dark:hover:from-cyan-400/20 dark:hover:to-teal-400/20 
                    transition-all duration-300 shadow-sm hover:shadow"
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HistoricalContext;
