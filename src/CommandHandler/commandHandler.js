"use strict";

// Core Modules
const Discord = require('discord.js')
let fs = require("fs");

module.exports = function getCommands(client) {
    client.commands = new Discord.Collection();

    const commandFiles = fs.readdirSync('./src/CommandHandler/commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        client.commands.set(command.name, command);
    }
}