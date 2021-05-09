const auditLogger = require("../../Modules/AuditLog");
const warn = require("../../Modules/Warn");
const db = require('../../Database/db.js')

module.exports = async (client, guild, user) => {
    //GET GUILD DATA
    const guildData = await db.loadGuildData(guild.id);

    let ban = await guild.fetchBan(user);

    //SENT TO LOGGER
    let desc = `**User ${user} got banned for reason: ${ban.reason}**`
    auditLogger(client, guildData, "🚫USER BANNED🚫", desc);
}