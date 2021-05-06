//IMPORTANT IMPORTS
const mongoose = require("mongoose");

const ticketSchema = mongoose.Schema({
    channelID: String,
    guildID: String,
    userID: String,
    isClosed: Boolean
});

module.exports = mongoose.model("Ticket", ticketSchema, "ticketData")