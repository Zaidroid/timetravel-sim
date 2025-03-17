export type Theme = 'light' | 'dark';
export type Language = 'en' | 'ar';

export interface TimelineFormData {
  name: string;
  age: number;
  sex: 'male' | 'female';
  city: string;
  year: number;
}

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export interface TravelData {
  schedule: Array<{
    time: string;
    activity: string;
    description: string;
  }>;
  attractions: Array<{
    name: string;
    description: string;
  }>;
  restaurants: Array<{
    name: string;
    description: string;
    signatureDish: string;
  }>;
  transportation: string[];
  weatherActivities: string[];
  costs: Record<string, string>;
  culturalTips: string[];
}

export interface TourismStats {
  monthlyVisitors: number;
  peakSeason: string;
  averageStay: number;
  topAttractions: string[];
  visitorDemographics: Record<string, number>;
}
