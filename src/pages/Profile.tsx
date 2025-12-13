import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, ArrowRight, Video, SkipForward, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import VideoEmotionCapture, { EmotionData, PersonaResult, generatePersonaFromEmotions } from '@/components/VideoEmotionCapture';
import PersonaDisplay from '@/components/PersonaDisplay';

interface ProfileFormData {
  name: string;
  age: string;
  location: string;
  sex: string;
  orientation: string;
  bio: string;
  interests: string;
  job: string;
  education: string;
  diet: string;
  drinks: string;
  pets: string;
  dealBreakers: string;
  persona?: PersonaResult;
}

const VIDEO_QUESTIONS = [
  "What makes you genuinely laugh?",
  "Describe your perfect weekend adventure",
  "What are you most passionate about in life?",
];

const Profile = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showVideo, setShowVideo] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [emotionSamples, setEmotionSamples] = useState<EmotionData[]>([]);
  const [generatedPersona, setGeneratedPersona] = useState<PersonaResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    age: '',
    location: '',
    sex: '',
    orientation: '',
    bio: '',
    interests: '',
    job: '',
    education: '',
    diet: '',
    drinks: '',
    pets: '',
    dealBreakers: '',
  });

  const updateField = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEmotionCapture = (emotions: EmotionData) => {
    setEmotionSamples(prev => [...prev, emotions]);
  };

  const handleQuestionComplete = () => {
    if (currentQuestionIndex < VIDEO_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Generate persona from all samples
      const persona = generatePersonaFromEmotions(emotionSamples);
      setGeneratedPersona(persona);
      toast.success('AI Persona generated successfully!');
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.age || !formData.location || !formData.sex || !formData.orientation || !formData.bio) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const profile = {
      ...formData,
      age: parseInt(formData.age),
      interests: formData.interests.split(',').map(i => i.trim()).filter(Boolean),
      persona: generatedPersona || undefined,
      id: `user-${Date.now()}`,
    };
    
    localStorage.setItem('matchaUserProfile', JSON.stringify(profile));
    
    toast.success('Profile created! Finding your matches...');
    navigate('/matches');
  };

  return (
    <div className="min-h-screen bg-gradient-hero py-8 px-4">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Heart className="w-4 h-4 text-primary-foreground" fill="currentColor" />
          </div>
          <span className="font-display text-xl font-bold">MATCHA</span>
        </div>
        
        {/* Progress */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map(s => (
            <div 
              key={s}
              className={`h-2 flex-1 rounded-full transition-colors ${
                s <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      <Card className="max-w-2xl mx-auto border-border/50 shadow-soft">
        {step === 1 && (
          <>
            <CardHeader>
              <CardTitle className="font-display text-2xl">Let's get to know you</CardTitle>
              <CardDescription>Tell us the basics about yourself</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input 
                    id="name" 
                    placeholder="Your first name"
                    value={formData.name}
                    onChange={e => updateField('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input 
                    id="age" 
                    type="number" 
                    min="18" 
                    max="100"
                    placeholder="Your age"
                    value={formData.age}
                    onChange={e => updateField('age', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Location *</Label>
                <Select value={formData.location} onValueChange={v => updateField('location', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="San Francisco">San Francisco</SelectItem>
                    <SelectItem value="Oakland">Oakland</SelectItem>
                    <SelectItem value="Berkeley">Berkeley</SelectItem>
                    <SelectItem value="San Jose">San Jose</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>I am *</Label>
                  <Select value={formData.sex} onValueChange={v => updateField('sex', v)}>
                    <SelectTrigger>
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
                    <SelectTrigger>
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

              <Button 
                className="w-full mt-6" 
                onClick={() => setStep(2)}
                disabled={!formData.name || !formData.age || !formData.location || !formData.sex || !formData.orientation}
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </>
        )}

        {step === 2 && (
          <>
            <CardHeader>
              <CardTitle className="font-display text-2xl">Tell us more</CardTitle>
              <CardDescription>Help us understand your personality and lifestyle</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bio">About you * (max 200 chars)</Label>
                <Textarea 
                  id="bio"
                  placeholder="What makes you, you? Share a bit about your personality..."
                  maxLength={200}
                  value={formData.bio}
                  onChange={e => updateField('bio', e.target.value)}
                  className="resize-none"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground text-right">{formData.bio.length}/200</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interests">Interests (comma-separated)</Label>
                <Input 
                  id="interests"
                  placeholder="hiking, cooking, photography, travel..."
                  value={formData.interests}
                  onChange={e => updateField('interests', e.target.value)}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="job">Job</Label>
                  <Input 
                    id="job"
                    placeholder="What do you do?"
                    value={formData.job}
                    onChange={e => updateField('job', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Education</Label>
                  <Select value={formData.education} onValueChange={v => updateField('education', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high school">High School</SelectItem>
                      <SelectItem value="college">College</SelectItem>
                      <SelectItem value="graduate">Graduate Degree</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Diet</Label>
                  <Select value={formData.diet} onValueChange={v => updateField('diet', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="anything">Anything</SelectItem>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                      <SelectItem value="pescatarian">Pescatarian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Drinks</Label>
                  <Select value={formData.drinks} onValueChange={v => updateField('drinks', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="socially">Socially</SelectItem>
                      <SelectItem value="regularly">Regularly</SelectItem>
                      <SelectItem value="rarely">Rarely</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Pets</Label>
                  <Select value={formData.pets} onValueChange={v => updateField('pets', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dogs">Dogs</SelectItem>
                      <SelectItem value="cats">Cats</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dealBreakers">Deal breakers (optional)</Label>
                <Input 
                  id="dealBreakers"
                  placeholder="Anything that's a no-go for you?"
                  value={formData.dealBreakers}
                  onChange={e => updateField('dealBreakers', e.target.value)}
                />
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button 
                  className="flex-1" 
                  onClick={() => setStep(3)}
                  disabled={!formData.bio}
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </>
        )}

        {step === 3 && (
          <>
            <CardHeader>
              <CardTitle className="font-display text-2xl">
                {generatedPersona ? 'Your AI Persona' : 'Video Persona Analysis'}
              </CardTitle>
              <CardDescription>
                {generatedPersona 
                  ? 'This is how our AI sees your personality!'
                  : 'Answer questions on camera to detect your emotional persona'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!showVideo && !generatedPersona ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Video className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2">Live Video Persona Detection</h3>
                  <p className="text-muted-foreground text-sm mb-4 max-w-sm mx-auto">
                    Our AI will analyze your facial expressions while you answer 3 questions to determine your emotional persona.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {['Adventurer', 'Intellectual', 'Social Butterfly', 'Creative', 'Romantic', 'Homebody'].map(type => (
                      <span key={type} className="text-xs px-3 py-1 rounded-full bg-muted">
                        {type}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-col gap-3 max-w-xs mx-auto">
                    <Button onClick={() => setShowVideo(true)}>
                      <Video className="w-4 h-4 mr-2" />
                      Start Video Analysis
                    </Button>
                    <Button variant="ghost" onClick={handleSubmit} disabled={isSubmitting}>
                      <SkipForward className="w-4 h-4 mr-2" />
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
                      }} 
                      className="flex-1"
                    >
                      Retake Video
                    </Button>
                    <Button 
                      className="flex-1" 
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Creating Profile...
                        </>
                      ) : (
                        <>
                          Find My Matches
                          <Heart className="w-4 h-4 ml-2" />
                        </>
                      )}
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
                    onClick={() => setShowVideo(false)}
                    className="w-full"
                  >
                    Cancel Video Analysis
                  </Button>
                </div>
              )}
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};

export default Profile;
