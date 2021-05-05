const auditLogger = require("../../Modules/AuditLog");
const warn = require("../../Modules/Warn");
const db = require('./../../Database/db.js')

module.exports = async (client, member) => {
    //GET GUILD DATA
    const guildData = await db.loadGuildData(member.guild.id);

    //SENT TO LOGGER
    let desc = `**User ${member} joined!** \nCreated: ${member.user.createdAt}`
    auditLogger(client, guildData, "USER JOINED", desc);

    //SENT TO WARN
    warn(client, guildData, member.user);
}