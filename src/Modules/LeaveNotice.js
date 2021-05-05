/**
 * User Leave Notice Module
 *
 * @param {object} client discord client
 * @param {object} guildData guild data
 * @param {object} user discord user
 *
 */
module.exports = async (client, guildData, user) => {
    if(!guildData?.modules?.leaveNotice) return;
    if(!guildData?.channels?.leaveNoticeChannel) return;

    //LOG
    client.guilds.fetch(guildData.guildID).then(guild => {
        let channel = guild.channels.resolve(guildData.channels.leaveNoticeChannel);
        if(channel.type === "text") {
            channel.send(`**${user.tag} has left the server!**`);
        }
    });
}