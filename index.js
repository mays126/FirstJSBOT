const TelegramApi = require('node-telegram-bot-api')
const TOKEN = "5599518011:AAH8yZqKsT-ehZCNOpqIlwL-7dZlRDnynUQ"
const {gameOptions, againOptions} = require('./options.js')

const bot = new TelegramApi(TOKEN, {polling: true})


const chats = {}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру, а ты её отгадаешь!')
    const random = Math.floor(Math.random() * 10)
    chats[chatId] = random;
    console.log(random)
    await bot.sendMessage(chatId, "Отгадывай!", gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветсвие'},
        {command: '/info', description: 'Информация о пользователе'},
        {command: '/game', description: 'Начать игру'},
    ])
    
    bot.on('message', async message => {
        const text = message.text;
        const chatId = message.chat.id;
        if (text === '/start'){
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/119/9cb/1199cbba-4b17-47f9-a437-907b5a6034c2/8.webp')
            return await bot.sendMessage(chatId, 'Привет!')
        }
        if (text === '/info'){
            return await bot.sendMessage(chatId, 'Тебя зовут '+message.chat.first_name)
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю')
    })
    bot.on("callback_query", async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data == chats[chatId]) {
            return await bot.sendMessage(chatId, "Поздравляю ты угадал! Цифра: " + chats[chatId], againOptions)
        }
        else {
            return await bot.sendMessage(chatId, 'К сожалению ты не угадал! Цифра: '+ chats[chatId], againOptions)
        }
    })
}

start()