const auditLogger = require("../../Modules/AuditLog");
const warn = require("../../Modules/Warn");
const db = require('../../Database/db.js')

module.exports = async (client, invite) => {
    //GET GUILD DATA
    const guildData = await db.loadGuildData(invite.guild.id);

    //SENT TO LOGGER
    let desc = `**User ${invite.inviter} created an invite.**` + " `" + invite.url + "`"

    if(invite.targetUser) {
        desc += `\nInvite created for user ${invite.targetUser}!`
    }

    auditLogger(client, guildData, "INVITE CREATED", desc);
}