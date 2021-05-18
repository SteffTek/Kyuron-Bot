//IMPORTANT IMPORTS
const configHandler = require('../../Utils/configHandler.js');
const config = configHandler.getConfig();

const APICalls = require('../../Utils/APICalls.js')
const embedGen = require('../../Utils/embedGenerator.js')
const permissionChecker = require('../../Utils/permissionChecker.js');
const logger = require('../../Utils/logger.js');
const utils = require('../../Utils/utils.js');

// Exporting the command for the commandHandler
module.exports = {
    name: 'responder',
    description: 'Manage auto responses.',
    options: [
        {

            "name": "set",
            "description": "Enable or disable rules.",
            "type": 1,
            "options": [
                {
                    "name": "name",
                    "description": "A unique name for this response.",
                    "type": 3,
                    "required": true,
                }, {
                    "name": "question",
                    "description": "What a user can ask.",
                    "type": 3,
                    "required": true
                }, {
                    "name": "answer",
                    "description": "What the bot should reply.",
                    "type": 3,
                    "required": true
                }
            ]
        }, {
            "name": "remove",
            "description": "Remove an auto response from this channel.",
            "type": 1,
            "options": [
                {
                    "name": "name",
                    "description": "Auto response name",
                    "type": 3,
                    "required": true,
                }
            ]
        }, {
            "name": "get",
            "description": "Get auto responses for this channel.",
            "type": 1,
        }
    ],
    async execute(data) {
        //CHECK MODULE
        if (!data.guildData.modules?.autoResponder) {
            embedGen.error("**This module isn't activated.**", data.client, data.interaction)
            return;
        }

        //CHECK PERMISSION
        const member = await data.channel.guild.members.resolve(data.author.user.id);
        if (!permissionChecker.isAdmin(member)) {
            embedGen.error("**You need the `ADMINISTRATOR` permission to do this!**", data.client, data.interaction)
            return;
        }

        //GET DATA
        var command = data.args[0].name;
        var guildData = data.guildData;
        var channel = data.channel;

        //IF GET
        if(command === "get") {
            //FETCH RESPONSES
            var responses = guildData.autoResponder.responses;

            //CREATE EMBED
            var embed = embedGen.custom("AUTO RESPONDER",utils.getColor("autoResponder","GET"),"**Responses for this channel: **");

            //ADD
            for(let response in responses) {
                response = responses[response];
                embed.addField("Name: `" + response.name + "`", "Question: `" + response.question + "`\nResponse: `" + response.response + "`",false);
            }

            //SEND
            APICalls.sendInteraction(data.client, {"content": "", "embeds": [embed]}, data.interaction)
        }

        //IF SET
        if(command === "set") {
            //ASSEMBLE RESPONSE
            var name = data.args[0].options[0].value;
            var question = data.args[0].options[1].value;
            var response = data.args[0].options[2].value;

            //LIMIT RESPONSES
            if(guildData.autoResponder.responses.length >= 25) {
                embedGen.error("**You already have 25 answers set and cannot add more. Remove some if possible.**", data.client, data.interaction)
                return;
            }

            //STRIP QUESTION
            question = question.toLowerCase().replace("?","").replace(".","").replace(",","").replace("!","").replace("'","").replace("`","").replace('"',"").trim();

            const responseObj = {
                name: name,
                channelID: channel.id,
                question: question,
                response: response
            }

            //CHECK RESPONSE
            if(guildData.autoResponder.hasResponse(name, channel.id)) {
                embedGen.error("**This channel already has this response set.**", data.client, data.interaction)
                return;
            }

            guildData.autoResponder.responses.push(responseObj);
            guildData.markModified("autoResponder");
            guildData.save().catch(err => { console.log(err) });

            embedGen.custom("AUTO RESPONDER",utils.getColor("autoResponder","SET"),"Created new Response: \n\n**Name:** `" + name + "`\n**Question:** `" + question + "`\n**Response:** `" + response + "`",data.client,data.interaction);
        }

        //IF REMOVE
        if(command === "remove") {
            var name = data.args[0].options[0].value;

            //CHECK RESPONSE
            if(!guildData.autoResponder.hasResponse(name, channel.id)) {
                embedGen.error("**This channel doesn't have this response.**", data.client, data.interaction)
                return;
            }

            guildData.autoResponder.removeResponse(name, channel.id);
            guildData.markModified("autoResponder");
            guildData.save().catch(err => { console.log(err) });

            embedGen.custom("AUTO RESPONDER",utils.getColor("autoResponder","REMOVE"),"Removed Response `" + name + "`",data.client,data.interaction);
        }
    }
};
