//IMPORTANT IMPORTS
const mongoose = require("mongoose");

const announcementSchema = mongoose.Schema({
    channelURL: String,
    channelType: String,
    discordGuildID: String,
    discordChannelID: String,
    displayText: String,
});

module.exports = mongoose.model("Announcement", announcementSchema, "announcementData")