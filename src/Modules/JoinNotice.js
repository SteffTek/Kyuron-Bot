/**
 * User Join Notice Module
 *
 * @param {object} client discord client
 * @param {object} guildData guild data
 * @param {object} member guild member
 *
 */
 module.exports = async (client, guildData, member) => {
    if(!guildData?.modules?.joinNotice) return;
    if(!guildData?.channels?.joinNoticeChannel) return;

    //LOG
    client.guilds.fetch(guildData.guildID).then(guild => {
        let channel = guild.channels.resolve(guildData.channels.joinNoticeChannel);
        if(channel.type === "text") {
            channel.send(guildData?.messages?.joinNotice.replace("%user%",`${member}`));
        }
    });
}