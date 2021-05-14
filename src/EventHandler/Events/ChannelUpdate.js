const auditLogger = require("../../Modules/AuditLog");
const db = require('./../../Database/db.js')

module.exports = async (client, oldChannel, newChannel) => {
    //GET GUILD DATA
    const guildData = await db.loadGuildData(oldChannel.guild.id);

    //SENT TO LOGGER
    let desc = "**Channel `" + oldChannel.name + "` updated!**" + (oldChannel.name === newChannel.name ? "": "\n New Channel: " + `${newChannel}`);
    if(!guildData.channels.auditLogIgnore.includes(oldChannel.id)) auditLogger(client, guildData, "CHANNEL UPDATED", desc);
}