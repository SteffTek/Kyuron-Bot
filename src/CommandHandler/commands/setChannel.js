//IMPORTANT IMPORTS
const APICalls = require('./../../Utils/APICalls.js')
const embedGen = require('./../../Utils/embedGenerator.js')
const permissionChecker = require('./../../Utils/permissionChecker.js');

// Exporting the command for the commandHandler
module.exports = {
	name: 'setchannel',
	description: 'Sets current Channel for specified use.',
	options: [
        {
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
                    "name":"Audit Log Ignored Channels",
                    "value":"auditLogIgnore"
                },
                {
                    "name":"Leave Notice Channel",
                    "value":"leaveNoticeChannel"
                },
                {
                    "name":"LevelUP Announcement Channel",
                    "value":"levelSystemChannel"
                },
                {
                    "name":"Auto Voice Channel",
                    "value":"autoVoiceChannel"
                }
            ]
        },{
            "name":"channel",
            "description":"The channel of choice.",
            "type":7,
            "required": false
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
        const channelType = data.args[0].value;
        var channelID = data.channel.id;

        //IF CHANNEL ID SPECIFIED
        if(data.args[1]) {
            channelID = data.args[1].value;
        }

        //VARS
        var title = "Channel Set!"
        var description = "Channel ID:  **`" + channelID + "/" + channelType + "`**";

        //SET MODULE DATA
        if(channelType === "auditLogIgnore") {
            if(data.guildData.channels[channelType].includes(channelID)) {
                //REMOVE
                title = "Channel Removed!"
                let index = data.guildData.channels[channelType].indexOf(channelID);
                data.guildData.channels[channelType].splice(index, 1);
            } else {
                //ADD
                data.guildData.channels[channelType].push(channelID);
            }
        } else {
            data.guildData.channels[channelType] = channelID;
        }

        //SAVE GUILD DATA
        data.guildData.markModified("channels");
        data.guildData.save().catch(err => console.log(err));

		embedGen.custom(title, "0xFF964F", description, data.client, data.interaction)
    }
};