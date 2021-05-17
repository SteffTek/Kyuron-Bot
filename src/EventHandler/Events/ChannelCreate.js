const auditLogger = require("../../Modules/AuditLog");
const db = require('./../../Database/db.js')

module.exports = async (client, channel) => {
    //EXCEPTIONS
    if (channel.type === "dm"){
        return;
    }

    //GET GUILD DATA
    const guildData = await db.loadGuildData(channel.guild.id);
    const guild = channel.guild;

    //SENT TO LOGGER
    let desc = "**`A new channel was created!`**\n\n**`Name:`** <#"+channel+">\n**`Type: "+channel.type+"`**\n**`ID: ["+channel.id+"]`**"
    auditLogger(client, guildData, "CHANNEL CREATED", desc);

    //IF MUTE ROLE & MOD SYSTEM
    if(guildData.modules.moderation) {
        //GET MUTE ROLE
        var roleID = guildData.muteRole;
        var role = null;
        if(roleID.length > 0) {
            //FETCH ROLE
            role = await guild.roles.fetch(roleID).catch(err => { /* ROLE NOT FOUND */ });
        }

        //CREATE ROLE IF NOT FOUND
        if(!role) {
            role = await guild.roles.create({
                data: {
                    name: 'Muted',
                    color: 'GREY',
                }
            })

            let permissions = [{
                id: role.id,
                deny: ["SEND_MESSAGES","ADD_REACTIONS","SEND_TTS_MESSAGES","CHANGE_NICKNAME","ATTACH_FILES","CONNECT","EMBED_LINKS","USE_VAD"]
            }]

            guild.channels.cache.each(channel => {
                channel.overwritePermissions(permissions);
            })

            guildData.muteRole = role.id;
            guildData.save().catch(err => {console.log(err)});
        } else {
            //ADD PERMISSION TO THIS CHANNEL
            let permissions = [{
                id: role.id,
                deny: ["SEND_MESSAGES","ADD_REACTIONS","SEND_TTS_MESSAGES","CHANGE_NICKNAME","ATTACH_FILES","CONNECT","EMBED_LINKS","USE_VAD"]
            }]

            channel.overwritePermissions(permissions);
        }
    }
}