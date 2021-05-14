//IMPORTANT IMPORTS
const configHandler = require('../../Utils/configHandler.js');
const config = configHandler.getConfig();

const APICalls = require('../../Utils/APICalls.js')
const embedGen = require('../../Utils/embedGenerator.js')
const permissionChecker = require('../../Utils/permissionChecker.js');
const logger = require('../../Utils/logger.js');

// Exporting the command for the commandHandler
module.exports = {
	name: 'automod',
	description: 'Manage the auto mod settings.',
	options: [
        {
            "name":"rules",
            "description":"Manage rules.",
            "type":2,
            "options":[
                {
                    "name":"enabled",
                    "description":"Enable or disable rules.",
                    "type":1,
                    "options": [
                        {
                            "name":"rule",
                            "description":"Rule to manage",
                            "type":3,
                            "required": true,
                            "choices":[
                                {
                                    "value":"blacklist",
                                    "name":"Blacklist Violated"
                                },{
                                    "value":"invite",
                                    "name":"Invite sent"
                                },{
                                    "value":"links",
                                    "name":"Links"
                                },{
                                    "value":"caps",
                                    "name":"Excessive Caps"
                                },{
                                    "value":"emotes",
                                    "name":"Mass Emotes"
                                },{
                                    "value":"mentions",
                                    "name":"Mass Mentions"
                                },{
                                    "value":"spam",
                                    "name":"Spam"
                                }
                            ]
                        },{
                            "name":"enabled",
                            "description":"Is rule enabled?",
                            "type":5,
                            "required": true
                        }
                    ]
                },{
                    "name":"action",
                    "description":"What does triggering the rule do?",
                    "type":1,
                    "options": [
                        {
                            "name":"rule",
                            "description":"Rule to manage",
                            "type":3,
                            "required": true,
                            "choices":[
                                {
                                    "value":"blacklist",
                                    "name":"Blacklist Violated"
                                },{
                                    "value":"invite",
                                    "name":"Invite sent"
                                },{
                                    "value":"links",
                                    "name":"Links"
                                },{
                                    "value":"caps",
                                    "name":"Excessive Caps"
                                },{
                                    "value":"emotes",
                                    "name":"Mass Emotes"
                                },{
                                    "value":"mentions",
                                    "name":"Mass Mentions"
                                },{
                                    "value":"spam",
                                    "name":"Spam"
                                }
                            ]
                        },{
                            "name":"action",
                            "description":"Is rule enabled?",
                            "type":3,
                            "required": true,
                            "choices":[
                                {
                                    "value":"delete",
                                    "name":"Delete Message"
                                },{
                                    "value":"warn",
                                    "name":"Warn user"
                                },{
                                    "value":"both",
                                    "name":"Delete & Warn"
                                }
                            ]
                        }
                    ]
                },{
                    "name":"whitelist",
                    "description":"Toggles whitelist for specific channels on this rule.",
                    "type":1,
                    "options": [
                        {
                            "name":"rule",
                            "description":"Rule to manage",
                            "type":3,
                            "required": true,
                            "choices":[
                                {
                                    "value":"blacklist",
                                    "name":"Blacklist Violated"
                                },{
                                    "value":"invite",
                                    "name":"Invite sent"
                                },{
                                    "value":"links",
                                    "name":"Links"
                                },{
                                    "value":"caps",
                                    "name":"Excessive Caps"
                                },{
                                    "value":"emotes",
                                    "name":"Mass Emotes"
                                },{
                                    "value":"mentions",
                                    "name":"Mass Mentions"
                                },{
                                    "value":"spam",
                                    "name":"Spam"
                                }
                            ]
                        },{
                            "name":"channel",
                            "description":"The channel to toggle.",
                            "type":7,
                            "required": true
                        }
                    ]
                }
            ]
        },{
            "name":"trigger",
            "description":"Create automatic triggers for moderate users.",
            "type":2,
            "options":[
                {
                    "name":"get",
                    "description":"Get all current triggers.",
                    "type":1,
                },{
                    "name":"remove",
                    "description":"Remove a trigger by its ID.",
                    "type":1,
                    "options":[
                        {
                            "name":"trigger",
                            "description":"The numerical ID of the trigger.",
                            "type":4,
                            "required":true
                        }
                    ]
                },{
                    "name":"set",
                    "description":"Option 1",
                    "type":1,
                    "options":[
                        {
                            "name":"what",
                            "description":"What should happen?",
                            "type":3,
                            "required":true,
                            "choices":[
                                {
                                    "name":"Ban",
                                    "value":"ban"
                                },{
                                    "name":"Kick",
                                    "value":"kick"
                                },{
                                    "name":"Mute",
                                    "value":"mute"
                                },{
                                    "name":"Temp Ban",
                                    "value":"tempban"
                                },{
                                    "name":"Temp Mute",
                                    "value":"tempmute"
                                },
                            ]
                        },{
                            "name":"if",
                            "description":"How many warns are needed to trigger this event.",
                            "type":4,
                            "required":true
                        },{
                            "name":"in",
                            "description":"The timespan in minutes the user have to been warned.",
                            "type":4,
                            "required":true
                        },{
                            "name":"for",
                            "description":"For what time period the action should last (Temp Ban/Mute)",
                            "type":4,
                            "required":false
                        }
                    ]
                }
            ]
        }
    ],
	async execute(data) {
        console.log(JSON.stringify(data.args));

        //CHECK MODULE
        if(!data.guildData.modules?.autoMod) {
            embedGen.error("**This module isn't activated.**",data.client,data.interaction)
            return;
        }

        //CHECK PERMISSION
        const member = await data.channel.guild.members.resolve(data.author.user.id);
        if(!permissionChecker.isAdmin(member)) {
            embedGen.error("**You need the `ADMINISTRATOR` permission to do this!**",data.client,data.interaction)
            return;
        }

        //GET DATA
        var command = data.args[0].name;
        var subCommand = data.args[0].options[0].name;

        //IF RULES COMMAND
        if(command === "rules") {
            var rule = data.args[0].options[0].options[0].value;

            if(subCommand === "enabled") {
                var isEnabled = data.args[0].options[0].options[1].value;
                data.guildData.autoMod.enabledRules[rule].enabled = isEnabled;
            }
            if(subCommand === "action") {
                var action = data.args[0].options[0].options[1].value;
                data.guildData.autoMod.enabledRules[rule].action = action;
            }
            if(subCommand === "whitelist") {
                var channel = data.args[0].options[0].options[1].value;
                if(data.guildData.autoMod.enabledRules[rule].whitelist.includes(channel)) {
                    //REMOVE CHANNEL
                    let index = data.guildData.autoMod.enabledRules[rule].whitelist.indexOf(channel);
                    data.guildData.autoMod.enabledRules[rule].whitelist.splice(index, 1);
                } else {
                    //ADD CHANNEL
                    data.guildData.autoMod.enabledRules[rule].whitelist.push(channel);
                }
            }

            //SAVING
            data.guildData.markModified("autoMod");
            data.guildData.save().catch(err => { /* */ })

            //SEND MESSAGE
            embedGen.custom("AUTOMOD RULE","","**Rule `" + rule + "` state `" + subCommand +"` changed successfully!**",data.client, data.interaction);
            return;
        }


        //IF TRIGGER COMMAND
        if(command === "trigger") {
            
        }
	}
};
