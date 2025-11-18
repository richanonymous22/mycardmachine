import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
const TELEGRAM_ADMIN_IDS = (Deno.env.get('TELEGRAM_ADMIN_IDS') || '').split(',');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  try {
    const update = await req.json();
    console.log('Telegram webhook received:', JSON.stringify(update));

    // Handle callback button clicks
    if (update.callback_query) {
      const { callback_query } = update;
      const data = callback_query.data;
      const chatId = callback_query.message.chat.id;
      const messageId = callback_query.message.message_id;

      // Parse callback data: format is "action_type_id"
      const [action, recordType, recordId] = data.split('_');

      let newStatus = '';
      if (action === 'contact') newStatus = 'contacted';
      else if (action === 'convert') newStatus = 'converted';
      else if (action === 'pending') newStatus = 'pending';

      const table = recordType === 'callback' ? 'callback_requests' : 'applications';

      const { error } = await supabase
        .from(table)
        .update({ status: newStatus })
        .eq('id', recordId);

      if (error) {
        console.error('Error updating status:', error);
        await answerCallback(callback_query.id, '❌ Failed to update status');
        return new Response(JSON.stringify({ ok: true }));
      }

      // Update the message to show the status change
      const statusEmoji = newStatus === 'contacted' ? '✅' : newStatus === 'converted' ? '🚀' : '🕓';
      await editMessageText(
        chatId,
        messageId,
        callback_query.message.text + `\n\n${statusEmoji} *Updated to: ${newStatus}*`
      );

      await answerCallback(callback_query.id, `✅ Status updated to ${newStatus}`);
      
      return new Response(JSON.stringify({ ok: true }));
    }

    // Handle commands
    if (update.message?.text?.startsWith('/')) {
      const { message } = update;
      const userId = message.from.id.toString();
      const chatId = message.chat.id;
      const command = message.text.split(' ')[0];

      // Check if user is admin
      if (!TELEGRAM_ADMIN_IDS.includes(userId)) {
        await sendMessage(chatId, '❌ Unauthorized. Admin access only.');
        return new Response(JSON.stringify({ ok: true }));
      }

      if (command === '/stats' || command === '/refresh') {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        // Get stats from both tables
        const { data: allApps } = await supabase.from('applications').select('*');
        const { data: allCallbacks } = await supabase.from('callback_requests').select('*');

        const apps = allApps || [];
        const callbacks = allCallbacks || [];
        const all = [...apps, ...callbacks];

        const todayCount = all.filter(r => new Date(r.created_at) >= todayStart).length;
        const weekCount = all.filter(r => new Date(r.created_at) >= weekStart).length;
        const monthCount = all.filter(r => new Date(r.created_at) >= monthStart).length;
        const totalCount = all.length;

        const newCount = all.filter(r => r.status === 'pending').length;
        const contactedCount = all.filter(r => r.status === 'contacted').length;
        const convertedCount = all.filter(r => r.status === 'converted').length;

        let statsMessage = `📊 *Submission Statistics*\n\n`;
        statsMessage += `📅 *Today:* ${todayCount}\n`;
        statsMessage += `📅 *This Week:* ${weekCount}\n`;
        statsMessage += `📅 *This Month:* ${monthCount}\n`;
        statsMessage += `📅 *All Time:* ${totalCount}\n\n`;
        statsMessage += `*Status Breakdown:*\n`;
        statsMessage += `🆕 Pending: ${newCount}\n`;
        statsMessage += `✅ Contacted: ${contactedCount}\n`;
        statsMessage += `🚀 Converted: ${convertedCount}\n\n`;
        statsMessage += `*Available Commands:*\n`;
        statsMessage += `/stats - View statistics\n`;
        statsMessage += `/pending - View pending submissions\n`;
        statsMessage += `/contacted - View contacted submissions\n`;
        statsMessage += `/converted - View converted submissions\n`;
        statsMessage += `/help - Show all commands`;

        await sendMessage(chatId, statsMessage);
      } else if (command === '/pending' || command === '/contacted' || command === '/converted') {
        const status = command.substring(1); // Remove the '/'
        
        const { data: apps } = await supabase
          .from('applications')
          .select('*')
          .eq('status', status)
          .order('created_at', { ascending: false })
          .limit(10);

        const { data: callbacks } = await supabase
          .from('callback_requests')
          .select('*')
          .eq('status', status)
          .order('created_at', { ascending: false })
          .limit(10);

        const allRecords = [...(apps || []), ...(callbacks || [])];
        
        if (allRecords.length === 0) {
          await sendMessage(chatId, `📭 No ${status} submissions found.`);
          return new Response(JSON.stringify({ ok: true }));
        }

        let listMessage = `📋 *${status.toUpperCase()} Submissions* (Last 10)\n\n`;
        
        allRecords.forEach((record, index) => {
          const isApp = 'partner_name' in record && 'estimated_annual_savings' in record;
          const type = isApp ? '📝 Application' : '📞 Callback';
          const date = new Date(record.created_at).toLocaleDateString();
          
          listMessage += `${index + 1}. ${type}\n`;
          listMessage += `   Name: ${record.name}\n`;
          listMessage += `   Phone: ${record.phone}\n`;
          if (isApp) {
            listMessage += `   Partner: ${record.partner_name}\n`;
            listMessage += `   Savings: £${record.estimated_annual_savings?.toLocaleString() || 'N/A'}\n`;
          }
          listMessage += `   Date: ${date}\n\n`;
        });

        await sendMessage(chatId, listMessage);
      } else if (command === '/help') {
        let helpMessage = `🤖 *Bot Commands*\n\n`;
        helpMessage += `📊 /stats - View submission statistics\n`;
        helpMessage += `🆕 /pending - List all pending submissions\n`;
        helpMessage += `✅ /contacted - List contacted submissions\n`;
        helpMessage += `🚀 /converted - List converted submissions\n`;
        helpMessage += `🔄 /refresh - Refresh statistics\n`;
        helpMessage += `❓ /help - Show this help message\n\n`;
        helpMessage += `*Inline Buttons:*\n`;
        helpMessage += `Use buttons in notification messages to update submission status.`;
        
        await sendMessage(chatId, helpMessage);
      }

      return new Response(JSON.stringify({ ok: true }));
    }

    return new Response(JSON.stringify({ ok: true }));
  } catch (error: any) {
    console.error('Error in telegram-webhook:', error);
    return new Response(JSON.stringify({ ok: false, error: error.message }), { status: 500 });
  }
});

async function sendMessage(chatId: number, text: string) {
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'Markdown',
    }),
  });
}

async function answerCallback(callbackQueryId: string, text: string) {
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      callback_query_id: callbackQueryId,
      text,
    }),
  });
}

async function editMessageText(chatId: number, messageId: number, text: string) {
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/editMessageText`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: 'Markdown',
    }),
  });
}