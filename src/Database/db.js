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
const Reaction = require('./models/reaction.js');
const ModAction = require('./models/modAction.js');
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
                autoVoiceChannel: false,
                announcements: false,
                economy: false,
                fun: false,
                giveaway: false,
                leaveNotice: false,
                leveling: false,
                moderation: false,
                tickets: false,
                polls: false,
                reactionRoles: false,
                timer: false,
                warn: false,
            },
            modRoles:[],
            muteRole:"",
            channels: {
                auditLogChannel: "",
                auditLogIgnore: [],
                leaveNoticeChannel: "",
                ticketSystemChannel: "",
                levelSystemChannel: "",
                autoVoiceChannel: ""
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
                ticketSystem: ""
            },
            levelSystem: new LevelSystem(),
            blacklist: []
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
 * @param {string} url url
 * @param {string} type type
 * @param {string} displayText display text
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

/**
 * Adds Reaction Data
 *
 * @param {string} guildID guild id
 * @param {string} channelID channel id
 * @param {string} messageID message id
 * @param {string} name name
 *
 */
 module.exports.loadReaction = async function (guildID, channelID, messageID, name) {
    //GET ANNOUNCEMENT
    let doc = await Reaction.findOne({
        guildID: guildID,
        channelID: channelID,
        messageID: messageID,
        name: name
    }).exec().catch(err => console.log(err));

    //CREATE NEW IF NONE
    if (doc === null) {
        const newDoc = await new Reaction({
            guildID: guildID,
            channelID: channelID,
            messageID: messageID,
            name: name,
            roles: {}
        });

        await newDoc.save().catch(err => console.log(err)).then(() => { doc = newDoc})
    }
    return doc;
};

/**
 * Adds Reaction Data
 *
 * @param {string} guildID guild id
 * @param {string} channelID channel id
 * @param {string} messageID message id
 * @param {string} name name
 *
 */
 module.exports.getReaction = async function (guildID, channelID, messageID) {
    //GET ANNOUNCEMENT
    let doc = await Reaction.findOne({
        guildID: guildID,
        channelID: channelID,
        messageID: messageID
    }).exec().catch(err => console.log(err));
    return doc;
};

/**
 * Adds Reaction Data
 *
 * @param {string} guildID guild id
 * @param {string} channelID channel id
 * @param {string} messageID message id
 * @param {string} name name
 *
 */
 module.exports.getReactionByName = async function (guildID, channelID, name) {
    //GET ANNOUNCEMENT
    let doc = await Reaction.findOne({
        guildID: guildID,
        channelID: channelID,
        name: name
    }).exec().catch(err => console.log(err));
    return doc;
};

/**
 * Adds Reaction Data
 *
 * @param {string} guildID guild id
 * @param {string} channelID channel id
 * @param {string} messageID message id
 *
 */
 module.exports.hasReaction = async function (guildID, channelID, messageID) {
    //GET ANNOUNCEMENT
    let doc = await Reaction.findOne({
        guildID: guildID,
        channelID: channelID,
        messageID: messageID
    }).exec().catch(err => console.log(err));

    //CREATE NEW IF NONE
    if (doc === null) {
        return false;
    }
    return true;
};

/**
 * Adds Reaction Data
 *
 * @param {string} guildID guild id
 * @param {string} channelID channel id
 * @param {string} messageID message id
 *
 */
 module.exports.hasReactionByName = async function (guildID, channelID, name) {
    //GET ANNOUNCEMENT
    let doc = await Reaction.findOne({
        guildID: guildID,
        channelID: channelID,
        name: name
    }).exec().catch(err => console.log(err));

    //CREATE NEW IF NONE
    if (doc === null) {
        return false;
    }
    return true;
};

/**
 * Adds ModAction Data
 *
 * @param {string} guildID guild id
 * @param {string} userID user id
 * @param {string} moderatorID user id
 * @param {string} reason reason
 * @param {string} action action
 * @param {boolean} isTemp is temporary
 * @param {number} until timestamp when action will be lifted
 * @param {boolean} isDone is lifted
 *
 */
 module.exports.addModerationData = async function (guildID, userID, moderatorID, reason, action, isTemp = false, until = null, isDone = true) {
    //CREATE NEW
    const newDoc = await new ModAction({
        guildID: guildID,
        userID: userID,
        moderatorID: moderatorID,
        reason: reason,
        timestamp: Date.now(),
        action: action,
        isTemp: isTemp,
        isDone: isDone,
        until: until
    });

    await newDoc.save().catch(err => console.log(err)).then(() => { doc = newDoc})

    return doc;
};