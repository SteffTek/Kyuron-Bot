const auditLogger = require("../../Modules/AuditLog");
const embedGen = require('../../Utils/embedGenerator.js')
const db = require('../../Database/db.js')

const configHandler = require("../../Utils/configHandler");
const reaction = require("../../Database/models/reaction");
const { ReactionEmoji } = require("discord.js");
const config = configHandler.getConfig();

module.exports = async (client, messageReaction, user) => {
    //IGNORE IF REACTED MYSELF
    if(messageReaction.me) return;

    //GET GUILD DATA
    const guildData = await db.loadGuildData(messageReaction.message.guild.id);

    //GET UTIL
    const guild = messageReaction.message.channel.guild;
    const message = messageReaction.message;

    //SENT TO LOGGER
    //let desc = `**Message from ${message.author} sent in ${message.channel}**: \n\n ${message.content}`
    //auditLogger(client, guildData, "MESSAGE DELETED", desc);

    //CHECK IF REACTION HAD SPECIAL ID

    //IF REACTION ROLE
    if(await db.hasReaction(guild.id, message.channel.id, message.id)) {
        var reactionData = await db.getReaction(guild.id, message.channel.id, message.id);
        var emojiName = messageReaction.emoji.name;

        if(messageReaction.emoji.identifier) {
            emojiName = "<:" + messageReaction.emoji.identifier + ">"
        }

        if(!reactionData.roles) { return; }

        var roleID = reactionData.roles[emojiName];

        if(roleID === undefined) {
            return;
        }

        //FETCH ROLE
        var role = await guild.roles.fetch(roleID);
        if(role === null) { return; }

        //ADD ROLE
        guild.members.fetch(user.id).then(member => {
            member.roles.remove(role).catch(err => {
                auditLogger(client, guildData, "PERMISSION ERROR", "**Couldn't remove role from user. Missing permission!**");
            })
        })
    }
}