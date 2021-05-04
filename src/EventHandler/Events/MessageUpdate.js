const auditLogger = require("../../Modules/AuditLog");
const db = require('./../../Database/db.js')

module.exports = async (client, oldMessage, newMessage) => {
    //GET GUILD DATA
    const guildData = await db.loadGuildData(oldMessage.guild.id);

    //SENT TO LOGGER
    let desc = `**Message from ${oldMessage.author} sent in ${oldMessage.channel}**: \n\n **__OLD:__** ${oldMessage.content}\n**__NEW:__** ${newMessage.content}`
    auditLogger(client, guildData, "MESSAGE EDITED", desc);
}