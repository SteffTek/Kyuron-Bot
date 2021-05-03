//IMPORTANT IMPORTS
const logger = require("../Utils/Logger");
const configHandler = require("../Utils/ConfigHandler");
const config = configHandler.getConfig();
const Discord = require('discord.js');

/* EVENT IMPORTS */
const ready = require("./Events/Ready");
const message = require("./Events/Message");

module.exports = (client) => {

    /* Startup Event */
    client.on('ready', () => {
        ready(client);
    });

    /* Message Event */
    client.on('message', msg => {
        message(client, msg);
    });
}