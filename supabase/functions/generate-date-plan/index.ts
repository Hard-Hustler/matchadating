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
        ? `ROAST MODE ACTIVATED: ${data.userName} is a ${userSign} and ${data.partnerName} is a ${partnerSign}. These signs are notoriously INCOMPATIBLE. Be sarcastically skeptical about this date working out. Include witty zodiac-based roasts and warnings throughout the plan. Make jokes about their inevitable clashes.`
        : `HYPE MODE: ${data.userName} is a ${userSign} and ${data.partnerName} is a ${partnerSign}. These signs are HIGHLY COMPATIBLE! Emphasize how cosmically aligned they are. Be enthusiastic about their zodiac chemistry.`;
    }

    // Real NYC venue database for more realistic suggestions
    const nycVenues = {
      restaurants: {
        romantic: ["Gramercy Tavern", "Le Bernardin", "Eleven Madison Park", "The River Café", "One if by Land, Two if by Sea", "Carbone", "Via Carota", "L'Artusi"],
        casual: ["Joe's Pizza", "Katz's Delicatessen", "Shake Shack", "Russ & Daughters Cafe", "Xi'an Famous Foods", "Los Tacos No. 1", "Prince Street Pizza"],
        trendy: ["Tatiana by Kwame Onwuachi", "Don Angie", "4 Charles Prime Rib", "Gage & Tollner", "Crown Shy", "Laser Wolf"],
        brunch: ["Balthazar", "Sadelle's", "Jack's Wife Freda", "Cafe Mogador", "Egg Shop", "Clinton Street Baking Co."]
      },
      bars: {
        speakeasy: ["Please Don't Tell (PDT)", "Death & Co", "Attaboy", "The Back Room", "Employees Only", "Angel's Share"],
        rooftop: ["230 Fifth", "Westlight", "The Skylark", "Magic Hour Rooftop Bar", "Mr. Purple", "The Crown"],
        wine: ["Terroir", "LaLou", "Corkbuzz Wine Studio", "The Four Horsemen", "Racines NY"]
      },
      activities: {
        cultural: ["The Met", "MoMA", "Whitney Museum", "The High Line", "Lincoln Center", "Brooklyn Museum", "Guggenheim"],
        entertainment: ["Blue Note Jazz Club", "Comedy Cellar", "Sleep No More", "House of Yes", "Brooklyn Bowl", "Music Hall of Williamsburg"],
        outdoor: ["Central Park Boathouse", "Brooklyn Bridge Walk", "DUMBO Waterfront", "The High Line", "Governors Island", "Prospect Park"],
        unique: ["Meow Wolf (coming soon)", "Color Factory", "Spyscape", "The Seaport District", "Chelsea Market", "Smorgasburg"]
      },
      neighborhoods: ["West Village", "SoHo", "Tribeca", "Williamsburg", "DUMBO", "Chelsea", "Lower East Side", "East Village", "Harlem", "Upper West Side"]
    };

    const systemPrompt = `You are a witty, sarcastic AI date planner with the personality of a brutally honest best friend who also happens to be a relationship expert. Your job is to create 3 unique, detailed date plans.

${astrologyContext}

VENUE GUIDELINES - Use these REAL NYC venues:
RESTAURANTS: ${JSON.stringify(nycVenues.restaurants)}
BARS: ${JSON.stringify(nycVenues.bars)}
ACTIVITIES: ${JSON.stringify(nycVenues.activities)}
NEIGHBORHOODS: ${JSON.stringify(nycVenues.neighborhoods)}

Use ONLY real venues from the lists above or other well-known establishments. Be creative and match their preferences. Always call the generate_date_plans function with your response.`;

    const userPrompt = `Create 3 unique date plans for ${data.userName} and ${data.partnerName}.

DETAILS:
- City: ${data.city} (USE ONLY REAL, VERIFIED VENUES)
- Time: ${data.timeWindow}
- Occasion: ${data.occasion}
- Vibe: ${data.vibe}
- Budget: ${data.budget}
- ${data.userName} loves: ${data.userLoves || 'not specified'}
- ${data.userName} hates: ${data.userHates || 'not specified'}
- ${data.partnerName} loves: ${data.partnerLoves || 'not specified'}
- ${data.partnerName} hates: ${data.partnerHates || 'not specified'}
- Special requests: ${data.lastWords || 'none'}

Generate 3 DISTINCTLY DIFFERENT date plans. Each should have 3-4 timeline activities with ONLY REAL venues.`;

    console.log('Calling Lovable AI for date plan generation...');

    // Use tool calling for structured output - more reliable than asking for JSON
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
        tools: [
          {
            type: "function",
            function: {
              name: "generate_date_plans",
              description: "Generate date plans for a couple",
              parameters: {
                type: "object",
                properties: {
                  plans: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "number" },
                        title: { type: "string", description: "Creative plan name" },
                        theme: { type: "string", description: "One word theme like Adventure or Romance" },
                        timeline: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              time: { type: "string" },
                              activity: { type: "string" },
                              venue: { type: "string", description: "Real venue name" },
                              address: { type: "string", description: "Actual address" },
                              description: { type: "string" },
                              mapsQuery: { type: "string" }
                            },
                            required: ["time", "activity", "venue", "address", "description", "mapsQuery"]
                          }
                        },
                        whyItFits: { type: "string" },
                        backupPlan: { type: "string" },
                        exitStrategy: { type: "string" },
                        estimatedCost: { type: "string" }
                      },
                      required: ["id", "title", "theme", "timeline", "whyItFits", "backupPlan", "exitStrategy", "estimatedCost"]
                    }
                  },
                  inviteMessages: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        tone: { type: "string" },
                        message: { type: "string" }
                      },
                      required: ["tone", "message"]
                    }
                  },
                  astrologyVerdict: { type: "string", description: "Zodiac compatibility verdict or null" }
                },
                required: ["plans", "inviteMessages"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "generate_date_plans" } }
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
    console.log('AI response received, parsing...');
    
    // Extract from tool call response
    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== 'generate_date_plans') {
      console.error('No valid tool call in response:', JSON.stringify(aiResponse).slice(0, 500));
      throw new Error('AI did not return structured date plan');
    }

    const datePlans = JSON.parse(toolCall.function.arguments);

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