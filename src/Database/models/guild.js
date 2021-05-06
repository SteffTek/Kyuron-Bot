//IMPORTANT IMPORTS
const mongoose = require("mongoose");

const guildSchema = mongoose.Schema({
    guildID: String,
    modules: {
        auditLogging: Boolean,
        autoResponder: Boolean,
        autoMod: Boolean,
        announcements: Boolean,
        economy: Boolean,
        fun: Boolean,
        giveaway: Boolean,
        leaveNotice: Boolean,
        leveling: Boolean,
        moderation: Boolean,
        tickets: Boolean,
        polls: Boolean,
        timer: Boolean,
        warn: Boolean
    },
    modRoles: Array,
    muteRole: String,
    channels: {
        auditLogChannel: String,
        announcementChannel: String,
        leaveNoticeChannel: String,
        ticketSystemChannel: String,
        levelSystemChannel: String
    },
    settings: {

    },
    messages: {
        leaveNotice: String,
        ticketSystem: String,
        ticketIntro: String,
        levelSystem: String
    },
    messageIDs: {
        ticketSystem: String,
        reactionRoles: Array
    },
    reactionRoles: Object,
    levelSystem: Object
});

module.exports = mongoose.model("Guild", guildSchema, "guildData")