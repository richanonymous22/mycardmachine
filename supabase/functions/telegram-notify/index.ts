import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data, documents } = await req.json();
    
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      throw new Error('Telegram credentials not configured');
    }

    const timestamp = new Date(data.created_at).toLocaleString('en-GB', {
      dateStyle: 'short',
      timeStyle: 'short',
    });

    let message = '';
    let recordId = '';
    let recordType = '';

    if (type === 'callback') {
      recordId = data.id;
      recordType = 'callback';
      message = `🔔 *New Callback Request*\n\n`;
      message += `👤 *Name:* ${data.name}\n`;
      message += `📞 *Phone:* ${data.phone}\n`;
      message += `📧 *Email:* ${data.email || 'N/A'}\n`;
      if (data.business_name) message += `🏢 *Business:* ${data.business_name}\n`;
      message += `💼 *Partner:* ${data.partner_name}\n`;
      if (data.monthly_turnover) message += `💰 *Turnover:* £${parseFloat(data.monthly_turnover).toLocaleString()}/mo\n`;
      if (data.preferred_time) message += `🕐 *Preferred Time:* ${data.preferred_time}\n`;
      message += `📅 *Submitted:* ${timestamp}\n`;
      message += `📋 *Status:* ${data.status}\n`;
    } else {
      recordId = data.id;
      recordType = 'application';
      message = `📝 *New Application Submitted*\n\n`;
      message += `👤 *Name:* ${data.name}\n`;
      message += `📞 *Phone:* ${data.phone}\n`;
      message += `📧 *Email:* ${data.email}\n`;
      message += `💼 *Partner:* ${data.partner_name}\n`;
      message += `💰 *Turnover:* £${parseFloat(data.monthly_turnover).toLocaleString()}/mo\n`;
      if (data.estimated_annual_savings) {
        message += `💵 *Est. Annual Savings:* £${parseFloat(data.estimated_annual_savings).toLocaleString()}\n`;
      }
      message += `📅 *Submitted:* ${timestamp}\n`;
      message += `📋 *Status:* ${data.status}\n`;
      
      // Add documents information with URLs
      if (documents && documents.length > 0) {
        message += `\n📎 *Uploaded Documents (${documents.length}):*\n`;
        const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://gkvkixthomqczaoztgyq.supabase.co';
        documents.forEach((doc: any, index: number) => {
          // Use public storage path - bucket is now public
          const docUrl = `${supabaseUrl}/storage/v1/object/public/application-documents/${doc.file_path}`;
          const fileSize = doc.file_size ? `(${(doc.file_size / 1024).toFixed(1)}KB)` : '';
          message += `  ${index + 1}. [${doc.document_type}](${docUrl}) ${fileSize}\n`;
        });
      }
    }

    const inline_keyboard = {
      inline_keyboard: [
        [
          { text: '✅ Mark Contacted', callback_data: `contact_${recordType}_${recordId}` },
          { text: '🚀 Mark Converted', callback_data: `convert_${recordType}_${recordId}` },
        ],
        [
          { text: '🕓 Mark Pending', callback_data: `pending_${recordType}_${recordId}` },
        ],
      ],
    };

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
          reply_markup: inline_keyboard,
        }),
      }
    );

    if (!telegramResponse.ok) {
      const error = await telegramResponse.text();
      console.error('Telegram API error:', error);
      throw new Error('Failed to send Telegram message');
    }

    console.log('Telegram notification sent successfully');

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in telegram-notify:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});