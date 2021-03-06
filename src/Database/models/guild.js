//IMPORTANT IMPORTS
const mongoose = require("mongoose");

const guildSchema = mongoose.Schema({
    guildID: String,
    modules: {
        auditLogging: Boolean,
        autoResponder: Boolean,
        autoMod: Boolean,
        autoVoiceChannel: Boolean,
        announcements: Boolean,
        economy: Boolean,
        fun: Boolean,
        giveaway: Boolean,
        joinRole: Boolean,
        joinNotice: Boolean,
        leaveNotice: Boolean,
        leveling: Boolean,
        moderation: Boolean,
        tickets: Boolean,
        polls: Boolean,
        reactionRoles: Boolean,
        timer: Boolean,
        warn: Boolean
    },
    modRoles: Array,
    muteRole: String,
    joinRole: String,
    channels: {
        auditLogChannel: String,
        auditLogIgnore: Array,
        leaveNoticeChannel: String,
        ticketSystemChannel: String,
        levelSystemChannel: String,
        autoVoiceChannel: String,
        joinNoticeChannel: String
    },
    settings: {

    },
    messages: {
        leaveNotice: String,
        joinNotice: String,
        ticketSystem: String,
        ticketIntro: String,
        levelSystem: String
    },
    messageIDs: {
        ticketSystem: String
    },
    levelSystem: Object,
    autoMod: Object,
    autoResponder: Object,
    blacklist: Array
});

module.exports = mongoose.model("Guild", guildSchema, "guildData")