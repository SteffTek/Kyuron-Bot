//IMPORTANT IMPORTS
const APICalls = require('./../../Utils/APICalls.js')
const embedGen = require('./../../Utils/embedGenerator.js')

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
		// Responding to the interaction with the client's websocket ping
        //const channelType = data.args[0].value;
        //const channelID = data.channel.id;

		APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.custom("Announcement added", "0xFF964F", "")]}, data.interaction)
	}
};