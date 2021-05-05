const auditLogger = require("../../Modules/AuditLog");
const db = require('./../../Database/db.js')

module.exports = async (client, role) => {
    //GET GUILD DATA
    const guildData = await db.loadGuildData(role.guild.id);

    //SENT TO LOGGER
    let desc = "**Role `" + role.name + "` deleted!**"
    auditLogger(client, guildData, "ROLE DELETED", desc);

    //CHECK IF ROLE WAS IN MOD ROLES OR MUTE ROLE & REMOVE
}