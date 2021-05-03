module.exports = (client, message) => {
    if (message.content === 'ping') {
        message.reply('pong');
    }
}