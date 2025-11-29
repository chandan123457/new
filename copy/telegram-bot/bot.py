"""
Telegram Bot for @Anku456Bot
Python implementation using python-telegram-bot library

Features:
- Reply to messages
- Handle /start command
- Automatic chat responses
- Error handling
"""

import logging
import os
from typing import Final
from telegram import Update
from telegram.ext import (
    Application,
    CommandHandler,
    MessageHandler,
    filters,
    ContextTypes,
)

# Enable logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Bot token - NEVER commit this to version control!
# Use environment variable or .env file
BOT_TOKEN: Final = os.getenv('TELEGRAM_BOT_TOKEN', '8533220670:AAE1ygUg7OBuaVLXRpwhXGOWkX55dbbfGrI')
BOT_USERNAME: Final = '@Anku456Bot'


async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """
    Handles the /start command
    Sends a welcome message to the user
    """
    user = update.effective_user
    welcome_message = (
        f"👋 Hello {user.first_name}!\n\n"
        f"Welcome to {BOT_USERNAME}!\n\n"
        f"I'm here to chat with you. Here's what I can do:\n"
        f"• Reply to your messages\n"
        f"• Answer your questions\n"
        f"• Have a conversation with you\n\n"
        f"Just send me a message and I'll respond! 💬\n\n"
        f"Commands:\n"
        f"/start - Show this welcome message\n"
        f"/help - Get help information"
    )
    await update.message.reply_text(welcome_message)
    logger.info(f"User {user.first_name} (ID: {user.id}) started the bot")


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """
    Handles the /help command
    Provides help information to users
    """
    help_message = (
        "🤖 Bot Help\n\n"
        "Available Commands:\n"
        "/start - Start the bot and see welcome message\n"
        "/help - Show this help message\n\n"
        "How to use:\n"
        "Simply send me any message and I'll respond to you!\n\n"
        "Need assistance? Just ask me anything! 😊"
    )
    await update.message.reply_text(help_message)


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """
    Handles all text messages from users
    Processes the message and sends an appropriate response
    """
    user = update.effective_user
    message_text = update.message.text
    chat_type = update.message.chat.type
    
    logger.info(f"Message from {user.first_name} (ID: {user.id}): {message_text}")
    
    # Process the message
    text_lower = message_text.lower()
    
    # Generate response based on message content
    if 'hello' in text_lower or 'hi' in text_lower or 'hey' in text_lower:
        response = f"Hello {user.first_name}! 👋 How can I help you today?"
    
    elif 'how are you' in text_lower:
        response = "I'm doing great, thank you for asking! 😊 How are you?"
    
    elif 'what is your name' in text_lower or 'who are you' in text_lower:
        response = f"I'm {BOT_USERNAME}, your friendly Telegram bot! 🤖"
    
    elif 'thank' in text_lower:
        response = "You're welcome! Happy to help! 😊"
    
    elif 'bye' in text_lower or 'goodbye' in text_lower:
        response = "Goodbye! Have a great day! 👋"
    
    elif '?' in message_text:
        response = f"That's an interesting question! You asked: '{message_text}'\n\nI'm a simple bot, but I'm here to chat with you! 💬"
    
    else:
        # Default response - echo back with some personality
        response = f"You said: '{message_text}'\n\nI received your message! Feel free to ask me anything or just chat with me! 😊"
    
    # Send response
    await update.message.reply_text(response)
    logger.info(f"Sent response to {user.first_name}")


async def error_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """
    Handles errors in the bot
    """
    logger.error(f"Update {update} caused error {context.error}")
    
    # Notify user if possible
    if update and update.effective_message:
        await update.effective_message.reply_text(
            "❌ Sorry, something went wrong. Please try again later."
        )


def main() -> None:
    """
    Main function to run the bot
    """
    logger.info("Starting bot...")
    
    # Create the Application
    application = Application.builder().token(BOT_TOKEN).build()
    
    # Register command handlers
    application.add_handler(CommandHandler("start", start_command))
    application.add_handler(CommandHandler("help", help_command))
    
    # Register message handler for text messages
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    
    # Register error handler
    application.add_error_handler(error_handler)
    
    # Start the bot
    logger.info(f"Bot {BOT_USERNAME} is now running...")
    logger.info("Press Ctrl+C to stop the bot")
    
    # Run the bot until stopped
    application.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == '__main__':
    main()
