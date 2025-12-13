import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Star, Zap } from 'lucide-react';

interface MatchingAnimationProps {
  userName: string;
  partnerName: string;
  userImage?: string;
  partnerImage?: string;
  onComplete: () => void;
}

const MATCHING_STEPS = [
  { text: "Analyzing compatibility...", icon: Zap, duration: 1200 },
  { text: "Calculating chemistry...", icon: Star, duration: 1000 },
  { text: "Aligning vibes...", icon: Sparkles, duration: 1000 },
  { text: "It's a match!", icon: Heart, duration: 1500 },
];

export const MatchingAnimation = ({
  userName,
  partnerName,
  userImage,
  partnerImage,
  onComplete
}: MatchingAnimationProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showMatch, setShowMatch] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (currentStep < MATCHING_STEPS.length - 1) {
      timeout = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, MATCHING_STEPS[currentStep].duration);
    } else if (currentStep === MATCHING_STEPS.length - 1) {
      timeout = setTimeout(() => {
        setShowMatch(true);
      }, 500);
      
      setTimeout(() => {
        onComplete();
      }, MATCHING_STEPS[currentStep].duration + 1500);
    }
    
    return () => clearTimeout(timeout);
  }, [currentStep, onComplete]);

  const CurrentIcon = MATCHING_STEPS[currentStep].icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-lg">
      <div className="relative w-full max-w-lg px-4">
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-primary/30"
              initial={{ 
                x: Math.random() * 400 - 200, 
                y: Math.random() * 400 - 200,
                opacity: 0 
              }}
              animate={{ 
                y: [null, Math.random() * -200 - 50],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0]
              }}
              transition={{
                duration: 3,
                delay: i * 0.2,
                repeat: Infinity,
                ease: "easeOut"
              }}
              style={{
                left: '50%',
                top: '50%',
              }}
            />
          ))}
        </div>

        {/* Profile circles */}
        <div className="relative flex items-center justify-center mb-12">
          {/* User profile */}
          <motion.div
            className="relative z-10"
            initial={{ x: -100, opacity: 0 }}
            animate={{ 
              x: showMatch ? -20 : -80, 
              opacity: 1,
              scale: showMatch ? 1.1 : 1
            }}
            transition={{ type: "spring", damping: 15, stiffness: 100 }}
          >
            <motion.div
              className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary shadow-glow"
              animate={{ 
                borderColor: showMatch ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                boxShadow: showMatch 
                  ? '0 0 40px hsl(var(--primary) / 0.5)' 
                  : '0 0 0px transparent'
              }}
            >
              {userImage ? (
                <img src={userImage} alt={userName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-romantic flex items-center justify-center text-3xl font-bold text-white">
                  {userName.charAt(0)}
                </div>
              )}
            </motion.div>
            <motion.p 
              className="text-center mt-2 font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {userName}
            </motion.p>
          </motion.div>

          {/* Heart icon in center */}
          <AnimatePresence>
            {showMatch && (
              <motion.div
                className="absolute z-20"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 10, stiffness: 200 }}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-romantic flex items-center justify-center shadow-glow">
                  <Heart className="w-8 h-8 text-white" fill="currentColor" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Partner profile */}
          <motion.div
            className="relative z-10"
            initial={{ x: 100, opacity: 0 }}
            animate={{ 
              x: showMatch ? 20 : 80, 
              opacity: 1,
              scale: showMatch ? 1.1 : 1
            }}
            transition={{ type: "spring", damping: 15, stiffness: 100 }}
          >
            <motion.div
              className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary shadow-glow"
              animate={{ 
                borderColor: showMatch ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                boxShadow: showMatch 
                  ? '0 0 40px hsl(var(--primary) / 0.5)' 
                  : '0 0 0px transparent'
              }}
            >
              {partnerImage ? (
                <img src={partnerImage} alt={partnerName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-romantic flex items-center justify-center text-3xl font-bold text-white">
                  {partnerName.charAt(0)}
                </div>
              )}
            </motion.div>
            <motion.p 
              className="text-center mt-2 font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {partnerName}
            </motion.p>
          </motion.div>
        </div>

        {/* Status text */}
        <motion.div 
          className="text-center"
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <motion.div 
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-muted/50 border border-border/50"
            animate={showMatch ? { 
              background: 'linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--secondary) / 0.2))',
              borderColor: 'hsl(var(--primary) / 0.5)',
              scale: [1, 1.05, 1]
            } : {}}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{ rotate: showMatch ? 0 : 360 }}
              transition={{ duration: 2, repeat: showMatch ? 0 : Infinity, ease: "linear" }}
            >
              <CurrentIcon className={`w-5 h-5 ${showMatch ? 'text-primary' : 'text-muted-foreground'}`} />
            </motion.div>
            <span className={`font-medium ${showMatch ? 'text-primary text-lg' : ''}`}>
              {MATCHING_STEPS[currentStep].text}
            </span>
          </motion.div>
        </motion.div>

        {/* Match celebration */}
        <AnimatePresence>
          {showMatch && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute left-1/2 top-1/2"
                  initial={{ scale: 0 }}
                  animate={{
                    x: (Math.random() - 0.5) * 400,
                    y: (Math.random() - 0.5) * 400,
                    scale: [0, 1, 0],
                    rotate: Math.random() * 360
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.05,
                    ease: "easeOut"
                  }}
                >
                  {i % 3 === 0 ? (
                    <Heart className="w-4 h-4 text-primary" fill="currentColor" />
                  ) : i % 3 === 1 ? (
                    <Star className="w-3 h-3 text-love-gold" fill="currentColor" />
                  ) : (
                    <Sparkles className="w-3 h-3 text-secondary" />
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MatchingAnimation;
