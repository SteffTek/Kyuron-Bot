//IMPORTANT IMPORTS
const APICalls = require('./../../Utils/APICalls.js')
const embedGen = require('./../../Utils/embedGenerator.js')

// Exporting the command for the commandHandler
module.exports = {
	name: 'setchannel',
	description: 'Sets current Channel for specified use.',
	options: [{
        "name":"type",
        "description":"The type of usage.",
        "type":3,
        "required": true,
        "choices":[
            {
                "name":"Audit Log Channel",
                "value":"auditLogChannel"
            },
            {
                "name":"Announcement Channel",
                "value":"announcementChannel"
            }
        ]
    }],
	async execute(data) {
		// Responding to the interaction with the client's websocket ping
        const channelType = data.args[0].value;
        const channelID = data.channel.id;

		APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.custom("Channel Set!", "0xFF964F", "Channel ID:  **`" + channelID + "/" + channelType + "`**")]}, data.interaction)
	}
};