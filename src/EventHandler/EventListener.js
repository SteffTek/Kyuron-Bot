//IMPORTANT IMPORTS
const logger = require("../Utils/logger");
const configHandler = require("../Utils/configHandler");
const config = configHandler.getConfig();
const Discord = require('discord.js');

/* EVENT IMPORTS */
const ready = require("./Events/Ready");

const message = require("./Events/Message");
const messageDelete = require("./Events/MessageDelete");
const messageDeleteBulk = require("./Events/MessageDeleteBulk");
const messageUpdate = require("./Events/MessageUpdate");

const messageReactionAdd = require("./Events/MessageReactionAdd");

const guildMemberAdd = require("./Events/GuildMemberAdd");
const guildMemberRemove = require("./Events/GuildMemberRemove");
const guildBanAdd = require("./Events/GuildBanAdd");
const guildBanRemove = require("./Events/GuildBanRemove");

const channelCreate = require("./Events/ChannelCreate");
const channelDelete = require("./Events/ChannelDelete");
const channelUpdate = require("./Events/ChannelUpdate");

const roleCreate = require("./Events/RoleCreate");
const roleDelete = require("./Events/RoleDelete");
const roleUpdate = require("./Events/RoleUpdate");

module.exports = (client) => {

    /* CLIENT EVENTS*/
    client.on('ready', () => {
        ready(client);
    });

    client.on('invalidated', () => {

    });

    client.on('rateLimit', rateLimitInfo => {
        //logger.error("Rate Limit hit! See following log...");
        //console.log(rateLimitInfo);
        //NOTE: Das ding feuert bei Reactions was ultra nervig ist
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
        messageDeleteBulk(client, messages);
    });

    client.on('messageReactionAdd', (messageReaction, user) => {
        messageReactionAdd(client, messageReaction, user);
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
        //TODO: ADD GUILD
    });

    client.on('guildDelete', guild => {
        //TODO: DELETE GUILD, TICKETS AND SO ON
    });

    client.on('guildUpdate', (oldGuild, newGuild) => {
        //... I don't f*ing know?
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
        channelCreate(client, channel);
    });

    client.on("channelDelete", channel => {
        channelDelete(client, channel);
    });

    client.on("channelUpdate", (oldChannel, newChannel) => {
        channelUpdate(client, oldChannel, newChannel);
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
        guildBanAdd(client, guild, user);
    });

    client.on("guildBanRemove", (guild, user) => {
        guildBanRemove(client, guild, user);
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
        roleCreate(client, role);
    });

    client.on("roleDelete", role => {
        roleDelete(client, role);
    });

    client.on("roleUpdate", (oldRole, newRole) => {
        roleUpdate(client, oldRole, newRole);
    });
}