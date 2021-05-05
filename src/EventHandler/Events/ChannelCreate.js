const auditLogger = require("../../Modules/AuditLog");
const db = require('./../../Database/db.js')

module.exports = async (client, channel) => {
    //GET GUILD DATA
    const guildData = await db.loadGuildData(channel.guild.id);

    //SENT TO LOGGER
    let desc = `**New Channel ${channel} created!**`
    auditLogger(client, guildData, "CHANNEL CREATED", desc);
}