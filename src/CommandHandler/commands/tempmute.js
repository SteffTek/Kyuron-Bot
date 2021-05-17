//IMPORTANT IMPORTS
const APICalls = require('../../Utils/APICalls.js')
const embedGen = require('../../Utils/embedGenerator.js')
const permissionChecker = require('../../Utils/permissionChecker.js');
const auditLogger = require("../../Modules/AuditLog");

const db = require("../../Database/db");
const configHandler = require("../../Utils/configHandler");
const modAction = require('../../Database/models/modAction.js');
const config = configHandler.getConfig();

const setTimeout = require('safe-timers').setTimeout;
const UserManagement = require('../../Utils/UserManagement.js');

// Exporting the command for the commandHandler
module.exports = {
	name: 'tempmute',
	description: 'Temporarily mutes a user.',
	options: [
        {
            "name":"user",
            "description":"User",
            "type":	6,
            "required": true,
        },{
            "name":"duration",
            "description":"Duration",
            "type":	4,
            "required": true
        },{
            "name":"durationtype",
            "description":"Duration Type",
            "type":	3,
            "required": true,
            "choices": [
                {
                    "name":"Seconds",
                    "value":"seconds"
                },
                {
                    "name":"Minutes",
                    "value":"minutes"
                },
                {
                    "name":"Hours",
                    "value":"hours"
                },
                {
                    "name":"Days",
                    "value":"days"
                },
                {
                    "name":"Yes...",
                    "value":"yes"
                }
            ]
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
        if(data.args.length > 3) {
            reason = data.args[3].value;
        }

        let duration = data.args[1].value;
        let durationType = data.args[2].value;

        let client = data.client;
        let guild = client.guilds.resolve(data.channel.guild.id);
        let userMember = await guild.members.fetch(userID).catch(err => { /* */});

        if(!userMember) {
            embedGen.error(`**User couldn't be found!**`, data.client, data.interaction);
            return;
        }

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

        //CALC DURATION
        switch(durationType) {
            case "seconds":
                duration *= 1000;
                break;
            case "minutes":
                duration *= 60 * 1000;
                break;
            case "hours":
                duration *= 60 * 60 * 1000;
                break;
            case "days":
                duration *= 24 * 60 * 60 * 1000;
                break;
            case "yes":
                duration = 60 * 60 * 1000 * Math.floor(Math.random() * 356);
                break;
            default:
                break;
        }

        if(duration > 30758400000) {
            embedGen.error(`**You tried to temp mute ${userMember} longer than a year. This duration is pretty long. You should try muting this user permanently. Use: **` + "`/mute <user> <reason>`", data.client, data.interaction)
            return;
        }

        UserManagement.tempMute(client, data.guildData, guild, userMember, member, reason, duration, function(desc) {
            embedGen.custom("🗡️USER MUTED🗡️", config.colors.moderation.MUTE, desc, data.client, data.interaction);
        });
    }
};