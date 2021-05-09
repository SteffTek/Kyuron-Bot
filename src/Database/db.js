//IMPORTANT IMPORTS
const mongoose = require('mongoose');
const configHandler = require('./../Utils/configHandler.js');
const logger = require("../Utils/logger");
const config = configHandler.getConfig();
const LevelSystem = require('./../Modules/LevelSystem.js')
const { v4: uuidv4 } = require('uuid');

//MONGOOSE MODELS
const Guild = require('./models/guild.js');
const Ticket = require('./models/tickets.js');
const Announcement = require('./models/announcement.js');

/*
 * Connects the client with MongoDB
 */
module.exports.connect = function () {
    mongoose.connect(config.database.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, function (err) {
        if (err) throw err;
        logger.done("Connected to database!")
    });
}

/**
 * Loads and Inits the guildData for the specified guildID
 *
 * @param {string} guildID guild id
 *
 * @returns {object} guild data
 *
 */
module.exports.loadGuildData = async function (guildID) {
    let doc = await Guild.findOne({
        guildID: guildID
    }).exec().catch(err => console.log(err));

    if (doc === null) {
        const newDoc = await new Guild({
            guildID: guildID,
            modules: {
                auditLogging: false,
                autoResponder: false,
                autoMod: false,
                announcements: false,
                economy: false,
                fun: false,
                giveaway: false,
                leaveNotice: false,
                leveling: false,
                moderation: false,
                tickets: false,
                polls: false,
                timer: false,
                warn: false,
            },
            modRoles:[],
            muteRole:"",
            channels: {
                auditLogChannel: "",
                leaveNoticeChannel: "",
                ticketSystemChannel: "",
                levelSystemChannel: ""
            },
            settings: {

            },
            messages: {
                leaveNotice: "**%user% has left the server!**",
                ticketSystem: "**React with %emote% to create a ticket!**",
                ticketIntro: "**Hello %user%! Stay tuned, a moderator will watch your case soon!**",
                levelSystem: "%user% achieved **`Level %level%`**, congrats!"
            },
            messageIDs: {
                ticketSystem: "",
                reactionRoles: []
            },
            reactionRoles: {},
            levelSystem: new LevelSystem()
        });

        await newDoc.save().catch(err => console.log(err)).then(() => { doc = newDoc})
    }

    doc.levelSystem = LevelSystem.load(doc.levelSystem)
    return doc;
};

/**
 * Loads and Inits the ticketData for the specified guildID
 *
 * @param {string} guildID guild id
 * @param {string} userID user id
 * @returns {object} ticket data
 *
 */
module.exports.loadTicketData = async function (guildID, userID) {
    //GET TICKET
    let doc = await Ticket.findOne({
        guildID: guildID,
        userID: userID
    }).exec().catch(err => console.log(err));

    //CREATE NEW IF NONE
    if (doc === null) {
        const newDoc = await new Ticket({
            channelID: "",
            guildID: guildID,
            userID: userID,
            isClosed: false
        });

        await newDoc.save().catch(err => console.log(err)).then(() => { doc = newDoc})
    }
    return doc;
};

/**
 * Checks for duplicate Tickets
 *
 * @param {string} guildID guild id
 * @param {string} userID user id
 * @returns {boolean} hasTicket
 *
 */
module.exports.hasTicket = async function (guildID, userID) {
    //GET TICKET
    let doc = await Ticket.findOne({
        guildID: guildID,
        userID: userID
    }).exec().catch(err => console.log(err));

    //CREATE NEW IF NONE
    if (doc === null) {
        return false;
    }
    return true;
};

/**
 * Removes Ticket Data
 *
 * @param {string} guildID guild id
 * @param {string} channelID channel id
 *
 */
 module.exports.removeTicketData = async function (guildID, channelID) {
    //GET TICKET
    let doc = await Ticket.findOne({
        guildID: guildID,
        channelID: channelID
    }).exec().catch(err => console.log(err));

    //DO NOTING IF NOT FOUND
    if (doc === null) return;

    doc.remove();
};

/**
 * Removes Announcement Data
 *
 * @param {string} guildID guild id
 * @param {string} channelID channel id
 * @param {string} url announcement channel
 *
 */
 module.exports.removeAnnouncement = async function (guildID, channelID, url) {
    //GET TICKET
    let doc = await Announcement.findOne({
        channelURL: url,
        discordChannelID: channelID,
        discordGuildID: guildID
    }).exec().catch(err => console.log(err));

    //DO NOTING IF NOT FOUND
    if (doc === null) return;

    doc.remove();
};

/**
 * Adds Announcement Data
 *
 * @param {string} guildID guild id
 * @param {string} channelID channel id
 * @param {string} channelID channel id
 * @param {string} channelID channel id
 * @param {string} url announcement channel
 *
 */
 module.exports.loadAnnouncement = async function (guildID, channelID, url, type, displayText) {
    //GET ANNOUNCEMENT
    let doc = await Announcement.findOne({
        channelType: type,
        channelURL: url,
        discordChannelID: channelID,
        discordGuildID: guildID,
        displayText: displayText
    }).exec().catch(err => console.log(err));

    //CREATE NEW IF NONE
    if (doc === null) {
        const newDoc = await new Announcement({
            channelType: type,
            channelURL: url,
            discordChannelID: channelID,
            discordGuildID: guildID,
            displayText: displayText
        });

        await newDoc.save().catch(err => console.log(err)).then(() => { doc = newDoc})
    }
    return doc;
};

/**
 * Checks for duplicate Announcements
 *
 * @param {string} guildID guild id
 * @param {string} channelID channel id
 * @param {string} url announcement channel
 * @returns {boolean} hasTicket
 *
 */
 module.exports.hasAnnouncement = async function (guildID, channelID, url) {
    //GET TICKET
    let doc = await Announcement.findOne({
        channelURL: url,
        discordChannelID: channelID,
        discordGuildID: guildID
    }).exec().catch(err => console.log(err));

    //CREATE NEW IF NONE
    if (doc === null) {
        return false;
    }
    return true;
};