//IMPORTANT IMPORTS
const APICalls = require('./../../Utils/APICalls.js')
const embedGen = require('./../../Utils/embedGenerator.js')
const permissionChecker = require('./../../Utils/permissionChecker.js');

// Exporting the command for the commandHandler
module.exports = {
    name: 'setmessage',
    description: 'Sets selected message to input.',
        options: [
        {
            "name":"type",
            "description":"The type of usage.",
            "type":3,
            "required": true,
            "choices":[
                {
                    "name":"Leave Notice",
                    "value":"leaveNotice"
                }
            ]
        },{
            "name":"message",
            "description":"The message to send.",
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

		//GET DATA
        const messageType = data.args[0].value;
        const messageString = data.args[1].value;

        //SET MODULE DATA
        data.guildData.messages[messageType] = messageString;

        //SAVE GUILD DATA
        data.guildData.save().catch(err => console.log(err));

		APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.custom("Custom Message Set!", "0xFF964F", "Message:  **`" + messageType + " / " + messageString + " `**")]}, data.interaction)
	}
};