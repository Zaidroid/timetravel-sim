import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Clock, MapPin, Utensils, Bus, Sun, DollarSign, Info } from 'lucide-react';
import { TravelData } from '../types';

interface TravelItineraryProps {
  data: TravelData;
  loading: boolean;
}

const TravelItinerary: React.FC<TravelItineraryProps> = ({ data, loading }) => {
  const { language } = useLanguage();

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-4xl mx-auto p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-xl"
      >
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </motion.div>
    );
  }

  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto space-y-6"
    >
      {/* Schedule Section */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {language === 'en' ? 'Daily Schedule' : 'الجدول اليومي'}
          </h2>
        </div>
        <div className="space-y-4">
          {data.schedule.map((item, index) => (
            <div key={index} className="flex gap-4">
              <div className="w-20 text-gray-500 dark:text-gray-400">{item.time}</div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white">{item.activity}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attractions Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {language === 'en' ? 'Popular Attractions' : 'المعالم السياحية الشهيرة'}
            </h2>
          </div>
          <ul className="space-y-3">
            {data.attractions.map((attraction, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">{attraction.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{attraction.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Restaurants Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Utensils className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {language === 'en' ? 'Local Restaurants' : 'المطاعم المحلية'}
            </h2>
          </div>
          <ul className="space-y-4">
            {data.restaurants.map((restaurant, index) => (
              <li key={index} className="border-b last:border-0 border-gray-200 dark:border-gray-700 pb-3 last:pb-0">
                <h3 className="font-medium text-gray-900 dark:text-white">{restaurant.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{restaurant.description}</p>
                <p className="text-sm font-medium text-blue-500 mt-1">
                  {language === 'en' ? 'Signature Dish: ' : 'الطبق المميز: '}
                  {restaurant.signatureDish}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Transportation */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bus className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {language === 'en' ? 'Transportation' : 'المواصلات'}
            </h2>
          </div>
          <ul className="space-y-2">
            {data.transportation.map((item, index) => (
              <li key={index} className="text-gray-600 dark:text-gray-300 text-sm">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Weather Activities */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sun className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {language === 'en' ? 'Weather Activities' : 'أنشطة حسب الطقس'}
            </h2>
          </div>
          <ul className="space-y-2">
            {data.weatherActivities.map((activity, index) => (
              <li key={index} className="text-gray-600 dark:text-gray-300 text-sm">
                {activity}
              </li>
            ))}
          </ul>
        </div>

        {/* Costs */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {language === 'en' ? 'Estimated Costs' : 'التكاليف التقديرية'}
            </h2>
          </div>
          <ul className="space-y-2">
            {Object.entries(data.costs).map(([item, cost]) => (
              <li key={item} className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">{item}</span>
                <span className="font-medium text-gray-900 dark:text-white">{cost}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Cultural Tips */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {language === 'en' ? 'Cultural Tips' : 'نصائح ثقافية'}
          </h2>
        </div>
        <ul className="space-y-2">
          {data.culturalTips.map((tip, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="text-blue-500">•</span>
              <span className="text-gray-600 dark:text-gray-300">{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default TravelItinerary;
