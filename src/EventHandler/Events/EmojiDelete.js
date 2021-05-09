const auditLogger = require("../../Modules/AuditLog");
const warn = require("../../Modules/Warn");
const db = require('../../Database/db.js')

module.exports = async (client, emoji) => {
    //GET GUILD DATA
    const guildData = await db.loadGuildData(emoji.guild.id);

    //SENT TO LOGGER
    let desc = `**Emoji ${emoji.name} deleted!**`;
    auditLogger(client, guildData, "EMOJI DELETED", desc);
}