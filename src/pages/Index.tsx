import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Calendar, Users, Play, ArrowRight, Instagram, Linkedin, Video, Heart, Star, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import AuthButton from '@/components/AuthButton';
import coupleHero from '@/assets/couple-hero.jpg';

const TAGLINES = [
  "Where Hearts Align",
  "Love, Powered by AI",
  "Your Soulmate Awaits",
  "Chemistry Beyond Swipes",
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
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-[5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute top-32 right-[5%] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 left-[40%] w-[350px] h-[350px] bg-love-coral/8 rounded-full blur-[80px]" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-romantic rounded-2xl blur-md opacity-40 group-hover:opacity-60 transition-opacity" />
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-romantic flex items-center justify-center shadow-glow">
              <Heart className="w-6 h-6 text-primary-foreground" fill="currentColor" />
            </div>
          </div>
          <div>
            <span className="font-display text-2xl font-bold text-foreground tracking-tight">Matcha</span>
            <span className="block text-xs text-muted-foreground tracking-wide">Find Your Match</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <AuthButton />
          <Link to="/profile">
            <Button className="rounded-full bg-gradient-romantic text-primary-foreground hover:opacity-90 font-medium shadow-glow px-5">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6 pt-8 pb-24">
        <div className="max-w-6xl mx-auto">
          {/* Main Hero */}
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[70vh]">
            {/* Left - Text Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                AI-Powered Matching
              </div>
              
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                <span className="text-foreground">Find</span>
                <br />
                <span className="text-gradient-love">True Love</span>
                <br />
                <span className="text-foreground">Effortlessly</span>
              </h1>
              
              <div className={`h-12 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <p className="text-xl md:text-2xl font-display font-medium text-muted-foreground">
                  {TAGLINES[taglineIndex]}
                </p>
              </div>

              <p className="text-base text-muted-foreground max-w-lg leading-relaxed">
                Connect your social profiles, reveal your authentic self through video, and let our AI find your perfect match. No endless swiping—just meaningful connections.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link to="/profile">
                  <Button size="lg" className="rounded-full px-8 py-6 text-base font-semibold bg-gradient-romantic text-primary-foreground hover:opacity-90 shadow-glow transition-all hover:scale-[1.02]">
                    <Heart className="w-5 h-5 mr-2" fill="currentColor" />
                    Start Matching
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-base font-medium border-2 border-border hover:bg-muted/50">
                  <Play className="w-5 h-5 mr-2 text-primary" />
                  How It Works
                </Button>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-4 pt-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((_, i) => (
                    <div key={i} className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                      i % 3 === 0 ? 'from-rose-400 to-pink-500' :
                      i % 3 === 1 ? 'from-violet-400 to-purple-500' :
                      'from-amber-400 to-orange-500'
                    } border-2 border-background shadow-sm`} />
                  ))}
                </div>
                <div>
                  <p className="font-semibold text-foreground">5,000+ couples matched</p>
                  <p className="text-sm text-muted-foreground">Join the community</p>
                </div>
              </div>
            </div>

            {/* Right - Couple Image */}
            <div className="relative hidden lg:block">
              <div className="relative w-full max-w-lg mx-auto">
                {/* Main Image */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src={coupleHero} 
                    alt="Romantic couple in love"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                </div>

                {/* Floating Match Card */}
                <div className="absolute -bottom-6 -left-6 w-72 glass-card rounded-2xl shadow-xl p-5 transform -rotate-6 hover:rotate-0 transition-all duration-500 border border-primary/20">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-romantic flex items-center justify-center animate-heartbeat shadow-glow">
                      <Heart className="w-7 h-7 text-primary-foreground" fill="currentColor" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">New Match Found</p>
                      <p className="text-sm text-muted-foreground">94% compatible</p>
                    </div>
                  </div>
                </div>

                {/* Floating Date Plan Card */}
                <div className="absolute -top-4 -right-6 w-64 glass-card rounded-2xl shadow-xl p-5 transform rotate-6 hover:rotate-0 transition-all duration-500 border border-secondary/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-purple-600 flex items-center justify-center shadow-glow-purple">
                      <Calendar className="w-6 h-6 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="font-bold">Date Planned</p>
                      <p className="text-xs text-muted-foreground">Rooftop dinner at 8 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-32">
            <div className="text-center mb-20">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                <Sparkles className="w-4 h-4" />
                Simple 3-Step Process
              </span>
              <h2 className="font-display text-5xl font-bold mb-6">How the Magic Happens</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our AI combines social intelligence, emotional analysis, and deep compatibility matching to find your perfect partner.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              <StepCard 
                step={1}
                icon={<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center"><Instagram className="w-6 h-6 text-primary-foreground" /></div>}
                title="Connect Your World"
                description="Link Instagram or LinkedIn. Our AI discovers your true interests, lifestyle, and personality automatically."
                gradient="from-pink-500 to-rose-600"
              />
              <StepCard 
                step={2}
                icon={<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center"><Video className="w-6 h-6 text-secondary-foreground" /></div>}
                title="Show Your Authentic Self"
                description="A quick video reveals your emotional persona through advanced facial expression AI analysis."
                gradient="from-purple-500 to-violet-600"
              />
              <StepCard 
                step={3}
                icon={<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center"><Heart className="w-6 h-6 text-primary-foreground" fill="currentColor" /></div>}
                title="Meet Your Match"
                description="AI finds your top compatible matches and even plans the perfect first date for you both."
                gradient="from-rose-500 to-pink-600"
              />
            </div>
          </div>

          {/* Video Showcase Section */}
          <div className="mt-40 relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-[2rem] blur-xl" />
            <div className="relative p-12 rounded-[2rem] glass-card border-2 border-primary/10">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-semibold mb-6">
                    ✨ The Secret Ingredient
                  </span>
                  <h2 className="font-display text-5xl font-bold mb-8">
                    AI That Truly <span className="text-gradient-love">Understands</span> You
                  </h2>
                  <p className="text-lg text-muted-foreground mb-10">
                    While you answer fun prompts on camera, our AI analyzes micro-expressions to understand your authentic emotional style—finding someone who truly resonates with your energy.
                  </p>
                  <div className="grid grid-cols-2 gap-5">
                    {[
                      { icon: <Star className="w-6 h-6" />, type: 'The Dreamer', desc: 'Romantic & imaginative', color: 'from-pink-500/20 to-rose-500/20' },
                      { icon: <Zap className="w-6 h-6" />, type: 'The Passionate', desc: 'Intense & driven', color: 'from-orange-500/20 to-red-500/20' },
                      { icon: <Sparkles className="w-6 h-6" />, type: 'The Free Spirit', desc: 'Adventurous soul', color: 'from-purple-500/20 to-violet-500/20' },
                      { icon: <Heart className="w-6 h-6" />, type: 'The Steady Heart', desc: 'Loyal & dependable', color: 'from-blue-500/20 to-cyan-500/20' },
                    ].map(persona => (
                      <div key={persona.type} className={`p-5 rounded-2xl bg-gradient-to-br ${persona.color} border border-border hover:border-primary/30 transition-all hover:scale-105 cursor-pointer`}>
                        <span className="text-primary">{persona.icon}</span>
                        <p className="font-bold mt-3">{persona.type}</p>
                        <p className="text-sm text-muted-foreground">{persona.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Emotion Detection Preview */}
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-card via-card to-muted/50 rounded-3xl border-2 border-primary/10 overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-28 h-28 rounded-full bg-gradient-romantic flex items-center justify-center mx-auto mb-6 animate-pulse shadow-glow">
                          <Video className="w-14 h-14 text-white" />
                        </div>
                        <p className="text-lg text-muted-foreground font-medium">Real-time emotion detection</p>
                        <p className="text-sm text-muted-foreground mt-1">Captures your authentic personality</p>
                      </div>
                    </div>
                    
                    {/* Emotion Bars Overlay */}
                    <div className="absolute bottom-5 left-5 right-5 glass-card rounded-2xl p-5">
                      <p className="text-sm font-bold text-foreground mb-3">Live Emotion Analysis</p>
                      <div className="space-y-3">
                        {[
                          { emotion: 'Happiness', value: 82, color: 'from-yellow-400 to-orange-500' },
                          { emotion: 'Warmth', value: 75, color: 'from-pink-400 to-rose-500' },
                          { emotion: 'Excitement', value: 58, color: 'from-purple-400 to-violet-500' },
                        ].map(e => (
                          <div key={e.emotion} className="flex items-center gap-3">
                            <span className="text-sm font-medium w-20">{e.emotion}</span>
                            <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                              <div className={`h-full bg-gradient-to-r ${e.color} rounded-full transition-all`} style={{ width: `${e.value}%` }} />
                            </div>
                            <span className="text-sm font-bold w-10 text-right">{e.value}%</span>
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
          <div className="mt-40 text-center relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[600px] h-[600px] bg-gradient-romantic/20 rounded-full blur-[150px]" />
            </div>
            <div className="relative">
              <Heart className="w-16 h-16 text-primary mx-auto mb-6 animate-heartbeat" fill="currentColor" />
              <h2 className="font-display text-5xl md:text-6xl font-bold mb-6">
                Ready to Find <span className="text-gradient-love">The One</span>?
              </h2>
              <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
                Join thousands of singles who found meaningful connections through AI-powered matching
              </p>
              <Link to="/profile">
                <Button size="lg" className="rounded-full px-14 py-8 text-xl font-bold bg-gradient-romantic text-primary-foreground hover:opacity-90 shadow-glow transition-all hover:scale-105">
                  Begin Your Love Story
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </Link>
              <p className="mt-6 text-sm text-muted-foreground">Free to start • No credit card required</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-10 mt-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-6 h-6 text-primary" fill="currentColor" />
            <span className="font-display text-xl font-bold">Matcha</span>
          </div>
          <p className="text-muted-foreground">Made with care for the AI Dating Hackathon</p>
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
  gradient 
}: { 
  step: number; 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  gradient: string;
}) => (
  <div className="group relative">
    <div className={`absolute -inset-1 bg-gradient-to-r ${gradient} rounded-3xl blur-lg opacity-25 group-hover:opacity-50 transition-opacity`} />
    <div className="relative p-10 rounded-3xl glass-card h-full border-2 border-transparent group-hover:border-primary/20 transition-all">
      <div className="absolute -top-5 -left-2 w-12 h-12 rounded-full bg-gradient-romantic flex items-center justify-center text-white font-bold text-lg shadow-glow">
        {step}
      </div>
      <div className="mb-6 mt-4">{icon}</div>
      <h3 className="font-display text-2xl font-bold mb-4">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  </div>
);

export default Index;