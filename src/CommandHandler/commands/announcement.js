//IMPORTANT IMPORTS
const APICalls = require('./../../Utils/APICalls.js')
const embedGen = require('./../../Utils/embedGenerator.js');
const permissionChecker = require('./../../Utils/permissionChecker.js');
const db = require("../../Database/db");
const Announcement = require("../../Modules/Announcement");
const announcement = require('../../Database/models/announcement.js');

// Exporting the command for the commandHandler
module.exports = {
	name: 'announcement',
	description: 'Add announcements for YouTube-Channels, Twitch Live Streams, etc.',
	options: [
        {
            "name":"set",
            "description":"Set new Announcement.",
            "type":1,
            "options":[
                {
                    "name":"platform",
                    "description":"The Platform.",
                    "type":3,
                    "required": true,
                    "choices":[
                        {
                            "name":"YouTube",
                            "value":"youtube"
                        },
                        {
                            "name":"Twitch",
                            "value":"twitch"
                        },
                        {
                            "name":"Twitter",
                            "value":"twitter"
                        }
                    ]
                },{
                    "name":"url",
                    "description":"URL to the Channel.",
                    "type":3,
                    "required": true
                },{
                    "name":"message",
                    "description":"The message to display.",
                    "type":3,
                    "required": true
                }
            ]
        },{
            "name":"remove",
            "description":"Remove Announcement.",
            "type":1,
            "options":[
                {
                    "name":"url",
                    "description":"URL of the Channel to remove.",
                    "type":3,
                    "required": true
                }
            ]
        }
    ],
	async execute(data) {
        //CHECK MODULE
        if(!data.guildData.modules?.announcements) {
            APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.error("**This module isn't activated.**")]}, data.interaction)
            return;
        }

        //CHECK PERMISSION
        const member = await data.channel.guild.members.resolve(data.author.user.id);
        if(!permissionChecker.isAdmin(member)) {
            embedGen.error("**You need the `ADMINISTRATOR` permission to do this!**",data.client,data.interaction)
            return;
        }

        //GET UTIL
        const channelID = data.channel.id;
        const guildID = data.channel.guild.id;

        //GET TYPE
        const type = data.args[0].name;

        //SET
        if(type === "set") {

            const platform = data.args[0].options[0]?.value;
            const url = data.args[0].options[1]?.value;
            const message = data.args[0].options[2]?.value;

            if(!checkClientID(url, platform)) {
                APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.error("**This URL is not valid for the selected platform!**")]}, data.interaction);
                return;
            }

            let check = await db.hasAnnouncement(guildID, channelID, url);
            if(check) {
                APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.error("**This URL already has an announcement set in this channel!**")]}, data.interaction);
                return;
            }

            //CREATE ANNOUNCEMENT
            db.loadAnnouncement(guildID, channelID, url, platform, message);

            let announcementObj = new Announcement(data.client, url, platform, guildID, channelID, message);
            announcements[guildID + channelID + url] = announcementObj;

            APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.custom("📢ANNOUNCEMENT SET!📢", "0xFF964F", "You added a new " + platform.toUpperCase() + " announcement for URL: " + url)]}, data.interaction)
            return;
        }

        //REMOVE
        const url = data.args[0].options[0]?.value;

        //REMOVE ANNOUNCEMENT
        db.removeAnnouncement(guildID, channelID, url);

        //GET FROM GLOBAL OBJECT IN INDEX
        var announcementObj = announcements[guildID + channelID + url];
        if(announcementObj) {
            announcementObj.clearHandler(); //REMOVE HANDLER FROM EXECUTION
            delete announcements[guildID + channelID + url];
        }

        //SEND RESPONSE
		APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.custom("🗑️ANNOUNCEMENT REMOVED!🗑️", "0xFF964F", "The announcement for " + url + " has been removed!")]}, data.interaction)
	}
};

/**
 * Checks the channel ID from a URL
 * @param {String} channelURL channel url
 * @param {String} channelType channel type
 * @returns {Boolean} is valid
 */
function checkClientID(channelURL, channelType) {
    var pattern = "";
    var subgroup = 0;

    if(channelType == "youtube") { subgroup = 3; pattern = /^(?:(http|https):\/\/[a-zA-Z-]*\.{0,1}[a-zA-Z-]{3,}\.[a-z]{2,})\/channel\/([a-zA-Z0-9_]{3,})$/; }
    if(channelType == "twitch") { subgroup = 2; pattern = /^(?:https?:\/\/)?(?:www\.|go\.)?twitch\.tv\/([a-z0-9_]+)($|\?)/; }
    if(channelType == "twitter") { subgroup = 4; pattern = /^https?:\/\/(www\.)?twitter\.com\/(#!\/)?([^\/]+)(\/\w+)*$/; }

    var matches = channelURL.match(pattern);
    if(matches == null || pattern == "") {
        return false;
    }

    if(matches[subgroup - 1] == null) {
        return false;
    }

    return true;
}