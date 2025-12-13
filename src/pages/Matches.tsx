import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Sparkles, Calendar, ArrowLeft, Users, ChevronDown, ChevronUp, Briefcase, X, Star, ArrowRight, Clock, Loader2 } from 'lucide-react';
import { generateMatches, MatchResult, MatchFactor } from '@/data/mockMatching';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { MatchingAnimation } from '@/components/MatchingAnimation';

interface SavedDatePlan {
  id: string;
  matchId: string;
  matchName: string;
  matchImage?: string;
  planTitle: string;
  planTheme: string;
  city: string;
  savedAt: string;
  timeline: { venue: string; time: string }[];
}

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
  const [viewMode, setViewMode] = useState<'swipe' | 'grid' | 'saved'>('swipe');
  const [savedDates, setSavedDates] = useState<SavedDatePlan[]>([]);
  
  // Matching animation state
  const [showMatchingAnimation, setShowMatchingAnimation] = useState(false);
  const [pendingMatchId, setPendingMatchId] = useState<string | null>(null);
  const [userName, setUserName] = useState('You');
  const [userImage, setUserImage] = useState<string | undefined>();

  useEffect(() => {
    const userProfile = localStorage.getItem('matchaUserProfile');
    
    if (!userProfile) {
      toast.error('Please create a profile first');
      navigate('/profile');
      return;
    }

    const profile = JSON.parse(userProfile);
    setUserName(profile.name || 'You');
    setUserImage(profile.profileImage);

    // Load saved dates
    const saved = localStorage.getItem('matchaSavedDates');
    if (saved) {
      setSavedDates(JSON.parse(saved));
    }

    const totalDuration = LOADING_STEPS.reduce((acc, s) => acc + s.duration, 0);
    const timer = setTimeout(() => {
      const results = generateMatches(profile, 8);
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
    // Show matching animation first
    setPendingMatchId(matchId);
    setShowMatchingAnimation(true);
  };

  const handleMatchingComplete = () => {
    setShowMatchingAnimation(false);
    if (pendingMatchId) {
      localStorage.setItem('matchaSelectedMatch', pendingMatchId);
      navigate('/date-plan');
    }
  };

  const likedMatches = swipedMatches.filter(m => m.liked);
  const pendingMatch = matches.find(m => m.profile.id === pendingMatchId);

  if (showMatchingAnimation && pendingMatch) {
    return (
      <MatchingAnimation
        userName={userName}
        partnerName={pendingMatch.profile.name}
        userImage={userImage}
        partnerImage={pendingMatch.profile.profileImage}
        onComplete={handleMatchingComplete}
      />
    );
  }

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
          <Button 
            variant={viewMode === 'saved' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('saved')}
            className="rounded-full"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Saved Dates {savedDates.length > 0 && `(${savedDates.length})`}
          </Button>
        </motion.div>
      </motion.div>

      {viewMode === 'saved' ? (
        <SavedDatesView savedDates={savedDates} setSavedDates={setSavedDates} />
      ) : viewMode === 'swipe' ? (
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
                    onPlanDate={() => handlePlanDate(match.profile.id)}
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
                    className="flex-shrink-0 cursor-pointer"
                    onClick={() => handlePlanDate(match.profile.id)}
                  >
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary hover:scale-110 transition-transform">
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

const SavedDatesView = ({ 
  savedDates, 
  setSavedDates 
}: { 
  savedDates: SavedDatePlan[];
  setSavedDates: React.Dispatch<React.SetStateAction<SavedDatePlan[]>>;
}) => {
  const navigate = useNavigate();

  const handleDelete = (id: string) => {
    const updated = savedDates.filter(d => d.id !== id);
    setSavedDates(updated);
    localStorage.setItem('matchaSavedDates', JSON.stringify(updated));
    toast.success('Date plan removed');
  };

  const handleViewPlan = (date: SavedDatePlan) => {
    localStorage.setItem('matchaSelectedMatch', date.matchId);
    navigate('/date-plan');
  };

  if (savedDates.length === 0) {
    return (
      <motion.div 
        className="max-w-md mx-auto text-center py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-display text-2xl font-bold mb-2">No Saved Dates Yet</h3>
        <p className="text-muted-foreground mb-6">
          When you plan dates with your matches, they'll appear here!
        </p>
        <Button 
          onClick={() => {}}
          variant="outline"
        >
          Start Matching
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {savedDates.map((date, index) => (
        <motion.div
          key={date.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="overflow-hidden border border-border/50 hover:border-primary/50 transition-colors">
            <div className="p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary">
                  {date.matchImage ? (
                    <img 
                      src={date.matchImage} 
                      alt={date.matchName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-romantic flex items-center justify-center text-lg font-bold text-white">
                      {date.matchName.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-bold">Date with {date.matchName}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {date.city}
                  </p>
                </div>
                <Badge className="bg-gradient-romantic text-primary-foreground">{date.planTheme}</Badge>
              </div>

              <div className="bg-muted/50 rounded-lg p-3 mb-4">
                <h4 className="font-semibold text-sm mb-2">{date.planTitle}</h4>
                <div className="space-y-1">
                  {date.timeline.slice(0, 2).map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{item.time}</span>
                      <span>—</span>
                      <span className="truncate">{item.venue}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Saved {new Date(date.savedAt).toLocaleDateString()}
                </span>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDelete(date.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleViewPlan(date)}
                    className="bg-gradient-romantic"
                  >
                    View Plan
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

const SwipeCard = ({ 
  match, 
  isTop,
  onSwipe,
  stackIndex,
  onPlanDate
}: { 
  match: MatchResult;
  isTop: boolean;
  onSwipe: (direction: 'left' | 'right') => void;
  stackIndex: number;
  onPlanDate: () => void;
}) => {
  const { profile, compatibilityScore, reasoning, commonValues, distanceMiles, personaMatch, zodiacCompatibility } = match;
  
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
            <p className="text-sm line-clamp-2">{reasoning}</p>
          </div>

          {/* Zodiac Compatibility */}
          {zodiacCompatibility && (
            <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-love-gold/10 border border-love-gold/20">
              <Star className="w-4 h-4 text-love-gold" />
              <span className="text-xs font-medium">{zodiacCompatibility.matchSign}</span>
              <span className="text-xs text-muted-foreground">— {zodiacCompatibility.prediction.slice(0, 50)}...</span>
            </div>
          )}

          {/* Common Values */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {commonValues.slice(0, 4).map((value, i) => (
              <Badge key={i} variant="secondary" className="text-xs rounded-full">
                {value}
              </Badge>
            ))}
          </div>

          {/* Plan Date Button */}
          <Button 
            className="w-full bg-gradient-romantic shadow-glow"
            onClick={(e) => {
              e.stopPropagation();
              onPlanDate();
            }}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Plan a Date
          </Button>
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
  const [expanded, setExpanded] = useState(false);
  const { profile, compatibilityScore, reasoning, matchFactors, commonValues, distanceMiles, personaMatch, zodiacCompatibility } = match;

  return (
    <motion.div layout>
      <Card className="overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
        {/* Profile Header */}
        <div className="relative h-48 overflow-hidden">
          {profile.profileImage ? (
            <img 
              src={profile.profileImage} 
              alt={profile.name}
              className="w-full h-full object-cover"
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
          <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-gradient-romantic flex items-center justify-center font-display font-bold text-sm text-primary-foreground shadow-lg">
            #{rank}
          </div>
          
          {/* Score */}
          <motion.div 
            className="absolute top-3 right-3 px-3 py-1.5 rounded-xl font-display text-xl font-bold bg-card/90 backdrop-blur text-primary shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 * rank, type: "spring" }}
          >
            {compatibilityScore}%
          </motion.div>
        </div>

        <div className="p-4">
          {/* Name and Basic Info */}
          <div className="mb-3">
            <h3 className="font-display text-xl font-bold">{profile.name}, {profile.age}</h3>
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
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-3 mb-4 border border-primary/20">
            <div className="flex items-center gap-2 text-primary text-xs font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Why You Match
            </div>
            <p className="text-sm">{reasoning}</p>
          </div>

          {/* Common Values */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {commonValues.slice(0, 4).map((value, i) => (
              <Badge key={i} variant="secondary" className="text-xs rounded-full">
                {value}
              </Badge>
            ))}
          </div>

          {/* Expandable Details */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                {/* Zodiac Section */}
                {zodiacCompatibility && (
                  <div className="mb-4 p-3 rounded-xl bg-love-gold/10 border border-love-gold/20">
                    <div className="flex items-center gap-2 text-love-gold text-xs font-semibold mb-2">
                      <Star className="w-3.5 h-3.5" />
                      Zodiac Insight: {zodiacCompatibility.matchSign}
                    </div>
                    <p className="text-sm text-muted-foreground">{zodiacCompatibility.prediction}</p>
                  </div>
                )}

                {/* Compatibility Factors */}
                <div className="space-y-2 mb-4">
                  {matchFactors.slice(0, 3).map((factor, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{factor.name}</span>
                        <span className="font-medium">{factor.score}%</span>
                      </div>
                      <Progress value={factor.score} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expand Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setExpanded(!expanded)}
            className="w-full mb-3 text-xs"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                Show More
              </>
            )}
          </Button>

          {/* Plan Date Button */}
          <Button 
            className="w-full bg-gradient-romantic shadow-glow"
            onClick={onPlanDate}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Plan a Date
          </Button>
        </div>
      </Card>
    </motion.div>
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
      
      let accumulatedTime = 0;
      for (let i = 0; i < LOADING_STEPS.length; i++) {
        accumulatedTime += LOADING_STEPS[i].duration;
        if (elapsed < accumulatedTime) {
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
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Animated Logo */}
        <motion.div 
          className="relative w-32 h-32 mx-auto mb-8"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
          <div className="absolute inset-4 rounded-full bg-primary/30 animate-ping" style={{ animationDelay: '0.3s' }} />
          <div className="absolute inset-8 rounded-full bg-gradient-romantic flex items-center justify-center shadow-glow">
            <Heart className="w-8 h-8 text-primary-foreground" fill="currentColor" />
          </div>
        </motion.div>

        <h2 className="font-display text-2xl font-bold mb-4">Finding Your Matches</h2>
        
        {/* Loading Text */}
        <AnimatePresence mode="wait">
          <motion.p
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-muted-foreground mb-6 h-6"
          >
            {LOADING_STEPS[currentStep]?.text}
          </motion.p>
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="w-full max-w-xs mx-auto">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">{Math.round(progress)}% complete</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Matches;
