import { Link, useLocation } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthButton from '@/components/AuthButton';

const Header = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-romantic rounded-xl blur-md opacity-40 group-hover:opacity-60 transition-opacity" />
            <div className="relative w-10 h-10 rounded-xl bg-gradient-romantic flex items-center justify-center shadow-glow">
              <Heart className="w-5 h-5 text-primary-foreground" fill="currentColor" />
            </div>
          </div>
          <div>
            <span className="font-display text-xl font-bold text-foreground">Matcha</span>
            <span className="hidden sm:block text-[10px] text-muted-foreground tracking-wide">Find Your Match</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Home
          </Link>
          <Link 
            to="/profile" 
            className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/profile' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Profile
          </Link>
          <Link 
            to="/matches" 
            className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/matches' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Matches
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <AuthButton />
          {!isHome && (
            <Link to="/profile">
              <Button size="sm" className="rounded-full bg-gradient-romantic text-primary-foreground hover:opacity-90 shadow-glow">
                Get Started
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;