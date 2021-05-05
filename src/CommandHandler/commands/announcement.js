//IMPORTANT IMPORTS
const APICalls = require('./../../Utils/APICalls.js')
const embedGen = require('./../../Utils/embedGenerator.js');
const permissionChecker = require('./../../Utils/permissionChecker.js');

// Exporting the command for the commandHandler
module.exports = {
	name: 'announcement',
	description: 'Add announcements for YouTube-Channels, Twitch Live Streams, etc.',
	options: [
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
                },
                {
                    "name":"TikTok",
                    "value":"tiktok"
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
],
	async execute(data) {
        //CHECK PERMISSION
        const member = await data.channel.guild.members.resolve(data.author.user.id);
        if(!permissionChecker.isAdmin(member)) {
            APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.error("**You don't have the permission to do this!**")]}, data.interaction)
            return;
        }

		APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.custom("Announcement added", "0xFF964F", "")]}, data.interaction)
	}
};