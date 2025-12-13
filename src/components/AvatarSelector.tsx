import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AvatarSelectorProps {
  value: string;
  onChange: (avatar: string) => void;
  sex?: string;
}

const AVATAR_STYLES = [
  { id: 'professional', gradient: 'from-slate-600 to-slate-800', label: 'Professional' },
  { id: 'warm', gradient: 'from-amber-600 to-orange-700', label: 'Warm' },
  { id: 'cool', gradient: 'from-blue-600 to-indigo-700', label: 'Cool' },
  { id: 'elegant', gradient: 'from-purple-600 to-violet-800', label: 'Elegant' },
  { id: 'natural', gradient: 'from-emerald-600 to-teal-700', label: 'Natural' },
  { id: 'calm', gradient: 'from-teal-500 to-cyan-700', label: 'Calm' },
];

const SKIN_TONES = [
  { id: 'light', color: '#fad7c4', label: 'Light' },
  { id: 'medium-light', color: '#d9a77c', label: 'Medium Light' },
  { id: 'medium', color: '#c68642', label: 'Medium' },
  { id: 'medium-dark', color: '#8d5524', label: 'Medium Dark' },
  { id: 'dark', color: '#5c3d2e', label: 'Dark' },
];

const HAIR_STYLES = [
  { id: 'short', label: 'Short' },
  { id: 'medium', label: 'Medium' },
  { id: 'long', label: 'Long' },
  { id: 'curly', label: 'Curly' },
];

export const AVATAR_STYLE_MAP: Record<string, string> = {
  'professional': 'from-slate-600 to-slate-800',
  'warm': 'from-amber-600 to-orange-700',
  'cool': 'from-blue-600 to-indigo-700',
  'elegant': 'from-purple-600 to-violet-800',
  'natural': 'from-emerald-600 to-teal-700',
  'calm': 'from-teal-500 to-cyan-700',
};

export const SKIN_TONE_MAP: Record<string, string> = {
  'light': '#fad7c4',
  'medium-light': '#d9a77c',
  'medium': '#c68642',
  'medium-dark': '#8d5524',
  'dark': '#5c3d2e',
};

export interface AvatarDisplayProps {
  avatar?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  hairStyle?: string;
}

export const AvatarDisplay = ({ avatar, size = 'md', className, hairStyle = 'short' }: AvatarDisplayProps) => {
  const parts = avatar?.split('-') || ['natural', 'medium'];
  const styleId = parts[0] || 'natural';
  const skinId = parts[1] || 'medium';
  const hair = parts[2] || hairStyle;
  
  const gradient = AVATAR_STYLE_MAP[styleId] || 'from-emerald-600 to-teal-700';
  const skinColor = SKIN_TONE_MAP[skinId] || '#c68642';
  
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };
  
  const faceSizes = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
  };

  return (
    <div className={cn(
      "rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg overflow-hidden",
      gradient,
      sizeClasses[size],
      className
    )}>
      <div className={cn("relative", faceSizes[size])}>
        <div 
          className="absolute inset-0 rounded-full shadow-inner"
          style={{ backgroundColor: skinColor }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Eyes */}
            <div className={cn("flex mb-1", size === 'lg' ? 'gap-3' : size === 'md' ? 'gap-2' : 'gap-1.5')}>
              <div className={cn("rounded-full bg-slate-800 shadow-sm", size === 'lg' ? 'w-2 h-2' : 'w-1.5 h-1.5')}>
                <div className={cn("rounded-full bg-white", size === 'lg' ? 'w-0.5 h-0.5 mt-0.5 ml-0.5' : 'w-0.5 h-0.5')} />
              </div>
              <div className={cn("rounded-full bg-slate-800 shadow-sm", size === 'lg' ? 'w-2 h-2' : 'w-1.5 h-1.5')}>
                <div className={cn("rounded-full bg-white", size === 'lg' ? 'w-0.5 h-0.5 mt-0.5 ml-0.5' : 'w-0.5 h-0.5')} />
              </div>
            </div>
            {/* Smile */}
            <div className={cn(
              "rounded-b-full border-b-2 border-slate-700/40",
              size === 'lg' ? 'w-4 h-2 mt-1' : size === 'md' ? 'w-3 h-1.5' : 'w-2 h-1'
            )} />
          </div>
        </div>
        {/* Hair */}
        <div 
          className={cn(
            "absolute left-1/2 -translate-x-1/2 bg-slate-800 rounded-t-full",
            hair === 'short' && (size === 'lg' ? "w-12 h-4 -top-1" : size === 'md' ? "w-9 h-3 -top-0.5" : "w-6 h-2 -top-0.5"),
            hair === 'medium' && (size === 'lg' ? "w-14 h-6 -top-1" : size === 'md' ? "w-10 h-4 -top-0.5" : "w-7 h-3 -top-0.5"),
            hair === 'long' && (size === 'lg' ? "w-14 h-8 -top-2" : size === 'md' ? "w-11 h-5 -top-1" : "w-7 h-4 -top-1"),
            hair === 'curly' && (size === 'lg' ? "w-14 h-7 -top-2 rounded-full" : size === 'md' ? "w-10 h-4 -top-1 rounded-full" : "w-7 h-3 -top-0.5 rounded-full")
          )}
          style={{ boxShadow: 'inset 0 -3px 6px rgba(0,0,0,0.3)' }}
        />
      </div>
    </div>
  );
};

const AvatarSelector = ({ value, onChange, sex = 'male' }: AvatarSelectorProps) => {
  const [selectedStyle, setSelectedStyle] = useState(AVATAR_STYLES[4].id);
  const [selectedSkin, setSelectedSkin] = useState(SKIN_TONES[1].id);
  const [selectedHair, setSelectedHair] = useState(HAIR_STYLES[0].id);
  
  const currentStyle = AVATAR_STYLES.find(s => s.id === selectedStyle) || AVATAR_STYLES[4];
  const currentSkin = SKIN_TONES.find(s => s.id === selectedSkin) || SKIN_TONES[1];

  const handleChange = (styleId: string, skinId: string, hairId: string) => {
    setSelectedStyle(styleId);
    setSelectedSkin(skinId);
    setSelectedHair(hairId);
    onChange(`${styleId}-${skinId}-${hairId}`);
  };

  return (
    <div className="space-y-6">
      {/* 3D Avatar Preview */}
      <div className="flex justify-center">
        <div className="relative">
          <AvatarDisplay 
            avatar={`${selectedStyle}-${selectedSkin}-${selectedHair}`} 
            size="lg" 
          />
          {/* Glow Effect */}
          <div className={cn(
            "absolute -inset-2 rounded-3xl bg-gradient-to-br opacity-30 blur-xl -z-10",
            currentStyle.gradient
          )} />
        </div>
      </div>

      {/* Style Selection */}
      <div>
        <p className="text-xs text-muted-foreground mb-3 font-medium">Background Style</p>
        <div className="flex gap-2 justify-center flex-wrap">
          {AVATAR_STYLES.map(style => (
            <button
              key={style.id}
              onClick={() => handleChange(style.id, selectedSkin, selectedHair)}
              className={cn(
                "w-10 h-10 rounded-xl bg-gradient-to-br transition-all duration-200 relative group",
                style.gradient,
                selectedStyle === style.id 
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110" 
                  : "opacity-60 hover:opacity-100 hover:scale-105"
              )}
            >
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {style.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Skin Tone Selection */}
      <div className="pt-4">
        <p className="text-xs text-muted-foreground mb-3 font-medium">Skin Tone</p>
        <div className="flex gap-2 justify-center">
          {SKIN_TONES.map(skin => (
            <button
              key={skin.id}
              onClick={() => handleChange(selectedStyle, skin.id, selectedHair)}
              className={cn(
                "w-8 h-8 rounded-full transition-all duration-200 border-2",
                selectedSkin === skin.id 
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110 border-transparent" 
                  : "border-border hover:scale-105"
              )}
              style={{ backgroundColor: skin.color }}
            />
          ))}
        </div>
      </div>

      {/* Hair Style Selection */}
      <div>
        <p className="text-xs text-muted-foreground mb-3 font-medium">Hair Style</p>
        <div className="flex gap-2 justify-center flex-wrap">
          {HAIR_STYLES.map(hair => (
            <button
              key={hair.id}
              onClick={() => handleChange(selectedStyle, selectedSkin, hair.id)}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-medium transition-all",
                selectedHair === hair.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground"
              )}
            >
              {hair.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvatarSelector;