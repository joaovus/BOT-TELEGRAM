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
    await delay(5000); // Função delay que utiliza Promise
    await ctx.reply('carolgata1st@gmail.com');
    await delay(5000); // Função delay que utiliza Promise

    await ctx.reply('minha chave pix amor');
    await delay(5000);

    await ctx.reply('Meu VIP tá 10$, favor me enviar o comprovante vida, aí te libero meu VIP');
    await delay(10000);

    await bot.telegram.sendAudio(ctx.chat.id, { source: './mia02.opus' });
}

// Função delay para espera assíncrona
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Verifica comprovantes e libera VIP automaticamente
bot.on(['photo', 'document'], async (ctx) => {
    const userId = ctx.message.from.id;
    if (!pendingPayments.has(userId)) return; // Só aceita se o usuário tiver solicitado antes

    let isValidReceipt = false;

    // Verifica documentos (PDF, DOC) sem precisar de legenda
    if (ctx.message.document) {
        const fileName = ctx.message.document.file_name ? ctx.message.document.file_name.toLowerCase() : "";
        // Aceita qualquer documento PDF ou DOC com palavras-chave no nome
        isValidReceipt = validReceiptKeywords.some(keyword => fileName.includes(keyword)) || 
                         (fileName.endsWith('.pdf') || fileName.endsWith('.doc') || fileName.endsWith('.docx'));
    }

    // Verifica fotos com legenda
    if (ctx.message.photo) {
        if (ctx.message.caption) {
            const caption = ctx.message.caption.toLowerCase();
            isValidReceipt = validReceiptKeywords.some(keyword => caption.includes(keyword));
        } else {
            isValidReceipt = false; // Foto sem legenda não será aceita
        }
    }

    if (isValidReceipt) {
        // Mensagem de confirmação
        // Pausa de 20 segundos
        await delay(20000);
        await ctx.reply('PRONTO VIDA PODE CURTI SEM MODERAÇÃO SO CLICAR');

        // Criando o botão de ação
        const actionButton = {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Acessar o Canal',
                            url: 'https://t.me/+oAnD1tyT-7JkODNh' // Substitua pela URL do seu canal ou ação desejada
                        }
                    ]
                ]
            }
        };

        // Enviar a mensagem com o botão
        await ctx.reply('🎉 clique no botão e vem gozar gostoso!', actionButton);
        // Pausa de 20 segundos
        await delay(10000);

        // Pergunta sobre enviar mais $20 para o crédito
        await ctx.reply('Amor, poderia enviar mais 20$ pra eu colocar um crédito?');
        
        // Pausa de 2 minutos antes de perguntar sobre a videochamada
        await delay(10000);

        // Pergunta sobre videochamada com botão
        const videoCallButton = {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Sim, quero uma videochamada!',
                            url: 'https://t.me/Carolsafadinha' // Substitua pelo link para a videochamada
                        }
                    ]
                ]
            }
        };

        await ctx.reply('💋 Amor, você vai querer uma videochamada? Clica no botão abaixo se sim!', videoCallButton);

        pendingPayments.delete(userId); // Remove da lista de pendentes
    } else {
        // Criar o botão de suporte
        const supportButton = {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Entrar em contato comigo',
                            url: 'https://t.me/Carolsafadinha' // Substitua pela URL do seu canal de suporte
                        }
                    ]
                ]
            }
        };

        await ctx.reply('🚫 Ainda não reconheci seu pagamento vida. Se precisar de ajuda, clique no botão abaixo para entrar em contato comigo.', supportButton);
    }
});

// Inicia o fluxo quando recebe qualquer mensagem
bot.on('message', (ctx) => {
    if (!ctx.message.from.is_bot) {
        sendMessagesWithPause(ctx);
    }
});

// Inicia o bot
bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
