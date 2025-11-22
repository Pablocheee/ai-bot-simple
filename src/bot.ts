import { Telegraf } from 'telegraf';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

bot.start(async (ctx) => {
  await ctx.reply("?? AI Assistant with Gemini 2.0 Flash\n\nJust ask your question!");
});

bot.on('text', async (ctx) => {
  if (ctx.message.text.startsWith('/')) return;
  
  try {
    await ctx.sendChatAction('typing');
    const result = await model.generateContent(ctx.message.text);
    const response = await result.response;
    let text = response.text();
    
    // Limit long messages
    if (text.length > 4000) {
      text = text.substring(0, 4000) + '\n\n... (message shortened)';
    }
    
    await ctx.reply(text);
  } catch (error) {
    await ctx.reply('?? Error, please try again later');
  }
});

bot.launch().then(() => {
  console.log('? Bot started successfully');
});
