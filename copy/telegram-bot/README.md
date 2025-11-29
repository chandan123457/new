# 🤖 Telegram Bot for @Anku456Bot

Complete backend implementation for your Telegram bot with support for both **Python** and **Node.js**.

## 📋 Bot Information

- **Bot Username**: @Anku456Bot
- **Bot Token**: `8533220670:AAE1ygUg7OBuaVLXRpwhXGOWkX55dbbfGrI`

## ✨ Features

✅ Reply to messages automatically  
✅ Handle `/start` command with welcome message  
✅ Handle `/help` command  
✅ Intelligent message responses  
✅ Error handling  
✅ Logging for debugging  
✅ Environment variable support  

---

## 🐍 Option 1: Python Implementation

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation

```bash
cd telegram-bot

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Run the Bot

```bash
python bot.py
```

### Python Bot Features

- Uses `python-telegram-bot` library (v20.7)
- Async/await for better performance
- Comprehensive error handling
- Detailed logging
- Type hints for better code quality

---

## 🟢 Option 2: Node.js Implementation

### Prerequisites

- Node.js 14 or higher
- npm (Node package manager)

### Installation

```bash
cd telegram-bot

# Install dependencies
npm install
```

### Run the Bot

```bash
# Production mode
npm start

# Development mode (with auto-restart)
npm run dev
```

### Node.js Bot Features

- Uses `node-telegram-bot-api` library
- Simple and lightweight
- Event-driven architecture
- Polling for receiving updates
- Error handling and logging

---

## 🎯 Bot Commands

| Command | Description |
|---------|-------------|
| `/start` | Welcome message and bot introduction |
| `/help` | Show help information and available commands |

## 💬 Message Handling

The bot responds intelligently to various messages:

- **Greetings**: "hello", "hi", "hey" → Personalized greeting
- **Questions**: Messages with "?" → Acknowledges question
- **Name queries**: "what is your name", "who are you" → Bot introduction
- **Thanks**: "thank" → Polite response
- **Goodbye**: "bye", "goodbye" → Farewell message
- **Other messages**: Echo back with friendly response

## 🔐 Security Best Practices

### ⚠️ IMPORTANT: Protect Your Bot Token

Your bot token is like a password. Anyone with this token can control your bot!

### Recommended Steps:

1. **Use Environment Variables**
   ```bash
   # Edit .env file
   TELEGRAM_BOT_TOKEN=your_token_here
   ```

2. **Never Commit Tokens to Git**
   - The `.gitignore` file is already configured
   - Token should only be in `.env` (which is git-ignored)

3. **Regenerate Token if Exposed**
   - Go to @BotFather on Telegram
   - Use `/revoke` command to get a new token

---

## 📁 Project Structure

```
telegram-bot/
├── bot.py              # Python implementation
├── bot.js              # Node.js implementation
├── requirements.txt    # Python dependencies
├── package.json        # Node.js dependencies
├── .env                # Environment variables (your token)
├── .env.example        # Example env file
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

---

## 🚀 Quick Start Guide

### Python Quick Start

```bash
cd telegram-bot
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python bot.py
```

### Node.js Quick Start

```bash
cd telegram-bot
npm install
npm start
```

---

## 🧪 Testing Your Bot

1. **Start the bot** (using Python or Node.js)
2. **Open Telegram** and search for `@Anku456Bot`
3. **Send `/start`** to see the welcome message
4. **Send any message** to get a response
5. **Try `/help`** to see available commands

### Test Messages:

- "Hello" → Should greet you back
- "How are you?" → Should respond to your question
- "What is your name?" → Should introduce itself
- "Thank you" → Should acknowledge
- "Goodbye" → Should say farewell

---

## 🐛 Troubleshooting

### Python Issues

**Error: No module named 'telegram'**
```bash
pip install -r requirements.txt
```

**Error: Bot token is invalid**
- Check your token in `.env` file
- Verify token with @BotFather

### Node.js Issues

**Error: Cannot find module 'node-telegram-bot-api'**
```bash
npm install
```

**ETELEGRAM error**
- Check your internet connection
- Verify bot token is correct

### Common Issues

**Bot doesn't respond**
- Make sure the bot is running (check terminal)
- Check for error messages in console
- Verify bot token is correct

**"Conflict: terminated by other getUpdates request"**
- Only one instance of the bot can run at a time
- Stop other running instances

---

## 📊 Monitoring

Both implementations provide console logging:

```
✅ Bot @Anku456Bot is now running!
📱 Waiting for messages...
📨 Message from John (ID: 123456): Hello
✅ Sent response to John
```

---

## 🔧 Customization

### Adding New Commands

**Python:**
```python
async def custom_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Custom response")

application.add_handler(CommandHandler("custom", custom_command))
```

**Node.js:**
```javascript
bot.onText(/\/custom/, (msg) => {
  bot.sendMessage(msg.chat.id, "Custom response");
});
```

### Modifying Responses

Edit the message handling section in `bot.py` or `bot.js` to customize responses.

---

## 📚 Additional Resources

### Python
- [python-telegram-bot Documentation](https://docs.python-telegram-bot.org/)
- [Telegram Bot API](https://core.telegram.org/bots/api)

### Node.js
- [node-telegram-bot-api Documentation](https://github.com/yagop/node-telegram-bot-api)
- [Telegram Bot API](https://core.telegram.org/bots/api)

---

## 🌐 Deployment Options

### Free Hosting Options:

1. **Railway** (Recommended)
   - Sign up at railway.app
   - Connect GitHub repo
   - Add `TELEGRAM_BOT_TOKEN` environment variable
   - Deploy!

2. **Heroku**
   - Free tier available
   - Easy deployment
   - Add buildpack for Python/Node.js

3. **Replit**
   - Run directly in browser
   - Keep alive with UptimeRobot

4. **VPS (DigitalOcean, Linode, etc.)**
   - Full control
   - Run with PM2 (Node.js) or systemd (Python)

### Keep Bot Running 24/7

**Node.js with PM2:**
```bash
npm install -g pm2
pm2 start bot.js --name telegram-bot
pm2 save
pm2 startup
```

**Python with systemd:**
```bash
sudo nano /etc/systemd/system/telegram-bot.service
sudo systemctl enable telegram-bot
sudo systemctl start telegram-bot
```

---

## 📞 Support

If you encounter issues:

1. Check the console/terminal for error messages
2. Verify your bot token with @BotFather
3. Make sure only one instance is running
4. Check your internet connection

---

## 📝 License

MIT License - Free to use and modify

---

## 🎉 Your Bot is Ready!

Choose Python or Node.js, follow the installation steps, and your bot will be live!

**Next Steps:**
1. Choose your preferred language (Python or Node.js)
2. Install dependencies
3. Run the bot
4. Test on Telegram
5. Customize responses as needed
6. Deploy to production (optional)

Happy Botting! 🤖✨
