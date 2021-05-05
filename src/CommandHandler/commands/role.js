//IMPORTANT IMPORTS
const APICalls = require('../../Utils/APICalls.js')
const embedGen = require('../../Utils/embedGenerator.js')
const permissionChecker = require('../../Utils/permissionChecker.js');

// Exporting the command for the commandHandler
module.exports = {
	name: 'role',
	description: 'Sets selected role for specified usage.',
	options: [
        {
            "name":"set",
            "description":"Set Role.",
            "type":1,
            "options":[
                {
                    "name":"type",
                    "description":"Role Type",
                    "required":true,
                    "type":3,
                    "choices":[
                        {
                            "name":"Mod Role",
                            "value":"modRole"
                        },
                        {
                            "name":"Mute Role",
                            "value":"muteRole"
                        }
                    ]
                },{
                    "name":"role",
                    "description":"Role.",
                    "type":8,
                    "required":true
                }
            ]
        },{
            "name":"remove",
            "description":"Remove Role.",
            "type":1,
            "options":[
                {
                    "name":"type",
                    "description":"Role Type",
                    "required":true,
                    "type":3,
                    "choices":[
                        {
                            "name":"Mod Role",
                            "value":"modRole"
                        },
                        {
                            "name":"Mute Role",
                            "value":"muteRole"
                        }
                    ]
                },{
                    "name":"role",
                    "description":"Role.",
                    "type":8,
                    "required":true
                }
            ]
        },{
            "name":"get",
            "description":"Gets Role.",
            "type":1,
            "options":[
                {
                    "name":"type",
                    "description":"Role Type",
                    "required":true,
                    "type":3,
                    "choices":[
                        {
                            "name":"Mod Role",
                            "value":"modRole"
                        },
                        {
                            "name":"Mute Role",
                            "value":"muteRole"
                        }
                    ]
                }
            ]
        }
    ],
	async execute(data) {
        //CHECK PERMISSION
        const member = await data.channel.guild.members.resolve(data.author.user.id);
        if(!permissionChecker.isAdmin(member)) {
            APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.error("**You don't have the permission to do this!**")]}, data.interaction)
            return;
        }

        //GET TYPE
        const type = data.args[0].name;

		//GET DATA
        const roleType = data.args[0].options[0]?.value;
        const roleID = data.args[0].options[1]?.value;

        var title = "Role Set!"
        var message = "Role ID:  **`" + roleID + "/" + roleType + "`**";

        //SET MODULE DATA
        if(type === "set") {
            if(roleType === "muteRole") {
                data.guildData.muteRole = roleID;
            }

            if(roleType === "modRole") {
                if(!data.guildData.modRoles.includes(roleID))
                    data.guildData.modRoles.push(roleID);
            }
        }

        //REMOVE MODULE DATA
        if(type === "remove") {
            title = "Role Removed!"

            if(roleType === "muteRole") {
                if(roleID === data.guildData.muteRole)
                    data.guildData.muteRole = "";
            }

            if(roleType === "modRole") {
                if(data.guildData.modRoles.includes(roleID)) {
                    let index = data.guildData.modRoles.indexOf(roleID);
                    data.guildData.modRoles.splice(index,1);
                }
            }
        }

        //GET MODULE DATA
        if(type === "get") {
            title = "Roles:"

            if(roleType === "muteRole") {
                message = "Role:  **`" + data.guildData.muteRole + "/" + roleType + "`**";
            }

            if(roleType === "modRole") {
                message = "**Roles:** `" + roleType + "`"
                for(let role in data.guildData.modRoles) {
                    message += "\n" + data.guildData.modRoles[role];
                }
            }
        }

        //SAVE GUILD DATA
        data.guildData.save().catch(err => console.log(err));


		APICalls.sendInteraction(data.client, {"content": "", "embeds": [embedGen.custom(title, "0xFF964F", message)]}, data.interaction)
	}
};