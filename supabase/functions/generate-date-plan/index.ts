import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DatePlanRequest {
  city: string;
  timeWindow: string;
  occasion: string;
  vibe: string;
  budget: string;
  userLoves: string;
  userHates: string;
  partnerLoves: string;
  partnerHates: string;
  lastWords: string;
  useAstrology: boolean;
  userBirthDate?: string;
  partnerBirthDate?: string;
  userName: string;
  partnerName: string;
}

const getZodiacSign = (dateStr: string): string => {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  return 'Pisces';
};

const getCompatibility = (sign1: string, sign2: string): { compatible: boolean; reason: string } => {
  const fireCompatible = ['Aries', 'Leo', 'Sagittarius'];
  const earthCompatible = ['Taurus', 'Virgo', 'Capricorn'];
  const airCompatible = ['Gemini', 'Libra', 'Aquarius'];
  const waterCompatible = ['Cancer', 'Scorpio', 'Pisces'];
  
  const getElement = (sign: string) => {
    if (fireCompatible.includes(sign)) return 'fire';
    if (earthCompatible.includes(sign)) return 'earth';
    if (airCompatible.includes(sign)) return 'air';
    return 'water';
  };
  
  const e1 = getElement(sign1);
  const e2 = getElement(sign2);
  
  const compatible = e1 === e2 || 
    (e1 === 'fire' && e2 === 'air') || (e1 === 'air' && e2 === 'fire') ||
    (e1 === 'earth' && e2 === 'water') || (e1 === 'water' && e2 === 'earth');
  
  return { compatible, reason: compatible ? 'harmonious' : 'chaotic' };
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: DatePlanRequest = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    let astrologyContext = '';
    let roastMode = false;
    
    if (data.useAstrology && data.userBirthDate && data.partnerBirthDate) {
      const userSign = getZodiacSign(data.userBirthDate);
      const partnerSign = getZodiacSign(data.partnerBirthDate);
      const compat = getCompatibility(userSign, partnerSign);
      roastMode = !compat.compatible;
      
      astrologyContext = roastMode 
        ? `ROAST MODE ACTIVATED: ${data.userName} is a ${userSign} and ${data.partnerName} is a ${partnerSign}. These signs are notoriously INCOMPATIBLE. Be sarcastically skeptical about this date working out. Include witty zodiac-based roasts and warnings throughout the plan.`
        : `HYPE MODE: ${data.userName} is a ${userSign} and ${data.partnerName} is a ${partnerSign}. These signs are HIGHLY COMPATIBLE! Emphasize how cosmically aligned they are.`;
    }

    // City-specific venue databases
    const venuesByCity: Record<string, any> = {
      "New York": {
        restaurants: ["Gramercy Tavern", "Le Bernardin", "Carbone", "Via Carota", "Joe's Pizza", "Katz's Delicatessen", "Don Angie", "Crown Shy"],
        bars: ["Please Don't Tell (PDT)", "Death & Co", "Attaboy", "230 Fifth", "Westlight", "The Back Room"],
        activities: ["The Met", "MoMA", "Whitney Museum", "The High Line", "Comedy Cellar", "Central Park", "Brooklyn Bridge Walk"],
        neighborhoods: ["West Village", "SoHo", "Tribeca", "Williamsburg", "DUMBO", "Chelsea", "Lower East Side"]
      },
      "San Francisco": {
        restaurants: ["State Bird Provisions", "Foreign Cinema", "Zuni Cafe", "Rich Table", "Kokkari Estiatorio", "La Taqueria", "Gary Danko", "Flour + Water"],
        bars: ["Smuggler's Cove", "True Laurel", "ABV", "The Interval", "Trick Dog", "Bourbon & Branch"],
        activities: ["SFMOMA", "de Young Museum", "Golden Gate Park", "Exploratorium", "Cobb's Comedy Club", "Dolores Park", "Ferry Building"],
        neighborhoods: ["Mission District", "Hayes Valley", "North Beach", "Marina", "Castro", "SOMA", "Noe Valley", "Haight-Ashbury"]
      },
      "Los Angeles": {
        restaurants: ["Bestia", "Republique", "Gjelina", "Providence", "Petit Trois", "Gjusta", "Osteria Mozza"],
        bars: ["The Varnish", "Death & Co LA", "Bar Marmont", "Employees Only LA", "Thunderbolt"],
        activities: ["LACMA", "The Getty", "Griffith Observatory", "The Broad", "Hollywood Bowl", "Venice Beach"],
        neighborhoods: ["Silver Lake", "Arts District", "West Hollywood", "Venice", "Santa Monica", "Echo Park"]
      }
    };

    // Get venues for the city or use a generic prompt
    const cityKey = Object.keys(venuesByCity).find(c => data.city.toLowerCase().includes(c.toLowerCase()));
    const venues = cityKey ? venuesByCity[cityKey] : null;

    const venueContext = venues 
      ? `Here are some popular venues in ${data.city} you can use as inspiration: ${JSON.stringify(venues)}`
      : `Research and use well-known, real venues in ${data.city}.`;

    const systemPrompt = `You are a witty, sarcastic AI date planner. Create 3 unique, detailed date plans.

${astrologyContext}

${venueContext}

IMPORTANT: Use ONLY real, verified venues that exist in ${data.city}. Include actual addresses.

You MUST respond with valid JSON in this exact format:
{
  "plans": [
    {
      "id": 1,
      "title": "Creative plan name",
      "theme": "One word theme",
      "timeline": [
        { "time": "7:00 PM", "activity": "Activity name", "venue": "Real venue", "address": "Real address", "description": "Why this works", "mapsQuery": "venue name city" }
      ],
      "whyItFits": "Why this plan matches their preferences",
      "backupPlan": "Alternative if weather is bad",
      "exitStrategy": "Witty excuse to leave early",
      "estimatedCost": "$50-100"
    }
  ],
  "inviteMessages": [
    { "tone": "Smooth", "message": "Ready-to-send invite text" },
    { "tone": "Direct", "message": "Ready-to-send invite text" },
    { "tone": "Chaos", "message": "Chaotic/funny invite text" }
  ],
  "astrologyVerdict": "${data.useAstrology ? 'Zodiac compatibility verdict' : 'null'}"
}`;

    const userPrompt = `Create 3 date plans in ${data.city} for ${data.userName} and ${data.partnerName}.

- Time: ${data.timeWindow}
- Occasion: ${data.occasion}
- Vibe: ${data.vibe}
- Budget: ${data.budget}
- ${data.userName} loves: ${data.userLoves || 'not specified'}
- ${data.userName} hates: ${data.userHates || 'not specified'}
- ${data.partnerName} loves: ${data.partnerLoves || 'not specified'}
- ${data.partnerName} hates: ${data.partnerHates || 'not specified'}
- Special requests: ${data.lastWords || 'none'}

Respond with ONLY the JSON, no other text.`;

    console.log('Calling Lovable AI for date plan generation...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error('No content in AI response:', JSON.stringify(aiResponse).slice(0, 500));
      throw new Error('No content in AI response');
    }

    console.log('AI response received, parsing...');
    console.log('Raw content preview:', content.slice(0, 200));
    
    // Clean the response - remove markdown code blocks if present
    let cleanedContent = content.trim();
    if (cleanedContent.startsWith('```json')) {
      cleanedContent = cleanedContent.slice(7);
    }
    if (cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent.slice(3);
    }
    if (cleanedContent.endsWith('```')) {
      cleanedContent = cleanedContent.slice(0, -3);
    }
    cleanedContent = cleanedContent.trim();

    // Try to parse, with fallback
    let datePlans;
    try {
      datePlans = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('JSON parse error, content:', cleanedContent.slice(0, 300));
      // Return a fallback plan
      datePlans = {
        plans: [
          {
            id: 1,
            title: "Classic City Evening",
            theme: "Romance",
            timeline: [
              { time: "6:00 PM", activity: "Dinner", venue: "Local favorite restaurant", address: data.city, description: "Start with a great meal", mapsQuery: `best romantic restaurant ${data.city}` },
              { time: "8:00 PM", activity: "Walk", venue: "Downtown area", address: data.city, description: "Explore the city together", mapsQuery: `downtown ${data.city}` },
              { time: "9:30 PM", activity: "Drinks", venue: "Cozy bar", address: data.city, description: "End the night with cocktails", mapsQuery: `best cocktail bar ${data.city}` }
            ],
            whyItFits: "A classic date that works for any occasion",
            backupPlan: "If weather is bad, find a cozy indoor spot",
            exitStrategy: "Early meeting tomorrow",
            estimatedCost: "$100-150"
          }
        ],
        inviteMessages: [
          { tone: "Smooth", message: `Hey! I found some great spots in ${data.city}. Free this ${data.timeWindow}?` },
          { tone: "Direct", message: `Let's grab dinner. You free?` },
          { tone: "Chaos", message: `Adventure time! You in?` }
        ],
        astrologyVerdict: null
      };
    }

    return new Response(JSON.stringify(datePlans), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-date-plan:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Failed to generate date plan' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});