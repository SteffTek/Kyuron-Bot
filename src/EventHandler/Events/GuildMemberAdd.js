const auditLogger = require("../../Modules/AuditLog");
const joinNotice = require("../../Modules/JoinNotice");
const warn = require("../../Modules/Warn");
const db = require('./../../Database/db.js')

module.exports = async (client, member) => {
    //GET GUILD DATA
    const guildData = await db.loadGuildData(member.guild.id);
    const guild = member.guild;

    //SENT TO LOGGER
    let desc = `**User ${member} joined!** \nCreated: ${member.user.createdAt}`
    auditLogger(client, guildData, "USER JOINED", desc);

    //SENT TO WARN
    warn(client, guildData, member.user);

    //SEND TO JOIN NOTICE
    joinNotice(client, guildData, member);

    //JOIN ROLE
    if(guildData.modules.joinRole) {
        //GET JOIN ROLE
        guild.roles.fetch(guildData.joinRole).then(role => {
            member.roles.add(role).catch(err => {
                /* NO PERMISSION */
            })
        }).catch(err => { /* DO NOTHING */ })
    }
}