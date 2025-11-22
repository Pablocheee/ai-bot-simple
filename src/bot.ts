import { Telegraf } from 'telegraf';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

bot.start(async (ctx) => {
  await ctx.reply("?? Бесплатный ИИ-помощник с Gemini 2.0 Flash\n\nПросто задайте вопрос!");
});

bot.on('text', async (ctx) => {
  if (ctx.message.text.startsWith('/')) return;
  
  try {
    await ctx.sendChatAction('typing');
    const result = await model.generateContent(ctx.message.text);
    const response = await result.response;
    let text = response.text();
    
    // Просто ограничиваем длинные сообщения
    if (text.length > 4000) {
      text = text.substring(0, 4000) + '\n\n... (сообщение сокращено)';
    }
    
    await ctx.reply(text);
  } catch (error) {
    await ctx.reply('?? Ошибка, попробуйте позже');
  }
});

bot.launch().then(() => {
  console.log('? Bot started successfully');
});
