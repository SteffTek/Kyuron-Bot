//IMPORTANT IMPORTS
const APICalls = require('./../../Utils/APICalls.js')
const embedGen = require('./../../Utils/embedGenerator.js')
const db = require('./../../Database/db.js')

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
                    "name":"Auto Responder",
                    "value":"autoResponder"
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
                    "name":"Economy",
                    "value":"economy"
                },
                {
                    "name":"F.U.N.",
                    "value":"fun"
                },
                {
                    "name":"Giveaways",
                    "value":"giveaway"
                },
                {
                    "name":"Leave Notice",
                    "value":"leaveNotice"
                },
                {
                    "name":"Level System",
                    "value":"leveling"
                },
                {
                    "name":"Moderation",
                    "value":"moderation"
                },
                {
                    "name":"Ticket System",
                    "value":"tickets"
                },
                {
                    "name":"Polls",
                    "value":"polls"
                },
                {
                    "name":"Timed Messages",
                    "value":"timer"
                },
                {
                    "name":"Warn System (Requires Audit Log)",
                    "value":"warn"
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
        //GET DATA
        let module = data.args[0].value;
        let isEnabled = data.args[1].value;
        
        //SET MODULE DATA
        data.guildData.modules[module] = isEnabled;

        //SAVE GUILD DATA
        data.guildData.save().catch(err => console.log(err));

        //TODO: MODULE SPECIFIC UPDATES

		APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.custom("🛠️ MODULE SET 🛠️", "0x214aff", "**State:** `" + module + "/" + isEnabled + "`")]}, data.interaction)
	}
};