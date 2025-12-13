import { Profile, mockProfiles } from './mockProfiles';
import { PersonaResult } from '@/components/VideoEmotionCapture';

export interface MatchFactor {
  name: string;
  score: number;
  maxScore: number;
  icon: string;
  description: string;
}

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
  matchFactors: MatchFactor[];
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

const funnyReasonings = [
  "You both probably argue about the best pizza toppings and we're here for it 🍕",
  "Your Netflix queues probably have suspicious overlap. Coincidence? We think not! 📺",
  "Two people who actually reply to texts within 24 hours?! Rare breed alert! 💬",
  "You both have that 'organized chaos' energy and honestly, it's adorable 🌪️",
  "Compatible sleep schedules detected! No 'Why are you still up?' texts needed 😴",
  "Both of you would rather stay in with a good book than deal with crowded bars 📚",
  "You share that 'let's be spontaneous but also have a backup plan' vibe ✨",
  "Two coffee addicts? The café dates will be legendary ☕",
];

const personaReasonings: Record<string, string> = {
  'Adventurer-Adventurer': "Two adventurous spirits who'll never run out of exciting experiences to share! Pack your bags! 🎒",
  'Adventurer-Creative': "Your spontaneity + their creativity = Instagram gold (and actual fun) 🎨",
  'Adventurer-Social Butterfly': "Together you'll be the couple everyone wants to hang with. Main character energy! 🦋",
  'Intellectual-Intellectual': "Deep 3AM conversations about the meaning of life? Sign us up! 🧠",
  'Intellectual-Creative': "Their art + your analysis = pretentious museum dates done RIGHT 🖼️",
  'Intellectual-Romantic': "Poetry readings and stargazing? You two are disgustingly perfect 💫",
  'Social Butterfly-Social Butterfly': "Your combined friend groups could populate a small country 🌍",
  'Social Butterfly-Creative': "They make the art, you find the audience. Power couple vibes! 🎭",
  'Homebody-Homebody': "Cozy movie marathons in matching PJs. Living the dream! 🛋️",
  'Homebody-Romantic': "Candlelit dinners AT HOME? Yes, this is peak romance 🕯️",
  'Creative-Creative': "The Pinterest board for this couple would crash servers 📌",
  'Creative-Romantic': "Love letters, handmade gifts, spontaneous serenades. We're swooning! 💌",
  'Romantic-Romantic': "This is the rom-com Netflix wishes they could write 💕",
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
  const selected = shuffled.slice(0, Math.min(count + 2, shuffled.length));

  const results = selected.map((profile, index) => {
    const matchFactors: MatchFactor[] = [];
    
    // 1. Interest Overlap Score (max 25 points)
    const sharedInterests = userProfile.interests?.filter(i => 
      profile.interests.some(pi => pi.toLowerCase().includes(i.toLowerCase().replace(/[^\w\s]/g, '')))
    ) || [];
    const interestScore = Math.min(25, sharedInterests.length * 5 + Math.floor(Math.random() * 10));
    matchFactors.push({
      name: "Shared Interests",
      score: interestScore,
      maxScore: 25,
      icon: "🎯",
      description: sharedInterests.length > 0 
        ? `You both vibe with: ${sharedInterests.slice(0, 3).join(", ")}`
        : "Different interests = never boring conversations!"
    });

    // 2. Location Compatibility (max 15 points)
    const distance = getDistance(userProfile.location || "San Francisco", profile.location);
    const locationScore = distance < 5 ? 15 : distance < 15 ? 12 : distance < 30 ? 8 : 5;
    matchFactors.push({
      name: "Location",
      score: locationScore,
      maxScore: 15,
      icon: "📍",
      description: distance < 5 
        ? "Practically neighbors! Spontaneous dates possible" 
        : distance < 15 
        ? "Close enough for weeknight hangouts"
        : "Worth the commute for love!"
    });

    // 3. Emotional/Persona Compatibility (max 20 points)
    let personaScore = 10;
    let personaMatch: { matchType: string; bonus: number } | undefined;
    
    if (userProfile.persona) {
      const userPersona = userProfile.persona.personaType;
      const matchPersona = mockPersonasForProfiles[profile.id] || 'Creative';
      const compatiblePersonas = personaCompatibility[userPersona] || [];
      
      if (matchPersona === userPersona) {
        personaScore = 20;
        personaMatch = { matchType: `${userPersona} + ${matchPersona}`, bonus: 12 };
      } else if (compatiblePersonas.includes(matchPersona)) {
        personaScore = 16;
        personaMatch = { matchType: `${userPersona} + ${matchPersona}`, bonus: 8 };
      } else {
        personaScore = 10;
        personaMatch = { matchType: `${userPersona} + ${matchPersona}`, bonus: 3 };
      }
    }
    matchFactors.push({
      name: "Emotional Vibe",
      score: personaScore,
      maxScore: 20,
      icon: "💫",
      description: userProfile.persona 
        ? `Your ${userProfile.persona.personaType} energy meets their vibe perfectly`
        : "Complete video analysis for deeper matching!"
    });

    // 4. Communication Style (max 15 points) - Simulated
    const commScore = 10 + Math.floor(Math.random() * 6);
    matchFactors.push({
      name: "Communication Style",
      score: commScore,
      maxScore: 15,
      icon: "💬",
      description: commScore > 12 
        ? "You both appreciate honest, open conversations"
        : "Different styles can complement each other!"
    });

    // 5. Lifestyle Alignment (max 15 points)
    const lifestyleScore = 8 + Math.floor(Math.random() * 8);
    matchFactors.push({
      name: "Lifestyle",
      score: lifestyleScore,
      maxScore: 15,
      icon: "🌟",
      description: lifestyleScore > 12 
        ? "Work-life balance goals align beautifully"
        : "Enough overlap to sync, enough difference to grow"
    });

    // 6. Humor Compatibility (max 10 points) - Because laughing together matters!
    const humorScore = 6 + Math.floor(Math.random() * 5);
    matchFactors.push({
      name: "Humor Match",
      score: humorScore,
      maxScore: 10,
      icon: "😂",
      description: humorScore > 8 
        ? "You'll laugh at the same stupid memes"
        : "They'll introduce you to new jokes!"
    });

    // Calculate total score
    const totalScore = matchFactors.reduce((acc, f) => acc + f.score, 0);
    const maxPossible = matchFactors.reduce((acc, f) => acc + f.maxScore, 0);
    const compatibilityScore = Math.min(99, Math.round((totalScore / maxPossible) * 100));
    
    // Generate reasoning
    let reasoning = funnyReasonings[index % funnyReasonings.length];
    
    if (personaMatch && userProfile.persona) {
      const userPersona = userProfile.persona.personaType;
      const matchPersona = mockPersonasForProfiles[profile.id] || 'Creative';
      const personaKey = `${userPersona}-${matchPersona}`;
      const reverseKey = `${matchPersona}-${userPersona}`;
      
      const personaReason = personaReasonings[personaKey] || personaReasonings[reverseKey];
      if (personaReason) {
        reasoning = personaReason;
      }
    }
    
    return {
      profile,
      compatibilityScore,
      reasoning,
      commonValues: commonValueSets[index % commonValueSets.length],
      distanceMiles: distance,
      personaMatch,
      matchFactors,
    };
  })
  .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
  .slice(0, count);

  return results;
};

export const generateDatePlan = (user: Partial<Profile> & { persona?: PersonaResult }, match: Profile): DatePlan => {
  const location = user.location || match.location;
  
  const restaurants = [
    { name: "The Blushing Bean", cuisine: "Coffee & Brunch", vibe: "Cozy, artsy, conversation-friendly" },
    { name: "Starlight Terrace", cuisine: "Rooftop Mediterranean", vibe: "Romantic, city views, perfect lighting" },
    { name: "Luna's Kitchen", cuisine: "Italian Fusion", vibe: "Warm, lively, perfect for sharing plates" },
    { name: "Ember & Oak", cuisine: "Modern American", vibe: "Sophisticated, relaxed, great wine list" }
  ];

  const activities = [
    { time: "6:00 PM", activity: "Meet for artisan coffee (liquid courage)", location: "The Blushing Bean", icon: "coffee" },
    { time: "6:30 PM", activity: "Stroll through the local art gallery", location: "Local Gallery Walk", icon: "palette" },
    { time: "7:30 PM", activity: "Dinner + deep conversations", location: restaurants[0].name, icon: "utensils" },
    { time: "9:00 PM", activity: "Evening walk (classic move, always works)", location: "Waterfront Path", icon: "trees" },
    { time: "9:30 PM", activity: "Optional dessert (if sparks are flying!)", location: "Sweet Endings Café", icon: "ice-cream" }
  ];

  const sharedInterest = user.interests?.find(i => 
    match.interests.some(mi => mi.toLowerCase().includes(i.toLowerCase().replace(/[^\w\s]/g, '')))
  ) || match.interests[0];

  const baseTips = [
    `Pro tip: ${match.name} probably hates small talk. Go deep or go home! 💭`,
    `They seem into ${match.interests[0]} - ask about it and watch them light up ✨`,
    "Put your phone on silent. Nothing kills vibes faster than notification sounds 📵",
    "Nervous? Good! It means you care. Deep breaths, you got this 💪",
  ];

  if (user.persona) {
    const personaTips: Record<string, string> = {
      'Adventurer': "Suggest something spontaneous for date #2 - they'll love your energy! 🎒",
      'Intellectual': "Your thoughtful questions will impress - just don't turn it into an interview 😂",
      'Social Butterfly': "Your natural warmth is your superpower. Just be you! 🦋",
      'Homebody': "Mention your cozy hobbies - they might be a homebody too! 🏠",
      'Creative': "Show your creative side - maybe sketch something for them! 🎨",
      'Romantic': "Small gestures go a long way - a compliment, a small gift, etc. 💐",
    };
    baseTips.unshift(personaTips[user.persona.personaType] || "Be yourself - your vibe is perfect for this match!");
  }

  return {
    matchName: match.name,
    restaurant: {
      ...restaurants[Math.floor(Math.random() * restaurants.length)],
      location: `${location === "San Francisco" ? "Hayes Valley" : "Downtown"}, ${location}`
    },
    itinerary: activities,
    conversationStarters: [
      `"So I noticed you're into ${sharedInterest} - what's the story there?"`,
      `"What's something you're weirdly passionate about that surprises people?"`,
      `"If you could teleport anywhere right now for dinner, where would we go?"`,
      `"What's your hot take that would get you canceled on Twitter?" (risky but fun 😈)`
    ],
    tips: baseTips
  };
};