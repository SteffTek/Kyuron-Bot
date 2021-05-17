//IMPORTANT IMPORTS
const APICalls = require('./../../Utils/APICalls.js')
const embedGen = require('./../../Utils/embedGenerator.js')
const permissionChecker = require('./../../Utils/permissionChecker.js');

const configHandler = require("../../Utils/configHandler");
const config = configHandler.getConfig();
const utils = require('../../Utils/utils.js');

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
                },{
                    "name":"Ticket System Message",
                    "value":"ticketSystem"
                },{
                    "name":"New Ticket Message",
                    "value":"ticketIntro"
                },{
                    "name":"LevelUP Message",
                    "value":"levelSystem"
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
            embedGen.error("**You need the `ADMINISTRATOR` permission to do this!**",data.client,data.interaction)
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

        //TODO SPECIFIC UPDATES
        if(messageType === "ticketSystem") {
            if(data.guildData.messageIDs.ticketSystem === "") return;
            if(data.guildData.channels.ticketSystemChannel === "") return;

            data.channel.guild.channels.resolve(data.guildData.channels.ticketSystemChannel).messages.fetch(data.guildData.messageIDs.ticketSystem).then(message => {
                message.edit(embedGen.custom("🎫-Support Tickets",utils.getColor("tickets","INFO"),data.guildData.messages.ticketSystem.replace("%emote%", "📩")))
            });
        }
    }
};