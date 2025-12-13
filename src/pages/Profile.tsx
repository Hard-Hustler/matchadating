import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, ArrowRight, Video, ArrowLeft, Instagram, Linkedin, Sparkles, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import VideoEmotionCapture, { EmotionData, PersonaResult, generatePersonaFromEmotions } from '@/components/VideoEmotionCapture';
import PersonaDisplay from '@/components/PersonaDisplay';

interface ProfileFormData {
  name: string;
  age: string;
  location: string;
  sex: string;
  orientation: string;
  instagramUrl: string;
  linkedinUrl: string;
  interests: string[];
  persona?: PersonaResult;
}

interface SocialProfile {
  platform: 'instagram' | 'linkedin';
  connected: boolean;
  extractedInterests: string[];
  profileData?: {
    name?: string;
    headline?: string;
    industry?: string;
  };
}

const VIDEO_QUESTIONS = [
  "What makes you genuinely laugh?",
  "Describe your perfect weekend adventure",
  "What are you most passionate about in life?",
];

const OPTIONAL_INTERESTS = [
  "🎵 Music", "📚 Books", "🎮 Gaming", "🏋️ Fitness", "🍳 Cooking", 
  "✈️ Travel", "🎨 Art", "🐕 Dogs", "🐱 Cats", "🎬 Movies",
  "☕ Coffee", "🍷 Wine", "🏔️ Hiking", "🧘 Yoga", "📸 Photography",
  "💃 Dancing", "🎭 Theater", "🌱 Plants", "🏖️ Beach", "🎤 Karaoke"
];

// Mock function to simulate extracting interests from social profiles
const mockExtractInterests = (platform: 'instagram' | 'linkedin', url: string): Promise<SocialProfile> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (platform === 'instagram') {
        resolve({
          platform: 'instagram',
          connected: true,
          extractedInterests: ['Travel', 'Photography', 'Food', 'Fitness', 'Art', 'Music', 'Fashion', 'Nature'],
          profileData: {
            name: 'Extracted from Instagram',
          }
        });
      } else {
        resolve({
          platform: 'linkedin',
          connected: true,
          extractedInterests: ['Technology', 'Entrepreneurship', 'Innovation', 'Leadership', 'Networking'],
          profileData: {
            headline: 'Professional Profile',
            industry: 'Technology',
          }
        });
      }
    }, 1500);
  });
};

const Profile = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [emotionSamples, setEmotionSamples] = useState<EmotionData[]>([]);
  const [generatedPersona, setGeneratedPersona] = useState<PersonaResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExtractingInstagram, setIsExtractingInstagram] = useState(false);
  const [isExtractingLinkedin, setIsExtractingLinkedin] = useState(false);
  const [showVideoRecording, setShowVideoRecording] = useState(false);
  
  const [socialProfiles, setSocialProfiles] = useState<{
    instagram?: SocialProfile;
    linkedin?: SocialProfile;
  }>({});
  
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    age: '',
    location: '',
    sex: '',
    orientation: '',
    instagramUrl: '',
    linkedinUrl: '',
    interests: [],
  });

  const updateField = (field: keyof ProfileFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleConnectInstagram = async () => {
    if (!formData.instagramUrl) {
      toast.error('Please enter your Instagram profile URL');
      return;
    }
    setIsExtractingInstagram(true);
    try {
      const profile = await mockExtractInterests('instagram', formData.instagramUrl);
      setSocialProfiles(prev => ({ ...prev, instagram: profile }));
      updateField('interests', [...new Set([...formData.interests, ...profile.extractedInterests])]);
      toast.success(`Found ${profile.extractedInterests.length} interests from Instagram!`);
    } catch (error) {
      toast.error('Failed to connect Instagram');
    } finally {
      setIsExtractingInstagram(false);
    }
  };

  const handleConnectLinkedin = async () => {
    if (!formData.linkedinUrl) {
      toast.error('Please enter your LinkedIn profile URL');
      return;
    }
    setIsExtractingLinkedin(true);
    try {
      const profile = await mockExtractInterests('linkedin', formData.linkedinUrl);
      setSocialProfiles(prev => ({ ...prev, linkedin: profile }));
      updateField('interests', [...new Set([...formData.interests, ...profile.extractedInterests])]);
      toast.success(`Found ${profile.extractedInterests.length} interests from LinkedIn!`);
    } catch (error) {
      toast.error('Failed to connect LinkedIn');
    } finally {
      setIsExtractingLinkedin(false);
    }
  };

  const handleEmotionCapture = (emotions: EmotionData) => {
    setEmotionSamples(prev => [...prev, emotions]);
  };

  const handleQuestionComplete = () => {
    if (currentQuestionIndex < VIDEO_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      const persona = generatePersonaFromEmotions(emotionSamples);
      setGeneratedPersona(persona);
      toast.success('AI Persona generated successfully!');
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.location || !formData.sex || !formData.orientation) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.interests.length === 0) {
      toast.error('Please connect at least one social profile to extract interests');
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const profile = {
      ...formData,
      age: parseInt(formData.age) || 25,
      persona: generatedPersona || undefined,
      id: `user-${Date.now()}`,
    };
    
    localStorage.setItem('matchaUserProfile', JSON.stringify(profile));
    
    toast.success('Profile created! Finding your matches...');
    navigate('/matches');
  };

  const allInterests = formData.interests;
  const hasConnectedSocial = socialProfiles.instagram?.connected || socialProfiles.linkedin?.connected;

  return (
    <div className="min-h-screen bg-gradient-hero py-8 px-4">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-romantic flex items-center justify-center shadow-glow">
              <Heart className="w-5 h-5 text-primary-foreground" fill="currentColor" />
            </div>
          </div>
          <span className="font-display text-xl font-bold">Matcha</span>
        </div>
        
        {/* Progress */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map(s => (
            <div 
              key={s}
              className={`h-2.5 flex-1 rounded-full transition-all ${
                s <= step ? 'bg-gradient-romantic shadow-glow' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      <Card className="max-w-2xl mx-auto border-border/50 shadow-soft overflow-hidden">
        {/* Step 1: Basic Info + Social Links */}
        {step === 1 && (
          <>
            <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-primary/10">
              <CardTitle className="font-display text-2xl flex items-center gap-3">
                <span className="text-3xl">💕</span> Connect Your World
              </CardTitle>
              <CardDescription className="text-base">Link your socials and we'll understand you better than any questionnaire</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Basic Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name *</Label>
                  <Input 
                    id="name" 
                    placeholder="What should we call you?"
                    value={formData.name}
                    onChange={e => updateField('name', e.target.value)}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location *</Label>
                  <Select value={formData.location} onValueChange={v => updateField('location', v)}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Your city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="San Francisco">San Francisco</SelectItem>
                      <SelectItem value="Oakland">Oakland</SelectItem>
                      <SelectItem value="Berkeley">Berkeley</SelectItem>
                      <SelectItem value="San Jose">San Jose</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>I am *</Label>
                  <Select value={formData.sex} onValueChange={v => updateField('sex', v)}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="non-binary">Non-binary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Looking for *</Label>
                  <Select value={formData.orientation} onValueChange={v => updateField('orientation', v)}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="straight">Opposite gender</SelectItem>
                      <SelectItem value="gay">Same gender</SelectItem>
                      <SelectItem value="bisexual">All genders</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="pt-4 border-t">
                <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Connect Your Profiles
                </h3>
                
                {/* Instagram */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-rose-500 to-orange-500 flex items-center justify-center">
                      <Instagram className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <Input 
                        placeholder="instagram.com/your-username"
                        value={formData.instagramUrl}
                        onChange={e => updateField('instagramUrl', e.target.value)}
                        disabled={socialProfiles.instagram?.connected}
                        className="bg-background"
                      />
                    </div>
                    <Button 
                      variant={socialProfiles.instagram?.connected ? "secondary" : "default"}
                      onClick={handleConnectInstagram}
                      disabled={isExtractingInstagram || socialProfiles.instagram?.connected}
                      className="min-w-[100px]"
                    >
                      {isExtractingInstagram ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : socialProfiles.instagram?.connected ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Connected
                        </>
                      ) : (
                        'Analyze'
                      )}
                    </Button>
                  </div>
                  {socialProfiles.instagram?.connected && (
                    <p className="text-xs text-primary ml-14">
                      ✓ Found {socialProfiles.instagram.extractedInterests.length} interests
                    </p>
                  )}
                </div>

                {/* LinkedIn */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                      <Linkedin className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <Input 
                        placeholder="linkedin.com/in/your-profile"
                        value={formData.linkedinUrl}
                        onChange={e => updateField('linkedinUrl', e.target.value)}
                        disabled={socialProfiles.linkedin?.connected}
                        className="bg-background"
                      />
                    </div>
                    <Button 
                      variant={socialProfiles.linkedin?.connected ? "secondary" : "default"}
                      onClick={handleConnectLinkedin}
                      disabled={isExtractingLinkedin || socialProfiles.linkedin?.connected}
                      className="min-w-[100px]"
                    >
                      {isExtractingLinkedin ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : socialProfiles.linkedin?.connected ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Connected
                        </>
                      ) : (
                        'Analyze'
                      )}
                    </Button>
                  </div>
                  {socialProfiles.linkedin?.connected && (
                    <p className="text-xs text-primary ml-14">
                      ✓ Found {socialProfiles.linkedin.extractedInterests.length} interests
                    </p>
                  )}
                </div>
              </div>

              {/* Extracted Interests */}
              {allInterests.length > 0 && (
                <div className="pt-4 border-t">
                  <h3 className="font-display font-semibold mb-3 flex items-center gap-2">
                    <span className="text-lg">✨</span> Your Interests (AI Detected)
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3 italic">"We stalked your socials (legally) and found these gems 💎"</p>
                  <div className="flex flex-wrap gap-2">
                    {allInterests.map(interest => (
                      <span 
                        key={interest} 
                        className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium animate-fade-in"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Optional Manual Interests */}
              <div className="pt-4 border-t">
                <h3 className="font-display font-semibold mb-3 flex items-center gap-2">
                  <span className="text-lg">🎯</span> Add More Interests (Optional)
                </h3>
                <p className="text-xs text-muted-foreground mb-3 italic">"Tell us what makes your heart skip a beat... besides pizza 🍕"</p>
                <div className="flex flex-wrap gap-2">
                  {OPTIONAL_INTERESTS.map(interest => (
                    <button
                      key={interest}
                      onClick={() => {
                        if (formData.interests.includes(interest)) {
                          updateField('interests', formData.interests.filter(i => i !== interest));
                        } else {
                          updateField('interests', [...formData.interests, interest]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        formData.interests.includes(interest)
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                className="w-full mt-6 bg-gradient-romantic hover:opacity-90" 
                onClick={() => setStep(2)}
                disabled={!formData.name || !formData.location || !formData.sex || !formData.orientation}
              >
                Continue to Video Analysis 🎬
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              
              {!hasConnectedSocial && formData.interests.length === 0 && (
                <p className="text-center text-sm text-muted-foreground">
                  Psst... connect a social or pick some interests. We need something to work with! 😅
                </p>
              )}
            </CardContent>
          </>
        )}

        {/* Step 2: Video Persona */}
        {step === 2 && (
          <>
            <CardHeader className="bg-gradient-to-r from-rose-500/5 to-primary/5">
              <CardTitle className="font-display text-2xl flex items-center gap-2">
                <span className="text-3xl">🎬</span> Record Your Vibe
              </CardTitle>
              <CardDescription>
                Answer questions on camera and let AI read your emotional persona
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {!showVideoRecording && !generatedPersona ? (
                <div className="text-center py-8">
                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-rose-500 animate-pulse blur-xl opacity-50" />
                    <div className="relative w-full h-full rounded-full bg-gradient-to-br from-primary/20 to-rose-500/20 flex items-center justify-center border-2 border-primary/30">
                      <Video className="w-16 h-16 text-primary" />
                    </div>
                  </div>
                  
                  <h3 className="font-display text-xl font-semibold mb-3">Live Emotion Detection</h3>
                  <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                    Our AI analyzes your facial expressions in real-time to understand your emotional persona. It's fun, quick, and helps find better matches!
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
                    {[
                      { emoji: '🌍', type: 'Adventurer' },
                      { emoji: '📚', type: 'Intellectual' },
                      { emoji: '🦋', type: 'Social' },
                      { emoji: '🏠', type: 'Homebody' },
                      { emoji: '🎨', type: 'Creative' },
                      { emoji: '💕', type: 'Romantic' },
                    ].map(p => (
                      <div key={p.type} className="p-3 rounded-xl bg-muted/50 text-center">
                        <span className="text-2xl">{p.emoji}</span>
                        <p className="text-xs mt-1">{p.type}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-col gap-3 max-w-xs mx-auto">
                    <Button onClick={() => setShowVideoRecording(true)} size="lg" className="w-full">
                      <Video className="w-4 h-4 mr-2" />
                      Start Recording
                    </Button>
                    <Button variant="ghost" onClick={() => setStep(3)}>
                      Skip for now
                    </Button>
                  </div>
                </div>
              ) : generatedPersona ? (
                <div className="space-y-6">
                  <PersonaDisplay persona={generatedPersona} />
                  
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setGeneratedPersona(null);
                        setEmotionSamples([]);
                        setCurrentQuestionIndex(0);
                        setShowVideoRecording(false);
                      }} 
                      className="flex-1"
                    >
                      Retake Video
                    </Button>
                    <Button className="flex-1" onClick={() => setStep(3)}>
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Question progress */}
                  <div className="flex gap-2 mb-4">
                    {VIDEO_QUESTIONS.map((_, idx) => (
                      <div 
                        key={idx}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          idx < currentQuestionIndex ? 'bg-primary' : 
                          idx === currentQuestionIndex ? 'bg-primary/50' : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <VideoEmotionCapture
                    question={VIDEO_QUESTIONS[currentQuestionIndex]}
                    questionIndex={currentQuestionIndex}
                    onCapture={handleEmotionCapture}
                    onComplete={handleQuestionComplete}
                  />
                  
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowVideoRecording(false)}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              )}

              {!showVideoRecording && !generatedPersona && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                </div>
              )}
            </CardContent>
          </>
        )}

        {/* Step 3: Review & Submit */}
        {step === 3 && (
          <>
            <CardHeader className="bg-gradient-to-r from-primary/5 to-emerald-500/5">
              <CardTitle className="font-display text-2xl flex items-center gap-2">
                <span className="text-3xl">💚</span> Ready to Match!
              </CardTitle>
              <CardDescription>Review your profile before we find your perfect matches</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Profile Summary */}
              <div className="p-6 rounded-2xl bg-muted/50 border border-border/50">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center text-3xl">
                    {formData.sex === 'female' ? '👩' : formData.sex === 'male' ? '👨' : '🧑'}
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold">{formData.name || 'Your Name'}</h3>
                    <p className="text-muted-foreground">{formData.location}</p>
                  </div>
                </div>

                {/* Connected Socials */}
                <div className="space-y-2 mb-4">
                  {socialProfiles.instagram?.connected && (
                    <div className="flex items-center gap-2 text-sm">
                      <Instagram className="w-4 h-4 text-rose-500" />
                      <span>Instagram connected</span>
                      <Check className="w-4 h-4 text-primary ml-auto" />
                    </div>
                  )}
                  {socialProfiles.linkedin?.connected && (
                    <div className="flex items-center gap-2 text-sm">
                      <Linkedin className="w-4 h-4 text-blue-600" />
                      <span>LinkedIn connected</span>
                      <Check className="w-4 h-4 text-primary ml-auto" />
                    </div>
                  )}
                  {generatedPersona && (
                    <div className="flex items-center gap-2 text-sm">
                      <Video className="w-4 h-4 text-primary" />
                      <span>Persona: {generatedPersona.personaType}</span>
                      <Check className="w-4 h-4 text-primary ml-auto" />
                    </div>
                  )}
                </div>

                {/* Interests */}
                <div className="flex flex-wrap gap-2">
                  {allInterests.slice(0, 8).map(interest => (
                    <span key={interest} className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                      {interest}
                    </span>
                  ))}
                  {allInterests.length > 8 && (
                    <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs">
                      +{allInterests.length - 8} more
                    </span>
                  )}
                </div>
              </div>

              {!generatedPersona && (
                <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-sm">
                  <p className="font-medium text-yellow-600 dark:text-yellow-400">
                    💡 Tip: Recording a video can increase match quality by 40%!
                  </p>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-yellow-600 dark:text-yellow-400" 
                    onClick={() => setStep(2)}
                  >
                    Record now →
                  </Button>
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button 
                  className="flex-1" 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Finding Matches...
                    </>
                  ) : (
                    <>
                      Find My Matches
                      <Heart className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};

export default Profile;
