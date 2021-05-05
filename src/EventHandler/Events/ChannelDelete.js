const auditLogger = require("../../Modules/AuditLog");
const db = require('./../../Database/db.js')

module.exports = async (client, channel) => {
    //GET GUILD DATA
    const guildData = await db.loadGuildData(channel.guild.id);

    //SENT TO LOGGER
    let desc = "**Channel `" + channel.name + "` deleted!**"
    auditLogger(client, guildData, "CHANNEL DELETED", desc);

    //CHECK IF CHANNEL WAS SET IN GUILD DATA & REMOVE
}