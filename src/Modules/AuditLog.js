//IMPRTANT IMPORTS
const configHandler = require('./../Utils/configHandler.js');
const config = configHandler.getConfig();
const embedGen = require('./../Utils/embedGenerator.js')
const utils = require('../Utils/utils.js');

/**
 * Audit Log Module
 *
 * @param {object} client discord client
 * @param {object} guildData guild data
 * @param {string} title string title
 * @param {string} content string content
 *
 */
module.exports = (client, guildData, title, content) => {
    if(!guildData?.modules?.auditLogging) return;
    if(!guildData?.channels?.auditLogChannel) return;

    let color = utils.getColor("auditLog",title);
    const embed = embedGen.custom(title, color, content);

    //LOG
    client.guilds.fetch(guildData.guildID).then(guild => {
        let channel = guild.channels.resolve(guildData.channels.auditLogChannel);
        if(channel.type === "text") {
            channel.send(embed);
        }
    });
}