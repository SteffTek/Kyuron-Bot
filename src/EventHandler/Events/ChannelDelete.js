const auditLogger = require("../../Modules/AuditLog");
const db = require('./../../Database/db.js')

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
}