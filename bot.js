require('dotenv').config();  
const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

// Lista de usuários que já receberam o fluxo
const usersWithFlow = new Set();

// Função para enviar as mensagens com pausa
async function sendMessagesWithPause(ctx) {
    const userId = ctx.message.from.id;

    // Se o usuário já recebeu o fluxo, não faz nada
    if (usersWithFlow.has(userId)) {
        return;
    }

    // Marca o usuário como já atendido
    usersWithFlow.add(userId);
    
    await new Promise(resolve => setTimeout(resolve, 5000));

    await ctx.reply('carolgata1st@gmail.com');
    await new Promise(resolve => setTimeout(resolve, 5000));

    await ctx.reply('minha chave pix amor');
    await new Promise(resolve => setTimeout(resolve, 5000));

    await ctx.reply('Meu VIP tá 10$, favor me enviar o comprovante vida, aí te libero meu VIP');
    await new Promise(resolve => setTimeout(resolve, 10000));

    await bot.telegram.sendAudio(ctx.chat.id, { source: './mia02.opus' });

}

// Responde apenas se o usuário ainda não recebeu o fluxo
bot.on('message', (ctx) => {
    if (!ctx.message.from.is_bot) {
        sendMessagesWithPause(ctx);
    } 
});

// Inicia o bot
bot.launch();  

// Finaliza corretamente ao encerrar o script
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
