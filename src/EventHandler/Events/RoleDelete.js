const auditLogger = require("../../Modules/AuditLog");
const db = require('./../../Database/db.js')

module.exports = async (client, role) => {
    //GET GUILD DATA
    const guildData = await db.loadGuildData(role.guild.id);

    //SENT TO LOGGER
    let desc = "**Role `" + role.name + "` deleted!**"
    auditLogger(client, guildData, "ROLE DELETED", desc);

    //CHECK IF ROLE WAS IN MOD ROLES OR MUTE ROLE & REMOVE
    let isImportant = false;
    if(role.id === guildData.muteRole) {
        guildData.muteRole = "";
        isImportant = true;
    }

    if(guildData.modRoles.includes(role.id)) {
        let index = guildData.modRoles.indexOf(role.id);
        guildData.modRoles.splice(index,1);
        isImportant = true;
    }

    //SAVE GUILD DATA
    if(isImportant)
        guildData.save().catch(err => console.log(err));
}