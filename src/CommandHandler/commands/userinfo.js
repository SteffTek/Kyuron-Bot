//IMPORTANT IMPORTS
const configHandler = require('../../Utils/configHandler.js');
const config = configHandler.getConfig();

const APICalls = require('../../Utils/APICalls.js')
const embedGen = require('../../Utils/embedGenerator.js')
const permissionChecker = require('../../Utils/permissionChecker.js');
const modAction = require('../../Database/models/modAction.js');
const logger = require('../../Utils/logger.js');
const axios = require("axios");

// Exporting the command for the commandHandler
module.exports = {
	name: 'userinfo',
	description: 'Show useful information about a user.',
	options: [
        {
            "name":"user",
            "description":"User",
            "type":6,
            "required":true
        }
    ],
	async execute(data) {
        //CHECK MODULE
        if(!data.guildData.modules?.moderation) {
            embedGen.error("**This module isn't activated.**",data.client,data.interaction)
            return;
        }

        //CHECK PERMISSION
        const member = await data.channel.guild.members.resolve(data.author.user.id);
        if(!permissionChecker.isModerator(data.guildData, member)) {
            embedGen.error("**You need the `MODERATOR` permission to do this!**",data.client,data.interaction)
            return;
        }


        //GET DATA
        let userID = data.args[0].value;

        let client = data.client;
        let guild = client.guilds.resolve(data.channel.guild.id);
        let userMember = await guild.members.fetch(userID).catch(err => { /* User not Found! */ })
        let user = await client.users.fetch(userID);

        if(!user) {
            embedGen.error("**User couldn't be found!**",data.client,data.interaction)
            return;
        }

        //GETTING MOD LOG COUNT
        const count = await modAction.countDocuments({
            guildID: guild.id,
            userID: user.id,
        });

        //GET DVS DATA
        let response = await axios.post('https://dvs.stefftek.de/api/bans', { data: { userID: user.id } });
        let res = await response.data;

        //CREATE EMBED
        var embed = embedGen.custom("USERINFO",config.colors.moderation.USERINFO,`**Showing user info for user ${user}!**`);

        //EMBED INFOS
        embed.setThumbnail(user.displayAvatarURL());
        embed.addField("User ID","`" + user.id + "`");
        embed.addField("Tag","`" + user.tag + "`");
        embed.addField("Creation Date",user.createdAt,false);

        //HAS VS BAN
        if (res?.status === "success") {
            embed.addField("⚠️Ban Check⚠️", "**User was banned for inappropriate behaviour on various discord servers. Visit https://dvs.stefftek.de/ for more information!**", false);
        }

        embed.addField("\u200B","\u200B",false);

        //CHECK IF BOT
        if(user.bot) {
            embed.addField("Is Bot?","`Yes`", true);
        }

        //SET IF HAS MOD LOG ACTIONS
        embed.addField("Mod Log Activity", `**${count} events found!**`, true)

        //IF MEMBER ADD FIELDS
        if(userMember) {
            embed.addField("Joined Server at",userMember.joinedAt, true);

            if(userMember.nickname)
                embed.addField("Nickname", "`" + userMember.nickname + "`", true);

            if(userMember.premiumSince)
                embed.addField("Boosting since", "`" + userMember.premiumSince + "`", true);
        } else {
            embed.addField("Server status","`User is currently not on this server!`", true)
        }

        //SEND MODLOG
        APICalls.sendInteraction(data.client, {"content": "", "embeds": [embed]}, data.interaction)
	}
};