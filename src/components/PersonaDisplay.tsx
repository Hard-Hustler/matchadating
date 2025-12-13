import { PersonaResult } from './VideoEmotionCapture';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, User, MessageCircle, Heart } from 'lucide-react';

interface PersonaDisplayProps {
  persona: PersonaResult;
}

const personaIcons: Record<PersonaResult['personaType'], string> = {
  'Adventurer': '🌍',
  'Intellectual': '📚',
  'Social Butterfly': '🦋',
  'Homebody': '🏠',
  'Creative': '🎨',
  'Romantic': '💕',
};

const personaColors: Record<PersonaResult['personaType'], string> = {
  'Adventurer': 'from-orange-500 to-amber-500',
  'Intellectual': 'from-blue-500 to-indigo-500',
  'Social Butterfly': 'from-pink-500 to-rose-500',
  'Homebody': 'from-green-500 to-emerald-500',
  'Creative': 'from-purple-500 to-violet-500',
  'Romantic': 'from-rose-500 to-pink-500',
};

export const PersonaDisplay = ({ persona }: PersonaDisplayProps) => {
  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      happy: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300',
      sad: 'bg-blue-500/20 text-blue-700 dark:text-blue-300',
      angry: 'bg-red-500/20 text-red-700 dark:text-red-300',
      fearful: 'bg-purple-500/20 text-purple-700 dark:text-purple-300',
      disgusted: 'bg-green-500/20 text-green-700 dark:text-green-300',
      surprised: 'bg-orange-500/20 text-orange-700 dark:text-orange-300',
      neutral: 'bg-gray-500/20 text-gray-700 dark:text-gray-300',
    };
    return colors[emotion] || 'bg-muted text-muted-foreground';
  };

  return (
    <Card className="overflow-hidden">
      <div className={`h-2 bg-gradient-to-r ${personaColors[persona.personaType]}`} />
      
      <CardHeader className="text-center pb-2">
        <div className="text-4xl mb-2">{personaIcons[persona.personaType]}</div>
        <CardTitle className="font-display text-2xl">
          You're a {persona.personaType}!
        </CardTitle>
        <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
          <Sparkles className="w-4 h-4 text-primary" />
          {Math.round(persona.confidence * 100)}% confidence
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Traits */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Your Traits</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {persona.traits.map(trait => (
              <Badge key={trait} variant="secondary" className="text-xs">
                {trait}
              </Badge>
            ))}
          </div>
        </div>

        {/* Communication Style */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Communication Style</span>
          </div>
          <p className="text-sm text-muted-foreground">{persona.communicationStyle}</p>
        </div>

        {/* Dominant Emotions */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Emotional Profile</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {persona.dominantEmotions.map(emotion => (
              <Badge 
                key={emotion} 
                className={`${getEmotionColor(emotion)} capitalize`}
              >
                {emotion}
              </Badge>
            ))}
          </div>
        </div>

        {/* Emotion Breakdown */}
        <div className="pt-4 border-t">
          <p className="text-xs font-medium text-muted-foreground mb-3">Emotion Analysis</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(persona.emotionProfile)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 4)
              .map(([emotion, value]) => (
                <div key={emotion} className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${personaColors[persona.personaType]}`}
                      style={{ width: `${value * 100}%` }}
                    />
                  </div>
                  <span className="text-xs capitalize w-16">{emotion}</span>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonaDisplay;
