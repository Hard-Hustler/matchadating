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
import AvatarSelector from '@/components/AvatarSelector';

interface ProfileFormData {
  name: string;
  age: string;
  birthDate: string;
  location: string;
  sex: string;
  orientation: string;
  height: string;
  diet: string;
  drinking: string;
  smoking: string;
  zodiacSign: string;
  lookingFor: string;
  bio: string;
  avatar: string;
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
  "Music", "Books", "Gaming", "Fitness", "Cooking", 
  "Travel", "Art", "Dogs", "Cats", "Movies",
  "Coffee", "Wine", "Hiking", "Yoga", "Photography",
  "Dancing", "Theater", "Plants", "Beach", "Outdoors"
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
    birthDate: '',
    location: '',
    sex: '',
    orientation: '',
    height: '',
    diet: '',
    drinking: '',
    smoking: '',
    zodiacSign: '',
    lookingFor: '',
    bio: '',
    avatar: 'style1-none',
    instagramUrl: '',
    linkedinUrl: '',
    interests: [],
  });

  // Calculate zodiac sign from birth date
  const calculateZodiac = (dateStr: string): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries ♈';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus ♉';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini ♊';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer ♋';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo ♌';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo ♍';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra ♎';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio ♏';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius ♐';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn ♑';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius ♒';
    return 'Pisces ♓';
  };

  const handleBirthDateChange = (value: string) => {
    updateField('birthDate', value);
    const zodiac = calculateZodiac(value);
    updateField('zodiacSign', zodiac);
    // Calculate age
    const today = new Date();
    const birth = new Date(value);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    updateField('age', age.toString());
  };

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

  // Auto-generate avatar based on persona type
  const generateAvatarFromPersona = (personaType: string) => {
    const avatarMap: Record<string, string> = {
      'The Adventurer': 'style2-none',
      'The Intellectual': 'style3-glasses',
      'The Social Butterfly': 'style1-earrings',
      'The Creative Soul': 'style4-none',
      'The Romantic': 'style5-none',
      'The Homebody': 'style6-none',
    };
    return avatarMap[personaType] || 'style1-none';
  };

  const handleQuestionComplete = () => {
    if (currentQuestionIndex < VIDEO_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      const persona = generatePersonaFromEmotions(emotionSamples);
      setGeneratedPersona(persona);
      
      // Auto-generate avatar from persona
      const autoAvatar = generateAvatarFromPersona(persona.personaType);
      updateField('avatar', autoAvatar);
      
      toast.success('Persona detected! Avatar auto-generated from your expressions.');
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
      {/* Progress */}
      <div className="max-w-2xl mx-auto mb-8">
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
            <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border/50">
              <CardTitle className="font-display text-2xl">Build Your Profile</CardTitle>
              <CardDescription className="text-base">Connect your socials and let AI understand you better</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Avatar Section */}
              <div className="pb-4 border-b">
                <h3 className="font-display font-semibold mb-2">Create Your Avatar</h3>
                <p className="text-xs text-muted-foreground mb-4">Choose a style that represents you. This will auto-update after video analysis.</p>
                <AvatarSelector 
                  value={formData.avatar} 
                  onChange={v => updateField('avatar', v)} 
                  sex={formData.sex}
                />
              </div>

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
                  <Label htmlFor="birthdate">Birthday *</Label>
                  <Input 
                    id="birthdate" 
                    type="date"
                    value={formData.birthDate}
                    onChange={e => handleBirthDateChange(e.target.value)}
                    className="bg-background"
                  />
                  {formData.zodiacSign && (
                    <p className="text-xs text-primary">{formData.zodiacSign} • {formData.age} years old</p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
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
                <div className="space-y-2">
                  <Label>Height</Label>
                  <Select value={formData.height} onValueChange={v => updateField('height', v)}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Optional" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5ft0 (152cm)">5'0" (152cm)</SelectItem>
                      <SelectItem value="5ft2 (157cm)">5'2" (157cm)</SelectItem>
                      <SelectItem value="5ft4 (163cm)">5'4" (163cm)</SelectItem>
                      <SelectItem value="5ft6 (168cm)">5'6" (168cm)</SelectItem>
                      <SelectItem value="5ft8 (173cm)">5'8" (173cm)</SelectItem>
                      <SelectItem value="5ft10 (178cm)">5'10" (178cm)</SelectItem>
                      <SelectItem value="6ft0 (183cm)">6'0" (183cm)</SelectItem>
                      <SelectItem value="6ft2 (188cm)">6'2" (188cm)</SelectItem>
                      <SelectItem value="6ft4+ (193cm+)">6'4"+ (193cm+)</SelectItem>
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

              {/* Relationship Goals */}
              <div className="space-y-2">
                <Label>What are you looking for?</Label>
                <Select value={formData.lookingFor} onValueChange={v => updateField('lookingFor', v)}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="serious">Something serious</SelectItem>
                    <SelectItem value="casual">Something casual</SelectItem>
                    <SelectItem value="friends">New friends</SelectItem>
                    <SelectItem value="unsure">Still figuring it out</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Lifestyle Section */}
              <div className="pt-4 border-t">
                <h3 className="font-display font-semibold mb-2">Lifestyle (Optional)</h3>
                <p className="text-xs text-muted-foreground mb-4">Help us find someone who matches your lifestyle.</p>
                
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Diet</Label>
                    <Select value={formData.diet} onValueChange={v => updateField('diet', v)}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="anything">Anything goes</SelectItem>
                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="vegan">Vegan</SelectItem>
                        <SelectItem value="pescatarian">Pescatarian</SelectItem>
                        <SelectItem value="keto">Keto</SelectItem>
                        <SelectItem value="halal">Halal</SelectItem>
                        <SelectItem value="kosher">Kosher</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Drinking</Label>
                    <Select value={formData.drinking} onValueChange={v => updateField('drinking', v)}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never</SelectItem>
                        <SelectItem value="rarely">Rarely</SelectItem>
                        <SelectItem value="socially">Socially</SelectItem>
                        <SelectItem value="regularly">Regularly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Smoking</Label>
                    <Select value={formData.smoking} onValueChange={v => updateField('smoking', v)}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never</SelectItem>
                        <SelectItem value="sometimes">Sometimes</SelectItem>
                        <SelectItem value="regularly">Regularly</SelectItem>
                        <SelectItem value="420">420 friendly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label>About You (Optional)</Label>
                <textarea
                  value={formData.bio}
                  onChange={e => updateField('bio', e.target.value)}
                  placeholder="Tell us a bit about yourself..."
                  className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  maxLength={300}
                />
                <p className="text-xs text-muted-foreground text-right">{formData.bio.length}/300</p>
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
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${
                    formData.avatar.startsWith('style2') ? 'from-rose-500 to-orange-400' :
                    formData.avatar.startsWith('style3') ? 'from-cyan-500 to-blue-500' :
                    formData.avatar.startsWith('style4') ? 'from-emerald-500 to-teal-500' :
                    formData.avatar.startsWith('style5') ? 'from-amber-500 to-pink-500' :
                    formData.avatar.startsWith('style6') ? 'from-indigo-500 to-purple-500' :
                    'from-violet-500 to-fuchsia-500'
                  } flex items-center justify-center text-3xl shadow-lg`}>
                    {formData.sex === 'female' ? '👩' : formData.sex === 'male' ? '👨' : '🧑'}
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold">{formData.name || 'Your Name'}</h3>
                    <p className="text-muted-foreground">{formData.location} {formData.age && `• ${formData.age}`}</p>
                    {formData.zodiacSign && <p className="text-xs text-primary">{formData.zodiacSign}</p>}
                  </div>
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                  {formData.height && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>📏</span> {formData.height}
                    </div>
                  )}
                  {formData.diet && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>🍽️</span> {formData.diet}
                    </div>
                  )}
                  {formData.drinking && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>🍷</span> {formData.drinking}
                    </div>
                  )}
                  {formData.lookingFor && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>💕</span> {formData.lookingFor}
                    </div>
                  )}
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
