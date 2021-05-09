const auditLogger = require("../../Modules/AuditLog");
const warn = require("../../Modules/Warn");
const db = require('../../Database/db.js')

module.exports = async (client, emoji) => {
    //GET GUILD DATA
    const guildData = await db.loadGuildData(emoji.guild.id);

    //SENT TO LOGGER
    let desc = `**A new emoji was uploaded! **` + "\n`name:` " + emoji.name + "\n`animated:` " + emoji.animated + "\n`sample:` " + `${emoji}`
    auditLogger(client, guildData, "EMOJI CREATED", desc);
}