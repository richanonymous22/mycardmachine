import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

interface EmailRequest {
  to: string;
  name: string;
  type: 'application' | 'callback';
  partnerName: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, name, type, partnerName }: EmailRequest = await req.json();

    const subject = type === 'application' 
      ? 'Application Received - We\'ll Be In Touch Soon!'
      : 'Callback Request Received - We\'ll Call You Soon!';

    const html = type === 'application' ? `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Application Received!</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            
            <p>Thank you for submitting your application for <strong>${partnerName}</strong>! We've received all your documents and our team is reviewing them.</p>
            
            <p><strong>What happens next?</strong></p>
            <ul>
              <li>Our team will review your application within 24 hours</li>
              <li>We'll contact you via email or phone with the next steps</li>
              <li>If approved, we'll guide you through the onboarding process</li>
            </ul>
            
            <p>If you have any questions in the meantime, feel free to reach out to us at <a href="mailto:thiyabit@gmail.com">thiyabit@gmail.com</a></p>
            
            <p>Best regards,<br><strong>The Payment Comparison Team</strong></p>
          </div>
          <div class="footer">
            <p>You're receiving this email because you submitted an application on our platform.</p>
          </div>
        </div>
      </body>
      </html>
    ` : `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .phone { font-size: 24px; color: #667eea; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📞 Callback Request Received!</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            
            <p>Thank you for requesting a callback regarding <strong>${partnerName}</strong>! Your request has been received and logged.</p>
            
            <p><strong>What happens next?</strong></p>
            <ul>
              <li>Our team will call you within 24 hours during business hours</li>
              <li>We'll discuss how ${partnerName} can help your business</li>
              <li>We'll answer any questions you have about fees and features</li>
            </ul>

            <p>If you need to speak with us urgently, you can also call us directly at:</p>
            <p class="phone">📞 0800 123 4567</p>
            <p style="font-size: 14px; color: #666;">Mon-Fri: 9am-6pm</p>
            
            <p>Looking forward to speaking with you soon!</p>
            
            <p>Best regards,<br><strong>The Payment Comparison Team</strong></p>
          </div>
          <div class="footer">
            <p>You're receiving this email because you requested a callback on our platform.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const { error } = await resend.emails.send({
      from: 'Payment Comparison <onboarding@resend.dev>',
      to: [to],
      subject: subject,
      html: html,
    });

    if (error) {
      throw error;
    }

    console.log('Confirmation email sent successfully to:', to);

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in send-confirmation-email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
