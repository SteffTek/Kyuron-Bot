/**
 * Check if the config is valid JSON
 *
 * @param {guildData} guildData guild data
 * @param {member} member guild member
 * @returns {boolean} if user has permission on their guild
 */

module.exports.isModerator = (guildData, member) => {

    //CHECK IF ADMIN
    if(member.hasPermission(8)) {
        return true;
    }

    const modRoles = guildData.modRoles;
    var hasPermission = false;

    member.roles.cache.each(role => {
        if(modRoles.includes(role.id)) {
            hasPermission = true;
            return;
        }
    });

    return hasPermission;
}

module.exports.isAdmin = (member) => {

    //CHECK IF ADMIN
    if(member.hasPermission(8)) {
        return true;
    }

    return false;
}