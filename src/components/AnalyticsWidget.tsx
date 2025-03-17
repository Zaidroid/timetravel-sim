import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { BarChart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface AnalyticsWidgetProps {
  year: number;
  city: string;
}

const csvDataString = `
year,population_palestine,population_israel,casualties_palestine,casualties_israel,prisoners_palestine,prisoners_israel,territory_palestine,territory_israel
1948,1500000,800000,2900,588,2000,20,45,55
1949,1600000,950000,56,12,2000,20,45,55
1950,1700000,1100000,87,32,2000,20,45,55
1951,1800000,1250000,57,23,2000,20,45,55
1952,1900000,1400000,98,32,2000,20,45,55
1953,2000000,1550000,108,39,2000,20,45,55
1954,2100000,1700000,59,21,2000,20,45,55
1955,2200000,1850000,109,26,2000,20,45,55
1956,2300000,2000000,1420,615,2000,20,45,55
1957,2400000,2150000,51,38,2000,20,45,55
1958,2500000,2300000,91,15,2000,20,45,55
1959,2600000,2450000,146,29,2000,20,45,55
1960,2700000,2600000,83,31,2000,20,45,55
1961,2800000,2750000,146,24,2000,20,45,55
1962,2900000,2900000,77,29,2000,20,45,55
1963,3000000,3050000,67,15,2000,20,45,55
1964,3100000,3200000,58,16,2000,20,45,55
1965,3200000,3350000,74,35,2000,20,45,55
1966,3300000,3500000,65,17,2000,20,45,55
1967,3410000,3650000,1462,215,5778,20,22,78
1968,3520000,3800000,143,22,4401,20,22,78
1969,3630000,3950000,144,34,5148,20,22,78
1970,3740000,4100000,112,34,4078,20,22,78
1971,3850000,4250000,73,30,5902,20,22,78
1972,3960000,4400000,103,36,4893,20,22,78
1973,4070000,4550000,2939,377,5178,20,22,78
1974,4180000,4700000,113,24,5131,20,22,78
1975,4290000,4850000,67,21,4748,20,22,78
1976,4400000,5000000,88,28,4224,20,22,78
1977,4510000,5150000,101,34,4758,20,22,78
1978,4620000,5300000,58,25,4344,20,22,78
1979,4730000,5450000,118,34,4759,20,22,78
1980,4840000,5600000,89,35,4106,20,22,78
1981,4950000,5750000,101,21,5278,20,22,78
1982,5060000,5900000,2984,341,5489,20,22,78
1983,5170000,6050000,72,39,5076,20,22,78
1984,5280000,6200000,100,17,4011,20,22,78
1985,5390000,6350000,58,39,4043,20,22,78
1986,5500000,6500000,89,10,5689,20,22,78
1987,5620000,6650000,1558,377,8431,20,22,78
1988,5740000,6800000,101,24,9705,20,22,78
1989,5860000,6950000,138,27,10619,20,22,78
1990,5980000,7130000,58,19,10668,20,22,78
1991,6100000,7310000,73,28,8071,20,22,78
1992,6220000,7490000,121,33,9904,20,22,78
1993,6340000,7670000,137,34,9227,20,22,78
1994,6460000,7850000,115,29,8134,20,25,75
1995,6580000,8030000,76,10,8897,20,25,75
1996,6700000,8210000,134,27,9745,20,25,75
1997,6820000,8390000,69,27,10709,20,25,75
1998,6940000,8570000,61,32,9591,20,25,75
1999,7060000,8750000,72,15,10952,20,25,75
2000,7185000,8930000,1435,224,8388,20,25,75
2001,7310000,9110000,135,16,9318,20,25,75
2002,7435000,9290000,56,10,7065,20,25,75
2003,7560000,9470000,140,14,8279,20,25,75
2004,7685000,9650000,79,27,7925,20,25,75
2005,7815000,9810000,145,25,9471,20,25,75
2006,7945000,9970000,1540,519,7447,12,25,75
2007,8075000,10130000,135,15,8082,14,25,75
2008,8205000,10290000,2377,613,8170,11,25,75
2009,8335000,10450000,117,31,9212,20,25,75
2010,8465000,10610000,77,37,7674,21,25,75
2011,8595000,10770000,69,26,9310,11,25,75
2012,8725000,10930000,85,19,9327,19,25,75
2013,8855000,11090000,128,33,8366,24,25,75
2014,8985000,11250000,1285,543,8962,24,25,75
2015,9115000,11410000,88,33,8953,11,25,75
2016,9245000,11570000,68,26,7074,21,25,75
2017,9375000,11730000,91,24,7690,22,25,75
2018,9505000,11890000,71,18,9054,18,25,75
2019,9635000,12050000,84,24,7532,14,25,75
2020,9765000,12210000,75,17,9789,18,25,75
2021,9895000,12370000,1125,370,8777,24,25,75
2022,10025000,12530000,84,33,7093,24,25,75
2023,10155000,12690000,2915,347,7757,24,25,75
2024,10285000,12850000,55,12,7206,15,25,75
`;

const AnalyticsWidget: React.FC<AnalyticsWidgetProps> = ({ year, city }) => {
  const { language } = useLanguage();
  const { isDarkMode } = useTheme();
  const [currentInsight, setCurrentInsight] = useState(0);
  const [direction, setDirection] = useState(0);

  const dataRows = useMemo(() => {
    const rows = csvDataString.trim().split('\n');
    const headers = rows[0].split(',');
    return rows.slice(1).map(row => {
      const values = row.split(',');
      return headers.reduce((obj, header, index) => {
        obj[header] = parseInt(values[index], 10);
        return obj;
      }, {} as { [key: string]: number });
    });
  }, []);

  const selectedData = useMemo(() => dataRows.find(row => row.year === year) || dataRows[0], [year, dataRows]);

  const averages = useMemo(() => {
    const totals = dataRows.reduce(
      (acc, row) => ({
        population_palestine: acc.population_palestine + row.population_palestine,
        population_israel: acc.population_israel + row.population_israel,
        casualties_palestine: acc.casualties_palestine + row.casualties_palestine,
        casualties_israel: acc.casualties_israel + row.casualties_israel,
        prisoners_palestine: acc.prisoners_palestine + row.prisoners_palestine,
        prisoners_israel: acc.prisoners_israel + row.prisoners_israel,
        territory_palestine: acc.territory_palestine + row.territory_palestine,
        territory_israel: acc.territory_israel + row.territory_israel,
      }),
      {
        population_palestine: 0,
        population_israel: 0,
        casualties_palestine: 0,
        casualties_israel: 0,
        prisoners_palestine: 0,
        prisoners_israel: 0,
        territory_palestine: 0,
        territory_israel: 0,
      }
    );
    const count = dataRows.length;
    return Object.fromEntries(
      Object.entries(totals).map(([key, value]) => [key, Math.round(value / count)])
    );
  }, [dataRows]);

  const insights = [
    {
      title: language === 'en' ? 'Population' : 'السكان',
      dataKeyPal: 'population_palestine',
      dataKeyIsr: 'population_israel',
      colorPal: 'rgb(99, 102, 241)',
      colorIsr: 'rgb(20, 184, 166)',
      gradient: ['from-indigo-600', 'to-teal-500'],
      darkGradient: ['dark:from-cyan-400', 'dark:to-teal-400'],
    },
    {
      title: language === 'en' ? 'Casualties' : 'الضحايا',
      dataKeyPal: 'casualties_palestine',
      dataKeyIsr: 'casualties_israel',
      colorPal: 'rgb(99, 102, 241)',
      colorIsr: 'rgb(20, 184, 166)',
      gradient: ['from-indigo-600', 'to-teal-500'],
      darkGradient: ['dark:from-cyan-400', 'dark:to-teal-400'],
    },
    {
      title: language === 'en' ? 'Prisoners' : 'السجناء',
      dataKeyPal: 'prisoners_palestine',
      dataKeyIsr: 'prisoners_israel',
      colorPal: 'rgb(99, 102, 241)',
      colorIsr: 'rgb(20, 184, 166)',
      gradient: ['from-indigo-600', 'to-teal-500'],
      darkGradient: ['dark:from-cyan-400', 'dark:to-teal-400'],
    },
    {
      title: language === 'en' ? 'Territory (%)' : 'الأراضي (%)',
      dataKeyPal: 'territory_palestine',
      dataKeyIsr: 'territory_israel',
      colorPal: 'rgb(99, 102, 241)',
      colorIsr: 'rgb(20, 184, 166)',
      gradient: ['from-indigo-600', 'to-teal-500'],
      darkGradient: ['dark:from-cyan-400', 'dark:to-teal-400'],
    },
  ];

  const handleNextInsight = () => {
    setDirection(1);
    setCurrentInsight(prev => (prev + 1) % insights.length);
  };

  const handlePrevInsight = () => {
    setDirection(-1);
    setCurrentInsight(prev => (prev - 1 + insights.length) % insights.length);
  };

  const chartData = {
    labels: [
      language === 'en' ? `${year}` : `${year}`,
      language === 'en' ? 'Average (1948-2024)' : 'المتوسط (1948-2024)',
    ],
    datasets: [
      {
        label: language === 'en' ? 'Palestine' : 'فلسطين',
        data: [selectedData[insights[currentInsight].dataKeyPal], averages[insights[currentInsight].dataKeyPal]],
        backgroundColor: insights[currentInsight].colorPal,
        borderColor: isDarkMode ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.2)',
        borderWidth: 2,
        borderRadius: 6,
      },
      {
        label: language === 'en' ? 'Israel' : 'إسرائيل',
        data: [selectedData[insights[currentInsight].dataKeyIsr], averages[insights[currentInsight].dataKeyIsr]],
        backgroundColor: insights[currentInsight].colorIsr,
        borderColor: isDarkMode ? 'rgba(20, 184, 166, 0.1)' : 'rgba(20, 184, 166, 0.2)',
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 500,
      easing: 'easeOutQuart' as const,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: { 
            size: 12,
            weight: 'bold' as const,
          },
          padding: 16,
          color: isDarkMode ? 'rgb(209, 213, 219)' : 'rgb(55, 65, 81)',
        },
      },
      title: {
        display: true,
        text: insights[currentInsight].title,
        font: { 
          size: 18,
          weight: 'bold' as const,
        },
        color: isDarkMode ? 'rgb(243, 244, 246)' : 'rgb(31, 41, 55)',
        padding: { bottom: 16 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: isDarkMode ? 'rgba(243, 244, 246, 0.1)' : 'rgba(31, 41, 55, 0.1)',
        },
        ticks: {
          color: isDarkMode ? 'rgb(209, 213, 219)' : 'rgb(55, 65, 81)',
          font: { 
            size: 12,
            weight: 'normal' as const,
          },
        },
        title: {
          display: true,
          text: language === 'en' ? 'Count' : 'العدد',
          font: { 
            size: 12,
            weight: 'bold' as const,
          },
          color: isDarkMode ? 'rgb(209, 213, 219)' : 'rgb(55, 65, 81)',
        },
      },
      x: {
        grid: {
          color: isDarkMode ? 'rgba(243, 244, 246, 0.1)' : 'rgba(31, 41, 55, 0.1)',
        },
        ticks: {
          color: isDarkMode ? 'rgb(209, 213, 219)' : 'rgb(55, 65, 81)',
          font: { 
            size: 12,
            weight: 'normal' as const,
          },
        },
      },
    },
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
        <BarChart className="w-6 h-6 text-indigo-600 dark:text-cyan-400" />
        <div>
          <h3 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-teal-500 dark:from-cyan-400 dark:to-teal-400 text-transparent bg-clip-text">
            {language === 'en' ? `Analytics for ${year}` : `تحليلات لعام ${year}`}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {language === 'en' ? city : city}
          </p>
        </div>
      </div>

      <div className="relative h-[300px] mb-6">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentInsight}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
          >
            <Bar data={chartData} options={chartOptions} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrevInsight}
          className="p-2 rounded-full bg-gradient-to-r from-indigo-600/10 to-teal-500/10 dark:from-cyan-400/10 dark:to-teal-400/10 
            text-indigo-700 dark:text-cyan-300 
            hover:from-indigo-600/20 hover:to-teal-500/20 
            dark:hover:from-cyan-400/20 dark:hover:to-teal-400/20 
            transition-all duration-300"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>

        <span className="text-sm text-gray-600 dark:text-gray-400">
          {currentInsight + 1}/{insights.length}
        </span>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNextInsight}
          className="p-2 rounded-full bg-gradient-to-r from-indigo-600/10 to-teal-500/10 dark:from-cyan-400/10 dark:to-teal-400/10 
            text-indigo-700 dark:text-cyan-300 
            hover:from-indigo-600/20 hover:to-teal-500/20 
            dark:hover:from-cyan-400/20 dark:hover:to-teal-400/20 
            transition-all duration-300"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default AnalyticsWidget;
