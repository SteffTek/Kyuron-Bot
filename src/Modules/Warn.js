const embedGen = require('./../Utils/embedGenerator.js')
const axios = require("axios");

/**
 * Audit Log Module
 *
 * @param {object} client discord client
 * @param {object} guildData guild data
 *
 */
module.exports = async (client, guildData, user) => {
    if(!guildData?.modules?.warn) return;
    if(!guildData?.modules?.auditLogging) return;
    if(!guildData?.channels?.auditLogChannel) return;

    let response = await axios.post('https://dvs.stefftek.de/api/bans', { data: { userID: user.id } });
    let res = await response.data;

    let warn = "";

    const createdAt = user.createdAt;
    const maxDays = 3;
    if(numDaysBetween(createdAt, new Date()) < maxDays) {
        warn += "**User created less than " + maxDays + " days ago!**"
    }

    if (res.status === "success") {
        //HAS VS BAN
        warn += "\n**User was found in Global Ban Database!**"
    }

    //DON'T WARN IF NOTHING FOUND
    if(warn === "") {
        return;
    } else {
        warn = `**${user} has joined!** \n` + warn;
    }

    const embed = embedGen.custom("⚠️WARNING⚠️", "0xFF964F", warn);

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