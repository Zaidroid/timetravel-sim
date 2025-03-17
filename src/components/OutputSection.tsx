import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Download, Copy, Book, Maximize2, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { generateTTS } from '../services/api';
import AudioPlayer from './AudioPlayer';

interface OutputSectionProps {
  narrative: string;
  loading: boolean;
  name?: string;
  title?: string;
  icon?: 'Book' | 'Clock' | 'Map' | 'Info';
}

const OutputSection: React.FC<OutputSectionProps> = ({
  narrative,
  loading,
  name,
  title = 'Narrative',
  icon = 'Book',
}) => {
  const { language } = useLanguage();
  const wordCount = narrative.split(/\s+/).filter(word => word.length > 0).length;
  const [audioUrl, setAudioUrl] = useState('');
  const [audioError, setAudioError] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Split narrative into paragraphs
  const paragraphs = narrative.split(/\n\n/).filter(para => para.trim().length > 0);

  useEffect(() => {
    // Close expanded view when narrative changes
    setIsExpanded(false);
  }, [narrative]);

  useEffect(() => {
    let isMounted = true;
    const fetchTTS = async () => {
      if (narrative) {
        setAudioError('');
        try {
          const url = await generateTTS(narrative);
          if (isMounted) setAudioUrl(url);
        } catch (error) {
          if (isMounted) {
            setAudioError(
              language === 'en'
                ? `Failed to generate audio: ${error instanceof Error ? error.message : 'Unknown error'}`
                : `فشل في إنشاء الصوت: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`
            );
          }
        }
      }
    };
    if (narrative) fetchTTS();
    return () => {
      isMounted = false;
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [narrative, language, audioUrl]);

  // Add body scroll lock when expanded
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isExpanded]);

  const handleCopy = async () => await navigator.clipboard.writeText(narrative);
  const handleDownload = () => {
    const blob = new Blob([narrative], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'time-travel-narrative.txt';
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: language === 'en' ? 'Time Travel Narrative' : 'سرد السفر عبر الزمن',
        text: narrative,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(narrative);
      alert(language === 'en' ? 'Narrative copied to clipboard!' : 'تم نسخ السرد إلى الحافظة!');
    }
  };

  const handleStop = () => setAudioUrl('');
  
  const toggleExpand = () => setIsExpanded(prev => !prev);

  const getIcon = () => <Book className="w-6 h-6 text-indigo-600 dark:text-cyan-400" />;

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

  // Main content rendering function
  const renderNarrativeContent = () => {
    if (!narrative) return null;
    
    return (
      <div className="prose dark:prose-invert mx-auto text-base text-gray-700 dark:text-gray-300 leading-relaxed">
        {paragraphs.map((para, index) => (
          <p key={index} className="mb-4">
            {para}
          </p>
        ))}
      </div>
    );
  };

  // Action buttons rendering function
  const renderActionButtons = () => {
    return (
      <div className="flex gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className="p-2 rounded-full bg-gradient-to-r from-indigo-600/10 to-teal-500/10 dark:from-cyan-400/10 dark:to-teal-400/10 
            text-indigo-700 dark:text-cyan-300 
            hover:from-indigo-600/20 hover:to-teal-500/20 
            dark:hover:from-cyan-400/20 dark:hover:to-teal-400/20 
            transition-all duration-300"
        >
          <Copy className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownload}
          className="p-2 rounded-full bg-gradient-to-r from-indigo-600/10 to-teal-500/10 dark:from-cyan-400/10 dark:to-teal-400/10 
            text-indigo-700 dark:text-cyan-300 
            hover:from-indigo-600/20 hover:to-teal-500/20 
            dark:hover:from-cyan-400/20 dark:hover:to-teal-400/20 
            transition-all duration-300"
        >
          <Download className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShare}
          className="p-2 rounded-full bg-gradient-to-r from-indigo-600/10 to-teal-500/10 dark:from-cyan-400/10 dark:to-teal-400/10 
            text-indigo-700 dark:text-cyan-300 
            hover:from-indigo-600/20 hover:to-teal-500/20 
            dark:hover:from-cyan-400/20 dark:hover:to-teal-400/20 
            transition-all duration-300"
        >
          <Share2 className="w-5 h-5" />
        </motion.button>
      </div>
    );
  };

  // Main content for the widget
  const renderMainContent = () => {
    if (loading) {
      return (
        <motion.div variants={itemVariants} className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-cyan-400"></div>
        </motion.div>
      );
    }
    
    if (!narrative) {
      return (
        <motion.div 
          variants={itemVariants}
          className="flex-1 flex items-center justify-center text-center text-gray-500 dark:text-gray-400"
        >
          {language === 'en'
            ? 'Fill out the form to generate your time travel narrative'
            : 'املأ النموذج لإنشاء سردك للسفر عبر الزمن'}
        </motion.div>
      );
    }
    
    return (
      <>
        <motion.div 
          variants={itemVariants} 
          className="flex-1 overflow-y-auto px-4 sm:px-8 py-4"
          ref={contentRef}
        >
          {renderNarrativeContent()}
        </motion.div>

        {audioUrl && !audioError && (
          <motion.div variants={itemVariants}>
            <AudioPlayer audioUrl={audioUrl} onStop={handleStop} />
          </motion.div>
        )}
        
        {audioError && (
          <motion.div variants={itemVariants} className="mt-4 text-red-500">
            {audioError}
          </motion.div>
        )}

        <motion.div 
          variants={itemVariants}
          className="mt-6 flex justify-between items-center border-t border-gray-200 dark:border-gray-800 pt-4"
        >
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {language === 'en' ? `${wordCount} words` : `${wordCount} كلمة`}
          </span>
          {renderActionButtons()}
        </motion.div>
      </>
    );
  };

  // Modal content
  const renderModal = () => {
    return (
      <>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm z-40"
          onClick={toggleExpand}
        />
        
        {/* Modal */}
        <div 
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg z-50 
            flex flex-col overflow-hidden rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 
            w-[90%] max-w-4xl h-[80vh] max-h-[800px]"
        >
          {/* Header */}
          <div className="p-4 sm:p-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              {getIcon()}
              <h2 className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-teal-500 dark:from-cyan-400 dark:to-teal-400 text-transparent bg-clip-text">
                {language === 'en' ? title : 'السرد الزمني'}
              </h2>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleExpand}
              className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-md
                hover:bg-white dark:hover:bg-gray-800
                transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </motion.button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-4">
            {renderNarrativeContent()}
          </div>
          
          {/* Audio player */}
          {audioUrl && !audioError && (
            <div className="px-4 sm:px-8 py-4 border-t border-gray-200 dark:border-gray-800">
              <AudioPlayer audioUrl={audioUrl} onStop={handleStop} />
            </div>
          )}
          
          {/* Footer */}
          <div className="px-4 sm:px-8 py-4 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {language === 'en' ? `${wordCount} words` : `${wordCount} كلمة`}
            </span>
            {renderActionButtons()}
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      {/* Main widget */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="p-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 flex flex-col h-[400px]"
      >
        <motion.div variants={itemVariants} className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            {getIcon()}
            <h2 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-teal-500 dark:from-cyan-400 dark:to-teal-400 text-transparent bg-clip-text">
              {language === 'en' ? title : 'السرد الزمني'}
            </h2>
          </div>
          
          {narrative && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleExpand}
              className="p-2 rounded-full bg-gradient-to-r from-indigo-600/10 to-teal-500/10 dark:from-cyan-400/10 dark:to-teal-400/10 
                text-indigo-700 dark:text-cyan-300 
                hover:from-indigo-600/20 hover:to-teal-500/20 
                dark:hover:from-cyan-400/20 dark:hover:to-teal-400/20 
                transition-all duration-300"
            >
              <Maximize2 className="w-5 h-5" />
            </motion.button>
          )}
        </motion.div>

        {renderMainContent()}
      </motion.div>

      {/* Modal portal */}
      {isExpanded && (
        <div className="fixed inset-0 z-50">
          {renderModal()}
        </div>
      )}
    </>
  );
};

export default OutputSection;
