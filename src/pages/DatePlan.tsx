import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, ArrowLeft, MapPin, Clock, Coffee, Utensils, TreePine, IceCream2, Palette, Copy, Check, Lightbulb, MessageCircle } from 'lucide-react';
import { getProfileById } from '@/data/mockProfiles';
import { generateDatePlan, DatePlan } from '@/data/mockMatching';
import { toast } from 'sonner';

const DatePlanPage = () => {
  const navigate = useNavigate();
  const [datePlan, setDatePlan] = useState<DatePlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    const userProfile = localStorage.getItem('matchaUserProfile');
    const matchId = localStorage.getItem('matchaSelectedMatch');

    if (!userProfile || !matchId) {
      toast.error('Please select a match first');
      navigate('/matches');
      return;
    }

    const timer = setTimeout(() => {
      const user = JSON.parse(userProfile);
      const match = getProfileById(matchId);
      
      if (!match) {
        toast.error('Match not found');
        navigate('/matches');
        return;
      }

      const plan = generateDatePlan(user, match);
      setDatePlan(plan);
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getActivityIcon = (icon: string) => {
    switch (icon) {
      case 'coffee': return <Coffee className="w-5 h-5" />;
      case 'utensils': return <Utensils className="w-5 h-5" />;
      case 'trees': return <TreePine className="w-5 h-5" />;
      case 'ice-cream': return <IceCream2 className="w-5 h-5" />;
      case 'palette': return <Palette className="w-5 h-5" />;
      default: return <MapPin className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!datePlan) return null;

  return (
    <div className="min-h-screen bg-gradient-hero py-8 px-4">
      {/* Header */}
      <div className="max-w-3xl mx-auto mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/matches')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Matches
        </Button>
        
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Heart className="w-4 h-4 text-primary-foreground" fill="currentColor" />
          </div>
          <span className="font-display text-xl font-bold">MATCHA</span>
        </div>
        
        <h1 className="font-display text-3xl md:text-4xl font-bold mt-4 mb-2">
          Your Perfect Date with {datePlan.matchName}
        </h1>
        <p className="text-muted-foreground">
          AI has crafted a personalized date plan just for you two
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Restaurant Card */}
        <Card className="border-border/50 overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6">
            <Badge className="mb-3 bg-primary/20 text-primary hover:bg-primary/20">Featured Restaurant</Badge>
            <h2 className="font-display text-2xl font-bold mb-2">{datePlan.restaurant.name}</h2>
            <p className="text-muted-foreground mb-4">{datePlan.restaurant.cuisine}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                {datePlan.restaurant.location}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                ✨ {datePlan.restaurant.vibe}
              </div>
            </div>
          </div>
        </Card>

        {/* Timeline */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Date Itinerary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
              
              <div className="space-y-6">
                {datePlan.itinerary.map((item, index) => (
                  <div key={index} className="relative flex gap-4">
                    <div className="relative z-10 w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      {getActivityIcon(item.icon)}
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex items-center gap-3 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {item.time}
                        </Badge>
                      </div>
                      <h4 className="font-medium mb-1">{item.activity}</h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {item.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conversation Starters */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Conversation Starters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {datePlan.conversationStarters.map((starter, index) => (
              <div 
                key={index}
                className="group flex items-start gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-display font-bold">
                  {index + 1}
                </div>
                <p className="flex-1 text-sm pt-1">{starter}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  onClick={() => copyToClipboard(starter, index)}
                >
                  {copiedIndex === index ? (
                    <Check className="w-4 h-4 text-primary" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="border-border/50 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2 text-primary">
              <Lightbulb className="w-5 h-5" />
              Pro Tips from AI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {datePlan.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-primary">💚</span>
                  <span className="text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button 
            className="flex-1"
            size="lg"
            onClick={() => toast.success('Date saved! Good luck! 💚')}
          >
            <Heart className="w-4 h-4 mr-2" />
            Save This Date Plan
          </Button>
          <Button 
            variant="outline"
            size="lg"
            onClick={() => navigate('/matches')}
            className="flex-1"
          >
            View Other Matches
          </Button>
        </div>
      </div>
    </div>
  );
};

const LoadingState = () => (
  <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
    <div className="text-center">
      <div className="relative w-32 h-32 mx-auto mb-8">
        <div className="absolute inset-0 rounded-full bg-secondary/20 animate-ping" />
        <div className="absolute inset-4 rounded-full bg-secondary/40 animate-ping" style={{ animationDelay: '0.2s' }} />
        <div className="absolute inset-8 rounded-full bg-secondary flex items-center justify-center">
          <Heart className="w-8 h-8 text-secondary-foreground animate-pulse" fill="currentColor" />
        </div>
      </div>
      <h2 className="font-display text-2xl font-bold mb-2">Planning Your Perfect Date</h2>
      <p className="text-muted-foreground">AI is curating restaurants, activities, and conversation starters...</p>
    </div>
  </div>
);

export default DatePlanPage;
