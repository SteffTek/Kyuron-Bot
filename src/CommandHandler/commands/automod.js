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
                    "description":"Create and set a new trigger.",
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
                            "name":"warns",
                            "description":"How many warns are needed to trigger this event.",
                            "type":4,
                            "required":true
                        },{
                            "name":"timespan",
                            "description":"The time span in minutes the user have to been warned.",
                            "type":4,
                            "required":true
                        },{
                            "name":"duration",
                            "description":"For what time period the action should last. (Temp Ban/Mute)",
                            "type":4,
                            "required":false
                        },{
                            "name":"durationtype",
                            "description":"Type of the duration. Default: Minutes",
                            "type":3,
                            "required":false,
                            "choices": [
                                {
                                    "name":"Seconds",
                                    "value":"seconds"
                                },
                                {
                                    "name":"Minutes",
                                    "value":"minutes"
                                },
                                {
                                    "name":"Hours",
                                    "value":"hours"
                                },
                                {
                                    "name":"Days",
                                    "value":"days"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
	async execute(data) {
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

        var guildData = data.guildData;

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

            //SET COMMAND
            if(subCommand === "set") {
                var what = data.args[0].options[0].options[0].value;
                var warns = data.args[0].options[0].options[1].value;
                var timeSpan = data.args[0].options[0].options[2].value;
                var duration = data.args[0].options[0].options[3]?.value;
                var durationType = data.args[0].options[0].options[4]?.value;

                //FALLBACK
                if(!durationType) {
                    durationType = "minutes";
                }

                if(what === "tempban" || what === "tempmute") {
                    if(!duration) {
                        embedGen.error("**Temp Ban/Mute needs a duration specified.**",data.client,data.interaction)
                        return;
                    }

                    //CALC DURATION
                    var testDuration = duration;
                    switch(durationType) {
                        case "seconds":
                            testDuration *= 1000;
                            break;
                        case "minutes":
                            testDuration *= 60 * 1000;
                            break;
                        case "hours":
                            testDuration *= 60 * 60 * 1000;
                            break;
                        case "days":
                            testDuration *= 24 * 60 * 60 * 1000;
                            break;
                        default:
                            break;
                    }

                    if(testDuration > 30758400000) {
                        embedGen.error(`**You tried to create an trigger with a ban or mute duration of over an year. You know, thats pretty long. Maybe you should try banning or muting indefinitely instead!**`, data.client, data.interaction)
                        return;
                    }
                }

                //OTHER FALLBACK
                if(!duration) {
                    duration = 0;
                }

                //CREATE ACTION SET
                const action_set = {
                    "what": what,
                    "timespan": timeSpan,
                    "warns": warns,
                    "duration": duration,
                    "durationType": durationType
                }

                //DON'T ALLOW MORE THAN 4 SETS
                if(guildData.autoMod.actionSets.length > 5) {
                    embedGen.error("**You can only define 5 triggers!**",data.client,data.interaction)
                    return;
                }

                guildData.autoMod.actionSets.push(action_set);

                //SAVE GUILDDATA
                guildData.markModified("autoMod");
                guildData.save().catch(err => { console.log(err)});

                //SEND MESSAGE
                embedGen.custom("AUTOMOD TRIGGER","","Trigger created successfully! \nWhat to do: `" + what.toUpperCase() + "`\nWarns needed: `" + warns + "`\nTime span needed: `" + timeSpan + "`" + (duration ? "\nDuration: `" + duration + " " + durationType.toUpperCase() + "`" : ""),data.client, data.interaction);
                return;
            }

            //GET COMMAND
            if(subCommand === "get") {

                var embed = embedGen.custom("AUTOMOD TRIGGERS","","List of active triggers:");

                for(let i = 0; i < guildData.autoMod.actionSets.length; i++) {
                    let set = guildData.autoMod.actionSets[i];

                    embed.addField("ID: " + i + " | " + set.what.toUpperCase(), "Warns needed: `" + set.warns + "`\nTime span needed: `" + set.timespan + "`" + (set.duration == 0 ? "" : "\nDuration: `" + set.duration + " " + set.durationType.toUpperCase() + "`"))
                }

                //SEND
                APICalls.sendInteraction(data.client, {"content": "", "embeds": [embed]}, data.interaction)
            }

            //REMOVE COMMAND
            if(subCommand === "remove") {
                var trigger = data.args[0].options[0].options[0].value;

                if(!guildData.autoMod.actionSets[trigger]) {
                    embedGen.error("**Trigger not found! Use `/automod trigger get` to see all current triggers.**",data.client,data.interaction)
                    return;
                }

                guildData.autoMod.actionSets.splice(trigger, 1);

                //SAVE GUILDDATA
                guildData.markModified("autoMod");
                guildData.save().catch(err => { console.log(err)});

                //SEND MESSAGE
                embedGen.custom("AUTOMOD TRIGGERS","","**Trigger with ID `" + trigger + "` removed!**", data.client, data.interaction);
            }
        }
	}
};
