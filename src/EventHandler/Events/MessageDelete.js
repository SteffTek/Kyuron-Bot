const auditLogger = require("../../Modules/AuditLog");
const embedGen = require('./../../Utils/embedGenerator.js')
const db = require('./../../Database/db.js')

const configHandler = require("../../Utils/ConfigHandler");
const config = configHandler.getConfig();

module.exports = async (client, message) => {
    //GET GUILD DATA
    const guildData = await db.loadGuildData(message.guild.id);

    //SENT TO LOGGER
    let desc = `**Message from ${message.author} sent in ${message.channel}**: \n\n ${message.content}`
    auditLogger(client, guildData, "MESSAGE DELETED", desc);

    //CHECK IF MESSAGE WAS REACTION ROLE MESSAGE & REMOVE

    //IF TICKET SUPPORT
    if(guildData.messageIDs.ticketSystem === message.id) {
        //COMMIT CHANNEL MESSAGE EMBED
        message.channel.send(embedGen.custom("🎫-Support Tickets",config.colors.tickets.INFO, guildData.messages.ticketSystem.replace("%emote%", "📩"))).then(message => {
            guildData.messageIDs.ticketSystem = message.id;
            message.react("📩");

            //SAVE GUILD DATA
            guildData.save().catch(err => console.log(err));
        }).catch(err => {
            //IGNORE LOL
        })
    }
}