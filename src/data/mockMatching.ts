import { Profile, mockProfiles } from './mockProfiles';

export interface MatchResult {
  profile: Profile;
  compatibilityScore: number;
  reasoning: string;
  commonValues: string[];
  distanceMiles: number;
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

export const generateMatches = (userProfile: Partial<Profile>, count: number = 3): MatchResult[] => {
  const availableProfiles = mockProfiles.filter(p => {
    if (userProfile.orientation === "straight") {
      return p.sex !== userProfile.sex;
    }
    if (userProfile.orientation === "gay" || userProfile.orientation === "lesbian") {
      return p.sex === userProfile.sex;
    }
    return true; // bisexual/pansexual matches with anyone
  });

  const shuffled = [...availableProfiles].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  return selected.map((profile, index) => {
    const baseScore = 75 + Math.random() * 20;
    const interestBonus = userProfile.interests?.some(i => 
      profile.interests.some(pi => pi.toLowerCase().includes(i.toLowerCase()))
    ) ? 5 : 0;
    const locationBonus = profile.location === userProfile.location ? 3 : 0;
    
    const score = Math.min(99, Math.round(baseScore + interestBonus + locationBonus));
    
    return {
      profile,
      compatibilityScore: score,
      reasoning: compatibilityReasons[index % compatibilityReasons.length],
      commonValues: commonValueSets[index % commonValueSets.length],
      distanceMiles: getDistance(userProfile.location || "San Francisco", profile.location)
    };
  }).sort((a, b) => b.compatibilityScore - a.compatibilityScore);
};

export const generateDatePlan = (user: Partial<Profile>, match: Profile): DatePlan => {
  const location = user.location || match.location;
  
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
    tips: [
      `${match.name} values authenticity, so be genuine rather than trying to impress`,
      `They mentioned ${match.interests[0]} - showing interest in this could spark great conversation`,
      `Listen actively - their profile suggests communication is important to them`,
      `They're a ${match.sign} - if you believe in astrology, you might mention it playfully!`
    ]
  };
};
