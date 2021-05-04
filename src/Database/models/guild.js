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
        leveling: Boolean,
        moderation: Boolean,
        tickets: Boolean,
        polls: Boolean,
        timer: Boolean,
        warn: Boolean
    },
    channels: {
        auditLogChannel: String,
        announcementChannel: String
    }
});

module.exports = mongoose.model("Guild", guildSchema, "guildData")