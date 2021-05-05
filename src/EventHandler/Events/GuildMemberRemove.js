const auditLogger = require("../../Modules/AuditLog");
const leaveNotice = require("../../Modules/LeaveNotice");
const db = require('../../Database/db.js')

module.exports = async (client, member) => {
    //GET GUILD DATA
    const guildData = await db.loadGuildData(member.guild.id);

    //SENT TO LOGGER
    let desc = `**User ${member} left!**`
    auditLogger(client, guildData, "USER LEFT", desc);

    //SEND TO LEAVE NOTICE
    leaveNotice(client, guildData, member.user);
}