import { useState } from 'react';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

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
  { id: 'romantic', gradient: 'from-rose-500 to-pink-700', label: 'Romantic' },
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

const AvatarSelector = ({ value, onChange, sex = 'male' }: AvatarSelectorProps) => {
  const [selectedStyle, setSelectedStyle] = useState(AVATAR_STYLES[5].id);
  const [selectedSkin, setSelectedSkin] = useState(SKIN_TONES[1].id);
  const [selectedHair, setSelectedHair] = useState(HAIR_STYLES[0].id);
  
  const currentStyle = AVATAR_STYLES.find(s => s.id === selectedStyle) || AVATAR_STYLES[5];
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
          <div className={cn(
            "w-28 h-28 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-2xl transition-all duration-500 overflow-hidden",
            currentStyle.gradient
          )}>
            {/* 3D Face Representation */}
            <div className="relative w-20 h-20">
              {/* Head Shape */}
              <div 
                className="absolute inset-0 rounded-full shadow-inner"
                style={{ backgroundColor: currentSkin.color }}
              >
                {/* Face Features */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {/* Eyes */}
                  <div className="flex gap-3 mb-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-800 shadow-sm">
                      <div className="w-1 h-1 rounded-full bg-white mt-0.5 ml-0.5" />
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-800 shadow-sm">
                      <div className="w-1 h-1 rounded-full bg-white mt-0.5 ml-0.5" />
                    </div>
                  </div>
                  {/* Nose */}
                  <div className="w-1.5 h-2 rounded-full opacity-30" style={{ backgroundColor: 'rgba(0,0,0,0.15)' }} />
                  {/* Smile */}
                  <div className="w-5 h-2.5 mt-1 rounded-b-full border-b-2 border-slate-700/40" />
                </div>
              </div>
              {/* Hair */}
              <div 
                className={cn(
                  "absolute -top-1 left-1/2 -translate-x-1/2 bg-slate-800 rounded-t-full",
                  selectedHair === 'short' && "w-14 h-5",
                  selectedHair === 'medium' && "w-16 h-7",
                  selectedHair === 'long' && "w-18 h-10 -top-2",
                  selectedHair === 'curly' && "w-16 h-8 rounded-full -top-2"
                )}
                style={{
                  boxShadow: 'inset 0 -3px 6px rgba(0,0,0,0.3)'
                }}
              />
            </div>
          </div>
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