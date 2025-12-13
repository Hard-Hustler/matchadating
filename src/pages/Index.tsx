import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, Calendar, Users } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />

      <nav className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-glow">
            <Heart className="w-5 h-5 text-primary-foreground" fill="currentColor" />
          </div>
          <span className="font-display text-2xl font-bold text-foreground">MATCHA</span>
        </div>
        <Link to="/profile">
          <Button variant="outline" className="rounded-full border-primary/30 hover:bg-primary/10">Get Started</Button>
        </Link>
      </nav>

      <main className="relative z-10 container mx-auto px-6 pt-16 pb-24 md:pt-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            AI-Powered Dating Revolution
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
            <span className="text-gradient-matcha">MATCHA</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 font-display">Where AI Finds Your Perfect Match</p>
          <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto mb-12">
            Our advanced AI analyzes personality, values, and communication styles to find your most compatible matches—then plans the perfect first date.
          </p>

          <Link to="/profile">
            <Button size="lg" className="rounded-full px-8 py-6 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-glow transition-all hover:scale-105">
              <Heart className="w-5 h-5 mr-2" />
              Find Your Match
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-24 max-w-5xl mx-auto">
          <FeatureCard icon={<Sparkles className="w-6 h-6" />} title="AI-Powered Matching" description="Deep personality analysis using advanced AI to find truly compatible partners." />
          <FeatureCard icon={<Users className="w-6 h-6" />} title="Persona Detection" description="Optional video analysis to understand your unique communication style." />
          <FeatureCard icon={<Calendar className="w-6 h-6" />} title="Smart Date Planning" description="AI-generated personalized date plans with restaurants, activities, and conversation starters." />
        </div>
      </main>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="group p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all hover:shadow-soft">
    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
      {icon}
    </div>
    <h3 className="font-display text-lg font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm">{description}</p>
  </div>
);

export default Index;
