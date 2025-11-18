import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple in-memory rate limiting: 10 requests per minute per IP
const rateLimits = new Map<string, { count: number, resetAt: number }>();

function checkRateLimit(identifier: string, maxRequests = 10, windowMs = 60000): boolean {
  const now = Date.now();
  const limit = rateLimits.get(identifier);
  
  if (!limit || now > limit.resetAt) {
    rateLimits.set(identifier, { count: 1, resetAt: now + windowMs });
    return true;
  }
  
  if (limit.count >= maxRequests) return false;
  limit.count++;
  return true;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting: 10 requests per minute per IP
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  if (!checkRateLimit(ip)) {
    console.log(`Rate limit exceeded for IP: ${ip}`);
    return new Response(
      JSON.stringify({ error: 'Rate limit exceeded. Please try again in a minute.' }),
      { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { 
      currentProvider, 
      newProvider, 
      monthlySavings, 
      annualSavings, 
      isSaving,
      comparison,
      keyAdvantages 
    } = await req.json();

    // Input validation
    if (!currentProvider || typeof currentProvider !== 'string' || currentProvider.length > 100) {
      return new Response(
        JSON.stringify({ error: 'Invalid currentProvider' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!newProvider || typeof newProvider !== 'string' || newProvider.length > 100) {
      return new Response(
        JSON.stringify({ error: 'Invalid newProvider' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (typeof monthlySavings !== 'number' || typeof annualSavings !== 'number') {
      return new Response(
        JSON.stringify({ error: 'Invalid savings amounts' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (typeof isSaving !== 'boolean') {
      return new Response(
        JSON.stringify({ error: 'Invalid isSaving value' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize inputs
    const sanitizedCurrent = currentProvider.trim().substring(0, 100);
    const sanitizedNew = newProvider.trim().substring(0, 100);

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    // Build detailed comparison context
    let comparisonDetails = '';
    if (comparison) {
      const { current, newProvider: newComp } = comparison;
      comparisonDetails = `\n\nDetailed Comparison:
Current Provider (${current?.name || sanitizedCurrent}):
- Contract: ${current?.contract_length || 'Unknown'}
- Settlement: ${current?.settlement_time || 'Unknown'}
- Debit Rate: ${current?.fees?.debit ? `${(current.fees.debit.avg * 100).toFixed(2)}%` : 'Unknown'}
- Credit Rate: ${current?.fees?.credit ? `${(current.fees.credit.avg * 100).toFixed(2)}%` : 'Unknown'}
- Monthly Rental: ${current?.fees?.monthly_rental ? `£${current.fees.monthly_rental}` : 'N/A'}

New Provider (${newComp?.name || sanitizedNew}):
- Contract: ${newComp?.contract_length || 'Unknown'}
- Settlement: ${newComp?.settlement_time || 'Unknown'}
- Debit Rate: ${newComp?.fees?.debit ? `${(newComp.fees.debit.avg * 100).toFixed(2)}%` : 'Unknown'}
- Credit Rate: ${newComp?.fees?.credit ? `${(newComp.fees.credit.avg * 100).toFixed(2)}%` : 'Unknown'}
- Monthly Rental: ${newComp?.fees?.monthly_rental ? `£${newComp.fees.monthly_rental}` : 'N/A'}`;
    }

    const advantagesText = keyAdvantages && keyAdvantages.length > 0 
      ? `\nKey Advantages: ${keyAdvantages.join(', ')}` 
      : '';

    let prompt = '';
    if (isSaving) {
      prompt = `You are a financial advisor helping businesses understand the benefits of switching payment providers. Write a compelling 2-3 sentence summary about why switching from ${sanitizedCurrent} to ${sanitizedNew} is beneficial. The business will save £${monthlySavings.toFixed(2)} per month and £${annualSavings.toFixed(2)} per year.${comparisonDetails}${advantagesText}\n\nBe persuasive, mention specific quantified savings and highlight 1-2 key operational benefits. Keep it concise and professional.`;
    } else {
      prompt = `You are a financial advisor helping businesses understand the benefits of switching payment providers. Write a brief 2-3 sentence message explaining that switching from ${sanitizedCurrent} to ${sanitizedNew} would result in higher costs of £${Math.abs(monthlySavings).toFixed(2)} per month and £${Math.abs(annualSavings).toFixed(2)} per year.${comparisonDetails}\n\nBe factual and suggest they might want to reconsider or explore other options.`;
    }

    console.log('Generating summary with prompt:', prompt);

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          maxOutputTokens: 150,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', {
        status: response.status,
        message: errorText,
        timestamp: new Date().toISOString()
      });
      throw new Error('Failed to generate summary');
    }

    const data = await response.json();
    const summary = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate summary';

    console.log('Generated summary:', summary);

    return new Response(
      JSON.stringify({ summary }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    // Log detailed errors server-side only
    console.error('Error in generate-switch-summary:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    // Return generic error to client
    return new Response(
      JSON.stringify({ error: 'Unable to generate summary. Please try again later.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
