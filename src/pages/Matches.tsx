import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Sparkles, Calendar, ArrowLeft, Users, ChevronDown, ChevronUp, Briefcase, X, Star, ArrowRight } from 'lucide-react';
import { generateMatches, MatchResult, MatchFactor } from '@/data/mockMatching';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';

const LOADING_STEPS = [
  { text: "Scanning your vibe...", duration: 600 },
  { text: "Analyzing 10,000+ potential matches...", duration: 600 },
  { text: "Calculating chemistry levels...", duration: 500 },
  { text: "Checking humor compatibility...", duration: 500 },
  { text: "Consulting the love algorithm...", duration: 400 },
  { text: "Found some great matches! Finalizing...", duration: 400 },
];

const Matches = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipedMatches, setSwipedMatches] = useState<{ match: MatchResult; liked: boolean }[]>([]);
  const [viewMode, setViewMode] = useState<'swipe' | 'grid'>('swipe');

  useEffect(() => {
    const userProfile = localStorage.getItem('matchaUserProfile');
    
    if (!userProfile) {
      toast.error('Please create a profile first');
      navigate('/profile');
      return;
    }

    const totalDuration = LOADING_STEPS.reduce((acc, s) => acc + s.duration, 0);
    const timer = setTimeout(() => {
      const profile = JSON.parse(userProfile);
      const results = generateMatches(profile, 8); // Generate more matches
      setMatches(results);
      setIsLoading(false);
    }, totalDuration + 500);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (currentIndex >= matches.length) return;
    
    const currentMatch = matches[currentIndex];
    const liked = direction === 'right';
    
    setSwipedMatches(prev => [...prev, { match: currentMatch, liked }]);
    
    if (liked) {
      toast.success(`You liked ${currentMatch.profile.name}! 💚`, {
        description: "They'll be added to your matches"
      });
    }
    
    setCurrentIndex(prev => prev + 1);
  };

  const handlePlanDate = (matchId: string) => {
    localStorage.setItem('matchaSelectedMatch', matchId);
    navigate('/date-plan');
  };

  const likedMatches = swipedMatches.filter(m => m.liked);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gradient-hero py-8 px-4 overflow-hidden">
      {/* Header */}
      <motion.div 
        className="max-w-4xl mx-auto mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button 
          variant="ghost" 
          onClick={() => navigate('/profile')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Profile
        </Button>
        
        <div className="flex items-center gap-2 mb-2">
          <motion.div 
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Heart className="w-5 h-5 text-primary-foreground" fill="currentColor" />
          </motion.div>
          <span className="font-display text-2xl font-bold">Matcha</span>
        </div>
        
        <motion.h1 
          className="font-display text-4xl md:text-5xl font-bold mt-6 mb-3"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Your <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Perfect Matches</span>
        </motion.h1>
        <motion.p 
          className="text-lg text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Swipe right to like, left to pass. Find your perfect match!
        </motion.p>

        {/* View Toggle */}
        <motion.div 
          className="flex gap-2 mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button 
            variant={viewMode === 'swipe' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('swipe')}
            className="rounded-full"
          >
            <Heart className="w-4 h-4 mr-2" />
            Swipe Mode
          </Button>
          <Button 
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="rounded-full"
          >
            <Users className="w-4 h-4 mr-2" />
            Grid View
          </Button>
        </motion.div>
      </motion.div>

      {viewMode === 'swipe' ? (
        <div className="max-w-md mx-auto">
          {/* Swipe Counter */}
          <motion.div 
            className="text-center mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-sm text-muted-foreground">
              {currentIndex < matches.length 
                ? `${currentIndex + 1} of ${matches.length} potential matches`
                : `You've seen all ${matches.length} matches!`
              }
            </span>
          </motion.div>

          {/* Swipe Cards Stack */}
          <div className="relative h-[600px] flex items-center justify-center">
            <AnimatePresence>
              {currentIndex < matches.length ? (
                matches.slice(currentIndex, currentIndex + 3).reverse().map((match, idx) => (
                  <SwipeCard
                    key={match.profile.id}
                    match={match}
                    isTop={idx === matches.slice(currentIndex, currentIndex + 3).length - 1}
                    onSwipe={handleSwipe}
                    stackIndex={matches.slice(currentIndex, currentIndex + 3).length - 1 - idx}
                  />
                ))
              ) : (
                <motion.div 
                  className="text-center p-8"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
                  </motion.div>
                  <h3 className="font-display text-2xl font-bold mb-2">All Done!</h3>
                  <p className="text-muted-foreground mb-6">
                    You've swiped through all matches. You liked {likedMatches.length} people!
                  </p>
                  <Button 
                    onClick={() => {
                      setCurrentIndex(0);
                      setSwipedMatches([]);
                      const userProfile = localStorage.getItem('matchaUserProfile');
                      if (userProfile) {
                        const profile = JSON.parse(userProfile);
                        const results = generateMatches(profile, 8);
                        setMatches(results);
                        toast.success("Fresh matches loaded! 🔄");
                      }
                    }}
                    className="bg-gradient-romantic"
                  >
                    Load More Matches
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Swipe Buttons */}
          {currentIndex < matches.length && (
            <motion.div 
              className="flex justify-center gap-6 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.button
                className="w-16 h-16 rounded-full bg-card border-2 border-destructive flex items-center justify-center shadow-lg hover:bg-destructive/10 transition-colors"
                onClick={() => handleSwipe('left')}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-8 h-8 text-destructive" />
              </motion.button>
              <motion.button
                className="w-16 h-16 rounded-full bg-gradient-romantic flex items-center justify-center shadow-glow"
                onClick={() => handleSwipe('right')}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart className="w-8 h-8 text-white" fill="currentColor" />
              </motion.button>
            </motion.div>
          )}

          {/* Liked Matches Preview */}
          {likedMatches.length > 0 && (
            <motion.div 
              className="mt-8 p-4 rounded-2xl bg-card/50 border border-border/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-display font-semibold flex items-center gap-2">
                  <Star className="w-4 h-4 text-primary" />
                  Your Likes ({likedMatches.length})
                </h4>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {likedMatches.map(({ match }, idx) => (
                  <motion.div
                    key={match.profile.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex-shrink-0"
                  >
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary">
                      {match.profile.profileImage ? (
                        <img 
                          src={match.profile.profileImage} 
                          alt={match.profile.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-romantic flex items-center justify-center text-sm font-bold text-white">
                          {match.profile.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        /* Grid View */
        <motion.div 
          className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {(likedMatches.length > 0 ? likedMatches.map(m => m.match) : matches).map((match, index) => (
            <motion.div
              key={match.profile.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <MatchCard 
                match={match}
                rank={index + 1}
                onPlanDate={() => handlePlanDate(match.profile.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Footer */}
      <motion.div 
        className="max-w-4xl mx-auto mt-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-muted-foreground text-sm">
          Not feeling the spark? 
          <button 
            onClick={() => {
              const userProfile = localStorage.getItem('matchaUserProfile');
              if (userProfile) {
                const profile = JSON.parse(userProfile);
                const results = generateMatches(profile, 8);
                setMatches(results);
                setCurrentIndex(0);
                setSwipedMatches([]);
                toast.success("Fresh faces incoming! 🔄");
              }
            }}
            className="text-primary hover:underline ml-1 font-medium"
          >
            Shuffle and try again
          </button>
        </p>
      </motion.div>
    </div>
  );
};

const SwipeCard = ({ 
  match, 
  isTop,
  onSwipe,
  stackIndex
}: { 
  match: MatchResult;
  isTop: boolean;
  onSwipe: (direction: 'left' | 'right') => void;
  stackIndex: number;
}) => {
  const { profile, compatibilityScore, reasoning, commonValues, distanceMiles, personaMatch } = match;
  
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);
  
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 100) {
      onSwipe('right');
    } else if (info.offset.x < -100) {
      onSwipe('left');
    }
  };

  return (
    <motion.div
      className="absolute w-full max-w-sm"
      style={{ 
        x: isTop ? x : 0, 
        rotate: isTop ? rotate : 0,
        scale: 1 - stackIndex * 0.05,
        y: stackIndex * 8,
        zIndex: 10 - stackIndex
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1 - stackIndex * 0.05, y: stackIndex * 8 }}
      exit={{ 
        x: x.get() > 0 ? 300 : -300, 
        opacity: 0,
        transition: { duration: 0.3 }
      }}
      whileHover={isTop ? { scale: 1.02 } : {}}
    >
      <Card className="overflow-hidden border border-border/50 bg-card/95 backdrop-blur shadow-2xl cursor-grab active:cursor-grabbing">
        {/* Like/Nope Overlays */}
        <motion.div 
          className="absolute top-8 right-8 z-20 px-4 py-2 rounded-lg bg-primary border-4 border-primary font-bold text-xl text-primary-foreground rotate-12"
          style={{ opacity: likeOpacity }}
        >
          LIKE 💚
        </motion.div>
        <motion.div 
          className="absolute top-8 left-8 z-20 px-4 py-2 rounded-lg bg-destructive border-4 border-destructive font-bold text-xl text-white -rotate-12"
          style={{ opacity: nopeOpacity }}
        >
          NOPE ✕
        </motion.div>

        {/* Profile Image */}
        <div className="relative h-80 overflow-hidden">
          {profile.profileImage ? (
            <motion.img 
              src={profile.profileImage} 
              alt={profile.name}
              className="w-full h-full object-cover"
              layoutId={`image-${profile.id}`}
            />
          ) : (
            <div className="w-full h-full bg-gradient-romantic flex items-center justify-center">
              <span className="text-8xl font-display font-bold text-primary-foreground/50">
                {profile.name.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          
          {/* Score Badge */}
          <motion.div 
            className="absolute top-3 right-3 px-4 py-2 rounded-xl font-display text-2xl font-bold bg-gradient-romantic text-white shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            {compatibilityScore}%
          </motion.div>
        </div>
        
        <div className="p-5">
          {/* Name and Info */}
          <div className="mb-3">
            <h3 className="font-display text-2xl font-bold">{profile.name}, {profile.age}</h3>
            <div className="flex items-center gap-3 text-muted-foreground text-sm mt-1">
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5" />
                {profile.job}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {distanceMiles.toFixed(1)} mi
              </span>
            </div>
          </div>

          {/* Why You Match */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-3 mb-3 border border-primary/20">
            <div className="flex items-center gap-2 text-primary text-xs font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Why You Match
            </div>
            <p className="text-sm text-foreground leading-relaxed line-clamp-2">
              {reasoning}
            </p>
          </div>

          {/* Common Values */}
          <div className="flex flex-wrap gap-1.5">
            {commonValues.slice(0, 4).map((value, idx) => (
              <motion.div
                key={value}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
              >
                <Badge variant="outline" className="text-xs capitalize">
                  {value}
                </Badge>
              </motion.div>
            ))}
            {commonValues.length > 4 && (
              <Badge variant="secondary" className="text-xs">
                +{commonValues.length - 4} more
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const MatchCard = ({ 
  match, 
  rank, 
  onPlanDate 
}: { 
  match: MatchResult; 
  rank: number;
  onPlanDate: () => void;
}) => {
  const { profile, compatibilityScore, reasoning, commonValues, distanceMiles, personaMatch, matchFactors } = match;
  const [showFactors, setShowFactors] = useState(false);
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-gradient-to-r from-primary to-secondary text-primary-foreground';
    if (score >= 75) return 'bg-gradient-to-r from-amber-400 to-orange-500 text-white';
    return 'bg-muted text-muted-foreground';
  };

  const getRankBadge = (r: number) => {
    if (r === 1) return { label: 'Top Match', color: 'bg-gradient-to-r from-amber-400 to-yellow-500' };
    if (r === 2) return { label: '2nd Best', color: 'bg-gradient-to-r from-slate-300 to-slate-400' };
    if (r === 3) return { label: '3rd Pick', color: 'bg-gradient-to-r from-amber-600 to-orange-700' };
    return { label: `#${r}`, color: 'bg-muted' };
  };

  const rankBadge = getRankBadge(rank);

  return (
    <Card className="overflow-hidden border border-border/50 hover:border-primary/30 transition-all hover:shadow-xl group relative bg-card/90 backdrop-blur">
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      />
      
      {/* Profile Image */}
      <div className="relative h-64 overflow-hidden">
        {profile.profileImage ? (
          <motion.img 
            src={profile.profileImage} 
            alt={profile.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-romantic flex items-center justify-center">
            <span className="text-6xl font-display font-bold text-primary-foreground/50">
              {profile.name.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        
        {/* Rank Badge */}
        <motion.div 
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white ${rankBadge.color}`}
          whileHover={{ scale: 1.1 }}
        >
          {rankBadge.label}
        </motion.div>
        
        {/* Score Badge */}
        <motion.div 
          className={`absolute top-3 right-3 px-3 py-2 rounded-xl font-display text-2xl font-bold ${getScoreColor(compatibilityScore)} shadow-lg`}
          whileHover={{ scale: 1.1 }}
        >
          {compatibilityScore}%
        </motion.div>
      </div>
      
      <div className="p-5 relative">
        {/* Name and Info */}
        <div className="mb-4">
          <h3 className="font-display text-2xl font-bold">{profile.name}, {profile.age}</h3>
          <div className="flex items-center gap-3 text-muted-foreground text-sm mt-1">
            <span className="flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5" />
              {profile.job}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {distanceMiles.toFixed(1)} mi
            </span>
          </div>
        </div>

        {/* Why You Match */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 mb-4 border border-primary/20">
          <div className="flex items-center gap-2 text-primary text-xs font-semibold mb-2">
            <Sparkles className="w-4 h-4" />
            Why You Match
          </div>
          <p className="text-sm text-foreground leading-relaxed">
            {reasoning}
          </p>
        </div>

        {/* Persona Match Badge */}
        {personaMatch && (
          <motion.div 
            className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-muted/50 border border-border/50"
            whileHover={{ scale: 1.02 }}
          >
            <Users className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium">{personaMatch.matchType}</span>
            <Badge variant="secondary" className="text-xs ml-auto">
              +{personaMatch.bonus} chemistry
            </Badge>
          </motion.div>
        )}

        {/* Match Factors Breakdown */}
        <motion.button 
          onClick={() => setShowFactors(!showFactors)}
          className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors mb-4 text-sm"
          whileTap={{ scale: 0.98 }}
        >
          <span className="font-medium flex items-center gap-2">
            Compatibility Breakdown
          </span>
          <motion.div
            animate={{ rotate: showFactors ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {showFactors && matchFactors && (
            <motion.div 
              className="space-y-3 mb-4 p-4 rounded-xl bg-muted/30 border border-border/50"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {matchFactors.map((factor, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <MatchFactorBar factor={factor} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Common Values */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {commonValues.map((value, idx) => (
            <motion.div
              key={value}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Badge variant="outline" className="text-xs capitalize">
                {value}
              </Badge>
            </motion.div>
          ))}
        </div>

        {/* Action Button */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground font-semibold"
            onClick={onPlanDate}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Plan a Date
          </Button>
        </motion.div>
      </div>
    </Card>
  );
};

const MatchFactorBar = ({ factor }: { factor: MatchFactor }) => {
  const percentage = (factor.score / factor.maxScore) * 100;
  
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2">
          <span>{factor.icon}</span>
          <span className="font-medium">{factor.name}</span>
        </span>
        <span className="text-muted-foreground">{factor.score}/{factor.maxScore}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-romantic rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <p className="text-xs text-muted-foreground italic">{factor.description}</p>
    </div>
  );
};

const LoadingState = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let elapsed = 0;
    const totalDuration = LOADING_STEPS.reduce((acc, s) => acc + s.duration, 0);
    
    const interval = setInterval(() => {
      elapsed += 50;
      setProgress((elapsed / totalDuration) * 100);
      
      let cumulative = 0;
      for (let i = 0; i < LOADING_STEPS.length; i++) {
        cumulative += LOADING_STEPS[i].duration;
        if (elapsed < cumulative) {
          setCurrentStep(i);
          break;
        }
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
      <motion.div 
        className="text-center max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative w-32 h-32 mx-auto mb-8">
          <motion.div 
            className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary opacity-20"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div 
            className="absolute inset-4 rounded-full bg-gradient-to-r from-primary to-secondary opacity-30"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div 
            className="absolute inset-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-xl"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Heart className="w-10 h-10 text-primary-foreground" fill="currentColor" />
          </motion.div>
        </div>
        
        <motion.h2 
          className="font-display text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Finding Your Perfect Matches
        </motion.h2>
        
        <div className="h-8 mb-4">
          <AnimatePresence mode="wait">
            <motion.p 
              key={currentStep}
              className="text-muted-foreground"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {LOADING_STEPS[currentStep]?.text}
            </motion.p>
          </AnimatePresence>
        </div>
        
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
        
        <motion.p 
          className="text-xs text-muted-foreground mt-4"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Good things take time... unlike microwave meals 🍿
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Matches;