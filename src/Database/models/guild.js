//IMPORTANT IMPORTS
const mongoose = require("mongoose");

const guildSchema = mongoose.Schema({
    guildID: String
});

module.exports = mongoose.model("Guild", guildSchema, "guildData")