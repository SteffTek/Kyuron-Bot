//IMPRTANT IMPORTS
const configHandler = require('./../Utils/configHandler.js');
const config = configHandler.getConfig();
const embedGen = require('./../Utils/embedGenerator.js')

/**
 * Audit Log Module
 *
 * @param {object} client discord client
 * @param {object} guildData guild data
 * @param {string} title string title
 * @param {string} content string content
 *
 */
module.exports = (client, guildData, member) => {
    if(!guildData?.modules?.autoVoiceChannel) return;
    if(!guildData?.channels?.autoVoiceChannel) return;

    var name = "🔈-" + makeID(6);

    //LOG
    client.guilds.fetch(guildData.guildID).then(guild => {

        //GET PARENT
        var parent = guild.channels.resolve(guildData.channels.autoVoiceChannel).parent;

        //CREATE CHANNEL
        guild.channels.create(name, {type:"voice", parent: parent.id}).then(async channel => {
            //SET MEMBER TO JOIN
            if(member.voice.channel) {
                member.voice.setChannel(channel);
            }

            //PUSH TO GLOBAL VAR
            autoVoiceChannels.push(channel.id);
        }).catch(err => {
            console.log(err);
            return;
        })
    });
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