import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Calendar, Users, Play, ArrowRight, Instagram, Linkedin, Video, Heart, Star, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

const TAGLINES = [
  "Where Hearts Align ✨",
  "Love, Powered by AI 💕",
  "Your Soulmate Awaits...",
  "Chemistry Beyond Swipes 💫",
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
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-[5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-32 right-[5%] w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-10 left-[40%] w-[350px] h-[350px] bg-love-coral/15 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        {/* Floating Hearts Animation */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${5 + i * 8}%`,
              top: `${10 + (i % 4) * 20}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${5 + i * 0.5}s`,
            }}
          >
            <Heart 
              className={`${i % 3 === 0 ? 'text-primary/30' : i % 3 === 1 ? 'text-secondary/25' : 'text-love-coral/20'}`}
              style={{ width: `${18 + i * 3}px`, height: `${18 + i * 3}px` }}
              fill="currentColor"
            />
          </div>
        ))}

        {/* Sparkles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="absolute animate-sparkle"
            style={{
              left: `${10 + i * 12}%`,
              top: `${15 + (i % 3) * 30}%`,
              animationDelay: `${i * 0.3}s`,
            }}
          >
            <Star className="text-love-gold/40 w-4 h-4" fill="currentColor" />
          </div>
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-romantic rounded-2xl blur-md opacity-60 group-hover:opacity-80 transition-opacity" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-romantic flex items-center justify-center shadow-glow">
              <Heart className="w-7 h-7 text-primary-foreground animate-heartbeat" fill="currentColor" />
            </div>
          </div>
          <div>
            <span className="font-display text-3xl font-bold text-foreground tracking-tight">Matcha</span>
            <span className="block text-xs text-muted-foreground tracking-widest uppercase">Find Your Match</span>
          </div>
        </div>
        <Link to="/profile">
          <Button className="rounded-full bg-gradient-romantic text-primary-foreground hover:opacity-90 font-semibold shadow-glow px-6">
            Start Your Journey
            <Heart className="w-4 h-4 ml-2" fill="currentColor" />
          </Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6 pt-8 pb-24">
        <div className="max-w-6xl mx-auto">
          {/* Main Hero */}
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[75vh]">
            {/* Left - Text Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 text-primary text-sm font-semibold">
                <Sparkles className="w-4 h-4" />
                AI-Powered Love Discovery
                <Zap className="w-4 h-4 text-love-gold" />
              </div>
              
              <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05]">
                <span className="text-foreground">Find</span>
                <br />
                <span className="text-gradient-love">True Love</span>
                <br />
                <span className="text-foreground italic">Effortlessly</span>
              </h1>
              
              <div className={`h-16 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <p className="text-2xl md:text-3xl font-display font-medium text-muted-foreground italic">
                  {TAGLINES[taglineIndex]}
                </p>
              </div>

              <p className="text-lg text-muted-foreground max-w-lg">
                Connect your social profiles, reveal your authentic self through video, and let our AI find your perfect match. No endless swiping—just meaningful connections.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/profile">
                  <Button size="lg" className="rounded-full px-10 py-7 text-lg font-bold bg-gradient-romantic text-primary-foreground hover:opacity-90 shadow-glow transition-all hover:scale-105 group">
                    <Heart className="w-5 h-5 mr-2 group-hover:animate-heartbeat" fill="currentColor" />
                    Find Your Soulmate
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="rounded-full px-8 py-7 text-lg font-semibold border-2 border-primary/30 hover:bg-primary/5 hover:border-primary/50 group">
                  <Play className="w-5 h-5 mr-2 text-primary group-hover:scale-110 transition-transform" />
                  See How It Works
                </Button>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-5 pt-8">
                <div className="flex -space-x-4">
                  {['💑', '👫', '💕', '🥰', '💏'].map((emoji, i) => (
                    <div key={i} className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-xl border-3 border-background shadow-soft">
                      {emoji}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="font-bold text-foreground text-lg">5,000+ couples matched</p>
                  <p className="text-muted-foreground">Join the love revolution 💘</p>
                </div>
              </div>
            </div>

            {/* Right - Creative Visual */}
            <div className="relative hidden lg:block">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                {/* Main Card */}
                <div className="absolute inset-0 glass-card rounded-3xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-all duration-500">
                  <div className="h-full flex flex-col">
                    {/* Profile Preview */}
                    <div className="flex items-center gap-5 mb-8">
                      <div className="w-24 h-24 rounded-2xl bg-gradient-romantic flex items-center justify-center text-5xl shadow-glow">
                        👤
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display text-2xl font-bold">Your Profile</h3>
                        <p className="text-muted-foreground">AI-Enhanced Match</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex">
                            {[1,2,3,4,5].map(i => (
                              <Star key={i} className="w-4 h-4 text-love-gold" fill="currentColor" />
                            ))}
                          </div>
                          <span className="text-sm text-love-gold font-semibold">Premium</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Social Integration Preview */}
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                          <Instagram className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <span className="font-semibold">Instagram Connected</span>
                          <p className="text-xs text-muted-foreground">127 interests discovered</p>
                        </div>
                        <span className="text-xs text-primary font-semibold">✓</span>
                      </div>
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                          <Linkedin className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <span className="font-semibold">LinkedIn Connected</span>
                          <p className="text-xs text-muted-foreground">Career path analyzed</p>
                        </div>
                        <span className="text-xs text-primary font-semibold">✓</span>
                      </div>
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
                        <div className="w-10 h-10 rounded-xl bg-gradient-romantic flex items-center justify-center">
                          <Video className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <span className="font-semibold">Video Persona</span>
                          <p className="text-xs text-muted-foreground">Romantic Soul detected</p>
                        </div>
                        <span className="text-xs text-primary font-semibold">✓</span>
                      </div>
                    </div>

                    {/* Match Score */}
                    <div className="mt-6 p-4 rounded-2xl bg-gradient-romantic/10 border border-primary/20 text-center">
                      <p className="text-sm text-muted-foreground mb-1">Compatibility Score</p>
                      <p className="font-display text-4xl font-bold text-gradient-love">98%</p>
                    </div>
                  </div>
                </div>

                {/* Floating Match Card */}
                <div className="absolute -bottom-6 -left-6 w-72 glass-card rounded-2xl shadow-xl p-5 transform -rotate-6 hover:rotate-0 transition-all duration-500 border-2 border-primary/20">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-romantic flex items-center justify-center text-2xl animate-heartbeat shadow-glow">
                      💕
                    </div>
                    <div>
                      <p className="font-bold text-lg">New Match Found!</p>
                      <p className="text-sm text-muted-foreground">94% compatible • 2 mi away</p>
                    </div>
                  </div>
                </div>

                {/* Floating Date Plan Card */}
                <div className="absolute -top-4 -right-6 w-64 glass-card rounded-2xl shadow-xl p-5 transform rotate-6 hover:rotate-0 transition-all duration-500 border-2 border-secondary/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-purple-600 flex items-center justify-center shadow-glow-purple">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold">Date Planned!</p>
                      <p className="text-xs text-muted-foreground">Rooftop dinner • Tonight 8 PM</p>
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
                icon={<div className="text-5xl">🔗</div>}
                title="Connect Your World"
                description="Link Instagram or LinkedIn. Our AI discovers your true interests, lifestyle, and personality automatically."
                gradient="from-pink-500 to-rose-600"
              />
              <StepCard 
                step={2}
                icon={<div className="text-5xl">🎬</div>}
                title="Show Your Authentic Self"
                description="A quick video reveals your emotional persona through advanced facial expression AI analysis."
                gradient="from-purple-500 to-violet-600"
              />
              <StepCard 
                step={3}
                icon={<div className="text-5xl">💘</div>}
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
                      { emoji: '💫', type: 'The Dreamer', desc: 'Romantic & imaginative', color: 'from-pink-500/20 to-rose-500/20' },
                      { emoji: '🔥', type: 'The Passionate', desc: 'Intense & driven', color: 'from-orange-500/20 to-red-500/20' },
                      { emoji: '🦋', type: 'The Free Spirit', desc: 'Adventurous soul', color: 'from-purple-500/20 to-violet-500/20' },
                      { emoji: '💎', type: 'The Steady Heart', desc: 'Loyal & dependable', color: 'from-blue-500/20 to-cyan-500/20' },
                    ].map(persona => (
                      <div key={persona.type} className={`p-5 rounded-2xl bg-gradient-to-br ${persona.color} border border-primary/10 hover:border-primary/30 transition-all hover:scale-105 cursor-pointer`}>
                        <span className="text-3xl">{persona.emoji}</span>
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
          <p className="text-muted-foreground">Made with 💕 for the AI Dating Hackathon</p>
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