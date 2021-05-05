const auditLogger = require("../../Modules/AuditLog");
const db = require('./../../Database/db.js')

module.exports = async (client, oldRole, newRole) => {
    //GET GUILD DATA
    const guildData = await db.loadGuildData(oldRole.guild.id);

    //SENT TO LOGGER
    let desc = "**Role `" + oldRole.name + "` updated!**" + (oldRole.name === newRole.name ? "": "\n New Role: " + `${newRole}`);
    auditLogger(client, guildData, "ROLE UPDATED", desc);
}