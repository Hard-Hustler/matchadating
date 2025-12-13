import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AvatarSelectorProps {
  value: string;
  onChange: (avatar: string) => void;
  sex?: string;
}

const AVATAR_STYLES = [
  { id: 'style1', gradient: 'from-violet-500 to-fuchsia-500' },
  { id: 'style2', gradient: 'from-rose-500 to-orange-400' },
  { id: 'style3', gradient: 'from-cyan-500 to-blue-500' },
  { id: 'style4', gradient: 'from-emerald-500 to-teal-500' },
  { id: 'style5', gradient: 'from-amber-500 to-pink-500' },
  { id: 'style6', gradient: 'from-indigo-500 to-purple-500' },
];

const AVATAR_ACCESSORIES = ['none', 'glasses', 'earrings', 'hat', 'headphones'];

const getAvatarEmoji = (sex: string, accessory: string): string => {
  const base = sex === 'female' ? '👩' : sex === 'male' ? '👨' : '🧑';
  
  switch (accessory) {
    case 'glasses':
      return sex === 'female' ? '👩‍🦰' : sex === 'male' ? '👨‍🦱' : '🧑‍🦱';
    case 'earrings':
      return '💎';
    case 'hat':
      return '🎩';
    case 'headphones':
      return '🎧';
    default:
      return base;
  }
};

const AvatarSelector = ({ value, onChange, sex = 'male' }: AvatarSelectorProps) => {
  const [selectedStyle, setSelectedStyle] = useState(AVATAR_STYLES[0].id);
  const [selectedAccessory, setSelectedAccessory] = useState('none');
  
  const currentStyle = AVATAR_STYLES.find(s => s.id === selectedStyle) || AVATAR_STYLES[0];

  const handleChange = (styleId: string, accessory: string) => {
    setSelectedStyle(styleId);
    setSelectedAccessory(accessory);
    onChange(`${styleId}-${accessory}`);
  };

  return (
    <div className="space-y-4">
      {/* Preview */}
      <div className="flex justify-center">
        <div className={cn(
          "w-24 h-24 rounded-2xl bg-gradient-to-br flex items-center justify-center text-4xl shadow-lg transition-all duration-300",
          currentStyle.gradient
        )}>
          {getAvatarEmoji(sex, selectedAccessory)}
          {selectedAccessory !== 'none' && selectedAccessory !== 'glasses' && (
            <span className="absolute -top-1 -right-1 text-lg">
              {selectedAccessory === 'earrings' ? '✨' : selectedAccessory === 'hat' ? '🎩' : '🎧'}
            </span>
          )}
        </div>
      </div>

      {/* Color Styles */}
      <div>
        <p className="text-xs text-muted-foreground mb-2">Choose your vibe ✨</p>
        <div className="flex gap-2 justify-center">
          {AVATAR_STYLES.map(style => (
            <button
              key={style.id}
              onClick={() => handleChange(style.id, selectedAccessory)}
              className={cn(
                "w-10 h-10 rounded-xl bg-gradient-to-br transition-all duration-200",
                style.gradient,
                selectedStyle === style.id 
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110" 
                  : "opacity-60 hover:opacity-100"
              )}
            />
          ))}
        </div>
      </div>

      {/* Accessories */}
      <div>
        <p className="text-xs text-muted-foreground mb-2">Add some flair 💫</p>
        <div className="flex gap-2 justify-center flex-wrap">
          {AVATAR_ACCESSORIES.map(acc => (
            <button
              key={acc}
              onClick={() => handleChange(selectedStyle, acc)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                selectedAccessory === acc
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground"
              )}
            >
              {acc === 'none' ? 'None' : acc.charAt(0).toUpperCase() + acc.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvatarSelector;
