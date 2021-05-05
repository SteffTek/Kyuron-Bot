const auditLogger = require("../../Modules/AuditLog");
const db = require('./../../Database/db.js')

module.exports = async (client, message) => {
    //GET GUILD DATA
    const guildData = await db.loadGuildData(message.guild.id);

    //SENT TO LOGGER
    let desc = `**Message from ${message.author} sent in ${message.channel}**: \n\n ${message.content}`
    auditLogger(client, guildData, "MESSAGE DELETED", desc);

    //CHECK IF MESSAGE WAS REACTION ROLE MESSAGE & REMOVE
}