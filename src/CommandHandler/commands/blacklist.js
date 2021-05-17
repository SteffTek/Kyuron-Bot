//IMPORTANT IMPORTS
const configHandler = require('../../Utils/configHandler.js');
const config = configHandler.getConfig();

const APICalls = require('../../Utils/APICalls.js')
const embedGen = require('../../Utils/embedGenerator.js')
const permissionChecker = require('../../Utils/permissionChecker.js');

const axios = require("axios");
const guild = require('../../Database/models/guild.js');
const utils = require('../../Utils/utils.js');

// Exporting the command for the commandHandler
module.exports = {
	name: 'blacklist',
	description: 'Sets selected role for specified usage.',
	options: [
        {
            "name":"set",
            "description":"Adds an entry to the blacklist.",
            "type":1,
            "options":[
                {
                    "name":"term",
                    "description":"Term to be added.",
                    "required":true,
                    "type":3,
                }
            ]
        },{
            "name":"remove",
            "description":"Removes an entry from the blacklist.",
            "type":1,
            "options":[
                {
                    "name":"term",
                    "description":"Term to be removed.",
                    "required":true,
                    "type":3,
                }
            ]
        },{
            "name":"get",
            "description":"Gets blacklist.",
            "type":1
        }
    ],
	async execute(data) {
        //CHECK MODULE
        if(!data.guildData.modules?.moderation) {
            embedGen.error("**This module isn't activated.**",data.client,data.interaction)
            return;
        }

        //CHECK PERMISSION
        const member = await data.channel.guild.members.fetch(data.author.user.id);
        if(!permissionChecker.isModerator(data.guildData, member)) {
            embedGen.error("**You need the `MODERATOR` permission to do this!**",data.client,data.interaction)
            return;
        }

        //GET TYPE
        const type = data.args[0].name;
        var term = null;
        if(type !== "get") {
            term = data.args[0]?.options[0]?.value;
            term = term.toLowerCase();
        }

        const guildData = data.guildData;

        //SET TERM
        if(type === "set") {

            if(guildData?.blacklist?.includes(term)) {
                embedGen.error("**This term is already blocked!**",data.client,data.interaction)
                return;
            }

            guildData?.blacklist?.push(term);
            guildData.markModified("blacklist");
            guildData.save().catch(err => { /* */ })

            embedGen.custom("🏴BLACKLIST TERM ADDED🏴", utils.getColor("moderation","BLACKLIST"), "Term successfully added to blacklist!", data.client, data.interaction)

            return;
        }

        //REMOVE TERM
        if(type === "remove") {

            if(!guildData?.blacklist?.includes(term)) {
                embedGen.error("**This term isn't blocked!**",data.client,data.interaction)
                return;
            }

            let index = guildData.blacklist.indexOf(term);
            guildData.blacklist.splice(index,1);

            guildData.markModified("blacklist");
            guildData.save().catch(err => { /* */ })

            embedGen.custom("🏴BLACKLIST TERM REMOVED🏴", utils.getColor("moderation","BLACKLIST"), "Term successfully removed from blacklist!", data.client, data.interaction)

            return;
        }

        //GET TERMS
        let description = "";

        for(let i = 0; i < guildData.blacklist.length; i++) {
            description += `● ${guildData.blacklist[i]}\n`
        }

        if(guildData.blacklist.length == 0) {
            description = "`No blocked terms found!`"
        }

        //SEND
        embedGen.custom("🏴BLACKLIST TERMS🏴", utils.getColor("moderation","BLACKLIST"), description, data.client, data.interaction)
	}
};
