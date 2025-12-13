import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { venue, city, vibe } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const prompt = `A beautiful, romantic photograph of a ${vibe.toLowerCase()} ${venue} in ${city}. Warm ambient lighting, cozy atmosphere, perfect for a date night. Ultra high quality, professional photography style. 16:9 aspect ratio.`;

    console.log('Generating venue image with prompt:', prompt);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          { role: 'user', content: prompt }
        ],
        modalities: ['image', 'text']
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log('AI Response structure:', JSON.stringify(aiResponse, null, 2).slice(0, 500));
    
    const imageUrl = aiResponse.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageUrl) {
      console.log('No image found, using fallback placeholder');
      // Return a themed placeholder based on venue type
      const placeholderUrl = `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80`;
      return new Response(JSON.stringify({ imageUrl: placeholderUrl, isPlaceholder: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ imageUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating venue image:', error);
    // Return placeholder on error instead of failing
    const placeholderUrl = `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80`;
    return new Response(JSON.stringify({ 
      imageUrl: placeholderUrl,
      isPlaceholder: true,
      originalError: error instanceof Error ? error.message : 'Failed to generate image'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
