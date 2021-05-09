const auditLogger = require("../../Modules/AuditLog");
const warn = require("../../Modules/Warn");
const db = require('../../Database/db.js')

module.exports = async (client, guild, user) => {
    //GET GUILD DATA
    const guildData = await db.loadGuildData(guild.id);

    //SENT TO LOGGER
    let desc = `**User ${user.tag} got unbanned!**`
    auditLogger(client, guildData, "✅USER UNBANNED✅", desc);
}