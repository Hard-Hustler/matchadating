export interface Profile {
  id: string;
  name: string;
  age: number;
  birthDate?: string;
  location: string;
  sex: string;
  orientation: string;
  bio: string;
  interests: string[];
  job: string;
  education: string;
  height?: string;
  diet: string;
  drinks: string;
  smoking?: string;
  pets: string;
  bodyType: string;
  sign: string;
  lookingFor?: string;
  profileImage?: string;
  essays: {
    aboutMe: string;
    lookingFor: string;
    idealWeekend: string;
  };
}

export const mockProfiles: Profile[] = [
  // New York Profiles
  {
    id: "olivia-001",
    name: "Olivia",
    age: 27,
    birthDate: "1997-08-15",
    location: "Manhattan, NYC",
    sex: "female",
    orientation: "straight",
    bio: "Gallery curator by day, jazz bar regular by night. Looking for someone to explore hidden speakeasies with.",
    interests: ["art", "jazz", "wine", "museums", "rooftop bars"],
    job: "Art Curator",
    education: "graduate",
    height: "5ft7 (170cm)",
    diet: "pescatarian",
    drinks: "socially",
    smoking: "never",
    pets: "cats",
    bodyType: "slim",
    sign: "Leo ♌",
    lookingFor: "serious",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    essays: {
      aboutMe: "I spend my days surrounded by contemporary art at a Chelsea gallery. Weekends you'll find me at Blue Note or exploring a new neighborhood.",
      lookingFor: "Someone cultured who appreciates both a Met exhibit and late-night tacos from a cart.",
      idealWeekend: "Saturday morning at the Whitney, brunch in West Village, evening at a hidden jazz bar in Harlem."
    }
  },
  {
    id: "marcus-002",
    name: "Marcus",
    age: 30,
    birthDate: "1994-03-22",
    location: "Brooklyn, NYC",
    sex: "male",
    orientation: "straight",
    bio: "Architect designing the skyline you see. Brooklyn born, Manhattan bound. Obsessed with good pizza.",
    interests: ["architecture", "photography", "cycling", "coffee", "design"],
    job: "Architect",
    education: "graduate",
    height: "6ft1 (185cm)",
    diet: "anything",
    drinks: "socially",
    smoking: "never",
    pets: "dogs",
    bodyType: "athletic",
    sign: "Aries ♈",
    lookingFor: "serious",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    essays: {
      aboutMe: "I designed a building you've probably walked by. When I'm not sketching, I'm biking across the Brooklyn Bridge or hunting for the best slice.",
      lookingFor: "A partner who notices beautiful details in everyday things. Someone who'll explore the city with fresh eyes.",
      idealWeekend: "Morning bike ride through Prospect Park, coffee at a new spot in Williamsburg, sunset from a rooftop somewhere."
    }
  },
  {
    id: "sophia-003",
    name: "Sophia",
    age: 26,
    birthDate: "1998-11-08",
    location: "East Village, NYC",
    sex: "female",
    orientation: "bisexual",
    bio: "Broadway stage manager living the theater dream. Yes, I can get you tickets. Maybe.",
    interests: ["theater", "musicals", "cooking", "vintage shopping", "karaoke"],
    job: "Stage Manager",
    education: "college",
    height: "5ft4 (163cm)",
    diet: "vegetarian",
    drinks: "socially",
    smoking: "never",
    pets: "none",
    bodyType: "average",
    sign: "Scorpio ♏",
    lookingFor: "casual",
    profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    essays: {
      aboutMe: "My life is backstage chaos and I love every second. Off-duty, I'm thrifting in the Village or perfecting my carbonara.",
      lookingFor: "Someone spontaneous who won't judge my extensive show tune knowledge.",
      idealWeekend: "Saturday matinee, vintage shopping on St. Marks, late-night karaoke in Koreatown."
    }
  },
  {
    id: "james-004",
    name: "James",
    age: 32,
    birthDate: "1992-06-30",
    location: "Upper West Side, NYC",
    sex: "male",
    orientation: "straight",
    bio: "Finance by profession, stand-up comedy by passion. Yes, I'll make you laugh.",
    interests: ["comedy", "running", "podcasts", "wine", "central park"],
    job: "Investment Analyst",
    education: "graduate",
    height: "5ft11 (180cm)",
    diet: "anything",
    drinks: "regularly",
    smoking: "never",
    pets: "none",
    bodyType: "fit",
    sign: "Cancer ♋",
    lookingFor: "serious",
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    essays: {
      aboutMe: "I crunch numbers for a living but test jokes at open mics for fun. Morning runs around the reservoir keep me sane.",
      lookingFor: "Someone who can handle my terrible puns and actually laughs at my jokes. Low bar, I know.",
      idealWeekend: "Morning run in Central Park, brunch on the Upper West Side, comedy show at The Stand."
    }
  },
  {
    id: "maya-005",
    name: "Maya",
    age: 28,
    birthDate: "1996-01-12",
    location: "Tribeca, NYC",
    sex: "female",
    orientation: "straight",
    bio: "Food journalist who's eaten at every Michelin star in the city. Let me take you somewhere incredible.",
    interests: ["food", "writing", "travel", "photography", "wine tasting"],
    job: "Food Writer",
    education: "graduate",
    height: "5ft6 (168cm)",
    diet: "anything",
    drinks: "regularly",
    smoking: "never",
    pets: "none",
    bodyType: "curvy",
    sign: "Capricorn ♑",
    lookingFor: "serious",
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
    essays: {
      aboutMe: "I write about restaurants for a living, which means I know all the best spots. From $5 dumplings to $500 omakase.",
      lookingFor: "An adventurous eater who's not afraid to try pig ear or sea urchin. Bonus if you cook.",
      idealWeekend: "Brunch at the hottest new spot, afternoon in Little Italy, chef's tasting menu dinner."
    }
  },
  {
    id: "daniel-006",
    name: "Daniel",
    age: 29,
    birthDate: "1995-09-05",
    location: "Williamsburg, Brooklyn",
    sex: "male",
    orientation: "straight",
    bio: "Startup founder building the future of music. DJ on weekends. Yes, I have a record collection.",
    interests: ["music", "tech", "vinyl", "nightlife", "coffee"],
    job: "Startup Founder",
    education: "college",
    height: "5ft10 (178cm)",
    diet: "anything",
    drinks: "socially",
    smoking: "sometimes",
    pets: "none",
    bodyType: "slim",
    sign: "Virgo ♍",
    lookingFor: "casual",
    profileImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
    essays: {
      aboutMe: "Building a music tech startup by day, spinning records at small clubs by night. My apartment is 40% vinyl.",
      lookingFor: "Someone who appreciates good beats and can dance without caring who's watching.",
      idealWeekend: "Saturday afternoon at record shops in Bushwick, rooftop party at sunset, late-night DJ set."
    }
  },
  {
    id: "emma-007",
    name: "Emma",
    age: 25,
    birthDate: "1999-04-18",
    location: "Chelsea, NYC",
    sex: "female",
    orientation: "lesbian",
    bio: "Fashion designer making clothes you'll actually want to wear. Currently obsessed with sustainable textiles.",
    interests: ["fashion", "sustainability", "art", "yoga", "brunch"],
    job: "Fashion Designer",
    education: "art school",
    height: "5ft8 (173cm)",
    diet: "vegan",
    drinks: "socially",
    smoking: "never",
    pets: "cats",
    bodyType: "slim",
    sign: "Aries ♈",
    lookingFor: "serious",
    profileImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
    essays: {
      aboutMe: "Designing eco-conscious fashion that doesn't sacrifice style. The High Line is my thinking space.",
      lookingFor: "A creative soul who cares about the planet and looks good doing it.",
      idealWeekend: "Morning yoga, gallery hopping in Chelsea, sunset drinks on a rooftop."
    }
  },
  {
    id: "alex-008",
    name: "Alex",
    age: 31,
    birthDate: "1993-12-25",
    location: "SoHo, NYC",
    sex: "non-binary",
    orientation: "pansexual",
    bio: "Photographer capturing NYC's most beautiful chaos. Gallery shows and street shots equally.",
    interests: ["photography", "street art", "film", "coffee", "nightlife"],
    job: "Photographer",
    education: "art school",
    height: "5ft9 (175cm)",
    diet: "vegetarian",
    drinks: "socially",
    smoking: "sometimes",
    pets: "cats",
    bodyType: "average",
    sign: "Capricorn ♑",
    lookingFor: "friends",
    profileImage: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400",
    essays: {
      aboutMe: "I shoot everything from fashion editorials to late-night street scenes. The city is my studio.",
      lookingFor: "Someone comfortable in front of and behind the lens. Bonus if you know hidden NYC spots.",
      idealWeekend: "Golden hour photo walk, gallery opening, late-night film screening at Metrograph."
    }
  }
];

export const getRandomProfiles = (count: number = 5): Profile[] => {
  const shuffled = [...mockProfiles].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getProfileById = (id: string): Profile | undefined => {
  return mockProfiles.find(p => p.id === id);
};