export interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  sex: string;
  orientation: string;
  bio: string;
  interests: string[];
  job: string;
  education: string;
  diet: string;
  drinks: string;
  pets: string;
  bodyType: string;
  sign: string;
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
    location: "San Francisco",
    sex: "female",
    orientation: "straight",
    bio: "Coffee enthusiast, hiking addict, and amateur chef. Looking for someone to explore farmers markets with.",
    interests: ["hiking", "cooking", "photography", "travel", "wine tasting"],
    job: "Product Designer",
    education: "graduate",
    diet: "vegetarian",
    drinks: "socially",
    pets: "dogs",
    bodyType: "fit",
    sign: "Libra",
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
    location: "Oakland",
    sex: "male",
    orientation: "straight",
    bio: "Jazz musician by night, software engineer by day. Looking for my duet partner in life.",
    interests: ["music", "coding", "basketball", "meditation", "jazz"],
    job: "Software Engineer",
    education: "graduate",
    diet: "anything",
    drinks: "socially",
    pets: "cats",
    bodyType: "athletic",
    sign: "Scorpio",
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
    location: "Berkeley",
    sex: "female",
    orientation: "bisexual",
    bio: "PhD student studying marine biology. When I'm not in the lab, I'm probably at the beach or a bookstore.",
    interests: ["reading", "surfing", "science", "documentaries", "yoga"],
    job: "PhD Researcher",
    education: "graduate",
    diet: "pescatarian",
    drinks: "rarely",
    pets: "none",
    bodyType: "average",
    sign: "Pisces",
    essays: {
      aboutMe: "Fascinated by the ocean and everything in it. I can talk about marine ecosystems for hours, but I promise I'm fun at parties too.",
      lookingFor: "An intellectually curious person who loves learning and isn't intimidated by ambition.",
      idealWeekend: "Early morning surf session, brunch with friends, afternoon reading in a sunny spot, evening documentary."
    }
  },
  {
    id: "alex-004",
    name: "Alex",
    age: 29,
    location: "San Francisco",
    sex: "non-binary",
    orientation: "pansexual",
    bio: "Artist and community organizer. Building a more beautiful and just world, one mural at a time.",
    interests: ["art", "activism", "gardening", "poetry", "dance"],
    job: "Muralist",
    education: "college",
    diet: "vegan",
    drinks: "socially",
    pets: "cats",
    bodyType: "curvy",
    sign: "Aquarius",
    essays: {
      aboutMe: "I express myself through color and movement. Currently working on a community garden project in the Mission.",
      lookingFor: "Someone who cares about making a difference and isn't afraid to dream big together.",
      idealWeekend: "Morning in my studio, afternoon tending the community garden, evening poetry reading or dance party."
    }
  },
  {
    id: "james-005",
    name: "James",
    age: 34,
    location: "San Jose",
    sex: "male",
    orientation: "gay",
    bio: "Chef at a farm-to-table restaurant. Food is my love language.",
    interests: ["cooking", "wine", "farmers markets", "travel", "running"],
    job: "Executive Chef",
    education: "culinary school",
    diet: "anything",
    drinks: "regularly",
    pets: "dogs",
    bodyType: "fit",
    sign: "Taurus",
    essays: {
      aboutMe: "I've cooked in kitchens from New York to Tokyo. Now I'm focused on sustainable, local cuisine.",
      lookingFor: "Someone who appreciates a home-cooked meal and good conversation over wine.",
      idealWeekend: "Farmers market at dawn, testing new recipes, hosting a dinner party for friends."
    }
  },
  {
    id: "priya-006",
    name: "Priya",
    age: 27,
    location: "San Francisco",
    sex: "female",
    orientation: "straight",
    bio: "Startup founder by day, salsa dancer by night. Living life at full speed.",
    interests: ["entrepreneurship", "dancing", "tech", "travel", "fitness"],
    job: "Startup Founder",
    education: "graduate",
    diet: "anything",
    drinks: "socially",
    pets: "none",
    bodyType: "athletic",
    sign: "Aries",
    essays: {
      aboutMe: "Built my first app at 22, still chasing that startup high. But I know how to disconnect - the dance floor is my therapy.",
      lookingFor: "Someone ambitious who also knows how to have fun. Let's build empires and dance until midnight.",
      idealWeekend: "Morning workout, afternoon working on the next big thing, evening salsa dancing until late."
    }
  },
  {
    id: "david-007",
    name: "David",
    age: 32,
    location: "Oakland",
    sex: "male",
    orientation: "straight",
    bio: "Elementary school teacher with a passion for outdoor education. Kids say I'm the 'fun' teacher.",
    interests: ["education", "camping", "guitar", "board games", "hiking"],
    job: "Teacher",
    education: "graduate",
    diet: "anything",
    drinks: "socially",
    pets: "dogs",
    bodyType: "average",
    sign: "Cancer",
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
    location: "Berkeley",
    sex: "female",
    orientation: "lesbian",
    bio: "Tattoo artist with a green thumb. My plants and art are my children.",
    interests: ["art", "plants", "tattoos", "vinyl records", "thrifting"],
    job: "Tattoo Artist",
    education: "art school",
    diet: "vegetarian",
    drinks: "socially",
    pets: "cats",
    bodyType: "slim",
    sign: "Sagittarius",
    essays: {
      aboutMe: "Every tattoo tells a story. I love helping people express themselves through permanent art.",
      lookingFor: "Someone creative, a little weird, and who won't judge my extensive plant collection.",
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
