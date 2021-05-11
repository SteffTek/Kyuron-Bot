//IMPORTANT IMPORTS
const APICalls = require('./../../Utils/APICalls.js')
const embedGen = require('./../../Utils/embedGenerator.js')
const permissionChecker = require('./../../Utils/permissionChecker.js');

const configHandler = require("../../Utils/configHandler");
const config = configHandler.getConfig();

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
                    "name":"Reaction Roles",
                    "value":"reactionRoles"
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
        //CHECK PERMISSION
        const member = await data.channel.guild.members.resolve(data.author.user.id);
        if(!permissionChecker.isAdmin(member)) {
            embedGen.error("**You need the `ADMINISTRATOR` permission to do this!**",data.client,data.interaction)
            return;
        }

        //GET DATA
        let module = data.args[0].value;
        let isEnabled = data.args[1].value;

        var guild = data.channel.guild;
        var guildData = data.guildData;

        //SET MODULE DATA
        guildData.modules[module] = isEnabled;

        //SAVE GUILD DATA
        guildData.save().catch(err => console.log(err));

        //SEND RESPONSE FIRST
		APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.custom("🛠️ MODULE SET 🛠️", "0x214aff", "`module:` **" + module + "**\n`state:` **" + (isEnabled ? "enabled" : "disabled") + "**")]}, data.interaction)

        //TODO: MODULE SPECIFIC UPDATES
        if(module === "tickets") {
            //CREATE TICKET CHANNEL
            if(!isEnabled) return;
            //CREATE CATEGORY
            guild.channels.create("🎫-Support", {type: "category"}).then(async category => {

                var permissions = [
                    {
                        id: guild.roles.everyone.id,
                        deny: ["SEND_MESSAGES","ADD_REACTIONS"],
                        allow: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]
                    }
                ];

                //PUSH MOD ROLES
                for(let i = 0; i < guildData.modRoles.length; i++) {
                    permissions.push({
                        id: guildData.modRoles[i],
                        allow: ["SEND_MESSAGES", "ADD_REACTIONS"]
                    })
                }

                //SET PERMISSIONS
                await category.overwritePermissions(permissions);

                //CREATE CHANNEL
                guild.channels.create("🎫-Ticket", {type: "text", parent: category}).then(channel => {
                    //SET CHANNEL TO GUILD DATA
                    guildData.channels.ticketSystemChannel = channel.id;

                    //COMMIT CHANNEL MESSAGE EMBED
                    channel.send(embedGen.custom("🎫-Support Tickets",config.colors.tickets.INFO,guildData.messages.ticketSystem.replace("%emote%", "📩"))).then(message => {
                        guildData.messageIDs.ticketSystem = message.id;
                        message.react("📩");

                        //SAVE GUILD DATA
                        guildData.save().catch(err => console.log(err));
                    }).catch(err => {
                        APICalls.sendFollowUp({"content": "", "embeds": [embedGen.error("**I don't have the permission to send messages in the ticket channel!**")]}, data.interaction);
                    })
                });
            }).catch(err => {
                console.log(err);
                APICalls.sendFollowUp({"content": "", "embeds": [embedGen.error("**I don't have the permission to create channels!**")]}, data.interaction);
            })
        }
    }
};