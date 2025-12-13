import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Heart, ArrowLeft, MapPin, Clock, Copy, Check, Sparkles, 
  Calendar, DollarSign, Zap, Coffee, Star, AlertTriangle,
  MessageCircle, Shield, ExternalLink, Loader2, RefreshCw, ImageIcon
} from 'lucide-react';
import { getProfileById } from '@/data/mockProfiles';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { MatchingAnimation } from '@/components/MatchingAnimation';

interface TimelineItem {
  time: string;
  activity: string;
  venue: string;
  description: string;
  mapsQuery: string;
}

interface DatePlanOption {
  id: number;
  title: string;
  theme: string;
  timeline: TimelineItem[];
  whyItFits: string;
  backupPlan: string;
  exitStrategy: string;
  estimatedCost: string;
}

interface InviteMessage {
  tone: string;
  message: string;
}

interface DatePlanResponse {
  plans: DatePlanOption[];
  inviteMessages: InviteMessage[];
  astrologyVerdict: string | null;
}

const LOADING_MESSAGES = [
  "Calculating awkward silence probability...",
  "Consulting the dating gods...",
  "Finding venues that wont bankrupt you...",
  "Analyzing vibe compatibility...",
  "Searching for non-cringe conversation starters...",
  "Checking if Mercury is in retrograde...",
  "Optimizing romantic potential...",
  "Filtering out red flag activities...",
  "Generating backup excuses...",
  "Almost there, dont panic...",
];

const DatePlanPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'matching' | 'input' | 'loading' | 'results'>('input');
  const [showMatchingAnimation, setShowMatchingAnimation] = useState(false);
  const [datePlans, setDatePlans] = useState<DatePlanResponse | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<number>(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [venueImages, setVenueImages] = useState<Record<string, string>>({});

  // Form state
  const [city, setCity] = useState('San Francisco');
  const [timeWindow, setTimeWindow] = useState('Saturday Night');
  const [occasion, setOccasion] = useState('First Date');
  const [vibe, setVibe] = useState('Romantic');
  const [budget, setBudget] = useState('$$');
  const [userLoves, setUserLoves] = useState('');
  const [userHates, setUserHates] = useState('');
  const [partnerLoves, setPartnerLoves] = useState('');
  const [partnerHates, setPartnerHates] = useState('');
  const [lastWords, setLastWords] = useState('');
  const [useAstrology, setUseAstrology] = useState(false);
  const [userBirthDate, setUserBirthDate] = useState('');
  const [partnerBirthDate, setPartnerBirthDate] = useState('');

  // Get match info
  const [userName, setUserName] = useState('You');
  const [partnerName, setPartnerName] = useState('Your Match');
  const [userImage, setUserImage] = useState<string | undefined>();
  const [partnerImage, setPartnerImage] = useState<string | undefined>();

  useEffect(() => {
    const userProfile = localStorage.getItem('matchaUserProfile');
    const matchId = localStorage.getItem('matchaSelectedMatch');

    if (userProfile) {
      const user = JSON.parse(userProfile);
      setUserName(user.name || 'You');
      if (user.birthDate) setUserBirthDate(user.birthDate);
      if (user.profileImage) setUserImage(user.profileImage);
      // Auto-fill user preferences from profile interests
      if (user.interests && user.interests.length > 0) {
        setUserLoves(user.interests.slice(0, 3).join(', '));
      }
    }

    if (matchId) {
      const match = getProfileById(matchId);
      if (match) {
        setPartnerName(match.name);
        if (match.birthDate) setPartnerBirthDate(match.birthDate);
        if (match.profileImage) setPartnerImage(match.profileImage);
        // Auto-fill partner preferences from their profile
        if (match.interests && match.interests.length > 0) {
          setPartnerLoves(match.interests.slice(0, 3).join(', '));
        }
        // Auto-fill things they might not like based on diet/lifestyle
        const dislikes: string[] = [];
        if (match.diet === 'vegetarian' || match.diet === 'vegan') {
          dislikes.push('meat-heavy restaurants');
        }
        if (match.smoking === 'never') {
          dislikes.push('smoky bars');
        }
        if (dislikes.length > 0) {
          setPartnerHates(dislikes.join(', '));
        }
      }
    }
  }, []);

  useEffect(() => {
    if (step === 'loading') {
      const interval = setInterval(() => {
        setLoadingMessage(prev => (prev + 1) % LOADING_MESSAGES.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [step]);

  const generateVenueImage = useCallback(async (venue: string, venueCity: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-venue-image', {
        body: { venue, city: venueCity, vibe }
      });
      
      if (error || data?.error) {
        console.error('Error generating venue image:', error || data?.error);
        return null;
      }
      
      return data?.imageUrl || null;
    } catch (err) {
      console.error('Failed to generate venue image:', err);
      return null;
    }
  }, [vibe]);

  const generateDatePlan = async () => {
    // Show matching animation first
    setShowMatchingAnimation(true);
  };

  const handleMatchingComplete = async () => {
    setShowMatchingAnimation(false);
    setStep('loading');
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('generate-date-plan', {
        body: {
          city,
          timeWindow,
          occasion,
          vibe,
          budget,
          userLoves,
          userHates,
          partnerLoves,
          partnerHates,
          lastWords,
          useAstrology,
          userBirthDate: useAstrology ? userBirthDate : undefined,
          partnerBirthDate: useAstrology ? partnerBirthDate : undefined,
          userName,
          partnerName,
        }
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setDatePlans(data);
      setSelectedPlan(0);
      setStep('results');
      toast.success('Your fate has been generated!');

      // Generate images for first 2 venues (to save API calls)
      if (data.plans?.[0]?.timeline) {
        const venuesToGenerate = data.plans[0].timeline.slice(0, 2);
        for (const item of venuesToGenerate) {
          const imageUrl = await generateVenueImage(item.venue, city);
          if (imageUrl) {
            setVenueImages(prev => ({ ...prev, [item.venue]: imageUrl }));
          }
        }
      }
    } catch (err) {
      console.error('Error generating date plan:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate date plan');
      setStep('input');
      toast.error('Failed to generate plan. Try again!');
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const openMaps = (query: string) => {
    window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, '_blank');
  };

  if (showMatchingAnimation) {
    return (
      <MatchingAnimation
        userName={userName}
        partnerName={partnerName}
        userImage={userImage}
        partnerImage={partnerImage}
        onComplete={handleMatchingComplete}
      />
    );
  }

  if (step === 'loading') {
    return <LoadingState message={LOADING_MESSAGES[loadingMessage]} />;
  }

  if (step === 'results' && datePlans) {
    return (
      <ResultsView 
        datePlans={datePlans}
        selectedPlan={selectedPlan}
        setSelectedPlan={setSelectedPlan}
        copiedIndex={copiedIndex}
        copyToClipboard={copyToClipboard}
        openMaps={openMaps}
        onBack={() => setStep('input')}
        onRegenerate={generateDatePlan}
        userName={userName}
        partnerName={partnerName}
        venueImages={venueImages}
        city={city}
        vibe={vibe}
        onGenerateImage={generateVenueImage}
        setVenueImages={setVenueImages}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/matches')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Matches
        </Button>

        <div className="text-center mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">
            Plan the <span className="text-gradient-love">Perfect Date</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Tell us what you want, and let AI do the awkward planning part
          </p>
        </div>

        {error && (
          <Card className="mb-6 border-destructive/50 bg-destructive/10">
            <CardContent className="flex items-center gap-3 py-4">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <p className="text-sm">{error}</p>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          {/* Logistics */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                The Basics
              </CardTitle>
              <CardDescription>Where, when, and why</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="San Francisco">San Francisco</SelectItem>
                      <SelectItem value="New York">New York</SelectItem>
                      <SelectItem value="Los Angeles">Los Angeles</SelectItem>
                      <SelectItem value="Chicago">Chicago</SelectItem>
                      <SelectItem value="Austin">Austin</SelectItem>
                      <SelectItem value="Seattle">Seattle</SelectItem>
                      <SelectItem value="Miami">Miami</SelectItem>
                      <SelectItem value="Denver">Denver</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Time Window</Label>
                  <Select value={timeWindow} onValueChange={setTimeWindow}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Saturday Night">Saturday Night</SelectItem>
                      <SelectItem value="Sunday Brunch">Sunday Brunch</SelectItem>
                      <SelectItem value="Weekday Evening">Weekday Evening</SelectItem>
                      <SelectItem value="Friday Night">Friday Night</SelectItem>
                      <SelectItem value="Weekend Afternoon">Weekend Afternoon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Occasion</Label>
                <Select value={occasion} onValueChange={setOccasion}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="First Date">First Date</SelectItem>
                    <SelectItem value="Anniversary">Anniversary</SelectItem>
                    <SelectItem value="Birthday Celebration">Birthday Celebration</SelectItem>
                    <SelectItem value="Surprise Date">Surprise Date</SelectItem>
                    <SelectItem value="Casual Hangout">Casual Hangout</SelectItem>
                    <SelectItem value="Getting Back Together">Getting Back Together</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Vibe & Budget */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Zap className="w-5 h-5 text-secondary" />
                Vibe & Budget
              </CardTitle>
              <CardDescription>Set the energy and your wallet limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Energy Level</Label>
                <div className="flex gap-2">
                  {['Chill', 'Romantic', 'High Energy', 'Adventurous'].map(v => (
                    <Button
                      key={v}
                      variant={vibe === v ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setVibe(v)}
                      className={vibe === v ? 'bg-gradient-romantic' : ''}
                    >
                      {v}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Budget</Label>
                <div className="flex gap-2">
                  {['$', '$$', '$$$', '$$$$'].map(b => (
                    <Button
                      key={b}
                      variant={budget === b ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setBudget(b)}
                      className={budget === b ? 'bg-gradient-romantic' : ''}
                    >
                      <DollarSign className="w-3 h-3 mr-1" />
                      {b}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Preferences
              </CardTitle>
              <CardDescription>What makes you tick (or run away)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>{userName} Loves</Label>
                  <Input 
                    placeholder="e.g., live music, sushi, art galleries"
                    value={userLoves}
                    onChange={e => setUserLoves(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{userName} Hates</Label>
                  <Input 
                    placeholder="e.g., crowds, loud bars, seafood"
                    value={userHates}
                    onChange={e => setUserHates(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>{partnerName} Loves</Label>
                  <Input 
                    placeholder="What do they enjoy?"
                    value={partnerLoves}
                    onChange={e => setPartnerLoves(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{partnerName} Hates</Label>
                  <Input 
                    placeholder="What should we avoid?"
                    value={partnerHates}
                    onChange={e => setPartnerHates(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Astrology Toggle */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Star className="w-5 h-5 text-love-gold" />
                Astrology Check
              </CardTitle>
              <CardDescription>Do you believe the stars control your love life?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="astrology" className="cursor-pointer">Enable zodiac compatibility analysis</Label>
                <Switch 
                  id="astrology"
                  checked={useAstrology}
                  onCheckedChange={setUseAstrology}
                />
              </div>
              {useAstrology && (
                <div className="grid gap-4 md:grid-cols-2 pt-2">
                  <div className="space-y-2">
                    <Label>{userName} Birthday</Label>
                    <Input 
                      type="date"
                      value={userBirthDate}
                      onChange={e => setUserBirthDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{partnerName} Birthday</Label>
                    <Input 
                      type="date"
                      value={partnerBirthDate}
                      onChange={e => setPartnerBirthDate(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Last Words */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                Any Last Words?
              </CardTitle>
              <CardDescription>Special demands, allergies, red flags, or unhinged requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="e.g., gluten-free and fun-free, avoid my ex who works at that Italian place, needs wheelchair access, must include at least one cat cafe..."
                value={lastWords}
                onChange={e => setLastWords(e.target.value)}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>

          {/* Generate Button */}
          <Button 
            size="lg" 
            className="w-full bg-gradient-romantic text-primary-foreground text-lg py-6 shadow-glow"
            onClick={generateDatePlan}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Generate My Fate
          </Button>
        </div>
      </div>
    </div>
  );
};

const LoadingState = ({ message }: { message: string }) => (
  <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
    <div className="text-center max-w-md">
      <div className="relative w-32 h-32 mx-auto mb-8">
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
        <div className="absolute inset-4 rounded-full bg-primary/30 animate-ping" style={{ animationDelay: '0.3s' }} />
        <div className="absolute inset-8 rounded-full bg-gradient-romantic flex items-center justify-center shadow-glow">
          <Sparkles className="w-8 h-8 text-primary-foreground animate-pulse" />
        </div>
      </div>
      <h2 className="font-display text-2xl font-bold mb-4">Planning Your Perfect Date</h2>
      <p className="text-muted-foreground animate-pulse text-lg">{message}</p>
      <div className="mt-6 flex justify-center gap-1">
        {[0, 1, 2].map(i => (
          <div 
            key={i} 
            className="w-2 h-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  </div>
);

interface ResultsViewProps {
  datePlans: DatePlanResponse;
  selectedPlan: number;
  setSelectedPlan: (i: number) => void;
  copiedIndex: number | null;
  copyToClipboard: (text: string, index: number) => void;
  openMaps: (query: string) => void;
  onBack: () => void;
  onRegenerate: () => void;
  userName: string;
  partnerName: string;
  venueImages: Record<string, string>;
  city: string;
  vibe: string;
  onGenerateImage: (venue: string, city: string) => Promise<string | null>;
  setVenueImages: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const ResultsView = ({
  datePlans,
  selectedPlan,
  setSelectedPlan,
  copiedIndex,
  copyToClipboard,
  openMaps,
  onBack,
  onRegenerate,
  userName,
  partnerName,
  venueImages,
  city,
  vibe,
  onGenerateImage,
  setVenueImages
}: ResultsViewProps) => {
  const [generatingImage, setGeneratingImage] = useState<string | null>(null);
  const plan = datePlans.plans[selectedPlan];

  const handleGenerateImage = async (venue: string) => {
    setGeneratingImage(venue);
    const imageUrl = await onGenerateImage(venue, city);
    if (imageUrl) {
      setVenueImages(prev => ({ ...prev, [venue]: imageUrl }));
    }
    setGeneratingImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-hero py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Tweak Inputs
          </Button>
          <Button variant="outline" onClick={onRegenerate}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Regenerate
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold mb-2">
            Your Date with <span className="text-gradient-love">{partnerName}</span>
          </h1>
          <p className="text-muted-foreground">Pick the one least likely to end in disaster</p>
        </div>

        {/* Astrology Verdict */}
        {datePlans.astrologyVerdict && (
          <Card className="mb-6 border-love-gold/30 bg-love-gold/5">
            <CardContent className="flex items-start gap-3 py-4">
              <Star className="w-6 h-6 text-love-gold shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-love-gold mb-1">Cosmic Verdict</p>
                <p className="text-sm">{datePlans.astrologyVerdict}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Plan Selector */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {datePlans.plans.map((p, i) => (
            <Button
              key={p.id}
              variant={selectedPlan === i ? 'default' : 'outline'}
              onClick={() => setSelectedPlan(i)}
              className={`flex-shrink-0 ${selectedPlan === i ? 'bg-gradient-romantic' : ''}`}
            >
              <span className="mr-2">Option {i + 1}</span>
              <Badge variant="secondary" className="text-xs">{p.theme}</Badge>
            </Button>
          ))}
        </div>

        {/* Selected Plan */}
        <Card className="border-border/50 mb-6">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-display text-2xl">{plan.title}</CardTitle>
                <CardDescription className="text-base mt-1">{plan.estimatedCost}</CardDescription>
              </div>
              <Badge className="bg-gradient-romantic text-primary-foreground">{plan.theme}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Timeline */}
            <div className="relative mb-8">
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />
              <div className="space-y-6">
                {plan.timeline.map((item, index) => (
                  <div key={index} className="relative flex gap-4 group">
                    <div className="relative z-10 w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="flex-1 pb-2">
                      <Badge variant="outline" className="mb-2">{item.time}</Badge>
                      <h4 className="font-semibold text-lg">{item.activity}</h4>
                      <button 
                        onClick={() => openMaps(item.mapsQuery)}
                        className="flex items-center gap-1 text-primary text-sm hover:underline mt-1"
                      >
                        <MapPin className="w-3 h-3" />
                        {item.venue}
                        <ExternalLink className="w-3 h-3" />
                      </button>
                      <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
                      
                      {/* Venue Image */}
                      {index < 2 && (
                        <div className="mt-3">
                          {venueImages[item.venue] ? (
                            <div className="relative w-full h-32 rounded-xl overflow-hidden border border-border/50">
                              <img 
                                src={venueImages[item.venue]} 
                                alt={item.venue}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                              <Badge className="absolute bottom-2 left-2 bg-background/80 text-foreground text-xs">
                                AI Generated Preview
                              </Badge>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleGenerateImage(item.venue)}
                              disabled={generatingImage === item.venue}
                              className="text-xs"
                            >
                              {generatingImage === item.venue ? (
                                <>
                                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <ImageIcon className="w-3 h-3 mr-1" />
                                  Generate Preview
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Why It Fits */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 mb-6">
              <h4 className="font-semibold flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Why This Fits You
              </h4>
              <p className="text-sm text-muted-foreground">{plan.whyItFits}</p>
            </div>

            {/* Backup & Exit */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-muted/50">
                <h4 className="font-semibold flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-secondary" />
                  Backup Plan
                </h4>
                <p className="text-sm text-muted-foreground">{plan.backupPlan}</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50">
                <h4 className="font-semibold flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-love-gold" />
                  Exit Strategy
                </h4>
                <p className="text-sm text-muted-foreground">{plan.exitStrategy}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invite Messages */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Send the Invite
            </CardTitle>
            <CardDescription>Click any message to copy it</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {datePlans.inviteMessages.map((msg, index) => (
              <button
                key={index}
                onClick={() => copyToClipboard(msg.message, index)}
                className="w-full text-left p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{msg.tone}</Badge>
                  {copiedIndex === index ? (
                    <Check className="w-4 h-4 text-primary" />
                  ) : (
                    <Copy className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
                <p className="text-sm">{msg.message}</p>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button 
          size="lg"
          className="w-full mt-6 bg-gradient-romantic text-primary-foreground"
          onClick={() => toast.success('Date plan saved! Good luck!')}
        >
          <Heart className="w-5 h-5 mr-2" />
          Save This Plan
        </Button>
      </div>
    </div>
  );
};

export default DatePlanPage;