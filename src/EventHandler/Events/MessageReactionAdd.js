const auditLogger = require("../../Modules/AuditLog");
const embedGen = require('./../../Utils/embedGenerator.js')
const db = require('./../../Database/db.js')

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

    //IF TICKET SUPPORT
    if (guildData.messageIDs.ticketSystem === messageReaction.message.id) {
        //CHECK IF MODULE ACTIVE
        if (!guildData.modules.tickets) return;

        //REMOVE REACTION
        messageReaction.users.remove(user);

        const parentChannel = messageReaction.message.channel.parent;

        //CHECK IF DUPLICATE
        const dup = await db.hasTicket(guild.id, user.id);
        if(dup) {
            return;
        }

        //CREATE NEW CHANNEL
        const channel = await guild.channels.create("🎫-" + makeID(4), { parent: parentChannel });

        var permissions = [
            {
                id: guild.roles.everyone.id,
                deny: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "SEND_MESSAGES"]
            }, {
                id: user.id,
                allow: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "SEND_MESSAGES"]
            }
        ];

        //PUSH MOD ROLES
        for(let i = 0; i < guildData.modRoles.length; i++) {
            permissions.push({
                id: guildData.modRoles[i],
                allow: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "SEND_MESSAGES", "ADD_REACTIONS"]
            })
        }

        //SET PERMISSIONS
        channel.overwritePermissions(permissions);

        //CREATE TICKET
        const ticket = await db.loadTicketData(guild.id, user.id);
        ticket.channelID = channel.id;

        ticket.save().catch(err => console.log(err));

        //SEND MESSAGE
        channel.send((guildData.messages.ticketIntro).replace("%user%",`${user}`))
        return;
    }

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
            messageReaction.users.remove(user.id);
            return;
        }

        //FETCH ROLE
        var role = await guild.roles.fetch(roleID);
        if(role === null) { return; }

        //ADD ROLE
        guild.members.fetch(user.id).then(member => {
            member.roles.add(role).catch(err => {
                auditLogger(client, guildData, "PERMISSION ERROR", "**Couldn't add role to user. Missing permission!**");
            })
        })
    }
}

function makeID(length) {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() *
            charactersLength)));
    }
    return result.join('');
}