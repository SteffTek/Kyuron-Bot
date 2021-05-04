//IMORTANT IMPORTS
const Discord = require('discord.js')
const configHandler = require('./configHandler.js');
const config = configHandler.getConfig();

/**
 * Creates a simple Discord.MessageEmbed for error messages
 *
 * @param {string} message Error message
 * 
 * @returns {Discord.MessageEmbed} Error Embed
 * 
 */
module.exports.error = function (message) {
    return new Discord.MessageEmbed()
        .setAuthor("⚠️ ERROR ⚠️")
        .setColor(config.embedGen.errorColor)
        .setDescription(message);
}

/**
 * Creates a simple custom Discord.MessageEmbed
 *
 * @param {string} title Embed title
 * @param {string} color Embed color (0xFFFFFF)
 * @param {string} message Embed message
 * 
 * @returns {Discord.MessageEmbed} Embed
 * 
 */
 module.exports.custom = function (title, color, message) {
    return new Discord.MessageEmbed()
        .setAuthor(title)
        .setColor(color)
        .setDescription(message);
}