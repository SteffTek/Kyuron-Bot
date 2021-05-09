const auditLogger = require("../../Modules/AuditLog");
const embedGen = require('./../../Utils/embedGenerator.js')
const db = require('./../../Database/db.js')

const configHandler = require("../../Utils/configHandler");
const config = configHandler.getConfig();

module.exports = async (client, messages) => {
    //GET GUILD DATA
    const guildData = await db.loadGuildData(messages.get(0).guild.id);

    //SENT TO LOGGER
    let desc = `**${messages.array().length} Messages deleted!**`
    auditLogger(client, guildData, "MESSAGE DELETED", desc);

    //CHECK IF MESSAGE WAS REACTION ROLE MESSAGE & REMOVE
    messages.each(message => {
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
    });
}