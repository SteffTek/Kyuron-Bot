//IMPORTANT IMPORTS
const APICalls = require('../../Utils/APICalls.js')
const embedGen = require('../../Utils/embedGenerator.js')
const permissionChecker = require('../../Utils/permissionChecker.js');
const utils = require('../../Utils/utils.js');

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
            embedGen.error("**You need the `ADMINISTRATOR` permission to do this!**",data.client,data.interaction)
            return;
        }

        //GET TYPE
        const type = data.args[0].name;

		//GET DATA
        const roleType = data.args[0].options[0]?.value;
        const roleID = data.args[0].options[1]?.value;

        const guild = data.client.guilds.resolve(data.channel.guild.id);

        var title = "ROLE SET"
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
            title = "ROLE REMOVED!"

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
            title = "ROLE CONFIGURATION"

            if(roleType === "muteRole") {
                let role = await guild.roles.fetch(data.guildData.muteRole).catch(err => { /* ROLE NOT FOUND */ });
                message = `**Currently, the mute role is set to be ${role}!**`;
            }

            if(roleType === "modRole") {
                message = "**Currently, following Roles are considered mod roles:**"
                for(let role in data.guildData.modRoles) {
                    role = await guild.roles.fetch(data.guildData.modRoles[role]).catch(err => { /* ROLE NOT FOUND */ });
                    message += `\n${role}`;
                }
            }
        }

        //SAVE GUILD DATA
        data.guildData.save().catch(err => console.log(err));
		embedGen.custom(title, utils.getColor("embedGen","default"), message, data.client, data.interaction);
	}
};