//IMPORTANT IMPORTS
const mongoose = require("mongoose");

const modActionSchema = mongoose.Schema({
    guildID: String,
    userID: String,
    moderatorID: String,
    reason: String,
    timestamp: Number,
    action: String,
    isTemp: Boolean,
    isDone: Boolean, //For Ready Event, if Mute/Ban has been lifted already
    until: Number
});

module.exports = mongoose.model("ModAction", modActionSchema, "modActionData")