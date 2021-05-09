const auditLogger = require("../../Modules/AuditLog");
const warn = require("../../Modules/Warn");
const db = require('../../Database/db.js')

module.exports = async (client, invite) => {
    //GET GUILD DATA
    const guildData = await db.loadGuildData(invite.guild.id);

    //SENT TO LOGGER
    let desc = `**Invite** ` + "`" + invite.url + "`" + ` ** got deleted!**`;
    auditLogger(client, guildData, "INVITE DELETED", desc);
}