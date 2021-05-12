//IMPORTANT IMPORTS
const APICalls = require('./../../Utils/APICalls.js')
const embedGen = require('./../../Utils/embedGenerator.js')
const permissionChecker = require('./../../Utils/permissionChecker.js');
const auditLogger = require("../../Modules/AuditLog");

const db = require("../../Database/db");
const configHandler = require("../../Utils/configHandler");
const config = configHandler.getConfig();

// Exporting the command for the commandHandler
module.exports = {
	name: 'mute',
	description: 'Mutes a user.',
	options: [
        {
            "name":"user",
            "description":"User",
            "type":	6,
            "required": true,
        },{
            "name":"reason",
            "description":"Reason",
            "type":	3,
            "required": false
        }
    ],
	async execute(data) {
        //CHECK MODULE
        if(!data.guildData.modules?.moderation) {
            embedGen.error("**This module isn't activated.**",data.client,data.interaction)
            return;
        }

        //CHECK PERMISSION
        const member = await data.channel.guild.members.fetch(data.author.user.id);
        if(!permissionChecker.isModerator(data.guildData, member)) {
            embedGen.error("**You need the `MODERATOR` permission to do this!**",data.client,data.interaction)
            return;
        }

        //GET DATA
        let userID = data.args[0].value;
        let reason = null;
        if(data.args.length > 1) {
            reason = data.args[1].value;
        }

        let client = data.client;
        let guild = client.guilds.resolve(data.channel.guild.id);
        let userMember = await guild.members.fetch(userID);

        //ANTI KICK CHECKS
        if(permissionChecker.isModerator(data.guildData, userMember)) {
            APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.error(`**${userMember} is a moderator and cant be kicked!**`)]}, data.interaction)
            return;
        }

        if(client.user.id === userID) {
            APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.error(`**Why do you want to kick me? :(**`)]}, data.interaction)
            return;
        }

        //REASON
        if(reason === null) {
            reason = "No reason specified!";
        }

        //GET MUTE ROLE
        var roleID = data.guildData.muteRole;
        var role = null;
        if(roleID.length > 0) {
            //FETCH ROLE
            role = await guild.roles.fetch(roleID).catch(err => { /* ROLE NOT FOUND */ });
        }

        //CREATE ROLE IF NOT FOUND
        if(!role) {
            role = await guild.roles.create({
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

            data.guildData.muteRole = role.id;
            data.guildData.save().catch(err => {console.log(err)});
        }

        //SET MUTED ROLE
        userMember.roles.add(role);

        let desc = `**User ${userMember} got muted by ${member} for reason:**` + "\n`" + reason + "`";
        APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.custom("🗡️USER MUTED🗡️", config.colors.moderation.MUTE, desc)]}, data.interaction)

        //SEND TO AUDIT LOGGER
        auditLogger(client, data.guildData, "🗡️USER MUTED🗡️", desc);

        //SENT TO MOD LOG
        db.addModerationData(guild.id, userMember.id, member.id, reason, "mute");
    }
};