const auditLogger = require("../../Modules/AuditLog");
const embedGen = require('./../../Utils/embedGenerator.js')
const db = require('./../../Database/db.js')

const configHandler = require("../../Utils/configHandler");
const config = configHandler.getConfig();
const utils = require('../../Utils/utils.js');

module.exports = async (client, message) => {
    //GET GUILD DATA
    const guildData = await db.loadGuildData(message.guild.id);

    //COMMON
    const guild = message.guild;

    //SENT TO LOGGER
    let desc = `**Message from ${(message.author ? message.author : "`UNDEFINED`")} sent in ${message.channel}**` + (message.content ? "\n\n" + message.content : "");
    if(message.author?.id !== client.user.id) {
        if(!guildData.channels.auditLogIgnore.includes(message.channel.id)) {
            auditLogger(client, guildData, "MESSAGE DELETED", desc);
        }
    }

    //CHECK IF MESSAGE WAS REACTION ROLE MESSAGE & REMOVE

    //IF TICKET SUPPORT
    if(guildData.messageIDs.ticketSystem === message.id) {
        //COMMIT CHANNEL MESSAGE EMBED
        message.channel.send(embedGen.custom("🎫-Support Tickets",utils.getColor("tickets","INFO"), guildData.messages.ticketSystem.replace("%emote%", "📩"))).then(message => {
            guildData.messageIDs.ticketSystem = message.id;
            message.react("📩");

            //SAVE GUILD DATA
            guildData.save().catch(err => console.log(err));
        }).catch(err => {
            //IGNORE LOL
        })
    }

    //IF REACTION ROLE
    if(await db.hasReaction(guild.id, message.channel.id, message.id)) {
        var reactionData = await db.getReaction(guild.id, message.channel.id, message.id);
        reactionData.remove();
    }
}