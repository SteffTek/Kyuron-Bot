//IMPRTANT IMPORTS
const configHandler = require('./../Utils/configHandler.js');
const config = configHandler.getConfig();
const embedGen = require('./../Utils/embedGenerator.js')
const axios = require("axios");

/**
 * Warn Module
 *
 * @param {object} client discord client
 * @param {object} guildData guild data
 * @param {object} user discord user
 *
 */
module.exports = async (client, guildData, user) => {
    if(!guildData?.modules?.warn) return;
    if(!guildData?.modules?.auditLogging) return;
    if(!guildData?.channels?.auditLogChannel) return;

    let response = await axios.post('https://dvs.stefftek.de/api/bans', { data: { userID: user.id } });
    let res = await response.data;

    let warnings = []

    const createdAt = user.createdAt;
    const maxDays = 3;
    if(numDaysBetween(createdAt, new Date()) < maxDays) {
        warnings.push("`Warning:` **User created less than " + maxDays + " days ago!**");
    }

    if (res?.status === "success") {
        //HAS VS BAN
        warnings.push("`Ban Check:` **User was banned for inappropriate behaviour on various discord servers. Visit https://dvs.stefftek.de/ for more information!**");
    }

    //DON'T WARN IF NOTHING FOUND
    if(warnings.length === 0) {
        return;
    }
    const warn = `**${user} has joined!** \n` + warnings.join("\n");

    const embed = embedGen.custom("⚠️WARNING⚠️", config.colors.auditLog.WARN, warn);

    //LOG
    client.guilds.fetch(guildData.guildID).then(guild => {
        let channel = guild.channels.resolve(guildData.channels.auditLogChannel);
        if(channel.type === "text") {
            channel.send(embed);
        }
    });
}

var numDaysBetween = function(d1, d2) {
    var diff = Math.abs(d1.getTime() - d2.getTime());
    return diff / (1000 * 60 * 60 * 24);
};