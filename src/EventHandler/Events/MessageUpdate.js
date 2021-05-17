const auditLogger = require("../../Modules/AuditLog");
const db = require('./../../Database/db.js')

module.exports = async (client, oldMessage, newMessage) => {
    //GET GUILD DATA
    const guildData = await db.loadGuildData(oldMessage.guild.id);

    //SENT TO LOGGER
    let desc = `**Message from ${newMessage.author} sent in ${oldMessage.channel}**: \n[Jump to Message](https://discord.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id}) \n\n **__OLD:__**\n ${oldMessage.content}\n\n**__NEW:__**\n ${newMessage.content}`
    if(!guildData.channels.auditLogIgnore.includes(newMessage.channel.id)) auditLogger(client, guildData, "MESSAGE EDITED", desc);
}