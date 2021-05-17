const db = require("../Database/db");
const emojiRegex = require('emoji-regex/RGI_Emoji.js');
const embedGen = require("../Utils/embedGenerator");
const configHandler = require('../Utils/configHandler.js');
const config = configHandler.getConfig();
const modAction = require("../Database/models/modAction");
const UserManagement = require("../Utils/UserManagement");
const utils = require('../Utils/utils.js');
/**
 * The AutoMod class for guildData
 */
module.exports = class AutoMod {
    /**
     * Creates a new AutoMod class
     *
     * @returns {AutoMod} The AutoMod class
     */
    constructor(){
        this.actionSets = [ /* ACTION_SET */ ];
        this.enabledRules = {
            blacklist:{
                enabled: false,
                action: "delete",
                whitelist: []
            },
            invite:{
                enabled: false,
                action: "delete",
                whitelist: []
            },
            links:{
                enabled: false,
                action: "delete",
                whitelist: []
            },
            caps:{
                enabled: false,
                action: "delete",
                whitelist: []
            },
            emotes:{
                enabled: false,
                action: "delete",
                whitelist: []
            },
            mentions:{
                enabled: false,
                action: "delete",
                whitelist: []
            },
            spam:{
                enabled: false,
                action: "delete",
                whitelist: []
            }
        }


    }

    /**
     * Loads a AutoMod class from an already existing object
     *
     * @param {object} obj AutoMod object
     * @returns {AutoMod} AutoMod class
     */
    static load(obj){
        let am = new this()
        am.actionSets = obj.actionSets;
        am.enabledRules = obj.enabledRules;
        return am;
    }

    /**
     * Handles incoming warns by the defined action set
     *
     * @param {object} guildData guildData object
     * @param {object} member member object
     */
    async handleWarn(client, guildData, member) {

        //GET GUILD
        var guild = client.guilds.resolve(guildData.guildID);

        if(!guild) {
            return;
        }

        //VAR CONSTANT VARS
        var reason = "AutoMod Violation. Too many warns!";

        //GO TROUGH RULES
        for(let action in this.actionSets) {
            action = this.actionSets[action];

            //GET VARS
            let minutes = action.timespan * 60 * 1000; //TIMESPAN IN MILLIES
            let what = action.what;
            let warns = action.warns;
            let duration = action.duration;
            let durationType = action.durationType;

            //GET DURATION IN MILLIES
            if(what === "tempmute" || what === "tempban") {
                switch(durationType) {
                    case "seconds":
                        duration *= 1000;
                        break;
                    case "minutes":
                        duration *= 60 * 1000;
                        break;
                    case "hours":
                        duration *= 60 * 60 * 1000;
                        break;
                    case "days":
                        duration *= 24 * 60 * 60 * 1000;
                        break;
                    default:
                        break;
                }
            }

            //GETTING X LAST MOD LOGS
            const docs = await modAction.find({
                guildID: guildData.guildID,
                userID: member.user.id,
                action: "warn",
                timestamp: {$gte: Date.now() - minutes}
            }).sort({timestamp:-1}).limit(warns).exec().catch(err => console.log(err));

            //IF NOT ENOUGH MOD LOGS => SKIP
            if(docs.length < warns) {
                continue;
            }

            //IF ENOUGH MOD LOGS => MAKE ACTION
            if(what === "mute") {
                if(!member.manageable) {
                    return;
                }
                UserManagement.muteUser(client, guildData, guild, member, client.user, reason);
            }

            if(what === "ban") {
                if(!member.bannable) {
                    return;
                }
                UserManagement.banUser(client, guild, guildData, member, client.user, reason);
            }

            if(what === "kick") {
                if(!member.kickable) {
                    return;
                }
                UserManagement.kickUser(client, guild, guildData, member, client.user, reason);
            }

            if(what === "tempmute") {
                if(!member.manageable) {
                    return;
                }
                UserManagement.tempMute(client, guildData, guild, member, client.user, reason, duration, function(desc){})
            }

            if(what === "tempban") {
                if(!member.bannable) {
                    return;
                }
                UserManagement.tempBan(client, guild, guildData, member, client.user, reason, duration, function(desc){})
            }
        }
    }

    /**
     * Handles incoming messages by the defined rules
     *
     * @param {object} guildData guildData object
     * @param {object} message message object
     */
    handleMessage(client, guildData, message, lastMessage) {
        var warned = false;

        //VARS
        var channel = message.channel;
        var member = message.member;

        //HANDLE RULES
        for(let rule in this.enabledRules) {
            const ruleSettings = this.enabledRules[rule];

            //IGNORE NOT ENABLED RULES
            if(!ruleSettings.enabled) {
                continue;
            }

            //SKIP RULE IF WHITELISTED
            if(ruleSettings.whitelist.includes(channel.id)) {
                continue;
            }

            //CHECK FOR RULE BREAK
            if(rule === "blacklist")
                if (!new RegExp(guildData.blacklist.join("|")).test(message.content.toLowerCase())) {
                    //BLACKLIST NOT VIOLATED
                    continue;
                }

            if(rule === "invite")
                if(!new RegExp("(https?://)?(www.)?(discord.(gg|io|me|li)|discordapp.com/invite)/[^\s/]+?(?=\b)").test(message.content)){
                    //INVITE NOT VIOLATED
                    continue;
                }

            if(rule === "links") {
                var matches = message.content.match(/(https?:\/\/[^\s]+)/g);
                var skip = true;

                for(let match in matches) {
                    match = matches[match];

                    //ALLOW DISCORD LINKS (USE INVITE BLOCKER FOR INVITES)
                    var checkDC = match.match(/(https?:\/\/)?(www.|cdn.)?(discord.(gg|io|me|li)|discordapp.com)\/[^\s/]+?(?=\b)/g);
                    if(!checkDC){
                        skip = false;
                        break;
                    }
                }
                if(skip)
                    continue;
            }

            //OLD LINK SYNTAX
            //if(!new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(message.content)) {}


            if(rule === "caps")
                if(!isMostlyUppercase(message.content)) {
                    //CAPS NOT VIOLATED
                    continue;
                }

            if(rule === "emotes") {
                var count = 0;

                //FETCH CUSTOM EMOTES
                var custom = message.content.match(/<a:.+?:\d+>|<:.+?:\d+>/g)?.length;
                if(custom) {
                    count += custom;
                }

                //FETCH NORMAL EMOTES
                const regex = emojiRegex();
                let match;
                while (match = regex.exec(message.content)) {
                    count++;
                }

                if(count < 10) {
                    //EMOTES NOT VIOLATED
                    continue;
                }
            }

            if(rule === "mentions") {
                var count = message.mentions.roles.array().length;
                count += message.mentions.members.array().length;

                if(count < 4) {
                    //MENTIONS NOT VIOLATED
                    continue;
                }
            }

            if(rule === "spam") {
                if(lastMessage) {
                    if(message.content != lastMessage.content) {
                        //SPAM NOT VIOLATED
                        continue;
                    } else {
                        if(message.createdTimestamp - lastMessage.createdTimestamp > 5 * 60 * 1000) { //IF MESSAGE SENT TWICE IN 5 MINUTES => SPAM
                            continue;
                        }
                    }
                } else {
                    continue;
                }
            }

            if(ruleSettings.action === "delete" || ruleSettings.action === "both") {
                //DELETE MESSAGE
                message.delete();
            }

            if(ruleSettings.action === "warn" || ruleSettings.action === "both") {
                //WARN USER
                db.addModerationData(channel.guild.id, member.id, client.user.id, "AutoMod Rule Violation: " + rule.toUpperCase(), "warn");
                warned = true;

                //SEND MESSAGE TO CHANNEL ABOUT WARN
                var embed = embedGen.custom("WARN",utils.getColor("moderation","WARN"),`**${member} you can't do that here!**` + "\nAutoMod Rule Violation: `" + rule.toUpperCase() + "`");
                message.channel.send(embed)
            }

            break;
        }

        //HANDLE USER AFTER INFRACTIONS
        if(warned) {
            this.handleWarn(client, guildData, message.member);
        }
    }
}

/*
    ACTION SET EXAMPLE
*/
const action_set = {
    "what": "ban/kick/mute/tempban/tempmute",
    "timespan": 30, //TIME MINUTES
    "warns": 4, //AMOUNT WARNS
    "duration": 30,
    "durationType": "minutes"
}

/*
    UTILS FUNCTIONS NOT NECESSARY FOR CLASS
*/

/**
     * Checks if string is mostly capitalized
     *
     * @param {string} text test
     * @returns {boolean} mostlyUppercase boolean
     */
function isMostlyUppercase(string) {
    //REMOVE EMOJIS FIRST
    const regex = emojiRegex();
    let match;
    while (match = regex.exec(string)) {
        string = string.replace(match,"");
    }

    //TOTAL COUNT
    var total = string.length;
    var uppercase = 0;

    for(let i = 0; i < string.length; i++) {
        character = string.charAt(i);

        //NUMBER
        if (!isNaN(character * 1)){
            //total -= 1; //REMOVE 1 FROM TOTAL
            continue
        }

        //IS UPPER CASE? IF YES => INCREASE
        if (character == character.toUpperCase()) {
            uppercase++;
        }
    }

    //MATH
    var percent = (uppercase / total) * 100;

    if(percent >= 70) {
        return true;
    }
    return false;
}