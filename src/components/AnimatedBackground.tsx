import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

// Types for our props
interface ParticleProps {
  initialPosition: { x: number; y: number };
  size: number;
  color: string;
  vx: number;
  vy: number;
  frequency: number;
  amplitude: number;
  mousePosition: { x: number; y: number };
  isMobile: boolean;
  isDarkMode: boolean;
}

function Particle({
  initialPosition,
  size,
  color,
  vx,
  vy,
  frequency,
  amplitude,
  mousePosition,
  isMobile,
  isDarkMode,
}: ParticleProps) {
  // Decreased stiffness for mobile devices for smoother transitions
  const stiffness = isMobile ? 50 : 100;
  const damping = isMobile ? 30 : 20; // Higher damping for mobile
  
  const springX = useSpring(initialPosition.x, { stiffness, damping });
  const springY = useSpring(initialPosition.y, { stiffness, damping });

  const left = useTransform(springX, (value) => `${value}%`);
  const top = useTransform(springY, (value) => `${value}%`);

  const mousePosRef = useRef(mousePosition);
  const frameRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const totalTimeRef = useRef(0);

  useEffect(() => {
    mousePosRef.current = mousePosition;
  }, [mousePosition]);

  useEffect(() => {
    // Start particles at rest to avoid initial jitter
    const initialDelay = setTimeout(() => {
      const updatePosition = () => {
        const currentTime = performance.now();
        // Cap delta time to avoid large jumps if browser tab is inactive
        const deltaTime = Math.min((currentTime - lastTimeRef.current) / 1000, 0.1);
        lastTimeRef.current = currentTime;
        totalTimeRef.current += deltaTime;
  
        let baseX = initialPosition.x + vx * totalTimeRef.current;
        let baseY = initialPosition.y + vy * totalTimeRef.current;
        const waveY = Math.sin((baseX / 100) * Math.PI * 2 * frequency) * amplitude;
        baseY += waveY;
  
        baseX = (baseX % 100 + 100) % 100;
        baseY = (baseY % 100 + 100) % 100;
  
        const mousePos = mousePosRef.current;
        const distance = getDistance(baseX, baseY, mousePos.x, mousePos.y);
        
        // Reduced attraction strength on mobile
        const attractionFactor = isMobile ? 0.5 : 0.8;
        const attractionStrength = getAttractionStrength(distance, attractionFactor);
  
        let targetX = baseX;
        let targetY = baseY;
        if (attractionStrength > 0) {
          targetX += (mousePos.x - baseX) * attractionStrength;
          targetY += (mousePos.y - baseY) * attractionStrength;
        }
  
        springX.set(targetX);
        springY.set(targetY);
  
        frameRef.current = requestAnimationFrame(updatePosition);
      };
  
      frameRef.current = requestAnimationFrame(updatePosition);
    }, isMobile ? 300 : 0); // Add delay for mobile to allow page to stabilize first

    return () => {
      clearTimeout(initialDelay);
      cancelAnimationFrame(frameRef.current);
    };
  }, [springX, springY, vx, vy, frequency, amplitude, initialPosition.x, initialPosition.y, isMobile]);

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left,
        top,
        backgroundColor: color,
        filter: 'blur(1px)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    />
  );
}

function getDistance(particleX: number, particleY: number, mouseX: number, mouseY: number): number {
  const dx = particleX - mouseX;
  const dy = particleY - mouseY;
  return Math.sqrt(dx * dx + dy * dy);
}

function getAttractionStrength(distance: number, factor: number = 0.8): number {
  const maxDistance = 25;
  return distance > maxDistance ? 0 : (1 - distance / maxDistance) * factor;
}

interface AnimatedGridBackgroundProps {
  isDarkMode?: boolean;
}

export default function AnimatedGridBackground({ isDarkMode = false }: AnimatedGridBackgroundProps) {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [particles, setParticles] = useState<any[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const throttleTimerRef = useRef<number | null>(null);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Set isReady after a short delay to prevent initial animation jank
    const readyTimer = setTimeout(() => setIsReady(true), 500);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(readyTimer);
    };
  }, []);

  // Generate particles with mobile adjustments
  useEffect(() => {
    if (!isReady) return;
    
    const particleCount = isMobile ? 8 : 20; // Even fewer particles on mobile
    setParticles(generateParticles(particleCount, isDarkMode, isMobile));
  }, [isMobile, isDarkMode, isReady]);

  // Throttled pointer movement handler
  const handlePointerMove = (e: MouseEvent | TouchEvent) => {
    if (!containerRef.current || !isReady) return;
    
    // Skip processing if throttled (for mobile performance)
    if (isMobile && throttleTimerRef.current !== null) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      return;
    }

    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    
    setMousePosition({ x, y });
    
    // Set throttle for mobile devices
    if (isMobile) {
      throttleTimerRef.current = window.setTimeout(() => {
        throttleTimerRef.current = null;
      }, 50); // 50ms throttle on mobile
    }
  };

  // Handle pointer movement (mouse and touch)
  useEffect(() => {
    window.addEventListener('mousemove', handlePointerMove as EventListener);
    window.addEventListener('touchmove', handlePointerMove as EventListener, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handlePointerMove as EventListener);
      window.removeEventListener('touchmove', handlePointerMove as EventListener);
      if (throttleTimerRef.current !== null) {
        clearTimeout(throttleTimerRef.current);
      }
    };
  }, [isMobile, isReady]);

  const generateParticles = (count: number, isDark: boolean, isMobile: boolean) => {
    // More subtle color palettes with lower opacity
    const lightColors = [
      'rgba(79, 70, 229, 0.15)',  // indigo
      'rgba(45, 212, 191, 0.15)', // teal
      'rgba(37, 99, 235, 0.15)',  // blue
      'rgba(6, 182, 212, 0.15)',  // cyan
      'rgba(59, 130, 246, 0.15)', // blue
      'rgba(20, 184, 166, 0.15)', // teal
      'rgba(99, 102, 241, 0.15)', // indigo
      'rgba(34, 211, 238, 0.15)', // cyan
    ];
    
    // Darker theme now uses more subtle colors with less blue dominance
    const darkColors = [
      'rgba(129, 140, 248, 0.1)', // indigo lighter
      'rgba(94, 234, 212, 0.1)',  // teal lighter
      'rgba(96, 165, 250, 0.1)',  // blue lighter
      'rgba(34, 211, 238, 0.1)',  // cyan
      'rgba(147, 197, 253, 0.1)', // blue lighter
      'rgba(45, 212, 191, 0.1)',  // teal
      'rgba(167, 139, 250, 0.1)', // purple
      'rgba(196, 181, 253, 0.1)', // purple lighter
    ];

    const colors = isDark ? darkColors : lightColors;

    // Generate particles with lower velocity and amplitude for mobile
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      initialPosition: { x: Math.random() * 100, y: Math.random() * 100 },
      size: isMobile ? 4 + Math.random() * 4 : 5 + Math.random() * 8, // Smaller on mobile
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: isMobile ? 0.05 + Math.random() * 0.1 : 0.2 + Math.random() * 0.3, // Much slower on mobile
      vy: isMobile ? (Math.random() - 0.5) * 0.05 : (Math.random() - 0.5) * 0.2, // Much less vertical movement
      frequency: isMobile ? 0.2 + Math.random() * 0.5 : 1 + Math.random() * 2, // Much less oscillation
      amplitude: isMobile ? 2 + Math.random() * 3 : 5 + Math.random() * 10, // Significantly reduced range
    }));
  };

  if (!isReady) {
    return <div ref={containerRef} className="fixed inset-0 overflow-hidden pointer-events-none z-0" />;
  }

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Grid Wallpaper - only visible around cursor */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(
              to right,
              ${isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)'} 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              ${isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)'} 1px,
              transparent 1px
            )
          `,
          backgroundSize: isMobile ? '20px 20px' : '40px 40px', // Smaller grid on mobile
          opacity: 0,
          maskImage: 'radial-gradient(circle, black 0%, transparent 70%)',
          maskSize: isMobile ? '100px 100px' : '150px 150px', // Smaller mask on mobile
          maskPosition: `${mousePosition.x}% ${mousePosition.y}%`,
          maskRepeat: 'no-repeat',
        }}
        animate={{
          opacity: 1,
          maskSize: isMobile ? ['0px 0px', '100px 100px'] : ['0px 0px', '150px 150px'],
        }}
        transition={{
          maskSize: { duration: isMobile ? 0.8 : 0.5, ease: 'easeOut' }, // Slower animation on mobile
          opacity: { duration: isMobile ? 0.5 : 0.3 },
        }}
      />

      {/* Background Gradient Blobs with reduced opacity and blue tint */}
      <motion.div
        className="absolute top-1/2 left-1/2 rounded-full blur-[150px]"
        style={{
          width: 'min(80rem, 100vw)',
          height: 'min(80rem, 100vh)',
          background: isDarkMode 
            ? 'radial-gradient(circle, rgba(67, 56, 202, 0.05) 0%, rgba(17, 94, 89, 0.05) 100%)' 
            : 'radial-gradient(circle, rgba(79, 70, 229, 0.1) 0%, rgba(20, 184, 166, 0.1) 100%)'
        }}
        animate={{
          x: '-50%',
          y: '-50%',
          translateX: `${(mousePosition.x - 50) * (isMobile ? 0.01 : 0.05)}%`, // Much less movement on mobile
          translateY: `${(mousePosition.y - 50) * (isMobile ? 0.01 : 0.05)}%`,
          rotate: isMobile ? [0, 180] : [0, 360], // Less rotation on mobile
        }}
        transition={{
          translateX: { duration: isMobile ? 3 : 2, ease: 'easeOut' }, // Slower transitions on mobile
          translateY: { duration: isMobile ? 3 : 2, ease: 'easeOut' },
          rotate: { duration: isMobile ? 240 : 120, ease: 'linear', repeat: Infinity },
        }}
      />
      
      <motion.div
        className="absolute top-1/2 left-1/2 rounded-full blur-[120px]"
        style={{
          width: 'min(60rem, 80vw)',
          height: 'min(60rem, 80vh)',
          background: isDarkMode 
            ? 'radial-gradient(circle, rgba(23, 37, 84, 0.05) 0%, rgba(30, 58, 138, 0.05) 100%)' 
            : 'radial-gradient(circle, rgba(20, 184, 166, 0.07) 0%, rgba(37, 99, 235, 0.07) 100%)'
        }}
        animate={{
          x: '-50%',
          y: '-50%',
          translateX: `${(mousePosition.x - 50) * (isMobile ? -0.005 : -0.03)}%`, // Much less movement on mobile
          translateY: `${(mousePosition.y - 50) * (isMobile ? -0.005 : -0.03)}%`,
          rotate: isMobile ? [0, -180] : [0, -360], // Less rotation on mobile
        }}
        transition={{
          translateX: { duration: isMobile ? 4 : 3, ease: 'easeOut' }, // Slower transitions on mobile
          translateY: { duration: isMobile ? 4 : 3, ease: 'easeOut' },
          rotate: { duration: isMobile ? 300 : 180, ease: 'linear', repeat: Infinity },
        }}
      />
      
      {/* Cursor-following blob with reduced size and opacity for mobile */}
      <motion.div
        className="absolute rounded-full blur-[80px]"
        style={{
          width: isMobile ? 'min(10rem, 30vw)' : 'min(20rem, 50vw)',
          height: isMobile ? 'min(10rem, 30vh)' : 'min(20rem, 50vh)',
          background: isDarkMode 
            ? 'rgba(45, 212, 238, 0.05)' // Cyan with very low opacity for dark mode
            : 'rgba(34, 211, 238, 0.07)' // Cyan with low opacity for light mode
        }}
        animate={{
          left: `calc(${mousePosition.x}% - ${isMobile ? '5rem' : '10rem'})`,
          top: `calc(${mousePosition.y}% - ${isMobile ? '5rem' : '10rem'})`,
          scale: [1, 1.03, 1], // Less scale variation on mobile
        }}
        transition={{
          left: { duration: isMobile ? 0.8 : 0.5, ease: 'easeOut' }, // Slower on mobile
          top: { duration: isMobile ? 0.8 : 0.5, ease: 'easeOut' },
          scale: { duration: isMobile ? 4 : 3, repeat: Infinity, ease: 'easeInOut' },
        }}
      />

      {/* Subtle cursor glow with reduced size for mobile */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: isMobile ? '20px' : '24px',
          height: isMobile ? '20px' : '24px',
          background: isDarkMode
            ? 'rgba(99, 102, 241, 0.1)' // Indigo with low opacity for dark mode
            : 'rgba(79, 70, 229, 0.1)', // Indigo with low opacity for light mode
          filter: 'blur(5px)',
        }}
        animate={{
          x: `calc(${mousePosition.x}% - ${isMobile ? '10px' : '12px'})`,
          y: `calc(${mousePosition.y}% - ${isMobile ? '10px' : '12px'})`,
          scale: [1, 1.1, 1], // Subtle pulsing effect
        }}
        transition={{
          x: { duration: 0.2, ease: 'easeOut' }, // Quick response to mouse
          y: { duration: 0.2, ease: 'easeOut' },
          scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
      
      {/* Particles - rendered conditionally for performance */}
      {particles.map((particle) => (
        <Particle
          key={particle.id}
          initialPosition={particle.initialPosition}
          size={particle.size}
          color={particle.color}
          vx={particle.vx}
          vy={particle.vy}
          frequency={particle.frequency}
          amplitude={particle.amplitude}
          mousePosition={mousePosition}
          isMobile={isMobile}
          isDarkMode={isDarkMode}
        />
      ))}
    </div>
  );
}