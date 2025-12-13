import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Sparkles, Calendar, ArrowLeft, Users } from 'lucide-react';
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
            <Heart className="w-5 h-5 text-primary-foreground animate-pulse" fill="currentColor" />
          </div>
          <span className="font-display text-2xl font-bold">Matcha</span>
        </div>
        
        <h1 className="font-display text-4xl md:text-5xl font-bold mt-6 mb-3">
          Your <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Perfect Matches</span> 💘
        </h1>
        <p className="text-lg text-muted-foreground">
          AI has analyzed personality, values, interests, and emotional connection
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
  const { profile, compatibilityScore, reasoning, commonValues, distanceMiles, personaMatch } = match;
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-primary text-primary-foreground';
    if (score >= 75) return 'bg-yellow-500 text-white';
    return 'bg-muted text-muted-foreground';
  };

  const getInitials = (name: string) => name.slice(0, 2).toUpperCase();
  
  const getPersonaBonusLabel = (bonus: number) => {
    if (bonus >= 10) return { label: 'Perfect Match', color: 'bg-primary text-primary-foreground' };
    if (bonus >= 7) return { label: 'Great Match', color: 'bg-green-500 text-white' };
    return { label: 'Compatible', color: 'bg-muted text-muted-foreground' };
  };

  return (
    <Card className="overflow-hidden border-2 border-transparent hover:border-primary/30 transition-all hover:shadow-xl group relative bg-card/80 backdrop-blur">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="p-6 relative">
        {/* Header with avatar and score */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-primary to-secondary rounded-2xl blur opacity-50 group-hover:opacity-70 transition-opacity" />
              <div className="relative w-18 h-18 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-display text-xl font-bold shadow-lg" style={{ width: '72px', height: '72px' }}>
                {getInitials(profile.name)}
              </div>
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold">{profile.name}, {profile.age}</h3>
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-1">
                <MapPin className="w-4 h-4" />
                {profile.location}
                <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{distanceMiles.toFixed(1)} mi</span>
              </div>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-2xl font-display text-3xl font-bold ${getScoreColor(compatibilityScore)} shadow-lg`}>
            {compatibilityScore}%
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {profile.bio}
        </p>

        {/* Persona Match Badge */}
        {personaMatch && (
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{personaMatch.matchType}</span>
            <Badge className={`text-xs ${getPersonaBonusLabel(personaMatch.bonus).color}`}>
              {getPersonaBonusLabel(personaMatch.bonus).label}
            </Badge>
          </div>
        )}

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
      <div className="relative w-40 h-40 mx-auto mb-10">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary opacity-20 animate-ping" />
        <div className="absolute inset-4 rounded-full bg-gradient-to-r from-primary to-secondary opacity-30 animate-ping" style={{ animationDelay: '0.2s' }} />
        <div className="absolute inset-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-xl">
          <Heart className="w-12 h-12 text-primary-foreground animate-pulse" fill="currentColor" />
        </div>
      </div>
      <h2 className="font-display text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Finding Your Perfect Matches</h2>
      <p className="text-lg text-muted-foreground">AI is analyzing personality, values, and emotional compatibility...</p>
      <p className="text-sm text-muted-foreground mt-2">✨ This is where magic happens</p>
    </div>
  </div>
);

export default Matches;
