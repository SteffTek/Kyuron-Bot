//IMPORTANT IMPORTS
const logger = require("../Utils/Logger");
const configHandler = require("../Utils/ConfigHandler");
const config = configHandler.getConfig();
const Discord = require('discord.js');

module.exports = (client) => {

    /* Startup Event */
    client.on('ready', () => {
        logger.done(`Logged in as ${client.user.tag}!`);
    });

    /* Message Event */
    client.on('message', msg => {
        if (msg.content === 'ping') {
            msg.reply('pong');
        }
    });
}