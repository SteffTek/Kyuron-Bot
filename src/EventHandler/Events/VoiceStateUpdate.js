const auditLogger = require("../../Modules/AuditLog");
const db = require('../../Database/db.js');
const AutoVoice = require("../../Modules/AutoVoice");

module.exports = async (client, oldMember, newMember) => {
    const joined = (newMember.channelID === null ? false : true);

    //GET GUILD DATA
    const guildData = await db.loadGuildData(oldMember.guild.id);

    //CHECK IF JOINED IN AUTO CHANNEL
    if(joined) {
        if(newMember.channelID === guildData.channels.autoVoiceChannel) {
            //SEND TO AUTOVOICE
            AutoVoice(client, guildData, newMember.member);
        }
    }

    //ON CHANNEL LEAVE => CHECK IF IN GLOBAL CHANNEL LIST, IF LAST MEMBER => DELETE
    if(oldMember.channelID) {
        if(autoVoiceChannels.includes(oldMember.channelID)) {
            if(oldMember.channel === null) {
                return; //DELETED
            }

            //CHECK FOR REMAINING USERS
            if(oldMember.channel.members.array().length > 0) {
                return;
            }
            //DELETE
            autoVoiceChannels.splice(autoVoiceChannels.indexOf(oldMember.channelID),1)[0];
            oldMember.channel.delete();
        }
    }
}