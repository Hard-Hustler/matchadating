import { Profile, mockProfiles } from './mockProfiles';
import { PersonaResult } from '@/components/VideoEmotionCapture';

export interface MatchResult {
  profile: Profile;
  compatibilityScore: number;
  reasoning: string;
  commonValues: string[];
  distanceMiles: number;
  personaMatch?: {
    matchType: string;
    bonus: number;
  };
}

export interface DatePlan {
  matchName: string;
  restaurant: {
    name: string;
    cuisine: string;
    vibe: string;
    location: string;
  };
  itinerary: {
    time: string;
    activity: string;
    location: string;
    icon: string;
  }[];
  conversationStarters: string[];
  tips: string[];
}

const cityDistances: Record<string, Record<string, number>> = {
  "San Francisco": { "San Francisco": 0, "Oakland": 8.5, "Berkeley": 12.3, "San Jose": 48.2 },
  "Oakland": { "San Francisco": 8.5, "Oakland": 0, "Berkeley": 4.1, "San Jose": 41.5 },
  "Berkeley": { "San Francisco": 12.3, "Oakland": 4.1, "Berkeley": 0, "San Jose": 45.8 },
  "San Jose": { "San Francisco": 48.2, "Oakland": 41.5, "Berkeley": 45.8, "San Jose": 0 },
};

const getDistance = (loc1: string, loc2: string): number => {
  return cityDistances[loc1]?.[loc2] ?? Math.random() * 30 + 5;
};

// Persona compatibility matrix - which personas work well together
const personaCompatibility: Record<string, string[]> = {
  'Adventurer': ['Adventurer', 'Creative', 'Social Butterfly'],
  'Intellectual': ['Intellectual', 'Creative', 'Romantic'],
  'Social Butterfly': ['Social Butterfly', 'Adventurer', 'Creative'],
  'Homebody': ['Homebody', 'Romantic', 'Intellectual'],
  'Creative': ['Creative', 'Adventurer', 'Intellectual', 'Romantic'],
  'Romantic': ['Romantic', 'Creative', 'Homebody', 'Intellectual'],
};

// Mock personas for profiles without video (simulate detected personas)
const mockPersonasForProfiles: Record<string, PersonaResult['personaType']> = {
  '1': 'Adventurer',
  '2': 'Romantic',
  '3': 'Intellectual',
  '4': 'Social Butterfly',
  '5': 'Creative',
  '6': 'Homebody',
  '7': 'Adventurer',
  '8': 'Romantic',
};

const compatibilityReasons = [
  "Both value deep, meaningful conversations and share a passion for personal growth. Your communication styles complement each other beautifully.",
  "Shared love for outdoor adventures and healthy living creates a strong foundation. Both prioritize work-life balance and authenticity.",
  "Creative spirits who appreciate art and self-expression. Your shared interests in culture and community would spark endless conversations.",
  "Both driven and ambitious while knowing how to unwind. Your energies would balance and inspire each other.",
  "Intellectual curiosity runs deep in both of you. Shared values around learning and growth would keep the spark alive.",
  "Kindness and empathy are core to both of you. Your caring natures would create a supportive, nurturing relationship.",
  "Adventure seekers at heart with appreciation for quiet moments. You'd push each other to grow while providing comfort.",
  "Both passionate about making a difference in the world. Your shared values would create a powerful partnership."
];

const personaReasonings: Record<string, string> = {
  'Adventurer-Adventurer': "Two adventurous spirits who'll never run out of exciting experiences to share!",
  'Adventurer-Creative': "Your spontaneity combined with their creativity makes for an inspiring, never-boring connection.",
  'Adventurer-Social Butterfly': "Together you'll have the most exciting social life and create unforgettable memories.",
  'Intellectual-Intellectual': "Deep conversations and shared curiosity will keep you both mentally stimulated for years.",
  'Intellectual-Creative': "Your analytical mind and their creative vision complement each other perfectly.",
  'Intellectual-Romantic': "Your thoughtful nature meets their emotional depth for a profoundly connected relationship.",
  'Social Butterfly-Social Butterfly': "The life of every party together - your social energies amplify each other!",
  'Social Butterfly-Creative': "Their artistic flair and your social grace make you the ultimate power couple.",
  'Homebody-Homebody': "Cozy nights in, meaningful conversations, and building a beautiful life together at home.",
  'Homebody-Romantic': "Your love of comfort meets their romantic nature for the coziest, most loving relationship.",
  'Creative-Creative': "Two artistic souls who'll inspire each other endlessly and create something beautiful together.",
  'Creative-Romantic': "Art and love intertwined - your creative expressions of love will be legendary.",
  'Romantic-Romantic': "A love story waiting to be written - you both speak the language of the heart.",
};

const commonValueSets = [
  ["authenticity", "growth", "adventure"],
  ["creativity", "community", "passion"],
  ["ambition", "balance", "humor"],
  ["curiosity", "kindness", "independence"],
  ["wellness", "nature", "connection"],
  ["art", "expression", "freedom"],
  ["family", "stability", "joy"],
  ["innovation", "purpose", "fun"]
];

export const generateMatches = (
  userProfile: Partial<Profile> & { persona?: PersonaResult }, 
  count: number = 3
): MatchResult[] => {
  const availableProfiles = mockProfiles.filter(p => {
    if (userProfile.orientation === "straight") {
      return p.sex !== userProfile.sex;
    }
    if (userProfile.orientation === "gay" || userProfile.orientation === "lesbian") {
      return p.sex === userProfile.sex;
    }
    return true;
  });

  const shuffled = [...availableProfiles].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, Math.min(count + 2, shuffled.length)); // Get extra for sorting

  const results = selected.map((profile, index) => {
    let baseScore = 70 + Math.random() * 15;
    
    // Interest bonus
    const interestBonus = userProfile.interests?.some(i => 
      profile.interests.some(pi => pi.toLowerCase().includes(i.toLowerCase()))
    ) ? 5 : 0;
    
    // Location bonus
    const locationBonus = profile.location === userProfile.location ? 3 : 0;
    
    // PERSONA MATCHING BONUS
    let personaMatch: { matchType: string; bonus: number } | undefined;
    
    if (userProfile.persona) {
      const userPersona = userProfile.persona.personaType;
      const matchPersona = mockPersonasForProfiles[profile.id] || 'Creative';
      
      const compatiblePersonas = personaCompatibility[userPersona] || [];
      
      if (matchPersona === userPersona) {
        // Same persona - high compatibility
        personaMatch = { matchType: `${userPersona} + ${matchPersona}`, bonus: 12 };
      } else if (compatiblePersonas.includes(matchPersona)) {
        // Compatible persona
        personaMatch = { matchType: `${userPersona} + ${matchPersona}`, bonus: 8 };
      } else {
        // Less compatible but could work
        personaMatch = { matchType: `${userPersona} + ${matchPersona}`, bonus: 3 };
      }
    }
    
    const personaBonus = personaMatch?.bonus || 0;
    const score = Math.min(99, Math.round(baseScore + interestBonus + locationBonus + personaBonus));
    
    // Generate persona-aware reasoning
    let reasoning = compatibilityReasons[index % compatibilityReasons.length];
    
    if (personaMatch && userProfile.persona) {
      const userPersona = userProfile.persona.personaType;
      const matchPersona = mockPersonasForProfiles[profile.id] || 'Creative';
      const personaKey = `${userPersona}-${matchPersona}`;
      const reverseKey = `${matchPersona}-${userPersona}`;
      
      const personaReason = personaReasonings[personaKey] || personaReasonings[reverseKey];
      if (personaReason) {
        reasoning = personaReason + " " + reasoning;
      }
    }
    
    return {
      profile,
      compatibilityScore: score,
      reasoning,
      commonValues: commonValueSets[index % commonValueSets.length],
      distanceMiles: getDistance(userProfile.location || "San Francisco", profile.location),
      personaMatch,
    };
  })
  .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
  .slice(0, count);

  return results;
};

export const generateDatePlan = (user: Partial<Profile> & { persona?: PersonaResult }, match: Profile): DatePlan => {
  const location = user.location || match.location;
  
  // Persona-specific restaurant suggestions
  const restaurants = [
    { name: "Café Matcha", cuisine: "Japanese Fusion", vibe: "Cozy, modern, conversation-friendly" },
    { name: "The Garden Table", cuisine: "Farm-to-Table", vibe: "Romantic, intimate, locally-sourced" },
    { name: "Luna's Kitchen", cuisine: "Mediterranean", vibe: "Warm, lively, perfect for sharing plates" },
    { name: "Ember & Oak", cuisine: "Modern American", vibe: "Sophisticated, relaxed, great wine list" }
  ];

  const activities = [
    { time: "6:00 PM", activity: "Meet for artisan coffee or tea", location: "Blue Bottle Coffee", icon: "coffee" },
    { time: "6:30 PM", activity: "Stroll through the local art gallery", location: "SFMOMA Gallery Walk", icon: "palette" },
    { time: "7:30 PM", activity: "Dinner with great conversation", location: restaurants[0].name, icon: "utensils" },
    { time: "9:00 PM", activity: "Evening walk through the park", location: "Dolores Park", icon: "trees" },
    { time: "9:30 PM", activity: "Optional: Dessert if the date is going well", location: "Bi-Rite Creamery", icon: "ice-cream" }
  ];

  const sharedInterest = user.interests?.find(i => 
    match.interests.some(mi => mi.toLowerCase().includes(i.toLowerCase()))
  ) || match.interests[0];

  // Add persona-aware tips if user has a persona
  const baseTips = [
    `${match.name} values authenticity, so be genuine rather than trying to impress`,
    `They mentioned ${match.interests[0]} - showing interest in this could spark great conversation`,
    `Listen actively - their profile suggests communication is important to them`,
  ];

  if (user.persona) {
    const personaTips: Record<string, string> = {
      'Adventurer': 'Share your adventurous stories - your enthusiasm is contagious!',
      'Intellectual': 'Your thoughtful questions will impress - ask about their passions.',
      'Social Butterfly': 'Your natural warmth will shine - just be your charming self!',
      'Homebody': 'Suggest a cozy follow-up activity - they might love that idea.',
      'Creative': 'Show your creative side - maybe sketch something for them!',
      'Romantic': 'Small romantic gestures go a long way with your personality.',
    };
    baseTips.unshift(personaTips[user.persona.personaType] || 'Be yourself - your persona is perfect for this match!');
  }

  return {
    matchName: match.name,
    restaurant: {
      ...restaurants[Math.floor(Math.random() * restaurants.length)],
      location: `${location === "San Francisco" ? "Mission District" : "Downtown"}, ${location}`
    },
    itinerary: activities,
    conversationStarters: [
      `I noticed you're into ${sharedInterest} - what got you started with that?`,
      `Your profile mentioned ${match.essays.lookingFor.split(' ').slice(0, 3).join(' ')}... - that really resonated with me because...`,
      `If you could travel anywhere next month, where would you go and why?`,
      `What's the most spontaneous thing you've done recently?`
    ],
    tips: baseTips
  };
};
