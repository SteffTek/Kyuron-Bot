const auditLogger = require("../../Modules/AuditLog");
const warn = require("../../Modules/Warn");
const db = require('../../Database/db.js')

module.exports = async (client, oldEmoji, newEmoji) => {
    //GET GUILD DATA
    const guildData = await db.loadGuildData(oldEmoji.guild.id);

    //SENT TO LOGGER
    let desc = `**Emoji ${oldEmoji.name} updated!**` + "\n`new name:` " + newEmoji.name;
    auditLogger(client, guildData, "EMOJI UPDATED", desc);
}