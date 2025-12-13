import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Sparkles, Calendar, ArrowLeft, Users, ChevronDown, ChevronUp, Briefcase } from 'lucide-react';
import { generateMatches, MatchResult, MatchFactor } from '@/data/mockMatching';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

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
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);

  useEffect(() => {
    const userProfile = localStorage.getItem('matchaUserProfile');
    
    if (!userProfile) {
      toast.error('Please create a profile first');
      navigate('/profile');
      return;
    }

    // Simulate AI analysis
    const totalDuration = LOADING_STEPS.reduce((acc, s) => acc + s.duration, 0);
    const timer = setTimeout(() => {
      const profile = JSON.parse(userProfile);
      const results = generateMatches(profile, 3);
      setMatches(results);
      setIsLoading(false);
    }, totalDuration + 500);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handlePlanDate = (matchId: string) => {
    setSelectedMatch(matchId);
    localStorage.setItem('matchaSelectedMatch', matchId);
    navigate('/date-plan');
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gradient-hero py-8 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/profile')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Profile
        </Button>
        
        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
            <Heart className="w-5 h-5 text-primary-foreground animate-pulse" fill="currentColor" />
          </div>
          <span className="font-display text-2xl font-bold">Matcha</span>
        </div>
        
        <h1 className="font-display text-4xl md:text-5xl font-bold mt-6 mb-3">
          Your <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Perfect Matches</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          We've crunched the numbers, analyzed the vibes, and found your top picks! 
        </p>
        <p className="text-sm text-muted-foreground mt-1 italic">
          (No pressure, but statistically speaking, one of these could be "the one" 👀)
        </p>
      </div>

      {/* Match Cards */}
      <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {matches.map((match, index) => (
          <MatchCard 
            key={match.profile.id}
            match={match}
            rank={index + 1}
            onPlanDate={() => handlePlanDate(match.profile.id)}
          />
        ))}
      </div>

      {/* Fun footer */}
      <div className="max-w-4xl mx-auto mt-12 text-center">
        <p className="text-muted-foreground text-sm">
          Not feeling the spark? No worries! 
          <button 
            onClick={() => {
              const userProfile = localStorage.getItem('matchaUserProfile');
              if (userProfile) {
                const profile = JSON.parse(userProfile);
                const results = generateMatches(profile, 3);
                setMatches(results);
                toast.success("Fresh faces incoming! 🔄");
              }
            }}
            className="text-primary hover:underline ml-1 font-medium"
          >
            Shuffle and try again
          </button>
        </p>
      </div>
    </div>
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
    return { label: '3rd Pick', color: 'bg-gradient-to-r from-amber-600 to-orange-700' };
  };

  const rankBadge = getRankBadge(rank);

  return (
    <Card className="overflow-hidden border border-border/50 hover:border-primary/30 transition-all hover:shadow-xl group relative bg-card/90 backdrop-blur">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Profile Image */}
      <div className="relative h-64 overflow-hidden">
        {profile.profileImage ? (
          <img 
            src={profile.profileImage} 
            alt={profile.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white ${rankBadge.color}`}>
          {rankBadge.label}
        </div>
        
        {/* Score Badge */}
        <div className={`absolute top-3 right-3 px-3 py-2 rounded-xl font-display text-2xl font-bold ${getScoreColor(compatibilityScore)} shadow-lg`}>
          {compatibilityScore}%
        </div>
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

        {/* Why You Match - Prominent Reasoning Section */}
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
          <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-muted/50 border border-border/50">
            <Users className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium">{personaMatch.matchType}</span>
            <Badge variant="secondary" className="text-xs ml-auto">
              +{personaMatch.bonus} chemistry
            </Badge>
          </div>
        )}

        {/* Match Factors Breakdown */}
        <button 
          onClick={() => setShowFactors(!showFactors)}
          className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors mb-4 text-sm"
        >
          <span className="font-medium flex items-center gap-2">
            Compatibility Breakdown
          </span>
          {showFactors ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showFactors && matchFactors && (
          <div className="space-y-3 mb-4 p-4 rounded-xl bg-muted/30 border border-border/50">
            {matchFactors.map((factor, i) => (
              <MatchFactorBar key={i} factor={factor} />
            ))}
          </div>
        )}

        {/* Common Values */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {commonValues.map(value => (
            <Badge key={value} variant="outline" className="text-xs capitalize">
              {value}
            </Badge>
          ))}
        </div>

        {/* Action Button */}
        <Button 
          className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground font-semibold"
          onClick={onPlanDate}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Plan a Date
        </Button>
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
      <Progress value={percentage} className="h-2" />
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
      <div className="text-center max-w-md w-full">
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary opacity-20 animate-ping" />
          <div className="absolute inset-4 rounded-full bg-gradient-to-r from-primary to-secondary opacity-30 animate-ping" style={{ animationDelay: '0.2s' }} />
          <div className="absolute inset-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-xl">
            <Heart className="w-10 h-10 text-primary-foreground animate-pulse" fill="currentColor" />
          </div>
        </div>
        
        <h2 className="font-display text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Finding Your Perfect Matches
        </h2>
        
        <div className="h-8 mb-4">
          <p className="text-muted-foreground animate-pulse">
            {LOADING_STEPS[currentStep]?.text}
          </p>
        </div>
        
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-100 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="text-xs text-muted-foreground mt-4">
          Good things take time... unlike microwave meals 🍿
        </p>
      </div>
    </div>
  );
};

export default Matches;