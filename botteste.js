require('dotenv').config();
const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

const validReceiptKeywords = ["comprovante", "nubank", "caixa", "picpay", "itau", "bradesco", "inter"];
const usersWithFlow = new Set();
const pendingPayments = new Set(); // Armazena IDs de usuários que precisam enviar comprovante

// Função para enviar as mensagens com pausa e solicitar comprovante
async function sendMessagesWithPause(ctx) {
    const userId = ctx.message.from.id;

    if (usersWithFlow.has(userId)) return;

    usersWithFlow.add(userId);
    pendingPayments.add(userId); // Marca que esse usuário precisa enviar comprovante

    await ctx.reply('carolgata1st@gmail.com');
    await new Promise(resolve => setTimeout(resolve, 5000));

    await ctx.reply('minha chave pix amor');
    await new Promise(resolve => setTimeout(resolve, 5000));

    await ctx.reply('Meu VIP tá 10$, favor me enviar o comprovante vida, aí te libero meu VIP');
    await new Promise(resolve => setTimeout(resolve, 10000));

    await bot.telegram.sendAudio(ctx.chat.id, { source: './mia02.opus' });
}

// Verifica comprovantes e libera VIP automaticamente
bot.on(['photo', 'document'], async (ctx) => {
    const userId = ctx.message.from.id;
    if (!pendingPayments.has(userId)) return; // Só aceita se o usuário tiver solicitado antes

    let isValidReceipt = false;

    if (ctx.message.document) {
        // Verifica se o documento tem um nome válido (exemplo: "comprovante_nubank.pdf")
        const fileName = ctx.message.document.file_name ? ctx.message.document.file_name.toLowerCase() : "";
        isValidReceipt = validReceiptKeywords.some(keyword => fileName.includes(keyword));
    }

    if (ctx.message.photo) {
        if (ctx.message.caption) {
            // Foto só será aceita se a legenda contiver "comprovante" ou palavras-chave
            const caption = ctx.message.caption.toLowerCase();
            isValidReceipt = validReceiptKeywords.some(keyword => caption.includes(keyword));
        } else {
            isValidReceipt = false; // Foto sem legenda não será aceita
        }
    }

    if (isValidReceipt) {
        await ctx.reply('✅ Comprovante recebido com sucesso!');
        await ctx.reply('Aqui está seu VIP: https://seulinkvip.com');
        pendingPayments.delete(userId); // Remove da lista de pendentes
    } else {
        await ctx.reply('🚫 Comprovante inválido! Envie um **documento (PDF)** ou uma **foto com legenda contendo "comprovante"**.');
    }
});

// Resposta automática a qualquer mensagem para simular o processo
bot.on('message', (ctx) => {
    if (!ctx.message.from.is_bot) {
        sendMessagesWithPause(ctx);
    }
});

// Resposta automática para qualquer comprovante recebido
bot.on(['photo', 'document'], (ctx) => {
    // Confirma o recebimento do comprovante
    ctx.reply('📥 Comprovante recebido! Processando...');
});

// Inicia o bot
bot.launch();
bo
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
