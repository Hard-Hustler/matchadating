import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Calendar, Users, Play, ArrowRight, Instagram, Linkedin, Video, Heart, Star, Zap, Quote } from 'lucide-react';
import { useState, useEffect } from 'react';
import AuthButton from '@/components/AuthButton';
import coupleHero from '@/assets/couple-hero.jpg';
import { motion } from 'framer-motion';

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Navigation - Minimal floating nav */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 bg-background/80 backdrop-blur-md border-b border-border/30"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <motion.div 
            className="relative group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-romantic flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" fill="currentColor" />
            </div>
          </motion.div>
          <span className="font-display text-xl font-bold text-foreground">Matcha</span>
        </div>
        
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AuthButton />
          <Link to="/profile">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="rounded-full bg-gradient-romantic text-primary-foreground hover:opacity-90 font-medium px-5">
                Get Started
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </motion.nav>

      {/* Hero Section - Full Bleed Image with Overlay Text (Hinge Style) */}
      <section className="relative h-screen min-h-[700px]">
        {/* Full bleed background image */}
        <div className="absolute inset-0">
          <img 
            src={coupleHero} 
            alt="Happy couple"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-end pb-24 md:pb-32">
          <div className="container mx-auto px-6 md:px-12">
            <motion.div 
              className="max-w-2xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] text-foreground mb-6">
                The dating app
                <br />
                <span className="text-gradient-love">designed to be</span>
                <br />
                deleted.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg mb-8">
                AI-powered matching that understands who you really are. No endless swiping—just meaningful connections.
              </p>
              <Link to="/profile">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" className="rounded-full px-10 py-7 text-lg font-semibold bg-gradient-romantic text-primary-foreground hover:opacity-90 shadow-glow">
                    Start Matching
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="py-32 bg-muted/30">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-sm font-semibold text-primary uppercase tracking-wider mb-4 block">Our Approach</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Go on your last
                <br />
                <span className="text-gradient-love">first date.</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Matcha is built on the belief that anyone looking for love should be able to find it. Our AI combines social intelligence, emotional analysis, and deep compatibility matching—so we can succeed in getting you out on promising dates, not keeping you on the app.
              </p>
              <Link to="/profile" className="inline-flex items-center text-primary font-semibold hover:underline underline-offset-4">
                How we do it
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="grid grid-cols-2 gap-4">
                <StepCard 
                  icon={<Instagram className="w-6 h-6" />}
                  title="Connect"
                  description="Link your socials"
                  gradient="from-pink-500 to-rose-600"
                />
                <StepCard 
                  icon={<Video className="w-6 h-6" />}
                  title="Reveal"
                  description="Show your true self"
                  gradient="from-purple-500 to-violet-600"
                />
                <StepCard 
                  icon={<Sparkles className="w-6 h-6" />}
                  title="Match"
                  description="AI finds your person"
                  gradient="from-secondary to-purple-600"
                />
                <StepCard 
                  icon={<Calendar className="w-6 h-6" />}
                  title="Date"
                  description="Perfect plan, ready"
                  gradient="from-rose-500 to-pink-600"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* We're Love Scientists Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="container mx-auto px-6 md:px-12 relative">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-sm font-semibold text-secondary uppercase tracking-wider mb-4 block">The Science of Love</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              We're <span className="text-gradient-love">love scientists.</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Our AI researchers and behavioral analysts study compatibility so we can make Matcha better for you. We've gotten pretty good at it.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: <Star className="w-7 h-7" />, type: 'The Dreamer', desc: 'Romantic & imaginative', color: 'from-pink-500/20 to-rose-500/20' },
              { icon: <Zap className="w-7 h-7" />, type: 'The Passionate', desc: 'Intense & driven', color: 'from-orange-500/20 to-red-500/20' },
              { icon: <Sparkles className="w-7 h-7" />, type: 'The Free Spirit', desc: 'Adventurous soul', color: 'from-purple-500/20 to-violet-500/20' },
              { icon: <Heart className="w-7 h-7" />, type: 'The Steady Heart', desc: 'Loyal & dependable', color: 'from-blue-500/20 to-cyan-500/20' },
            ].map((persona, i) => (
              <motion.div 
                key={persona.type} 
                className={`p-6 rounded-2xl bg-gradient-to-br ${persona.color} border border-border/50 hover:border-primary/30 transition-all hover:scale-105 cursor-pointer text-center`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-primary mb-4 flex justify-center">{persona.icon}</div>
                <p className="font-bold text-lg mb-1">{persona.type}</p>
                <p className="text-sm text-muted-foreground">{persona.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section (Hinge Style) */}
      <section className="py-32 bg-muted/30">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider mb-4 block">Success Stories</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold">What Our Users Say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Other dating apps were like shooting fish in a barrel. But my partner and I clicked right away on Matcha, and the conversation was effortless. We've been together for over a year.",
                author: "Jake C."
              },
              {
                quote: "Thank you Matcha! We're getting married in a few months! The AI really understood what we were both looking for.",
                author: "Kathryn B. & Nik N."
              },
              {
                quote: "The video prompts really made the difference—I felt like I got a good sense of someone's vibe, and it was easy to jump right into a real conversation.",
                author: "Diana V."
              }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                className="relative p-8 rounded-3xl bg-card border border-border/50 hover:border-primary/20 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <Quote className="w-10 h-10 text-primary/20 mb-4" />
                <blockquote className="text-foreground mb-6 leading-relaxed italic">
                  "{testimonial.quote}"
                </blockquote>
                <p className="font-semibold text-primary">{testimonial.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[800px] h-[800px] bg-gradient-romantic/20 rounded-full blur-[200px]" />
        </div>
        <div className="container mx-auto px-6 md:px-12 relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Heart className="w-16 h-16 text-primary mx-auto mb-8 animate-heartbeat" fill="currentColor" />
            <h2 className="font-display text-5xl md:text-6xl font-bold mb-6">
              Let's work <span className="text-gradient-love">together.</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
              We're looking for people who want to make dating meaningful, not addictive.
            </p>
            <Link to="/profile">
              <Button size="lg" className="rounded-full px-14 py-8 text-xl font-bold bg-gradient-romantic text-primary-foreground hover:opacity-90 shadow-glow transition-all hover:scale-105">
                Begin Your Story
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </Link>
            <p className="mt-6 text-sm text-muted-foreground">Free to start • No credit card required</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-12 bg-muted/20">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-6 h-6 text-primary" fill="currentColor" />
            <span className="font-display text-xl font-bold">Matcha</span>
          </div>
          <p className="text-muted-foreground mb-8">Made with ❤️ for the AI Dating Hackathon</p>
          
          <div className="border-t border-border/30 pt-6">
            <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider font-medium">Team</p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <span className="text-sm font-medium text-foreground/80">Hardik Amarwani</span>
              <span className="text-muted-foreground/40">•</span>
              <span className="text-sm font-medium text-foreground/80">Drishya Shrestha</span>
              <span className="text-muted-foreground/40">•</span>
              <span className="text-sm font-medium text-foreground/80">Mark Hrytchak</span>
              <span className="text-muted-foreground/40">•</span>
              <span className="text-sm font-medium text-foreground/80">Rohith Surya</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const StepCard = ({ 
  icon, 
  title, 
  description, 
  gradient 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  gradient: string;
}) => (
  <motion.div 
    className="group relative p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all"
    whileHover={{ scale: 1.05, y: -5 }}
  >
    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-4`}>
      {icon}
    </div>
    <h3 className="font-bold text-lg mb-1">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </motion.div>
);

export default Index;
