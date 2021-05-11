const auditLogger = require("../../Modules/AuditLog");
const db = require('./../../Database/db.js')
const reaction = require("../../Database/models/reaction");

module.exports = async (client, channel) => {
    //GET GUILD DATA
    const guildData = await db.loadGuildData(channel.guild.id);

    //SENT TO LOGGER
    let desc = "**Channel `" + channel.name + "` deleted!**"
    auditLogger(client, guildData, "CHANNEL DELETED", desc);

    //CHECK IF CHANNEL WAS SET IN GUILD DATA & REMOVE

    //IF TICKET SUPPORT
    if(guildData.channels.ticketSystemChannel === channel.id) {
        guildData.channels.ticketSystemChannel = "";
        guildData.messageIDs.ticketSystem = "";

        //SAVE GUILD DATA
        guildData.save().catch(err => console.log(err));
    }

    //IF IN TICKET
    db.removeTicketData(channel.guild.id, channel.id);

    //IF HAS REACTION ROLES
    reaction.find({guildID: channel.guild.id, channelID: channel.id}).then(loadedReactions => {
        for(let i = 0; i < loadedReactions.length; i++) {
            loadedReactions[i].remove();
        }
    });
}