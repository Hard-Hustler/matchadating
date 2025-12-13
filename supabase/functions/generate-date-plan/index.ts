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

    const systemPrompt = `You are a witty, sarcastic AI date planner with the personality of a brutally honest best friend who also happens to be a relationship expert. Your job is to create 3 unique, detailed date plans.

${astrologyContext}

CRITICAL: You must respond with ONLY valid JSON, no markdown, no code blocks, just raw JSON.

The JSON structure must be:
{
  "plans": [
    {
      "id": 1,
      "title": "Creative plan name",
      "theme": "One word theme like 'Adventure' or 'Romance'",
      "timeline": [
        {
          "time": "7:00 PM",
          "activity": "Activity name",
          "venue": "Real venue name in the city",
          "description": "Why this works for them",
          "mapsQuery": "venue name city for google maps search"
        }
      ],
      "whyItFits": "2-3 sentences explaining why this plan matches their preferences",
      "backupPlan": "What to do if weather/vibe is off",
      "exitStrategy": "A witty excuse to leave early if things go south",
      "estimatedCost": "$50-100"
    }
  ],
  "inviteMessages": [
    {
      "tone": "Smooth",
      "message": "A ready-to-send invite text"
    },
    {
      "tone": "Direct",
      "message": "A ready-to-send invite text"
    },
    {
      "tone": "Chaos",
      "message": "A chaotic/funny ready-to-send invite text"
    }
  ],
  "astrologyVerdict": "${data.useAstrology ? (roastMode ? 'A savage roast about their zodiac incompatibility' : 'An enthusiastic take on their cosmic chemistry') : null}"
}`;

    const userPrompt = `Create 3 unique date plans for ${data.userName} and ${data.partnerName}.

DETAILS:
- City: ${data.city}
- Time: ${data.timeWindow}
- Occasion: ${data.occasion}
- Vibe: ${data.vibe}
- Budget: ${data.budget}
- ${data.userName} loves: ${data.userLoves || 'not specified'}
- ${data.userName} hates: ${data.userHates || 'not specified'}
- ${data.partnerName} loves: ${data.partnerLoves || 'not specified'}
- ${data.partnerName} hates: ${data.partnerHates || 'not specified'}
- Special requests: ${data.lastWords || 'none'}

Generate 3 DISTINCTLY DIFFERENT date plans. Each should have 3-4 timeline activities with REAL venues in ${data.city}. Be creative, specific, and match their preferences. Include real restaurant/bar/activity names that would exist in ${data.city}.`;

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
      throw new Error('No content in AI response');
    }

    console.log('AI response received, parsing...');
    
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

    const datePlans = JSON.parse(cleanedContent);

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