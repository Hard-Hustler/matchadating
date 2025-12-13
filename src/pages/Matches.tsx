import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Sparkles, Calendar, ArrowLeft } from 'lucide-react';
import { generateMatches, MatchResult } from '@/data/mockMatching';
import { toast } from 'sonner';

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
    const timer = setTimeout(() => {
      const profile = JSON.parse(userProfile);
      const results = generateMatches(profile, 3);
      setMatches(results);
      setIsLoading(false);
    }, 2500);

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
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Heart className="w-4 h-4 text-primary-foreground" fill="currentColor" />
          </div>
          <span className="font-display text-xl font-bold">MATCHA</span>
        </div>
        
        <h1 className="font-display text-3xl md:text-4xl font-bold mt-4 mb-2">
          Your Top Matches
        </h1>
        <p className="text-muted-foreground">
          AI has analyzed compatibility across personality, values, and interests
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
  const { profile, compatibilityScore, reasoning, commonValues, distanceMiles } = match;
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-primary text-primary-foreground';
    if (score >= 75) return 'bg-yellow-500 text-white';
    return 'bg-muted text-muted-foreground';
  };

  const getInitials = (name: string) => name.slice(0, 2).toUpperCase();

  return (
    <Card className="overflow-hidden border-border/50 hover:border-primary/30 transition-all hover:shadow-soft group">
      <div className="p-6">
        {/* Header with avatar and score */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-display text-xl font-bold shadow-soft">
              {getInitials(profile.name)}
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold">{profile.name}, {profile.age}</h3>
              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <MapPin className="w-3 h-3" />
                {profile.location}
                <span className="text-xs">• {distanceMiles.toFixed(1)} mi</span>
              </div>
            </div>
          </div>
          <div className={`px-3 py-2 rounded-xl font-display text-2xl font-bold ${getScoreColor(compatibilityScore)}`}>
            {compatibilityScore}%
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {profile.bio}
        </p>

        {/* AI Reasoning */}
        <div className="bg-primary/5 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 text-primary text-xs font-medium mb-2">
            <Sparkles className="w-3 h-3" />
            AI Compatibility Insight
          </div>
          <p className="text-sm italic text-foreground/80">
            "{reasoning}"
          </p>
        </div>

        {/* Common Values */}
        <div className="flex flex-wrap gap-2 mb-4">
          {commonValues.map(value => (
            <Badge key={value} variant="secondary" className="bg-accent/50 text-accent-foreground">
              {value}
            </Badge>
          ))}
        </div>

        {/* Action Button */}
        <Button 
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          variant="outline"
          onClick={onPlanDate}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Plan a Date
        </Button>
      </div>
    </Card>
  );
};

const LoadingState = () => (
  <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
    <div className="text-center">
      <div className="relative w-32 h-32 mx-auto mb-8">
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
        <div className="absolute inset-4 rounded-full bg-primary/40 animate-ping" style={{ animationDelay: '0.2s' }} />
        <div className="absolute inset-8 rounded-full bg-primary flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-primary-foreground animate-pulse" />
        </div>
      </div>
      <h2 className="font-display text-2xl font-bold mb-2">Finding Your Perfect Matches</h2>
      <p className="text-muted-foreground">AI is analyzing personality, values, and compatibility...</p>
    </div>
  </div>
);

export default Matches;
