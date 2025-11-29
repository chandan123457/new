/**
 * Telegram Bot for @Anku456Bot
 * Node.js implementation using node-telegram-bot-api
 * 
 * Features:
 * - Reply to messages
 * - Handle /start command
 * - Automatic chat responses
 * - Error handling
 */

const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

// Bot token - NEVER commit this to version control!
// Use environment variable or .env file
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8533220670:AAE1ygUg7OBuaVLXRpwhXGOWkX55dbbfGrI';
const BOT_USERNAME = '@Anku456Bot';

// Create bot instance
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

console.log(`🤖 Bot ${BOT_USERNAME} is starting...`);

/**
 * Handle /start command
 * Sends welcome message to user
 */
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const user = msg.from;
  
  const welcomeMessage = `👋 Hello ${user.first_name}!\n\n` +
    `Welcome to ${BOT_USERNAME}!\n\n` +
    `I'm here to chat with you. Here's what I can do:\n` +
    `• Reply to your messages\n` +
    `• Answer your questions\n` +
    `• Have a conversation with you\n\n` +
    `Just send me a message and I'll respond! 💬\n\n` +
    `Commands:\n` +
    `/start - Show this welcome message\n` +
    `/help - Get help information`;
  
  bot.sendMessage(chatId, welcomeMessage);
  console.log(`✅ User ${user.first_name} (ID: ${user.id}) started the bot`);
});

/**
 * Handle /help command
 * Provides help information
 */
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  
  const helpMessage = `🤖 Bot Help\n\n` +
    `Available Commands:\n` +
    `/start - Start the bot and see welcome message\n` +
    `/help - Show this help message\n\n` +
    `How to use:\n` +
    `Simply send me any message and I'll respond to you!\n\n` +
    `Need assistance? Just ask me anything! 😊`;
  
  bot.sendMessage(chatId, helpMessage);
  console.log(`📋 Help sent to user ID: ${msg.from.id}`);
});

/**
 * Handle all text messages
 * Process and respond to user messages
 */
bot.on('message', (msg) => {
  // Skip if it's a command (already handled above)
  if (msg.text && msg.text.startsWith('/')) {
    return;
  }
  
  const chatId = msg.chat.id;
  const messageText = msg.text;
  const user = msg.from;
  
  // Log user's chat ID (useful for setting up ADMIN_CHAT_ID)
  console.log(`\n📋 User Info:`);
  console.log(`   Name: ${user.first_name} ${user.last_name || ''}`);
  console.log(`   Username: @${user.username || 'N/A'}`);
  console.log(`   Chat ID: ${user.id}`);
  console.log(`   Message: ${messageText}\n`);
  console.log(`💡 To receive login notifications, add this to .env file:`);
  console.log(`   ADMIN_CHAT_ID=${user.id}\n`);
  
  // Process message and generate response
  const textLower = messageText ? messageText.toLowerCase() : '';
  let response;
  
  if (textLower.includes('hello') || textLower.includes('hi') || textLower.includes('hey')) {
    response = `Hello ${user.first_name}! 👋 How can I help you today?`;
  }
  else if (textLower.includes('how are you')) {
    response = "I'm doing great, thank you for asking! 😊 How are you?";
  }
  else if (textLower.includes('what is your name') || textLower.includes('who are you')) {
    response = `I'm ${BOT_USERNAME}, your friendly Telegram bot! 🤖`;
  }
  else if (textLower.includes('thank')) {
    response = "You're welcome! Happy to help! 😊";
  }
  else if (textLower.includes('bye') || textLower.includes('goodbye')) {
    response = "Goodbye! Have a great day! 👋";
  }
  else if (messageText && messageText.includes('?')) {
    response = `That's an interesting question! You asked: '${messageText}'\n\n` +
               `I'm a simple bot, but I'm here to chat with you! 💬`;
  }
  else if (messageText) {
    // Default response - echo back with personality
    response = `You said: '${messageText}'\n\n` +
               `I received your message! Feel free to ask me anything or just chat with me! 😊`;
  }
  else {
    // Handle non-text messages (photos, stickers, etc.)
    response = "I received your message! Currently I can only respond to text messages. Send me some text! 💬";
  }
  
  // Send response
  bot.sendMessage(chatId, response);
  console.log(`✅ Sent response to ${user.first_name}`);
});

/**
 * Handle polling errors
 */
bot.on('polling_error', (error) => {
  console.error('❌ Polling error:', error.code, error.message);
});

/**
 * Handle general errors
 */
bot.on('error', (error) => {
  console.error('❌ Bot error:', error);
});

// Log when bot is ready
console.log(`✅ Bot ${BOT_USERNAME} is now running!`);
console.log('📱 Waiting for messages...');
console.log('Press Ctrl+C to stop the bot\n');
