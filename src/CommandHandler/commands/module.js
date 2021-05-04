//IMPORTANT IMPORTS
const APICalls = require('./../../Utils/APICalls.js')
const embedGen = require('./../../Utils/embedGenerator.js')

// Exporting the command for the commandHandler
module.exports = {
	name: 'module',
	description: 'Enables or disables module for this guild.',
	options: [
        {
            "name":"module",
            "description":"Modulename.",
            "type":3,
            "required": true,
            "choices":[
                {
                    "name":"Audit Logging",
                    "value":"auditLogging"
                },
                {
                    "name":"Auto Mod",
                    "value":"autoMod"
                },
                {
                    "name":"Announcements",
                    "value":"announcements"
                },
                {
                    "name":"Moderation",
                    "value":"moderation"
                }
            ]
        },{
            "name":"enabled",
            "description":"Is module enabled?",
            "type":5,
            "required": true
        }
    ],
	async execute(data) {
		// Responding to the interaction with the client's websocket ping
		APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.custom("Module Set", "0xFF964F", "")]}, data.interaction)
	}
};