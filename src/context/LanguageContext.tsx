import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, LanguageContextType } from '../types';

// Localization dictionary
const translations = {
  en: {
    title: 'Palestine Time Travel Simulator',
    form: {
      name: 'Name',
      age: 'Age',
      sex: 'Sex',
      city: 'City',
      year: 'Year',
      submit: 'Generate Timeline'
    },
    errors: {
      nameRequired: 'Name is required',
      nameTooShort: 'Name must be at least 2 characters long',
      ageInvalid: 'Age must be between 1 and 120',
      cityRequired: 'City is required',
      cityTooShort: 'City name must be at least 2 characters long',
      yearInvalid: 'Year must be between 1900 and current year'
    }
  },
  ar: {
    title: 'محاكي السفر عبر الزمن في فلسطين',
    form: {
      name: 'الاسم',
      age: 'العمر',
      sex: 'الجنس',
      city: 'المدينة',
      year: 'السنة',
      submit: 'إنشاء الجدول الزمني'
    },
    errors: {
      nameRequired: 'الاسم مطلوب',
      nameTooShort: 'يجب أن يكون الاسم مكونًا من حرفين على الأقل',
      ageInvalid: 'يجب أن يكون العمر بين 1 و 120',
      cityRequired: 'المدينة مطلوبة',
      cityTooShort: 'يجب أن يكون اسم المدينة مكونًا من حرفين على الأقل',
      yearInvalid: 'يجب أن تكون السنة بين 1900 والسنة الحالية'
    }
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Initial language setup
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['en', 'ar'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
      updateDocumentDirection(savedLanguage);
    } else {
      // Detect browser language
      const browserLang = navigator.language.startsWith('ar') ? 'ar' : 'en';
      setLanguage(browserLang);
      updateDocumentDirection(browserLang);
    }
  }, []);

  const updateDocumentDirection = (lang: Language) => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = translations[lang].title;
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    updateDocumentDirection(lang);
  };

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        setLanguage: handleLanguageChange,
        t: (key: string) => {
          const keys = key.split('.');
          return keys.reduce((obj, k) => obj?.[k], translations[language]) || key;
        }
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
