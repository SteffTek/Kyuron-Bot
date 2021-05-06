//IMPORTANT IMPORTS
const mongoose = require('mongoose');
const configHandler = require('./../Utils/configHandler.js');
const logger = require("../Utils/Logger");

const guild = require('./models/guild.js');
const config = configHandler.getConfig();

//MONGOOSE MODELS
const Guild = require('./models/guild.js');

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
                announcementChannel: "",
                leaveNoticeChannel: "",
                ticketSystemChannel: "",
            },
            settings: {

            },
            messages: {
                leaveNotice: "**%user% has left the server!**",
                ticketSystem: "**React with %emote% to create a ticket!**"
            },
            messageIDs: {
                ticketSystem: "",
                reactionRoles: []
            },
            reactionRoles: {}
        });

        await newDoc.save().catch(err => console.log(err)).then(() => { doc = newDoc})
    }

    return doc;
}

/**
 * Loads and Inits the guildData for the specified guildID
 *
 * @param {object} guildData guild data
 *
 */
 module.exports.saveGuildData = async function (guildData) {
    await guildData.save().catch(err => console.log(err));
}