//IMPORTANT IMPORTS
const mongoose = require("mongoose");

const reactionSchema = mongoose.Schema({
    guildID: String,
    channelID: String,
    messageID: String,
    name: String,
    roles: Object
});

module.exports = mongoose.model("Reaction", reactionSchema, "reactionData")