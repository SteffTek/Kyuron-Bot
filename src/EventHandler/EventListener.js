//IMPORTANT IMPORTS
const logger = require("../Utils/Logger");
const configHandler = require("../Utils/ConfigHandler");
const config = configHandler.getConfig();
const Discord = require('discord.js');

/* EVENT IMPORTS */
const ready = require("./Events/Ready");
const message = require("./Events/Message");
const messageDelete = require("./Events/MessageDelete");
const messageUpdate = require("./Events/MessageUpdate");

const guildMemberAdd = require("./Events/GuildMemberAdd");
const guildMemberRemove = require("./Events/GuildMemberRemove");

module.exports = (client) => {

    /* CLIENT EVENTS*/
    client.on('ready', () => {
        ready(client);
    });

    client.on('invalidated', () => {

    });

    client.on('rateLimit', rateLimitInfo => {
        logger.error("Rate Limit hit! See following log...");
        console.log(rateLimitInfo);
    });

    /*
        MESSAGE EVENTS
    */
    client.on('message', msg => {
        message(client, msg);
    });

    client.on('messageUpdate', (oldMessage, newMessage) => {
        messageUpdate(client, oldMessage, newMessage);
    });

    client.on('messageDelete', message => {
        messageDelete(client, message);
    });

    client.on('messageDeleteBulk', messages => {

    });

    client.on('messageReactionAdd', (messageReaction, user) => {

    });

    client.on('messageReactionRemove', (messageReaction, user) => {

    });

    client.on('messageReactionRemoveAll', message => {

    });

    client.on('messageReactionRemoveEmoji', messageReaction => {

    });

    /*
        GUILD EVENTS
    */
    client.on('guildCreate', guild => {

    });

    client.on('guildDelete', guild => {

    });

    client.on('guildUpdate', (oldGuild, newGuild) => {

    });

    /*
        GUILD MEMBER EVENTS
    */
    client.on('guildMemberAdd', member => {
        guildMemberAdd(client, member);
    });

    client.on('guildMemberRemove', member => {
        guildMemberRemove(client, member);
    });

    client.on('guildMemberUpdate', (oldMember, newMember) => {

    });

    /*
        CHANNEL EVENTS
    */
    client.on("channelCreate", channel => {

    });

    client.on("channelDelete", channel => {

    });

    client.on("channelUpdate", (oldChannel, newChannel) => {

    });

    /*
        EMOJI EVENTS
    */
    client.on("emojiCreate", emoji => {

    });

    client.on("emojiDelete", emoji => {

    });

    client.on("emojiUpdate", (oldEmoji, newEmoji) => {

    });

    /*
        BAN EVENTS
    */
    client.on("guildBanAdd", (guild, user) => {

    });

    client.on("guildBanRemove", (guild, user) => {

    });

    /*
        INVITE EVENTS
    */
    client.on("inviteCreate", invite => {

    });

    client.on("inviteDelete", invite => {

    });

    /*
        ROLE EVENTS
    */
    client.on("roleCreate", role => {

    });

    client.on("roleDelete", role => {

    });

    client.on("roleUpdate", (oldRole, newRole) => {

    });
}