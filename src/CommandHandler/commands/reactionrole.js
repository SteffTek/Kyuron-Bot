//IMPORTANT IMPORTS
const db = require('../../Database/db');
const APICalls = require('../../Utils/APICalls.js')
const embedGen = require('../../Utils/embedGenerator.js')
const permissionChecker = require('../../Utils/permissionChecker.js');

const configHandler = require("../../Utils/configHandler");
const config = configHandler.getConfig();

// Exporting the command for the commandHandler
module.exports = {
	name: 'reactionrole',
	description: 'Creates and manages reaction roles.',
	options: [
        {
            "name":"create",
            "description":"Create reaction role message.",
            "type":1,
            "options":[
                {
                    "name":"name",
                    "description":"Reaction role name. Used to identify reaction roles in the system.",
                    "required":true,
                    "type":3,
                }
            ]
        },{
            "name":"remove",
            "description":"Removes a reaction role message.",
            "type":1,
            "options":[
                {
                    "name":"name",
                    "description":"Reaction role name. Used to identify reaction roles in the system.",
                    "required":true,
                    "type":3,
                }
            ]
        },{
            "name":"addrole",
            "description":"Adds a reaction to the message",
            "type":1,
            "options":[
                {
                    "name":"name",
                    "description":"Reaction role name. Used to identify reaction roles in the system.",
                    "required":true,
                    "type":3,
                },{
                    "name":"role",
                    "description":"Role which should be added on reaction.",
                    "required":true,
                    "type":8,
                },{
                    "name":"emote",
                    "description":"Emote of the reaction. No custom emotes allowed.",
                    "required":true,
                    "type":3,
                }
            ]
        },{
            "name":"removerole",
            "description":"Removes a reaction to the message",
            "type":1,
            "options":[
                {
                    "name":"name",
                    "description":"Reaction role name. Used to identify reaction roles in the system.",
                    "required":true,
                    "type":3,
                },{
                    "name":"role",
                    "description":"Role which should be removed from reaction.",
                    "required":true,
                    "type":8,
                }
            ]
        }
    ],
	async execute(data) {
        //CHECK MODULE
        if(!data.guildData.modules?.reactionRoles) {
            embedGen.error("**This module isn't activated.**",data.client,data.interaction)
            return;
        }

        //CHECK PERMISSION
        const member = await data.channel.guild.members.resolve(data.author.user.id);
        if(!permissionChecker.isAdmin(member)) {
            embedGen.error("**You need the `ADMINISTRATOR` permission to do this!**",data.client,data.interaction)
            return;
        }

        //GET TYPE
        const type = data.args[0].name;

        const guildID = data.channel.guild.id;
        const channelID = data.channel.id;

        const guild = await data.client.guilds.fetch(guildID);
        const channel = await guild.channels.resolve(channelID);

        const name = data.args[0].options[0]?.value; //ALWAYS NAME

        //CREATE MESSAGE
        if(type === "create") {
            if(await db.hasReactionByName(guildID, channelID, name)) {
                embedGen.error("**Reaction Message with that specific name already exists in this channel!**",data.client,data.interaction)
                return;
            }

            await APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.custom(name,"0x000000","")]}, data.interaction)
            let messageData = await APICalls.getInteractionMessage(data.interaction);
            db.loadReaction(guildID, channelID, messageData.id, name);
            return;
        }


        //REMOVE MESSAGE
        if(type === "remove") {
            if(await db.hasReactionByName(guildID, channelID, name) === false) {
                embedGen.error("**Reaction Message with that specific name couldn't be found!**",data.client,data.interaction)
                return;
            }

            await APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.custom("REACTION ROLE DELETED","0x000000","")]}, data.interaction)

            db.getReactionByName(guildID, channelID, name).then(async reactionData => {
                var message = await channel.messages.fetch(reactionData.messageID);
                message.delete();
                reactionData.remove();
            });
            return;
        }

        //ADD ROLE
        if(type === "addrole") {
            if(await db.hasReactionByName(guildID, channelID, name) === false) {
                embedGen.error("**Reaction Message with that specific name couldn't be found!**",data.client,data.interaction)
                return;
            }

            //EDIT
            db.getReactionByName(guildID, channelID, name).then(async reactionData => {
                var message = await channel.messages.fetch(reactionData.messageID);

                //ADD ROLE
                const roleID = data.args[0].options[1]?.value;
                const emote = data.args[0].options[2]?.value;

                if(roleID === guild.roles.everyone.id) {
                    embedGen.error("**Invalid Role!**",data.client,data.interaction)
                    return;
                }

                //CHECK ROLE
                const role = await guild.roles.fetch(roleID);
                if(!role) {
                    embedGen.error("**Role doesn't exist!**",data.client,data.interaction)
                    return;
                }

                //CHECK EMOTE
                await message.react(emote).then(async () => {
                    //MESSAGE CAN BE SENT NOW
                    await APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.custom("REACTION ROLE EDITED","0x000000","")]}, data.interaction)

                    //FALLBACK
                    if(!reactionData.roles) reactionData.roles = {};
                    reactionData.roles[emote] = roleID;

                    //SAVING
                    reactionData.markModified("roles");
                    await reactionData.save().catch(err => console.log(err));

                    //BUILD EMBED
                    desc = "";
                    for(let emoji in reactionData.roles) {
                        var reactRole = await guild.roles.fetch(reactionData.roles[emoji]);

                        desc += emoji + " - " + reactRole.name + "\n";
                    }

                    message.edit(embedGen.custom(name,"0x000000",desc));
                }).catch(err => {
                    embedGen.error("**Emoji doesn't exist!**",data.client,data.interaction)
                    return;
                })
            })
            return;
        }

        //REMOVE ROLE
        if(await db.hasReactionByName(guildID, channelID, name) === false) {
            embedGen.error("**Reaction Message with that specific name couldn't be found!**",data.client,data.interaction)
            return;
        }

        //EDIT
        db.getReactionByName(guildID, channelID, name).then(async reactionData => {
            var message = await channel.messages.fetch(reactionData.messageID);

            //ADD ROLE
            const roleID = data.args[0].options[1]?.value;

            //CHECK ROLE
            const role = await guild.roles.fetch(roleID);
            if(!role) {
                embedGen.error("**Role doesn't exist!**",data.client,data.interaction)
                return;
            }

            //SEND MESSAGE NOW
            await APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.custom("REACTION ROLE EDITED","0x000000","")]}, data.interaction)

            //BUILD EMBED
            var desc = "";
            for(let emoji in reactionData.roles) {
                var reactRole = await guild.roles.fetch(reactionData.roles[emoji]);

                if(reactRole.id === roleID) {
                    //REMOVE
                    delete reactionData.roles[emoji];

                    //SAVING
                    reactionData.markModified("roles");
                    await reactionData.save().catch(err => console.log(err));
                    continue;
                }

                desc += emoji + " - " + reactRole.name + "\n";
            }

            message.edit(embedGen.custom(name,"0x000000",desc)).then(message => {
                message.reactions.removeAll();

                for(let emoji in reactionData.roles) {
                    message.react(emoji);
                }
            });
        })

        return;
	}
};