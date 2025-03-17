import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Square } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import WaveSurfer from 'wavesurfer.js';

interface AudioPlayerProps {
  audioUrl: string;
  onStop: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, onStop }) => {
  const { language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (waveformRef.current && !wavesurfer.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#A0AEC0',
        progressColor: '#3B82F6',
        height: 64,
        barWidth: 2,
        cursorWidth: 1,
        responsive: true,
      });
      wavesurfer.current.load(audioUrl);
      wavesurfer.current.on('finish', () => setIsPlaying(false));
    }
    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
        wavesurfer.current = null;
      }
    };
  }, [audioUrl]);

  useEffect(() => {
    if (wavesurfer.current) {
      if (isPlaying) wavesurfer.current.play();
      else wavesurfer.current.pause();
    }
  }, [isPlaying]);

  const togglePlayPause = () => setIsPlaying(!isPlaying);

  const handleStop = () => {
    if (wavesurfer.current) {
      wavesurfer.current.stop();
      setIsPlaying(false);
    }
    onStop();
  };

  return (
    <motion.div
      className="p-4 bg-gray-100/80 dark:bg-gray-700/80 backdrop-blur-lg rounded-lg mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-4">
        <motion.button
          onClick={togglePlayPause}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full bg-blue-500/20 text-blue-500"
          aria-label={isPlaying ? (language === 'en' ? 'Pause' : 'إيقاف مؤقت') : (language === 'en' ? 'Play' : 'تشغيل')}
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </motion.button>
        <div ref={waveformRef} className="flex-1 h-16" />
        <motion.button
          onClick={handleStop}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full bg-red-500/20 text-red-500"
          aria-label={language === 'en' ? 'Stop' : 'إيقاف'}
        >
          <Square className="w-6 h-6" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default AudioPlayer;
