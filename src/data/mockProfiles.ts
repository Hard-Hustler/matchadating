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
  {
    id: "sarah-001",
    name: "Sarah",
    age: 28,
    birthDate: "1996-10-05",
    location: "San Francisco",
    sex: "female",
    orientation: "straight",
    bio: "Coffee enthusiast, hiking addict, and amateur chef. Looking for someone to explore farmers markets with.",
    interests: ["hiking", "cooking", "photography", "travel", "wine tasting"],
    job: "Product Designer",
    education: "graduate",
    height: "5ft6 (168cm)",
    diet: "vegetarian",
    drinks: "socially",
    smoking: "never",
    pets: "dogs",
    bodyType: "fit",
    sign: "Libra ♎",
    lookingFor: "serious",
    essays: {
      aboutMe: "I believe in deep conversations over good food. Currently training for my first half-marathon while also perfecting my sourdough recipe.",
      lookingFor: "Someone authentic who values growth and isn't afraid to be vulnerable. Bonus points if you can make me laugh.",
      idealWeekend: "Saturday farmers market, afternoon hike, cooking dinner together while listening to vinyl records."
    }
  },
  {
    id: "marcus-002",
    name: "Marcus",
    age: 31,
    birthDate: "1993-11-15",
    location: "Oakland",
    sex: "male",
    orientation: "straight",
    bio: "Jazz musician by night, software engineer by day. Looking for my duet partner in life.",
    interests: ["music", "coding", "basketball", "meditation", "jazz"],
    job: "Software Engineer",
    education: "graduate",
    height: "6ft0 (183cm)",
    diet: "anything",
    drinks: "socially",
    smoking: "never",
    pets: "cats",
    bodyType: "athletic",
    sign: "Scorpio ♏",
    lookingFor: "serious",
    essays: {
      aboutMe: "I play saxophone in a local jazz band and code during the day. Balance is everything to me - work hard, play harder.",
      lookingFor: "Someone who appreciates both quiet nights in and spontaneous adventures. Must love live music.",
      idealWeekend: "Morning meditation, afternoon pickup basketball, evening at a jazz club discovering new artists."
    }
  },
  {
    id: "emma-003",
    name: "Emma",
    age: 26,
    birthDate: "1998-03-02",
    location: "Berkeley",
    sex: "female",
    orientation: "bisexual",
    bio: "PhD student studying marine biology. When I am not in the lab, I am probably at the beach or a bookstore.",
    interests: ["reading", "surfing", "science", "documentaries", "yoga"],
    job: "PhD Researcher",
    education: "graduate",
    height: "5ft4 (163cm)",
    diet: "pescatarian",
    drinks: "rarely",
    smoking: "never",
    pets: "none",
    bodyType: "average",
    sign: "Pisces ♓",
    lookingFor: "casual",
    essays: {
      aboutMe: "Fascinated by the ocean and everything in it. I can talk about marine ecosystems for hours, but I promise I am fun at parties too.",
      lookingFor: "An intellectually curious person who loves learning and is not intimidated by ambition.",
      idealWeekend: "Early morning surf session, brunch with friends, afternoon reading in a sunny spot, evening documentary."
    }
  },
  {
    id: "alex-004",
    name: "Alex",
    age: 29,
    birthDate: "1995-02-05",
    location: "San Francisco",
    sex: "non-binary",
    orientation: "pansexual",
    bio: "Artist and community organizer. Building a more beautiful and just world, one mural at a time.",
    interests: ["art", "activism", "gardening", "poetry", "dance"],
    job: "Muralist",
    education: "college",
    height: "5ft8 (173cm)",
    diet: "vegan",
    drinks: "socially",
    smoking: "sometimes",
    pets: "cats",
    bodyType: "curvy",
    sign: "Aquarius ♒",
    lookingFor: "friends",
    essays: {
      aboutMe: "I express myself through color and movement. Currently working on a community garden project in the Mission.",
      lookingFor: "Someone who cares about making a difference and is not afraid to dream big together.",
      idealWeekend: "Morning in my studio, afternoon tending the community garden, evening poetry reading or dance party."
    }
  },
  {
    id: "james-005",
    name: "James",
    age: 34,
    birthDate: "1990-05-10",
    location: "San Jose",
    sex: "male",
    orientation: "gay",
    bio: "Chef at a farm-to-table restaurant. Food is my love language.",
    interests: ["cooking", "wine", "farmers markets", "travel", "running"],
    job: "Executive Chef",
    education: "culinary school",
    height: "5ft10 (178cm)",
    diet: "anything",
    drinks: "regularly",
    smoking: "never",
    pets: "dogs",
    bodyType: "fit",
    sign: "Taurus ♉",
    lookingFor: "serious",
    essays: {
      aboutMe: "I have cooked in kitchens from New York to Tokyo. Now I am focused on sustainable, local cuisine.",
      lookingFor: "Someone who appreciates a home-cooked meal and good conversation over wine.",
      idealWeekend: "Farmers market at dawn, testing new recipes, hosting a dinner party for friends."
    }
  },
  {
    id: "priya-006",
    name: "Priya",
    age: 27,
    birthDate: "1997-04-01",
    location: "San Francisco",
    sex: "female",
    orientation: "straight",
    bio: "Startup founder by day, salsa dancer by night. Living life at full speed.",
    interests: ["entrepreneurship", "dancing", "tech", "travel", "fitness"],
    job: "Startup Founder",
    education: "graduate",
    height: "5ft4 (163cm)",
    diet: "anything",
    drinks: "socially",
    smoking: "never",
    pets: "none",
    bodyType: "athletic",
    sign: "Aries ♈",
    lookingFor: "serious",
    essays: {
      aboutMe: "Built my first app at 22, still chasing that startup high. But I know how to disconnect - the dance floor is my therapy.",
      lookingFor: "Someone ambitious who also knows how to have fun. Let us build empires and dance until midnight.",
      idealWeekend: "Morning workout, afternoon working on the next big thing, evening salsa dancing until late."
    }
  },
  {
    id: "david-007",
    name: "David",
    age: 32,
    birthDate: "1992-07-15",
    location: "Oakland",
    sex: "male",
    orientation: "straight",
    bio: "Elementary school teacher with a passion for outdoor education. Kids say I am the fun teacher.",
    interests: ["education", "camping", "guitar", "board games", "hiking"],
    job: "Teacher",
    education: "graduate",
    height: "5ft10 (178cm)",
    diet: "anything",
    drinks: "socially",
    smoking: "never",
    pets: "dogs",
    bodyType: "average",
    sign: "Cancer ♋",
    lookingFor: "serious",
    essays: {
      aboutMe: "Nothing beats seeing a kid's face light up when they finally get it. I bring that same enthusiasm to everything.",
      lookingFor: "Someone kind, patient, and ready for adventures both big and small.",
      idealWeekend: "Morning hike with the dog, afternoon board games with friends, evening campfire with guitar."
    }
  },
  {
    id: "luna-008",
    name: "Luna",
    age: 25,
    birthDate: "1999-12-05",
    location: "Berkeley",
    sex: "female",
    orientation: "lesbian",
    bio: "Tattoo artist with a green thumb. My plants and art are my children.",
    interests: ["art", "plants", "tattoos", "vinyl records", "thrifting"],
    job: "Tattoo Artist",
    education: "art school",
    height: "5ft2 (157cm)",
    diet: "vegetarian",
    drinks: "socially",
    smoking: "420",
    pets: "cats",
    bodyType: "slim",
    sign: "Sagittarius ♐",
    lookingFor: "casual",
    essays: {
      aboutMe: "Every tattoo tells a story. I love helping people express themselves through permanent art.",
      lookingFor: "Someone creative, a little weird, and who will not judge my extensive plant collection.",
      idealWeekend: "Thrift store treasure hunting, repotting plants, sketching new designs while listening to old records."
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