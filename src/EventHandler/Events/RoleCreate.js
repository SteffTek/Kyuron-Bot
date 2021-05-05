const auditLogger = require("../../Modules/AuditLog");
const db = require('./../../Database/db.js')

module.exports = async (client, role) => {
    //GET GUILD DATA
    const guildData = await db.loadGuildData(role.guild.id);

    //SENT TO LOGGER
    let desc = `**New Role ${role} created!**`
    auditLogger(client, guildData, "ROLE CREATED", desc);
}