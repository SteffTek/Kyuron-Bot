//IMORTANT IMPORTS
const Discord = require('discord.js')
const configHandler = require('./configHandler.js');
const config = configHandler.getConfig();
const utils = require('../Utils/utils.js');
const APICalls = require('./APICalls.js')

/**
 * Sends a simple Discord.MessageEmbed for error messages.
 * If no client or interaction is specified then the embed will just be returned.
 *
 * @param {string} message Error message
 * @param {Discord.Client} client Discord client
 * @param {object} interaction Interaction that this embed will be send as an response to
 * 
 */
module.exports.error = function (message, client, interaction) {
    const embed = new Discord.MessageEmbed()
        .setAuthor("⚠️ ERROR ⚠️")
        .setColor(utils.getColor("embedGen","error"))
        .setTimestamp()
        .setDescription(message);
    if (!client || !interaction) {
        return embed
    } else {
        APICalls.sendInteraction(client, {"content": "","embeds": [embed]}, interaction)
    }
}

/**
 * Sends a simple custom Discord.MessageEmbed.
 * If no client or interaction is specified then the embed will just be returned.
 * 
 * @param {string} title Embed title
 * @param {string} color Embed color (0xFFFFFF)
 * @param {string} message Embed message
 * @param {Discord.Client} client Discord client
 * @param {object} interaction Interaction that this embed will be send as an response to
 * 
 */
module.exports.custom = function (title, color, message, client, interaction) {
    const embed = new Discord.MessageEmbed()
        .setAuthor(title)
        .setColor(color)
        .setTimestamp()
        .setDescription(message);
    if (!client || !interaction) {
        return embed
    } else {
        APICalls.sendInteraction(client, {"content": "","embeds": [embed]}, interaction)
    }
}

/**
 * Sends a simple custom Discord.MessageEmbed.
 * If no client or interaction is specified then the embed will just be returned.
 *
 * @param {string} title Embed title
 * @param {string} color Embed color (0xFFFFFF)
 * @param {string} message Embed message
 * @param {string} imageURL Embed image
 * @param {Discord.Client} client Discord client
 * @param {object} interaction Interaction that this embed will be send as an response to
 *
 */
 module.exports.image = function (title, color, message, imageURL, client, interaction) {
    const embed = new Discord.MessageEmbed()
        .setAuthor(title)
        .setColor(color)
        .setTimestamp()
        .setImage(imageURL)
        .setDescription(message);
    if (!client || !interaction) {
        return embed
    } else {
        APICalls.sendInteraction(client, {"content": "","embeds": [embed]}, interaction)
    }
}