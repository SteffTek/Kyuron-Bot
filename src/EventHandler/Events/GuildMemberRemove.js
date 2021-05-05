const leaveNotice = require("../../Modules/LeaveNotice");
const db = require('../../Database/db.js')

module.exports = async (client, member) => {
    //GET GUILD DATA
    const guildData = await db.loadGuildData(member.guild.id);

    //SEND TO LEAVE NOTICE
    leaveNotice(client, guildData, member.user);
}