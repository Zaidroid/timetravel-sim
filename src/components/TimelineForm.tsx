import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, ArrowRight, ArrowLeft, Calendar, User, MapPin, Clock, Sparkles, Loader2, Shuffle } from 'lucide-react';
import { TimelineFormData } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface TimelineFormProps {
  onSubmit: (data: TimelineFormData) => void;
  onRandomize: () => void;
  initialData?: TimelineFormData | null;
  isCollapsed?: boolean;
}

const TimelineForm: React.FC<TimelineFormProps> = ({
  onSubmit,
  onRandomize,
  initialData,
  isCollapsed = false,
}) => {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState<TimelineFormData>({
    name: initialData?.name || '',
    age: initialData?.age || 25,
    sex: initialData?.sex || 'male',
    city: initialData?.city || '',
    year: initialData?.year || new Date().getFullYear(),
  });
  const [errors, setErrors] = useState<Partial<Record<keyof TimelineFormData, string>>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [yearInputType, setYearInputType] = useState<'slider' | 'input'>('slider');
  const [ageInputType, setAgeInputType] = useState<'slider' | 'input'>('slider');
  const [isRandomizing, setIsRandomizing] = useState(false);
  const randomizeTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setCurrentStep(0);
    }
  }, [initialData]);

  useEffect(() => {
    return () => {
      if (randomizeTimeoutRef.current) {
        clearTimeout(randomizeTimeoutRef.current);
      }
    };
  }, []);

  const palestinianCities = ['Jerusalem', 'Gaza', 'Ramallah', 'Bethlehem', 'Hebron', 'Nablus', 'Jenin', 'Tulkarem', 'Qalqilya', 'Jericho'];
  const palestinianCitiesArabic = ['القدس', 'غزة', 'رام الله', 'بيت لحم', 'الخليل', 'نابلس', 'جنين', 'طولكرم', 'قلقيلية', 'أريحا'];

  const maleNamesEn = ['Ahmad', 'Mohammed', 'Omar', 'Ali', 'Khaled', 'Mahmoud', 'Ibrahim', 'Yousef', 'Sami', 'Karim'];
  const femaleNamesEn = ['Fatima', 'Aisha', 'Layla', 'Noor', 'Huda', 'Amira', 'Rania', 'Zainab', 'Mariam', 'Sara'];
  const maleNamesAr = ['أحمد', 'محمد', 'عمر', 'علي', 'خالد', 'محمود', 'إبراهيم', 'يوسف', 'سامي', 'كريم'];
  const femaleNamesAr = ['فاطمة', 'عائشة', 'ليلى', 'نور', 'هدى', 'أميرة', 'رانيا', 'زينب', 'مريم', 'سارة'];

  const generateRandomName = () => {
    const nameList = language === 'en' 
      ? (formData.sex === 'male' ? maleNamesEn : femaleNamesEn) 
      : (formData.sex === 'male' ? maleNamesAr : femaleNamesAr);
    
    const randomName = nameList[Math.floor(Math.random() * nameList.length)];
    
    setFormData(prev => ({
      ...prev,
      name: randomName
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof TimelineFormData, string>> = {};
    
    switch (step) {
      case 0: // Year
        if (!formData.year || formData.year < 1900 || formData.year > new Date().getFullYear()) {
          newErrors.year = t('errors.yearInvalid');
        }
        break;
      case 1: // City
        if (!formData.city.trim()) newErrors.city = t('errors.cityRequired');
        break;
      case 2: // Traveler Info
    if (!formData.name.trim()) newErrors.name = t('errors.nameRequired');
    else if (formData.name.trim().length < 2) newErrors.name = t('errors.nameTooShort');
        if (!formData.age || formData.age < 5 || formData.age > 90) newErrors.age = t('errors.ageInvalid');
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setDirection(language === 'ar' ? -1 : 1);
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrev = () => {
    setDirection(language === 'ar' ? 1 : -1);
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'year' ? Number(value) : value,
    }));
    if (errors[name as keyof TimelineFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleRandomize = () => {
    setIsRandomizing(true);
    
    // Generate random data
    const randomYear = Math.floor(Math.random() * (2023 - 1948 + 1)) + 1948;
    const randomCity = palestinianCities[Math.floor(Math.random() * palestinianCities.length)];
    const randomSex = Math.random() < 0.5 ? 'male' : 'female';
    const randomAge = Math.floor(Math.random() * (90 - 5 + 1)) + 5;
    
    // Select a random name based on sex and language
    let randomName = '';
    if (language === 'en') {
      randomName = randomSex === 'male' 
        ? maleNamesEn[Math.floor(Math.random() * maleNamesEn.length)]
        : femaleNamesEn[Math.floor(Math.random() * femaleNamesEn.length)];
    } else {
      randomName = randomSex === 'male'
        ? maleNamesAr[Math.floor(Math.random() * maleNamesAr.length)]
        : femaleNamesAr[Math.floor(Math.random() * femaleNamesAr.length)];
    }
    
    const randomData: TimelineFormData = {
      name: randomName,
      age: randomAge,
      sex: randomSex,
      city: randomCity,
      year: randomYear,
    };
    
    // Set the data immediately for the loading screen
    setFormData(randomData);
    
    // Show loading for a short time, then submit the form
    randomizeTimeoutRef.current = setTimeout(() => {
      onSubmit(randomData);
      // Keep isRandomizing true to maintain the loading screen until narrative is ready
    }, 1500);
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
      x: direction > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 400, damping: 35 },
        opacity: { duration: 0.3, ease: 'easeInOut' },
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 80 : -80,
      opacity: 0,
      transition: {
        x: { type: 'spring', stiffness: 400, damping: 35 },
        opacity: { duration: 0.3, ease: 'easeInOut' },
      },
    }),
  };

  const inputClasses = `w-full p-4 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 
    focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-cyan-400/50 
    focus:border-indigo-500 dark:focus:border-cyan-400 
    transition-all duration-300 
    text-gray-900 dark:text-gray-100
    placeholder-gray-500 dark:placeholder-gray-400
    text-lg`;

  const buttonClasses = `p-3 rounded-xl text-center transition-all duration-300 font-medium
    bg-white dark:bg-gray-800 shadow-sm
    hover:bg-gray-50 dark:hover:bg-gray-700
    disabled:opacity-50 disabled:cursor-not-allowed
    border border-gray-200 dark:border-gray-700
    text-gray-900 dark:text-gray-100`;

  const labelClasses = "block text-base font-medium text-gray-700 dark:text-gray-300 mb-2";

  const steps = [
    {
      icon: Clock,
      title: language === 'en' ? "Choose your destination year" : "اختر سنة الوجهة",
      content: (
        <div className="flex flex-col h-full">
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-md">
              <div className="relative px-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">1900</span>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{new Date().getFullYear()}</span>
                </div>
                <div className="relative">
                  {yearInputType === 'slider' ? (
                    <div className="pr-12">
                      <input
                        type="range"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        min={1900}
                        max={new Date().getFullYear()}
                        className="w-full h-2 bg-gradient-to-r from-indigo-600/20 to-teal-500/20 dark:from-cyan-400/20 dark:to-teal-400/20 
                          rounded-lg appearance-none cursor-pointer
                          [&::-webkit-slider-thumb]:appearance-none
                          [&::-webkit-slider-thumb]:w-6
                          [&::-webkit-slider-thumb]:h-6
                          [&::-webkit-slider-thumb]:rounded-full
                          [&::-webkit-slider-thumb]:bg-gradient-to-r
                          [&::-webkit-slider-thumb]:from-indigo-600
                          [&::-webkit-slider-thumb]:to-teal-500
                          [&::-webkit-slider-thumb]:dark:from-cyan-400
                          [&::-webkit-slider-thumb]:dark:to-teal-400
                          [&::-webkit-slider-thumb]:shadow-lg"
                      />
                    </div>
                  ) : (
                    <div className="pr-12">
                      <input
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        min={1900}
                        max={new Date().getFullYear()}
                        className={`${inputClasses} ${errors.year ? 'border-red-500 dark:border-red-500' : ''}`}
                      />
                    </div>
                  )}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2">
                    <motion.button
                      type="button"
                      onClick={() => setYearInputType(prev => prev === 'slider' ? 'input' : 'slider')}
                      className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700
                        text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Clock className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
                <div className="text-center mt-6">
                  <span className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-teal-500 dark:from-cyan-400 dark:to-teal-400 text-transparent bg-clip-text">
                    {formData.year}
                  </span>
                </div>
                {errors.year && (
                  <p className="text-sm text-red-500 text-center mt-2">{errors.year}</p>
                )}
              </div>
              <div className="text-center mt-8">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'en' 
                    ? "This sets the historical period for your journey"
                    : "هذا يحدد الفترة التاريخية لرحلتك"}
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: MapPin,
      title: language === 'en' ? "Select your destination in Palestine" : "اختر وجهتك في فلسطين",
      content: (
        <div className="flex flex-col h-full">
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3 p-1">
            {language === 'en'
              ? palestinianCities.map(city => (
                  <motion.button
                    key={city}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, city: city }))}
                    className={`p-4 rounded-xl text-center transition-all duration-300
                      ${formData.city === city
                        ? 'bg-gradient-to-r from-indigo-600 to-teal-500 dark:from-cyan-400 dark:to-teal-400 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-cyan-900/20'}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="font-medium">{city}</span>
                  </motion.button>
                ))
              : palestinianCitiesArabic.map((city, index) => (
                  <motion.button
                    key={palestinianCities[index]}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, city: palestinianCities[index] }))}
                    className={`p-4 rounded-xl text-center transition-all duration-300
                      ${formData.city === palestinianCities[index]
                        ? 'bg-gradient-to-r from-indigo-600 to-teal-500 dark:from-cyan-400 dark:to-teal-400 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-cyan-900/20'}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="font-medium">{city}</span>
                  </motion.button>
                ))}
          </div>
        </div>
      ),
    },
    {
      icon: User,
      title: language === 'en' ? "Create your time traveler profile" : "أنشئ ملف المسافر عبر الزمن",
      content: (
        <div className="flex flex-col h-full">
          <div className="flex-1 flex flex-col gap-6">
            {/* Name Input */}
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`${inputClasses} ${language === 'ar' ? 'pl-12' : 'pr-12'} ${errors.name ? 'border-red-500 dark:border-red-500' : ''}`}
                placeholder={language === 'en' ? "Enter your name" : "أدخل اسمك"}
              />
              <div className={`absolute inset-y-0 ${language === 'ar' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2`}>
                <motion.button
                  type="button"
                  onClick={generateRandomName}
                  className="p-2 rounded-full bg-gradient-to-r from-indigo-600/10 to-teal-500/10 dark:from-cyan-400/10 dark:to-teal-400/10
                    text-indigo-700 dark:text-cyan-300 hover:from-indigo-600/20 hover:to-teal-500/20 dark:hover:from-cyan-400/20 dark:hover:to-teal-400/20"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9, rotate: 360, transition: { duration: 0.5 } }}
                  aria-label={language === 'en' ? "Generate random name" : "توليد اسم عشوائي"}
                >
                  <Shuffle className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}

            {/* Gender Selection */}
            <div className="flex gap-4">
              <motion.button
                type="button"
                onClick={() => {
                  handleChange({ target: { name: 'sex', value: 'male' } } as any);
                  // Update name if gender changes
                  if (formData.sex !== 'male' && formData.name) {
                    const nameList = language === 'en' ? maleNamesEn : maleNamesAr;
                    setFormData(prev => ({
                      ...prev, 
                      name: nameList[Math.floor(Math.random() * nameList.length)]
                    }));
                  }
                }}
                className={`flex-1 p-4 rounded-xl text-center transition-all duration-300
                  ${formData.sex === 'male'
                    ? 'bg-gradient-to-r from-indigo-600 to-teal-500 dark:from-cyan-400 dark:to-teal-400 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-cyan-900/20'}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col items-center gap-2">
                  <User className="w-6 h-6" />
                  <span className="font-medium">{language === 'en' ? 'Male' : 'ذكر'}</span>
                </div>
              </motion.button>

              <motion.button
                type="button"
                onClick={() => {
                  handleChange({ target: { name: 'sex', value: 'female' } } as any);
                  // Update name if gender changes
                  if (formData.sex !== 'female' && formData.name) {
                    const nameList = language === 'en' ? femaleNamesEn : femaleNamesAr;
                    setFormData(prev => ({
                      ...prev, 
                      name: nameList[Math.floor(Math.random() * nameList.length)]
                    }));
                  }
                }}
                className={`flex-1 p-4 rounded-xl text-center transition-all duration-300
                  ${formData.sex === 'female'
                    ? 'bg-gradient-to-r from-indigo-600 to-teal-500 dark:from-cyan-400 dark:to-teal-400 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-cyan-900/20'}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col items-center gap-2">
                  <User className="w-6 h-6" />
                  <span className="font-medium">{language === 'en' ? 'Female' : 'أنثى'}</span>
                </div>
              </motion.button>
            </div>
          </div>
        </div>
      ),
    },
  ];

  if (isRandomizing) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="p-6 sm:p-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg rounded-2xl shadow-lg w-full max-w-2xl border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center min-h-[400px]"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mb-6"
        >
          <Loader2 className="w-12 h-12 text-indigo-600 dark:text-cyan-400" />
        </motion.div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {language === 'en' ? 'Preparing Time Machine...' : 'تجهيز آلة الزمن...'}
        </h2>
        <div className="space-y-2 text-center mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'en' ? 'Your random time traveler:' : 'المسافر العشوائي عبر الزمن:'}
          </p>
          <p className="text-lg font-medium bg-gradient-to-r from-indigo-600 to-teal-500 dark:from-cyan-400 dark:to-teal-400 text-transparent bg-clip-text">
            {formData.name}, {formData.age} {language === 'en' ? 'years old' : 'سنة'}
          </p>
          <p className="text-lg font-medium bg-gradient-to-r from-indigo-600 to-teal-500 dark:from-cyan-400 dark:to-teal-400 text-transparent bg-clip-text">
            {language === 'en' ? formData.city : palestinianCitiesArabic[palestinianCities.indexOf(formData.city)]}, {formData.year}
          </p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
          {language === 'en' ? 'Calibrating temporal coordinates...' : 'ضبط الإحداثيات الزمنية...'}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 sm:p-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg rounded-2xl shadow-lg w-full max-w-2xl border border-gray-100 dark:border-gray-800"
    >
      {/* Header with progress and randomize */}
      <div className="flex items-center justify-between mb-6">
        <motion.button
          onClick={handleRandomize}
          className="p-2 rounded-full bg-gradient-to-r from-indigo-600/10 to-teal-500/10 dark:from-cyan-400/10 dark:to-teal-400/10 
            text-indigo-700 dark:text-cyan-300 
            hover:from-indigo-600/20 hover:to-teal-500/20 
            dark:hover:from-cyan-400/20 dark:hover:to-teal-400/20 
            transition-all duration-300"
        type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
        <motion.div whileTap={{ rotate: 360, transition: { duration: 0.5 } }}>
            <Sparkles className="w-5 h-5" />
        </motion.div>
        </motion.button>

        <div className="flex gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-1 w-8 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? 'bg-gradient-to-r from-indigo-600 to-teal-500 dark:from-cyan-400 dark:to-teal-400'
                  : index < currentStep
                  ? 'bg-indigo-600/50 dark:bg-cyan-400/50'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main content area */}
        <div className="relative overflow-hidden min-h-[400px]">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 h-full"
            >
              {/* Step header */}
              <div className="flex items-center gap-3 mb-6">
                {React.createElement(steps[currentStep].icon, {
                  className: "w-6 h-6 text-indigo-600 dark:text-cyan-400",
                })}
                <h2 className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-teal-500 dark:from-cyan-400 dark:to-teal-400 text-transparent bg-clip-text">
                  {steps[currentStep].title}
                </h2>
              </div>

              {/* Step content */}
              <div className="h-[calc(100%-3rem)]">
                {steps[currentStep].content}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <motion.button
            type="button"
            onClick={handlePrev}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium
              ${currentStep === 0
                ? 'opacity-0 pointer-events-none'
                : 'bg-gradient-to-r from-indigo-600/10 to-teal-500/10 dark:from-cyan-400/10 dark:to-teal-400/10 text-indigo-700 dark:text-cyan-300'}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {language === 'en' ? (
              <>
                <ArrowLeft className="w-4 h-4" />
                Back
              </>
            ) : (
              <>
                <ArrowRight className="w-4 h-4" />
                رجوع
              </>
            )}
          </motion.button>

          <motion.button
            type={currentStep === steps.length - 1 ? 'submit' : 'button'}
            onClick={currentStep === steps.length - 1 ? undefined : handleNext}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white
              bg-gradient-to-r from-indigo-600 to-teal-500 dark:from-cyan-400 dark:to-teal-400 
              hover:from-teal-500 hover:to-indigo-600 dark:hover:from-teal-400 dark:hover:to-cyan-400 
              transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {currentStep === steps.length - 1 ? (
              <>
                <Sparkles className="w-4 h-4" />
                {language === 'en' ? 'Begin Time Travel' : 'ابدأ السفر عبر الزمن'}
              </>
            ) : (
              <>
                {language === 'en' ? (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    التالي
                    <ArrowLeft className="w-4 h-4" />
                  </>
                )}
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default TimelineForm;
