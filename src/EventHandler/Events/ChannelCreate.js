const auditLogger = require("../../Modules/AuditLog");
const db = require('./../../Database/db.js')

module.exports = async (client, channel) => {
    //GET GUILD DATA
    const guildData = await db.loadGuildData(channel.guild.id);

    //EXCEPTIONS
    if (channel.type === "dm"){
        return;
    }

    //SENT TO LOGGER
    let desc = "**`A new channel was created!`**\n\n**`Name:`** <#"+channel+">\n**`Type: "+channel.type+"`**\n**`ID: ["+channel.id+"]`**"
    auditLogger(client, guildData, "CHANNEL CREATED", desc);
}