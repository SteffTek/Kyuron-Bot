const warn = require("../../Modules/Warn");
const db = require('./../../Database/db.js')

module.exports = async (client, member) => {
    //GET GUILD DATA
    const guildData = await db.loadGuildData(member.guild.id);

    //SENT TO WARN
    warn(client, guildData, member.user);
}