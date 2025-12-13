import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Calendar, Users, Play, ArrowRight, Instagram, Linkedin, Video, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';

const TAGLINES = [
  "Where Chemistry Meets Algorithm",
  "Love, Decoded by AI",
  "Your Soulmate is Loading...",
  "Swipe Less. Connect More.",
];

const Index = () => {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setTaglineIndex((prev) => (prev + 1) % TAGLINES.length);
        setIsVisible(true);
      }, 500);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-[10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute top-40 right-[10%] w-80 h-80 bg-rose-500/20 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-20 left-[30%] w-72 h-72 bg-emerald-500/10 rounded-full blur-[60px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        {/* Floating Hearts Animation */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute text-primary/20 animate-float"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              fontSize: `${20 + i * 5}px`,
            }}
          >
            💚
          </div>
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary via-emerald-400 to-primary rotate-12 absolute -inset-0.5 blur-sm opacity-70" />
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary via-emerald-400 to-primary flex items-center justify-center relative">
              <span className="text-2xl font-bold text-white">抹</span>
            </div>
          </div>
          <div>
            <span className="font-display text-2xl font-black text-foreground tracking-tight">MATCHA</span>
            <span className="block text-[10px] text-muted-foreground -mt-1 tracking-widest">PERFECT BLEND</span>
          </div>
        </div>
        <Link to="/profile">
          <Button className="rounded-full bg-foreground text-background hover:bg-foreground/90 font-medium">
            Start Matching
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6 pt-8 pb-24">
        <div className="max-w-6xl mx-auto">
          {/* Main Hero */}
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
            {/* Left - Text Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                AI + Emotion + Social = Perfect Match
              </div>
              
              <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9]">
                <span className="text-gradient-matcha">Find</span>
                <br />
                <span className="text-foreground">Your</span>
                <br />
                <span className="relative">
                  <span className="text-gradient-matcha">Match</span>
                  <span className="absolute -right-8 top-0 text-4xl">抹茶</span>
                </span>
              </h1>
              
              <div className={`h-16 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <p className="text-2xl md:text-3xl font-display font-medium text-muted-foreground">
                  {TAGLINES[taglineIndex]}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/profile">
                  <Button size="lg" className="rounded-full px-8 py-7 text-lg font-bold bg-primary hover:bg-primary/90 shadow-glow transition-all hover:scale-105 group">
                    <Heart className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                    Find Your Soulmate
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="rounded-full px-8 py-7 text-lg font-medium border-2 group">
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </Button>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-4 pt-8">
                <div className="flex -space-x-3">
                  {['🧑‍💻', '👩‍🎨', '🧑‍🔬', '👨‍🍳', '👩‍⚕️'].map((emoji, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-rose-300/20 flex items-center justify-center text-lg border-2 border-background">
                      {emoji}
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-foreground">2,000+ matches made</p>
                  <p className="text-muted-foreground">in the last 30 days</p>
                </div>
              </div>
            </div>

            {/* Right - Creative Visual */}
            <div className="relative hidden lg:block">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                {/* Main Card */}
                <div className="absolute inset-0 bg-gradient-to-br from-card to-card/80 rounded-3xl border border-border/50 shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="h-full flex flex-col">
                    {/* Profile Preview */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center text-4xl">
                        👤
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-bold">Your Profile</h3>
                        <p className="text-muted-foreground text-sm">AI-Enhanced</p>
                      </div>
                      <div className="ml-auto">
                        <span className="inline-flex px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                          98% Match
                        </span>
                      </div>
                    </div>
                    
                    {/* Social Integration Preview */}
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50">
                        <Instagram className="w-5 h-5 text-rose-500" />
                        <span className="text-sm">Instagram Connected</span>
                        <span className="ml-auto text-xs text-primary">✓ 127 interests found</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50">
                        <Linkedin className="w-5 h-5 text-blue-600" />
                        <span className="text-sm">LinkedIn Connected</span>
                        <span className="ml-auto text-xs text-primary">✓ Career analyzed</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50">
                        <Video className="w-5 h-5 text-primary" />
                        <span className="text-sm">Video Persona</span>
                        <span className="ml-auto text-xs text-primary">✓ Adventurer type</span>
                      </div>
                    </div>

                    {/* Personality Tags */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {['Creative', 'Traveler', 'Foodie', 'Tech', 'Music'].map(tag => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating Match Card */}
                <div className="absolute -bottom-8 -left-8 w-64 bg-card rounded-2xl border border-border/50 shadow-xl p-4 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-2xl">
                      💕
                    </div>
                    <div>
                      <p className="font-semibold text-sm">New Match!</p>
                      <p className="text-xs text-muted-foreground">92% compatible</p>
                    </div>
                  </div>
                </div>

                {/* Floating Date Plan Card */}
                <div className="absolute -top-4 -right-8 w-56 bg-card rounded-2xl border border-border/50 shadow-xl p-4 transform rotate-6 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-semibold text-sm">Date Planned!</p>
                      <p className="text-xs text-muted-foreground">Café Matcha, 7 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-24">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl font-bold mb-4">How MATCHA Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Three simple steps to find your perfect match using AI, social intelligence, and emotional analysis.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <StepCard 
                step={1}
                icon={<div className="text-4xl">🔗</div>}
                title="Connect Your Socials"
                description="Link your Instagram or LinkedIn. Our AI extracts your interests, lifestyle, and personality automatically."
                color="from-blue-500 to-indigo-600"
              />
              <StepCard 
                step={2}
                icon={<div className="text-4xl">🎬</div>}
                title="Record Your Vibe"
                description="A 15-second video reveals your emotional persona through facial expression AI analysis."
                color="from-rose-500 to-pink-600"
              />
              <StepCard 
                step={3}
                icon={<div className="text-4xl">💚</div>}
                title="Meet Your Match"
                description="AI finds your top 3 compatible matches and plans the perfect first date for you."
                color="from-primary to-emerald-600"
              />
            </div>
          </div>

          {/* Video Showcase Section */}
          <div className="mt-32 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-rose-500/5 rounded-3xl" />
            <div className="relative p-12 rounded-3xl border border-border/50">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <span className="inline-flex px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 text-sm font-medium mb-4">
                    ✨ Our Secret Sauce
                  </span>
                  <h2 className="font-display text-4xl font-bold mb-6">
                    AI Reads Your <span className="text-gradient-matcha">Emotions</span>
                  </h2>
                  <p className="text-muted-foreground text-lg mb-8">
                    While you answer fun questions on camera, our AI analyzes your facial expressions to determine your unique emotional persona—helping us find someone who truly vibes with you.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { emoji: '🌍', type: 'Adventurer', desc: 'Loves new experiences' },
                      { emoji: '📚', type: 'Intellectual', desc: 'Deep thinker' },
                      { emoji: '🦋', type: 'Social Butterfly', desc: 'Life of the party' },
                      { emoji: '🎨', type: 'Creative', desc: 'Artistic soul' },
                    ].map(persona => (
                      <div key={persona.type} className="p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors">
                        <span className="text-2xl">{persona.emoji}</span>
                        <p className="font-semibold mt-2">{persona.type}</p>
                        <p className="text-xs text-muted-foreground">{persona.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Emotion Detection Preview */}
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-card to-muted rounded-2xl border border-border/50 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
                          <Video className="w-12 h-12 text-primary" />
                        </div>
                        <p className="text-muted-foreground">Live emotion detection</p>
                      </div>
                    </div>
                    
                    {/* Emotion Bars Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 bg-card/90 backdrop-blur rounded-xl p-4">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Detected Emotions</p>
                      <div className="space-y-2">
                        {[
                          { emotion: 'Happy', value: 78, color: 'bg-yellow-500' },
                          { emotion: 'Curious', value: 65, color: 'bg-blue-500' },
                          { emotion: 'Excited', value: 45, color: 'bg-rose-500' },
                        ].map(e => (
                          <div key={e.emotion} className="flex items-center gap-2">
                            <span className="text-xs w-16">{e.emotion}</span>
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div className={`h-full ${e.color} rounded-full transition-all`} style={{ width: `${e.value}%` }} />
                            </div>
                            <span className="text-xs w-8 text-right">{e.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-32 text-center">
            <div className="inline-block p-1 rounded-full bg-gradient-to-r from-primary via-rose-500 to-primary">
              <div className="px-12 py-8 rounded-full bg-background">
                <h2 className="font-display text-4xl font-bold mb-4">Ready to Find Your Perfect Blend?</h2>
                <p className="text-muted-foreground mb-8">Join 2,000+ singles who found their match through MATCHA</p>
                <Link to="/profile">
                  <Button size="lg" className="rounded-full px-12 py-7 text-lg font-bold bg-primary hover:bg-primary/90 shadow-glow">
                    Start Matching Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-8 mt-12">
        <div className="container mx-auto px-6 text-center text-muted-foreground text-sm">
          <p>Made with 💚 for the AI Dating Hackathon</p>
        </div>
      </footer>
    </div>
  );
};

const StepCard = ({ 
  step, 
  icon, 
  title, 
  description, 
  color 
}: { 
  step: number; 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  color: string;
}) => (
  <div className="group relative">
    <div className={`absolute -inset-0.5 bg-gradient-to-r ${color} rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity`} />
    <div className="relative p-8 rounded-2xl bg-card border border-border/50 h-full">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center font-bold">
          {step}
        </div>
        {icon}
      </div>
      <h3 className="font-display text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </div>
);

export default Index;
