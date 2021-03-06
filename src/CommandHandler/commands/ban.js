//IMPORTANT IMPORTS
const APICalls = require('./../../Utils/APICalls.js')
const embedGen = require('./../../Utils/embedGenerator.js')
const permissionChecker = require('./../../Utils/permissionChecker.js');
const auditLogger = require("../../Modules/AuditLog");

const db = require("../../Database/db");
const configHandler = require("../../Utils/configHandler");
const UserManagement = require('../../Utils/UserManagement.js');
const utils = require('../../Utils/utils.js');
const config = configHandler.getConfig();

// Exporting the command for the commandHandler
module.exports = {
	name: 'ban',
	description: 'Bans a user.',
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
        let userMember = await guild.members.fetch(userID).catch(err => { /* */});
        let user = await client.users.fetch(userID);

        //ONLY CHECK IF USER IS IN THE GUILD => HE CAN BE BANNED LOL
        if(userMember) {
            //ANTI KICK CHECKS
            if(permissionChecker.isModerator(data.guildData, userMember)) {
                APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.error(`**${userMember} is a moderator and cant be banned!**`)]}, data.interaction)
                return;
            }

            if(client.user.id === userID) {
                APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.error(`**Why do you want to ban me? :(**`)]}, data.interaction)
                return;
            }

            if(!userMember.bannable) {
                APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.error(`**I cannot ban this user!**`)]}, data.interaction)
                return;
            }
        }


        //REASON
        if(reason === null) {
            reason = "No reason specified!";
        }

        let desc = await UserManagement.banUser(data.client, guild, data.guildData, user, member, reason);
        APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.custom("????USER BANNED????", utils.getColor("moderation","BAN"), desc)]}, data.interaction)
    }
};