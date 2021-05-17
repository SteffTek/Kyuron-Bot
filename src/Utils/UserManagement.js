const db = require("../Database/db");
const modAction = require("../Database/models/modAction");
const auditLogger = require("../Modules/AuditLog");

async function tempMute(client, guildData, guild, member, moderator, reason, duration, _callback) {
    let until = Date.now() + duration;

    //GET MUTE ROLE
    var roleID = guildData.muteRole;
    var role = null;
    if(roleID.length > 0) {
        //FETCH ROLE
        role = await guild.roles.fetch(roleID).catch(err => { /* ROLE NOT FOUND */ });
    }

    //CREATE ROLE IF NOT FOUND
    if(!role) {
        role = await createMuteRole(guild, guildData);
    }

    //SET MUTED ROLE
    member.roles.add(role);

    let desc = `**User ${member} got muted by ${moderator} for reason:**` + "\n`" + reason + "`" + `\n**Muted Until: ${new Date(until)}** `;
    _callback(desc);

    //SEND TO AUDIT LOGGER
    auditLogger(client, guildData, "🗡️USER MUTED🗡️", desc);

    //SENT TO MOD LOG
    var tempMute = await db.addModerationData(guild.id, member.id, moderator.id, reason, "mute", true, until, false);

    //TIMEOUT
    setTimeout(function() {
        //CHECK FOR UNMUTE
        modAction.findOne({_id: tempMute._id}).then(modActionData => {
            if(modActionData.isDone) {
                return;
            }

            //SAVE
            modActionData.isDone = true;
            modActionData.save().catch(err => {console.log(err)})

            //REMOVE ROLE
            member.roles.remove(role);

            //ADD AUTOMATIC UNMUTE TO MODLOG
            db.addModerationData(guild.id, member.id, "", "automatically unmuted", "unmute");

            //SEND TO AUDIT LOGGER
            auditLogger(client, guildData, "✅USER UNMUTED✅", `**User ${member} got automatically unmuted!**`);
        }).catch(err => { /* ERROR LOL */ })
    }, duration);
}

async function muteUser(client, guildData, guild, member, moderator, reason) {
    //GET MUTE ROLE
    var roleID = guildData.muteRole;
    var role = null;
    if(roleID.length > 0) {
        //FETCH ROLE
        role = await guild.roles.fetch(roleID).catch(err => { /* ROLE NOT FOUND */ });
    }

    //CREATE ROLE IF NOT FOUND
    if(!role) {
        role = await createMuteRole(guild, guildData);
    }

    //SET MUTED ROLE
    member.roles.add(role);

    //CREATE STRING
    let desc = `**User ${member} got muted by ${moderator} for reason:**` + "\n`" + reason + "`";

    //SEND TO AUDIT LOGGER
    auditLogger(client, guildData, "🗡️USER MUTED🗡️", desc);

    //SENT TO MOD LOG
    db.addModerationData(guild.id, member.id, moderator.id, reason, "mute");

    return desc;
}

async function kickUser(client, guild, guildData, member, moderator, reason) {
    //KICK THE USER
    member.kick(reason);

    let desc = `**User ${member} got kicked by ${moderator} for reason:**` + "\n`" + reason + "`";

    //SEND TO AUDIT LOGGER
    auditLogger(client, guildData, "🗡️USER KICKED🗡️", desc);

    //SENT TO MOD LOG
    db.addModerationData(guild.id, member.id, moderator.id, reason, "kick");

    return desc;
}

async function tempBan(client, guild, guildData, member, moderator, reason, duration, _callback) {
    let until = Date.now() + duration;

    //KICK & BAN THE USER
    member.ban({reason: reason});

    let desc = `**User ${member} got banned by ${moderator} for reason:**` + "\n`" + reason + "`" + `\n**Banned Until: ${new Date(until)}** `;
    _callback(desc);

    //SEND TO AUDIT LOGGER
    auditLogger(client, guildData, "🚫USER BANNED🚫", desc);

    //SENT TO MOD LOG
    var tempBan = await db.addModerationData(guild.id, member.id, moderator.id, reason, "ban", true, until, false);

    //TIMEOUT
    setTimeout(function() {
        //CHECK FOR UNMUTE
        modAction.findOne({_id: tempBan._id}).then(modActionData => {
            if(modActionData.isDone) {
                return;
            }

            //SAVE
            modActionData.isDone = true;
            modActionData.save().catch(err => {console.log(err)})

            //REMOVE BAN
            guild.members.unban(modActionData.userID);

            //ADD AUTOMATIC UNMUTE TO MODLOG
            db.addModerationData(guild.id, member.id, "", "automatically unbanned", "unban");

            //SEND TO AUDIT LOGGER
            auditLogger(client, guildData, "✅USER UNBANNED✅", `**User ${member} got automatically unbanned!**`);
        }).catch(err => { /* ERROR LOL */ })
    }, duration);
}

async function banUser(client, guild, guildData, user, moderator, reason) {
    //KICK & BAN THE USER
    guild.members.ban(user.id, {reason: reason});

    let desc = `**User ${user} got banned by ${moderator} for reason:**` + "\n`" + reason + "`";

    //SEND TO AUDIT LOGGER
    auditLogger(client, guildData, "🚫USER BANNED🚫", desc);

    //SENT TO MOD LOG
    db.addModerationData(guild.id, user.id, moderator.id, reason, "ban");

    return desc;
}

async function createMuteRole(guild, guildData) {
    var role = await guild.roles.create({
        data: {
            name: 'Muted',
            color: 'GREY',
        }
    })

    let permissions = [{
        id: role.id,
        deny: ["SEND_MESSAGES","ADD_REACTIONS","SEND_TTS_MESSAGES","CHANGE_NICKNAME","ATTACH_FILES","CONNECT","EMBED_LINKS","USE_VAD"]
    }]

    guild.channels.cache.each(channel => {
        channel.overwritePermissions(permissions);
    })

    guildData.muteRole = role.id;
    guildData.save().catch(err => {console.log(err)});

    return role;
}

module.exports = {
    createMuteRole: createMuteRole,
    tempMute: tempMute,
    muteUser: muteUser,
    kickUser: kickUser,
    tempBan: tempBan,
    banUser: banUser
}